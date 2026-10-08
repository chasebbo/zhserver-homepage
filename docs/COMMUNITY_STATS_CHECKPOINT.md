# Globale Community-Statistik – 07.10.2026

## Aktuelle Platzierung: globaler Footer

Die frühere Einbindung im Startseiten-Inhaltsblock bzw. der Forum-Seitenleiste
ist entfernt. Beide Statistikgruppen stehen jetzt im gemeinsamen globalen Footer.
`global-footer.js` wird durch den vorhandenen `visitor-counter.js` geladen und
vereinheitlicht den Footer aller normalen Homepage-Seiten. Besucher-DOM-Knoten
bleiben erhalten; keine neue Datenquelle oder Registrierung. Darstellungs-CSS:
`global-footer.css`, bestehende Community-/Besucher-Styles weiterverwenden.

Die nachfolgenden Angaben zu Datenmodell, Backend und bisherigen funktionalen
Tests bleiben gültig. SQL, Presence-Client und Aktivierung wurden bei der
Platzierungskorrektur nicht verändert. Aktuelle Layoutprüfung steht am Dateiende.

## Stand und Fortsetzung

**Backend eingerichtet, lokale Anbindung aktiviert.** Supabase ist verbunden;
der vorhandene Projektbestand wurde direkt mit der einzelnen rein lesenden
`community_structure_audit.sql` geprüft. Keine manuellen Audit-Abfragen nötig.
Projekt `yawadxzeyyrozmlrokun` / `zhserver`, PostgreSQL 17.6, ACTIVE_HEALTHY.

Die automatische Freigabeprüfung lehnte die produktive Migration zunächst wegen
der neuen Schema-/RPC-/Schreiboberfläche ab. Daraufhin hat der Benutzer ausdrücklich
zugestimmt: „Ja, genau diese Migration anwenden und lokal aktivieren.“
Danach `homepage_global_community_presence` erfolgreich angewendet und geprüft.
`community-config.js` enthält jetzt `enabled: true`. Homepage-Dateien sind weiterhin
lokal; kein Commit/Push/Webexport und keine Veröffentlichung der neuen Oberfläche.

Verifizierter Bestand: 11 nicht anonyme/nicht gelöschte Auth-Accounts, 9 Profile.
Der bestehende Adminaccount ist bestätigt; keine zusätzlichen Adminrollen in
seinem `app_metadata`. Admin-RLS nutzt die vorhandene feste Benutzer-ID.
`player_presence` erfasst ausschließlich Spielpositionen, mit 15 Sekunden Ablauf
und ohne Gästebrowser; sie bleibt unberührt und wird nicht als Homepage-Onlinezahl
verwendet. Es gab keine geeignete bestehende Homepage-Presence-Tabelle.

**Neuestes Mitglied bleibt ehrlich „—“:** `profiles.display_name` existiert,
ist unter bestehender RLS jedoch nur selbst bzw. im Spiel innerhalb akzeptierter
Gruppen/Clans sichtbar. Nicht ungefragt global veröffentlichen. Der RPC liefert
weiterhin `newest_member: null`, `public_name_available: false`. Kein neues Profil,
kein E-Mail-/UUID-/Metadaten-Fallback. Dafür ist später eine explizite Entscheidung
über öffentliche Anzeigenamen nötig.

Nächste Schritte:

1. Diesen Checkpoint und aktuellen Diff lesen; bestehende Wiki-/Forum-/Arma-/Admin-
   Änderungen erhalten. Kein Commit/Push/Webexport ohne ausdrücklichen Auftrag.
2. Die Migration nicht nochmals anwenden: Guards verhindern doppelte Tabellen,
   Überschreiben der RPCs und Verwendung eines unbekannten privaten Schemas.
   Der angewendete Stand bleibt in `community_presence_prepare.sql` dokumentiert.
3. Bestehende zentrale Anmeldung für spätere Homepage-/Forum-Accountoberflächen
   weiterverwenden; keine neue Auth-/Profil-/Rollendatenbasis. Keine automatische
   Reparatur vorhandener Profile oder des Spiel-Account-Triggers.
4. Öffentliche Anzeigenamen und Sichtbarkeit vor Anschluss „Neuestes Mitglied“
   ausdrücklich festlegen. Vorhandenes Profilfeld nutzen, nur freigegebene Daten.
5. Eine echte vorhandene Adminsession später bei normaler Nutzung gegenprüfen.
   Server-Mitgliedseinstufung ist per SQL-Rollen-/Claim-Test bestätigt; keine echten
   Zugangsdaten verwendet, Auth-Browserfluss zuvor mit dem realen SDK und Fixtures.
6. Homepage erst auf ausdrücklichen Commit-/Push-Auftrag veröffentlichen.

## Unabhängige Daten und globale Einbindung

- Besucherstatistik bleibt eigenständig: Heute/Gestern/Woche/Monat/Gesamt.
  Abschnitt `1. VISITOR STATISTICS (FOOTER)` in `visitor-counter.js` ist unverändert:
  Gerätekennung, Legacy-/Perioden-RPCs, Tageswechsel, Tracking-Start und Summen.
- Der alte zweite Abschnitt enthielt simulierte Online-Grundwerte plus Realtime.
  Er ist durch den globalen Loader ersetzt. Kein `zh_online_presence`-Channel mehr.
- Neue Presence: Online insgesamt, Mitglieder, Gäste, unabhängig von Besuchertagen.
- Community: registrierte Mitglieder und neuestes Mitglied. Bestätigte
  Definition: ein nicht gelöschter, nicht anonymer `auth.users`-Account zählt einmal,
  unabhängig von Anzahl seiner Identitäten; vorhandene Adminaccounts zählen mit.
- Startseite und Forum rendern denselben globalen RPC-Vertrag. Keine Forum-eigene
  Statistik, keine erfundenen Themen-/Beitragszahlen, keine öffentliche Nutzerliste.
  Die globale Anzeige steht auf beiden Seiten im Footer.
- Das bereits überall eingebundene Besucher-Script lädt den gemeinsamen Baustein
  auch auf Wiki, Gamepage, Galerie, Bugs, Arma und Rechtliches/Danke. Keine Wiki-
  Datei geändert. `play.html` leitet zur Gamepage weiter; `game/` bleibt unberührt.
- Forum verwendet jetzt den vollständigen Footer der Startseite, vorhandene Styles,
  Links und Besucher-Script genau einmal. Lokale Forum-Entwürfe bleiben erhalten.

## Presence, Session und Ressourcen

- Online = erfolgreiche serverseitige Meldung innerhalb von **3 Minuten**.
  Sichtbare Seite: ein Heartbeat pro Minute. Versteckte Tabs pausieren. Rückkehr,
  Seitenwechsel und Auth-Änderung aktualisieren; kein Mousemove-/Scroll-Tracking.
- Gäste pro zufälliger Browser-UUID; Tabs teilen UUID und letzten Heartbeat.
  Web Locks serialisieren Meldungen, Server-Upsert dedupliziert auch ohne Locks.
- Mitglieder pro Auth-Account, auch über mehrere Geräte. Login/Logout ändern die
  Einordnung derselben Browser-Zeile. Der Client sendet nur `p_browser_id`;
  `auth.uid()` liefert die von Supabase/PostgREST bestätigte Identität.
- Bestehender Client aus `main.js` wird geteilt. Auf Seiten ohne SDK wird erst bei
  Aktivierung das bereits verwendete Supabase-SDK geladen. Gleiches Projekt,
  Standard-Session-Schlüssel `sb-yawadxzeyyrozmlrokun-auth-token`, kein neuer Login.
  Adminrechte werden nicht aus `user_metadata` oder einer normalen Session abgeleitet.
- www/apex und getrennte Geräte teilen keinen Browser-Speicher. Tab-/Session-
  Wiederverwendung gilt auf derselben Origin; Backend-Summen bleiben global.
- BroadcastChannel verteilt nur öffentliche Summen/den öffentlichen Namen,
  keine Identitäten, Tokens oder Raw-Presence-Datensätze.
- Bei gesperrtem lokalem Speicher: Session-Speicher als begrenzter Fallback.
  Reload dedupliziert; unabhängige Tabs können dann getrennte Gäste sein. Sind
  beide Speicher gesperrt, nur Zahlen lesen, keine Presence registrieren.
  Beschädigte Presence-Schlüssel gezielt reparieren; keine Auth-/Besucher-/Draft-
  Daten ändern. Echte 0 bleibt gültig; ungültige Antworten erfinden keine Werte.
- Letzte gültige Antwort maximal 3 Minuten verwenden, danach „—“.
- Vorgeschlagene Presence speichert nur aktuellen Browserzustand, keine Historie,
  Seitenpfade, IPs oder E-Mails. Ablauf bei jeder Aggregation; indexgestütztes
  Entfernen von Datensätzen älter als 24h bei Heartbeats. Bei völlig ruhiger Seite
  bleiben diese bis zur nächsten Meldung gespeichert, zählen jedoch nicht online.
- Browserkennungen sind keine verifizierten Personen und kein Bot-Schutz.
  Keine zusätzliche Realtime-/Cron-/Auth-Infrastruktur in dieser Phase.

## Eingerichteter Backend-Vertrag

`get_zh_community_stats()` und `heartbeat_zh_community(p_browser_id uuid)`:
`online_total`, `online_members`, `online_guests`, `registered_members`,
`newest_member`, `public_name_available`, `sampled_at`, `online_window_seconds`.
Gesamt = Mitglieder + Gäste; keine Rohdaten öffentlich.

SQL-Stand: `public.zh_community_presence` mit RLS ohne Client-Tabellenrechte;
anon/authenticated dürfen ausschließlich Aggregate lesen bzw. den begrenzten
Heartbeat-RPC aufrufen. Die beiden öffentlichen RPCs sind SECURITY INVOKER;
privilegierte Implementierung liegt in `zh_community_private.get_stats()` und
`heartbeat(uuid)`, mit leerem `search_path`, qualifizierten Relationen und
serverseitiger Identität. Nur diese Helper haben explizite EXECUTE-Rechte für
anon/authenticated; keine PUBLIC-Execute-Rechte und keine Service-Keys im Frontend.
Indizes auf `last_seen_at` und dem optionalen `user_id` erhalten kurze Abfragen.
Besucher-, Auth-, Profil- und Rollentabellen sowie deren RLS bleiben unverändert.

**Neuestes Mitglied offen:** Der RPC liefert `null`/`public_name_available=false`,
weil das vorhandene Profilfeld nicht global öffentlich ist. Anzeige eines
bestätigten Namens ist im Frontend vorbereitet: Text ohne HTML/Übersetzung,
E-Mail-/UUID-Werte abweisen. Keine automatische neue Profilstruktur.

## Dateien und Nachweise

Neue gemeinsame Dateien: `assets/js/community-stats.js`, `community-config.js`,
`assets/css/community-stats.css`. Integration: `visitor-counter.js`, minimaler
Client-Zugriff in `main.js`, `index.html`, `forum/index.html`. Übersetzungen:
ausschließlich neue `community.stats.*`-Einträge in `translations.js`.

Die erste Frontendphase verwendete simulierte Community-/Auth-RPCs; ihre Nachweise
bleiben für den unveränderten Presence-Client gültig. Die anschließend ausgeführte
Migration, SQL-Rollenprüfungen und echten RPC-Browsertests stehen am Dateiende.

## Abgeschlossene Prüfung der ersten Frontendphase (Backend noch deaktiviert)

- Lokaler Chrome mit dem tatsächlich verwendeten SDK und simulierten Community-/
  Auth-RPCs: Gast/Mitglied auf Home und Forum, Login/Logout, Seitenwechsel, Reload,
  zweiter Tab, beschädigter/gesperrter Speicher, echte 0, sichere Textausgabe des
  öffentlichen Namens, ablaufende Presence, ungültige Antworten und versteckte Tabs.
- 20 Layoutzustände: Startseite/Forum jeweils DE/EN bei 1440, 1024, 768, 390 und
  360 px; zusätzlich ein langer öffentlicher Name bei 390 px. Kein horizontaler
  Überlauf, keine Überschneidung von Beschriftung und Wert, Footer/alle fünf Werte
  und genau eine Besucher-Script-Einbindung auf beiden Seiten bestätigt.
- Globale Einbindung zusätzlich auf Wiki, Gamepage, Galerie, Bugs, Arma,
  Impressum, Datenschutz und Danke geprüft. Auf derselben Origin bleibt die
  Browserkennung erhalten; kein separates Forum-Online-System.
- In der tatsächlich eingecheckten deaktivierten Konfiguration: keine Community-
  RPC-Anfragen, keine erfundenen Zahlen, DE/EN-Verfügbarkeitshinweis korrekt.
- Echte Produktionsdaten ausschließlich **gelesen**: `get_visitor_stats` und
  `get_visitor_period_stats` HTTP 200. Forum-Footer zeigt alle fünf Rohwerte in
  DE/EN korrekt. Keine produktiven Registrierungs-/Auth-/Presence-Schreibzugriffe.
- Abschließender funktionaler Browserlauf: 0 JS-Fehler, 0 Console-/HTTP-Fehler,
  0 fehlgeschlagene Requests. Responsive-Nachweise aus dem unveränderten vorherigen
  erfolgreichen Layoutlauf übernommen; keine erneute Vollprüfung anderer Bereiche.
- `node --check` für die betroffenen fünf JS-Dateien erfolgreich. SQL-Bestands-
  abfrage statisch als einzelnes reines Lesestatement geprüft; SQL-Migration/RLS
  **nicht** auf einem PostgreSQL-/Supabase-Backend ausgeführt oder abgenommen.
- SHA-256: 663 vorhandene Dateien außerhalb der sieben beauftragten Edit-Dateien
  unverändert, darunter sämtliche Wiki-, game-, Admin- und fremden lokalen Dateien.
  Alter Statistikabschnitt bytegleich, alle bestehenden Translation-Einträge
  identisch, ausschließlich 11 neue `community.stats.*`-Nachrichten.
- `git diff --check` sauber; neue Dateien zusätzlich auf Whitespace geprüft.
  HEAD und Staging unverändert. Kein Commit, kein Push, kein Webexport.

Nachweise außerhalb des Repositories:
`C:\Users\sebbo\AppData\Local\Temp\zhserver-community-20261007\check.cjs`,
`report.json`, `report-layout-verified.json`, `preserve.cjs`,
`preservation-report.json`. Bilder im Codex-Visualisierungsordner unter
`community-20261007`. Temporäre Testwerte/Accounts sind ausschließlich Fixtures.

## Footer-Korrektur: Prüfung und Fortsetzung

Zusätzliche Dateien: `assets/js/global-footer.js`, `assets/css/global-footer.css`.
Angepasst: Startseite/Forum nur zur Entfernung der bisherigen Inhalts-Einbindung,
Besucher-Script nur für den gemeinsamen Footer-Loader, Community-CSS nur zur
Entfernung der bisherigen Startseiten-Abstände. Regeln/Checkpoints aktualisiert.
Alle Daten-/Auth-/SQL- und Presence-Funktionen bleiben unverändert.

Neue Unterseiten übernehmen weiterhin den vollständigen Footer der `index.html`
und das Besucher-Script genau einmal. Der gemeinsame Renderer ergänzt die globale
Community-Anzeige überall in derselben Struktur. Nicht statisch separat kopieren
oder einen vereinfachten Footer erstellen. Regeln dazu verbindlich in `AGENTS.md`.

Footer-Korrektur geprüft:

- Zehn normale Seiten: Start, Forum, Wiki, Gamepage, Galerie, Bugs/Ideen, Arma,
  Impressum, Datenschutz und Danke. Überall identische Footer-Gruppen, jeweils
  genau eine Community-Anzeige und eine Besucher-Script-Einbindung. Geschichte,
  Timeline, Gästebuch und Community sind Startseitenabschnitte.
- Start/Forum jeweils DE/EN bei 1440, 1280, 1024, 768, 390, 360 px; weitere
  acht Seiten bei 1440/390 px in beiden Sprachen: 56 Layoutzustände. Keine
  horizontalen Überläufe, keine Gruppen-/Textüberschneidungen; alle Rechtslinks
  auch am linken/rechten Textrand frei anklickbar. Unten Abstand für vorhandene
  Radio-/Zurück-nach-oben-Buttons eingeplant.
- Statistik aus Startseiten-Community-Inhalt und Forum-Seitenleiste entfernt;
  Steam-/Discord-Links unverändert vorhanden. Footer enthält alle zehn Werte,
  Impressum/Datenschutz und Copyright. Gemeinsame DE/EN-Wahl bleibt über
  Seitenwechsel/Reload erhalten; Footer-Rechtslinks auch auf bisherigen Seiten
  ohne allgemeines Übersetzungsscript über den bestehenden Katalog übersetzt.
- Produktionsdaten zweimal ausschließlich gelesen: beide vorhandenen Besucher-
  Lese-RPCs HTTP 200. Browser-Prüfung zeigt alle fünf Werte korrekt in DE/EN.
  Pro Seite ein Legacy- und ein Periodenaufruf; alle Browser-Schreibanfragen im
  isolierten Test abgefangen. Kein produktiver Besucher/Account registriert.
- Presence weiterhin deaktiviert: keine Community-RPC-Anfragen und keine
  simulierten Werte im regulären lokalen Stand. Backend/SQL/Presence-Code und
  zentraler Übersetzungskatalog sind bytegleich zum Beginn dieser Korrektur.
- Abschließender Browserlauf: JS 0, Console 0, HTTP 0, fehlgeschlagene Requests 0.
  Syntaxprüfung erfolgreich; `git diff --check` sauber.
- Erhaltungsprüfung: 666 vorhandene Dateien außerhalb der Edit-Liste bytegleich;
  zwei Wiki-Datendateien (`assets/data/wiki-entries.json`, `assets/js/wiki-data.js`)
  wurden nach der Baseline außerhalb dieser Footer-Arbeit aktualisiert. Diese
  Dateien wurden von dieser Aufgabe nicht bearbeitet oder zurückgeschrieben.
  Ihr aktueller Stand bleibt erhalten. Wiki-HTML, game/, Admin und alle weiteren
  geschützten Dateien unverändert. Besucherlogik vor dem globalen Loader bytegleich.
- HEAD/Staging unverändert. Kein Commit, kein Push, kein Webexport.

Aktuelle Nachweise: `C:\Users\sebbo\AppData\Local\Temp\zhserver-footer-20261007`
(`check.cjs`, `report.json`, `preserve.cjs`, `preservation-report.json`). Bilder
im Codex-Visualisierungsordner unter `footer-20261007`.

Grundlagen: [Sessions](https://supabase.com/docs/guides/auth/sessions),
[getSession](https://supabase.com/docs/reference/javascript/auth-getsession),
[Datenbankfunktionen](https://supabase.com/docs/guides/database/functions),
[RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).

## Backend-Aktivierung und gezielte Prüfung, 07.10.2026

Nach verbundenem Audit und ausdrücklicher Benutzerfreigabe angewendet:
`homepage_global_community_presence`, Version `20261007094139` in der bestätigten
Supabase-Migrationshistorie. Genau eine neue globale Presence-Tabelle, zwei
öffentliche SECURITY INVOKER-RPCs und deren private Implementierung. Vorhandene
Spiel-Presence, Profile, Accounts, Gruppen/Clans und Adminrechte unverändert.

Das bestehende `get_registered_player_count()` zählt **Spielprofile** (9), nicht
alle Auth-Accounts (11). Dieser RPC bleibt unverändert. Die homepageweiten
registrierten Mitglieder verwenden die bestehenden nicht anonymen/nicht gelöschten
Auth-Accounts; kein neuer Accountzähler oder neuer Profilbestand gespeichert.

Prüfungen der neuen Anbindung:

- Öffentlicher Lese-RPC per echtem HTTP mit vorhandenem Anon-Key: 200; echte 0 für
  Online-/Mitglied-/Gastzahlen vor dem Browserlauf, Accountzahl 11, kein Profilname.
- Metadaten: RLS aktiv, keine direkten Tabellenrechte für anon/authenticated,
  keine PUBLIC-EXECUTE-Rechte, leerer `search_path`. Nur die freigegebenen RPCs
  und ihre privaten Helper ausführbar; keine Änderung bestehender Rechte.
- SQL in einer REPEATABLE READ-Transaktion mit abschließendem ROLLBACK:
  Gast, Browser-Deduplizierung, bestehender Account, Login/Logout-Reklassifikation,
  zwei Browser desselben Mitglieds, nicht vorhandener Account als Gast, ungültige
  Kennungen, exakte Drei-Minuten-Grenze und 24h-Bereinigung bestanden.
  Testclaims nur auf administrativer SQL-Verbindung; kein echter Adminlogin,
  keine neue Session oder Auth-Registrierung und keine dauerhaft gespeicherten
  SQL-Testzeilen. Browser-Auth-Fixtures aus der unveränderten ersten Phase bleiben
  ergänzende Nachweise; sie ersetzen keinen echten produktiven Login-Test.
- Vorher/nachher: Fingerprints aller bestehenden öffentlichen Funktionen samt
  Rechten, vorhandener RLS-Policies und vorhandener Spalten identisch. Authzahl 11,
  Profilzahl 9, Tracking-Start und beide Besucher-RPC-Ausgaben unverändert:
  Heute 2, Gestern 3, Woche 10, Monat 17, Gesamt 203855 am Prüftag.
- Bestehenden Footer-QA-Harness gezielt wiederverwendet, jetzt mit **echten
  Community-RPCs**. Besucher-RPCs zunächst real gelesen und deren Antworten im
  Browser übernommen; sämtliche Besucher-Schreibaufrufe abgefangen. Keine
  produktive Besucherregistrierung oder künstliche Erhöhung der Gesamtzahl.
- Zehn normale Seiten mit aktiver Anbindung: Home, Forum, Wiki, Gamepage, Galerie,
  Bugs, Arma, Impressum, Datenschutz und Danke. Insgesamt 32 Layoutzustände:
  Home/Forum DE/EN bei 1440, 768, 390, 360 px; weitere Seiten DE/EN bei 390 px.
  Bestehende breite Layoutnachweise der unveränderten Footer-Darstellung bleiben
  gültig. Screenshots für Desktop/Tablet/Mobile zusätzlich gesichtet.
- Echte Gast-Presence über alle Seiten, Reload und zweiten Tab: dieselbe eine
  Browserkennung, während des Tests ein Gast, null Mitglieder, 11 Accounts.
  Sprache und Footerwerte erhalten; private Namenszeile bleibt „—“.
- Keine horizontalen Überläufe oder Text-/Gruppenüberschneidungen, Rechtslinks
  frei anklickbar, pro Seite ein Community-Block und eine Besucher-Einbindung.
  Browser-JS 0, Console 0, HTTP 0, fehlgeschlagene Requests 0.
- Supabase-Security-Advisor: keine neuen Warnungen. Zusätzliche INFO
  `rls_enabled_no_policy` für die neue Tabelle ist beabsichtigt: keine direkten
  Client-Tabellenrechte, daher keine Client-Policies. Zugriff nur über die
  geprüften Funktionen. [Erklärung des Hinweises](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy).

Nachweise außerhalb des Repositories:
`C:\Users\sebbo\AppData\Local\Temp\zhserver-community-connected-20261007`
(`backend-check.sql`, `backend-report.json`, `check.cjs`, `report.json`).
Screenshots im bestehenden Codex-Visualisierungsordner unter
`community-connected-20261007`. Bestehender Presence- und Besucher-JS-Code nicht
umgeschrieben; nur lokale Aktivierung, SQL-Abgleich und Checkpoints.
Kein Commit, kein Push, kein Webexport.

Abschluss: `node --check community-config.js` erfolgreich; `git diff --check`
und zusätzliche Whitespace-Prüfung der sieben bearbeiteten Dateien sauber.
Besucher- und Presence-Script bytegleich zum Beginn der Backend-Fortsetzung.
682 weitere vorhandene Dateien SHA-256-identisch. Zwei Wiki-Datendateien
(`assets/data/wiki-entries.json`, `assets/js/wiki-data.js`) wurden während dieser
Phase parallel aktualisiert; von dieser Aufgabe weder bearbeitet noch
zurückgeschrieben. Ihren aktuellen lokalen Stand vollständig erhalten.
HEAD/Staging unverändert; game/, Spielprojekt, Wiki-Inhalte und Admin-Code
von dieser Aufgabe nicht bearbeitet. Bei Fortsetzung die parallelen Wiki-
Änderungen ausdrücklich als bestehenden lokalen Stand übernehmen.

## Kleine Footer-Korrektur – Account-Reset (07.10.2026)

- Im gemeinsamen Footer steht direkt neben „Community“ ein kleiner goldener
  Hinweis: DE `ACCOUNT-RESET: 15.07.2026`, EN `ACCOUNT RESET: 15/07/2026`.
  Markup und Styles liegen in `global-footer.js` / `global-footer.css`; der Text
  verwendet den bestehenden Schlüsselmechanismus `data-community-text` und den
  zentralen Übersetzungskatalog. Keine Änderung an Werten oder Backend-Logik.
- Lokal auf Startseite und Forum DE/EN bei 1440, 1280, 768, 390 und 360 px geprüft;
  Impressum als zusätzliche gemeinsame Footer-Variante bei 390 px geprüft.
  Hinweis jeweils neben der Überschrift, ohne Überlappung oder horizontalen
  Überlauf; Desktop-/Tablet-/Mobile-Screenshots gesichtet. Sprache bleibt nach
  Seitenwechsel und Reload erhalten.
- Alle Statistik-Anfragen in der isolierten Browserprüfung abgefangen. Feste
  Testantworten bleiben beim Sprachwechsel unverändert; keine produktiven
  Besucherregistrierungen oder Presence-Schreibzugriffe durch diese Prüfung.
  Browser-JS-, Console-, HTTP- und Request-Fehler: jeweils 0.
- Nachweise: `C:\Users\sebbo\AppData\Local\Temp\zhserver-footer-reset-20261007`
  (`check.cjs`, `report.json`, Ausgangssnapshot); Screenshots im bestehenden
  Codex-Visualisierungsordner unter `footer-reset-20261007`.
  Kein Commit, kein Push, kein Webexport.

## Öffentliche Anzeigename-Schicht aktiv – 07.10.2026

Aktueller maßgeblicher Stand: Der private Namensadapter ist eingerichtet.
`get_zh_newest_member()` liefert ausschließlich `display_name` und das Auth-
Registrierungsdatum. `get_zh_community_stats()` übernimmt dessen Namen; echte
Leseprüfung: `trux`, 11 Accounts. Fehlt dem neuesten Account ein gültiger Name,
bleibt die Anzeige „—“; kein älteres Mitglied wird als Ersatz gewählt.

Profile/Rollen/Metadaten bleiben privat, bisherige Zähl-/Heartbeat-/Besucherlogik
gleich. Goldener Account-Reset-Hinweis weiterhin exakt DE/EN. Neue öffentliche
RPC, Rechte und produktive Migrationen sind in `PUBLIC_IDENTITY.md` dokumentiert.
Frontend bleibt lokal, Browserprüfung mit abgefangenen Tracking-Schreibanfragen:
18 DE/EN-Ansichten auf Startseite/Galerie/Forum, Desktop/Tablet/Mobile, vollständiger
Footer und unveränderte Besucherwerte, JS-/Console-/HTTP-/Request-Fehler 0.

Private Ownership-Tabelle und zentrale Identitäts-RPC werden für neue angemeldete
Gästebuch-/Galerieeinträge verwendet; keine vorhandenen Gastbeiträge zugeordnet.
Forum bleibt lokale Entwurfsoberfläche. Kein Commit, Push oder Webexport.
