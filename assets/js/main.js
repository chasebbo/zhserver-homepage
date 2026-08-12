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
const guestbookPagination = document.querySelector("#guestbook-pagination");
const GUESTBOOK_PAGE_SIZE = 5;

if (guestbookEntries) {
    let guestbookPage = 1;

    function renderGuestbookPagination(totalPages) {
        if (!guestbookPagination) return;
        guestbookPagination.replaceChildren();
        guestbookPagination.hidden = totalPages <= 1;
        if (totalPages <= 1) return;

        const createPageButton = (label, page, disabled, className = "") => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = `guestbook-page-button ${className}`.trim();
            button.textContent = label;
            button.disabled = disabled;
            button.setAttribute("aria-label", label);
            if (!disabled) button.addEventListener("click", () => loadGuestbookEntries(page));
            return button;
        };

        guestbookPagination.append(createPageButton("← Zurück", guestbookPage - 1, guestbookPage === 1, "guestbook-page-previous"));
        for (let page = 1; page <= totalPages; page += 1) {
            const button = createPageButton(String(page), page, page === guestbookPage, "guestbook-page-number");
            button.classList.toggle("is-current", page === guestbookPage);
            button.setAttribute("aria-current", page === guestbookPage ? "page" : "false");
            guestbookPagination.append(button);
        }
        guestbookPagination.append(createPageButton("Weiter →", guestbookPage + 1, guestbookPage === totalPages, "guestbook-page-next"));
    }

    async function loadGuestbookEntries(requestedPage = 1) {
        const offset = Math.max(0, (requestedPage - 1) * GUESTBOOK_PAGE_SIZE);
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/guestbook?approved=eq.true&select=name,message,created_at&order=created_at.desc&limit=${GUESTBOOK_PAGE_SIZE}&offset=${offset}`,
            {
                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization": `Bearer ${SUPABASE_KEY}`,
                    "Prefer": "count=exact"
                }
            }
        );

        if (!response.ok) throw new Error("Gästebuch konnte nicht geladen werden.");
        const entries = await response.json();
        const countMatch = (response.headers.get("content-range") || "").match(/\/(\d+)$/);
        const totalEntries = countMatch ? Number(countMatch[1]) : entries.length;
        const totalPages = Math.max(1, Math.ceil(totalEntries / GUESTBOOK_PAGE_SIZE));
        guestbookPage = Math.min(Math.max(1, requestedPage), totalPages);

        guestbookEntries.innerHTML = "";
        entries.forEach((entry, index) => {
            const entryNumber = offset + index + 1;
            guestbookEntries.innerHTML += `
                <div class="guestbook-card">
                    <span>ZH-G${String(entryNumber).padStart(3, "0")}</span>
                    <h3>${entry.name}</h3>
                    <p>${entry.message}</p>
                    <small>Freigeschaltet am ${new Date(entry.created_at).toLocaleDateString("de-DE")}</small>
                </div>
            `;
        });
        renderGuestbookPagination(totalPages);
    }

    loadGuestbookEntries().catch(() => {
        guestbookEntries.innerHTML = '<p class="guestbook-info">Das Gästebuch wird gerade vorbereitet.</p>';
        if (guestbookPagination) guestbookPagination.hidden = true;
    });
}

// ================= MOBILE MENU =================

const menuToggle = document.querySelector("#menu-toggle");
const navMenu = document.querySelector(".nav-menu");

if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", () => {

        navMenu.classList.toggle("active");

        menuToggle.textContent =
            navMenu.classList.contains("active") ? "✕" : "☰";

    });

}

document.querySelectorAll(".nav-menu a").forEach(link => {

    link.addEventListener("click", () => {

        if (navMenu) navMenu.classList.remove("active");

        if (menuToggle) menuToggle.textContent = "☰";

    });

});

// ================= HEADER SCROLL =================
const headerEl = document.querySelector(".header");
if (headerEl) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            headerEl.classList.add("scrolled");
        } else {
            headerEl.classList.remove("scrolled");
        }
    });
}

// ================= BACK TO TOP =================

const backToTop = document.querySelector("#backToTop");

if (backToTop) {
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
}
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
