# Gelieferter Godot-Webbuild

Aktuelle Hauptversion: **v130-1** (Client-Hotfix zu v130), veröffentlicht am 02.11.2026.

`game.html` lädt den Client erst nach dem bestehenden Account-/Gaststart:
`game/survival-v130-1.html?build=v130-1-20261102`.
Die bestehende zentrale ZHServer-Sitzung wird über die unveränderte
`game-auth-bridge.js` übernommen.

Ein Build besteht aus zehn zusammengehörigen Dateien (v130-1 hat nur einen Packteil):

- `survival-v130-1.html`
- `survival-v130-1.js`
- `survival-v130-1.wasm`
- `survival-v130-1.pack-loader.js`
- `survival-v130-1.pck.part00`
- `survival-v130-1.audio.worklet.js`
- `survival-v130-1.audio.position.worklet.js`
- `survival-v130-1.apple-touch-icon.png`
- `survival-v130-1.icon.png`
- `survival-v130-1.png`

Der gelieferte Loader setzt die Packteile verlustfrei zusammen. Kein einzelner
Teil überschreitet 100 MiB. Keine zweite Auth-, Gasttimer- oder
Persistence-Lösung auf der Homepage.

Öffentlich liegen nur die Hauptversion, die vorherige Hauptversion v129 als
Rückfall und höchstens eine nicht verlinkte Testversion. Testseiten:
`game-test-v129.html` (v129) und `game-test-v130.html` (v130-1). Die Dateien
`survival-v130.*` bleiben als Rückweg für den Hotfix liegen. Ältere Builds sind
außerhalb des Repositorys archiviert.

Prüfstand und Freigabegrenzen: `../docs/GAME_ENTRY_CHECKPOINT.md`.
