const galleryGrid = document.getElementById("galleryGrid");
const galleryCount = document.getElementById("galleryCount");
const uploadForm = document.getElementById("uploadForm");
const uploadStatus = document.getElementById("uploadStatus");
const uploadToggle = document.getElementById("galleryUploadToggle");
const uploadPanel = document.getElementById("galleryUploadPanel");
const galleryImageField = document.getElementById("image");
const galleryChooseFile = document.getElementById("galleryChooseFile");
const galleryFileName = document.getElementById("galleryFileName");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const closeLightbox = document.getElementById("closeLightbox");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
const GALLERY_MAX_BYTES = 5 * 1024 * 1024;
const GALLERY_IMAGE_TYPES = new Map([
    ["image/png", "png"],
    ["image/jpeg", "jpg"],
    ["image/webp", "webp"]
]);
// Browser-local bookmarks only; they are not votes and are never sent anywhere.
const STORAGE_LIKES_KEY = "zh_gallery_likes_v1";
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let galleryEntries = [];
let lightboxIndex = -1;
let galleryImageTrigger = null;

function updateGalleryFileName() {
        const file = galleryImageField.files[0];
        ZHLanguage.bind(galleryFileName, file ? "gallery.file.selected" : "gallery.file.empty", { name: file?.name || "" });
    }

    galleryChooseFile.addEventListener("click", () => galleryImageField.click());
    galleryImageField.addEventListener("change", updateGalleryFileName);
    updateGalleryFileName();

    // The shared header overlaps the page top only while it is fixed (wide screens);
    // on small screens it sits in the normal flow and needs no extra hero space.
    const siteHeader = document.querySelector(".zh-site-header");
    function syncHeaderHeight() {
        if (!siteHeader) return;
        const overlaps = ["fixed", "absolute"].includes(getComputedStyle(siteHeader).position);
        document.documentElement.style.setProperty("--zh-header-height", `${overlaps ? siteHeader.offsetHeight : 0}px`);
    }
    syncHeaderHeight();
    window.addEventListener("resize", syncHeaderHeight);
    if (siteHeader && "ResizeObserver" in window) new ResizeObserver(syncHeaderHeight).observe(siteHeader);

    function setUploadPanel(open) {
        uploadPanel.hidden = !open;
        uploadToggle.setAttribute("aria-expanded", String(open));
        ZHLanguage.bind(uploadToggle, open ? "gallery.upload.toggleClose" : "gallery.upload.toggleOpen");
    }

    function focusUploadForm() {
        const field = [...uploadForm.querySelectorAll("input:not([type=file]), textarea")]
            .find((element) => !element.hidden && element.offsetParent !== null);
        (field || galleryChooseFile).focus({ preventScroll: true });
    }

    uploadToggle.addEventListener("click", () => {
        const open = uploadPanel.hidden;
        setUploadPanel(open);
        if (open) focusUploadForm();
    });
    document.querySelectorAll("[data-gallery-upload-link]").forEach((link) => link.addEventListener("click", (event) => {
        event.preventDefault();
        setUploadPanel(true);
        document.getElementById("upload").scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
        focusUploadForm();
    }));
    setUploadPanel(location.hash === "#upload");
    window.addEventListener("hashchange", () => { if (location.hash === "#upload") setUploadPanel(true); });

    function getGalleryLikes() {
        try {
            const raw = localStorage.getItem(STORAGE_LIKES_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (e) { return {}; }
    }

    function saveGalleryLikes(likes) {
        try { localStorage.setItem(STORAGE_LIKES_KEY, JSON.stringify(likes)); } catch (e) {}
    }

    function updateSaveButton(button, saved) {
        const key = saved ? "gallery.like.remove" : "gallery.like.add";
        ZHLanguage.bind(button, key, {}, "aria-label");
        ZHLanguage.bind(button, key, {}, "title");
        button.setAttribute("aria-pressed", String(saved));
        button.classList.toggle("is-saved", saved);
        button.querySelector("i").className = saved ? "fa-solid fa-heart" : "fa-regular fa-heart";
    }

    function toggleSaved(id, button) {
        const likes = getGalleryLikes();
        const saved = !likes[id];
        if (saved) likes[id] = true;
        else delete likes[id];
        saveGalleryLikes(likes);
        updateSaveButton(button, saved);
    }

    function bindImageText(image, entry) {
        const params = { description: entry.description || "" };
        ZHLanguage.bind(image, entry.description ? "gallery.image.userAlt" : "gallery.image.defaultAlt", params, "alt");
    }

    function galleryNotice(key) {
        const item = document.createElement("li");
        item.className = "zh-gallery-notice";
        item.setAttribute("role", "status");
        galleryGrid.append(item);
        ZHLanguage.bind(item, key);
    }

    function buildGalleryItem(entry, index, likes) {
        const item = document.createElement("li");
        item.className = "zh-gallery-item";
        const card = document.createElement("article");
        card.className = "zh-gallery-card";

        const open = document.createElement("button");
        open.type = "button";
        open.className = "zh-gallery-open";
        ZHLanguage.bind(open, entry.description ? "gallery.image.open" : "gallery.image.openUnnamed", { description: entry.description || "" }, "aria-label");
        const image = document.createElement("img");
        image.src = entry.image_url;
        image.decoding = "async";
        image.loading = index < 3 ? "eager" : "lazy";
        image.setAttribute("data-i18n-ignore", "");
        bindImageText(image, entry);
        image.addEventListener("error", () => item.classList.add("is-broken"), { once: true });
        open.append(image);
        open.addEventListener("click", () => openGalleryImage(index, open));
        card.append(open);

        const meta = document.createElement("div");
        meta.className = "zh-gallery-meta";
        const text = document.createElement("div");
        text.className = "zh-gallery-text";
        if (entry.description) {
            const title = document.createElement("p");
            title.className = "zh-gallery-title";
            title.setAttribute("data-i18n-ignore", "");
            title.textContent = entry.description;
            text.append(title);
        }
        const byline = document.createElement("p");
        byline.className = "zh-gallery-byline";
        const author = document.createElement("span");
        ZHLanguage.bind(author, "gallery.by", { name: entry.uploader || "—" });
        byline.append(author);
        const created = new Date(entry.created_at);
        if (Number.isFinite(created.getTime())) {
            const time = document.createElement("time");
            time.dateTime = entry.created_at;
            time.setAttribute("data-i18n-date", entry.created_at);
            time.textContent = created.toLocaleDateString(ZHLanguage.locale);
            byline.append(time);
        }
        text.append(byline);
        meta.append(text);

        const save = document.createElement("button");
        save.type = "button";
        save.className = "zh-gallery-save";
        save.innerHTML = '<i aria-hidden="true"></i>';
        updateSaveButton(save, Boolean(likes[entry.id]));
        save.addEventListener("click", () => toggleSaved(entry.id, save));
        meta.append(save);

        card.append(meta);
        item.append(card);
        return item;
    }

    function renderGallery() {
        galleryGrid.replaceChildren();
        galleryGrid.setAttribute("aria-busy", "false");
        const total = galleryEntries.length;
        galleryGrid.classList.toggle("is-few", total > 0 && total < 3);
        if (total) ZHLanguage.bind(galleryCount, total === 1 ? "gallery.count.one" : "gallery.count", { count: total });
        else galleryCount.textContent = "";
        if (!total) {
            galleryNotice("gallery.empty");
            return;
        }
        const likes = getGalleryLikes();
        galleryEntries.forEach((entry, index) => galleryGrid.append(buildGalleryItem(entry, index, likes)));
    }

    async function loadGallery() {
        try {
            // Only approved entries belong to the public grid, also for signed-in admins.
            const result = await supabaseClient
                .from("gallery")
                .select("id,image_url,uploader,description,created_at")
                .eq("approved", true)
                .order("created_at", { ascending: false });
            if (result.error) throw result.error;
            if (!Array.isArray(result.data)) throw new Error("Invalid gallery response");
            galleryEntries = result.data.filter((entry) => !!safeGalleryImageUrl(entry.image_url));
        } catch (error) {
            console.error(error);
            galleryGrid.replaceChildren();
            galleryGrid.setAttribute("aria-busy", "false");
            galleryCount.textContent = "";
            galleryNotice("gallery.load.failed");
            return;
        }
        renderGallery();
        // The browser jumps to #upload before the grid has its final height.
        if (location.hash === "#upload") document.getElementById("upload").scrollIntoView({ block: "start", behavior: "instant" });
    }

    function renderLightbox() {
        const entry = galleryEntries[lightboxIndex];
        if (!entry) return;
        lightboxImage.src = entry.image_url;
        bindImageText(lightboxImage, entry);
        const text = document.createElement("span");
        text.textContent = [entry.description, entry.uploader].filter(Boolean).join(" · ");
        const position = document.createElement("span");
        position.className = "zh-gallery-lightbox-position";
        ZHLanguage.bind(position, "gallery.lightbox.position", { current: lightboxIndex + 1, total: galleryEntries.length });
        lightboxCaption.replaceChildren(text, position);
        const several = galleryEntries.length > 1;
        lightboxPrev.hidden = !several;
        lightboxNext.hidden = !several;
    }

    function openGalleryImage(index, trigger) {
        lightboxIndex = index;
        galleryImageTrigger = trigger;
        renderLightbox();
        lightbox.hidden = false;
        document.documentElement.classList.add("zh-gallery-lightbox-open");
        closeLightbox.focus();
    }

    function stepGalleryImage(step) {
        if (galleryEntries.length < 2 || lightbox.hidden) return;
        lightboxIndex = (lightboxIndex + step + galleryEntries.length) % galleryEntries.length;
        renderLightbox();
    }

    function closeGalleryImage() {
        if (lightbox.hidden) return;
        lightbox.hidden = true;
        lightboxImage.removeAttribute("src");
        document.documentElement.classList.remove("zh-gallery-lightbox-open");
        // Return focus to the card that is now current, so arrow navigation stays traceable.
        const current = galleryGrid.querySelectorAll(".zh-gallery-open")[lightboxIndex];
        (current || galleryImageTrigger)?.focus();
    }

    uploadForm.addEventListener("submit", async (e) => {

        e.preventDefault();
        if (uploadForm.dataset.identityBusy === "true") return;
        uploadForm.dataset.identityBusy = "true";
        window.ZHIdentity.syncForms();
        let stage = "identity";
        try {
        const file = galleryImageField.files[0];
        let principal;
        try { principal = await window.ZHIdentity.forSubmission(); }
        catch (error) { ZHLanguage.bind(uploadStatus, window.ZHIdentity.errorKey(error, "identity.unavailable")); return; }
        const uploader = principal.status === "member" ? principal.displayName : document.getElementById("uploader").value;
        const description = document.getElementById("description").value;
        if (!uploader.trim()) {
            ZHLanguage.bind(uploadStatus, "gallery.upload.nameRequired");
            document.getElementById("uploader").focus();
            return;
        }
        if (!file) {
            ZHLanguage.bind(uploadStatus, "gallery.upload.fileRequired");
            galleryChooseFile.focus();
            return;
        }
        // Mirrors the gallery bucket limits and storage name policy.
        const extension = GALLERY_IMAGE_TYPES.get(file.type);
        if (!extension || file.size > GALLERY_MAX_BYTES) {
            ZHLanguage.bind(uploadStatus, "gallery.upload.invalidFile");
            galleryChooseFile.focus();
            return;
        }

        ZHLanguage.bind(uploadStatus, "gallery.uploading");
        stage = "upload";
        const fileName = `${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await supabaseClient.storage.from("gallery")
            .upload(fileName, file, { cacheControl: "31536000", contentType: file.type, upsert: false });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabaseClient.storage.from("gallery").getPublicUrl(fileName);
        stage = "save";
        const current = await supabaseClient.auth.getSession();
        if (current.error || (current.data.session?.access_token || SUPABASE_KEY) !== principal.accessToken) {
            throw new Error("identity.sessionChanged");
        }
        const saved = await fetch(`${SUPABASE_URL}/rest/v1/gallery`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${principal.accessToken}`, "Prefer": "return=minimal" },
            body: JSON.stringify({
                image_url: urlData.publicUrl,
                uploader,
                description,
                approved: false
            })
        });
        if (!saved.ok) throw new Error((await saved.json().catch(() => ({}))).message || "gallery.save.failed");
        ZHLanguage.bind(uploadStatus, "gallery.upload.success");
        uploadForm.reset();
        updateGalleryFileName();
    } catch (error) {
        ZHLanguage.bind(uploadStatus, window.ZHIdentity.errorKey(error, stage === "upload" ? "gallery.upload.failed" : "gallery.save.failed"));
    } finally {
        delete uploadForm.dataset.identityBusy;
        window.ZHIdentity.syncForms();
    }
});

closeLightbox.addEventListener("click", closeGalleryImage);
lightboxPrev.addEventListener("click", () => stepGalleryImage(-1));
lightboxNext.addEventListener("click", () => stepGalleryImage(1));
lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.classList.contains("zh-gallery-lightbox-figure")) closeGalleryImage();
});
document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) return;
    if (event.key === "Escape") closeGalleryImage();
    else if (event.key === "ArrowLeft") stepGalleryImage(-1);
    else if (event.key === "ArrowRight") stepGalleryImage(1);
    else if (event.key === "Tab") {
        // Keep keyboard focus inside the open dialog.
        const controls = [closeLightbox, lightboxPrev, lightboxNext].filter((button) => !button.hidden);
        const position = controls.indexOf(document.activeElement);
        event.preventDefault();
        const next = event.shiftKey ? position - 1 : position + 1;
        controls[(next + controls.length) % controls.length].focus();
    }
});

loadGallery();
