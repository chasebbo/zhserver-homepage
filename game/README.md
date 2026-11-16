# Gelieferter Godot-Webbuild

Aktuelle Hauptversion: **v134** mit den Paketen `pc` und `handy`, veröffentlicht am 16.11.2026.

`game.html` lädt den Client erst nach dem bestehenden Account-/Gaststart:
`game/survival-v134-pc.html?build=v134-pc-20261116`, auf Handys
`game/survival-v134-handy.html?build=v134-handy-20261116` (ETC2 und kein S3TC, dazu Apple-Mobilgeräte mit ETC2, `gamePackageSource` in `game-entry.js`).
Die bestehende zentrale ZHServer-Sitzung wird über die unveränderte
`game-auth-bridge.js` übernommen.

Ein Paket besteht aus fünfzehn zusammengehörigen Dateien (das Spielpaket in sechs Teilen zu höchstens 24 MiB, damit Browser es zwischenspeichern), hier am Beispiel `pc`:

- `survival-v134-pc.html`
- `survival-v134-pc.js`
- `survival-v134-pc.wasm`
- `survival-v134-pc.pack-loader.js`
- `survival-v134-pc.pck.part00`
- `survival-v134-pc.pck.part01`
- `survival-v134-pc.pck.part02`
- `survival-v134-pc.pck.part03`
- `survival-v134-pc.pck.part04`
- `survival-v134-pc.pck.part05`
- `survival-v134-pc.audio.worklet.js`
- `survival-v134-pc.audio.position.worklet.js`
- `survival-v134-pc.apple-touch-icon.png`
- `survival-v134-pc.icon.png`
- `survival-v134-pc.png`

Der gelieferte Loader setzt die Packteile verlustfrei zusammen. Kein einzelner
Teil überschreitet 100 MiB. Keine zweite Auth-, Gasttimer- oder
Persistence-Lösung auf der Homepage.

Öffentlich liegt die Hauptversion v134 mit den Paketen `pc` und `handy` auf `game.html`,
`game-test-v130.html` und `game-test-handy.html`. Am Server v134 laufen nur Clients mit v134.
v133 bleibt als Rückweg in `game/`, nur zusammen mit dem Server-Rückweg auf v133: dann zeigen die drei
Seiten auf `game/survival-v133-pc.html?build=v133-pc-20261112` und
`game/survival-v133-handy.html?build=v133-handy-20261112`. In `game/` liegen nur v134 und v133. Archiviert sind v132-3 (`C:\ZHServer-Archiv\homepage-builds\v132-3\`), probe3-handy
(`C:\ZHServer-Archiv\homepage-builds\probe3-handy\`), v131-11 (`C:\ZHServer-Archiv\homepage-builds\v131-11\`),
probe1 (`C:\ZHServer-Archiv\homepage-builds\probe1-handy\`),
v130-2 (`C:\ZHServer-Archiv\homepage-builds\v130-2\`), v132-1
(`C:\ZHServer-Archiv\homepage-builds\v132-1\`) und v132-2
(`C:\ZHServer-Archiv\homepage-builds\v132-2\`).
Jede Spielversion hat eigene Dateinamen; vorhandene Dateien werden nie
überschrieben. Ältere Builds (zuletzt v132-3, probe3-handy, v131-11, v132-2, v132-1, v130-2 und probe1) sind außerhalb des Repositorys
archiviert.

Prüfstand und Freigabegrenzen: `../docs/GAME_ENTRY_CHECKPOINT.md`.
