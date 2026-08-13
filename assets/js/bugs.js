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
    if (message.includes("gerade bereits gesendet")) return "Dieser Eintrag wurde gerade bereits gesendet.";
    if (message.includes("Bitte prüfe") || message.includes("Ungültig")) return message;
    return "Die Meldung konnte gerade nicht gespeichert werden. Bitte versuche es erneut.";
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
    appendText(meta, "span", "feedback-id", feedbackId(entry));
    appendText(meta, "span", "feedback-category", entry.category);
    appendText(meta, "span", `feedback-status status-${statusClass(entry.status)}`, entry.status);
    card.append(meta);

    appendText(card, "h4", "", entry.title);
    appendText(card, "p", "feedback-description", entry.description);

    if (entry.screenshot_path) {
        const screenshotButton = document.createElement("button");
        screenshotButton.type = "button";
        screenshotButton.className = "feedback-screenshot-thumb";
        screenshotButton.setAttribute("aria-label", `Screenshot zu ${entry.title} vergrößern`);
        const image = document.createElement("img");
        image.src = screenshotUrl(entry.screenshot_path);
        image.alt = `Screenshot zu ${entry.title}`;
        image.loading = "lazy";
        screenshotButton.append(image);
        screenshotButton.addEventListener("click", () => openLightbox(image.src, image.alt));
        card.append(screenshotButton);
    }

    const footer = document.createElement("footer");
    footer.className = "feedback-card-footer";
    appendText(footer, "span", "", `von ${entry.player_name}`);
    appendText(footer, "time", "", new Date(entry.created_at).toLocaleString("de-DE"));
    card.append(footer);
    return card;
}

async function loadFeedback(type) {
    const list = feedbackLists[type];
    if (!list) return;
    list.replaceChildren();
    const { data, error } = await feedbackClient
        .from("community_feedback")
        .select("id,type,player_name,category,title,description,status,screenshot_path,created_at")
        .eq("type", type)
        .order("created_at", { ascending: false });

    if (error) {
        appendText(list, "p", "feedback-empty", "Einträge können gerade nicht geladen werden.");
        return;
    }
    if (!data.length) {
        appendText(list, "p", "feedback-empty", type === "bug" ? "Noch keine Bugs gemeldet." : "Noch keine Ideen eingereicht.");
        return;
    }
    data.forEach((entry) => list.append(buildFeedbackCard(entry)));
}

function validateScreenshot(file) {
    if (!file) return null;
    const extension = file.name.split(".").pop()?.toLowerCase();
    const mappedExtension = allowedScreenshots.get(file.type);
    if (!mappedExtension || !["png", "jpg", "jpeg", "webp"].includes(extension)) {
        throw new Error("Bitte nur PNG-, JPG- oder WebP-Screenshots auswählen.");
    }
    if (file.size > MAX_SCREENSHOT_BYTES) {
        throw new Error("Der Screenshot darf maximal 5 MB groß sein.");
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
            status.textContent = "Bitte fülle alle Pflichtfelder vollständig aus.";
            status.className = "feedback-form-status is-error";
            return;
        }

        submitButton.disabled = true;
        status.textContent = "Wird gespeichert …";
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
            status.textContent = type === "bug" ? "Bug wurde veröffentlicht." : "Idee wurde veröffentlicht.";
            status.className = "feedback-form-status is-success";
            await loadFeedback(type);
        } catch (error) {
            console.error("Feedback submission failed", error);
            status.textContent = messageForError(error);
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
