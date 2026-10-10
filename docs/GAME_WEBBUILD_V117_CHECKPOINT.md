# Webbuild v117 – Homepage-Kandidat und Produktionsblocker

Stand: 10.10.2026. **Vorhandener v117-Stand zur Veröffentlichung freigegeben.**
Der Nutzer hat den produktiven Dedicated auf `192.168.0.114:7000`, Party-v117-
Kompatibilität, produktives U01/`player-state-persistence`, positiven Endpoint-
Test und 0 Parser-/Runtimefehler bestätigt. Aktueller Auftrag: den bereits
integrierten Stand committen/pushen, Deployment abwarten und anschließend echte
Live-Abnahme durchführen. Keine erneute Integration, kein Webexport und keine
Dedicated-/U01-Änderung. Die folgenden Vorab-Befunde sind zeitlich eingeordnet;
die abschließende Live-Abnahme wird nach der Veröffentlichung dokumentiert.

## Produktions- und Cloudflare-Vorabprüfung – 10.10.2026, 13:00 UTC

Rein lesende Prüfung um 13:00 UTC / 15:00 Berlin:

- Die zuvor fehlenden RPCs `initialize_my_player_state`,
  `save_player_state_server_if_version` und `save_player_position_server` sind
  inzwischen produktiv vorhanden, ebenso `get_my_player_state`. Der gesonderte
  Spiel-Checkpoint `SUPABASE_U01_ROLLOUT.md` dokumentiert den U01-Cutover vom
  10.10.2026. In diesem Homepage-Auftrag keine Migration/Edge angewendet.
- Der zentrale Account besteht mit unveränderter UUID und Anzeigename cHa;
  weiterhin 0 eigene `player_state`-Zeilen. Legacy-Account weiterhin abwesend.
  Keine künstliche Initialisierung oder Gameplay-/Accountdatenänderung vorgenommen.
- `https://www.zhserver.de/game.html` liefert HTTP 200 über Cloudflare. Der
  tatsächliche iframe verweist auf
  `game/survival-v116.html?build=alpha-0-2-2-v116-20260906`, genau wie der letzte
  veröffentlichte Commit. Die lokale Seite verweist weiterhin auf v117.
  Die sichtbare v116-Version ist damit der bisher veröffentlichte Stand;
  kein Nachweis für einen veralteten v116-Cache nach einem v117-Deployment.
- Alle elf `https://www.zhserver.de/game/survival-v117.*`-Dateien liefern aktuell
  HTTP 404; sie sind noch nicht veröffentlicht. Ihre Live-MIME-Typen und
  Live-Packintegrität daher noch nicht abgenommen. v116-HTML/JS/WASM liefern
  HTTP 200 mit `text/html`, `application/javascript` und `application/wasm`.
- Die geprüften 404-Antworten für JS/PNG enthalten teilweise
  `CF-Cache-Status: MISS` und `Cache-Control: max-age=14400`. Nach einer späteren
  Veröffentlichung unbedingt die originalen v117-URLs erneut auf HTTP 200,
  passende MIME-Typen/Bytes und eventuelle gecachte 404 prüfen. Ein erfolgreicher
  lokaler Test ersetzt diese CDN-Abnahme nicht.
- Bestehender öffentlicher WebSocket: **`wss://ws.zhserver.de/ws`**, TLS-Port 443,
  Host `ws.zhserver.de`, Pfad `/ws`. Handshake mit Origin
  `https://www.zhserver.de`: HTTP 101, gültiger `Sec-WebSocket-Accept`, verifiziertes
  Zertifikat und TLS 1.3, Cloudflare-Header vorhanden. Keine Auth-/Game-Nachricht
  gesendet; nur Verbindungsaufbau und regulärer Close. Kein öffentlicher
  `ws://`-/Port-7000-Test. DNS, Proxy und Tunnel unverändert.
- Dieser Transportnachweis bestätigt weder die laufende Dedicated-Version noch
  Party-/Save-Kompatibilität. `LAPTOP_HANDOFF.md` beschreibt den vorbereiteten
  Laptop und den noch getrennt durchzuführenden passenden Dedicated-Start;
  die tatsächliche v117-Laptop-Abnahme ist hier nicht bestätigt. HTTPS-Browser-
  Handoff, echte Session/Lobby, Gameplay und Cache-/CORS-Abnahme bleiben offen.
- Im frischen lokalen Browser-Tab auf Port 5500 ist aktuell keine Anmeldung
  vorhanden. Keine Sitzung von der Live-Domain kopiert und kein Passwort gelesen.

Aktuelle Nachweise außerhalb Git: `cloudflare-readonly-verification.json` und
`backend-readonly-refresh-2026-10-10.json` im unten genannten Nachweisordner.
Die folgenden fehlenden-RPC-Befunde beschreiben die frühere Prüfung vom 09.10.;
sie sind durch die heutige Katalogprüfung überholt, deren echte Game-Abnahme
jedoch noch nicht wiederholt wurde.

## Übernommener Bestand

Quelle ausschließlich lesend:
`C:\Users\sebbo\OneDrive\Dokumente\Spiel\zh-survival\build\account-candidate-v117`.
Handoff: `GAME_ACCOUNT_V117_HANDOFF.md`; Manifest:
`validation/account-final-v117/build-manifest.json` im Spielprojekt.

Alle elf Dateien liegen unverändert unter `game/`; Größe und SHA256 stimmen
einzeln mit dem Manifest überein. Jede Datei ist kleiner als 100 MiB:

- `survival-v117.html`
- `survival-v117.js`
- `survival-v117.wasm`
- `survival-v117.pack-loader.js`
- `survival-v117.pck.part00`
- `survival-v117.pck.part01`
- `survival-v117.audio.worklet.js`
- `survival-v117.audio.position.worklet.js`
- `survival-v117.icon.png`
- `survival-v117.apple-touch-icon.png`
- `survival-v117.png`

Die beiden Packteile ergeben in dieser Reihenfolge 179724972 Bytes und SHA256
`9f2ffeaa6e86272e412aa83cf44e1867713c4a5ed798059d22b536f9f1a42c02`.
Nur im Speicher zusammenhängend geprüft; keine große `.pck` im Homepage-Repo
angelegt. Der vorhandene v116-Bestand wurde nicht überschrieben oder gelöscht.

`.gitattributes` schützt ausschließlich `game/survival-v117.*` vor der lokalen
`core.autocrlf=true`-Umwandlung und erlaubt die originalen CRLF-Zeilenenden.
Für das original generierte HTML wird nur die
Prüfung der vorhandenen Leerzeile am Dateiende ausgenommen; sonstige Whitespace-
Prüfungen bleiben aktiv. Keine Builddatei zum Formatieren verändert.

Einzige funktionale Homepage-Änderung: `game.html`, `#spiel-starten[data-src]`
zeigt auf `game/survival-v117.html?build=account-v117-20261009`.
Wartungsstatus, bisherige `?test`/`?play`-Einstiege, Serverparameter, Steuerung,
Fullscreen, Header, Übersetzungen und Footer bleiben erhalten.

Bestehendes `assets/js/game-auth-bridge.js` / `ZHGameAuth` v1 unverändert.
Kein neuer SDK-Client, eigener Session-Speicher, Nickname-Login oder Legacy-Signup
ergänzt. Allgemeiner Namenseditor bleibt deaktiviert.

## Historische echte Abnahme: fehlender U01-Endpunkt – 09.10.2026

Test gegen den bestehenden lokalen Server `http://127.0.0.1:5500/`, mit echtem
zentralem Adminlogin über das sichtbare Formular und produktivem Supabase.
Passwort und Tokens weder ausgelesen noch in Nachweisen gespeichert.

v117 lädt im bestehenden Same-Origin-iframe einschließlich WASM und beiden
Packteilen bis zur tatsächlichen Godot-Oberfläche. Die Kontoanbindung führt
anschließend in die vorhandene Spielstand-Initialisierung. Sichtbarer Fehler:

> Neuer Spielstand konnte nicht erstellt werden (HTTP 404).

Die dazu passende, mit dem Buildmanifest bytegleich bestätigte Quelle verwendet
`supabase_service.gd:initialize_player_state()` und ruft
`/rest/v1/rpc/initialize_my_player_state` auf. Die rein lesende Prüfung des
produktiven Supabase-Funktionskatalogs bestätigt:

| RPC | Produktiv vorhanden |
| --- | --- |
| `get_my_player_state()` | Ja |
| `initialize_my_player_state(...)` | Nein |
| `save_player_state_server_if_version(...)` | Nein |
| `save_player_position_server(...)` | Nein |

Zentrale Auth-UUID `7ba1fad4-d113-4526-8873-3e3b97e9be7e` besteht unverändert;
Profilname cHa. Für diese UUID existieren weiterhin **0 player_state-Zeilen**.
Der gelöschte Legacyaccount wurde nicht wieder angelegt. Keine Spielstandzeile
künstlich erzeugt, kein Legacy-Savepfad oder Frontend-Fallback eingebaut.

Damit sind spielbereite zentrale Lobby, cHa-Anzeige im Game und vollständige
Auth-/Gameplay-Abnahme derzeit **nicht bestätigt**. Die Homepage allein kann
die fehlende U01-Initialisierung nicht beheben.

## Weitere Rolloutabhängigkeit

Der Game-Handoff warnt ausdrücklich: v117 verlangt passenden
`dedicated_server.gd`-/`account_party.gd`-Code wegen der UUID-Party-RPCs und darf
nicht gegen einen älteren Laptop-Dedicated veröffentlicht werden. Der Nutzer
hat den passenden Laptopstand als **nicht vorhanden / nicht bestätigt** gemeldet.
Die Homepage-Aufgabe erlaubt weder Dedicatedänderungen noch produktives U01.

Der gesonderte SERVER-/ANTI-CHEAT-Auftrag hat U01-Migration/Edge inzwischen
angewendet; nicht erneut ausführen. Passender Dedicated und echte End-to-End-
Abnahme müssen weiterhin getrennt bestätigt werden.
**DEDICATED-NEUSTART AUF LAPTOP ERFORDERLICH** für den passenden gemeinsamen Stand; in dieser Homepage-
Aufgabe kein Neustart.

## Gezielt geprüft

- Elf lokale HTTP-HEAD-Antworten: jeweils 200, erwartete Größen; HTML, JavaScript,
  WASM, Packteile und PNGs mit passenden MIME-Typen.
- Desktop 1440/900, kleiner Desktop 1280/800, Hochformat 390/844: keine horizontalen
  Homepage-Überläufe. Die Game-Lobby ist im schmalen iframe sehr klein; dieser
  gelieferte Client ist im Hochformat noch kein überzeugender Lesbarkeitsnachweis.
- DE/EN der Homepage und EN nach Reload; keine Spielübersetzung hinzugefügt.
- Echte zentrale Anmeldung: Header/Profil cHa, private E-Mail nur im eigenen
  Profil, Namenseditor aus; Accountaufruf führt zum eigenen Profil.
- Admin-Dashboard mit bestehender UUID-Verifikation erreichbar, unveränderte
  Admin-Dateien/-Berechtigungen. Keine Moderationsschreibaktionen ausgeführt.
- Gästebuch und Galerie: eigener Name cHa automatisch und readonly. Forum-
  Entwurfsformular: zentrale Identität cHa, weiterhin nur lokale Entwürfe.
- Startseite, Account/Profil, Admin, Forum, Galerie und Wiki geladen; volle fünf
  Community- und fünf Besucherfelder auf den geprüften öffentlichen Seiten.
- Logout entfernt private Profildaten und die Accountanzeige auch im offenen
  Game-Tab. Ein neuer ausgeloggter Game-Tab zeigt zentrale Anmeldung/Registrierung
  und bestehenden Gast-Einstieg; kein Gastspielserver gestartet.
- Wiederanmeldung bei offenem Game, echter Tokenrefresh und echter Kontowechsel:
  noch keine vollständige spielbereite Abnahme; unveränderte frühere isolierte
  Bridge-Nachweise ersetzen diese Produktionsprüfung nicht.
- Erkennbarer Pack-Inhaltsscan: keine Legacy-Alias-/Passwortgrant-/Signup-Pfade
  oder erkennbaren privilegierten Schlüssel gefunden. Kein pauschaler
  Sicherheitsnachweis für sämtliche komprimierten Packinhalte.
- In den Game-Tabs wurden zusätzlich mehrere MutationObserver-Ausnahmen ohne
  Quell-URL erfasst, auch bei automatischen Live-Server-Reloads nach Dateispeichern.
  Nicht abschließend zugeordnet; nicht als
  bestandener 0-JS-Fehler-Test ausgeben. Keine spekulative i18n-/Clientänderung.

Nachweise außerhalb Git:
`C:\Users\sebbo\.codex\visualizations\2026\09\30\01a0f137-f3f5-7bc0-b080-7b451ea65ff0\game-v117-homepage`.
Keine Secrets, Testfixtures oder die 19 fremden Wiki-Testartefakte einchecken.

## Fortsetzung

Nicht neu exportieren oder erneut von v116 anfangen. Diesen lokalen Kandidaten
und alle fremden Änderungen erhalten. U01 und passender Laptopstand sind jetzt
bestätigt. Der Nutzer hat ausdrücklich die Veröffentlichung vor der folgenden
Live-Abnahme beauftragt. Nur die vorgesehenen Homepage-/v117-Dateien committen,
origin/main pushen und Deployment abwarten. Danach echte zentrale Session/Lobby/
cHa, Reload, Logout, erneuten Login und zweiten Tab prüfen; Refresh/Kontowechsel
nur mit tatsächlich verfügbarem Zugang nachweisen. Offene Browser-Ausnahme
klären und Mobile-Lesbarkeit bewerten. Tatsächlichen v117-iframe und alle elf
Live-Dateien samt MIME/Manifest, ursprüngliche CDN-URLs ohne gecachte 404 und
den echten HTTPS-Browser-Handoff über `wss://ws.zhserver.de/ws` prüfen. Keine
Annahme, dass Cloudflare Port 7000 proxyt; vorhandene Konfiguration erhalten.

**Aktuelle Phase: freigegebener Commit/Push, Deployment und echte Live-Abnahme.
Danach Abschlussbericht und STOPP. Kein neuer Export, kein Servereingriff.**
