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

    data.forEach(entry => {

        const card = document.createElement("article");
        const isApproved = Boolean(entry.approved);

        if (isApproved) {
            card.className = "gallery-card";

            card.innerHTML = `

                <div class="gallery-image">

                    <img
                        src="${entry.image_url}"
                        alt="${escapeHtml(entry.description ?? "")}">

                </div>

                <div class="gallery-info">

                    <span>${escapeHtml(entry.uploader)}</span>

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

                    <a href="admin/gallery.html" class="gallery-admin-shortcut" title="Als Admin im Backend öffnen">🛠️ Admin-Prüfung</a>

                </div>

            `;
        }

        galleryGrid.appendChild(card);

    });

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