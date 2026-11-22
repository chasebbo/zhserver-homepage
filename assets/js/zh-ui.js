/* Homepage-Umbau November 2026: gemeinsame Kleinigkeiten für alle Homepage-Seiten.
   Keine Netzwerkaufrufe, keine Zähl- oder Anwesenheitsaufrufe. */
(() => {
    "use strict";
    if (window.ZHUi) return;

    // Vorbereitete Teile. Erst einschalten, wenn es dafür echte Daten gibt bzw. die Version live ist.
    const FEATURES = {
        gates: false,       // Tore der Safezone, kommt mit v132
        hordeRadio: false,  // Funk-Countdown zur nächsten Horde
        radioTicker: false, // Funk-Ticker mit den Meldungen aus dem Spiel, braucht "radio" in get_world_status (Entwurf 22.11.2026)
        serverPing: false,  // Ping des Spielservers
        serverUptime: false,// Laufzeit des Spielservers
        heroVideo: false,   // kurzes Video im Startbild
        worldStatus: true,  // Weltlage aus get_world_status (v132); bis die Abfrage antwortet: "derzeit nicht verfügbar"
        worldZombieTotal: true, // "Zombies erledigt" statt Top 5; bis get_world_zombie_total antwortet: "derzeit nicht verfügbar"
        playerStats: false, // Rang, Level, EP im Profil, braucht get_public_player_stats
        playerRanks: false  // Rang-Abzeichen im Forum, braucht get_player_ranks und die Abzeichen
    };
    const RELEASES = {
        v131: true          // Ladetext "etwa eine Minute" und der Kasten "Die Vorgeschichte" auf der Startseite
    };

    function applySwitches(root = document) {
        root.querySelectorAll("[data-zh-feature]").forEach(el => el.classList.toggle("is-on", FEATURES[el.dataset.zhFeature] === true));
        root.querySelectorAll("[data-zh-release]").forEach(el => el.classList.toggle("is-on", RELEASES[el.dataset.zhRelease] === true));
        root.querySelectorAll("[data-zh-until]").forEach(el => { el.hidden = RELEASES[el.dataset.zhUntil] === true; });
        root.querySelectorAll("[data-zh-feature-off]").forEach(el => { el.hidden = FEATURES[el.dataset.zhFeatureOff] === true; });
        // Links auf vorbereitete Seiten bekommen ihr Ziel erst, wenn die Seite freigegeben ist.
        root.querySelectorAll("[data-zh-href]").forEach(link => {
            const box = link.closest("[data-zh-release]");
            if (box && box.classList.contains("is-on")) link.setAttribute("href", link.dataset.zhHref);
            else link.removeAttribute("href");
        });
    }

    // Unten rechts "NACH OBEN"
    function toTop() {
        if (document.querySelector(".zh-to-top")) return;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "zh-to-top";
        button.textContent = "NACH OBEN";
        button.addEventListener("click", () => {
            const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
            const target = document.querySelector(".header.zh-site-header a, a, button");
            target?.focus({ preventScroll: true });
        });
        document.body.append(button);
        const update = () => button.classList.toggle("is-visible", window.scrollY > 500);
        window.addEventListener("scroll", update, { passive: true });
        update();
    }

    // Schriftzug "Zombiehölle Survival" im Kopf und im Startbild: zweifarbig, daher je Teil über die Übersetzungen gebunden
    function brand() {
        document.querySelectorAll("[data-zh-msg]").forEach(element => window.ZHLanguage?.bind(element, element.dataset.zhMsg));
    }

    // Spielseite: "Vollbild" im Spielrahmen vor dem Start zeigt nur den Spielrahmen bildschirmfüllend, nie die ganze Seite.
    // Läuft das Spiel, gilt die Technik der Live-Seite aus game-entry.js: Vollbild nur für das Spiel-iframe.
    function fullscreen() {
        document.querySelectorAll("[data-zh-fullscreen]").forEach(button => {
            const area = button.closest(".zh-play-frame");
            button.hidden = !area?.requestFullscreen;
            if (button.hidden) return;
            button.addEventListener("click", () => {
                if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
                else area.requestFullscreen().catch(() => {});
            });
            const label = () => {
                const text = document.fullscreenElement === area ? "Vollbild verlassen" : "Vollbild";
                button.textContent = window.ZHLanguage?.text(text) ?? text;
            };
            // Wer das Vollbild des Spiels verlässt, landet wieder auf der Seite und nicht im Vollbild des Rahmens.
            let last = null;
            document.addEventListener("fullscreenchange", () => {
                if (document.fullscreenElement === area && last && last !== area) document.exitFullscreen().catch(() => {});
                last = document.fullscreenElement;
                label();
            });
            document.addEventListener("zh:languagechange", label);
        });
    }

    // Kopf der Spielfigur neben dem Namen (Entwurf 22.11.2026, Sebastian 19:30): nur Forum, Profil und "Neu dabei",
    // nur mit echtem Kopfbild aus dem Spiel. Ohne Bild gibt es nichts, auch kein Ersatzsymbol. Mit ?kopf=beispiel nur fürs Entwurfsbild.
    const headExample = new URLSearchParams(location.search).get("kopf") === "beispiel";
    function head(url, size) {
        if (headExample && !url) url = "/assets/images/kopf-beispiel.png";
        if (typeof url !== "string" || !/^(https:\/\/[a-z0-9.-]+\/|\/)[^\s"'<>]+\.(png|webp|jpg)(\?[^\s"'<>]*)?$/i.test(url)) return null;
        const node = document.createElement("span"), img = document.createElement("img");
        node.className = "zh-head" + (["s", "m", "l"].includes(size) ? " zh-head-" + size : ""); node.setAttribute("aria-hidden", "true");
        img.src = url; img.alt = ""; img.loading = "lazy"; img.decoding = "async";
        img.addEventListener("error", () => node.remove(), { once: true });
        node.append(img); return node;
    }

    applySwitches();
    brand();
    toTop();
    fullscreen();
    window.ZHUi = Object.freeze({ features: Object.freeze({ ...FEATURES }), releases: Object.freeze({ ...RELEASES }), applySwitches, head });
})();
