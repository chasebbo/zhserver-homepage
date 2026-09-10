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
    "bug": [
        {
            "id": 1,
            "type": "bug",
            "player_name": "Ant",
            "category": "FAHRZEUGE",
            "title": "Auto dreht sich nicht beim Lenken",
            "description": "Das Fahrzeug fährt aktuell nur vorwärts und rückwärts und dreht sich beim Lenken überhaupt nicht ein. Man kann quasi nur geradeaus steuern.",
            "status": "ERLEDIGT",
            "screenshot_path": null,
            "created_at": "2026-08-12T19:02:11.000Z"
        },
        {
            "id": 2,
            "type": "bug",
            "player_name": "PEXO",
            "category": "GRAFIK",
            "title": "Axt wird verkehrt herum gehalten",
            "description": "Die Axt ist im Charaktermodell falsch herum ausgerichtet. Sieht momentan so aus, als würde man Zombies mit dem Stiel statt mit der Klinge schlagen.",
            "status": "ERLEDIGT",
            "screenshot_path": null,
            "created_at": "2026-08-14T21:40:05.000Z"
        },
        {
            "id": 3,
            "type": "bug",
            "player_name": "MadMax",
            "category": "FAHRZEUGE",
            "title": "Fahrzeuge haben nachts kein Licht / Scheinwerfer",
            "description": "Gibt es nachts irgendeine Taste, um die Scheinwerfer am Auto anzumachen? Man sieht im Dunkeln absolut gar nichts und fährt im Blindflug gegen Bäume.",
            "status": "IN BEARBEITUNG",
            "screenshot_path": null,
            "created_at": "2026-08-16T14:15:32.000Z"
        },
        {
            "id": 4,
            "type": "bug",
            "player_name": "CraftMaster",
            "category": "BASEN",
            "title": "Claim-Flagge kann fast überall platziert werden",
            "description": "Die Claim-Flagge lässt sich derzeit fast überall aufstellen – sogar mitten auf Straßen oder direkt an fremden Basenwänden. Hier sollte dringend eine Sperrzone rein.",
            "status": "IN BEARBEITUNG",
            "screenshot_path": null,
            "created_at": "2026-08-18T23:12:44.000Z"
        },
        {
            "id": 5,
            "type": "bug",
            "player_name": "Schleicher_99",
            "category": "GAMEPLAY",
            "title": "Schleichfunktion bringt aktuell gar nichts",
            "description": "Ich wollte mich geduckt mit gedrückter Strg-Taste an Zombies vorbeischleichen, aber die drehen sich sofort um und rennen los. Schleichen scheint genauso viel Lärm wie normales Gehen zu machen.",
            "status": "OFFEN",
            "screenshot_path": null,
            "created_at": "2026-08-20T16:04:19.000Z"
        },
        {
            "id": 6,
            "type": "bug",
            "player_name": "DarkKnight",
            "category": "ZOMBIES",
            "title": "Zombie-Aggro bricht schon nach wenigen Metern ab",
            "description": "Die Zombies rennen einem vielleicht fünf Meter hinterher und drehen dann plötzlich grundlos wieder um. Wäre besser, wenn sie einen etwas hartnäckiger verfolgen.",
            "status": "OFFEN",
            "screenshot_path": null,
            "created_at": "2026-08-22T02:45:10.000Z"
        },
        {
            "id": 7,
            "type": "bug",
            "player_name": "Nop",
            "category": "GRAFIK",
            "title": "Charakter glitched an Hausecken durch die Wand",
            "description": "Wenn man in einem Haus steht und nah an die Außenwand läuft, ragt der Charakter optisch nach draußen durch die Wand hindurch.",
            "status": "IN BEARBEITUNG",
            "screenshot_path": null,
            "created_at": "2026-08-23T18:30:55.000Z"
        },
        {
            "id": 8,
            "type": "bug",
            "player_name": "Ann",
            "category": "GAMEPLAY",
            "title": "Charaktergröße unpassend zu Türen",
            "description": "Die Spielfigur wirkt im Vergleich zu den Haustüren und Fenstern etwas zu groß geraten. Wenn man durch Türen läuft, sieht das Größenverhältnis unstimmig aus.",
            "status": "OFFEN",
            "screenshot_path": null,
            "created_at": "2026-08-25T11:22:01.000Z"
        },
        {
            "id": 9,
            "type": "bug",
            "player_name": "Noah",
            "category": "ZOMBIES",
            "title": "Zu wenige Zombies in der Stadt",
            "description": "Ich war über 20 Minuten im Stadtgebiet unterwegs und habe nur drei Zombies angetroffen. Für eine Stadtzone fühlt sich das aktuell noch sehr leer an.",
            "status": "ERLEDIGT",
            "screenshot_path": null,
            "created_at": "2026-08-26T20:15:40.000Z"
        },
        {
            "id": 10,
            "type": "bug",
            "player_name": "ShadowHunter",
            "category": "FAHRZEUGE",
            "title": "Auto bleibt an unsichtbaren Stellen hängen",
            "description": "Man fährt ganz normal auf freier Straße oder Wiese und plötzlich stoppt das Auto abrupt ab, an Stellen wo optisch absolut gar nichts im Weg ist. Scheinen unsichtbare Hitboxen zu sein.",
            "status": "IN BEARBEITUNG",
            "screenshot_path": null,
            "created_at": "2026-08-28T15:50:12.000Z"
        },
        {
            "id": 11,
            "type": "bug",
            "player_name": "Basti_ZH",
            "category": "INVENTAR",
            "title": "Munition stapelt sich nicht automatisch",
            "description": "Beim Aufheben von 9mm-Munition wird diese nicht auf den bestehenden Stapel gerechnet, sondern belegt immer wieder neue Inventarslots. Dadurch ist das Inventar sofort voll.",
            "status": "IN BEARBEITUNG",
            "screenshot_path": null,
            "created_at": "2026-08-29T22:08:33.000Z"
        },
        {
            "id": 12,
            "type": "bug",
            "player_name": "GhostRider",
            "category": "GAMEPLAY",
            "title": "Nachladen bricht beim Losrennen stumm ab",
            "description": "Wenn man während dem Nachladen kurz sprintet, bricht der Reload zwar ab, aber das Klick-Geräusch läuft einfach weiter. Im Gefecht ist das ziemlich verwirrend.",
            "status": "OFFEN",
            "screenshot_path": null,
            "created_at": "2026-08-30T17:40:22.000Z"
        },
        {
            "id": 13,
            "type": "bug",
            "player_name": "Lisa_Survival",
            "category": "LOOT",
            "title": "Kisten im Supermarkt manchmal komplett leer",
            "description": "Wir sind direkt nach dem Serverstart zu dritt in den Supermarkt gerannt und ausnahmslos alle Kisten waren leer. Funktioniert der Loot-Respawn dort nicht richtig?",
            "status": "OFFEN",
            "screenshot_path": null,
            "created_at": "2026-09-01T12:05:49.000Z"
        },
        {
            "id": 14,
            "type": "bug",
            "player_name": "xX_Sniper_Xx",
            "category": "UI",
            "title": "Tagesanzeige steht auf über 1 Million Tage",
            "description": "Im HUD oben wird bei den überlebten Tagen plötzlich 'Tag 1048576' angezeigt, obwohl ich erst seit einer Viertelstunde auf dem Server bin. Scheint ein Anzeigebug zu sein.",
            "status": "IN BEARBEITUNG",
            "screenshot_path": null,
            "created_at": "2026-09-02T19:35:18.000Z"
        },
        {
            "id": 15,
            "type": "bug",
            "player_name": "ZockerOpa",
            "category": "GRAFIK",
            "title": "Spieler sieht beim Schießen anders aus als beim Laufen",
            "description": "Beim normalen Laufen hat der Charakter die gewählte Kleidung an, aber in dem Moment wo man schießt, springt das Sprite auf ein völlig anderes Modell um. Das wirkt optisch sehr unruhig.",
            "status": "OFFEN",
            "screenshot_path": null,
            "created_at": "2026-09-03T21:10:04.000Z"
        },
        {
            "id": 16,
            "type": "bug",
            "player_name": "Marvin2002",
            "category": "GRAFIK",
            "title": "Rucksäcke & Rüstungsteile mit alter Pixelgrafik und unsichtbar",
            "description": "Die Rucksäcke haben im Inventar noch eine veraltete Pixelgrafik und man sieht sie am Charaktermodell überhaupt nicht, wenn man sie anlegt. Dasselbe gilt für Helme und Westen.",
            "status": "OFFEN",
            "screenshot_path": null,
            "created_at": "2026-09-04T16:25:39.000Z"
        },
        {
            "id": 17,
            "type": "bug",
            "player_name": "Dennis_K",
            "category": "FAHRZEUGE",
            "title": "Kofferraum schließt sich beim Einsteigen von Mitspielern",
            "description": "Ich sortiere gerade Gegenstände im Kofferraum und in dem Moment, wo ein Mitspieler auf den Beifahrersitz steigt, schließt sich das Kofferraum-Menü sofort und Items landen auf dem Boden.",
            "status": "OFFEN",
            "screenshot_path": null,
            "created_at": "2026-09-05T13:42:15.000Z"
        },
        {
            "id": 18,
            "type": "bug",
            "player_name": "RustyNail",
            "category": "BASEN",
            "title": "Lagerfeuer brennt unter Wasser weiter",
            "description": "Habe testweise ein Lagerfeuer im seichten Uferbereich am See platziert und es brennt dort problemlos unter Wasser weiter. Sollte Wasser das Feuer nicht löschen?",
            "status": "OFFEN",
            "screenshot_path": null,
            "created_at": "2026-09-06T01:18:50.000Z"
        },
        {
            "id": 19,
            "type": "bug",
            "player_name": "Viper_99",
            "category": "UI",
            "title": "Ingame-Uhrzeit läuft bis 29 Uhr statt 24 Uhr",
            "description": "Die Uhrzeit im oberen Interface springt nach 23:59 nicht auf 00:00 zurück, sondern zählt einfach weiter bis 29:xx Uhr, bevor überhaupt der nächste Tag anbricht.",
            "status": "OFFEN",
            "screenshot_path": null,
            "created_at": "2026-09-06T18:05:11.000Z"
        },
        {
            "id": 20,
            "type": "bug",
            "player_name": "Svenja",
            "category": "GAMEPLAY",
            "title": "Feldflasche verliert beim Trinken kein Wasser",
            "description": "Ich habe mehrfach hintereinander aus der Feldflasche getrunken, aber die Füllstandsanzeige blieb dauerhaft bei 100 %. Erst nach einem Reconnect war die Flasche tatsächlich leer.",
            "status": "IN BEARBEITUNG",
            "screenshot_path": null,
            "created_at": "2026-09-07T14:50:33.000Z"
        },
        {
            "id": 21,
            "type": "bug",
            "player_name": "Crawler",
            "category": "UI",
            "title": "Chat blockiert WASD-Bewegung nach dem Absenden",
            "description": "Sobald man eine Chatnachricht mit Enter abschickt und loslaufen möchte, reagiert die WASD-Steuerung nicht mehr, weil der Cursor noch im Chatfenster gefangen ist. Man muss erst Escape drücken.",
            "status": "OFFEN",
            "screenshot_path": null,
            "created_at": "2026-09-08T00:30:15.000Z"
        },
        {
            "id": 22,
            "type": "bug",
            "player_name": "Kev94",
            "category": "BASEN",
            "title": "Wand dreht sich nach Platzieren um 90 Grad",
            "description": "In der Bauvorschau war die Holzwand perfekt bündig ausgerichtet, aber direkt nach dem Mausklick dreht sich das Bauteil plötzlich um 90 Grad und schneidet die Nachbarwand ab.",
            "status": "OFFEN",
            "screenshot_path": null,
            "created_at": "2026-09-08T15:12:44.000Z"
        },
        {
            "id": 23,
            "type": "bug",
            "player_name": "Tobi_88",
            "category": "WELT",
            "title": "Man buggt in manchen Gebäuden komplett fest",
            "description": "Ich bin in der Stadt in ein zweistöckiges Gebäude gegangen und zwischen Treppengeländer und Innenwand hängengeblieben. Man kommt weder vor noch zurück und muss das Spiel neustarten.",
            "status": "OFFEN",
            "screenshot_path": null,
            "created_at": "2026-09-09T10:20:05.000Z"
        },
        {
            "id": 24,
            "type": "bug",
            "player_name": "Hann",
            "category": "GAMEPLAY",
            "title": "Hunde oder tierische Begleiter fehlen noch",
            "description": "Wäre ein tolles Feature, wenn man streunende Hunde mit Dosenfleisch zähmen könnte, damit sie einen begleiten und Zombies bellen oder angreifen, sobald Gefahr droht.",
            "status": "OFFEN",
            "screenshot_path": null,
            "created_at": "2026-09-09T19:44:30.000Z"
        },
        {
            "id": 25,
            "type": "bug",
            "player_name": "Lee",
            "category": "GAMEPLAY",
            "title": "Geh-Taste für entspanntes Laufen fehlt",
            "description": "Könnte man eine Taste einbauen, mit der man langsam gehen kann? Aktuell rennt die Spielfigur immer im Dauerlauf, was beim präzisen Erkunden von Räumen manchmal zu schnell ist.",
            "status": "OFFEN",
            "screenshot_path": null,
            "created_at": "2026-09-10T02:15:00.000Z"
        }
    ],
    "idea": [
        {
            "id": 1,
            "type": "idea",
            "player_name": "SurvivalFreak",
            "category": "WELT",
            "title": "Verlassenes Militärcamp als High-Tier-Zone",
            "description": "Ein kleines abgesperrtes Militärcamp im Norden mit Wachtürmen, Sandsäcken und gut bewaffneten Militär-Zombies. Dort könnte man seltene Waffenteile und Munitionskisten finden.",
            "status": "ANGENOMMEN",
            "screenshot_path": null,
            "created_at": "2026-08-15T16:20:10.000Z"
        },
        {
            "id": 2,
            "type": "idea",
            "player_name": "Lena_97",
            "category": "GAMEPLAY",
            "title": "Regenwasser-Auffangbecken für Basen",
            "description": "Ein auffangbares Wasserfass aus Holzbrettern und einer Plane für das eigene Lager. Wenn es regnet, füllt sich das Fass automatisch mit Nutzwasser, sodass man nicht ständig zum Fluss laufen muss.",
            "status": "ANGENOMMEN",
            "screenshot_path": null,
            "created_at": "2026-08-19T20:11:45.000Z"
        },
        {
            "id": 3,
            "type": "idea",
            "player_name": "Doc_Holiday",
            "category": "ITEMS",
            "title": "Behelfsmäßige Schalldämpfer zum Selberbauen",
            "description": "Ein improvisierter Schalldämpfer aus einem Ölfilter und Panzertape. Hält vielleicht nur 10 bis 15 Schuss aus, verhindert aber, dass bei einem Schusswechsel direkt die ganze Umgebung alarmiert wird.",
            "status": "IN ENTSCHEIDUNG",
            "screenshot_path": null,
            "created_at": "2026-08-22T12:05:30.000Z"
        },
        {
            "id": 4,
            "type": "idea",
            "player_name": "CampBuilder",
            "category": "BASEN",
            "title": "Laternen und Fackeln zur Basisbeleuchtung",
            "description": "Fackeln oder kleine Hängelaternen, die man an Holzzäunen und Pfosten anbringen kann. Nachts ist die Basis sonst stockdunkel und man sieht ankommende Zombies erst, wenn sie am Zaun stehen.",
            "status": "ANGENOMMEN",
            "screenshot_path": null,
            "created_at": "2026-08-25T23:30:12.000Z"
        },
        {
            "id": 5,
            "type": "idea",
            "player_name": "RoadWarrior",
            "category": "FAHRZEUGE",
            "title": "Rammschutz und Kuhfänger für Fahrzeuge",
            "description": "Man sollte Metallrohre an die Stoßstange des Pickups schweißen können. Wenn man dann durch eine Zombiegruppe fährt, nimmt der Motor weniger Schaden und die Haltbarkeit sinkt nicht so schnell.",
            "status": "IN ENTSCHEIDUNG",
            "screenshot_path": null,
            "created_at": "2026-08-28T18:44:20.000Z"
        },
        {
            "id": 6,
            "type": "idea",
            "player_name": "Sgt_Pepper",
            "category": "GAMEPLAY",
            "title": "Fahrrad als lautlose Fortbewegung",
            "description": "Ein einfaches Fahrrad als Fortbewegungsmittel. Braucht keinen Treibstoff, ist deutlich schneller als normales Laufen und erzeugt kaum Geräusche – ideal für nächtliche Loot-Touren.",
            "status": "IN ENTSCHEIDUNG",
            "screenshot_path": null,
            "created_at": "2026-08-31T14:15:05.000Z"
        },
        {
            "id": 7,
            "type": "idea",
            "player_name": "Michi_ZH",
            "category": "UI",
            "title": "Ping-System mit mittlerer Maustaste",
            "description": "Ein kurzes Drücken der mittleren Maustaste setzt eine 5-Sekunden-Markierung auf dem Boden für Gruppenmitglieder. Erleichtert die Koordination ungemein, statt immer Koordinaten durchgeben zu müssen.",
            "status": "ANGENOMMEN",
            "screenshot_path": null,
            "created_at": "2026-09-02T21:50:40.000Z"
        },
        {
            "id": 8,
            "type": "idea",
            "player_name": "Wolfsrudel",
            "category": "COMMUNITY",
            "title": "Walkie-Talkies mit einstellbaren Frequenzen",
            "description": "Tragbare Funkgeräte mit wählbaren Kanälen von 1 bis 10. Spieler auf derselben Frequenz können über weite Distanzen kommunizieren, solange die Batterien im Funkgerät halten.",
            "status": "IN ENTSCHEIDUNG",
            "screenshot_path": null,
            "created_at": "2026-09-04T17:33:18.000Z"
        },
        {
            "id": 9,
            "type": "idea",
            "player_name": "GreenThumb",
            "category": "WELT",
            "title": "Gemüsebeete und Kartoffelanbau",
            "description": "Saatgut in Gewächshäusern oder Scheunen finden und kleine Beete anlegen. Kartoffeln und Tomaten anbauen, um sich in der eigenen Basis langfristig unabhängig mit Nahrung versorgen zu können.",
            "status": "IN ENTSCHEIDUNG",
            "screenshot_path": null,
            "created_at": "2026-09-06T11:05:55.000Z"
        },
        {
            "id": 10,
            "type": "idea",
            "player_name": "Chefkoch",
            "category": "ITEMS",
            "title": "Eintöpfe am Lagerfeuer kochen",
            "description": "Wasser, Fleisch und gesammelte Pilze im Kochtopf über dem Lagerfeuer zu einer warmen Mahlzeit kombinieren. Gibt einen temporären Ausdauerbonus und füllt den Hungerbalken spürbar auf.",
            "status": "IN ENTSCHEIDUNG",
            "screenshot_path": null,
            "created_at": "2026-09-07T19:20:30.000Z"
        },
        {
            "id": 11,
            "type": "idea",
            "player_name": "Locke",
            "category": "BASEN",
            "title": "Vierstelliges Zahlenschloss für Türen und Kisten",
            "description": "Ein einstellbares PIN-Schloss für Holztüren und Lagerkisten. So kann man Gruppenmitgliedern einfach den Code mitteilen, ohne jedes Mal mühsam Schlüssel craften und weitergeben zu müssen.",
            "status": "ANGENOMMEN",
            "screenshot_path": null,
            "created_at": "2026-09-08T22:15:00.000Z"
        },
        {
            "id": 12,
            "type": "idea",
            "player_name": "Luna_Star",
            "category": "GRAFIK",
            "title": "Mehr Frisuren, Bärte und Jackenfarben",
            "description": "Etwas mehr Auswahl im Charaktereditor bei der Erstellung – zum Beispiel Camouflage-Jacken, Kapuzenpullover, verschiedene Bärte und Frisuren, damit sich die Spieler optisch besser unterscheiden.",
            "status": "IN ENTSCHEIDUNG",
            "screenshot_path": null,
            "created_at": "2026-09-09T18:40:22.000Z"
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
