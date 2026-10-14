const adminGalleryClient = window.adminSupabase;
const GALLERY_BUCKET = "gallery";
// Only objects of this project's public gallery bucket are ever deleted.
const GALLERY_PUBLIC_PREFIX = `${SUPABASE_URL}/storage/v1/object/public/${GALLERY_BUCKET}/`;

const galleryLists = {
    pending: document.getElementById("galleryPending"),
    approved: document.getElementById("galleryApproved")
};
const galleryCounts = {
    pending: document.getElementById("galleryPendingCount"),
    approved: document.getElementById("galleryApprovedCount")
};
const galleryStatus = document.getElementById("galleryAdminStatus");
let galleryBusy = false;

function appendText(parent, tagName, className, value) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    element.textContent = value;
    parent.append(element);
    return element;
}

function setGalleryStatus(message, isError = false) {
    galleryStatus.textContent = message;
    galleryStatus.classList.toggle("is-error", isError);
}

// Returns the flat object name inside the gallery bucket, or null if the URL is
// not unambiguously one of our own gallery objects.
function galleryObjectPath(imageUrl) {
    if (typeof imageUrl !== "string" || !imageUrl.startsWith(GALLERY_PUBLIC_PREFIX)) return null;
    const encoded = imageUrl.slice(GALLERY_PUBLIC_PREFIX.length);
    if (!encoded || /[?#]/.test(encoded)) return null;
    let path;
    try { path = decodeURIComponent(encoded); }
    catch (_) { return null; }
    if (!path || path === "." || path === ".." || /[\/\\\u0000-\u001f]/.test(path)) return null;
    return path;
}

function entryLabel(entry) {
    return `#${entry.id} von ${entry.uploader || "Unbekannt"}`;
}

function actionButton(label, className, handler) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `btn ${className}`;
    button.textContent = label;
    button.addEventListener("click", handler);
    return button;
}

function buildGalleryCard(entry) {
    const path = galleryObjectPath(entry.image_url);
    const card = document.createElement("article");
    card.className = "card admin-card admin-gallery-card";

    const media = document.createElement("div");
    media.className = "admin-gallery-media";
    if (path) {
        const link = document.createElement("a");
        link.href = entry.image_url;
        link.target = "_blank";
        link.rel = "noopener";
        const image = document.createElement("img");
        image.src = entry.image_url;
        image.loading = "lazy";
        image.alt = entry.description ? `Screenshot: ${entry.description}` : `Screenshot ${entryLabel(entry)}`;
        link.append(image);
        media.append(link);
    } else {
        // Foreign or unknown URLs are neither loaded nor deleted from storage.
        appendText(media, "p", "admin-gallery-warning", "Bild-URL gehört nicht zum eigenen Galerie-Speicher und wird nicht geladen.");
    }
    card.append(media);

    const body = document.createElement("div");
    body.className = "admin-gallery-body";
    appendText(body, "span", "admin-feedback-id", `#${entry.id} · ${entry.approved ? "FREIGEGEBEN" : "OFFEN"}`);
    appendText(body, "h4", "", entry.uploader || "Unbekannt");
    if (entry.description) appendText(body, "p", "", entry.description);
    appendText(body, "small", "", new Date(entry.created_at).toLocaleString("de-DE"));
    card.append(body);

    const actions = document.createElement("div");
    actions.className = "admin-actions admin-gallery-actions";
    if (entry.approved) {
        actions.append(actionButton("Zurückziehen", "admin-gallery-withdraw", () => setApproved(entry, false)));
    } else {
        actions.append(actionButton("Freigeben", "admin-gallery-approve", () => setApproved(entry, true)));
    }
    actions.append(actionButton("Endgültig löschen", "admin-feedback-delete", () => deleteGalleryEntry(entry)));
    card.append(actions);
    return card;
}

function renderGalleryList(key, entries) {
    const list = galleryLists[key];
    list.replaceChildren();
    galleryCounts[key].textContent = `(${entries.length})`;
    if (!entries.length) {
        appendText(list, "p", "admin-feedback-empty", key === "pending" ? "Keine offenen Uploads." : "Keine freigegebenen Screenshots.");
        return;
    }
    entries.forEach((entry) => list.append(buildGalleryCard(entry)));
}

async function loadGallery() {
    if (!await window.ZHAdminAccess.require(adminGalleryClient)) return;
    const { data, error } = await adminGalleryClient
        .from("gallery")
        .select("id,image_url,uploader,description,approved,created_at")
        .order("created_at", { ascending: false });
    if (error || !Array.isArray(data)) {
        Object.values(galleryLists).forEach((list) => list.replaceChildren());
        setGalleryStatus("Galerieeinträge können gerade nicht geladen werden.", true);
        return;
    }
    renderGalleryList("pending", data.filter((entry) => !entry.approved));
    renderGalleryList("approved", data.filter((entry) => entry.approved));
}

async function runGalleryAction(action) {
    if (galleryBusy) return;
    galleryBusy = true;
    document.querySelectorAll(".admin-gallery-actions .btn").forEach((button) => { button.disabled = true; });
    try {
        if (!await window.ZHAdminAccess.require(adminGalleryClient)) return;
        await action();
    } catch (_) {
        setGalleryStatus("Die Aktion konnte nicht abgeschlossen werden. Bitte Seite neu laden und erneut prüfen.", true);
    } finally {
        galleryBusy = false;
        await loadGallery();
    }
}

function setApproved(entry, approved) {
    return runGalleryAction(async () => {
        const { data, error } = await adminGalleryClient
            .from("gallery")
            .update({ approved })
            .eq("id", entry.id)
            .select("id,approved");
        if (error || data?.length !== 1 || data[0].approved !== approved) {
            setGalleryStatus(`${entryLabel(entry)} konnte nicht ${approved ? "freigegeben" : "zurückgezogen"} werden.`, true);
            return;
        }
        setGalleryStatus(`${entryLabel(entry)} wurde ${approved ? "freigegeben" : "zurückgezogen und ist nicht mehr öffentlich"}.`);
    });
}

async function galleryObjectExists(path) {
    const { data, error } = await adminGalleryClient.storage
        .from(GALLERY_BUCKET)
        .list("", { search: path, limit: 100 });
    if (error || !Array.isArray(data)) throw new Error("gallery.storage.listFailed");
    return data.some((object) => object.name === path);
}

async function deleteGalleryRow(entry) {
    const { data, error } = await adminGalleryClient
        .from("gallery")
        .delete()
        .eq("id", entry.id)
        .select("id");
    return !error && data?.length === 1;
}

function deleteGalleryEntry(entry) {
    return runGalleryAction(async () => {
        const path = galleryObjectPath(entry.image_url);
        if (!path) {
            if (!confirm(`${entryLabel(entry)}: Die Bild-URL gehört nicht zum eigenen Galerie-Speicher. Es wird keine Datei gelöscht, nur der Galerieeintrag. Fortfahren?`)) return;
            if (await deleteGalleryRow(entry)) setGalleryStatus(`${entryLabel(entry)} wurde gelöscht (keine eigene Bilddatei vorhanden).`);
            else setGalleryStatus(`${entryLabel(entry)} konnte nicht gelöscht werden.`, true);
            return;
        }

        let exists;
        try { exists = await galleryObjectExists(path); }
        catch (_) {
            setGalleryStatus(`Bilddatei von ${entryLabel(entry)} konnte nicht geprüft werden. Nichts wurde gelöscht.`, true);
            return;
        }

        if (exists) {
            if (!confirm(`${entryLabel(entry)} endgültig löschen?\n\nBilddatei und Galerieeintrag werden dauerhaft entfernt.`)) return;
            const { data, error } = await adminGalleryClient.storage.from(GALLERY_BUCKET).remove([path]);
            // remove() reports a denied or missing object as an empty list, not as an error.
            const removed = !error && Array.isArray(data) && data.some((object) => object.name === path);
            if (!removed || await galleryObjectExists(path)) {
                setGalleryStatus(`Bilddatei von ${entryLabel(entry)} konnte nicht gelöscht werden. Der Galerieeintrag bleibt erhalten.`, true);
                return;
            }
        } else if (!confirm(`${entryLabel(entry)}: Die Bilddatei ist im Galerie-Speicher nicht (mehr) vorhanden. Nur den Galerieeintrag löschen?`)) {
            return;
        }

        if (!await deleteGalleryRow(entry)) {
            setGalleryStatus(`Die Bilddatei von ${entryLabel(entry)} wurde gelöscht, der Galerieeintrag aber nicht. Bitte „Endgültig löschen“ erneut ausführen.`, true);
            return;
        }
        setGalleryStatus(`${entryLabel(entry)} wurde endgültig gelöscht (Bilddatei und Galerieeintrag).`);
    });
}

(async () => {
    if (!await window.ZHAdminAccess.require(adminGalleryClient)) return;
    await loadGallery();
})();
