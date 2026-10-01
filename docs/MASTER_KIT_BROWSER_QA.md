# HESCO-Weltcheckpoint – inhaltliche Fortsetzung 30.09.2026

## 30.09.2026 – Gesamtes Wiki: Kategorien, DE/EN, Navigation und Footer

**Bestanden:** 953 gezielte Browserprüfungen mit installiertem Edge/Playwright am echten lokalen Live-Server. Desktop 1440/1280, Tablet 768, Mobil 390/360 px; jeweils DE/EN, aktuelle zehn Navigationslinks einschließlich Forum, aktive Wiki-Markierung, SPIEL/GAME, mobile Menübedienung und Escape, Footer/Impressum/Datenschutz und die fünf gemeinsamen Besucherfelder.

Alle fünf Hauptkategorien und 26 nicht leere Unterkategorien geprüft. HESCO-Suche, sieben Eckreferenzen, kombiniertes Variantenfiltern, vier Entwicklungsstand-Filter, Detail/Rückkehr mit erhaltenen Filtern, englische Suchsteuerung und Leertreffer/Zurücksetzen funktionieren. Alte Kategorie-URLs bleiben kompatibel. Alle 183 Detailseiten und 162 eindeutigen Bildreferenzen einschließlich früherer Bilder wurden geladen; Adminbasis-Originalbilder und aufklappbare frühere Werte/Designangaben erhalten. Keine fehlenden Bilder, keine lokalen Ressourcenfehler, keine JavaScript-Ausnahmen und keine horizontalen Überläufe.

**Bekannte Datenquellen-Grenze:** register_visitor_period liefert beim vorhandenen Backend HTTP 404 (eine Browser-Netzwerk-Konsolenmeldung). Der unveränderte gemeinsame Zähler behandelt das korrekt: Heute und Insgesamt sind echte Werte aus dem bisherigen Backend; Gestern, Diese Woche und Dieser Monat bleiben „—“ mit Erklärung. Keine erfundenen Zahlen und keine Backend-/SQL-Migration in diesem Auftrag.

DE/EN für Navigation, Filter, Suchsteuerung, Entwicklungsstand und Besucherstatistik; Katalogtexte/Designreferenzen weiter deutsch, mit Hinweis im englischen Modus. Browser-Steuerwerkzeug war durch Windows-Sandbox-ACL-Fehler nicht verfügbar; vorhandener isolierter Edge-Prüfweg verwendet. Bildschirmaufnahmen außerhalb des Live-Server-Verzeichnisses gespeichert, um Entwicklungs-Autoreload während der Prüfung zu vermeiden.

Nachweise: tools/validation/wiki-structure-20260930/browser-report.json, wiki-verify.json, preservation.json, final-checks.json. Bestand und fremde Homepage-/Spielarbeit unverändert; git diff --check sauber. Kein Commit/Push/Export/Serverstart.


Sechs bestehende Wiki-Einträge beschreiben jetzt 14 feste HESCO-Maueransichten am südlichen Adminbasis-Checkpoint. 183 Einträge / 112 Hauptbildreferenzen, 7172 bestehende Wiki-Prüfungen bestanden. Keine Änderungen an Wiki-UI, CSS, Navigation, Galerien oder Bildern. Die 19 erfolgreichen Desktop-/Mobile-Browserfälle der HESCO-Integrationsphase bleiben der vorhandene Browsernachweis; in dieser reinen Inhaltsergänzung keine vollständige Browserrunde wiederholt.

Spielnachweise für die neue Weltzeichnung unter `art_reference/master_kit_v1/validation/hesco-world-checkpoint/`: 1150 gezielte Checks und sechs tatsächliche Offline-Main-Rendereraufnahmen. Vollständiger normaler Client-/Laptop-Livetest bleibt offen. Frühere Browsernachweise folgen unverändert.

---

# 30.09.2026 – gezielte HESCO-Integrationsprüfung

**19 Browserfälle bestanden** auf dem lokalen Live-Server `http://127.0.0.1:5500/wiki.html`: fünf neue HESCO-Seiten auf Desktop 1440×1000 und Mobil 390×844, Ecke zusätzlich bei 360×800. Basenbau/HESCO-Suche liefert fünf Einträge; Ecken-Unterfilter einen. Löschen der Suche, zwölf Modulansichten, Adminbasis-Verknüpfung mit beiden bestehenden Referenzbildern und Browser-Zurücknavigation geprüft. Keine Browser-JS-/Konsolenfehler, fehlenden Bilder oder horizontalen Überläufe. Aktuelle Desktop-/Mobilaufnahmen visuell geprüft; Modulgalerien verwenden die bestehende responsive Darstellung.

Browserplugin scheiterte nach Reset/Retry an Windows-Sandbox-ACLs. Prüfung erfolgreich mit bereits gebündeltem Playwright und installiertem Edge als lokalem Headless-Browser durchgeführt; keine Installation und keine Änderung bestehender Browserprofile. Ergebnisse/Aufnahmen im Spiel unter `art_reference/master_kit_v1/validation/hesco-integration/browser-result.json` und `wiki-*.png`. Keine vollständige Wiederholung unveränderter Wiki-Bereiche.

Wiki-Builder: **183 Einträge / 112 Hauptbildreferenzen / 0 Fehler**; bestehender Wiki-Prüfer **7172 Checks** bestanden. Alle fünf neuen Wiki-Definitionen und zwölf Bilddateien mit tatsächlichen Spieldefinitionen abgeglichen. 177 vorhandene Einträge und alle bisherigen Bilddateien erhalten; Adminbasis nur um geplante HESCO-Verweise ergänzt. Modulbau lokal integriert; feste HESCO-Weltpositionen, Art-Freigabe und Maßstabsabstimmung offen.

Spiel: **1932 Baukasten- und 888 gezielte HESCO-/Bestandschecks**, sechs Offline-Renderaufnahmen, Parser/Import 0 Fehler. Vollständiger normaler Client-/Laptop-Mehrclient-, Persistenz- und Reconnect-Test offen; Offline-Snapshot-/Serialisierungsprüfungen sind kein Netzwerkbeleg. **DEDICATED-NEUSTART AUF LAPTOP ERFORDERLICH**, hier kein Start/Neustart. Kein Commit, Push oder Webexport.

Vorherige Browser-/Prüfnachweise folgen unverändert.

---

# Adminlayout-Hinweise – 30.09.2026

Nur aktuelle Admin- und Händlerdach-Hinweise einschließlich Dachgalerie-Texte angepasst: vier Stände im freien Hof, Fahrspur/Büro/Zugänge frei, vorhandene Bedienung. 178 Einträge, Bilder, Varianten, Kategorien, JS, CSS und Layout unverändert. Erfolgreiche Browserprüfungen des Hof-Meilensteins wiederverwendet; für zwei Einträge mit Textänderungen keine neue vollständige Desktop-/Mobilrunde. Builder separat geprüft. Ursprüngliche Adminreferenzen und bisherige Berichte unverändert erhalten. Nachweis: `validation/adminbase-layout/wiki-preservation.json`.

# Hofbatch – Browserprüfung 30.09.2026

22 neue gezielte Detailfälle bestanden: Adminbasis und zehn Bodenmodule jeweils Desktop 1280×900 und Mobil 360×800. 85 Master-Kit-Serientreffer, alle Bilder/Varianten geladen, alle neuen Admin-Modulverknüpfungen vorhanden, Suche/Rücknavigation erhalten, keine Platzhalter, Seitenüberläufe, Konsolen- oder JS-Fehler. Vorhandenes Werkzeug wiederverwendet, isolierter Edge und temporäre Vorschau beendet. Acht Screenshots gespeichert, gezielte Desktop-/Mobilansichten visuell geprüft. Danach nur die neuen Infotexte gekürzt und der Bundle fehlerfrei neu gebaut; keine Bild-, Layout-, JS-/CSS- oder Prädikatsänderung. Frühere unveränderte Nachweise bleiben gültig. Nachweis: validation/adminbase-courtyard/browser-current.json.

# Ergänzung: Admin-Gebäudehinweise – 30.09.2026

Wiki-Bestand 168 Einträge/75 Serientreffer unverändert. Keine neuen Bilder, Layout-, CSS- oder JS-Änderungen; sieben bestehende aktuelle Hinweise an die tatsächliche Umstellung aller vier Admingebäude angepasst. Historische Adminreferenzen erhalten.

Vier gezielte Detailfälle bestanden: Adminbasis und offener Rahmen je Desktop 1280×900/Mobil 360×800, isolierter Edge mit kurzzeitiger Vorschau nur auf 127.0.0.1. Alle Bilder geladen; vier Gebäudenamen und tatsächliche 64 px-Eingangsbreite im Text vorhanden. Suche/Rückkehr erhalten, keine Platzhalter, horizontalen Überläufe, Konsolen- oder Seitenfehler. Desktop-Adminbasis und mobiler Rahmen visuell geprüft. Browser/Vorschau beendet; Benutzerprofil/Live-Server unverändert.

Nachweise: `validation/adminbase-buildings/browser-current.json`, Log und vier Screenshots. Builder 168 Einträge/97 Hauptbildreferenzen/0 Fehler. Frühere vollständige Bilder-/Galerie-/Kategorieprüfungen weiter gültig, unveränderte Bereiche nicht erneut vollständig geprüft. Normaler Client-/Laptop-Mehrclienttest bleibt offen. Kein Commit, Push, Webexport oder Deployment. Frühere vollständige Nachweise erhalten:

---

# Ergänzung: Adminbasis-Hallen-Kit – 30.09.2026

Aktueller lokaler Stand:168 Wiki-Einträge,60 Spieler-Bautypen,12 Weltgrafikmodule,101 aktive/107 gespeicherte PNGs;75 Master-Kit-Serientreffer. Isolierter Edge/Chromium über kurzzeitige Vorschau nur auf 127.0.0.1; Browser und Vorschau anschließend beendet. Benutzerprofil und bestehender Live-Server unverändert.

**20 Detailfälle bestanden** bei Desktop 1280×900 und Mobil 360×800: neue fünf Hallenseiten, Metalldachkachel, Überdachung, Wachhäuschen, Schrankenkomponenten und zentrale Adminbasis je Größe. Hauptbilder und sämtliche Galerievarianten geladen; keine Platzhalter oder horizontalen Überläufe. Adminseite zeigt die tatsächliche modulare Hallendarstellung und verlinkt alle neuen Hallenmodule.75 Serientreffer, Basiskisten-Suche und Rückkehr erhalten; Konsolen-/Seitenfehlerlisten leer.

Sichtprüfung fand die zu starke Vergrößerung schmaler senkrechter Weltmodulbilder in der Galerie. Gezielte Korrektur: Weltmodulgalerie erhält eigene Klasse; Bilder verwenden ihre proportionalen Maße mit maximal 360 px Höhe. Historische Adminbasisreferenzen behalten bisherige Regeln. **Zehn gezielte Nachprüfungen bestanden**: Fenster, Dachkante, Überdachung, Schranke und Adminbasis je Größe, alle Galerievarianten geladen, Bildverhältnisse erhalten, keine ungewollte Vergrößerung/Überläufe/Browserfehler. Finale Desktop-Fenster-/Mobil-Dachkantenbilder visuell geprüft; Mobile-Rolltorrahmen ebenfalls geprüft. Kein weiterer sichtbarer Layoutfehler.

Nachweise: `validation/adminbase-hall-kit/browser-168.json`, `browser-gallery-size-fix.json`, jeweilige Logs und Screenshots.6465 Wiki-Prüfungen ohne Fehler; finaler Builder 168 Einträge/97 Hauptbildreferenzen/0 Fehler. Vorhandene Kategorien-, Bauleitfaden-, Navigations- und 22 JS/Python-Paritätsnachweise bleiben gültig; unveränderte Bereiche nicht erneut vollständig geprüft. Normaler Client-/Laptop-Mehrclienttest weiterhin offen.

Kein Commit, Push, Webexport oder Deployment. Frühere vollständige Prüfnotizen bleiben erhalten:

---

# Ergänzung: Adminbasis-Service-Kit – 29.09.2026

Aktueller Bestand: 163 Wiki-Einträge, 60 Spieler-Bautypen, sieben eigenständige Weltgrafikmodule, 93 PNGs; Serienfilter 70 Treffer. Isolierter Edge prüfte aktuelle lokale Dateien über eine kurzzeitige Vorschau ausschließlich auf 127.0.0.1. Anschließend Browser und Vorschau beendet; Benutzerprofil und vorhandener Live-Server unverändert.

**16 Detailfälle bestanden**: sieben neue Module plus zentrale Adminbasis jeweils bei 1280 × 900 und 360 × 800. Alle zehn neuen Bildvarianten geladen, keine Platzhalter, kein horizontaler Überlauf. Adminbasis zeigt aktuellen Teilstand und verlinkt sämtliche sieben Module. Serienfilter, Suche und Rückkehr bestätigt; Konsolen-/Seitenfehlerlisten leer.

Die gespeicherten Desktop-Überdachungs- sowie mobilen Theken-/Wachhäuschen-Screenshots wurden visuell geprüft. Kein sichtbarer Layoutfehler. Der bestehende Detailrenderer unterscheidet nun Weltgrafikmodule von geplanten Gesamtgebäuden; konkrete Darstellungsmaße werden nicht mehr als OFFEN bezeichnet. Vorbereitete Ansichten und Art-Grenzen bleiben sichtbar als solche beschrieben. Keine CSS-Änderung für diesen Batch.

Nachweise: `art_reference/master_kit_v1/validation/adminbase-service-kit/browser-163.json`, `browser-163.log`, vier `browser-*.png` im Spielprojekt. 6259 Wiki-Prüfungen und 22 gezielte JS/Python-Beweisfälle ohne Fehler. Historische Kategorien-/Bauleitfadenprüfungen bleiben gültig. Vollständiger normaler Client-/Laptop-Mehrspielertest bleibt offen.

Kein Commit, Push, Webexport oder Deployment. Frühere Prüfungen vollständig erhalten:

---

# Master Kit – Browserprüfung am 14.09.2026

Geprüft mit dem Codex-In-App-Browser auf dem vom Nutzer gestarteten Live-Server `http://127.0.0.1:5500/wiki.html`. Datenstand: 143 Einträge, sechs Master-Kit-Hauptbilder. Keine Darstellungsänderung war erforderlich.

- Desktop bei 1280 px sowie mobile Ansichten 390 × 844 und 360 × 800: keine sichtbaren Layoutfehler oder horizontaler Seitenüberlauf. Temporäre Viewport-Einstellungen anschließend zurückgesetzt.
- Hauptkategorien: Waffen 15, Ausrüstung 16, Verbrauch/Loot 24, Basenbau 58, Werkstatt 2, Fallen 5, Systeme 12, Weltgebäude 11, Alle 143. Kategorienwechsel und Rücksetzen der Suche funktionieren.
- Serienlink Master Kit V1: sechs Treffer. Unterfilter Wände: zwei Treffer. Suche ohne Treffer: verständliche Leermeldung und Rücksetzlinks.
- Alle sechs Moduldetails aufgerufen, Bildladung bestätigt, Rückkehr zum gefilterten Katalog bestätigt. Betonwand und Sandsackecke zusätzlich visuell in der Detaildarstellung geprüft; die übrigen Bilder im Kartenraster geprüft.
- Adminbasis: beide Originalreferenzen laden, Desktop nebeneinander und mobil untereinander; lange Überschrift, Funktionsbereiche und Modulverweise passen in die verfügbare Breite. Das zweite Bild wird bei Annäherung nachgeladen.
- Weltgebäude: Kategorie und Industrie-/Lager-Detail mit sichtbarem Placeholder, Eingangslogik, Modulübersicht und verwandten Referenzen geprüft.
- Bausystem: Bauleitfaden öffnet über die Navigation. Die breite Vergleichstabelle bleibt in ihrem eigenen horizontal scrollbareren Bereich; kein Seitenüberlauf.
- Mobile Hauptnavigation öffnet/schließt und führt über Wiki zurück zur Startansicht.
- Browser-Logs nach den Interaktionen: keine Warnungen oder Fehler. Keine kaputten sichtbaren Bilder festgestellt.

Die Prüfung schließt den zuvor wegen `ERR_CONNECTION_REFUSED` offenen Browserpunkt für diesen Datenstand. Spätere neu erzeugte Module müssen nach ihrer Einbindung erneut gezielt geprüft werden. Kein Commit, Push, Export oder Deployment.

## Nachtrag – Browserprüfung am 21.09.2026

Geprüft im Codex-In-App-Browser auf demselben lokalen Wiki. Datenstand: 147 Einträge und 15 Master-Kit-Hauptbilder. Die Prüfung vom 14.09.2026 bleibt oben als Historie erhalten.

- Desktop: 1280 × 900. Mobile Ansichten: 360 × 800 und 390 × 844. Kein horizontaler Seitenüberlauf festgestellt.
- Alle neun neuen oder neu bebilderten Detailseiten geprüft: Holzboden, Holzwand, Metallboden, Metallwand, Holzdach, beschädigte Betonwand, beschädigte Holzwand, Metallzaunecke und Betonbarriere. Ihre Bilder laden; die Detailseiten zeigen keinen Seitenüberlauf.
- Serienlink Master Kit V1: 15 Treffer. Unterfilter Ecken: zwei Treffer; Dächer: ein Treffer. Zurück zur Übersicht erhält den gesetzten Filter.
- Übersicht und Betonbarriere auf dem Desktop sowie Holzdach und Metallzaunecke mobil zusätzlich visuell geprüft. Kein CSS-Fix erforderlich.
- Adminbasis-Verweise bleiben erreichbar. Browser-Logs nach den Interaktionen: keine Warnungen oder Fehler.

Die gezielte Browserprüfung für diesen 147-Einträge-Stand ist abgeschlossen. Weitere neue Module benötigen nach ihrer Einbindung wieder eine gezielte Prüfung. Kein Commit, Push, Export oder Deployment.

## Weiterer Nachtrag am 21.09.2026 – Fenster, Betonwandecke und Utility-Module

Datenstand: 148 Einträge und 19 Master-Kit-Motive. Geprüft auf dem Desktop bei 1280 × 900 sowie mobil bei 360 × 800.

- Die vier zuletzt integrierten Detailseiten – Betonwandecke, Fensterwand, Werkbank und Lagerkiste (Holz) – laden ihre Bilder und zeigen keinen horizontalen Seitenüberlauf.
- Betonwandecke auf dem Desktop und Holzkiste mobil zusätzlich visuell geprüft; keine Darstellungsfehler festgestellt.
- Der Serienlink sucht jetzt über alle Kategorien. Die Rückkehr aus einem Detail erhält die Suche mit 22 Treffern: 19 Module und drei zugehörige Planungsreferenzen. Der Filter Werkstatt zusammen mit der Master-Kit-Suche zeigt genau die Holzkiste; ihre ursprüngliche Kategorie bleibt erhalten.
- Alle fünf Betonwandecken-Verweise auf der Adminbasis-Seite sind erreichbar. Browser-Logs: keine Warnungen oder Fehler.

Die Browserprüfung für den 148-Einträge-Stand ist abgeschlossen. Die dazugehörigen automatisierten Berichte liegen im Spielprojekt unter `art_reference/master_kit_v1/validation/utility/wiki-verification-148.json` und `wiki-preservation-148.json`: 5.733 Wiki-Prüfungen bestanden, 30 Spiel-/Wiki-PNGs bytegleich. Kein CSS-Fix, Commit, Push, Export oder Deployment.

## Nachtrag am 22.09.2026 – zweite Torgröße

Datenstand: 148 Einträge, 20 Master-Kit-Motive, 32 Runtime-PNGs. Gezielte Prüfung des neuen Garagentor-Bildes am bestehenden lokalen Live-Server.

- Desktop 1280 × 900 und Mobile 360 × 800: Garagentor-Detail visuell geprüft, PNG 512 × 105 geladen, keine sichtbaren Layoutfehler, kein horizontaler Seitenüberlauf (Dokumentbreite 1265 bzw. 345 px).
- Basenbau mit Suche Master Kit V1: 19 Treffer; Unterfilter Tore: Metalltor und Garagentor. Detail-Rückkehr erhält Suche und Torfilter.
- Serienlink über alle Kategorien: 23 Treffer (20 Module plus drei Planungsreferenzen).
- Geplantes Garagengebäude verlinkt das neue Garagentor-Bild über die erhaltene historische ID. Dieser Navigationsweg wurde ausgeführt und bestätigt.
- Browser-Logs: keine Warnungen/Fehler. Viewport-Override zurückgesetzt. Kein CSS-Fix erforderlich.

Begleitnachweise: validation/garage/wiki-verification-148.json (5735 Prüfungen, Fehlerliste leer), wiki-preservation-148.json (147 andere Einträge unverändert) und validation/asset-report-20-modules.json im Spielprojekt. Diese Sichtprüfung belegt keinen Laptop-Mehrclient-Test. Kein Commit, Push oder Export.

## Nachtrag am 23.09.2026 – gemeinsamer Versorgungs-Batch

150 Einträge, 31 Master-Kit-Module, 45 Spiel-/Wiki-PNGs. Vorhandener Live-Server http://127.0.0.1:5500/wiki.html, isolierter Edge/Chromium-Testbrowser mit eigenem temporärem Profil; Desktop 1280 × 900 und Mobile 360 × 800.

- Alle elf neuen Detailbilder in beiden Größen geladen (22 Fälle), keine Platzhalter und kein horizontaler Seitenüberlauf.
- Serienfilter 34 Treffer. Suche nach Sicherungskasten liefert genau einen Eintrag; Detailöffnung und Rückkehr erhalten die Suche. Rückkehr aus der Serie behält 34 Treffer und den Suchtext.
- Generator/Wassertank auf Desktop und Kühlschrank/Sicherungskasten mobil zusätzlich anhand echter Browserscreenshots visuell geprüft: keine sichtbaren Layoutfehler. Kein CSS-Fix nötig.
- Browserkonsole: 0 Warnungen, 0 Fehler; pageerror: 0.
- Die normale Browser-UI-Steuerung startete wegen eines lokalen Windows-ACL-Fehlers nicht. Die bereitgestellte Playwright-Laufzeit wurde anschließend erfolgreich mit dem bereits installierten Edge genutzt; kein Browserdownload, keine Arbeit am Nutzerprofil.

Nachweise im Spielprojekt unter validation/supply-batch/: browser-150.json und vier browser-*.png. Bestehende Prüfungen für unveränderte Kategorien, Adminbasis, Weltgebäude und Bauleitfaden bleiben gültig; diese Bereiche wurden in diesem Batch nicht erneut vollständig geprüft. Der Laptop-Mehrclient-Nachweis bleibt offen.

## Nachtrag am 24.09.2026 – Struktur-Batch

151 Einträge, 41 Master-Kit-Module, 61 Spiel-/Wiki-PNGs. Isolierter Edge-Testbrowser: Desktop 1280 × 900 und Mobile 360 × 800.

- Alle zehn neuen Detailbilder in beiden Größen geladen (20 Fälle), keine Platzhalter und kein horizontaler Seitenüberlauf.
- Serienfilter 44 Treffer. Suche nach Basiskiste liefert genau einen Eintrag; Detailöffnung und Rückkehr erhalten Suche. Rückkehr aus der Serie behält 44 Treffer und Suchtext.
- Steinfensterwand Desktop und Basiskiste Mobile zusätzlich anhand echter Browserscreenshots visuell geprüft: keine sichtbaren Layoutfehler. Weitere Screenshots für verstärktes Tor Desktop und Holzpfeiler Mobile gespeichert. Kein CSS-Fix nötig.
- Browserkonsole: keine Warnungen/Fehler; pageerror: 0.
- Der Nutzer-Live-Server auf Port 5500 war nicht erreichbar (ERR_CONNECTION_REFUSED). Die erfolgreiche Prüfung lief über eine kurzzeitige, nur an 127.0.0.1 gebundene Vorschau derselben lokalen Wiki-Dateien. Vorschau danach beendet; kein Nutzerprofil verändert, kein Browserdownload, kein Dedicated gestartet.

Nachweise im Spielprojekt unter `art_reference/master_kit_v1/validation/structure-batch/`: `browser-151.json`, `browser-151.log`, vier `browser-*.png`; ursprünglicher Verbindungsfehler separat in `browser-151-live-server-unavailable.json`. Die abschließend geänderten internen Prüfnachweise wurden anschließend im Wiki-Bundle erfolgreich neu gebaut; keine sichtbare Layout-/Inhaltsänderung dadurch.

Frühere Prüfungen für unveränderte Kategorien, Adminbasis, Weltgebäude und Bauleitfaden bleiben gültig. Keine erneute Vollprüfung dieser Bereiche. Diese Browserprüfung belegt keinen vollständigen Laptop-Mehrclient-/Persistenz-/Reconnect-Test. Kein Commit, Push oder Webexport.

## Nachtrag am 27.09.2026 – Habitat-Batch

151 Einträge, 51 Master-Kit-Module, 74 Spiel-/Wiki-PNGs. Isolierter Edge-Testbrowser, Desktop 1280×900 und Mobile 360×800. Prüfung der aktuellen lokalen Dateien über eine kurzzeitige ausschließlich an 127.0.0.1 gebundene Vorschau, danach beendet. Kein Nutzerprofil, bestehender Server oder Dedicated verändert.

- Alle zehn ergänzten Detailbilder auf Desktop und Mobil geladen (20 Fälle); keine Platzhalter oder horizontalen Seitenüberläufe.
- Serienfilter 54 Treffer; Suche nach Basiskiste und Rückkehr erhalten den Suchtext. Detail-Rückkehr aus der Serie behält 54 Treffer.
- Gewächshaus Desktop und Bett Mobile zusätzlich anhand echter Screenshots visuell geprüft. Weitere Screenshots für Steinfundament Desktop und Krankenbett Mobile gespeichert. Keine festgestellten Layoutfehler, kein CSS-Fix.
- Browserkonsole: keine Warnungen/Fehler; pageerror: 0.
- Nachweise im Spielprojekt `art_reference/master_kit_v1/validation/habitat-batch/`: `browser-151.json`, `browser-151.log`, vier `browser-*.png`.

Danach nur interne Prüfnachweise der zehn Einträge aktualisiert und Bundle erfolgreich neu gebaut, keine neue sichtbare Inhalts-/Layoutänderung. Kategorien/Adminbasis/Weltgebäude/Bauleitfaden unverändert; ihre früheren Nachweise werden weiterverwendet. Vollständiger Laptop-Mehrclient-/Persistenz-/Reconnect-Test bleibt offen. Kein Commit, Push oder Webexport.

## Nachtrag am 28.09.2026 – Utilities-Batch

Datenstand: **156 Wiki-Einträge, 60 Master-Kit-Module, 83 PNGs**. Der Serienfilter umfasst 63 Treffer: 60 Module und drei zugehörige Planungsreferenzen. Aktuelle lokale Dateien sind maßgeblich. Der isolierte Edge-Testbrowser nutzte eine kurzzeitige, ausschließlich an 127.0.0.1 gebundene Vorschau dieser Dateien. Vorschau danach beendet; Nutzer-Server und Browserprofil unverändert.

Geprüft wurden neun Utilities auf Desktop **1280 × 900** und Mobile **360 × 800**, insgesamt **18 Detailfälle**:

- Lagerfeuer, Stachelfalle, Drahtfalle, Solaranlage, Windrad, Wasserfilteranlage, Munitionspresse, Überwachungskamera und Alarmanlage.
- Detailbilder, Serienfilter mit 63 Treffern, Suche und Rückkehr zur gefilterten Übersicht.
- Browserkonsole und Seitenfehler: keine gemeldeten Fehler.
- Abschließende mobile Kameraaufnahme und Wasserfilter-Detail auf Desktop zusätzlich visuell geprüft.

Bei der ersten visuellen Prüfung des mobilen Kameratitels stand ein einzelnes „a“ in der letzten Zeile. Der einzige finale CSS-Zusatz setzt innerhalb der bestehenden Medienregel bis 580 px für `.wiki-page .wiki-detail-copy h2` die responsive Größe `font-size: clamp(1.25rem, 6.2vw, 1.55rem)`. Die Desktopregel bleibt unverändert. **Der begrenzte Nachtest ist bestanden: Der vollständige Kameratitel passt sauber in eine Zeile.** Alle 18 Detailfälle, 63 Serientreffer, Suche/Rückkehr und leere Konsolen-/Seitenfehlerlisten sind im finalen Browserlauf bestätigt. Wiki-HTML, JavaScript-Renderer und Builder wurden nicht geändert.

Aktuelle Nachweise im Spielprojekt unter `art_reference/master_kit_v1/validation/utilities-batch/`:

- `browser-156.json` und `browser-156.log`.
- `browser-156-before-hyphenation.json` und `browser-360-camera-before-hyphenation.png` dokumentieren den Ausgangsbefund; die Dateinamen stammen aus dem Arbeitsverlauf. Der finale Fix betrifft ausschließlich die mobile Titelgröße.
- Screenshots `browser-1280-build_water_filter_01.png`, `browser-1280-build_ammo_press_01.png`, `browser-360-build_campfire_01.png`, `browser-360-build_security_camera_01.png`.

Begleitprüfungen: 5.980 Wiki-Prüfungen ohne Fehler, 156 Einträge; 83 byteidentische Spiel-/Wiki-PNGs, alle 74 bisherigen Bilder erhalten. Vier Einträge aktualisiert, fünf neu, 147 bisherige Einträge vollständig unverändert. Nachweise `wiki-verify-156.json` und `wiki-preservation-156.json`. Abschließende interne Nachweise aktualisiert und Bundle gebaut: 156 Einträge, 85 Bildreferenzen, 0 Validierungsfehler; beide vollständigen git diff --check sauber. Finaler Erhaltungsnachweis: `wiki-final-preservation-156.json`.

Frühere Browserprüfungen der unveränderten Kategorien, Adminbasis, Weltgebäude und des Bauleitfadens werden weiterverwendet. Die komplette Historie ist [im gesicherten vorherigen Bericht](C:/Users/sebbo/OneDrive/Dokumente/Spiel/zh-survival/art_reference/master_kit_v1/validation/utilities-batch/before/wiki/docs/MASTER_KIT_BROWSER_QA.md) erhalten.

Dieser Browsernachweis ersetzt keine normale Client-Platzierung und keinen Laptop-Mehrclient-, Persistenz- oder Reconnect-Test. Katalogübernahme auf den Laptop und Dedicated-Neustart bleiben erforderlich. Kein Commit, Push, Webexport oder Deployment.
