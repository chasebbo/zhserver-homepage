# Godot-Webexport

Exportiere das Godot-Spiel als **Web** und kopiere alle erzeugten Dateien in diesen Ordner.

Die Startdatei muss anschließend `game/index.html` heißen. Beim Einbau wird der Platzhalter in `game.html` durch einen iframe ersetzt:

```html
<iframe class="game-embed" src="game/index.html" title="ZHServer-Spiel" allowfullscreen></iframe>
```

Die zugehörigen Dateien des Webexports (zum Beispiel `.wasm`, `.pck` und `.js`) müssen im selben Ordner bleiben.
