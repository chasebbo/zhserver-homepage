const SUPABASE_URL = "https://yawadxzeyyrozmlrokun.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhd2FkeHpleXlyb3ptbHJva3VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMzQ4MTIsImV4cCI6MjEwMDkxMDgxMn0.B53O3gHURnfxUkVGKaZJ5ssx27Bj9FNMU70Yn85tfxE";

const dashboardClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

(async () => {

    await window.ZHAdminAccess.require(dashboardClient);

})();

document
    .getElementById("logoutBtn")
    .addEventListener("click", async () => {

        const { error } = await dashboardClient.auth.signOut();
        if (error) alert("Abmelden ist derzeit nicht möglich. Bitte versuche es erneut.");
        // The shared Auth watcher performs the redirect after a confirmed logout.

    });
