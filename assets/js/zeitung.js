/* Geschichte: Zeitungsausschnitte erscheinen beim Scrollen der Reihe nach.
   Ohne Skript oder mit Wunsch nach weniger Bewegung sind alle sofort sichtbar. Keine Netzwerkaufrufe. */
(() => {
    "use strict";
    const line = document.querySelector(".zh-news-line");
    if (!line || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = Array.from(line.querySelectorAll(".zh-news-item"));
    line.classList.add("zh-news-js");
    let shown = 0;
    let queue = Promise.resolve();
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const index = items.indexOf(entry.target);
            // Alles bis zu diesem Ausschnitt nacheinander zeigen, damit keiner übersprungen wird.
            while (shown <= index) {
                const item = items[shown++];
                observer.unobserve(item);
                queue = queue.then(() => { item.classList.add("is-in"); return wait(220); });
            }
        });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });
    items.forEach((item) => observer.observe(item));
})();
