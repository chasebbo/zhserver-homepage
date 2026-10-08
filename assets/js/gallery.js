const galleryGrid = document.getElementById("galleryGrid");
const uploadForm = document.getElementById("uploadForm");
const uploadStatus = document.getElementById("uploadStatus");
const galleryImageField = document.getElementById("image");
const galleryChooseFile = document.getElementById("galleryChooseFile");
const galleryFileName = document.getElementById("galleryFileName");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const closeLightbox = document.getElementById("closeLightbox");
let galleryImageTrigger = null;

function updateGalleryFileName() {
        const file = galleryImageField.files[0];
        ZHLanguage.bind(galleryFileName, file ? "gallery.file.selected" : "gallery.file.empty", { name: file?.name || "" });
    }

    galleryChooseFile.addEventListener("click", () => galleryImageField.click());
    galleryImageField.addEventListener("change", updateGalleryFileName);
    updateGalleryFileName();

    function openGalleryImage(source, description, trigger) {
        galleryImageTrigger = trigger;
        lightboxImage.src = source;
        ZHLanguage.bind(lightboxImage, description ? "gallery.image.userAlt" : "gallery.image.defaultAlt", { description: description || "" }, "alt");
        lightbox.style.display = "flex";
        lightbox.setAttribute("aria-hidden", "false");
        closeLightbox.focus();
    }

    function closeGalleryImage() {
        lightbox.style.display = "none";
        lightbox.setAttribute("aria-hidden", "true");
        if (galleryImageTrigger?.isConnected) galleryImageTrigger.focus();
    }

    function updateGalleryLikeLabel(button, liked) {
        const key = liked ? "gallery.like.remove" : "gallery.like.add";
        ZHLanguage.bind(button, key, {}, "aria-label");
        ZHLanguage.bind(button, key, {}, "title");
        button.setAttribute("aria-pressed", String(liked));
    }

    function escapeHtml(str) {
        if (!str) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    const STORAGE_LIKES_KEY = "zh_gallery_likes_v1";
    const STORAGE_COUNTS_KEY = "zh_gallery_like_counts_v1";

    function getGalleryLikes() {
        try {
            const raw = localStorage.getItem(STORAGE_LIKES_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (e) { return {}; }
    }

    function getGalleryLikeCounts() {
        try {
            const raw = localStorage.getItem(STORAGE_COUNTS_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (e) { return {}; }
    }

    function saveGalleryLikes(likes) {
        try { localStorage.setItem(STORAGE_LIKES_KEY, JSON.stringify(likes)); } catch (e) {}
    }

    function saveGalleryLikeCounts(counts) {
        try { localStorage.setItem(STORAGE_COUNTS_KEY, JSON.stringify(counts)); } catch (e) {}
    }

    async function loadGallery() {

        galleryGrid.innerHTML = "";

        let data;
        try {
            const result = await supabaseClient
                .from("gallery")
                .select("id,image_url,uploader,description,approved,created_at")
                .order("created_at", { ascending: false });
            if (result.error) throw result.error;
            if (!Array.isArray(result.data)) throw new Error("Invalid gallery response");
            data = result.data;
        } catch (error) {
            console.error(error);
            const notice = document.createElement("p");
            notice.setAttribute("role", "status");
            galleryGrid.appendChild(notice);
            ZHLanguage.bind(notice, "gallery.load.failed");
            return;
        }

        if (!data.length) {
            const notice = document.createElement("p");
            galleryGrid.appendChild(notice);
            ZHLanguage.bind(notice, "gallery.empty");
            return;
        }

        const likesMap = getGalleryLikes();
        const countsMap = getGalleryLikeCounts();

        // Determine max likes for top badge
        let maxLikes = -1;
        let topEntryId = null;
        data.forEach(entry => {
            if (!entry.approved) return;
            // These are browser-local preferences, not public vote totals.
            const count = likesMap[entry.id] ? 1 : 0;
            countsMap[entry.id] = count;
            if (count > maxLikes) {
                maxLikes = count;
                topEntryId = entry.id;
            }
        });
        saveGalleryLikeCounts(countsMap);

        data.forEach(entry => {

            const card = document.createElement("article");
            const isApproved = Boolean(entry.approved);

            if (isApproved) {
                const isTop = entry.id === topEntryId && maxLikes > 0;
                const isLiked = Boolean(likesMap[entry.id]);
                const count = countsMap[entry.id] || 0;

                card.className = `gallery-card ${isTop ? "is-top-screenshot" : ""}`.trim();

                card.innerHTML = `

                    <div class="gallery-image">

                        ${isTop ? '<span class="gallery-top-badge"><i class="fa-solid fa-bookmark" aria-hidden="true"></i> <span data-gallery-local-saved>Hier gemerkt</span></span>' : ''}

                        <img
                            src="${escapeHtml(entry.image_url)}"
                            alt="${escapeHtml(entry.description ?? "")}" data-i18n-ignore>

                    </div>

                    <div class="gallery-info">

                        <div class="gallery-info-head">
                            <span data-i18n-ignore>${escapeHtml(entry.uploader)}</span>
                            <button type="button" class="gallery-like-btn ${isLiked ? "is-liked" : ""}" data-entry-id="${entry.id}" aria-label="Gefällt mir" title="Gefällt mir">
                                <i class="${isLiked ? "fa-solid fa-heart" : "fa-regular fa-heart"}" aria-hidden="true"></i>
                                <span class="like-counter">${count}</span>
                            </button>
                        </div>

                        <p data-i18n-ignore>${escapeHtml(entry.description ?? "")}</p>

                    </div>

                `;

                ZHLanguage.bind(card.querySelector('[data-gallery-local-saved]'), 'gallery.localSaved');
                const img = card.querySelector("img");
                if (img) {
                    img.tabIndex = 0;
                    img.setAttribute("role", "button");
                    ZHLanguage.bind(img, entry.description ? "gallery.image.open" : "gallery.image.openUnnamed", { description: entry.description || "" }, "aria-label");
                    ZHLanguage.bind(img, entry.description ? "gallery.image.userAlt" : "gallery.image.defaultAlt", { description: entry.description || "" }, "alt");
                    img.addEventListener("click", () => openGalleryImage(entry.image_url, entry.description, img));
                    img.addEventListener("keydown", (event) => {
                        if (event.key !== "Enter" && event.key !== " ") return;
                        event.preventDefault();
                        openGalleryImage(entry.image_url, entry.description, img);
                    });
                }

                const likeBtn = card.querySelector(".gallery-like-btn");
                if (likeBtn) {
                    updateGalleryLikeLabel(likeBtn, isLiked);
                    likeBtn.addEventListener("click", (e) => {
                        e.stopPropagation();
                        toggleLike(entry.id, likeBtn);
                    });
                }
            } else {
                card.className = "gallery-card gallery-card--pending";

                card.innerHTML = `

                    <div class="gallery-image gallery-image--pending">

                        <div class="gallery-pending-placeholder">
                            <div class="gallery-pending-icon">📷 ⏳</div>
                            <span class="gallery-pending-badge">IN QUARANTÄNE</span>
                            <small class="gallery-pending-hint">Screenshot wartet auf Freigabe</small>
                        </div>

                    </div>

                    <div class="gallery-info">

                        <span data-i18n-ignore>${escapeHtml(entry.uploader)}</span>

                        <p class="gallery-pending-sub"><em>[Inhalt in Sicherheitsprüfung]</em></p>

                    </div>

                `;
            }

            galleryGrid.appendChild(card);

        });

    }

    function toggleLike(id, btn) {
        const likes = getGalleryLikes();
        const counts = getGalleryLikeCounts();
        const currentlyLiked = Boolean(likes[id]);

        if (currentlyLiked) {
            delete likes[id];
            counts[id] = 0;
        } else {
            likes[id] = true;
            counts[id] = 1;
        }

        saveGalleryLikes(likes);
        saveGalleryLikeCounts(counts);

        btn.classList.toggle("is-liked", !currentlyLiked);
        updateGalleryLikeLabel(btn, !currentlyLiked);
        const icon = btn.querySelector("i");
        if (icon) {
            icon.className = !currentlyLiked ? "fa-solid fa-heart" : "fa-regular fa-heart";
        }
        const counter = btn.querySelector(".like-counter");
        if (counter) {
            counter.textContent = counts[id];
        }
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

        ZHLanguage.bind(uploadStatus, "gallery.uploading");
        stage = "upload";
        const fileName = `${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabaseClient.storage.from("gallery").upload(fileName, file);
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
lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeGalleryImage();
});
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.getAttribute("aria-hidden") === "false") closeGalleryImage();
});

loadGallery();
