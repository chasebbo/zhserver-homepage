# Community Pulse und Forum-Aufrufe – Freigabeprüfung

Stand: 13.10.2026. **Nach ausdrücklicher Freigabe im bestehenden Backend
angewendet; Homepage nur lokal aktiviert, nicht veröffentlicht.**
Supabase-Migrationsversion: `20261013164013`, Name
`homepage_community_pulse_forum_views`. Die geprüfte SQL-Datei bleibt als exakt
freigegebener Quellstand erhalten; nicht nochmals anwenden.
Die Release-Basis bleibt `49b51da2411ce85059894e808c269b47411dbe26`.
Diese Teilphase ist kein Nachtrag zum abgeschlossenen Forum-Release.

## Geprüfter Bestand

- Bestehendes Supabase-Projekt `zhserver`, Referenz `yawadxzeyyrozmlrokun`.
- `public.community_votes` enthält die vier bisherigen Optionen
  `weather`, `weapons`, `vehicles`, `hordes`. Lesender Ausgangsstand:
  0 / 1 / 2 / 3 Stimmen, insgesamt 6. Keine dieser Zahlen wurde produktiv verändert.
- Das bisherige Frontend liest `id,votes` und schreibt ausschließlich über
  `vote_for_feature(text)`. Keine direkte Tabellen-Schreibfunktion im Homepage-
  oder Admincode. `community-voting.js`, Spielseite und Detailseite bleiben erhalten.
- Zentrale Anmeldung und `zh_identity_private.current_is_admin()` existieren
  bereits. Die Rolle stammt aus der geschützten zentralen Rollenzuordnung und
  `auth.uid()`, nicht aus Name, E-Mail, Profilmetadaten oder Spielrang.
- Forum-Lese-RPC, Themen, Beiträge, Profile und Moderation sind bereits produktiv.
  Der Lese-RPC liefert Rollen-Capability 1 und Moderations-Capability 2.

## Exakter SQL-Umfang

Datei: `20261013105509_homepage_community_pulse_forum_views.sql`.
Die gesamte Migration läuft in einer Transaktion. Fingerabdrücke der vier
betroffenen Bestandsfunktionen und die bestehende Tabellen-/Policystruktur
werden zuerst geprüft. Bei Abweichungen bricht sie vor Änderungen ab.

| Objekt | Änderung |
| --- | --- |
| `zh_pulse_private` | Neues, nicht als API-Schema vorgesehenes privates Schema |
| `zh_pulse_private.polls` | Neue Fragen, DE/EN, Reihenfolge, Sichtbarkeit und Lebenszyklus |
| `public.community_votes` | Drei nullable Zusatzspalten: `pulse_poll_id`, `pulse_labels`, `pulse_position`; FK und zwei Optionsindizes |
| `zh_pulse_private.votes` | Neue private Account-Zuordnung zu einer Option; PK `(poll_id, voter_id)` und Optionsindex |
| `zh_forum_private.view_totals` | Neuer echter Aufrufstand je Thema |
| `zh_forum_private.view_windows` | Neue private, gehashte Account-/Browser-Deduplizierung je Thema |
| Neue private Funktionen | Validierung, lesende Umfragen, Stimmabgabe, Adminpflege, Aggregate und Aufrufregistrierung |
| `public.get_zh_community_pulse(boolean)` | Neuer Lese-RPC für aktive Fragen; Adminansicht nur mit echter Adminrolle |
| `public.cast_zh_community_pulse_vote(uuid,text)` | Neuer authentifizierter Schreib-RPC mit genau einer Accountstimme je Frage |
| `public.manage_zh_community_pulse(uuid,jsonb,jsonb,boolean,text,integer,timestamptz)` | Neuer authentifizierter, zusätzlich serverseitig rollenbeschränkter Admin-RPC |
| `public.register_zh_forum_view(uuid,uuid)` | Neuer begrenzter Aufruf-RPC für Gäste und Mitglieder |
| `public.vote_for_feature(text)` | Bisheriges Ergebnisformat erhalten; private Implementierung nimmt nur Legacy-Optionen ohne `pulse_poll_id` an |
| `zh_forum_private.topic_json(topics)` | Nur `views_count` ergänzt, übrige öffentlichen Felder unverändert |
| `public.get_zh_forum(text,uuid,integer,integer)` | Nur `views_version: 1` ergänzt; Rollen und Moderation unverändert |
| Bestehende öffentliche Votes-SELECT-Policy | Legacy-Optionen bleiben lesbar; neue Pulse-Optionen nur aktiv/nicht archiviert oder für Admins |
| Rechte | Unbenutzte direkte INSERT/UPDATE/DELETE/TRUNCATE/REFERENCES/TRIGGER-Rechte auf der Optionstabelle für `anon`/`authenticated` entzogen; SELECT und die bisherigen RPC-Pfade bleiben |
| Trigger | Nur auf der neuen privaten Votes-Tabelle: tatsächliche Stimmänderungen aktualisieren Optionssummen |

**Unverändert:** Auth-Accounts, UUIDs, Passwörter, Profile, Rollen, Adminrechte,
Forum-Themen/-Beiträge, Moderations-RPCs/-Policies, Besucher und Presence,
Spiel-/U01-/F01-/Dedicated- und Wiki-Bestand.

Keine Fragen, Stimmen oder historischen Aufrufe werden in Produktion vorbefüllt.
Nach Aktivierung ist eine leere Umfragenliste ein ehrlicher leerer Zustand.

## Schreiben, Löschen und Kaskaden genau eingegrenzt

Die Migration führt **keinen INSERT, UPDATE oder DELETE auf vorhandenen
Datenzeilen aus**. Sie enthält kein `DROP`, kein `TRUNCATE`, keine unbeschränkte
UPDATE-Anweisung und keine Account-/Gameplaymigration.

Die folgenden Anweisungen stehen innerhalb neuer Funktions-/Triggerdefinitionen
und laufen erst bei einer späteren tatsächlichen Aktion:

- `cast_vote`: INSERT/UPSERT in die neue private Votes-Tabelle, ausschließlich
  mit `voter_id = auth.uid()`. Derselbe Poll/Account bleibt eine Zeile.
- `sync_votes`: gezieltes UPDATE genau der bisherigen/neuen Pulse-Option. Die
  Legacy-Zeilen werden dabei nicht berührt.
- `manage_poll`: gezieltes UPDATE des gewählten Polls. Ein `DELETE FROM
  public.community_votes WHERE pulse_poll_id = v_id` ersetzt nur dessen
  Antwortoptionen, wenn bisher **null tatsächliche Stimmen** vorhanden sind.
  Nach der ersten Stimme sind Antwortbedeutungen/-reihenfolge gesperrt.
  Fragen mit Stimmen werden geschlossen oder archiviert, nicht gelöscht.
- `legacy_vote`: gezieltes UPDATE mit `WHERE id = feature_id AND pulse_poll_id
  IS NULL`. Dies bleibt der bestehende Legacy-Zählerpfad.
- `register_view`: INSERT/UPSERT ausschließlich für das wirklich geöffnete Thema.
  Keine Änderung an `topics.updated_at` oder `last_activity_at`.

Neue Foreign Keys besitzen gezielte Kaskaden: Eine später bereits autorisierte
dauerhafte Themenlöschung entfernt auch die neuen Aufrufdaten dieses Themas.
Eine später anderweitig autorisierte Accountlöschung entfernt dessen neue
Pulse-Stimmen und korrigiert die betroffenen Summen. **Diese Migration löscht
keinen Account und kein Thema.**

## Stimmen, Identität und Rechte

- Die Optionstabelle bleibt die gemeinsame Quelle der Summen. Die private
  Zuordnung ergänzt die bislang fehlende UUID-Eindeutigkeit; kein zweites
  konkurrierendes Votesystem und keine Rekonstruktion alter Stimmen.
- Die UUID wird im Backend aus der gültigen Session ermittelt. Der Schreib-RPC
  besitzt kein frei wählbares `user_id`-Argument.
- Gastfragen und Ergebnisse sind öffentlich; Abstimmen benötigt einen echten,
  nicht anonymen Auth-Account. Ein öffentlicher Anzeigename ist für eine private
  Stimmabgabe keine zusätzliche Pflicht. E-Mail wird nie öffentlich ausgegeben.
- 2–4 vollständige DE/EN-Optionen; doppelte/leere Optionen abgewiesen.
- Antwortwechsel verschiebt genau eine Stimme. Derselbe Request erzeugt keine
  Zusatzstimme. Row-Locks und eindeutige Schlüssel sichern parallele Aufrufe.
- Adminpflege prüft dieselbe bestehende serverseitige Systemrolle und schützt
  vor dem Überschreiben einer zwischenzeitlich bearbeiteten Frage.
- Neue Tabellen: RLS aktiv, keine direkten Rechte für Gäste/Member. Öffentliche
  Wrapper laufen als INVOKER; begrenzte private Implementierungen als DEFINER
  mit leerem `search_path`. Implizite EXECUTE-Rechte zuerst entzogen.
- Öffentlich: Frage, Optionen, Summen/Anteile und Status. Die individuelle
  Auswahl wird nur dem jeweiligen angemeldeten Account zurückgegeben. Keine
  öffentliche Wählerliste, E-Mail oder Account-/Browser-Hashes.

## Aufrufdefinition

- Nur ein sichtbarer, erfolgreich geladener eigenständiger Thread registriert
  einen Aufruf. Kategorien, Themenlisten, Top 5, Profilansichten und Lese-/
  Prefetch-RPCs registrieren nichts.
- Rollendes Fenster von **24 Stunden** je Thema, Account und Browser. Die
  Kombination verknüpft Gast → Login, weitere Tabs/Browser desselben Accounts
  und Logout mit dem bereits gezählten Öffnungsvorgang.
- Private SHA-256-Schlüssel statt öffentlich lesbarer UUID-/Browserlisten.
  Keine IP-Adressen, kein Gerätefingerprinting, kein zusätzlicher Authspeicher.
- Eine zufällige Browserkennung wird im bestehenden Browser-LocalStorage
  dauerhaft gespeichert. Bei blockiertem Speicher wird ein Gast nicht mit
  ständig neuen Reload-Kennungen künstlich gezählt; Account-Deduplizierung bleibt.
- Gast im anderen Browser oder nach Löschen des Speichers kann nicht sicher als
  derselbe Gast erkannt werden. Dies ist Reload-Schutz, keine Bot-/Betrugsgarantie.
- Bestehende Themen beginnen ohne erfundene Historie mit 0, sobald die Erfassung
  aktiviert ist. Vor installierter Capability steht ehrlich „—“.
- Top 5 und letzte Aktivität bleiben nach Beitragsaktivität sortiert. Aufrufe
  verändern weder Zeitstempel noch Sortierung oder Moderation.

## Freigegebene Aktivierung abgeschlossen

1. Genau die oben genannte Migration im **bestehenden** Projekt angewendet.
   Sämtliche vorbereiteten Bestands-Fingerabdrücke passten vor der Anwendung.
2. RPC-Rechte, vier private RLS-Tabellen und unveränderte Bestandsdaten geprüft.
3. Lokal `assets/js/community-features.js` auf `pulse: true, forumViews: true`
   gesetzt; eigener Cachebezeichner `20261013-pulse-active1` auf allen drei Seiten.
4. Echte lokale cHa-Adminsession, Formulare, DE/EN und Aufrufe geprüft. Keine
   öffentliche Testumfrage oder Fake-Stimme gespeichert. Eine reale erste Frage
   legt der Administrator bewusst an.
5. Ein Homepage-Deployment benötigt weiterhin einen eigenen Auftrag.

## Daten erhaltender Rücknahmeweg

Datei: `community_pulse_forum_views_disable.sql`.
Auch diese produktive Ausführung benötigt einen ausdrücklichen Auftrag.

Zuerst beide Frontend-Schalter deaktivieren und Seiten neu laden. Das SQL stellt
die bisherigen Forum-Lesefunktionen exakt wieder her und entzieht den acht neuen
öffentlichen/privaten RPC-Einstiegen die Ausführungsrechte. **Alle neuen Fragen,
Stimmen, Aufrufe und Fenster bleiben erhalten.** Keine Tabellen-/Spaltenlöschung.

Der abgesicherte Legacy-Wrapper und die eingeschränkte neue Options-Policy bleiben
absichtlich bestehen: Solange Pulse-Optionen gespeichert sind, darf der anonyme
alte RPC sie nicht über ihre IDs verändern können. Die alte Abstimmung bleibt
funktionsfähig. Das ist eine funktionale Deaktivierung, keine verlustreiche
Schema-Rücksetzung.

## Prüfung und Nachweise

- Vollständige vorbereitete Migration gegen ein isoliertes Postgres-Modell mit
  den geprüften Bestandsdefinitionen: 43 bestandene SQL-Prüfungen.
- 22 Browser-DOM-/UI-Controller-Prüfungen: Rotation/Pausen, Gast/Member,
  Ergebnisse, Antwortwechsel, Nullwerte, DE/EN und echte Thread-Öffnung.
- 10 isolierte Rücknahmeprüfungen: identische Daten/Profile/Rollen, frühere
  Forum-Leseantwort, deaktivierte neue RPCs, weiterhin nutzbarer Legacy-RPC.
- Tatsächliche Browserbedienung mit dem neuen SQL im isolierten Modell:
  Abstimmen/Ändern, Reload, zwei Tabs, Admin erstellen/speichern/aktivieren/
  schließen/öffnen/archivieren, vier Optionen, Member-Abweisung, Gästeergebnisse.
- Desktop 1440, Tablet 768, Mobile 390; zentrale DE/EN-Texte. Vollständiger globaler
  Footer separat im normalen lokalen Server geprüft; im isolierten Prüfserver
  absichtlich kein produktives Tracking und keine echten Account-Sessions.
- 13 betroffene lokale HTML-/JS-/CSS-Ressourcen: HTTP 200, passende MIME-Typen;
  JavaScript/CSS entsprechen dem aktuellen Working Tree. Keine relevanten
  Browser-JS-/Console-/HTTP-Fehler in den geprüften Ansichten, kein horizontaler
  Overflow. JS-Parserprüfung und `git diff --check` sauber.
- Alle 21 fremden Ausgangsdateien anhand SHA-256 unverändert. Bestehende
  Übersetzungen, Homepage-Header/-Footer, beide übrigen Kapitelkarten, weitere
  Startseitenabschnitte, Auth, Rollen-/Moderationscode und alte Abstimmung erhalten.
- Nachweise/Screenshots außerhalb Git im vorhandenen Visualisierungsordner:
  `community-pulse-views-20261013`.

Die ursprünglichen isolierten SQL-/UI-Ergebnisse sind durch die folgende echte
Backend-/lokale Abnahme ergänzt. **Kein Homepage-Deployment und keine neue
Live-Abnahme der veröffentlichten Homepage**. Kein Commit, Push oder Webexport.

## Echte Backend-/lokale Abnahme nach Freigabe

- Migration erfolgreich, Registry-Version `20261013164013`. SHA-256 der
  unveränderten freigegebenen SQL-Datei:
  `869062069F9CC37B9F9F6AB1281E4271E681DBF0690E4153A6A239A2E0EA97AB`.
- Alte vier Optionen inklusive Zahlen und Zeitstempeln unverändert (6 Stimmen).
  Themen, Beiträge, Profile und zentrale Rollen per geordneter JSON-Hashprüfung
  vor/nach Migration und nach echtem Thread-Aufruf identisch. Admin-UUID erhalten.
- 13 echte SQL-Rechte-/Stimmtests in einer vollständig zurückgerollten Transaktion
  mit bestehenden Account-UUIDs: Auth-UID-Zuordnung, Duplicate/Antwortwechsel,
  fremde eigene Auswahl nicht lesbar, gesperrte Optionen, geschlossene Umfrage,
  Gäste-/Member-Abweisung und wirkungslose manipulierte `user_metadata`.
  Kein zweiter Account und kein Passwort verändert; keine Testdaten bleiben.
- Anschließend bestätigt: 0 gespeicherte Pulse-Fragen, 0 Pulse-Stimmen. Der
  echte leere Zustand ist korrekt; die vorherigen Beispieldaten existierten
  ausschließlich im inzwischen beendeten isolierten Modellserver.
- Echte lokale Admin-Anmeldung durch den Nutzer, neue Adminseite erreichbar,
  Lesen/Formular/2–4 Optionen/Sprachwechsel funktionieren. Formularprüfung
  abgebrochen, ohne eine Testfrage zu speichern. Die vollständige Schreib-
  Bedienung wurde zuvor isoliert geprüft; echte SQL-Schreiblogik wie oben.
- Reale Kategorien- und Themenliste: noch 0 registrierte Aufrufe. Erst tatsächlich
  geöffnetes Thema `Hallo Zombiehölle`: 1; Reload: 1; zweiter Tab: 1.
  Persistiert in `view_totals`, zwei private Aliasfenster. Dieser echte Aufruf
  bleibt erhalten. Kein Update von Themen-/Beitrags-/Aktivitätsdaten.
- Reale HTTP-Lese-RPCs: Pulse und Forum HTTP 200, JSON/CORS korrekt,
  Forum-Capabilities weiterhin Rolle 1 / Moderation 2, zusätzlich Views 1.
  Gast-Admin-Leseversuch absichtlich HTTP 401 / SQL 42501 `pulse.forbidden`;
  erwartete Rechteabweisung, kein unerwarteter HTTP-Fehler.
- Die 13 lokalen UI-Ressourcen erneut HTTP 200 und passende MIME-Typen,
  JS/CSS identisch zum Working Tree. Desktop 1440 / Tablet 768 / Mobile 390,
  DE/EN, öffentliche E-Mail unsichtbar und vollständiger gemeinsamer Footer.
- Sicherheits-Advisors: vier erwartete INFO-Hinweise zu privaten Tabellen mit
  RLS ohne direkte Policies. Kein Tabellenrecht für Gäste/Member; ausschließlich
  geprüfte RPC-Zugänge. Die
  [Linter-Erklärung](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy)
  ist dokumentiert. Bestandswarnungen außerhalb dieses Auftrags nicht verändert.

Nachweise: `production-backend-validation.json`, `production-http-validation.json`,
`production-browser-validation.json`, `production-scope-validation.json` und
aktuelle `production-*.png` im vorhandenen Nachweisordner außerhalb Git.
Abschlusslogs der echten Admin-/Threadansichten: 0 Fehler, 0 Warnungen.
Mobile-Adminformular EN inklusive vollständigem Footer geprüft, ohne Speicherung;
Viewport zurückgesetzt. 21 fremde Ausgangsdateien weiterhin SHA-256-identisch.

## Betroffene Dateien dieses lokalen Auftrags

- Startseite: `index.html`, `assets/css/community-pulse.css`,
  `assets/js/community-pulse.js`, `assets/js/community-pulse-api.js`,
  `assets/js/community-features.js`.
- Admin: `admin/dashboard.html`, `admin/community-pulse.html`,
  `admin/community-pulse.js`, `assets/css/community-pulse-admin.css`.
- Forum: `forum/index.html`, `assets/js/forum-content.js`,
  `assets/js/forum-views.js`, `assets/css/forum-content.css`.
- Zentrale zusätzliche DE/EN-Texte: `assets/js/translations.js`.
- Planung/Freigabe/Fortsetzung: diese Prüfdatei, die oben benannte Migration,
  `community_pulse_forum_views_disable.sql`, `COMMUNITY_PULSE_VIEWS_CHECKPOINT.md`
  und der kurze Zusatz in `HOMEPAGE_CHECKPOINT.md`.

Prüfserver, Testcode, Testdaten, Protokolle und Screenshots liegen außerhalb Git.
Ein ursprünglicher Fehler des isolierten Admin-Redirects (ausgeschlossene echte
Login-SDK) wurde im Testaufbau behoben; die erneute Member-Abweisung ist fehlerfrei.
Die echte zentrale Anmeldung wurde dafür weder verändert noch nachgebaut.
