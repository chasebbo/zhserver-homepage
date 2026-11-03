/* Startbild: Bilder aus dem Spiel im Hintergrund. Klick auf ein Vorschaubild blendet weich über, von allein etwa alle 7 s.
   Pause bei Maus oder Fokus im Startbild, bei verborgenem Tab und bei prefers-reduced-motion. Nur die nötigen Bilder laden. */
(() => {
    "use strict";
    const box = document.querySelector("[data-hero-slides]");
    const thumbs = [...document.querySelectorAll(".zh-hero-thumb")];
    if (!box || thumbs.length < 2) return;
    const hero = box.closest(".zh-hero") || box;
    const layers = [...box.querySelectorAll(".zh-hero-image")];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const INTERVAL = 7000;
    let current = 0, index = 0, hovered = false, timer = null, ticket = 0;

    function preload(i) {
        const image = new Image();
        image.decoding = "async";
        image.src = thumbs[i % thumbs.length].dataset.src;
    }
    function show(i) {
        if (i === index) return;
        index = i;
        thumbs.forEach((button, j) => button.setAttribute("aria-pressed", String(j === i)));
        const next = layers[1 - current], before = layers[current], mine = ++ticket;
        next.src = thumbs[i].dataset.src;
        const swap = () => {
            if (mine !== ticket) return;
            next.alt = thumbs[i].getAttribute("aria-label");
            next.removeAttribute("aria-hidden");
            next.classList.add("is-current");
            before.classList.remove("is-current");
            before.alt = "";
            before.setAttribute("aria-hidden", "true");
            current = 1 - current;
            preload(i + 1);
        };
        (next.decode ? next.decode() : Promise.resolve()).then(swap, swap);
    }
    function schedule() {
        clearTimeout(timer);
        if (reduced.matches || hovered || document.hidden) return;
        timer = setTimeout(() => { show((index + 1) % thumbs.length); schedule(); }, INTERVAL);
    }
    thumbs.forEach((button, i) => button.addEventListener("click", () => { show(i); schedule(); }));
    for (const [type, value] of [["mouseenter", true], ["mouseleave", false], ["focusin", true], ["focusout", false]]) {
        hero.addEventListener(type, () => { hovered = value; schedule(); });
    }
    document.addEventListener("visibilitychange", schedule);
    reduced.addEventListener?.("change", schedule);
    preload(1);
    schedule();
})();
