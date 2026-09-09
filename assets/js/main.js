const SUPABASE_URL = "https://yawadxzeyyrozmlrokun.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhd2FkeHpleXlyb3ptbHJva3VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMzQ4MTIsImV4cCI6MjEwMDkxMDgxMn0.B53O3gHURnfxUkVGKaZJ5ssx27Bj9FNMU70Yn85tfxE";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ================= GÄSTEBUCH SPEICHERN =================

const guestbookForm = document.querySelector("#guestbook-form");


if (guestbookForm) {

    guestbookForm.addEventListener("submit", async function(event) {

        event.preventDefault();


        const name = document.querySelector("#guestbook-name").value.trim();

        const message = document.querySelector("#guestbook-message").value.trim();


        if (!name || !message) {

            alert("Bitte Name und Nachricht ausfüllen.");

            return;

        }


        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/guestbook`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "apikey": SUPABASE_KEY,
                    "Authorization": `Bearer ${SUPABASE_KEY}`,
                    "Prefer": "return=minimal"
                },

                body: JSON.stringify({
                    name: name,
                    message: message,
                    approved: false
                })
            }
        );


        if (response.ok) {

            alert(
                "Vielen Dank! Dein Eintrag wurde gespeichert und wird nach Prüfung freigeschaltet."
            );

            guestbookForm.reset();


        } else {

            console.log(await response.text());

            alert(
                "Fehler beim Speichern des Eintrags."
            );

        }

    });

}



// ================= GÄSTEBUCH ANZEIGEN =================

const guestbookEntries = document.querySelector("#guestbook-entries");
const guestbookPagination = document.querySelector("#guestbook-pagination");
const GUESTBOOK_PAGE_SIZE = 5;

if (guestbookEntries) {
    let guestbookPage = 1;

    function renderGuestbookPagination(totalPages) {
        if (!guestbookPagination) return;
        guestbookPagination.replaceChildren();
        guestbookPagination.hidden = totalPages <= 1;
        if (totalPages <= 1) return;

        const createPageButton = (label, page, disabled, className = "") => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = `guestbook-page-button ${className}`.trim();
            button.textContent = label;
            button.disabled = disabled;
            button.setAttribute("aria-label", label);
            if (!disabled) button.addEventListener("click", () => loadGuestbookEntries(page));
            return button;
        };

        guestbookPagination.append(createPageButton("← Zurück", guestbookPage - 1, guestbookPage === 1, "guestbook-page-previous"));
        for (let page = 1; page <= totalPages; page += 1) {
            const button = createPageButton(String(page), page, page === guestbookPage, "guestbook-page-number");
            button.classList.toggle("is-current", page === guestbookPage);
            button.setAttribute("aria-current", page === guestbookPage ? "page" : "false");
            guestbookPagination.append(button);
        }
        guestbookPagination.append(createPageButton("Weiter →", guestbookPage + 1, guestbookPage === totalPages, "guestbook-page-next"));
    }

    async function loadGuestbookEntries(requestedPage = 1) {
        const offset = Math.max(0, (requestedPage - 1) * GUESTBOOK_PAGE_SIZE);
        const { data: { session } = {} } = await supabaseClient.auth.getSession().catch(() => ({}));
        const authToken = session?.access_token || SUPABASE_KEY;
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/guestbook?select=id,name,message,approved,created_at&order=created_at.desc&limit=${GUESTBOOK_PAGE_SIZE}&offset=${offset}`,
            {
                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization": `Bearer ${authToken}`,
                    "Prefer": "count=exact"
                }
            }
        );

        if (!response.ok) throw new Error("Gästebuch konnte nicht geladen werden.");
        const entries = await response.json();
        const countMatch = (response.headers.get("content-range") || "").match(/\/(\d+)$/);
        const totalEntries = countMatch ? Number(countMatch[1]) : entries.length;
        const totalPages = Math.max(1, Math.ceil(totalEntries / GUESTBOOK_PAGE_SIZE));
        guestbookPage = Math.min(Math.max(1, requestedPage), totalPages);

        guestbookEntries.innerHTML = "";
        entries.forEach(entry => {
            const isApproved = Boolean(entry.approved);
            const dateStr = new Date(entry.created_at).toLocaleDateString("de-DE");

            if (isApproved) {
                guestbookEntries.innerHTML += `
                    <div class="guestbook-card">
                        <h3>${escapeHtml(entry.name)}</h3>
                        <p>${escapeHtml(entry.message)}</p>
                        <small>Freigeschaltet am ${dateStr}</small>
                    </div>
                `;
            } else {
                guestbookEntries.innerHTML += `
                    <div class="guestbook-card guestbook-card--pending">
                        <div class="guestbook-card-header">
                            <span class="guestbook-pending-badge">⏳ QUARANTÄNE-PRÜFUNG</span>
                        </div>
                        <h3>${escapeHtml(entry.name)}</h3>
                        <div class="guestbook-pending-notice">
                            <div class="guestbook-pending-title">
                                <span>⚠️</span>
                                <strong>FUNKSPRUCH IN SICHERHEITSPRÜFUNG</strong>
                            </div>
                            <p class="guestbook-pending-text">
                                Dieser Eintrag wurde empfangen und durchläuft aktuell die Sicherheitsprüfung durch das Server-Team. Der Text wird nach Freigabe sichtbar.
                            </p>
                            <div class="guestbook-pending-redacted" aria-hidden="true">
                                <span>████████████████████████████████████████</span>
                            </div>
                        </div>
                        <div class="guestbook-card-footer">
                            <small>Empfangen am ${dateStr} &bull; <em>Freigabe durch Administration ausstehend</em></small>
                        </div>
                    </div>
                `;
            }
        });
        renderGuestbookPagination(totalPages);
    }

    loadGuestbookEntries().catch(() => {
        guestbookEntries.innerHTML = '<p class="guestbook-info">Das Gästebuch wird gerade vorbereitet.</p>';
        if (guestbookPagination) guestbookPagination.hidden = true;
    });
}

// ================= MOBILE MENU =================

const menuToggle = document.querySelector("#menu-toggle");
const navMenu = document.querySelector(".nav-menu");

if (window.location.protocol !== "file:") {
    document.querySelectorAll("[data-bugs-route]").forEach(link => {
        link.setAttribute("href", "/bugs");
    });
}

if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", () => {

        navMenu.classList.toggle("active");

        menuToggle.textContent =
            navMenu.classList.contains("active") ? "✕" : "☰";

    });

}

document.querySelectorAll(".nav-menu a").forEach(link => {

    link.addEventListener("click", () => {

        if (navMenu) navMenu.classList.remove("active");

        if (menuToggle) menuToggle.textContent = "☰";

    });

});

// ================= HEADER SCROLL =================
const headerEl = document.querySelector(".header");
if (headerEl) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            headerEl.classList.add("scrolled");
        } else {
            headerEl.classList.remove("scrolled");
        }
    });
}

// ================= BACK TO TOP =================

const backToTop = document.querySelector("#backToTop");

if (backToTop) {
    window.addEventListener("scroll", () => {

        if (window.scrollY > 500) {

            backToTop.classList.add("show");

        } else {

            backToTop.classList.remove("show");

        }

    });

    backToTop.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });
}
// ==============================
// Neueste Community Screenshots
// ==============================

const latestGallery = document.getElementById("latestGallery");

if (latestGallery) {

    loadLatestGallery();

}

async function loadLatestGallery() {

    const { data, error } = await supabaseClient
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);

    if (error) {

        console.error(error);
        return;

    }

    latestGallery.innerHTML = "";

    data.forEach(entry => {
        const isApproved = Boolean(entry.approved);

        if (isApproved) {
            latestGallery.innerHTML += `

                <article class="gallery-card">

                    <div class="gallery-image">

                        <img
                            src="${entry.image_url}"
                            alt="${escapeHtml(entry.description ?? "")}">

                    </div>

                    <div class="gallery-info">

                        <span>${escapeHtml(entry.uploader)}</span>

                        <p>${escapeHtml(entry.description ?? "")}</p>

                    </div>

                </article>

            `;
        } else {
            latestGallery.innerHTML += `

                <article class="gallery-card gallery-card--pending">

                    <div class="gallery-image gallery-image--pending">

                        <div class="gallery-pending-placeholder">
                            <div class="gallery-pending-icon">📷 ⏳</div>
                            <span class="gallery-pending-badge">IN QUARANTÄNE</span>
                            <small class="gallery-pending-hint">Screenshot wartet auf Freigabe</small>
                        </div>

                    </div>

                    <div class="gallery-info">

                        <span>${escapeHtml(entry.uploader)}</span>

                        <p class="gallery-pending-sub"><em>[Inhalt in Sicherheitsprüfung]</em></p>

                    </div>

                </article>

            `;
        }

    });

}

// ==========================================
// 1. COMMUNITY FEATURE-VOTING (ECHTE STIMMEN VIA SUPABASE)
// ==========================================
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
                : '100% echte Community-Stimmen &bull; 1 Stimme pro Spieler';
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
        if (!supabaseClient) {
            renderVoting();
            return;
        }

        try {
            const { data, error } = await supabaseClient
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
        if (supabaseClient) {
            try {
                const { error } = await supabaseClient
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

// ==========================================
// 2. DAMALS (2013) VS HEUTE (2026) SLIDER
// ==========================================
const comparisonSlider = document.getElementById("comparisonSlider");
const comparisonAfter = document.getElementById("comparisonAfter");
const comparisonHandle = document.getElementById("comparisonHandle");

if (comparisonSlider && comparisonAfter && comparisonHandle) {
    let isDragging = false;

    function setSliderPosition(clientX) {
        const rect = comparisonSlider.getBoundingClientRect();
        let posX = clientX - rect.left;
        posX = Math.max(0, Math.min(posX, rect.width));
        const percent = (posX / rect.width) * 100;

        comparisonAfter.style.width = `${percent}%`;
        comparisonHandle.style.left = `${percent}%`;
        comparisonHandle.setAttribute("aria-valuenow", Math.round(percent));
    }

    // Initial position at 50%
    comparisonAfter.style.width = "50%";
    comparisonHandle.style.left = "50%";

    // Pointer events
    comparisonSlider.addEventListener("pointerdown", (e) => {
        isDragging = true;
        comparisonSlider.setPointerCapture(e.pointerId);
        setSliderPosition(e.clientX);
    });

    comparisonSlider.addEventListener("pointermove", (e) => {
        if (!isDragging) return;
        setSliderPosition(e.clientX);
    });

    const stopDragging = (e) => {
        if (isDragging) {
            isDragging = false;
            try { comparisonSlider.releasePointerCapture(e.pointerId); } catch (err) {}
        }
    };

    comparisonSlider.addEventListener("pointerup", stopDragging);
    comparisonSlider.addEventListener("pointercancel", stopDragging);

    // Keyboard support
    comparisonHandle.addEventListener("keydown", (e) => {
        const currentPercent = parseFloat(comparisonHandle.style.left) || 50;
        if (e.key === "ArrowLeft") {
            const next = Math.max(0, currentPercent - 5);
            comparisonAfter.style.width = `${next}%`;
            comparisonHandle.style.left = `${next}%`;
            comparisonHandle.setAttribute("aria-valuenow", Math.round(next));
            e.preventDefault();
        } else if (e.key === "ArrowRight") {
            const next = Math.min(100, currentPercent + 5);
            comparisonAfter.style.width = `${next}%`;
            comparisonHandle.style.left = `${next}%`;
            comparisonHandle.setAttribute("aria-valuenow", Math.round(next));
            e.preventDefault();
        }
    });
}

// ==========================================
// 3. SURVIVAL FUNKGERÄT (WEB AUDIO AMBIENT)
// ==========================================
const survivalRadio = document.getElementById("survivalRadio");
const radioToggleBtn = document.getElementById("radioToggleBtn");
const radioDrawer = document.getElementById("radioDrawer");
const radioCloseBtn = document.getElementById("radioCloseBtn");
const radioPlayBtn = document.getElementById("radioPlayBtn");
const radioVolume = document.getElementById("radioVolume");
const radioStatusText = document.getElementById("radioStatusText");

if (survivalRadio && radioToggleBtn && radioDrawer && radioPlayBtn) {
    let audioCtx = null;
    let masterGain = null;
    let noiseNode = null;
    let filterNode = null;
    let isPlaying = false;

    // Toggle Drawer
    radioToggleBtn.addEventListener("click", () => {
        const isHidden = radioDrawer.hasAttribute("hidden");
        if (isHidden) {
            radioDrawer.removeAttribute("hidden");
            survivalRadio.classList.add("is-open");
        } else {
            radioDrawer.setAttribute("hidden", "");
            survivalRadio.classList.remove("is-open");
        }
    });

    if (radioCloseBtn) {
        radioCloseBtn.addEventListener("click", () => {
            radioDrawer.setAttribute("hidden", "");
            survivalRadio.classList.remove("is-open");
        });
    }

    function initAudio() {
        if (audioCtx) return;
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        audioCtx = new AudioContextClass();

        masterGain = audioCtx.createGain();
        const currentVol = (radioVolume ? Number(radioVolume.value) : 35) / 100;
        masterGain.gain.setValueAtTime(currentVol * 0.25, audioCtx.currentTime);
        masterGain.connect(audioCtx.destination);
    }

    function startAmbientSound() {
        initAudio();
        if (!audioCtx) return;
        if (audioCtx.state === "suspended") {
            audioCtx.resume();
        }

        // Brown / Pink Noise buffer for atmospheric wind & radio static
        const bufferSize = 2 * audioCtx.sampleRate;
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
            b6 = white * 0.115926;
        }

        noiseNode = audioCtx.createBufferSource();
        noiseNode.buffer = noiseBuffer;
        noiseNode.loop = true;

        // Lowpass filter simulating muted wind / bunker radio atmosphere
        filterNode = audioCtx.createBiquadFilter();
        filterNode.type = "lowpass";
        filterNode.frequency.setValueAtTime(650, audioCtx.currentTime);

        noiseNode.connect(filterNode);
        filterNode.connect(masterGain);
        noiseNode.start(0);

        isPlaying = true;
        survivalRadio.classList.add("is-playing");
        radioPlayBtn.innerHTML = '<i class="fa-solid fa-pause" aria-hidden="true"></i> STOPPEN';
        if (radioStatusText) radioStatusText.textContent = "Status: Empfange Notfunk & Wind...";
    }

    function stopAmbientSound() {
        if (noiseNode) {
            try { noiseNode.stop(0); noiseNode.disconnect(); } catch (e) {}
            noiseNode = null;
        }
        isPlaying = false;
        survivalRadio.classList.remove("is-playing");
        radioPlayBtn.innerHTML = '<i class="fa-solid fa-play" aria-hidden="true"></i> STARTEN';
        if (radioStatusText) radioStatusText.textContent = "Status: Standby (Aus)";
    }

    radioPlayBtn.addEventListener("click", () => {
        if (isPlaying) {
            stopAmbientSound();
        } else {
            startAmbientSound();
        }
    });

    if (radioVolume) {
        radioVolume.addEventListener("input", (e) => {
            const vol = Number(e.target.value) / 100;
            if (masterGain && audioCtx) {
                masterGain.gain.setValueAtTime(vol * 0.25, audioCtx.currentTime);
            }
        });
    }
}
