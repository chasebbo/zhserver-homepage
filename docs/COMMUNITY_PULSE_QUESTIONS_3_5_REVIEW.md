# Community Pulse: Fragen 3–5 angelegt und aktiviert

Stand: 19.10.2026. **Nach ausdrücklicher Nutzerfreigabe produktiv angelegt und aktiviert.**

## Geprüfter Bestand vor der Aktivierung

- Öffentlicher Reader: `get_zh_community_pulse(false)`.
- Bestehende Verwaltung: `/admin/community-pulse.html` und `manage_zh_community_pulse`.
- Speicherung: `zh_pulse_private.polls`, Optionen/Zähler in `public.community_votes`,
  kontobezogene Stimmen in `zh_pulse_private.votes`.
- Zwei aktive öffentliche Fragen, Positionen 1 und 2. Beim rein lesenden Audit:
  - `f41a9e43-e46c-41d6-b0fb-b7afe7a6a6ab`: Zombiehorden, 2 Stimmen (2 / 0).
  - `b6004d3a-cfcb-4673-ae8e-b1bdd082aaf0`: Sprachchat/friendly, 1 Stimme (0 / 1).
- Zusätzlich existiert eine inaktive frühere Sprachchatfrage. Auch sie bleibt
  vollständig erhalten; sie wird weder aktiviert noch ersetzt oder gelöscht.
- Die bestehende Navigation verwendet `polls.length`; fünf Fragen benötigen keine
  Änderungen an Homepage-JS, CSS, HTML oder Übersetzungslogik.

## Genau diese drei Ergänzungen

Quelle: `community_pulse_questions_3_5.json`. Jede Frage wird aktiv und offen
angelegt, mit zwei Antworten `Ja / Nein` bzw. `Yes / No`.

| Position | Deutsch | Englisch |
| --- | --- | --- |
| 3 | Soll es möglich sein, Fahrzeuge mit Panzerung und Bewaffnung nachzurüsten? | Should it be possible to upgrade vehicles with armour and weapons? |
| 4 | Soll es Hunde als Begleiter im Spiel geben? | Should there be dogs as companions in the game? |
| 5 | Soll es möglich sein, unterirdische Basen zu bauen? | Should it be possible to build underground bases? |

## Geprüfter Anlageablauf (inzwischen ausgeführt; nicht wiederholen)

1. Den aktuellen Bestand erneut lesen und sicherstellen, dass diese Fragen nicht
   inzwischen angelegt wurden. Bestehende Frage-IDs, Optionen, Reihenfolge und
   Stimmstände als Vergleich sichern. Keine Konten oder Sessions verändern.
2. Mit bestehender echter Adminsession über die vorhandene Verwaltung bzw. ihren
   vorhandenen RPC genau drei neue Umfragen speichern. Jeweils die `args` aus der
   JSON-Datei verwenden: `p_poll_id=null`, `p_expected_at=null`, Reihenfolge 3/4/5.
3. Der geprüfte CREATE-Zweig erzeugt pro Frage eine eigene UUID über den vorhandenen
   Default `gen_random_uuid()`, speichert den angemeldeten Admin als Ersteller und
   legt je zwei eigene Antwort-IDs mit initial 0 Stimmen an. Die zurückgegebenen
   `saved_poll_id` sofort protokollieren. Keine alten Frage-IDs übergeben.
4. Jeden erfolgreichen Aufruf nur einmal ausführen. Bei Abbruch oder Timeout erst
   neu lesen, IDs/Texte abgleichen und nur tatsächlich fehlende Fragen ergänzen.
   Der vorhandene CREATE-RPC ist kein idempotenter Import.
5. Ergebnis lesen: genau fünf aktive öffentliche Fragen in Reihenfolge 1–5;
   drei unterschiedliche neue UUIDs und sechs eigene Antwort-IDs. Bestehende zwei
   aktive und die inaktive Frage bleiben unverändert. Keine eigenen Teststimmen
   produktiv abgeben; echte zwischenzeitliche Besucher-Stimmen nicht zurücksetzen.
6. Homepage DE/EN, Vor-/Zurück, Ergebnisse und Mobile/Desktop prüfen.

## Grenzen und Schutz

- **Keine Schema-/Policy-/Funktionsmigration nötig.** Nach Freigabe entstanden nur
  drei neue Umfragen und sechs zugehörige Optionen über die bestehenden Adminrechte.
- Aktiv angelegte Fragen erscheinen durch den gemeinsamen produktiven Reader
  sofort öffentlich, auch ohne Homepage-Commit oder Deployment. Die ausdrückliche
  Freigabe zur produktiven Aktivierung wurde erteilt und anschließend umgesetzt.
- Keine vorhandenen Stimmen, Optionen, Fragen, IDs oder Texte ändern/löschen.
- Die produktive Stimmenfunktion wurde nur gelesen: Identität über
  `zh_pulse_private.member_id()`, eindeutiger Schlüssel `(poll_id, voter_id)` und
  UPSERT bei Antwortwechsel. Derselbe Account erzeugt dadurch keine zweite Stimme
  in derselben Frage. Optionen werden serverseitig der gewählten Frage zugeordnet.
- Keine neue Zählung, Authentifizierung oder parallele Umfrageverwaltung.
- Bei späterem Rücknahmebedarf zunächst nur die drei neu protokollierten Umfragen
  über die vorhandene Verwaltung deaktivieren. Keine automatische Löschung,
  insbesondere nicht nach bereits eingegangenen Stimmen.
- Lokale Tests verwenden ausschließlich einen isolierten Speicher und den
  unveränderten vorhandenen Renderer; sie sind keine produktive Aktivierung und
  kein Nachweis neu gespeicherter echter Stimmen. Die produktiven UUIDs wurden
  erst nach der Freigabe erzeugt und sind unten dokumentiert.

Kein Commit, Push, Deployment, Webexport, GAME- oder Dedicated-Eingriff.

## Lokale Prüfung vor der produktiven Aktivierung

- 35 isolierte Prüfungen mit dem unveränderten `community-pulse.js`: fünf Fragen,
  eindeutige Vorschau-IDs, DE/EN, Ja/Nein, Ergebnisse, Stimme ändern, dieselbe
  Antwort erneut wählen, Vor-/Zurück inklusive Umlauf 5 → 1 und 1 → 5.
- Echte Browserbedienung ausschließlich in einer gekennzeichneten lokalen
  Testvorschau ohne Supabase-Anbindung: alle drei neuen Fragen beantwortet und
  Antwort gewechselt; Gesamtzahl pro Testaccount/Frage bleibt dabei 1.
- 24 Browser-Ansichten: neue Fragen 3/4/5 × DE/EN × 1440/768/390/360 px.
  Keine horizontalen Überläufe, keine abgeschnittenen Texte/Buttons, fünf
  Navigationspunkte. 0 erfasste Browser-JS-/Consolefehler und Warnungen.
- Produktiver Vorher-/Nachher-Vergleich dieser Vorbereitungsphase ausschließlich
  lesend: damals zwei aktive und insgesamt drei bestehende Umfragen; Fragen,
  Optionen und Stimmen exakt unverändert. Die drei neuen UUIDs wurden erst in
  der anschließend freigegebenen Aktivierungsphase angelegt (siehe unten).
- JS-Syntax und `git diff --check` sauber. Keine Anwendungsdatei für diese
  Datenergänzung geändert; alle vorherigen Landingpage-/Forum-Änderungen erhalten.
- Testvorschau/Nachweise ausschließlich außerhalb des Repositories im vorhandenen
  Visualisierungsordner `pulse-questions-3-5-20261019`. Keine Testvotes oder
  Vorschau-Datensätze in Homepage oder Produktionsdatenbank eingebaut.

## Produktive Aktivierung abgeschlossen – 19.10.2026

Nach ausdrücklichem „Ja, genau diese drei Fragen produktiv anlegen und aktivieren“
über die bestehende lokale Adminverwaltung auf Port 5500 mit der vorhandenen
angemeldeten Adminsession angelegt. Drei erfolgreiche Speicheraktionen über den
vorhandenen `manage_zh_community_pulse`-RPC, keine direkte Tabellenbearbeitung.

| Position | Thema | Produktive UUID |
| --- | --- | --- |
| 3 | Fahrzeug-Tuning | `da950651-98aa-47b4-99c0-a652bdfb323a` |
| 4 | Hunde als Begleiter | `46825c24-11c3-4c75-bc57-f29fa7585cf3` |
| 5 | Unterirdischer Basenbau | `a2a18c54-5205-444e-aec6-73db5a26dcc7` |

- Öffentlich genau fünf aktive/offene Fragen in Reihenfolge 1–5. Insgesamt sechs
  Datensätze inklusive der unveränderten inaktiven Altfrage.
- Genau drei neue Umfragezeilen und sechs zugehörige Antwortzeilen; eigene IDs,
  je Frage Ja/Nein und Yes/No. Alle neuen Zähler beim Anlegen 0.
- Sämtliche drei vorbestehenden Umfragezeilen und sämtliche vorbestehenden
  `community_votes`-Zeilen inklusive Zähler/Metadaten vor/nachher exakt identisch.
  Hash aller bestehenden kontobezogenen Stimmen ebenfalls identisch.
- Neue Fragen auf der öffentlichen Homepage in DE/EN angezeigt, Ergebnisse mit
  korrekten 0 Stimmen und Vor-/Zurück geprüft. Keine produktiven Teststimmen.
- Lokale Variante C übernimmt dieselben fünf echten Fragen automatisch. Desktop
  und Mobile DE/EN ohne horizontale Überläufe oder abgeschnittenen Fragetext.
  0 erfasste Browser-JS-/Consolefehler oder Warnungen in Admin/Live/Lokal.
- Keine Schema-, Policy-, Funktions-, Rollen- oder Accountänderung. Keine
  Homepage-Anwendungsdatei geändert. Vorbereitete andere Homepageänderungen und
  fremder Wiki-/Validierungsbestand erhalten. Kein Commit, Push oder Deployment.

Die CREATE-Parameter in der JSON-Datei dienen nur noch als Nachweis. Nicht erneut
ausführen. Nachweise außerhalb Git: `production-before-activation.json`,
`production-activation-result.json` und Browseraufnahmen im obigen Ordner.
