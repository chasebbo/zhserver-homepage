# Zentraler ZHServer-Account – lokaler Stand 08.10.2026

Der bestehende Working Tree wurde übernommen. Diese Phase ergänzt die globale
Account-Oberfläche und den Forum-Einstieg; kein Commit, Push oder Webexport.
Das Spielprojekt wird in dieser Aufgabe ausschließlich gelesen; `game/` bleibt
unverändert. Keine Backend-Migration angewandt.

## Gemeinsame Oberfläche und Session

- Der vorhandene `i18n.js`-Einstieg lädt auf Seiten mit gemeinsamem
  `.header.zh-site-header` einmal `account.js` und dessen Styles. Desktop:
  kompakter Account-Chip neben DE/EN. Tablet/Mobile: derselbe Baustein im Menü.
- Gast: „Anmelden“ führt zur zentralen `/account/`-Seite, von dort zur
  Registrierung. Member: bestätigter Anzeigename, „Mein Profil“, „Zum Spiel“,
  „Abmelden“. Ein fehlender Name zeigt „Account“, niemals E-Mail oder UUID.
- Alle Bereiche nutzen `window.zhSupabaseClient`, das bestehende Projekt
  `yawadxzeyyrozmlrokun` und den SDK-Speicher
  `sb-yawadxzeyyrozmlrokun-auth-token`. Kein zweites Auth-System oder manuelles
  Access-/Refresh-Token-Handling. Die `/admin/`-Anmeldung bleibt unberührt.
- `ZHIdentity` bestätigt die Session mit `auth.getUser()` und liest ausschließlich
  `get_zh_own_identity()`. Der Header setzt den Namen per `textContent`.
  Accountwechsel invalidiert laufende Namensabfragen; Logout entfernt den Namen
  sofort, ohne vorhandene lokale Entwürfe zu löschen.
- `ZHAccount.authUrl(mode, next)` und `safeNext()` erlauben nur bekannte lokale
  Homepage-Routen. Keine externe Weiterleitung oder Token-URL als Rücksprungziel.

## Anmeldung, Registrierung und eigenes Profil

- `/account/`: `signInWithPassword()` des bestehenden Supabase-SDK.
  `/account/?mode=register`: `signUp()` mit `options.data.display_name`.
  Diese Metadaten dienen nur der vorhandenen serverseitigen Profilerstellung,
  niemals der Rollenprüfung oder späteren Autorenauswahl.
- Der am 08.10.2026 rein lesend geprüfte Bestand erlaubt E-Mail-Registrierung:
  `disable_signup = false`, `mailer_autoconfirm = true`. Der vorhandene Trigger
  `on_auth_user_created` erstellt das bestehende Profil und Startinventar.
  Kein Trigger, Profilfeld, Auth-Setting oder RLS wurde verändert.
- Name mit 1–80 Zeichen, ohne E-Mail/UUID/Steuerzeichen; Passwortwiederholung
  prüfen, Mehrfachabsenden sperren. Fehlertexte bleiben allgemein und DE/EN.
  Wenn Supabase keine Session zurückgibt, erscheint ein Bestätigungshinweis.
- `/profile/` ist eine eigene, lesende Profilseite: `display_name` und
  Registrierungsdatum (`auth.users.created_at` über die schmale Own-Identity-RPC).
  Keine direkte öffentliche Profil-/Auth-Abfrage, Rollen oder private Felder.
- Spielcharakter und persönliche Community-Aktivität sind ehrlich als noch
  nicht verfügbar gekennzeichnet. Keine simulierten Werte, Mitgliederprofile
  oder Beiträge. Beide neuen Seiten übernehmen den vollständigen globalen
  Community-/Besucherfooter und genau einen bestehenden Visitor-Einstieg.

## Forum-Einstieg und Entwürfe

- „Beitrag erstellen“ steht sichtbar auf der Übersicht und in jeder Kategorie.
  Gast: sofortiger Login-/Registrierungszustand, Rücksprung zum ursprünglichen
  `/forum/#compose/<kategorie>`. Member: direkt Editor mit Kategorie-Dropdown.
- Das Dropdown stammt aus denselben acht bestehenden Kategoriezeilen; innerhalb
  einer Kategorie ist diese bereits ausgewählt. Alte `#draft/`-Links funktionieren
  weiter. „Entwurf vorbereiten“ erscheint nicht mehr im normalen Ablauf.
- Beim Kategoriewechsel bleibt Text erhalten. Ein abweichender vorhandener
  Entwurf erfordert ausdrücklich „Text übernehmen“, „Vorhandenen öffnen“ oder
  Abbrechen. Keine stille Überschreibung gespeicherter Daten.
- Bestehender Storage-Key `zhserver_forum_drafts_v1`, Speichern, Vorschau,
  Zurück/Vorwärts, Reload und Zusammenführen weiterer Tabs bleiben erhalten.
  Nutzertext wird weder als HTML ausgeführt noch automatisch übersetzt.
- Öffentliches Veröffentlichen ist weiterhin **nicht** implementiert. Es gibt
  keinen Publish-Button und keine produktiven Forum-Schreibanfragen. Lokales
  Speichern und Vorschau sind sichtbar als solche gekennzeichnet.

## Noch offen / nächster abgegrenzter Schritt

1. Fehlende Anzeigenamen benötigen später eine schmale Own-Profile-Update-RPC
   mit serverseitiger Validierung und `auth.uid()`; aktuell existiert nur die
   geprüfte Own-SELECT-Policy. Die Profilseite täuscht keine Bearbeitung vor.
   Den bestehenden Adminaccount und seine Moderation dabei vollständig erhalten.
2. Öffentliche Forum-Themen/Antworten: zuerst passenden Backend-/RLS-/RPC-Vertrag
   definieren, Kategorie- und Inhaltsprüfung sowie Autor immer aus `auth.uid()`
   und dem bestätigten Profil. Keine Autor-ID oder freie Namensbehauptung glauben.
3. Tatsächliche Godot-/Dedicated-End-to-End-Abnahme gemäß `GAME_AUTH_HANDOFF.md`.
   Hier wurde ausschließlich der vorhandene spielseitige JS-Adapter gelesen
   und lokal im inerten iframe geprüft. Kein Webbuild oder Dedicated gestartet.

Prüfnachweise außerhalb des Repositories:
`C:\Users\sebbo\AppData\Local\Temp\zhserver-account-20261008`.
Screenshots im bestehenden Visualisierungsordner unter `account-20261008`.
Die Browserprüfung nutzt das echte Supabase-SDK mit abgefangenen Auth-/RPC-/
Tracking-Antworten: keine produktiven Testkonten, Beiträge oder Besucher erzeugt.

## Abnahme und Erhaltung

- 23 Prüfgruppen bestanden, insgesamt 66 gezielte DE/EN-Ansichten. Desktop
  1440/1280 sowie Header-Grenzen 1024/901, Tablet 768, Mobile 390/360 px.
  Header auf Start/Game/Galerie/Bugs/Arma/Wiki/Forum und neuen Accountseiten.
  Neue Seiten mit vollständigem Community-/Besucherfooter und Rechtslinks.
- Login, Registrierung, zukünftige E-Mail-Bestätigung ohne Session, fehlender
  Name, eigener Profilstatus, Reload, weitere Tabs, Sessionwechsel, Logout und
  verspätete Profilantwort nach Logout. Bestehender `/admin/`-Login und die
  Gästebuch-/Galerie-Namensbindung mit Gastname nach Logout gegenprüft.
- Forum-Gastgate/Rücksprung, Kategorien/Dropdown/Textkonflikte, unveränderter
  v1-Storage, Vorschau ohne HTML-Ausführung, Speichern, Reload, Zurück/Vorwärts,
  Sprachwechsel und Zusammenführung weiterer Tabs. Keine Veröffentlichung.
- Spiel-Popup für Login und Registrierung mit `noopener`, Sessionübergabe an
  originalen JS-Adapter im bereits geöffneten iframe sowie Tokenrefresh geprüft.
  Vorherige Bridge-Prüfung für Ablauf, defekten Speicher und Message-Vertrag
  bleibt gültig; der Transportvertrag wurde durch den Accountzusatz nicht geändert.
- JS-/Console-/HTTP-/Request-Fehler 0; horizontale Überläufe 0. Sechs betroffene
  JS-Dateien syntaktisch geprüft; `git diff --check` und zusätzliche Whitespace-
  Prüfung der neuen/ungetrackten Dateien sauber. Screenshots gesichtet.
- Gegen die Ausgangsbaseline dieser Ergänzung: 700 von 711 vorhandenen
  Homepage-Dateien bytegleich, genau elf vorgesehene bestehende Dateien geändert
  und fünf neue Dateien. Keine gelöschten/unbeabsichtigten Dateien. Wiki, `game/`,
  Admin-Code, Besucher-/Presence-Code und vorherige Inhalte unverändert. HEAD
  und Staging unverändert; kein Commit/Push/Webexport.
- Im separat bearbeiteten Spielprojekt unterscheiden sich `main.gd` und
  `dedicated_server.gd` inzwischen von dieser Baseline. Diese Aufgabe hat keine
  Spieldatei geschrieben oder diese Änderungen angefasst. Die übrigen sieben
  geprüften Spiel-/Handoff-Dateien einschließlich `game_account_session.gd`
  sind bytegleich. Kein Dedicated-Neustart aus dieser Homepage-Aufgabe.

## Zusatz: Passwort-Reset / Custom SMTP – 08.10.2026

Der zentrale Account enthält jetzt „Passwort vergessen?“ und `?mode=forgot`.
`resetPasswordForEmail()` nutzt denselben Client und führt auf die neue
`/account/reset-password/`-Seite. Dort erst bestätigtes `PASSWORD_RECOVERY`
plus gültige Auth-Session, dann `updateUser({ password })`, lokale Abmeldung
und Anmeldung mit neuem Passwort. Kein neuer Session-Speicher oder Authsystem.
Unbekannte E-Mail bleibt neutral; ungültiger Link und Sessionwechsel sperren
das Formular. `AuthSessionMissingError` ohne API-Code ausdrücklich behandelt.
Die vollständigen globalen Header-/Footer- und DE/EN-Bausteine sind vorhanden.

Details, Dashboard-URLs, STRATO-Einstellungen ohne Passwort, geprüfte SDK-Events
und offene produktive Abnahme in `PASSWORD_RESET.md`. Aktuelle Dashboardwerte
und Mailzustellung sind unbestätigt. Keine produktive Mail/Passwortänderung oder
SMTP-Konfiguration vorgenommen. Der Nutzer gibt das SMTP-Passwort ausschließlich
im Dashboard ein. Callback: `https://www.zhserver.de/account/reset-password/`.

Lokal sechs normale Prüfgruppen und vier erwartete Fehlerfälle erfolgreich
geprüft; 22 DE/EN-Ansichten Desktop/Tablet/Mobile, acht nach Abstandskorrektur
gezielt wiederholt. Normalbetrieb: JS-/Console-/HTTP-/Request-Fehler und
Überläufe 0. Kein Commit, Push, Webexport oder Dedicated-Neustart.

Erhaltungsprüfung dieser Reset-Ergänzung: 710 von 716 vorhandenen Homepage-
Dateien bytegleich, genau sechs vorgesehene bestehende Dateien geändert und
drei neue Dateien. Keine gelöschte oder unbeabsichtigte Datei. Wiki-, `game/`-,
Admin-, Besucher-, Presence-, Forum- und übrige lokale Änderungen unverändert.
HEAD und Staging unverändert. Drei betroffene JS-Dateien syntaktisch geprüft;
`git diff --check` und zusätzliche Whitespace-Prüfung neuer Dateien sauber.
Nachweise unter Temp `zhserver-password-reset-20261008`. Hier STOPP.

## Zusatz: Nutzungsbedingungen / Community-Regeln – 08.10.2026

Registrierung hat eine nicht vorausgewählte Pflichtcheckbox mit verlinkten
Fassungen `2026-10-08`. Datenschutzerklärung separat zur Kenntnisnahme verlinkt,
ohne pauschale Einwilligungscheckbox. Neue gemeinsame DE/EN-Seiten unter
`/nutzungsbedingungen/` und `/community-regeln/`, EN-Einstiegsaliases `/terms/`
und `/community-rules/`. Vollständiger globaler Header/Community-/Besucherfooter.
Gemeinsame Rechtsnavigation um beide Links ergänzt.

Backend gezielt rein lesend bestätigt: keine passende Zustimmungshistorie,
elf bestehende Accounts, vorhandener Profil-/Inventar-Trigger unverändert.
`legal_consent_prepare.sql` ergänzt ausschließlich eine private versionierte
Historie, einen zusätzlichen Signup-Trigger und zwei schmale lesende RPCs.
Besitzer/Zeitstempel serverseitig; Metadaten nur erste validierte Erklärung,
keine spätere Überschreibung oder Client-Schreibrechte. Bestehende Accounts
werden weder nachträglich markiert noch ausgesperrt; zukünftiger Re-Consent
und Profil-Rechtsbereich sind dokumentiert, nicht aktiviert.

**STOPP vor produktiver Migration, Freigabe fehlt.** `legal.js` enthält
`backendEnabled = false`; dadurch keine neue Registrierung ohne belastbares
Backendprotokoll und keine fehlende RPC/404. Login und Passwort-Reset bleiben
nutzbar. Erst nach SQL-Freigabe/Prüfung lokal aktivieren, weiterhin nicht pushen.
Details und genaue Auswirkung auf weitere zukünftige Signupwege:
`LEGAL_REGISTRATION.md`.

Neun lokale SQL-Prüfgruppen und sieben Browser-Prüfgruppen; 42 DE/EN-Ansichten,
Desktop/Tablet/Mobile. Login, Reset, Profil, Forum-Gate, Gästebuch/Galerie und
originaler inaktiver Spiel-JS-Adapter gezielt geprüft. Normale JS-/Console-/HTTP-/
Request-Fehler und Überläufe 0. Keine produktiven Konten/Mails oder DDL erzeugt.
Kein Commit, Push, Webexport oder Dedicated-Neustart. Hier STOPP.

Erhaltungsprüfung dieser Registrierungs-Ergänzung: 711 von 719 vorhandenen
Homepage-Dateien bytegleich, genau acht vorgesehene bestehende Dateien geändert,
acht neue Dateien. Keine gelöschten oder unbeabsichtigten Dateien; HEAD/Staging
unverändert. Wiki, `game/`, Admin, Forum/Gästebuch/Galerie, Besucher-/Presence-
Logik und Spielprojekt nicht bearbeitet. Fünf relevante JS-Dateien syntaktisch
geprüft; `git diff --check` plus Whitespace-Prüfung neuer Dateien sauber.
Nachweise: Temp `zhserver-legal-20261008/preservation.json`.

## Freigegebene Zustimmungs-Migration aktiviert – 08.10.2026

Aktueller Status ersetzt den vorstehenden Vorbereitungs-/Freigabestatus:
`20261008101121_homepage_account_legal_consent` im bestehenden Projekt angewendet;
`legal.js`: `backendEnabled = true`. Beide Fassungen `2026-10-08`, Zustimmung und
Serverdatum in privater Historie. Die tatsächliche lokale Registrierung nutzt
die produktive Policy-RPC (HTTP 200) vor dem bestehenden Supabase-Signup.

Produktive Funktionen/Rechte mit vollständig zurückgerollten Testzeilen geprüft:
sieben ungültige Varianten atomar abgelehnt, gültige Account-/Zeitzuordnung,
Own-Isolation, keine fremden oder direkten Client-Schreibrechte, keine spätere
Metadaten-Überschreibung. Elf vorhandene Accounts sowie Profil-/Inventar-Bestand
und bisheriger Trigger erhalten; keine Altaccount-Sperre oder Rückdatierung.
Security-Advisors: keine neuen Befunde.

Sieben Browser-Prüfgruppen und 42 DE/EN-Ansichten erneut mit dem tatsächlichen
aktivierten Source geprüft. Registrierung/Checkbox/Reload/Login, Dokumente,
Footer, Profil, Forum, Gästebuch/Galerie, Reset und bestehender inerter Spiel-
Handoff funktionieren. JS-/Console-/HTTP-/Request-Fehler und Überläufe 0.
Nur Policy-RPC real über HTTP; Auth-Schreib-/Mail-Flows isoliert als Fixtures.
Keine dauerhaften Testaccounts oder Mails. Weitere Details/Nachweise:
`LEGAL_REGISTRATION.md`, Temp `zhserver-legal-20261008/production-activation.json`,
`report-activated.json` und `activation-preservation.json`.

Diese Aktivierungsphase ändert nur `legal.js` und drei Dokumentationsdateien.
Übrige 723 von 727 Dateien bytegleich, keine neuen/gelöschten Dateien;
HEAD/Staging unverändert. Wiki/`game/`/Spielprojekt nicht bearbeitet.
`git diff --check` sauber. Kein Commit/Push/Webexport. Hier STOPP.

## Aktueller Auftrag: Identitätsaudit ohne cHa-Übernahme – 08.10.2026

Maßgeblich: `ACCOUNT_IDENTITY_MIGRATION_AUDIT.md`. Der neue Auftrag sperrt jede
weitere produktive Account-/Namensmigration. Legacy `cHa` und zentrale Admin-UUID
bleiben unverändert. Zentral weiterhin kein Profil; weder Name noch Spieldaten
automatisch zugeteilt. Bereits installierte Own-Name-RPC `20261008142028` bleibt;
kein Rollback, keine neue Migration, kein U01-/F01-/Dedicated-Rollout.

Lokale Profil-/Loginphase fertig: eigene private E-Mail über verifiziertes
`getUser()`, Accountstatus, sichtbare neutrale DE/EN-Loginfehler direkt im Formular.
Header ohne Profilname zeigt Account, keine E-Mail und kein erfundenes cHa.
Namenseditor und Cross-Tab-Invalidierung vorbereitet, im normalen UI aber
`nameEditingEnabled = false`. Editor verborgen, Formsubmit deaktiviert;
aktivierte Editorfälle wurden ausschließlich mit lokalen Auth-/RPC-Fixtures geprüft.
Grund: v116-Nickname-Login sowie Party-Lookup/-Annahme und Karten-/Statusreferenzen
benutzen Namen, Dedicated-v116 kürzt diese zudem auf 24 Zeichen.

Admin-UI verwendet nun gemeinsame `admin/access.js`-Prüfung derselben bestehenden
UID mit `getUser()`, auch auf direkten geschützten URLs und nach Accountwechsel.
Doppelte Logoutweiterleitung beseitigt, Feedback-Tablet-Überlauf korrigiert,
untrusted Gästebuch-/Galerietexte in Admin-HTML escaped. Produktive RLS unverändert.
Bestehende breitere Galerie-Storage-Policies getrennt dokumentiert, nicht als
durch den UI-Schutz repariert darstellen.

Abnahme: 11 gezielte lokale Chrome-Prüfgruppen, 24 DE/EN-Ansichten bei
1440/768/390/360 px plus Adminansichten auf allen vier Breiten. Normale
JS-/Console-/HTTP-/Request-Fehler und Überläufe 0. Drei absichtlich simulierte
HTTP-400-Ablehnungen (Namenskollision, falsches Passwort, unbekannte E-Mail)
separat; keine produktiven Auth-/Profil-/Moderationswrites. Screenshotprüfung
Desktop/Mobile bestanden. Bestehende Registrierung/Reset, Footer, Session,
Forum-/Gästebuch-/Galerie-Anmeldestatus gezielt erhalten/geprüft.

Nachweise: Temp `zhserver-account-cleanup-20261008/production-identity-audit.json`,
`verification-summary.json`, `preservation.json`, Bytecode-Audit in
`build-v116-readonly/`. Unveränderten früheren SMTP-/Handoff-Nachweis weiterverwenden.
Echter Admin-/Nicht-Admin-Login mit produktiven Zugangsdaten und Laptopdateien
weiterhin nicht live abgenommen. Profil/Login benötigen keine Accountmigration;
vor einem tatsächlichen Push bleibt die verlangte echte Adminregression offen.
19 fremde Wiki-Artefakte und Homepage-Wiki/`game/` bytegleich. Im Spielprojekt
nur gelesen; parallele Änderung an `dedicated_server.gd` nicht angefasst.

Kein Commit, Push oder Webexport. Nach dieser Phase STOPP.
## Finale Auth-Abnahme – 08.10.2026, Live-Server Port 5500

Der aktuelle lokale Stand wurde gegen `http://127.0.0.1:5500/` mit dem echten
produktiven Supabase Auth geprüft. Adminpasswort ausschließlich vom Nutzer im
Browser eingegeben, keine Passwörter/Tokens in Testdateien oder Logs.

- Echter Adminlogin: Profil mit eigener privater E-Mail und aktivem Account,
  Header ohne Anzeigenamen weiterhin `Account`, Namenseditor unsichtbar.
  Profil-Reload erfolgreich; eigene E-Mail nicht im Startseiteninhalt.
- Dieselbe Sitzung öffnet Dashboard und alle drei Moderationsansichten.
  Gästebuch/Galerie korrekt leer, Bugs/Ideen mit echten Daten geladen.
  Keine Freigabe, Löschung oder Statusänderung an produktiven Inhalten getestet.
- Echter Logout: Adminzugang gesperrt, Profildetails verborgen, E-Mail entfernt.
  Dashboard/Gästebuch/Galerie/Feedback direkt aufgerufen: alle vier Seiten
  leiten zu `admin/index.html?status=denied` um.
- Falsches Passwort und unbekannte E-Mail: beide echten Auth-Ablehnungen zeigen
  exakt `E-Mail-Adresse oder Passwort ist falsch.` Zwei erwartete HTTP 400;
  kein unerwarteter Browser-/Consolefehler in den abgenommenen Ansichten.
- Nutzer hat den echten Nicht-Admin-Browserlogin durch serverseitige Prüfung
  vorhandener Accounts ausdrücklich ersetzt: produktive UPDATE-/DELETE-RLS
  für Gästebuch, Galerie-Einträge, Feedback sowie DELETE für Feedback-Storage
  mit allen 11 vorhandenen Account-UUIDs ausgewertet. Jeweils 1 Admin erlaubt,
  10 Nicht-Admins verweigert. RLS aktiv, keine Namen/Metadaten als Autorisierung.
  Gemeinsame Browserkontrolle verifiziert dieselbe UUID mit `auth.getUser()`.
  Das ersetzt keinen vollständigen Test aller übrigen Backendberechtigungen:
  die bekannte breite Galerie-Storage-Policy bleibt unverändert offen.
- Kein Account angelegt, Passwort geändert, Profilname übernommen, Daten oder
  UUID migriert. Bereits installierte Own-Name-RPC behalten, Editor deaktiviert.
- `git diff --check` sauber. 26 vorgesehene Dateien auf Secret-Muster geprüft:
  keine Funde; ausschließlich bekannte öffentliche anon-JWTs erkannt.
  19 fremde Wiki-Artefakte unverändert und nicht für Staging vorgesehen.

Der Nutzer hat den echten Adminlogin zusammen mit dieser serverseitigen
Nicht-Admin-Prüfung ausdrücklich als ausreichende Auth-Abnahme freigegeben.
Diese angepasste Abnahme ist bestanden; Veröffentlichung ist damit beauftragt.
Logout und anschließende echte Wiederanmeldung ebenfalls bestanden: eigenes
Profil, Header `Account`, deaktivierter Editor und Dashboard erneut geprüft.
Account-/Profil-/Admin-Prüfung auf der veröffentlichten Domain folgt nach
dem Deployment.

## Aktuell: Legacy-cHa bewusst entfernt, zentrale Identität cHa – 09.10.2026

Der neue ausdrückliche Nutzerauftrag ersetzt die vorherige Namenssperre.
Produktiver Legacy-Authaccount `c00a3f4e-862c-4e10-bb38-31f2e62a2ac7` sowie
eigenes Profil, Spielstand, Inventar, Spiel-Presence, zwei eigene Gruppen und
deren notwendige Referenzen entfernt. Eine offene Clan-Einladung entfernt;
fremde Clans/Gruppen/Accounts und Gameplaybestände erhalten. Keine Datenübernahme.

Bestehender zentraler Adminaccount `7ba1fad4-d113-4526-8873-3e3b97e9be7e`
behält seine vollständige Auth-Zeile und Rechte. Eigener Profileintrag mit cHa
über installierte `set_zh_own_display_name`-RPC angelegt; Registrierung bleibt
30.07.2026, zentrale Spielstand-/Inventartabellen weiterhin ohne neue Zeilen.
Keine DDL-, RLS- oder RPC-Änderung, Namenseditor weiter deaktiviert.

Exakte Datenwirkung, Guards, archiviertes SQL, Rücknahmegrenze und notwendige
Clientumstellung: `ACCOUNT_IDENTITY_MIGRATION_AUDIT.md`. Vollständiger Rollback-
Probelauf vor erfolgreichem produktivem Commit. Nicht betroffene Zeilen in
26 Relationen und alle Policies transaktionsintern unverändert; anschließende
unabhängige Prüfung ohne Legacy-Referenzen oder verwaiste relevante FKs.
Sieben Moderationspolicies erlauben nur die bestehende Admin-UUID, keine der
neun übrigen Account-UUIDs. Bekannter Galerie-Storage-Rechtebefund bleibt offen.

Echte Live-Sitzung: Header und Profil zeigen cHa, nur eigenes Profil zeigt
private Login-E-Mail; Profil-Reload und DE/EN funktionieren. Forum-Entwurfsformular
zeigt denselben Namen, Gästebuch und Galerie binden ihn automatisch in gesperrte
Namensfelder. Keine Beiträge oder Screenshots zu Testzwecken gespeichert.
Forum bleibt ausdrücklich lokal/Entwurf, kein produktives Veröffentlichungsbackend.
Dashboard und alle Moderationsansichten mit echter Sitzung geöffnet/gelesen.
Logout entfernt private Profildaten und sperrt alle vier direkten Admin-URLs.
In den geprüften Ansichten keine Browser-JS-/Consolefehler oder horizontalen
Überläufe. Bestehende Darstellung und Homepage-JS wurden nicht verändert.

Letzte echte Wiederanmeldung nach Logout ebenfalls bestanden: Nutzer hat sein
unverändertes Passwort ausschließlich im Formular eingegeben; Header/Profil
weiterhin cHa, eigene private E-Mail korrekt und Dashboard erneut zugänglich.
Produktive Auth-Abnahme damit abgeschlossen. Finale Stage-Prüfung, Commit/Push
und Deployment sind im ausdrücklichen Auftrag freigegeben. Keine weitere
Accountänderung oder Migration. Veröffentlichung enthält nur die zugehörigen
Projektregeln/Account-Dokumentation und das geprüfte SQL-Archiv; keine Testartefakte.
Kein Spiel-/Dedicated-/U01-/F01-Rollout, kein Godot-Webexport.
