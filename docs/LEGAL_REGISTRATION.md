# Registrierung – Nutzungsbedingungen und Community-Regeln

Stand: 08.10.2026. Die geprüfte Migration wurde nach ausdrücklicher Freigabe im
bestehenden Supabase-Projekt angewendet und produktiv geprüft. Die lokale
Registrierungsanbindung ist aktiviert. **Keine Veröffentlichung der Homepage.**

## Seiten, Fassung und Darstellung

- `/nutzungsbedingungen/`: Account, Homepage/Forum/Galerie/Spiel, kostenlose
  Nutzung, persönlicher Zugang, Zugangsdaten, Verfügbarkeit, Alpha, Änderungen,
  technisch begründete Anpassungen/Resets, Gast-Testzugang und Moderation.
- `/community-regeln/`: sieben kompakte Regeln für Umgang, Spam, Cheating,
  Exploits/Dupes, Ban-Umgehung, Inhalte und angemessene Moderation.
- Beide Seiten verwenden das bestehende DE/EN-System, den aktuellen Header und
  den vollständigen globalen Community-/Besucherfooter. `/terms/` und
  `/community-rules/` sind lediglich EN-Einstiegsaliases: bestehende zentrale
  Sprache auf EN setzen und zur gemeinsamen Seite weiterleiten. Keine zweite
  englische Inhalts-/Tracking-Implementierung.
- Die rechtlichen Texte liegen im zentralen `translations.js` unter
  `legal.2026-10-08.*`. Deutsche HTML-Texte dienen wie bisher als Fallback ohne
  JavaScript. Fassung in beiden Sprachen: **2026-10-08**.
- Registrierungslinks pinnen `?version=2026-10-08`, öffnen neue Tabs und lassen
  eingegebene Accountfelder erhalten. Eine unbekannte Versions-URL zeigt einen
  ehrlichen Nicht-verfügbar-Zustand und nicht die falsche Fassung.
- Bei späteren Fassungen alte Übersetzungsschlüssel und Dokumenttexte erhalten
  und die Versionsauflösung ausdrücklich erweitern. Nicht alte Texte unter
  derselben akzeptierten Versionskennung überschreiben.
- Footer: Impressum, Datenschutz, Nutzungsbedingungen und Community-Regeln als
  kompakte umbrechende Rechtsnavigation im vorhandenen gemeinsamen Renderer.
  Daten- und Trackinglogik von Besuchern und Presence unverändert.

## Registrierung und Datenschutz

Genau eine erforderliche, nicht vorausgewählte Checkbox:
„Ich akzeptiere die Nutzungsbedingungen und Community-Regeln.“

Darunter getrennt: „Die Datenschutzerklärung habe ich zur Kenntnis genommen.“
Die Datenschutzerklärung ist verlinkt, ohne zusätzliche Einwilligungscheckbox.
Es wird keine pauschale Zustimmung zur Datenverarbeitung oder freiwillige
Newsletter-Einwilligung behauptet. Die bestehende Datenschutzerklärung selbst
bleibt unverändert.

Native `required`-Prüfung plus explizite Submit-Prüfung verhindern Registrierung
ohne Checkbox. Login und Passwort-Reset deaktivieren/verbergen das Feld. Nach
Reload wird die Checkbox wieder zurückgesetzt; ein Sprachwechsel verändert
eine bereits gesetzte Zustimmung nicht.

## Direkt bestätigter Supabase-Bestand

Rein lesend geprüft im vorhandenen Projekt `zhserver` / `yawadxzeyyrozmlrokun`:

- PostgreSQL 17.6; elf bestehende nicht anonyme/nicht gelöschte Auth-Accounts.
- `profiles.id` verweist auf den vorhandenen Auth-Account. Profilfelder:
  Anzeigename, Farbe, Spielwerte und Zeitstempel; keine Rechtsversionsfelder.
- Bestehende Own-SELECT-RLS. Keine neue öffentliche Freigabe privater Profile.
- `on_auth_user_created` ruft `create_profile_for_new_user()` auf und legt Profil
  und Spielinventar an. Diese Funktion und dieser Trigger bleiben unverändert.
- Keine bestehende passende Zustimmungstabelle oder entsprechende Spalten.
  `auth.oauth_consents` gehört zum OAuth-System und wird nicht dafür umgebaut.
- Vorhandene Anmeldung, Rollen, Sessions, Admin, Anzeigenamen und Game-Handoff
  werden weiterverwendet. Keine Auth-Einstellungen oder Auth-Zugangsdaten gelesen.

## Angewendete kleine Backend-Ergänzung

Review-Datei: [`legal_consent_prepare.sql`](legal_consent_prepare.sql).

Eine private Tabelle `zh_legal_private.account_consents` mit:

| Feld | Quelle |
| --- | --- |
| `user_id` | Tatsächliche neue `auth.users.id`, nicht aus Client-Metadaten |
| `terms_version` | Gegen serverseitige aktuelle Fassung validiert |
| `community_rules_version` | Gegen serverseitige aktuelle Fassung validiert |
| `accepted_at` | Server `clock_timestamp()`, kein Browserdatum |

Primärschlüssel aus Account und beiden Versionen bereitet eine spätere Historie
vor. Kein zweites Profil, keine Rollen-/Accountduplikate, keine E-Mail/IP-Adresse
im Zustimmungsprotokoll. Die FK-Verknüpfung folgt dem vorhandenen Auth-Account;
beim Löschen des Accounts werden zugehörige Zustimmungseinträge entfernt.

Ein **zusätzlicher** `AFTER INSERT`-Trigger auf `auth.users` prüft bei neuen
registrierten Accounts den eingereichten Zustimmungsdatensatz. Ohne `accepted:
true` und die beiden aktuellen, exakten String-Versionen schlägt die gesamte
Registrierungstransaktion fehl, einschließlich des vorhandenen Profil-/Inventar-
Inserts. Er ersetzt keine bestehende Funktion. Der aktuelle Gastmodus wird nicht
umgebaut; mögliche echte anonyme Auth-Accounts sind vom Registrierungsnachweis
ausgenommen. Anonyme Auth ist im bestätigten Bestand deaktiviert.

Der Client übermittelt die erste Zustimmung als Signup-Erklärung in
`options.data.zh_legal_consent`. Sie ist **nicht** die dauerhafte Quelle. Der
Trigger validiert sie und schreibt die private Zeile serverseitig. Spätere
`updateUser({ data: ... })`-Änderungen an frei editierbaren Metadaten ändern die
Zustimmung nicht. Metadaten sind weder eine Rollenquelle noch ein Ersatz für
das private Protokoll. Es gibt keinen vom Client gewählten Besitzer/Zeitstempel.

RLS ist aktiv; keine direkten Client-Tabellenrechte, keine Schreibpolicies und
keine öffentlich aufrufbare Schreib-RPC. Privilegierte Implementierungen liegen
im nicht exponierten privaten Schema mit leerem `search_path`. Zwei schmale
öffentliche `SECURITY INVOKER`-RPCs:

- `get_zh_registration_policy()`: aktuelle Versionen und Pflichtstatus; für
  Gäste und angemeldete Benutzer. Vor Signup auf Übereinstimmung prüfen.
- `get_zh_own_legal_consents()`: ausschließlich eigene Versions-/Zeitstempel-
  Historie aus `auth.uid()`; nur angemeldet, nicht anonym oder gelöscht.
  Kein Ziel-Account-Parameter, keine öffentliche UUID/E-Mail/Profil-/Rollenfelder.

**Auswirkung der Freigabe:** Neue registrierte Accounts müssen die geprüfte
Zustimmung mitliefern. Das gilt auch für neue Konten über andere Signup-Clients
oder eine administrative Accountanlage. Solche neuen Anlagen ohne passende
Zustimmung werden danach abgelehnt. Der vorhandene Admin-Login/Account und alle
bisherigen Accounts bleiben erhalten. Für spätere Einladungs-/OAuth-/native
Signupwege zunächst denselben ausdrücklichen Zustimmungsvertrag einbauen.

## Bestätigte Aktivierung nach Freigabe

- Projekt `zhserver` / `yawadxzeyyrozmlrokun`, PostgreSQL 17.6.
- Exakte geprüfte SQL-Datei angewendet als
  `20261008101121_homepage_account_legal_consent`.
- Vorher keine Zustimmungstabelle/RPC vorhanden; relevanter Bestand unverändert.
- Danach beide RPCs, zusätzlicher Trigger, FK/PK, RLS und tatsächliche Rollenrechte
  geprüft. Bestehende Profilfunktion, ihr Trigger und ihre RLS unverändert.
- Erst danach `assets/js/legal.js`: **`backendEnabled = true`**. Der tatsächliche
  lokale Source prüft vor Signup die produktive Versions-RPC und übermittelt
  die explizite Zustimmung zur serverseitigen Registrierungstransaktion.
- `get_zh_registration_policy()` über die produktive HTTP-API mit öffentlichem
  Client-Schlüssel geprüft: HTTP 200, beide Versionen `2026-10-08`, Pflicht aktiv.

Das Backend ist damit aktiv, das neue Homepage-Frontend bislang nur lokal.
Alte Signup-Clients ohne diesen Zustimmungsvertrag werden nach Trigger-Aktivierung
abgelehnt. Bestehende Login-/Reset-/Account-Nutzung bleibt verfügbar.
Veröffentlichung bleibt ein gesonderter Auftrag; kein Commit/Push/Webexport.

## Bestehende Accounts, Re-Consent und zukünftiges Profil

Bestehende Accounts bekommen keinen erfundenen Eintrag und keine rückdatierte
Zustimmung. Ihre Historie ist vorerst leer. Kein Login-/Profil-/Forum-/Gästebuch-/
Galerie-/Spiel-Gate prüft diese Historie; es gibt keine neue Aussperrung.

Für später: Im Profil „Account / Rechtliches“ eigene akzeptierte Versionen und
Datum aus `get_zh_own_legal_consents()` anzeigen. Bei leerer Historie ehrlich
„Noch keine Zustimmung gespeichert“ statt eines erfundenen Datums. Die aktuelle
Profilseite wurde dafür nicht grundlos umgebaut.

Bei einer wesentlichen neuen Fassung kann später eine gesonderte Own-Consent-RPC
einen **neuen** Eintrag nach erneuter ausdrücklicher Zustimmung anlegen. Besitzer
aus `auth.uid()`, Versionen gegen Serverpolicy und Zeitstempel vom Server; keine
Änderung alter Einträge und kein Auto-Akzeptieren aus Metadaten. Die aktuelle
Tabellen-PK unterstützt das bereits. UI-Hinweis/Ansehen/Akzeptieren und ein
verbindliches Re-Consent-Gate sind jetzt ausdrücklich **nicht aktiviert**.

## Prüfung vor der Freigabe

- Neun SQL-Prüfgruppen in isoliertem PGlite/PostgreSQL **18.3** mit dem bestätigten
  Signup-/Profil-/Inventar-Vertrag als Fixture. Produktiv steht PostgreSQL 17.6;
  die Migration verwendet keine hier nötige PostgreSQL-18-Sonderfunktion.
- Fehlende/falsche Zustimmung und Versionswerte, vollständiger Rollback,
  Account-Zuordnung/Serverdatum, unveränderte Altaccounts und Profilfunktion,
  fehlende direkte Rechte, isolierte Own-RPC, RLS, Metadaten-Manipulation und
  gelöschter Account geprüft. Keine SQL-Ausnahme im gültigen Ablauf.
- Sieben Browser-Prüfgruppen, 42 unterschiedliche DE/EN-Layoutansichten bei
  1440/768/390/360 px: Registrierung, Dokumente, Aliases, Versionsfehler,
  Checkbox/Reload, sofortige Session und zukünftige E-Mail-Bestätigung,
  Backend-Versionswechsel und globaler Footer auf neuen/bestehenden Seiten.
- Login/Profil, Forum-Lesen/Editor-Gate, Gästebuch-/Galerie-Namensbindung,
  Login/Logout, bestehender JS-Handoff an den originalen inerten Spieladapter
  sowie vollständiger Passwort-Reset gezielt gegengeprüft. Kein Godot/Dedicated
  oder echter Game-Build gestartet/geändert.
- Normale JS-/Console-/HTTP-/Request-Fehler **0**, horizontale Überläufe **0**.
  Produktionsfähiges Signup wurde mit aktivem lokalen Backend-Fixture geprüft;
  im tatsächlichen Source bleibt der Freigabeschalter bis zur Genehmigung aus.
- Keine produktiven Testkonten, Beiträge, Besucherregistrierungen oder Mails.
  Produktive Migration und tatsächlicher produktiver Signup-Nachweis bleiben offen.

Nachweise außerhalb des Repositories:
`C:\Users\sebbo\AppData\Local\Temp\zhserver-legal-20261008`:
`sql-report.json`, `report-core.json`, `report-regression.json` und Erhaltungsprüfung.
Screenshots im vorhandenen Visualisierungsordner unter `legal-20261008`.
Frühe Test-Handoff-Erwartungen wurden auf den vorhandenen Dev-Einstieg und den
tatsächlichen SDK-Token korrigiert; die Homepage-/Spiel-Bridge blieb unverändert.

Quellen für Umsetzung und Einordnung:
[BGB § 305](https://www.gesetze-im-internet.de/bgb/__305.html),
[Supabase User Management](https://supabase.com/docs/guides/auth/managing-user-data),
[RLS](https://supabase.com/docs/guides/database/postgres/row-level-security),
[PostgreSQL-Trigger](https://www.postgresql.org/docs/17/trigger-definition.html).

## Prüfung nach der produktiven Aktivierung

- Produktive PostgreSQL-17.6-Funktionen mit temporären Testzeilen innerhalb
  **einer vollständig zurückgerollten Transaktion** geprüft. Keine dauerhaften
  Testaccounts, Profile, Inventare oder Zustimmungseinträge; keine E-Mails.
- Sieben ungültige Zustimmungsvarianten werden atomar abgelehnt, einschließlich
  der bestehenden Profil-/Inventar-Anlage. Gültige Zustimmung erzeugt genau den
  richtigen Accountbezug, serverseitige Fassungen und Serverzeitpunkt.
- Authentifizierte Own-RPC auf zwei getrennte Accounts geprüft; fremdes Schreiben
  und direktes Lesen der Tabelle abgelehnt. Gäste können nur die Policy lesen.
  Fehlende/gelöschte Identität abgelehnt; Metadatenänderung überschreibt keinen
  gespeicherten Nachweis. Altaccount mit leerer Historie bleibt nutzbar.
- Nach Rollback alle elf bisherigen Auth-Accounts, neun Profile und neun Inventare
  erhalten; Identitäts-/Policy-Fingerprints und bestehende Profilfunktion/Trigger
  unverändert. Keine nachträglichen Zustimmungseinträge für Altaccounts.
- Security-Advisors gegen den Bestand verglichen: keine neuen Befunde.
- Sieben Browser-Prüfgruppen erneut mit dem echten aktivierten lokalen Source;
  kein Override von `legal.js`. Zwei echte lesende HTTP-Aufrufe der produktiven
  Policy-RPC, sonst isolierte SDK-/Auth-/Daten-Fixtures. Checkbox, Datenschutz,
  Versionswechsel, Signup mit sofortiger Session und Bestätigung ohne Session,
  Reload und anschließender Login geprüft.
- 42 DE/EN-Ansichten bei 1440/768/390/360 px; Dokumente, Aliases, globale Footer,
  Login/Profil, Forum-Gate, Gästebuch-/Galerie-Identität, Passwort-Reset und
  ursprünglicher inerter Game-Handoff-Adapter funktionieren weiterhin.
- JS-/Console-/HTTP-/Request-Fehler **0**, horizontale Überläufe **0**.
  Kein echter Mailversand oder dauerhafter Signup über Supabase Auth getestet;
  der DB-Registrierungsvertrag wurde direkt produktiv mit Rollback geprüft.
- Erhaltungsprüfung: 723 von 727 vorhandenen Repository-Dateien bytegleich;
  nur `legal.js` und diese drei Checkpoint-/Dokumentationsdateien geändert.
  Keine Datei hinzugefügt/gelöscht, HEAD und Staging unverändert.
  `git diff --check`, JS-Syntax und Whitespace-Prüfung sauber.

Zusätzliche Nachweise im oben genannten Temp-Ordner:
`production-activation.json`, `report-activated.json`,
`activation-baseline.json`, `activation-preservation.json`.

Kein Commit. Kein Push. Kein Webexport. Kein Dedicated-Neustart. Hier STOPP.
