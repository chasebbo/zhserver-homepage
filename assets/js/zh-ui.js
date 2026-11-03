/* Homepage-Umbau November 2026: gemeinsame Kleinigkeiten für alle Homepage-Seiten.
   Keine Netzwerkaufrufe, keine Zähl- oder Anwesenheitsaufrufe. */
(() => {
    "use strict";
    if (window.ZHUi) return;

    // Vorbereitete Teile. Erst einschalten, wenn es dafür echte Daten gibt bzw. die Version live ist.
    const FEATURES = {
        gates: false,       // Tore der Safezone, kommt mit v132
        hordeRadio: false,  // Funk-Countdown zur nächsten Horde
        serverPing: false,  // Ping des Spielservers
        serverUptime: false,// Laufzeit des Spielservers
        heroVideo: false,   // kurzes Video im Startbild
        worldStatus: false, // Weltlage, erst mit echten Werten (heute erzeugt world-status.js nur ein Konzept)
        worldZombieTotal: false, // "Zombies erledigt" statt Top 5, braucht get_world_zombie_total
        playerStats: false, // Rang, Level, EP im Profil, braucht get_public_player_stats
        playerRanks: false  // Rang-Abzeichen im Forum, braucht get_player_ranks und die Abzeichen
    };
    const RELEASES = {
        v131: false         // Seite "Geschichte" (Projekt TIEFENLICHT) und der neue Ladetext
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

    applySwitches();
    toTop();
    window.ZHUi = Object.freeze({ features: Object.freeze({ ...FEATURES }), releases: Object.freeze({ ...RELEASES }), applySwitches });
})();
