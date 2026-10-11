# Gelieferter Godot-Webbuild

Aktueller Homepage-Webbuild: **v118**, Stand 11.10.2026.
Quelle: `C:/ZHServer-Builds/v118`; kein neuer Webexport erstellt.

`game.html` lädt den Client erst nach dem bestehenden Account-/Gaststart:
`game/survival-v118.html?build=guest-v118-20261011`.
Vorschau und Client teilen dasselbe große Spielfenster. Die bestehende zentrale
ZHServer-Sitzung wird über die unveränderte `game-auth-bridge.js` übernommen.

Alle **elf** manifestgeprüften Dateien gehören zusammen:

- `survival-v118.html`
- `survival-v118.js`
- `survival-v118.wasm`
- `survival-v118.pack-loader.js`
- `survival-v118.pck.part00`
- `survival-v118.pck.part01`
- `survival-v118.audio.worklet.js`
- `survival-v118.audio.position.worklet.js`
- `survival-v118.apple-touch-icon.png`
- `survival-v118.icon.png`
- `survival-v118.png`

Die Packteile werden durch den gelieferten Loader verlustfrei zusammengeführt.
Kein einzelner Teil überschreitet 100 MiB. Gastdauer: **120000 ms**, durch
gelieferten Client und den vom Nutzer bestätigten produktiven Dedicated bestimmt.
Keine zweite Auth-, Gasttimer- oder Persistence-Lösung auf der Homepage.

Die elf nicht mehr referenzierten v117-Laufzeitdateien wurden nach erfolgreicher
lokaler v118-Prüfung entfernt. Quellbuilds und historische Handoffs bleiben erhalten.

Prüfstand und Freigabegrenzen: `../docs/GAME_ENTRY_CHECKPOINT.md`.
**Visuelle Abnahme und Veröffentlichung am 11.10.2026 ausdrücklich freigegeben.**
Bestehendes GitHub-Pages-Deployment verwenden; kein neuer Webexport.
Live-Nachweise liegen außerhalb Git im dokumentierten Release-Prüfordner.
