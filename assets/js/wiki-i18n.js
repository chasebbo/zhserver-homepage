/* Wiki UI uses the existing homepage DE/EN system; catalogue content remains German. */
(function () {
  "use strict";
  const catalog = window.ZHTranslations;
  if (!catalog) return;
  Object.assign(catalog.copy, {
  "wiki-0": {
    "de": "Bauen, Welt & Ausrüstung",
    "en": "Building, world & equipment"
  },
  "wiki-1": {
    "de": "Bausystem, Weltmodule, Ausrüstung und Ressourcen – mit klaren Angaben zu vorhandenem und geplantem Inhalt.",
    "en": "Building, world modules, equipment and resources – with clear information on available and planned content."
  },
  "wiki-2": {
    "de": "Katalog",
    "en": "Catalogue"
  },
  "wiki-3": {
    "de": "Alle",
    "en": "All"
  },
  "wiki-4": {
    "de": "Alle Kategorien",
    "en": "All categories"
  },
  "wiki-5": {
    "de": "Bausystem",
    "en": "Building"
  },
  "wiki-6": {
    "de": "Welt",
    "en": "World"
  },
  "wiki-7": {
    "de": "Ausrüstung",
    "en": "Equipment"
  },
  "wiki-8": {
    "de": "Loot & Ressourcen",
    "en": "Loot & resources"
  },
  "wiki-9": {
    "de": "Spielsysteme",
    "en": "Game systems"
  },
  "wiki-10": {
    "de": "Struktur",
    "en": "Structure"
  },
  "wiki-11": {
    "de": "Verteidigung & Befestigung",
    "en": "Defence & fortifications"
  },
  "wiki-12": {
    "de": "Türen & Tore",
    "en": "Doors & gates"
  },
  "wiki-13": {
    "de": "Einrichtung",
    "en": "Furnishings"
  },
  "wiki-14": {
    "de": "Lagerung",
    "en": "Storage"
  },
  "wiki-15": {
    "de": "Strom",
    "en": "Power"
  },
  "wiki-16": {
    "de": "Wasser",
    "en": "Water"
  },
  "wiki-17": {
    "de": "Produktion & Werkbänke",
    "en": "Production & workbenches"
  },
  "wiki-18": {
    "de": "Fallen & Sicherheit",
    "en": "Traps & security"
  },
  "wiki-19": {
    "de": "Weltmodule",
    "en": "World modules"
  },
  "wiki-20": {
    "de": "Böden, Straßen & Markierungen",
    "en": "Ground, roads & markings"
  },
  "wiki-21": {
    "de": "Gebäude & Städte",
    "en": "Buildings & towns"
  },
  "wiki-22": {
    "de": "Adminbasis & Safezones",
    "en": "Admin base & safe zones"
  },
  "wiki-23": {
    "de": "Adminbasis / Safezone",
    "en": "Admin base / safe zone"
  },
  "wiki-24": {
    "de": "Waffen",
    "en": "Weapons"
  },
  "wiki-25": {
    "de": "Munition",
    "en": "Ammunition"
  },
  "wiki-26": {
    "de": "Kleidung",
    "en": "Clothing"
  },
  "wiki-27": {
    "de": "Rüstung & Schutz",
    "en": "Armour & protection"
  },
  "wiki-28": {
    "de": "Rucksäcke",
    "en": "Backpacks"
  },
  "wiki-29": {
    "de": "Werkzeuge",
    "en": "Tools"
  },
  "wiki-30": {
    "de": "Weitere Ausrüstung",
    "en": "Other equipment"
  },
  "wiki-31": {
    "de": "Waffenaufsätze",
    "en": "Weapon attachments"
  },
  "wiki-32": {
    "de": "Nahrung",
    "en": "Food"
  },
  "wiki-33": {
    "de": "Medizin",
    "en": "Medicine"
  },
  "wiki-34": {
    "de": "Rohstoffe & Materialien",
    "en": "Resources & materials"
  },
  "wiki-35": {
    "de": "Baupläne & Freischaltung",
    "en": "Blueprints & unlocking"
  },
  "wiki-36": {
    "de": "Reparatur & Upgrades",
    "en": "Repairs & upgrades"
  },
  "wiki-37": {
    "de": "Ecken",
    "en": "Corners"
  },
  "wiki-38": {
    "de": "Fenster & Barrikaden",
    "en": "Windows & barricades"
  },
  "wiki-39": {
    "de": "Türwände",
    "en": "Door walls"
  },
  "wiki-40": {
    "de": "Beschädigte Varianten",
    "en": "Damaged variants"
  },
  "wiki-41": {
    "de": "Variante",
    "en": "Variant"
  },
  "wiki-42": {
    "de": "Alle Varianten",
    "en": "All variants"
  },
  "wiki-43": {
    "de": "Entwicklungsstand",
    "en": "Development status"
  },
  "wiki-44": {
    "de": "Alle Entwicklungsstände",
    "en": "All development stages"
  },
  "wiki-45": {
    "de": "Vorhanden",
    "en": "Available"
  },
  "wiki-46": {
    "de": "Teilweise vorhanden",
    "en": "Partially available"
  },
  "wiki-47": {
    "de": "Geplant",
    "en": "Planned"
  },
  "wiki-48": {
    "de": "Stand offen",
    "en": "Status unconfirmed"
  },
  "wiki-49": {
    "de": "Spielerbauteil",
    "en": "Player building piece"
  },
  "wiki-50": {
    "de": "Geplantes Spielerbauteil",
    "en": "Planned player building piece"
  },
  "wiki-51": {
    "de": "Basislager",
    "en": "Base storage"
  },
  "wiki-52": {
    "de": "Weltmodul · kein Spielerbaurezept",
    "en": "World module · no player recipe"
  },
  "wiki-53": {
    "de": "Welt- & Gebäudereferenz",
    "en": "World & building reference"
  },
  "wiki-54": {
    "de": "Spielsystem",
    "en": "Game system"
  },
  "wiki-55": {
    "de": "Gegenstand",
    "en": "Item"
  },
  "wiki-56": {
    "de": "Eintrag ansehen",
    "en": "View entry"
  },
  "wiki-57": {
    "de": "Zurück zum Katalog",
    "en": "Back to catalogue"
  },
  "wiki-58": {
    "de": "Bildreferenz",
    "en": "Reference image"
  },
  "wiki-59": {
    "de": "Bild offen",
    "en": "Image pending"
  },
  "wiki-60": {
    "de": "Referenzbild noch offen",
    "en": "Reference image pending"
  },
  "wiki-61": {
    "de": "Referenzbild nicht verfügbar",
    "en": "Reference image unavailable"
  },
  "wiki-62": {
    "de": "Wiki durchsuchen",
    "en": "Search the wiki"
  },
  "wiki-63": {
    "de": "Name, Material, Munition oder Referenz suchen",
    "en": "Search by name, material, ammunition or reference"
  },
  "wiki-64": {
    "de": "Suche löschen",
    "en": "Clear search"
  },
  "wiki-65": {
    "de": "Hauptkategorien",
    "en": "Main categories"
  },
  "wiki-66": {
    "de": "Unterkategorien",
    "en": "Subcategories"
  },
  "wiki-67": {
    "de": "Wissen für die Zombiehölle",
    "en": "Knowledge for Zombiehölle"
  },
  "wiki-68": {
    "de": "DER KATALOG",
    "en": "THE CATALOGUE"
  },
  "wiki-69": {
    "de": "Spielerbauteile und Weltmodule sind getrennt. Die Einträge bewahren ihre Werte, Bilder und Designreferenzen.",
    "en": "Player building pieces and world modules are separate. Entries retain their values, images and design references."
  },
  "wiki-70": {
    "de": "Gemeinsame Bau- und Weltmodule ansehen →",
    "en": "Browse the shared building and world modules →"
  },
  "wiki-71": {
    "de": "Ein Kategorienwechsel setzt Suche und Unterfilter zurück.",
    "en": "Changing category resets the search and secondary filters."
  },
  "wiki-72": {
    "de": "Keine passenden Einträge",
    "en": "No matching entries"
  },
  "wiki-73": {
    "de": "Für diesen Filter liegen noch keine Einträge vor.",
    "en": "There are no entries for this filter."
  },
  "wiki-74": {
    "de": "Filter zurücksetzen",
    "en": "Reset filters"
  },
  "wiki-75": {
    "de": "Alle Einträge ansehen",
    "en": "View all entries"
  },
  "wiki-76": {
    "de": "Suche",
    "en": "Search"
  },
  "wiki-77": {
    "de": "Verwandte Einträge",
    "en": "Related entries"
  },
  "wiki-78": {
    "de": "Aktueller Bau- & Funktionsstand",
    "en": "Current building & function status"
  },
  "wiki-79": {
    "de": "Verwendung",
    "en": "Use"
  },
  "wiki-80": {
    "de": "Modultyp",
    "en": "Module type"
  },
  "wiki-81": {
    "de": "Haltbarkeit",
    "en": "Durability"
  },
  "wiki-82": {
    "de": "Aktuelle Baukosten",
    "en": "Current building costs"
  },
  "wiki-83": {
    "de": "Belegte Rasterzellen",
    "en": "Occupied grid cells"
  },
  "wiki-84": {
    "de": "Fundort",
    "en": "Location"
  },
  "wiki-85": {
    "de": "Vorgesehene Lage",
    "en": "Planned location"
  },
  "wiki-86": {
    "de": "Geplante Module & Verwendung",
    "en": "Planned modules & use"
  },
  "wiki-87": {
    "de": "Werte & Verwendung",
    "en": "Values & use"
  },
  "wiki-88": {
    "de": "Materialien",
    "en": "Materials"
  },
  "wiki-89": {
    "de": "Crafting",
    "en": "Crafting"
  },
  "wiki-90": {
    "de": "Seltenheit",
    "en": "Rarity"
  },
  "wiki-91": {
    "de": "Gewicht",
    "en": "Weight"
  },
  "wiki-92": {
    "de": "Schaden",
    "en": "Damage"
  },
  "wiki-93": {
    "de": "Schutz",
    "en": "Protection"
  },
  "wiki-94": {
    "de": "Kapazität",
    "en": "Capacity"
  },
  "wiki-95": {
    "de": "Angaben",
    "en": "Information"
  },
  "wiki-96": {
    "de": "Bisherige Wiki-Beschreibung & Werte",
    "en": "Previous wiki description & values"
  },
  "wiki-97": {
    "de": "Diese früheren Angaben bleiben als Referenz erhalten. Für den bestätigten Funktionsstand gelten die Hinweise und aktuellen Bauwerte oben.",
    "en": "These earlier details are retained as a reference. The notes and current building values above describe the confirmed function status."
  },
  "wiki-98": {
    "de": "Bauleitfaden (Taste B)",
    "en": "Building guide (B key)"
  },
  "wiki-99": {
    "de": "Art- & Perspektivvorgabe",
    "en": "Art & perspective guide"
  },
  "wiki-100": {
    "de": "Art- & Designreferenz",
    "en": "Art & design reference"
  },
  "wiki-101": {
    "de": "Modulansichten",
    "en": "Module views"
  },
  "wiki-102": {
    "de": "Layout & visuelle Stilrichtung",
    "en": "Layout & visual style"
  },
  "wiki-103": {
    "de": "Originalbild ansehen",
    "en": "View original image"
  },
  "wiki-104": {
    "de": "neuer Tab",
    "en": "new tab"
  },
  "wiki-105": {
    "de": "Wichtigste Referenz für die modulare Spielwelt",
    "en": "Primary reference for the modular world"
  },
  "wiki-106": {
    "de": "Die zentrale Safezone / Adminbasis",
    "en": "The central safe zone / admin base"
  },
  "wiki-107": {
    "de": "Teilweise vorhanden · weiterer Ausbau und Maßstabsabgleich geplant",
    "en": "Partially available · further development and scale calibration planned"
  },
  "wiki-108": {
    "de": "Adminbasis-Referenz ansehen",
    "en": "View admin base reference"
  },
  "wiki-109": {
    "de": "Hinweis zum Entwicklungsstand:",
    "en": "Development status:"
  },
  "wiki-110": {
    "de": "Vorhanden, teilweise vorhanden oder geplant: Der Funktionsstand steht bei jedem Eintrag. Ein Bild allein bestätigt keine fertige Spielfunktion. Offene Bildfreigaben und der spätere Maßstabsabgleich bleiben getrennt dokumentiert.",
    "en": "Available, partially available or planned: each entry states its function status. An image alone does not confirm a completed game feature. Pending art approvals and future scale calibration are documented separately."
  },
  "wiki-111": {
    "de": "Die Adminbasis gibt Aufbau und Stilrichtung für die spätere Safezone in der Kartenmitte vor. Layout, Eingänge, Innenhof und Funktionsbereiche werden hier als Planungsgrundlage aus gemeinsamen 90°-Modulen beschrieben.",
    "en": "The admin base defines the layout and visual style of the future central safe zone. Entrances, courtyard and functional areas are planned with shared 90° modules."
  }
});
  Object.assign(catalog.messages, {
  "wiki.entries": {
    "de": "{count} Einträge",
    "en": "{count} entries"
  },
  "wiki.entry": {
    "de": "{count} Eintrag",
    "en": "{count} entry"
  },
  "wiki.noMatches": {
    "de": "Für „{query}“ gibt es in diesem Bereich keinen Treffer.",
    "en": "There are no matches for “{query}” in this section."
  }
});
})();
