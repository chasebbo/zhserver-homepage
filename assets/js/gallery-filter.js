/* Galerie: Filter zwischen Spielbildern, Archiv, Community-Uploads und Videos. Nur Anzeige, keine Netzwerkaufrufe. */
(() => {
    "use strict";
    const nav = document.querySelector("[data-gallery-filter]");
    if (!nav) return;
    const groups = [...document.querySelectorAll("[data-gallery-group]")];
    function show(filter) {
        nav.querySelectorAll("button").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.filter === filter)));
        groups.forEach(group => { group.hidden = filter !== "all" && group.dataset.galleryGroup !== filter; });
    }
    nav.addEventListener("click", event => {
        const button = event.target.closest("button[data-filter]");
        if (button) show(button.dataset.filter);
    });
    // Der Upload-Link im Kopf führt zu den Community-Bildern
    document.querySelectorAll("[data-gallery-upload-link]").forEach(link => link.addEventListener("click", () => show("all")));
})();
