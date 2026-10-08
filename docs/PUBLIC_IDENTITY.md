# Zentrale Anzeigename-Schicht – Stand 07.10.2026

Im bestehenden Supabase-Projekt `zhserver` aktiviert. Keine zweite Anmeldung,
keine zweite Profiltabelle, keine neue Rollenstruktur. Frontend nur lokal,
kein Commit, Push oder Webexport.

## Daten und Zugriffsgrenzen

- `profiles.display_name` bleibt die einzige Quelle für Account-Namen.
  Die vorhandene RLS-Regel „read own profile“ bleibt unverändert.
- `get_zh_own_identity()`: nur mit gültiger Anmeldung; kein Account-Parameter.
  Antwort enthält ausschließlich `display_name` und `created_at` des eigenen
  Accounts. Besitz/Identität kommen aus `auth.uid()`, niemals aus Client-Namen
  oder `user_metadata`. Anonyme Auth-Accounts sind keine registrierten Mitglieder.
- `get_zh_newest_member()`: Gäste und Mitglieder erhalten ausschließlich
  `display_name` und `created_at` des zuletzt registrierten, nicht gelöschten,
  nicht anonymen Auth-Accounts. Auswahl erfolgt vor der Namensprüfung.
  Fehlender/ungültiger Name oder Profil: Name bleibt null; kein älterer Ersatz.
- `created_at` ist das Registrierungsdatum in `auth.users`; Profil-Erstellung
  kann zeitlich davon abweichen.
- Keine E-Mail, UUID, Rolle, Adminflag, Auth-Metadaten oder private Spiel-/Profil-
  Felder in diesen RPC-Antworten. Die öffentliche Profiltabelle bleibt nicht lesbar.
- Private Helfer liegen im nicht per PostgREST exponierten Schema
  `zh_identity_private`. Definer-Funktionen haben leeren `search_path`,
  qualifizierte Tabellenzugriffe und gezielte EXECUTE-Grants.
- Namen werden getrimmt, müssen 1–80 Zeichen lang sein und dürfen keine E-Mail,
  UUID oder Steuerzeichen sein. Kein E-Mail-/Metadaten-Fallback.

## Footer

Die bestehende `get_zh_community_stats()` übernimmt nur den neuen Namensadapter.
Zählung, Online-Zeitfenster, Heartbeat, Accountzahl und Besucherstatistik bleiben
unverändert. Tatsächliche Leseprüfung: neuestes Mitglied `trux`, 11 Accounts.

Account-Reset bleibt im gemeinsamen Footer klein in Gold:
DE `ACCOUNT-RESET: 15.07.2026`, EN `ACCOUNT RESET: 15/07/2026`.
Alle Seiten mit dem globalen Footer verwenden dieselbe vorhandene Anzeige.

## Gästebuch und Galerie

`identity.js` verwendet den bestehenden Supabase-Client und SDK-Sitzungsspeicher
der Homepage/Admin-Anmeldung. GetSession wird zusätzlich mit GetUser bestätigt;
der eigene Name kommt aus der geschützten Identitäts-RPC. Auth-Callbacks bleiben
synchron, Profile werden anschließend geladen; veraltete Ergebnisse dürfen nach
Logout keine alte Identität wiederherstellen.

Mitglieder sehen einen kompakten Anmeldestatus statt einer freien Namenseingabe.
Gäste behalten ihre bisherige manuelle Namenseingabe. Fehlender Anzeigename:
ehrlicher Hinweis und gesperrtes Schreiben. Nutzertexte werden nicht übersetzt.

BEFORE-INSERT-Trigger setzen authentifizierte Autoren serverseitig auf den eigenen
Profilnamen und halten neue Inhalte in der bestehenden Freigabe. AFTER-INSERT-
Trigger speichern `auth.uid()` in der ausschließlich privaten Tabelle
`zh_identity_private.content_authors` mit Fremdschlüssel zum Gästebuch- bzw.
Galerieeintrag. Öffentliche Content-Tabellen bekommen keine neue Account-ID-
Spalte: bestehende öffentliche SELECT-*-/Admin-Abläufe bleiben kompatibel.
Alte Gastbeiträge werden nicht nachträglich Accounts zugewiesen.

Die zusätzliche Gästebuch-INSERT-Policy erlaubt angemeldeten Mitgliedern
moderierte Einträge. Bestehende SELECT-/UPDATE-/DELETE- und Storage-Regeln bleiben
gleich. Admin-Anmeldung, Admin-ID, Signup-Trigger und Spielprofildaten unverändert.

## Forum und offene Punkte

Das vorhandene Forum besitzt weiterhin Kategorien, Navigation, lokale Entwürfe
und Beitragsvorschau. Seine Autorenanzeige nutzt dieselbe zentrale Identität.
Gäste lesen; Entwurf-Eingabe/Speichern/Vorschau erfordern lokal eine bestätigte
Identität. Gespeicherte Entwürfe bleiben bei Logout erhalten.

Keine produktiven Forum-Themen-/Beitragstabellen oder Veröffentlichungs-RPCs
angelegt. Veröffentlichung, Antworten und echte Autorenzuordnung für Forum-
Beiträge sind nächste eigene Teilphase; nicht als arbeitende Serverfunktion
dargestellt. Die neue private Namensprüfung ist dafür wiederverwendbar.

Für Accounts ohne Profil/gültigen Namen bleibt Schreiben gesperrt. Eine gemeinsame
Oberfläche zum sicheren Festlegen des Anzeigenamens fehlt noch. Insbesondere hat
der bestehende Adminaccount im geprüften Bestand kein `profiles`-Profil; seine
bestehende Anmeldung und Moderationsrechte bleiben unabhängig davon erhalten.
Es wurde kein Profil automatisch erzeugt oder mit einem erfundenen Namen versehen.

## Prüfung und Nachweise

- Produktive RPC-Leseprüfungen: öffentliche Felder exakt Name/Registrierungsdatum,
  Profiltabelle für Gäste leer, eigene RPC ohne Session verweigert, privates Schema
  nicht exponiert, fremder Account-Parameter nicht unterstützt.
- Tatsächliche RLS-/Trigger-Tests als Member/Gast in SQL-Transaktion mit ROLLBACK:
  manipulierte Namen werden kanonisch überschrieben, Ownership nur intern,
  neue Inhalte bleiben unfreigegeben, Gastname erhalten, fehlendes Profil blockiert.
  Negative explizite Content-IDs umgehen Sequenzverbrauch. Keine Testdaten behalten.
- SHA/SQL-Vergleich: Profile, Signup, bestehende Gästebuch-/Galeriezeilen und deren
  Sequenzen unverändert. Bestehende Policies und Funktionen bis auf den gezielten
  Community-Namensadapter unverändert. Besucher-/Presence-Logik nicht geändert.
- Isolierter Chrome mit echtem Supabase-SDK und simulierten Auth-/Schreibantworten:
  Login während offener Seite, gemeinsamer Speicher, Reload, Logout, zweiter Tab,
  fehlender/ungültiger Name, manipuliertes Formular und doppelte Submission,
  Member-/Gast-Upload, Forum-Entwurf und unveränderte Nutzertexte.
- 18 DE/EN-Ansichten auf Startseite/Galerie/Forum bei 1440, 768, 390 px,
  kompakte Darstellung, kompletter Footer und Besucherwerte; Screenshots gesichtet.
  80-Zeichen-Name auf Mobile und „—“ für namenloses neuestes Mitglied geprüft.
- Langsame Profilantwort nach Logout kann die alte Identität nicht zurücksetzen.
  Logout während laufendem Upload verhindert eine Zuordnung zu einem anderen
  Account; Datei und Beschreibung bleiben zur erneuten Übermittlung erhalten.
  JS-/Console-/HTTP-/Request-Fehler im normalen Browserablauf jeweils 0,
  horizontaler Überlauf 0. Erwartete API-Zugriffsverweigerungen separat ausgewertet.
- Advisor: keine neue WARN-/ERROR-Meldung durch die Identitätsschicht.
  Der INFO-Hinweis „RLS enabled, no policy“ für die private Ownership-Tabelle ist
  absichtlich korrekt: kein direkter Zugriff für anon/authenticated.
  [Supabase-Linter-Erklärung](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy).
- `node --check` für die fünf geänderten JS-Dateien und `git diff --check` sauber.

SQL: `public_identity_prepare.sql`, `ugc_identity_prepare.sql`.
Angewandte Migrationen: `homepage_minimal_public_identity` (`20261007161504`)
und `homepage_shared_content_authors` (`20261007161545`).
Cache-Versionen der betroffenen HTML-Script-Einbindungen auf `20261007-identity`
angehoben, damit die neue lokale Anbindung keine älteren Auth-/Text-Scripte lädt.
Außerhalb des Repos: `C:/Users/sebbo/AppData/Local/Temp/zhserver-identity-20261007/`
mit Backend-Audit, Rollback-Test, API-/Browserbericht und Erhaltungsnachweisen.

Erhaltungsabgleich: 678 der 691 Ausgangsdateien bytegleich; elf vorgesehene
Homepage-/Dokumentationsdateien geändert und fünf neue Dateien dieser Phase.
Zusätzlich liegen zwei aktualisierte Wiki-Datendateien und 13 neue Garage-Wiki-
Grafiken aus anderen Arbeiten vor. Diese wurden hier weder bearbeitet noch
zurückgeschrieben. Besucher-/Presence-Scripte und alle vorhandenen game/-Dateien
bytegleich; HEAD/Staging unverändert. Spielprojekt nicht geöffnet/bearbeitet.
