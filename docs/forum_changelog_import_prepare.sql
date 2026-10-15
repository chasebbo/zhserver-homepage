-- User-approved 14 publications, with explicitly user-assigned migration dates.
-- Approval received 2026-10-15. Original source dates remain unknown in the inventory.
-- Requires the authenticated official publisher context; never supplies an account UUID.
begin;
do $import$
declare manifest jsonb := $source_manifest$[
  {
    "approved": true,
    "source_key": "homepage/game-development/alpha/0.2.3",
    "source_hash": "4274446d89f0bca51494dc1aa032dbdc5963c7f289ae1dcc23b32832dd81b312",
    "version": "0.2.3",
    "date": "2026-10-07",
    "date_provenance": "user_assigned_migration_date",
    "title": "Alpha 0.2.3 – 14/20 AKTUELL",
    "body": "- Das Bausystem wird stark erweitert: Neue Mauern und passende Ecken wurden hinzugefügt.\n- Gebäude und eigene Basen können künftig abwechslungsreicher mit neuen Fensterwänden gebaut werden.\n- Werkbank und Lagerkisten wurden überarbeitet und als neue Bauobjekte eingefügt.\n- Die neue Adminbasis / Safezone wird als sicherer Treffpunkt vorbereitet.\n- Die Außenmauer der Adminbasis besteht jetzt aus zusammenpassenden Betonsegmenten und Eckverbindungen.\n- Lagerhalle, Garage, Büro und Polizeigebäude der Adminbasis sind modular überarbeitet; Fenster, Dächer und Eingänge passen zur vorhandenen Gebäudeaufteilung.\n- Der Hof der Adminbasis hat neue Schotter- und Asphaltflächen, Entwässerung sowie Fahrbahn-, Park- und Landeplatzmarkierungen.\n- Die vier Händlerstände haben passende Überdachungen und Theken und stehen jetzt im freien Hof statt über den Bürogebäuden.\n- Fundamente, Böden, Dächer, Pfeiler, Zäune und Tore für eigene Basen haben neue, zusammenpassende Grafiken.\n- Versorgungsbauten wie Generator, Solaranlage, Windrad, Wasserpumpe, Filter und Munitionspresse haben eigene, überarbeitete Darstellungen.\n- Betten, Krankenbett und Gewächshaus sind im Baumenü und in der Spielwelt mit den neuen Grafiken eingebunden.\n- Fünf HESCO-Bauteile sind im Abwehr-Baumenü verfügbar: Wand, Kurzsegment, Ecke, Verstärkung und Abschluss.\n- HESCO-Bauten lassen sich im 90°-Raster platzieren. Bauprüfung und Kollision berücksichtigen die tatsächliche Form; die Innenecke bleibt frei begehbar und nutzbar.\n- Am südlichen Zugang der Adminbasis ersetzen HESCO-Wände und Ecken die bisherigen Maueransichten; die breite Zufahrt bleibt offen.",
    "source": "game-development.html",
    "source_line": 375
  },
  {
    "approved": true,
    "source_key": "homepage/game-development/alpha/0.2.2",
    "source_hash": "a68c0c369f8afa6e3b3599db2d955bb73ea5282bb5a5822c9093f4859c57d7b3",
    "version": "0.2.2",
    "date": "2026-09-30",
    "date_provenance": "user_assigned_migration_date",
    "title": "Alpha 0.2.2 – 20/20 ABGESCHLOSSEN",
    "body": "- Startstadt jetzt auch als Gast wählen.\n- Mit STRG hocken und mit SHIFT sprinten.\n- Fahrzeuge beschleunigen, rollen und lenken jetzt natürlicher.\n- Zombies, Todesanimationen und Sounds überarbeitet.\n- Wasser, Brücken, Straßen und alte Grafikfehler weiter bereinigt.\n- Die Begrüßung passt jetzt zur tatsächlichen Startstadt.\n- Gespeicherte Spielerpositionen bleiben beim Anmelden erhalten.\n- Aufgeben und neu starten funktioniert jetzt auch als Gast. Der Account bleibt dabei bestehen.\n- Fahrzeuge laufen im Onlinespiel gleichmäßiger und bleiben seltener hängen.\n- Der Motorsound reagiert jetzt auf Gas und Geschwindigkeit.\n- Alte kaputte Hausreste und beige Straßenstücke entfernt.\n- Baumfällen mit der Axt gibt wieder ein Holz.\n- Schrittgeräusche nochmal angepasst.\n- Die Adminbase sieht jetzt anders aus und hat mehr Details.\n- Die Spielerfigur ist etwas kleiner. Charakter und Waffen nochmal überarbeitet.\n- Axt-Haltung und Schlagbewegung nochmal angepasst.\n- Städte und Gebäude werden schrittweise grafisch überarbeitet.\n- Die Spielwelt bekommt nach und nach neue und schönere Grafiken.\n- Weitere Bauobjekte und Dekorationen kommen hinzu.\n- Das Bausystem wird für den nächsten Testlauf weiter verbessert.",
    "source": "game-development.html",
    "source_line": 397
  },
  {
    "approved": true,
    "source_key": "homepage/game-development/alpha/0.2.1",
    "source_hash": "595ce20c53bee1aa0f2eaa71449030ca57ed0c5d06cfbe73c58492101d51d239",
    "version": "0.2.1",
    "date": "2026-09-23",
    "date_provenance": "user_assigned_migration_date",
    "title": "Alpha 0.2.1 – 20/20 ABGESCHLOSSEN",
    "body": "- Rucksäcke sind wieder deutlich seltener zu finden.\n- Inventar und Schnellleiste nutzen jetzt dieselben Itemgrafiken.\n- Drehbare Bauteile zeigen ihre Ausrichtung jetzt richtig an.\n- Straßen, Feldwege, Zufahrten und Parkflächen nochmal angepasst.\n- Mit BUG / IDEE MELDEN können Bugs und Ideen jetzt direkt aus dem Spiel eingereicht werden.\n- Der neue Survivor-Charakter hat jetzt Richtungs-, Lauf- und Kampfanimationen.\n- Polizei, Krankenhaus, Werkstatt und Tankstellen als Servicebereiche weiter angepasst.\n- Fahrzeugdarstellung, Kamera und Fahreranzeige nochmal angepasst.\n- Zombie-Spawns überarbeitet. Sie sind jetzt anders über die Welt verteilt.\n- Die alten braunen Lootkisten sind raus und wurden durch neue Lootobjekte ersetzt.\n- Die Axt wird jetzt beim Ausrüsten am Charakter angezeigt.\n- Die Axt sitzt jetzt richtig am Charakter und schwebt nicht mehr davor. Schläge gegen Zombies und Bäume passen jetzt besser zur Bewegung.\n- Nord, Ost, Süd und West als Startstädte nochmal komplett überarbeitet.\n- Das Straßennetz zwischen den vier Startstädten wurde verbessert. Dörfer und kleinere Siedlungen sind jetzt besser angebunden.\n- Haus1 bis Haus5 sowie die dazugehörigen Innenräume überarbeitet.\n- Büro, Hochhaus, Industrie, Garage, Kirche, Krankenhaus, Lagerhalle, Polizei, Supermarkt, Tankstelle und Werkstatt als begehbare Gebäude ergänzt.\n- Zugänge und Kollisionen an Gebäuden korrigiert. Fehlerhafte graue Flächen, alte Wasserblocker und alte Gebäudefragmente sind entfernt.\n- Loot steht jetzt passend in Gebäuden und Räumen. Die serverseitige Speicherung und Synchronisierung verhindert doppelte Loot-Aufnahmen.\n- Flüsse und Wasserflächen korrigiert. Brücken lassen sich wieder zu Fuß und mit Fahrzeugen überqueren.\n- Fahrzeuge beschleunigen und lenken jetzt natürlicher, rollen nach dem Gasgeben aus und verhalten sich an Hindernissen besser. Auch die Online-Fahrt und der Motorsound wurden angepasst.",
    "source": "game-development.html",
    "source_line": 425
  },
  {
    "approved": true,
    "source_key": "homepage/game-development/alpha/0.2.0",
    "source_hash": "9f1e650211af38cb1b4df33bbef854266b10ee813897a968a7d52c565b187add",
    "version": "0.2.0",
    "date": "2026-09-16",
    "date_provenance": "user_assigned_migration_date",
    "title": "Alpha 0.2.0",
    "body": "- Online läuft jetzt etwas flüssiger.\n- Spieler und Zombies weit weg werden nicht mehr unnötig mitgerechnet.\n- Ältere Spielstände können neuere nicht mehr versehentlich überschreiben.\n- Unveränderte Inventardaten werden nicht mehr unnötig gespeichert.\n- Die Anzahl der registrierten Spieler wird jetzt zuverlässiger angezeigt.\n- Die Welt läuft flüssiger, weil nur relevante Bereiche und Objekte verarbeitet werden.\n- Große bereits erkundete Kartenbereiche bremsen die Minimap nicht mehr aus.\n- Straßen, Gebäude und andere feste Objekte werden sparsamer gezeichnet.\n- Respawns hängen nicht mehr dauerhaft bei „Respawn wird bestätigt…“.\n- Weit entfernte Spieler, Zombies und Loot belasten den Client weniger.\n- Die Loot-Reset-Anzeige zeigt nach einem Reset wieder den nächsten Countdown an.\n- Prestige-, Missions- und andere Bonuspunkte landen jetzt richtig im Punktestand.\n- Basen lassen sich komplett einpacken. Baumaterial und Lagerinhalt bleiben bis zu 24 Stunden in deiner Basiskiste.\n- Lagerkisten speichern ihren Inhalt jetzt auch über Sitzungen hinweg.\n- Inventar und Ausrüstung nochmal angepasst. Die 35 Grundplätze lassen sich mit Rucksäcken erweitern.\n- Andere Spieler zeigen jetzt ihren vollständigen Namen und den aktuellen Charakter.\n- HUD und Oberfläche nochmal übersichtlicher gemacht.\n- Inventar und Schnellleiste passen jetzt besser zusammen.\n- Boden, Vegetation, Gebäude und die Atmosphäre der Welt nochmal angepasst.\n- Die Steuerungshilfe zeigt jetzt auch I: Inventar an.",
    "source": "game-development.html",
    "source_line": 454
  },
  {
    "approved": true,
    "source_key": "homepage/game-development/alpha/0.1.9",
    "source_hash": "d72e73d9c2eb79873d7e6f873554d3d8cb49357645b9d408cf2a8daeb76026b2",
    "version": "0.1.9",
    "date": "2026-09-09",
    "date_provenance": "user_assigned_migration_date",
    "title": "Alpha 0.1.9",
    "body": "- Der Loot-Reset-Countdown wird direkt nach dem Betreten der Welt richtig angezeigt und aktualisiert sich ohne Loot-Aktion.\n- Neu registrierte Spieler kommen jetzt zuverlässig auf ZHServer 1.\n- Fehlerhafte oder ältere Spielstände brechen das Laden des Inventars nicht mehr ab.\n- Andere Spieler zeigen jetzt ihr richtiges Charaktermodell.\n- Der Prestige-Rang anderer Spieler wird jetzt richtig angezeigt.\n- Die Gruppen-Taste G steht jetzt im Steuerungsbereich.\n- Info- und Steuerungsbereich nochmal übersichtlicher gemacht.\n- Bäume lassen sich jetzt mit der Axt fällen und geben Holz.\n- Gefällte Bäume bleiben weg und wachsen nach 24 Stunden wieder nach.\n- Weniger einzelne Bäume, dafür mehr zusammenhängende Waldgebiete.\n- Gruppen- und Gildeneinladungen lassen sich jetzt ablehnen.\n- Gruppen und Gilden lassen sich jetzt verlassen.\n- Die eigene Basis steht jetzt auf der Karte als „MEINE BASIS“.\n- Ein Fehler im letzten Update wurde behoben.\n- Hilfe- und Steuerungsbereich ist jetzt auf verschiedenen Bildschirmgrößen besser lesbar.\n- Die Welt läuft jetzt flüssiger, besonders bei vielen Objekten.\n- Beim Tod landen die mitgeführten Gegenstände jetzt in einer Todesloottasche.\n- Todesloottaschen lassen sich auf Desktop und Mobilgeräten aufheben und verschwinden nach 15 Minuten.\n- Nach dem Tod gibt es ein festes Startinventar und du kannst deinen Respawn auswählen.\n- Aufgenommener Todesloot bleibt jetzt auch nach erneutem Login erhalten.",
    "source": "game-development.html",
    "source_line": 483
  },
  {
    "approved": true,
    "source_key": "homepage/game-development/alpha/0.1.8",
    "source_hash": "1c7fd9255e9b89255d353cf17a563b09e4ea2e433738ab83c13d6e9deb5d8d41",
    "version": "0.1.8",
    "date": "2026-09-02",
    "date_provenance": "user_assigned_migration_date",
    "title": "Alpha 0.1.8",
    "body": "- Die Spielseite zeigt aktuelle Spieler und registrierte Spielaccounts getrennt an.\n- Als online gelten nur Spieler, die wirklich mit dem Spielserver verbunden sind.\n- Der Vollbild-Button startet und beendet den Vollbildmodus wieder richtig.\n- Spielbare Inhalte, laufende Entwicklung und geplante Erweiterungen sind klarer getrennt.\n- Boden, Wasser, Straßen und Wälder nochmal angepasst.\n- Gebäude, Lootkisten und größere Objekte heben sich jetzt besser von der Umgebung ab.\n- Nachladen, Loot, Bauen und Fahrzeuge haben neue, dezente Soundeffekte.\n- Über F10 lassen sich Gesamtlautstärke, Soundeffekte und Umgebung getrennt einstellen.\n- Bei Fahrzeugen siehst du jetzt besser, ob sie kaputt, frei, besetzt oder unterwegs sind.\n- Auf Handy und Tablet lassen sich Nickname und Passwort jetzt direkt im Login eingeben.\n- Bestehende Basen anderer Spieler werden beim Betreten der Welt wieder richtig geladen.\n- Probleme mit fehlerhaften Sonderzeichen wurden behoben.\n- Anmeldung und Registrierung auf Handy und Tablet nochmal angepasst.\n- Fahrzeuganzeige und Fahrzustand nochmal angepasst.\n- Der mobile Feuerbutton liegt nicht mehr über der Minikarte und reagiert besser auf Berührung.\n- Deine letzte Position wird jetzt besser gespeichert und beim nächsten Login wiederhergestellt.\n- Vor dem Login siehst du jetzt die vorbereitete Serverauswahl für weitere Spielserver.\n- Auf Mobilgeräten reagieren Schießen, Nahkampf und Inventar-Tabs jetzt besser auf Berührung.\n- Der Loot-Reset-Timer startet nach einem Reset wieder korrekt neu.\n- Missionskisten können jetzt wie normales Loot aufgehoben werden.",
    "source": "game-development.html",
    "source_line": 512
  },
  {
    "approved": true,
    "source_key": "homepage/game-development/alpha/0.1.7",
    "source_hash": "81559a7c35eca8110e477b4c2e259657447aa2ac8e7c473fc7ffbbdb13e4e4a0",
    "version": "0.1.7",
    "date": "2026-08-26",
    "date_provenance": "user_assigned_migration_date",
    "title": "Alpha 0.1.7",
    "body": "- Mehr Lootkisten auf der ganzen Karte verteilt.\n- Beim Aufheben siehst du jetzt direkt, was du bekommen hast.\n- Das Baumenü zeigt richtig an, was du mit deinen Materialien bauen kannst.\n- Nägel als Baumaterial machen keine Probleme mehr. Vorhandene Nägel bleiben erhalten.\n- Beim Bauen siehst du jetzt genauer, warum etwas nicht platziert werden kann.\n- Lootkisten werden beim Betreten der Welt wieder richtig geladen.\n- In den vier Startstädten gibt es jetzt mehr Lootkisten.\n- Der geschützte Baubereich an der Basis ist jetzt besser zu erkennen.\n- Hilfetexte und Basisanzeigen nochmal klarer gemacht.\n- Dein Fortschritt wird beim Spielen und Abmelden besser gespeichert.\n- Mobil: Der Feuerbutton feuert Einzelschusswaffen und liegt nicht mehr über der Karte.\n- Mobil: Abmelden reagiert direkt auf Berührung.\n- Inventar: Eigene Slots für Helm, Oberteil und Hose.\n- Spielstände werden im Browser besser geladen.\n- Der zuletzt gespeicherte Fortschritt wird beim Anmelden genauer wiederhergestellt.\n- Dein Konto-Fortschritt wird beim Anmelden besser geschützt geladen.\n- Ein Ladefehler kann deinen gespeicherten Fortschritt nicht mehr versehentlich ersetzen.\n- Der Spielstart im Browser läuft stabiler.\n- In Städten, Häusern und wichtigen Gebäuden findest du jetzt mehr Loot.\n- Lootkisten kommen nach fünf Minuten wieder, auch wenn dein Browser-Tab nicht aktiv ist.",
    "source": "game-development.html",
    "source_line": 541
  },
  {
    "approved": true,
    "source_key": "homepage/game-development/alpha/0.1.6",
    "source_hash": "53c80641ad4d576daf9a6b8e6f1f8ece68d889b4749880f0220f483f40bc8de6",
    "version": "0.1.6",
    "date": "2026-08-19",
    "date_provenance": "user_assigned_migration_date",
    "title": "Alpha 0.1.6",
    "body": "- Gäste starten unabhängig und übernehmen weder Kartenaufdeckung noch Fortschritt eines anderen Kontos.\n- Speichern und Laden zeigen jetzt klarer, ob dein Fortschritt übernommen wurde.\n- Mit P siehst du Rang, dauerhafte Punkte und erreichte oder gesperrte Meilensteine.\n- Figur und Ausrüstung links, Inventar mit Drag-&-Drop rechts.\n- Beim Einsteigen übernimmst du das Fahrzeug sichtbar. Es fährt mit dir und bleibt am Ausstiegsort stehen.\n- Helm, Oberteil und Hose werden wieder richtig geladen und gespeichert.\n- Prestige-Menü nochmal angepasst: Ziele, Rangfolge, Fortschritt und kommende Freischaltungen klarer getrennt.\n- Feste Slots für Primärwaffe, Sekundärwaffe, Werkzeug, Rucksack und Weste sowie sechs Schnellslots.\n- Dein Konto-Fortschritt und deine Kartenaufdeckung bleiben beim Anmelden besser erhalten.\n- Die Website zeigt aktive Spieler jetzt besser an.\n- Eigene Tasten für Waffenwechsel, Bauen, Prestige, Hilfe, Gruppe und Karte. Touches im Baumenü lösen keinen Schuss mehr aus.\n- Die Karte ist wieder seltener Zufallsloot. Bestehende Charaktere bekommen sie beim Laden zurück.\n- Bereits erreichte Punkte sind beim Laden besser vor Verlust geschützt.\n- Du startest erst, wenn dein gespeicherter Charakterstand vollständig bereit ist.\n- Punkte, Inventar und Position werden regelmäßig und beim Abmelden gespeichert.\n- Ein sichtbares X schließt am Handy Inventar, Gruppe, Handel, Lager, Bauen und Prestige.\n- Der Prestige-Rang steht jetzt direkt vor deinem Namen im HUD und in der Gruppenliste.\n- Der Bauen-Tastaturblock wurde repariert. Desktop und Mobile laufen wieder getrennt.\n- Slots 4 bis 6 sind antippbar. DREHEN richtet die aktuelle Bauvorschau um 90 Grad aus.\n- Neuer Kleidung-Reiter mit Slots für Helm, Oberteil und Hose. Angelegte Teile ändern die Figur sichtbar.",
    "source": "game-development.html",
    "source_line": 568
  },
  {
    "approved": true,
    "source_key": "homepage/game-development/alpha/0.1.5",
    "source_hash": "5aaea4d7249b1cec5c7071f08f9df7dc2a947f093ff34d57c62d5b57e142adcc",
    "version": "0.1.5",
    "date": "2026-08-12",
    "date_provenance": "user_assigned_migration_date",
    "title": "Alpha 0.1.5",
    "body": "- Erzadern, Spitzhacke, Angel, Fischfang sowie Kupfer, Silber und Gold.\n- Welt-Events mit Konvois, Forschungsstationen, Horden, Banditenlagern und Abwürfen.\n- Fahrzeuge tauchen jetzt nahe Straßen auf statt an festen Spawnpunkten.\n- Rucksäcke, Kleidung, Hosen, Stiefel und Helme als Loot.\n- Weste, Hose, Rucksack und Helm sind am Charakter sichtbar.\n- Baumdichte und Sektoren der großen Karte nochmal angepasst.\n- Login, Fenstertitel und Ladebild heißen jetzt überall Zombiehölle Survival.\n- Ingame-Logout und lokaler Spielstand für den Charakterstil.\n- Handy-Erkennung und mobile Bedienelemente vorbereitet.\n- Basisflagge, geschützter Radius und langfristige Basisaktivität.\n- Mehr Holz-, Stein- und Metallteile sowie Türen, Tore und Garagentore.\n- Lager, Werkbänke, Wasser- und Versorgungsobjekte vorbereitet.\n- Adminbase mit Safe Zone, Wachen, Händlern und Fahrzeugbereich erweitert.\n- Browser-Version und gemeinsames Spielen nochmal angepasst.\n- Gemeinsame Weltzeit und Loot-Reset alle fünf Minuten.\n- Neue Spieler starten mit Karte und Minikarte.\n- Hinweis zur lootfreien Adminbase beim Spawn ergänzt.\n- Eigene Symbole für Inventar und Schnellleiste.\n- Getrennter Login für bestehende, neue Spieler und Gäste.\n- Spielwelt, Fahrverhalten und Fahrzeugdarstellung nochmal angepasst.",
    "source": "game-development.html",
    "source_line": 593
  },
  {
    "approved": true,
    "source_key": "homepage/game-development/alpha/0.1.4",
    "source_hash": "d7123fa9071c487f3847b3918204e2032e3a1275e077463ad1cfcb7400565f30",
    "version": "0.1.4",
    "date": "2026-08-05",
    "date_provenance": "user_assigned_migration_date",
    "title": "Alpha 0.1.4",
    "body": "- Große offene Spielwelt mit Städten, Dörfern, Küste, Wäldern und Landstraßen.\n- Tag-/Nachtwechsel sowie Wetter, Nebel und Regen vorbereitet.\n- Zufallsloot mit Common, Uncommon, Rare, Military und Legendary.\n- Hunger, Durst, Leben, Blutverlust, Erschöpfung und Heilung.\n- Pistolen, Gewehre, Munition, Axt und Nahkampf.\n- Zombies mit Sicht, Schießen, Horden und verschiedenen Varianten.\n- Fahrzeuge mit Reifen, Batterie, Motor, Tank und Kofferraum.\n- Baumenü mit Holz, Stein, Metall, Fallen, Versorgung und Elektronik.\n- Basisflagge mit Schutzradius und Langzeit-Speicherung.\n- Handelsplatz und Safe Zone mit Händlern und Wachen.\n- Geld, Punkte, Rangliste und Belohnungen.\n- Inventar, Raster, Schnellleiste und Mausbedienung.\n- Karte, Kompass, Erkundung und markierte Adminbase.\n- Gruppen, Clans, Einladungen und Gruppenanzeige.\n- Ingame-Chat und Anzeige für Online-Spieler.\n- Konten und gespeicherter Fortschritt vorbereitet.\n- Das Spiel startet direkt auf der ZH-Game-Seite im Browser.\n- Spawnstädte mit Krankenhaus, Tankstelle, Werkstatt und Fahrzeugen.\n- Adminbase mit Checkpoint, Wachtürmen, Händlern und Schutzbereich.\n- Grundlegende mobile Steuerung und Vollbildmodus vorbereitet.",
    "source": "game-development.html",
    "source_line": 618
  },
  {
    "approved": true,
    "source_key": "homepage/game-development/alpha/0.1.3",
    "source_hash": "437801facb5b3cea55ce88b8cf6317e6067427e4ab34a39f1c83313795fe37b6",
    "version": "0.1.3",
    "date": "2026-07-29",
    "date_provenance": "user_assigned_migration_date",
    "title": "Alpha 0.1.3",
    "body": "- Erste große Online-Spielwelt mit Städten, Spawnpunkten, Karte, Gruppen, Chat, Inventar und gespeicherten Profilen.",
    "source": "game-development.html",
    "source_line": 644
  },
  {
    "approved": true,
    "source_key": "homepage/game-development/alpha/0.1.2",
    "source_hash": "56e1a66eb042568010b1d39920a55cd053ddc4dc2098f7ab2a6da85c9bc74c06",
    "version": "0.1.2",
    "date": "2026-07-22",
    "date_provenance": "user_assigned_migration_date",
    "title": "Alpha 0.1.2",
    "body": "- Grundlagen für Survival: Leben, Hunger, Wasser, Loot, Zombies, Waffen, Bauen und Fahrzeuge.",
    "source": "game-development.html",
    "source_line": 648
  },
  {
    "approved": true,
    "source_key": "homepage/game-development/alpha/0.1.1",
    "source_hash": "84a3ce779826bc982c848ec9024b50c84d4e5c0ce14fc894d30abd96ac2a1a9d",
    "version": "0.1.1",
    "date": "2026-07-15",
    "date_provenance": "user_assigned_migration_date",
    "title": "Alpha 0.1.1",
    "body": "- Erster spielbarer Prototyp mit Chernarus-inspirierter Draufsicht und lokaler Spielwelt.",
    "source": "game-development.html",
    "source_line": 652
  },
  {
    "approved": true,
    "source_key": "game/CHANGELOG.md/update-cities-buildings-roads-loot",
    "source_hash": "fb700e4b8ec1ef68ddadaca5f50699a0db2aec063aecb853ace9b9ab1d106d55",
    "version": null,
    "date": "2026-10-14",
    "date_provenance": "user_assigned_migration_date",
    "title": "Update cities, buildings, roads and loot",
    "body": "## Update cities, buildings, roads and loot\n\n- Die vier Startstädte Nord, Ost, Süd und West wurden überarbeitet.\n- Straßen, Gehwege und Straßenobjekte wurden neu aufgebaut.\n- Haus1 bis Haus5 wurden ergänzt und überarbeitet.\n- Büro, Hochhaus, Industrie, Garage, Kirche, Krankenhaus, Lagerhalle, Polizei, Supermarkt, Tankstelle und Werkstatt wurden ergänzt und überarbeitet.\n- Gebäude sind begehbar und haben passende Innenräume.\n- Zugänge und Kollisionen an Gebäuden wurden korrigiert.\n- Fehlerhafte graue Flächen und alte Wasserblocker wurden entfernt.\n- Das Loot-System wurde auf Gebäude und Räume abgestimmt.\n- Loot wird serverseitig gespeichert, synchronisiert und gegen Duplikate abgesichert.",
    "source": "C:/Users/sebbo/OneDrive/Dokumente/Spiel/zh-survival/CHANGELOG.md",
    "source_line": 3
  }
]$source_manifest$::jsonb; v jsonb;
begin
 if not coalesce((public.get_zh_forum('changelog')->>'can_publish_changelog')::boolean,false) then raise exception 'Official publisher context required'; end if;
 if not exists(select 1 from jsonb_array_elements(manifest) x where (x->>'approved')::boolean) then raise exception '0 approved entries. Historical dates and the unversioned source require user decision.'; end if;
 if exists(select 1 from jsonb_array_elements(manifest) x where (x->>'approved')::boolean and (x->>'date') is null) then raise exception 'Unproven date/version: import blocked'; end if;
 if exists(select 1 from jsonb_array_elements(manifest) x where (x->>'approved')::boolean group by x->>'source_key' having count(*)>1)
 or exists(select 1 from jsonb_array_elements(manifest) x where (x->>'approved')::boolean and x->>'version' is not null group by x->>'version' having count(*)>1) then raise exception 'Duplicate source/version in manifest'; end if;
 for v in select value from jsonb_array_elements(manifest) where (value->>'approved')::boolean loop
  perform public.publish_zh_changelog(md5('zhserver-changelog:'||(v->>'source_key'))::uuid,v->>'version',v->>'title',(v->>'date')::date,v->>'body',null,null,v->>'source_key',v->>'source_hash');
 end loop;
end $import$;
commit;
