# Gelieferter Godot-Webbuild

Aktuelle Hauptversion: **v134-15** mit den Paketen `pc` und `handy`, veröffentlicht am 25.11.2026.

`game.html` lädt den Client erst nach dem bestehenden Account-/Gaststart:
`game/survival-v134-15-pc.html?build=v134-15-pc-20261124`, auf Handys
`game/survival-v134-15-handy.html?build=v134-15-handy-20261124` (ETC2 und kein S3TC, dazu Apple-Mobilgeräte mit ETC2, `gamePackageSource` in `game-entry.js`).
Die bestehende zentrale ZHServer-Sitzung wird über die unveränderte
`game-auth-bridge.js` übernommen.

Ein Paket besteht aus fünfzehn zusammengehörigen Dateien (das Spielpaket in sechs Teilen zu höchstens 24 MiB, damit Browser es zwischenspeichern), hier am Beispiel `pc`:

- `survival-v134-15-pc.html`
- `survival-v134-15-pc.js`
- `survival-v134-15-pc.wasm`
- `survival-v134-15-pc.pack-loader.js`
- `survival-v134-15-pc.pck.part00`
- `survival-v134-15-pc.pck.part01`
- `survival-v134-15-pc.pck.part02`
- `survival-v134-15-pc.pck.part03`
- `survival-v134-15-pc.pck.part04`
- `survival-v134-15-pc.pck.part05`
- `survival-v134-15-pc.audio.worklet.js`
- `survival-v134-15-pc.audio.position.worklet.js`
- `survival-v134-15-pc.apple-touch-icon.png`
- `survival-v134-15-pc.icon.png`
- `survival-v134-15-pc.png`

Der gelieferte Loader setzt die Packteile verlustfrei zusammen. Kein einzelner
Teil überschreitet 100 MiB. Keine zweite Auth-, Gasttimer- oder
Persistence-Lösung auf der Homepage.

Öffentlich liegt die Hauptversion v134-15 mit den Paketen `pc` und `handy` auf `game.html`,
`game-test-v130.html` und `game-test-handy.html` (Spiel und Server v134-15 zusammen).
v134-14 ist der Rückweg, alle drei Seiten in einem Commit und gleichzeitig mit dem Server zurück auf
dedicated-v134-10-dcbf1b11b764: dann zeigen sie auf
`game/survival-v134-14-pc.html?build=v134-14-pc-20261122` und
`game/survival-v134-14-handy.html?build=v134-14-handy-20261122`. In `game/` liegen
v134-15, v134-14 und v134-16 (v134-16 bereitgelegt, noch auf keiner Seite). Archiviert sind v134-10 (`C:\ZHServer-Archiv\homepage-builds\v134-10\`), v134-13 (`C:\ZHServer-Archiv\homepage-builds\v134-13\`), v134-9 (`C:\ZHServer-Archiv\homepage-builds\v134-9\`), v134-12 (`C:\ZHServer-Archiv\homepage-builds\v134-12\`), v134-11 (`C:\ZHServer-Archiv\homepage-builds\v134-11\`), v134-8 (`C:\ZHServer-Archiv\homepage-builds\v134-8\`), v134-6 (`C:\ZHServer-Archiv\homepage-builds\v134-6\`), v134-3 (`C:\ZHServer-Archiv\homepage-builds\v134-3\`), v134-2 (`C:\ZHServer-Archiv\homepage-builds\v134-2\`), v134-1 (`C:\ZHServer-Archiv\homepage-builds\v134-1\`), v134 (`C:\ZHServer-Archiv\homepage-builds\v134\`),
v133 (`C:\ZHServer-Archiv\homepage-builds\v133\`), v132-3 (`C:\ZHServer-Archiv\homepage-builds\v132-3\`), probe3-handy
(`C:\ZHServer-Archiv\homepage-builds\probe3-handy\`), v131-11 (`C:\ZHServer-Archiv\homepage-builds\v131-11\`),
probe1 (`C:\ZHServer-Archiv\homepage-builds\probe1-handy\`),
v130-2 (`C:\ZHServer-Archiv\homepage-builds\v130-2\`), v132-1
(`C:\ZHServer-Archiv\homepage-builds\v132-1\`) und v132-2
(`C:\ZHServer-Archiv\homepage-builds\v132-2\`).
Jede Spielversion hat eigene Dateinamen; vorhandene Dateien werden nie
überschrieben. Ältere Builds (zuletzt v134-10, v134-13, v134-9, v134-12, v134-11, v134-8, v134-6, v134-3, v134-2, v134-1, v134, v133, v132-3, probe3-handy, v131-11, v132-2, v132-1, v130-2 und probe1) sind außerhalb des Repositorys
archiviert.

Prüfstand und Freigabegrenzen: `../docs/GAME_ENTRY_CHECKPOINT.md`.
