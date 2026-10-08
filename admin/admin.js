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

if (loginMessage) {
    loginMessage.setAttribute('role', 'status');
    loginMessage.setAttribute('aria-live', 'polite');
    if (new URLSearchParams(location.search).get('status') === 'denied') loginMessage.textContent = 'Bitte mit dem bestehenden Adminaccount anmelden.';
}
if (loginBtn) loginBtn.addEventListener("click", async () => {
    if (loginBtn.disabled) return;
    loginBtn.disabled = true;
    try {

    loginMessage.textContent = "Anmeldung läuft...";

    const { error } = await sb.auth.signInWithPassword({

        email: email.value,
        password: password.value

    });

    if (error) {

        loginMessage.textContent = error.code === 'invalid_credentials' ? 'E-Mail-Adresse oder Passwort ist falsch.' :
            error.code === 'email_not_confirmed' ? 'Bitte bestätige zuerst deine E-Mail-Adresse.' :
            'Die Anmeldung ist derzeit nicht möglich. Bitte versuche es später erneut.';
        return;

    }
    if (!await window.ZHAdminAccess.require(sb, { redirect: false })) {
        loginMessage.textContent = 'Dieser Account hat keinen Zugang zum internen Adminbereich.';
        return;
    }

    loginMessage.textContent = "Erfolgreich angemeldet.";

    setTimeout(() => {

        window.location.href = "dashboard.html";

    }, 700);
    } catch (_) { loginMessage.textContent = 'Die Anmeldung ist derzeit nicht möglich. Bitte versuche es später erneut.'; }
    finally { loginBtn.disabled = false; }
});
