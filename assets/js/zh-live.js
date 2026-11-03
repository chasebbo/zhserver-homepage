/* Weltlage aus get_world_status() von Opus 3 (v132): Kachel auf Startseite und game.html, Liste der Orte auf weltlage.html.
   Nur lesende Abfragen, keine Zähl- oder Anwesenheitsaufrufe. Keine Spielerzahl (Sebastian 03.11.2026).
   Antwortform nach HOMEPAGE-UEBERGABE-WELTLAGE.md, anpassen nur in parseWorld(). Schalter worldStatus in zh-ui.js. */
(() => {
    "use strict";
    const ui = window.ZHUi, lang = window.ZHLanguage, identity = window.ZHIdentity;
    if (!ui || !lang || !document.querySelector("[data-world-card], [data-world-places]")) return;
    const INTERVAL = 60000;
    let timer = null, lastLoad = 0;

    async function call(name) {
        const client = identity?.client;
        // game.html legt den öffentlichen Schlüssel unter anderem Namen an
        const key = typeof SUPABASE_KEY === "string" ? SUPABASE_KEY : typeof supabaseAnonKey === "string" ? supabaseAnonKey : null;
        if (!client || !key) throw new Error("unavailable");
        // Öffentliche Abfrage ohne die Sitzung des Besuchers, wie beim Changelog-Balken.
        const { data, error } = await client.rpc(name, {}).setHeader("Authorization", "Bearer " + key).abortSignal(AbortSignal.timeout(10000));
        if (error) throw error;
        return data;
    }
    function flash(el) {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        el.classList.remove("is-flash");
        void el.offsetWidth;
        el.classList.add("is-flash");
        el.addEventListener("animationend", () => el.classList.remove("is-flash"), { once: true });
    }

    // Die vier Zustände und die 12 Orte in fester Reihenfolge, Namen DE und EN nach der Übergabe
    const STATES = ["militaer", "ueberlebende", "infiziert", "umkaempft"];
    const STATE_NAMES = { militaer: ["Militär", "Military"], ueberlebende: ["Überlebende", "Survivors"], infiziert: ["Infiziert", "Infected"], umkaempft: ["Umkämpft", "Contested"] };
    const PLACES = {
        safezone: ["Safezone", "Safe Zone"], hof_ost: ["Hof Ost", "East Farm"], steinbruch_ost: ["Steinbruch Ost", "East Quarry"],
        altdorf: ["Altdorf", "Altdorf"], tankstelle_ost: ["Tankstelle Ost", "East Gas Station"], konvoi: ["Ausgebrannter Konvoi", "Burnt-Out Convoy"],
        grenzstadt: ["Grenzstadt", "Grenzstadt"], kontrollpunkt_ost: ["Kontrollpunkt Ost", "East Checkpoint"], militaerbasis_ost: ["Militärbasis Ost", "Military Base East"],
        portal_ost: ["Portal Ost", "East Portal"], gefaengnis: ["Gefängnis", "Prison"], handelsposten_nw: ["Handelsposten Nordwest", "Northwest Trading Post"]
    };
    const en = () => lang.language === "en";

    // Antwort: {online, reported_at, percents: {militaer, ueberlebende, infiziert, umkaempft}, places: [{id, name, state}]}.
    // Nur online: true mit vier ganzen Zahlen, die zusammen 100 ergeben, gilt; sonst null ("derzeit nicht verfügbar").
    function parseWorld(data) {
        const r = Array.isArray(data) ? data[0] : data;
        if (r?.online !== true) return null;
        const percents = STATES.map(key => r.percents?.[key]);
        if (!percents.every(v => Number.isInteger(v) && v >= 0 && v <= 100) || percents.reduce((a, b) => a + b, 0) !== 100) return null;
        const places = new Map();
        for (const p of Array.isArray(r.places) ? r.places : []) {
            if (p && typeof p.id === "string" && STATES.includes(p.state)) places.set(p.id, { name: typeof p.name === "string" ? p.name.trim() : "", state: p.state });
        }
        return { percents, places };
    }
    // Höchstens 60 Sekunden zwischengespeichert, nur für den ersten Aufruf einer Seite; danach jede Minute frisch.
    // Eine ungültige Antwort oder ein Fehler löscht den Zwischenspeicher, damit nie alte Werte als live erscheinen.
    const cacheKey = "zh_world_status_v1";
    const forget = () => { try { localStorage.removeItem(cacheKey); } catch (_) { /* nur Zwischenspeicher */ } };
    async function readWorld(useCache) {
        if (useCache) {
            try {
                const saved = JSON.parse(localStorage.getItem(cacheKey) || "null"), age = Date.now() - Number(saved?.at);
                const cached = saved && age >= 0 && age < INTERVAL ? parseWorld(saved.data) : null;
                if (cached) return cached;
            } catch (_) { /* ohne Speicher direkt fragen */ }
        }
        const data = await call("get_world_status");
        const world = parseWorld(data);
        if (!world) forget();
        else try { localStorage.setItem(cacheKey, JSON.stringify({ data, at: Date.now() })); } catch (_) { /* nur Zwischenspeicher */ }
        return world;
    }

    // Kachel: vier Prozente in ihren Farben und der Farbbalken; Aufleuchten nur bei echter Änderung eines Wertes
    function renderCards(world, changed) {
        document.querySelectorAll("[data-world-card]").forEach(card => {
            const status = card.querySelector("[data-world-status]");
            card.querySelector(".zh-wl-values").hidden = !world;
            card.querySelector(".zh-wl-bar").hidden = !world;
            status.hidden = Boolean(world);
            status.textContent = world ? "" : lang.t("ranks.unavailable");
            if (!world) return;
            STATES.forEach((key, index) => {
                const value = world.percents[index];
                const number = card.querySelector(`[data-world-value="${key}"] .zh-wl-num`);
                number.textContent = en() ? value + "%" : value + " %";
                if (changed?.[index]) flash(number);
                const share = card.querySelector(`[data-world-share="${key}"]`);
                share.style.flexGrow = String(value);
                share.hidden = value === 0;
            });
        });
    }
    // Seite "Weltlage ansehen": Zustand je Ort; ohne gültige Antwort nur die Namen und "derzeit nicht verfügbar"
    function renderPlaces(world) {
        const list = document.querySelector("[data-world-places]");
        if (!list) return;
        const status = document.querySelector("[data-world-page-status]");
        if (status) {
            status.hidden = Boolean(world);
            status.textContent = world ? "" : lang.t("ranks.unavailable");
        }
        list.querySelectorAll("[data-place]").forEach(item => {
            const names = PLACES[item.dataset.place], got = world?.places.get(item.dataset.place);
            if (names) item.querySelector("[data-place-name]").textContent = en() ? names[1] : (got?.name || names[0]);
            const state = item.querySelector("[data-place-state]");
            state.hidden = !got;
            state.dataset.state = got ? got.state : "";
            state.querySelector("[data-place-state-text]").textContent = got ? STATE_NAMES[got.state][en() ? 1 : 0] : "";
        });
    }

    let current = null, firstLoad = true;
    async function loadWorld() {
        let world = null;
        if (ui.features.worldStatus) {
            try { world = await readWorld(firstLoad); } catch (_) { forget(); }
        }
        firstLoad = false;
        const changed = world && current ? world.percents.map((value, index) => value !== current.percents[index]) : null;
        current = world;
        renderCards(world, changed);
        renderPlaces(world);
    }
    document.addEventListener("zh:languagechange", () => { renderCards(current, null); renderPlaces(current); });

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
