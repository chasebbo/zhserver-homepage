/* Startseite: echte Live-Werte im Lagezentrum. Nur lesende Abfragen, keine Zähl- oder Anwesenheitsaufrufe.
   Keine Anzeige der Spieler online (Sebastian 03.11.2026).
   Weltlage: get_world_status() von Opus 3 (v132), versteckt hinter dem Schalter worldStatus in zh-ui.js.
   Die Antwortform der Weltlage ist vorläufig; maßgeblich wird HOMEPAGE-UEBERGABE-WELTLAGE.md (nur readWorld() anpassen). */
(() => {
    "use strict";
    const ui = window.ZHUi, lang = window.ZHLanguage, identity = window.ZHIdentity;
    if (!ui || !lang || !document.querySelector(".zh-lage-grid")) return;
    const INTERVAL = 60000;
    let timer = null, lastLoad = 0;

    async function call(name) {
        const client = identity?.client;
        const key = typeof SUPABASE_KEY === "string" ? SUPABASE_KEY : null;
        if (!client || !key) throw new Error("unavailable");
        // Öffentliche Abfrage ohne die Sitzung des Besuchers, wie beim Changelog-Balken.
        const { data, error } = await client.rpc(name, {}).setHeader("Authorization", "Bearer " + key).abortSignal(AbortSignal.timeout(10000));
        if (error) throw error;
        return data;
    }
    function flash(el) {
        el.classList.remove("is-flash");
        void el.offsetWidth;
        el.classList.add("is-flash");
    }

    // Weltlage: vier Prozente aus dem Spiel; Aufleuchten nur bei echter Änderung
    const world = document.querySelector(".zh-world-card");
    const FIELDS = ["military", "survivors", "infected", "contested"];
    let worldValues = null;
    async function readWorld() {
        const r = await call("get_world_status");
        const row = Array.isArray(r) ? r[0] : r;
        const values = FIELDS.map(field => row?.[field]);
        if (!values.every(v => Number.isFinite(v) && v >= 0 && v <= 100)) throw new Error("unavailable");
        return values.map(v => Math.round(v));
    }
    async function loadWorld() {
        if (!world || !ui.features.worldStatus) return;
        const status = world.querySelector("[data-world-status]");
        try {
            const values = await readWorld();
            FIELDS.forEach((field, index) => {
                const box = world.querySelector(`[data-world-value="${field}"]`);
                const number = box.querySelector(".zh-world-number");
                number.textContent = values[index] + " %";
                if (worldValues && worldValues[index] !== values[index]) flash(number);
                world.querySelector(".zh-world-" + field)?.style.setProperty("--world-share", String(values[index]));
            });
            worldValues = values;
            world.querySelector(".zh-world-values").hidden = false;
            world.querySelector(".zh-world-bar").hidden = false;
            status.hidden = true;
        } catch (_) {
            worldValues = null;
            world.querySelector(".zh-world-values").hidden = true;
            world.querySelector(".zh-world-bar").hidden = true;
            status.hidden = false;
            status.textContent = lang.t("ranks.unavailable");
        }
    }

    function tick() {
        clearTimeout(timer);
        if (document.hidden) return;
        // Höchstens etwa einmal pro Minute, auch beim Zurückwechseln in den Tab
        const wait = INTERVAL - (Date.now() - lastLoad);
        if (lastLoad && wait > 1000) { timer = setTimeout(tick, wait); return; }
        lastLoad = Date.now();
        loadWorld();
        timer = setTimeout(tick, INTERVAL);
    }
    document.addEventListener("visibilitychange", () => { if (!document.hidden) tick(); else clearTimeout(timer); });
    tick();
})();
