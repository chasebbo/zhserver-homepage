# Changelog-Inventur – 15.10.2026

**Aktueller Importstatus:** Alle 14 Originaleinträge wurden nach ausdrücklicher Freigabe importiert. Ihre Original-Veröffentlichungsdaten bleiben historisch unbelegt. Der Nutzer hat die getrennten Migrationsdaten bewusst festgelegt:

| Eintrag | Zugewiesenes Migrationsdatum |
| --- | --- |
| 0.2.3 | 2026-10-07 |
| 0.2.2 | 2026-09-30 |
| 0.2.1 | 2026-09-23 |
| 0.2.0 | 2026-09-16 |
| 0.1.9 | 2026-09-09 |
| 0.1.8 | 2026-09-02 |
| 0.1.7 | 2026-08-26 |
| 0.1.6 | 2026-08-19 |
| 0.1.5 | 2026-08-12 |
| 0.1.4 | 2026-08-05 |
| 0.1.3 | 2026-07-29 |
| 0.1.2 | 2026-07-22 |
| 0.1.1 | 2026-07-15 |
| Update cities, buildings, roads and loot | 2026-10-14 |

Die folgende Inventur dokumentiert den unveränderten Quellbestand VOR dieser Freigabe. Ihre Fundstellen beziehen sich auf das archivierte alte HTML, nicht auf die inzwischen entfernte öffentliche Zweithistorie. Originaltexte/Quellfragmente/Hashes bleiben erhalten.



Keine produktiven Importe. Originaltexte und Quellfragmente vollständig in `FORUM_CHANGELOG_INVENTORY.json`. Keine Übersetzung oder Textüberarbeitung.

## Quellen und Abgrenzung

Im GAME-Projekt liegt genau ein unversionierter Eintrag in `CHANGELOG.md` mit neun Punkten. `main.gd:12904` zeigt nur ALPHA 0.2.1 und enthält keine Versionshistorie. Die bereits vorhandene öffentliche Alpha-Historie liegt als HTML in `game-development.html`; `assets/js/game-page-common.js` übernimmt sie unverändert für die kompakte Spielseite. Keine dieser Anzeigen wird geändert. Prüf-/Handover-Kopien und technische Buildnummern sind keine zusätzlichen offiziellen Veröffentlichungen.

Gefunden: **13 Alpha-Versionen und 1 unversionierter GAME-Eintrag**, zusammen **206 einzelne Änderungspunkte**.

| Version | Datum | Titel / Originalüberschrift | Quelle | Importierbar |
| --- | --- | --- | --- | --- |
| 0.2.3 | DATUM UNKLAR | Alpha 0.2.3 – 14/20 AKTUELL | game-development.html:375 | NEIN |
| 0.2.2 | DATUM UNKLAR | Alpha 0.2.2 – 20/20 ABGESCHLOSSEN | game-development.html:397 | NEIN |
| 0.2.1 | DATUM UNKLAR | Alpha 0.2.1 – 20/20 ABGESCHLOSSEN | game-development.html:425 | NEIN |
| 0.2.0 | DATUM UNKLAR | Alpha 0.2.0 | game-development.html:454 | NEIN |
| 0.1.9 | DATUM UNKLAR | Alpha 0.1.9 | game-development.html:483 | NEIN |
| 0.1.8 | DATUM UNKLAR | Alpha 0.1.8 | game-development.html:512 | NEIN |
| 0.1.7 | DATUM UNKLAR | Alpha 0.1.7 | game-development.html:541 | NEIN |
| 0.1.6 | DATUM UNKLAR | Alpha 0.1.6 | game-development.html:568 | NEIN |
| 0.1.5 | DATUM UNKLAR | Alpha 0.1.5 | game-development.html:593 | NEIN |
| 0.1.4 | DATUM UNKLAR | Alpha 0.1.4 | game-development.html:618 | NEIN |
| 0.1.3 | DATUM UNKLAR | Alpha 0.1.3 | game-development.html:644 | NEIN |
| 0.1.2 | DATUM UNKLAR | Alpha 0.1.2 | game-development.html:648 | NEIN |
| 0.1.1 | DATUM UNKLAR | Alpha 0.1.1 | game-development.html:652 | NEIN |
| ohne Version | DATUM UNKLAR | Update cities, buildings, roads and loot | C:/Users/sebbo/OneDrive/Dokumente/Spiel/zh-survival/CHANGELOG.md:3 | NEIN |

## Vor Import zu klären

Für keine der gefundenen Veröffentlichungen ist in der kanonischen Quelle ein Veröffentlichungsdatum belegt. Git-/Dateizeitstempel, ein heutiges Importdatum und Datumswerte aus technischen Tests ersetzen keine Originaldaten. Der unversionierte GAME-Eintrag benötigt außerdem eine Versionszuordnung oder die ausdrückliche Entscheidung, ihn separat zu übernehmen. Er wird nicht automatisch mit einer Alpha-Version verschmolzen.

**Aktuell importierbar: 0 Veröffentlichungen, 0 Topics, 0 Startbeiträge.** Jeder später freigegebene historische Eintrag erzeugt genau ein Topic und einen Startbeitrag; seine vorhandenen Aufzählungspunkte bleiben innerhalb dieses Beitrags. Kein Topic pro Aufzählungspunkt.

## Vollständige Originalinhalte

### Alpha 0.2.3 – 14/20 AKTUELL

Quelle: `game-development.html`; Source-Key: `homepage/game-development/alpha/0.2.3`; Reihenfolge: 1; Datum: **DATUM UNKLAR**.

- Das Bausystem wird stark erweitert: Neue Mauern und passende Ecken wurden hinzugefügt.
- Gebäude und eigene Basen können künftig abwechslungsreicher mit neuen Fensterwänden gebaut werden.
- Werkbank und Lagerkisten wurden überarbeitet und als neue Bauobjekte eingefügt.
- Die neue Adminbasis / Safezone wird als sicherer Treffpunkt vorbereitet.
- Die Außenmauer der Adminbasis besteht jetzt aus zusammenpassenden Betonsegmenten und Eckverbindungen.
- Lagerhalle, Garage, Büro und Polizeigebäude der Adminbasis sind modular überarbeitet; Fenster, Dächer und Eingänge passen zur vorhandenen Gebäudeaufteilung.
- Der Hof der Adminbasis hat neue Schotter- und Asphaltflächen, Entwässerung sowie Fahrbahn-, Park- und Landeplatzmarkierungen.
- Die vier Händlerstände haben passende Überdachungen und Theken und stehen jetzt im freien Hof statt über den Bürogebäuden.
- Fundamente, Böden, Dächer, Pfeiler, Zäune und Tore für eigene Basen haben neue, zusammenpassende Grafiken.
- Versorgungsbauten wie Generator, Solaranlage, Windrad, Wasserpumpe, Filter und Munitionspresse haben eigene, überarbeitete Darstellungen.
- Betten, Krankenbett und Gewächshaus sind im Baumenü und in der Spielwelt mit den neuen Grafiken eingebunden.
- Fünf HESCO-Bauteile sind im Abwehr-Baumenü verfügbar: Wand, Kurzsegment, Ecke, Verstärkung und Abschluss.
- HESCO-Bauten lassen sich im 90°-Raster platzieren. Bauprüfung und Kollision berücksichtigen die tatsächliche Form; die Innenecke bleibt frei begehbar und nutzbar.
- Am südlichen Zugang der Adminbasis ersetzen HESCO-Wände und Ecken die bisherigen Maueransichten; die breite Zufahrt bleibt offen.

### Alpha 0.2.2 – 20/20 ABGESCHLOSSEN

Quelle: `game-development.html`; Source-Key: `homepage/game-development/alpha/0.2.2`; Reihenfolge: 2; Datum: **DATUM UNKLAR**.

- Startstadt jetzt auch als Gast wählen.
- Mit STRG hocken und mit SHIFT sprinten.
- Fahrzeuge beschleunigen, rollen und lenken jetzt natürlicher.
- Zombies, Todesanimationen und Sounds überarbeitet.
- Wasser, Brücken, Straßen und alte Grafikfehler weiter bereinigt.
- Die Begrüßung passt jetzt zur tatsächlichen Startstadt.
- Gespeicherte Spielerpositionen bleiben beim Anmelden erhalten.
- Aufgeben und neu starten funktioniert jetzt auch als Gast. Der Account bleibt dabei bestehen.
- Fahrzeuge laufen im Onlinespiel gleichmäßiger und bleiben seltener hängen.
- Der Motorsound reagiert jetzt auf Gas und Geschwindigkeit.
- Alte kaputte Hausreste und beige Straßenstücke entfernt.
- Baumfällen mit der Axt gibt wieder ein Holz.
- Schrittgeräusche nochmal angepasst.
- Die Adminbase sieht jetzt anders aus und hat mehr Details.
- Die Spielerfigur ist etwas kleiner. Charakter und Waffen nochmal überarbeitet.
- Axt-Haltung und Schlagbewegung nochmal angepasst.
- Städte und Gebäude werden schrittweise grafisch überarbeitet.
- Die Spielwelt bekommt nach und nach neue und schönere Grafiken.
- Weitere Bauobjekte und Dekorationen kommen hinzu.
- Das Bausystem wird für den nächsten Testlauf weiter verbessert.

### Alpha 0.2.1 – 20/20 ABGESCHLOSSEN

Quelle: `game-development.html`; Source-Key: `homepage/game-development/alpha/0.2.1`; Reihenfolge: 3; Datum: **DATUM UNKLAR**.

- Rucksäcke sind wieder deutlich seltener zu finden.
- Inventar und Schnellleiste nutzen jetzt dieselben Itemgrafiken.
- Drehbare Bauteile zeigen ihre Ausrichtung jetzt richtig an.
- Straßen, Feldwege, Zufahrten und Parkflächen nochmal angepasst.
- Mit BUG / IDEE MELDEN können Bugs und Ideen jetzt direkt aus dem Spiel eingereicht werden.
- Der neue Survivor-Charakter hat jetzt Richtungs-, Lauf- und Kampfanimationen.
- Polizei, Krankenhaus, Werkstatt und Tankstellen als Servicebereiche weiter angepasst.
- Fahrzeugdarstellung, Kamera und Fahreranzeige nochmal angepasst.
- Zombie-Spawns überarbeitet. Sie sind jetzt anders über die Welt verteilt.
- Die alten braunen Lootkisten sind raus und wurden durch neue Lootobjekte ersetzt.
- Die Axt wird jetzt beim Ausrüsten am Charakter angezeigt.
- Die Axt sitzt jetzt richtig am Charakter und schwebt nicht mehr davor. Schläge gegen Zombies und Bäume passen jetzt besser zur Bewegung.
- Nord, Ost, Süd und West als Startstädte nochmal komplett überarbeitet.
- Das Straßennetz zwischen den vier Startstädten wurde verbessert. Dörfer und kleinere Siedlungen sind jetzt besser angebunden.
- Haus1 bis Haus5 sowie die dazugehörigen Innenräume überarbeitet.
- Büro, Hochhaus, Industrie, Garage, Kirche, Krankenhaus, Lagerhalle, Polizei, Supermarkt, Tankstelle und Werkstatt als begehbare Gebäude ergänzt.
- Zugänge und Kollisionen an Gebäuden korrigiert. Fehlerhafte graue Flächen, alte Wasserblocker und alte Gebäudefragmente sind entfernt.
- Loot steht jetzt passend in Gebäuden und Räumen. Die serverseitige Speicherung und Synchronisierung verhindert doppelte Loot-Aufnahmen.
- Flüsse und Wasserflächen korrigiert. Brücken lassen sich wieder zu Fuß und mit Fahrzeugen überqueren.
- Fahrzeuge beschleunigen und lenken jetzt natürlicher, rollen nach dem Gasgeben aus und verhalten sich an Hindernissen besser. Auch die Online-Fahrt und der Motorsound wurden angepasst.

### Alpha 0.2.0

Quelle: `game-development.html`; Source-Key: `homepage/game-development/alpha/0.2.0`; Reihenfolge: 4; Datum: **DATUM UNKLAR**.

- Online läuft jetzt etwas flüssiger.
- Spieler und Zombies weit weg werden nicht mehr unnötig mitgerechnet.
- Ältere Spielstände können neuere nicht mehr versehentlich überschreiben.
- Unveränderte Inventardaten werden nicht mehr unnötig gespeichert.
- Die Anzahl der registrierten Spieler wird jetzt zuverlässiger angezeigt.
- Die Welt läuft flüssiger, weil nur relevante Bereiche und Objekte verarbeitet werden.
- Große bereits erkundete Kartenbereiche bremsen die Minimap nicht mehr aus.
- Straßen, Gebäude und andere feste Objekte werden sparsamer gezeichnet.
- Respawns hängen nicht mehr dauerhaft bei „Respawn wird bestätigt…“.
- Weit entfernte Spieler, Zombies und Loot belasten den Client weniger.
- Die Loot-Reset-Anzeige zeigt nach einem Reset wieder den nächsten Countdown an.
- Prestige-, Missions- und andere Bonuspunkte landen jetzt richtig im Punktestand.
- Basen lassen sich komplett einpacken. Baumaterial und Lagerinhalt bleiben bis zu 24 Stunden in deiner Basiskiste.
- Lagerkisten speichern ihren Inhalt jetzt auch über Sitzungen hinweg.
- Inventar und Ausrüstung nochmal angepasst. Die 35 Grundplätze lassen sich mit Rucksäcken erweitern.
- Andere Spieler zeigen jetzt ihren vollständigen Namen und den aktuellen Charakter.
- HUD und Oberfläche nochmal übersichtlicher gemacht.
- Inventar und Schnellleiste passen jetzt besser zusammen.
- Boden, Vegetation, Gebäude und die Atmosphäre der Welt nochmal angepasst.
- Die Steuerungshilfe zeigt jetzt auch I: Inventar an.

### Alpha 0.1.9

Quelle: `game-development.html`; Source-Key: `homepage/game-development/alpha/0.1.9`; Reihenfolge: 5; Datum: **DATUM UNKLAR**.

- Der Loot-Reset-Countdown wird direkt nach dem Betreten der Welt richtig angezeigt und aktualisiert sich ohne Loot-Aktion.
- Neu registrierte Spieler kommen jetzt zuverlässig auf ZHServer 1.
- Fehlerhafte oder ältere Spielstände brechen das Laden des Inventars nicht mehr ab.
- Andere Spieler zeigen jetzt ihr richtiges Charaktermodell.
- Der Prestige-Rang anderer Spieler wird jetzt richtig angezeigt.
- Die Gruppen-Taste G steht jetzt im Steuerungsbereich.
- Info- und Steuerungsbereich nochmal übersichtlicher gemacht.
- Bäume lassen sich jetzt mit der Axt fällen und geben Holz.
- Gefällte Bäume bleiben weg und wachsen nach 24 Stunden wieder nach.
- Weniger einzelne Bäume, dafür mehr zusammenhängende Waldgebiete.
- Gruppen- und Gildeneinladungen lassen sich jetzt ablehnen.
- Gruppen und Gilden lassen sich jetzt verlassen.
- Die eigene Basis steht jetzt auf der Karte als „MEINE BASIS“.
- Ein Fehler im letzten Update wurde behoben.
- Hilfe- und Steuerungsbereich ist jetzt auf verschiedenen Bildschirmgrößen besser lesbar.
- Die Welt läuft jetzt flüssiger, besonders bei vielen Objekten.
- Beim Tod landen die mitgeführten Gegenstände jetzt in einer Todesloottasche.
- Todesloottaschen lassen sich auf Desktop und Mobilgeräten aufheben und verschwinden nach 15 Minuten.
- Nach dem Tod gibt es ein festes Startinventar und du kannst deinen Respawn auswählen.
- Aufgenommener Todesloot bleibt jetzt auch nach erneutem Login erhalten.

### Alpha 0.1.8

Quelle: `game-development.html`; Source-Key: `homepage/game-development/alpha/0.1.8`; Reihenfolge: 6; Datum: **DATUM UNKLAR**.

- Die Spielseite zeigt aktuelle Spieler und registrierte Spielaccounts getrennt an.
- Als online gelten nur Spieler, die wirklich mit dem Spielserver verbunden sind.
- Der Vollbild-Button startet und beendet den Vollbildmodus wieder richtig.
- Spielbare Inhalte, laufende Entwicklung und geplante Erweiterungen sind klarer getrennt.
- Boden, Wasser, Straßen und Wälder nochmal angepasst.
- Gebäude, Lootkisten und größere Objekte heben sich jetzt besser von der Umgebung ab.
- Nachladen, Loot, Bauen und Fahrzeuge haben neue, dezente Soundeffekte.
- Über F10 lassen sich Gesamtlautstärke, Soundeffekte und Umgebung getrennt einstellen.
- Bei Fahrzeugen siehst du jetzt besser, ob sie kaputt, frei, besetzt oder unterwegs sind.
- Auf Handy und Tablet lassen sich Nickname und Passwort jetzt direkt im Login eingeben.
- Bestehende Basen anderer Spieler werden beim Betreten der Welt wieder richtig geladen.
- Probleme mit fehlerhaften Sonderzeichen wurden behoben.
- Anmeldung und Registrierung auf Handy und Tablet nochmal angepasst.
- Fahrzeuganzeige und Fahrzustand nochmal angepasst.
- Der mobile Feuerbutton liegt nicht mehr über der Minikarte und reagiert besser auf Berührung.
- Deine letzte Position wird jetzt besser gespeichert und beim nächsten Login wiederhergestellt.
- Vor dem Login siehst du jetzt die vorbereitete Serverauswahl für weitere Spielserver.
- Auf Mobilgeräten reagieren Schießen, Nahkampf und Inventar-Tabs jetzt besser auf Berührung.
- Der Loot-Reset-Timer startet nach einem Reset wieder korrekt neu.
- Missionskisten können jetzt wie normales Loot aufgehoben werden.

### Alpha 0.1.7

Quelle: `game-development.html`; Source-Key: `homepage/game-development/alpha/0.1.7`; Reihenfolge: 7; Datum: **DATUM UNKLAR**.

- Mehr Lootkisten auf der ganzen Karte verteilt.
- Beim Aufheben siehst du jetzt direkt, was du bekommen hast.
- Das Baumenü zeigt richtig an, was du mit deinen Materialien bauen kannst.
- Nägel als Baumaterial machen keine Probleme mehr. Vorhandene Nägel bleiben erhalten.
- Beim Bauen siehst du jetzt genauer, warum etwas nicht platziert werden kann.
- Lootkisten werden beim Betreten der Welt wieder richtig geladen.
- In den vier Startstädten gibt es jetzt mehr Lootkisten.
- Der geschützte Baubereich an der Basis ist jetzt besser zu erkennen.
- Hilfetexte und Basisanzeigen nochmal klarer gemacht.
- Dein Fortschritt wird beim Spielen und Abmelden besser gespeichert.
- Mobil: Der Feuerbutton feuert Einzelschusswaffen und liegt nicht mehr über der Karte.
- Mobil: Abmelden reagiert direkt auf Berührung.
- Inventar: Eigene Slots für Helm, Oberteil und Hose.
- Spielstände werden im Browser besser geladen.
- Der zuletzt gespeicherte Fortschritt wird beim Anmelden genauer wiederhergestellt.
- Dein Konto-Fortschritt wird beim Anmelden besser geschützt geladen.
- Ein Ladefehler kann deinen gespeicherten Fortschritt nicht mehr versehentlich ersetzen.
- Der Spielstart im Browser läuft stabiler.
- In Städten, Häusern und wichtigen Gebäuden findest du jetzt mehr Loot.
- Lootkisten kommen nach fünf Minuten wieder, auch wenn dein Browser-Tab nicht aktiv ist.

### Alpha 0.1.6

Quelle: `game-development.html`; Source-Key: `homepage/game-development/alpha/0.1.6`; Reihenfolge: 8; Datum: **DATUM UNKLAR**.

- Gäste starten unabhängig und übernehmen weder Kartenaufdeckung noch Fortschritt eines anderen Kontos.
- Speichern und Laden zeigen jetzt klarer, ob dein Fortschritt übernommen wurde.
- Mit P siehst du Rang, dauerhafte Punkte und erreichte oder gesperrte Meilensteine.
- Figur und Ausrüstung links, Inventar mit Drag-&-Drop rechts.
- Beim Einsteigen übernimmst du das Fahrzeug sichtbar. Es fährt mit dir und bleibt am Ausstiegsort stehen.
- Helm, Oberteil und Hose werden wieder richtig geladen und gespeichert.
- Prestige-Menü nochmal angepasst: Ziele, Rangfolge, Fortschritt und kommende Freischaltungen klarer getrennt.
- Feste Slots für Primärwaffe, Sekundärwaffe, Werkzeug, Rucksack und Weste sowie sechs Schnellslots.
- Dein Konto-Fortschritt und deine Kartenaufdeckung bleiben beim Anmelden besser erhalten.
- Die Website zeigt aktive Spieler jetzt besser an.
- Eigene Tasten für Waffenwechsel, Bauen, Prestige, Hilfe, Gruppe und Karte. Touches im Baumenü lösen keinen Schuss mehr aus.
- Die Karte ist wieder seltener Zufallsloot. Bestehende Charaktere bekommen sie beim Laden zurück.
- Bereits erreichte Punkte sind beim Laden besser vor Verlust geschützt.
- Du startest erst, wenn dein gespeicherter Charakterstand vollständig bereit ist.
- Punkte, Inventar und Position werden regelmäßig und beim Abmelden gespeichert.
- Ein sichtbares X schließt am Handy Inventar, Gruppe, Handel, Lager, Bauen und Prestige.
- Der Prestige-Rang steht jetzt direkt vor deinem Namen im HUD und in der Gruppenliste.
- Der Bauen-Tastaturblock wurde repariert. Desktop und Mobile laufen wieder getrennt.
- Slots 4 bis 6 sind antippbar. DREHEN richtet die aktuelle Bauvorschau um 90 Grad aus.
- Neuer Kleidung-Reiter mit Slots für Helm, Oberteil und Hose. Angelegte Teile ändern die Figur sichtbar.

### Alpha 0.1.5

Quelle: `game-development.html`; Source-Key: `homepage/game-development/alpha/0.1.5`; Reihenfolge: 9; Datum: **DATUM UNKLAR**.

- Erzadern, Spitzhacke, Angel, Fischfang sowie Kupfer, Silber und Gold.
- Welt-Events mit Konvois, Forschungsstationen, Horden, Banditenlagern und Abwürfen.
- Fahrzeuge tauchen jetzt nahe Straßen auf statt an festen Spawnpunkten.
- Rucksäcke, Kleidung, Hosen, Stiefel und Helme als Loot.
- Weste, Hose, Rucksack und Helm sind am Charakter sichtbar.
- Baumdichte und Sektoren der großen Karte nochmal angepasst.
- Login, Fenstertitel und Ladebild heißen jetzt überall Zombiehölle Survival.
- Ingame-Logout und lokaler Spielstand für den Charakterstil.
- Handy-Erkennung und mobile Bedienelemente vorbereitet.
- Basisflagge, geschützter Radius und langfristige Basisaktivität.
- Mehr Holz-, Stein- und Metallteile sowie Türen, Tore und Garagentore.
- Lager, Werkbänke, Wasser- und Versorgungsobjekte vorbereitet.
- Adminbase mit Safe Zone, Wachen, Händlern und Fahrzeugbereich erweitert.
- Browser-Version und gemeinsames Spielen nochmal angepasst.
- Gemeinsame Weltzeit und Loot-Reset alle fünf Minuten.
- Neue Spieler starten mit Karte und Minikarte.
- Hinweis zur lootfreien Adminbase beim Spawn ergänzt.
- Eigene Symbole für Inventar und Schnellleiste.
- Getrennter Login für bestehende, neue Spieler und Gäste.
- Spielwelt, Fahrverhalten und Fahrzeugdarstellung nochmal angepasst.

### Alpha 0.1.4

Quelle: `game-development.html`; Source-Key: `homepage/game-development/alpha/0.1.4`; Reihenfolge: 10; Datum: **DATUM UNKLAR**.

- Große offene Spielwelt mit Städten, Dörfern, Küste, Wäldern und Landstraßen.
- Tag-/Nachtwechsel sowie Wetter, Nebel und Regen vorbereitet.
- Zufallsloot mit Common, Uncommon, Rare, Military und Legendary.
- Hunger, Durst, Leben, Blutverlust, Erschöpfung und Heilung.
- Pistolen, Gewehre, Munition, Axt und Nahkampf.
- Zombies mit Sicht, Schießen, Horden und verschiedenen Varianten.
- Fahrzeuge mit Reifen, Batterie, Motor, Tank und Kofferraum.
- Baumenü mit Holz, Stein, Metall, Fallen, Versorgung und Elektronik.
- Basisflagge mit Schutzradius und Langzeit-Speicherung.
- Handelsplatz und Safe Zone mit Händlern und Wachen.
- Geld, Punkte, Rangliste und Belohnungen.
- Inventar, Raster, Schnellleiste und Mausbedienung.
- Karte, Kompass, Erkundung und markierte Adminbase.
- Gruppen, Clans, Einladungen und Gruppenanzeige.
- Ingame-Chat und Anzeige für Online-Spieler.
- Konten und gespeicherter Fortschritt vorbereitet.
- Das Spiel startet direkt auf der ZH-Game-Seite im Browser.
- Spawnstädte mit Krankenhaus, Tankstelle, Werkstatt und Fahrzeugen.
- Adminbase mit Checkpoint, Wachtürmen, Händlern und Schutzbereich.
- Grundlegende mobile Steuerung und Vollbildmodus vorbereitet.

### Alpha 0.1.3

Quelle: `game-development.html`; Source-Key: `homepage/game-development/alpha/0.1.3`; Reihenfolge: 11; Datum: **DATUM UNKLAR**.

- Erste große Online-Spielwelt mit Städten, Spawnpunkten, Karte, Gruppen, Chat, Inventar und gespeicherten Profilen.

### Alpha 0.1.2

Quelle: `game-development.html`; Source-Key: `homepage/game-development/alpha/0.1.2`; Reihenfolge: 12; Datum: **DATUM UNKLAR**.

- Grundlagen für Survival: Leben, Hunger, Wasser, Loot, Zombies, Waffen, Bauen und Fahrzeuge.

### Alpha 0.1.1

Quelle: `game-development.html`; Source-Key: `homepage/game-development/alpha/0.1.1`; Reihenfolge: 13; Datum: **DATUM UNKLAR**.

- Erster spielbarer Prototyp mit Chernarus-inspirierter Draufsicht und lokaler Spielwelt.

### Update cities, buildings, roads and loot

Quelle: `C:/Users/sebbo/OneDrive/Dokumente/Spiel/zh-survival/CHANGELOG.md`; Source-Key: `game/CHANGELOG.md/update-cities-buildings-roads-loot`; Reihenfolge: 14; Datum: **DATUM UNKLAR**.

## Update cities, buildings, roads and loot

- Die vier Startstädte Nord, Ost, Süd und West wurden überarbeitet.
- Straßen, Gehwege und Straßenobjekte wurden neu aufgebaut.
- Haus1 bis Haus5 wurden ergänzt und überarbeitet.
- Büro, Hochhaus, Industrie, Garage, Kirche, Krankenhaus, Lagerhalle, Polizei, Supermarkt, Tankstelle und Werkstatt wurden ergänzt und überarbeitet.
- Gebäude sind begehbar und haben passende Innenräume.
- Zugänge und Kollisionen an Gebäuden wurden korrigiert.
- Fehlerhafte graue Flächen und alte Wasserblocker wurden entfernt.
- Das Loot-System wurde auf Gebäude und Räume abgestimmt.
- Loot wird serverseitig gespeichert, synchronisiert und gegen Duplikate abgesichert.
