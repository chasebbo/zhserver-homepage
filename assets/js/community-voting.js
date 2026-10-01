/* Existing community voting, shared by Homepage and Gamepage.
   Backend, option IDs and saved choices remain unchanged. */
(() => {
    "use strict";
    let initialized = false;
    window.ZHCommunityVoting = {
        init(client) {
            if (initialized || !document.getElementById("votingOptions")) return;
            initialized = true;
            const votingOptionsContainer = document.getElementById("votingOptions");
            const totalVotesCountEl = document.getElementById("totalVotesCount");
            const votingNoticeEl = document.getElementById("votingNotice");

            if (votingOptionsContainer) {
                const DEFAULT_OPTIONS = [
                    { id: "weapons", title: "Schrotflinte & Jagdgewehr", desc: "Mehr Fernkampfwaffen & Munitionstypen" },
                    { id: "weather", title: "Dynamisches Wetter & Nebel", desc: "Regenstürme, Gewitter & reduzierte Sicht" },
                    { id: "hordes", title: "Zombie-Horden bei Nacht", desc: "Größere Ansammlungen & Bedrohung nach Sonnenuntergang" },
                    { id: "vehicles", title: "Fahrzeug-Tuning & Kofferraum", desc: "Lagerkisten auf der Ladefläche & Panzerung" }
                ];

                const STORAGE_KEY_USER_VOTE = "zh_user_voted_feature_v2";
                const votesData = {
                    weapons: 0,
                    weather: 0,
                    hordes: 0,
                    vehicles: 0
                };

                // Alte simulierte Test-Daten bereinigen
                try {
                    localStorage.removeItem("zh_community_votes_v1");
                } catch (e) {}

                function getUserVote() {
                    try {
                        return localStorage.getItem(STORAGE_KEY_USER_VOTE);
                    } catch (e) {
                        return null;
                    }
                }

                function renderVoting() {
                    const userVote = getUserVote();
                    const hasVoted = Boolean(userVote);

                    let totalVotes = 0;
                    DEFAULT_OPTIONS.forEach(opt => {
                        totalVotes += (votesData[opt.id] || 0);
                    });

                    if (totalVotesCountEl) {
                        totalVotesCountEl.textContent = totalVotes.toLocaleString("de-DE");
                    }
                    if (votingNoticeEl) {
                        votingNoticeEl.innerHTML = hasVoted
                            ? '<span class="vote-confirmed-msg"><i class="fa-solid fa-circle-check"></i> Deine Stimme wurde gezählt! Danke.</span>'
                            : '1 Stimme pro Spieler &bull; Echtzeit';
                    }

                    votingOptionsContainer.innerHTML = "";

                    DEFAULT_OPTIONS.forEach(opt => {
                        const optVotes = votesData[opt.id] || 0;
                        const percent = totalVotes > 0 ? Math.round((optVotes / totalVotes) * 100) : 0;
                        const isSelected = userVote === opt.id;

                        const item = document.createElement("div");
                        item.className = `voting-item ${isSelected ? "is-voted" : ""} ${hasVoted ? "has-voted" : ""}`.trim();

                        item.innerHTML = `
                            <div class="voting-item-head">
                                <div class="voting-item-meta">
                                    <strong class="voting-item-title">${opt.title}</strong>
                                    <span class="voting-item-desc">${opt.desc}</span>
                                </div>
                                <div class="voting-item-stats">
                                    ${isSelected ? '<span class="voted-tag">DEINE WAHL</span>' : ''}
                                    <span class="voting-percent">${totalVotes > 0 ? percent + '%' : (hasVoted ? '0%' : '')}</span>
                                </div>
                            </div>
                            <div class="voting-bar-wrap">
                                <div class="voting-bar-fill" style="width: ${percent}%;"></div>
                            </div>
                            ${!hasVoted ? `<button type="button" class="voting-btn" data-vote-id="${opt.id}">Zuerst einbauen</button>` : ''}
                        `;

                        if (!hasVoted) {
                            const btn = item.querySelector(".voting-btn");
                            if (btn) {
                                btn.addEventListener("click", () => handleVote(opt.id));
                            }
                        }

                        votingOptionsContainer.appendChild(item);
                    });
                }

                async function loadRealVotes() {
                    if (!client) {
                        renderVoting();
                        return;
                    }

                    try {
                        const { data, error } = await client
                            .from("community_votes")
                            .select("id, votes");

                        if (!error && Array.isArray(data) && data.length > 0) {
                            data.forEach(item => {
                                if (item.id in votesData) {
                                    votesData[item.id] = Number(item.votes) || 0;
                                }
                            });
                        }
                    } catch (e) {
                        console.warn("Community-Votes konnten nicht geladen werden:", e);
                    }

                    renderVoting();
                }

                async function handleVote(optionId) {
                    if (getUserVote()) return;

                    // Sofort lokal markieren, damit kein Doppel-Klick möglich ist
                    try {
                        localStorage.setItem(STORAGE_KEY_USER_VOTE, optionId);
                    } catch (e) {}

                    // Sofort sichtbare Reaktion (optimistic update)
                    votesData[optionId] = (votesData[optionId] || 0) + 1;
                    renderVoting();

                    // An Supabase übertragen
                    if (client) {
                        try {
                            const { error } = await client
                                .rpc("vote_for_feature", { feature_id: optionId });

                            if (error) {
                                console.warn("Supabase RPC vote_for_feature Fehler:", error);
                            } else {
                                // Frische Live-Zahlen abrufen
                                await loadRealVotes();
                            }
                        } catch (err) {
                            console.warn("Netzwerkfehler bei Stimmabgabe:", err);
                        }
                    }
                }

                // Initiale Stimmen abrufen und anzeigen
                loadRealVotes();
            }
        }
    };
})();
