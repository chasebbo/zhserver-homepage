# Gelieferter Godot-Webbuild

Aktuelle Hauptversion: **v131-11** mit den Paketen `pc` und `handy`, veröffentlicht am 04.11.2026.

`game.html` lädt den Client erst nach dem bestehenden Account-/Gaststart:
`game/survival-v131-11-pc.html?build=v131-11-pc-20261104`, auf Handys
`game/survival-v131-11-handy.html?build=v131-11-handy-20261104` (nur ETC2 und kein S3TC, `gamePackageSource` in `game-entry.js`).
Die bestehende zentrale ZHServer-Sitzung wird über die unveränderte
`game-auth-bridge.js` übernommen.

Ein Paket besteht aus vierzehn zusammengehörigen Dateien (das Spielpaket in fünf Teilen zu höchstens 24 MiB, damit Browser es zwischenspeichern), hier am Beispiel `pc`:

- `survival-v131-11-pc.html`
- `survival-v131-11-pc.js`
- `survival-v131-11-pc.wasm`
- `survival-v131-11-pc.pack-loader.js`
- `survival-v131-11-pc.pck.part00`
- `survival-v131-11-pc.pck.part01`
- `survival-v131-11-pc.pck.part02`
- `survival-v131-11-pc.pck.part03`
- `survival-v131-11-pc.pck.part04`
- `survival-v131-11-pc.audio.worklet.js`
- `survival-v131-11-pc.audio.position.worklet.js`
- `survival-v131-11-pc.apple-touch-icon.png`
- `survival-v131-11-pc.icon.png`
- `survival-v131-11-pc.png`

Der gelieferte Loader setzt die Packteile verlustfrei zusammen. Kein einzelner
Teil überschreitet 100 MiB. Keine zweite Auth-, Gasttimer- oder
Persistence-Lösung auf der Homepage.

Öffentlich liegen die Hauptversion v131-11 mit den Paketen `pc` und `handy` auf `game.html`,
zugleich der Rückweg, und der Testkandidat v132-2 mit den Paketen `pc` und `handy` auf
`game-test-v130.html` (`game/survival-v132-2-pc.html?build=v132-2-pc-20261107`, auf Handys
`game/survival-v132-2-handy.html?build=v132-2-handy-20261107`).
Dazu das Handy-Probepaket `survival-probe3-handy.*` auf der nicht öffentlichen Testadresse
`game-test-handy.html` (`game/survival-probe3-handy.html?build=probe3-handy-20261107`), für einen
iPhone-Lauf. Archiviert sind probe1 (`C:\ZHServer-Archiv\homepage-builds\probe1-handy\`),
v130-2 (`C:\ZHServer-Archiv\homepage-builds\v130-2\`) und v132-1
(`C:\ZHServer-Archiv\homepage-builds\v132-1\`).
Rückweg: probe1 aus dem Archiv nach `game/`, `data-src` zurück auf
`game/survival-probe1-handy.html?build=probe1-handy-20261105`, `game/survival-probe3-handy.*` löschen.
Jede Spielversion hat eigene Dateinamen; vorhandene Dateien werden nie
überschrieben. Ältere Builds (zuletzt v132-1, v130-2 und probe1) sind außerhalb des Repositorys
archiviert.

Prüfstand und Freigabegrenzen: `../docs/GAME_ENTRY_CHECKPOINT.md`.
