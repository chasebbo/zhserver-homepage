# Forum – Fortsetzungscheckpoint

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
