# ZHServer – Passwort-Reset über bestehendes Supabase Auth

Stand: 08.10.2026. Lokal umgesetzt und geprüft, noch nicht veröffentlicht.

## Vorhandene Grundlage und Grenzen

- Bestehendes Supabase-Projekt `yawadxzeyyrozmlrokun`, derselbe zentrale
  `window.zhSupabaseClient` und dieselben Accounts wie unter `/admin/`.
- Bestehender SDK-Session-Speicher
  `sb-yawadxzeyyrozmlrokun-auth-token`; kein zweiter Auth-Client oder Recovery-
  Speicher. Profile, Rollen, Adminzugang und Backendregeln bleiben erhalten.
- `CNAME` enthält `www.zhserver.de`. Die aktuellen Dashboardwerte für Site URL,
  Redirect-Allowlist, SMTP-Aktivierung und Passwortänderungs-Benachrichtigung
  konnten hier **nicht bestätigt werden**. Der Dashboard-Browser scheitert am
  lokalen Sandboxfehler `apply deny-read ACLs`; der vorhandene Connector bietet
  keinen gezielten lesenden Zugriff auf diese Auth-Einstellungen. Keine
  komplette Auth-Konfiguration abgerufen, die SMTP-Secrets enthalten könnte.
- Kein SMTP-Passwort abgefragt, gelesen, gespeichert oder geloggt. Keine
  produktiven Reset-Mails, Passwortänderungen oder Auth-Einstellungen ausgeführt.

## Vom Nutzer im Supabase-Dashboard zu konfigurieren

Custom SMTP nach dem vom Nutzer genannten STRATO-Stand:

| Einstellung | Wert |
| --- | --- |
| Host | `smtp.strato.de` |
| Port | `465` |
| User | `no-reply@zhserver.de` |
| Sender-Name | `ZHServer` |
| Sender-Adresse | `no-reply@zhserver.de` |

Das SMTP-Passwort ausschließlich vom Nutzer im Dashboard eingeben. Es gehört
nicht in Repository, Frontend, Shellbefehle, Chat oder Logs.

Unter **Authentication → URL Configuration** den Bestand erhalten und prüfen:

- Kanonische Homepage laut `CNAME`: `https://www.zhserver.de`.
  Dies ist der passende Site-URL-Zielwert; der tatsächlich gespeicherte Wert
  ist hier unbestätigt. Bestehende Rücksprünge nicht ungeprüft ersetzen.
- Für Recovery die **exakte** Redirect URL erlauben:
  `https://www.zhserver.de/account/reset-password/`.
- Falls `https://zhserver.de` zusätzlich als eigenständiger Ursprung genutzt
  wird, auch `https://zhserver.de/account/reset-password/` erlauben. Das
  Frontend baut den Rücksprung aus seinem eigenen Ursprung/Installationspfad;
  es überträgt keine Sessions zwischen `www` und der Domain ohne `www`.
- Für einen echten lokalen Mailtest optional nur den tatsächlich verwendeten
  lokalen Callback freigeben, beispielsweise
  `http://127.0.0.1:8000/account/reset-password/`. Die hier erfolgten Browsertests
  benötigen keine Dashboardfreigabe, da ihre Auth-Aufrufe abgefangen wurden.
- Bestehende Redirects für Anmeldung, Bestätigung, Admin und Spiel erhalten.
  Kein pauschales produktives Wildcard-Muster hinzufügen.

Die Seite liegt physisch in `account/reset-password/index.html`. Der öffentliche
Callback verwendet die Verzeichnis-URL mit abschließendem `/`.

## E-Mail-Templates und Passwort-geändert-Benachrichtigung

Das **Reset Password**-Template muss den Supabase-Verifizierungslink
`{{ .ConfirmationURL }}` verwenden. Dieser prüft den Recovery-Token und führt
anschließend zum übergebenen `redirectTo`. Ein Link nur auf die nackte HTML-Seite
erzeugt keine bestätigte Recovery-Session. Falls das bestehende Template nur
`{{ .SiteURL }}` für den Rücksprung verwendet, mit dem vorgesehenen Recovery-
Callback abgleichen; keinen gültigen Bestätigungslink durch eine reine URL ersetzen.

Die **Password changed**-Sicherheitsbenachrichtigung im Dashboard prüfen und
gegebenenfalls aktivieren. Supabase kann sie nach erfolgreicher Änderung über
Custom SMTP versenden. Die Homepage versendet dafür keine zweite Nachricht und
speichert keine Mail-Zugangsdaten. Ihr aktueller Aktivierungsstatus ist
unbestätigt; Frontend-Erfolg allein bestätigt keine Mailzustellung.

Offizielle Quellen:

- [Reset password](https://supabase.com/docs/reference/javascript/auth-resetpasswordforemail)
- [Password Auth](https://supabase.com/docs/guides/auth/passwords)
- [Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)
- [Custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp)
- [E-Mail-Templates und Sicherheitsbenachrichtigungen](https://supabase.com/docs/guides/auth/auth-email-templates)

## Implementierter Ablauf

1. `/account/` enthält „Passwort vergessen?“; `?mode=forgot` zeigt nur das
   E-Mail-Feld. Die bestehende Anmeldung und Registrierung bleiben vorhanden.
2. `resetPasswordForEmail(email, { redirectTo })` verwendet den vorhandenen
   zentralen Client. Bekannte und unbekannte gültige E-Mail-Adressen bekommen
   denselben neutralen Hinweis:
   „Falls ein Account zu dieser E-Mail-Adresse existiert, wurde ein Link versendet.“
   Systemfehler erscheinen ohne rohe API-Meldung oder Aussage zur Kontenexistenz.
3. Supabase verifiziert den E-Mail-Link und leitet auf `/account/reset-password/`.
   Das vorhandene JavaScript-SDK nutzt weiter seinen bisherigen impliziten
   Browserflow; keine Umstellung anderer Loginwege auf einen neuen Flow.
4. Der neue UI-Baustein registriert seinen synchronen Auth-Listener direkt nach
   Bereitstellung des gemeinsamen Clients, vor Abschluss der URL-Initialisierung.
   Erst `PASSWORD_RECOVERY` aus einem Recovery-Callback plus bestätigte aktuelle
   Session (`getSession()` und `getUser()`) schalten das Formular frei.
   Eine gewöhnliche gespeicherte Anmeldung allein genügt dafür nicht.
5. Zwei neue Passwortfelder, Mindestlänge wie bisher und Prüfung der Wiederholung.
   Vor `updateUser({ password })` wird die aktuelle Identität nochmals bestätigt.
   Wechsel/Logout des Accounts sperrt den Reset; Passwortregeln des Backends
   werden zusätzlich verständlich behandelt.
6. `USER_UPDATED` begleitet die erfolgreiche Änderung. Die Felder werden geleert
   und die Recovery-Session mit `signOut({ scope: 'local' })` beendet. Anschließend
   Erfolgsmeldung und Link zur bestehenden Anmeldung mit dem neuen Passwort.
   Die UI behauptet damit keine Abmeldung sämtlicher anderer Geräte.
7. Scheitert nur diese Abmeldung, wird die schon erfolgreiche Passwortänderung
   ausdrücklich angezeigt. Ein Retry beendet die Anmeldung und wiederholt die
   Passwortänderung nicht.

Ungültige/abgelaufene Links, fehlende Session, gewöhnliche Loginlinks und
Sessionwechsel führen zu einem gesperrten Formular mit neuem Link-Anfordern.
Das geprüfte SDK übersetzt `session_not_found` in `AuthSessionMissingError`
ohne API-Code; beide Formen sowie 401 und relevante Ablaufcodes werden behandelt.
Recovery-Credentials und rohe Linkfehler werden nach Prüfung per `replaceState`
aus der aktuellen URL entfernt. Die Reset-Seite setzt `no-referrer`.

Es wird kein zusätzlicher Recovery-Status gespeichert. Nach einem Reload der
bereits bereinigten Reset-Seite wird daher ein neuer Link benötigt; die Seite
schaltet keine beliebige vorhandene Anmeldung als Reset frei. Am Seitenende
wird `password-reset.js` vor dem gemeinsamen `account.js` geladen. Die
vorhandenen globalen Header-/Footer-/DE/EN-Bausteine bleiben identisch.

## SDK und Prüfnachweise

Der bestehende CDN-Pfad `@supabase/supabase-js@2` ist nicht fest gepinnt.
Am 08.10.2026 wurde der tatsächlich ausgelieferte UMD-Build **2.117.2** für die
Browserprüfung verwendet und mit seinem offiziellen Auth-Quellcode abgeglichen.
Geprüfte Events: `PASSWORD_RECOVERY`, `INITIAL_SESSION`, `USER_UPDATED`,
`SIGNED_OUT`; auch `SIGNED_IN` und `TOKEN_REFRESHED` werden im Reset überwacht.
Asynchrone Sessionabfragen laufen außerhalb des synchronen Auth-Callbacks.

- Normale Browserprüfung: Forgot-Link, identische Antwort für bekannt/unbekannt,
  exakter Redirect, gültiger Recovery-Callback, Passwortwiederholung, Änderung,
  erneute Anmeldung zum eigenen Profil, ungültige/abgelaufene Links auch mit
  vorhandener Anmeldung, Accountwechsel und bestehende Registrierung.
- Vier absichtlich injizierte Fehler: `weak_password` (422), `same_password`
  (422), `session_not_found` (401), fehlgeschlagene Abmeldung (500). Die Fehler
  werden erwartet und getrennt ausgewertet; keine JS-Ausnahmen. Abmeldungsretry
  ohne zweite Passwortänderung.
- 22 DE/EN-Ansichten bei 1440/768/390/360 px, davon die acht Ansichten des neuen
  Passwortformulars nach finaler Abstandskorrektur nochmals geprüft. Je genau
  ein gemeinsamer Auth-Client und Besucher-Script, vollständiger globaler Footer
  mit fünf Community- und fünf Besucherfeldern sowie Rechtslinks.
- Normalbetrieb: JS-, Console-, HTTP- und Request-Fehler **0**, horizontale
  Überläufe **0**. Screenshots von Desktop und Mobile gesichtet.
- Testbackend vollständig abgefangen. Kein echtes Testkonto, keine produktive
  Passwortänderung, Mail oder zusätzliche Besucherregistrierung erzeugt.

Nachweise außerhalb des Repositories:
`C:\Users\sebbo\AppData\Local\Temp\zhserver-password-reset-20261008`.
`report-normal.json` enthält die sechs erfolgreichen normalen Prüfgruppen und
die danach zunächst fehlgeschlagene Fehlerklassifikation; die korrigierten
Fehlerfälle sind in `report-faults.json`, die finale Darstellung in
`report-layout.json` erfolgreich separat geprüft. Screenshots im bestehenden
Visualisierungsordner unter `password-reset-20261008`.

## Noch vor produktiver Abnahme offen

1. Tatsächliche Dashboardwerte für Site URL, genaue erlaubte Callback-URL,
   STRATO-SMTP und Reset-/Passwort-geändert-Templates prüfen. Geheime SMTP-
   Eingabe ausschließlich durch den Nutzer.
2. Erst nach ausdrücklicher Veröffentlichung einen echten Mailtest mit eigenem
   Account abnehmen: Versand/Zustellung, Link, Passwortänderung, erneuter Login
   und Passwort-geändert-Benachrichtigung. Lokale Fixtures bestätigen keine
   STRATO-Zustellung oder produktive URL-Freigabe.

Kein Commit. Kein Push. Kein Webexport. Keine Backend-/Wiki-/Build-/Spieländerung.
