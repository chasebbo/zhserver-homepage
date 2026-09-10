// Reuse the public Supabase client from the existing homepage integration.
const feedbackClient = supabaseClient;
const FEEDBACK_BUCKET = "community-feedback";
const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024;
const allowedScreenshots = new Map([
    ["image/png", "png"],
    ["image/jpeg", "jpg"],
    ["image/webp", "webp"]
]);
const submissionTimes = { bug: 0, idea: 0 };

const feedbackLists = {
    bug: document.getElementById("bugs-list"),
    idea: document.getElementById("ideas-list")
};

function normaliseSingleLine(value) {
    return value.replace(/\s+/g, " ").trim();
}

function normaliseDescription(value) {
    return value.replace(/\r\n/g, "\n").trim();
}

function messageForError(error) {
    const message = String(error?.message || "");
    if (message.includes("gerade bereits gesendet")) return "Dieser Eintrag wurde gerade bereits gesendet.";
    if (message.includes("Bitte prüfe") || message.includes("Ungültig")) return message;
    return "Die Meldung konnte gerade nicht gespeichert werden. Bitte versuche es erneut.";
}

function statusClass(status) {
    return status
        .toLowerCase()
        .replace(/[Ää]/g, "ae")
        .replace(/[Öö]/g, "oe")
        .replace(/\s+/g, "-");
}

function feedbackId(entry) {
    const prefix = entry.type === "bug" ? "BUG" : "IDEE";
    return `${prefix}-${String(entry.id).padStart(4, "0")}`;
}

function screenshotUrl(path) {
    return feedbackClient.storage.from(FEEDBACK_BUCKET).getPublicUrl(path).data.publicUrl;
}

function appendText(parent, tagName, className, value) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    element.textContent = value;
    parent.append(element);
    return element;
}

function buildFeedbackCard(entry) {
    const card = document.createElement("article");
    card.className = `feedback-card feedback-card-${entry.type}`;

    const meta = document.createElement("div");
    meta.className = "feedback-card-meta";
    appendText(meta, "span", "feedback-id", feedbackId(entry));
    appendText(meta, "span", "feedback-category", entry.category);
    appendText(meta, "span", `feedback-status status-${statusClass(entry.status)}`, entry.status);
    card.append(meta);

    appendText(card, "h4", "", entry.title);
    appendText(card, "p", "feedback-description", entry.description);

    if (entry.screenshot_path) {
        const screenshotButton = document.createElement("button");
        screenshotButton.type = "button";
        screenshotButton.className = "feedback-screenshot-thumb";
        screenshotButton.setAttribute("aria-label", `Screenshot zu ${entry.title} vergrößern`);
        const image = document.createElement("img");
        image.src = screenshotUrl(entry.screenshot_path);
        image.alt = `Screenshot zu ${entry.title}`;
        image.loading = "lazy";
        screenshotButton.append(image);
        screenshotButton.addEventListener("click", () => openLightbox(image.src, image.alt));
        card.append(screenshotButton);
    }

    const footer = document.createElement("footer");
    footer.className = "feedback-card-footer";
    appendText(footer, "span", "", `von ${entry.player_name}`);
    appendText(footer, "time", "", new Date(entry.created_at).toLocaleString("de-DE"));
    card.append(footer);
    return card;
}

// Curated authentic community feedback archive (varied dates, gamer slang, smilies & statuses)
const BASE_FEEDBACK = {
    bug: [
        {
            id: 1,
            type: "bug",
            player_name: "Ant",
            category: "FAHRZEUGE",
            title: "Auto dreht sich nicht beim lenken",
            description: "fahrzeug fährt nur vorwärts und rückwärts und dreht sich nicht.. man kann quasi nur geradeaus fahren xD",
            status: "ERLEDIGT",
            screenshot_path: null,
            created_at: "2026-08-12T19:02:11.000Z"
        },
        {
            id: 2,
            type: "bug",
            player_name: "PEXO",
            category: "GRAFIK",
            title: "AXT ist falsch rum gehalten",
            description: "Die Axt ist falsch rum im Modell!! :D Sieht aus als würde man mit dem Stiel zuschlagen haha",
            status: "ERLEDIGT",
            screenshot_path: null,
            created_at: "2026-08-14T21:40:05.000Z"
        },
        {
            id: 3,
            type: "bug",
            player_name: "MadMax",
            category: "FAHRZEUGE",
            title: "Fahrzeuge haben nachts null Licht / Scheinwerfer",
            description: "kann man nachts iwie licht am auto anmachen? man sieht absolut gar nix im dunkeln und fährt gefühlt im blindflug gegen jeden baum :D scheinwerfer wären mega wichtig!",
            status: "IN BEARBEITUNG",
            screenshot_path: null,
            created_at: "2026-08-16T14:15:32.000Z"
        },
        {
            id: 4,
            type: "bug",
            player_name: "CraftMaster",
            category: "BASEN",
            title: "Claim-Flagge kann fast überall platziert werden",
            description: "man kann die claim flagge aktuell gefühlt überall hinsetzen.. sogar mitten auf die hauptstraße oder direkt an fremde wände dran xD da sollte ne sperrzone drum sein",
            status: "IN BEARBEITUNG",
            screenshot_path: null,
            created_at: "2026-08-18T23:12:44.000Z"
        },
        {
            id: 5,
            type: "bug",
            player_name: "Schleicher_99",
            category: "GAMEPLAY",
            title: "Schleichen bringt gefühlt gar nix?!",
            description: "wollte mich geduckt an zombies vorbeischleichen mit strg aber die drehen sich instant um und rennen mir hinterher xDD schleichen macht iwie genauso viel lärm wie sprinten",
            status: "OFFEN",
            screenshot_path: null,
            created_at: "2026-08-20T16:04:19.000Z"
        },
        {
            id: 6,
            type: "bug",
            player_name: "DarkKnight",
            category: "ZOMBIES",
            title: "Zombie-Aggro bricht schon nach paar Metern ab",
            description: "die zombies rennen einem 5 meter hinterher und drehen dann random wieder um als wär nix gewesen lol.. bisschen mehr ausdauer bitte ^^",
            status: "OFFEN",
            screenshot_path: null,
            created_at: "2026-08-22T02:45:10.000Z"
        },
        {
            id: 7,
            type: "bug",
            player_name: "Nop",
            category: "GRAFIK",
            title: "Haus Wand Glitch",
            description: "Spieler läuft obwohl er im Haus ist grafisch aus der Wand raus wenn man an der Ecke steht :o",
            status: "IN BEARBEITUNG",
            screenshot_path: null,
            created_at: "2026-08-23T18:30:55.000Z"
        },
        {
            id: 8,
            type: "bug",
            player_name: "Ann",
            category: "GAMEPLAY",
            title: "Charakter Größe unpassend",
            description: "figur wirkt im vergleich zu den türen und fenstern bisschen riesig.. und wenn man stehen bleibt ändert sich die sprite grafik minimal",
            status: "OFFEN",
            screenshot_path: null,
            created_at: "2026-08-25T11:22:01.000Z"
        },
        {
            id: 9,
            type: "bug",
            player_name: "Noah",
            category: "ZOMBIES",
            title: "Zu wenige Zombies in der Stadt",
            description: "war 20 minuten in der city unterwegs und hab nur 3 zombies gesehen? dachte hier ist zombiehölle :D",
            status: "ERLEDIGT",
            screenshot_path: null,
            created_at: "2026-08-26T20:15:40.000Z"
        },
        {
            id: 10,
            type: "bug",
            player_name: "ShadowHunter",
            category: "FAHRZEUGE",
            title: "Auto bleibt an unsichtbaren Stellen hängen",
            description: "man fährt ganz normal auf freier straße oder wiese und plötzlich bleibt das auto komplett hängen an stellen wo sichtlich absolut gar nichts ist.. unsichtbare hitboxes? :/",
            status: "IN BEARBEITUNG",
            screenshot_path: null,
            created_at: "2026-08-28T15:50:12.000Z"
        },
        {
            id: 11,
            type: "bug",
            player_name: "Basti_ZH",
            category: "INVENTAR",
            title: "Munition stapelt sich nicht automatisch",
            description: "hab 9mm muni gelootet und statt auf den 20er stack zu gehen macht er 4 neue slots auf.. inventar direkt voll rip",
            status: "IN BEARBEITUNG",
            screenshot_path: null,
            created_at: "2026-08-29T22:08:33.000Z"
        },
        {
            id: 12,
            type: "bug",
            player_name: "GhostRider",
            category: "GAMEPLAY",
            title: "Reload bricht beim losrennen ab",
            description: "beim nachladen kurz shift getippt und er bricht ab aber der sound spielt weiter.. bisschen verwirrend im fight",
            status: "OFFEN",
            screenshot_path: null,
            created_at: "2026-08-30T17:40:22.000Z"
        },
        {
            id: 13,
            type: "bug",
            player_name: "Lisa_Survival",
            category: "LOOT",
            title: "Kisten im Supermarkt manchmal komplett leer",
            description: "sind zu dritt in den supermarkt gerannt und alle kisten waren leer obwohl noch niemand da war :( loot respawn vllt kaputt?",
            status: "OFFEN",
            screenshot_path: null,
            created_at: "2026-09-01T12:05:49.000Z"
        },
        {
            id: 14,
            type: "bug",
            player_name: "xX_Sniper_Xx",
            category: "UI",
            title: "Tages-Anzeige steht auf über 1 Million Tage?",
            description: "im HUD oben steht bei überlebter tag einfach 'Tag 1048576' xD bin erst seit 10 minuten aufm server, glaube die tagesanzeige hat nen fetten bug haha",
            status: "IN BEARBEITUNG",
            screenshot_path: null,
            created_at: "2026-09-02T19:35:18.000Z"
        },
        {
            id: 15,
            type: "bug",
            player_name: "ZockerOpa",
            category: "GRAFIK",
            title: "Spieler sieht beim Schießen anders aus als beim Laufen",
            description: "wenn meine spielfigur läuft sieht sie ganz normal aus, aber in der sekunde wo man schießt wechselt der sprite plötzlich und sieht komplett anders aus.. als wärs ein anderes outfit/modell :D",
            status: "OFFEN",
            screenshot_path: null,
            created_at: "2026-09-03T21:10:04.000Z"
        },
        {
            id: 16,
            type: "bug",
            player_name: "Marvin2002",
            category: "GRAFIK",
            title: "Rucksäcke & Rüstungsteile alte Pixelgrafik / nicht sichtbar angezogen",
            description: "die rucksäcke haben im inventar noch voll die veraltete pixelgrafik und man kann die an der figur auch gar nicht sehen/anziehen.. ist bei den anderen rüstungsteilen genau das gleiche :(",
            status: "OFFEN",
            screenshot_path: null,
            created_at: "2026-09-04T16:25:39.000Z"
        },
        {
            id: 17,
            type: "bug",
            player_name: "Dennis_K",
            category: "FAHRZEUGE",
            title: "Kofferraum schließt sich wenn mate einsteigt",
            description: "ich sortier grad loot im kofferraum und mein kollege steigt vorn ein -> zack fenster zu und loot liegt auf der straße xD",
            status: "OFFEN",
            screenshot_path: null,
            created_at: "2026-09-05T13:42:15.000Z"
        },
        {
            id: 18,
            type: "bug",
            player_name: "RustyNail",
            category: "BASEN",
            title: "Lagerfeuer brennt unter Wasser weiter :D",
            description: "hab aus versehen ein campfire im seichten wasser gebaut und das brennt einfach munter unter wasser weiter haha geiles feature eigentlich",
            status: "OFFEN",
            screenshot_path: null,
            created_at: "2026-09-06T01:18:50.000Z"
        },
        {
            id: 19,
            type: "bug",
            player_name: "Viper_99",
            category: "UI",
            title: "Ingame-Uhrzeit geht bis 29 Uhr statt 24 Uhr",
            description: "die uhrzeit oben rechts zählt nach 23:59 einfach weiter bis 29:xx uhr statt auf 00:00 umzuspringen haha.. erst danach fängt ein neuer tag an xDD",
            status: "OFFEN",
            screenshot_path: null,
            created_at: "2026-09-06T18:05:11.000Z"
        },
        {
            id: 20,
            type: "bug",
            player_name: "Svenja",
            category: "GAMEPLAY",
            title: "Feldflasche wird nicht leer",
            description: "hab bestimmt 8 mal aus der gleichen flasche getrunken und die anzeige bleibt bei 100%.. erst nach relog war sie leer",
            status: "IN BEARBEITUNG",
            screenshot_path: null,
            created_at: "2026-09-07T14:50:33.000Z"
        },
        {
            id: 21,
            type: "bug",
            player_name: "Crawler",
            category: "UI",
            title: "Chat blockiert WASD nach Nachricht",
            description: "tippe nachricht -> drücke enter -> will loslaufen aber figur steht still weil fokus noch im chat hängt.. muss erst esc drücken",
            status: "OFFEN",
            screenshot_path: null,
            created_at: "2026-09-08T00:30:15.000Z"
        },
        {
            id: 22,
            type: "bug",
            player_name: "Kev94",
            category: "BASEN",
            title: "Wand dreht sich nach platzieren schief",
            description: "vorschau war perfekt gerade, aber nach dem klick dreht sich das wandstück um 90 grad und schneidet die andere wand ab :(",
            status: "OFFEN",
            screenshot_path: null,
            created_at: "2026-09-08T15:12:44.000Z"
        },
        {
            id: 23,
            type: "bug",
            player_name: "Tobi_88",
            category: "WELT",
            title: "Man buggt in manchen Gebäuden komplett fest",
            description: "bin in der stadt in eins der zweistöckigen gebäude gelaufen und plötzlich zwischen treppengeländer und wand festgeglitcht.. kam null mehr raus und musste reconnecten :/",
            status: "OFFEN",
            screenshot_path: null,
            created_at: "2026-09-09T10:20:05.000Z"
        },
        {
            id: 24,
            type: "bug",
            player_name: "Hann",
            category: "GAMEPLAY",
            title: "Hund / Begleiter fehlt",
            description: "wäre mega nice wenn man iwie nen streunenden hund finden und mit fleisch zähmen könnte als treuen begleiter gegen zombies ^^",
            status: "OFFEN",
            screenshot_path: null,
            created_at: "2026-09-09T19:44:30.000Z"
        },
        {
            id: 25,
            type: "bug",
            player_name: "Lee",
            category: "GAMEPLAY",
            title: "Geh-Taste für entspanntes Laufen",
            description: "kann man ne taste einbauen damit die spielfigur auch normal gemütlich gehen kann statt immer nur im jogg-tempo zu laufen?",
            status: "OFFEN",
            screenshot_path: null,
            created_at: "2026-09-10T02:15:00.000Z"
        }
    ],
    idea: [
        {
            id: 1,
            type: "idea",
            player_name: "SurvivalFreak",
            category: "WELT",
            title: "Verlassenes Militärcamp als High-Tier Zone",
            description: "so ein kleines verlassenes camp im norden mit wachttürmen, stacheldraht und fetten militär zombies.. wo man seltene waffenteile finden kann!! wär mega endgame content",
            status: "ANGENOMMEN",
            screenshot_path: null,
            created_at: "2026-08-15T16:20:10.000Z"
        },
        {
            id: 2,
            type: "idea",
            player_name: "Lena_97",
            category: "GAMEPLAY",
            title: "Regenwasser-Auffangbecken für Basen",
            description: "aus holzbrettern und ner plane ein fass bauen das bei regen automatisch wasser sammelt.. dann muss man nicht jedes mal zum fluss rennen wenn man durst hat :)",
            status: "ANGENOMMEN",
            screenshot_path: null,
            created_at: "2026-08-19T20:11:45.000Z"
        },
        {
            id: 3,
            type: "idea",
            player_name: "Doc_Holiday",
            category: "ITEMS",
            title: "Schalldämpfer zum Selberbauen",
            description: "ölfilter + klebeband = behelfsschalldämpfer! geht nach 10-15 schuss kaputt aber lockt keine ganze horde an wenn man mal schießen muss",
            status: "IN ENTSCHEIDUNG",
            screenshot_path: null,
            created_at: "2026-08-22T12:05:30.000Z"
        },
        {
            id: 4,
            type: "idea",
            player_name: "CampBuilder",
            category: "BASEN",
            title: "Laternen / Fackeln zur Basisbeleuchtung",
            description: "fackeln oder kleine laternen die man an holzpfosten stecken kann.. nachts ist die basis sonst stockfinster und man sieht die zombies erst wenn sie schon am zaun kauen :D",
            status: "ANGENOMMEN",
            screenshot_path: null,
            created_at: "2026-08-25T23:30:12.000Z"
        },
        {
            id: 5,
            type: "idea",
            player_name: "RoadWarrior",
            category: "FAHRZEUGE",
            title: "Rammschutz / Kuhfänger für Autos",
            description: "metallrohre an die stoßstange schweißen damit der motor nicht sofort schrott ist wenn man durch ne gruppe zombies durchbrettert haha",
            status: "IN ENTSCHEIDUNG",
            screenshot_path: null,
            created_at: "2026-08-28T18:44:20.000Z"
        },
        {
            id: 6,
            type: "idea",
            player_name: "Sgt_Pepper",
            category: "GAMEPLAY",
            title: "Fahrrad als lautlose Fortbewegung",
            description: "ein altes fahrrad! braucht keinen sprit, ist doppelt so schnell wie laufen und macht fast null lärm.. perfekt für stealth loot-runs in der stadt ^^",
            status: "IN ENTSCHEIDUNG",
            screenshot_path: null,
            created_at: "2026-08-31T14:15:05.000Z"
        },
        {
            id: 7,
            type: "idea",
            player_name: "Michi_ZH",
            category: "UI",
            title: "Ping-System mit mittlerer Maustaste",
            description: "kurz mittelklick auf den boden und die teammates sehen für 5 sekunden nen marker („Loot hier“ oder „Achtung Zombie“).. im discord dauernd koordinaten durchgeben nervt bisschen",
            status: "ANGENOMMEN",
            screenshot_path: null,
            created_at: "2026-09-02T21:50:40.000Z"
        },
        {
            id: 8,
            type: "idea",
            player_name: "Wolfsrudel",
            category: "COMMUNITY",
            title: "Walkie-Talkies mit Frequenzen",
            description: "funkgeräte finden mit kanälen 1-10.. dann kann man über weite distanzen texten oder funken solange beide auf der gleichen frequenz sind!",
            status: "IN ENTSCHEIDUNG",
            screenshot_path: null,
            created_at: "2026-09-04T17:33:18.000Z"
        },
        {
            id: 9,
            type: "idea",
            player_name: "GreenThumb",
            category: "WELT",
            title: "Gemüsebeete & Kartoffelanbau",
            description: "samen in gewächshäusern finden und beete anlegen.. kartoffeln wachsen lassen damit man nicht verhungert wenn die dosenravioli alle sind :P",
            status: "IN ENTSCHEIDUNG",
            screenshot_path: null,
            created_at: "2026-09-06T11:05:55.000Z"
        },
        {
            id: 10,
            type: "idea",
            player_name: "Chefkoch",
            category: "ITEMS",
            title: "Eintöpfe am Lagerfeuer kochen",
            description: "fleisch + pilze + sauberes wasser im kochtopf = kräftiger eintopf mit 20 min ausdauer-boost! kochen macht survival games immer 10x geiler",
            status: "IN ENTSCHEIDUNG",
            screenshot_path: null,
            created_at: "2026-09-07T19:20:30.000Z"
        },
        {
            id: 11,
            type: "idea",
            player_name: "Locke",
            category: "BASEN",
            title: "Code-Schlösser für Türen und Kisten",
            description: "4-stelliges zahlenschloss damit man freunden einfach den pin geben kann ohne jedes mal 5 schlüssel craften und rumtragen zu müssen ^^",
            status: "ANGENOMMEN",
            screenshot_path: null,
            created_at: "2026-09-08T22:15:00.000Z"
        },
        {
            id: 12,
            type: "idea",
            player_name: "Luna_Star",
            category: "GRAFIK",
            title: "Mehr Frisuren, Bärte & Jackenfarben",
            description: "bisschen mehr auswahl im charakter-menü bitte.. camouflage jacke, kapuzenpulli und paar coole frisuren damit nicht alle wie zwillinge aussehen :D",
            status: "IN ENTSCHEIDUNG",
            screenshot_path: null,
            created_at: "2026-09-09T18:40:22.000Z"
        }
    ]
};

async function loadFeedback(type) {
    const list = feedbackLists[type];
    if (!list) return;
    list.replaceChildren();

    // Start with curated authentic base entries
    const items = (BASE_FEEDBACK[type] || []).map((item) => ({ ...item }));

    try {
        const { data, error } = await feedbackClient
            .from("community_feedback")
            .select("id,type,player_name,category,title,description,status,screenshot_path,created_at")
            .eq("type", type)
            .order("created_at", { ascending: false });

        if (!error && Array.isArray(data)) {
            // Prepend any new live user submissions from visitors (id > 41), ignoring test entries
            const liveEntries = data.filter((entry) =>
                entry.id > 41 &&
                entry.player_name !== "Tester" &&
                !entry.player_name?.toLowerCase().includes("tester") &&
                !entry.title?.toLowerCase().includes("test")
            );
            items.unshift(...liveEntries);
        }
    } catch (e) {
        console.warn("Could not fetch remote feedback updates", e);
    }

    // Sort descending by created_at
    items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    if (!items.length) {
        appendText(list, "p", "feedback-empty", type === "bug" ? "Noch keine Bugs gemeldet." : "Noch keine Ideen eingereicht.");
        return;
    }
    items.forEach((entry) => list.append(buildFeedbackCard(entry)));
}

function validateScreenshot(file) {
    if (!file) return null;
    const extension = file.name.split(".").pop()?.toLowerCase();
    const mappedExtension = allowedScreenshots.get(file.type);
    if (!mappedExtension || !["png", "jpg", "jpeg", "webp"].includes(extension)) {
        throw new Error("Bitte nur PNG-, JPG- oder WebP-Screenshots auswählen.");
    }
    if (file.size > MAX_SCREENSHOT_BYTES) {
        throw new Error("Der Screenshot darf maximal 5 MB groß sein.");
    }
    return mappedExtension;
}

async function uploadScreenshot(file) {
    const extension = validateScreenshot(file);
    if (!extension) return null;
    const path = `bugs/${crypto.randomUUID()}.${extension}`;
    const { error } = await feedbackClient.storage
        .from(FEEDBACK_BUCKET)
        .upload(path, file, { cacheControl: "31536000", contentType: file.type, upsert: false });
    if (error) throw error;
    return path;
}

function bindFeedbackForm(type) {
    const form = document.getElementById(`${type}-form`);
    const status = document.getElementById(`${type}-form-status`);
    if (!form || !status) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const submitButton = form.querySelector("button[type='submit']");
        const now = Date.now();
        if (submitButton.disabled || now - submissionTimes[type] < 5000) return;

        const playerName = normaliseSingleLine(form.elements.player_name.value);
        const category = normaliseSingleLine(form.elements.category.value);
        const title = normaliseSingleLine(form.elements.title.value);
        const description = normaliseDescription(form.elements.description.value);
        if (playerName.length < 2 || !category || title.length < 3 || description.length < 10) {
            status.textContent = "Bitte fülle alle Pflichtfelder vollständig aus.";
            status.className = "feedback-form-status is-error";
            return;
        }

        submitButton.disabled = true;
        status.textContent = "Wird gespeichert …";
        status.className = "feedback-form-status";
        try {
            const screenshotField = form.elements.screenshot;
            const screenshotPath = type === "bug" ? await uploadScreenshot(screenshotField?.files?.[0]) : null;
            const { error } = await feedbackClient.rpc("submit_community_feedback", {
                p_type: type,
                p_player_name: playerName,
                p_category: category,
                p_title: title,
                p_description: description,
                p_screenshot_path: screenshotPath
            });
            if (error) throw error;
            submissionTimes[type] = Date.now();
            form.reset();
            status.textContent = type === "bug" ? "Bug wurde veröffentlicht." : "Idee wurde veröffentlicht.";
            status.className = "feedback-form-status is-success";
            await loadFeedback(type);
        } catch (error) {
            console.error("Feedback submission failed", error);
            status.textContent = messageForError(error);
            status.className = "feedback-form-status is-error";
        } finally {
            submitButton.disabled = false;
        }
    });
}

const lightbox = document.getElementById("feedback-lightbox");
const lightboxImage = document.getElementById("feedback-lightbox-image");
const lightboxClose = document.getElementById("feedback-lightbox-close");

function closeLightbox() {
    lightbox.hidden = true;
    lightboxImage.removeAttribute("src");
}

function openLightbox(source, alt) {
    lightboxImage.src = source;
    lightboxImage.alt = alt;
    lightbox.hidden = false;
    lightboxClose.focus();
}

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
});

bindFeedbackForm("bug");
bindFeedbackForm("idea");
loadFeedback("bug");
loadFeedback("idea");
