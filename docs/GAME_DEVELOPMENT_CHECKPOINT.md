# Spielseite – zwei gleichwertige Roadmap-/Weltlage-Karten

Stand: 15.10.2026. Letzte Korrektur: Alpha-Kasten und Tabs ausdrücklich entfernen.
Ausgangscommit: `8aecc51b4a776f886b1bf6c57f6e86b049f2d48e`.
Visuelle Abnahme erteilt; Veröffentlichung dieses Blocks am 15.10.2026 ausdrücklich
beauftragt. Nur die sieben zugehörigen Dateien committen und auf `main` pushen;
bestehenden GitHub-Pages-Weg verwenden. Keine Migration und kein Webexport.
Release-/Deployment-/Live-Nachweis extern unter `game-alpha-cards-release-20261015/`.

## Aktueller Stand

- Zielbereich: `game.html#game-updates`, unmittelbar unter „Aktueller Alpha-Stand“.
  ROADMAP links und WELTLAGE rechts als zwei gleichzeitig sichtbare Karten.
  Gleiche Breite, Höhe, Innenabstände, Überschriften und Kartenrahmen.
  Desktop zwei gleich große Grid-Spalten; bis 900 px untereinander, Roadmap zuerst.
  Gleich hohe Grid-Zeilen richten sich nach dem Inhalt, keine feste Pixelhöhe.
- Roadmap: Safezone & Handelsplatz, Grafik, Charakter, Bau-System, Portale.
  Fünf kurze Beschreibungssätze, keine neuen Icons oder Marketingabsätze.
- Weltlage: Safezone, Städte & Dörfer, Militär, Portale. Kurze Texte gemäß
  Korrekturauftrag. Keine zusätzlichen Inhalte oder großer neuer Seitenabschnitt.
- Der bisherige Alpha-0.2.3-Kasten ist vollständig entfernt: Texte, Fokusliste,
  Änderungszähler, Fortschrittsbalken und Alpha-Vorbehalt. Nicht verschoben.
  Keine Tabs, Tabpanels, versteckten Inhalte oder Tab-Ereignisbehandlung mehr.
  Die ausschließlich hierfür vorhandene Alpha-Initialisierung inklusive ihrer
  beiden nun unnötigen Changelog-Leseaufrufe ist entfernt. Der eigentliche
  Forum-Changelog, die Entwicklungsseite und deren Funktionen bleiben unverändert.
  Sämtliche übrigen Hauptseitenbereiche unverändert.
- Zwei bereits vorhandene, lokal erzeugte WebPs wiederverwendet. Keine neue
  Bildgenerierung: verlassene Straße mit Wracks und militärisch gesichertes Portal.
  `roadmap-abandoned-road.webp`: 131120 Byte; `world-state-portal.webp`: 97680 Byte.
  Jeweils 1024 × 1280 px. Dekorative CSS-Pseudoelemente, dunkle Verläufe,
  reduzierte Sättigung, mobil geringere Sichtbarkeit; keine Animationen.
- Die bereits vorbereiteten DE/EN-Texte werden unverändert im zentralen Katalog
  weiterverwendet. Keine zusätzliche Übersetzungslogik oder neue Bilder.

## Falsche Platzierung zurückgebaut / Zugang geklärt

- Der zuvor neu ergänzte große Block „Roadmap & Weltlage“ auf
  `game-development.html` ist vollständig zurückgebaut. Die Datei entspricht
  wieder dem ursprünglichen lokalen Stand vor diesem Auftrag (kein Git-Diff).
  Entwicklung, alte ausführliche Roadmap, Zukunftsvisionen, Abstimmung,
  Changelog-Verweis, Header und Footer erhalten.
- Die ausschließlich für den falschen Block angelegte, unversionierte
  `assets/css/game-development-panels.css` ist entfernt; ihre Einbindung ebenso.
- Der Entwicklungszugang wurde nicht gelöscht. Seit Commit `c048244` war er
  innerhalb des zunächst inaktiven Roadmap-Tabs als „GESAMTE ROADMAP“ vorgesehen:
  `game-development.html#game-roadmap`.
- Derselbe Link steht jetzt als „ENTWICKLUNG ANSEHEN“ direkt unter beiden Karten
  dauerhaft sichtbar. Keine zusätzliche Navigation erfunden. Bestehende
  Weiterleitungen alter `game.html`-Abschnittslinks bleiben unverändert.

## Lokale Prüfung

- Zwölf Browserfälle in DE/EN: 1440 × 900, 1280 × 800, 768 × 1024,
  430 × 932, 390 × 844, 360 × 800. Beide Karten immer gleichzeitig eingeblendet.
- Desktop Karten oben/unten bündig, Breiten bis auf Subpixelrundung identisch.
  Bei 1440 px beide 643 × 274,66 px. Auf Tablet/Mobile ebenfalls gleich hoch,
  untereinander in richtiger Reihenfolge; natürlicher Seiten-Scroll.
- Kein horizontaler oder interner Kartenüberlauf, keine abgeschnittenen Texte.
  Keine alten Alpha-Texte/Zähler/Progress-Elemente und keinerlei Tabrollen im Bereich.
  Der Entwicklungslink liegt außerhalb der Karten unter dem gesamten Grid.
- Neue Desktopaufnahme 1440 × 900 und längere Mobileaufnahme 390 × 1100 zur
  gemeinsamen Ansicht beider Karten. Reguläre Mobilhöhen zusätzlich oben geprüft.
- Vier gezielte Erhaltungsprüfungen: gesamtes übriges Spielseiten-HTML unverändert
  (nur Cache-Keys angepasst); geteiltes JS ausschließlich um die alte Alpha-
  Initialisierung gekürzt; 33 geschützte Dateien einschließlich aller 24 fremden
  lokalen Änderungen unverändert; HEAD und leerer Git-Index erhalten.
- JavaScript-Syntaxprüfung bestanden. Browser-/Consolefehler: 0.
  `git diff --check` sauber.
- Keine Backend-, Supabase-, Forum-, Rollen-, GAME-, Dedicated-, Startseiten-,
  Besucherzähler- oder Wikiänderungen. Kein Spiel gestartet.

Nachweise außerhalb Git:
`C:/Users/sebbo/.codex/visualizations/2026/09/30/01a0f137-f3f5-7bc0-b080-7b451ea65ff0/game-alpha-cards-final-20261015/`.
`verification.json`, `browser-validation.json`,
`game-alpha-cards-desktop-DE.jpg`, `game-alpha-cards-mobile-DE.jpg`.

Die frühere Platzierung auf der Entwicklungsseite und die ebenfalls abgelehnte
Tab-Lösung bleiben nur als historische Nachweise in den benachbarten Verzeichnissen
`development-roadmap-world-20261015/` und `game-alpha-tabs-correction-20261015/`.
Diese früheren Screenshots sind keine Abnahme des aktuellen Stands.

Nach gezieltem Release und erfolgreicher Live-Prüfung STOPP. Keine weiteren Bereiche
oder unabhängigen lokalen Änderungen aus dieser Freigabe ableiten.
