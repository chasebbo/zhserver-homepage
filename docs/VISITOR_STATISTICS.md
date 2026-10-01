# Besucherstatistik: Datenquelle und Aktivierung

## Vorhandene Daten

Die Homepage verwendet `assets/js/visitor-counter.js` und die bestehende Supabase-Datenbank
`yawadxzeyyrozmlrokun`. Die vorhandenen RPCs heißen `register_visitor()` und
`get_visitor_stats()`. Die öffentliche Leseabfrage am 30.09.2026 lieferte die Felder
`total_visitors`, `today_visitors` und `today_date`. Sie lieferte keine Historie für
Gestern, Woche oder Monat. Die Abfrage hat keinen Besucher registriert.

Der Gesamtwert und seine bisherige Registrierung höchstens einmal pro 24 Stunden
und Browser bleiben erhalten. Der Gesamtwert wird nicht rückwirkend als Anzahl
einmaliger Personen interpretiert. Die vorhandenen RPCs und ihre Daten werden nicht
ersetzt. Der heutige Wert wird während des ersten, nur teilweise erfassten Tages
aus der vorhandenen Quelle übernommen, sofern deren Datum zum aktuellen Tag passt.

## Lokale Änderung und späterer Start

Die lokale Oberfläche zeigt ausschließlich Heute, Gestern, Diese Woche, Dieser Monat
und Insgesamt in DE/EN. Sie wird aus einer gemeinsamen Komponente für alle bestehenden
Besucher-Footer erzeugt. Es gibt keine Anzeige oder Speicherung von Pageviews in der
neuen Zeitraum-Erfassung. Solange der Perioden-Endpunkt nicht verfügbar ist, übernehmen
Woche und Monat den echten heutigen Wert als logischen Mindestwert. Auch ein echter
Tageswert von `0` wird übernommen. Gestern bleibt `—`; fehlt ein gültiger heutiger
Wert, bleiben auch Woche und Monat `—`. Es werden keine früheren Tage rekonstruiert.
Ein kurzer zentral übersetzter Tooltip und die zugängliche Beschriftung kennzeichnen
die Mindestwerte; es gibt keinen zusätzlichen Text unter den Karten. Verfügbare echte
Periodenwerte behalten Vorrang, auch ein gültiger Zahlenwert `0`. Jede Kennzahl wird
einzeln geprüft: Bei HTTP-/Verbindungsfehlern, ungültigen Antworten oder fehlenden bzw.
ungültigen Feldern übernehmen Woche und Monat den heutigen Mindestwert; Gestern bleibt
ohne verlässlichen Wert `—`. Leere Zeichenfolgen, Arrays und Objekte gelten nicht als
Besucherzahlen. Explizit als unvollständig gekennzeichnete Zeiträume verwenden ebenfalls
den Fallback. Fehlen die optionalen Vollständigkeitsangaben, bleiben gültige Zahlenwerte
verwendbar. Ungültige Tages-/Gesamtfelder der Periodenantwort verdrängen keine gültigen
Werte der bisherigen Quelle. Die bestehenden Perioden-RPCs bleiben erhalten.
Der zusätzliche Hinweis unter den Werten wurde am 01.10.2026 vollständig entfernt;
die fünf Kennzahlen und ihre Datenabfragen bleiben erhalten. Die reine
Leseprüfung vom 01.10.2026 bestätigt weiterhin HTTP 200 für `get_visitor_stats()`
und HTTP 404 für `get_visitor_period_stats()`. Keine Backendänderung ausgeführt.

`docs/visitor_stats_migration.sql` ist eine additive Migration für die bestehende
Supabase-Datenbank. Sie wurde lokal vorbereitet; die Produktionsdatenbank wurde
nicht verändert. Bei einem später ausdrücklich beauftragten Deployment:

1. Migration im SQL Editor der bestehenden Supabase-Datenbank ausführen.
2. Die geänderten Homepage-Dateien und die neue Komponenten-CSS veröffentlichen.
3. Der erste echte Aufruf von `register_visitor_period(p_device_id)` setzt
   `homepage_visitor_tracking.started_at`. Genau dieser Zeitpunkt ist der Beginn
   der Erfassung. Allein das Installieren der SQL-Datei
   startet die Zeitreihe noch nicht.

## Zählung und vollständige Zeiträume

- Maßgeblicher Kalender ist **Europe/Berlin**, auch bei Sommer-/Winterzeitwechsel.
- Ein zufälliger, im Browser gespeicherter Gerätebezeichner wird serverseitig in einen
  Schlüssel umgewandelt. Es werden keine IP-Adressen, Namen oder Seitenpfade gespeichert.
- Der Primärschlüssel `(visitor_day, visitor_key)` verhindert Mehrfachzählungen am
  selben Tag durch Reload, Seitenwechsel oder mehrere Tabs.
- Woche beginnt Montag, Monat am Ersten. Beide zählen **unterschiedliche Browser im
  Zeitraum**, nicht die Summe der Tageswerte. Ein wiederkehrender Browser zählt nur einmal.
- Ohne lokale Speicherung wird Sitzungsspeicherung verwendet. Ist beides gesperrt,
  liest der Footer nur die Statistik und registriert keinen zusätzlichen Besucher.
- Nach dem ersten Tageswechsel wird Heute aus der neuen täglichen Erfassung gelesen.
- Gestern wird erstmals angezeigt, sobald ein ganzer Vortag seit 00:00 Uhr erfasst wurde.
  Bei einem Start tagsüber ist das nach dem zweiten Tageswechsel der Fall.
- Woche wird ab dem ersten vollständig erfassten Montag, Monat ab dem ersten vollständig
  erfassten Monatsersten belastbar. Vorher liefert die RPC `null` und ein Vollständigkeitsflag
  `false`; die Oberfläche zeigt `—` statt unvollständiger oder erfundener Zahlen.
- Alte Tage werden nicht mit Nullen aufgefüllt. Eine echte Null wird nur für einen vollständig
  erfassten Zeitraum ohne registrierte Besucher ausgegeben. Tracking-Daten und Startzeit
  bleiben auch bei erneutem Ausführen der Migration erhalten.

Die browserbasierte Kennung unterscheidet Browser/Profiles, nicht natürliche Personen.
Gelöschte Browserdaten oder ein anderer Browser erzeugen eine neue Kennung.

Technische Referenzen: [Supabase Database Functions](https://supabase.com/docs/guides/database/functions)
und [PostgreSQL Date/Time Functions](https://www.postgresql.org/docs/17/functions-datetime.html).
