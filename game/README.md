# Gelieferter Godot-Webbuild

Aktuelle Hauptversion: **v129**, veröffentlicht am 25.10.2026.

`game.html` lädt den Client erst nach dem bestehenden Account-/Gaststart:
`game/survival-v129.html?build=v129-20261025`.
Die bestehende zentrale ZHServer-Sitzung wird über die unveränderte
`game-auth-bridge.js` übernommen.

Ein Build besteht aus elf zusammengehörigen Dateien:

- `survival-v129.html`
- `survival-v129.js`
- `survival-v129.wasm`
- `survival-v129.pack-loader.js`
- `survival-v129.pck.part00`
- `survival-v129.pck.part01`
- `survival-v129.audio.worklet.js`
- `survival-v129.audio.position.worklet.js`
- `survival-v129.apple-touch-icon.png`
- `survival-v129.icon.png`
- `survival-v129.png`

Der gelieferte Loader setzt die Packteile verlustfrei zusammen. Kein einzelner
Teil überschreitet 100 MiB. Keine zweite Auth-, Gasttimer- oder
Persistence-Lösung auf der Homepage.

Öffentlich liegen nur die Hauptversion, die vorherige Hauptversion v127 als
Rückfall und höchstens eine nicht verlinkte Testversion. Ältere Builds sind
außerhalb des Repositorys archiviert.

Prüfstand und Freigabegrenzen: `../docs/GAME_ENTRY_CHECKPOINT.md`.
