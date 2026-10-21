# Gelieferter Godot-Webbuild

Aktuelle Hauptversion: **v119**, veröffentlicht am 20.10.2026.

`game.html` lädt den Client erst nach dem bestehenden Account-/Gaststart:
`game/survival-v119.html?build=v119-20261020`.
Die bestehende zentrale ZHServer-Sitzung wird über die unveränderte
`game-auth-bridge.js` übernommen.

Ein Build besteht aus elf zusammengehörigen Dateien:

- `survival-v119.html`
- `survival-v119.js`
- `survival-v119.wasm`
- `survival-v119.pack-loader.js`
- `survival-v119.pck.part00`
- `survival-v119.pck.part01`
- `survival-v119.audio.worklet.js`
- `survival-v119.audio.position.worklet.js`
- `survival-v119.apple-touch-icon.png`
- `survival-v119.icon.png`
- `survival-v119.png`

Der gelieferte Loader setzt die Packteile verlustfrei zusammen. Kein einzelner
Teil überschreitet 100 MiB. Keine zweite Auth-, Gasttimer- oder
Persistence-Lösung auf der Homepage.

Öffentlich liegen nur die Hauptversion, die vorherige Hauptversion v118 als
Rückfall und nicht verlinkte Testversionen. Ältere Builds sind außerhalb des
Repositorys archiviert.

Prüfstand und Freigabegrenzen: `../docs/GAME_ENTRY_CHECKPOINT.md`.
