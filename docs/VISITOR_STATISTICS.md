# Besucherstatistik: persistente Tageswerte und Aktivierung

## Stand und Ursache

Die Homepage verwendet das bestehende Supabase-Projekt `yawadxzeyyrozmlrokun` und
`assets/js/visitor-counter.js`. Die öffentliche **Leseprüfung am 03.10.2026** ergab:

- `get_visitor_stats()`: HTTP 200, Gesamtwert **203843**, Tageswert **1**, Datum **2026-10-03**.
- `get_visitor_period_stats()`: HTTP 404 / `PGRST202`: Die Funktion ist im öffentlichen
  PostgREST-Schema-Cache nicht vorhanden.
- Zu diesem Zeitpunkt war die frühere Perioden-Migration nur als Datei vorbereitet.
  Die damalige Legacy-Antwort enthielt nur Gesamtwert und aktuellen Tag, keine Historie.

**Aktivierung am 03.10.2026:** Der Projektinhaber hat die korrigierte Migration erfolgreich
im bestehenden Supabase-Projekt ausgeführt. Die anschließende öffentliche Leseprüfung
bestätigt HTTP **200** für `get_visitor_stats()` und `get_visitor_period_stats()`:
Gesamtwert **203844**, Heute **2**, Gestern `null`, Woche **2**, Monat **2**.
`tracking_started_at` ist **2026-10-03T07:05:32.31498+00:00**, entsprechend
**03.10.2026, 09:05:32 Uhr Europe/Berlin**. Woche/Monat sind zunächst tatsächlich erfasste
Teilsummen; ihre Vollständigkeitsflags bleiben korrekt `false`.

Es wurden dabei keine Besucher registriert. Mit dem öffentlichen Browser-Schlüssel lassen
sich die Definitionen der alten RPCs und ihre internen Tabellen nicht administrativ lesen.
Die genaue interne Rücksetzung des alten Tageszählers wurde deshalb **nicht** als geprüft
bestätigt. `visitor_stats_inspect.sql` ermöglicht diese zusätzliche, rein lesende Prüfung
im SQL Editor. Die neue Migration benötigt nur den bereits geprüften Rückgabevertrag von
`get_visitor_stats()`; seine Tabellen und beide alten Funktionen werden nicht verändert.

## Aktivierung durch den Projektinhaber

Die Migration wurde **vom Projektinhaber** ausgeführt. Codex hat keine privilegierten
SQL-Änderungen an der Produktionsdatenbank vorgenommen. Der dokumentierte Aktivierungsweg
für die lokal geprüfte Datei im SQL Editor des **bestehenden** Projekts lautet:

1. Optional `docs/visitor_stats_inspect.sql` für die alten Definitionen lesen/ausführen.
2. **Den gesamten Inhalt von `docs/visitor_stats_migration.sql`** in einem Lauf ausführen.
   Die Migration ist transaktional und erneut ausführbar. Sie setzt weder Gesamtwert noch
   vorhandene Historie oder Startzeit zurück. Die vorhandenen Rückgabesignaturen bleiben erhalten.
3. Die abschließende Leseabfrage zeigt die Werte, `tracking_started_at` und die
   Vollständigkeitsangaben. Diesen Zeitpunkt als tatsächlichen Beginn dokumentieren.
4. Nach erfolgreicher Ausführung die beiden RPCs mit der Homepage prüfen. Das enthaltene
   `NOTIFY pgrst, 'reload schema'` lädt den API-Schema-Cache nach dem Commit neu.

Die Frontend-Dateien werden mit diesem Homepage-Stand veröffentlicht. Der Git-Push führt
die SQL-Migration nicht erneut aus. Die Registrierung über `register_visitor_period` und
die Verwendung ihrer Werte in der Online-Oberfläche werden nach dem Push separat geprüft.

## Speicherung und Zählweise

- Kalender und alle Grenzen: **Europe/Berlin**, einschließlich Sommer-/Winterzeit.
- `homepage_visitor_tracking` speichert genau eine Startzeit sowie den ersten Tag und
  dessen tatsächlich beobachteten alten Tageswert.
- `homepage_visitor_days` behält je `(visitor_day, visitor_key)` eine Zeile dauerhaft.
  Der Schlüssel ist aus der bestehenden zufälligen Browserkennung abgeleitet; keine
  IP-Adressen, Namen, Seitenpfade oder Pageviews werden aufgezeichnet.
- Reloads, Seitenwechsel und mehrere Tabs desselben Browsers zählen am selben Tag einmal.
  Derselbe Browser zählt an einem weiteren Kalendertag erneut einmal.
- **Woche = Summe der Tageswerte seit Montag; Monat = Summe der Tageswerte seit dem Ersten.**
  Beide summieren Besuchertage, nicht einmalige Browser über den gesamten Zeitraum.
- Beim Tageswechsel bleiben die vorherigen Zeilen bestehen. Nur der neue Tageswert
  beginnt bei null. Woche und Monat behalten die passenden vergangenen Tageswerte.
- Ein vollständig beobachteter Tag ohne Registrierungen liefert eine echte **0**.
  Dafür ist keine künstliche Nullzeile nötig: Startzeit und Kalendergrenzen belegen die Abdeckung.
- `total_visitors` wird unverändert aus dem bisherigen `get_visitor_stats()` gelesen.
  Auch `register_visitor()` und seine Registrierung höchstens einmal pro 24 Stunden und
  Browser bleiben unverändert. Die neue Perioden-RPC erhöht den alten Gesamtzähler nicht.
- Die beiden Statistik-Tabellen sind nur über die freigegebenen RPCs erreichbar. Es gibt
  keine Änderungen an anderen Supabase-Tabellen, Authentifizierung oder deren RLS-Regeln.

## Beginn und unvollständige Zeiträume

Die Startzeit wird beim erfolgreichen Ausführen der Migration gespeichert. Ältere,
nicht gespeicherte Tage werden **nicht rekonstruiert** und nicht mit erfundenen Nullen aufgefüllt.

Am ersten, begonnenen Tag fehlen die Browserkennungen der früheren Besucher. Daher bleibt
sein tatsächlich beobachteter alter Tageswert erhalten. Für diesen Tag verwendet die
Berechnung das **Maximum aus dem beobachteten Altwert und den neu registrierten Browsern**;
sie addiert diese überlappenden Mengen nicht. Dieser erste Tageswert ist ein ehrlicher
Mindestwert. Bis zum Tagesende aktualisiert jede Periodenregistrierung den gespeicherten
Altwert, soweit dessen Datum zum ersten Tag passt. Nachfolgende volle Tage verwenden nur
noch die dauerhafte tägliche Erfassung. Fehler in der Registrierung oder blockierte
Browser-Speicherung können wie bei jeder browserbasierten Zählung Besucher ungezählt lassen.

- **Heute:** Ab dem ersten vollständig erfassten Kalendertag ist der ganze Tageszeitraum abgedeckt.
- **Gestern:** Vor Beginn der Erfassung `null` / `—`. Nach dem ersten Tageswechsel ist der
  beobachtete erste Tag verfügbar, ausdrücklich noch unvollständig. Nach dem zweiten
  Tageswechsel liegt erstmals ein vollständig erfasster Vortag vor.
- **Woche/Monat:** Von Anfang an die Summe der tatsächlich erfassten Tageswerte. Beim Start
  mitten im Zeitraum sind diese Summen Mindestwerte. Vollständig abgedeckt sind sie ab
  dem ersten erfassten Montag um 00:00 bzw. Monatsersten um 00:00.
- Bei einer Aktivierung tagsüber am **03.10.2026** wäre Heute ab **04.10.2026**, Gestern und
  die neue Woche ab **05.10.2026**, der ganze neue Monat ab **01.11.2026** abgedeckt.
  Bei einer späteren Aktivierung gelten entsprechend spätere Kalendergrenzen.
- `yesterday_complete`, `week_complete`, `month_complete` unterscheiden echte, aber noch
  teilweise erfasste Summen von vollständig erfassten Zeiträumen. Der genaue Beginn
  steht in `tracking_started_at`.

Das Frontend übernimmt gültige echte Zahlenwerte, einschließlich **0**, auch bei einer
teilweisen Erfassung mit gültiger Startzeit. Ein kurzer DE/EN-Tooltip und die zugängliche
Beschriftung benennen dann den Erfassungsbeginn und die unvollständige Abdeckung. Es gibt
keinen zusätzlichen Erklärungstext unter den fünf Karten.

Nur echte API-/Feldfehler verwenden den bisherigen logischen Fallback: Woche/Monat = Heute,
Gestern = `—`. Der Fallback hat einen anderen Tooltip als echte gespeicherte Teilsummen.
Ungültige Zahlen, fehlende Felder, leere Antworten und ungültige Vollständigkeitsangaben
verdrängen keine gültigen Werte. Die Browserkennung unterscheidet Browser/Profile,
nicht natürliche Personen; gelöschte Browserdaten erzeugen eine neue Kennung.

## Lokale Nachweise

Die SQL-Datei wird in einem isolierten PostgreSQL-Kern (PGlite) ausgeführt, nicht mit
vorgegebenen Frontendzahlen vorgetäuscht. Der unveränderte Produktions-SQL-Text wird auf
Syntax, erneute Ausführung und Erhalt der alten Daten/Funktionen geprüft. Für Kalenderfälle
wird ausschließlich in der Testkopie eine kontrollierte Uhr verwendet. Geprüft werden
Mehrfachbesucher, Tages-/Wochen-/Monatswechsel, tägliche Summen, Nullwerte, Sommer-/Winterzeit,
Zugriffsrechte und Speicherung über einen Datenbankneustart. Browserprüfungen verwenden
Antworten dieser lokalen SQL-Funktionen; sie registrieren keine produktiven Besucher.

Diese Nachweise bestätigen die lokale Implementierung. Die spätere produktive Aktivierung
und erfolgreiche Leseprüfung sind oben dokumentiert; die tatsächliche Browserregistrierung
und die veröffentlichte Oberfläche werden zusätzlich geprüft.

Ergebnis am 03.10.2026: 11 erfolgreiche SQL-Testgruppen, 128 Footer-Ansichten auf allen
acht betroffenen Seiten, vier Geschichtsansichten in DE/EN bei 1440/390 Pixeln sowie
Tageswechsel ohne Reload in zwei Tabs und Sprachpersistenz beim Seitenwechsel.
JavaScript-/Parserfehler: 0. Horizontale Überläufe: 0. `git diff --check`: sauber.
Alle Supabase-Aufrufe dieser lokalen Browserprüfungen wurden abgefangen; die Produktionsdaten
wurden durch diese Tests nicht verändert. Sie sind getrennt von der nachfolgenden Online-Prüfung.

Technische Referenzen: [Supabase Database Functions](https://supabase.com/docs/guides/database/functions),
[PostgreSQL Date/Time Functions](https://www.postgresql.org/docs/current/functions-datetime.html),
[PostgREST Schema Cache](https://docs.postgrest.org/en/stable/references/schema_cache.html).
