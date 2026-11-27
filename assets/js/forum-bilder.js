/* Bilder im Forum (27.11.2026): anhängen beim neuen Thema und bei der Antwort, anzeigen im Beitrag und in der Vorschau.
   Hochladen über ZHBildHochladen (derselbe Speicher wie die Galerie). Im Beitragstext steht pro Bild eine eigene Zeile
   [bild:<uuid>.<png|jpg|webp>]; nur solche Zeilen werden zu Bildern, alles andere bleibt einfacher Text. */
(() => {
    "use strict";
    if (window.ZHForumBilder) return;
    const MAX_IMAGES = 4;
    const LINE = /^\[bild:([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(?:png|jpg|webp))\]$/;
    const lang = () => window.ZHLanguage;
    const client = () => window.ZHForum?.client;
    const urlFor = name => window.ZHBildHochladen?.urlFor(client(), name) || null;

    function names(text) {
        return String(text || "").split("\n").map(line => line.trim().match(LINE)?.[1]).filter(Boolean);
    }

    // Füllt ein Element mit dem Beitragstext; Bildzeilen werden zu Bildern (höchstens vier).
    function fill(element, text) {
        const parts = []; let buffer = [], shown = 0;
        const flush = () => { if (buffer.length) parts.push(document.createTextNode(buffer.join("\n"))); buffer = []; };
        for (const line of String(text || "").split("\n")) {
            const name = line.trim().match(LINE)?.[1], url = name && shown < MAX_IMAGES ? urlFor(name) : null;
            if (!url) { buffer.push(line); continue; }
            flush(); shown++;
            const link = document.createElement("a"), img = document.createElement("img");
            link.className = "forum-post-image"; link.href = url; link.target = "_blank"; link.rel = "noopener noreferrer";
            img.src = url; img.alt = lang()?.t("forum.imageAlt") || "Bild im Beitrag"; img.loading = "lazy"; img.decoding = "async";
            img.addEventListener("error", () => link.replaceWith(document.createTextNode(line)), { once: true });
            link.append(img); parts.push(link);
        }
        flush();
        element.replaceChildren(...parts);
        return element;
    }
    function body(text) {
        const element = document.createElement("div");
        element.className = "forum-post-body"; element.setAttribute("data-i18n-ignore", "");
        return fill(element, text);
    }

    // Anhängen an ein Textfeld: Knopf, Status und Vorschau der angehängten Bilder mit Entfernen.
    function attach(box) {
        const field = document.getElementById(box.dataset.forumAttach);
        const input = box.querySelector("[data-forum-attach-input]"), status = box.querySelector("[data-forum-attach-status]");
        const list = box.querySelector("[data-forum-attach-list]");
        if (!field || !input || !status || !list) return;
        let busy = false;
        const say = (key, params) => { status.hidden = !key; if (key) lang()?.bind(status, key, params || {}); };
        const changed = () => field.dispatchEvent(new Event("input", { bubbles: true }));
        function renderList() {
            const found = names(field.value);
            list.hidden = !found.length;
            list.replaceChildren(...found.map(name => {
                const item = document.createElement("div"), img = document.createElement("img"), remove = document.createElement("button");
                item.className = "forum-attach-item"; img.src = urlFor(name) || ""; img.alt = ""; img.loading = "lazy";
                remove.type = "button"; remove.className = "forum-text-button"; remove.textContent = lang()?.t("forum.imageRemove") || "Entfernen";
                remove.addEventListener("click", () => {
                    field.value = field.value.split("\n").filter(line => line.trim() !== `[bild:${name}]`).join("\n").replace(/\n{3,}/g, "\n\n");
                    changed(); renderList(); say("");
                });
                item.append(img, remove); return item;
            }));
        }
        input.addEventListener("change", async () => {
            const file = input.files?.[0]; input.value = "";
            if (!file || busy) return;
            if (window.ZHIdentity?.state?.status !== "member") { say("forum.imageSignIn"); return; }
            if (names(field.value).length >= MAX_IMAGES) { say("forum.imageLimit", { count: MAX_IMAGES }); return; }
            busy = true; box.dataset.busy = "true"; say("forum.imageUploading");
            try {
                const ready = await window.ZHBildHochladen.prepare(file);
                const saved = await window.ZHBildHochladen.upload(client(), ready.blob, ready.extension);
                const marker = `[bild:${saved.name}]`, at = field.selectionEnd ?? field.value.length;
                const before = field.value.slice(0, at), after = field.value.slice(at);
                const insert = (before && !before.endsWith("\n") ? "\n" : "") + marker + (after.startsWith("\n") ? "" : "\n");
                if ((before + insert + after).length > (Number(field.maxLength) > 0 ? field.maxLength : 8000)) { say("forum.imageTooLong"); return; }
                field.value = before + insert + after;
                changed(); renderList(); say("forum.imageAdded");
            } catch (error) {
                say(error?.message === "image.invalid" ? "forum.imageInvalid" : "forum.imageFailed");
            } finally { busy = false; delete box.dataset.busy; }
        });
        field.addEventListener("input", renderList);
        renderList();
        return { refresh: renderList };
    }

    const boxes = new Map();
    function start() { document.querySelectorAll("[data-forum-attach]").forEach(box => { if (!boxes.has(box)) boxes.set(box, attach(box)); }); }
    // Nach dem Leeren eines Textfelds durch Skript (z. B. nach dem Absenden) die Vorschau neu zeichnen.
    function refresh() { boxes.forEach(control => control?.refresh()); }

    window.ZHForumBilder = Object.freeze({ fill, body, names, refresh, start, MAX_IMAGES });
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
