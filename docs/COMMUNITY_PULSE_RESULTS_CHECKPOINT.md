# Community Pulse: Ergebnisse immer sichtbar – 19.10.2026

Lokaler Abnahmestand. Kein Commit, Push oder Deployment.

- `community-pulse.js`: Ergebnisse, Prozentbalken und Gesamtstimmen immer sichtbar;
  keine Umschaltung mehr. Gäste erhalten deaktivierte Antwortbuttons, behalten
  aber Ergebnisse, Login-/Registrierungslinks und die vollständige Navigation.
- Mitglieder können direkt eine Antwort wählen oder wechseln. `my_vote` aus
  dem vorhandenen Reader bestimmt die eigene Goldmarkierung, zusätzlich an
  den aktuellen Mitgliedsstatus gebunden. Keine Gastmarkierung bei Logout.
- `community-pulse.css`: neutrale ungewählte Antwort; gewählte Antwort mit
  schmalem Goldrand und zurückhaltendem goldenem Hintergrund. Keine Animation.
- `index.html`: Ergebnisbutton samt Aktionscontainer entfernt, Cachekennungen
  für den vorhandenen Renderer und sein Stylesheet aktualisiert.
- Bestehender 10-Sekunden-Wechsel sowie Hover-/Fokus-/Touch-/Reduced-Motion-
  Pausen erhalten. Bereits beantwortete oder geschlossene Fragen rotieren
  weiterhin nicht automatisch. Fragewechsel blendet Ergebnisse nicht mehr aus.

## Sicherheit und Prüfungen

- API-, Auth-, Übersetzungs-, Backend- und SQL-Dateien unverändert. Bestehende
  RPC prüft den Account serverseitig und verwendet auth.uid(); eindeutiger
  Schlüssel (poll_id,voter_id), bestehendes Upsert bei Stimmenänderung.
- 47 isolierte Prüfungen mit echtem Frontend-Renderer und unverändertem
  API-Adapter bestanden: alle fünf Fragen, Gastschutz auch bei erzwungenem
  Klickereignis, Erststimme/Änderung, keine Duplikate, Reload, Benutzerwechsel,
  Logout, laufende Anfrage, Fehlerfall, geschlossene Umfrage, DE/EN, 0 Stimmen.
- Schreibtests ausschließlich mit isoliertem RPC-Modell außerhalb des Repos;
  keine produktiven Teststimmen erzeugt oder verändert. Kein produktiver SQL-
  oder Berechtigungstest ausgeführt; vorhandene Backendabsicherung nur geprüft.
- Isolierter echter Browser bestätigt Goldmarkierung, Stimmenänderung und
  Reload. Responsive 1440/1920/768/430/390/360 in DE/EN: kein horizontaler
  Überlauf, lange Antworten und Prozentwerte passen, Touchflächen mindestens
  44 px. 0 erfasste Consolefehler/-warnungen.
- Normale lokale Homepage auf Port 5500: alle fünf echten Fragen ausschließlich
  lesend als Gast, Desktop/Mobile DE/EN (20 Kombinationen), Ergebnisse immer
  vorhanden, Antwortbuttons deaktiviert, keine eigene Markierung. 0 Consolefehler.
- HTML-/CSS-Parser und JS-Syntax geprüft; `git diff --check` sauber.
- Nachweise und isolierte Prüfumgebung ausschließlich unter
  `C:/Users/sebbo/.codex/visualizations/2026/09/30/01a0f137-f3f5-7bc0-b080-7b451ea65ff0/pulse-always-results-20261019/`.

Weltlage, Forum-Teaser, Header, restliche Kapitel und sämtliche fremden lokalen
Wiki-/Galerie-/Validierungsänderungen erhalten. STOPP zur Nutzerabnahme.
