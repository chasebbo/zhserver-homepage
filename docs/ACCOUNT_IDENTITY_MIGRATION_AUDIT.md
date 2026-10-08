# Account-Identität: Bestand und Vorbereitung, 08.10.2026

## Verbindlicher Stand

**Keine Namensübernahme und keine Account-/Spieldatenmigration.** `cHa` bleibt
beim bestehenden Legacy-Spielaccount. Der zentrale E-Mail-/Adminaccount bleibt
mit seiner bestehenden UUID und Adminzuordnung erhalten und hat aktuell keinen
Profileintrag. Ihm wird kein Name automatisch zugeteilt.

Die bereits installierte Migration `homepage_own_display_name_editor`
(`20261008142028`) bleibt bestehen. `public.set_zh_own_display_name(text)` und
`zh_identity_private.set_own_display_name(text)` weder entfernen noch zurückrollen.
Diese Untersuchung führt ausschließlich lesende Produktionsabfragen aus.
Keine U01-/F01-Änderung, kein Dedicated-Rollout, Commit, Push oder Webexport.

## Quellen und Grenzen der Untersuchung

- Direkt aus dem bestehenden Supabase-Projekt gelesen: alle 46 Funktionen in
  `public` und den drei `zh_*_private`-Schemas; Anwendungstabellen, UUID-FKs,
  Constraints, Namensindex und öffentliche/Storage-RLS. Keine Passwörter,
  Session-Tokens, Vault-Inhalte oder Storage-PIN-Hashes ausgegeben.
- Beide aktiven Edge Functions gelesen: `base-persistence` v1 und
  `vehicle-persistence` v3. Der vorbereitete `player-state-persistence`-Endpoint
  ist bei dieser Prüfung **nicht produktiv installiert**.
- `game.html` verweist auf `game/survival-v116.html`. Aus dessen vorhandener PCK
  ausschließlich drei Skripte in einen temporären Auditordner gelesen:
  `main.gdc`, `dedicated_server.gdc`, `supabase_service.gdc`. PCK-Format 4,
  Engine-Kennung 4.7.1, Tokenizer-Version 101. Identifikatoren, Konstanten und
  tokenisierte Quellzeilen vollständig gelesen; Längen/Tokenzahlen überprüft.
  **Kein Build erzeugt, geändert oder gestartet.** Konfigurationsskript ausgelassen.
- Aktuelle lokale GDScripts gezielt auf Identität, Gruppen/Clans, Party, Chat,
  Handel, Besitz, Lager, F01 und Bans gelesen. Sie sind neuer als v116 und
  enthalten ausdrücklich noch nicht ausgerollte Account-/Gast-/U01-Arbeit.
- Der tatsächlich laufende Laptop-Dedicated und seine lokalen Ban-/Death-Loot-
  Dateien sind **nicht live ausgelesen**. Die eingebettete Dedicated-Datei in
  v116 ist kein Nachweis für die auf dem Laptop laufende Version. Eine vollständige
  Aussage über dessen aktuellen Arbeitsspeicher und Dateien ist deshalb offen.
- Während der Untersuchung änderte sich `dedicated_server.gd` außerhalb dieses
  Homepage-Auftrags. Die Datei wurde hier ausschließlich gelesen, nicht editiert
  oder zurückgesetzt. Die Party-Namensvergleiche wurden anschließend gezielt erneut
  gelesen; die aktualisierten lokalen Zeilennummern stehen unten.

Private Rohbefunde und Browsernachweise liegen außerhalb des Repositorys unter
`C:\Users\sebbo\AppData\Local\Temp\zhserver-account-cleanup-20261008`.
Die Dokumentation enthält keine private E-Mail-Adresse und keine Zugangsdaten.

## Technische Namensverwendungen

Die v116-Zeilennummern unten stammen aus der Quellzeileninformation des exportierten
Bytecodes; sie sind **nicht** die Zeilennummern der aktuellen lokalen `.gd`-Dateien.

| Ort | Tatsächliches Verhalten | Einordnung / vor einer Migration erforderlich |
| --- | --- | --- |
| Produktiv: `public.invite_to_group(uuid,text)` | `profiles.id` über `lower(display_name) = lower(trim(target_nickname))` suchen; Berechtigung über `auth.uid()`/Leader-Mitgliedschaft; anschließend UUID in `group_members.player_id`, Einladender als `auth.uid()` speichern. | Namenssuche, **kein dauerhafter Besitz per Name**. Eine UUID-Übertragung findet dadurch nicht statt. Für kontrollierte Auswahl Name serverseitig auflösen und danach ausgewählte UUID/Einladung verwenden; bestehende UUID-Mitgliedschaften gesondert behandeln. |
| Produktiv: `public.invite_to_clan(uuid,text)` | Gleicher Namenslookup; Rechte über eigene UUID als Leader/Officer; speichern in `clan_members.player_id`. | Ebenfalls bereits UUID als dauerhafte Mitgliedschaft. Namensauflösung nicht als Migration oder Adminbeweis behandeln. |
| v116 `main.gdc`: 2492–2508 | Nickname wird normalisiert und zu `<nickname>@island-survival.local` zusammengesetzt, für **Login und Signup**. | Echte Namensabhängigkeit des Auth-Logins. Vor Übernahme muss der passende Client den zentralen E-Mail-/Session-Login tatsächlich unterstützen. Nur das Label `cHa` umzubenennen verschiebt diesen Login nicht. |
| Aktuell lokal `main.gd`: 2741–2768 | Zentrale E-Mail-Anmeldung vorbereitet; Eingabe ohne `@` bleibt Legacy-Nickname-Login auf derselben alten Auth-Identität. | Bereits als Kompatibilität vorbereitet, aber kein Beleg für v116-/Laptop-Rollout. Legacy-Anmeldung erst nach ausdrücklicher Migrationsentscheidung stilllegen/umleiten; keine zweite Auth-Identität schaffen. |
| v116 `dedicated_server.gdc`: 834 | Profil wird nach verifizierter UUID geladen, danach `display_name.strip_edges().left(24)` als Netzwerk-Nickname zwischengespeichert. | UUID-Prüfung vorhanden; **24-Zeichen-Kürzung** macht den Namen als Suchschlüssel ungeeignet. Zwei unterschiedliche Namen können denselben gekürzten Nickname bekommen. Aktuell 0 solche Kollisionen, maximal 9 Zeichen im Profilbestand; das beseitigt den strukturellen Fehler nicht. |
| v116 `dedicated_server.gdc`: 1668–1687; lokal `dedicated_server.gd`: 2110–2131 | `party_invite(target_nickname)` sucht unter angemeldeten Peers per zwischengespeichertem Nickname. Einladung wird danach temporär als Ziel-Peer → Leader-Peer gehalten. | Serverseitige Suche ja, aber Auswahl muss auf verifizierte Account-UUID gehen, anschließend aktueller Peer daraus ermitteln. Namen nur als Anzeige mitsenden; abgesicherte Einladung-ID verwenden. |
| v116 `dedicated_server.gdc`: 1690–1699; lokal `dedicated_server.gd`: 2134–2145 | `accept_party_invitation(inviter_nickname)` prüft bestehende Peer-Einladung **zusätzlich per Namensvergleich**. | Vor Migration Namen aus der Annahmeprüfung entfernen; eigene verifizierte UUID und serverseitige Einladung/Inviter-UUID prüfen. Peer-Neuvergabe/Reconnect berücksichtigen. |
| v116 `main.gdc`: 2298, 3222–3240; lokal `main.gd`: 3564–3589 | Party-Einladender/-Mitglied wird als Name im Client gehalten; temporäres `invite_id` enthält den Einladendernamen. | UI/Einladungsvertrag zusammen mit Server ändern: technische Einladung-ID + UUID, Name separat. |
| v116 `main.gdc`: 6525, 11971; lokal `main.gd`: 6984, 12786 | Kartenmarker und Party-Gesundheitsanzeige identifizieren Remote-Mitglieder über `remote_player.nickname == server_party_member`. | Vor Migration/aktivem Namenswechsel auf `player_id` umstellen. Anzeigename bleibt Beschriftung. |
| Produktiv: `public.submit_community_feedback(...)` | Frei eingegebener `player_name` wird gespeichert und zusammen mit Inhalt/Zeitfenster zur Duplikatvermeidung verglichen. **Kein Auth-Namenslookup.** | Gasttext/Anti-Duplikatprüfung, keine Accountidentität oder Ownership. Nicht anhand dieses Textes Inhalte auf Accounts übertragen; spätere Accountzuordnung benötigt bestätigte UUID. |

Die zwei Supabase-Namenslookups entsprechen bereits dem Prinzip „Suche →
serverseitig ermittelte UUID“. Sie sind nicht pauschal kaputt und benötigen keine
willkürliche Neufassung der Mitgliedschaftstabellen. Für neue auswählbare
Suchergebnisse darf die UUID einer bereits bestätigten Auswahl nicht durch einen
später erneut verwendeten Namen ersetzt werden. Namen können geändert oder
neu vergeben werden; alte UUID-Verknüpfungen wandern dadurch niemals mit.

## Weitere geprüfte Bereiche

| Bereich | Verifizierte Identitätsgrundlage / Ergebnis |
| --- | --- |
| Gruppen/Clans | `create_group`, `create_clan`, `accept_*_invite`, `decline_*_invite`, `leave_group`, `leave_clan` verwenden `auth.uid()` und Gruppen-/Clan-UUIDs. `player_groups.owner_id`, `clans.leader_id`, beide Mitgliedschaftstabellen und `group_members.invited_by` sind UUID-FKs. Gruppen-/Clanrollen sind keine Homepage-Adminrechte. |
| Roster, soziale Presence, Einladungslisten | `get_social_roster`, `get_social_presence`, `get_social_invites` verknüpfen UUIDs und geben Namen nur zur Darstellung aus. `update_own_presence` speichert unter `auth.uid()`. Keine eigenständige produktive Freunde-Tabelle/-RPC gefunden; der Freundesmarker nutzt Gruppen-/Clan-Presence. |
| Leaderboard/neue Spieler | `get_leaderboard` verbindet `player_state.player_id = profiles.id`; `nickname` ist Ausgabe, kein Join-Schlüssel. `get_recent_players` ist Namensausgabe ohne Ownership. |
| Profil bei Signup | `create_profile_for_new_user` übernimmt initial `raw_user_meta_data.display_name` als Anzeige und legt Profil/Startinventar mit `new.id` an. Metadaten sind keine Rollenquelle. Die bestehende Unique-Regel ist `lower(display_name)`, die sichere Own-RPC normalisiert zusätzlich per bestehendem Validator. Bei späteren Änderungen serverseitige Namensvalidierung/Whitespace-Normalisierung beim Signup mitprüfen, ohne Profile pauschal öffentlich zu machen. |
| Gästebuch/Galerie | `zh_identity_private.bind_content_name` liest den Profilnamen über die gültige eigene Session; `record_content_author` bindet Inhalte an `auth.uid()` in `content_authors`. Gastname bleibt ungebundener Text. Der vorhandene Gästebucheintrag mit Textname `cHa` hat keine belegte UUID-Zuordnung. |
| Forum | Weiterhin lokale Entwürfe/Vorschau mit derselben eigenen Identity-/Auth-Schicht, kein produktives Themen-/Beiträgebackend. Keine nachträgliche UUID-Zuordnung oder echte Veröffentlichungsfunktion vortäuschen. |
| Öffentliche Homepage-Identität | `own_identity`, `newest_identity`, Community `get_stats` verwenden UUID-Verknüpfungen. Öffentliche Anzeige: geprüfter Anzeigename/Registrierungsdatum; keine fremde E-Mail oder Adminrolle. |
| Own-Name-RPC | `set_zh_own_display_name(text)` akzeptiert **keine Ziel-UUID**. Private SECURITY-DEFINER-Funktion mit leerem `search_path` ermittelt `auth.uid()`, prüft gültigen Account/Namen und nutzt bestehenden Unique-Index. `anon` hat kein EXECUTE. Ändert nur eigenen Profilnamen/-Zeitstempel bzw. legt fehlendes eigenes Profil an. Keine Auth-ID-/Spiel-/Adminmigration. |
| Chat | v116 `send_chat` (1654–1665) ermittelt Sender vom verifizierten Peer; Name ist Nachrichtendarstellung/Snapshot. Lokaler `server_chat.gd` begrenzt über Peer-ID; keine persistente Besitzprüfung nach Namen und keine separate produktive Chat-Tabelle/RPC. Alte Chattexte nicht nachträglich einem neuen Namensinhaber zuschreiben. |
| Handel | Client/Dedicated-Handelsaktionen verwenden den eigenen Peer und dessen Inventar/Spielerdaten; keine Kontosuche per Name gefunden. Kein produktives P2P-Handels-/Freunde-/Trading-RPC oder entsprechende Tabelle vorhanden. Nicht daraus ableiten, dass alle künftigen Handelsfunktionen bereits implementiert sind. |
| Bases/Storage | `player_bases.owner_id` UUID; Base-Einladungen/`members[].player_id` UUID, `members[].nickname`/`owner_name` nur Snapshot. Aktive Base-Edge akzeptiert UUID-Eigentümer nach Server-Token-Prüfung; Caller muss der verifizierende Dedicated sein. Keine freie Client-Namensautorisierung. Lagerinhalt liegt in Parts/`inventory_state`, keine eigenständige produktive Spiel-Storage-Tabelle gefunden. |
| Fahrzeuge | `world_vehicles.owner_id` ist UUID-FK auf `auth.users`; aktiver Vehicle-Endpoint nutzt Server-Token und UUID, `vehicle_id` bezeichnet Fahrzeug. Lokale Claim/Unlock/Driver-Prüfungen nutzen Spieler-UUID/Peer. Kein Anzeigename als Eigentümer gefunden. |
| Spielstand/Inventar | `player_state.player_id`, `player_inventory.player_id` UUID; `get_my_player_state` und `save_my_player_state_if_version` verwenden `auth.uid()`, CAS-Version separat. Freier alter Client-Schreibpfad/U01-Status bleibt ausdrücklich unverändert. Keine Umbenennung als Save-Migration behandeln. |
| Death-Loot/F01 | `death_drops.owner_id` UUID. Lokale dauerhafte F01-Claims/Recovery verwenden `claim.player_id`, Originalversion, `operation_id` und `items.meta.death_loot_receipt`. Keine Namensownership gefunden. Echte Laptop-Beutel-/Claimdatei nicht ausgelesen; 0 DB-Death-Drops beweist **nicht** 0 lokale Beutel/Claims. |
| Bans/Moderation im Spiel | Keine produktive DB-Ban-Tabelle/RPC gefunden. Lokal `dedicated_moderation.gd` hält `user://zh_survival_account_bans.json` nach `account_user_id`/UUID; Name nur Protokoll-/Darstellungssnapshot. Datei und aktive Laptopversion nicht live bestätigt. |
| Homepage-Admin | Bestehende Tabellen-RLS für UPDATE/DELETE von `gallery`, `guestbook`, `community_feedback`: feste zentrale Admin-UUID. Keine Bindung an `cHa`, `authenticated` allein oder editierbare Metadaten. Die lokale UI prüft nun dieselbe UUID mit `getUser()`. |

## Konkrete Datenzuordnung aus Produktion

| Bezug | Legacy-Spielaccount | Zentraler Adminaccount |
| --- | --- | --- |
| Unveränderte Auth-UUID | `c00a3f4e-862c-4e10-bb38-31f2e62a2ac7` | `7ba1fad4-d113-4526-8873-3e3b97e9be7e` |
| Profil | vorhanden, `cHa` | **kein Profileintrag** |
| `player_state` | 1, Version 1665, letzte Änderung 05.10.2026 14:01:07 UTC | 0 |
| `player_inventory` | 1, letzte Änderung 02.08.2026 18:36:11 UTC | 0 |
| Eigene Gruppen | 2 | 0 |
| Eigene Gruppenmitgliedschaft/-einladung | 4: 2 × Leader/accepted, 2 × Member/invited | 0 |
| Verweise `group_members.invited_by` | 4, inklusive der 2 eigenen Leaderzeilen | 0 |
| Vereinigung `player_id` ODER `invited_by` | 6 unterschiedliche Zeilen; keine 6 eigenen Mitgliedschaften | 0 |
| Clanführung | 0 | 0 |
| Clanmitgliedschaft/-einladung | 1 × Member/invited, noch nicht accepted | 0 |
| Eigene DB-Bases / UUID in Parts fremder Bases | 0 / 0 | 0 / 0 |
| Eigene Fahrzeuge / DB-Death-Drops | 0 / 0 | 0 / 0 |
| Spiel-Presence-Zeile | 1 | 0 |
| Community-Presence beim Snapshot | 0 | 1; flüchtiger Status, kein Spielbesitz |
| Storage-Objekte nach `owner`/`owner_id` | 0 | 1 im Bucket `gallery` |
| UUID-zugeordnete Homepage-Inhalte | 0 | 0 |
| Rechtliche Zustimmungszeilen | 0 | 0; bestehende Accounts weiterhin nicht ausgesperrt |
| Auth-Identitäten | 1 | 1 |

Dies ist ein lesender Snapshot, keine Übertragung. Auth-Integrität, Profil-,
Spielstand-, Inventar-, Base-, Fahrzeug-, Death-Drop-Daten und Admin-/Storage-
Policies stimmen im erneuten Vergleich mit dem ursprünglichen Audit überein.
Verglichen wird derselbe JSON-/Hash-Ausdruck; einzelne Objekt- und Array-Hashes
sind nicht untereinander austauschbar. Flüchtige Presence kann sich unabhängig
davon durch echte Besuche verändern.

## Zielarchitektur

1. Dauerhafte technische Identität: unveränderte `auth.users.id`/UUID. Profil,
   Autor, Besitzer, Mitglied und Moderationssubjekt verweisen darauf.
2. `profiles.display_name`: öffentliche Anzeige und Suchtext. Nach serverseitiger
   Suche wird die ausgewählte UUID verwendet. Keine Besitz-/Save-/Banprüfung und
   keine dauerhafte Mitgliedschaft ausschließlich über einen Namen.
3. Peer-ID: nur aktuelle Verbindung. Serverseitig an bestätigte UUID gebunden;
   Reconnect darf keine alte Einladung auf einen neu vergebenen Peer übertragen.
4. Name, E-Mail und frei editierbare `user_metadata` erteilen niemals Adminrechte.
   Eigene E-Mail kommt nur aus `auth.getUser()` für die aktuelle eigene Session.
5. Keine zweite Konto-, Rollen-, Profil- oder Presence-Struktur. Öffentliche
   Profil-RPCs bleiben eng; keine pauschale öffentliche Freigabe von `profiles`.

## Spätere kontrollierte Migration: Voraussetzungen und Ablauf

**Plan, keine ausführbare Datenmigration und keine Freigabe.**

1. Beide Accounts ausdrücklich als derselbe Eigentümer bestätigen. Ziel ist
   ausschließlich die bestehende zentrale UUID, niemals den Legacyaccount zum
   Homepage-Admin machen. Auth-IDs, Admin-RLS, E-Mail-Login und Passwortverwaltung
   erhalten. Der Legacy-Authaccount und seine UUID bleiben bestehen.
2. Erst Party-Auswahl/-Annahme, Client-Mitgliedsreferenzen und 24-Zeichen-
   Suchkürzung vom Namen lösen. UUID-/Einladungsvertrag zwischen passenden
   Clients und Dedicated gemeinsam abnehmen. Zentralen Game-Login/Handoff
   tatsächlich freigeben und testen; v116 unterstützt den neuen direkten
   E-Mail-Login noch nicht. Kein beiläufiger U01-/F01-Rollout durch diese Migration.
3. Bestandsaufnahme unmittelbar vor der Freigabe wiederholen. Ziel kann dann
   bereits Profil, Spielstand, Inventar oder Mitgliedschaften haben. Bei
   Konflikten STOPP und eine ausdrücklich bestätigte Entscheidung pro Bereich;
   niemals Inventare/Geld/Versionen addieren oder Zielstände blind überschreiben.
4. Kontrolliertes Wartungsfenster durch gesonderte Freigabe: beide Accounts
   aus aktiven Spielsitzungen, bestätigte Saves abwarten, laufende F01-Claims
   abschließen/gezielt klären; passenden Laptopstand und tatsächliche Ban-,
   Beutel-, Base-, Fahrzeug-/Lagerdateien sichern. Offlineweltzustände und
   konto-eigene lokale Cachepfade berücksichtigen. Nichts löschen/neu initialisieren.
5. Enges, geprüftermaßen vollständiges Backup der betroffenen Zeilen, FKs,
   JSON-Besitz-/Mitgliedsfelder, Hashes, CAS-Versionen/Receipts und Laptopdateien.
   **Nicht** `profiles.id`/`auth.users.id` umschreiben oder alte Profile löschen:
   bestehende FKs haben u.a. ON DELETE CASCADE. Kein globales UUID-/Text-Ersetzen.
6. Einmaliger expliziter Zuordnungsplan für `player_state`, `player_inventory`,
   `player_groups.owner_id`, `group_members.player_id`/`invited_by`,
   `clans.leader_id`, `clan_members.player_id`, `player_bases.owner_id` und
   bestätigte `parts[].members[].player_id`/sonstige Besitzfelder,
   `world_vehicles.owner_id`, `death_drops.owner_id`. Tabellen-PKs von Gruppen,
   Clans, Bases, Fahrzeugen bleiben stabil. Uniqueness-/Mitgliedskonflikte einzeln
   prüfen. Autorzuordnungen/Storage-Eigentümer nur bei belegtem Bedarf behandeln;
   vorhandenes zentrales Galerieobjekt bleibt zentral. Gasttexte niemals nach
   Namen zuordnen; Zustimmungen nicht zwischen Konten kopieren. Presence neu
   aus gültiger Session entstehen lassen, nicht als Accountbeleg migrieren.
7. Spielzustandswerte, Original-CAS-Versionen, Inventarmetadaten und F01-
   Operations-/Receipt-Historie ohne Duplikation bewahren. Eine offene F01-
   Operation nicht per allgemeinem UUID-Replace umhängen. Aktive Autoritäts-
   und Writepfade müssen vorher eindeutig bekannt sein. Legacy darf danach
   keine übertragenen Bestände erneut buchen; dafür getrennten, ausdrücklich
   freizugebenden Login-/Schreibzugang behandeln, ohne alte Auth-UUID zu löschen.
8. Erst nach expliziter Freigabe würde der Unique-Name `cHa` in einer kontrollierten
   Transaktion am Legacyprofil freigegeben und dem zentralen Profil zugeteilt.
   Dafür braucht es einen bestätigten verbleibenden Legacy-Anzeigenamen; kein
   automatisches Umschreiben auf Verdacht. Name ist **Ergebnis**, keine Grundlage
   der Besitzübertragung. Aktuell bleibt beides vollständig aus.
9. Vor Commit der Datenänderung genaue betroffene Zeilenzahlen/FKs/Hashes prüfen.
   Danach echte Account-/Admin-/Nicht-Admin-/Game-/Inventar-/Social-/Ownership-
   Regression, Reconnect/Reload und F01-/Speicherprüfung mit gesondert
   freigegebenen Konten. Bestehende Admin-UUID/-Policies müssen bytegleich bleiben.
10. Rollbackplanung vorab: vor Transaktionsabschluss `ROLLBACK`; nach Abschluss
    nur geprüfte gezielte Rückzuordnung aus dem Snapshot bei stillstehenden
    Writes, mit Erhaltung inzwischen bestätigter Spielvorgänge. SQL allein setzt
    Dedicated-Arbeitsspeicher, lokale Claims und Caches nicht zurück. Kein
    destruktiver Sammeltest und kein Rückbau der installierten Own-Name-RPC.

## Unabhängige Homepage-Änderungen und Veröffentlichungsgrenze

- Privates Profil zeigt eigene, serververifiziert gelesene E-Mail, echten Namen
  oder `—`, Registrierung und Accountstatus. Öffentlicher Header zeigt beim
  namenlosen Account **Account**, keine E-Mail, UUID oder erfundenes `cHa`.
- Neutrale, sichtbare DE/EN-Loginfehler innerhalb des Formulars; Passwörter nach
  fehlgeschlagenem Versuch leeren. Registrierung, Reset und derselbe SDK-
  Session-Speicher bleiben erhalten.
- Sicherer Namenseditor und RPC-Anbindung sind lokal vorbereitet.
  `nameEditingEnabled = false` in `assets/js/account.js`: normales UI blendet den
  Editor aus, verhindert dessen Formulareinsendung und nimmt keinerlei Namen
  automatisch an. Das ist eine **UI-Freigabegrenze**, kein Ersatz für RPC-Rechte.
  Die installierte Own-RPC bleibt serverseitig unverändert bestehen.
- Gemeinsamer lokaler Adminschutz prüft dieselbe bestehende UUID via `getUser()`
  auf allen vier geschützten Seiten, auch nach Logout/Accountwechsel. Kein Name
  oder Metadatenfeld als Adminnachweis. Keine produktive Adminzuordnung geändert.
- Profil/Login und diese Admin-UI-Korrekturen benötigen **keine** cHa-/Spieldaten-
  Migration. Vor tatsächlichem Push bleibt die verlangte echte Regression mit
  bestehendem Adminlogin und einem echten Nicht-Admin erforderlich. Lokale
  Auth-Fixtures ersetzen diesen Nachweis nicht. Hier kein Commit/Push.

### Separater vorhandener Rechtebefund

Die Galerie-Storage-Policies `Admin can update gallery 1vs8c42_0` und
`Admin can delete gallery 1vs8c42_0` prüfen für `authenticated` nur
`bucket_id = 'gallery'`. Sie sind **kein** Adminnachweis und erlauben breitere
Storage-Mutation als die festen Admin-Tabellenpolicies. Zusätzlich existiert
bei Gästebuch/Galerie eine permissive SELECT-true-Policy neben Approved-Policies.
Diese Rechte wurden nicht angelegt oder verändert. Ein UI-Schutz repariert sie
nicht. Gesonderte eng geprüfte Backendkorrektur benötigt eigenen Auftrag/Freigabe;
keine normalen Nutzer durch Live-Schreibtests an produktiven Inhalten prüfen.

### Prüfstand

11 gezielte Chrome-Fixture-Prüfgruppen bestanden: private Profilanzeige, neutrale
Loginfehler, Namenseditor-Vorbereitung, bestehende Registrierung/Reset, gleiche
Session, Admin-UUID-/Nicht-Admin-Abgrenzung und DE/EN/Responsive. 24 DE/EN-Ansichten
bei 1440/768/390/360 px, Adminseiten zusätzlich auf diesen vier Breiten.
Normale JS-/Console-/HTTP-/Request-Fehler sowie horizontale Überläufe 0.
Desktop-/Mobile-Screenshots gesichtet. Drei absichtlich simulierte HTTP-400-
Ablehnungen separat dokumentiert. `git diff --check` sauber; HEAD/Staging sowie
Wiki, `game/` und 19 fremde Wiki-Artefakte unverändert.
Editoraktivierung und RPC-Antworten dabei ausschließlich lokal simuliert.
Keine reale Namensänderung, neue Registrierung oder Moderation in Produktion.
Echte E-Mail-/Passwort-Adminanmeldung und der laufende Laptop bleiben offene
Live-Nachweise; keine Scheinfertigmeldung einer Account-/Spielmigration.

Das rein lesende Bytecode-Verfahren orientiert sich am offiziellen
[Godot-PCK-Reader](https://github.com/godotengine/godot/blob/master/core/io/file_access_pack.cpp)
und [GDScript-Tokenizer-Buffer](https://github.com/godotengine/godot/blob/master/modules/gdscript/gdscript_tokenizer_buffer.cpp).
Es startet weder Client noch Dedicated und ersetzt keinen Test der laufenden
Laptopversion.

### Nachfolgende echte Auth-Abnahme – 08.10.2026

Der oben offene Adminlogin wurde auf dem bestehenden Live-Server Port 5500
mit produktivem Supabase Auth durchgeführt: privates Profil, Header ohne
Anzeigenamen, Reload, Dashboard und Moderationsansichten sowie Logout bestanden.
Neutrale Loginfehler mit echtem Auth geprüft. Keine produktiven Inhalte verändert.

Der Nutzer hat statt eines zweiten Passwort-Logins die serverseitige
Nicht-Admin-UUID-Prüfung ausdrücklich als ausreichend freigegeben. Sieben
produktive Moderationspolicies mit allen elf vorhandenen UUIDs ausgewertet:
jeweils nur eine Admin-UUID zugelassen, alle zehn Nicht-Admins verweigert.
Alle vier direkten Adminseiten nach Logout geschützt. Kein Name/Metadatenfeld
als Adminrolle. Vollständiger Nachweis/Veröffentlichungsstand im
`ACCOUNT_CHECKPOINT.md`; der separate Galerie-Storage-Befund bleibt offen.

Keine cHa-Übernahme, Account-/UUID-/Spieldatenmigration oder neue Supabase-
Migration. Bereits installierte Own-RPC behalten, Namenseditor deaktiviert.
Der anschließende Commit/Push der unabhängigen Homepage-Fixes ist ausdrücklich
beauftragt; dies ist keine Freigabe eines Spielrollouts oder einer Migration.
