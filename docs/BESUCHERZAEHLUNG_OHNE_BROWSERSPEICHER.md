# Besucherzählung ohne Speicherung im Browser (Plan, Stand 08.11.2026)

Freigabe Sebastian 08.11.2026. Datenbank: `docs/besucherzaehlung_ohne_browserspeicher.sql`,
Rückweg: `docs/besucherzaehlung_ohne_browserspeicher_RUECKWEG.sql`. Als IP-Quelle zählt nur
`cf-connecting-ip`, die der Besucher nicht selbst setzen kann (Schritt 0 im SQL).

## Heute

- `assets/js/visitor-counter.js` legt `zhserver_device_id` (zufällige Kennung) und
  `zhserver_last_visit` im lokalen Speicher ab. Mit der Kennung ruft es
  `register_visitor_period(p_device_id)` auf, die Datenbank speichert je Tag `md5(Kennung)`.
  Den alten Gesamtzähler `register_visitor()` ruft es höchstens einmal in 24 Stunden je Browser.
- `assets/js/forum-views.js` legt `zh_forum_view_browser_v1` an und schickt sie an
  `register_zh_forum_view`. Angemeldete zählen zusätzlich über ihr Konto.
- Ohne lokalen Speicher wird ein Besucher heute gar nicht gezählt.

## Neu

1. Im Browser wird für die Zählung nichts mehr gespeichert, keine Kennung und keine Cookies.
   Die alten Einträge `zhserver_device_id`, `zhserver_last_visit` und `zh_forum_view_browser_v1`
   werden beim nächsten Besuch einmal gelöscht.
2. Jeder Seitenaufruf ruft `register_visitor_today()` ohne Parameter auf. Danach liest die Seite
   die Zahlen wie bisher über `get_visitor_stats()` und `get_visitor_period_stats()`.
3. Die Datenbank bildet aus IP-Adresse, Browserangabe und einem geheimen Tageswert einen
   Einweg-Wert (HMAC-SHA-256). Die IP-Adresse wird dabei nur im Speicher benutzt und nie
   geschrieben. Gespeichert wird nur der Einweg-Wert je Tag in `homepage_visitor_days`.
   Ist er für den Tag neu, erhöht die Datenbank auch den alten Gesamtzähler.
4. Der geheime Tageswert entsteht in der Datenbank zufällig, liegt in einem privaten Schema
   und wird beim ersten Aufruf des nächsten Tages gelöscht. Ab dann lassen sich die Werte
   des Vortags niemandem mehr zuordnen, auch nicht von uns.
5. Forum: Angemeldete zählen wie bisher je Konto einmal in 24 Stunden. Ohne Anmeldung tritt
   der Tageswert an die Stelle der Browserkennung. Fenster älter als 24 Stunden werden gelöscht.
6. Fehlt die IP im Request, wird nicht gezählt. Die Seite zeigt die Zahlen trotzdem.

Reihenfolge beim Umbau: Schritt 0 im SQL prüfen (kommen IP und Browserangabe an, ist
pgcrypto da), SQL ausführen, dann `visitor-counter.js` und `forum-views.js` umstellen und
den Datenschutz-Abschnitt tauschen, nach etwa einer Woche Schritt 4 (alte Schreibwege zu).

## Was sich an den Zahlen ändert

- Besucher ohne lokalen Speicher (strenge Einstellungen, manche privaten Fenster) werden neu
  mitgezählt. Die Zahlen steigen dadurch leicht.
- Wer am selben Tag Netz wechselt (WLAN und Mobilfunk) oder den Browser wechselt, zählt
  zweimal. Auch das erhöht leicht.
- Mehrere Leute mit demselben Browser hinter einer Adresse (Familie, Schule, Mobilfunk mit
  geteilter Adresse) zählen am Tag nur einmal. Das senkt leicht.
- Wer heute seinen Browserspeicher löscht, zählt neu. Das fällt weg.
- Der Gesamtzähler steigt künftig einmal je Kalendertag statt einmal je 24 Stunden.
- Woche und Monat bleiben Summen der Tageswerte, die Rechnung ändert sich nicht.
- Am Tag der Umstellung kann ein Besucher, der vorher schon gezählt war, ein zweites Mal
  zählen. Umstellen am besten kurz nach Mitternacht.
- Forum ohne Anmeldung: Um Mitternacht beginnt ein neuer Tageswert. Wer kurz vor und kurz
  nach Mitternacht dasselbe Thema öffnet, zählt zweimal.

## Neuer Text für den Datenschutz (erst nach dem Umbau einsetzen)

Abschnitt 5, in der Liste entfällt die Zeile
„zufällige Kennungen für die Besucherzählung und die Aufrufzahlen im Forum“.

Abschnitt 6:

> **6. Besucherzählung**
>
> Unten auf jeder Seite zeigen wir, wie viele Besucher es im laufenden Monat und insgesamt
> gab. Damit du am selben Tag nur einmal zählst, bildet unsere Datenbank bei Supabase aus
> deiner IP-Adresse, deinem Browsertyp und einem geheimen Tageswert einen Einwegwert und
> speichert nur diesen. Deine IP-Adresse speichern wir dafür nicht. Der geheime Tageswert
> wird jeden Tag neu erzeugt und am nächsten Tag gelöscht. Danach lässt sich der
> gespeicherte Wert niemandem mehr zuordnen. In deinem Browser wird für die Zählung nichts
> gespeichert.
>
> Genauso zählen wir, wie oft ein Thema im Forum aufgerufen wurde. Bist du angemeldet,
> zählt dein Konto einmal in 24 Stunden.
>
> Rechtsgrundlage ist unser berechtigtes Interesse daran zu sehen, wie die Webseite genutzt
> wird (Art. 6 Abs. 1 lit. f DSGVO).

## Offene Punkte

- Die Funktionen in `docs/` sind der Stand der Entwürfe. Vor dem Ausführen gegen die
  Live-Fassung in Supabase abgleichen.
- Ob Supabase die IP des Besuchers in `cf-connecting-ip` oder `x-forwarded-for` weitergibt,
  klärt Schritt 0. `x-forwarded-for` kann ein Besucher selbst setzen und so höchstens die
  eigene Zählung verfälschen, wie heute durch Löschen des Speichers.
- Andere Einträge im lokalen Speicher (Sprache, Anmeldung, Entwürfe, Stimmen, Likes,
  zwischengespeicherte öffentliche Zahlen) gehören nicht zu diesem Plan.
