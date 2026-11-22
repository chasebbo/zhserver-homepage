/* Local alpha entry: central identity and the delivered v118 iframe remain authoritative. */
(() => {
    "use strict";
    if (!document.body.classList.contains("game-entry-page")) return;

    const serverUrl = "wss://ws.zhserver.de/ws";
    // Current upper bound for the one-time graphics preparation on a first start.
    const firstStartMinutes = 4;
    const language = window.ZHLanguage;
    const identity = window.ZHIdentity;
    const wrapper = document.getElementById("game-wrapper");
    const frame = document.getElementById("spiel-starten");
    // Stage mode (game covers the browser window) is enabled per page via data-game-stage.
    // The iframe is only restyled; it is never moved or recreated, so the auth bridge keeps its target.
    const stagePage = document.body.hasAttribute("data-game-stage");
    let stageActive = false, stageScrollY = 0;
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
    bind("[data-game-register-hint]", "registerHint");
    bind("[data-game-retry]", "retry");
    bind("[data-game-load-hint]", "loadHint", { minutes: firstStartMinutes });
    show("[data-game-load-hint]", true);

    function renderAccess() {
        const member = principal.status === "member";
        const guest = principal.status === "guest";
        const noName = principal.status === "nameRequired";
        const unavailable = principal.status === "unavailable";
        // A pending Google account first completes terms, rules and its player name.
        const pending = noName && principal.consentPending === true;
        bind("[data-game-welcome]", member ? "welcome" : guest ? "signInNote" :
            pending ? "consentRequired" : noName ? "nameRequired" : unavailable ? "accountUnavailable" : "checkAccount",
            { name: principal.displayName || "" });
        bind("[data-game-profile]", pending ? "finish" : "profile");
        all("[data-game-profile]").forEach(link => {
            link.href = pending ? identity.finishUrl(window.location.href) : "profile/";
        });
        show("[data-game-welcome]", member || noName || unavailable);
        show("[data-game-start]", member);
        show("[data-game-login]", guest || unavailable);
        show("[data-game-profile]", noName);
        show("[data-game-primary-action]", member || guest || noName || unavailable);
        show("[data-game-register-hint]", guest);
        all("[data-game-start]").forEach(button => {
            button.disabled = !member || serverStatus !== "online" || starting;
        });
        // Since v132 the game needs an account; there is no guest trial.
        if (!member) {
            wrapper.hidden = true;
            wrapper.classList.remove("is-game-active");
        }
        show("[data-game-controls]", member && !wrapper.hidden);
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
            // Transport reachability only: no game login or gameplay messages.
            socket = new WebSocket(serverUrl);
            socket.onopen = () => finish("online");
            socket.onerror = socket.onclose = () => finish("offline");
            probeTimer = setTimeout(() => finish("offline"), 6000);
        } catch (_) {
            finish("offline");
        }
    }

    async function startGame() {
        if (starting || serverStatus !== "online" || principal.status !== "member") return;
        starting = true;
        renderAccess();
        try {
            // Recheck the existing identity after the click, including logout/account-switch races.
            const verified = await identity.resolve();
            if (verified.status !== "member" || principal.status !== "member" ||
                verified.userId !== principal.userId || serverStatus !== "online") return;
            const source = frame.getAttribute("src") ? null : gamePackageSource(frame);
            // Ohne WebGL2 kein Ladeversuch: der Hinweis steht dann statt des Ladehinweises unter dem Startknopf.
            if (source === false) {
                bind("[data-game-load-hint]", "noWebgl2");
                show("[data-game-load-hint]", true);
                return;
            }
            wrapper.hidden = false;
            if (source) {
                const url = new URL(source, window.location.href);
                const server = params.get("server");
                // A shared link must not redirect an account-bearing client to another server.
                if (server === serverUrl) url.searchParams.set("server", server);
                frame.src = url.href;
            }
            if (stagePage) enterStage();
            else wrapper.scrollIntoView({ behavior: "auto", block: "start" });
            // Started from the fullscreen play frame: the game itself takes over fullscreen, as with the stage bar button.
            const fullscreenArea = document.fullscreenElement;
            if (fullscreenArea && fullscreenArea !== frame && fullscreenArea.contains(frame)) {
                if (fillDesktop()) void enterFill();
                else void frame.requestFullscreen().catch(() => {});
            }
        } finally {
            starting = false;
            renderAccess();
        }
    }

    // Wählt das Spielpaket und schreibt die Wahl mit Grund in die Konsole. Ohne WebGL2: false, dann kein Ladeversuch.
    function gamePackageSource(frame) {
        let gl = null;
        try { gl = document.createElement("canvas").getContext("webgl2"); } catch (_) { /* Dann ohne WebGL2. */ }
        if (!gl) {
            console.log("[SPIEL] Kein Paket: Browser ohne WebGL2");
            return false;
        }
        const pick = (kind, reason) => {
            console.log("[SPIEL] Paket " + kind + " (" + reason + ")");
            return kind === "handy" && frame.dataset.srcHandy ? frame.dataset.srcHandy : frame.dataset.src;
        };
        if (!frame.dataset.srcHandy) return pick(/-handy\./.test(frame.dataset.src) ? "handy" : "pc", "nur ein Paket auf dieser Seite");
        const etc2 = !!gl.getExtension("WEBGL_compressed_texture_etc");
        const s3tc = !!gl.getExtension("WEBGL_compressed_texture_s3tc");
        const agent = navigator.userAgent;
        // iPads mit M-Chip melden S3TC und ETC2 und geben sich als Macintosh mit Touch aus.
        const appleMobile = /iPhone|iPad|iPod/.test(agent) || (/Macintosh/.test(agent) && navigator.maxTouchPoints > 1);
        if (appleMobile && etc2) return pick("handy", s3tc ? "Apple-Mobilgerät mit ETC2, S3TC gemeldet" : "Apple-Mobilgerät mit ETC2");
        // Nur ETC2 und kein S3TC: das Paket für Handys. Alles andere: das Paket für den PC.
        if (etc2 && !s3tc) return pick("handy", "ETC2 ohne S3TC");
        return pick("pc", s3tc ? "S3TC vorhanden" : "kein ETC2");
    }

    // A focused game canvas scrolls its iframe into view without regard to the fixed header.
    // Keep the top edge of the game visible; the client shows its compact loading bar there.
    function revealGameTop() {
        const header = document.querySelector(".header");
        if (stageActive || wrapper.hidden || !header || !/^(fixed|sticky)$/.test(getComputedStyle(header).position)) return;
        const covered = header.getBoundingClientRect().bottom + 12 - wrapper.getBoundingClientRect().top;
        if (covered > 0) window.scrollBy({ top: -covered, behavior: "auto" });
    }
    // Focus moving into the iframe blurs this window; the iframe element gets no focus event then.
    window.addEventListener("blur", () => requestAnimationFrame(() => {
        if (document.activeElement === frame) revealGameTop();
    }));

    function renderStage() {
        if (!stagePage) return;
        const running = !!frame.getAttribute("src");
        document.documentElement.classList.toggle("zh-game-running", running);
        show("[data-game-stage-resume-wrap]", running && !stageActive);
    }
    function enterStage() {
        if (!stagePage || stageActive || wrapper.hidden) return;
        stageActive = true;
        stageScrollY = window.scrollY;
        // iOS ignores overflow on the body; fixing the body keeps the page still behind the game.
        document.body.style.top = -stageScrollY + "px";
        document.documentElement.classList.add("zh-game-stage");
        syncStageViewport();
        renderStage();
        focusGame();
    }
    // Mobile browser bars change the visible area while the page is fixed; the stage follows it.
    function syncStageViewport() {
        const view = window.visualViewport, style = document.documentElement.style;
        if (!stageActive || !view) {
            style.removeProperty("--zh-stage-height");
            style.removeProperty("--zh-stage-top");
            return;
        }
        style.setProperty("--zh-stage-height", view.height + "px");
        style.setProperty("--zh-stage-top", view.offsetTop + "px");
    }
    // Godot reads keys from its focused canvas; the iframe document alone is not enough.
    function focusGame() {
        try {
            const canvas = frame.contentDocument?.getElementById("canvas");
            if (canvas) { canvas.focus(); return; }
        } catch (_) { /* Same origin is expected; fall back to the frame itself. */ }
        frame.focus();
    }
    function leaveStage() {
        // Leaves only the stage; the game keeps running in its unchanged iframe.
        if (!stageActive) return;
        stageActive = false;
        leaveFill();
        if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
        document.documentElement.classList.remove("zh-game-stage");
        syncStageViewport();
        document.body.style.top = "";
        window.scrollTo({ top: stageScrollY, behavior: "instant" });
        renderStage();
    }
    if (stagePage) {
        bind("[data-game-stage-leave]", "stageLeave");
        bind("[data-game-stage-leave-short]", "stageLeaveShort");
        bind("[data-game-stage-resume]", "stageResume");
        bind("#game-mobile-overlay p", "stageRunning");
        bind("#btn-activate-game", "stageResume");
        all("[data-game-stage-key]").forEach(element =>
            language.bind(element, "game.entry.stageKey." + element.dataset.gameStageKey));
        all("[data-game-stage-keys]").forEach(element => language.bind(element, "game.entry.stageKeys", {}, "aria-label"));
        bind("[data-game-stage-rotate-text]", "stageRotate");
        bind("[data-game-stage-rotate-ok]", "stageRotateOk");
        // The turn-sideways card is shown once per browser session; CSS limits it to narrow upright touch screens.
        const rotateKey = "zh_stage_rotate_seen";
        let rotateSeen = false;
        try { rotateSeen = sessionStorage.getItem(rotateKey) === "1"; } catch (_) { /* Memory only. */ }
        show("[data-game-stage-rotate]", !rotateSeen);
        all("[data-game-stage-rotate-ok]").forEach(button => button.addEventListener("click", () => {
            show("[data-game-stage-rotate]", false);
            try { sessionStorage.setItem(rotateKey, "1"); } catch (_) { /* Memory only. */ }
            focusGame();
        }));
        window.visualViewport?.addEventListener("resize", syncStageViewport);
        window.visualViewport?.addEventListener("scroll", syncStageViewport);
        all("[data-game-stage-leave-button]").forEach(button => button.addEventListener("click", leaveStage));
        // Playing field size on the desktop stage; pages without these buttons keep their size.
        const stageSizeButtons = [...all("[data-game-stage-size]")], stageSizeKey = "zh_game_stage_size", stageSizeDefault = "mittel";
        const applyStageSize = size => {
            document.documentElement.dataset.zhStageSize = size;
            stageSizeButtons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.gameStageSize === size)));
        };
        if (stageSizeButtons.length) {
            bind('[data-game-stage-size="klein"]', "stageSizeSmall");
            bind('[data-game-stage-size="mittel"]', "stageSizeMedium");
            bind('[data-game-stage-size="gross"]', "stageSizeLarge");
            all("[data-game-stage-sizes]").forEach(element => language.bind(element, "game.entry.stageSize", {}, "aria-label"));
            let savedSize = null;
            try { savedSize = localStorage.getItem(stageSizeKey); } catch (_) { /* The default size applies. */ }
            applyStageSize(stageSizeButtons.some(button => button.dataset.gameStageSize === savedSize) ? savedSize : stageSizeDefault);
            stageSizeButtons.forEach(button => button.addEventListener("click", () => {
                applyStageSize(button.dataset.gameStageSize);
                try { localStorage.setItem(stageSizeKey, button.dataset.gameStageSize); } catch (_) { /* Convenience only. */ }
                focusGame();
            }));
        }
        all("[data-game-stage-resume], #btn-activate-game").forEach(button => button.addEventListener("click", enterStage));
        // Only a real page exit ends the game, so the browser's own leave prompt is used for that case.
        window.addEventListener("beforeunload", event => {
            if (!frame.getAttribute("src")) return;
            event.preventDefault();
            event.returnValue = "";
        });
        renderStage();
    }

    all("[data-game-start]").forEach(button => button.addEventListener("click", () => void startGame()));
    all("[data-game-retry]").forEach(button => button.addEventListener("click", probeServer));
    if (identity) identity.subscribe(state => { principal = state; renderAccess(); });
    else { principal = { status: "unavailable" }; renderAccess(); }

    // Fensterfüllendes Vollbild am PC (Fund 163): kein Browser-Vollbild, deshalb beendet ESC es nicht.
    // Nur auf Bühnen-Seiten mit Maus; Handy und Tablet (auch iPads mit Trackpad) behalten das bisherige Vollbild.
    const keyboardLock = !!(navigator.keyboard && typeof navigator.keyboard.lock === "function");
    let fillActive = false, fillLeaving = false, fillNoteSource = "", fillNoteTimer = 0, fillReturnTimer = 0;
    let fillExit = null, fillReturn = null, fillNote = null;
    function fillDesktop() {
        const agent = navigator.userAgent;
        const appleMobile = /iPhone|iPad|iPod/.test(agent) || (/Macintosh/.test(agent) && navigator.maxTouchPoints > 1);
        return stagePage && !appleMobile && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    }
    if (stagePage) {
        fillExit = document.createElement("button");
        fillExit.type = "button";
        fillExit.className = "game-fill-exit";
        fillExit.setAttribute("data-i18n-ignore", "");
        fillExit.textContent = language.text("VOLLBILD VERLASSEN");
        fillExit.addEventListener("click", () => leaveFill());
        fillReturn = document.createElement("button");
        fillReturn.type = "button";
        fillReturn.className = "game-fill-return";
        fillReturn.setAttribute("data-i18n-ignore", "");
        fillReturn.hidden = true;
        fillReturn.textContent = language.text("Zurück ins Vollbild");
        fillReturn.addEventListener("click", async () => {
            hideFillReturn();
            if (await enterRealFullscreen() === "denied") showFillReturn();
            focusGame();
        });
        fillNote = document.createElement("p");
        fillNote.className = "game-fill-note";
        fillNote.setAttribute("role", "status");
        fillNote.setAttribute("data-i18n-ignore", "");
        fillNote.hidden = true;
        wrapper.append(fillExit, fillReturn, fillNote);
    }
    // Jeder Hinweis erscheint einmal pro Browsersitzung kurz oben in der Mitte.
    function showFillNote(key, source) {
        let seen = false;
        try { seen = sessionStorage.getItem(key) === "1"; } catch (_) { /* Then shown again next time. */ }
        if (seen || !fillNote) return;
        try { sessionStorage.setItem(key, "1"); } catch (_) { /* Memory only. */ }
        fillNoteSource = source;
        fillNote.textContent = language.text(source);
        fillNote.hidden = false;
        clearTimeout(fillNoteTimer);
        fillNoteTimer = setTimeout(() => { fillNote.hidden = true; fillNoteSource = ""; }, 4500);
    }
    function showFillReturn() {
        if (!fillReturn) return;
        fillReturn.hidden = false;
        clearTimeout(fillReturnTimer);
        fillReturnTimer = setTimeout(hideFillReturn, 8000);
    }
    function hideFillReturn() {
        clearTimeout(fillReturnTimer);
        if (fillReturn) fillReturn.hidden = true;
    }
    function unlockEscape() {
        try { if (keyboardLock) navigator.keyboard.unlock(); } catch (_) { /* Nothing was locked. */ }
    }
    // Echtes Vollbild nur mit ESC-Sperre: kurzes ESC geht an das Spiel, langes Halten verlässt das Vollbild.
    // Gelingt die Sperre nicht, bleibt es beim fensterfüllenden Spiel ohne Browser-Vollbild.
    async function enterRealFullscreen() {
        if (!keyboardLock || !document.documentElement.requestFullscreen) return "nolock";
        try {
            if (document.fullscreenElement !== document.documentElement) await document.documentElement.requestFullscreen({ navigationUI: "hide" });
        } catch (_) { return "denied"; }
        try {
            await navigator.keyboard.lock(["Escape"]);
            return true;
        } catch (_) {
            fillLeaving = true;
            await document.exitFullscreen().catch(() => {});
            return "nolock";
        }
    }
    async function enterFill() {
        if (!stagePage || wrapper.hidden) return;
        enterStage();
        fillActive = true;
        document.documentElement.classList.add("zh-game-fill");
        hideFillReturn();
        updateFullscreen();
        // Erst das Vollbild anfordern, dann den Fokus ans Spiel geben: Chrome lehnt die Anfrage sonst ab.
        const real = await enterRealFullscreen();
        if (real === true) showFillNote("zh_fill_note_esc", "Zum Verlassen ESC gedrückt halten");
        else {
            // Ein Vollbild aus der Zeit vor dem Start (Spielrahmen) wird nicht weitergeführt: ESC soll beim Spiel bleiben.
            if (document.fullscreenElement) { fillLeaving = true; await document.exitFullscreen().catch(() => {}); }
            const mac = /Mac/.test(navigator.platform || navigator.userAgent);
            if (real === "denied") showFillReturn();
            else showFillNote("zh_fill_note_key", mac ? "Für ganz ohne Leiste Ctrl + Cmd + F drücken" : "Für ganz ohne Leiste F11 drücken");
        }
        updateFullscreen();
        focusGame();
    }
    function leaveFill() {
        if (!fillActive) return;
        fillActive = false;
        document.documentElement.classList.remove("zh-game-fill");
        hideFillReturn();
        if (fillNote) { fillNote.hidden = true; fillNoteSource = ""; }
        unlockEscape();
        if (document.fullscreenElement) { fillLeaving = true; void document.exitFullscreen().catch(() => {}); }
        updateFullscreen();
        if (stageActive) focusGame();
    }

    // The stage bar has its own fullscreen button; both share one handler.
    const fullscreenButtons = [document.getElementById("game-fullscreen"), ...all("[data-game-fullscreen]")];
    const fullscreenMessage = document.getElementById("fullscreen-message");
    let fullscreenSource = "";
    const fullscreenText = source => { fullscreenSource = source; fullscreenMessage.textContent = language.text(source); };
    fullscreenButtons.forEach(button => button.addEventListener("click", async () => {
        if (fillDesktop()) {
            if (fillActive) leaveFill();
            else await enterFill();
            return;
        }
        try {
            if (document.fullscreenElement) await document.exitFullscreen();
            else if (frame.requestFullscreen) await frame.requestFullscreen();
            else fullscreenText("Vollbild wird von diesem Browser nicht unterstuetzt.");
        } catch (_) {
            fullscreenText("Vollbild wurde vom Browser nicht geoeffnet. Bitte erneut versuchen.");
        }
    }));
    // Browsers without element fullscreen (iPhone Safari) use the stage itself instead.
    show("[data-game-fullscreen]", !!frame.requestFullscreen);
    const updateFullscreen = () => {
        fullscreenButtons.forEach(button => {
            button.textContent = language.text(document.fullscreenElement || fillActive ? "VOLLBILD VERLASSEN" : "VOLLBILD");
        });
        if (fillExit) fillExit.textContent = language.text("VOLLBILD VERLASSEN");
        if (fillReturn) fillReturn.textContent = language.text("Zurück ins Vollbild");
        if (fillNoteSource) fillNote.textContent = language.text(fillNoteSource);
        if (fullscreenSource) fullscreenMessage.textContent = language.text(fullscreenSource);
        // Keyboard input belongs to the game again after entering or leaving fullscreen in the stage.
        if (stageActive) focusGame();
    };
    document.addEventListener("fullscreenchange", updateFullscreen);
    document.addEventListener("zh:languagechange", updateFullscreen);
    // Endet das echte Vollbild, ohne dass es über den Eckknopf verlassen wurde, bleibt das Spiel fensterfüllend
    // und ein Knopf bietet kurz die Rückkehr an. Die ESC-Sperre gilt nur im Vollbild und wird dann gelöst.
    document.addEventListener("fullscreenchange", () => {
        if (document.fullscreenElement) return;
        unlockEscape();
        if (fillActive && !fillLeaving && keyboardLock) showFillReturn();
        fillLeaving = false;
    });
    document.getElementById("btn-activate-game").addEventListener("click", () => {
        // On stage pages this button re-enters the stage instead.
        if (!stagePage) wrapper.classList.add("is-game-active");
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
