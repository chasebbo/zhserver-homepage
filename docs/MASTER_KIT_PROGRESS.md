# Südlicher HESCO-Weltcheckpoint – 30.09.2026

## 30.09.2026 – Wiki-Struktur und aktueller Homepage-Rahmen

- Alle 183 Einträge neu geordnet: Bausystem 81, Welt 33, Ausrüstung 51, Loot & Ressourcen 12, Spielsysteme 6. Die ehemaligen kleinen Kategorien Lager/Werkstatt und Fallen/Abwehr sind in passende Bausystem-Untergruppen aufgegangen; Waffen, Munition, Werkzeuge und Waffenaufsätze sind unter Ausrüstung zusammengeführt. Keine leeren Haupt- oder Unterkategorien; derzeit keine eigenen Fahrzeug- oder Gegner-Einträge.
- 65 integrierte Spielerbautypen und 22 Weltmodule getrennt gekennzeichnet. Basiskiste als Sonderfall beim Einpacken der Basis; kein frei baubares Objekt. Vorhanden, teilweise vorhanden, geplant und unbestätigter Stand sind sichtbar unterscheidbar. Aktuelle Bauwerte aus bestehenden Nachweisen sichtbar; bisherige Wiki-Werte/Beschreibungen vollständig in aufklappbarer Referenz erhalten.
- HESCO-Familie/Adminbasis, Wand-/Eck-/Türgruppen sowie Strom-, Wasser- und Produktionsgruppen sinnvoll verknüpft. Such-, Unterkategorie-, Varianten- und Statusfilter sowie alte Kategorie-/Detail-Direktlinks erhalten.
- Wiki übernimmt die aktuelle lokale Homepage-Navigation (inklusive Forum), aktive Wiki-Markierung, SPIEL/GAME, gemeinsame DE/EN-Steuerung und den aktuellen Footer. Wiki-Erweiterungen sind separat gekapselt; gemeinsame Homepage-, Sprach- und Zählerdateien unverändert. Katalogtexte und Designhinweise bleiben deutsch; in EN steht ein ausdrücklicher Hinweis.
- Gemeinsamer Besucherzähler mit fünf Zeiträumen eingebunden. Echte Werte für Heute/Insgesamt laden. Der bestehende zusätzliche Perioden-Endpunkt liefert HTTP 404; Gestern/Woche/Monat bleiben korrekt „—“ mit Erklärung. Keine Ersatzwerte, kein eigener Zähler, keine Seitenzugriffe als zusätzliche Kennzahl, keine Backendänderung.
- Abschluss: 7144 vorhandene Inhaltsprüfungen und 953 Browserprüfungen bestanden; Browser 1440/1280/768/390/360 px in DE/EN, alle 183 Details und 162 Bildreferenzen geprüft. 0 fehlende Bilder, 0 JavaScript-Ausnahmen, 0 horizontale Überläufe. Eine bekannte Netzwerk-Konsolenmeldung zur fehlenden Perioden-RPC.
- Bestandsschutz: 183 → 183 Einträge, 112 → 112 Hauptbildzuordnungen, sämtliche ursprünglichen Werte, IDs, Rezepte, Größen, Bilddateien und technischen Verknüpfungen unverändert. Andere Homepage-Arbeit, game/-Ordner und Spielprojekt per SHA256 unverändert. Nachweise: tools/validation/wiki-structure-20260930/{wiki-verify,browser-report,preservation,final-checks}.json.
- Nur Wiki-Arbeit abgeschlossen. Maßstabsabgleich, weitere Welt-/Spielphasen und kontrollierter Zwischenpush bleiben getrennte Folgeaufträge. Kein Commit, Push, Webexport, Serverstart oder Dedicated-Neustart.


14 vorhandene HESCO-Module als feste geschützte Maueransichten eingebunden: sechs je Torflanke und je eine Ecke im Südwesten/Südosten. 34 bisherige Mauerzellen visuell ersetzt; elf Zellen breite Südöffnung, Kollision, Zufahrt, Gebäude, Händler und Fahrzeuge erhalten. Keine neue Grafik und keine Löschung. WorldGeometry verwendet dieselben Masken/Anker aus BuildingCatalog wie Spielerbauten; Main berücksichtigt Sichtbereich und Sektoren.

Stand weiterhin **65 Spielerbautypen / 22 Weltmodule / 126 aktive und 132 gespeicherte Master-Kit-PNGs / 183 Wiki-Einträge / 112 Hauptbildreferenzen**. Fünf HESCO-Seiten plus Adminbasis inhaltlich aktualisiert; 177 weitere Einträge, alle Galerien/Bilder und Wiki-UI erhalten. Gesamt-Safezone GEPLANT und Art ENTWURF.

**1150 gezielte Checks**, sechs visuell geprüfte Offline-Main-Rendereraufnahmen, **7172 Wiki-Prüfungen**, Parser/Import 0 Fehler. Nachweise im Spielprojekt unter `art_reference/master_kit_v1/validation/hesco-world-checkpoint/`. Keine normale Client-/Laptop-Mehrclientprüfung und keine produktiven Saves. Kein Commit, Push oder Webexport. Laptop-Abgleich/Neustart aus der vorigen Dedicated-Änderung weiterhin erforderlich.

Nächster Abschnitt: vorbereitete Wachhütte/Schranke mit Weltplatzierung und Funktion. Größenkalibrierung und weitere militärische Weltbereiche separat. Alle früheren Fortschrittsnotizen folgen unverändert.

---

# 30.09.2026 – HESCO als Spielerbauteile integriert

Fünf HESCO-Familien (Typen 61–65) mit zwölf zuvor vorbereiteten PNGs im lokalen Abwehr-Baumenü und tatsächlichen Client-Renderer eingebunden. Gemeinsame Zellmasken und Knickanker halten die L-Innenecke frei und erhalten zusätzliche Innenraumbauteile in Client-Snapshots. Client-/Dedicated-Kosten und Geometrie konsistent; kein bestehender Bautyp umgestimmt.

Aktuell: **65 Spielerbautypen + 22 Weltmodule / 126 aktive, 132 gespeicherte Master-Kit-PNGs / 183 Wiki-Einträge / 90 Master-Kit-Serientreffer**. Fünf neue Wiki-Seiten, zwölf bytegleiche Spielasset-Kopien und geplante Adminbasis-Verweise. Modulgalerien heißen „Modulansichten“; Art ENTWURF. Keine feste HESCO-Weltplatzierung, keine neue Bildgenerierung und kein Asset-Cleanup in dieser Phase.

Geprüft: **1932 Baukastenchecks, 888 gezielte HESCO-/Bestandschecks, sechs tatsächliche Offline-Renderer-/Menüaufnahmen; Godot-Import/Parser 0 Fehler. Wiki-Builder 183/112/0, Wiki-Prüfer 7172 Checks, 19 gezielte Desktop-/Mobil-Browserfälle ohne JS-/Bild-/Überlauffehler.** 177 bestehende Wiki-Einträge und sämtliche vorherigen PNGs erhalten. Vollständiger normaler Client-/Laptop-Mehrclient-/Persistenz-/Reconnect-Meilenstein offen. Nachweise im Spiel unter `art_reference/master_kit_v1/validation/hesco-integration/`, Fortsetzung in `ART_MASTER_KIT_CONTINUATION.md`.

`dedicated_server.gd` gezielt angepasst: **DEDICATED-NEUSTART AUF LAPTOP ERFORDERLICH**. Kein Dedicated auf dem Entwicklungs-PC gestartet; keine Übertragung/kein Neustart ausgeführt. Kein Commit, Push oder Webexport. Nächster Abschnitt: militärischer Welt-/Checkpointpass mit bestehender HESCO-Familie.

Vorherige Fortschrittsnotizen folgen unverändert.

---

# Adminbasis: Händleranordnung korrigiert – 30.09.2026

Vier vorhandene Stände stehen jetzt im freien Hof nördlich der Gebäudezeile, je zwei links und rechts der mittleren Zufahrt. Gemeinsame Quelle `WorldGeometry.admin_trader_cells()`; Zellen `(1406,694)`, `(1418,694)`, `(1434,694)`, `(1446,694)`. Die beiden Büroüberlagerungen sind behoben. Gebäude, Durchgänge, Straßen, Fahrzeuge und Bodenmarkierungen erhalten.

172 gezielte Checks bestanden: Grafiken außerhalb Gebäude-/Zaunflächen, sichtbarer Straßenbänder, Fahrzeugfreiräume und Bodenauflagen; 15 Laufwegziele vom Südeingang mit echter Main-Spielerstandfläche und gemeinsamer Hauskollision erreichbar. Bestehender E-Handelsaufruf in zwei unabhängigen Offline-Main-Instanzen bestätigt, davon eine mit gesetzten Authentifizierungsflags; kein tatsächlicher Netzwerk-/Mehrclienttest. Vier echte Mainrenderer-Aufnahmen visuell geprüft. Parser/Import und Runtime 0 Fehler.

Nur WorldGeometry und eine Zeile des alten Main-Aufbaupfads verändert. Alle anderen Main-Bytes, Dedicated, Kataloge, Renderer und 304 vorhandene Art-PNGs unverändert. Keine neuen Grafiken/Bautypen: 60 Spielerbautypen + 22 Weltmodule / 114 aktive und 120 gespeicherte Master-Kit-PNGs / 178 Wiki-Einträge. Aktuelle Hinweise zweier Einträge einschließlich Händlerdach-Galerietexte angepasst, 176 Einträge unverändert; ursprüngliche Adminreferenz und Planung erhalten. Builder/Diffprüfung im Abschnittsnachweis. Historische Berichte unten beschreiben den damaligen Stand.

Voller Client-/Laptop-Livetest, bekannte Spawnabweichung, Wachhütte/Schranke, HESCO-Strukturbatch und Maßstabsabgleich bleiben offen. Gemeinsame WorldGeometry später auf den Laptop übernehmen und Dedicated dort neu starten; hier nichts übertragen oder gestartet. Keine Assetlöschung, kein Commit, Push oder Webexport. Nachweise: `zh-survival/art_reference/master_kit_v1/validation/adminbase-layout/`.

# Hofbatch – 30.09.2026

13 neue Grafiken / zehn Weltmodule eingebunden: Hofschotter, Asphalt, Drainagen H/V, gelbe Linien H/V, Richtungspfeile Nord/Ost, Landeplatz-, Parkbucht-, Fußweg-, Haltelinien- und Freihaltemarkierungen. Bestehender Betonboden wiederverwendet. Bestand: 60 Spielerbautypen + 22 Weltmodule; 114 aktive / 120 gespeicherte PNGs; 178 Wiki-Einträge; 85 Master-Kit-Serientreffer. Alle bisherigen Assets behalten. 95 Checks / sieben isolierte Mainrenderer-Aufnahmen; Import/Runtime 0 Fehler. Ursprünglicher Referenz-Fallback, Geometrie und Gameplay erhalten. Zwei bestehende Händlerpositionen über dem Büro bleiben als eigene Layoutfrage offen, ebenso voller Client-/Laptop-Livetest, individuelle Ausgestaltung, Umfeld und Größenabgleich.

Nachweise: zh-survival/art_reference/master_kit_v1/validation/adminbase-courtyard/. Keine Löschung, kein Commit/Push/Webexport.

# Ergänzung: weitere Admin-Gebäude modular – 30.09.2026

Die drei bestehenden Gebäude Garage, Büro und Polizei verwenden jetzt gemeinsam mit der bereits umgestellten Lagerhalle die vorhandene Master-Kit-Familie. Garage/Halle behalten 96 px breite Eingänge, Büro/Polizei 64 px; Fenster, Innenwände und tatsächliche Ausstattung bleiben an die vorhandene Geometrie gebunden. Dächer und Oberlichter blenden über die bisherigen Zustände aus. Andere Weltstandorte behalten ihren Renderer. Keine neuen Bilder oder Bautypen: **60 Bautypen + 12 Weltmodule / 101 aktive und 107 gespeicherte PNGs / 168 Wiki-Einträge**.

**121 gezielte Prüfungen bestanden**, zwölf echte Rendereraufnahmen einschließlich Hallenregression gespeichert. Neun neue Gebäudeansichten und Halleninnenansicht visuell geprüft; finale Parser-/Runtimefehler 0. Sieben Wiki-Einträge gezielt aktualisiert, 161 unverändert; historische Adminreferenzen/Planung erhalten. Builder 168 Einträge/97 Hauptbildreferenzen/0 Fehler; vier gezielte Desktop-/Mobil-Details ohne Platzhalter, Überlauf oder Browserfehler. Vorhandene unveränderte Vollprüfungen wiederverwendet.

**Gezielter Cleanup geprüft:** Garage.png, Buero1.png und Polizei.png bleiben für andere Weltstandorte sowie den vollständigen Fallback benötigt. Je drei echte Main-Laufzeitreferenzen; keine sicher entfernbaren Altdateien oder neuen Grafikduplikate. Nichts gelöscht. Alle 107 Spiel-/Wiki-PNGs bytegleich und unverändert zur Abschnitts-Baseline. Nur `admin_hall_art.gd` als Produktionscode geändert; Main/Geometrie/Server/Katalog bleiben bytegleich.

Offen: Hof-/Boden-/Straßen-/markierte Funktionsflächen, individuelle Fassaden-/Art-Endabnahme, eigener Maßstabspass sowie normaler Client-/Laptop-Mehrclient-/Persistenz-/Reconnect-Test. HESCO bleibt im späteren Struktur-/Militär-Batch geplant. Kein Dedicated gestartet; zusätzlicher Neustart für diesen Abschnitt NEIN. Frühere Utilities-Katalogübernahme weiter offen: **DEDICATED-NEUSTART AUF LAPTOP ERFORDERLICH**.

[Maßgeblicher Checkpoint](C:/Users/sebbo/OneDrive/Dokumente/Spiel/zh-survival/ART_MASTER_KIT_CONTINUATION.md); Nachweise unter `validation/adminbase-buildings/`, einschließlich Cleanup und finaler Diff-Prüfung. Bei 90 % Kurzfensterverbrauch Phase gesichert und STOPP; kein Commit, Push oder Webexport. Frühere vollständige Notizen erhalten:

---

# Planergänzung: abschnittsweiser Cleanup, Weltkalibrierung und Schanzkorb – 30.09.2026

Der weitere Master-Kit-Plan enthält jetzt **HESCO-/H-Barrier / Schanzkorb** als geplantes militärisches Schutz- und Befestigungsmodul für Adminbasis, Checkpoints, Militärbasen, Portal-Sicherungen und Safezones. Beim nächsten passenden Struktur-/Militär-Batch berücksichtigen: gemeinsame verwitterte Grafikfamilie, 90°-Raster, eigene horizontale/senkrechte Ansichten sowie zu planende Eck-/Abschlussverbindungen. Maße, Variantenumfang und spätere Funktionen bleiben offen; noch keine Grafik, Registry, Baumenü- oder Weltintegration.

Welt und Adminbasis weiterhin abschnittsweise umstellen. Nach vollständigem, geprüftem Ersatz einen gezielten Cleanup nur für diesen Bereich durchführen. Alte Hausbilder, Fallbacks, Platzhalter und doppelte Assets erst entfernen, wenn sie vollständig ersetzt, geprüft und nirgends mehr benötigt oder referenziert sind. Gemeinsame Assets und aktuell benötigte Fallbacks bleiben erhalten. Für die aktuelle Hallenphase ergibt diese Planergänzung keine Löschfreigabe.

Ein eigener späterer **Maßstabs-/Weltkalibrierungs-Pass** stimmt Module gegen Spieler, Türen, Fahrzeuge und Gebäude ab. Bis dahin Spielergröße 87,5 % und Geschwindigkeiten 260/143/416 erhalten; keine Größenänderungen nebenbei in einzelnen Grafik-Batches.

Der vollständige konkrete Plan steht in der [maßgeblichen Fortsetzungsnotiz](C:/Users/sebbo/OneDrive/Dokumente/Spiel/zh-survival/ART_MASTER_KIT_CONTINUATION.md). Nur diese beiden Planungsnotizen wurden ergänzt; bestehende Assets und sämtliche bisherigen lokalen Änderungen bleiben erhalten. Kein Commit, Push, Webexport oder Deployment. Frühere vollständige Notizen bleiben nachfolgend erhalten:

---

# Ergänzung: Adminbasis-Hallen-Kit – 30.09.2026

Die bestehende linke Adminhalle verwendet jetzt die gemeinsame Modulfamilie: Fensterfelder, Dachkanten, Dachfirst, offene Einfahrt und zwei Oberlichter; Dachfläche, Boden, Außen-/Innenwände werden aus vorhandenen Modulen aufgebaut. Das Dach folgt der bisherigen Ausblendung. Die vorhandene 96 px breite Öffnung samt korrigierter Betonschwelle bleibt frei. Die anderen drei Admingebäude, Geometrie, Interaktionen und Server bleiben unverändert.

Händlerüberdachungen und vorbereitetes Wachhäuschen erhielten gezielt orthogonale Dachansichten. Die vorbereitete Schranke verwendet in beiden Darstellungen denselben Sockel; Arm-Endabstimmung, Spielfunktion/Animation und Weltplatzierung bleiben offen. **13 ausgewählte Sprites /14 neue Bilddateien /15 archivierte generierte Originale mit vollständigen Prompts**. Alle 93 vorherigen PNGs und Quelloriginale bleiben unverändert erhalten; fünf alte Bilder werden durch zusätzliche Versionsdateien abgelöst, ein V 2-Entwurf bleibt ebenfalls gespeichert. Kein Asset gelöscht.

**Bestand:60 Spieler-Bautypen +12 Weltgrafikmodule /101 aktive und 107 gespeicherte PNGs /168 Wiki-Einträge /75 Serientreffer.** Alle 107 Spiel-/Wiki-Bilder bytegleich. Fünf neue Hallenseiten, fünf bestehende Welt-/Adminseiten gezielt aktualisiert;158 alte Einträge unverändert. Zehn Weltmodule integriert, Wachhäuschen/Schranke vorbereitet. Historische Adminbasis-Referenzen und Planungsstruktur erhalten; Art-Status ENTWURF.

**Bestätigt:**148 Godot-Prüfungen +4 gezielte V 3-Prüfungen; Import/Parser 0; sechs echte isolierte Rendereraufnahmen geprüft.6465 Wiki-Prüfungen, Builder 168 Einträge/97 Hauptbildreferenzen/0 Fehler.20 Desktop-/Mobil-Detailfälle plus 10 gezielte Galerie-Nachprüfungen bestanden: alle Varianten geladen, keine Platzhalter/Überläufe/Browserfehler. Kleine Klassen-/CSS-Korrektur begrenzt nur Weltmodul-Galeriebilder auf 360 px Höhe und erhält Proportionen; ursprüngliche Adminreferenzen unverändert. Kein normaler Weltstart, Netzwerk oder Produktionsspielstand. Abschließender Git-Diff-Prüfnachweis beider Repos: `validation/adminbase-hall-kit/final-git-diff-check.json`.

[Maßgeblicher Checkpoint](C:/Users/sebbo/OneDrive/Dokumente/Spiel/zh-survival/ART_MASTER_KIT_CONTINUATION.md), Nachweise unter `art_reference/master_kit_v 1/validation/adminbase-hall-kit/`. Vollständiger Adminbasis-Umbau, Art-Endabnahme und normaler Client-/Laptop-Mehrclient-/Persistenztest offen. Nächster Chunk: übrige Admingebäude/Funktionsbereiche und Hof, danach weitere Welt-/Umgebungsabschnitte. Keine fertigen Module neu erzeugen.

Zusätzlicher Dedicated-Neustart für diesen Grafikbatch: NEIN. Die frühere Utilities-Katalogübernahme auf dem Laptop bleibt offen: **DEDICATED-NEUSTART AUF LAPTOP ERFORDERLICH**. Kein Commit, Push, Webexport oder Deployment. Frühere vollständige Notizen bleiben nachfolgend erhalten:

---

# Aktueller Service-Kit-Stand – 29.09.2026

**60 Spieler-Bautypen + sieben Weltgrafikmodule / 93 PNGs / 163 Wiki-Einträge.** Zehn neue PNGs sind in Spiel und Wiki bytegleich vorhanden: Händlerdach H/V, Theke H/V, Rückwand, Wachhäuschen, Schranke offen/geschlossen, Informationstafel und Metalldachfeld. 84 Grafiken transparent, neun deckende Flächen. Keine neuen Spielerbaurezepturen.

Dach, Theke und Rückwand werden an vier bestehenden Admin-Händlerpositionen gezeichnet. Die Tafel steht links neben der elf Zellen breiten freien Einfahrt auf vorhandenen Mauerzellen. Wachhäuschen, Schranke und Dachkachel sind vorbereitet; vertikale Händleransichten ebenfalls. Weltgeometrie, Dedicated, Baukatalog und 83 bisherige PNGs unverändert. Alle 155 übrigen Wiki-Einträge unverändert; Adminbasis-Referenz mit neuen Modulverknüpfungen und tatsächlichem Teilstand ergänzt.

Art-Status ENTWURF: Dachseiten der Händlerüberdachungen und des Wachhäuschens laufen noch leicht perspektivisch zu. Die beiden Schrankenbilder unterscheiden sich im Sockel-/Scharnierdetail; keine fertige Animation oder Torfunktion. Der komplette Adminbasis-Umbau und Laptop-Livetests bleiben offen.

88 gezielte Godot-Prüfungen, Parser 0, fünf isolierte Rendereraufnahmen; 6259 Wiki-Prüfungen und 22 JS/Python-Paritätsfälle bestanden. Desktop/Mobil: 16 Detailfälle, 70 Serientreffer, alle Varianten geladen, Suche und Rücknavigation, keine Browserfehler oder Überläufe; drei Screenshots visuell geprüft. [Browsernachweis](MASTER_KIT_BROWSER_QA.md). Aktueller Einstieg: [Fortsetzungsnotiz](C:/Users/sebbo/OneDrive/Dokumente/Spiel/zh-survival/ART_MASTER_KIT_CONTINUATION.md). Finale Git-/Erhaltungsprüfung unter `validation/adminbase-service-kit/final-checks.json` im Spielprojekt.

Dieser Batch benötigt keinen zusätzlichen Dedicated-Neustart; die frühere Utilities-Katalogübernahme samt Neustart auf dem Laptop bleibt erforderlich. Kein Commit, Push, Webexport oder Deployment.

---

# Master Kit V1 – Fortschrittsstand 28.09.2026

**60 Module und 83 PNGs sind lokal in Spiel und Wiki integriert. Alle Typen 1–60 sind bebildert.** Der Utilities-Batch ergänzt neun Grafiken für Lagerfeuer, zwei Fallen, Solaranlage, Windrad, Wasserfilteranlage, Munitionspresse, Kamera und Alarmanlage. Er fügt keine neuen Spieltypen hinzu; die neun zusätzlichen Typen 52–60 stammen aus früheren Phasen.

Der Bestand umfasst 60 Hauptbilder und 23 weitere Ansichten, davon 75 transparente Sprites und acht deckende Flächen. Alle 83 Spiel-/Wiki-PNGs sind bytegleich; die 74 vorherigen Grafiken unverändert.

Das Wiki enthält **156 Einträge** und **63 Serientreffer** aus 60 Modulen und drei Planungsreferenzen. Vier bisherige Einträge wurden gezielt aktualisiert, fünf Bauteile neu angelegt. 147 der bisherigen 151 Einträge bleiben vollständig unverändert, darunter der Verbrauchsgegenstand `item_water_filter_01`. Historische Kerntexte, Werte und Kategorien der übrigen vier bleiben erhalten; aktuelle Hinweise erklären die tatsächlichen Kosten und Funktionsgrenzen.

Die neun bisher fehlenden Katalogregistrierungen erhalten die bisherigen Fallbackwerte, beheben aber eine reale Bau-/Ladevalidierungslücke des Dedicated Servers. Der aktualisierte Katalog muss auf den Laptop übernommen werden. Servercode, vorhandenes Verify- und Preview-Werkzeug bleiben bytegleich; `main.gd` ändert ausschließlich Artblöcke. Keine neue Koch-, Fallen-, Kamera- oder Alarmfunktion. Vorhandene lokale Stromberechnung und Offline-Aktionen von Filter/Presse bleiben in ihren bisherigen Grenzen. Art-Status weiterhin ENTWURF.

**Bestätigt:** Parser/Import ohne Fehler; 1.792 Godot-Prüfungen und 5.980 Wiki-Prüfungen ohne Fehler. Wiki-Builder: 156 Einträge, 85 Bildreferenzen, 0 Validierungsfehler. Echter Offline-Spielrenderer: zwei Prozesse Exit 0, stderr leer, zwei Rotationstafeln und neun Menüs; Tafeln sowie Solar-/Munitionspresse-Menüs visuell geprüft.

Browser einschließlich Nachtest bestanden: 18 Detailfälle bei 1280 × 900 und 360 × 800, 63 Serientreffer, Suche und Rückkehr, keine Konsolen-/Seitenfehler. Einziger CSS-Zusatz ist eine responsive mobile Titelgröße; der Kameratitel passt jetzt sauber in eine Zeile. Finale mobile Kameraaufnahme und Wasserfilter-Detail auf Desktop visuell geprüft. Interne Nachweise und Bundle abschließend aktualisiert (156 Einträge, 85 Bildreferenzen, 0 Validierungsfehler); **beide vollständigen git diff --check sauber**. Die kurzzeitige lokale Browservorschau ist beendet. [Browsernachweise](MASTER_KIT_BROWSER_QA.md).

[Maßgeblicher Checkpoint](C:/Users/sebbo/OneDrive/Dokumente/Spiel/zh-survival/ART_MASTER_KIT_CONTINUATION.md) enthält Dateien, Prüfgrenzen und Fortsetzung. Nachweise liegen im Spielprojekt unter `art_reference/master_kit_v1/validation/utilities-batch/`. Die frühere Fortschrittsnotiz ist [vollständig archiviert](C:/Users/sebbo/OneDrive/Dokumente/Spiel/zh-survival/art_reference/master_kit_v1/validation/utilities-batch/before/wiki/docs/MASTER_KIT_PROGRESS.md).

Nächster klarer Chunk: **Phase 4, modulare Adminbasis/Safezone** samt noch fehlenden Modulen. Der genehmigte modulare Ersatz in der Kartenmitte folgt der verbindlichen Referenz und benötigt echte interaktive Objekte. Alte Weltgrafik erst nach fertiggestelltem, geprüftem Ersatz ablösen. Keine Weltmigration in diesem Batch; keine automatische Neugenerierung fertiger Module.

Normale Client-Platzierung, Laptop-Mehrclient-, Persistenz- und Reconnect-Test bleiben offen. Lokaler Working Tree maßgeblich; kein Commit, Push, Webexport oder Deployment.

**DEDICATED-NEUSTART AUF LAPTOP ERFORDERLICH**


## Adminbasis – erster Weltabschnitt am 28.09.2026

Die bestehende zentrale Außenbegrenzung verwendet jetzt dieselben Betonmodule wie Spielerbasen: 309 vorhandene Kollisionszellen, davon vier Eckverbindungen. Südeinfahrt elf Zellen frei, Nordkante geschlossen. Keine neuen Bilder oder Bautypen; Bestand unverändert 60 Module / 83 PNGs / 156 Wiki-Einträge. Gebäude, Händler, Wachen, Geometrie und Servercode bleiben erhalten.

731 gezielte Prüfungen ohne Fehler, Parser 0; drei isolierte Aufnahmen aus dem echten Spielrenderer visuell geprüft. Der vollständige Umbau der Adminbasis und Laptop-Livetests bleiben offen. Wiki-Daten, Bilder und Layout unverändert; keine erneute Browser-Großprüfung. Nächster zusammengehöriger Abschnitt: Händler-/Checkpoint-/Hallenbaugruppen und ihre tatsächlichen Artlücken. Maßgeblicher Einstieg und offene Spawnabweichung stehen in der Spiel-Fortsetzungsnotiz. Dieser Grafikabschnitt benötigt keinen zusätzlichen Dedicated-Neustart; die frühere Katalogübernahme auf den Laptop bleibt ausstehend. Kein Commit, Push oder Webexport.
