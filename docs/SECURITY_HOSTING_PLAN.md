# Hosting-/CSP-Härtung – nur Vorbereitung

Keine Konfiguration angewendet. Gemessen am 15.10.2026 auf elf Routen; tatsächliche Header siehe SECURITY_TEST_RESULTS.json. GitHub Pages wird bereits hinter Cloudflare verwendet. Die bestehenden DNS-/Proxy-/Tunnel-/WebSocket-Einstellungen bleiben unverändert.

## Beobachteter Ressourcenbestand

- Scripts: eigener Origin, jsDelivr Supabase 2.118.0 (lokal nun SRI), eigener Godot-Loader/WASM.
- Styles: eigener Origin, cdnjs Font Awesome 6.7.2; bestehende Inline-Styles und programmatisch gesetzte CSS-Variablen.
- Fonts: fonts.googleapis.com / fonts.gstatic.com und Font-Awesome-Fonts von cdnjs.
- Images: eigener Origin, bestehender Supabase-Storage-Origin; Avatar-Canvas/Dateivorschau kann blob/data benötigen. Kein freies Usercontent-HTML.
- Connect: eigener Origin, `https://yawadxzeyyrozmlrokun.supabase.co`, gegebenenfalls SDK-Realtime `wss://yawadxzeyyrozmlrokun.supabase.co`, Spiel `wss://ws.zhserver.de`.
- Frames: eigenes Gameframe. Worker/WASM müssen mit dem echten Export getestet werden; kein pauschales COEP require-corp.
- Die Homepage hat Legacy-Inline-Scripts/Events, vor allem alte Adminseiten und der Godot-Export. Eine strenge script-src ohne weitere Vorarbeit würde diese blockieren.

## Reihenfolge für spätere Freigabe

1. Im bestehenden Cloudflare-Weg als Response-Headers setzen: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`. Audioausgabe/Fullscreen weiter prüfen. Reset-Seite hat bereits zusätzlich `meta referrer=no-referrer`.
2. `frame-ancestors 'self'` über echten CSP-Header und passend `X-Frame-Options: SAMEORIGIN`; eigenes Gameframe bleibt erlaubt. CSP frame-ancestors wirkt nicht als HTML-meta-Ersatz.
3. HSTS nach Bestätigung aller betroffenen HTTPS-Ziele zunächst ohne includeSubDomains/preload. Diese beiden Optionen nicht blind auf die Domainfamilie ausrollen.
4. Zunächst CSP **Report-Only**, Meldungen aus DevTools bzw. später einem separat gewählten datenschutzbewussten Reportziel prüfen. Ohne konfigurierten Collector werden Reports nicht zentral gespeichert.
5. Erst nach Desktop/Mobile/Auth/Reset/GAME/WASM-/WSS-Abnahme schrittweise erzwingen; Inline-Scripts mit Hashes/ausgelagerten Dateien ersetzen. Kein `unsafe-eval` pauschal hinzufügen, um Fehler wegzudrücken. Für WebAssembly moderne `wasm-unsafe-eval`-Unterstützung und tatsächlichen Enginebedarf testen.

Ausgangspunkt, noch **nicht** als vollständige funktional bestätigte Policy freigegeben:

```text
Content-Security-Policy-Report-Only:
  default-src 'self';
  base-uri 'self';
  object-src 'none';
  frame-ancestors 'self';
  form-action 'self';
  script-src 'self' https://cdn.jsdelivr.net 'wasm-unsafe-eval';
  style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com;
  font-src 'self' https://cdnjs.cloudflare.com https://fonts.gstatic.com;
  img-src 'self' https://yawadxzeyyrozmlrokun.supabase.co data: blob:;
  connect-src 'self' https://yawadxzeyyrozmlrokun.supabase.co wss://yawadxzeyyrozmlrokun.supabase.co wss://ws.zhserver.de;
  frame-src 'self';
  worker-src 'self' blob:;
  media-src 'self' blob:;
```

Der Header muss als eine gültige Headerzeile konfiguriert werden. Fehlende Script-Hashes erzeugen an bekannten Inline-Stellen zunächst beabsichtigte Report-Only-Meldungen; nicht unverändert als Enforcement übernehmen. `upgrade-insecure-requests` und COOP/COEP sind keine Ersatzlösung für bekannte legitime Ressourcen-/Popup-/WASM-Abhängigkeiten.

## Nicht öffentliche Projektdokumente aus dem Site-Artefakt halten

Kein bestehender Build wurde geändert. Das Repo besitzt derzeit weder eigene Actions-Workflowdateien noch `_config.yml`/`.nojekyll` im geprüften Root. Den tatsächlich konfigurierten Pages-Publishweg vor einer Anpassung nochmals lesen. Für einen Jekyll-Branchbuild wäre z.B. `exclude: [docs, tools, AGENTS.md, test.html]` in `_config.yml` geeignet; für einen Artefakt-Workflow muss die Kopierliste geändert werden. Ein statisches `_headers`-File allein setzt bei GitHub Pages keine beliebigen HTTP-Header.

Danach reale URLs der ausgeschlossenen SQL/Tests über Cloudflare auf 404 prüfen und alte Cacheeinträge gezielt behandeln. Keine internen Dateien als Ersatz öffentlich verlinken. Ein Pages-Ausschluss entfernt weder öffentliches Git-History noch bestehende Kopien. Aktive HTML-/JS-Pfade vorher auf benötigte docs/tools-Verweise prüfen; gefundene Kommentarverweise sind kein Laufzeitbedarf.

Primärquellen: [GitHub Pages/Jekyll-Konfiguration](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll), [Cloudflare Response Header Transform Rules](https://developers.cloudflare.com/rules/transform/response-header-modification/), [CSP frame-ancestors](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors).
