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

        // Stimmen im Funk: echte Sprachaufnahmen (CC0, Quellen in assets/audio/README.md). Ein Funkspruch besteht aus
        // Bruchstücken mit Rauschen dazwischen: Wörter reißen mitten im Wort ab, gehen ganz verloren oder kommen kurz
        // deutlicher durch. Je Abschnitt der Datei: Name: [Start in s, Länge in s]. t1 und t2 sind ganze Sätze, die nur
        // gedämpft durchkommen, sodass man lediglich hört, dass jemand spricht.
        const VOICE_CLIPS = { help: [0, 0.25], hello: [0.33, 0.47], anyone: [0.88, 0.63], hear: [1.59, 0.37], me: [2.04, 0.39], can: [2.51, 0.43], someone: [3.02, 0.52], please: [3.62, 0.49], north: [4.19, 0.38], east: [4.65, 0.39], south: [5.12, 0.44], west: [5.64, 0.41], zero: [6.13, 0.56], one: [6.77, 0.52], two: [7.37, 0.46], three: [7.91, 0.54], four: [8.53, 0.48], five: [9.09, 0.58], six: [9.75, 0.46], seven: [10.29, 0.48], eight: [10.85, 0.33], nine: [11.26, 0.56], position: [11.9, 0.63], over: [12.61, 0.46], repeat: [13.15, 0.52], injured: [13.75, 0.53], Hilfe: [14.36, 1.7], Hallo: [16.14, 0.37], eins: [16.59, 0.89], zwei: [17.56, 0.55], drei: [18.19, 0.51], vier: [18.78, 0.47], "fünf": [19.33, 0.48], sechs: [19.89, 0.59], sieben: [20.56, 1.02], acht: [21.66, 0.48], neun: [22.22, 0.52], "hören": [22.82, 0.63], kommen: [23.53, 0.62], "t1": [24.23, 5.99], "t2": [30.3, 3.41] };
        // Funksprüche: Wörter aus VOICE_CLIPS, "#e" und "#d" eine englische oder deutsche Zahl, "~" ein Stück gedämpftes Sprechen.
        const MESSAGES = [
            ["help", "help", "~", "anyone"],
            ["hello", "anyone", "hear", "me"],
            ["can", "anyone", "hear", "me", "over"],
            ["position", "#e", "#e", "north", "#e", "#e", "#e", "east"],
            ["injured", "~", "please", "help"],
            ["repeat", "position", "#e", "#e", "south", "#e", "west"],
            ["someone", "~", "help", "over"],
            ["Hilfe", "~", "Hilfe"],
            ["Hallo", "hören", "~", "kommen"],
            ["#d", "#d", "#d", "~", "#d", "#d"],
            ["Hallo", "~", "help", "position", "#e", "#e"],
            ["Hilfe", "anyone", "hear", "~", "#d", "#d", "#d"],
            ["~", "~"]
        ];
        const DIGITS = {
            e: ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"],
            d: ["eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun"]
        };
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
            // Lange Pausen mit nur Rauschen gehören dazu.
            const wait = first ? between(5, 12) : between(20, 50);
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

        // Ein Zweig des Funkbands: Hochpass, Tiefpass, leichte Übersteuerung, Aussetzer-Regler, Pegel.
        function radioBand(low, high, drive, boost, destination) {
            const highpass = audioCtx.createBiquadFilter();
            highpass.type = "highpass";
            highpass.frequency.value = low;
            const lowpass = audioCtx.createBiquadFilter();
            lowpass.type = "lowpass";
            lowpass.frequency.value = high;
            const shaper = audioCtx.createWaveShaper();
            const curve = new Float32Array(1024);
            for (let i = 0; i < curve.length; i++) curve[i] = Math.tanh(drive * (i / 511.5 - 1)) / Math.tanh(drive);
            shaper.curve = curve;
            const gate = audioCtx.createGain();
            highpass.connect(lowpass);
            lowpass.connect(shaper);
            shaper.connect(gate);
            const out = audioCtx.createGain();
            out.gain.value = boost;
            gate.connect(out);
            out.connect(destination);
            return { input: highpass, gate, nodes: [highpass, lowpass, shaper, gate, out] };
        }

        // Kurzer Aussetzer im Empfang mit Knacken.
        function dropout(band, start, span, destination) {
            band.gate.gain.setValueAtTime(1, start);
            band.gate.gain.linearRampToValueAtTime(0.04, start + 0.01);
            band.gate.gain.setValueAtTime(0.04, start + span);
            band.gate.gain.linearRampToValueAtTime(1, start + span + 0.015);
            crackle(destination, start, 0.05, 0.22);
        }

        function playPart(band, offset, part, at, abrupt) {
            const rate = between(0.97, 1.03);
            const length = part / rate;
            const source = audioCtx.createBufferSource();
            source.buffer = voiceBuffer;
            source.playbackRate.value = rate;
            const env = audioCtx.createGain();
            env.gain.setValueAtTime(0, at);
            env.gain.linearRampToValueAtTime(1, at + 0.012);
            env.gain.setValueAtTime(1, at + length - (abrupt ? 0.006 : 0.03));
            env.gain.linearRampToValueAtTime(0, at + length);
            source.connect(env);
            env.connect(band.input);
            track(source);
            source.start(at, offset, part);
            return length;
        }

        function playTransmission() {
            if (!voiceBuffer || !audioCtx || audioCtx.state !== "running" || !VOICE_CLIPS.help) return;
            const tokens = pick(MESSAGES).map((token) => token[0] === "#" ? pick(DIGITS[token[1]]) : token);
            // Wie gut der Spruch durchkommt: mal fast nichts, mal ein Stück deutlicher.
            const clarity = between(0.15, 1);

            const level = audioCtx.createGain();
            level.connect(masterGain);
            const words = radioBand(420, 1500 + clarity * 1300, 3, 1, level);
            const talk = radioBand(180, between(360, 480), 2.4, 1.8, level);

            let at = audioCtx.currentTime + 0.3;
            const base = between(0.28, 0.42) * (0.55 + 0.45 * clarity);
            // Schwund: die Lautstärke wandert langsam auf und ab.
            level.gain.setValueAtTime(base, at);
            crackle(level, at - 0.15, between(0.08, 0.16), 0.45);

            const lose = 0.15 + (1 - clarity) * 0.35;
            const lost = tokens.map(() => Math.random() < lose);
            if (lost.every(Boolean)) lost[Math.floor(Math.random() * lost.length)] = false;

            tokens.forEach((token, index) => {
                if (lost[index]) {
                    // Geht ganz verloren: nur Rauschen, manchmal ein Knacken.
                    if (Math.random() < 0.4) crackle(level, at + between(0.05, 0.3), 0.06, 0.3);
                    at += between(0.35, 0.9);
                    return;
                }
                let length;
                if (token === "~") {
                    // Gedämpftes Sprechen aus einem der Sätze, ohne verständliche Wörter.
                    const sentence = VOICE_CLIPS[pick(["t1", "t2"])];
                    const part = Math.min(sentence[1] - 0.2, tokens.length === 2 ? between(1.8, 3.4) : between(0.8, 2));
                    const offset = sentence[0] + between(0, sentence[1] - part);
                    length = playPart(talk, offset, part, at, false);
                    const count = 1 + Math.floor(Math.random() * 3);
                    for (let d = 0; d < count; d++) dropout(talk, at + (d + between(0.2, 0.7)) * length / count, between(0.06, 0.2), level);
                } else {
                    const clip = VOICE_CLIPS[token];
                    if (!clip) return;
                    // Reißt mitten im Wort ab, am Ende des Spruchs öfter.
                    const abrupt = Math.random() < (index === tokens.length - 1 ? 0.5 : 0.3);
                    const part = clip[1] * (abrupt ? between(0.35, 0.8) : 1);
                    length = playPart(words, clip[0], part, at, abrupt);
                    if (abrupt) crackle(level, at + length, between(0.04, 0.09), 0.35);
                    else if (Math.random() < 0.3) dropout(words, at + between(0.1, 0.6) * length, between(0.04, 0.08), level);
                }
                level.gain.linearRampToValueAtTime(base * between(0.35, 1), at + length);
                // Rauschen zwischen den Bruchstücken, manchmal länger.
                at += length + (Math.random() < 0.2 ? between(1.4, 2.4) : between(0.25, 1));
            });
            crackle(level, at, between(0.1, 0.2), 0.4);
            setTimeout(() => {
                [level, ...words.nodes, ...talk.nodes].forEach((node) => {
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
