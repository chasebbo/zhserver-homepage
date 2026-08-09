const SUPABASE_URL = "https://yawadxzeyyrozmlrokun.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhd2FkeHpleXlyb3ptbHJva3VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMzQ4MTIsImV4cCI6MjEwMDkxMDgxMn0.B53O3gHURnfxUkVGKaZJ5ssx27Bj9FNMU70Yn85tfxE";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
// ================= GÄSTEBUCH SPEICHERN =================

// ================= GÄSTEBUCH SPEICHERN =================

const guestbookForm = document.querySelector("#guestbook-form");


if (guestbookForm) {

    guestbookForm.addEventListener("submit", async function(event) {

        event.preventDefault();


        const name = document.querySelector("#guestbook-name").value.trim();

        const message = document.querySelector("#guestbook-message").value.trim();


        if (!name || !message) {

            alert("Bitte Name und Nachricht ausfüllen.");

            return;

        }


        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/guestbook`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "apikey": SUPABASE_KEY,
                    "Authorization": `Bearer ${SUPABASE_KEY}`,
                    "Prefer": "return=minimal"
                },

                body: JSON.stringify({
                    name: name,
                    message: message,
                    approved: false
                })
            }
        );


        if (response.ok) {

            alert(
                "Vielen Dank! Dein Eintrag wurde gespeichert und wird nach Prüfung freigeschaltet."
            );

            guestbookForm.reset();


        } else {

            console.log(await response.text());

            alert(
                "Fehler beim Speichern des Eintrags."
            );

        }

    });

}



// ================= GÄSTEBUCH ANZEIGEN =================

const guestbookEntries = document.querySelector("#guestbook-entries");


if (guestbookEntries) {


    async function loadGuestbookEntries() {


        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/guestbook?approved=eq.true&order=created_at.desc`,
            {
                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization": `Bearer ${SUPABASE_KEY}`
                }
            }
        );


        const entries = await response.json();


        guestbookEntries.innerHTML = "";


        entries.forEach((entry, index) => {


            guestbookEntries.innerHTML += `

                <div class="guestbook-card">

                    <span>
                        ZH-G${String(index + 1).padStart(3, "0")}
                    </span>


                    <h3>
                        ${entry.name}
                    </h3>


                    <p>
                        ${entry.message}
                    </p>


                    <small>
                        Freigeschaltet am 
                        ${new Date(entry.created_at).toLocaleDateString("de-DE")}
                    </small>


                </div>

            `;


        });


    }


    loadGuestbookEntries();

}

// ================= MOBILE MENU =================

const menuToggle = document.querySelector("#menu-toggle");
const navMenu = document.querySelector(".nav-menu");

if (menuToggle) {

    menuToggle.addEventListener("click", () => {

        navMenu.classList.toggle("active");

        menuToggle.textContent =
            navMenu.classList.contains("active") ? "✕" : "☰";

    });

}

document.querySelectorAll(".nav-menu a").forEach(link => {

    link.addEventListener("click", () => {

        navMenu.classList.remove("active");

        menuToggle.textContent = "☰";

    });

});
// ================= BACK TO TOP =================

const backToTop = document.querySelector("#backToTop");

window.addEventListener("scroll", () => {

    if (window.scrollY > 500) {

        backToTop.classList.add("show");

    } else {

        backToTop.classList.remove("show");

    }

});

backToTop.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});
// ================= BESUCHERZ&Auml;HLER =================
const totalVisitors = document.querySelector("#total-visitors");
const VISITOR_KEY = "zhserver_last_visit";

async function callVisitorStats(functionName) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${functionName}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "apikey": SUPABASE_KEY
        },
        body: "{}"
    });
    if (!response.ok) return null;
    const data = await response.json();
    return Array.isArray(data) && data.length ? data[0] : null;
}

function renderVisitorStats(stats) {
    if (!stats || !totalVisitors) return;
    totalVisitors.textContent = Number(stats.total_visitors || 0).toLocaleString("de-DE");
}

async function registerVisitor() {
    const lastVisit = Number(localStorage.getItem(VISITOR_KEY) || 0);
    const isNewDailyVisit = !lastVisit || Date.now() - lastVisit >= 24 * 60 * 60 * 1000;
    const stats = await callVisitorStats(isNewDailyVisit ? "register_visitor" : "get_visitor_stats");
    if (!stats) return;
    if (isNewDailyVisit) localStorage.setItem(VISITOR_KEY, String(Date.now()));
    renderVisitorStats(stats);
}

if (totalVisitors) registerVisitor();
// ==============================
// Neueste Community Screenshots
// ==============================

const latestGallery = document.getElementById("latestGallery");

if (latestGallery) {

    loadLatestGallery();

}

async function loadLatestGallery() {

    const { data, error } = await supabaseClient
        .from("gallery")
        .select("*")
        .eq("approved", true)
        .order("created_at", { ascending: false })
        .limit(6);

    if (error) {

        console.error(error);
        return;

    }

    latestGallery.innerHTML = "";

    data.forEach(entry => {

        latestGallery.innerHTML += `

            <article class="gallery-card">

                <div class="gallery-image">

                    <img
                        src="${entry.image_url}"
                        alt="${entry.description ?? ""}">

                </div>

                <div class="gallery-info">

                    <span>${entry.uploader}</span>

                    <p>${entry.description ?? ""}</p>

                </div>

            </article>

        `;

    });

}