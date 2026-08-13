const ADMIN_UID = "7ba1fad4-d113-4526-8873-3e3b97e9be7e";
const ADMIN_FEEDBACK_BUCKET = "community-feedback";
const adminFeedbackClient = window.adminSupabase;
const adminLists = {
    bug: document.getElementById("admin-bugs-list"),
    idea: document.getElementById("admin-ideas-list")
};
const statusesByType = {
    bug: ["OFFEN", "IN BEARBEITUNG", "ERLEDIGT"],
    idea: ["IN ENTSCHEIDUNG", "ANGENOMMEN", "ABGELEHNT"]
};

function appendText(parent, tagName, className, value) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    element.textContent = value;
    parent.append(element);
    return element;
}

function feedbackLabel(entry) {
    return `${entry.type === "bug" ? "BUG" : "IDEE"}-${String(entry.id).padStart(4, "0")}`;
}

function statusSelect(entry) {
    const select = document.createElement("select");
    select.className = "admin-feedback-status";
    statusesByType[entry.type].forEach((status) => {
        const option = document.createElement("option");
        option.value = status;
        option.textContent = status;
        option.selected = status === entry.status;
        select.append(option);
    });
    select.addEventListener("change", () => updateStatus(entry.id, entry.type, select));
    return select;
}

function buildEntry(entry) {
    const card = document.createElement("article");
    card.className = "card admin-card admin-feedback-card";
    appendText(card, "span", "admin-feedback-id", `${feedbackLabel(entry)} · ${entry.category}`);
    appendText(card, "h4", "", entry.title);
    appendText(card, "p", "", entry.description);
    appendText(card, "small", "", `von ${entry.player_name} · ${new Date(entry.created_at).toLocaleString("de-DE")}`);

    if (entry.screenshot_path) {
        const screenshot = document.createElement("img");
        screenshot.className = "admin-feedback-image";
        screenshot.src = adminFeedbackClient.storage.from(ADMIN_FEEDBACK_BUCKET).getPublicUrl(entry.screenshot_path).data.publicUrl;
        screenshot.alt = `Screenshot zu ${entry.title}`;
        card.append(screenshot);
    }

    const actions = document.createElement("div");
    actions.className = "admin-actions admin-feedback-actions";
    actions.append(statusSelect(entry));
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "btn admin-feedback-delete";
    deleteButton.textContent = "LÖSCHEN";
    deleteButton.addEventListener("click", () => deleteFeedback(entry));
    actions.append(deleteButton);
    card.append(actions);
    return card;
}

async function loadFeedback(type) {
    const list = adminLists[type];
    list.replaceChildren();
    const { data, error } = await adminFeedbackClient
        .from("community_feedback")
        .select("id,type,player_name,category,title,description,status,screenshot_path,created_at")
        .eq("type", type)
        .order("created_at", { ascending: false });
    if (error) {
        appendText(list, "p", "admin-feedback-empty", "Einträge können gerade nicht geladen werden.");
        return;
    }
    if (!data.length) {
        appendText(list, "p", "admin-feedback-empty", type === "bug" ? "Keine Bugs vorhanden." : "Keine Ideen vorhanden.");
        return;
    }
    data.forEach((entry) => list.append(buildEntry(entry)));
}

async function updateStatus(id, type, select) {
    select.disabled = true;
    const { error } = await adminFeedbackClient
        .from("community_feedback")
        .update({ status: select.value })
        .eq("id", id);
    if (error) alert("Status konnte nicht gespeichert werden.");
    await loadFeedback(type);
}

async function deleteFeedback(entry) {
    if (!confirm(`${feedbackLabel(entry)} wirklich löschen?`)) return;
    if (entry.screenshot_path) {
        const { error: storageError } = await adminFeedbackClient.storage
            .from(ADMIN_FEEDBACK_BUCKET)
            .remove([entry.screenshot_path]);
        if (storageError) {
            alert("Screenshot konnte nicht gelöscht werden. Der Eintrag bleibt erhalten.");
            return;
        }
    }
    const { error } = await adminFeedbackClient
        .from("community_feedback")
        .delete()
        .eq("id", entry.id);
    if (error) {
        alert("Eintrag konnte nicht gelöscht werden.");
        return;
    }
    await loadFeedback(entry.type);
}

(async () => {
    const { data: { session } } = await adminFeedbackClient.auth.getSession();
    if (!session || session.user.id !== ADMIN_UID) {
        window.location.href = "index.html";
        return;
    }
    await Promise.all([loadFeedback("bug"), loadFeedback("idea")]);
})();
