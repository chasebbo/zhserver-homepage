# Animierte Weltlage – lokaler Abnahmestand, 19.10.2026

Zur Veröffentlichung freigegeben am 19.10.2026. Ausschließlich Homepage; keine Änderungen
an GAME/Webbuild, Dedicated, Supabase, Login, Gastzugang oder Community Pulse.

## Umsetzung

- Bestehende kompakte Weltlage auf `index.html` und `game.html` beibehalten.
- Gemeinsame Farben: Militär `#69eb9d`, Überlebende `#39986b`, Infizierte
  `#f25d62`, Umkämpft `#f2f3f0`; sowohl Zahlen als auch Leistenabschnitte.
- CSS-Zahlenpuls 2,65 s, Infizierte 1,85 s, versetzt, Skalierung 1,075.
  Tatsächlich geänderte Zahlen leuchten einmal 0,75 s bis Skalierung 1,19 auf.
- Schmaler Lichtreflex alle 5 s; Leistenanteile ändern sich über 1,5 s.
- `world-status.js` hält ausschließlich lokale Konzeptwerte. Keine Requests,
  keine Serverdaten und keine Account-/Sessiondaten. Ausgang 72/18/7/3.
  Alle 120–240 s werden 1–2 Punkte zwischen zwei Gruppen verschoben:
  Summe 100, nichtnegativ und pro Gruppe höchstens ±5 vom Ausgangswert.
- Eigener LocalStorage-Schlüssel `zh_world_concept_v1`: beide Seiten und
  gleichzeitig offene Tabs derselben Origin verwenden denselben Stand.
  Bereits geöffnete Tabs übernehmen Änderungen über das Storage-Ereignis.
  Reload setzt Werte und Änderungszeitpunkt nicht zurück. Bei gesperrtem
  Speicher funktioniert die Darstellung pro Seite im Arbeitsspeicher;
  seitenübergreifende Synchronisierung benötigt verfügbaren Browserspeicher.
- Keine Aufholserie nach längerer Abwesenheit. Ein Timer, keine Polling-Schleife.
  Verdeckte Seiten pausieren Timer und Animationen. Reduced Motion schaltet
  Zahlenanimation, Änderungsblitz, Lichtreflex und Breitentransition aus.
- Nach ausdrücklicher Textkorrektur keine sichtbare KONZEPT/CONCEPT- oder
  BEISPIELWERTE-Kennzeichnung. Keine Ersatzbezeichnung ergänzt. Auf der
  Spielseite bleibt der zuvor vorhandene Text GEPLANTES WELTSYSTEM bestehen.
- Spätere echte Daten können den Konzeptgenerator ersetzen; Renderer und
  bestehendes Markup sind gemeinsam und von der Datenquelle getrennt.

## Nachweise

- 25 isolierte Prüfungen bestanden, darunter 5.000 zeitgesteuerte Übergänge,
  Werte-/Breitenzuordnung, Grenzen, Summe, Intervall, Speicherfehler,
  Seiten-/Tababgleich, Hintergrundpause und Reduced-Motion-Zustand.
- Lokaler echter Browser: Zahlenpuls und wandernder Reflex anhand wechselnder
  berechneter Transformationen geprüft. Echter Timerwechsel auf
  72/18/9/1 beobachtet; identischer Stand auf Landingpage und Spielseite,
  einschließlich Rücknavigation.
- Landingpage 1440/1920, Tablet 768, Mobile 390/360; DE und EN.
  Spielseiten-Weltlage zusätzlich bei 1440/768/360 in DE/EN geprüft.
  Keine horizontalen Überläufe oder abgeschnittenen Zahlen; 0 erfasste
  Consolefehler/Warnungen. Spiel selbst für diese CSS-Arbeit nicht gestartet.
- CSS geparst, JavaScript-Syntax geprüft, lokale Script-/Stylesheet-/Bildpfade
  beider Seiten vorhanden; `git diff --check` sauber.
- Prüfscripts und Screenshots außerhalb des Repositorys unter
  `C:/Users/sebbo/.codex/visualizations/2026/09/30/01a0f137-f3f5-7bc0-b080-7b451ea65ff0/world-status-20261019/`.

Fremde Wiki-/Galerie-/Validierungsänderungen bleiben erhalten.
Visuelle Nutzerabnahme erteilt; gezielter Commit, Push und bestehender
GitHub-Pages-Deploy mit anschließender Liveprüfung ausdrücklich freigegeben.
