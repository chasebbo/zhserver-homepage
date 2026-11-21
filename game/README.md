# Gelieferter Godot-Webbuild

Aktuelle Hauptversion: **v134-9** mit den Paketen `pc` und `handy`, veröffentlicht am 21.11.2026.

`game.html` lädt den Client erst nach dem bestehenden Account-/Gaststart:
`game/survival-v134-9-pc.html?build=v134-9-pc-20261121`, auf Handys
`game/survival-v134-9-handy.html?build=v134-9-handy-20261121` (ETC2 und kein S3TC, dazu Apple-Mobilgeräte mit ETC2, `gamePackageSource` in `game-entry.js`).
Die bestehende zentrale ZHServer-Sitzung wird über die unveränderte
`game-auth-bridge.js` übernommen.

Ein Paket besteht aus fünfzehn zusammengehörigen Dateien (das Spielpaket in sechs Teilen zu höchstens 24 MiB, damit Browser es zwischenspeichern), hier am Beispiel `pc`:

- `survival-v134-9-pc.html`
- `survival-v134-9-pc.js`
- `survival-v134-9-pc.wasm`
- `survival-v134-9-pc.pack-loader.js`
- `survival-v134-9-pc.pck.part00`
- `survival-v134-9-pc.pck.part01`
- `survival-v134-9-pc.pck.part02`
- `survival-v134-9-pc.pck.part03`
- `survival-v134-9-pc.pck.part04`
- `survival-v134-9-pc.pck.part05`
- `survival-v134-9-pc.audio.worklet.js`
- `survival-v134-9-pc.audio.position.worklet.js`
- `survival-v134-9-pc.apple-touch-icon.png`
- `survival-v134-9-pc.icon.png`
- `survival-v134-9-pc.png`

Der gelieferte Loader setzt die Packteile verlustfrei zusammen. Kein einzelner
Teil überschreitet 100 MiB. Keine zweite Auth-, Gasttimer- oder
Persistence-Lösung auf der Homepage.

Öffentlich liegt die Hauptversion v134-9 mit den Paketen `pc` und `handy` auf `game.html`,
`game-test-v130.html` und `game-test-handy.html`.
v134-8 ist der Rückweg, alle drei Seiten in einem Commit und gleichzeitig mit dem Server: dann zeigen sie auf
`game/survival-v134-8-pc.html?build=v134-8-pc-20261119` und
`game/survival-v134-8-handy.html?build=v134-8-handy-20261119`. In `game/` liegen
nur v134-8 und v134-9. Archiviert sind v134-6 (`C:\ZHServer-Archiv\homepage-builds\v134-6\`), v134-3 (`C:\ZHServer-Archiv\homepage-builds\v134-3\`), v134-2 (`C:\ZHServer-Archiv\homepage-builds\v134-2\`), v134-1 (`C:\ZHServer-Archiv\homepage-builds\v134-1\`), v134 (`C:\ZHServer-Archiv\homepage-builds\v134\`),
v133 (`C:\ZHServer-Archiv\homepage-builds\v133\`), v132-3 (`C:\ZHServer-Archiv\homepage-builds\v132-3\`), probe3-handy
(`C:\ZHServer-Archiv\homepage-builds\probe3-handy\`), v131-11 (`C:\ZHServer-Archiv\homepage-builds\v131-11\`),
probe1 (`C:\ZHServer-Archiv\homepage-builds\probe1-handy\`),
v130-2 (`C:\ZHServer-Archiv\homepage-builds\v130-2\`), v132-1
(`C:\ZHServer-Archiv\homepage-builds\v132-1\`) und v132-2
(`C:\ZHServer-Archiv\homepage-builds\v132-2\`).
Jede Spielversion hat eigene Dateinamen; vorhandene Dateien werden nie
überschrieben. Ältere Builds (zuletzt v134-6, v134-3, v134-2, v134-1, v134, v133, v132-3, probe3-handy, v131-11, v132-2, v132-1, v130-2 und probe1) sind außerhalb des Repositorys
archiviert.

Prüfstand und Freigabegrenzen: `../docs/GAME_ENTRY_CHECKPOINT.md`.
