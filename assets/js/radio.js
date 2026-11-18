/* Survival-Funkgerät (Web Audio, läuft nur lokal im Browser). Aus main.js übernommen, damit es auf allen Homepage-Seiten unten links steht. */
(() => {
    "use strict";
    // Die Stimmen liegen neben den Skripten unter assets/audio, auch für Seiten in Unterordnern.
    const scriptSrc = document.currentScript && document.currentScript.src;
    const VOICE_URL = scriptSrc ? new URL("../audio/funk-stimmen.wav?v=20261118-funk1", scriptSrc).href : null;
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

        // Stimmen im Funk: echte Sprachaufnahmen (CC0, Quellen in assets/audio/README.md), zur Laufzeit schmal,
        // knisternd und teils abgeschnitten gespielt. Je Eintrag: [Start in s, Länge in s, Sprecher].
        // Sprecher "t" sind ganze Sätze, die im Rauschen undeutlich bleiben, die übrigen einzelne Wörter.
        const VOICE_CLIPS = [[0, 0.37, "d1"], [0.45, 1.03, "d2"], [1.56, 1.7, "d3"], [3.34, 0.53, "w"], [3.95, 0.44, "w"], [4.47, 0.73, "w"], [5.28, 0.47, "g"], [5.83, 0.25, "g"], [6.16, 0.49, "g"], [6.73, 0.43, "s"], [7.24, 0.55, "s"], [7.87, 3.08, "t"], [11.03, 5.23, "t"], [16.34, 2.38, "t"]];
        let voiceBuffer = null;
        let voiceLoading = null;
        let voiceTimer = null;
        let crackleBuffer = null;
        const voiceSources = new Set();
        const pick = (list) => list[Math.floor(Math.random() * list.length)];
        const between = (min, max) => min + Math.random() * (max - min);

        function loadVoices() {
            if (voiceBuffer || voiceLoading || !VOICE_URL || !audioCtx || !window.fetch) return;
            voiceLoading = fetch(VOICE_URL)
                .then((response) => {
                    if (!response.ok) throw new Error(String(response.status));
                    return response.arrayBuffer();
                })
                .then((data) => new Promise((resolve, reject) => audioCtx.decodeAudioData(data, resolve, reject)))
                .then((buffer) => { voiceBuffer = buffer; })
                .catch(() => { voiceLoading = null; }); // Ohne Stimmen läuft das Rauschen wie bisher weiter.
        }

        function scheduleVoice(first) {
            clearTimeout(voiceTimer);
            const wait = first ? between(6, 14) : between(14, 42);
            voiceTimer = setTimeout(() => {
                if (!isPlaying) return;
                playTransmission();
                scheduleVoice(false);
            }, wait * 1000);
        }

        function stopVoices() {
            clearTimeout(voiceTimer);
            voiceTimer = null;
            voiceSources.forEach((source) => {
                try { source.stop(0); } catch (e) {}
            });
            voiceSources.clear();
        }

        function track(source) {
            voiceSources.add(source);
            source.onended = () => {
                voiceSources.delete(source);
                try { source.disconnect(); } catch (e) {}
            };
        }

        // Kurzes Knacken wie beim Öffnen und Schließen der Sperre im Funk.
        function crackle(destination, at, length, level) {
            if (!crackleBuffer) {
                crackleBuffer = audioCtx.createBuffer(1, Math.floor(audioCtx.sampleRate * 0.3), audioCtx.sampleRate);
                const data = crackleBuffer.getChannelData(0);
                for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (Math.random() < 0.08 ? 1 : 0.35);
            }
            const source = audioCtx.createBufferSource();
            source.buffer = crackleBuffer;
            const band = audioCtx.createBiquadFilter();
            band.type = "bandpass";
            band.frequency.value = between(1400, 2600);
            band.Q.value = 0.8;
            const env = audioCtx.createGain();
            env.gain.setValueAtTime(level, at);
            env.gain.exponentialRampToValueAtTime(0.001, at + length);
            source.connect(band);
            band.connect(env);
            env.connect(destination);
            track(source);
            source.start(at, between(0, 0.3 - length));
            source.stop(at + length + 0.02);
        }

        function playTransmission() {
            if (!voiceBuffer || !audioCtx || audioCtx.state !== "running" || !VOICE_CLIPS.length) return;
            const talk = Math.random() < 0.4;
            const pool = VOICE_CLIPS.filter((clip) => (clip[2] === "t") === talk);
            if (!pool.length) return;
            let clips = [pick(pool)];
            if (!talk) {
                const speaker = clips[0][2];
                const own = pool.filter((clip) => clip[2] === speaker).sort(() => Math.random() - 0.5);
                clips = own.slice(0, 1 + Math.floor(Math.random() * Math.min(3, own.length)));
            }

            // Schmales Funkband, leicht übersteuert. Ganze Sätze bekommen ein noch engeres Band und bleiben dadurch undeutlich.
            const highpass = audioCtx.createBiquadFilter();
            highpass.type = "highpass";
            highpass.frequency.value = talk ? 260 : 420;
            const lowpass = audioCtx.createBiquadFilter();
            lowpass.type = "lowpass";
            lowpass.frequency.value = talk ? between(620, 820) : between(2300, 2900);
            const shaper = audioCtx.createWaveShaper();
            const curve = new Float32Array(1024);
            const drive = talk ? 2.2 : 3.2;
            for (let i = 0; i < curve.length; i++) curve[i] = Math.tanh(drive * (i / 511.5 - 1)) / Math.tanh(drive);
            shaper.curve = curve;
            const gate = audioCtx.createGain();
            const level = audioCtx.createGain();
            level.gain.value = talk ? between(0.5, 0.7) : between(0.35, 0.5);
            highpass.connect(lowpass);
            lowpass.connect(shaper);
            shaper.connect(gate);
            gate.connect(level);
            level.connect(masterGain);

            let at = audioCtx.currentTime + 0.25;
            crackle(level, at - 0.12, between(0.08, 0.16), 0.5);
            clips.forEach((clip, index) => {
                // Teils abgeschnitten: manchmal fehlt das Ende, Sätze brechen öfter ab.
                const cut = Math.random() < (talk ? 0.5 : 0.2) ? between(0.65, 0.9) : 1;
                const part = clip[1] * cut;
                const rate = between(0.97, 1.03);
                const length = part / rate;
                const source = audioCtx.createBufferSource();
                source.buffer = voiceBuffer;
                source.playbackRate.value = rate;
                const env = audioCtx.createGain();
                env.gain.setValueAtTime(0, at);
                env.gain.linearRampToValueAtTime(1, at + 0.012);
                env.gain.setValueAtTime(1, at + length - 0.02);
                env.gain.linearRampToValueAtTime(0, at + length);
                source.connect(env);
                env.connect(highpass);
                track(source);
                source.start(at, clip[0], part);

                // Kurze Aussetzer im Empfang, bei Wörtern selten, bei Sätzen öfter.
                const dropouts = talk ? 2 + Math.floor(Math.random() * 3) : (Math.random() < 0.35 ? 1 : 0);
                const starts = [];
                for (let d = 0; d < dropouts; d++) starts.push(at + between(0.1, Math.max(0.15, length - 0.15)));
                starts.sort((a, b) => a - b);
                gate.gain.setValueAtTime(1, at);
                let free = at;
                for (const start of starts) {
                    if (start < free) continue;
                    const span = talk ? between(0.08, 0.25) : between(0.04, 0.09);
                    free = start + span + 0.05;
                    gate.gain.setValueAtTime(1, start);
                    gate.gain.linearRampToValueAtTime(0.06, start + 0.01);
                    gate.gain.setValueAtTime(0.06, start + span);
                    gate.gain.linearRampToValueAtTime(1, start + span + 0.01);
                    crackle(level, start, 0.05, 0.25);
                }
                at += length + (index < clips.length - 1 ? between(0.35, 0.9) : 0);
            });
            crackle(level, at + 0.03, between(0.1, 0.2), 0.45);
            setTimeout(() => {
                [highpass, lowpass, shaper, gate, level].forEach((node) => {
                    try { node.disconnect(); } catch (e) {}
                });
            }, (at - audioCtx.currentTime + 1) * 1000);
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
            if (radioStatusText) radioStatusText.textContent = "Status: Empfange Notfunk";
            loadVoices();
            scheduleVoice(true);
        }

        function stopAmbientSound() {
            if (noiseNode) {
                try { noiseNode.stop(0); noiseNode.disconnect(); } catch (e) {}
                noiseNode = null;
            }
            stopVoices();
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
