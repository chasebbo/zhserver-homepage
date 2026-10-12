# Forum – Fortsetzungscheckpoint

## Produktivfreigabe – 12.10.2026

- Der Nutzer hat den geprüften Forum-/Profil-/Rollenstand einschließlich der zwei
  korrigierten Kategorienbeschreibungen zur Veröffentlichung auf `origin/main`
  freigegeben. Bestehendes GitHub-Pages-Deployment verwenden.
- Release umfasst 37 gezielt geprüfte Dateien: Forum, Profil, zentrale Rollen-/
  Adminanbindung, DE/EN, Dokumentation und die vorhandene globale Navigationsbereinigung.
  Wiki-HTML enthält ausschließlich diese bereits freigegebene Header-/Cachebereinigung.
  Fremde Wiki-Daten/JS und 19 lokale Wiki-Prüfdateien bleiben außerhalb des Commits.
- Keine neue Supabase-Migration, keine Spiel-/Webbuild-/Dedicatedänderung.
  Live-Abnahme nach Deployment: bestehende cHa-Sitzung, Profile/Avatare, echte
  Veröffentlichung/Antwort/Bearbeitung, unabhängige öffentliche Sichtbarkeit,
  serverseitige Membergrenzen, DE/EN und Responsive.
- Release-Hash, Deployment und Live-Nachweise werden außerhalb Git im Verzeichnis
  `forum-release-20261012` unter dem bestehenden Codex-Prüfpfad dokumentiert.
  Die nachfolgenden Abschnitte halten den geprüften Ausgangsstand fest.

## Geprüfter Ausgangsstand – 12.10.2026: echtes Forum lokal zur Abnahme

### Freigegebene Rollen-Migration angewendet – 12.10.2026

- Migration `20261012113834_homepage_central_account_forum_roles` erfolgreich im
  bestehenden Projekt installiert. cHa-UUID unverändert einziger Admin; neun weitere
  registrierte Accounts Member. Keine Account-/Namens-/Spielmigration.
- Neun bestehende Admin-Policies verwenden dieselbe serverseitige zentrale Rolle.
  Eigene UUID stammt aus `auth.uid()`. Kein Adminrecht aus Anzeigename, Metadaten
  oder Rang. Übergangs-UUID-Fallback nach Aktivierung aus `admin/access.js` entfernt.
- Echte installierte RPCs unter `authenticated` geprüft: Member können eigene
  Themen/Antworten schreiben, keine fremde Bearbeitung/Entfernung, keine Selbst-
  beförderung und keine direkte Rollenänderung. Zusätzlicher Admin in Testtransaktion
  kann fremde Inhalte bearbeiten/entfernen/wiederherstellen, Autor bleibt erhalten.
  Herabstufung sofort wirksam; letzter Admin sowie ungültige Rolle/Ziel-UUID geschützt.
  Alle Teständerungen zurückgerollt. Danach ein Thema/zwei Beiträge und deren
  ursprüngliche Sichtbarkeit/Aktivität erhalten; produktiv weiterhin nur cHa Admin.
- Echte cHa-Browsersitzung: eigene Profilrolle/Avatar und alle vier geschützten
  Adminseiten erreichbar. Gäste direkt verweigert; Membergrenzen serverseitig mit
  bestehenden UUIDs geprüft, ohne neuen Account oder Passwortänderung. Admin-Guard
  zusätzlich zehn Vertragsfälle bestanden. Rangzeile bleibt ohne Daten verborgen.
- Forum/öffentliches Rav-Profil/Profilrollen DE/EN, Desktop 1440/1179, Tablet 768,
  Mobile 390 geprüft. Avatar auch nach Reload erhalten. Keine zweite Anmeldung,
  Rollenverwaltung im normalen UI oder erfundenen Ränge. Memberdefault-Trigger
  installiert, Default im isolierten Modell geprüft; keine Testregistrierung.
- Nachweise `roles-applied-final.json`, `production-role-regression.sql` und neue
  Desktop-/Mobile-Rollenaufnahmen außerhalb Git im bekannten Prüfverzeichnis.
  Konkreter Umfang und Rücknahme: `ACCOUNT_FORUM_ROLES_REVIEW.md`.
- Abschluss: Browser-JS-/Consolefehler 0, horizontale Überläufe 0, sieben geprüfte
  UI-Dateien und Avatar HTTP 200/MIME korrekt. Fünf geänderte JS-Dateien syntaktisch
  gültig; `git diff --check` sauber und Git-Index leer. Unbeteiligte lokale Dateien
  einschließlich Wiki-Daten/JS und vorhandener Prüfarbeitsdateien SHA256-unverändert.
  Sicherheitsadvisor: keine neue WARN für Rollen-/Forum-RPCs; die private
  Rollentabelle ist absichtlich RLS-geschützt ohne direkte Client-Policies/-Grants.
  Kein Commit, Push, Deployment oder Webexport. STOPP nach Abschluss.

### Abschlusschecks und Rollen-Vorbereitung vor der Freigabe – 12.10.2026

- Avatar nach der RLS-Korrektur nochmals wirklich über das bestehende lokale
  Profilformular hochgeladen: originales Homepage-Handlogo, korrekte eigene UUID,
  Erfolgsmeldung, Reload und danach im eigenen/öffentlichen Profil sowie beiden
  Forumbeiträgen sichtbar. Aktueller Pfad endet auf
  `f3055969-2cf0-4c2b-a902-0c83e916f363.webp`, WebP 256 × 256, 23.946 Byte.
  Fremder Avatar-INSERT/UPDATE und fremde Profilzuordnung in Rollbacktests verweigert;
  eigene Objektreservierung ohne Metadaten erlaubt. Keine fremden Dateien verändert.
- Die bereinigte rohe Navigation bleibt auf allen 13 gemeinsamen Seiten gleich.
  Keine zusätzliche Community-Ausblendelogik mehr in `i18n.js`.
- Zentrale Rollen/Moderation/Ranganzeige lokal vorbereitet, **Backend noch NICHT
  umgestellt**. Konkrete Freigabevorlage `ACCOUNT_FORUM_ROLES_REVIEW.md`, Migration
  `account_forum_roles_prepare.sql`, geprüfte ursprüngliche Rücknahmebasis
  `account_forum_roles_rollback.sql`. Kein zweites Login oder Profilnamenssystem.
- `member`/`admin` aus privater UUID-Rollenzuordnung, Memberdefault bei Signup,
  kontrollierbare zusätzliche Admins und Schutz des letzten Admins. Neun bestehende
  Admin-Policies sollen auf dieselbe Rolle umgestellt werden; Avatar/Game unverändert.
  Keine Entscheidung nach Namen, Metadaten oder Rang. Rangvertrag zunächst NULL,
  keine erfundenen Ränge. Rollenlabels/Löschbestätigung erst mit bestätigtem Backend.
- Neun Admin-Guard-Fälle und isoliertes TEMP-SQL-Modell mit exakten Kandidaten-
  Funktionskörpern erfolgreich: Memberdefault, zusätzliche Admins, fremde Admin-
  Bearbeitung/Entfernung, Membergrenzen, Metadaten/Rang ohne Rechte, Restore,
  unveränderte Autoren, Schutz des letzten Admins und unmittelbare Aberkennung.
  TEMP-Modell zurückgerollt; keine produktiven Rollen/Accounts geändert.
- Lokaler Adminzugang erhält bis zur Aktivierung ausschließlich die bisherige
  Admin-UUID. Nach `role_version=1` wird nur noch die bestätigte Serverrolle geprüft;
  ein demotierter ursprünglicher Admin erhält dann keine UUID-Ausnahme.
- Produktiv weiterhin zehn Accounts, ein Forumthema/zwei Beiträge, ursprüngliche
  vier Backend-Funktionen unverändert und keine `account_roles`-Tabelle.
  STOPP vor produktiver Rollen-Migration; separate Freigabe erforderlich.
- Abschließende native Prüfung: alle 13 rohen Navigationen korrekt, sieben
  geänderte UI-Dateien HTTP 200/MIME korrekt, neuer Avatar HTTP 200/WebP/256 × 256
  mit passender Besitzer-UUID. Lokaler echter cHa-Adminzugang nach aktualisiertem
  Guard bestätigt. Browser-JS-/Consolefehler 0; Syntax/Diff-Whitespace sauber.
  Fremde lokale Dateien per SHA256 erhalten. Kein Commit, Push oder Deployment.

### Nachprüfung vor der Rollen-Migration: Autoren und reduzierte Darstellung

- cHa ist ausschließlich der erste Browser-Testaccount. Themen und Beiträge erhalten
  `author_id` über `member_id()` aus `auth.uid()`. Die veröffentlichte Darstellung
  liest `profiles.display_name` über die gespeicherte Autoren-UUID. Kein cHa-/
  Sebastian-Fallback und kein vom Browser frei übergebener Autor. Die bestehende
  feste Admin-UUID wird ausschließlich für Adminrechte verwendet.
- Installierte produktive RPC-Definitionen erneut gelesen. Zusätzliche echte RPC-
  Tests unter `authenticated` mit den bestehenden Nicht-Admins `Rav` und `rave`:
  jeweils eigene Antwort und eigenes Thema, eigene UUID für Thema/Eröffnungsbeitrag/
  Antwort sowie jeweils eigener Profilname. Absichtlich abweichende `user_metadata`
  mit cHa/admin ignoriert, keine Moderationsrechte und keine öffentliche E-Mail.
  Gesamte Testtransaktion zurückgerollt; keine neuen Accounts, Profiländerungen
  oder dauerhaft gespeicherten Testbeiträge. Ein anfängliches Freigabe-Nutzungslimit
  war nach Ablauf der angezeigten Resetzeit aufgehoben; die reguläre Prüfung lief durch.
- Öffentliche Profile Rav/rave in der echten UI geprüft: jeweiliger Name,
  Initialen Ra/ra, keine E-Mail und kein horizontaler Überlauf.
- Sämtliche Forum-SVG-Piktogramme und Definitionen entfernt: Kategorien, Suche,
  Zeilenpfeile, Schreibbuttons, Leerzustände, Legende, Entwurf und Seitenlinks.
  Dekorative Punkte entfernt; keine leeren Icon-Spalten/-Boxen. Kategorien mit
  Typografie, Linien und zurückhaltenden Rahmen. Das Personenpiktogramm der
  gemeinsamen Accountanzeige ausschließlich auf der Forum-Seite ausgeblendet.
  Echte öffentliche Avatare bleiben erhalten; Entwurf zeigt eigene Initialen.
- Desktop 1440, Tablet 768, Mobile 390, DE/EN und sichtbare Profile geprüft.
  Neue Aufnahmen: `forum-reduced-overview-desktop-en.jpg` und
  `forum-reduced-overview-mobile-de.jpg` im bestehenden Prüfnachweisordner.
- Abschließend: 0 sichtbare Forum-/Personenpiktogramme, echte Threadavatare
  erhalten, Entwurfsinitialen aus dem eigenen Namen; 0 Browser-JS-/Consolefehler.
  Drei geänderte UI-Dateien HTTP 200 mit passenden MIME-Typen, Syntax und
  `git diff --check` sauber. 45 andere Working-Tree-Dateien SHA256-unverändert.
  Mehrbenutzer-Testdaten nach Rollback nicht vorhanden: weiterhin genau das
  eine bisherige cHa-Testthema mit zwei Beiträgen und unveränderter letzter Aktivität.
  Keine neue Migration, kein Commit, Push, Deployment oder Webexport.

Die bisherige Entwurfsoberfläche ist weiterverwendet. Themen, Antworten und eigene
Bearbeitungen werden jetzt tatsächlich in Supabase gespeichert. Die Homepage-Dateien
sind weiterhin nur lokal: kein Commit, Push, Deployment oder Webexport.
Die älteren Abschnitte unten dokumentieren die damaligen, inzwischen erweiterten Grenzen.

- Acht bestehende Kategorien; echte Themenlisten, Antwortzahlen, Serverzeitstempel,
  Seitenwechsel sowie angeheftete/geschlossene Themen. Ankündigungen und Moderation
  sind nur mit der bestehenden Admin-UUID möglich.
- Zentrale Session und `profiles.display_name`, kein zusätzlicher Login/Name.
  Autoren/Besitzer aus `auth.uid()`; öffentliche Inhalte enthalten keine E-Mail.
- `ENTWURF SPEICHERN` und `THEMA VERÖFFENTLICHEN` sind getrennt. Storage-Key
  `zhserver_forum_drafts_v1`/Version 1 und vorhandene Entwürfe bleiben erhalten.
  Stabile Request-UUID verhindert doppelte Veröffentlichung. Nur der genau
  veröffentlichte Entwurf wird entfernt; abweichende Texte anderer Tabs bleiben.
- Neue Fragment-Routen `#thread/<UUID>` und `#profile/<UUID>`. Öffentliche Profile
  zeigen Anzeigename, Avatar, Mitgliedsdatum, optionalen Kurztext und öffentliche
  Themen/Beiträge. Eigene E-Mail bleibt im privaten Accountprofil.
- Avatar/Bio im bestehenden `/profile/`: JPG/PNG/WebP, Eingang maximal 2 MiB,
  4096 × 4096 Pixel; Normalisierung auf 256 × 256, gespeichert maximal 256 KiB.
  UUID-Verzeichnis, neue Dateinamen und serverseitige Objekt-/MIME-/Größenprüfung.
  Der Namenseditor bleibt deaktiviert; keine Auth-, Namens- oder Spielmigration.

### Backend und Freigaben

Nach zwei ausdrücklichen Nutzerfreigaben erfolgreich angewendet:
`homepage_persistent_forum_and_public_avatar` und
`homepage_forum_avatar_upload_reservation_fix` im bestehenden Projekt `zhserver`.
Exakte SQL-Dateien: `forum_persistence_prepare.sql` und
`forum_avatar_upload_policy_fix.sql`; Umfang/Rücknahme in `FORUM_MIGRATION_REVIEW.md`.

Privates, nicht von der Data API exponiertes Schema `zh_forum_private` mit drei
RLS-Tabellen: `topics`, `posts`, `profile_extras`. Keine direkten Tabellenrechte;
Zugriff über sieben begrenzte öffentliche SECURITY-INVOKER-RPCs. Nur zwei Lese-RPCs
für Gäste, fünf Schreib-RPCs für bestätigte Accounts. Privilegierte Implementierung
im privaten Schema prüft UUID/Berechtigungen. Die Advisor-Info zu RLS ohne Policies
ist hier die beabsichtigte Sperre direkter Zugriffe, kein fehlender öffentlicher Zugriff.

Der echte Upload fand einen Fehler der ursprünglichen INSERT-Policy: Storage
reserviert Objekte vor vollständigen Dateimetadaten (HTTP 400 / RLS). Die freigegebene
Nachkorrektur ändert ausschließlich diese neue Policy. Eigener UUID-Pfad sowie
Bucket-MIME-/Größenlimit und Prüfung bei Profilzuordnung bleiben erhalten.

Bestehende zehn Auth-UUIDs, neun Profilspalten und sämtliche vorherigen Profil-/
Storage-Policies wurden gegen den vorherigen Bestand verglichen und sind unverändert.
Admin bleibt `7ba1fad4-d113-4526-8873-3e3b97e9be7e`, öffentlich `cHa`.
Keine Änderung an Dedicated, U01/F01, v118, Spielprojekt, Besucher-/Presence-Logik.

### Echte Prüfungen und erhaltene Testdaten

- cHa über Port 5500: Entwurf speichern/Reload, Vorschau, veröffentlichen,
  Themen-/Kategorieabruf, Antwort, eigene Themen-/Antwortbearbeitung und Reload bestanden.
  Veröffentlichter Entwurf entfernt, anschließender Editor leer; keine Fake-Benutzer.
- Genau ein gekennzeichnetes Thema mit einer Antwort zur Abnahme erhalten:
  `Forum-Funktionstest – 12.10.2026 (geprüft)`, Kategorie `general`,
  `#thread/b086b856-afe5-4d6c-b7fa-ccab7ec4f399`. Beide Autoren echte cHa-UUID.
- Echter Avatarupload mit vorhandenem Original-Logo
  `assets/images/android-chrome-512x512.png`: gespeichertes WebP 256 × 256,
  23.946 Byte, HTTP 200; in Thread, Themenliste und öffentlichem Profil sichtbar.
- Getrennte ausgeloggte Ansicht auf `http://localhost:5500/forum/` liest dieselben
  zwei Beiträge unabhängig vom Entwurfsspeicher auf `127.0.0.1`. Kein Token kopiert;
  kein eigener zweiter Chrome-Prozess behauptet. Lesen erlaubt, Schreiben gesperrt.
- Reale RPC-Tests mit vorhandenen Nicht-Admin-UUIDs und Gästen in zurückgerollten
  Transaktionen: eigene Bearbeitung erlaubt; fremde Bearbeitung, Moderation,
  Ankündigungen, private Tabellen und fremde Avatarpfade gesperrt. Manipulierte
  Anzeigenamen/Metadaten verleihen keine Adminrechte. Idempotenz/geschlossene Themen geprüft.
- Öffentliche Profilantwort genau `user_id`, `display_name`, `created_at`, `bio`,
  `avatar_path`; keine E-Mail, Rolle oder Auth-Metadaten.
- DE/EN, Desktop/Tablet/Mobile und mobile Navigation geprüft. Nutzertexte bleiben
  unverändert. Alle 13 rohen gemeinsamen HTML-Navigationen haben dieselben acht
  Punkte; Community-Entfernungslogik in i18n ausschließlich dafür entfernt.
- Tatsächliche Forum-Layouts bei 1440, 768 und 390 px ohne horizontalen Überlauf;
  zusätzlich echte cHa-Ansicht bei 1179 px. DE/EN samt Reload, Profil-/Kategorie-
  Navigation und Browser-Zurück/Vorwärts bestanden. Browser-JS-/Consolefehler: 0.
- Native Prüfung: 20 UI-Dateien HTTP 200, passende MIME-Typen, aktuelle JS/CSS-Bytes,
  echte öffentliche RPC-/Avatarabrufe. JS-Syntax und `git diff --check` sauber.
- Fünf zuletzt geänderte JS/CSS-Dateien abschließend erneut HTTP 200 und bytegleich;
  19 geschützte Prüfarbeitsdateien SHA256-unverändert. Unerwartete HTTP-Fehler
  in der erfolgreichen Abschlussprüfung: 0. Der vorherige Avatar-HTTP-400 wurde
  ausdrücklich als gefundener und behobener Fehler dokumentiert.

Prüfnachweise/Screenshots außerhalb Git:
`C:/Users/sebbo/.codex/visualizations/2026/09/30/01a0f137-f3f5-7bc0-b080-7b451ea65ff0/forum-functional-20261012`.
Die 19 bestehenden Wiki-Prüfartefakte bleiben unverändert. Während dieser Phase
erschienene fremde Änderungen an `assets/data/wiki-entries.json` und
`assets/js/wiki-data.js` sind nicht Bestandteil des Forumauftrags und bleiben erhalten.
`wiki.html` enthält ausschließlich die ausdrücklich beauftragte Navigation-/Cache-Anpassung.

Hauptdateien: `forum/index.html`, `forum.js`, neue `forum-api.js`, `forum-content.js`,
`forum-content.css`, `profile/index.html`, `profile-community.js`, zentrale DE/EN-Texte.
Bestehender globaler Community-/Besucherfooter vollständig erhalten.

**Nächster Schritt: Abnahme dieses lokalen Standes. STOPP; nicht eigenständig veröffentlichen.**

---

Stand: 06.10.2026. Lokale UI-Teilphase abgeschlossen; kein Commit, Push oder Webexport.
Ausgangspunkt war die vorhandene Baustellen-Seite, nicht ein neues Forum-Projekt.

## Fertiger lokaler Abschnitt

- Die acht bestehenden Kategorien bleiben erhalten. Die Übersicht hat Beschreibungen,
  kleine Symbole, eine Suche und eine zurückhaltende Forum-Listenansicht.
- Kategorieansichten, Breadcrumbs, aktive Kategorie, Browser-Zurück/Vorwärts und
  direkte Fragment-Links funktionieren. Alle/angeheftet/geschlossen sind UI-Ansichten
  mit ehrlichen Leerzuständen, keine angebundenen öffentlichen Themenlisten.
- Je Kategorie kann ein eigener Entwurf mit Titel und Text vorbereitet, manuell im
  Browser gespeichert, erneut geladen, bearbeitet und ausdrücklich verworfen werden.
- Die Beitragsvorschau zeigt ausschließlich den eigenen Entwurf. Titel/Text bleiben
  bei DE/EN unverändert; HTML wird als Text dargestellt. Speicherzeiten sind echte
  lokale Entwurfszeiten, keine erfundenen Beitrags-/Aktivitätszeiten.
- Autorenbereich und Antwortansicht sind vorbereitet. Kein Autorprofil, keine echte
  Antwortfunktion und keine Veröffentlichung sind angebunden.
- Gemeinsamer Header und Footer blieben unverändert. Die neue CSS-Datei ist vollständig
  auf `.forum-page` begrenzt. Die bisherigen Übersetzungseinträge sind unverändert;
  92 neue UI-Nachrichten stehen ausschließlich unter `messages["forum.*"]`.

## Bewahrte Grenzen

Kein Supabase-Client auf der Forum-Seite und keine Backend-Anfragen. Keine produktiven
Tabellen, Authentifizierungsänderungen, RLS-Regeln, Fake-Beiträge oder Fake-Benutzer.
Wiki, Spielprojekt, `game/`, Besucherstatistik und andere Homepage-Inhalte wurden nicht
bearbeitet. Vorhandene lokale Wiki-/Asset-/Validierungsänderungen bleiben erhalten.

## Prüfung dieses Standes

- Chrome über lokalen HTTP-Testserver; DE/EN bei 1920, 1440, 1280, 768, 390 und 360 px.
- Zusätzlich Beitragsansicht bei 1440/1280/768/390/360 und Editor bei 1440/768/390/360.
- 29 protokollierte Layoutzustände, kein horizontaler Überlauf und keine verdeckte
  Ansichtüberschrift. Desktop-/Mobile-Aufnahmen visuell kontrolliert.
- Suche/Leerzustände, Statusansichten, mobile Navigation und Sprachpersistenz geprüft.
- Speichern/Reload, Browser-Zurück/Vorwärts, zwei Tabs, bestätigtes Verwerfen, blockierter
  und beschädigter Browser-Speicher sowie lange Texte und HTML-Textausgabe geprüft.
- Browser-JS-Fehler: 0. Console-Fehler: 0. HTTP-Fehler: 0. Backend-Anfragen: 0.
- `node --check` für Forum-JS und Übersetzungen erfolgreich; `git diff --check` sauber.
- Bestehende zentrale Übersetzungen, Header/Footer und eindeutige HTML-IDs geprüft.
- Die Tastatur-Sprungnavigation fokussiert die aktuelle Ansicht, ohne die Kategorie
  oder einen offenen Entwurf zu wechseln; separat auf Desktop und Mobile geprüft.

Lokale Prüfnachweise: `C:\Users\sebbo\AppData\Local\Temp\zhserver-forum-20261006\report.json`.
Der zugehörige `check.cjs` nutzt den vorhandenen Node-/Playwright-Runtime und Chrome,
erstellt isolierte Browser-Kontexte und schließt seinen lokalen HTTP-Testserver danach.
Der Windows-Sandbox-Modus sperrt localhost; der erfolgreiche Lauf nutzte freigegebenen
lokalen Zugriff. Die Prüfdaten wurden nicht in das Repository oder ein Backend übernommen.

## Hauptdateien und nächster Schritt

`forum/index.html`, `assets/css/forum.css`, `assets/js/forum.js`, ausschließlich die
neuen Forum-Texte in `assets/js/translations.js`, `docs/FORUM_PLAN.md` und dieser Checkpoint.
`FORUM_PLAN.md` beschreibt Fragment-Routen, Browser-Drafts und das spätere Datenmodell.

Bei Fortsetzung zuerst diese Dateien und den aktuellen Diff übernehmen. Kein Neubeginn
und keine erneute Prüfung unveränderter Homepage-/Wiki-/Spielbereiche.

Der nächste sinnvolle Abschnitt ist die konkrete Abstimmung mit der bestehenden
Homepage-Authentifizierung: öffentliche Profilfelder, Themen-/Beitragsrechte und
Moderationsrollen. Danach kann in einem beauftragten Backend-Abschnitt die echte
Themenliste angeschlossen werden. Lokale Entwürfe niemals automatisch veröffentlichen.

## Ergänzung: bestehende Admin-Anmeldung, 07.10.2026

Die Frontend-/Session-Bestandsprüfung ist in `AUTH_AUDIT.md` dokumentiert. Der
bestehende Supabase-E-Mail-/Passwort-Login und der vorhandene SDK-Speicherschlüssel
werden für die zentrale ZHServer-Anmeldung übernommen. Keine zweite Anmeldung.
Die Session kann auf derselben Origin außerhalb von `/admin` verwendet werden;
gezielte lokale Tests mit dem realen SDK und simuliertem Backend bestätigen dies.

Profil-/Rollentabellen und RLS müssen vor ihrer Anbindung noch im Backend bestätigt
werden. Die öffentlich zugängliche API liefert diese Metadaten nicht; weder ihr
Fehlen noch die Sicherheit der Adminrechte wurde behauptet. Keine produktiven
Account-/Rollenänderungen. Forum-Code und lokale Entwurfsfunktionen bleiben gleich.

Eine bestehende Dashboard-Namenskollision mit dem aktuellen Supabase-SDK wurde
lokal durch `dashboardClient` behoben; Login/Session/Logout bleiben unverändert.
Nächster Schritt: die fehlenden Backend-Fakten anhand des vorbereiteten read-only
Audits feststellen und darauf den gemeinsamen Client-/Session-Zugriff aufbauen.

## Globale Community-Statistik, 07.10.2026

Das Forum zeigt jetzt dieselbe globale Community-/Presence-Ansicht wie die Homepage.
Gemeinsamer Baustein und Backend-Vertrag, keine Forum-eigene Statistik. Vorhandene
Kategorien, Navigation und lokale Entwürfe bleiben erhalten. Der vollständige
Startseiten-Footer mit allen fünf Besucherwerten ist ergänzt; vorhandene Besucher-
Implementierung genau einmal. Persistente Zähllogik unverändert.

Neue Presence noch deaktiviert, bis private Backend-Strukturen/RLS und öffentliches
Profilfeld bestätigt sind. Keine Fake-Zahlen oder erfundenen Mitgliederprofile.
Details, SQL-Entwurf, Prüfungen und Aktivierung in `COMMUNITY_STATS_CHECKPOINT.md`.

## Platzierungskorrektur, 07.10.2026

Globale Community-/Presence-Anzeige aus der Seitenleiste entfernt und in den
globalen Footer verlegt. Dort stehen Community und persistente Besucherstatistik
gemeinsam, mit getrennten Datenquellen. Einheitlicher Renderer/Styles auch auf
allen anderen Homepage-Seiten. Forum-Entwürfe, Kategorien und Funktionen gleich;
Presence-Aktivierung/Backend unverändert. Keine Forum-eigene Statistik hinzugefügt.

## Fortsetzung: globaler Community-Footer aktiv, 07.10.2026

Nach verbundenem Supabase-Audit und ausdrücklicher Migrationserlaubnis ist der
gemeinsame Community-Baustein lokal aktiv und verwendet echte globale RPCs.
Online-/Gast-/Mitgliedszahlen und 11 bestehende Auth-Accounts erscheinen auch im
Forum-Footer. Derselbe Browser bleibt über Seitenwechsel/Reload/zweiten Tab einmal
erfasst. Privates Profilnamensfeld wird nicht öffentlich gemacht; „Neuestes
Mitglied“ bleibt „—“. Details und Grenzen: `COMMUNITY_STATS_CHECKPOINT.md`.

Keine Forum-Funktionen oder Entwürfe verändert. Forum-Beiträge, Themen und eine
eigene Account-Oberfläche sind weiterhin nicht produktiv angebunden; die globale
Presence ist keine Forum-Backend-Implementierung. Kein Commit/Push/Webexport.

## Zentrale Anzeigename-Anbindung – 07.10.2026

Die bestätigte bestehende Supabase-Session und `get_zh_own_identity()` liefern
jetzt den Namen für Statuszeile und Beitragsvorschau. Keine eigene Forum-
Namenseingabe. Gäste lesen die vorhandenen Bereiche; Entwurf-Eingabe/Speichern
und Vorschau erfordern eine bestätigte Identität mit gültigem Namen. Lokale
Entwürfe, Storage-Key, Kategorien, Suche und Navigation bleiben erhalten;
Logout löscht keine Entwürfe. Nutzertexte werden nicht automatisch übersetzt.

Keine produktiven Forum-Tabellen oder Veröffentlichungsfunktionen angelegt.
Entwürfe weiterhin ausdrücklich nur im Browser, kein öffentlicher Beitrag.
Der Zwischenentwurf einer separaten Forum-Content-Migration wurde vor Anwendung
aus dieser minimalen Identitätsphase genommen; entsprechende Provisorien sind
nicht Teil des aktuellen Codes. Nächste eigene Forumphase: gespeicherte Themen/
Antworten mit serverseitiger `auth.uid()`-Zuordnung und vorhandener Namensprüfung.

Globale Footer-Anzeige nennt jetzt echtes neuestes Mitglied `trux`; Account-Reset
bleibt gold und DE/EN. Namensgrundlage und Grenzen: `PUBLIC_IDENTITY.md`.
Login auf offener Seite, Reload/Logout, eigene Vorschau, DE/EN und Desktop/Tablet/
Mobile geprüft; Browser-JS-/Console-/HTTP-Fehler 0. Kein Commit/Push/Webexport.

## Zentraler Account und sichtbarer Beitrags-Einstieg – 08.10.2026

Der vorhandene Forum-Stand wurde gezielt erweitert, nicht ersetzt. Übersicht
und Kategorien zeigen „Beitrag erstellen“. Gäste erhalten sofort den zentralen
Anmelde-/Registrierungszustand; dessen Rücksprung behält die gewählte Kategorie.
Nach Login erscheint der Editor auch in einem bereits geöffneten Forumtab.
Logout schließt die Eingabe, ohne gespeicherte Entwürfe zu löschen.

Der Editor enthält die Kategorieauswahl aus den vorhandenen acht Kategorien;
Kategorieansichten wählen ihre Kategorie vor. Wechsel übernimmt eingegebenen
Text, bei abweichendem vorhandenen Entwurf erst nach einer ausdrücklichen
Entscheidung. Alte `#draft/`-Routen, Storage-Version/Key, lokale Speicherung,
Vorschau und Tab-Zusammenführung bleiben erhalten. „Entwurf vorbereiten“ ist
aus dem sichtbaren Ablauf entfernt. Nutzertexte werden nicht übersetzt.

Öffentliche Themen/Antworten sind weiterhin nicht produktiv implementiert.
Speichern heißt ausdrücklich „Lokal speichern“; kein Publish-Button oder
Schreib-RPC wird vorgetäuscht. Profil und gemeinsamer Header sind vorbereitet;
Backend-/RLS-Anforderungen und nächster Schritt in `ACCOUNT_CHECKPOINT.md`.
Spiel-Handoff bleibt parallel erhalten, siehe `GAME_AUTH_HANDOFF.md`.
