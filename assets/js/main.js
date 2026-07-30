// ================= SUPABASE =================

const SUPABASE_URL = "https://yawadxzeyyrozmlrokun.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhd2FkeHpleXlyb3ptbHJva3VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMzQ4MTIsImV4cCI6MjEwMDkxMDgxMn0.B53O3gHURnfxUkVGKaZJ5ssx27Bj9FNMU70Yn85tfxE";


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
// ================= ARCHIVSTATISTIK =================

const todayVisitors = document.querySelector("#today-visitors");
const totalVisitors = document.querySelector("#total-visitors");

const VISITOR_KEY = "zhserver_last_visit";

async function loadVisitorStats() {

    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/visitor_stats?id=eq.1`,
        {
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`
            }
        }
    );

    if (!response.ok) return null;

    const data = await response.json();

    if (!data.length) return null;

    return data[0];
}

async function updateVisitorDisplay() {

    const stats = await loadVisitorStats();

    if (!stats) return;

    todayVisitors.textContent = Number(stats.today_visitors).toLocaleString("de-DE");
    totalVisitors.textContent = Number(stats.total_visitors).toLocaleString("de-DE");
}

async function registerVisitor() {

    const lastVisit = localStorage.getItem(VISITOR_KEY);

    if (lastVisit) {

        const diff = Date.now() - Number(lastVisit);

        if (diff < 24 * 60 * 60 * 1000) {
            await updateVisitorDisplay();
            return;
        }
    }

    let stats = await loadVisitorStats();

    if (!stats) return;

    const today = new Date().toISOString().split("T")[0];

    let todayVisitorsCount = Number(stats.today_visitors);

    if (stats.today_date !== today) {
        todayVisitorsCount = 0;
    }

    const body = {
        total_visitors: Number(stats.total_visitors) + 1,
        today_visitors: todayVisitorsCount + 1,
        today_date: today
    };

    await fetch(
        `${SUPABASE_URL}/rest/v1/visitor_stats?id=eq.1`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`
            },
            body: JSON.stringify(body)
        }
    );

    localStorage.setItem(VISITOR_KEY, Date.now());

    await updateVisitorDisplay();
}

if (todayVisitors && totalVisitors) {
    registerVisitor();
}
// ==============================
// Neueste Community Screenshots
// ==============================

const latestGallery = document.getElementById("latestGallery");

if (latestGallery) {

    loadLatestGallery();

}

async function loadLatestGallery() {

    const { data, error } = await supabase
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