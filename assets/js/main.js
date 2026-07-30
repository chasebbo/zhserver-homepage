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

if(menuToggle){

    menuToggle.addEventListener("click",()=>{

        navMenu.classList.toggle("active");

    });

}
document.querySelectorAll(".nav-menu a").forEach(link => {

    link.addEventListener("click", () => {

        navMenu.classList.remove("active");

    });

});