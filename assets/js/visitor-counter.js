(function() {
    const SUPABASE_URL = "https://yawadxzeyyrozmlrokun.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhd2FkeHpleXlyb3ptbHJva3VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMzQ4MTIsImV4cCI6MjEwMDkxMDgxMn0.B53O3gHURnfxUkVGKaZJ5ssx27Bj9FNMU70Yn85tfxE";
    const totalVisitors = document.querySelector("#total-visitors");
    const VISITOR_KEY = "zhserver_last_visit";
    const DEVICE_ID_KEY = "zhserver_device_id";
    const SIMULATED_BASE_KEY = "zhserver_simulated_base";
    const LAST_BASE_UPDATE_KEY = "zhserver_simulated_ts";

    // ================= 1. ALL-TIME TOTAL VISITORS (FOOTER) =================
    async function callVisitorStats(functionName) {
        try {
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
        } catch (e) {
            return null;
        }
    }

    function renderVisitorStats(stats) {
        if (!stats || !totalVisitors) return;
        totalVisitors.textContent = Number(stats.total_visitors || 0).toLocaleString("de-DE");
    }

    async function registerVisitor() {
        if (!totalVisitors) return;
        const lastVisit = Number(localStorage.getItem(VISITOR_KEY) || 0);
        const isNewDailyVisit = !lastVisit || Date.now() - lastVisit >= 24 * 60 * 60 * 1000;
        const stats = await callVisitorStats(isNewDailyVisit ? "register_visitor" : "get_visitor_stats");
        if (!stats) return;
        if (isNewDailyVisit) localStorage.setItem(VISITOR_KEY, String(Date.now()));
        renderVisitorStats(stats);
    }

    registerVisitor().catch(console.error);

    // ================= 2. LIVE ONLINE VISITORS (HERO BADGE) =================
    // Get or create persistent device ID for deduplicating multi-tab visits
    function getDeviceId() {
        let devId = null;
        try {
            devId = localStorage.getItem(DEVICE_ID_KEY);
            if (!devId) {
                devId = "zh_" + Math.random().toString(36).substring(2, 10) + "_" + Date.now().toString(36);
                localStorage.setItem(DEVICE_ID_KEY, devId);
            }
        } catch (e) {
            devId = "zh_fallback_" + Math.random().toString(36).substring(2, 10);
        }
        return devId;
    }

    // Organic base calculation based on hour of day
    function getTargetBaseForHour(hour) {
        if (hour >= 1 && hour < 7) return 2;   // Late night: quiet (1-3)
        if (hour >= 7 && hour < 12) return 4;  // Morning (3-5)
        if (hour >= 12 && hour < 17) return 6; // Afternoon (5-7)
        if (hour >= 17 && hour < 23) return 8; // Evening: prime time (7-10)
        return 4;                              // Midnight
    }

    function getInitialSimulatedBase() {
        try {
            const stored = sessionStorage.getItem(SIMULATED_BASE_KEY);
            if (stored !== null) {
                const parsed = parseInt(stored, 10);
                if (!isNaN(parsed) && parsed >= 1 && parsed <= 10) return parsed;
            }
        } catch (e) {}

        const hour = new Date().getHours();
        const target = getTargetBaseForHour(hour);
        const jitter = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
        const base = Math.max(1, Math.min(10, target + jitter));
        try {
            sessionStorage.setItem(SIMULATED_BASE_KEY, String(base));
            sessionStorage.setItem(LAST_BASE_UPDATE_KEY, String(Date.now()));
        } catch (e) {}
        return base;
    }

    let simulatedBase = getInitialSimulatedBase();
    let realVisitorsCount = 1; // Current active visitor is definitely 1!

    function calculateDisplayedVisitors() {
        // If there is high real traffic (e.g. 14, 20, 100+), show ONLY the real number
        if (realVisitorsCount >= 14) {
            return realVisitorsCount;
        }
        // Otherwise: simulated base + real active visitors, capped at max 14 (min 1)
        return Math.min(14, Math.max(1, simulatedBase + realVisitorsCount));
    }

    let lastRenderedCount = null;
    function updateHeroOnlineDisplay() {
        const countEl = document.querySelector("#heroOnlineCount");
        if (!countEl) return;
        const count = calculateDisplayedVisitors();
        if (lastRenderedCount !== count) {
            countEl.textContent = count;
            if (lastRenderedCount !== null) {
                countEl.classList.remove("count-bump");
                void countEl.offsetWidth; // Force reflow to replay CSS animation
                countEl.classList.add("count-bump");
                setTimeout(() => countEl.classList.remove("count-bump"), 350);
            }
            lastRenderedCount = count;
        }
    }

    // Initial immediate render
    updateHeroOnlineDisplay();

    // Natural subtle fluctuation for base (every 30-50 seconds)
    function tickBaseFluctuation() {
        const hour = new Date().getHours();
        const target = getTargetBaseForHour(hour);
        const rand = Math.random();

        // 40% chance to gently drift towards target or wiggle by +/- 1
        if (rand < 0.40) {
            let delta = 0;
            if (simulatedBase < target) {
                delta = Math.random() < 0.7 ? 1 : -1;
            } else if (simulatedBase > target) {
                delta = Math.random() < 0.7 ? -1 : 1;
            } else {
                delta = Math.random() < 0.5 ? 1 : -1;
            }
            simulatedBase = Math.max(1, Math.min(10, simulatedBase + delta));
            try {
                sessionStorage.setItem(SIMULATED_BASE_KEY, String(simulatedBase));
            } catch (e) {}
            updateHeroOnlineDisplay();
        }

        const nextInterval = 30000 + Math.floor(Math.random() * 20000);
        setTimeout(tickBaseFluctuation, nextInterval);
    }
    setTimeout(tickBaseFluctuation, 35000);

    // ================= 3. SUPABASE REALTIME PRESENCE =================
    function initRealtimePresence() {
        // Re-run display update in case DOM element was just created
        updateHeroOnlineDisplay();

        const client = window.supabaseClient || (window.supabase && typeof window.supabase.createClient === "function"
            ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
            : null);

        if (!client || typeof client.channel !== "function") return;

        try {
            const deviceId = getDeviceId();
            const channel = client.channel("zh_online_presence", {
                config: {
                    presence: { key: deviceId }
                }
            });

            channel
                .on("presence", { event: "sync" }, () => {
                    const state = channel.presenceState();
                    const uniqueVisitors = Object.keys(state || {}).length;
                    realVisitorsCount = Math.max(1, uniqueVisitors);
                    updateHeroOnlineDisplay();
                })
                .on("presence", { event: "join" }, () => {
                    const state = channel.presenceState();
                    const uniqueVisitors = Object.keys(state || {}).length;
                    realVisitorsCount = Math.max(1, uniqueVisitors);
                    updateHeroOnlineDisplay();
                })
                .on("presence", { event: "leave" }, () => {
                    const state = channel.presenceState();
                    const uniqueVisitors = Object.keys(state || {}).length;
                    realVisitorsCount = Math.max(1, uniqueVisitors);
                    updateHeroOnlineDisplay();
                })
                .subscribe(async (status) => {
                    if (status === "SUBSCRIBED") {
                        await channel.track({
                            online_at: Date.now(),
                            page: window.location.pathname
                        });
                    }
                });

            // Clean up presence on page unload
            window.addEventListener("beforeunload", () => {
                try {
                    channel.untrack();
                } catch (e) {}
            });
        } catch (err) {
            console.warn("Supabase Realtime Presence not available:", err);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initRealtimePresence);
    } else {
        initRealtimePresence();
    }
})();
