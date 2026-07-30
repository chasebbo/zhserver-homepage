const SUPABASE_URL = "https://yawadxzeyyrozmlrokun.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhd2FkeHpleXlyb3ptbHJva3VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMzQ4MTIsImV4cCI6MjEwMDkxMDgxMn0.B53O3gHURnfxUkVGKaZJ5ssx27Bj9FNMU70Yn85tfxE";

const sb = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

(async () => {

    const {
        data: { session }
    } = await sb.auth.getSession();

    if (!session) {

        location.href = "index.html";
        return;

    }

    loadGallery();

})();

async function loadGallery() {

    const { data, error } = await sb
        .from("gallery")
        .select("*")
        .eq("approved", false)
        .order("created_at", { ascending: false });

    if (error) {

        console.error(error);
        return;

    }

    const container = document.getElementById("galleryEntries");

    container.innerHTML = "";

    if (data.length === 0) {

        container.innerHTML = `
            <div class="card admin-card">
                <h3>Keine offenen Uploads.</h3>
            </div>
        `;

        return;

    }

    data.forEach(image => {

        container.innerHTML += `

        <div class="card admin-card">

            <img
                src="${image.image_url}"
                style="width:100%;max-width:600px;border-radius:8px;margin-bottom:20px;">

            <h3>${image.uploader ?? "Unbekannt"}</h3>

            <p>${image.description ?? ""}</p>

            <div class="admin-actions">

                <button class="btn" onclick="approve(${image.id})">
                    ✅ Freigeben
                </button>

                <button class="btn" onclick="removeImage(${image.id})">
                    ❌ Löschen
                </button>

            </div>

        </div>

        `;

    });

}

async function approve(id) {

    const { error } = await sb
        .from("gallery")
        .update({ approved: true })
        .eq("id", id);

    if (error) {

        alert(error.message);
        return;

    }

    loadGallery();

}

async function removeImage(id) {

    if (!confirm("Bild wirklich löschen?"))
        return;

    const { error } = await sb
        .from("gallery")
        .delete()
        .eq("id", id);

    if (error) {

        alert(error.message);
        return;

    }

    loadGallery();

}