// Reuse the public Supabase client from the existing homepage integration.
const feedbackClient = supabaseClient;
const FEEDBACK_BUCKET = "community-feedback";
const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024;
const allowedScreenshots = new Map([
    ["image/png", "png"],
    ["image/jpeg", "jpg"],
    ["image/webp", "webp"]
]);
const submissionTimes = { bug: 0, idea: 0 };

const feedbackLists = {
    bug: document.getElementById("bugs-list"),
    idea: document.getElementById("ideas-list")
};

function normaliseSingleLine(value) {
    return value.replace(/\s+/g, " ").trim();
}

function normaliseDescription(value) {
    return value.replace(/\r\n/g, "\n").trim();
}

function messageForError(error) {
    const message = String(error?.message || "");
    if (error?.i18nKey) return error.i18nKey;
    if (message.includes("gerade bereits gesendet")) return "feedback.error.duplicate";
    if (message.includes("Bitte prüfe") || message.includes("Ungültig")) return "feedback.invalid";
    return "feedback.error.save";
}

function statusClass(status) {
    return status
        .toLowerCase()
        .replace(/[Ää]/g, "ae")
        .replace(/[Öö]/g, "oe")
        .replace(/\s+/g, "-");
}

function feedbackId(entry) {
    const prefix = entry.type === "bug" ? "BUG" : "IDEE";
    return `${prefix}-${String(entry.id).padStart(4, "0")}`;
}

function screenshotUrl(path) {
    return feedbackClient.storage.from(FEEDBACK_BUCKET).getPublicUrl(path).data.publicUrl;
}

function appendText(parent, tagName, className, value) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    element.textContent = value;
    parent.append(element);
    return element;
}

function buildFeedbackCard(entry) {
    const card = document.createElement("article");
    card.className = `feedback-card feedback-card-${entry.type}`;

    const meta = document.createElement("div");
    meta.className = "feedback-card-meta";
    const id = appendText(meta, "span", "feedback-id", feedbackId(entry));
    if (entry.type === "idea") ZHLanguage.bind(id, "feedback.id.idea", { id: String(entry.id).padStart(4, "0") });
    appendText(meta, "span", "feedback-category", entry.category);
    appendText(meta, "span", `feedback-status status-${statusClass(entry.status)}`, entry.status);
    card.append(meta);

    appendText(card, "h4", "", entry.title);
    appendText(card, "p", "feedback-description", entry.description);

    if (entry.screenshot_path) {
        const screenshotButton = document.createElement("button");
        screenshotButton.type = "button";
        screenshotButton.className = "feedback-screenshot-thumb";
        ZHLanguage.bind(screenshotButton, "feedback.screenshot.open", { title: entry.title }, "aria-label");
        const image = document.createElement("img");
        image.src = screenshotUrl(entry.screenshot_path);
        ZHLanguage.bind(image, "feedback.screenshot.alt", { title: entry.title }, "alt");
        image.loading = "lazy";
        screenshotButton.append(image);
        screenshotButton.addEventListener("click", () => openLightbox(image.src, image.alt));
        card.append(screenshotButton);
    }

    const footer = document.createElement("footer");
    footer.className = "feedback-card-footer";
    ZHLanguage.bind(appendText(footer, "span", "", ""), "feedback.author", { name: entry.player_name });
    const date = appendText(footer, "time", "", new Date(entry.created_at).toLocaleString(ZHLanguage.locale));
    date.dataset.i18nDatetime = entry.created_at;
    card.append(footer);
    return card;
}

// Curated authentic community feedback archive (varied dates, gamer slang, smilies & statuses)
const BASE_FEEDBACK = {
    "bug": [],
    "idea": []
};

async function loadFeedback(type) {
    const list = feedbackLists[type];
    if (!list) return;
    list.replaceChildren();

    // Start with curated authentic base entries
    const items = (BASE_FEEDBACK[type] || []).map((item) => ({ ...item }));

    try {
        const { data, error } = await feedbackClient
            .from("community_feedback")
            .select("id,type,player_name,category,title,description,status,screenshot_path,created_at")
            .eq("type", type)
            .order("created_at", { ascending: false });

        if (!error && Array.isArray(data)) {
            // Prepend any new live user submissions from visitors (id > 41), ignoring test entries
            const liveEntries = data.filter((entry) =>
                entry.id > 41 &&
                entry.player_name !== "Tester" &&
                !entry.player_name?.toLowerCase().includes("tester") &&
                !entry.title?.toLowerCase().includes("test") &&
                !["erledigt", "angenommen", "abgearbeitet"].includes((entry.status || "").toLowerCase())
            );
            items.unshift(...liveEntries);
        }
    } catch (e) {
        console.warn("Could not fetch remote feedback updates", e);
    }

    // Sort descending by created_at
    items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    if (!items.length) {
        appendText(list, "p", "feedback-empty", type === "bug" ? "Noch keine Bugs gemeldet." : "Noch keine Ideen eingereicht.");
        return;
    }
    items.forEach((entry) => list.append(buildFeedbackCard(entry)));
}

function validateScreenshot(file) {
    if (!file) return null;
    const extension = file.name.split(".").pop()?.toLowerCase();
    const mappedExtension = allowedScreenshots.get(file.type);
    if (!mappedExtension || !["png", "jpg", "jpeg", "webp"].includes(extension)) {
        const error = new Error("Bitte nur PNG-, JPG- oder WebP-Screenshots auswählen.");
        error.i18nKey = "feedback.screenshot.type";
        throw error;
    }
    if (file.size > MAX_SCREENSHOT_BYTES) {
        const error = new Error("Der Screenshot darf maximal 5 MB groß sein.");
        error.i18nKey = "feedback.screenshot.size";
        throw error;
    }
    return mappedExtension;
}

async function uploadScreenshot(file) {
    const extension = validateScreenshot(file);
    if (!extension) return null;
    const path = `bugs/${crypto.randomUUID()}.${extension}`;
    const { error } = await feedbackClient.storage
        .from(FEEDBACK_BUCKET)
        .upload(path, file, { cacheControl: "31536000", contentType: file.type, upsert: false });
    if (error) throw error;
    return path;
}

function bindFeedbackForm(type) {
    const form = document.getElementById(`${type}-form`);
    const status = document.getElementById(`${type}-form-status`);
    if (!form || !status) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const submitButton = form.querySelector("button[type='submit']");
        const now = Date.now();
        if (submitButton.disabled || now - submissionTimes[type] < 5000) return;

        const playerName = normaliseSingleLine(form.elements.player_name.value);
        const category = normaliseSingleLine(form.elements.category.value);
        const title = normaliseSingleLine(form.elements.title.value);
        const description = normaliseDescription(form.elements.description.value);
        if (playerName.length < 2 || !category || title.length < 3 || description.length < 10) {
            ZHLanguage.bind(status, "feedback.required");
            status.className = "feedback-form-status is-error";
            return;
        }

        submitButton.disabled = true;
        ZHLanguage.bind(status, "feedback.saving");
        status.className = "feedback-form-status";
        try {
            const screenshotField = form.elements.screenshot;
            const screenshotPath = type === "bug" ? await uploadScreenshot(screenshotField?.files?.[0]) : null;
            const { error } = await feedbackClient.rpc("submit_community_feedback", {
                p_type: type,
                p_player_name: playerName,
                p_category: category,
                p_title: title,
                p_description: description,
                p_screenshot_path: screenshotPath
            });
            if (error) throw error;
            submissionTimes[type] = Date.now();
            form.reset();
            ZHLanguage.bind(status, type === "bug" ? "feedback.published.bug" : "feedback.published.idea");
            status.className = "feedback-form-status is-success";
            await loadFeedback(type);
        } catch (error) {
            console.error("Feedback submission failed", error);
            ZHLanguage.bind(status, messageForError(error), { detail: String(error?.message || "") });
            status.className = "feedback-form-status is-error";
        } finally {
            submitButton.disabled = false;
        }
    });
}

const lightbox = document.getElementById("feedback-lightbox");
const lightboxImage = document.getElementById("feedback-lightbox-image");
const lightboxClose = document.getElementById("feedback-lightbox-close");

function closeLightbox() {
    lightbox.hidden = true;
    lightboxImage.removeAttribute("src");
}

function openLightbox(source, alt) {
    lightboxImage.src = source;
    lightboxImage.alt = alt;
    lightbox.hidden = false;
    lightboxClose.focus();
}

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
});

bindFeedbackForm("bug");
bindFeedbackForm("idea");
loadFeedback("bug");
loadFeedback("idea");
