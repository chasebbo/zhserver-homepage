/* Ränge und Zombie-Zähler (Idee Sebastian 03.11.2026). Vorbereitet und versteckt, bis die Abfragen von Opus 3 live sind.
   Schalter in zh-ui.js: worldZombieTotal, playerStats, playerRanks. Ohne eingeschalteten Schalter keine Abfrage.
   Die Form der Antworten ist vorläufig; maßgeblich wird HOMEPAGE-UEBERGABE-RAENGE.md. Anpassen nur in read*(). */
(() => {
    "use strict";
    const ui = window.ZHUi, lang = window.ZHLanguage, identity = window.ZHIdentity;
    if (!ui || !lang) return;
    const on = name => ui.features[name] === true;

    // Rangtabelle: Stufe, EP ab, Schlüssel im Katalog (rank.1 … rank.8)
    const RANKS = [[1, 0], [2, 250], [3, 600], [4, 1100], [5, 1800], [6, 2700], [7, 3800], [8, 10000]];
    // Abzeichen zeichnet Opus 3; nach Freigabe hier den Pfad eintragen, z. B. "assets/images/ranks/rank-{n}.webp". Bis dahin kein Bild.
    const BADGE_SRC = null;
    const root = new URL("../../", document.currentScript?.src || location.href);
    const rankName = n => lang.t("rank." + n);
    const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function badge(rank, size) {
        if (!BADGE_SRC || !Number.isInteger(rank) || rank < 1 || rank > 8) return null;
        const img = document.createElement("img");
        img.className = "zh-rank-badge";
        img.src = new URL(BADGE_SRC.replace("{n}", rank), root).href;
        img.width = img.height = size;
        img.alt = rankName(rank);
        img.title = rankName(rank);
        img.decoding = "async";
        return img;
    }
    async function call(name, args) {
        const client = identity?.client;
        if (!client) throw new Error("unavailable");
        const { data, error } = await client.rpc(name, args).abortSignal(AbortSignal.timeout(10000));
        if (error) throw error;
        return data;
    }
    const int = v => Number.isSafeInteger(v) && v >= 0 ? v : null;
    const row = data => Array.isArray(data) ? data[0] : data;

    // ---------- vorläufige Antwortformen, nach der Übergabe anpassen ----------
    // Zombies erledigt nach HOMEPAGE-UEBERGABE-ZOMBIEZAEHLER.md: Antwort {"total": n}. Eine Wochenzahl gibt es nicht.
    // Etwa 5 Minuten zwischengespeichert; eine ältere Zahl wird nie gezeigt, auch nicht bei einem Fehler.
    const totalKey = "zh_world_zombie_total_v1", totalMaxAge = 5 * 60 * 1000;
    async function readWorldTotal() {
        try {
            const saved = JSON.parse(localStorage.getItem(totalKey) || "null");
            if (saved && Date.now() - saved.at >= 0 && Date.now() - saved.at < totalMaxAge && int(saved.total) !== null) return { total: saved.total };
        } catch (_) { /* ohne Speicher direkt fragen */ }
        const r = row(await call("get_world_zombie_total", {}));
        const total = int(r?.total);
        if (total !== null) try { localStorage.setItem(totalKey, JSON.stringify({ total, at: Date.now() })); } catch (_) { /* nur Zwischenspeicher */ }
        return { total };
    }
    async function readPlayerStats(userId) {
        const r = row(await call("get_public_player_stats", { p_user_id: userId }));
        return { rank: int(r?.rank), level: int(r?.level), xp: int(r?.xp), zombies: int(r?.zombies ?? r?.zombie_kills), days: int(r?.survival_days ?? r?.days) };
    }
    async function readRanks(userIds) {
        const rows = await call("get_player_ranks", { p_user_ids: userIds });
        const map = new Map();
        for (const r of Array.isArray(rows) ? rows : []) if (r && typeof r.user_id === "string" && int(r.rank)) map.set(r.user_id, r.rank);
        return map;
    }
    // ---------------------------------------------------------------------------

    // 1. Startseite: "Zombies erledigt" auf dem ganzen Server, zählt sichtbar hoch
    function countTo(el, value) {
        const from = Number(el.dataset.value || 0);
        el.dataset.value = String(value);
        if (reduced() || from === value) { el.textContent = value.toLocaleString(lang.locale); return; }
        const start = performance.now(), span = 1400;
        const tick = now => {
            const k = Math.min(1, (now - start) / span), eased = 1 - Math.pow(1 - k, 3);
            el.textContent = Math.round(from + (value - from) * eased).toLocaleString(lang.locale);
            if (k < 1 && el.dataset.value === String(value)) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }
    // Hochzählen erst, wenn die Kachel im Bild ist, damit man es auch sieht
    function whenVisible(el, fn) {
        if (!("IntersectionObserver" in window)) return fn();
        const io = new IntersectionObserver(entries => {
            if (entries.some(e => e.isIntersecting)) { io.disconnect(); fn(); }
        }, { threshold: 0.4 });
        io.observe(el);
    }
    async function worldTotal() {
        const card = document.querySelector(".zh-zombie-total");
        if (!card || !on("worldZombieTotal")) return;
        const number = card.querySelector("[data-zombie-total]"), status = card.querySelector("[data-zombie-status]");
        // "auf dem ganzen Server" und "Gezählt seit 31.10.2026." nur zusammen mit der Zahl
        const scope = card.querySelectorAll("[data-zombie-scope]");
        try {
            const data = await readWorldTotal();
            if (data.total === null) throw new Error("unavailable");
            status.hidden = true;
            scope.forEach(line => { line.hidden = false; });
            whenVisible(card, () => countTo(number, data.total));
        } catch (_) {
            number.textContent = "";
            delete number.dataset.value;
            scope.forEach(line => { line.hidden = true; });
            status.hidden = false;
            status.textContent = lang.t("ranks.unavailable");
        }
    }

    // 2. Profil: Rang, Level, EP-Balken, Zombies, Überlebenstage
    async function profileStats() {
        const box = document.querySelector(".zh-player-stats");
        if (!box || !on("playerStats") || !identity) return;
        const render = async state => {
            if (!state.userId) return;
            const status = box.querySelector("[data-stats-status]");
            try {
                const s = await readPlayerStats(state.userId);
                if (s.rank === null) throw new Error("unavailable");
                const next = RANKS.find(([n]) => n === s.rank + 1), current = RANKS.find(([n]) => n === s.rank);
                box.querySelector("[data-stats-badge]").replaceChildren(...[badge(s.rank, 64)].filter(Boolean));
                box.querySelector("[data-stats-rank]").textContent = rankName(s.rank);
                box.querySelector("[data-stats-level]").textContent = s.level === null ? "" : lang.t("ranks.level", { level: s.level });
                const bar = box.querySelector("[data-stats-bar]"), barText = box.querySelector("[data-stats-xp]");
                if (next && current && s.xp !== null) {
                    const share = Math.max(0, Math.min(1, (s.xp - current[1]) / (next[1] - current[1])));
                    bar.style.width = (share * 100).toFixed(1) + "%";
                    barText.textContent = lang.t("ranks.xpToNext", { xp: s.xp.toLocaleString(lang.locale), next: next[1].toLocaleString(lang.locale), rank: rankName(next[0]) });
                } else {
                    bar.style.width = "100%";
                    barText.textContent = s.xp === null ? "" : lang.t("ranks.xpMax", { xp: s.xp.toLocaleString(lang.locale) });
                }
                box.querySelector("[data-stats-zombies]").textContent = s.zombies === null ? "" : s.zombies.toLocaleString(lang.locale);
                box.querySelector("[data-stats-days]").textContent = s.days === null ? "" : s.days.toLocaleString(lang.locale);
                status.hidden = true;
                box.querySelector("[data-stats-body]").hidden = false;
            } catch (_) {
                box.querySelector("[data-stats-body]").hidden = true;
                status.hidden = false;
                status.textContent = lang.t("ranks.unavailable");
            }
        };
        identity.subscribe?.(render);
        render(identity.state);
    }

    // 3. Forum: kleines Abzeichen neben jedem Namen, eine Abfrage je Ansicht
    function forumBadges() {
        const main = document.getElementById("forum-main");
        if (!main || !on("playerRanks") || !BADGE_SRC) return;
        const known = new Map();
        let timer = null, busy = false;
        const ids = () => [...main.querySelectorAll('a[href*="#profile/"]')]
            .map(a => (a.getAttribute("href").split("#profile/")[1] || "").split(/[/?#]/)[0])
            .filter(id => /^[0-9a-f-]{36}$/i.test(id));
        function paint() {
            for (const a of main.querySelectorAll('a[href*="#profile/"]')) {
                const id = (a.getAttribute("href").split("#profile/")[1] || "").split(/[/?#]/)[0];
                const rank = known.get(id);
                const prev = a.previousElementSibling?.classList.contains("zh-rank-badge") ? a.previousElementSibling : null;
                if (!rank) { prev?.remove(); continue; }
                if (prev && prev.dataset.rank === String(rank)) continue;
                const img = badge(rank, 16);
                if (!img) continue;
                img.dataset.rank = String(rank);
                prev ? prev.replaceWith(img) : a.before(img);
            }
        }
        async function load() {
            const missing = [...new Set(ids())].filter(id => !known.has(id));
            if (!missing.length || busy) return paint();
            busy = true;
            try {
                const map = await readRanks(missing);
                for (const id of missing) known.set(id, map.get(id) || 0);
            } catch (_) {
                for (const id of missing) known.set(id, 0);
            } finally { busy = false; }
            paint();
        }
        new MutationObserver(() => { clearTimeout(timer); timer = setTimeout(load, 400); }).observe(main, { childList: true, subtree: true });
        load();
    }

    worldTotal();
    profileStats();
    forumBadges();
    document.addEventListener("zh:languagechange", () => { worldTotal(); });
    window.ZHRanks = Object.freeze({ ranks: RANKS.map(([n, xp]) => ({ rank: n, xp })) });
})();
