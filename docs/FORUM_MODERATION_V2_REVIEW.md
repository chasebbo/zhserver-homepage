# Forum-Moderation: dauerhaftes Löschen und Verschieben

**Nach ausdrücklicher Freigabe produktiv angewendet und lokal geprüft.**
Installierte Migration: `20261012183738_homepage_forum_moderation_v2`.
Die neue Homepage-Oberfläche ist weiterhin nur lokal; kein Commit, Push oder Deployment.
Bestehendes Supabase-Projekt `zhserver` / `yawadxzeyyrozmlrokun`.
Migration: `20261012170814_forum_moderation_v2.sql`.
Die ausdrückliche Freigabe lautete: „Ja, genau diese Migration anwenden und lokal prüfen“.
Keine Freigabe für zusätzliche Migrationen oder Veröffentlichungen daraus ableiten.
Weiterhin kein Commit, Push, Deployment oder Webexport.

## Geprüfter produktiver Bestand

Die installierte `moderate_zh_forum_topic()` setzt für Löschen lediglich `hidden`.
Anheften und Schließen sowie die Sortierung nach `pinned DESC` existieren bereits.
Verschieben und physisches Löschen fehlen. Der bestehende Fremdschlüssel
`posts_topic_id_fkey` hat bereits `ON DELETE CASCADE`.

Beim rein lesenden Audit waren zwei Themen und vier Beiträge vorhanden, davon
zwei Themen und ein Beitrag ausgeblendet. Diese Werte sind eine Momentaufnahme.
Es werden keine bisherigen Testthemen automatisch gelöscht oder wieder angezeigt.
Der Audit hat ausschließlich Funktionsdefinitionen, Constraints und Summen gelesen.
In der vorbereitenden Teilphase wurden produktiv keine Änderungen ausgeführt.

## Nach der Freigabe: installierter Bestand und echte Prüfung

- Alle acht ursprünglichen Funktionshashes und der Cascade-Fremdschlüssel erneut
  geprüft; kein Drift. Genau die freigegebene SQL-Datei einmalig angewendet,
  SHA256 `a5dc9a9ee387b8d8fdba0246a89a6505e2fb792d4a6b295eda46125afbea0b73`.
- Installation erfolgreich; öffentlicher Wrapper SECURITY INVOKER, private Funktion
  SECURITY DEFINER mit leerem search_path. PUBLIC/anon haben kein EXECUTE für v2.
  `get_zh_forum()` liefert `role_version=1`, `moderation_version=2`.
- Themen, Beiträge, Avatar-/Profilzusätze und zentrale Rollen unmittelbar vor/nach
  Migration per Datenhash unverändert. Vorhandene zwei Themen/vier Beiträge erhalten.
- Installierte echte RPCs unter `authenticated` mit bestehenden Member-/Admin-UUIDs
  geprüft: 20 erfolgreiche Rechte-/Funktionsassertions sowie drei echte physische
  Zeilenzählungen = 0 nach Löschung. Neue Prüf-Themen/Antworten innerhalb derselben
  Transaktion erzeugt, anschließend alles zurückgerollt. Keine bestehenden Inhalte,
  Rollen, Profile, Namen oder Accounts verändert; Datenhashes nach Rollback identisch.
- Member: eigene Erstellung/Antwort/Bearbeitung mit eigener UUID und Profilname,
  keine fremde Bearbeitung, kein direktes DELETE und keine Moderation. Namen,
  Rang-/Rollenmetadaten geben keine Rechte. Admin: fremde Bearbeitung im geschlossenen
  Thema, Move/Listing, Pin/Unpin/Sortierung, Close/Open, physisches Reply-DELETE und
  Topic-DELETE mit vollständiger Cascade. Falsches UUID-Paar/Eröffnungsbeitrag,
  ungültige Kategorie und DELETE ohne true abgewiesen. Öffentliche Profil-Allowlist
  erhalten, keine E-Mail. Keine neue Rollen- oder Accountmigration.
- PostgREST über HTTPS: Lesen HTTP 200 mit Capability 2. Neue RPC registriert,
  kein 404; anonyme Moderation korrekt HTTP 401 / 42501. CORS für Port 5500 korrekt.
  Sicherheitsadvisor vor/nach identische Befunde, keine neue Warnung.
- Echte vorhandene lokale cHa-Sitzung automatisch erkannt; kein erneuter Login und
  keine Sessionkopie. Forum auf Port 5500 mit echten Rollen/Avataren und aktivierten
  Buttons/Kategorieauswahl, DE/EN, Desktop 1280/Mobile 390 und Reload geprüft.
  Löschdialoge über Abbrechen/Esc geschlossen, bestehende Inhalte nicht gelöscht.
  Eigenes Profil mit cHa/ZH-Admin, privater E-Mail und geladenem Avatar sowie
  bestehender Admin-Dashboard-Zugang zusätzlich ohne neue Anmeldung bestätigt.
  Die vollständigen bestätigten UI-Delete-Abläufe aus der isolierten Prüfung bleiben
  gültig; echte Datenbank-Löschung wurde zusätzlich im beschriebenen Rollbacktest geprüft.
- Kleine lokale Sessionkorrektur: eine erneute Prüfung derselben Identität schließt
  den Löschdialog nicht; echter Accountwechsel tut dies weiterhin. Fehler bleiben im
  offenen Dialog bzw. nach Sessionwechsel im Thema sichtbar. Drei gezielte Tests bestanden.
- Native UI-Dateien auf Port 5500 HTTP 200; Browser-JS-/Consolefehler 0. Keine neuen
  horizontalen Überläufe, Footer unverändert. Fremde Working-Tree-Dateien unverändert.
- Nachweise `installed-rpc-regression.sql`, `applied-validation.json`,
  `postgrest-validation.json`, `session-dialog-validation.json` und neue echte
  Desktop-/Mobilebilder außerhalb Git im bisherigen Prüfverzeichnis.
- **STOPP nach Prüfung. Kein Commit, Push, Deployment oder Webexport.**

## Exakter Migrationsumfang

| Objekt | Änderung | Bestehende Datenzeilen bei Anwendung |
| --- | --- | --- |
| `zh_forum_private.moderate_v2(uuid,text,boolean,uuid,text)` | Neue private Moderationsfunktion mit Rollenprüfung und begrenzten Aktionen | 0 |
| `public.moderate_zh_forum_topic_v2(uuid,text,boolean,uuid,text)` | Neuer öffentlicher SECURITY-INVOKER-Wrapper, EXECUTE nur für authenticated | 0 |
| `zh_forum_private.write_post(...)` | Ausschließlich konsistente Sperrreihenfolge im Bearbeitungszweig: Thema vor Beitrag | 0 |
| `public.get_zh_forum(text,uuid,integer,integer)` | Zusätzliches Capability-Feld `moderation_version: 2`; bisherige Antwort und `role_version: 1` erhalten | 0 |

Keine neuen Tabellen, Spalten, Policies, Rollen oder Profilstrukturen. Keine Änderung
an Auth, Session, Account-UUID, Rollenzuordnung, Rang, Avatarbucket, Besucherzählung,
Presence, Abstimmungen, Gästebuch, Galerie, Spiel oder Dedicated.

Acht Fingerprint-Prüfungen sichern den tatsächlich gelesenen Funktionsbestand ab.
Die Migration bricht bei abweichenden Definitionen, vorhandener v2-Funktion oder
fehlendem Cascade-Fremdschlüssel ab. Alles erfolgt in einer Transaktion. Abschließend
wird nur der PostgREST-Schemacache zum Neuladen benachrichtigt.

Der bisherige Moderations-Endpoint bleibt für den noch ausgelieferten älteren
Homepage-Code bestehen. Die neue Forumoberfläche verwendet nach `moderation_version=2`
ausschließlich die neue RPC. Ohne diese Capability bleiben dauerhaftes Löschen und
Verschieben deaktiviert; Anheften/Schließen verwenden weiterhin die vorhandene RPC.
Es gibt keine neue Wiederherstellungsaktion im Forum. Bereits physisch gelöschte
Zeilen können auch durch die alte Flag-RPC nicht wieder erzeugt werden.

## Tatsächliche DELETE-Statements

Die folgenden Statements stehen **innerhalb der neuen Funktionsdefinition**.
Das Installieren der Funktion führt sie nicht aus. Erst eine spätere, ausdrücklich
bestätigte Aktion eines angemeldeten Administrators ruft sie auf:

```sql
delete from zh_forum_private.topics where id=p_topic_id;
```

Das entfernt genau das ausgewählte Thema. Der bereits bestehende Fremdschlüssel
entfernt dessen Eröffnungsbeitrag und alle Antworten, einschließlich ausgeblendeter
Beiträge. Andere Themen, Accounts, Profile und Spielinhalte sind nicht betroffen.

```sql
delete from zh_forum_private.posts
where id=p_post_id and topic_id=p_topic_id and not opener;
```

Das entfernt genau eine Antwort im angegebenen Thema. Falsche Thema-/Beitragspaare
und Eröffnungsbeiträge werden abgewiesen. Danach wird die letzte Aktivität des
Themas aus den verbleibenden sichtbaren Beiträgen berechnet.

Kein `DROP`, `TRUNCATE`, `DELETE` außerhalb der Funktionsdefinition oder `UPDATE`
ohne WHERE in der Vorwärtsmigration. Kategorien-/Status-/Aktivitätsupdates betreffen
nur die ausgewählte Themen-UUID. Physisches Löschen erfordert zusätzlich
`p_value=true`. Ungültige Aktionen, Kategorien und Parameter werden abgewiesen.

## Berechtigungen und Parallelität

- Die Autoren-/Accountidentität stammt weiterhin aus `auth.uid()`.
- Adminprüfung unverändert über `zh_identity_private.current_is_admin()` und die
  private zentrale `account_roles.system_role='admin'`-Zuordnung.
- Anzeigename, E-Mail, `user_metadata` und Rang kommen nicht in die Rechteprüfung.
- Neue Funktionen: PUBLIC-/anon-EXECUTE entzogen; nur authenticated darf aufrufen,
  jeder Aufruf prüft dennoch gültigen Account und Adminrolle serverseitig.
- Keine direkten Tabellenrechte für normale Frontend-Clients.
- Themen-Rowlock serialisiert Verschieben, Schließen, Antworten und Löschen.
  Die angepasste Bearbeitung sperrt ebenfalls zuerst das Thema und danach den
  Beitrag; damit kollidiert sie nicht mit einer kaskadierenden Themenlöschung.
- Normale Member können in geschlossenen Themen nicht antworten. Admins können
  weiterhin bearbeiten und moderieren. Antworten werden erst nach Wiederöffnung
  wieder angenommen; die bestehende Schreibregel bleibt erhalten.

## Oberfläche

Kompakter Moderationsbereich: Anheften/Anheftung lösen, Auswahl einer bestehenden
Zielkategorie plus Verschieben, Schließen/Wieder öffnen, Thema dauerhaft löschen.
Antworten erhalten Bearbeiten und für Admins dauerhaftes Löschen. Keine Piktogramme.
Nach Themenlöschung wird die Kategorie geöffnet; nach Antwortenlöschung wird das
Thema neu geladen. Kategorien-/Profil-Caches werden invalidiert.

Native HTML-Dialoge mit DE/EN-Titel „Thema dauerhaft löschen?“ / „Antwort dauerhaft
löschen?“ erklären die Unwiderruflichkeit und bei Themen alle zugehörigen Antworten.
Standardfokus auf Abbrechen, Esc möglich, keine Lösch-RPC vor Bestätigung. Die
Bestätigung ist an Thema und eigene Session gebunden; Navigation/Sessionwechsel
schließen sie. Laufende Aktionen sind gegen Mehrfachklicks gesperrt.

## Lokale Prüfung und klare Grenze

37 Prüfungen mit dem vollständigen SQL-Kandidaten in isoliertem lokalem PostgreSQL
(PGlite), den tatsächlichen gelesenen Funktionsdefinitionen und ausschließlich
eigens erzeugten Prüfdaten bestanden. Darunter echte physische Löschung/Cascade,
Move/Persistenz, Pin-Sortierung, Close/Open, fremde Adminbearbeitung, Member-/Gast-
Sperren, manipulierte Namen/Metadaten ohne Rechte, unveränderte Autoren, sofortige
Rollenaberkennung, Datenbank-Neustart und funktionaler Rollback ohne Wiederherstellung
gelöschter Daten. Keine SQL-Tests gegen produktive Daten ausgeführt.

Browserprüfung mit denselben Homepage-Dateien und isolierter lokaler PostgreSQL-
Anbindung: tatsächliche UI-Aktionen, Abbrechen/Esc, bestätigte Antwort-/Themenlöschung,
Kategorie-Rückkehr, Reload, Member-Ansicht, DE/EN, Desktop 1440, Tablet 768, Mobile
390/360. Keine horizontalen Überläufe; Browser-JS-/Consolefehler 0. Prüfdaten/Session-
Provider und Prüfserver liegen ausschließlich außerhalb Git und sind klar gekennzeichnet.
Der bestehende Homepage-Server auf Port 5500 liefert die geänderten Dateien.

Nachweise außerhalb des Repositorys: `forum-moderation-20261012` im bestehenden
Codex-Prüfverzeichnis; SQL-Bericht, Backend-Ausgangsstand und Desktop-/Mobilebilder.
Supabase-/PostgREST- und echte lokale Prüfungen nach der Freigabe sind oben dokumentiert.
Das Backend ist aktiviert. Die neue Oberfläche wurde noch nicht veröffentlicht.

## Rücknahme

`forum_moderation_v2_rollback.sql` stellt die zwei bestehenden Funktionsdefinitionen
wieder her und entfernt ausschließlich die beiden neu angelegten Funktionen.
Kein DROP CASCADE, keine Tabelle oder Datenzeile wird dabei gelöscht. Vor einer
späteren Rücknahme den dann aktuellen Funktionsbestand auf weitere Änderungen
prüfen; keine zwischenzeitlichen Anpassungen blind überschreiben.

Diese technische Rücknahme kann **keine dauerhaft gelöschten Forumdaten** zurückbringen.
Deren Wiederherstellung wäre nur aus einem tatsächlichen Datenbankbackup möglich.
Im normalen Forum gibt es absichtlich keine Wiederherstellung.

## Ursprünglicher Ablauf nach der separaten Freigabe (abgeschlossen)

1. Hashes/Constraints erneut lesen und Migration einmalig im bestehenden Projekt
   anwenden. Bei Drift stoppen und prüfen.
2. Den installierten Wrapper, ACLs, `moderation_version=2` und Schemacache prüfen.
3. Lokalen Homepage-Test auf Port 5500 mit echter Adminsession und ausdrücklich
   gekennzeichneten Wegwerf-Testinhalten; Membergrenzen ohne Accountänderungen prüfen.
4. Ergebnis dokumentieren und STOPP. Kein Commit, Push oder Deployment daraus ableiten.
