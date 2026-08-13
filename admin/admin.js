const SUPABASE_URL = "https://yawadxzeyyrozmlrokun.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhd2FkeHpleXlyb3ptbHJva3VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMzQ4MTIsImV4cCI6MjEwMDkxMDgxMn0.B53O3gHURnfxUkVGKaZJ5ssx27Bj9FNMU70Yn85tfxE";

const sb = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
window.adminSupabase = sb;

const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const loginMessage = document.getElementById("loginMessage");

if (loginBtn) loginBtn.addEventListener("click", async () => {

    loginMessage.textContent = "Anmeldung läuft...";

    const { error } = await sb.auth.signInWithPassword({

        email: email.value,
        password: password.value

    });

    if (error) {

        loginMessage.textContent = error.message;
        return;

    }

    loginMessage.textContent = "Erfolgreich angemeldet.";

    setTimeout(() => {

        window.location.href = "dashboard.html";

    }, 700);

});
