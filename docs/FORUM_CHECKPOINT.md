# Forum – Fortsetzungscheckpoint

## Produktivfreigabe für Pulse / Views / Forum-Polish – 14.10.2026

Der Nutzer hat den aktuell geprüften optischen Forumstand und die bestehende
Views-Anbindung zum gezielten Commit/Push und GitHub-Pages-Deployment freigegeben.
Vorhandene Hierarchie, Themen/Antworten, Moderation, Rollen, Avatare und Profile
bleiben erhalten. Keine neue Funktion, Strukturänderung oder Migration.
Gemeinsamer Release mit Community Pulse und dem freigegebenen Startseiten-Hero;
die separate lokale Adminzentralisierung und fremde Wiki-/GAME-/Validierungs-
arbeiten ausschließen. Live-Abnahme nach Deployment, danach STOPP.
Release-Nachweise außerhalb Git: `homepage-forum-release-20261014`.

## Abschließende lokale Sichtprüfung – 14.10.2026

- Nach ausdrücklicher Freigabe des Startseiten-/Community-Pulse-Layouts nur
  den vorhandenen Forum-Polish fortgesetzt. Der vollständige CSS-Stand aus
  dem folgenden Abschnitt ist bereits vorhanden und wurde unverändert
  übernommen; kein weiterer Umbau oder neue Funktion erforderlich.
- Originalauftrag `31116c8d-fdd2-47c2-90cc-1f82799a1c17` mit dem aktuellen
  CSS und tatsächlichen Browseransichten abgeglichen: getrennte Kategorie-
  und Themenflächen, gruppierte letzte Aktivität und Antwort-/Aufrufzahlen,
  eigener Autorbereich und gut lesbare Beitragsfläche, ruhige Goldakzente,
  zurückhaltende Pinned-/Closed-/Recent-Zustände und ausschließlich Top 5.
  Keine zusätzlichen Icons, Rangdaten, Sidebar-Statistiken oder Animationen.
- Die 30 vorhandenen Layoutprüfungen für Übersicht, Themenliste und Thread
  bei 1440/1280/768/390/360 px in DE/EN wiederverwendet. Zusätzlich 15 aktuelle
  gezielte Browserprüfungen auf Port 5500: Kategorie → eigenständiger Thread,
  DE/EN, alle fünf Breiten, Mobile-Themenliste und Kategorienübersicht.
  Keine horizontalen Überläufe oder abgeschnittenen Informationsbereiche.
  Sidebar auf kleinen Breiten unter der Hauptliste, Avatar im Thread 64 px
  auf Desktop / 48 px auf Mobile. Öffentliche Autorinformationen ohne E-Mail.
- Nur vorhandenes öffentliches Thema gelesen. Keine Beiträge, Antworten,
  Profile, Rollen oder Moderationszustände verändert. Struktur, Views und
  Top-5-Logik sowie kompletter globaler Footer unverändert. Browserlogs:
  0 relevante Fehler / 0 Warnungen. Keine neuen Backend-/Supabaseprüfungen
  oder Migrationen; bestehende Funktionsnachweise bleiben maßgeblich.
- Neue echte Browserbilder: Kategorienübersicht Desktop, Themenliste Desktop,
  vollständiger Thread Desktop und Mobile-Themenliste. Nachweise außerhalb Git:
  `C:/Users/sebbo/.codex/visualizations/2026/09/30/01a0f137-f3f5-7bc0-b080-7b451ea65ff0/forum-polish-final-20261014`
  mit `overview-desktop.jpg`, `topics-desktop.jpg`, `thread-desktop.jpg`,
  `topics-mobile.jpg`, `fresh-responsive-validation.json`, `browser-logs.json`
  und `final-scope-validation.json`.
- In dieser Fortsetzung ausschließlich diesen Checkpoint ergänzt und neue
  Nachweise außerhalb Git erstellt. Sämtliche UI-/JS-Dateien einschließlich
  des freigegebenen Hero-/Karten-/Pulse-Stands unverändert erhalten.
  HEAD/Index unverändert; `git diff --check` sauber.
  **Kein Commit, Push, Deployment oder Webexport. STOPP zur letzten visuellen Abnahme.**

## Letzter optischer Polish lokal abgeschlossen – 14.10.2026

- Bestehenden aktuellen Stand übernommen; kein Neuaufbau der Forumfunktionen.
  Zusätzliche rein gestalterische `assets/css/forum-polish.css`, ausschließlich
  auf `.forum-page` begrenzt; Einbindung nach den vorhandenen Forumstyles.
- Kategorien als getrennte dunkle Flächen mit feinen Rahmen, ruhiger
  Hintergrundtiefe, klarerem Titel und warmer Hover-/Fokusbetonung. Letztes Thema,
  letzter Autor und Zeitpunkt rechts als eigener Informationsbereich; Mobile
  unter der Kategorie. Ehrliche leere Zustände vollständig erhalten.
- Themen als getrennte Zeilenflächen: Autor/Avatar, zusammengehörige Antwort-/
  Aufrufzahlen und eigener letzter Aktivitätsbereich. Vorhandene Recent-/Pinned-/
  Closed-Zustände gestalterisch verwendet; keine neuen Statusdaten oder Logik.
- Einzelne Beiträge mit dezentem Rahmen/Schatten, eigenständigem Autorbereich,
  64-px-Avatar auf Desktop, 48 px auf Mobile, ruhiger Rolle und besser lesbarem
  Textbereich. Vorhandene optionale Rangdarstellung erhalten; kein Rang erfunden.
  Letzter Beitrag bleibt dezent markiert. Antworten verwenden dieselbe Beitragsfläche.
- Sidebar ausschließlich Top 5, eigener dezenter Container mit getrennten
  Einträgen; keine Statistiken oder Ersatzblöcke. Wichtige Aktionen in Gold,
  übrige Buttons schlicht. Keine neuen Icons/Badges und keine Animation;
  Reduced-Motion-Regel deaktiviert die kurzen Farb-/Rahmenübergänge.
- Klassische Hierarchie Kategorien → Themenliste → eigener Thread → Antworten
  erhalten. Ausschließlich vorhandenes öffentliches Thema gelesen; keine
  produktiven Testthemen/-antworten angelegt, keine Beiträge bearbeitet/moderiert.

Lokale Prüfung auf `http://127.0.0.1:5500/forum/`: alle drei Ansichten jeweils
1440/1280/768/390/360 px in DE/EN = 30 Layoutzustände. Horizontale Überläufe 0,
abgeschnittene Informationsblöcke 0; Sidebar auf kleinen Breiten unter der
Hauptliste. Bestehender zentraler cHa-Account/öffentlicher Avatar/Rolle sichtbar,
Footer vollständig, Besucher-Script weiterhin genau einmal. Browserlogs:
0 Fehler / 0 Warnungen. Forum-HTML und neue CSS-Datei nativ HTTP 200 mit
passenden MIME-Typen. Keine erneuten Schreib-/Moderations-/Backendtests bei
unveränderter Logik; vorhandene Nachweise bleiben maßgeblich.

Echte neue Screenshots: Kategorienübersicht Desktop, Themenliste Desktop,
Thread Desktop, Themenliste Mobile. Nachweise außerhalb Git:
`C:/Users/sebbo/.codex/visualizations/2026/09/30/01a0f137-f3f5-7bc0-b080-7b451ea65ff0/forum-polish-20261014`
mit `overview-desktop.jpg`, `topics-desktop.jpg`, `thread-desktop.jpg`,
`topics-mobile.jpg` und `responsive-validation.json`.

Für diesen Auftrag nur neue `assets/css/forum-polish.css`, ihre Einbindung
in `forum/index.html` und dieser Checkpoint. Vorhandene Forum-CSS-/JS-Änderungen
sowie alle übrigen lokalen Arbeiten erhalten: 52 geschützte Ausgangsdateien
SHA-256-identisch; Forum-HTML nach Entfernen der neuen CSS-Einbindung identisch
zum aktuellen Ausgangsstand. HEAD/Index unverändert, `git diff --check` sauber.
Keine Änderung an Backend,
Supabase, Rollen, Profilen, Avatarlogik, Views, Top-5-Sortierung, GAME, Wiki oder
Dedicated. Kein Commit, Push, Deployment oder Webexport. STOPP zur visuellen Abnahme.

## Releasefreigabe – 13.10.2026

- Nutzer hat den aktuellen Forum-/Profil-/Rollen-/Moderationsstand samt UI-Polish
  zum Commit, Push auf `origin/main` und bestehenden GitHub-Pages-Deployment
  ausdrücklich freigegeben. Keine neuen Homepage-Funktionen oder Migrationen.
- Release umfasst nur die sieben Forum-UI-/Checkpointdateien sowie die drei
  bereits freigegebenen Moderations-SQL-/Review-/Rücknahmedateien. Profil/Rollen
  sind bereits im bisherigen Release enthalten; keine erneute Backendinstallation.
- Vor Release: main und origin/main identisch, Index leer, JS-Syntax/Secret-Prüfung
  bestanden, `git diff --check` sauber. Fremde Wiki-/Validierungsänderungen ausgeschlossen.
- Live-Abnahme anschließend mit bestehender zentraler Sitzung: klassische Hierarchie,
  Veröffentlichung/Antwort/Bearbeitung, Moderation, Profile/Avatare, echte Aktivität,
  DE/EN und Responsive. Produktive bestehende Inhalte nicht als Testdaten verwenden.
- Commit, Deployment und genaue Live-Nachweise außerhalb Git im bestehenden
  Codex-Prüfpfad `forum-release-20261013` festhalten. Anschließend STOPP.

## Optische Aktivitätsaufwertung lokal abgeschlossen – 13.10.2026

- Bestehende klassische Hierarchie und Sidebar ausschließlich mit Top 5 erhalten.
  Themen zeigen Titel, Autor/Avatar, Antwortzahl, letzten Schreiber und Zeit;
  letzte Schreiber stehen nun vor dem Zeitstempel und sind besser lesbar.
- Ruhiger Goldakzent ausschließlich aus echtem `last_activity_at` der letzten
  24 Stunden. Ältere, ungültige oder zukünftige Zeiten werden nicht hervorgehoben.
  Keine Animation, Neonfläche, neue Badge-/Iconreihe oder Ungelesen-Zählung.
- Kategorien behalten letztes Thema, letzten Benutzer und Berlin-Zeit sowie
  den ehrlichen Zustand „Noch keine Beiträge“. Keine Textkörper in Übersichten.
- Threads: vorhandene öffentliche Avatare/Initialen, Namen und ZH-Admin/ZH-Member
  deutlicher; kleinere Leerflächen, lesbare Beitragszeiten. Letzter sichtbarer
  Beitrag mit feiner Kontur und DE/EN-Text. Erst nach Laden des vollständigen
  Threads markieren; kein vorläufiges Seitenende und keine versteckten Beiträge.
  Vorhandene Rangdarstellung wiederverwendet, keine Ränge erfunden.
- Pinned/Closed als ruhige Textzustände. Backend, Rollen, Schreib-/Moderations-
  funktionen unverändert. Header/Footer, Wiki, GAME und Dedicated nicht bearbeitet.
- 27 isolierte Aktivitäts-/Paging-/Session-/Hierarchietests plus drei bestehende
  Löschdialogtests bestanden. Nichtleere Browseransichten mit dem vorhandenen
  isolierten PostgreSQL-Prüfmodell, ausschließlich Lese-RPCs, sichtbar gekennzeichnet;
  keine produktive Verbindung oder angelegten produktiven Themen/Antworten.
  Desktop 1280/1440, Tablet 768, Mobile 390/360, DE/EN: keine Überläufe oder JS-Fehler.
- Echter lokaler Stand zusätzlich auf Port 5500 geprüft; vollständiger globaler
  Footer erhalten. Fremde Working-Tree-Dateien aus aktuellem SHA-Snapshot erhalten.
  Nachweise außerhalb Git: `forum-polish-20261013`. Temporäre Prüfumgebung stoppen.
  **Kein Commit, Push, Deployment oder Webexport. STOPP nach lokalem Abschluss.**

## Kleiner Forum-UI-Ausbau lokal abgeschlossen – 13.10.2026

- Seitenleiste: „Aktueller Stand“ und „Bereits erreichbar“ entfernt. Nach der
  Nutzerkorrektur ausschließlich Top 5 nach tatsächlicher Aktivität: Titel,
  Kategorie, Antworten und Zeitpunkt. Kein Statistik-/Kategorie-/Ersatzblock.
- `forum-activity.js` liest ausschließlich das vorhandene `get_zh_forum`:
  alle Themenseiten für die korrekte Aktivitätssortierung trotz Pin-Reihenfolge;
  letzte sichtbare Autoren bei Bedarf aus vorhandenen Beitragsseiten, maximal
  drei parallele zusätzliche Aktivitätsabfragen, Cache nach Benutzer/Session und Themenstand.
  Nach Veröffentlichung/Bearbeitung/Moderation wird die Anzeige aktualisiert.
- Kategorien zeigen letztes Thema, letzten öffentlichen Autor und Berlin-Zeit;
  Themenlisten ergänzen letzten Autor/Zeit sowie ruhige Anheftungsdarstellung.
  Versteckte Moderationsinhalte bleiben aus öffentlichen Aktivitätsanzeigen heraus.
- Statistiken ausschließlich im unveränderten globalen Footer. Der vorläufige
  Sidebar-Statistikblock samt Footer-Datenabgriff, Observer, Styles und neuen
  Statistiktexten wurde vollständig entfernt. Keine zweite Presence-/Account-Abfrage.
  Die bisherige Sidebar-Kategoriennavigation entfällt ebenfalls; Kategorieübersicht,
  Breadcrumbs, Kategorieauswahl im Editor und die Hauptnavigation bleiben erhalten.
- Echter Bestand nur gelesen: zwei versteckte Themen/vier Beiträge, öffentlich
  aktuell null Themen/Beiträge. Deshalb ehrliche leere Zustände, keine Testposts.
  Nichtleere Fälle ausschließlich in isolierten Leseantwort-Tests außerhalb Git.
- Klassische Hierarchie erhalten: Übersicht nur Kategorien/Aktivitätsmetadaten,
  Kategorie nur Themenliste, eigenständige `#thread/<UUID>`-Ansicht mit Startbeitrag
  und Antworten. „Beitrag erstellen“ in einer Kategorie verwendet weiterhin
  `create_zh_forum_topic`; Antworten ausschließlich `reply_zh_forum_topic` im Thread.
- 22 gezielte Aktivitäts-/Paging-/Cache-/DEEN-/Session-/Hierarchie-Tests und drei bisherige
  Löschdialog-/Session-Regressionsprüfungen bestanden. Browser lokal auf Port 5500:
  DE/EN, Desktop 1440/1280, Tablet 768, Mobile 390/360, Kategorienavigation und Reload.
  Sieben native HTTP-Abrufe 200 mit passenden MIME-Typen und aktuellem Dateiinhalt.
  Browser-JS-/Consolefehler 0, horizontale Überläufe 0; `git diff --check` sauber.
- Footer und bestehende Moderations-/Profil-/Rollen-/Avatarfunktionen erhalten.
  19 geschützte Wiki-Prüfdateien stimmen mit dem bisherigen SHA-Stand überein;
  die beiden Wiki-Datendateien wurden währenddessen parallel aktualisiert und
  vollständig stehen gelassen. Keine produktive SQL-/Schema-/Accountänderung;
  GAME/Wiki/Dedicated von diesem Auftrag nicht bearbeitet.
- Nachweise/Screenshots außerhalb Git in `forum-activity-20261013` unter dem
  bestehenden Codex-Prüfpfad. **Kein Commit, Push, Deployment oder Webexport. STOPP.**

## Moderationsmigration freigegeben, angewendet und lokal geprüft

- Nutzerfreigabe: „Ja, genau diese Migration anwenden und lokal prüfen“.
  Installation `20261012183738_homepage_forum_moderation_v2` erfolgreich;
  genau die vorbereitete Datei, acht Guards/Cascade vorher erneut bestätigt.
- Backend meldet `moderation_version=2`; v2-RPC registriert. Anonymer Aufruf
  sicher HTTP 401, Lesen HTTP 200, CORS Port 5500 korrekt. Keine neue Advisor-Warnung.
- Installierte RPCs mit bestehenden UUIDs unter `authenticated`: 20 erfolgreiche
  Assertions plus drei Zeilenzählungen = 0 bei echtem DELETE/Cascade. Alle neuen
  Testdaten zurückgerollt; vorhandene zwei Themen/vier Beiträge und Profil-/Avatar-
  zusätze/Rollen vor/nach per Hash unverändert. Keine Accounts/Metadaten geändert.
- Echte lokale cHa-Sitzung, ZH-Admin, Avatare/Reload, aktivierte Moderation,
  Kategorieauswahl und DE/EN-Dialoge auf Port 5500 geprüft. Bestehende Inhalte nur
  gelesen; Dialoge abgebrochen. Reale SQL-Löschung im Rollbacktest, bestätigte UI-
  Abläufe bereits vollständig mit isolierten Prüfdaten getestet.
  Eigenes Profil/private E-Mail/Avatar und bestehendes Admin-Dashboard ebenfalls
  mit derselben echten Session bestätigt; keine Account-/Passwortänderung.
- `forum-content.js` zusätzlich gezielt korrigiert: normale erneute Prüfung
  derselben Session lässt die Bestätigung offen; echter Accountwechsel schließt sie.
  Netzwerk-/Sessionfehler bleiben sichtbar. Drei entsprechende Tests bestanden.
- Aktuelle Nachweise außerhalb Git im Ordner `forum-moderation-20261012`, darunter
  `applied-validation.json` und neue echte Desktop-/Mobile-Screenshots.
- Neue Oberfläche weiterhin nur lokal. **Kein Commit, Push, Deployment, Webexport.**
  Wiki, GAME, Dedicated und alle fremden lokalen Änderungen erhalten. Nach Prüfung STOPP.

## Moderationskorrektur vorbereitet – 12.10.2026, STOPP vor SQL-Freigabe

- Neuer Auftrag: dauerhaftes Löschen statt Ausblenden, Verschieben, ruhiger
  Moderationsbereich; bestehende Rollen/Accounts/Profile erhalten.
- Produktiv ausschließlich gelesen: zwei Themen/vier Beiträge bei Audit,
  bestehende Lösch-RPC setzt `hidden`; FK der Beiträge bereits ON DELETE CASCADE.
  Keine bisherigen Inhalte gelöscht/wiederhergestellt, keine produktive Migration.
- Lokale Oberfläche in `forum-content.js`, `forum-content.css`, `translations.js`
  und `forum/index.html` angepasst. Klare native DE/EN-Löschdialoge statt
  window.confirm, Standardfokus Abbrechen, Kategorieauswahl, keine Restore-Buttons.
- Vorbereitete Migration `20261012170814_forum_moderation_v2.sql`: zwei neue
  Funktionen für dieselben Tabellen, neue Capability und nur korrigierte
  Sperrreihenfolge der bisherigen Bearbeitungsfunktion. Keine Tabellen-/Policy-/
  Rollen-/Accountänderung. Dauerhaftes Löschen/Verschieben bis Capability 2 gesperrt.
- Vollständiger Umfang, echte DELETE-Zeilen, Rechte, Rücknahme und Testgrenze:
  `FORUM_MODERATION_V2_REVIEW.md`; Rücknahme `forum_moderation_v2_rollback.sql`.
- 37 isolierte PostgreSQL-Prüfungen bestanden; reale Browserbedienung mit
  isolierten lokalen Daten, DE/EN, 1440/768/390/360, Reload, Abbrechen/Esc,
  tatsächliches Löschen, Kategorie-Rückkehr und Member-Sperren geprüft.
  Browser-JS-/Consolefehler 0, horizontale Überläufe 0.
- Nachweise außerhalb Git in `forum-moderation-20261012` im bestehenden Prüfpfad.
  **Nächster Schritt ausschließlich nach neuer ausdrücklicher Freigabe:** Migration
  anwenden und echte lokale Supabase-/PostgREST-Prüfung auf Port 5500.
  Kein Commit, Push, Deployment oder Webexport. Wiki-/Spiel-/Dedicated unverändert.

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
