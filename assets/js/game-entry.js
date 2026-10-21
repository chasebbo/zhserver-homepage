/* Local alpha entry: central identity and the delivered v118 iframe remain authoritative. */
(() => {
    "use strict";
    if (!document.body.classList.contains("game-entry-page")) return;

    // Delivered v118 and the production Dedicated both use a 120000 ms guest lease.
    // The client/server enforce the duration; the homepage does not create a timer.
    const guestTrialReady = true;
    const serverUrl = "wss://ws.zhserver.de/ws";
    const language = window.ZHLanguage;
    const identity = window.ZHIdentity;
    const wrapper = document.getElementById("game-wrapper");
    const frame = document.getElementById("spiel-starten");
    const params = new URLSearchParams(window.location.search);
    let principal = { status: "checking" };
    let serverStatus = "checking";
    // Only world 1 is probed today. Planned worlds have no reachability claim.
    // Future world probes can update their own record and reuse this renderer.
    const serverWorlds = [
        { id: "1", state: "checking" },
        { id: "2", state: "planned" },
        { id: "3", state: "planned" }
    ];
    let socket, probeTimer, pollingTimer, probeRevision = 0, starting = false;
    // Time of the last completed probe only; there is no stored "offline since".
    let lastCheckedAt = null;
    let autoStart = params.has("play") || params.has("test") || params.has("dev") || window.location.hash === "#spiel-starten";

    const all = selector => document.querySelectorAll(selector);
    const bind = (selector, key, values = {}) =>
        all(selector).forEach(element => language.bind(element, "game.entry." + key, values));
    const show = (selector, visible) => all(selector).forEach(element => { element.hidden = !visible; });

    bind("[data-game-start]", "play");
    bind("[data-game-login]", "play");
    bind("[data-game-profile]", "profile");
    bind("[data-game-guest]", "guest");
    bind("[data-game-register-hint]", "registerHint");
    bind("[data-game-guest-hint]", "guestWorldHint");
    bind("[data-game-retry]", "retry");
    language.bind(document.getElementById("game-guest-note"), "game.entry.guestPending");

    function renderAccess() {
        const member = principal.status === "member";
        const guest = principal.status === "guest";
        const noName = principal.status === "nameRequired";
        const unavailable = principal.status === "unavailable";
        bind("[data-game-welcome]", member ? "welcome" : guest ? "signInNote" :
            noName ? "nameRequired" : unavailable ? "accountUnavailable" : "checkAccount",
            { name: principal.displayName || "" });
        show("[data-game-welcome]", member || noName || unavailable);
        show("[data-game-start]", member);
        show("[data-game-login]", guest || unavailable);
        show("[data-game-profile]", noName);
        show("[data-game-primary-action]", member || guest || noName || unavailable);
        show("[data-game-guest-action]", member || guest);
        show("[data-game-register-hint]", guest);
        show("[data-game-guest-hint]", guestTrialReady && guest && serverStatus === "online" && !starting);
        show("[data-game-guest-options]", member || guest);
        show("#game-guest-note", (member || guest) && !guestTrialReady);
        all("[data-game-start]").forEach(button => {
            button.disabled = !member || serverStatus !== "online" || starting;
        });
        all("[data-game-guest]").forEach(button => {
            button.disabled = !guestTrialReady || !guest || serverStatus !== "online" || starting;
        });
        if (!member && !guestTrialReady) {
            wrapper.hidden = true;
            wrapper.classList.remove("is-game-active");
        }
        show("[data-game-controls]", (member || guest) && !wrapper.hidden);
        if (member && serverStatus === "online" && autoStart) {
            autoStart = false;
            void startGame();
        }
    }

    function renderServer(status) {
        serverStatus = status;
        serverWorlds[0].state = status;
        renderServerWorlds();
        const message = status === "online" ? "serverReady" :
            status === "offline" ? "serverOffline" : "serverChecking";
        bind("[data-game-server-status]", status);
        bind("[data-game-server-message]", message);
        all("[data-game-server-status]").forEach(element => { element.dataset.state = status; });
        show("[data-game-retry]", status === "offline");
        renderOfflineNote();
        renderAccess();
    }

    function renderServerWorlds() {
        const checking = serverWorlds.some(world => world.state === "checking");
        const online = serverWorlds.filter(world => world.state === "online").length;
        bind("[data-game-world-count]", checking ? "worldsChecking" : "worldsOnline",
            { online, total: serverWorlds.length });
        all("[data-game-world-segments]").forEach(element =>
            language.bind(element, "game.entry.worlds", {}, "aria-label"));
        all("[data-game-world]").forEach(element => {
            const world = serverWorlds.find(item => item.id === element.dataset.gameWorld);
            if (!world) return;
            element.dataset.state = world.state;
            const key = "game.entry.worldState." + world.state;
            language.bind(element, key, { number: world.id }, "aria-label");
            language.bind(element, key, { number: world.id }, "title");
        });
    }

    function renderOfflineNote() {
        const offline = serverStatus === "offline";
        show("[data-game-offline-note]", offline);
        show("[data-game-last-check]", offline && !!lastCheckedAt);
        if (!offline) return;
        bind("[data-game-offline-note]", "offlineNote");
        if (lastCheckedAt) {
            const time = new Intl.DateTimeFormat(language.locale, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(lastCheckedAt);
            bind("[data-game-last-check]", "lastCheck", { time });
        }
    }

    function cancelProbe() {
        clearTimeout(probeTimer);
        if (socket) {
            socket.onopen = socket.onerror = socket.onclose = null;
            socket.close();
            socket = null;
        }
    }

    function probeServer() {
        const revision = ++probeRevision;
        cancelProbe();
        // Keep the last result during refreshes; the checking feedback changes layout.
        // Only the initial probe has no completed result to display yet.
        if (!lastCheckedAt) renderServer("checking");
        let completed = false;
        const finish = status => {
            if (completed || revision !== probeRevision) return;
            completed = true;
            cancelProbe();
            lastCheckedAt = new Date();
            renderServer(status);
        };
        try {
            // Transport reachability only: no game login, guest creation or gameplay messages.
            socket = new WebSocket(serverUrl);
            socket.onopen = () => finish("online");
            socket.onerror = socket.onclose = () => finish("offline");
            probeTimer = setTimeout(() => finish("offline"), 6000);
        } catch (_) {
            finish("offline");
        }
    }

    async function startGame(asGuest = false) {
        const expectedStatus = asGuest ? "guest" : "member";
        if (starting || serverStatus !== "online" || principal.status !== expectedStatus ||
            (asGuest && !guestTrialReady)) return;
        starting = true;
        renderAccess();
        try {
            // Recheck the existing identity after the click, including logout/account-switch races.
            const verified = await identity.resolve();
            if (verified.status !== expectedStatus || principal.status !== expectedStatus ||
                (!asGuest && verified.userId !== principal.userId) || serverStatus !== "online") return;
            wrapper.hidden = false;
            if (!frame.getAttribute("src")) {
                const url = new URL(frame.dataset.src, window.location.href);
                const server = params.get("server");
                // A shared link must not redirect an account-bearing client to another server.
                if (server === serverUrl) url.searchParams.set("server", server);
                frame.src = url.href;
            }
            wrapper.scrollIntoView({ behavior: "auto", block: "start" });
        } finally {
            starting = false;
            renderAccess();
        }
    }

    all("[data-game-start]").forEach(button => button.addEventListener("click", () => void startGame()));
    all("[data-game-retry]").forEach(button => button.addEventListener("click", probeServer));
    all("[data-game-guest]").forEach(button => button.addEventListener("click", () => void startGame(true)));
    if (identity) identity.subscribe(state => { principal = state; renderAccess(); });
    else { principal = { status: "unavailable" }; renderAccess(); }

    const fullscreenButton = document.getElementById("game-fullscreen");
    const fullscreenMessage = document.getElementById("fullscreen-message");
    let fullscreenSource = "";
    const fullscreenText = source => { fullscreenSource = source; fullscreenMessage.textContent = language.text(source); };
    fullscreenButton.addEventListener("click", async () => {
        try {
            if (document.fullscreenElement) await document.exitFullscreen();
            else if (frame.requestFullscreen) await frame.requestFullscreen();
            else fullscreenText("Vollbild wird von diesem Browser nicht unterstuetzt.");
        } catch (_) {
            fullscreenText("Vollbild wurde vom Browser nicht geoeffnet. Bitte erneut versuchen.");
        }
    });
    const updateFullscreen = () => {
        fullscreenButton.textContent = language.text(document.fullscreenElement ? "VOLLBILD VERLASSEN" : "VOLLBILD");
        if (fullscreenSource) fullscreenMessage.textContent = language.text(fullscreenSource);
    };
    document.addEventListener("fullscreenchange", updateFullscreen);
    document.addEventListener("zh:languagechange", updateFullscreen);
    document.getElementById("btn-activate-game").addEventListener("click", () => {
        wrapper.classList.add("is-game-active");
    });
    document.getElementById("btn-deactivate-game").addEventListener("click", () => {
        wrapper.classList.remove("is-game-active");
    });

    const beginPolling = () => {
        clearInterval(pollingTimer);
        pollingTimer = setInterval(() => { if (!document.hidden) probeServer(); }, 60000);
    };
    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) probeServer();
    });
    window.addEventListener("pagehide", () => {
        ++probeRevision;
        cancelProbe();
        clearInterval(pollingTimer);
    });
    window.addEventListener("pageshow", event => {
        if (event.persisted) { probeServer(); beginPolling(); void identity?.resolve(); }
    });
    probeServer();
    beginPolling();
})();
