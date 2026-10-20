# Community Pulse – Top 5 Überlebende

Auftrag vom 20.10.2026. Visuelle Abnahme und Veröffentlichung des hier beschriebenen
Homepage-Stands sind ausdrücklich freigegeben. Die echte GAME-Datenanbindung
bleibt offen und ist nicht Teil dieses Releases.

## Darstellung

Desktop: Umfrage, echte Forum-Themen, Top 5 Überlebende nebeneinander.
Bis 1100 px: Umfrage oben, Forum und Rangliste darunter nebeneinander.
Bis 700 px: alle drei Bereiche untereinander, in derselben Reihenfolge.
Bestehende Abstimmungslogik und Forum-Abfragen bleiben unverändert.
Forum und Rangliste teilen sich genau ein unverändertes Lagerfeuerbild auf einer
gemeinsamen Grid-Ebene mit durchgehender dunkler Überlagerung. Die einzelnen
Spalten haben keine eigenen Bildhintergründe. Dies gilt auch beim Umbruch.

## Noch keine Spielschnittstelle angeschlossen

Öffentlich erscheint ausschließlich „Rangliste in Vorbereitung“.
Keine Beispieldaten, kein erfundener Endpunkt, keine Ranglistenabfrage.
Keine Berechnung von Spieltagen, aktiver Spielzeit oder Überlebensserien.

`window.ZHHomeSurvivors.connect(readPublicRows)` nimmt später einen Adapter an.
Dieser erhält `{signal}` für die Abbruchsteuerung und liefert ein Promise mit
höchstens fünf öffentlichen Anzeigeobjekten `{displayName, survivalDays}`.
Dies ist das interne Darstellungsformat, **kein behaupteter GAME-API-Vertrag**.
Der spätere Adapter muss das echte dokumentierte Antwortformat darauf abbilden.
Die Reihenfolge wird vom Dedicated übernommen, auf der Homepage nicht berechnet.
Weniger als fünf Zeilen werden ohne Auffüllung gezeigt. Namen werden ausschließlich
als Text eingesetzt; E-Mail-Adressen und weitere private Felder werden nicht angezeigt.

Nach Anschluss: einmal laden, danach frühestens im Fünf-Minuten-Rhythmus.
Keine Abfragen im Hintergrundtab; laufende Abfragen bei Verlassen abbrechen.
Zehn Sekunden Timeout, getrennte Lade-, Leer- und Fehlerzustände in DE/EN.
Bei Fehlern alte Zeilen entfernen, damit sie nicht als aktuell erscheinen.
`disconnect()` bricht ab und setzt den neutralen Vorbereitungszustand zurück.

## Vom GAME-Agenten noch benötigt

- Tatsächlicher öffentlicher Lese-Endpunkt bzw. vorhandene dokumentierte Schnittstelle.
- Antwortformat, öffentliche Anzeigenamen, finale Tageswerte und verbindliche Sortierung.
- Bestätigung, dass ausschließlich aktuell lebende Spieler erscheinen und keine
  E-Mail-Adressen, Tokens, privaten UUID-/Save-Daten ausgeliefert werden.
- Cache-/Aktualisierungsvorgaben, öffentliche Zugriffsrechte und ggf. CORS-Freigabe.

Dann ausschließlich den echten Leseadapter anschließen und mit echten Daten prüfen.
Keine Änderungen an GAME, Dedicated oder produktiven Datenstrukturen erfolgt.

## Lokale Prüfung

- 25 isolierte Prüfungen bestanden: neutraler Zustand ohne Abfragen/Timer,
  Laden, maximal fünf Zeilen, weniger Zeilen, leere Daten, Fehler, Timeout,
  Abbruch, veraltete Antworten, DE/EN, reine Textausgabe und private Felder.
- HTML ohne neue Parsefehler, CSS geparst, JavaScript-Syntax und Diffprüfung sauber.
- Echter Browser: 1920, 1440, 1280, 768, 390 und 360 px in DE/EN ohne
  horizontalen Overflow. Fünf Fragen mit echten Ergebnissen, Gastschutz,
  Login-Links und echte Forum-Themen samt Aufrufen geprüft. Keine Stimmen erzeugt.
- Header, andere Kapitel, Umfrage-Markup/-Logik, Forum-Reader und Footer erhalten.
- Keine erfassten Consolefehler oder Warnungen. Echte Ranglistenabnahme bleibt
  bis zum Anschluss der dokumentierten GAME-Schnittstelle ausdrücklich offen.
- Nachweise und Screenshots außerhalb des Repositorys:
  `C:/Users/sebbo/.codex/visualizations/2026/09/30/01a0f137-f3f5-7bc0-b080-7b451ea65ff0/home-survivors-20261020`.
