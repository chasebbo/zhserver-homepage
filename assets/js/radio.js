/* Survival-Funkgerät (Web Audio, läuft nur lokal im Browser). Aus main.js übernommen, damit es auf allen Homepage-Seiten unten links steht. */
(() => {
    "use strict";
    // Auf Seiten ohne eigenes Funkgerät wird das gleiche Markup wie auf der Startseite ergänzt.
    if (!document.getElementById("survivalRadio")) {
        document.body.insertAdjacentHTML("beforeend", `<aside class="survival-radio-widget" id="survivalRadio" aria-label="Survival Funkgerät">
    <button class="radio-toggle-btn" id="radioToggleBtn" type="button" aria-label="Survival-Funkgerät öffnen" title="Survival-Funkgerät einblenden">
        <span class="radio-btn-label">FUNKGERÄT</span>
    </button>
    <div class="radio-drawer" id="radioDrawer" hidden>
        <div class="radio-drawer-header">
            <span class="radio-freq">ZH-NOTFUNK 94.2 MHz</span>
            <button class="radio-close-btn" id="radioCloseBtn" type="button" aria-label="Schließen">&times;</button>
        </div>
        <div class="radio-status-text" id="radioStatusText">Status: Standby (Aus)</div>
        <div class="radio-controls">
            <button class="radio-action-btn" id="radioPlayBtn" type="button">STARTEN</button>
            <div class="radio-volume-wrap" title="Lautstärke anpassen">
                <input type="range" id="radioVolume" min="0" max="100" value="35" aria-label="Lautstärke">
            </div>
        </div>
        <div class="radio-info">
            <small>Synthetische Endzeit-Kulisse (Funkrauschen, ferner Wind &amp; Knistern). Läuft 100% lokal im Browser.</small>
        </div>
    </div>
</aside>`);
    }
    // ==========================================
    // 2. SURVIVAL FUNKGERÄT (WEB AUDIO AMBIENT)
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
})();
