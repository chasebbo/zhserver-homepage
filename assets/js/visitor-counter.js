(function() {
    const SUPABASE_URL = "https://yawadxzeyyrozmlrokun.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhd2FkeHpleXlyb3ptbHJva3VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMzQ4MTIsImV4cCI6MjEwMDkxMDgxMn0.B53O3gHURnfxUkVGKaZJ5ssx27Bj9FNMU70Yn85tfxE";
    const totalVisitors = document.querySelector("#total-visitors");
    const VISITOR_KEY = "zhserver_last_visit";

    if (!totalVisitors) return;

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

    registerVisitor().catch(console.error);
})();
