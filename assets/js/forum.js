/* Existing local forum drafts; author display uses the central account. */
(() => {
    "use strict";
    if (!document.body.classList.contains("forum-page")) return;

    const language = window.ZHLanguage;
    if (!language) return;
    const rows = [...document.querySelectorAll("[data-forum-category]")];
    const categories = new Map(rows.map(row => [row.dataset.forumCategory, {
        id: row.dataset.forumCategory,
        copy: row.querySelector("[data-forum-copy]").dataset.forumCopy
    }]));
    const search = document.getElementById("forum-search");
    const views = [...document.querySelectorAll("[data-forum-view]")];
    const shortcuts = document.getElementById("forum-category-shortcuts");
    const breadcrumb = document.getElementById("forum-breadcrumb-category");
    const titleInput = document.getElementById("forum-draft-title");
    const bodyInput = document.getElementById("forum-draft-body");
    const categorySelect = document.getElementById("forum-draft-category-select");
    const storageKey = "zhserver_forum_drafts_v1";
    function renderIdentity() {
        const state = window.ZHIdentity.state;
        const key = state.status === "member" ? "identity.signedIn" : state.status === "guest" ? "identity.signInRequired" : "identity." + state.status;
        language.bind(document.getElementById("forum-identity-status"), key, { name: state.displayName || "" });
        document.getElementById("forum-preview-author").textContent = state.displayName || language.t("forum.authorProfile");
        document.getElementById("forum-identity-login").hidden = !!state.userId;
        const canWrite = state.status === "member";
        titleInput.readOnly = !canWrite; bodyInput.readOnly = !canWrite;
        document.querySelector('#forum-draft-form button[type="submit"]').disabled = !canWrite;
        document.getElementById("forum-save-draft").disabled = !canWrite;
        categorySelect.disabled = !canWrite;
    }
    let storageProblem = "";
    let saveFeedback = "";
    let savedDrafts = loadDrafts();
    const drafts = new Map([...savedDrafts].map(([id, draft]) => [id, { ...draft }]));
    let route = { view: "overview", category: null };
    let filter = "all";
    let pendingCategory = null;

    const title = id => window.ZHTranslations.copy[categories.get(id).copy][language.language];
    const fold = value => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase(language.locale).replace(/ß/g, "ss").trim();

    function bindText(root = document) {
        root.querySelectorAll("[data-forum-i18n]").forEach(node => language.bind(node, node.dataset.forumI18n));
        root.querySelectorAll("[data-forum-label]").forEach(node => language.bind(node, node.dataset.forumLabel, {}, "aria-label"));
        root.querySelectorAll("[data-forum-placeholder]").forEach(node => language.bind(node, node.dataset.forumPlaceholder, {}, "placeholder"));
    }

    function renderTitles() {
        document.querySelectorAll("[data-forum-copy]").forEach(node => {
            node.setAttribute("data-i18n-ignore", "");
            node.textContent = window.ZHTranslations.copy[node.dataset.forumCopy][language.language];
        });
        for (const link of shortcuts.querySelectorAll("a")) {
            link.textContent = title(link.dataset.category);
            if (link.dataset.category === route.category) link.setAttribute("aria-current", "page");
            else link.removeAttribute("aria-current");
        }
        for (const option of categorySelect.options) option.textContent = title(option.value);
    }

    function searchCategories() {
        const words = fold(search.value).split(/\s+/).filter(Boolean);
        let visible = 0;
        for (const row of rows) {
            const id = row.dataset.forumCategory;
            const haystack = fold(title(id) + " " + language.t("forum.description." + id));
            row.hidden = !words.every(word => haystack.includes(word));
            if (!row.hidden) visible++;
        }
        document.getElementById("forum-search-clear").hidden = !search.value;
        document.getElementById("forum-search-empty").hidden = visible !== 0;
        language.bind(document.getElementById("forum-search-status"), "forum.searchResults", { count: visible });
    }

    function readRoute() {
        const match = /^#(category|compose|draft|preview)\/([a-z]+)$/.exec(location.hash);
        return match && categories.has(match[2]) ? { view: match[1] === "compose" ? "draft" : match[1], category: match[2] } : { view: "overview", category: null };
    }

    function loadDrafts() {
        const result = new Map();
        storageProblem = "";
        try {
            const raw = localStorage.getItem(storageKey);
            if (!raw) return result;
            const stored = JSON.parse(raw);
            if (stored?.version !== 1 || !stored.drafts || typeof stored.drafts !== "object" || Array.isArray(stored.drafts)) {
                storageProblem = "forum.storageUnreadable";
                return result;
            }
            for (const id of categories.keys()) {
                const draft = stored.drafts[id];
                if (!draft || typeof draft.title !== "string" || typeof draft.body !== "string") continue;
                result.set(id, {
                    title: draft.title.slice(0, 120), body: draft.body.slice(0, 8000),
                    updatedAt: typeof draft.updatedAt === "string" && Number.isFinite(Date.parse(draft.updatedAt)) ? draft.updatedAt : null
                });
            }
        } catch (error) {
            storageProblem = error instanceof SyntaxError ? "forum.storageUnreadable" : "forum.storageBlocked";
        }
        return result;
    }

    function draftFor(id) {
        if (!drafts.has(id)) drafts.set(id, { title: "", body: "", updatedAt: null });
        return drafts.get(id);
    }

    const hasContent = draft => Boolean(draft.title.trim() || draft.body.trim());
    function isDirty(id) {
        const draft = draftFor(id);
        const saved = savedDrafts.get(id);
        return Boolean((hasContent(draft) || saved) && (draft.title !== (saved?.title ?? "") || draft.body !== (saved?.body ?? "")));
    }

    function cacheEditor() {
        if (route.view !== "draft" || !route.category) return;
        const draft = draftFor(route.category);
        draft.title = titleInput.value;
        draft.body = bodyInput.value;
    }

    function formatSaved(draft) {
        if (!draft.updatedAt) return language.t("forum.unsaved");
        const date = new Intl.DateTimeFormat(language.locale, { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Berlin" }).format(new Date(draft.updatedAt));
        return language.t("forum.savedAt", { date });
    }

    function updateDraftStatus() {
        if (!route.category) return;
        const draft = draftFor(route.category);
        language.bind(document.getElementById("forum-title-count"), "forum.characters", { count: titleInput.value.length, limit: 120 });
        language.bind(document.getElementById("forum-body-count"), "forum.characters", { count: bodyInput.value.length, limit: 8000 });
        const status = document.getElementById("forum-save-status");
        if (saveFeedback) language.bind(status, saveFeedback);
        else if (isDirty(route.category)) language.bind(status, "forum.unsavedChanges");
        else if (draft.updatedAt) language.bind(status, "forum.savedAt", { date: new Intl.DateTimeFormat(language.locale, { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Berlin" }).format(new Date(draft.updatedAt)) });
        else language.bind(status, "forum.unsaved");
        const warning = document.getElementById("forum-storage-warning");
        warning.hidden = !storageProblem;
        if (storageProblem) language.bind(warning, storageProblem);
        document.getElementById("forum-discard-draft").disabled = !hasContent(draft) && !savedDrafts.has(route.category);
    }

    function renderDraft() {
        const draft = draftFor(route.category);
        document.getElementById("forum-draft-category").textContent = title(route.category);
        categorySelect.value = route.category;
        // Do not replace unchanged values on a language switch: keep text and caret.
        if (titleInput.value !== draft.title) titleInput.value = draft.title;
        if (bodyInput.value !== draft.body) bodyInput.value = draft.body;
        updateDraftStatus();
    }

    function renderLocalDraft() {
        for (const row of rows) {
            const id = row.dataset.forumCategory;
            let marker = row.querySelector(".forum-local-draft-marker");
            const exists = drafts.has(id) && hasContent(drafts.get(id));
            if (exists && !marker) {
                marker = document.createElement("span");
                marker.className = "forum-local-draft-marker";
                row.querySelector(".forum-category-copy").append(marker);
            }
            if (marker) { marker.hidden = !exists; marker.textContent = language.t("forum.draftMarker"); }
        }
        if (!route.category) return;
        const draft = draftFor(route.category);
        document.getElementById("forum-local-topic").hidden = !hasContent(draft);
        document.getElementById("forum-local-topic-link").href = "#draft/" + route.category;
        document.getElementById("forum-local-topic-title").textContent = draft.title.trim() || language.t("forum.untitledDraft");
    }

    function renderPreview() {
        const draft = draftFor(route.category);
        const complete = draft.title.trim().length >= 3 && draft.body.trim().length >= 10;
        document.getElementById("forum-preview-category").textContent = title(route.category);
        document.getElementById("forum-preview-empty").hidden = complete;
        document.getElementById("forum-preview-content").hidden = !complete;
        document.getElementById("forum-start-draft").href = "#compose/" + route.category;
        document.getElementById("forum-edit-draft").href = "#compose/" + route.category;
        // Text only: browser-local input is never HTML and never auto-translated.
        document.getElementById("forum-preview-title").textContent = draft.title;
        document.getElementById("forum-preview-body").textContent = draft.body;
        document.getElementById("forum-preview-saved").textContent = isDirty(route.category) ? language.t("forum.unsavedChanges") : formatSaved(draft);
    }

    function writeDrafts(next) {
        try {
            localStorage.setItem(storageKey, JSON.stringify({ version: 1, drafts: Object.fromEntries(next) }));
            savedDrafts = next;
            storageProblem = "";
            return true;
        } catch (_) {
            storageProblem = "forum.storageBlocked";
            return false;
        }
    }

    function saveDraft() {
        if (window.ZHIdentity.state.status !== "member") return;
        cacheEditor();
        const draft = draftFor(route.category);
        saveFeedback = "";
        if (!hasContent(draft)) { saveFeedback = "forum.emptyDraft"; updateDraftStatus(); return; }
        const next = loadDrafts(); // Merge other categories, including saves made in another tab.
        if (storageProblem) { updateDraftStatus(); return; }
        const saved = { ...draft, updatedAt: new Date().toISOString() };
        next.set(route.category, saved);
        if (writeDrafts(next)) drafts.set(route.category, { ...saved });
        updateDraftStatus();
        renderLocalDraft();
    }

    function validatePreview() {
        cacheEditor();
        const checks = [
            [titleInput, "forum-title-error", titleInput.value.trim().length >= 3, "forum.titleRequired"],
            [bodyInput, "forum-body-error", bodyInput.value.trim().length >= 10, "forum.bodyRequired"]
        ];
        let firstInvalid = null;
        for (const [input, id, valid, key] of checks) {
            const error = document.getElementById(id);
            error.hidden = valid;
            input.setAttribute("aria-invalid", String(!valid));
            if (!valid) { language.bind(error, key); firstInvalid ??= input; }
        }
        if (firstInvalid) { firstInvalid.focus(); return false; }
        return true;
    }

    function renderFilter() {
        document.querySelectorAll("[data-forum-filter]").forEach(button => {
            button.setAttribute("aria-pressed", String(button.dataset.forumFilter === filter));
        });
        language.bind(document.getElementById("forum-empty-heading"), "forum.empty." + filter);
    }

    function renderRoute(focus = false) {
        cacheEditor();
        const previous = route;
        route = readRoute();
        if (route.view === "draft" && window.ZHIdentity.state.status !== "member") route.view = "auth";
        if (route.category !== previous.category || route.view !== previous.view) {
            saveFeedback = "";
            pendingCategory = null;
            document.getElementById("forum-category-confirm").hidden = true;
            document.getElementById("forum-discard-confirm").hidden = true;
            for (const id of ["forum-title-error", "forum-body-error"]) document.getElementById(id).hidden = true;
            titleInput.removeAttribute("aria-invalid"); bodyInput.removeAttribute("aria-invalid");
        }
        for (const panel of views) panel.hidden = panel.dataset.forumView !== route.view;
        breadcrumb.hidden = !route.category;
        breadcrumb.replaceChildren();
        document.getElementById("forum-category-navigation").hidden = !route.category;
        if (route.category) {
            const link = document.createElement("a");
            link.href = "#category/" + route.category;
            link.textContent = title(route.category);
            if (route.view === "category") link.setAttribute("aria-current", "page");
            breadcrumb.append(link);
            if (route.view !== "category") {
                const current = document.createElement("span");
                current.className = "forum-breadcrumb-current";
                current.textContent = language.t(["draft", "auth"].includes(route.view) ? "forum.createPost" : "forum.previewBadge");
                current.setAttribute("aria-current", "page");
                breadcrumb.append(current);
            }
            document.getElementById("forum-category-title").textContent = title(route.category);
            language.bind(document.getElementById("forum-category-description"), "forum.description." + route.category);
            renderFilter();
            document.getElementById("forum-new-draft").href = "#compose/" + route.category;
            if (route.view === "draft") renderDraft();
            if (route.view === "preview") renderPreview();
            if (route.view === "auth") {
                const state = window.ZHIdentity.state;
                language.bind(document.getElementById("forum-auth-message"), state.status === "guest" ? "forum.loginRequired" : "identity." + state.status);
                const next = location.pathname + location.search + "#compose/" + route.category;
                for (const mode of ["login", "register"]) {
                    const link = document.getElementById("forum-auth-" + mode);
                    const url = new URL("../account/", location.href);
                    if (mode === "register") url.searchParams.set("mode", "register");
                    url.searchParams.set("next", next); link.href = url.href;
                    link.hidden = !!state.userId || state.status === "checking";
                }
                document.getElementById("forum-auth-profile").hidden = state.status !== "nameRequired";
            }
        }
        renderLocalDraft();
        renderTitles();
        renderIdentity();
        if (focus) {
            const heading = document.getElementById({ overview: "forum-categories-title", category: "forum-category-title", draft: "forum-draft-heading", auth: "forum-auth-heading", preview: "forum-preview-heading" }[route.view]);
            heading.focus({ preventScroll: true });
            document.querySelector(".forum-workspace").scrollIntoView({ block: "start", behavior: "instant" });
        }
    }

    for (const id of categories.keys()) {
        const item = document.createElement("li");
        const link = document.createElement("a");
        link.href = "#category/" + id;
        link.dataset.category = id;
        item.append(link);
        shortcuts.append(item);
        const option = document.createElement("option"); option.value = id; categorySelect.append(option);
    }
    bindText();
    document.querySelector(".forum-skip-link").addEventListener("click", event => {
        event.preventDefault();
        // Skip the header without changing the current category/draft route.
        views.find(panel => !panel.hidden)?.querySelector("h2")?.focus({ preventScroll: true });
        document.querySelector(".forum-workspace").scrollIntoView({ block: "start", behavior: "instant" });
    });
    document.getElementById("forum-search-controls").hidden = false;
    search.addEventListener("input", searchCategories);
    function resetSearch() { search.value = ""; searchCategories(); search.focus(); }
    document.getElementById("forum-search-clear").addEventListener("click", resetSearch);
    document.getElementById("forum-search-reset").addEventListener("click", resetSearch);
    document.querySelectorAll("[data-forum-filter]").forEach(button => button.addEventListener("click", () => {
        filter = button.dataset.forumFilter;
        renderFilter();
    }));
    titleInput.addEventListener("input", () => {
        cacheEditor(); saveFeedback = "";
        document.getElementById("forum-title-error").hidden = true; titleInput.removeAttribute("aria-invalid");
        updateDraftStatus();
    });
    bodyInput.addEventListener("input", () => {
        cacheEditor(); saveFeedback = "";
        document.getElementById("forum-body-error").hidden = true; bodyInput.removeAttribute("aria-invalid");
        updateDraftStatus();
    });
    function changeCategory(next, carryText) {
        if (!categories.has(next) || window.ZHIdentity.state.status !== "member") return;
        cacheEditor();
        if (carryText && hasContent(draftFor(route.category))) {
            drafts.set(next, { ...draftFor(route.category), updatedAt: null });
        }
        pendingCategory = null; document.getElementById("forum-category-confirm").hidden = true;
        location.hash = "compose/" + next;
    }
    categorySelect.addEventListener("change", () => {
        if (window.ZHIdentity.state.status !== "member") return;
        cacheEditor(); const next = categorySelect.value;
        if (next === route.category) return;
        const source = draftFor(route.category), target = draftFor(next);
        if (hasContent(source) && hasContent(target) && (source.title !== target.title || source.body !== target.body)) {
            pendingCategory = next; document.getElementById("forum-category-confirm").hidden = false;
            document.getElementById("forum-category-move").focus();
        } else changeCategory(next, true);
    });
    document.getElementById("forum-category-move").addEventListener("click", () => changeCategory(pendingCategory, true));
    document.getElementById("forum-category-open").addEventListener("click", () => changeCategory(pendingCategory, false));
    document.getElementById("forum-category-cancel").addEventListener("click", () => {
        pendingCategory = null; categorySelect.value = route.category;
        document.getElementById("forum-category-confirm").hidden = true; categorySelect.focus();
    });
    document.getElementById("forum-draft-form").addEventListener("submit", event => {
        event.preventDefault();
        if (window.ZHIdentity.state.status !== "member") return;
        if (validatePreview()) location.hash = "preview/" + route.category;
    });
    document.getElementById("forum-save-draft").addEventListener("click", saveDraft);
    document.getElementById("forum-discard-draft").addEventListener("click", () => {
        document.getElementById("forum-discard-confirm").hidden = false;
        document.getElementById("forum-confirm-discard").focus();
    });
    function cancelDiscard() {
        document.getElementById("forum-discard-confirm").hidden = true;
        document.getElementById("forum-discard-draft").focus();
    }
    document.getElementById("forum-cancel-discard").addEventListener("click", cancelDiscard);
    document.getElementById("forum-discard-confirm").addEventListener("keydown", event => { if (event.key === "Escape") cancelDiscard(); });
    document.getElementById("forum-confirm-discard").addEventListener("click", () => {
        const next = loadDrafts();
        if (storageProblem) { updateDraftStatus(); return; }
        next.delete(route.category);
        if (!writeDrafts(next)) { updateDraftStatus(); return; }
        drafts.delete(route.category);
        document.getElementById("forum-discard-confirm").hidden = true;
        saveFeedback = "forum.discarded";
        renderDraft(); renderLocalDraft(); titleInput.focus();
    });
    window.addEventListener("beforeunload", event => {
        cacheEditor();
        if ([...drafts.keys()].some(isDirty)) { event.preventDefault(); event.returnValue = ""; }
    });
    window.addEventListener("storage", event => {
        if (event.key !== storageKey) return;
        cacheEditor();
        const dirty = new Set([...drafts.keys()].filter(isDirty));
        const incoming = loadDrafts();
        if (storageProblem) { if (route.view === "draft") updateDraftStatus(); return; }
        savedDrafts = incoming;
        for (const id of categories.keys()) {
            if (dirty.has(id)) continue;
            if (savedDrafts.has(id)) drafts.set(id, { ...savedDrafts.get(id) });
            else drafts.delete(id);
        }
        if (route.view === "draft" && !dirty.has(route.category)) renderDraft();
        renderRoute();
    });
    window.addEventListener("hashchange", () => { filter = "all"; renderRoute(true); });
    document.addEventListener("zh:languagechange", () => { renderRoute(); searchCategories(); });
    window.ZHIdentity.subscribe(() => renderRoute());
    renderRoute();
    searchCategories();
})();
