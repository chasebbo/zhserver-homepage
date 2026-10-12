# Zentrale Accountrollen und Forum-Moderation – Umsetzung und Prüfung

Stand: 12.10.2026. **Nach ausdrücklicher Freigabe produktiv angewendet und lokal geprüft.**
Bestehendes Projekt `zhserver` / `yawadxzeyyrozmlrokun`.
Konkrete Migration: `docs/account_forum_roles_prepare.sql`.
Installierte Version: `20261012113834_homepage_central_account_forum_roles`.
Die Homepage-Dateien sind weiterhin nur lokal; kein Commit, Push oder Deployment.

Die erste Ausführung scheiterte an einem versehentlichen führenden `+` vor einem
Policy-Statement. Alle ursprünglichen Funktionshashes und neun Policies sowie die
fehlende Rollentabelle wurden danach bestätigt: keine Teiländerung. Ausschließlich
diese Markierung entfernt; der anschließende identische Migrationsumfang lief durch.
Zwei entsprechende Markierungen in der unbenutzten Rücknahmedatei ebenfalls entfernt.

## Bestand und Entscheidung

Vor der Migration gab es keine globale Accountrolle. Die vorhandenen `group_members.role` und
`clan_members.role` gehören zum Spiel und werden weder umgedeutet noch verändert.
Der bisherige Homepage-Admin und Forum-Admin sind derselben bestehenden UUID
zugeordnet. Die bestehende Anmeldung, Auth-UUID, Profile und Session bleiben erhalten.

Die private Tabelle `zh_identity_private.account_roles` ist jetzt zentrale Rollenquelle:
UUID, `system_role` (`member`/`admin`), Änderungszeit und letzter Änderungsakteur.
Keine zweite Profil-/Namens-/Anmeldestruktur. RLS aktiv, keine direkten Rechte für
`anon`/`authenticated`; begrenzte RPCs und private Funktionen prüfen `auth.uid()`.

Die zehn aktuell registrierten Accounts haben ihre Rollen-Datensätze erhalten. Der
bestehende Admin `7ba1fad4-d113-4526-8873-3e3b97e9be7e` erhielt einmalig `admin`, alle
anderen `member`. Dieser Seed bewahrt die bisherige Berechtigung; er ist keine
dauerhafte UUID-Sonderregel. Neue normale Accounts erhalten durch einen zusätzlichen
kleinen Signup-Trigger immer `member`. Bestehende Profil-/Spiel-Signup-Trigger bleiben.
Anonyme Auth-Accounts werden dadurch nicht zu registrierten Mitgliedern.

## Rechte und spätere Adminzuweisung

`public.is_zh_admin()` liefert ausschließlich den Adminstatus des aktuellen Aufrufers.
Private Prüfung: eigene gültige registrierte Auth-UUID und Rolle aus der Rollentabelle.
Keine Entscheidung über Anzeigename, Rang, `user_metadata` oder `app_metadata`.

`set_zh_account_role(p_user_id,p_role)` erlaubt nur einem bestätigten Administrator,
einen vorhandenen registrierten Account gezielt umzustellen. Keine freie Namenssuche,
keine neuen Accounts, keine Änderung der UUID. Normale Nutzer können weder sich
selbst noch andere befördern. Die letzte aktive Adminrolle kann nicht entfernt werden;
ein gemeinsamer Transaktionslock verhindert konkurrierende Rollenänderungen.
Keine Rollenverwaltung im normalen Frontend in dieser Phase.

## Exakte Änderungen an bestehendem Backend

- Vier Funktionsdefinitionen: private eigene Identität, private Forum-Adminprüfung,
  private öffentliche Forum-Profildarstellung und öffentlicher Forum-Lese-Wrapper.
  Bestehende Signaturen/Rechte bleiben; Eigentümer/Autoren kommen weiterhin aus
  der unveränderten `member_id()`-/`write_post()`-Kette mit `auth.uid()`.
- Neun bestehende Admin-Policies werden von UUID-Vergleich auf dieselbe Rollenprüfung
  umgestellt: Galerie SELECT/UPDATE/DELETE, Gästebuch SELECT/UPDATE/DELETE,
  Community-Feedback UPDATE/DELETE und Feedback-Screenshot DELETE. Tabellen,
  Befehle, Bucket-Beschränkung und UPDATE-WITH-CHECK bleiben gleich.
- Avatar-Policies, Galerie-Storage-Policies, Besucher/Presence, Votes, Auth-Sessions,
  Passwörter, Profile, Spiel-, Gruppen-/Clan-, Inventar-/Save-/Base-/Vehicle-Daten
  werden nicht verändert. Keine zusätzlichen Adminrechte im Dedicated/Spiel.
- Guards prüfen die vorherigen vier Funktionssignaturen und neun Policy-Ausdrücke.
  Bei abweichendem Bestand: Abbruch und Audit, kein Überschreiben.

## Forum-Löschung und Darstellung

Alle bestätigten Admins dürfen fremde Themen/Antworten entfernen und – gemäß dem
bestehenden Konzept – bearbeiten, anheften, schließen und wiederherstellen.
Mitglieder bearbeiten nur eigene Beiträge; keine fremde Änderung/Entfernung.
Die Autor-UUID bleibt auch bei Adminbearbeitung unverändert.

**Löschen ist in dieser Version wiederherstellbare Entfernung aus dem öffentlichen
Forum.** Die bereits vorhandenen `hidden`-Felder und Moderations-RPCs werden
weiterverwendet. Keine irreversible SQL-Zeilenlöschung. Die Bestätigung benennt
Entfernung und Wiederherstellung ausdrücklich. Verborgene Themen/Antworten fehlen
für normale Besucher; Admins können sie wiederherstellen.

Unter Autoren-/Profilnamen steht nach Aktivierung schlicht `ZH-Admin` oder
`ZH-Member`, ohne Icon/Badgefläche. Öffentlich zusätzliche Felder ausschließlich
`system_role` und `rank_label`; keine E-Mail, Auth-Metadaten oder Rohprofildaten.
Die öffentlich gewünschte Rollenbezeichnung ist damit die einzige neue Rolleninformation.

## Späterer Rang – ausdrücklich getrennt

Der API-Vertrag enthält `rank_label: null`. Keine erfundenen Ränge, keine Rangspalte
in Spieltabellen, keine clientseitige Rangzuweisung. Eine spätere bestätigte zentrale
Spiel-/Accountquelle kann diesen Anzeigewert liefern. Die vorbereitete Textzeile bleibt
bei fehlendem Rang verborgen. Rangdaten kommen niemals in die Rechteprüfung.

## Lokale Anbindung und Prüfungen

Forum/Profile rendern nur bestätigte Rollenwerte; fehlende Felder erzeugen keine
erfundenen Member-/Adminlabels. Neue Löschbezeichnung/Bestätigung wird erst bei
`role_version=1` aktiv. Die aktuelle produktive Moderation bleibt bis dahin gleich.
Der lokale Admin-Guard verwendet ausschließlich die bestätigte serverseitige Rolle
mit `role_version=1`. Die Übergangsregel für die ursprüngliche UUID ist nach der
Backend-Aktivierung vollständig aus `admin/access.js` entfernt. Ein fehlender,
unbekannter oder fehlerhafter Rollenvertrag verweigert den Zugriff. Kein Metadata-/
Namens-/UUID-Fallback; kein Rang in der Autorisierung.

Zehn lokale Admin-Zugriffsfälle bestanden: fehlender Vertrag, bisheriger Admin, Nicht-Admin, zusätzlicher
serverbestätigter Admin, demotierter ursprünglicher Admin, manipulierte Metadaten/Rang,
unbekannte Rolle/Vertrag, RPC-Fehler und anonymer Account.

Exakte Kandidaten-Funktionskörper gegen ein **isoliertes TEMP-SQL-Modell** geprüft:
Signup-Memberdefault, cHa-Erhalt, Mitglieds-Thema/Antwort, Verbot fremder Bearbeitung/
Entfernung, kein direkter Rollenwrite, Metadata/Rang ohne Rechte, weiterer Admin,
fremde Adminbearbeitung/-Entfernung ohne Autorenwechsel, öffentliche Unsichtbarkeit,
Wiederherstellung, letzter Admin geschützt und unmittelbare Aberkennung.
Alles zurückgerollt; keine produktive Migration oder Accountänderung dadurch.
Danach die tatsächlich installierten RPCs unter `authenticated` mit vorhandenen
Account-UUIDs geprüft: eigene Member-Themen/Antworten mit Rav, fremde Bearbeitung/
Entfernung verweigert, keine Selbstbeförderung oder direkte Rollentabellenänderung,
Metadata/Rang ohne Rechte. Zusätzlichen Admin ausschließlich innerhalb einer
Transaktion zugewiesen, fremde Beiträge bearbeitet/entfernt/wiederhergestellt,
Autoren-UUID erhalten und sofortige Herabstufung geprüft. Letzter Admin, ungültige
Rolle und unbekannte Ziel-UUID geschützt. Sämtliche Teständerungen zurückgerollt.
Final weiterhin genau ein Admin (cHa), neun Member, ein Thema und zwei Beiträge;
Titel, Sichtbarkeit und ursprüngliche letzte Aktivität des echten Testthemas erhalten.

Echte lokale cHa-Sitzung: eigenes Profil/Avatar/Rolle, Admin-Dashboard sowie Galerie-,
Gästebuch- und Feedback-Adminseiten erreichbar. Alle vier direkten Admin-URLs für
Gäste verweigert. Die Nicht-Admin-RPC-Prüfung verwendet vorhandene Accounts mit
gesetzt geprüften SQL-Request-Claims; kein zweiter Browser-Login, kein neuer Account
und keine Passwortänderung. Öffentliches Rav-Profil zeigt ZH-Member, cHa ZH-Admin;
keine E-Mail oder Rangzeile. Desktop 1440/1179, Tablet 768 und Mobile 390 in DE/EN
ohne horizontalen Überlauf. Der bestehende Signup-Trigger ist produktiv installiert;
der Memberdefault wurde im isolierten TEMP-Modell getestet, ohne Testregistrierung.
Browser-JS-/Consolefehler 0. Native Nachprüfung: sieben lokale UI-Dateien und der
echte Avatar HTTP 200 mit korrekten MIME-Typen. Fünf JS-Syntaxprüfungen sowie
`git diff --check` erfolgreich; unbeteiligte lokale Dateien per SHA256 erhalten.
Keine neue WARN des Sicherheitsadvisors für die Rollen-/Forum-RPCs; die private
Rollentabelle hat absichtlich keine direkt zugänglichen Client-Policies/-Grants.

Nachweise außerhalb Git im vorhandenen Ordner `forum-functional-20261012`:
`role_model_test.sql`, `admin_role_guard_test.cjs`, `account-roles-before.json`,
`production-role-regression.sql`, `roles-applied-final.json` und neue Rollen-Screenshots.

## Rücknahme und Freigabegrenze

`docs/account_forum_roles_rollback.sql` stellt ausschließlich die geprüften ursprünglichen
vier Funktionen und neun Policies wieder her und sperrt die neuen Rollen-APIs.
Keine DROP-/DELETE-Rücknahme: Rollen-Datensätze und harmloser Memberdefault bleiben
erhalten. Wiederaktivierung nur nach neuem Bestandsaudit, nicht durch blindes erneutes
Ausführen der Erst-Migration. Rücknahme ebenfalls nur mit eigenem ausdrücklichem Auftrag.
Nach Veröffentlichung der Rollen-UI gehört zu einer Rücknahme auch die abgestimmte
vorherige Admin-Zugriffsversion: Der aktuelle Guard verweigert ohne Rollenvertrag
bewusst jeden Adminzugang. Nicht allein das SQL zurücknehmen und die Rollen-UI lassen.

**Die gesonderte Freigabe wurde erteilt und genau diese Migration angewendet.**
Die Erst-Migration nicht erneut ausführen; die Bestandsguards schützen vor Wiederholung.
Keine weiteren Admins dauerhaft befördert. Rücknahme nicht ausgeführt.
Kein Commit, Push, Deployment oder Webexport. STOPP nach lokaler Abschlussprüfung.
