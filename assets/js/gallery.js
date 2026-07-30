const galleryGrid = document.getElementById("galleryGrid");
const uploadForm = document.getElementById("uploadForm");
const uploadStatus = document.getElementById("uploadStatus");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const closeLightbox = document.getElementById("closeLightbox");

async function loadGallery() {

    galleryGrid.innerHTML = "";

    const { data, error } = await supabaseClient
        .from("gallery")
        .select("*")
        .eq("approved", true)
        .order("created_at", { ascending: false });

    if (error) {

        console.error(error);
        return;

    }

    data.forEach(entry => {

        const card = document.createElement("article");
        card.className = "gallery-card";

        card.innerHTML = `

            <div class="gallery-image">

                <img
                    src="${entry.image_url}"
                    alt="${entry.description ?? ""}">

            </div>

            <div class="gallery-info">

                <span>${entry.uploader}</span>

                <p>${entry.description ?? ""}</p>

            </div>

        `;

        card.querySelector("img").addEventListener("click", () => {

            lightbox.style.display = "flex";
            lightboxImage.src = entry.image_url;

        });

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