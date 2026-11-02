# Gelieferter Godot-Webbuild

Aktuelle Hauptversion: **v130-2** (Client-Update zu v130), veröffentlicht am 02.11.2026.

`game.html` lädt den Client erst nach dem bestehenden Account-/Gaststart:
`game/survival-v130-2.html?build=v130-2-20261102`.
Die bestehende zentrale ZHServer-Sitzung wird über die unveränderte
`game-auth-bridge.js` übernommen.

Ein Build besteht aus dreizehn zusammengehörigen Dateien (v130-2 hat das Paket in vier Teilen zu höchstens 24 MiB, damit Browser es zwischenspeichern):

- `survival-v130-2.html`
- `survival-v130-2.js`
- `survival-v130-2.wasm`
- `survival-v130-2.pack-loader.js`
- `survival-v130-2.pck.part00`
- `survival-v130-2.pck.part01`
- `survival-v130-2.pck.part02`
- `survival-v130-2.pck.part03`
- `survival-v130-2.audio.worklet.js`
- `survival-v130-2.audio.position.worklet.js`
- `survival-v130-2.apple-touch-icon.png`
- `survival-v130-2.icon.png`
- `survival-v130-2.png`

Der gelieferte Loader setzt die Packteile verlustfrei zusammen. Kein einzelner
Teil überschreitet 100 MiB. Keine zweite Auth-, Gasttimer- oder
Persistence-Lösung auf der Homepage.

Öffentlich liegen höchstens drei Builds: die Hauptversion v130-2, ihr
Vorgänger v130-1 als Rückweg und v129 als Rückfall zum Server v129
(`game-test-v129.html`). Bis zum Release von v131 liegt zusätzlich der
Testkandidat v131 auf `game-test-v130.html` (Freigabe Sebastian 02.11.2026).
Jede Spielversion hat eigene Dateinamen; vorhandene Dateien werden nie
überschrieben. Ältere Builds (zuletzt v130) sind außerhalb des Repositorys
archiviert.

Prüfstand und Freigabegrenzen: `../docs/GAME_ENTRY_CHECKPOINT.md`.
