# Gelieferter Godot-Webbuild

Aktuelle Hauptversion: **v133** mit den Paketen `pc` und `handy`, veröffentlicht am 12.11.2026.

`game.html` lädt den Client erst nach dem bestehenden Account-/Gaststart:
`game/survival-v133-pc.html?build=v133-pc-20261112`, auf Handys
`game/survival-v133-handy.html?build=v133-handy-20261112` (nur ETC2 und kein S3TC, `gamePackageSource` in `game-entry.js`).
Die bestehende zentrale ZHServer-Sitzung wird über die unveränderte
`game-auth-bridge.js` übernommen.

Ein Paket besteht aus fünfzehn zusammengehörigen Dateien (das Spielpaket in sechs Teilen zu höchstens 24 MiB, damit Browser es zwischenspeichern), hier am Beispiel `pc`:

- `survival-v133-pc.html`
- `survival-v133-pc.js`
- `survival-v133-pc.wasm`
- `survival-v133-pc.pack-loader.js`
- `survival-v133-pc.pck.part00`
- `survival-v133-pc.pck.part01`
- `survival-v133-pc.pck.part02`
- `survival-v133-pc.pck.part03`
- `survival-v133-pc.pck.part04`
- `survival-v133-pc.pck.part05`
- `survival-v133-pc.audio.worklet.js`
- `survival-v133-pc.audio.position.worklet.js`
- `survival-v133-pc.apple-touch-icon.png`
- `survival-v133-pc.icon.png`
- `survival-v133-pc.png`

Der gelieferte Loader setzt die Packteile verlustfrei zusammen. Kein einzelner
Teil überschreitet 100 MiB. Keine zweite Auth-, Gasttimer- oder
Persistence-Lösung auf der Homepage.

Öffentlich liegt die Hauptversion v133 mit den Paketen `pc` und `handy` auf `game.html`,
`game-test-v130.html` und `game-test-handy.html`. Am Server v133 laufen nur Clients mit v133.
v132-3 mit den Paketen `pc` und `handy` ist der Rückweg, nur zusammen mit dem Server-Rückweg auf v132-3
(`game.html` und `game-test-v130.html` zurück auf `game/survival-v132-3-pc.html?build=v132-3-pc-20261107`,
`data-src-handy` auf `game/survival-v132-3-handy.html?build=v132-3-handy-20261107`, `game-test-handy.html`
zurück auf `game/survival-probe3-handy.html?build=probe3-handy-20261107`).
v132-3 und `survival-probe3-handy.*` bleiben in `game/`. probe3-handy wird erst archiviert, wenn v133 ein
paar Tage gut läuft. Archiviert sind v131-11 (`C:\ZHServer-Archiv\homepage-builds\v131-11\`),
probe1 (`C:\ZHServer-Archiv\homepage-builds\probe1-handy\`),
v130-2 (`C:\ZHServer-Archiv\homepage-builds\v130-2\`), v132-1
(`C:\ZHServer-Archiv\homepage-builds\v132-1\`) und v132-2
(`C:\ZHServer-Archiv\homepage-builds\v132-2\`).
Rückweg: probe1 aus dem Archiv nach `game/`, `data-src` zurück auf
`game/survival-probe1-handy.html?build=probe1-handy-20261105`, `game/survival-probe3-handy.*` löschen.
Jede Spielversion hat eigene Dateinamen; vorhandene Dateien werden nie
überschrieben. Ältere Builds (zuletzt v131-11, v132-2, v132-1, v130-2 und probe1) sind außerhalb des Repositorys
archiviert.

Prüfstand und Freigabegrenzen: `../docs/GAME_ENTRY_CHECKPOINT.md`.
