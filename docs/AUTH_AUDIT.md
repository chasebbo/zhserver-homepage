# Bestehende ZHServer-Anmeldung – Bestandsprüfung

Stand: 07.10.2026. Lokale Auth-Prüfung, kleine Dashboard-Korrektur und anschließend
direkte rein lesende Backend-Bestandsprüfung über die verbundene Supabase-Anbindung.
Keine neue Anmeldung, Auth-Konten, Profil-/Rollentabellen, Auth-Einstellungen
oder Änderungen an bestehenden RLS-Regeln. Die separat freigegebene globale
Presence-Migration ist in `COMMUNITY_STATS_CHECKPOINT.md` dokumentiert.

## Direkt bestätigter Backend-Bestand

- Bestehendes Projekt `zhserver` / `yawadxzeyyrozmlrokun`, PostgreSQL 17.6.
  `community_structure_audit.sql` als eine rein lesende Abfrage direkt ausgeführt;
  anschließend den bestehenden Profil-Trigger gezielt gelesen. Keine Passwörter,
  E-Mails, Sessions oder Tokenwerte ausgelesen.
- 11 nicht anonyme/nicht gelöschte `auth.users`-Accounts und 9 vorhandene Profile.
  Zwei Accounts haben derzeit kein Profil; es wird keines nachträglich angelegt.
  Registrierte Community-Mitglieder werden pro Auth-Account gezählt, nicht pro
  Profil oder Auth-Identität. Der bestehende Adminaccount ist bestätigt.
- Der bestehende `get_registered_player_count()` zählt ausschließlich
  `public.profiles` (9). Er bleibt unverändert. Die globale Community-Accountzahl
  zählt Auth-Accounts (11); beide Werte haben damit unterschiedliche Definitionen.
- `profiles.id` ist PK und FK auf `auth.users.id`; vorhanden sind `display_name`,
  `color`, Spielgeld/-punkte und Zeitstempel. Keine Homepage-Adminrolle im Profil.
  RLS erlaubt nur das eigene Profil. `get_social_presence()` gibt Namen/Positionen
  nur für akzeptierte eigene Spielgruppen/Clans frei, nicht für die Öffentlichkeit.
  Das vorhandene Namensfeld darf daher nicht als global öffentlich behandelt werden.
- Admin-`app_metadata` enthält `provider`/`providers`, keine Adminrollen. Die
  Datenbank-RLS für administrative Änderungen an Gästebuch, Galerie und Feedback
  bestätigt die bereits verwendete feste Admin-Benutzer-ID. `authenticated` ist
  keine Adminrolle; Gruppen-/Clanrollen sind keine Homepage-Adminrechte.
- `on_auth_user_created` ruft `create_profile_for_new_user()` auf und erstellt
  bereits ein Profil samt Spielinventar. Der Trigger bleibt unverändert. Eine
  spätere zentrale Registrierung muss diese bestehende Verknüpfung berücksichtigen.
- `player_presence`, `update_own_presence`, `get_online_player_count` und
  `get_social_presence` gehören zur Spielwelt (Positionen, 15 Sekunden Ablauf).
  Sie werden nicht zur Homepage-Presence umgebaut. Die freigegebene neue globale
  Presence nutzt dieselben Auth-Accounts und Default-Sessions, ohne Spieländerung.

## Verifizierter Bestand

Die produktiven Dateien unter `https://www.zhserver.de/admin/` stimmen mit dem
lokalen Bestand überein: Login-HTML, `admin.js`, `dashboard.js`, `guestbook.js`,
`gallery.js` und `feedback.js` wurden vor der Korrektur rein lesend abgeglichen.

| Bereich | Bestehende Umsetzung |
| --- | --- |
| Backend | Supabase-Projekt `yawadxzeyyrozmlrokun`; dieselbe Projekt-URL und derselbe öffentliche Anon-Key in Admin und normaler Homepage. Kein eigener Passwortserver im Repository. |
| Anmeldung | `admin/admin.js`: `auth.signInWithPassword({ email, password })`, anschließend Weiterleitung nach `dashboard.html`. |
| Session | Supabase-JS v2, ohne eigene Auth-Optionen. Das am Prüftag geladene SDK ist 2.117.2. `persistSession` und `autoRefreshToken` sind aktiv. |
| Browser-Speicher | SDK-Schlüssel `sb-yawadxzeyyrozmlrokun-auth-token` im `localStorage`. Kein auf `/admin` begrenzter Cookie oder separater Admin-Session-Schlüssel. Access-/Refresh-Tokens verwaltet das SDK. |
| Session-Prüfung | Dashboard, Gästebuch und Galerie rufen `auth.getSession()` auf und leiten ohne Session zum bestehenden Login zurück. |
| Abmeldung | Dashboard ruft das vorhandene `auth.signOut()` auf. Die gleiche Session ist danach auch außerhalb von `/admin` abgemeldet. |
| Admin-Erkennung | `admin/feedback.js` prüft zusätzlich die bestehende feste `ADMIN_UID` gegen `session.user.id`. Die drei anderen Admin-Ansichten prüfen im Frontend ausschließlich das Vorhandensein einer Session. |
| Öffentliche Homepage | `assets/js/main.js` erstellt bereits einen Client für dasselbe Projekt; das Gästebuch liest dessen Session und verwendet gegebenenfalls deren Access-Token. |
| Forum | Noch keine eigene Anmelde-/Account-Oberfläche. Der globale Community-Baustein verwendet denselben Supabase-Client/Session-Speicher. Lokale Forum-Entwürfe bleiben unabhängig von der Anmeldung. |

Die bestehende Session ist auf **derselben Origin** außerhalb von `/admin`
wiederverwendbar. Pfade wie `/`, `/forum/` oder eine spätere Profilseite benötigen
keine zweite Anmeldung. Ein anderer Host, etwa mit/ohne `www`, oder ein lokaler
Testserver hat einen anderen Browser-Speicher; Tokens dürfen dafür nicht kopiert
oder über URL-Parameter weitergegeben werden.

## Profile, Rollen und tatsächliche Berechtigungen

Im vorhandenen Homepage-/Admin-Code gibt es keinen Zugriff auf eine Profil- oder
Rollentabelle, keinen zentralen Rollen-Resolver und keine Prüfung eines eigenen
Rollenfelds. Die belegte zusätzliche Admin-Kennung ist bisher die `ADMIN_UID` im
Bugs-/Ideen-Admin. **Das beweist nicht, dass im Backend keine geeigneten Tabellen
oder Rollen existieren.**

Supabase unterscheidet die Auth-Benutzer-ID, die API-/Datenbankrolle und mögliche
Anwendungsrollen. Ein angemeldeter Benutzer mit `role: authenticated` ist dadurch
kein Administrator. `user_metadata` eignet sich nicht als Quelle für Adminrechte,
weil Benutzer diese Daten selbst ändern können. Vorhandene serverseitige Rollen,
geschützte `app_metadata` oder RLS-Helfer wurden im oben beschriebenen Backend-Audit
geprüft; bestehende feste Admin-ID erhalten, keine neue Rollenstruktur aufgebaut.

Die kombinierte Leseabfrage hat Profil-/Rollenkandidaten, Account-Trigger und die
aktiven Tabellen-/Storage-RLS-Regeln erfasst. Es wurde keine fehlende Rollenprüfung
im Frontend als Beweis eines ungeschützten Datenbankzugriffs gewertet. Keine
unbeauftragte Änderung der vorhandenen Rechte oder Freigabe privater Profile.

Die öffentlich lesbaren Auth-Einstellungen bestätigen E-Mail-Auth; andere
Anbieter und anonyme Auth-Benutzer sind deaktiviert. `disable_signup` ist `false`
und `mailer_autoconfirm` ist `true`. Diese bestehenden Einstellungen wurden nicht
geändert; es wurde keine Registrierung angeboten oder ausgeführt.

Die API-Metadatenabfrage am Root `/rest/v1/` liefert HTTP 401. Die vorhandene
öffentliche Gästebuch-Abfrage mit `limit=0` und der rein lesende Perioden-RPC liefern
dagegen HTTP 200. Aus der abgewiesenen Metadatenabfrage darf weder ein generell
ungültiger Projekt-Key noch das Fehlen einer Tabelle abgeleitet werden.

Der Supabase-Zugriff ist inzwischen verbunden; direkte Bestandsprüfung erfolgt.
Die Browsersteuerung scheiterte beim Kernelstart am Windows-Sandbox-Helper;
private Browser-Sessions und echte Zugangsdaten wurden weiterhin nicht benutzt.
`auth_structure_audit.sql` selbst ist nicht ausgeführt; ihr Inhalt ist durch die
ausgeführte kombinierte `community_structure_audit.sql` abgedeckt. Keine erneuten
manuellen Audit-Abfragen verlangen.

Die abgewiesene OpenAPI-Abfrage passt zur dokumentierten Entfernung des Anon-
Zugriffs auf Schema-Introspektion; die Funktionalität öffentlicher RPCs ist davon
getrennt. Quelle: [Supabase-Changelog](https://supabase.com/changelog/42949-breaking-change-removing-access-to-openapi-spec-via-the-anon-key).

## Grundlage für die zentrale Anmeldung

1. Die fehlenden Backend-Fakten prüfen und geeignete bestehende Profil-/Rollen-
   Strukturen zuerst wiederverwenden. Bis dahin keine Tabellen oder Rollen erfinden.
2. Einen gemeinsamen Browser-Client/Session-Zugriff für dasselbe Supabase-Projekt
   einführen. Bestehenden SDK-Speicherschlüssel, E-Mail-/Passwort-Login und Admin-ID
   erhalten. Kein Session-Migrationsskript, Passwortwechsel oder zweiter Auth-Speicher.
3. Den bestehenden Login zur zentralen ZHServer-Anmeldung erweitern. `/admin/` bleibt
   weiterhin erreichbar und verwendet denselben Account und dieselbe Session.
4. Normalen Anmeldestatus und tatsächliche Admin-/Moderationsrechte getrennt prüfen.
   Eine serverseitig bestätigte Identität und die vorhandenen RLS-/Rollenregeln sind
   maßgeblich; ein Frontend-Schalter oder ein editierbarer Anzeigename ist keine Rolle.
5. Ein öffentliches Profil verweist auf die vorhandene `auth.users.id`. Geeignete
   Profilfelder wiederverwenden; private E-Mail-/Auth-Daten nicht als Forenprofil zeigen.
6. Erst danach Homepage-/Forum-/Profil-Oberflächen anschließen. Bei Abmeldung die
   gemeinsame Session verwenden; lokale Forum-Entwürfe nicht löschen oder automatisch
   veröffentlichen. Rechte für echte Beiträge separat gegen das Backend prüfen.

Vor einer Öffnung für normale Mitglieder muss der Unterschied zwischen einer
vorhandenen Session und Adminrechten in allen Admin-Ansichten geklärt werden.
Der bestehende Adminaccount wird dabei erhalten, nicht ersetzt oder neu angelegt.

## Erste lokale Auth-Phase vor der direkten Backend-Verbindung

Mit dem aktuellen SDK trat auch online in einem frischen, abgemeldeten Browser
`Identifier 'supabase' has already been declared` im Dashboard auf. Das SDK und
`const supabase` aus `admin/dashboard.js` verwenden denselben globalen Namen.
Lokal wurde ausschließlich dieser Clientname in `dashboardClient` umbenannt.
Projekt, Key, Login, Session-Speicher, `getSession()` und `signOut()` bleiben gleich.
Die Korrektur ist nicht veröffentlicht; der Online-Stand wurde nicht verändert.

Gezielter Chrome-Test mit dem tatsächlich ausgelieferten SDK und **simulierten**
Auth-/Datenbankantworten in einem isolierten Browser-Profil:

- bestehender Login und Dashboard-Weiterleitung;
- Umleitung ohne Session und Session-Erhalt nach Reload;
- vorhandene Admin-ID durchläuft Gästebuch, Galerie und Bugs/Ideen;
- dieselbe Session außerhalb von `/admin` und in einem zweiten Tab;
- SDK-Speicherschlüssel, Persistenz und automatischer Token-Refresh;
- vorhandene Abmeldung und Session-Verlust auch außerhalb des Adminbereichs;
- normale Test-Session: Dashboard prüft nur Anmeldung, Bugs/Ideen lehnt andere ID ab;
- nach der Korrektur Browser-JS-Fehler: 0, Console-Fehler: 0.

`node --check admin/dashboard.js`: erfolgreich; `git diff --check`: sauber.
Die Leseabfrage wurde statisch auf ein einzelnes Statement ohne Schreibbefehle
oder Registrierungsaufrufe geprüft, nicht gegen das private Produktionsschema
ausgeführt. Der Variablenname ist die einzige Änderung am Dashboard-Ablauf.
Alle 257 anderen Dateien der geschützten SHA-256-Baseline sind unverändert;
HEAD und Staging bleiben erhalten. Kein Dedicated-Neustart erforderlich.

Die getesteten Session-Daten waren ausschließlich lokale Fixtures. Kein echtes
Passwort, Login, Testkonto, Refresh oder Logout wurde an Supabase geschickt.
Die Online-Prüfung führte nur Lesezugriffe aus; Schreibanfragen waren blockiert.
Keine Layoutänderung; deshalb keine erneute Desktop-/Mobile-Vollprüfung.

Prüfnachweise außerhalb des Repositories:
`C:\Users\sebbo\AppData\Local\Temp\zhserver-auth-20261007\audit-report.json`,
`check-report.json`, `live-inspection.json` und `public-api-report.json`.

Quellen für SDK-/Berechtigungsgrundlagen:
[getSession](https://supabase.com/docs/reference/javascript/auth-getsession),
[getUser](https://supabase.com/docs/reference/javascript/auth-getuser),
[Sessions](https://supabase.com/docs/guides/auth/sessions),
[RLS und Metadaten](https://supabase.com/docs/guides/database/postgres/row-level-security).

## Backend bestätigt und gemeinsame Identität angeschlossen – 07.10.2026

Aktueller Stand: Direkter Supabase-Zugriff bestätigt `profiles.display_name` und
die bestehende Own-Profile-RLS. Keine Rollen-/Profil-/Auth-Duplikate angelegt.
Die minimalen öffentlichen/geschützten Identitäts-RPCs liefern nur Name und
Registrierungszeit; keine Account-ID, E-Mail, Metadaten oder Adminrechte.
Details, angewandte SQL-Dateien und Prüfungen: `PUBLIC_IDENTITY.md`.

Bestehender Client und SDK-Session-Speicher bleiben gleich. `identity.js` bestätigt
GetSession mit GetUser und liest den Namen über die eigene geschützte RPC. Die
lokale Homepage/Galerie und Forum-Entwurfsansicht reagieren auf Login/Logout in
weiteren Tabs. Gästebuch/Galerie ordnen angemeldete Inhalte privat aus `auth.uid()`
zu; Gastverhalten und bestehende Admin-Freigabewege bleiben erhalten.

Bestehender Adminaccount hat im geprüften Bestand keinen Profileintrag. Ohne
gültigen Namen bleibt seine Anmeldung/Moderation funktionsfähig, angemeldetes
Schreiben auf den neuen Formularen aber gesperrt. Kein automatischer Name und
kein E-Mail-Fallback. Eine zentrale Profil-/Anzeigename-Oberfläche ist noch offen.

Echte SQL-Rechte-/Triggerprüfungen mit Rollback; kein Testkonto und keine Test-
Beiträge behalten. Admin-/Signup-/Profile-/Bestandsdaten und Content-Sequenzen
unverändert. Lokaler SDK-/Browserablauf geprüft; echte Zugangsdaten nicht benutzt.
Kein Commit, Push oder Webexport.

## Zentrale Account-Oberfläche – 08.10.2026

Aktueller Anschluss dokumentiert in `ACCOUNT_CHECKPOINT.md`. Die neuen lokalen
Seiten `/account/` und `/profile/` sowie der globale Header verwenden denselben
Supabase-Client und denselben SDK-Speicher wie der bestehende `/admin/`-Login.
Admin-Code, Account-ID, Rollen und Moderationsrechte wurden nicht verändert.

Gezielter rein lesender Backend-Abgleich: `profiles.display_name` ist vorhanden;
die bestehende Profilpolicy erlaubt eigenes Lesen (`auth.uid() = id`), keine
Own-UPDATE-Policy. Deshalb ist das Profil zunächst lesend. Der vorhandene
Auth-Trigger `on_auth_user_created` / `create_profile_for_new_user()` legt bei
Registrierung das Profil mit `raw_user_meta_data.display_name` und Startinventar
an. Der neue Dialog nutzt diesen bestehenden Weg, statt Tabellen/Trigger oder
Accountstrukturen zu duplizieren. Metadaten sind weiterhin keine Rollenquelle.

Öffentliche Auth-Settings beim Abgleich: E-Mail-Provider aktiviert,
`disable_signup = false`, `mailer_autoconfirm = true`. Der Dialog verarbeitet
auch den Fall, dass eine Registrierung wegen erforderlicher Bestätigung keine
Session liefert. Für Namen bleibt ausschließlich die geschützte Own-Identity-RPC
maßgeblich; keine E-Mail als Anzeige und keine pauschale Freigabe von `profiles`.
Diese Phase hat keine SQL-Migration oder produktive Auth-/Profiländerung ausgeführt.
