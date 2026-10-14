# Community Pulse + Forum-Aufrufe – Fortsetzung

## Produktivfreigabe – 14.10.2026

Der Nutzer hat den aktuellen Pulse-/Hero-/Forum-Stand ausdrücklich zum Commit,
Push auf `origin/main` und bestehenden GitHub-Pages-Deployment freigegeben.
Release: Community Pulse einschließlich seiner Verwaltungsseite, responsive
Hero-/Kartenhöhe, Goldfäden, Forum-CTA, Arma-Info, Entfernung der alten sichtbaren
Game-Umfrage, Forum-Views, Forum-Polish und zugehörige Sprach-/Dokumentationsdaten.
Keine weitere Layoutänderung und keine erneute produktive Migration.
Die separat lokale Adminzentralisierung/Account-/Profilanbindung gehört nicht
zu dieser Release-Liste; ihre Änderungen und fremde Wiki-/GAME-/Prüfdateien
bleiben vollständig im Working Tree erhalten. Gemischte Katalog-/Checkpoint-
Dateien nur anteilig stagen. Live-Abnahme erst nach erfolgreichem Deployment;
Commit, Run und Prüfnachweise außerhalb Git unter `homepage-forum-release-20261014`.

13.10.2026: neuer lokaler Arbeitsstand, Release-Basis
`49b51da2411ce85059894e808c269b47411dbe26` unverändert.

## Aktueller Stand 14.10.2026 – viewportabhängiger Startseiten-Hero

**Der feste 700-px-Kandidat wurde vom Nutzer abgelehnt und ist ersetzt.
Der responsive Stand ist visuell freigegeben; Release gemäß Abschnitt oben.**

- `index.html`: kleine gemeinsame `.era-primary`-Hülle um Überschrift und
  Kartengruppe, CSS-Cachekennung `20261014-pulse-viewport1`. Bestehende Inhalte,
  IDs, Links, Abstimmungslogik und kompletter Footer erhalten.
- Desktop über 1100 px: gemeinsamer CSS-Grid-Bereich mit
  `calc(100dvh - var(--era-top) - var(--era-bottom))`, `vh`-Fallback und
  `clamp()`-Abständen. Die tatsächliche Überschriftenhöhe wird als erste
  Auto-Zeile abgezogen; alle drei Karten füllen dieselbe zweite Zeile.
  Obergrenze des gemeinsamen Bereichs aus ca. 700 px Kartenraum plus
  Überschrift/Abstand. Keine feste Desktop-Kartenhöhe mehr.
- Bildhöhe, Schriftgrößen, Innenabstände und Pulse-Zeilen orientieren sich
  über `cqh` an der verfügbaren Höhe der Kartengruppe. Untere CTAs bleiben
  innerhalb der Karten; zusätzlicher Abstand verhindert eine Überdeckung
  durch das bereits vorhandene Funkgerät. Frage, Optionen und Hinweise
  können bei Bedarf in ihrem eigenen Bereich scrollen, nicht die ganze Karte.
  Antwortflächen bleiben auch bei hohen Displays kompakt, maximal 72 px.
- Desktopmessungen, jeweils alle drei Karten bündig und vollständig im
  tatsächlichen Viewport, jeweils DE/EN und vier echte Frage-/Ergebniszustände:
  1280×720: 391,44 px Höhe / unterer Rand 656 px;
  1280×800: 464,92 px / 736 px;
  1440×900: 547,78 px / 836 px;
  1440×1000: 626,64 px / 936 px;
  1920×1080: 694,33 px / 1010 px.
- Tablet 768×1024: alle drei gestapelten Karten 640 px. Mobile 390×844 und
  360×800: vorhandene natürliche, gestapelte Darstellung erhalten.
  Insgesamt 64 Frage-/Ergebnis-/Sprachzustände geprüft; nach Begrenzung der
  Antwortflächen zusätzlich 16 gezielte Kontrollen auf Desktop/Tablet.
  Keine neuen Stimmen oder Umfragen gespeichert.
- Desktop/Tablet: Navigation und Forum-Link bleiben in allen Zuständen an
  derselben Position. Echter automatischer 10-s-Wechsel bei 1280×720:
  Karten, Navigation, Forum-Link und Arma-Beginn jeweils 0 px Verschiebung.
  Die originalen Goldfäden/Animationen bleiben unverändert; ihre Höhe liegt
  proportional bei 44 % der jeweiligen Kartengruppe, ohne 700-px-Bezug.
  Auf kleineren Breiten weiterhin ausgeblendet; Reduced-Motion-Regel erhalten.
- Kein horizontaler oder äußerer Kartenoverflow, keine überdeckte
  Hero-Überschrift, alle CTAs erreichbar, Arma beginnt nach den Karten.
  Relevante Browser-JS-/Consolefehler 0, Warnungen 0. Native HTTP-Nachprüfung:
  aktuelles HTML und CSS HTTP 200 mit passenden MIME-Typen.
- 52 andere Ausgangsdateien SHA-256-identisch; übriges Homepage-DOM nach
  Entfernen der neuen Layout-Hülle identisch. Arma- und Goldfaden-CSS identisch.
  HEAD/Index unverändert; `git diff --check` sauber. Nur `index.html`,
  `assets/css/community-pulse.css` und dieser Checkpoint in dieser Korrektur.
  Keine Backend-, Supabase-, Forumlogik-, GAME-, Wiki- oder Dedicated-Änderung.

Aktuelle echte Viewport-Screenshots und Nachweise außerhalb Git:
`C:/Users/sebbo/.codex/visualizations/2026/09/30/01a0f137-f3f5-7bc0-b080-7b451ea65ff0/home-viewport-height-20261014`
mit `desktop-1440x900-de.jpg`, `desktop-1280x720-de.jpg`,
`desktop-1920x1080-de.jpg`, `mobile-390-de.jpg`, `responsive-validation.json`,
`final-option-size-validation.json`, `automatic-change-validation.json`,
`layout-summary.json`, `http-validation.json` und `scope-validation.json`.
Kein Commit, Push, Deployment oder Webexport. **STOPP zur visuellen Abnahme.**

## Lokal umgesetzt

Vorheriger Kandidat 14.10.2026: Forum-CTA umgesetzt; feste Kartenhöhe unten
historisch dokumentiert, durch die aktuelle Korrektur oben ersetzt:

- Unter Umfrage/Ergebnisnavigation und Fragenpunkten ein dezenter, klarer
  Forum-Link: DE „Zum Forum →“, EN „Visit the forum →“. Bestehender zentraler
  Katalog/Sprachwechsel; keine neue JS-Logik. Link bleibt auch ohne aktive
  Umfrage sichtbar. Mobile volle Inhaltsbreite, gemeinsamer Hover-/Fokuszustand
  mit sichtbarer 2-px-Tastaturkontur. Ziel `/forum/`, Sprache und Browser-Zurück geprüft.
- Desktop über 1100 px: alle drei Hauptkarten exakt 700 px. Pulse ab 601 px
  ebenfalls fest 700 px; Mobile bis 600 px behält natürliche Höhe.
  Reservierte CSS-Grid-Zeilen für Kopf, Frage, Optionen/Ergebnisse, Hinweise,
  Ergebnisaktion, Navigation, Fragenpunkte und Forum-Link. Vier Antwortplätze
  im gleichen Bereich für beide Zustände; lange Fragen können innerhalb ihres
  reservierten Bereichs scrollen, statt die Karte zu vergrößern.
  Die bisherigen Hinweise wurden nur mit einer Layout-Hülle zusammengefasst;
  vorhandene IDs, Live-Regionen, Ereignisse und Abstimmungslogik bleiben erhalten.
- Echte vorhandene Umfragen genutzt: eine mit bereits bestehender eigener
  Stimme/Ergebnis und eine bislang unbeantwortete. Fragewechsel, Ergebnisse
  ansehen und eigene Auswahlansicht geprüft. Keine neue Stimme abgegeben,
  keine Umfrage oder Antwortoption angelegt/geändert.
- 40 Zustände auf Port 5500: 1440/1280/768/390/360 px jeweils DE/EN und vier
  Frage-/Ergebniszustände. Tatsächliche Viewportbreite jeweils bestätigt.
  Desktop/Tablet: Karten-, Navigations-, CTA- und Arma-Position jeweils 0 px
  Zustandsverschiebung. Echter automatischer 10-s-Wechsel ebenfalls ohne
  Verschiebung. Goldfäden auf Desktop weiter über dem tatsächlichen Kartenspalt
  und innerhalb der Kartenhöhe, auf kleineren Breiten wie bisher ausgeblendet.
- Horizontale Überläufe 0; relevante Browser-JS-/Consolefehler 0, Warnungen 0.
  Native HTTP-Prüfung: HTML/CSS/Übersetzungen 200 mit passenden MIME-Typen;
  CSS/JS exakt aktueller Dateiinhalt, HTML nach Entfernen des bestätigten
  Live-Server-Reloadscripts gleich. Übersetzungs-JS syntaktisch gültig.
- Scope: 50 geschützte Ausgangsdateien SHA-256-identisch. Gesamtes übriges
  Homepage-DOM nach Herausrechnen des CTAs und der Layout-Hülle identisch;
  Katalog nur um einen Text ergänzt, bestehende Styles/Lichtfäden erhalten.
  HEAD/Index unverändert. Nur `index.html`, `assets/css/community-pulse.css`,
  `assets/js/translations.js` und dieser Checkpoint für diese beiden Zusätze.
  Keine Backend-/Supabase-, GAME-, Wiki-, Dedicated- oder Forumänderung.

Aktuelle Nachweise und echte Browserbilder außerhalb Git:
`C:/Users/sebbo/.codex/visualizations/2026/09/30/01a0f137-f3f5-7bc0-b080-7b451ea65ff0/pulse-stable-layout-20261014`
mit `responsive-validation.json`, `automatic-change-validation.json`,
`link-focus-validation.json`, `http-validation.json`, `scope-validation.json`,
`desktop-results-de.jpg`, `desktop-unanswered-de.jpg` und `mobile-home-de.jpg`.
Kein Commit, Push, Deployment oder Webexport. STOPP zur visuellen Abnahme.

Finalisierung 14.10.2026, nach der Lichtfaden-Korrektur:

- Hero-Untertext vollständig entfernt; `EST. 2013` und `WILLKOMMEN ZURÜCK.`
  bleiben. Abstand zwischen Überschrift und Karten durchgehend 28 px.
- Alle drei Hauptkarten und ihre vorhandenen Lichtfäden unverändert erhalten.
  Survival bleibt Hauptfokus. Keine aktive Umfrage vorhanden; Pulse zeigt den
  ehrlichen leeren Zustand, keine Test-/Demoinhalte hinzugefügt.
- Arma als eigene schmale, dezent umrandete Infofläche über die gesamte
  Kartenbreite: Desktop Titel links, Text mittig, kompakter CTA rechts;
  bis 900 px gestapelt mit CTA unter dem Text. Text und `arma/`-Link erhalten.
- Nur auf `game.html` den alten sichtbaren Abstimmungsblock samt dortiger
  `community-voting.js`-Einbindung entfernt. Forum-Buttons, Client, Alpha-Tabs,
  Footer und übriger Seitenaufbau unverändert. Kein Eingriff in `game/`.
- Gemeinsame Datenquelle geprüft: Pulse verwendet weiter
  `public.community_votes` als Optionstabelle, ergänzt um `pulse_poll_id`.
  Diese Tabelle, Stimmen, RPCs und Policies bleiben erhalten. Die Detailseite
  `game-development.html` verwendet die Legacy-Abstimmung weiterhin; ihr
  `vote_for_feature`-RPC behandelt die alten Optionen ohne `pulse_poll_id`.
  Der Guard in `community-voting.js` beendet sich ohne `#votingOptions`.
  Keine Backendstruktur oder gespeicherten Stimmen für diese Bereinigung verändert.
- Spätere Bereinigungskandidaten: ungenutzte `.landing-current-vote`-Styles,
  die auf der Startseite bereits inaktive Legacy-Scripteinbindung sowie nach
  gesonderter Prüfung aller Detailseiten die Legacy-RPC/-Optionen. Erst mit
  separater Freigabe; die gemeinsame `community_votes`-Tabelle darf dabei nicht
  als veraltet gelöscht werden.

Gezielte Prüfung auf dem bestehenden Live-Server `127.0.0.1:5500`:
1440/1280/768/390/360 px jeweils DE und EN, keine horizontalen Überläufe,
gleich hohe Desktopkarten, keine Hero-Leerfläche. Arma-Link tatsächlich geöffnet
und Browser-Zurück geprüft. Spielseite DE/EN: alter Abstimmungsblock/-Script
fehlt, bestehende Forumlinks, Client, Alpha-Bereich und Footer vorhanden.
Browserlogs 0 Fehler / 0 Warnungen. Vorherige Hover-/Fokus-/Impulsprüfung
übernommen, weil Lichtfäden und ihre Animation bytegleich erhalten sind;
Reduced-Motion-Regel im CSS geprüft, Betriebssystempräferenz nicht umgestellt.
Scopeprüfung: 55 geschützte Ausgangsdateien SHA-256-identisch; alle drei
Hauptkarten und Lichtfäden unverändert, restliches Homepage-/Spielseiten-DOM
nach Herausrechnen der beauftragten Änderungen identisch. HEAD und Index
unverändert, `git diff --check` sauber.

Aktuelle echte Browser-Screenshots und kompakte Prüfergebnisse außerhalb Git:
`C:/Users/sebbo/.codex/visualizations/2026/09/30/01a0f137-f3f5-7bc0-b080-7b451ea65ff0/home-final-20261014`
mit `desktop-de.png`, `mobile-de.png`, `responsive-validation.json`,
`game-validation.json` und `scope-validation.json`.
Nur `index.html`, `assets/css/community-pulse.css`, `game.html` und dieser
Checkpoint für diese Finalisierung geändert. Fremde lokale Wiki-/Admin-/
Forumänderungen vollständig erhalten. Kein Commit, Push, Deployment oder
Webexport. STOPP zur visuellen Abnahme.

Visuelle Korrektur 14.10.2026: bisherigen 24-px-Verbinder durch zwei feine,
geschwungene goldene SVG-Fäden zwischen Survival und Pulse ersetzt. An der
zweiten Gridspalte ausgerichtet, über den 24-px-Abstand und jeweils nur 23 px
in die Kartenränder; Texte bleiben frei. Gelegentlicher langsamer Lichtimpuls
nach rechts im 18-s-Zyklus. Hover auf beiden Karten und Tastaturfokus verstärken
die Verbindung. Bis 1100 px ausgeblendet; Reduced Motion zeigt nur statische
Fäden, ohne Impuls oder Übergangsanimation. Keine neue JS-/Backendlogik.
Desktop 1440/1280 DE und Mobile 390 DE/EN lokal geprüft, kein Overflow, Browserlogs
ohne Fehler/Warnungen. Reduced-Motion-Regel im CSS geprüft. Survival-Karte und
übrige Startseite unverändert, alle 45 anderen Ausgangsdateien SHA-256-identisch.
Aktuelle Screenshots/Nachweise außerhalb Git: `pulse-connection-20261014` im
bestehenden Visualisierungsordner. Nur `index.html`, `community-pulse.css` und
dieser Checkpoint geändert. Weiterhin kein Commit, Push oder Deployment.

- Rechte Startseitenkarte: Community Pulse, genau eine Frage, manuelles Blättern
  und kleine Fragenpunkte. Automatischer Wechsel nach 10 s; Pause bei Hover,
  Fokus, Touch, Stimmabgabe, offenen Ergebnissen, verborgenem Tab und Reduced Motion.
- Echte Ergebnisse/Prozente, Gast-Anmeldehinweis, Antwortwechsel ohne zusätzliche
  Stimme. Zwei bis vier dynamische DE/EN-Optionen, kein hart codierter Nutzername.
- Arma als schmale sekundäre Infofläche mit vorhandenem Link unter den Karten. Damals-
  und Survival-Karte, übriger Inhalt, gemeinsame Navigation/Footer unverändert.
- Neue Adminseite `/admin/community-pulse.html`: vorhandener zentraler Rollen-
  guard, DE/EN, vollständiger globaler Footer, Frage/Optionen/Sichtbarkeit/
  Reihenfolge/Schließen/Öffnen/Archivierung/Ergebnisse.
- Forum: eigene Aufrufspalte und dezente Threadzeile. Nur tatsächlich geöffneter
  Thread zählt; 24-h-Deduplizierung serverseitig vorbereitet. Keine Änderung an
  Kategorien → Themen → Thread → Antworten oder Top-5-Aktivitätssortierung.

## Freigegebene Migration und lokale Aktivierung abgeschlossen

Migration nach ausdrücklicher Nutzerfreigabe erfolgreich im bestehenden Projekt
`zhserver` angewendet. Registry-Version `20261013164013`, Name
`homepage_community_pulse_forum_views`. **Nicht erneut anwenden.**
`assets/js/community-features.js`: **pulse=true, forumViews=true**.
Aktivierungs-Cachekennung auf Startseite, Forum und Adminseite:
`20261013-pulse-active1`. Homepage weiterhin nur lokal, kein Release.

Migration und exakter Rechte-/Datenumfang:
`COMMUNITY_PULSE_VIEWS_REVIEW.md` sowie
`20261013105509_homepage_community_pulse_forum_views.sql`.
Daten erhaltende funktionale Deaktivierung:
`community_pulse_forum_views_disable.sql`.

13 zusätzliche echte Backendprüfungen in vollständig zurückgerollter Transaktion
bestanden; bestehende Auth-UUIDs genutzt, keine Accounts/Passwörter geändert.
Alte 6 Stimmen erhalten; Themen/Beiträge/Profile/Rollen per JSON-Hash identisch.
Echte lokale cHa-Adminsession und Formular/DE/EN geprüft. Keine produktive
Testfrage/-stimme gespeichert. Die erste reale Umfrage muss bewusst im Adminbereich
angelegt werden; derzeit ist die echte Liste leer und zeigt den ehrlichen Hinweis.

Echter Thread-Aufruf: 0 vor Öffnung, danach 1; Reload und zweiter Tab weiterhin 1.
Dieser reale Aufruf und seine zwei privaten Aliasfenster sind persistent.
Views verändern keine Aktivitätsdaten. Weitere Historie nicht rekonstruiert.
Kein Deployment ohne gesonderten Auftrag. STOPP nach lokaler Abnahme.

## Vorhandene Nachweise wiederverwenden

43 SQL-, 22 UI- und 10 Rücknahmeprüfungen im isolierten Modell bestanden.
Browserbedienung mit diesem SQL gegen `127.0.0.1:5501`, deutlich als isoliert
gekennzeichnet; keine produktiven Auth-Tokens, keine produktiven Verbindungen.
Der normale Live-Server bleibt `127.0.0.1:5500`, unverändert.
Der zusätzliche isolierte Modellserver auf Port 5501 wurde nach der echten
Anbindung beendet. Normale lokale Prüfung ausschließlich auf Port 5500.
Nachweise außerhalb Git:
`C:/Users/sebbo/.codex/visualizations/2026/09/30/01a0f137-f3f5-7bc0-b080-7b451ea65ff0/community-pulse-views-20261013`.

Baseline: 2 fremd geänderte Wiki-Dateien und 19 fremde Wiki-Prüfdateien.
Diese vollständig erhalten; nicht committen/stagen oder bearbeiten.
Keine GAME-, Dedicated-, U01-/F01-, Wiki-, Auth-/Profil-/Rollen-, Besucher-/
Presenceänderung. Alte Abstimmung `community-voting.js` unverändert.
Abschluss: 21 fremde Dateien SHA-256-identisch; JS-Parserfehler 0,
relevante Browser-JS-/Consolefehler 0, 13 lokale Ressourcen HTTP 200/passende MIME,
kein horizontaler Overflow bei 1440/768/390 px, `git diff --check` sauber.
Echte neue Nachweise: `production-backend-validation.json`,
`production-http-validation.json`, `production-browser-validation.json`,
`production-scope-validation.json` und `production-*.png` im selben Nachweisordner.
Echte Adminseite zusätzlich auf Mobile EN mit vollständigem Formular/Footer
geprüft, ohne Speicherung. Abschlusslogs: 0 Fehler, 0 Warnungen; Viewport zurückgesetzt.
Kein Commit, Push, Deployment oder Webexport.
