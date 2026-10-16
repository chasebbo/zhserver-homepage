# Sicherheitsaudit – Abschluss / STOPP am 16.10.2026

## Aktueller Stand

**Security-Release am 16.10.2026 ausdrücklich freigegeben:** Nur den bestehenden Audit-Block veröffentlichen. Vor Release erneut 31/31 Security-Regressionsprüfungen, 41 JS-Syntaxprüfungen und 17 SDK-/SRI-Einbindungen bestanden; 22 relevante HTML-/JS-Routen lokal HTTP 200 mit passenden MIME-Typen und identischem Inhalt (bekannten Live-Server-Reloadblock ausgenommen). SDK-Bytes separat erneut mit SHA384 geprüft. Lokale DE/EN-/Desktop-/Mobile-Prüfung umfasst Startseite/Pulse/Gästebuch, Forum, Galerie, Account-/eigene Profilansicht und game.html; vorhandene cHa-Session erhalten, keine produktiven Testinhalte oder Votes erzeugt. Keine erneute Migration, Auth-Konfigurations-, CSP- oder Hostingänderung. Release-/Deployment-/Live-Belege werden außerhalb des Repositorys im bestehenden Auditordner als `release-*.json` erfasst. Fremde 24 Dateien bleiben unverändert und außerhalb des Commits. Die früheren STOPP-Angaben unten dokumentieren die vorangegangenen lokalen Aufträge; die neue Freigabe betrifft ausschließlich Commit/Push/Pages dieses Blocks.

**Gezielte Release-Nachkorrektur:** Erster Security-Commit `585dbe101abf38f81db98d56e5a8de0ef282cd33`, erfolgreicher Pages-Lauf `38855145170`. Die anschließende echte Live-Galerieprüfung fand eine alte im Browser gecachte `main.js` unter bisheriger URL, während neue `gallery.js` bereits `safeGalleryImageUrl` verlangte. Versionskennungen der zusammengehörigen Security-Scripts in den bereits beteiligten HTML-Seiten deshalb auf `20261016-security1` angehoben; zusätzlich ausschließlich die Account-/Community-Script-Versionskennung in `i18n.js` und `visitor-counter.js`. Keine Übersetzungs-, Besucher-, Presence- oder Authlogik verändert. Insgesamt 35 freigegebene Release-Dateien einschließlich dieser beiden Loader-Korrekturen; Wiki unverändert. Vor finaler Abnahme neue versionierte URLs und Galerie nochmals prüfen; erster fehlerhafter Browserlauf ist kein grüner Abschlussnachweis.

Auftrag aus der Nutzeranlage vom 15.10. vollständig als Code-/Katalog-/HTTP-Audit bearbeitet; sichere lokale Fixes umgesetzt. Hauptbericht: [SECURITY_AUDIT.md](SECURITY_AUDIT.md), zugehörige drei Matrizen und Testresultate im selben Ordner. Kein Release. Nach separater ausdrücklicher Freigabe wurde am 16.10.2026 ausschließlich die H01-Gästebuchmigration produktiv angewendet und verifiziert.

**H01 – BEHOBEN, produktiv verifiziert:** Unveränderte Datei `docs/20261015214609_homepage_guestbook_read_security.sql` wurde nach erneuter Verbindung erfolgreich im bestehenden Projekt `zhserver` angewendet. Bestätigter produktiver Migrationseintrag: **`20261016050805_homepage_guestbook_read_security`**, 16.10.2026 05:08:05 UTC / 07:08:05 Berlin. SHA256 der Quelldatei: `f24ec3bc91a310f7524e03bf4b1741b739235a9693690e85118c277b02734616`. Keine bestehende Migration wiederholt. Die früheren Connectorfehler hatten die Policy nicht entfernt; erst der erfolgreiche Apply nach Neuverbindung tat dies. **Diese Migration jetzt nicht erneut ausführen.**

## Gezielte produktive Nachprüfung H01 – 16.10.2026

- `Enable read access for all users` entfernt; RLS aktiv. Genau zwei SELECT-Policies verbleiben: öffentlich nur `approved=true`, Admins zusätzlich über `is_zh_admin()`. Keine ALL-Policy und keine zweite allgemeine permissive Lesepolicy. Die übrigen sechs Gästebuch-Policies sind exakt unverändert.
- Anonyme reale REST-Requests: approved=true → HTTP 200 / 5 Zeilen; approved=false → HTTP 200 / 0 Zeilen; ohne Freigabefilter → HTTP 200 / 5 ausschließlich freigegebene Zeilen.
- Read-only-Produktionsprüfung unter anon und normaler bestehender Member-UUID: fünf freigegebene Einträge, keine ungeprüften; Member bleibt trotz transaktionslokaler gefälschter Adminmetadaten Nicht-Admin. Bestehende Admin-UUID ergibt `is_zh_admin()=true`; Admin-Lese-/Freigabe-/Löschpolicies erhalten. EXPLAIN ohne ANALYZE bestätigt die Planbarkeit der Moderationspfade, ohne sie auszuführen.
- Tatsächliche vorhandene Adminsession öffnet lokal `/admin/guestbook.html` gegen das produktive Backend: „Keine offenen Einträge.“, null erfasste Consolefehler. Live-Gästebuch in DE/EN: jeweils fünf Einträge, null erfasste Console-/JS-Fehler.
- Alle fünf Gästebuchzeilen unverändert: vorher/nachher MD5-Aggregat `2af2605d41cd454ac5e849083d5ba291`, fünf approved, null pending. Keine produktive Testnachricht erstellt, freigegeben oder gelöscht. Da kein pending-Datensatz vorhanden ist, beruht der Nachweis seiner Sperre auf aktuellen Produktionspolicies/Prädikaten und den bereits bestandenen isolierten pending-Fixturetests; kein behaupteter neuer echter Freigabe-/Löschvorgang.
- Belege im unten genannten externen Auditordner: `guestbook-applied-proof.json`, `guestbook-applied-http.json`; Erhaltungsprüfung über `guestbook-fix-baseline.json` / `guestbook-fix-preservation.json`.
- In dieser Fortsetzung ausschließlich diesen Bericht und `SECURITY_AUDIT.md` geändert. SQL-Datei, Quellcode, Wiki, GAME und fremde lokale Änderungen erhalten. Andere Securitypunkte unverändert; keine weiteren produktiven Änderungen, kein Commit/Push/Deployment/Webexport.

Die folgenden Tabellen dokumentieren den ursprünglichen Audit vor der separat freigegebenen produktiven H01-Korrektur; der Nachtrag oben ist für deren aktuellen Status maßgeblich.

## Lokal geändert

- Fünf vorhandene JS-Dateien: `main.js`, `gallery.js`, `game-entry.js`, `account.js`, `community-stats.js`.
- 17 vorhandene HTML-Seiten: ausschließlich bestehende SDK-Tags gepinnt und mit SRI versehen; zwei Seiten zusätzlich rel-Attribute. Kein Layout verändert.
- `.gitignore`: lokale .env-Dateien schützen.
- Neuer Test `tools/security-regression.mjs`; neue Auditdokumentation und vorbereitete Gästebuchmigration.

Vollständige Dateiliste im Hauptbericht und im externen `final-checks.json`.

## Tatsächlich geprüfte Ergebnisse

| Prüfung | Ergebnis |
|---|---|
| Aktueller Produktionskatalog | 32 Tabellen, 35 Policies, 96 Funktionen / 61 Definer |
| Isolierter echter PostgreSQL-Lauf | 50/50 Verhaltenstests, alle 96 Funktionsdefinitionen geladen |
| Neue Gästebuchmigration einschließlich Guards | Isoliert bestanden; Gäste/Member sehen pending nicht mehr, Admin weiter berechtigt |
| Permanente Offline-Frontendprüfung | 31/31; Escaping, URL, Redirect, Origin/Window, Logout/Expiry/kaputte Session |
| Syntaxprüfung vorhandener Homepage-/Admin-JS | 41 Dateien bestanden, 0 Syntaxfehler |
| Statische Supabase-SDK-Tags | 17/17 Version 2.118.0 + identischer SRI + crossorigin |
| SDK-Hash separat über HTTP | Identisch mit bisher aufgelöster Version; HTTP 200 |
| Geänderte lokale HTML-/JS-Dateien | 22/22 HTTP 200; HTML/JavaScript-MIME korrekt |
| Live-Homepage-/Rechts-/Dokumentrouten | 11/11 HTTP 200; fehlende Sicherheitsheader dokumentiert |
| Zwei gezielte negative Logins | Vorhandene/unbekannte E-Mail identisch 400 invalid_credentials; keine E-Mail/Passwörter in Ergebnisdatei |
| Kaputtes bzw. gefälschtes JWT mit fremder UUID/Adminmetadaten | Jeweils 401 PGRST301 am echten Gateway |
| Alle fünf privaten Schemas | Jeweils REST 406 PGRST106, nicht exponiert |
| Drei Edge-Persistenzfunktionen ohne Server-Token | Jeweils 401 unauthorized_server |
| Bestehendes öffentliches WebSocket | wss://ws.zhserver.de/ws geöffnet / Handshake 101; keine Gameplay-Nachricht gesendet |
| Lokale bestehende cHa-Sitzung | Restore, eigenes Profil mit privater E-Mail, ZH-Admin und Adminübersicht funktionieren |
| Gast | Direkter Dashboard-Aufruf führt zur geschützten Adminübersicht ohne Admininhalte |
| Öffentliches Profil/Forum | Keine private Login-E-Mail im sichtbaren Inhalt |
| Galerie | Beide vorhandenen alten Dateinamen weiterhin gültig, Bilder laden |
| DE/EN / Responsive | Startseite/Pulse-Ergebnisse, Forum und Galerie bei 1440, 768, 430, 390, 360px geprüft |
| Pulse-Ergebnisse | Nur „Ergebnisse ansehen“, keine Stimme abgegeben; lange Optionen ohne Horizontaloverflow |
| Horizontale Überläufe in diesen Messungen | 0 |
| Console-/JS-/CORS-/Mixed-Content-Fehler in den drei erfassten Browserprüftabs | 0 |
| Fremde Dateien | Alle 24 ursprünglichen SHA256 unverändert |
| Git-HEAD und Index | Unverändert; nichts gestaged |
| git diff --check | Sauber |

Bewusst negative 400/401/404/406-Probes zählen nicht als verschwiegene erfolgreiche Requests. Der OpenAPI-Wurzelpfad erlaubte keine Schemaauskunft; die gültigen Tabellenpfade mit `limit=0` belegen danach die Schemasperre. Ein anfänglich an das falsche aktive Tab gebundenes Viewportmaß wurde anhand der tatsächlichen `innerWidth` erkannt; die Responsive-Abnahme erfolgte anschließend am richtigen Tab. Die 430px-DE-Messung wurde nach vollständigem Sprachwechsel wiederholt.

## Grenzen

- Kein neues Konto, echter positiver Passwortlogin, Passwortwechsel, Recovery-Mail oder Testupload in Produktion. Die vorhandene lokale Adminsession wurde wiederverwendet. Kein Memberpasswort beschafft. Member-/Admin-Writeabgrenzung mit echten aktuellen SQL-Definitionen in isolierten Konten getestet.
- Keine produktiven Posts, Antworten, Votes, Moderationen oder Löschungen als Test ausgelöst. Normale Seitenaufrufe nutzen weiterhin den bestehenden Besucher-/Presence-Code; kein alternativer Testzähler.
- Kein konkurrierender Produktions-/Lasttest. Sequenzielle Idempotenz, Constraints und Lockpfade geprüft; kein behaupteter Race-Stresstest.
- Gameexport-/Dedicatedquellcode nicht vollständig auditiert. Der direkte Game-Export-Parameterpfad und die unabhängige serverseitige Tokenprüfung bleiben für einen separaten Auftrag offen. GAME, Dedicated, U01/F01 und Wiki unverändert.
- Auth-Dashboard-Redirect-Allowlist, SMTP-Secrets und sämtliche Infrastruktur-Logs nicht pauschal als geprüft ausgegeben. Keine Secrets abgefragt.
- Retention, Datenschutztext, Header-Enforcement und alte Export-/Dokumentveröffentlichung bleiben Entscheidungen, keine stillen Änderungen.

## Abdeckung des 54-Punkte-Auftrags

| Auftragspunkte | Nachweis |
|---|---|
| 0–2 Bestand / Ziel / Secrets | Baseline, Dateiinventur, Text- und binärer Musterscan; keine bestätigten privilegierten Schlüssel |
| 3–5 Auth / Admin / private Identität | account.js, identity.js, admin/access.js, Rollen-RPCs; lokale eigene Session und Gast; zwei negative Logins/JWT-Probes |
| 6–7 RLS / RPC | Vollständige RLS-/Function-Matrizen; Katalog und tatsächliche Funktionsbodies |
| 8–10 Pulse / Forum / Changelog | Owner-/Admin-/Lösch-/Vote-/Trigger-Verhalten in isolierter aktueller DB; DOM-Pfade verfolgt |
| 11–12 XSS / URLs | Sink-Matrix; Galeriehärtung, Textknoten, Escaping, Redirect-/URL-Tests, rel-Fixes |
| 13–15 Upload / Profil / IDOR | Storage-Policies, Bucketlimits, Profilprojektion, UUID-Pfadprüfung und Fremdzugriffstests |
| 16–17 CSRF / Browser-Speicher | Bearer-Architektur, SDK-Storage, Entwürfe/Revisionen/Visitor-/Presencekennungen inventarisiert; keine Rollenautorität daraus |
| 18–20 Spam / Enumeration / Debug | M02/M03/M06; gleiche negative Loginantwort; keine Authcredentials in geprüften Logs; rohe Legacy-Fehler als interne Hygiene bewertet |
| 21–25 Header / CSP / CORS / Dependencies / SRI | Live-Headerprobe, Quelleninventur, Hostingplan, drei Edge-401; exakte SDK-/OSV-Prüfung; SRI lokal |
| 26–27 Cache / Game-Handoff | Static-Serviceworker-Suche, Cacheheader, Origin/Window-/Expiry-Bridge-Tests; beliebiger äußerer server-Override gesperrt; WSS101 |
| 28–30 Private Daten / technische DSGVO / Rechtslinks | Öffentliche RPC-Projektionen, Daten-/Retention-Inventur, L02/L05 und HTTP-200-Rechtsseiten; keine juristische Umschreibung |
| 31–34 Redirect / Clobbering / Formulare / Reaktionen | Pfad-/UUID-Allowlisten, begrenzte JSON→Map-Verarbeitung ohne Prototyp-Merge, Textlimits, Vote-Unique-/Switch-/Idempotenztests |
| 35–37 Constraints / Migrationshygiene / Definer | Katalog-Constraints/FKs/Indizes, Policy-Kollision H01, 61 Definer einzeln, feste Suchpfade, kein dynamisches SQL |
| 38–40 Gast / Member / Admin | Echte anonyme API-/Browserprobes; isolierte normale/admin UUIDs mit manipulierten Metadaten; bestehende cHa-Session |
| 41–42 Repo-/Altcode-Hygiene | L01/L02/L06, .env-Ignore; historische Exporte/Trigger/Legacy-Vote klassifiziert, keine Massenlöschung |
| 43–45 Tests / sichere Fixes / Grenzen | 31 permanente Frontendchecks, 50 isolierte SQLchecks; lokale Änderungen separat; keine produktive SQL-Ausführung |
| 46–51 Priorität / Bericht / Matrizen / Freigaben | SECURITY_AUDIT.md sowie drei vollständige Matrizen und Hostingplan |
| 52–54 Dateien / Testabschluss / STOPP | Datei- und Erhaltungsnachweis, dieser Checkpoint; kein Commit/Push/Deployment/Apply |

## Nicht verlieren / Fortsetzung

Externer Belegordner:
`C:/Users/sebbo/.codex/visualizations/2026/09/30/01a0f137-f3f5-7bc0-b080-7b451ea65ff0/security-audit-20261015/`

`baseline.json` ist der maßgebliche Anfangszustand. Vor weiteren Arbeiten `git status`, diesen Checkpoint und gezielte Diffs lesen. Fremde Dateien nicht aus dem Arbeitsverzeichnis entfernen oder mitcommitten. Keine Migration aus einer Berichtserwähnung als freigegeben behandeln.

**STOPP. H01 produktiv behoben und verifiziert. Weitere Securitypunkte erst nach gesondertem Auftrag bearbeiten. Kein Commit, Push oder Deployment.**
