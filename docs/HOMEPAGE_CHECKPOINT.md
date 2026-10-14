# Homepage – Fortsetzungscheckpoint

**Produktivfreigabe 14.10.2026 – Pulse / Hero / Forum:** Der aktuelle responsive
Hero-/Kartenstand ist visuell abgenommen und bleibt unverändert. Community Pulse,
Goldverbindung, Forum-CTA, Arma-Info, Entfernung der alten sichtbaren Game-Umfrage,
Forum-Views/-Polish und zugehörige Sprach-/Checkpointdaten gezielt auf `main`
veröffentlichen. Bereits installierte Migration nicht erneut ausführen.
Separate lokale Adminzentralisierung/Account-/Profiländerungen sowie fremde
Wiki-/GAME-/Prüfdateien erhalten und nicht mitcommitten. Live-Abnahme nach Pages-
Deployment, danach STOPP. Release-Grenze/Nachweise:
`docs/COMMUNITY_PULSE_VIEWS_CHECKPOINT.md`, `homepage-forum-release-20261014`.

**Produktivfreigabe 12.10.2026:** Der geprüfte Forum-/Profil-/Rollenstand darf nun
gezielt auf `origin/main` veröffentlicht werden. Fremde lokale Wiki-Daten/JS und
Prüfdateien ausschließen; keine neue Backend-/Spieländerung. Release-Grenze und
Live-Prüfung in `docs/FORUM_CHECKPOINT.md`, Nachweise außerhalb Git in
`forum-release-20261012`. Die folgenden Abschnitte dokumentieren den Ausgangsstand.

**Zusatz 12.10.2026:** Die ausdrücklich freigegebene Rollen-Migration
`20261012113834_homepage_central_account_forum_roles` ist produktiv installiert.
cHa bleibt mit bestehender Admin-UUID einziger Admin; neun andere Accounts sind
Member. Signup-Memberdefault, neun rollenbasierte Admin-Policies und kontrollierte
spätere Adminzuweisung aktiv. Lokale Forum-/Profilrollen und Moderationsdarstellung
gegen das echte Backend geprüft; kein UUID-/Namens-/Metadata-Fallback im Admin-Guard.
Rang ausschließlich als NULL-Anzeigefeld vorbereitet, ohne Berechtigungswirkung.
Produktive Rollen-/Posting-/Moderationstests vollständig zurückgerollt, bestehende
Inhalte/Accounts/Avatare erhalten. Avatar-Abschlusscheck und direkte rohe Navigation
ebenfalls bestanden. Details: `docs/ACCOUNT_FORUM_ROLES_REVIEW.md` und Forum-Checkpoint.

**Aktuelle Teilphase 12.10.2026:** Echte Forum-Themen, Antworten, eigene
Bearbeitung, öffentliche Profile und Avatarupload lokal angebunden und mit cHa
sowie einer unabhängigen ausgeloggten Ansicht geprüft. Die zwei freigegebenen
Forum-/Avatar-Migrationen und die separat freigegebene Rollen-Migration installiert. Details, echte
Testdaten und nächste Grenze in `docs/FORUM_CHECKPOINT.md`.
Keine Homepage-Veröffentlichung, kein Commit, Push oder Webexport in dieser Phase.

Navigation in allen 13 rohen gemeinsamen HTML-Headern bereinigt:
Start | SPIEL | Wiki | Forum | Galerie | Geschichte | Timeline | Gästebuch.
Der alte Community-Punkt ist direkt entfernt; ausschließlich seine nachträgliche
Entfernungslogik in `i18n.js` gelöscht. Andere Navigation, zentrale Authentifizierung,
Footer, v118 und Dedicated bleiben funktional unverändert. Fremde lokale
Wiki-Daten-/JS-Änderungen und die bestehenden 19 Prüfarbeitsdateien erhalten.

Die folgenden Abschnitte sind die erhaltene Geschichte früherer Teilphasen.

Stand: 06.10.2026. Lokale Teilphase „Zombiehölle für Arma“.

## Inhalt und Grenzen

- Die beiden bisherigen Startseiten-Kapitel bleiben erhalten; ein dritter Kasten
  „Zombiehölle für Arma“ verweist auf `arma/index.html` (`/arma/`).
- Die kurze DE/EN-Infoseite beschreibt ausschließlich eine offene Überlegung:
  Arma Reforger/spätere Arma-Version oder ein einzelner Serverabend mit alten
  Freunden. Keine konkreten Pläne, Ankündigung, Roadmap oder Veröffentlichung.
- Die vorhandene `assets/images/hero.png` dient als dekoratives Motiv im Kasten;
  sie wird nicht als Screenshot eines neuen Arma-Projekts ausgegeben.
- Alle neuen Texte verwenden `assets/js/translations.js` und den vorhandenen
  Sprachwechsel. Keine neue Seiten- oder Übersetzungslogik.
- Keine Änderungen an Wiki, `game/`, Spielprojekt, Forum, Besucherzähler oder
  Supabase. Bestehende lokale Änderungen dieser Bereiche vollständig erhalten.
- Kein Commit, Push oder Webexport.

## Verbindliche Regel für jede neue Homepage-Unterseite

**Immer den vollständigen globalen Footer der aktuellen Startseite übernehmen.**
Quelle ist `index.html`, nicht ein vereinfachter Footer einer älteren Unterseite.
Footer-Aufbau, Besucheranzeige, Footer-Navigation, Links, DE/EN und responsive
Darstellung bleiben erhalten. Relative Links werden an die Seitentiefe angepasst.

Die gemeinsame Darstellung verwendet `.site-footer.zh-global-footer` mit den
bestehenden Styles aus `style.css`, `i18n.css` und `homepage-premium.css`.
`.footer-visitor > #total-visitors` wird durch das bestehende
`assets/js/visitor-counter.js` in die fünf Statistikkarten umgewandelt. Dieses
Script genau einmal laden; keine separate Tracking-Implementierung hinzufügen.
Die bestehenden Legacy-/Perioden-RPCs und deren Zähllogik nicht nachbauen.

Vor Abschluss neuer Seiten: Footer vollständig, Besucheranzeige vorhanden,
Statistik lädt ohne Fehler, keine doppelte Registrierung, Footer-Links korrekt,
DE/EN sowie Desktop/Mobile geprüft. Diese Regel steht auch in `AGENTS.md`.

## Prüfung und Fortsetzung

- Lokaler Chrome-Test auf Startseite und `/arma/`, DE/EN bei 1920, 1440, 1280,
  1024, 768, 390 und 360 px: 28 Layoutzustände, kein horizontaler Überlauf,
  keine verdeckten Überschriften oder abgeschnittenen Bedienelemente.
- Desktop drei gleichwertige Kästen mit ausgerichteten Buttons; bei mittleren
  Breiten zwei Kästen und der dritte mittig darunter; bis 800 px eine Spalte.
- Kasten-Link, Rückweg zur Kapitel-Sektion, Link zur Gamepage sowie Browser-
  Zurück/Vorwärts funktionieren. DE/EN ohne Reload, Reload und Seitenwechsel
  erhalten die Sprachwahl. Mobile Navigation bei 768/390/360 px geprüft.
- Vollständiger Footer-Aufbau gegen die Startseite abgeglichen; Besucher-Script
  genau einmal. Bestehende Übersetzungen und die beiden alten Kapitelinhalte
  sind unverändert. Keine neue JavaScript- oder Tracking-Implementierung.
- Besucherstatistik zusätzlich mit echten **rein lesenden** RPCs geprüft:
  `get_visitor_stats` und `get_visitor_period_stats` jeweils HTTP 200. Alle fünf
  dargestellten Werte stimmen in DE/EN mit den Rohdaten überein. Der Test nutzte
  den vorhandenen Modus ohne Besucher-Speicher, ohne eine Registrierung.
- Browser-JS-Fehler: 0; Console-Fehler: 0; HTTP-Fehler: 0; fehlgeschlagene Requests: 0.
- Syntaxprüfung der zentralen Übersetzungen erfolgreich; `git diff --check` sauber.
  Auch die neuen Dateien wurden auf Diff-Whitespace-Fehler geprüft.
- 243 vorhandene geänderte/unversionierte Dateien außerhalb der Edit-Liste sind
  per SHA-256 unverändert. Der bestehende Forum-Teil der Übersetzungen ist
  vollständig erhalten; HEAD und Staging sind unverändert.
- Lokale Testdatei/Nachweis außerhalb des Repositories:
  `C:\Users\sebbo\AppData\Local\Temp\zhserver-arma-20261006\check.cjs` / `report.json`.
  Desktop-/Tablet-/Mobile-Aufnahmen liegen im Codex-Visualisierungsordner unter
  `arma-20261006`. Der erfolgreiche Lauf nutzte freigegebenen localhost-Zugriff.

Bei Fortsetzung diesen Checkpoint und den aktuellen Diff lesen; die bestehenden
Forum-/Wiki-Änderungen gehören nicht zu dieser Teilphase.

Hauptdateien: `index.html`, `arma/index.html`, `assets/css/homepage-bridge.css`,
`assets/css/homepage-premium.css`, `assets/css/arma-page.css`, ausschließlich die
neuen `arma-*`-Texte in `assets/js/translations.js`, `AGENTS.md` und dieser Checkpoint.

## Zusatzphase: Admin-Authentifizierung, 07.10.2026

`docs/AUTH_AUDIT.md` hält den geprüften bestehenden Login, den gemeinsamen
Supabase-Session-Schlüssel, die bisherige Admin-Erkennung und offene Backend-Fakten
fest. Kein zweites Login-System. Geeignete vorhandene Profile/Rollen zuerst prüfen.
`docs/auth_structure_audit.sql` ist eine einzelne vorbereitete, nicht ausgeführte
Leseabfrage. Es wurden keine Auth-Einstellungen, Tabellen, Rollen oder RLS geändert.

Nur `admin/dashboard.js` wurde funktional angefasst: der lokale Clientname heißt
nun `dashboardClient`, um eine online bestätigte globale Namenskollision mit dem
aktuellen SDK zu vermeiden. Projekt-Key, Login, Session und Logout sind erhalten.
Lokaler gezielter Auth-Test: 7 erfolgreiche Prüfungen, 0 Browser-JS-/Console-Fehler;
echte Logins/Konten wurden nicht für den Test verwendet. Kein Commit/Push/Webexport.

## Zusatzphase: globale Community-Statistik, 07.10.2026

Stand/Fortsetzung: `docs/COMMUNITY_STATS_CHECKPOINT.md`. Startseite und Forum
haben eine gemeinsame kompakte Anzeige für globale Presence und Community-Accounts.
Der alte simulierte Online-Teil ist ersetzt. Persistente Besucherlogik bleibt
unverändert; der vollständige Besucherfooter ist jetzt auch im Forum vorhanden.

Backend-Anbindung **vorbereitet, noch nicht produktiv aktiviert**: zentrale
`community-config.js` bleibt gesperrt bis zur Bestätigung des privaten Supabase-
Bestands und des RPC-Vertrags. Eine einzelne Leseabfrage und ein gesperrter SQL-
Entwurf liegen vor. Geeignete Tabellen zuerst wiederverwenden; kein Profil-/Rollen-
schema raten. Neuestes Mitglied benötigt das bestätigte öffentliche Profilfeld.
Kein Commit/Push/Webexport.

## Korrektur: beide Statistikgruppen im globalen Footer, 07.10.2026

Community-Zahlen aus „In Verbindung bleiben“ vollständig entfernt; Steam/Discord
und der normale Community-Inhalt stehen wieder für sich. Globale Statistik auch
aus der Forum-Seitenleiste entfernt; sie steht im gemeinsamen Footer.

`assets/js/global-footer.js` baut den gleichen Footer auf allen normalen Seiten
über den bestehenden Einstieg `visitor-counter.js` auf. Gemeinsame Darstellung
in `global-footer.css`, Community und Besucher klar getrennt. Vorhandene Besucher-
DOM-Knoten werden verschoben, keine zusätzliche Statistik/Registrierung.
Wiki- und andere Unterseiten-Dateien müssen dafür nicht geändert werden.

Die verpflichtende Regel für alle neuen Unterseiten steht ergänzt in `AGENTS.md`:
vollständiger globaler Footer mit Community, Besucherwerten, Rechtslinks,
Copyright, gemeinsamem DE/EN und Responsive. Backend/Aktivierung bleiben gleich.
Prüfnachweise und aktueller Stand in `COMMUNITY_STATS_CHECKPOINT.md`.

## Fortsetzung: echte globale Community-Daten, 07.10.2026

Supabase ist jetzt verbunden; kombinierte Bestandsabfrage direkt rein lesend
ausgewertet. Nach ausdrücklicher Freigabe die angepasste Migration
`homepage_global_community_presence` erfolgreich angewendet. Gemeinsame lokale
Anbindung über `community-config.js` aktiviert: Online gesamt/Mitglieder/Gäste
und 11 bestehende Auth-Accounts. Kein zweites Login oder Forum-Presence-System.

Die vorhandene `player_presence` ist Spielpositions-Tracking und bleibt erhalten.
Das vorhandene `profiles.display_name` ist privat; „Neuestes Mitglied“ bleibt „—“
bis zu einer ausdrücklichen öffentlichen Profilentscheidung. Keine Accounts,
Profile, Rollen, Auth-Einstellungen oder bestehenden RLS-Regeln verändert.

Echte öffentliche RPCs lokal im Chrome geprüft; serverseitige Mitglieds-/Gast-
und Ablaufprüfungen innerhalb einer zurückgerollten SQL-Transaktion. Besucher-
Registrierungen im Browser-QA abgefangen, Besucherwerte/Tracking-Start und die
bestehenden SQL-Funktionen unverändert. Aktuelle Nachweise/Fortsetzung im Community-
Checkpoint; keine erneute Vollprüfung unveränderter Inhalte.
Kein Commit, kein Push, kein Webexport.

## Gästebuch filigraner und kompakter, 07.10.2026

- Nur gezielte Gästebuch-Regeln in `assets/css/homepage-premium.css` ergänzt:
  weniger Abschnitts-/Formular-/Kartenabstand, dezente Flächen und Schatten,
  9-px-Kartenradius, ruhigere Namen und kleinere Metazeilen. Karten ohne
  Mindesthöhe, Abstand zwischen Einträgen 10 px; kürzeres, weiterhin vertikal
  vergrößerbares Nachrichtenfeld. Kompakter Button mit 44 px Mindesthöhe,
  sichtbarer Fokus und 16-px-Eingabeschrift auf Mobile.
- Wartestatus-Flächen ebenfalls reduziert; vorhandene Hinweise und Freigabe-
  Funktion erhalten. Keine Änderungen an HTML, JS, Übersetzungen oder Backend.
  Globaler Footer samt Community-/Besucherwerten und Reset-Hinweis erhalten.
- Die fünf aktuell öffentlich sichtbaren, freigeschalteten Einträge einmal per
  GET gelesen und in der isolierten Browserprüfung wiederverwendet. Namen und
  Nachrichten in DE/EN unverändert; keine erfundenen oder gespeicherten Einträge.
  Alle weiteren Backend-Anfragen und der Formular-Testversand abgefangen.
- DE/EN bei 1440, 1280, 768, 390 und 360 px geprüft. Desktop-/Tablet-/Mobile-
  Screenshots gesichtet; kein horizontaler Überlauf, keine abgeschnittenen
  Inhalte. Hover, Fokus, vorhandener Versand-/Reset-Ablauf, Reduced Motion und
  Sichtbarkeit unter dem gemeinsamen Header geprüft. Browser-JS-, Console-,
  HTTP- und Request-Fehler im abgeschlossenen Test jeweils 0.
- Vergleich mit dem unveränderten Ausgangs-CSS: Formular auf Desktop ca.
  452 -> 321 px, auf Mobile 449 -> 357 px; kurze Karte 141 -> 102 px bzw.
  121 -> 98 px. Nachweise außerhalb des Repositories unter
  `C:\Users\sebbo\AppData\Local\Temp\zhserver-guestbook-20261007`
  (`baseline.json`, `guestbook-read.json`, `check.cjs`, `report.json`);
  Screenshots im bestehenden Visualisierungsordner unter `guestbook-20261007`.
  Kein Commit, kein Push, kein Webexport.

## Zentrale Identität / öffentliche Anzeigenamen – 07.10.2026

Maßgeblicher aktueller Stand: `PUBLIC_IDENTITY.md`. Zwei gezielte Migrationen
im bestehenden `zhserver`-Projekt angewandt: `homepage_minimal_public_identity`
(`20261007161504`) und `homepage_shared_content_authors` (`20261007161545`).
Die private Profil-/Auth-Struktur bleibt erhalten; öffentliche Namensantworten
enthalten ausschließlich `display_name` und Auth-Registrierungsdatum.

Footer verwendet den echten Namen des neuesten Accounts (`trux`), bei fehlendem
Namen „—“; goldener Reset-Hinweis und übrige Community-/Besucherwerte gleich.
Gästebuch/Galerie verwenden lokal die bestehende Session und kanonischen eigenen
Profilnamen; Namensfeld für Mitglieder ausgeblendet/nicht frei editierbar.
Neue authentifizierte Beiträge werden serverseitig privat mit `auth.uid()`
verknüpft und bleiben wie bisher freigabepflichtig. Gastabläufe bleiben erhalten.
Formularstatus ist kompakt; das zuvor verfeinerte Gästebuch-CSS bleibt unverändert.

Forum verwendet die zentrale Identität für seine bestehenden lokalen Entwürfe.
Kein produktives Forum-Posting implementiert. Profil-/Anzeigename-Einstellseite
noch offen; Accounts ohne gültigen Profilnamen bekommen keinen erfundenen Namen.
Bestehende Admin-Anmeldung/Moderation unverändert. Details in `AUTH_AUDIT.md` und
`FORUM_CHECKPOINT.md`; Besucher-/Presence-JS von dieser Phase nicht bearbeitet.

API-Privacy- und echte Backend-Rechteprüfungen mit Rollback, isolierter Browser
mit realem SDK und abgefangenen Auth-/Content-/Tracking-Schreibzugriffen: 18 DE/EN-
Ansichten (1440/768/390 px), Login während offener Seite, weitere Tabs, Reload,
Logout, fehlender/ungültiger Name, manipulierter Name, lokale Forum-Vorschau,
Member-/Gast-Uploads, 80-Zeichen-Name und Profilantwort nach Logout. Normale
JS-/Console-/HTTP-/Request-Fehler 0; Überläufe 0. Screenshots gesichtet, Syntax-
und Diff-Prüfung sauber. Nachweise im Temp-Ordner `zhserver-identity-20261007`.
Kein Commit, Push, Webexport oder Dedicated-Neustart.

Erhaltungsprüfung dieser Phase: 678/691 Ausgangsdateien bytegleich. Elf
beauftragte Homepage-/Checkpointdateien geändert, fünf neue Identity-/SQL-/
Dokumentationsdateien. Zwei Wiki-Datendateien und 13 neue Garage-Wiki-Grafiken
liegen zusätzlich aus anderen Arbeiten vor und bleiben vollständig erhalten.
Diese Aufgabe hat sie nicht bearbeitet. Besucher-/Presence-JS, Admin-Code,
verfeinertes Gästebuch-CSS und game/ bytegleich zur Ausgangsbaseline. HEAD und
Staging unverändert. Abschlusscheck: Logout während Screenshot-Upload verhindert
falsche Autorenzuordnung; Script-Cache-Versionen und globaler Footer geprüft.

## Homepage → Spiel Auth-Handoff – 08.10.2026

Gezielte Homepage-Phase abgeschlossen; Vertrag und nächster Schritt in
`GAME_AUTH_HANDOFF.md`. Vorherigen Working Tree vollständig übernommen.
Gamepage exportiert ihren vorhandenen Abstimmungs-Supabaseclient jetzt als
`window.zhSupabaseClient`; globaler Footer und vorbereiteter Godot-Adapter
verwenden denselben Client. Keine zweite Auth-Session oder eigene Tokenpersistenz.

Neue `assets/js/game-auth-bridge.js`: `ZHGameAuth` mit synchronem JSON-Poll,
aktueller Session-/Access-Token-Abfrage, tokenfreien Änderungsmeldungen,
Logout-/Ablaufstatus und festem Verweis auf `/admin/` in neuem Tab. Exakter
Message-Vertrag des vorhandenen Spieladapters, ausschließlich für das vorgesehene
gleich-originäre Game-iframe. Keine User-ID/Namen als Autorität; Dedicated prüft
selbst. Profilnamen sind für diese Transportphase nicht erforderlich.

15 gezielte Prüfgruppen mit realem SDK, abgefangenen Backend-/Trackingantworten
und originalem spielseitigem JS-Adapter im inerten iframe bestanden. Login,
Logout, Refresh, Reload, weitere Tabs, Accountwechsel, abgelaufene/beschädigte
Session und Message-Schutz. Acht DE/EN-Ansichten bei 1440/768/390/360 px,
kompletter bestehender Footer, mobiles Menü, Screenshots gesichtet. Normale
JS-/Console-/HTTP-/Request-Fehler und Überläufe jeweils 0. Separater erwarteter
401-Refreshfehler verliert die Session ohne JS-Ausnahme oder alten Token.
Syntax-/Diff-Prüfung sauber. Nachweise: Temp `zhserver-game-handoff-20261008`.

**Vor Veröffentlichung offen:** echte passende Godot-Webversion plus Dedicated
End-to-End abnehmen, Logout/erneute Initialisierung des Spiel-Sessionhelfers
gegenprüfen. `/admin/` bietet derzeit Login, noch keine zentrale Registrierungs-
oberfläche; keine neue parallele Anmeldung gebaut. Vorhandener v116-Build und
Wartungs-/CTA-Status unverändert. Keine GDScripts, Wiki-, Besucher-/Presence-,
Admin- oder Backendänderungen. Kein Commit, Push, Webexport oder Laptop-Neustart.
Hier STOPP; weiterer Spiel-/Rolloutauftrag separat.

## Zusatz: zentraler Account / eigenes Profil / Forum-Einstieg – 08.10.2026

Die nachfolgende Ergänzung setzt den vorherigen Auth-Handoff fort. Details und
offene nächste Schritte in `ACCOUNT_CHECKPOINT.md`. Ein gemeinsamer Account-Chip
im Header nutzt die bestehende SDK-Session und `get_zh_own_identity()`; auf Mobile
steht derselbe Baustein im Menü. Vorhandene Homepage-, Wiki- und Gameheader
werden über den gemeinsamen i18n-Loader angeschlossen, ohne ihre Inhalte umzubauen.

Neue `/account/`-Seite mit Login/Registrierung und `/profile/` mit eigenem Namen
und Registrierungsdatum. Vollständiger globaler Footer auf beiden Seiten, je
ein bestehender Besucher-Einstieg; Community/Presence und Besucherzählung bleiben
getrennt und unverändert. Keine Fake-Charakter-/Communitywerte. Adminanmeldung,
Auth-Speicher, Profilstruktur, Signup-Trigger und Backendregeln bleiben erhalten.

Forum: sichtbarer „Beitrag erstellen“-Einstieg auf Übersicht/Kategorien,
sofortiger zentraler Loginzustand für Gäste und Kategorie-Dropdown im Editor.
Bestehende lokale Entwürfe samt Konfliktprüfung und Tab-Zusammenführung erhalten.
Kein öffentliches Posting vorgetäuscht. Fehlender Anzeigename blockiert Schreiben;
Profilbearbeitung ist bewusst noch nicht freigeschaltet.

Die Game-Bridge öffnet jetzt `/account/` beziehungsweise mit
`openLogin('register')` die Registrierungsansicht in einem neuen `noopener`-Tab.
Token-/Message-Vertrag und bestehender Client bleiben gleich. Passenden echten
Godot-Webclient plus Dedicated weiterhin separat End-to-End prüfen. Kein
Spielprojekt-/Build-/Wiki-Inhalts-, Backend-, Besucher- oder Presence-Eingriff.
Kein Commit, Push, Webexport oder Laptop-Neustart.

Abnahme dieser Ergänzung: 23 gezielte Prüfgruppen, 66 DE/EN-Ansichten,
Desktop/Tablet/Mobile einschließlich 360/390 px. Normalbetrieb mit abgefangenem
Backend: JS-/Console-/HTTP-/Request-Fehler und Überläufe 0. Syntax-/Diff-Prüfung
sauber. 700/711 vorhandene Homepage-Dateien bytegleich; elf beauftragte Dateien
geändert, fünf neu. Fremder Working Tree, HEAD und Staging erhalten. Parallel
geänderte Spieldateien `main.gd`/`dedicated_server.gd` nicht angefasst. Nachweise,
Grenzen und nächster Schritt in `ACCOUNT_CHECKPOINT.md`. Hier STOPP.

## Zusatz: Passwort-Reset über Custom SMTP – 08.10.2026

Anmeldung um „Passwort vergessen?“ ergänzt. Neue `/account/reset-password/`
mit bestätigtem Recovery-Event, Sessionprüfung, wiederholtem neuen Passwort,
`updateUser()`, Erfolgsmeldung und Rückkehr zur Anmeldung. Bestehendes Supabase
Auth, Accounts, Admin, Profile, Rollen und Session-Speicher bleiben erhalten.
Vollständiger globaler Header/Footer und zentrales DE/EN auf der neuen Seite.
Keine zweite Auth-/Tracking-Logik und keine Backend-/Wiki-/Build-/Spieländerung.

Die SMTP-Geheimnisse gibt ausschließlich der Nutzer im Supabase-Dashboard ein.
Dokumentation: `PASSWORD_RESET.md`; nötiger Callback
`https://www.zhserver.de/account/reset-password/`. Bestehende Site URL/Redirect-
Allowlist und Passwort-geändert-Benachrichtigung sind hier unbestätigt und müssen
mit dem dokumentierten Ziel abgeglichen werden. Kein echter Mailversand oder
produktiver Passwortreset getestet; Browserprüfungen verwenden abgefangene
Backendantworten. Sechs normale Prüfgruppen plus vier Fehlerfälle, 22 DE/EN-
Ansichten und acht finale Layout-Gegenprüfungen; normale JS-/Console-/HTTP-/
Request-Fehler und Überläufe 0. Kein Commit, Push oder Webexport. Hier STOPP.

## Zusatz: Registrierungsbedingungen – 08.10.2026

Neue `/nutzungsbedingungen/` und `/community-regeln/` mit gemeinsamen DE/EN-
Texten, Fassung `2026-10-08`, vollständigem globalen Header und Statistikfooter.
`/terms/` und `/community-rules/` sind schlanke EN-Einstiegsaliases, keine
zweiten Inhaltskopien. Globale Rechtsnavigation hat nun vier kompakte Links.
Pflichtcheckbox in der Registrierung; Datenschutz davon getrennt verlinkt.

`LEGAL_REGISTRATION.md` dokumentiert Inhalt, Backend-Bestand, Altaccounts,
Versionierung und Freigabeablauf. `legal_consent_prepare.sql` ist vorbereitet,
lokal in PostgreSQL geprüft und **nicht produktiv angewandt**. Bestehender
Profil-/Inventar-Trigger, elf Altaccounts, Rollen und Auth bleiben erhalten.
Private Zustimmungshistorie statt alleiniger editierbarer Metadaten. Keine
Altaccount-Sperre oder Re-Consent-Aktivierung. `legal.js`: `backendEnabled=false`
bis zur ausdrücklichen SQL-Freigabe; normale Anmeldung und Reset bleiben nutzbar.

Neun SQL- und sieben Browser-Prüfgruppen, 42 DE/EN-Ansichten. Gezielt Login,
Reset, Profil, Forum/Gästebuch/Galerie und bestehenden JS-Handoff gegengeprüft;
normale JS-/Console-/HTTP-/Request-Fehler und Überläufe 0. Keine produktiven
Testdaten, SQL-Migration, Wiki-/Game-/Spieländerung, kein Dedicated-Neustart.
Kein Commit/Push/Webexport. Vor produktiver Migration STOPP, Freigabe anfordern.

## Freigegebene Registrierungsanbindung aktiv – 08.10.2026

Der vorstehende Freigabe-Wartestatus ist abgeschlossen. Exakte geprüfte Migration
`20261008101121_homepage_account_legal_consent` im bestehenden Supabase-Projekt
angewendet, produktive Funktionen/Rechte geprüft und danach lokale Anbindung
`legal.js` auf `backendEnabled = true` gestellt. Versionen `2026-10-08` und
Serverzeit werden in der privaten Zustimmungshistorie gespeichert; produktive
Policy-RPC über HTTP erreichbar (200). Bestehende Accounts/Login bleiben nutzbar.

Produktive SQL-Prüfung mit vollständig zurückgerollten Testzeilen: sieben
ungültige Varianten atomar abgelehnt, Account-Zuordnung/Serverdatum korrekt,
Own-RPC isoliert, keine direkten Client-Schreibrechte oder Metadatenänderung
der Historie. Elf bisherige Accounts, Profile, Inventare und alter Profil-
Trigger unverändert. Keine neuen Security-Advisory-Befunde.

Erneute sieben Browser-Prüfgruppen, 42 DE/EN-Ansichten, Desktop/Tablet/Mobile;
Registrierung und gezielte Account-/Footer-/Inhalts-Regressionsprüfung bestanden.
JS-/Console-/HTTP-/Request-Fehler und horizontale Überläufe 0. Produktions-
Policy real gelesen; Auth-/Mail-Schreibflüsse im Browser isoliert, keine
dauerhaften Testaccounts, keine echten Mails. Details: `LEGAL_REGISTRATION.md`.

Nur `legal.js` und drei Dokumentationsdateien in dieser Aktivierungsphase
geändert. Übrige 723 von 727 Dateien bytegleich, HEAD/Staging unverändert,
Wiki/`game/`/Spielprojekt erhalten. `git diff --check` sauber.
Kein Commit. Kein Push. Kein Webexport. Kein Dedicated-Neustart. Hier STOPP.

## Gesamtstand zur Veröffentlichung freigegeben – 08.10.2026

Der neue Nutzerauftrag gibt den gesamten geprüften Homepage-Stand zum gemeinsamen
Commit und Push auf `origin/main` frei, einschließlich des vorhandenen Homepage-
Wikis. Die früheren lokalen STOPP-/Nicht-Push-Angaben beschreiben abgeschlossene
Teilphasen. Spielprojekt, `game/`, Dedicated und produktives Backend unverändert;
keine Migration erneut anwenden und keinen Export erstellen.

Abschlussprüfung, klar benannte Frontend-/Entwurfsgrenzen und vollständige
Commit-Dateiliste: `HOMEPAGE_RELEASE_2026-10-08.md`. 13 Browser-Prüfgruppen,
66 DE/EN-Ansichten, keine Browserfehler/Überläufe; 436 lokale Referenzen und
13.982 Wiki-Prüfungen fehlerfrei. Galerie-Merkauswahl nennt ihre lokale Bedeutung,
keine künstlichen Startzahlen; geänderte CSS-/JS-Referenzen mit aktuellem Cache-Tag.

19 vorhandene Dateien unter `tools/validation/wiki-structure-20260930/` sind
lokale Backups/Testartefakte und bleiben vollständig erhalten, uncommitted.
Keine Secrets oder private Tokens im vorgesehenen Commit. Produktive Consent-
Anbindung bereits aktiv; keine neue Auth-/Backend-/Datenänderung. Echter SMTP-
Reset-Mailtest nach Veröffentlichung getrennt durchführen.

Vor Commit genaue Stage-Dateiliste/Erhaltung prüfen; nach Push Deployment,
öffentliche Seiten, DE/EN und Desktop/Mobile prüfen. Danach STOPP.

## Neuester Auftrag: keine cHa-Übernahme, Identitätsaudit abgeschlossen

08.10.2026. Diese Anweisung hat Vorrang vor den vorstehenden historischen
Veröffentlichungs-/Migrationsfreigaben: **jetzt kein Commit, Push oder Webexport**.
Legacy-cHa bleibt mit seiner UUID und sämtlichen Spieldaten bestehen. Zentrale
Admin-UUID/-Rechte erhalten; kein künstlich gesetzter Anzeigename. Installierte
`set_zh_own_display_name`-RPC behalten, keine Rollback-Migration.

`ACCOUNT_IDENTITY_MIGRATION_AUDIT.md` enthält produktive Supabase-Funktionen,
Tabellen-/FK-/RLS- und Edge-Befunde, gezielt gelesenen v116-Bytecode, getrennte
lokale Spielbefunde, konkrete Legacy-/Admin-Datenzuordnung und späteren Plan.
Keine Spieldatenmigration, U01-/F01-Änderung oder Dedicatedaktion durchgeführt.
Laufender Laptop und dessen Dateien nicht live abgenommen.

Unabhängige Profil-/Login- und Admin-UI-Fixes lokal fertig, Details in
`ACCOUNT_CHECKPOINT.md`. Namenseditor im normalen UI deaktiviert, nur in
isolierten Fixtures aktiviert/geprüft. 11 lokale Browser-Prüfgruppen,
24 DE/EN-Ansichten, Desktop/Tablet/Mobile; normale Fehler/Überläufe 0.
Backend-Account-/Gameplay-/Adminpolicy-Integrität im Read-only-Vergleich erhalten.
19 lokale Wiki-Artefakte unberührt; keine Wiki-/`game/`-Änderung. Parallele
Spiel-Dedicated-Änderung außerhalb dieses Auftrags nicht angefasst.

Vor tatsächlicher Veröffentlichung echte Admin-/Nicht-Admin-Regression offen.
Kein neues großes Teilprojekt beginnen. STOPP nach dieser Untersuchung.

## Finale Auth-Abnahme und Veröffentlichungsauftrag – 08.10.2026

Aktueller Live-Server: `http://127.0.0.1:5500/`. Echter Adminlogin, eigenes
privates Profil, Header `Account`, Profil-Reload, Dashboard, drei echte
Moderationsansichten, Logout und Sperre aller vier direkten Adminseiten geprüft.
Beide echten Login-Ablehnungen zeigen dieselbe neutrale Meldung. Keine
produktiven Inhalte, Accountdaten, Namen oder UUIDs geändert.

Der Nutzer ersetzt den Nicht-Admin-Browserlogin ausdrücklich durch Prüfung
der vorhandenen Account-UUIDs/Zugriffsregeln. Die sieben produktiven
Moderationspolicies erlauben jeweils nur die unveränderte Admin-UUID und
verweigern alle zehn existierenden Nicht-Admin-UUIDs; RLS aktiv, kein Name
oder editierbare Metadaten als Rolle. Bekannte breite Galerie-Storage-Rechte
bleiben separat offen und unverändert. Details: `ACCOUNT_CHECKPOINT.md`.

Diese vom Nutzer angepasste Abnahme ist bestanden, Commit/Push damit ausdrücklich
beauftragt. Nur Auth-/Profil-/Admin-Fixes und Dokumentation veröffentlichen;
19 fremde Wiki-Artefakte ausschließen. Danach Deployment und veröffentlichte
Account-/Profil-/Adminseiten prüfen. cHa bleibt Legacy, Editor deaktiviert,
Own-RPC behalten; keine Migration, Spieländerung oder Webexport.

## Aktueller Folgeauftrag: zentrale Identität cHa – 09.10.2026

Die ausdrücklich freigegebene Legacy-Löschung ist produktiv abgeschlossen.
Legacy-cHa-Authaccount und eigene Gameplaydaten entfernt, keine Übernahme auf
den zentralen Account. Bestehende zentrale Admin-UUID bleibt unverändert und
hat jetzt das eigene Profil mit öffentlichem Namen cHa. Admin-/Moderationspolicies
und bestehende Own-Name-RPC unverändert; allgemeiner Namenseditor weiter aus.

Die bestehende gemeinsame Identity-Schicht zeigt den neuen Namen bereits live
in Header/Profil sowie Forum-Entwurfsformular, Gästebuch und Galerie-Upload.
Private E-Mail ausschließlich im eigenen Profil, Reload/DE/EN bestanden.
Echter Adminzugang/Moderationsansichten bestanden; Logout und Schutz direkter
Admin-URLs bestanden. Echte Wiederanmeldung nach Logout mit weiterhin cHa und
bestehendem Adminzugang ebenfalls bestanden. Commit/Push damit freigegeben;
Deployment und Live-Abnahme nach Veröffentlichung folgen.
Details, Löschumfang und Fortsetzung: `ACCOUNT_CHECKPOINT.md`,
`ACCOUNT_IDENTITY_MIGRATION_AUDIT.md`, `account_legacy_cha_cleanup.sql`.

Nur Account-Dokumentation/Projektregeln und SQL-Archiv angepasst. Kein neuer
Frontend-Auth-Code, kein Wiki-/`game/`-/Spielprojekt-Eingriff, kein Dedicated-
oder U01/F01-Rollout. 19 vorhandene Wiki-Testartefakte weiterhin ausschließen.
Push nach bestandener letzter Abnahme ausdrücklich beauftragt; kein Webexport.
v116-Nickname-Signup darf keinen Legacy-cHa-Account neu anlegen. Der Game-Client
muss vor produktivem zentralen Login-Rollout auf zentrale Session/Auth umgestellt sein.

## v117-Homepage-Kandidat und Produktionsblocker – 09.10.2026

Elf v117-Auslieferungsdateien unverändert aus dem lesend verwendeten Game-Handoff
nach `game/` übernommen; alle SHA256-/Größenprüfungen bestanden. Beide Packteile
ergeben den Originalpack, jede Datei unter 100 MiB. `game.html` verwendet lokal
den vorhandenen iframe mit v117; v116, Wartung und Homepage-Bridge erhalten.

Echter lokaler zentraler Login auf Port 5500 bestanden. Header/Profil, Admin,
Gästebuch, Galerie und Forum-Entwurf verwenden weiterhin cHa; private E-Mail nur
im eigenen Profil. Voller Footer und DE/EN erhalten; geprüfte Überläufe 0.

Echter v117-Client erreicht aber **HTTP 404 bei `initialize_my_player_state`**.
Rein lesend produktiv bestätigt: RPC fehlt, zentrale player_state-Zeilen 0;
auch die beiden neuen Server-Persistenz-RPCs fehlen. Keine U01-Migration,
Gameplaydaten-Initialisierung oder Auth-/Adminänderung durch diese Aufgabe.
Passender Laptop-Dedicated vom Nutzer als nicht vorhanden / nicht bestätigt
gemeldet; v117 laut Handoff nicht gegen Alt-Dedicated veröffentlichen.

Zusätzlich nicht zugeordnete MutationObserver-Ausnahmen in den Game-Tabs
und sehr kleine Game-Lobby im Hochformat dokumentiert. Keine Scheinfertigmeldung.
Details, genaue Dateien, Nachweise und Wiederaufnahme:
`docs/GAME_WEBBUILD_V117_CHECKPOINT.md`. Keine Gamequellen, Dedicated oder U01
geändert; kein Export. Commit/Push nur nach vollständig bestandener Abnahme,
derzeit **nicht durchgeführt**. 19 fremde Wiki-Testartefakte erhalten. STOPP.

## v117-Fortsetzung: Cloudflare / U01 aktualisiert – 10.10.2026

Kandidat und fremder Working Tree erhalten. Keine weitere funktionale Änderung.
Lesende Produktionsprüfung: alle vier erforderlichen Read-/Initializer-/Server-
RPCs inzwischen vorhanden, zentrale UUID/cHa unverändert, eigene player_state-
Zeilen weiterhin 0 und Legacy-Account abwesend. U01 wurde im getrennten Backend-
Auftrag angewendet, hier keine Migration/Edge oder Gameplaydatenänderung.

Öffentliches `https://www.zhserver.de/game.html` HTTP 200 über Cloudflare; iframe
weiterhin v116, identisch mit letztem veröffentlichten Commit. Alle elf noch
unveröffentlichten v117-Dateien HTTP 404. Nach späterem Push Original-URLs samt
HTTP 200, MIME, Manifest und möglichen gecachten 404 gezielt live prüfen.

`wss://ws.zhserver.de/ws` (TLS-Port 443) mit Homepage-Origin erfolgreich: HTTP
101, verifiziertes Zertifikat/TLS 1.3 und gültiger WebSocket-Accept. Keine Auth-/
Gameplaynachricht gesendet, keine DNS-/Proxy-/Tunneländerung. Transport allein
beweist keinen passenden Dedicated. Aktueller Spiel-Handoff beschreibt die
vorbereitete Laptopphase; tatsächlicher v117-Laptop-/Browserbetrieb noch nicht
bestätigt. Neue lokale Accountseite auf 5500 derzeit ausgeloggt; keine Sitzung
kopiert. Vollständige Auth-/Gameplay-, HTTPS-, CORS- und CDN-Abnahme offen.

Details und bisherige Browser-/Mobile-Befunde:
`docs/GAME_WEBBUILD_V117_CHECKPOINT.md`. Kein Commit, Push, Webexport oder
Dedicated-Neustart. STOPP; vorhandenen Kandidaten für die Abnahme erhalten.

## v117-Veröffentlichung freigegeben – 10.10.2026

Der Nutzer bestätigt Dedicated produktiv auf `192.168.0.114:7000`, Party-v117
kompatibel, U01 und `player-state-persistence` produktiv, positiven Endpoint-Test
und Parser/Runtime jeweils 0 Fehler. Damit ist die bisher offene Dedicated-
Voraussetzung erfüllt. Ausdrücklicher Auftrag: vorhandenen vorbereiteten v117-
Stand committen, origin/main pushen, Deployment abwarten und anschließend echte
Cloudflare-/Live-Account-/Session-/Game-Abnahme durchführen. Keine erneute lokale
Integration, keine Dedicated-/U01-Änderung und kein Webexport.

Vor Commit gezielt bestätigt: alle elf Dateien weiterhin bytegleich mit dem
v117-Manifest und unter 100 MiB, 19 fremde Wiki-Testartefakte erhalten, Bridge
unverändert; origin/main entspricht dem bisherigen lokalen HEAD. Nur die
vorgesehenen Release-Dateien aufnehmen, keine Temp-/Testartefakte. Ergebnisse
nach dem Deployment dokumentieren; keine vollständige Live-Abnahme vorwegnehmen.

## v117 veröffentlicht und live geprüft – 10.10.2026

Release `cff094ac9125711f764c427cef478be08739542d` auf `origin/main`, Pages-Run
`38056532970` erfolgreich. Alle elf originalen Cloudflare-Build-URLs HTTP 200,
Größen/SHA256 manifestgleich, passende MIME-Typen und beide Packteile tatsächlich
geladen. Echt angemeldeter cHa-Account übernimmt die zentrale Session ohne zweite
Spielanmeldung, lädt den regulär initialisierten eigenen UUID-Spielstand und
verbindet ZHServer1 über `wss://ws.zhserver.de/ws`. Server-Snapshots/Autosaves,
Spielabmeldung, Reload, zentrale Abmeldung und manuelle Wiederanmeldung bei offenem
Game sowie zweiter Game-Tab bestätigt. Adminrechte/UUID, private E-Mail und
deaktivierter Namenseditor erhalten; keine Account-/Gameplaymigration.

Gezielte Live-Regression: Start/Gästebuch, Account/Profil, Admin, Galerie, Forum,
Wiki und Game; DE/EN, Desktop 1280/1440, Tablet 768, Mobile 390 ohne horizontalen
Homepage-Überlauf. 0 erfasste JS-/Console-Fehler; keine beobachteten relevanten
HTTP-/404-/CORS-/Mixed-Content-Fehler. Fremde 19 Wiki-Testartefakte bytegleich
erhalten. Keine Gamequellen-, Dedicated-, U01-, Wiki- oder Backendänderung, kein
Webexport. Bestehende öffentliche Playtestpause nicht aufgehoben.

Offen: gelieferte Godot-Lobby im Hochformat sehr klein; echter zeitgesteuerter
Tokenrefresh und Kontowechsel zwischen zwei echten Accounts nicht vollständig
live nachgewiesen. Details: `docs/GAME_WEBBUILD_V117_CHECKPOINT.md`.
Diese Homepage-Releasephase abgeschlossen; **STOPP**.

## Spielseite: neue visuelle Landingpage – 10.10.2026

Der vorige kompakte Aufbau wurde visuell abgelehnt und ersetzt. `game.html`
besitzt jetzt genau einen Einstieg im zweispaltigen Hero, ein großes vorhandenes
Konzeptbild mit integriertem Serverstatus, vier Featurekarten, drei klar als
Spielgrafik gekennzeichnete Bildflächen, kurze historische Zusatzinfo sowie
kompakte Entwicklungs-/Communitybereiche. Mobil erscheint das Bild früh.
Entwicklung, Roadmap, Abstimmung und alle 197 Changelogpunkte bleiben auf der
vorhandenen `game-development.html`; diese Datei wurde in der visuellen Phase
nicht verändert. Gemeinsamer Header/Footer und zentrale DE/EN-/Accountlogik
weiterverwendet; keine neue Auth-, Tracking- oder Backendlogik.

Echte lokale visuelle Abnahme auf Port 5500: Gast DE/EN bei 360/390/768/1280/1440,
Mitglied mit vorhandener cHa-Sitzung auf Desktop/Tablet/Mobile. Sprache nach
Reload und Seitenwechsel, Detailnavigation, Zurück/Vorwärts, Accordion und
Mobilmenü geprüft. Neuer Hero startet den unveränderten v117-Client bis zur
cHa-Lobby ohne zweite Anmeldung. Kein Spielweltbeitritt. 0 Browserfehler,
0 Warnungen, 0 horizontale Überläufe; zehn lokale Dateien HTTP 200. Header,
Footer, iframe-Markup und alle 33 geschützten Dateien unverändert.

Gastbutton weiterhin deaktiviert. Veröffentlichung erst nach nachgewiesenen
120000 ms im gelieferten Client **und zwei Minuten im produktiven Dedicated**,
finaler Transportabnahme und ausdrücklicher Freigabe. Details, Screenshots und
Fortsetzung: `docs/GAME_ENTRY_CHECKPOINT.md`. Lokale visuelle Teilphase fertig;
STOPP. Kein Commit, Push, Deployment oder Webexport.

## Spielseite: lokale Abschlussprüfung / v118-Handoff – 11.10.2026

Die visuelle Landingpage bleibt im fertig geprüften lokalen Stand vom
10.10.2026. In dieser Fortsetzung nur Checkpoints aktualisiert; Layout, Auth,
Footer und übrige Homepagebereiche unverändert. JS-Syntax und `git diff --check`
erneut sauber, alle 33 geschützten Dateien SHA256-identisch zum gespeicherten
Ausgangsstand. Keine vollständige Wiederholung bereits bestandener Browsertests.

Der gelieferte Kandidat `C:/ZHServer-Builds/v118/` ist jetzt verfügbar:
Manifest `guest_duration_ms = 120000`; alle elf Dateien nach Größe/SHA256 geprüft
und unter 100 MiB. Der Spiel-Handoff bestätigt nur die lokale/isolierte Abnahme,
keinen produktiven v118-Rollout. Das Laden der Zwei-Minuten-Policy durch den
Laptop-Dedicated und die anschließende produktive Gastabnahme sind noch offen.

Deshalb kein Buildwechsel, Gaststart weiterhin gesperrt und `game/` unverändert
auf v117. Keine Dedicated-, Spiel-, Wiki-, Backend- oder Accountänderung. Vor
einer späteren v118-/Gastintegration den präzisen Handoff und die Freigabegrenzen
in `docs/GAME_ENTRY_CHECKPOINT.md` verwenden. Die lokale visuelle Teilphase ist
abgeschlossen. **STOPP. Kein Commit, Push, Deployment oder Webexport.**

## Spielseite: tatsächliche visuelle Korrektur – 11.10.2026

Der vorherige Abschlussbericht enthielt den vom Nutzer abgelehnten Entdecken-
Bereich. Dieser Abschnitt ist jetzt maßgeblich; die frühere Beschreibung mit
drei Bildkacheln ist überholt.

Tatsächlich `game.html` und `assets/css/game-entry.css` geändert: „Die Welt von
Zombiehölle / Zombiehölle entdecken“ mitsamt den drei Bildkacheln vollständig aus
HTML und CSS entfernt. Kein Ersatzblock. Inhalts-Icons, Pfeildekoration und
Badge-Boxen entfernt, Feature-/Entwicklungs-/Communityflächen vereinfacht.
Hero-Grafik auf Desktop größer und vollständig gezeigt; auf Tablet/Mobile früh
und groß vor dem Account-Einstieg. Konzeptkennzeichnung bleibt einfacher Text.

Neue echte sichtbare Browserabnahme auf Port 5500: 14 DE/EN-Zustände mit Mitglied
und Gast, Desktop 1280/1440, Tablet 768, Mobile 390/360. Neue Desktop-/Mobile-
Hero- und Gesamtseiten-Screenshots tatsächlich angesehen. 0 Inhalts-Icons,
0 Badge-Boxen, 0 Entdecken-Elemente, 0 horizontale Überläufe und 0 erfasste
JS-/Consolefehler/Warnungen. Sprache nach Reload und mobiles Menü geprüft.
Serverprobe OFFLINE und Start deshalb gesperrt; Serverlogik unverändert.

Header, vollständiger Footer, Spielrahmen, Auth und sonstiger Working Tree
erhalten. Keine JS-, Wiki-, `game/`-, Spiel-, Dedicated- oder Backendänderung.
Details und neue Screenshotpfade: `docs/GAME_ENTRY_CHECKPOINT.md`.
v118 bleibt nur vorbereitet, Gaststart deaktiviert. **STOPP nach sichtbarer
Abnahme. Kein Commit, Push, Deployment oder Webexport.**

## Spielseite nach neuer Bildvorgabe – 11.10.2026, lokale Nutzerabnahme offen

Dieser Abschnitt ersetzt die früheren Layoutbeschreibungen. `game.html`, das
scoped `game-entry.css` und die zwei vorhandenen Präsentationsscripts tatsächlich
umgebaut: großer atmosphärischer Hero, zweifarbiger Titel, zentraler Einstieg
links und integrierter v117-Spielrahmen mit echtem Serverstatus rechts. Vor dem
Start bleibt die vorhandene Weltillustration ehrlich gekennzeichnet. Vier
Features ohne Icons, gemeinsamer Alpha-Stand mit funktionierenden Changelog/
Roadmap-Tabs und kompakter „Deine Ideen zählen“-Abschluss. Kein Entdecken-
Bereich, keine drei Bildkacheln, kein großer Geschichtsblock oder Ersatzwerbung.

Alpha 0.2.3 / 14 von 20 und die Kurzansichten kommen aus der unveränderten
Entwicklungsseite. Neue Texte/Alttexte zentral DE/EN. Gemeinsames Header-/Footer-
Markup unverändert, Besucher-/Communitylogik und Auth-Bridge erhalten.

Echte cHa- und Gastansicht DE/EN, Desktop 1440/1280, Tablet 768, Mobile 390/360
geprüft. Neue Screenshots tatsächlich erstellt und angesehen; Tabs samt Tastatur,
Mobilmenü, Sprachwechsel/Reload und Anmeldelink/Rücknavigation funktionieren.
0 erfasste Browser-JS-/Consolefehler/Warnungen, 0 horizontale Überläufe. Acht
lokale Dateien HTTP 200. Neun isolierte Zustands-/Identitäts-/Startprüfungen
bestanden; HTML, lokale Links, IDs, JS-Syntax und `git diff --check` sauber.

WSS-Transport derzeit OFFLINE: Start korrekt gesperrt, deshalb kein erneuter
echter Clientstart in dieser Runde. Das ist als offene Prüfung dokumentiert.
Gast bleibt gesperrt, `game/` auf v117, v118 nur vorbereitet. Keine Änderungen
an Wiki, Spiel, Dedicated/U01, Supabase oder Accounts. Alle 32 geschützten Dateien
inklusive elf Builddateien und 19 fremder Wiki-Artefakte SHA256-unverändert.

Details/Nachweise: `docs/GAME_ENTRY_CHECKPOINT.md`, Ordner
`C:/Users/sebbo/.codex/visualizations/2026/09/30/01a0f137-f3f5-7bc0-b080-7b451ea65ff0/game-landing-reference-20261011`.
**STOPP zur visuellen Abnahme durch Sebastian. Kein Commit, Push, Deployment
oder Webexport.**

## Spielseite: Hero über großem Spielfenster – 11.10.2026

Jüngster Layoutauftrag umgesetzt: Hero mit Titel, Accountstatus und Spielbuttons
oberhalb des contentbreiten Fensters. Kein Split mehr. Vorschau und echter v117-
Client teilen weiterhin dasselbe Fenster; bei 1440 px ist der iframe 1309 × 736 px
groß. Features, Alpha-Tabs, Community, Header, Footer, JS und DE/EN-Texte unverändert.
Nur `game-entry.css`, CSS-Versionskennung und Bildgrößenangabe in `game.html` angepasst.

Echter lokaler v117-Start mit cHa und ONLINE-Server bis zur Lobby geprüft, ohne
Vollbild oder Spielweltbeitritt. DE/EN, 1440/1280/768/390/360 px: 0 horizontale
Überläufe und 0 erfasste Consolefehler/Warnungen. Neue Desktop-/Mobile-Screenshots
im Nachweisordner `game-landing-stacked-20261011`, vollständiger Pfad und Details
in `docs/GAME_ENTRY_CHECKPOINT.md`. v118/Gaststart nicht freigegeben. **STOPP zur
visuellen Abnahme. Kein Commit, Push, Deployment oder Webexport.**

## Spielseite: v118 lokal integriert nach Dedicated-Freigabe – 11.10.2026

Dieser aktuelle Stand ersetzt den oben dokumentierten v118-/Gastblocker. Der
Nutzer hat Dedicated v118 mit 120000-ms-Gastlease produktiv auf WINLAP bestätigt.
Alle elf Dateien aus `C:/ZHServer-Builds/v118` manifestgleich nach `game/`
übernommen. `game.html` lädt v118; `game-entry.js` erlaubt den Gaststart nach
erneuter Prüfung der bestehenden zentralen Identität. Kein eigener Gasttimer,
keine neue Anmeldung oder UUID-/Accountänderung. Elf unreferenzierte v117-
Laufzeitdateien nach Hash-/Referenzprüfung entfernt; Quellbuilds/Handoffs erhalten.

Echter lokaler cHa-Start ohne zweiten Login bis zur v118-Lobby bestanden. Echter
Gaststart mit 02:00-Countdown und beobachtetem Testzeit-Ende bestanden. Die exakte
serverseitige Dauer und bereits bestätigte Reconnect-/F6-/Persistence-Tests werden
aus der vom Nutzer gelieferten Dedicated-Abnahme übernommen. ZHServer1 ONLINE;
öffentlicher WSS-Handshake HTTP 101; alle elf lokalen Builddateien HTTP 200 mit
korrekten MIME-Typen. 0 erfasste Browser-JS-/Consolefehler/Warnungen und 0 Fehler
in der gezielten HTTP-Prüfung. JS-Syntax und `git diff --check` sauber.

Der lokale Umbau mit Hero über dem großen gemeinsamen Vorschau-/Spielfenster
bleibt erhalten. CSS, Features, Alpha-/Communitybereich, Auth-Bridge, Footer,
DE/EN, letzte Startseitenkorrektur und fremde Wiki-Artefakte unverändert. Keine
Änderung an Dedicated, Spielquellen, U01/F01, Supabase oder Accounts.

Details: `docs/GAME_ENTRY_CHECKPOINT.md`; neue Nachweise/Screenshots außerhalb Git:
`C:/Users/sebbo/.codex/visualizations/2026/09/30/01a0f137-f3f5-7bc0-b080-7b451ea65ff0/game-v118-homepage-local-20261011`.
**STOPP zur visuellen Abnahme. Kein Commit, Push, Deployment oder Webexport.**

## Hauptnavigation nach heutiger Relevanz – 11.10.2026

Auf allen 13 Seiten mit dem gemeinsamen Header ausschließlich die vorhandenen
Menüpunkte neu geordnet: Start | SPIEL | Wiki | Community | Forum | Galerie |
Geschichte | Timeline | Gästebuch. „BUGS / IDEEN“ vollständig aus diesen
Navigationsblöcken entfernt. Vorhandene gemeinsame DE/EN-, Menü- und
Aktivmarkierungslogik unverändert weiterverwendet; keine neue Navigation gebaut.

Die direkten Bug-/Ideenbuttons in `game.html` und `game-development.html` führen
nach `forum/#category/bugs` bzw. `forum/#category/ideas`. Der gemeinsame Feedback-
Link innerhalb des Forums führt zur Kategorienübersicht. Die funktionierende
Abstimmung bleibt erhalten; im Forum existiert noch kein Abstimmungsbereich.
Keine alten Feedbackdaten oder Funktionen gelöscht, kein Forum-Backend ergänzt.

Alle 13 Navigationsfolgen, lokalen Ziele und Anker statisch geprüft. Echte
Browserprüfung DE/EN auf Desktop 1280/1440 und Mobile 390: Menü öffnen/schließen,
Seitenwechsel mit erhaltener Sprache, aktive Spiel-/Wiki-/Forummarkierung,
Bug-/Ideenziele und Zurücknavigation bestanden. 0 horizontale Überläufe und
0 erfasste Browser-JS-/Consolefehler/Warnungen. `git diff --check` sauber.

Nur Headernavigation und genannte Linkziele geändert; übrige Seiteninhalte,
Wiki-Inhalte, Styles, sämtliche JS-Dateien, Account-/Footerlogik und alle elf
v118-Dateien SHA256-unverändert. Fremde lokale Änderungen vollständig erhalten.
Nachweise/Screenshots außerhalb Git: `navigation-order-20261011` unter dem
bestehenden Visualisierungsordner. Kein Commit, Push, Deployment oder Webexport.

## Konsolidierte lokale Homepage-Teilphase – 11.10.2026

Bereits fertig übernommen: elf manifestgleiche v118-Dateien, aktiver Zwei-Minuten-
Gaststart, zentrale cHa-/UUID-Session, Hero oberhalb des großen Vorschau-/
Spielfensters, vier Features und Alpha-Tabs. Die Entfernung des Startseiten-
Entwicklungsblocks und der neue Text/Alpha-Button der mittleren Karte bleiben
erhalten. Keine erneute Integration oder Änderung am gelieferten Build.

Neu ergänzt:
- Die bestehende `community-voting.js` wird auch auf der Spielseite genau einmal
  initialisiert. Dieselbe Tabelle `community_votes`, dieselben vier Options-IDs,
  dieselbe `vote_for_feature`-RPC und gespeicherte Auswahl; kein zweites Votesystem.
  Kompakte direkte Stimmabgabe unter „Deine Ideen zählen“, Ergebnisse und
  „Mehr Details“ zur unveränderten Detail-/Archivseite. Bug/Idee führen ins Forum.
- Gut sichtbare „SERVER ONLINE/OFFLINE“-Anzeige im Hero und Spielfenster. Beide
  verwenden die vorhandenen `data-game-server-status`-/Message-Bindings;
  `game-entry.js`, WebSocket-Probe, Accountprüfung und Gastlease unverändert.
- Die vorhandene gemeinsame Navigation-Initialisierung in `i18n.js` entfernt
  ausschließlich den alten Community-Menüpunkt. Auf allen 13 gemeinsamen Headern:
  Start | SPIEL | Wiki | Forum | Galerie | Geschichte | Timeline | Gästebuch.
  Community-Inhalt und andere Links bleiben erhalten. Keine Wiki-Datei geändert.
- Ausschließlich `.era-present` erhält einen dünnen Goldrahmen und einen
  maskierten, neun Sekunden umlaufenden Lichtreflex samt schwachem Glow. Kein
  neues Bild/JS; die äußeren Karten bleiben unverändert. Reduced Motion blendet
  beide animierten Pseudoelemente aus und erhält den statischen Rahmen.

Prüfungen/Nachweise: tatsächliche DE/EN-Ansichten der Start- und Spielseite bei
1440/1280/768/390/360 px; keine horizontalen Inhaltsüberläufe. Neue Screenshots
inklusive echter cHa-/Gastansicht, großem Spielfenster, Goldrahmen und Abstimmung.
Bestehende v118-/120000-ms-/HTTP-200-/WSS-101-Nachweise weiterverwendet; Details
und Einschränkungen in `docs/GAME_ENTRY_CHECKPOINT.md`.

Nachweise außerhalb Git: `homepage-consolidated-20261011` sowie
`game-inline-vote-20261011` im bestehenden Visualisierungsordner.
Abschließender echter cHa-Start im v118-Client ohne zweiten Login bestätigt.
Desktop-Spielfenster 1309 x 736 px, Statusleiste vollständig unter dem Header.
Kleine CSS-Scrollkorrektur auch bei 390 px geprüft, kein horizontaler Overflow.
0 erfasste Browser-JS-/Consolefehler und Warnungen. Fremde Änderungen, Wiki,
Auth-Bridge, gemeinsamer Vote-Renderer und sämtliche v118-Dateien unverändert.

Kein Commit, Push, Deployment oder Webexport. STOPP zur visuellen Abnahme.

## Veröffentlichung freigegeben – 11.10.2026

Visuelle Abnahme durch Sebastian erteilt. Der aktuelle lokale Homepage-/v118-
Stand darf gezielt auf origin/main veröffentlicht werden; kein neuer Webexport.
Die zuvor blockierte native HTTP-Prüfung ist nachgeholt: sechs UI-Dateien plus
Startseite/i18n/Goldrahmen/Einstiegsscript HTTP 200, passende MIME-Typen und
lokaler Inhalt bestätigt. Öffentliche Abstimmungsdaten lesend erreichbar.
Alle elf v118-Dateien SHA256-identisch zum freigegebenen Quellbuild, unter
100 MiB pro Datei. Keine alten v117-Laufzeitdateien oder aktiven Referenzen.

Für alle 13 gemeinsamen Header dieselbe i18n-Cachekennung gesetzt, damit die
freigegebene Navigation beim Release auch nach früheren Seitenbesuchen lädt.
Keine weiteren Inhalts-/Auth-/Backendänderungen. Fremde 19 Wiki-Prüfartefakte
bleiben uncommittet erhalten. Bestehendes Pages-Deployment nach Push prüfen.
Live-Account-/Client-, HTTP-/MIME-/SHA256-/WebSocket- und Responsive-Nachweise:
`C:/Users/sebbo/.codex/visualizations/2026/09/30/01a0f137-f3f5-7bc0-b080-7b451ea65ff0/homepage-v118-release-20261011`.
Eine vollständige Live-Abnahme wird vor ihrem tatsächlichen Abschluss nicht
behauptet. Dedicated/U01/F01/Supabase/Cloudflare/Spielprojekt unverändert.

## Neuer lokaler Arbeitsstand: Community Pulse + Forum-Aufrufe – 13.10.2026

Der zuvor freigegebene Forum-Release ist abgeschlossen; HEAD bleibt
`49b51da2411ce85059894e808c269b47411dbe26`. Die neue Teilphase verändert diesen
Release nicht rückwirkend. Rechte Startseitenkarte zu Community Pulse umgebaut,
Arma als kleine Notiz darunter, vorhandene zentrale Auth/i18n weiterverwendet.
Adminpflege und echte Thread-Aufrufe lokal vorbereitet und mit isoliertem SQL
geprüft. Nach ausdrücklicher Freigabe Migration im bestehenden Supabase-Projekt
angewendet (Version `20261013164013`); beide Schalter in
`assets/js/community-features.js` lokal true. Cachekennung `20261013-pulse-active1`.

Fortsetzung ausschließlich über `docs/COMMUNITY_PULSE_VIEWS_CHECKPOINT.md` und
den aktuellen Diff. Exakter Migrationsumfang/Rücknahme:
`docs/COMMUNITY_PULSE_VIEWS_REVIEW.md`. Migration nicht erneut ausführen. Echte
lokale Adminanbindung sowie Rechte-/Stimmtests mit vollständigem Rollback
bestanden. Keine Testfragen/-stimmen gespeichert; echter Thread-Aufruf bleibt
nach Reload/zweitem Tab bei 1. STOPP vor einem Homepage-Release.
Kein Commit, Push, Deployment oder Webexport. Fremder
Wiki-/Prüfbestand, GAME/Dedicated, zentrale Rollen/Profile sowie Besucher/Presence
bleiben vollständig erhalten.
