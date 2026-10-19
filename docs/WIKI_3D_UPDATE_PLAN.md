# Wiki: spätere Anpassung an die 3D-Version

Interne Arbeitsnotiz, 19.10.2026. Keine zusätzliche öffentliche Wiki-Seite und
kein neuer Navigationseintrag. Die grundlegende Überarbeitung erfolgt erst nach
Veröffentlichung der neuen 3D-Version. Kein Veröffentlichungstermin festgelegt.

## Bestand und Pflegeweg

- `wiki.html`: Einstieg, Katalog, bestehende Anker und Bau-/Art-Leitfäden.
- `assets/data/wiki-entries.json`: derzeit 302 Einträge in Bausystem, Welt,
  Ausrüstung, Loot & Ressourcen und Spielsysteme. IDs und Detail-URLs erhalten.
- `assets/data/build-wiki-data.mjs` erzeugt `assets/js/wiki-data.js`.
  Den generierten Katalog nicht unabhängig vom Datenbestand bearbeiten.
- `assets/js/wiki.js`: Suche, Filter, Kategorien und Detailansichten.
- `assets/js/wiki-i18n.js`: Wiki-Beschriftungen im gemeinsamen DE/EN-System.
  Der eigentliche Katalog ist derzeit deutschsprachig.

## Nach Veröffentlichung gezielt abgleichen

| Bestehender Bereich | Später zu prüfen |
| --- | --- |
| Bausystem und Bauleitfaden | Tatsächliche Bedienung, Bauteile, Platzierung, Stockwerke und begehbare Gebäude mit dem veröffentlichten Spiel abgleichen. Kamera und orthogonales Bauraster getrennt behandeln. |
| Welt und Gebäudereferenzen | Abbildungen, Innenräume, Gebäude, Adminbasis/Safezone und Stadtübersicht auf den veröffentlichten 3D-Stand prüfen. Geplante Konzepte nicht als vorhandene Funktionen ausgeben. |
| Ausrüstung, Waffen und Fahrzeuge | Bilder, Darstellungen, Zuordnungen, Bedienung und Werte gegen die veröffentlichte Version prüfen. Bestehende Listen nicht vorab ersetzen. |
| Loot und Ressourcen | Fundorte, Materialien, Rezepte und sonstige Mechanikangaben anhand des tatsächlichen Spielstands überprüfen. |
| Spielsysteme | Multiplayer, Persistenz, Welt-Nachladen sowie vorhandene Zombie-/Spawnangaben abgleichen. 3D-Zombies und überarbeitete Spawnlogik sind derzeit Planung. |
| Art-/Perspektiv- und Charakterreferenzen | 2D-Bildreferenzen, Perspektivvorgaben und Equipmentdarstellungen auf die veröffentlichte 3D-Version abstimmen. Status von Konzept, Teilumsetzung und fertigem Inhalt beibehalten. |

## Grenze des aktuellen Auftrags

Nur ein kompakter Hinweis in der Wiki-Einleitung und seine DE/EN-Texte wurden
ergänzt. Vorhandene Texte, Bilder, Werte, Einträge, IDs, URLs, Bauanleitungen,
Suche und Navigation bleiben unverändert. Die bereits lokal geänderten
Katalogdateien gehören zu anderer Arbeit und wurden nicht neu erzeugt.

Spätere Änderungen gesammelt am bestätigten veröffentlichten Stand prüfen.
Bestehende Verlinkungen erhalten und ersetzte Bilder erst nach Integration und
Referenzprüfung bereinigen. Diese Notiz gibt keine Spiel- oder Serveränderung frei.
