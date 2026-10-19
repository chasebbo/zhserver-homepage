/* Local concept only. No game/server telemetry, accounts or network requests.
 * Both pages read the same small state; a future data source can replace the
 * scheduled concept transfer while keeping render() and the shared markup.
 */
(() => {
    "use strict";

    const panels = [...document.querySelectorAll(".zh-world-status")];
    if (!panels.length) return;

    const fields = ["military", "survivors", "infected", "contested"];
    const baseline = [72, 18, 7, 3];
    const storageKey = "zh_world_concept_v1";
    const minDelay = 120000;
    const maxDelay = 240000;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer;

    function validValues(values) {
        return Array.isArray(values) && values.length === baseline.length &&
            values.every((value, index) => Number.isInteger(value) && value >= 0 && Math.abs(value - baseline[index]) <= 5) &&
            values.reduce((sum, value) => sum + value, 0) === 100;
    }

    function readState() {
        try {
            const saved = JSON.parse(localStorage.getItem(storageKey));
            if (saved && validValues(saved.values) && Number.isSafeInteger(saved.updatedAt) &&
                Number.isSafeInteger(saved.nextAt) && saved.updatedAt <= Date.now() &&
                saved.nextAt - saved.updatedAt >= minDelay && saved.nextAt - saved.updatedAt <= maxDelay) return saved;
        } catch (_) { /* Storage disabled or invalid: use this page's in-memory state. */ }
        return null;
    }

    function saveState(next) {
        try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch (_) { /* In-memory fallback. */ }
    }

    function makeState(values) {
        const updatedAt = Date.now();
        return { values, updatedAt, nextAt: updatedAt + minDelay + Math.floor(Math.random() * (maxDelay - minDelay + 1)) };
    }

    let state = readState();
    if (!state) {
        state = makeState([...baseline]);
        saveState(state);
    }

    function render(animate = false) {
        panels.forEach((panel) => {
            fields.forEach((field, index) => {
                const value = panel.querySelector(`[data-world-value="${field}"]`);
                const number = value?.querySelector(".zh-world-number");
                const segment = panel.querySelector(`.zh-world-${field}`);
                if (number) {
                    const text = `${state.values[index]} %`;
                    const changed = number.textContent !== text;
                    if (changed) number.textContent = text;
                    if (changed && animate && !reducedMotion.matches) value.classList.add("is-changing");
                }
                segment?.style.setProperty("--world-share", state.values[index]);
            });
        });
    }

    // Move only 1–2 points between two factions. Every possible transfer is
    // checked against the original bounds, so drift can never accumulate.
    function nextValues(values) {
        const transfers = [];
        values.forEach((fromValue, from) => {
            values.forEach((toValue, to) => {
                if (from === to) return;
                for (let amount = 1; amount <= 2; amount += 1) {
                    if (fromValue - amount >= Math.max(0, baseline[from] - 5) &&
                        toValue + amount <= baseline[to] + 5) transfers.push({ from, to, amount });
                }
            });
        });
        const transfer = transfers[Math.floor(Math.random() * transfers.length)];
        const next = [...values];
        next[transfer.from] -= transfer.amount;
        next[transfer.to] += transfer.amount;
        return next;
    }

    function schedule() {
        window.clearTimeout(timer);
        if (!document.hidden) timer = window.setTimeout(tick, Math.max(0, state.nextAt - Date.now()));
    }

    function tick() {
        if (document.hidden) return;
        // Another tab may already have advanced the same concept. Read before
        // changing anything; delayed/background tabs never replay missed ticks.
        state = readState() || state;
        if (Date.now() >= state.nextAt) {
            state = makeState(nextValues(state.values));
            saveState(state);
        }
        render(true);
        schedule();
    }

    panels.forEach((panel) => {
        panel.addEventListener("animationend", (event) => {
            if (event.animationName === "zh-world-change") event.target.closest("[data-world-value]")?.classList.remove("is-changing");
        });
    });
    window.addEventListener("storage", (event) => {
        if (event.key !== storageKey) return;
        state = readState() || state;
        render(!document.hidden);
        schedule();
    });
    function onVisibilityChange() {
        panels.forEach((panel) => panel.toggleAttribute("data-world-paused", document.hidden));
        if (document.hidden) window.clearTimeout(timer);
        else tick();
    }
    document.addEventListener("visibilitychange", onVisibilityChange);
    // pagehide stops timers, pageshow also covers restoration from back/forward cache.
    window.addEventListener("pagehide", () => window.clearTimeout(timer));
    window.addEventListener("pageshow", onVisibilityChange);
    reducedMotion.addEventListener("change", () => {
        panels.forEach((panel) => panel.querySelectorAll(".is-changing").forEach((value) => value.classList.remove("is-changing")));
    });

    render();
    onVisibilityChange();
})();
