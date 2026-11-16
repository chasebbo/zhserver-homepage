# Gelieferter Godot-Webbuild

Aktuelle Hauptversion: **v134-1** mit den Paketen `pc` und `handy`, veröffentlicht am 16.11.2026.

`game.html` lädt den Client erst nach dem bestehenden Account-/Gaststart:
`game/survival-v134-1-pc.html?build=v134-1-pc-20261116`, auf Handys
`game/survival-v134-1-handy.html?build=v134-1-handy-20261116` (ETC2 und kein S3TC, dazu Apple-Mobilgeräte mit ETC2, `gamePackageSource` in `game-entry.js`).
Die bestehende zentrale ZHServer-Sitzung wird über die unveränderte
`game-auth-bridge.js` übernommen.

Ein Paket besteht aus fünfzehn zusammengehörigen Dateien (das Spielpaket in sechs Teilen zu höchstens 24 MiB, damit Browser es zwischenspeichern), hier am Beispiel `pc`:

- `survival-v134-1-pc.html`
- `survival-v134-1-pc.js`
- `survival-v134-1-pc.wasm`
- `survival-v134-1-pc.pack-loader.js`
- `survival-v134-1-pc.pck.part00`
- `survival-v134-1-pc.pck.part01`
- `survival-v134-1-pc.pck.part02`
- `survival-v134-1-pc.pck.part03`
- `survival-v134-1-pc.pck.part04`
- `survival-v134-1-pc.pck.part05`
- `survival-v134-1-pc.audio.worklet.js`
- `survival-v134-1-pc.audio.position.worklet.js`
- `survival-v134-1-pc.apple-touch-icon.png`
- `survival-v134-1-pc.icon.png`
- `survival-v134-1-pc.png`

Der gelieferte Loader setzt die Packteile verlustfrei zusammen. Kein einzelner
Teil überschreitet 100 MiB. Keine zweite Auth-, Gasttimer- oder
Persistence-Lösung auf der Homepage.

Öffentlich liegt die Hauptversion v134-1 mit den Paketen `pc` und `handy` auf `game.html`,
`game-test-v130.html` und `game-test-handy.html`. Am Server v134-1 laufen nur Clients mit v134-1.
v134 bleibt als Rückweg in `game/`, nur zusammen mit dem Server-Rückweg auf v134: dann zeigen die drei
Seiten in einem Commit auf `game/survival-v134-pc.html?build=v134-pc-20261116` und
`game/survival-v134-handy.html?build=v134-handy-20261116`.
v134-2 mit den Paketen `pc` und `handy` liegt bereit, noch zeigt keine Seite darauf. In `game/` liegen
v134, v134-1 und v134-2. Archiviert sind v133 (`C:\ZHServer-Archiv\homepage-builds\v133\`), v132-3 (`C:\ZHServer-Archiv\homepage-builds\v132-3\`), probe3-handy
(`C:\ZHServer-Archiv\homepage-builds\probe3-handy\`), v131-11 (`C:\ZHServer-Archiv\homepage-builds\v131-11\`),
probe1 (`C:\ZHServer-Archiv\homepage-builds\probe1-handy\`),
v130-2 (`C:\ZHServer-Archiv\homepage-builds\v130-2\`), v132-1
(`C:\ZHServer-Archiv\homepage-builds\v132-1\`) und v132-2
(`C:\ZHServer-Archiv\homepage-builds\v132-2\`).
Jede Spielversion hat eigene Dateinamen; vorhandene Dateien werden nie
überschrieben. Ältere Builds (zuletzt v133, v132-3, probe3-handy, v131-11, v132-2, v132-1, v130-2 und probe1) sind außerhalb des Repositorys
archiviert.

Prüfstand und Freigabegrenzen: `../docs/GAME_ENTRY_CHECKPOINT.md`.
