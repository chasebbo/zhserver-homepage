# Spielseite – visuelle Landingpage (lokal)
Stand: 11.10.2026. v118 lokal integriert, Zwei-Minuten-Gaststart freigeschaltet;
Hero weiterhin über dem großen Spielfenster. Visuelle Nutzerabnahme ausstehend.
Ausgangscommit: b2649b194adec58e73e8bc7bef97ebd30d36a9f2.

Die jüngste Layoutkorrektur ist maßgeblich: Hero, Accountstatus und Spielbuttons
stehen über dem großen Spielfenster. Die übrige Gestaltung nach Bildvorgabe bleibt
erhalten: vier Kernfeatures ohne Icons, Alpha-Bereich mit Changelog/Roadmap-Tabs
und kompakter Community-Abschluss. Der abgelehnte Entdecken-Bereich mit drei
Bildkacheln bleibt entfernt. Keine generischen Symbole/Badges wieder einsetzen.

## Aktuelle Freigabegrenzen
Der Nutzer hat den produktiven Dedicated v118 auf WINLAP und die 120000-ms-
Gastpolicy ausdrücklich bestätigt und die lokale Homepage-Integration freigegeben.
Nur den vorhandenen Webbuild aus `C:/ZHServer-Builds/v118` übernehmen; kein neuer
Export. Kein Commit, Push oder Deployment vor der visuellen Abnahme.
Spielquellen, Dedicated, U01/F01, Supabase-Backend, Accounts und Wiki unverändert
lassen. Die nachstehenden älteren v117-/Gastblocker sind historische Nachweise.

## Aktueller Stand: v118 lokal integriert – 11.10.2026

- Alle elf gelieferten Laufzeitdateien nach `game/` übernommen, Größen/SHA256
  identisch zum v118-Manifest; größte Datei 90 MiB. Keine Builddatei verändert.
- `game.html` lädt `game/survival-v118.html?build=guest-v118-20261011`.
  Nur iframe-Ziel und Cachekennung des Einstiegsscripts geändert. Hero oberhalb
  des großen gemeinsamen Vorschau-/Spielfensters, Features, Alpha, Community,
  Header, Footer, DE/EN-Texte und `game-entry.css` bleiben bytegleich erhalten.
- `game-entry.js` gibt den Gaststart frei. Der Start prüft die zentrale Identität
  erneut: Mitglied nur mit derselben UUID, Gast nur ohne eingeloggten Account.
  Beide Starts erfordern ONLINE. Die Homepage erzeugt keinen eigenen Gasttimer.
  Die unveränderte Auth-Bridge und der gelieferte Client bleiben maßgeblich.
- Echter Mitgliedsstart mit vorhandener cHa-Sitzung auf Port 5500 bestanden:
  v118-Lobby zeigt „Eingeloggt als: cHa“ und geladenen Spielstand ohne zweiten
  Login. E-Mail nicht als Spielername. Kein zusätzlicher Mitglieds-Weltbeitritt.
- Echter Gasttest auf derselben lokalen Homepage unter `localhost:5500`, ohne
  Sitzungskopie oder Abmeldung des Mitglieds: v118 starten, Gastmodus wählen,
  Nordstadt betreten. Anzeige beginnt bei 02:00; Countdown und anschließendes
  Testzeit-Ende tatsächlich beobachtet. Exakte 120000-ms-Policy ist im Manifest
  bestätigt; die genaue serverseitige Ablauf-/Reconnect-/F6-Abnahme wurde vom
  Nutzer geliefert und hier nicht unnötig wiederholt. Keine neue Gastpersistenz.
- ZHServer1 ONLINE; öffentlicher `wss://ws.zhserver.de/ws`-Handshake HTTP 101 mit
  gültigem Upgrade. Alle elf lokalen v118-Dateien HTTP 200, korrekte Größen und
  MIME-Typen einschließlich `application/wasm` und binärer Packteile.
- Elf unveränderte, nun unreferenzierte `game/survival-v117.*`-Dateien entfernt.
  Vorher aktive Referenzen und Baseline-Hashes geprüft. Historische Handoffs,
  Quellbuilds und andere ältere Dateien nicht gelöscht.
- 0 erfasste Browser-JS-/Consolefehler und Warnungen im Mitglieds-/Gasttest;
  0 HTTP-Fehler in der gezielten Datei-/WSS-Prüfung. JS-Syntax und
  `git diff --check` sauber. Bereits bestandene unveränderte Layout-/Auth-
  Prüfungen weiterverwendet; neue DE/EN-Ansichten auf Desktop 1440 und Mobile
  390 geprüft: 0 horizontale Überläufe. Neue Screenshots zur Abnahme gespeichert.
- Alle fremden lokalen Änderungen, insbesondere 19 Wiki-Prüfartefakte, erhalten.
  Kein Dedicated-Neustart, keine Migration und kein Spielquellen-Eingriff.
- Nachweise außerhalb Git:
  `C:/Users/sebbo/.codex/visualizations/2026/09/30/01a0f137-f3f5-7bc0-b080-7b451ea65ff0/game-v118-homepage-local-20261011`
  enthält Baseline, Manifest, HTTP-/Browser-/Erhaltungsberichte und Screenshots:
  `desktop-current-v118.jpg`, `mobile-current-v118.jpg`, `member-client-cHa.jpg`,
  `guest-start.jpg` und `guest-ended.jpg`. Testartefakte nicht in Git aufnehmen.
- **STOPP zur visuellen Abnahme. Kein Commit, Push, Deployment oder Webexport.**

## Erhaltene Layoutabnahme: Hero über Spielfenster – vor der v118-Integration

- Ausschließlich Hero-/Spielfenster-Layout in `assets/css/game-entry.css`
  korrigiert. Der bisherige Split entfällt; Hero auf Desktop zentriert,
  Accountstatus und Buttons darüber. Auf Mobile bleibt der Text linksbündig.
- Vorschau und echter Client bleiben im selben nahezu contentbreiten Fenster.
  Desktop-iframe mit 16:9: bei 1440 px gemessen 1309 × 736 px, bei 1280 px
  1162 × 654 px. Tablet mindestens 420 px, Mobile mindestens 360 px hoch.
  Start-Scroll berücksichtigt den festen Desktop-Header.
- In `game.html` nur CSS-Versionskennung und responsive Bildgrößenangabe geändert.
  Sonstiges HTML sowie sämtliche Feature-/Alpha-/Community-Styles unverändert.
  Keine Änderung an Scripts, Textkatalog, Auth, Header, Footer oder Spielbuild.
- Servertransport bei dieser Runde tatsächlich ONLINE. Bestehenden v117-Client
  lokal gestartet: vorhandene cHa-Sitzung erkannt, Lobby mit geladenem Spielstand
  sichtbar. Kein Vollbild und kein Klick auf „SERVER BETRETEN“; kein Gameplaytest.
  Vorschau und Client wechseln im selben Fenster. Mobile Aktivierung und
  Scroll-Modus geprüft. Reload zeigt wieder Vorschau und erhält den Account.
- DE/EN, Desktop 1440/1280, Tablet 768, Mobile 390/360 geprüft. Hero jeweils
  oberhalb des Fensters; 0 horizontale Überläufe, 0 erfasste Consolefehler/Warnungen.
  Frühere Tests unveränderter Features/Tabs/Auth werden nicht erneut durchgeführt.
- Neue echte Desktop-/Mobile-Screenshots mit Vorschau und geladenem v117-Client:
  `C:/Users/sebbo/.codex/visualizations/2026/09/30/01a0f137-f3f5-7bc0-b080-7b451ea65ff0/game-landing-stacked-20261011`
  Dort Ausgangskopien, Layoutmessungen und Erhaltungsnachweise; nichts davon in Git.
- **STOPP zur visuellen Abnahme.** v118 nicht freigegeben, Gaststart weiterhin
  deaktiviert. Kein Commit, Push, Deployment oder Webexport. Kein Dedicated-Neustart.

## Stand nach Bildvorgabe – vor der Layoutkorrektur

- `game.html` tatsächlich strukturell umgebaut, `game-entry.css` neu abgestimmt.
  Atmosphärischer Hero: großer cremefarbener Markenname, goldener SURVIVAL-Zug,
  kurze Beschreibung, genau ein zentraler Account-/Spieleinstieg links.
- Rechts ein zusammenhängender Spielbereich mit ZHServer1 und echter vorhandener
  WSS-Transportprobe. Der bestehende v117-iframe liegt jetzt direkt darin;
  nach gültigem Mitgliedsstart ersetzt er die Vorschau an derselben Stelle.
  Steuerung, Wiki-Link, Vollbild und mobile Aktivierung/Scroll-Modus erhalten.
- Vor dem Start wird das vorhandene `zombiehoelle-survival-vision1.webp` gezeigt,
  ausdrücklich als Spielwelt-Illustration gekennzeichnet. Kein neuer oder
  erfundener Gameplay-Screenshot, kein fingierter Spielerstand/Onlinewert.
- Vier kurze, dezent gerahmte Features ohne Symbole: Multiplayer & Gruppen,
  Basenbau, persistente Welt, Fahrzeuge & Loot. Keine Entdecken-Bildkacheln.
- Alpha links: 0.2.3, drei aktuelle Schwerpunkte und 14/20 Änderungen dieser
  Version. Der Balken zeigt Versionspunkte, keinen erfundenen Gesamtfortschritt.
  Rechts funktionierende CHANGELOG/ROADMAP-Tabs mit ARIA, Pfeiltasten/Home/End.
  Version, Punkte, vier letzte Änderungen und vier Roadmap-Bereiche werden aus
  der bestehenden `game-development.html` gelesen; deren Inhalte bleiben erhalten.
  Kein zweites Changelog-/Roadmap-Datensystem und keine neuen Backend-Aufrufe.
- Großer Geschichtsblock/Accordion und lose Entwicklungslinks entfernt.
  Community-Abschluss „Deine Ideen zählen“ mit drei vorhandenen Zielen.
- 34 neue Texte/Labels/Alttexte im zentralen DE/EN-Katalog, keine zweite
  Sprachlogik. Header-/Footer-Markup bytegleich; nur das generische Account-
  Personensymbol auf dieser Spielseite per scoped CSS ausgeblendet.
- Zentrale cHa-Sitzung tatsächlich erkannt. Ausgeloggte Ansicht auf localhost
  separat geprüft, ohne die vorhandene Sitzung abzumelden oder zu kopieren.
  Gastoption jetzt auch beim Mitglied sichtbar, weiterhin deaktiviert.
  `guestTrialReady = false`, v117-Ziel und Auth-Bridge unverändert.
- Echte Browserprüfung DE/EN bei 1440/1280, Tablet 768, Mobile 390/360.
  Keine sichtbaren Inhalts-/Personen-Icons, kein Entdecken-/Geschichtsblock,
  keine horizontale Überläufe; Tabs, Tastatur, Mobilmenü/Escape, Reload und
  Anmeldelink/Rücknavigation geprüft. Footer enthält beide echten Statistikgruppen.
- 0 erfasste Browser-JS-/Consolefehler und Warnungen. Acht lokale HTML/CSS/JS/
  Bilddateien HTTP 200 mit passenden MIME-Typen. HTML/Links/IDs und JS-Syntax
  sauber; neun isolierte Zustands-/Identitäts-/Startprüfungen bestanden.
- WSS-Transport bei dieser Prüfung OFFLINE, auch nach erneutem Prüfen. Daher
  Start korrekt deaktiviert und kein neuer echter Clientstart behauptet.
  Der integrierte Startpfad ist isoliert geprüft; eine neue Browserabnahme des
  gestarteten Rahmens bleibt bis zur Erreichbarkeit des Servers offen.
- 32 geschützte Dateien SHA256-identisch: elf v117-Dateien, Auth-Bridge,
  Entwicklungsseite und 19 fremde Wiki-Prüfartefakte. Nur sieben vorgesehene
  Präsentations-/Checkpointdateien bearbeitet; kein Spiel-/Backend-/Accounteingriff.
- Neue echte Desktop-Screenshots mit und ohne Anmeldung sowie Mobile, plus
  vollständige Seiten und Roadmap-Ansicht:
  `C:/Users/sebbo/.codex/visualizations/2026/09/30/01a0f137-f3f5-7bc0-b080-7b451ea65ff0/game-landing-reference-20261011`
  Dort auch Ausgangskopien, Diff-/Erhaltungs-/HTTP-/Browser-/Zustandsnachweise.
  Keine Test-/Screenshotartefakte in Git aufnehmen.
- **STOPP zur visuellen Abnahme durch Sebastian.** Noch keine Nutzerfreigabe.
  Kein Commit, Push, Deployment oder Webexport. v118 weiterhin nur vorbereitet.

## Frühere Layoutbeschreibung – vor der jüngsten Bildvorgabe
- `game.html`: zweispaltiger Hero mit Marke, Alpha-Badge, kurzem Text und genau
  einem Account-/Spieleinstieg. Rechts ein großes vorhandenes Konzeptbild mit
  integriertem ZHServer1-Status. Der bisherige zweite Einstieg wurde entfernt.
- Direkt danach vier kurze textliche Kernfeatures ohne Kartenflächen oder Icons:
  Multiplayer, Basenbau, persistente Welt sowie Fahrzeuge & Loot.
  Der gesamte Bereich „Die Welt von Zombiehölle / Zombiehölle entdecken“ mit
  Garage-/Werkstatt-/Wohnhauskacheln ist aus HTML und CSS entfernt. Kein Ersatz.
  Vorhandene Bilddateien und Wiki-Inhalte bleiben unverändert.
- Kompakter Abschnitt „Überleben. Erkunden. Gemeinsam bauen.“ mit kleiner
  historischer Zusatzinfo im Accordion. Entwicklung als drei kurze Karten;
  Community als kompakter Abschluss mit Abstimmung, Bugs und Ideen.
- Hero-Grafik größer (bei 1440 px jetzt 800 px breit), vollständig im natürlichen
  Seitenverhältnis. Alpha als einfache Textzeile, Konzeptkennzeichnung als
  ungerahmte Bildunterschrift. Serverstatus ohne zusätzliche Box/Alpha-Minibadge.
  Inhalts-Icons und Pfeildekoration entfernt; Entwicklung und Community ohne
  dekorative Kartenflächen. Keine neue Animation und kein neuer Inhalt.
- Auf Tablet/Mobile steht das große Bild vor dem Account-Einstieg; die Features
  bilden ein kompaktes 2×2-Raster. Kein zweiter Login.
- `game-development.html`: vorhandene Entwicklung, Roadmap/Zukunftsvision,
  Abstimmung und vollständiger Changelog erhalten. Alle 197 Versionspunkte
  textgleich mit dem Ausgangsstand. Testdatum/Countdown/Pausenhinweise entfernt.
  Bestehende Abstimmung und optionale Ranglisten weiterverwendet.
- Vollständiger gemeinsamer Header und Footer auf beiden Seiten. Community,
  Besucher, Account-Reset-Hinweis, Rechtslinks und Copyright kommen aus der
  bestehenden gemeinsamen Lösung. Besucher-Script pro Seite genau einmal.
- `assets/css/game-entry.css`: nur Einstieg/Detailseite ergänzende Styles,
  bestehende Grün-/Creme-/Gold-Farben und Typografie weiterverwendet.
- `assets/js/game-page-common.js`: zentrale Sprachbindungen inklusive Alttexten,
  vorhandenes Mobilmenü und erhaltene Detail-Funktionen. Alte Links auf `game.html#development`,
  `#game-roadmap`, `#community-voting` und `#changelog` führen zur Detailseite.
- `assets/js/game-entry.js`: verwendet ausschließlich die vorhandene
  `ZHIdentity`/Supabase-Sitzung. Anzeigename als Text, keine öffentliche E-Mail.
  Fehlender Anzeigename führt zum Profilhinweis; Identitätsfehler blockieren den
  Spielstart. Vor Start wird die bestehende Identität erneut geprüft.
- Serverstatus: WebSocket-Handshake am vorhandenen `wss://ws.zhserver.de/ws`.
  Kein Auth-/Gameplay-Paket und keine Spiel-/Gastregistrierung durch die Probe.
  Online bedeutet erreichbarer Transport, keine vollständige Dedicated-Abnahme.
  Timeout/Fehler zeigen OFFLINE und blockieren Start; erneute Prüfung möglich.
- Das iframe wird erst für einen bestätigten Mitgliedsstart geladen. URL bleibt
  `game/survival-v117.html?build=account-v117-20261009`; Bridge unverändert.
- Sämtliche neuen Texte zentral in `translations.js`, inklusive Metadaten.
  Kein neues Auth-, Session-, Backend- oder Übersetzungssystem.

## Historischer Gastzugang / Veröffentlichungsblocker – vor der v118-Freigabe
Der gelieferte v117-Client erlaubt noch zehn Minuten. Der neue Text
„2 MINUTEN ALS GAST TESTEN“ ist vorbereitet, der Button deshalb bewusst deaktiviert.
`guestTrialReady = false` in `game-entry.js`. Es gibt aktuell keinen Gast-
Launchhandler im neuen Einstieg. Keinen Flag ohne passenden Buildnachweis ändern.

Vor jeder späteren Veröffentlichung:
1. finale öffentliche Dedicated-/Transportabnahme aus dem getrennten Auftrag
   bestätigen; die erreichbare WebSocket-Probe ersetzt diese nicht;
2. gelieferten Client mit technisch 120000 ms Gastdauer bestätigen;
3. auch die Umstellung des produktiven Dedicated auf zwei Minuten bestätigen;
4. Gaststart dann gezielt aktivieren und den echten Zwei-Minuten-Ablauf prüfen;
5. ausdrückliche Freigabe für Commit/Push einholen.

### Historische Fortsetzung / v118-Handoff – vor der produktiven Freigabe

Der technische Zwei-Minuten-Kandidat liegt inzwischen vor. Read-only gelesen:
`C:/Users/sebbo/OneDrive/Dokumente/Spiel/zh-survival/GAME_GUEST_V118_HANDOFF.md`
und `C:/ZHServer-Builds/v118/build-manifest.json`.

- Manifest: Version v118, Basis v117, `guest_duration_ms = 120000`.
  Alle elf Auslieferungsdateien am 11.10.2026 vorhanden, Größen und SHA256
  manifestgleich; jede Datei unter 100 MiB. Kein neuer Export erstellt.
- Der Spiel-Handoff dokumentiert 119 erfolgreiche isolierte Assertions und den
  exportierten Zwei-Minuten-Client. Diese Nachweise sind keine produktive
  Laptop-/Mehrclient-Abnahme.
- Der Handoff bestätigt ausdrücklich **noch keinen produktiven v118-Rollout**.
  Der Laptop-Dedicated muss die neue `account_guest_policy.gd` tatsächlich laden;
  ein synchronisiertes Quellfile allein bestätigt die aktive Serverpolicy nicht.
- Daher unverändert: `guestTrialReady = false`, kein Gast-Launchhandler, iframe
  weiter auf v117. Keine Dateien nach `game/` kopiert und keinen Server bedient.
- Diese reine Handoffprüfung änderte den damals vorhandenen Seitenaufbau nicht.
  Der anschließende Nutzerauftrag lehnt dessen Bildkachelbereich ab. Die echte
  HTML-/CSS-Korrektur und neue sichtbare Abnahme stehen im folgenden Abschnitt;
  ältere Layoutberichte mit drei Bildkacheln belegen nicht den aktuellen Stand.

Nächste getrennte Teilphase erst mit bestätigter produktiver Zwei-Minuten-
Dedicated-Policy und passender öffentlicher Verbindung: v118 nach ausdrücklichem
Homepage-Integrationsauftrag übernehmen, Gaststart ergänzen und den echten
Zwei-Minuten-Ablauf prüfen. Veröffentlichung braucht weiterhin eine ausdrückliche
Commit-/Push-Freigabe. Die reine Handoffprüfung änderte nur beide Checkpoints.

**STOPP: Visuelle Spielseite fertig; v118 vorhanden, produktive Dedicated-
Bestätigung und anschließende Gastintegration noch offen.** Kein Commit, Push,
Deployment oder Webexport.

## Sichtbare Korrektur: Entdecken-Bereich entfernt – 11.10.2026

- Tatsächlich `game.html` und `assets/css/game-entry.css` geändert. Ganzer
  Entdecken-Bereich einschließlich beider Überschriften, aller drei Bildkacheln
  und seiner Desktop-/Mobile-Styles entfernt. Keine Ersatzsektion eingefügt.
- Alle Inhalts-Icons/Pfeildekoration und Badge-Boxen entfernt. Funktionale
  Elemente im gemeinsamen Header/Footer bleiben erhalten. Konzeptgrafik ehrlich
  als einfache Bildunterschrift gekennzeichnet; Alpha ebenfalls einfacher Text.
- Vier Kernfeatures und drei Entwicklungspunkte sind schlanke Textgruppen;
  vorhandener Communityinhalt ohne zusätzliche dekorative Kartenfläche.
- Neue echte Browserprüfung auf Port 5500: Mitglied DE/EN bei
  360/390/768/1280/1440 px und Gast DE/EN bei 390/1440 px, insgesamt 14 Zustände.
  DOM-Nachweis in jedem Zustand: 0 Entdecken-/Bildkachel-Elemente, 0 Inhalts-Icons,
  0 Badge-Boxen, nur eine Hauptgrafik und 0 horizontale Überläufe.
- Desktop-Hero und Gesamtseite, Mobile-Hero und Gesamtseite sowie Tablet wirklich
  als neue Screenshots aufgenommen und visuell angesehen. Hauptgrafik bei
  Desktop 1440 px von ungefähr 633 auf 800 px verbreitert; Tablet jetzt 693 px.
  Unbeschnittenes Bild, lesbare Überschriften, Touch-Buttons und Status.
- Zentrale bestehende cHa-Sitzung erkannt; Gastanmeldung sichtbar und Gastbutton
  weiter deaktiviert. Sprachwechsel ohne Reload, EN nach Reload sowie mobiles
  Menü öffnen/schließen einschließlich Escape geprüft. Keine Zugangsdaten oder
  Sitzung kopiert, kein neuer Account und keine erneute Spielwelt-/Auth-Abnahme.
- Serverprobe zeigte OFFLINE, Mitgliedsstart deshalb korrekt deaktiviert. Keine
  Server-/Transportreparatur aus dem Designauftrag ableiten. Beide bestehenden
  Footer-Statistikgruppen laden; Header, Footer und kompletter Spielrahmen
  bytegleich zum Ausgang dieser Korrektur. Kein JS-Verhalten geändert.
- 0 erfasste Browser-JS-/Consolefehler und 0 Warnungen. HTML ausgeglichen,
  keine doppelten IDs und keine fehlenden lokalen Links. JS-Syntax und
  `git diff --check` sauber. Sonstigen Working Tree vollständig erhalten.
- Neue Nachweise außerhalb Git:
  `C:/Users/sebbo/.codex/visualizations/2026/09/30/01a0f137-f3f5-7bc0-b080-7b451ea65ff0/game-landing-clean-20261011`
  enthält Desktop-/Mobile-/Tablet-Screenshots, 14 Browserzustände und
  Struktur-/Erhaltungsnachweis. Alte Nachweise dienen nur als Verlauf/Vergleich.

**STOPP nach sichtbarer Abnahme.** v118 nur vorbereitet; kein Buildwechsel,
kein Commit, Push, Deployment, Webexport oder Dedicated-Eingriff.

## Erhaltene Nachweise der vorherigen Teilphase
Die folgenden Prüfungen gehören zum vorherigen Aufbau. Unveränderte Auth-,
Build-, Detail- und Zustandslogik bleibt dadurch belegt; die neue visuelle
Abnahme ist separat darunter dokumentiert.
- Browser auf `http://127.0.0.1:5500/`: Gastansicht DE/EN, Sprachwechsel,
  Reload/Sprachspeicherung, Haupt-/Detailverlinkung, alte Entwicklungslinks,
  Browser-Zurück/Vorwärts, Mobilmenü und aktive SPIEL-Navigation bestanden.
- Desktop 1280/1440, Tablet 768, Mobile 390/360: keine beobachteten horizontalen
  Überläufe; Text/Buttons/Status und Detailseite lesbar. Beide Statistikgruppen
  mit echten bestehenden Werten geladen. Keine neuen Zähllogiken.
- 0 erfasste Browser-JS-/Console-Fehler im bisher geprüften Zustand.
  Sieben lokale HTML/CSS/JS/Bild-Dateien mit HTTP 200 und passenden MIME-Typen.
- Neun isolierte Zustandsprüfungen bestanden: Gast gesperrt, Mitgliedsstart,
  DE/EN-Bindungen, fehlender Name, Identitätsfehler, Offline/Retry, Timeout,
  Accountwechsel während Startprüfung und unveränderte v117-URL.
  Diese Fixtures sind keine echte Browser-Anmeldung.
- HTML-Struktur beider Seiten ausgeglichen, keine doppelten IDs, sämtliche vier
  Detailziele vorhanden, alle 197 Changelogpunkte unverändert.
- JS-Syntaxprüfung und `git diff --check` sauber.
- Alle elf v117-Dateien weiterhin manifestgleich, Auth-Bridge SHA256 unverändert.
  Alle 19 fremden Wiki-Prüfartefakte weiterhin bytegleich; keine fremden Änderungen.

## Frühere echte Mitgliedsabnahme – unveränderte Auth-/Buildlogik
Die Anmeldung und Wiederanmeldung wurden vom Nutzer mit dem bestehenden Account
auf `http://127.0.0.1:5500/account/` durchgeführt. Keine Live-Sitzung kopiert,
keine Zugangsdaten ausgelesen oder gespeichert, keine Accountänderung.

- Hero und unterer Einstieg: cHa und Speicherhinweis korrekt in DE/EN;
  öffentliche Spielseite ohne E-Mail, Gastoptionen bei Mitgliedern verborgen.
- Reload erhält die zentrale Sitzung. Profil erreichbar; private E-Mail bleibt
  im eigenen Profil. Rückweg über den vorhandenen Profil-Link funktioniert.
- Echter Start lädt ausschließlich das vorhandene v117-iframe. Die Lobby zeigt
  „Eingeloggt als: cHa“ und den geladenen Spielstand ohne zweite Anmeldung.
- Zentrale Abmeldung schaltet beide Einstiege auf die Gastansicht zurück;
  Mitgliedsbuttons und Speicherhinweise verschwinden, Spielrahmen ausgeblendet.
- Danach echte Wiederanmeldung und erneuter Start: cHa und geladener Spielstand
  wieder in der Lobby bestätigt. Kein erneuter Spielweltbeitritt oder Dedicated-
  Persistence-Test; der unveränderte Build/Bridge-Vertrag ist separat geprüft.
- Mitgliedsansicht zusätzlich bei 1440, 768 und 390 Pixeln geprüft, Mobile DE/EN.
  Geladener Spielrahmen bei 390 Pixeln ohne horizontalen Überlauf; Aktivierung
  und Rückkehr in den Scroll-Modus funktionieren. Browsergröße zurückgesetzt.
- Vollbild-Button und Wiki-Link im geladenen Rahmen an vorhandene Farben
  angeglichen. Verfügbarkeitshinweis für Gäste wird Mitgliedern nicht vorgelesen.
- 0 erfasste Browser-JS-/Console-Fehler und 0 Warnungen in dieser Abnahme.
- Lokale Teilphase abgeschlossen. Vor Veröffentlichung gelten weiterhin die
  oben genannten Freigabegrenzen. STOPP; kein Commit, Push oder Webexport.

## Frühere visuelle Browserabnahme – 10.10.2026, vor der aktuellen Korrektur
- Tatsächliche lokale Browserprüfung auf Port 5500. Gastansicht auf `localhost`,
  Mitgliedsansicht mit der bestehenden Sitzung auf `127.0.0.1`; keine Sitzung
  kopiert, keine Zugangsdaten ausgelesen und kein neuer Account angelegt.
- Gast DE/EN bei 360, 390, 768, 1280 und 1440 px. Mitglied EN bei allen fünf
  Breiten sowie DE bei 390/1440 px. Insgesamt 17 unterschiedliche geprüfte
  Layoutzustände: 0 horizontale Überläufe, vier Features, drei Bildflächen,
  drei Entwicklungskarten, genau ein Einstieg und genau ein Serverstatus.
- Desktop- und Mobile-Hero/Gesamtseiten tatsächlich als Screenshots angesehen;
  Bildführung, Hierarchie, Lesbarkeit und Größen kritisch visuell geprüft.
  Der neue Stand ist eine bildbetonte Spiel-Landingpage.
- DE/EN ohne Reload, Sprache nach Reload/Seitenwechsel, historische Zusatzinfo,
  Detailziele, Browser-Zurück/Vorwärts und Mobilmenü einschließlich Escape geprüft.
- Vorhandenes Mitglied cHa, Speicherhinweis und ausgeblendete Gastoptionen
  bestätigt. Reload erhält die Sitzung. Echter Hero-Start lädt den unveränderten
  v117-Client; Lobby zeigt cHa und geladenen Spielstand ohne zweite Anmeldung.
  Kein Spielweltbeitritt und keine erneute Dedicated-/Persistence-Abnahme.
- Beide globalen Footer-Statistikgruppen mit bestehenden echten Werten geladen.
  Header, Footer und iframe-Markup bytegleich zum Ausgang dieser visuellen Phase.
- 0 erfasste Browser-JS-/Consolefehler und 0 Warnungen. Zehn bekannte lokale
  HTML/CSS/JS/Bild-Dateien: HTTP 200 und passende MIME-Typen.
- HTML ausgeglichen, keine doppelten IDs, keine kaputten lokalen Links/Anker.
  Alle 36 neuen Sprachschlüssel besitzen DE/EN; übrige Übersetzungen erhalten.
  JS-Syntax und `git diff --check` einschließlich neuer Dateien sauber.
- Alle 33 geschützten Dateien SHA256-unverändert: elf Builddateien, Auth-Bridge,
  Einstiegsscript, Detailseite und 19 vorhandene fremde Wiki-Prüfartefakte.
  Keine Änderungen an Spielprojekt, Dedicated, U01 oder Supabase.
- STOPP. Kein Commit, Push, Deployment oder Webexport. Gaststart bleibt gesperrt.

## Nachweise außerhalb Git
Neue visuelle Phase:
`C:/Users/sebbo/.codex/visualizations/2026/09/30/01a0f137-f3f5-7bc0-b080-7b451ea65ff0/game-landing-visual-20261010`
enthält Ausgangsdateien, Hashbaseline, Struktur-/Sprach-/HTTP-/Browserberichte
sowie Desktop-, Tablet- und Mobile-Screenshots für Gast/Mitglied und die Lobby.
Nicht ins Repository kopieren oder committen.

Vorherige Teilphase:
`C:/Users/sebbo/.codex/visualizations/2026/09/30/01a0f137-f3f5-7bc0-b080-7b451ea65ff0/game-entry-local-20261010`
enthält Ausgangsstand, Struktur-/Zustands-/Erhaltungsprüfung, HTTP-Ergebnisse und
Screenshots. Nicht in das Repository kopieren oder committen.

## Konsolidierter UI-Abschluss – 11.10.2026

- Aktuellen v118-/Hero-/Feature-/Alpha-Stand vollständig übernommen. Keine
  Wiederholung der Buildintegration, keine Änderungen an Auth-Bridge,
  Spielquellen, Dedicated, Gasttimer, Supabase oder Accounts.
- Zwei deutlichere Statusanzeigen in Hero und Spielfenster verwenden dieselbe
  vorhandene Probe/Binder. Echter ONLINE-Status und zentrale cHa-Sitzung erneut
  sichtbar bestätigt. ONLINE grün, OFFLINE gedämpft rot, Prüfung neutral.
- Kompakte aktuelle Abstimmung direkt unter „Deine Ideen zählen“. Der bestehende
  Renderer bleibt bytegleich. Initialisierung lediglich vor den Entry-Return
  gezogen und Script einmal ergänzt. Detailseite nur gemeinsame Cachekennung
  geändert; gesamte Abstimmung, Roadmap, Changelog und Archiv erhalten.
- Echte Daten read-only geprüft: weapons 1, weather 0, hordes 2, vehicles 2;
  insgesamt 5, Prozentwerte 20/0/40/40. Haupt- und Detailseite zeigen dieselben
  Daten. Keine produktive Teststimme abgegeben. Unveränderten Renderer mit
  isolierter Offline-DOM-Fixture ausgeführt: `vote_for_feature`, frische
  Ergebnisabfrage, gespeicherte Wahl, Bestätigung und Wiederholschutz bestanden.
  Dieser Nachweis ist kein zusätzlicher produktiver Abstimmungsdatensatz.
- Gemeinsame Navigation ohne Community/Bugs: Start, SPIEL, Wiki, Forum, Galerie,
  Geschichte, Timeline, Gästebuch. Im bestehenden zentralen i18n-Initializer;
  Wiki-Datei/Inhalt unverändert. Footer- und Community-/Besucherlogik erhalten.
- Startseite nur mittlere Survival-Karte durch CSS-Goldrahmen/Lichtreflex
  hervorgehoben. Die vorherige Entfernung des Entwicklungsblocks und Alpha-
  Texte bleiben erhalten; beide äußeren Karten unangetastet.
- Startseite/Spielseite jeweils DE und EN bei 1440, 1280, 768, 390 und 360 px
  tatsächlich geprüft: 0 horizontale Seiten-/Inhaltsüberläufe. Hero oben,
  Spielfenster bei Desktop ca. 1311/1164 px breit. Mobilmenü öffnen/Escape,
  Wiki/Galerie/Forum-Navigation, Sprache nach Reload und Details/Zurück geprüft.
- Reduced-Motion-Regel und laufende 9-s-Animation im Browser-CSS geprüft.
  Betriebssystem-Präferenz nicht verändert; kein behaupteter OS-Emulationstest.
- Zusätzlicher nativer HTTP-Nachtest der sechs UI-Dateien/öffentlichen Votes
  konnte nach Berücksichtigung der Live-Server-Injektion wegen des Nutzungslimits
  der automatischen Freigabeprüfung nicht ausgeführt werden. Vorhandene elf
  v118-HTTP-200-/MIME- und WSS-101-Nachweise gelten für den unveränderten Build;
  neue UI/Daten in der tatsächlichen lokalen Browseransicht geprüft.
- Screenshots/Reports außerhalb Git:
  `C:/Users/sebbo/.codex/visualizations/2026/09/30/01a0f137-f3f5-7bc0-b080-7b451ea65ff0/homepage-consolidated-20261011`
  und benachbart `game-inline-vote-20261011`. Testartefakte nicht committen.
- Abschluss: Der echte v118-Client zeigt nach zentralem Start cHa und den
  geladenen Spielstand ohne zweiten Login. Desktop-iframe 1309 x 736 px.
  Nur CSS-Scrollabstand auf 270 px (Desktop) / 110 px (kleine Breiten) angepasst,
  damit die Statusleiste beim Start nicht hinter dem festen Header verschwindet.
  Echt gemessen: Desktop-Leiste ab 183 px bei Headerende 169 px; mobil ab 30 px,
  Frame ab 110 px. Kein horizontaler Overflow, keine Änderung an Client/Bridge.
- Abschließend 0 erfasste Browser-JS-/Consolefehler und 0 Warnungen.
  Erhaltungsprüfung: 55 vorhandene Dateien bytegleich; elf zuvor entfernte
  v117-Dateien bleiben entfernt. Ausschließlich acht vorgesehene
  UI-/Checkpoint-Dateien dieser Teilphase geändert.

- Letzte Browseraufnahme der echten Abstimmung: sechs Stimmen, Prozentwerte
  17/0/50/33; zuvor fünf Stimmen bei der lesenden Backendprüfung. Die laufenden
  Produktivwerte werden erneut geladen. Keine produktive Teststimme abgegeben.
- `git diff --check` und die Prüfung der neuen Textdateien sauber.

- Kein Commit, Push, Deployment oder Webexport. STOPP zur visuellen Abnahme.

## Veröffentlichung freigegeben – 11.10.2026

Visuelle Abnahme durch Sebastian erteilt. Der aktuelle lokale Homepage-/v118-
Stand darf gezielt auf origin/main veröffentlicht werden; kein neuer Webexport.
Die zuvor blockierte native HTTP-Prüfung ist nachgeholt: sechs UI-Dateien plus
Startseite/i18n/Goldrahmen/Einstiegsscript HTTP 200, passende MIME-Typen und
lokaler Inhalt bestätigt. Öffentliche Abstimmungsdaten lesend erreichbar.
Alle elf v118-Dateien SHA256-identisch zum freigegebenen Quellbuild, unter
100 MiB pro Datei. Keine alten v117-Laufzeitdateien oder aktiven Referenzen.

Für alle 13 gemeinsamen Header dieselbe i18n-Cachekennung gesetzt, damit die
freigegebene Navigation beim Release auch nach früheren Seitenbesuchen lädt.
Keine weiteren Inhalts-/Auth-/Backendänderungen. Fremde 19 Wiki-Prüfartefakte
bleiben uncommittet erhalten. Bestehendes Pages-Deployment nach Push prüfen.
Live-Account-/Client-, HTTP-/MIME-/SHA256-/WebSocket- und Responsive-Nachweise:
`C:/Users/sebbo/.codex/visualizations/2026/09/30/01a0f137-f3f5-7bc0-b080-7b451ea65ff0/homepage-v118-release-20261011`.
Eine vollständige Live-Abnahme wird vor ihrem tatsächlichen Abschluss nicht
behauptet. Dedicated/U01/F01/Supabase/Cloudflare/Spielprojekt unverändert.
