/* Shared DE/EN support for the regular homepage. Wiki and the game iframe opt out. */
(() => {
    "use strict";
    if (!document.documentElement.hasAttribute("data-homepage-i18n")) return;

    const catalog = window.ZHTranslations;
    if (!catalog) return;
    const storageKey = "zh_language";
    const languageScriptUrl = document.currentScript?.src;
    const normalize = (value) => value.replace(/\s+/g, " ").trim();
    const copyByText = new Map();
    Object.values(catalog.copy).forEach((entry) => {
        copyByText.set(normalize(entry.de), entry);
        copyByText.set(normalize(entry.en), entry);
    });
    const ignored = [
        "script", "style", "svg", "[data-i18n-ignore]", "[data-i18n-message]",
        ".guestbook-card h3", ".guestbook-card > p", ".gallery-info > span",
        ".gallery-info-head > span", ".gallery-card img", "#lightboxImage",
        ".gallery-info > p:not(.gallery-pending-sub)", ".feedback-card h4",
        ".feedback-description", ".top5-name", ".leaderboard-player", ".recent-name"
    ].join(",");
    const textRecords = new Map();
    const attributeRecords = new Map();
    const messages = new Map();
    let language = "de";
    try {
        if (localStorage.getItem(storageKey) === "en") language = "en";
    } catch (_) { /* The switch also works when browser storage is unavailable. */ }
    document.documentElement.lang = language;

    const locale = () => language === "en" ? "en-GB" : "de-DE";
    const number = (value) => Number(value).toLocaleString(locale());
    const t = (key, params = {}) => {
        const entry = catalog.messages[key];
        if (!entry) return key;
        return entry[language].replace(/\{(\w+)\}/g, (match, name) => {
            if (!(name in params)) return match;
            return typeof params[name] === "number" ? number(params[name]) : String(params[name]);
        });
    };
    const text = (source) => copyByText.get(normalize(source))?.[language] ?? source;

    function translateText(node) {
        if (!node.parentElement || node.parentElement.closest(ignored)) return;
        const current = node.nodeValue;
        const previous = textRecords.get(node);
        if (previous && current === previous.rendered) {
            const next = previous.before + previous.entry[language] + previous.after;
            if (current !== next) node.nodeValue = next;
            previous.rendered = next;
            return;
        }
        const entry = copyByText.get(normalize(current));
        if (!entry) {
            textRecords.delete(node);
            return;
        }
        const record = {
            entry,
            before: current.match(/^\s*/)[0],
            after: current.match(/\s*$/)[0]
        };
        record.rendered = record.before + entry[language] + record.after;
        textRecords.set(node, record);
        if (current !== record.rendered) node.nodeValue = record.rendered;
    }

    function translateAttributes(element) {
        if (element.closest(ignored)) return;
        const attributes = ["aria-label", "title", "alt", "placeholder"];
        if (element.matches('meta[name="description"]')) attributes.push("content");
        let records = attributeRecords.get(element);
        for (const name of attributes) {
            if (!element.hasAttribute(name)) continue;
            const value = element.getAttribute(name);
            const previous = records?.get(name);
            const entry = previous && value === previous.rendered
                ? previous.entry : copyByText.get(normalize(value));
            if (!entry) {
                records?.delete(name);
                continue;
            }
            if (!records) {
                records = new Map();
                attributeRecords.set(element, records);
            }
            const translated = entry[language];
            records.set(name, { entry, rendered: translated });
            if (value !== translated) element.setAttribute(name, translated);
        }
    }

    function formatValues(root) {
        const selector = "[data-i18n-date], [data-i18n-datetime], [data-i18n-number], [data-i18n-score], [data-i18n-more-players], [data-i18n-versions]";
        const elements = [...root.querySelectorAll(selector)];
        if (root.matches?.(selector)) elements.push(root);
        elements.forEach((element) => {
            let value;
            if (element.hasAttribute("data-i18n-score")) {
                value = t("score.short", { count: Number(element.dataset.i18nScore) });
            } else if (element.hasAttribute("data-i18n-more-players")) {
                value = t("leaderboard.more", { count: Number(element.dataset.i18nMorePlayers) });
            } else if (element.hasAttribute("data-i18n-versions")) {
                value = t("changelog.versions", { count: Number(element.dataset.i18nVersions) });
            } else if (element.hasAttribute("data-i18n-number")) {
                const amount = Number(element.dataset.i18nNumber);
                if (!Number.isFinite(amount)) return;
                value = number(amount);
            } else {
                const datetime = element.dataset.i18nDatetime;
                const date = new Date(datetime || element.dataset.i18nDate);
                if (!Number.isFinite(date.getTime())) return;
                value = datetime ? date.toLocaleString(locale()) : date.toLocaleDateString(locale());
            }
            if (element.textContent !== value) element.textContent = value;
        });
    }

    function translateTree(root = document) {
        if (root.nodeType === Node.TEXT_NODE) {
            translateText(root);
            return;
        }
        if (!root.querySelectorAll || root.closest?.(ignored)) return;
        if (root.nodeType === Node.ELEMENT_NODE) translateAttributes(root);
        root.querySelectorAll("[aria-label], [title], [alt], [placeholder], meta[name='description']")
            .forEach(translateAttributes);
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) translateText(walker.currentNode);
        formatValues(root);
    }

    function bind(element, key, params = {}, attribute = "textContent") {
        if (!element) return;
        let bindings = messages.get(element);
        if (!bindings) {
            bindings = new Map();
            messages.set(element, bindings);
        }
        bindings.set(attribute, { key, params });
        if (attribute === "textContent") element.setAttribute("data-i18n-message", "");
        renderMessage(element, attribute, key, params);
    }

    function renderMessage(element, attribute, key, params) {
        const value = t(key, params);
        if (attribute === "textContent") {
            if (element.textContent !== value) element.textContent = value;
        } else if (element.getAttribute(attribute) !== value) element.setAttribute(attribute, value);
    }

    function updateControls() {
        document.querySelectorAll("[data-language]").forEach((button) => {
            button.setAttribute("aria-pressed", String(button.dataset.language === language));
        });
        document.querySelectorAll(".language-switcher").forEach((element) => {
            element.setAttribute("aria-label", t("language.label"));
        });
        const menu = document.getElementById("menu-toggle");
        if (menu) {
            const open = document.querySelector(".nav-menu")?.classList.contains("active") ?? false;
            menu.setAttribute("aria-label", t(open ? "navigation.close" : "navigation.open"));
            menu.setAttribute("aria-expanded", String(open));
        }
    }

    function setLanguage(next, persist = true) {
        if (next !== "de" && next !== "en") return;
        language = next;
        document.documentElement.lang = language;
        if (persist) {
            try { localStorage.setItem(storageKey, language); } catch (_) { /* In-memory fallback. */ }
        }
        for (const [node] of textRecords) {
            if (node.isConnected) translateText(node);
            else textRecords.delete(node);
        }
        for (const [element] of attributeRecords) {
            if (element.isConnected) translateAttributes(element);
            else attributeRecords.delete(element);
        }
        for (const [element, bindings] of messages) {
            if (!element.isConnected) { messages.delete(element); continue; }
            for (const [attribute, { key, params }] of bindings) renderMessage(element, attribute, key, params);
        }
        formatValues(document);
        updateControls();
        document.dispatchEvent(new CustomEvent("zh:languagechange", { detail: { language } }));
    }

    window.ZHLanguage = { t, text, bind, translateTree, setLanguage, get language() { return language; }, get locale() { return locale(); } };

    function initForumNavigation() {
        const nav = document.querySelector(".nav-menu");
        if (!nav || !languageScriptUrl) return;
        let link = nav.querySelector("[data-forum-route]");
        if (!link) {
            const item = document.createElement("li");
            link = document.createElement("a");
            link.setAttribute("data-forum-route", "");
            link.textContent = "Forum";
            item.append(link);
            nav.append(item);
        }
        const target = new URL(window.location.protocol === "file:" ? "../../forum/index.html" : "../../forum/", languageScriptUrl);
        link.setAttribute("href", window.location.protocol === "file:" ? target.href : target.pathname);
        link.addEventListener("click", () => {
            nav.classList.remove("active");
            const toggle = document.getElementById("menu-toggle");
            if (toggle) toggle.textContent = "☰";
            updateControls();
        });
    }

    function init() {
        // Shared by all bilingual pages, including Game; the Wiki opts out above.
        initForumNavigation();
        // One account component for every page using the shared homepage header.
        if (languageScriptUrl && document.querySelector('.header.zh-site-header') && !document.querySelector('[data-zh-account-loader]')) {
            const account = document.createElement('script');
            account.src = new URL('account.js?v=20261008-account1', languageScriptUrl).href;
            account.setAttribute('data-zh-account-loader', '');
            document.body.append(account);
        }
        document.querySelectorAll(".nav-menu .nav-game-link").forEach((link) => bind(link, "navigation.game"));
        // Option labels change language, while the original backend values stay fixed.
        document.querySelectorAll("select option:not([value])").forEach((option) => { option.value = option.textContent.trim(); });
        translateTree();
        updateControls();
        document.querySelectorAll("[data-language]").forEach((button) => {
            button.addEventListener("click", () => setLanguage(button.dataset.language));
        });
        document.getElementById("menu-toggle")?.addEventListener("click", updateControls);
        document.querySelectorAll(".nav-menu a").forEach((link) => link.addEventListener("click", updateControls));
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === "childList") mutation.addedNodes.forEach(translateTree);
                else if (mutation.type === "characterData") translateText(mutation.target);
                else translateAttributes(mutation.target);
            });
        });
        observer.observe(document.documentElement, {
            subtree: true, childList: true, characterData: true, attributes: true,
            attributeFilter: ["aria-label", "title", "alt", "placeholder", "content"]
        });
        window.addEventListener("storage", (event) => {
            if (event.key === storageKey) setLanguage(event.newValue === "en" ? "en" : "de", false);
        });
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
    else init();
})();
