const galleryGrid = document.getElementById("galleryGrid");
const uploadForm = document.getElementById("uploadForm");
const uploadStatus = document.getElementById("uploadStatus");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const closeLightbox = document.getElementById("closeLightbox");

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

    const { data, error } = await supabaseClient
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {

        console.error(error);
        return;

    }

    const likesMap = getGalleryLikes();
    const countsMap = getGalleryLikeCounts();

    // Determine max likes for top badge
    let maxLikes = -1;
    let topEntryId = null;
    data.forEach(entry => {
        if (!entry.approved) return;
        const count = countsMap[entry.id] ?? (12 + (entry.id % 7));
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

                    ${isTop ? '<span class="gallery-top-badge"><i class="fa-solid fa-crown" aria-hidden="true"></i> TOP SCREENSHOT</span>' : ''}

                    <img
                        src="${entry.image_url}"
                        alt="${escapeHtml(entry.description ?? "")}">

                </div>

                <div class="gallery-info">

                    <div class="gallery-info-head">
                        <span>${escapeHtml(entry.uploader)}</span>
                        <button type="button" class="gallery-like-btn ${isLiked ? "is-liked" : ""}" data-entry-id="${entry.id}" aria-label="Gefällt mir" title="Gefällt mir">
                            <i class="${isLiked ? "fa-solid fa-heart" : "fa-regular fa-heart"}" aria-hidden="true"></i>
                            <span class="like-counter">${count}</span>
                        </button>
                    </div>

                    <p>${escapeHtml(entry.description ?? "")}</p>

                </div>

            `;

            const img = card.querySelector("img");
            if (img) {
                img.addEventListener("click", () => {

                    lightbox.style.display = "flex";
                    lightboxImage.src = entry.image_url;

                });
            }

            const likeBtn = card.querySelector(".gallery-like-btn");
            if (likeBtn) {
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

                    <span>${escapeHtml(entry.uploader)}</span>

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
        counts[id] = Math.max(0, (counts[id] || 1) - 1);
    } else {
        likes[id] = true;
        counts[id] = (counts[id] || 0) + 1;
    }

    saveGalleryLikes(likes);
    saveGalleryLikeCounts(counts);

    btn.classList.toggle("is-liked", !currentlyLiked);
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

    uploadStatus.textContent = "Upload läuft...";

    const file = document.getElementById("image").files[0];

    const uploader = document.getElementById("uploader").value;

    const description = document.getElementById("description").value;

    const fileName = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabaseClient
        .storage
        .from("gallery")
        .upload(fileName, file);

    if (uploadError) {

        uploadStatus.textContent = uploadError.message;
        return;

    }

    const { data: urlData } = supabaseClient
        .storage
        .from("gallery")
        .getPublicUrl(fileName);

    const { error: insertError } = await supabaseClient
        .from("gallery")
        .insert({

            image_url: urlData.publicUrl,
            uploader,
            description,
            approved: false

        });

    if (insertError) {

        uploadStatus.textContent = insertError.message;
        return;

    }

    uploadStatus.textContent =
        "Vielen Dank! Dein Screenshot wurde erfolgreich hochgeladen und wartet auf Freigabe.";

    uploadForm.reset();

});

closeLightbox.addEventListener("click", () => {

    lightbox.style.display = "none";

});

lightbox.addEventListener("click", (e) => {

    if (e.target === lightbox) {

        lightbox.style.display = "none";

    }

});

loadGallery();