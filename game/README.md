# Gelieferter Godot-Webbuild

Aktuelle Hauptversion: **v127**, veröffentlicht am 23.10.2026.

`game.html` lädt den Client erst nach dem bestehenden Account-/Gaststart:
`game/survival-v127.html?build=v127-20261023`.
Die bestehende zentrale ZHServer-Sitzung wird über die unveränderte
`game-auth-bridge.js` übernommen.

Ein Build besteht aus elf zusammengehörigen Dateien:

- `survival-v127.html`
- `survival-v127.js`
- `survival-v127.wasm`
- `survival-v127.pack-loader.js`
- `survival-v127.pck.part00`
- `survival-v127.pck.part01`
- `survival-v127.audio.worklet.js`
- `survival-v127.audio.position.worklet.js`
- `survival-v127.apple-touch-icon.png`
- `survival-v127.icon.png`
- `survival-v127.png`

Der gelieferte Loader setzt die Packteile verlustfrei zusammen. Kein einzelner
Teil überschreitet 100 MiB. Keine zweite Auth-, Gasttimer- oder
Persistence-Lösung auf der Homepage.

Öffentlich liegen nur die Hauptversion, die vorherige Hauptversion v119 als
Rückfall und höchstens eine nicht verlinkte Testversion. Ältere Builds sind
außerhalb des Repositorys archiviert.

Prüfstand und Freigabegrenzen: `../docs/GAME_ENTRY_CHECKPOINT.md`.
