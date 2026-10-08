# Homepage → Godot: zentraler Auth-Handoff V1

Stand: 08.10.2026. **Nur lokal vorbereitet; kein Commit, Push oder Webexport.**
Die Homepage stellt einen Session-/Token-Kandidaten bereit. Erst der Spielclient
und unabhängig davon der Dedicated bestätigen ihn über Supabase Auth. Diese
Datei beschreibt die Homepage-Seite und den tatsächlich gelesenen Spieladapter;
sie ersetzt keine gemeinsame End-to-End-Abnahme.

## Bestehende Anmeldung und Einbindung

- `game.html` verwendet weiterhin den vorhandenen Supabase-JS-v2-Client für die
  Abstimmung. Er wird jetzt als `window.zhSupabaseClient` weiterverwendet, auch
  vom globalen Footer. `assets/js/game-auth-bridge.js` lädt danach genau einmal.
  Die Bridge erzeugt **keinen** zusätzlichen Supabase-Client.
- `auth.getSession()` liest/erneuert die bestehende SDK-Session. Persistenz und
  Refresh übernimmt ausschließlich das SDK. Der vorhandene Default-Speicher
  heißt `sb-yawadxzeyyrozmlrokun-auth-token`; die Bridge liest oder schreibt
  diesen Speicher nicht selbst. Keine zusätzliche Tokenkopie in LocalStorage,
  SessionStorage, URL, DOM, Logs oder `window.name`.
- `/admin/` benutzt dasselbe Supabase-Projekt und denselben SDK-Speicher. Bei
  identischem Origin gilt eine dortige Anmeldung auch für die Gamepage.
  `www.zhserver.de`, `zhserver.de` und ein lokaler HTTP-Server haben getrennte
  Origins/Speicher. Getestet wird über HTTP, nicht `file://`.
- Aktuelles iframe: `#spiel-starten`, gleiche Origin, `game/survival-v116.html`.
  `play.html` leitet wie bisher zur Gamepage weiter. Wartungsstatus, Builddateien,
  bestehende Testparameter und CTAs bleiben unverändert.

## JS-Schnittstelle auf dem Parent-Fenster

`window.ZHGameAuth` ist ein unveränderliches Objekt mit `version: 1`:

| Methode/Feld | Vertrag |
| --- | --- |
| `getSnapshot()` | Synchroner, unveränderlicher letzter Zustand. Prüft auch bei gedrosselten Hintergrundtimern die Ablaufzeit. |
| `getSession()` | Promise auf den aktuellen Zustand nach `client.auth.getSession()`. Parallele Abfragen werden zusammengefasst. |
| `getAccessToken()` | Promise auf den aktuellen Access-Token oder `""`. Kein Refresh-Token. |
| `poll()` | Synchroner JSON-String mit `version`, `revision`, `status`, `auth_status`, `reason`, `access_token` (oder `""`), `expires_at` (oder null). Für `JavaScriptBridge.eval(..., true)`. |
| `loginUrl` | Feste zentrale Anmeldung auf derselben Origin: `/account/`. Der bestehende `/admin/`-Login bleibt erhalten und nutzt dieselbe Session. |
| `openLogin(mode = 'login')` | Direkt aus einem Benutzerklick aufrufen. Öffnet `/account/` in einem neuen Tab mit `noopener`; mit `mode = 'register'` die Registrierungsansicht `/account/?mode=register`. Der Spieltab bleibt offen. Ergebnis `{status, url}`, kein Credential. |

Snapshot-/Promise-Antwort:

```js
{
  version: 1,
  revision: 1,
  status: 'signed_in',
  auth_status: 'authenticated',
  reason: 'session_available',
  session: { access_token: '<Bearer-Kandidat>', expires_at: 1790000000 }
}
```

`expires_at` ist Unixzeit in Sekunden. Keine zusätzlichen Felder wie User-ID,
E-Mail, Metadaten, Rollen, Profilname oder Refresh-Token in Bridge-Antworten.
Der JWT selbst ist ein sensibles Bearer-Credential und kann Claims enthalten;
er gehört weder in sichtbare UI noch in Protokolle.

| `status` | `auth_status` | Bedeutung / Token |
| --- | --- | --- |
| `checking` | `checking` | Erste SDK-Abfrage läuft; kein Token. Nicht als Login oder Gastfreigabe behandeln. |
| `signed_in` | `authenticated` | Strukturell plausibler, laut SDK noch nicht abgelaufener Session-Kandidat. **Keine** serverbestätigte Account-/Spielberechtigung. |
| `signed_out` | `guest` | Keine Session / Logout; `session: null`. Das Spiel entscheidet über Anmeldung oder Gastmodus. |
| `signed_out` | `unauthenticated` | Abgelaufene, fehlerhaft strukturierte oder anonyme Session; kein Token. |
| `unavailable` | `unavailable` | SDK-/Speicher-/Refresh-Abfrage fehlgeschlagen; kein Token. Fehler nicht als gültige Anmeldung behandeln. |

`reason` ist ein kleiner technischer Statuscode, kein Authfehlertext mit
personenbezogenen Daten. `revision` steigt bei Zustandsänderungen. Auf dem
Parent wird `zhserver:game-auth-change` als CustomEvent ausgelöst. `event.detail`
enthält nur Version, Revision, Status, Authstatus und Reason; **keinen Token**.
Nach einer Meldung den Zustand neu abfragen. Es gibt keinen neuen periodischen
Auth-Heartbeat: das SDK steuert den Refresh, die Bridge verwirft Tokens zum
Ablauf und liest bei Fokus/Pageshow/Storage-/Sichtbarkeitswechsel erneut.

Beispiel für einen späteren Spielaufruf innerhalb des gleich-originären iframe:

```js
const stateJson = window.parent.ZHGameAuth.poll(); // synchron, für Godot eval
// Direkt im Klickhandler, ohne vorheriges await:
window.parent.ZHGameAuth.openLogin();
// Bei ausdrücklichem Registrierungswunsch, ebenfalls direkt im Klickhandler:
window.parent.ZHGameAuth.openLogin('register');
```

## Kompatibilität mit dem vorhandenen Spieladapter

Read-only geprüft: `game_account_session.gd`, `WEB_BRIDGE_SOURCE`.

1. Der bestehende Adapter entdeckt `parent.ZHIdentity?.client` oder
   `parent.zhSupabaseClient` und verwendet dessen `auth.getSession()` und
   `onAuthStateChange`. Auf der Gamepage steht nun genau der bereits vorhandene
   SDK-Client bereit. Der Adapter übernimmt daraus ausschließlich `access_token`.
   Das SDK bleibt Eigentümer der Session/Refresh-Credentials.
2. Godot liest seinen vorhandenen `window.__zhGameAccountBridgeV1.poll()`-String:
   `signed_in` + Token, `signed_out`, `checking` oder `unavailable`. Es bestätigt
   den Token selbst und schickt ihn anschließend an den Dedicated. Keine ID aus
   `session.user` als Autorität übernehmen.
3. Falls der Adapter den Parent-Client nicht findet, bedient die Homepage seinen
   bereits vorgesehenen Request, ohne neues Spiel-/Build-JS zu injizieren:

```js
// Child → Parent; Request-ID = 16 Zufallsbytes als 32 kleine Hexzeichen
{ type: 'zhserver.game.auth.request', version: 1, request_id: '<32 hex>' }

// Parent → genau dieses Child, mit exakt der Parent-Origin als targetOrigin
{ type: 'zhserver.game.auth.session', version: 1, request_id: '<same id>',
  revision: 1, status: 'signed_in', auth_status: 'authenticated',
  reason: 'session_available',
  session: { access_token: '<Bearer-Kandidat>', expires_at: 1790000000 } }
```

Bei fehlender Session ist `session: null`. Vor und nach der asynchronen Abfrage
werden Origin und `event.source === #spiel-starten.contentWindow` geprüft. Nur
das konfigurierte gleich-originäre `/game/`-iframe wird bedient. Fremde Windows,
Origins, Versionen und Request-IDs erhalten keine Antwort. Niemals `'*'` verwenden.
Änderungsmeldung zum iframe: `zhserver.game.auth.changed` mit den tokenfreien
Eventfeldern. Der aktuelle Spieladapter nutzt dafür primär sein SDK-Abonnement;
sein Message-Fallback fragt spätestens beim nächsten 5-Sekunden-Poll erneut ab.
Er erwartet bei Requests höchstens vier Sekunden; Netzwerkfehler können deshalb
vorübergehend `unavailable` bedeuten.

## Session-Lebenszyklus und Sicherheitsgrenzen

- Login / Accountwechsel / Tokenrefresh / Logout kommen über das vorhandene
  SDK-Abonnement, auch zwischen Tabs. Der Callback bleibt synchron und ruft
  keine weitere Auth-Methode unter dem SDK-Lock auf. Veraltete Abfragen dürfen
  nach einer Sessionänderung den alten Zustand nicht wiederherstellen.
- Refresh bleibt beim SDK; `TOKEN_REFRESHED` ersetzt den Token. Kein manuelles
  Refresh-Token-Handling in Homepage oder Godot-Bridge. Bei Ablauf liefert die
  zusätzliche Bridge keinen alten Token, auch wenn Browser-Timer pausierten.
  Bei einem definitiven SDK-Sessionverlust meldet sie Logout. Der Dedicated
  entscheidet selbst über harte Deadline, Recheck und den neuen Token.
- Accountwechsel ist keine Umbenennung eines laufenden Spielers. Der Dedicated
  akzeptiert einen Refresh nur für dieselbe bestätigte Identität; ein neuer
  Account benötigt den vorgesehenen neuen verifizierten Spieljoin.
- Keine Session erzeugt keinen Gastaccount und keinen Gästesave. Die Homepage
  setzt weder die 10-Minuten-Frist noch Rechte für Basis/Lager/Fahrzeuge/Saves.
- Anzeigenamen sind optional für diese Transportphase. Ein fehlendes Profil
  verhindert den Token-Handoff nicht; das Spiel/Dedicated prüfen ihre eigene
  Profilanforderung. Für spätere Homepage-Anzeige ausschließlich den vorhandenen
  `get_zh_own_identity()`-/`ZHIdentity`-Weg nutzen, niemals E-Mail/Metadaten.
- Same-Origin-JS ist eine gemeinsame Vertrauenszone: der bestehende SDK-Client
  und dessen Speicher sind für vertrauenswürdiges Homepage-/Spiel-JS zugänglich.
  Die schmale Message-Antwort überträgt nur den Access-Token, schafft aber keinen
  zusätzlichen Schutz gegen eine bereits vorhandene Same-Origin-XSS.
- Browserwerte inklusive `authenticated`, Ablaufzeit, Profilname und User-ID
  sind **keine** Authautorität. Godot und Dedicated verifizieren den JWT jeweils
  unabhängig bei Supabase. Kein Service-Role-Key oder neues Backend beteiligt.

## Anmeldung und verbleibende Grenzen vor End-to-End

`openLogin()` liefert `user_action_required`, wenn kein unmittelbarer
Benutzerklick vorliegt, andernfalls `requested`. `noopener` gibt keinen
verlässlichen Fensterhandle zurück; Popupblocker können einen normalen Link
auf `loginUrl` mit `target="_blank" rel="noopener"` erfordern. Nie automatisch
den laufenden Spieltab zur Anmeldung umleiten oder Tokens in URLs übergeben.

Die zentrale Homepage-Oberfläche unter `/account/` bietet jetzt Login und
Registrierung über denselben Supabase-Client und dieselben Accounts wie der
unveränderte `/admin/`-Dialog. Es gibt keinen zusätzlichen Session-Speicher.
Die Registrierung verwendet den vorhandenen Signup-Trigger für `profiles`;
`display_name` wird anschließend über die bestätigte Own-Identity-RPC gelesen.
Bei erforderlicher E-Mail-Bestätigung bleibt die Oberfläche bis zum gültigen
Login abgemeldet. Details: `ACCOUNT_CHECKPOINT.md`. Nach Login geht der neue
Tab zum eigenen Profil; die bereits offene Gamepage empfängt die SDK-Änderung.

Die Bridge erkennt eine Anmeldung ohne Reload. Im gelesenen Spieladapter ruft
`end_session()` jedoch `stop()` auf und beendet sein Abonnement. Ob die Lobby
nach Logout/Accountwechsel den Sessionhelfer wieder initialisiert, muss der
Spielagent im echten Webclient prüfen. Die Homepage startet kein Gameplay neu.

Der vorhandene v116-Webbuild wurde nicht ersetzt und ist kein Nachweis für die
aktuelle Account-/Gast-Godot-Version. Nächste gemeinsame Abnahme: passender lokal
gebauter Webclient im selben Origin mit zentralem Login, Reload, zweitem Tab,
Tokenrefresh, Logout/erneutem Login und Accountwechsel; anschließend unabhängige
Dedicated-Prüfung inklusive Gastdeadline, Savegrenzen und U01/F01. Dafür keinen
Produktivrollout, Webexport oder Laptop-Neustart aus diesem Auftrag ableiten.

## Lokale Abnahme dieser Homepage-Phase

- 15 gezielte Prüfgruppen bestanden: Gast, bestehende Session, zentraler Login
  im neuen Tab bei laufender Gamepage, zweiter Tab, Reload, Refresh, Accountwechsel,
  Logout, SDK- und Message-Pfad des unverändert gelesenen Spieladapters,
  abgesicherte Message-Quelle, abgelaufene Session und beschädigter SDK-Speicher.
- Isolierter Chrome mit echtem Supabase-JS-SDK. Auth-/REST-/Tracking-Anfragen
  vollständig abgefangen; nur lokale Fixture-Credentials. Keine produktiven
  Accounts, Gästesessions, Besucher-, Presence- oder Inhaltsdaten erzeugt.
  Der genaue `WEB_BRIDGE_SOURCE` aus `game_account_session.gd` lief als JS im
  inerten gleich-originären iframe; **kein** Godot-Engine-/Dedicated-Test.
- Zusätzliche VM-Prüfung: parallele Abfragen zusammengefasst, verzögerte Antwort
  nach Logout verworfen, Ablauf trotz gedrosseltem Timer, defekter/fehlender SDK,
  Speicherzugriffsfehler, fehlerhafte Credentials und null Message-Quelle.
- DE/EN bei 1440, 768, 390 und 360 px; Sprachwahl nach Reload, mobiles Menü,
  voller Footer mit fünf Community- und fünf Besucherfeldern. Screenshots von
  Desktop/Tablet/Mobile gesichtet; horizontale Überläufe 0.
- Normalbetrieb: JS-/Console-/HTTP-/Request-Fehler jeweils 0. Ein absichtlich
  abgewiesener Refresh wurde separat als HTTP 401 simuliert: erwartete einzelne
  401-Netzwerk-/Console-Meldung, JS-Ausnahmen 0 und kein veralteter Token danach.
  Dieser Fehlerfall ist kein HTTP-Fehler aus einem produktiven Test.
- JS-Syntax einschließlich bestehendem Gamepage-Inlinecode und
  `git diff --check` geprüft. Kein Gameparser erneut gestartet, da keine
  GDScripts, Spiel-/Builddateien oder deren Backend geändert wurden.
- Nachweise außerhalb des Repositories:
  `C:\Users\sebbo\AppData\Local\Temp\zhserver-game-handoff-20261008`
  (`baseline.json`, `check.cjs`, `report.json`, `preservation.json`).
  Screenshots im bisherigen Visualisierungsordner, Unterordner
  `game-handoff-20261008`. Gemeinsame reale End-to-End-Abnahme weiterhin offen.

Technische Grundlagen: [Supabase Session](https://supabase.com/docs/reference/javascript/auth-getsession),
[Auth-Ereignisse](https://supabase.com/docs/reference/javascript/auth-onauthstatechange),
[Godot JavaScriptBridge](https://docs.godotengine.org/en/stable/classes/class_javascriptbridge.html).
