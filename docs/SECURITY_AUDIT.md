# Sicherheits-, Auth- und Datenschutzprüfung – 15.10.2026

Begonnen am 15.10.2026, lokal abgeschlossen am 16.10.2026 (Europe/Berlin).

## Gesamturteil

**H01 – BEHOBEN am 16.10.2026:** Die zusätzliche öffentliche Gästebuch-SELECT-Policy wurde nach ausdrücklicher Freigabe produktiv entfernt. Freigegebene Einträge bleiben öffentlich lesbar; ungeprüfte Inhalte sind nur für echte Admins lesbar. Produktive Policy-/Rollen-/REST-Prüfungen und DE/EN-Frontendprüfung sind bestanden. Alle fünf Gästebucheinträge sind unverändert; Details und Nachweisgrenzen stehen unter H01.

**Kein bestätigter kritischer Befund**, kein gefundener privilegierter Browser-Schlüssel und keine nachgewiesene Rolleneskalation oder fremde Forum-/Pulse-Löschberechtigung. Das ist kein Nachweis, dass sämtliche möglichen Angriffe ausgeschlossen sind. Es bestehen die unten konkret beschriebenen Missbrauchs-, Hosting- und Auth-Härtungspunkte.

Ausgangspunkt: `main`, Commit `4c9d57a22b258c3d75cdbec3fd8559cf7718cb52`. Die 24 vorbestehenden lokalen Wiki-/Galerie-SQL-/Validierungsdateien wurden als fremder Bestand mit SHA256 gesichert und nicht bearbeitet. Der ursprüngliche Audit enthielt keine produktive SQL-Ausführung. Am 16.10.2026 wurde ausschließlich die danach freigegebene H01-Migration angewendet. **Kein Commit, Push, Deployment oder Webexport.** Bereits installierte Migrationen wurden nicht erneut ausgeführt. Die übrigen Matrizen und ursprünglichen Testresultate dokumentieren weiterhin den Audit-Snapshot vor dieser Korrektur.

## Belege und Umfang

- Produktiver Supabase-Katalog ausschließlich lesend: **32 Tabellen, 35 Policies, 96 Anwendungsfunktionen, darunter 61 SECURITY DEFINER, zwölf benutzerdefinierte Trigger, drei Storage-Buckets**, Grants, Constraints, Indizes, Migrationen und Sicherheits-Advisors.
- Drei produktive Edge-Funktionen mit tatsächlichem Quelltext und absichtlich nicht autorisierten HTTP-Probes geprüft. Keine Server-Tokens oder Service-Role-Werte abgefragt oder ausgegeben.
- Aktueller Textbestand, Auth-/Admin-/Identity-/Forum-/Pulse-/Galerie-/Upload-/Footer-/Handoff-Pfade und DOM-Sinks verfolgt. Engineexporte und historische Validierungsartefakte wurden erfasst, aber nicht als neu zu bearbeitender Spielquellcode behandelt.
- Zusätzlicher roher Secret-Musterscan über 818 Dateien / rund 1,34 GB, einschließlich binärer Auslieferungsdateien. Die 16 WASM-Treffer sind nullterminierte PEM-Header-/Footer-Konstanten des Parsers, keine vollständigen Schlüsselblöcke. Die beiden Textkandidaten im Handoff sind ausdrücklich Platzhalter. Kein bestätigter privater Schlüssel gefunden. Komprimierte/verschlüsselte Einbettungen und Bildpixel wurden dabei nicht semantisch decodiert; Git-History wurde nicht als vollständige Forensik durchsucht.
- Elf produktive Homepage-/Dokumentrouten, öffentliche und verweigerte REST/RPC-Zugriffe, aktuelle SDK-Version/Bytes/Integrität, Auth-Einstellungen und WSS-Handshake geprüft.
- **50 isolierte SQL-Verhaltenstests bestanden**, mit den 96 tatsächlichen Funktionsdefinitionen, Policies, Constraints und Triggern. Reiner In-Memory-PostgreSQL-Test, keine produktiven Account-/Foruminhalte kopiert. Auth-UUID/JWT-Claims wurden nur dort simuliert; dies beweist keine echte JWT-Signaturprüfung des Supabase-Gateways.
- **31 offline Frontend-Regressionsprüfungen bestanden**: Escaping, Bild-URL-Allowlist, Rücksprungziele, Origin-/Window-Bindung der Game-Bridge, keine Credentials in Benachrichtigungen, Logout/Expiry/ungültige Session.

Vollständige Begleitdateien:

- [RLS-Matrix einschließlich sämtlicher Policies und Storage](SECURITY_RLS_MATRIX.md)
- [Alle 96 Funktionen einzeln, einschließlich aller Definer](SECURITY_FUNCTIONS_MATRIX.md)
- [Frontend-Sink-Matrix und Datenquellen](SECURITY_SINKS_MATRIX.md)
- [Maschinenlesbare SQL-/HTTP-Testresultate](SECURITY_TEST_RESULTS.json)
- [Erfasste Dateien, unveränderte Fremdänderungen und externe Belege](SECURITY_FILES_REVIEWED.md)

## Hoher Befund

### H01 – BEHOBEN: Gästebuchfreigabe schützt den API-Lesezugriff

- **Objekt:** `public.guestbook`, Policies `Enable read access for all users` und `Allow public read approved entries`; Frontend `assets/js/main.js`, Funktion `loadGuestbookEntries`.
- **Angriffsweg:** Ein Gast verwendet den öffentlich benötigten anon-Key und fragt die REST-Tabelle ohne Freigabefilter ab. Die zusätzliche permissive SELECT-Policy `USING(true)` gilt für PUBLIC und wird mit der gewünschten `approved=true`-Policy ODER-verknüpft. Der bisherige Frontend-Platzhalter für ungeprüfte Nachrichten ist kein Datenschutzschutz.
- **Auswirkung:** Ungeprüfte Namen/Nachrichten können vor der Moderation gelesen werden. Im Inventursnapshot fünf gespeicherte Einträge, null ungeprüfte; damit kein behaupteter aktueller Nachrichtenabfluss. Ein zukünftiger neuer Eintrag würde betroffen sein.
- **Status / behoben:** Backend produktiv JA, am 16.10.2026 nach ausdrücklicher Nutzerfreigabe. Die Policy `Enable read access for all users` existiert nicht mehr. Von den zwei verbleibenden SELECT-Policies erlaubt eine ausschließlich `approved=true` für anon/authenticated, die andere ausschließlich `is_zh_admin()` für authenticated; keine ALL-Policy. RLS bleibt aktiv. Alle übrigen sechs Gästebuch-Policies sind exakt unverändert.
- **Tatsächlich angewandter Fix:** [20261015214609_homepage_guestbook_read_security.sql](20261015214609_homepage_guestbook_read_security.sql), unveränderte SHA256 `f24ec3bc91a310f7524e03bf4b1741b739235a9693690e85118c277b02734616`. Supabase-Projekt `zhserver` (`yawadxzeyyrozmlrokun`), erfolgreicher Apply und bestätigter Migrationseintrag **`20261016050805_homepage_guestbook_read_security`** (16.10.2026, 05:08:05 UTC / 07:08:05 Berlin). Nur die zusätzliche öffentliche Lesepolicy wurde entfernt; keine anderen Migrationen ausgeführt.
- **Produktive Verifikation:** Anonyme REST-Abfragen mit `approved=eq.true`, `approved=eq.false` und ohne Freigabefilter liefern jeweils HTTP 200 mit 5 / 0 / 5 Zeilen; alle gelieferten Zeilen sind freigegeben. Produktionsabfragen unter anon und unter authenticated mit einer bestehenden normalen Member-UUID bestätigen fünf freigegebene und null ungeprüfte sichtbare Einträge. Manipulierte Admin-/cHa-Metadaten im nur transaktionslokalen Member-Test ändern `is_zh_admin()=false` nicht. Die bestehende Admin-UUID ergibt `is_zh_admin()=true`; das unveränderte Lesepolicy-Prädikat erlaubt Admins auch `approved=false`, während es für Member false bleibt. EXPLAIN ohne ANALYZE für Freigabe und Löschung unter Adminrolle ist erfolgreich; keine Schreibanweisung ausgeführt.
- **Frontend:** Live-Gästebuch auf `https://www.zhserver.de/#guestbook` zeigt in DE und EN alle fünf freigegebenen Einträge, jeweils null erfasste Console-/JS-Fehler. Die lokale bestehende Adminsitzung lädt `/admin/guestbook.html` gegen das produktive Backend und zeigt korrekt „Keine offenen Einträge.“, ohne Consolefehler.
- **Datenintegrität / Nachweisgrenze:** Vorher und nachher fünf Einträge, alle freigegeben, keine ungeprüften; MD5-Aggregat sämtlicher Zeileninhalte unverändert `2af2605d41cd454ac5e849083d5ba291`. Keine Gästebuchdaten angelegt, verändert oder gelöscht. Mangels produktiver pending-Zeile keine echte Freigabe/Löschung und kein positiver Admin-pending-Row-Test; stattdessen aktuelle Produktionspolicies, Read-only-Rollen-/Prädikatprüfungen, nicht ausführende EXPLAIN-Pläne und die bereits bestandenen isolierten pending-Fixturetests. Keine neuen Testkonten oder Accountänderungen.
- **Belege:** Externer Auditordner enthält `guestbook-applied-proof.json` (Policy-/Datenvergleich und Migration) sowie `guestbook-applied-http.json` (anonyme REST-Ergebnisse); siehe Checkpoint. Der historische Kommentar „PREPARED ONLY“ in der SQL-Quelldatei bleibt zur Wahrung der geprüften Datei unverändert; maßgeblich für den Ausführungsstatus sind dieser Bericht und der produktive Migrationseintrag.
- **Rollback:** Die Policy lässt sich ohne Datenrückgewinnung wieder anlegen, öffnet damit aber erneut den Befund. Die auskommentierte genaue Rücknahme steht in der Datei. Bei einem Zugriffsproblem zuerst die erwarteten Policies untersuchen statt pauschal öffentlichen Zugriff wieder zu erteilen.
- **Wichtige Abgrenzung:** `WITH CHECK(true)` beim Gast-INSERT erlaubt **keine** Selbstfreigabe: Der tatsächlich installierte BEFORE-INSERT-Trigger setzt immer `approved=false`. Das ist getestet. Eingeloggte Namen und private Autorenbindung stammen aus `auth.uid()` und dem bestätigten Profil.

PostgreSQL dokumentiert die ODER-Verknüpfung permissiver Policies und die Ausnahme von TRUNCATE vom RLS-Schutz: [Row Security Policies](https://www.postgresql.org/docs/17/ddl-rowsecurity.html).

## Mittlere Befunde und Härtungspunkte

### M01 – Gefährliche Form eines Galerie-HTML-Attributs, lokal behoben

- **Datei/Pfad:** `assets/js/main.js`, `loadLatestGallery`; `assets/js/gallery.js`, `loadGallery`.
- **Vorher:** `image_url` wurde im älteren Latest-Gallery-Template ungeescaped in `src="…"` interpoliert. Ein gespeicherter String mit Anführungszeichen könnte dort HTML-Attribute einschleusen. Die eigenständige Galerie ließ außerdem beliebige HTTPS-Bildorigins zu.
- **Erreichbarkeit:** Neue nichtadministrative Galerie-Inserts sind bereits durch die aktuelle produktive Bucket-URL-Regex begrenzt. Die Prüfung fand null nicht vertrauenswürdige gespeicherte Bild-URLs. Deshalb **kein bestätigter aktuell durch Gäste ausnutzbarer Stored-XSS**, sondern ein gefährlicher Sink bei späteren Imports, Adminänderungen oder schwächeren alten Daten.
- **Fix:** Gemeinsamer `safeGalleryImageUrl` akzeptiert nur das bestehende Projekt, den öffentlichen Galerie-Bucket, flache Rasterdateinamen und keine Query-/Fragment-/Credentialbestandteile. Alte vorhandene Zeitstempel-Dateinamen bleiben gültig. Das HTML-Attribut wird zusätzlich escaped. Beide tatsächlich vorhandenen Galeriebilder laden weiter. Latest-Gallery fordert nur freigegebene Inhalte an.
- **Status:** Lokal behoben JA; produktiv noch nicht veröffentlicht.

### M02 – Alte Abstimmungs-RPC ist ohne serverseitige Deduplizierung wiederholbar

- **Funktionen:** `public.vote_for_feature` → `zh_pulse_private.legacy_vote`; alter Client `assets/js/community-voting.js`.
- **Angriffsweg:** Derselbe anonyme Aufrufer kann den bekannten Legacy-Optionsschlüssel wiederholt schicken. Nur der lokale Browsermarker blockiert das alte UI. Der RPC addiert jedes Mal eine Stimme.
- **Auswirkung:** Alte kumulierte Votes können künstlich erhöht werden. **Die neuen Community-Pulse-Stimmen sind nicht betroffen:** `pulse_poll_id IS NULL` grenzt Legacy-Updates aus; im isolierten Test bleiben echte Pulse-Summen unverändert.
- **Beleg:** Zweimal derselbe anonyme RPC ergibt offline zwei zusätzliche Legacy-Stimmen. Keine produktive Stimme verändert.
- **Status:** Nicht geändert. Vor einer späteren Abschaltung/Absicherung Nutzer der alten Detailseite klären. Entzug des alten Schreib-EXECUTE oder kontrollierte Backend-Deduplizierung benötigt gesonderte Freigabe; kein zweites Votesystem bauen.

### M03 – Öffentliche Zähler und Gastschreibpfade sind nicht robust gegen gezielten Spam

- **Objekte:** `register_visitor`, `register_visitor_period`, `heartbeat_zh_community`, `register_zh_forum_view`, Galerie-Gastuploads, Gästebuch-Gast-INSERT, altes `submit_community_feedback`.
- **Angriffsweg:** Öffentliche Schlüssel sind bewusst öffentlich. Ein Bot kann Browserkennungen rotieren oder den Legacy-Zähler direkt wiederholt aufrufen; UI-Cooldowns/LocalStorage sind keine serverseitige Personenerkennung. Neue Forum-Views deduplizieren echte Account-/Browserkombinationen 24 Stunden, anonyme neue UUIDs bleiben umgehbar. Presence begrenzt Wiederholung derselben Kennung, nicht beliebig viele neue Kennungen.
- **Auswirkung:** Verfälschte Besuchs-/Gast-/Viewzahlen, Spam, Storage-/DB-Kosten. Keine damit verbundene Rollen- oder Fremd-Ownership-Übernahme gefunden.
- **Bestehender Schutz:** Forum 20 Sekunden für neue Themen / drei Sekunden für Antworten, DB-Idempotenz und Sperren; Pulse eine Stimme pro Account/Umfrage; Reaktionen ein Eintrag pro Account/Beitrag. Reaktionen/Profile haben keinen zusätzlichen zeitlichen RPC-Cooldown. Feedback begrenzt lediglich identische Meldungen innerhalb 60 Sekunden.
- **Status:** Dokumentiert, keine produktive Änderung. Bestehende Supabase-Auth-Limits/CAPTCHA-Konfiguration und Cloudflare-Regeln gezielt prüfen, danach minimale serverseitige Limits/Quoten entscheiden. Ein volles Last-/DoS-Testen der Produktion wurde bewusst nicht durchgeführt.

### M04 – Ban-/Sessionwiderruf wirkt bei vielen RPCs nicht sofort auf bereits ausgegebene JWTs

- **Funktionen:** `zh_identity_private.system_role`, Forum-/Pulse-`member_id`, `own_identity` und davon abhängige Aktionen.
- **Befund:** Kontenexistenz, `deleted_at` und `is_anonymous` werden serverseitig geprüft. Ein `banned_until`-/`auth.sessions`-Abgleich fehlt meist; `set_own_display_name` prüft den Ban dagegen ausdrücklich.
- **Angriffsweg/Auswirkung:** Nach einem Auth-Ban oder Sessionwiderruf kann ein noch gültiges Zugriffstoken bis zu seinem Ablauf weiter für diese Aktionen nutzbar bleiben. Ein gültiges JWT ist kein aktueller Session-Datenbankabgleich. Aktuell laut rein aggregierter Prüfung null Auth-Bans. Kein bestehender Benutzer wurde gesperrt oder verändert.
- **Status:** Nicht geändert. Gewünschte Sperrsemantik und Tokenlaufzeit klären; anschließend gemeinsame zentrale Prüfung vorbereiten. Dies ist keine Berechtigung, Spiel-Bans/U01/F01 oder Sessions automatisch umzubauen. [Supabase User Sessions](https://supabase.com/docs/guides/auth/sessions) erläutert JWT-/Session-Laufzeiten.

### M05 – Sicherheitsheader fehlen auf den geprüften Live-Routen

- **Beleg:** Elf Antworten einschließlich Homepage, Account, Reset, Forum, Profil, Admin, Galerie und Rechtstexten: kein CSP/CSP-Report-Only, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-Frame-Options, HSTS, COOP oder COEP. HTTPS funktioniert, WSS-Handshake liefert 101.
- **Risiko:** Weniger Begrenzung bei XSS und externen Ressourcen, mögliche Fremdeinbettung/Klicktäuschung, keine explizite browserseitige Transporthärtung. Dies ist kein für sich nachgewiesener Accountdiebstahl.
- **Status:** Keine Hostingänderung. [SECURITY_HOSTING_PLAN.md](SECURITY_HOSTING_PLAN.md) enthält die tatsächlichen Ressourcen und einen bewusst noch nicht aktiven Report-Only-Vorschlag für den bestehenden Cloudflare-Weg. Kein `_headers`-File mit vorgetäuschter GitHub-Pages-Wirkung, kein blindes COEP/CSP, kein Dedicated-/DNS-Umbau.

### M06 – Auth-Einstellungen benötigen eine bewusste Entscheidung

- **Produktiv verifiziert:** Öffentlicher Auth-Settings-Endpunkt meldet `mailer_autoconfirm=true`, anonyme Auth-Anmeldung ist deaktiviert, E-Mail/Passwort ist aktiv. Der Sicherheits-Advisor meldet deaktivierte Leaked-Password-Protection. Der bestehende Registrierungsclient akzeptiert mindestens sechs Zeichen; die tatsächliche zusätzliche serverseitige Password-Policy wurde über keinen Admin-Settings-Endpunkt bestätigt.
- **Risiko:** Ohne E-Mail-Bestätigung ist die Kontrolle über die registrierte Adresse nicht nachgewiesen. Bei abgeschalteter Bestätigung kann ein direkter Signup-Aufruf Unterschiede für vorhandene Adressen offenlegen; die lokale neutrale UI verhindert keine Enumeration über den Provider selbst. Ein Signup wurde nicht durchgeführt, weil das einen Account oder Bestätigungsmails erzeugen könnte. Diese Enumeration ist deshalb eine aus Einstellungen und dokumentiertem Verhalten abgeleitete Bewertung, kein behaupteter Live-Exploit.
- **Positiv:** Zwei echte Login-Negativprobes, vorhandene Adresse mit zufälligem falschem Passwort und unbekannte Adresse, lieferten identisch HTTP 400 / `invalid_credentials` / gleiche Nachricht. Frontend mappt beide auf dieselbe DE/EN-Meldung. Passwort-Reset zeigt neutralen Versandtext; kein Reset versendet.
- **Status:** Keine Änderung. Bestätigung, CAPTCHA/Provider-Limits, stärkere Password-Policy und Leaked-Password-Protection im bestehenden Projekt freigeben/konfigurieren. SMTP-Passwort wurde nicht gelesen. Siehe [Signup-Verhalten](https://supabase.com/docs/reference/javascript/auth-signup) und [Password Security](https://supabase.com/docs/guides/auth/password-security).

### M07 – Unversionierter Auth-CDN-Code, lokal behoben

- **Dateien:** 17 bestehende HTML-Seiten sowie die SDK-Fallback-Lader in `account.js` und `community-stats.js`.
- **Vorher/Risiko:** `@supabase/supabase-js@2` konnte ohne Repoänderung neue ausführbare Auth-Bibliotheksbytes liefern. Externe Auth-Scripts haben Zugriff auf originweite Tokens.
- **Fix:** Exakt die während dieses Audits bereits ausgelieferte Version **2.118.0** festgeschrieben, kein Major-Upgrade. Native HTTP-Prüfung bestätigt HTTP 200 und identische Bytes/Integrität `sha384-UagCvVPT5XXA0Hx+nJYUAGBFseHT9zBgpJMSebsAxl9lciTwbT+39j5VfRjdP5Tp`. Statische und dynamische Lader setzen SRI und `crossorigin=anonymous`.
- **Abhängigkeiten:** Aktuelle exakte Supabase-Haupt- und fünf Teilpaketversionen per Paketmetadaten und OSV abgefragt; keine Advisories in den Ergebnissen. Das ist ein datierter Advisory-Abgleich, keine Unverwundbarkeitsgarantie. Kein npm-Anwendungsprojekt/Lockfile vorhanden. Font Awesome ist bereits statisch 6.7.2, Google-Fonts-CSS dynamisch; nicht blind mit ungeeignetem SRI versehen.
- **Status:** Lokal behoben; Wiki-Dateien und Gameexporte unangetastet. Es wurde dort auch kein separater Auth-Client eingebaut. [Supabase npm Security](https://supabase.com/docs/guides/security/npm-security) empfiehlt versionsgebundene Abhängigkeiten.

### M08 – Beliebiger Game-Server-Parameter im Homepage-Einstieg, lokal eingegrenzt

- **Datei/Funktion:** `assets/js/game-entry.js`, `startGame`.
- **Vorher:** Ein Link konnte beliebige `?server=…`-Werte in den gestarteten, mit Account-Bridge ausgestatteten iframe weiterreichen, während der sichtbare Status weiterhin den regulären Server prüfte.
- **Risiko:** Ungeprüfte Zielwahl bzw. verwirrende Statusanzeige. Ein tatsächlicher JWT-Abfluss über einen fremden Dedicated wurde in diesem Auftrag **nicht** bewiesen; der kompilierte Game-/Dedicated-Quellpfad wurde nicht verändert oder mit einem Angreiferserver gestartet.
- **Fix:** Der Homepage-Einstieg reicht nur noch den bereits bestehenden Produktionsendpunkt `wss://ws.zhserver.de/ws` als Override weiter. Keine Änderung am Frameziel, Login, Gastlease, Dedicated oder Cloudflare. Normale Links ohne Override bleiben gleich.
- **Restpunkt:** Direkte exportierte `/game/…html`-Aufrufe und die serverseitige JWT-Prüfung sind beim späteren Game-Audit gesondert zu betrachten. Die äußere Homepage-Guard ist dafür kein Beweis. Origin/Window/Pfad/Request-ID/Expiry der Homepage-Bridge sind geprüft und offline negativ getestet.

## Niedrige Befunde / Hygiene

### L01 – Zu großzügige alte Grants und öffentlich aufrufbare Trigger-/Legacy-Funktionen

Viele alte Tabellen besitzen unnötige `TRUNCATE`-/weitere Grants für anon/auth, obwohl CRUD durch RLS blockiert wird. Der RLS-/Function-Anhang nennt alle Objekte. PostgREST stellt keinen allgemeinen TRUNCATE-Endpunkt bereit; kein erreichbarer entsprechender Angriffsweg gefunden. Private/öffentliche Definer haben feste Suchpfade; kein dynamisches SQL und keine CREATE-Schemaprivilegien für Browserrollen gefunden. Alte Trigger-EXECUTE-Grants und public-Definer sind spätere Least-Privilege-Kandidaten. Keine pauschalen REVOKEs an Spieltabellen ausgeführt.

### L02 – Historische interne SQL und alte Exporte sind öffentlich ausgeliefert

`/docs/account_legacy_cha_cleanup.sql` liefert HTTP 200 und enthält die Adresse des **bereits gelöschten Legacy-Spielaccounts** sowie interne Abläufe. **Die aktuelle private Admin-Login-E-Mail wurde im Repo-Textscan nicht gefunden.** Historische SQL nicht nachträglich verändert. Öffentliches Git-History lässt sich durch einen künftigen Pages-Ausschluss ohnehin nicht zurücknehmen. Prüfen, ob `docs/`, `tools/`, `AGENTS.md` und Testseiten im bestehenden Pages-Build ausgeschlossen werden sollen; keine neue Deployment-Infrastruktur eingerichtet. Unter `game/` liegen außerdem alte Exporte v103–v116; nicht blind gelöscht, Abhängigkeiten/Backups müssen vor Bereinigung geprüft werden.

### L03 – Fehlende Feldgrenzen in alten Gasttabellen

Gästebuch-Name/-Nachricht und Galerie-Uploader/-Beschreibung haben keine DB-Längen-/NOT-NULL-Checks, obwohl das UI Einschränkungen hat. Ein direkter Gast-Request umgeht HTML-Maxlength. Aktuell null leere/zu lange Gästebuch-Fixturekandidaten laut Aggregatprüfung; keine vorhandenen Inhalte gekürzt. Sinnvolle spätere Checks mit Daten-Vorprüfung und gesonderter Migration festlegen. Feedback, neue Forumtexte, Pulse und Profil-Bio besitzen dagegen serverseitige Grenzen und passende Constraints.

Auch `create_profile_for_new_user` übernimmt den initialen display_name aus eingereichten Signup-Metadaten, während erst die spätere eigene Namens-RPC den vollständigen Validator nutzt. Der eindeutige case-insensitive Namensindex ist vorhanden; ein entsprechender Längen-/Inhalts-CHECK fehlt. Die öffentlichen Identity-/Profil-RPCs filtern ungültige Namen, Legacy-`get_recent_players`/`get_leaderboard` tun das nicht vollständig. Das ist ein Validierungskonsistenzpunkt, kein belegter Abfluss der privaten Auth-E-Mail und keine Metadaten-Rolleneskalation. Registrierung nicht zum Nachweis in Produktion missbraucht.

### L04 – Public-Bucket bedeutet keine vertrauliche Uploadquarantäne

Alle drei Buckets sind öffentlich, Raster-MIME und Größe eingeschränkt. Ein bekannter Objektpfad bleibt vor Freigabe abrufbar. Galerie-/Feedback-Uploads werden nicht serverseitig neu als Rasterbild decodiert; MIME ist vom Client beeinflussbar. Avatar-UI decodiert und rendert neu, ein direkter Storage-Client kann diesen Frontendschritt umgehen; Backend prüft Pfad, erlaubten MIME und 256-KiB-Grenze, nicht vollständigen Bildinhalt. Kein SVG-/HTML-MIME freigegeben. Keine Behauptung, dass dadurch automatisch same-origin XSS möglich ist: Auslieferung erfolgt vom separaten Storage-Origin; tatsächlicher Browser-MIME-/nosniff-Schutz ist zusätzlich zu prüfen, bevor eine aktive Payload getestet wird. Kein Testupload ausgeführt. Bestehende Gastfunktionen erhalten.

### L05 – Technischer Datenschutztext bildet den aktuellen Bestand nicht vollständig ab

Impressum/Datenschutz sind live HTTP 200 und über Footer erreichbar. Der Datenschutztext nennt GitHub Pages und allgemein technische Daten/Cookies, beschreibt aber Supabase Auth/DB/Storage, Cloudflare, externe Fonts/CDNs, dauerhafte Browserkennungen, Presence, Forum-Views und die heutige Registrierung/Profildarstellung nicht ausreichend konkret. Es wurde **keine juristische Neufassung** erstellt. Nachstehende Dateninventur ist die fachliche Grundlage für eine gesonderte sachkundige Prüfung; keine Aussage, dass einzelne Verarbeitung pauschal rechtmäßig/rechtswidrig wäre.

### L06 – _blank und Secret-Hygiene, lokal verbessert

Sechs Startseitenlinks und drei Rechtslinks im Accountformular erhielten fehlendes `noopener noreferrer`. Die Links und Ziele bleiben bestehen. `_blank`-Öffnen der Game-Bridge verwendet bereits `noopener`. Wiki/GAME-Links wurden nicht verändert. `.gitignore` schützt jetzt lokale `.env`/`.env.*` mit zulässiger `.env.example`-Ausnahme. Es wurden keine bestehenden Dateien gelöscht oder versteckt; die fremden Dateien bleiben sichtbar und unverändert.

## Einordnung älterer Pfade

| Bestand | Klasse | Konsequenz |
|---|---|---|
| Zentrale Auth/Identity/Rollen, Besucher/Presence, Forum/Pulse | KEEP | Bestehende Session und serverseitige Regeln weiterverwenden |
| `admin/admin.js` | KEEP / DEPRECATED-Teilpfad | Konfiguration/Client wird noch von Galerie-/Feedback-Adminseiten genutzt; ältere Loginformularlogik ist kein Grund, die ganze Datei zu löschen |
| `community-voting.js` / `vote_for_feature` | SECURITY-RISK / Legacy | Noch auf game-development.html erreichbar; M02 gezielt lösen, nicht als toten Code still löschen |
| Ältere hidden/restore-Moderation | DEPRECATED | Weiter geschützt; vor Entfernen auf verbleibende Aufrufer prüfen |
| Unnötige alte Grants und Trigger-EXECUTE | CLEANUP | Später begrenzte Rechtekorrektur, kein pauschaler Game-REVOKE |
| Historische SQL/Projekttexte im veröffentlichten Site-Artefakt | SECURITY-RISK (Datenminimierung) | Build-Ausschluss vorbereiten; keine historischen Migrationen umschreiben |
| Alte Gameexporte / test.html | UNCLEAR / DELETE-CANDIDATE | Referenzen und Backupbedarf vor jeder Löschung nachweisen; jetzt erhalten |
| Fremde tools/validation und Wikiänderungen | KEEP | Unverändert lassen; keine Sicherheitsbereinigung auf Verdacht |

## Positive Kontrollen / tatsächliche Berechtigungswege

- **Admin:** `auth.uid()` → private `account_roles.system_role` → `current_is_admin`/`is_zh_admin`; `display_name`, Rang und editierbare Metadaten erteilen keine Rechte. Letzten Admin nicht demotierbar. Die bestehende Admin-UUID und die Rolle wurden nicht geändert. `/admin/` ist eine öffentliche statische HTML-Hülle; sensitive Daten und Schreibrechte sind zusätzlich RPC-/RLS-geschützt. HTTP 200 auf diese Hülle ist kein Auth-Bypass.
- **Forum/IDOR:** Autor serverseitig aus gültiger Auth-ID; ein fremder Request-ID-Replay wird verweigert, Owner/Admin-Prüfung bei Edit, Adminprüfung vor moderativen Aktionen, Topic-/Post-Lockreihenfolge, bestätigtes gezieltes Hard-Delete mit FK-Kaskaden. Verschieben/Anpinnen/Schließen bleiben bestehende Funktionen.
- **Changelog:** DB-Trigger schützt offiziellen Herausgeber, nur Startbeitrag, keine Antworten, keine Dislikes, Likes erlaubt. Auch direkte RPC-Aufrufe wurden in der isolierten DB negativ getestet. Keine reine Button-Sicherheit.
- **Pulse/Reaktionen:** Eindeutige Account-Zuordnung, Unique-Constraints, validierte Zieloptionen, Sperren/Idempotenz, nur eigene Reaktion. Pulse-Admin-Reader/Manage/Delete verweigern Member/Gäste. Keine freie Owner-ID aus dem Browser.
- **Profile:** Direktes Tabellenlesen ist auf eigene UUID beschränkt. Öffentlicher Profil-RPC projiziert nur fachlich benötigte UUID, Name, Datum, Bio, Avatar und bewusst öffentliche Rollenbezeichnung. Keine E-Mail/Authmetadaten. Eigene private E-Mail wird erst nach getUser und Session-/UUID-Raceprüfung im eigenen Profil ausgegeben und beim Identitätswechsel gelöscht. Avatarprofilbindung verlangt eigenen vorhandenen Storagepfad.
- **Rechtliche Zustimmung:** Signup-Metadaten sind eine eingereichte Zustimmungserklärung, keine alleinige Datenquelle. Trigger validiert aktuelle Serverversionen und speichert NEW.id sowie Serverzeit privat. Ohne Zustimmung fehlgeschlagen, keine fremde Änderung erlaubt. Bestehende Accounts unverändert.
- **XSS:** Forum/Pulse/Bio/Profile rendern Nutzerdaten mit Textknoten. Alte Gästebuchtemplates escapen Name/Nachricht. Keine HTML-Erlaubnis, kein Rich-Text-HTML/SVG-Sanitizer erforderlich. Siehe die explizite Sink-Matrix statt pauschaler Regex-Entwarnung.
- **CSRF:** Geschützte API-Aktionen benutzen explizite Bearer-Authorization; kein selbstgebauter privilegierter Cookie-Endpunkt gefunden. Fremde Origins erhalten dadurch nicht automatisch ein Opfer-JWT. LocalStorage bleibt bei same-origin XSS lesbar; deshalb kein „LocalStorage ist sicherer Tresor“-Versprechen. Öffentliche Missbrauchs-RPCs sind separat M02/M03.
- **Rücksprung/Parameter:** `safeNext` bindet Origin/Pfad-Allowlist, sperrt fremde Credentials/Tokenparameter und fängt ungültiges Decoding ab. Forumrouten sind Kategorie-/UUID-Allowlist; Entwürfe werden begrenzt in Maps übernommen. Kein tiefes ungeprüftes Object.assign/Merge aus Query-/Userdaten gefunden.
- **Game-Bridge:** Nur vertrauenswürdiges eigenes Framefenster, exakte Origin und Pfad; niemals Refresh-Token, E-Mail oder Profil-Metadaten im Handoff. Zugriffstoken bleibt Credential-Kandidat; Dedicated muss es unabhängig validieren. WSS tatsächlich 101, keine ws://-Umstellung vorgenommen. Kein zusätzlicher Gasttimer oder Serverumbau.
- **Edge:** `verify_jwt=false` ist hier nicht gleich „offener Persistenzzugang“: Vor JSON/DB-Zugriff ist ein eigener nichtleerer Server-Token erforderlich. Alle drei Funktionsprobes ohne Server-Token wurden mit 401 zurückgewiesen. Service-Role existiert ausschließlich als serverseitige Env-Referenz im geprüften Code, nicht als Browserliteral.

## Technische Daten- und Speicherinventur

| Zweck | Tatsächliche Daten / Speicherung | Öffentlich? |
|---|---|---|
| Auth | Supabase Auth, E-Mail/Passwort-Login, SDK-Session mit Access-/Refresh-Token im Standard-Origin-LocalStorage | E-Mail/Token nicht im öffentlichen Profil; originweiter Scriptzugriff bleibt |
| Öffentliche Identität | UUID, gültiger display_name, created_at; Bio/Avatar; ZH-Member/ZH-Admin; rank_label derzeit null | Bewusste reduzierte RPC-Projektion |
| Rollen | Private UUID→system_role + Zeitpunkt/Zuordner | Tabelle nicht lesbar; öffentliche Rollenbezeichnung bewusst im Forum |
| Einwilligungsnachweis | Private UUID, Terms-/Rules-Versionen, Serverzeit | Nur eigenes Konto |
| Forum | UUID-Autoren, Titel/Text/Zeit, Kategorie/Status; eigene Reaktion; View-Gesamtsumme | Sichtbare Inhalte öffentlich, versteckte Inhalte gefiltert; Roh-Voter-/View-Schlüssel privat |
| Views | SHA256 von Account-/Browserkennung mit letzter Zählzeit, 24h Deduplizierung | Nur Summe; keine IP im Schema. Alte Viewfenster ohne erkennbare automatische Löschfrist |
| Pulse | Fragen/Optionen, UUID-Stimme, Summen | Aktive Umfragen öffentlich, eigene Stimme in eigenem Kontext, keine öffentliche Voterliste |
| Gästebuch/Galerie | Gastname oder servergebundener Accountname, Text/Bildpfad, Zeit, approved; Autor-UUID in privater Zusatztabelle | H01 Gästebuch produktiv behoben am 16.10.2026. Öffentliche Galerie-Bucketdateien separat beachten |
| Besucher | Legacy-Summen; Berlin-Tag und md5(Browserkennung), Trackingstart | Nur Summen über RPC. Keine automatische Löschung historischer Tages-Schlüssel im geprüften Bestand |
| Presence | Browser-UUID, optionale bestätigte User-UUID, last_seen_at | Nur Summen/neuster öffentlicher Name. Aktivfenster 3min; Cleanup >24h beim nächsten Heartbeat |
| Browserkomfort | zh_language; Besucherkennung/-tag; Presence-Kennung/Heartbeat; Forum-Entwürfe; Galerie-Merkungen; Legacy-Votemarker; Revisionssignale | Lokales Gerät, kein Adminnachweis. Drafts/Merkungen können über Logout bestehen bleiben |
| Dritte | GitHub Pages/Cloudflare, Supabase inkl. Storage/WSS, jsDelivr Auth-SDK, cdnjs Font Awesome, Google Fonts/Fonts-CDN | Technische Verbindungsdaten gehen an diese Auslieferer; Social-/Shoplinks nicht automatisch mit Trackingrequests gleichsetzen |

Keine IP-Spalte in den neuen Homepage-Presence-/Perioden-/Viewtabellen gefunden. Das ist keine Aussage über Hosting-/Supabase-/WSS-Infrastrukturlogs. Retention für Tages-/View-Schlüssel und Browserentwürfe muss bewusst festgelegt werden. Keine Daten für diesen Audit gelöscht.

Kein registrierter Homepage-Service-Worker/CacheStorage-Pfad in den verfolgten Laufzeitdateien gefunden. Godot-Konfiguration hat keinen aktiven PWA-Service-Worker; alte Exporte wurden nicht als Anwendungscache ausgeführt. Statische Seiten werden mit `max-age=600` ausgeliefert; private Profilwerte kommen zur Laufzeit aus dem eigenen Auth-Kontext, nicht aus statischem HTML. Normaler Webseiten-CORS-Wildcard für öffentliche statische Assets ist kein Beleg für die Preisgabe privater Bearer-Requests.

## Sichere lokale Änderungen

1. Galerie-Bildquelle validiert/escaped; öffentliche Galerie-/Gästebuch-Lesequeries auf freigegebene Inhalte eingegrenzt.
2. Beliebige server-Weitergabe am Homepage-Spieleinstieg gesperrt.
3. Aktuell verwendetes Auth-SDK auf 2.118.0 mit SRI festgeschrieben, statische Seiten und beide Fallback-Lader.
4. Fehlende _blank-Isolation/Referrerbegrenzung ergänzt; .env-Ignore ergänzt.
5. Kleine permanente Offline-Security-Prüfung ergänzt. SQL-Korrektur nur vorbereitet, nicht angewendet.

**Geänderte bestehende Dateien:**

`.gitignore`; `assets/js/main.js`, `gallery.js`, `game-entry.js`, `account.js`, `community-stats.js`; `index.html`, `game.html`, `game-development.html`, `gallery.html`; `account/index.html`, `account/reset-password/index.html`, `profile/index.html`, `forum/index.html`, `arma/index.html`, `bugs/index.html`, `community-regeln/index.html`, `nutzungsbedingungen/index.html`; `admin/index.html`, `admin/community-pulse.html`, `admin/feedback.html`, `admin/gallery.html`, `admin/guestbook.html`.

Bei den HTML-Dateien beschränkt sich der Diff auf die vorhandene SDK-Zeile und in zwei Dateien auf rel-Attribute. Kein Layout-/Redesignauftrag daraus abgeleitet.

**Neue Dateien:** Dieser Bericht; `SECURITY_RLS_MATRIX.md`, `SECURITY_FUNCTIONS_MATRIX.md`, `SECURITY_SINKS_MATRIX.md`, `SECURITY_FILES_REVIEWED.md`, `SECURITY_TEST_RESULTS.json`, `SECURITY_HOSTING_PLAN.md`, `SECURITY_AUDIT_CHECKPOINT.md`; `20261015214609_homepage_guestbook_read_security.sql`; `tools/security-regression.mjs`.

## Benötigt gesonderte Freigabe / Entscheidung

- **H01 abgeschlossen:** Die gezielt freigegebene Policy-Migration wurde am 16.10.2026 produktiv angewendet und verifiziert. Nicht erneut ausführen.
- **Priorität 2:** Legacy-Voteschreiben und öffentliche Spam-/Quota-Risiken; bestehende Auth-Settings, Leaked-Password-Protection, Bestätigungs-/Sperrsemantik.
- **Priorität 3:** Cloudflare-Header zunächst Report-Only, anschließend gemessene CSP. Veröffentlichungsausschlüsse für interne Dateien im existierenden Pages-Weg; kein History-Rewrite versprochen.
- **Getrennt:** Alte GAME-Exporte, direkter Game-Serveroverride, Dedicated-Tokenprüfung und Spiel-/Sozial-RPC-Härtung nicht ungeprüft mit einer Homepagekorrektur ausrollen.
- **Fachlich:** Datenschutzinventur in eine passende Erklärung überführen; Retention-/Löschkonzept konkret entscheiden.

## Tests, Grenzen und Fortsetzung

`node tools/security-regression.mjs`: 31/31 bestanden. Isoliertes SQL: 50/50 bestanden; alle 96 aktuellen Funktionen geladen. Gästebuchmigration einschließlich Guards zunächst isoliert ausgeführt und Gast/Member/Admin-Verhalten geprüft. Produktiver H01-Apply und gezielte Nachprüfung am 16.10.2026 anschließend erfolgreich; unveränderte übrige Bereiche nicht erneut vollständig getestet.

Echte HTTP-Negativtests sind gewollte 400/401/404/406-Antworten, keine zu kaschierenden Anwendungsfehler. Neue Registrierung, Recovery-Mail/Passwortwechsel, Storage-Testupload sowie produktive Posts/Votes/Löschungen wurden nicht ausgelöst. Ein paralleler Race-/Lasttest auf Produktion wurde nicht durchgeführt. Sperr-/Unique-/Locklogik und sequenzielle Idempotenz sind geprüft; die isolierte Engine simuliert keine echten konkurrierenden Supabase-Verbindungen.

Die bestehende lokale cHa-Sitzung wurde tatsächlich wiederhergestellt, eigenes Profil/E-Mail und Adminübersicht geprüft. Gast-Adminaufruf und öffentliches Profil sind separat geprüft. Ein neuer erfolgreicher Passwortlogin samt erneutem Logout/Login wurde in diesem Audit nicht mit dem privaten Passwort durchgeführt. Kein zweites Testkonto angelegt. Refresh/Logout/Expiry sind im Bridge-Regressionsmodell geprüft; SMTP-Dashboardkonfiguration, produktive Redirect-Allowlist, Auth-Passwortregeln und alle Infrastruktur-Logs wurden nicht pauschal als bestätigt ausgegeben.

Browsermessungen und abschließende Erhaltungs-/Syntaxprüfungen stehen im [Checkpoint](SECURITY_AUDIT_CHECKPOINT.md). Normale Browseraufrufe verwenden die bereits vorhandenen Besucher-/Presence-Aufrufe; es wurden dafür keine gesonderten Testdaten oder parallelen Trackingpfade angelegt.

**STOPP: H01 produktiv behoben. Kein Commit, kein Push, kein Deployment; keine weiteren produktiven Änderungen.**
