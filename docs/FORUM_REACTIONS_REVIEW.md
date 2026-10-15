# Forum: größere Klickflächen und Reaktionen – 15.10.2026

Status: Nach ausdrücklicher Nutzerfreigabe am 15.10.2026 im bestehenden Projekt
angewendet: Migration `20261015081259_homepage_forum_reactions`. Exakt das
freigegebene Vorwärtsskript verwendet (SHA256
`9a863406de4013489a799f412bf51d7f3e12c14643c9965d678827d332972045`).
Die Anbindung ist auf Port 5500 mit dem echten Backend geprüft. **Frontend noch
nicht veröffentlicht; kein Commit, Push, Deployment oder Webexport.**

## Tatsächlich geprüfter Bestand

Rein lesend im vorhandenen Projekt `zhserver` / `yawadxzeyyrozmlrokun` geprüft:
Startbeiträge und Antworten sind beide Zeilen in `zh_forum_private.posts`;
`opener=true` kennzeichnet den Startbeitrag. `posts.topic_id` verweist bereits
mit `ON DELETE CASCADE` auf `topics.id`. Beide Tabellen sind privat, RLS aktiv,
keine direkten SELECT-/INSERT-Rechte für `anon`/`authenticated`. Keine vorhandene
Reaktionstabelle gefunden. Der aktuelle Lese-RPC enthält Rollen-, Moderations-
und Views-Versionen; diese bleiben erhalten. Zentrale Rollenfunktion und aktueller
Lese-Wrapper sind vor der Migration per Definition-Hash gegen Drift geschützt.

## 1. Verwendetes Datenmodell

Eine neue private Tabelle `zh_forum_private.post_reactions`:

| Feld | Bedeutung |
| --- | --- |
| `post_id uuid` | FK auf vorhandene `posts.id`, `ON DELETE CASCADE` |
| `user_id uuid` | FK auf `auth.users.id`, `ON DELETE CASCADE` |
| `reaction smallint` | ausschließlich `1` oder `-1` |
| `created_at`, `updated_at` | serverseitige `timestamptz` |

Primärschlüssel `(post_id,user_id)` = höchstens eine aktive Reaktion pro Account
und Beitrag. Keine Bewertung = keine Zeile. Kein `target_type` nötig, weil Thema/
Startbeitrag und Antwort bereits dieselbe kanonische Beitrags-ID verwenden.
Primärschlüssel unterstützt Zählungen pro Beitrag; separater Index auf `user_id`
unterstützt Account-Löschkaskaden. Keine bisherigen Besuchs-/View-Zähler verwenden.

## 2. Rechte und neue RPCs

RLS aktivieren und alle direkten Clientrechte an der neuen Tabelle entziehen.
Keine offenen Tabellen-Policies, keine neue öffentliche Profil-/Benutzertabelle.
Das bereits verwendete Modell aus privater Tabelle, begrenzten internen Funktionen
und öffentlichen `SECURITY INVOKER`-Wrappern bleibt bestehen. Die beiden internen
Funktionen benötigen kontrollierten `SECURITY DEFINER`-Zugriff auf die private
Tabelle, leeren `search_path` und ausdrücklich begrenzte EXECUTE-Rechte.

- `get_zh_forum_reactions(p_post_ids uuid[])`: `anon` und `authenticated`.
  Maximal 50 eindeutige Zielbeiträge pro Batch (Eingabebatch maximal 50 IDs).
  Nur nicht versteckte Beiträge in nicht versteckten Themen. Liefert `post_id`,
  Like-/Dislike-Summe, eigene aktive Reaktion sowie eine serverseitig bestätigte
  `can_react`-Angabe. Keine fremden Reaktionszeilen, Benutzerlisten oder E-Mails.
- `set_zh_forum_reaction(p_post_id uuid,p_reaction integer)`: nur `authenticated`.
  Benutzer ausschließlich `auth.uid()`; echte zentrale Rolle `member`/`admin`
  aus der vorhandenen Funktion. Anonyme Auth-Nutzer, gelöschte/unbekannte Accounts
  und Gäste dürfen nicht schreiben. Kein Name/Metadatenwert als Berechtigung.
  Ein gültiger registrierter Account benötigt für eine Reaktion keinen öffentlichen
  Anzeigenamen. `1` = Like setzen, `-1` = Dislike setzen, `0` = eigene Reaktion entfernen.
  Wiederholtes Setzen desselben Werts ist idempotent. Die aktuelle eigene UI-Reaktion
  entscheidet, ob ein erneuter Klick `0` sendet; kein blindes serverseitiges Toggle.
- Interne Gegenstücke: `zh_forum_private.read_reactions(uuid[])` und
  `zh_forum_private.set_reaction(uuid,integer)`.

Schreibzugriff sperrt das Thema vor dem Beitrag, passend zur bestehenden Moderation.
Ein transaktionsbezogenes Advisory-Lock pro Account/Beitrag serialisiert gleichzeitige
Anfragen auch dann, wenn noch keine Reaktionszeile existiert. Zusätzlich schützt
der eindeutige Primärschlüssel vor Doppelzählung. Öffentliche geschlossene Themen
bleiben bewertbar; die vorhandene Antwortsperre wird nicht geändert.

## 3. Betroffene bestehende Objekte und Daten

- `public.get_zh_forum(text,uuid,integer,integer)`: ausschließlich zusätzliche
  Capability `reactions_version=1` im vorhandenen Wrapper. Signatur, bestehende
  Payload, Rollen-/Moderations-/Views-Versionen und Grants bleiben erhalten.
- `zh_forum_private.posts`, `topics`, `auth.users`: vorhandene Elternreferenzen;
  keine Spalten, Rollen, Policies, Inhalte oder Zeitstempel dieser Tabellen ändern.
- Keine bisherigen Themen, Antworten, Accounts oder Stimmen werden bei der
  Migration angelegt, umbenannt, gelöscht, verschoben oder künstlich rekonstruiert.
- Ein später bestätigtes dauerhaftes Löschen eines Beitrags/Themas entfernt über
  die FK-Kaskade nur seine neuen Reaktionszeilen mit. Account-Löschung entfernt
  dessen Reaktionen. Vorhandene Moderations-RPCs werden nicht ersetzt.
- `DELETE` im neuen Schreibfunktionskörper ist ausschließlich das spätere Entfernen
  der eigenen Reaktion mit `WHERE post_id=... AND user_id=auth.uid()`.
  Die Migration selbst ruft diesen Körper nicht auf. Kein DROP/TRUNCATE im Vorwärtsskript.
- Keine Speicherung/Änderung an GAME, Dedicated, Wiki, Besucher-/Presence-/Views-
  Daten, Top-5-Sortierung oder Last-Activity-Zeitstempeln.

## 4. SQL und Rücknahme

- Vorwärts: `docs/20261015073229_homepage_forum_reactions.sql`.
  Dateiname vom vorhandenen Supabase-CLI erzeugt; zuerst in PGlite geprüft,
  nach Freigabe unverändert über `apply_migration` angewendet. Der MCP-Eintrag
  trägt die Ausführungskennung `20261015081259`.
- Daten erhaltend deaktivieren: `docs/forum_reactions_disable.sql`. Stellt den
  exakt geprüften alten Lese-Wrapper wieder her und entzieht die neuen EXECUTE-
  Rechte. Alle Reaktionen bleiben gespeichert. Drift-Guard verhindert das
  Überschreiben einer inzwischen weiterentwickelten Lese-RPC.
- Vollständig entfernen: erst deaktivieren; neue Reaktionsdaten bei Bedarf
  exportieren und gesondert freigeben lassen. Danach ausschließlich die beiden
  neuen Wrapper, die zwei neuen internen Funktionen und die neue Reaktionstabelle
  entfernen. Niemals `posts`, `topics`, Profile, Rollen oder Auth-Accounts droppen.
  Ohne gesonderte Freigabe keine Reaktionsdaten löschen. Eine produktive Rücknahme
  ist ebenfalls keine automatisch autorisierte Aktion.

## Lokales Frontend und Prüfung

`forum-links.js` erweitert vorhandene Themen-/Top-5-Zeilen um Fokus, Enter/Space
und Klickweiterleitung auf den unveränderten Titellink. Verschachtelte Links,
Buttons, Eingaben, Labels, Dropdowns und editierbare Inhalte sind ausgenommen.
Kein View-Aufruf im Helfer; nur die bereits vorhandene Thread-Route registriert.

`forum-reactions.js` aktiviert die kompakte Anzeige im Startbeitrag und in Antworten
erst nach `reactions_version=1`. Solange diese Capability fehlt: keine neuen RPC-
Aufrufe, keine Fake-/Demo-/Nullzähler und keine scheinbar funktionierenden Buttons.
Nach Aktivierung kommen alle Counts und die eigene Reaktion vom Backend. Gäste
erhalten beim Klick den DE/EN-Anmeldehinweis. SDK/Session werden wiederverwendet;
kein zweiter Login. localStorage enthält nur ein Tab-Benachrichtigungssignal,
keine Reaktion, Counts oder Ersatz-Identität; Reload/Tab holt den Serverstand.

Isoliert bestanden: 36 SQL-Prüfungen einschließlich Guest/Member/Admin,
Idempotenz, Unlike/Undislike, Wechsel, Zugriff auf fremde Reaktionen, direkte
Tabellenzugriffe, echte Nullwerte, versteckte Ziele, Löschkaskaden und Daten
erhaltende Deaktivierung; 25 Frontendprüfungen einschließlich Kontroll-Ausnahmen,
Tastatur, Gast-Hinweis, Loginwechsel und zweitem Tab. Keine Produktionstestdaten.
Diese isolierten Nachweise wurden nach Freigabe durch die folgende echte
Backend-/Browserprüfung ergänzt.

Echter Browser lokal auf Port 5500: alle sechs gewünschten Themen-Klickflächen,
Enter/Space, Top-5-Zeitfläche, Autorenprofil-/Kategorieausnahmen, Mobile-Touchziel.
1440/768/390/360 in DE/EN ohne horizontalen Überlauf. Views beim Reload: 8 -> 8.
Details/Screenshots außerhalb Git: `forum-reactions-20261015` im bisherigen
Visualisierungsverzeichnis. Keine bestehenden Beiträge bearbeitet/moderiert.

## Prüfung nach produktiver Freigabe

- Bestehende zentrale Anmeldung im sichtbaren lokalen Formular verwendet.
  Die bereits offene Forumseite erkennt die Sitzung ohne zweiten Forumlogin.
  Echter Browser: Like, Unlike, Dislike, Undislike, Wechsel in beide Richtungen,
  Startbeitrag und Antwort getrennt. Aktive Reaktion bleibt nach Reload und in
  einem zweiten Tab erhalten; eine Zeile für die zentrale Account-UUID bestätigt.
- Gast sieht echte Summen, erhält beim Klick den neutralen DE/EN-Hinweis und
  kann nicht schreiben. Ein bestehender normaler Member wurde zusätzlich mit
  seiner UUID und der Datenbankrolle `authenticated` gegen die produktiven RPCs
  geprüft: Like, Wiederholung, Wechsel und Entfernen bestanden. Diese gesamte
  Member-Testtransaktion wurde zurückgerollt; kein neuer Account oder Passwort.
  Kein separater echter Member-Browserlogin behauptet.
- Reaktionen aus dem echten Admin-Browsertest wieder regulär entfernt. Danach
  0 Testreaktionen, 0 verwaiste Reaktionen und insgesamt 0 Reaktionszeilen.
  Die bisherigen vier Themen und sieben Beiträge samt IDs bestehen unverändert.
  Zentrale Rollenfunktion weiterhin identischer Hash; bestehender Admin bleibt
  `admin`. Keine Accounts, Inhalte, Rollen oder Moderationszustände geändert.
- Die beiden öffentlichen Wrapper sind `SECURITY INVOKER`, private Helfer haben
  leeren `search_path`; RLS aktiv, keine direkten Tabellenrechte, Gast-Schreib-RPC
  gesperrt. Öffentliche Daten sind Summen, Zielbeitrags-ID und eigene Reaktion;
  keine E-Mail oder fremden Benutzerlisten.
- Sicherheitsadvisor: keine neue WARN-/ERROR-Meldung. Eine zusätzliche
  [INFO zu RLS ohne Policy](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy)
  ist bei dieser privaten Tabelle beabsichtigt: direkter Zugriff bleibt gesperrt,
  der Zugriff erfolgt ausschließlich über die begrenzten RPCs. Vorbestehende
  fremde Hinweise wurden nicht verändert.
- Echte UI mit geladenen Zahlen: 1440, 768, 390 und 360 px jeweils DE/EN;
  alle vier Reaktionsbuttons sichtbar, keine abgeschnittenen Buttons und kein
  horizontaler Overflow. 0 Browser-/Consolefehler bzw. Warnungen bei der Prüfung.
  Neue Screenshots: `reactions-desktop-DE.jpg`, `reactions-mobile-DE.jpg`.
  Nachweise: `production-migration-validation.json`,
  `production-responsive-validation.json`, `production-browser-validation.json`.

Grundlagen geprüft: [Supabase Database Functions](https://supabase.com/docs/guides/database/functions),
[PostgreSQL Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html),
[PostgreSQL Explicit Locking](https://www.postgresql.org/docs/current/explicit-locking.html).

**STOPP zur lokalen Abnahme. Kein Commit, Push, Deployment oder Webexport.**
