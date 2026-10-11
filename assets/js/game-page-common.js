/* Shared presentation for the game entry and its development page. */
(() => {
    "use strict";
    if (!document.body.matches(".game-entry-page, .game-detail-page")) return;
    // Preserve existing bookmarks to the sections moved off the entry page.
    const detailAnchors = new Set(["development", "game-roadmap", "community-voting", "changelog"]);
    const routeMovedSection = () => {
        if (document.body.classList.contains("game-entry-page") &&
            detailAnchors.has(window.location.hash.slice(1))) {
            window.location.replace(new URL("game-development.html" + window.location.hash, window.location.href).href);
            return true;
        }
        return false;
    };
    window.addEventListener("hashchange", routeMovedSection);
    if (routeMovedSection()) return;
    const language = window.ZHLanguage;
    document.querySelectorAll("[data-game-copy]").forEach(element =>
        language.bind(element, element.dataset.gameCopy));
    document.querySelectorAll("[data-game-image-alt]").forEach(image =>
        language.bind(image, image.dataset.gameImageAlt, {}, "alt"));
    if (document.body.classList.contains("game-entry-page")) {
        language.bind(document.querySelector("title"), "game.entry.pageTitle");
        language.bind(document.querySelector('meta[name="description"]'), "game.entry.intro", {}, "content");
    }
    if (document.body.classList.contains("game-detail-page")) {
        language.bind(document.querySelector("title"), "game.entry.detailPageTitle");
        language.bind(document.querySelector('meta[name="description"]'), "game.entry.detailPageDescription", {}, "content");
    }

    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");
    const closeMenu = () => {
        navMenu?.classList.remove("active");
        menuToggle?.setAttribute("aria-expanded", "false");
        language.bind(menuToggle, "navigation.open", {}, "aria-label");
    };
    menuToggle?.addEventListener("click", () => {
        const open = navMenu.classList.toggle("active");
        menuToggle.setAttribute("aria-expanded", String(open));
    });
    navMenu?.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });

    window.ZHCommunityVoting?.init(window.zhSupabaseClient);
    if (document.body.classList.contains("game-entry-page")) {
        initAlphaOverview();
        return;
    }

    function initAlphaOverview() {
        const host = document.querySelector("[data-alpha-tabs]");
        if (!host) return;
        const tabs = [...host.querySelectorAll('[role="tab"]')];
        const panels = [...host.querySelectorAll('[role="tabpanel"]')];
        language.bind(host.querySelector('[role="tablist"]'), "game.presentation.tabsLabel", {}, "aria-label");
        language.bind(document.querySelector("[data-alpha-progress]"), "game.presentation.progressLabel", {}, "aria-label");
        const select = index => {
            tabs.forEach((tab, i) => {
                tab.setAttribute("aria-selected", String(i === index));
                tab.tabIndex = i === index ? 0 : -1;
                panels[i].hidden = i !== index;
            });
        };
        tabs.forEach((tab, index) => {
            tab.addEventListener("click", () => select(index));
            tab.addEventListener("keydown", event => {
                const next = event.key === "ArrowRight" ? (index + 1) % tabs.length :
                    event.key === "ArrowLeft" ? (index + tabs.length - 1) % tabs.length :
                    event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : null;
                if (next === null) return;
                event.preventDefault();
                select(next);
                tabs[next].focus();
            });
        });

        // One existing source for the version, changelog and roadmap. Only text is
        // extracted; scripts, markup and backend calls on the detail page never run here.
        const renderSource = element => {
            element.textContent = language.text(element.dataset.alphaSource);
        };
        const sourceText = (tag, source) => {
            const element = document.createElement(tag);
            element.dataset.alphaSource = source.trim();
            element.setAttribute("data-i18n-ignore", "");
            renderSource(element);
            return element;
        };
        document.addEventListener("zh:languagechange", () => {
            host.querySelectorAll("[data-alpha-source]").forEach(renderSource);
        });
        const status = host.querySelector("[data-alpha-load-status]");
        void fetch(new URL("game-development.html", window.location.href)).then(async response => {
            if (!response.ok) throw new Error("Development overview unavailable");
            const source = new DOMParser().parseFromString(await response.text(), "text/html");
            const changes = [...source.querySelectorAll("#compact-changelog-list .compact-change-text")].slice(0, 4);
            const roadmap = [...source.querySelectorAll(".game-roadmap-grid > article")].slice(0, 4);
            const version = source.querySelector(".changelog-version-title")?.textContent.match(/Alpha\s+(\d+\.\d+\.\d+)/i)?.[1];
            const count = source.querySelectorAll("#latest-change-list > li").length;
            if (!version || count < 1 || count > 20 || changes.length !== 4 || roadmap.length !== 4 ||
                roadmap.some(article => !article.querySelector("h3") || !article.querySelector("li"))) {
                throw new Error("Development overview invalid");
            }
            document.querySelector("[data-alpha-version]").textContent = "Alpha " + version;
            document.querySelector("[data-alpha-count]").textContent = count + " / 20";
            const progress = document.querySelector("[data-alpha-progress]");
            progress.value = count;
            progress.textContent = count + " / 20";
            const list = host.querySelector("[data-alpha-changes]");
            changes.forEach(change => {
                const row = document.createElement("li");
                const versionLabel = document.createElement("span");
                versionLabel.className = "landing-change-version";
                versionLabel.textContent = version;
                row.append(versionLabel, sourceText("span", change.textContent));
                list.append(row);
            });
            const plan = host.querySelector("[data-alpha-roadmap]");
            roadmap.forEach(article => {
                const row = document.createElement("div");
                row.append(sourceText("dt", article.querySelector("h3").textContent),
                    sourceText("dd", article.querySelector("li").textContent));
                plan.append(row);
            });
            status.hidden = true;
        }).catch(() => {
            language.bind(status, "game.presentation.loadUnavailable");
            const roadmapStatus = document.createElement("p");
            roadmapStatus.className = "landing-feed-status";
            language.bind(roadmapStatus, "game.presentation.loadUnavailable");
            host.querySelector("[data-alpha-roadmap]").replaceWith(roadmapStatus);
        });
    }

    const leaderboardList = document.getElementById("leaderboard-list");
    const leaderboardUpdated = document.getElementById("leaderboard-updated");
    const registeredPlayerCount = document.getElementById("registered-player-count");
    function escapeHtml(value) {
        const element = document.createElement("span");
        element.textContent = String(value);
        return element.innerHTML;
    }

    async function loadRegisteredPlayerCount() {
        if (!registeredPlayerCount) return;
        try {
            const response = await fetch(`${supabaseUrl}/rest/v1/rpc/get_registered_player_count`, {
                method: "POST",
                headers: { "apikey": supabaseAnonKey, "Content-Type": "application/json" },
                body: "{}"
            });
            if (!response.ok) throw new Error("Registered player count unavailable");
            const total = Number(await response.json());
            if (!Number.isFinite(total) || total < 0) throw new Error("Invalid registered player count");
            registeredPlayerCount.dataset.i18nNumber = String(total);
            registeredPlayerCount.textContent = total.toLocaleString(window.ZHLanguage?.locale || "de-DE");
        } catch (error) {
            // The existing public ranking endpoint below supplies an exact fallback
            // while fewer than 100 registered accounts exist.
        }
    }

    function populateCompactChangelog() {
        const targetContainer = document.getElementById("compact-changelog-list");
        if (!targetContainer || targetContainer.children.length > 0) return;
        const sourceList = document.getElementById("latest-change-list");
        if (!sourceList) return;
        const items = Array.from(sourceList.querySelectorAll("li")).slice(0, 5);
        targetContainer.innerHTML = items.map(li => {
            const text = escapeHtml(li.textContent.trim());
            return `<div class="compact-change-item" title="${text}"><span class="compact-change-dot" aria-hidden="true">&#10003;</span><span class="compact-change-text">${text}</span></div>`;
        }).join("");
    }

    async function loadLeaderboard() {
        const top5List = document.getElementById("top5-player-list");
        try {
            const response = await fetch(`${supabaseUrl}/rest/v1/rpc/get_leaderboard`, {
                method: "POST",
                headers: { "apikey": supabaseAnonKey, "Content-Type": "application/json" },
                body: "{}"
            });
            if (!response.ok) throw new Error("Rangliste nicht verfuegbar");
            const players = await response.json();
            if (top5List) {
                if (!Array.isArray(players) || players.length === 0) {
                    top5List.innerHTML = '<span class="top5-loading">Keine Spieler</span>';
                } else {
                    const top5 = players.slice(0, 5);
                    top5List.innerHTML = top5.map((player, index) => {
                        const place = Number(player.rank || index + 1);
                        const medal = place === 1 ? "top5-gold" : place === 2 ? "top5-silver" : place === 3 ? "top5-bronze" : "";
                        return `<div class="top5-row ${medal}"><span class="top5-rank">#${place}</span><span class="top5-name">${escapeHtml(player.nickname)}</span><span class="top5-points" data-i18n-score="${Number(player.points || 0)}">${Number(player.points || 0).toLocaleString(window.ZHLanguage?.locale || "de-DE")} Pkt.</span></div>`;
                    }).join("");
                }
            }
            if (leaderboardList) {
                if (!Array.isArray(players) || players.length === 0) {
                    leaderboardList.innerHTML = '<p class="leaderboard-loading">Noch keine registrierten Spieler.</p>';
                } else {
                    const createRows = (entries) => entries.map((player, index) => {
                        const place = Number(player.rank || index + 1);
                        const medal = place === 1 ? "gold" : place === 2 ? "silver" : place === 3 ? "bronze" : "normal";
                        return `<article class="leaderboard-row ${medal}"><span class="leaderboard-place">${place}</span><span class="leaderboard-player"><i class="fa-solid fa-user" aria-hidden="true"></i>${escapeHtml(player.nickname)}</span><strong><span data-i18n-number="${Number(player.points || 0)}">${Number(player.points || 0).toLocaleString(window.ZHLanguage?.locale || "de-DE")}</span> <small>Punkte</small></strong></article>`;
                    }).join("");
                    const visiblePlayers = players.slice(0, 15);
                    const furtherPlayers = players.slice(15);
                    const morePlayers = furtherPlayers.length
                        ? `<details class="leaderboard-more"><summary data-i18n-more-players="${furtherPlayers.length}">Weitere ${furtherPlayers.length} Spieler anzeigen</summary><div class="leaderboard-list leaderboard-list-more">${createRows(furtherPlayers)}</div></details>`
                        : "";
                    leaderboardList.innerHTML = createRows(visiblePlayers) + morePlayers;
                }
            }
            if (registeredPlayerCount && registeredPlayerCount.textContent === "--" && players.length < 100) {
                registeredPlayerCount.dataset.i18nNumber = String(players.length);
                registeredPlayerCount.textContent = String(players.length);
            }
            if (leaderboardUpdated) leaderboardUpdated.textContent = "Aktualisierung: alle 24 Stunden";
        } catch (error) {
            if (top5List) top5List.innerHTML = '<span class="top5-loading">Rangliste folgt</span>';
            if (leaderboardList) leaderboardList.innerHTML = '<p class="leaderboard-loading">Die Rangliste wird gerade vorbereitet.</p>';
            if (leaderboardUpdated) leaderboardUpdated.textContent = "Aktualisierung folgt";
            if (registeredPlayerCount) {
                delete registeredPlayerCount.dataset.i18nNumber;
                registeredPlayerCount.textContent = "--";
            }
        }
    }
    async function loadRecentPlayers() {
        const recentList = document.getElementById("recent-player-list");
        if (!recentList) return;
        try {
            const response = await fetch(`${supabaseUrl}/rest/v1/rpc/get_recent_players`, {
                method: "POST",
                headers: { "apikey": supabaseAnonKey, "Content-Type": "application/json" },
                body: "{}"
            });
            if (!response.ok) throw new Error("Recent players unavailable");
            const data = await response.json();
            if (!Array.isArray(data) || data.length === 0) {
                recentList.innerHTML = '<span class="recent-loading">Noch keine Spieler</span>';
            } else {
                recentList.innerHTML = data.slice(0, 5).map(item => {
                    const name = typeof item === "string" ? item : (item.nickname || item.name || "");
                    return `<div class="recent-row"><span class="recent-dot" aria-hidden="true">&bull;</span><span class="recent-name">${escapeHtml(name)}</span></div>`;
                }).join("");
            }
        } catch (error) {
            recentList.innerHTML = '<span class="recent-loading">--</span>';
        }
    }

    populateCompactChangelog();
    loadRegisteredPlayerCount();
    window.setInterval(loadRegisteredPlayerCount, 24 * 60 * 60 * 1000);
    loadRecentPlayers();
    window.setInterval(loadRecentPlayers, 5 * 60 * 1000);
    loadLeaderboard();
    window.setInterval(loadLeaderboard, 24 * 60 * 60 * 1000);

    const versionLog = document.querySelector(".version-log-list");
    const changelogEntries = versionLog ? Array.from(versionLog.querySelectorAll(":scope > .changelog-details")) : [];
    const visibleChangelogEntries = changelogEntries.slice(0, 5);
    const olderChangelogEntries = changelogEntries.slice(5);

    if (versionLog && olderChangelogEntries.length) {
        const olderVersions = document.createElement("details");
        olderVersions.className = "changelog-details changelog-older-versions";
        olderVersions.open = false;
        olderVersions.innerHTML = `<summary><span class="changelog-version-title">ÄLTERE VERSIONEN</span><span class="changelog-hint" data-i18n-versions="${olderChangelogEntries.length}">${olderChangelogEntries.length} Versionen</span></summary><div class="changelog-older-list"></div>`;
        const olderList = olderVersions.querySelector(".changelog-older-list");
        olderChangelogEntries.forEach((entry) => {
            entry.open = false;
            olderList.appendChild(entry);
        });
        versionLog.appendChild(olderVersions);
    }

    const updateChangelogHint = (entry) => {
        const hint = entry.querySelector(":scope > summary .changelog-hint");
        if (hint) hint.textContent = entry.open ? "Geoeffnet" : "Aufklappen";
    };
    visibleChangelogEntries.forEach((entry, index) => {
        entry.open = index === 0;
        updateChangelogHint(entry);
        entry.addEventListener("toggle", () => {
            if (entry.open) {
                visibleChangelogEntries.forEach((other) => {
                    if (other !== entry) other.open = false;
                });
            }
            updateChangelogHint(entry);
        });
    });

    const archivedChangelogEntries = Array.from(document.querySelectorAll(".changelog-older-list > .changelog-details"));
    archivedChangelogEntries.forEach((entry) => {
        entry.open = false;
        updateChangelogHint(entry);
        entry.addEventListener("toggle", () => {
            if (entry.open) {
                archivedChangelogEntries.forEach((other) => {
                    if (other !== entry) other.open = false;
                });
            }
            updateChangelogHint(entry);
        });
    });

})();
