# Wiki und Asset-Referenz

Das Wiki bleibt eine statische Seite ohne Framework oder Backend. Inhalte
werden in `assets/data/wiki-entries.json` gepflegt. Der Generator
`assets/data/build-wiki-data.mjs` prüft die Daten und erzeugt daraus
`assets/js/wiki-data.js`; die generierte Datei nicht separat bearbeiten.

```sh
node assets/data/build-wiki-data.mjs
node --check assets/js/wiki.js
python tools/verify_wiki.py
git diff --check
```

Die Oberfläche steht in `wiki.html` und `assets/js/wiki.js`. Wiki-spezifische
Darstellungsregeln in `assets/css/style.css` dürfen andere Homepagebereiche
nicht verändern. Bilder werden über ihre vorhandenen relativen Pfade eingebunden,
unverzerrt dargestellt und bei fehlender Referenz ausdrücklich gekennzeichnet.

## Verbindliche Struktur

- `id` bleibt stabil, damit vorhandene `#item/<id>`-Links weiter funktionieren.
- `visual_id` bezeichnet die geplante Asset-Identität, nicht automatisch ein
  bereits im Spiel verfügbares Asset.
- `slot` ist ausschließlich `body`, `pants`, `boots`, `jacket`, `vest`,
  `backpack`, `headgear`, `weapon` oder `null`. Werkzeuge und Nahkampfwaffen
  benutzen den gemeinsamen sichtbaren Slot `weapon`.
- Handschuhe und sonstige tragbare Ausrüstung sind ausdrücklich Planungskarten
  mit `slot: null`, `slot_status: OFFEN` und erklärendem `art.slot_note`.
  Das definiert keinen neunten Slot. Bei vorhandener Slot-Zuordnung bleibt
  der passende technische Slot Pflicht.
- Baumodule, Verbrauchsgüter und Waffen-Anbauteile erfinden keine zusätzlichen
  Charakter-Slots. Objektrollen und Befestigungspunkte sind getrennte Angaben.
- Bauobjekte verwenden ein konsistentes Raster und ausschließlich 90°-Schritte.
  Unbestimmte Maße bleiben `OFFEN`; es werden keine Rastergrößen erfunden.
- Das Weltgebäude Supermarkt ist ein Konzept mit Verweisen auf wiederverwendbare
  Module und geplante Innenbereiche. Es wird dadurch kein Gebäude implementiert.

Die gemeinsame Referenzkette lautet: Wiki-Referenz → Art-/Design-Vorgabe →
Spielasset → Baumenü → Spielerbasis → modulares Weltgebäude → modulare
Stadtstruktur. Alle Stufen verwenden denselben Modulbezug. Die Richtung von
Stil und Perspektive ist verbindlich; exakte Kamera-, Pixel- und Rastermaße
müssen vor der späteren Asset-Erstellung festgelegt werden.

## Gemeinsame Art- und Perspektivvorgabe

`meta.art_direction` hält die gemeinsame Leitlinie `survival_gameplay_01` mit
Adminbasis-Referenz, Originalbildpfad und Angaben zu Perspektive, Stil, Palette,
Größenverhältnissen, Licht, Detailgrad und Lesbarkeit. Jeder Eintrag verweist
über `art.style_reference` darauf. `art.perspective` beschreibt die Zielansicht;
`art.perspective_status: VERBINDLICHE ZIELRICHTUNG` ist getrennt von der Freigabe
eines konkreten Bildes oder Spielassets.

Die Zielansicht ist schräg von oben und top-down-nah wie das zweite
Adminbasis-Bild. Es werden keine Kamerawinkel in Grad oder Pixelmaße erfunden.
Die Referenz steuert die Darstellung, nicht pauschal eine militärische
Ausstattung aller Gegenstände und Gebäude. Zivile Motive bleiben zivil.

`art.image_role` trennt erhaltene Ideen-/Formbilder von der verbindlichen
Layout-/Stil-/Perspektivreferenz der Adminbasis. Bestehende Frontal- und
Seitenansichten werden weder gelöscht noch durch Umbenennen als finale
Spielperspektive freigegeben. Fehlende Referenzbilder bleiben Platzhalter.
Neue spielnahe Varianten sollen später in die gemeinsame Perspektive
übertragen werden. Dieser Auftrag erzeugt oder verändert keine Bilddateien.

Der aufklappbare Leitfaden `wiki.html#art-referenz` und die Art-Angaben der
Detailkarten machen diese Unterscheidung auch auf der Homepage sichtbar.

## Zentrale Safezone und modulare Weltstruktur

`wiki.html#item/world_adminbase_central_01` ist die wichtigste Leitreferenz.
Sie dokumentiert die spätere Adminbasis in der Kartenmitte: Begrenzung,
Checkpoint und Zugänge, westliche Halle mit Turm, Innenhof, Händler und weitere
Funktionsflächen. Beide vom Auftrag gelieferten PNGs liegen unverändert unter
`assets/images/wiki/references/` und werden als große, unverzerrte Galerie mit
Originalbild-Links dargestellt. SHA256-Prüfungen sichern ihre Originalbytes.

Das Layoutbild beschreibt Aufbau und Wege; das Atmosphärenbild beschreibt
die verbindliche Spielperspektive, Material, Licht und Stil. Ihre Vorgabe ist verbindlich, während der Eintrag
`GEPLANT` und die Art `ENTWURF` bleiben: Fertige Spielassets sind damit noch
nicht freigegeben. Nordeinfahrt und Zahl/Nutzung der markierten Flächen sind
zwischen den Bildern abzugleichen. Hubschrauber, Beschriftungen und Sperren
begründen keine implementierten Spielregeln. Sichtbare schräge Bildkanten
werden nicht als 45°-Baumodule übernommen.
Die modulare Safezone ist als späterer Ersatz der bisherigen Adminbasis
dokumentiert. Ein Spawn-/Safezone-Bereich ist als Planungsabschnitt vorbereitet;
Lage, Schutzregeln, Spawnmechanik und Interaktionsobjekte bleiben offen.

`wiki.html#item/world_city_structure_01` beschreibt die weitere Gliederung von
Modulen in Gebäude und spätere Stadtbereiche. Der vorhandene Supermarkt bleibt
erhalten und erhält Eingangs-, Modul- und Stadtanbindungsangaben. Referenzen auf
bestehende Holz-, Stein- oder Metallmodule bezeichnen Strukturkandidaten;
Material, Maße und Freischaltung sind dadurch nicht automatisch festgelegt.
Alle bisher vorhandenen Einträge, Bilder und Werte bleiben erhalten.

Eigene geplante Detailseiten ergänzen Wohngebäude, Tankstelle, Polizei,
Krankenhaus, Werkstatt, Industrie/Lager, Garage und Büro. Sie beschreiben
Bauhülle, Eingänge, Innenräume, Lager, mögliche Loot- und Interaktionsbereiche.
Die vom Auftrag genannten Raumtypen sind Planungsziele, keine implementierten
Funktionen. Die Stadtübersicht verknüpft alle Gebäudetypen und beschreibt den
späteren Übergang von Gesamtbildern und fertigen Sprites zu wiederverwendbaren
Gebäudemodulen. Bestehende Bildreferenzen bleiben dafür erhalten.

Türblätter sind als `module_type: tuer` von drei geplanten Türwandmodulen
getrennt. Eine Türwand enthält die Wandöffnung; ihre verknüpfte Tür bleibt ein
Anschlusskandidat. Fensterwände erhalten einen eigenen Filter, während
Fensterbarrikaden weiterhin separat auffindbar sind. Ursprüngliche Werte,
Beschreibungen und IDs der vorhandenen Türen und Fenster bleiben erhalten.

Das optionale Datenobjekt `reference_plan` enthält:

- `designation`, `location`, `commitment`, `interpretation`: Rang, Lage,
  Verbindlichkeit und Lesart der Referenz.
- `gallery`: Originalbilder mit `id`, `image`, `title`, `caption`, `alt` und
  optionalem `sha256` zum Schutz der Originalbytes.
- `entrances`, `modules`, `building_types`: benannte Planungsabschnitte mit
  `status`, `description` und optionalen `module_refs`, `entry_ref` oder
  `open_points`. Alle Referenzen zeigen auf vorhandene Katalog-IDs.
- `planned_visual_id`: geplante Asset-Identität, wenn noch keine eigene
  Katalogkarte existiert. Sie ist ausdrücklich kein Link auf ein vorhandenes
  Asset und muss von bereits vergebenen IDs verschieden sein.
- `rules`, `open_points`, `related_entries`: gemeinsame Bauvorgaben, offene
  Entscheidungen und verknüpfte Wiki-Einträge.

`world_sections` bleibt für Aufbau und Funktionsbereiche zuständig.
`meta.world_reference` benennt die zentrale Referenz und die gemeinsame
Entwicklungskette. Suchindex, Detailansicht und Filter verwenden diese Inhalte.
Der Generator prüft Schema, Referenzen und Bilder; der unabhängige Validator
prüft zusätzlich den Erhalt der Ursprungsinhalte und beide Originalbild-Hashes.
Dieser Ausbau betrifft ausschließlich das Wiki, ohne Godot-, Karten- oder
Gameplay-Änderungen.

## Inhalt und Freigabe

Vorhandene Texte und Werte bleiben erhalten, auch wenn ihr Implementierungsstand
noch nicht bestätigt ist. Zusatzfelder dürfen nur eindeutig passende Werte
übernehmen: Ausdauer ist beispielsweise keine Haltbarkeit, und ein Fundort ist
keine Seltenheit.

`OFFEN`, `GEPLANT` und `KONZEPT` kennzeichnen den Entwicklungsstand. Ein vorhandenes
Bild ist noch kein Freigabenachweis: `ENTWURF` und `PLACEHOLDER` bleiben vom
ausdrücklich bestätigten `FINAL` getrennt. Die gemeinsame Stil- und
Perspektivrichtung ist vorgegeben; objektspezifische Varianten, Größenklasse,
Maße und noch unbekannte Angaben bleiben Entwurf oder offen. Vor einer späteren Freigabe sind Bild, Maße und Zuordnung zu
bestätigen. Neue Gameplay-Werte werden nicht aus Bildern oder Tags geschätzt.

## Rekonstruktion des abgebrochenen Umbaus

Vergleichsstand ist `origin/main` bei Commit
`75f65d17860a1d28c2d12b4afc005ac84690c511`. Die 112 bisherigen Karten waren im
lokalen Datenkatalog bereits weitgehend enthalten, aber ein Syntaxfehler im
Renderer verhinderte ihre Anzeige. Der Generator verwies zusätzlich auf eine
nicht vorhandene `_wiki_raw.json`.

Gesichert wurden alle 112 Originaleinträge mit 57 Bildreferenzen, 55
Icon-Platzhaltern, 342 Statzeilen und 260 Tags sowie der vollständige Bauleitfaden.
Die zwölf lokalen Planungskarten und ihre IDs bleiben erhalten. Zwei
Konvertierungsfehler bei Symbolen in Statbeschriftungen wurden an den Ursprung
angeglichen. Der Validator prüft die Originalinhalte unabhängig vom Renderer
gegen den genannten Git-Stand und kontrolliert zusätzlich Schema, Referenzen,
Filter, Bilddateien und den generierten Datenabzug.

Für die visuelle Abnahme Desktop und Mobile prüfen: Kategorien und Unterfilter,
Suche mit und ohne Treffer, Detailkarten, Direktlinks nach Neuladen, Browser-
Zurück/Vorwärts, Bilder und Platzhalter sowie das mobile Hauptmenü. Die Homepage
und ihre übrigen Bereiche müssen weiterhin unverändert funktionieren.
