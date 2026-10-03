(function() {
    const SUPABASE_URL = "https://yawadxzeyyrozmlrokun.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhd2FkeHpleXlyb3ptbHJva3VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMzQ4MTIsImV4cCI6MjEwMDkxMDgxMn0.B53O3gHURnfxUkVGKaZJ5ssx27Bj9FNMU70Yn85tfxE";
    const totalVisitors = document.querySelector("#total-visitors");
    const VISITOR_KEY = "zhserver_last_visit";
    const DEVICE_ID_KEY = "zhserver_device_id";
    const SIMULATED_BASE_KEY = "zhserver_simulated_base";
    const LAST_BASE_UPDATE_KEY = "zhserver_simulated_ts";

    // ================= 1. VISITOR STATISTICS (FOOTER) =================
    const counterScriptUrl = document.currentScript?.src;
    const statFields = ["today", "yesterday", "week", "month", "total"];
    let visitorWidget = null;
    let legacyStats = null;
    let periodStats = null;
    let statsLoading = false;
    let lastStatsDate = null;

    function readVisitorStorage(key) {
        for (const store of ["localStorage", "sessionStorage"]) {
            try {
                const value = window[store].getItem(key);
                if (value) return value;
            } catch (_) { /* Use session storage when persistent storage is blocked. */ }
        }
        return null;
    }

    function writeVisitorStorage(key, value) {
        for (const store of ["localStorage", "sessionStorage"]) {
            try {
                window[store].setItem(key, value);
                return true;
            } catch (_) { /* Without either store, read statistics without registering. */ }
        }
        return false;
    }

    function getStatsDeviceId() {
        const stored = readVisitorStorage(DEVICE_ID_KEY);
        if (stored) return stored;
        const id = "zh_" + (window.crypto?.randomUUID?.() || Math.random().toString(36).slice(2) + "_" + Date.now().toString(36));
        return writeVisitorStorage(DEVICE_ID_KEY, id) ? id : null;
    }

    function berlinDate(date = new Date()) {
        const parts = new Intl.DateTimeFormat("en-GB", {
            timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit"
        }).formatToParts(date);
        const part = (type) => parts.find((item) => item.type === type).value;
        return `${part("year")}-${part("month")}-${part("day")}`;
    }

    function visitorLanguage() {
        return window.ZHLanguage?.language || (readVisitorStorage("zh_language") === "en" ? "en" : "de");
    }

    function visitorText(key, params = {}) {
        const copy = window.ZHTranslations.messages[key][visitorLanguage()];
        return copy.replace(/\{(\w+)\}/g, (match, name) => String(params[name] ?? match));
    }

    async function loadVisitorTranslations() {
        const translationsReady = () => Boolean(window.ZHTranslations?.messages["visitor.stats.title"] &&
            window.ZHTranslations?.messages["visitor.stats.partial"]);
        if (translationsReady()) return true;
        if (!counterScriptUrl) return false;
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = new URL("translations.js?v=20261003-visitor-persistence", counterScriptUrl).href;
            script.onload = () => resolve(translationsReady());
            script.onerror = () => resolve(false);
            document.head.append(script);
        });
    }

    function createVisitorWidget() {
        const original = totalVisitors?.closest(".site-footer .footer-visitor");
        if (!original) return;
        const stylesheet = document.createElement("link");
        stylesheet.rel = "stylesheet";
        stylesheet.href = new URL("../css/visitor-stats.css?v=20260930-visitor-periods", counterScriptUrl).href;
        document.head.append(stylesheet);
        visitorWidget = document.createElement("section");
        visitorWidget.className = "visitor-stats";
        visitorWidget.setAttribute("data-i18n-ignore", "");
        visitorWidget.setAttribute("aria-labelledby", "visitor-stats-title");
        visitorWidget.innerHTML = `<h4 id="visitor-stats-title" class="visitor-stats-title"></h4>
            <dl class="visitor-stats-grid">${statFields.map((field) => `<div class="visitor-stat visitor-stat-${field}">
                <dt data-visitor-label="${field}"></dt><dd data-visitor-value="${field}">—</dd>
            </div>`).join("")}</dl>`;
        const totalValue = visitorWidget.querySelector('[data-visitor-value="total"]');
        totalValue.removeAttribute("data-visitor-value");
        totalValue.replaceChildren(totalVisitors);
        totalVisitors.setAttribute("data-visitor-value", "total");
        original.replaceWith(visitorWidget);
    }

    function visitorCount(value) {
        if (typeof value !== "number" && typeof value !== "string") return null;
        if (typeof value === "string" && !/^\d+$/.test(value.trim())) return null;
        const count = Number(value);
        return Number.isSafeInteger(count) && count >= 0 ? count : null;
    }

    function visitorPeriodCount(field) {
        const complete = periodStats?.[`${field}_complete`];
        // Partial periods contain real recorded DAILY sums, not today's error fallback.
        // A false flag is usable only with the actual start of that recorded history.
        if (complete !== undefined && complete !== true &&
            (complete !== false || !visitorTrackingStart())) return null;
        return visitorCount(periodStats?.[`${field}_visitors`]);
    }

    function visitorTrackingStart() {
        const value = periodStats?.tracking_started_at;
        if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T/.test(value)) return null;
        const date = new Date(value);
        return Number.isFinite(date.getTime()) && date.getTime() <= Date.now() ? date : null;
    }

    function visitorPartialPeriod(field, started) {
        if (!started || field === "total") return false;
        if (field !== "today") return periodStats?.[`${field}_complete`] === false;
        const startTime = new Intl.DateTimeFormat("en-GB", {
            timeZone: "Europe/Berlin", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23"
        }).format(started);
        return berlinDate(started) === berlinDate() && (startTime !== "00:00:00" || started.getMilliseconds() !== 0);
    }

    function renderVisitorStats() {
        if (!visitorWidget) return;
        const language = visitorLanguage();
        const locale = language === "en" ? "en-GB" : "de-DE";
        visitorWidget.lang = language;
        visitorWidget.setAttribute("aria-busy", String(statsLoading));
        visitorWidget.querySelector(".visitor-stats-title").textContent = visitorText("visitor.stats.title");
        const values = {
            total: visitorCount(periodStats?.total_visitors) ?? visitorCount(legacyStats?.total_visitors),
            today: visitorCount(periodStats?.today_visitors) ??
                (legacyStats?.today_date === berlinDate() ? visitorCount(legacyStats.today_visitors) : null)
        };
        // Today's count is a lower bound for the current week and month. It does
        // not reconstruct previous days. Check each field; a real zero wins.
        const fallbackPeriods = new Set();
        const started = visitorTrackingStart();
        for (const field of ["yesterday", "week", "month"]) {
            values[field] = visitorPeriodCount(field);
            if (field !== "yesterday" && values[field] === null && values.today !== null) {
                values[field] = values.today;
                fallbackPeriods.add(field);
            }
        }
        for (const field of statFields) {
            visitorWidget.querySelector(`[data-visitor-label="${field}"]`).textContent = visitorText(`visitor.stats.${field}`);
            const value = visitorWidget.querySelector(`[data-visitor-value="${field}"]`);
            value.textContent = values[field] === null ? "—" : values[field].toLocaleString(locale);
            const isFallback = fallbackPeriods.has(field);
            const isPartial = !isFallback && values[field] !== null && visitorPartialPeriod(field, started);
            value.toggleAttribute("data-visitor-fallback", isFallback);
            value.toggleAttribute("data-visitor-partial", isPartial);
            if (isFallback) {
                const minimum = visitorText("visitor.stats.minimum", { count: value.textContent });
                value.title = minimum;
                value.setAttribute("aria-label", `${visitorText(`visitor.stats.${field}`)}: ${minimum}`);
            } else if (isPartial) {
                const coverage = visitorText("visitor.stats.partial", {
                    count: value.textContent,
                    date: started.toLocaleString(locale, { timeZone: "Europe/Berlin", dateStyle: "short", timeStyle: "short" })
                });
                value.title = coverage;
                value.setAttribute("aria-label", `${visitorText(`visitor.stats.${field}`)}: ${coverage}`);
            } else {
                value.removeAttribute("title");
                value.removeAttribute("aria-label");
            }
        }
    }

    async function callVisitorStats(functionName, params = {}) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${functionName}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": SUPABASE_KEY
                },
                body: JSON.stringify(params),
                signal: controller.signal
            });
            if (!response.ok) return null;
            const data = await response.json();
            const row = Array.isArray(data) ? data[0] : data;
            return row !== null && typeof row === "object" && !Array.isArray(row) ? row : null;
        } catch (e) {
            return null;
        } finally {
            clearTimeout(timeout);
        }
    }

    async function refreshVisitorStats() {
        if (!visitorWidget || statsLoading) return;
        statsLoading = true;
        renderVisitorStats();
        const deviceId = getStatsDeviceId();
        const fetchStats = async () => {
            const savedVisit = Number(readVisitorStorage(VISITOR_KEY) || 0);
            const lastVisit = Number.isFinite(savedVisit) && savedVisit <= Date.now() ? savedVisit : 0;
            // Preserve the inherited total counter's once-per-24-hours behaviour.
            const newVisit = deviceId && (!lastVisit || Date.now() - lastVisit >= 24 * 60 * 60 * 1000);
            legacyStats = await callVisitorStats(newVisit ? "register_visitor" : "get_visitor_stats");
            if (newVisit && visitorCount(legacyStats?.total_visitors) !== null) writeVisitorStorage(VISITOR_KEY, String(Date.now()));
            // The server deduplicates each calendar day and sums its recorded daily counts.
            periodStats = await callVisitorStats(deviceId ? "register_visitor_period" : "get_visitor_period_stats", deviceId ? { p_device_id: deviceId } : {});
        };
        try {
            if (deviceId && navigator.locks?.request) await navigator.locks.request("zhserver_visitor_stats", fetchStats);
            else await fetchStats();
        } finally {
            lastStatsDate = berlinDate();
            statsLoading = false;
            renderVisitorStats();
        }
    }

    async function initVisitorStats() {
        if (!totalVisitors || !await loadVisitorTranslations()) return;
        createVisitorWidget();
        document.addEventListener("zh:languagechange", renderVisitorStats);
        window.addEventListener("storage", (event) => {
            if (event.key === "zh_language") renderVisitorStats();
        });
        // Refresh on a new Berlin calendar day, including tabs kept open overnight.
        const refreshOnNewDay = () => {
            if (!document.hidden && lastStatsDate !== berlinDate()) refreshVisitorStats();
        };
        document.addEventListener("visibilitychange", refreshOnNewDay);
        setInterval(refreshOnNewDay, 60000);
        await refreshVisitorStats();
    }

    initVisitorStats().catch(() => {
        statsLoading = false;
        renderVisitorStats();
    });

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
