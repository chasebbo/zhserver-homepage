# Homepage-/Wiki-Meilenstein – 01.10.2026

Der vorhandene lokale Stand beider Homepage-/Spiel-Arbeiten wurde übernommen.
Keine bestehende Änderung verworfen und kein älterer Online-Stand eingespielt.

## Spieler-Changelog

Startseite und Gamepage zeigen **Alpha 0.2.3 · 14/20**. Zehn Punkte wurden zu den
vier vorhandenen Punkten ergänzt. Alle 13 Versionen samt bisherigen Einträgen
bleiben erhalten; keine Version enthält mehr als 20 Punkte. Die Fortschrittsanzeige
steht auf 70 %, mit sechs verbleibenden Punkten bis Alpha 0.2.4. Die Kurzvorschau
auf der Gamepage enthält die aktuellen HESCO-/Adminbasis-Arbeiten.

Die Ergänzungen wurden mit dem aktuellen Spiel-Diff, den Fortschrittsnotizen und
`ART_MASTER_KIT_CONTINUATION.md` abgeglichen. Quellen liegen im bestehenden
Spielprojekt `C:/Users/sebbo/OneDrive/Dokumente/Spiel/zh-survival` und wurden nur gelesen.

| Ergänzung | Nachweis im vorhandenen lokalen Spielstand |
| --- | --- |
| Zusammenpassende Beton-Außenmauer der Adminbasis | `admin_base_art.gd`, Einbindung in `main.gd`, Fortschrittsabschnitt vom 28.09. |
| Modulare Lagerhalle, Garage, Büro und Polizei | `admin_hall_art.gd`, tatsächlicher Hausrenderer, Hallen-/Gebäudefortschritt |
| Hofschotter, Asphalt, Drainagen und Markierungen | `admin_ground_art.gd`, `world_art_catalog.gd`, Einbindung in `main.gd` |
| Vier gestaltete Händlerstände im freien Hof | `WorldGeometry.admin_trader_cells()`, gemeinsame Händlergrafiken, Layoutnachweis |
| Neue Grafikfamilie für Fundamente/Böden/Dächer/Pfeiler/Zäune/Tore | `building_catalog.gd`, Grafikzuordnungen in `main.gd`, Struktur-/Habitat-Batches |
| Überarbeitete Versorgungsdarstellungen | vorhandene Generator-/Solar-/Wind-/Wasser-/Produktionszuordnungen, Versorgungs-/Utilities-Batches |
| Betten, Krankenbett und Gewächshaus mit neuen Grafiken | bestehende Bautypen 46–48 und tatsächliche Menü-/Weltgrafikzuordnungen |
| Fünf HESCO-Bautypen | Typen 61–65, Abwehr-Menü, Rezepte in Client und Dedicated |
| HESCO-Platzierung und Kollision mit freier Innenecke | gemeinsame belegte Zellen/Knickanker, Client-/Dedicated-Prüfung und Kollision |
| HESCO am südlichen Adminbasis-Zugang | `ADMIN_CHECKPOINT_MODULES`, `configure_admin_checkpoint_art()`, tatsächlicher Welt-Renderer |

Grafische Überarbeitungen werden als solche beschrieben. Keine neue Koch-,
Kamera-, Alarm-, Landwirtschafts- oder Schrankenfunktion behauptet. Die gesamte
Safezone, die endgültige Größenkalibrierung und der Laptop-Livetest bleiben eigene
offene Spielphasen. Der Changelog beschreibt den lokalen Entwicklungsstand für den
nächsten Testlauf; er ersetzt den veröffentlichten Webbuild nicht.

## Homepage, Wiki und Footer

Der Meilenstein umfasst die vorhandene Premium-Startseite, Damals/Heute, neue
Gamepage, gemeinsames DE/EN, SPIEL/GAME-Navigation, Forum-Vorschau, Galerie-/Community-
Anpassungen, Merch-Hintergrund und das abgeschlossene Wiki-Cleanup. Die Wiki-Daten,
Bilder, Kategorien und Spielverknüpfungen wurden in diesem Auftrag nicht verändert.
Bestand: **183 Einträge, 65 bestehende Bautyp-Zuordnungen einschließlich der separat
gekennzeichneten Basiskiste, 22 Weltmodule**.

Der zusätzliche Besucherhinweis und seine DE/EN-Texte sind vollständig aus der
gemeinsamen Footer-Komponente entfernt. Heute/Insgesamt behalten ihre echten
Daten. Gestern/Woche/Monat bleiben bei fehlender oder unvollständiger Quelle `—`.
Auch nach späterer Aktivierung erscheint kein Ersatzhinweis unter den Kennzahlen.
Keine Supabase-Migration ausgeführt, keine Produktionsdaten oder Regeln geändert.

## Prüfung vor dem Staging

- **48 Browseransichten:** Startseite, Gamepage, Wiki, Galerie, Bugs/Ideen und Forum
  jeweils in DE/EN bei 1440, 1280, 768 und 390 Pixeln. Mobile Navigation öffnet/schließt;
  keine horizontalen Seitenüberläufe, fehlenden dargestellten Bilder oder JS-Ausnahmen.
- DE ↔ EN ohne Reload; ursprüngliche deutsche Changelog-Texte kehren vollständig
  zurück. Sprache bleibt nach Reload und beim Navigieren zwischen allen sechs Seiten erhalten.
- Alle 13 Changelog-Versionen geöffnet und lesbar; 14 aktuelle Punkte und die
  20-Punkte-Regel geprüft. Historische Versionen und vier bestehende aktuelle Punkte
  per Quellenvergleich unverändert.
- Wiki: 183 Karten, Hauptkategorien, HESCO-Suche, Variantenfilter, Detailansicht und
  Rückkehr mit erhaltener Suche. **174 Bildpfade** im Browser geladen/decodiert.
  Der vorhandene Inhaltsprüfer besteht **7144 Prüfungen**, ohne Fehler.
- Gemeinsamer Footer auf acht Seiten geprüft. Bestehende Besucherquelle und vollständige
  Zeitraumquelle mit Testantworten geprüft, jeweils korrekte DE/EN-Zahlen und fehlende
  Zeiträume als `—`; kein Hinweistext. Testwerte bleiben ausschließlich in lokalen Prüfdateien.
- Zusätzliche echte **Leseabfrage**, ohne Registrierung: bestehende Besucher-RPC
  liefert HTTP 200, neue Perioden-RPC weiterhin HTTP 404.
- **16 externe JS-/MJS-Dateien und ein eingebettetes Skript** ohne Parserfehler.
  Lokale HTML-Ressourcen vorhanden; kein Kandidat für den Commit erreicht 100 MiB.
- Startseite/Gamepage und technische `?play`-Weiterleitung geprüft: öffentlicher
  Teststatus **24.10.**, kein öffentlicher Play-Button, weiterhin Ziel **v116**.
  Der Spieliframe wurde für Browserprüfungen durch eine Testantwort ersetzt.
- SHA256-Bestandsschutz gegen den Auftragsbeginn: `game/`, bestehende Spielquellen,
  sämtliche Wiki-Daten/-Bilder/-Skripte und die vorhandenen Styles unverändert.
- `git diff --check` vor dem Staging sauber; Staging ausschließlich über eine
  explizite Dateiliste. Browserartefakte, lokale Sicherungen und `tools/validation/`
  gehören nicht zum Commit.

Die Browserprüfungen verwenden einen lokalen HTTP-Server und simulierte Backend-
Antworten. Keine echten Stimmen, Beiträge, Uploads oder Besucherregistrierungen
erzeugt. Kein Webexport, Godot-Build, Clientstart, Serverstart oder Dedicated-Neustart.

Die ausführlichen maschinenlesbaren Nachweise und Screenshots bleiben lokal außerhalb
des Commitumfangs. Historische Prüfnotizen in den bestehenden Dokumentationen bleiben erhalten.
