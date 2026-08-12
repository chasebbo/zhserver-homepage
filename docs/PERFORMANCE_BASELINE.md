# ZH-Survival Performance Baseline

Diese Datei dokumentiert bestätigte Performance-Probleme, bereits umgesetzte Optimierungen und Schutzregeln für zukünftige Performance-, Rendering-, Netzwerk- und Fahrzeug-Arbeiten.

Sie ist Referenz für Antigravity, Codex und zukünftige Entwicklungs-Sessions.

---

## Grundregel

Performance-Probleme niemals auf Verdacht beheben.

Immer:

1. Live messen
2. Hotpath instrumentieren
3. exakte Ursache bestimmen
4. minimal fixen
5. Vorher/Nachher vergleichen
6. erst danach releasen

Keine großen Architekturänderungen ohne Messbeweis.

---

# PERFORMANCE-PASS 2

## Ausgangszustand cHa

Vor Optimierung:

* FPS: ca. 1–2
* UI Draw: ca. 404–433 ms
* World Draw: ca. 49–50 ms
* submit_position: ca. 545 ms
* snapshot_interval: ca. 545 ms
* receive_to_apply: ca. 507 ms

Vergleich mausimaus:

* FPS: ca. 6–7
* UI Draw: ca. 28–32 ms
* World Draw: ca. 54–62 ms
* submit_position: ca. 149 ms

Der massive Unterschied lag beim UI-Hotpath.

---

# MINIMAP-HOTPATH

Bei cHa:

`explored_cells = ca. 64.383`

Vorher wurden diese erkundeten Kartenzellen bei jedem Frame einzeln in `draw_minimap()` verarbeitet/gezeichnet.

Folge:

UI Draw ca. 404–433 ms.

Fix:

Erkundete Minimap-Zellen werden in eine:

`170 x 170`

Textur gecacht.

Cache-Rebuild nur wenn:

* explored_cells geladen werden
* explored_cells sich ändern

Nicht pro Frame.

Live-Ergebnis:

* einmaliger Cache-Build ca. 383–385 ms
* danach draw_minimap ca. 0,2 ms
* gesamte UI ca. 4,6–5,0 ms

SCHUTZREGEL:

Minimap-Cache niemals durch vollständiges per-frame Zeichnen von explored_cells ersetzen.

---

# STATISCHES WORLD-RENDERING

Nach dem Minimap-Fix war WORLD der größte Hotpath.

Vorher wurden pro Frame unter anderem verarbeitet:

* Straßen: 38.090
* Häuser: 5.990

Auch große Mengen Offscreen-Welt.

World Draw:

ca. 49–50 ms.

Fix:

* vorhandene WorldSectors als Client-Render-Buckets verwenden
* Kandidaten nur bei relevantem Sektorwechsel neu aufbauen
* zusätzlich Viewport-Culling
* kein zweites Sektorsystem

Beispiel:

Straßen:

`38.090 -> ca. 680 lokale Kandidaten`

Häuser:

`5.990 -> lokale Kandidaten statt vollständiger Weltliste`

Automatischer lokaler Test:

`World Draw ca. 0,12–0,13 ms`

Authentifizierter Live-Test:

`ca. 1–3 ms`

SCHUTZREGEL:

Keine vollständigen Straßen-/Haus-/statischen Weltlisten wieder pro Frame durchlaufen.

Render-Buckets und Viewport-Culling erhalten.

---

# SERVERSEITIGES INTEREST MANAGEMENT

Bestehendes Interest Management insbesondere für:

* Spieler
* Zombies
* Loot
* Death Loot

Verwendet vorhandene WorldSectors.

Bestehende Architektur:

* `sector_for_cell`
* Sector-Größe: 48 Cells
* ungefähr 1536 px

Kein zweites Chunk-/Sector-System.

Loot und Death Loot verwenden entsprechende Delta-/Interest-Verarbeitung.

Bases/Trees/Vehicles wurden bewusst konservativer behandelt.

SCHUTZREGEL:

* keine zweite Interest-Architektur
* Sector-Größe nicht ohne Messbeweis ändern
* Interest-Radius nicht ohne Messbeweis ändern

---

# RESPAWN-FIX

Problem:

Fehlgeschlagener Death-CAS konnte dazu führen:

`death_state_persisted = false`

Dadurch konnte Respawn dauerhaft bei:

`Respawn wird bestätigt ...`

hängen.

Fix:

* Persistenz-/Retry-Pfad repariert
* relevante Interest-Caches nach Respawn invalidiert
* unmittelbare Aktualisierung

Live bestätigt mit:

* cHa
* mausimaus

Respawn SÜD funktionierte.

SCHUTZREGEL:

Respawn-Fix bei Performance-Arbeiten nicht zurückbauen.

---

# NETZWERK / FRAMEBINDUNG

Wichtiger Befund:

Die hohen Netzwerkintervalle waren hauptsächlich Folge der extrem niedrigen Client-FPS.

Vorher cHa:

* FPS 1–2
* submit_position ca. 545 ms

Nach Rendering-Fixes:

* FPS meist 17–22
* submit_position ca. 150 ms
* snapshot_interval ca. 149 ms
* receive_to_apply ca. 151 ms

Dabei:

* snapshot_sequence_gaps = 0
* server_position_sequence_gaps = 0

SCHUTZREGEL:

Bei Netzwerkproblemen nicht blind verändern:

* Snapshotrate
* submit_position Intervall
* Lerp
* HardSnap
* Server Tickrate

Zuerst prüfen, ob die Client-Frametime erneut Ursache ist.

---

# BESTÄTIGTER LIVE-STAND NACH PERFORMANCE-PASS 2

Vorher:

* FPS: 1–2
* UI: 404–433 ms
* World: 49–50 ms
* submit_position: ca. 545 ms

Nachher:

* FPS: meist 17–22
* UI: ca. 4,6 ms
* World: ca. 1–3 ms
* submit_position: ca. 150 ms
* snapshot_interval: ca. 149 ms
* receive_to_apply: ca. 151 ms
* keine Sequence-Gaps

---

# FAHRZEUGE – OFFENER PUNKT

Fahrzeuge funktionieren grundsätzlich, wirken beim Fahren aber teilweise:

* sprunghaft
* leicht ruckelig

Kein starkes klassisches Rubberbanding.

Dieser Punkt wurde bewusst NICHT in Performance-Pass 2 verändert.

Vor zukünftiger Änderung komplette Kette messen:

A. Client Input
B. Client Send
C. Dedicated Receive
D. Server Simulation
E. Snapshot Build
F. Snapshot Send
G. Client Receive
H. Client Apply / Interpolation

Zusätzlich prüfen:

* Sequence/Reihenfolge
* Send-Intervalle
* Snapshot-Intervalle
* Positionsfehler
* Rotationsfehler
* konkurrierende Position-Writer
* lokaler Fahrer vs Server-Snapshot
* Remote Vehicle Interpolation
* Spieler- vs Fahrzeugposition
* Rotation Hard-Set
* Framebindung

NICHT blind:

* Snapshotrate erhöhen
* Lerp verändern
* HardSnap verändern
* Prediction einführen
* Tickrate erhöhen

Erst messen.

---

# SPÄTERER VEHICLE-GAMEPLAY-PASS

Geplante Punkte:

* echte Beschleunigung
* Bremsen
* Ausrollen
* kein sofortiges 100 -> 0
* weicher Vorwärts-/Rückwärtswechsel
* Fahrzeuge dürfen nicht durch Häuser/Wände fahren
* High-Speed-Tunneling prüfen
* benutzte Fahrzeuge an letzter Position persistieren
* unbenutzte Fahrzeuge können weiterhin zufällig respawnen

Späteres Claim-System:

* owner_id
* claimed_at
* last_claim_activity_at
* PIN serverseitig validieren
* PIN möglichst nicht plaintext
* Claim/PIN nach 30 Tagen Inaktivität verfallen

Nicht automatisch gemeinsam mit Performance-Fix implementieren.

---

# PERFORMANCE-REGRESSION-SCHUTZ

Folgende Systeme gelten als geschützt:

* Minimap explored_cells Cache
* statische World Render-Buckets
* Viewport-Culling
* serverseitiges Interest Management
* Loot-/Death-Loot Interest Verarbeitung
* Respawn-Fix
* Interest-Cache-Invalidierung nach Respawn
* Performance-Diagnostik

---

# PERFORMANCE-LOGS

Bestehende Diagnose möglichst erhalten:

* CLIENT FRAME PERF
* CLIENT UI PERF
* CLIENT WORLD PERF
* INTEREST PERF CLIENT
* CLIENT SEND TEST
* CLIENT NET TEST
* PERF ONLINE

Periodisch aggregieren.

Kein Frame-Spam.

---

# RELEASE-REFERENZ

Performance-Pass-2-Release:

Alpha:

`Alpha 0.2.0`

Webbuild:

`survival-v108`

Projekt-Commit:

`251a697`

Homepage-Commit:

`21b23c4`

Projekt-Branch:

`master`

Homepage-Branch:

`main`

Enthalten:

* Interest Management
* Respawn-Fix
* Minimap-Cache
* World Render-Buckets
* Viewport-Culling
* Performance-Diagnostik

Fahrzeug-Jitter bewusst NICHT verändert.

---

# GRAFIK-/UI-MODERNISIERUNG

Die geplante grafische Modernisierung darf die gewonnenen FPS nicht wieder zerstören.

Neue:

* Bodentexturen
* Vegetation
* Gebäudesprites
* Schatten
* Lichter
* Partikel
* Dekorationen
* UI-Elemente

müssen auf Caching/Culling aufbauen.

Keine tausenden statischen Elemente ungefiltert pro Frame verarbeiten.

Grafik zunächst in einem kleinen Testbereich umsetzen und gegen diese Baseline messen.

---

# VERBINDLICHE REGEL

Bei zukünftigen Aufträgen zu:

* Performance
* Rendering
* Netzwerk
* Fahrzeugen
* Grafik

zuerst diese Datei lesen.

Bestehende geschützte Optimierungen nicht ohne eindeun Messbeweis verändern.
