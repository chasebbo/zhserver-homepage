# Offizieller Forum-Changelog – Umsetzung und Produktivnachweis

## Gesamtblock abgeschlossen – 15.10.2026

Die ausdrücklich freigegebenen produktiven Migrationen sind angewendet:
- 20261015122923_homepage_official_forum_changelog (Quelle: 20261015083510_homepage_official_forum_changelog.sql).
- 20261015123435_homepage_pulse_delete (Quelle: 20261015123154_homepage_pulse_delete.sql; eigene konkrete Freigabe erhalten).
Die bereits installierte Reaktionsmigration wurde NICHT erneut ausgeführt.

14 offizielle Einträge mit 206 Originalpunkten sind unter cHas bestehender zentraler UUID importiert. Alle Klartextinhalte und Originalquell-Hashes stimmen mit der fertigen Inventur überein. Datumsliste ausdrücklich vom Nutzer für diesen Import festgelegt, keine neu recherchierten oder behaupteten Original-Veröffentlichungsdaten: 0.1.1=15.07., 0.1.2=22.07., 0.1.3=29.07., 0.1.4=05.08., 0.1.5=12.08., 0.1.6=19.08., 0.1.7=26.08., 0.1.8=02.09., 0.1.9=09.09., 0.2.0=16.09., 0.2.1=23.09., 0.2.2=30.09., 0.2.3=07.10., unversioniertes Update=14.10.2026.

Die ausdrücklich unversionierte Quelle bleibt ohne erfundene Versionsnummer. Dafür akzeptiert das geprüfte Metadaten-CHECK eine leere Version ausschließlich mit vorhandener Importquelle; normales generisches Topic-Erstellen kann die offiziellen Regeln nicht umgehen. Source-Key und Hash bleiben erhalten, identische Importwiederholung wurde ohne Dubletten geprüft. Berlin-Datum statt Importzeit. Nur bestehende Publisher-UUID UND echte zentrale Adminrolle dürfen offizielle Inhalte veröffentlichen/bearbeiten. Keine Replies/Kommentare/Dislikes; derselbe bestehende Like-RPC, unveränderte Views. Top 5 bleibt nach Diskussionen/Aktivität sortiert.

game-development.html enthält keine ausführliche oder kopierte kompakte Changelog-Historie mehr, sondern einen DE/EN-Hinweis mit direktem Forumlink. Die kleine Spielseiten-Vorschau liest ihre vier Punkte und Alpha-Version aus dem Forum; Roadmap bleibt am bisherigen Ort. Kein zweiter vollständiger Pflegebestand. Archivierte Originalquellfragmente in der Inventur bleiben als Importbeleg erhalten.

Mobiler globaler Header: Anmelden UND Registrieren direkt sichtbar, ohne geöffnetes Menü. Dieselbe zentrale Session-/Accountlogik; angemeldete Ansicht unverändert. Geprüft 430/390/360 in DE/EN, ohne Overflow. Gastprüfung auf temporärem Port 5503 mit unveränderten echten Repository-Dateien; cHas vorhandene echte Sitzung auf Port 5500 wurde dafür nicht abgemeldet oder kopiert.

Pulse-Admin: endgültige Löschung mit benannter Umfrage, eindeutiger Warnung und Abbrechen/Bestätigen. Rollenprüfung und Zeitstempelkonflikt serverseitig, Löschkaskaden nur für diese Umfrage/Optionen/Stimmen. Vorhandene drei Umfragen mit sechs Optionen und vier Stimmen beim Test unverändert. Echte Löschtests auf installierten Produktionsfunktionen ausschließlich mit uncommitteten Testdaten in einer zurückgerollten Transaktion. Keine öffentlichen Testumfragen hinterlassen. Browserdialog DE/EN mit echter cHa-Sitzung geöffnet und abgebrochen; endgültige UI-Aktion zusätzlich isoliert getestet. Offene Homepage aktualisiert bei Tab-Rückkehr oder Admin-Änderung und behält eine weiterhin vorhandene aktuelle Frage samt Ergebniszustand. Hero-/Karten-CSS nicht verändert.

Forum-Namen UND Rollenlabel: Admin Bordeaux, Member Marineblau, kleiner langsamer 12-Sekunden-Glow. Einheitlicher Name-Helfer verwendet ausschließlich system_role aus dem bestehenden Backend. Kategorien, Themen, Startbeitrag, Antworten, letzte Autoren, Top 5, Communityzeile und öffentliches Profil berücksichtigt. Bestehende spezifischere Threadstyles bei der echten Sichtprüfung korrigiert. Reduced-motion-Regel statisch geprüft: keine Animation, Farbe/Glow bleiben. Browserprobe mit echten Anni-Member- und cHa-Admin-Beiträgen, öffentliche E-Mail weiterhin nicht sichtbar.

Prüfungen: 48 isolierte Changelog-SQL-, 61 Changelog-UI-, 25 normale Reaktions-/Klickflächen-, 15 Pulse-SQL-, 12 Admin-UI- und 8 Homepage-Pulse-Prüfungen bestanden. Echte Produktions-RPC-Prüfung mit bestehender Member-UUID vollständig zurückgerollt: Like erlaubt, Dislike/Reply/Publisher/Edit verweigert. Echter cHa-Like, Reload und Unlike im Browser bestanden; Test-Like wieder entfernt. Forum in DE/EN bei 1440/768/390/360, 24 finale Kombinationen ohne falsche Rollenfarbe oder Overflow. 22 aktuelle HTTP-Ressourcen mit Status 200 und Quellabgleich, 15 JS-Dateien syntaktisch geprüft. 0 relevante Browser-JS-/Consolefehler. 24 fremde Wiki-/Galerie-SQL-/Validierungsdateien hashidentisch zum Beginn; globaler Footer unverändert. Rollen- und Reaktionsfunktion MD5 unverändert. Keine neuen Security-Advisory-Warnungen gegenüber vorliegendem Bestand.

Nachweise/Screenshots: externes Verzeichnis forum-changelog-20261015 im bestehenden Visualisierungsordner, insbesondere block-final-validation.json, pulse-delete-validation.json, pulse-ui-validation.json, sql-validation.json, frontend-validation.json und native-block-validation.json. Keine Testwerkzeuge/Fixtures in Git übernommen.

Frontend lokal fertig; noch NICHT veröffentlicht. Kein Commit, Push, Deployment oder Webexport. Wiki, game/, GAME und Dedicated nicht bearbeitet. STOPP nach Abschluss dieses Blocks. Die folgenden Abschnitte sind ausschließlich der frühere Vorbereitungs-/Projektverlauf und keine offenen Schritte dieses Auftrags.

## SQL-Umfang und Rücknahme

Die Changelog-Migration erweitert ausschließlich die bestehende Forumstruktur: drei Topic-Metadatenfelder, Metadaten-CHECK, zwei partielle eindeutige Indizes, drei Schutztrigger und begrenzter Publisher-RPC; vorhandene Reader werden gezielt erweitert. Einziges DROP ersetzt die Kategorien-Allowlist und löscht weder Tabelle noch Datenzeilen. Die Migration selbst importiert keine Inhalte. Der getrennte Import erzeugt exakt 14 Topics und 14 Startbeiträge.

forum_changelog_import_prepare.sql enthält den freigegebenen vollständigen Datensatz mit approved=true, Quellhash und expliziter Datumsprovenienz. Er wurde im vom Nutzer autorisierten DBA-Importkontext mit transaktionslokaler bestehender Publisher-UUID ausgeführt. Keine Sitzungstoken kopiert, kein Account verändert. Unbekannte Originaldaten bleiben im Archiv als null erhalten; zugewiesene migrationDate steht getrennt daneben.

forum_changelog_disable.sql bietet eine gesondert freizugebende datenerhaltende Deaktivierung: Publisher-EXECUTE widerrufen und neue Frontend-Capability aus dem Lese-Wrapper nehmen. Bereits gespeicherte Einträge/Likes/Views bleiben erhalten. Kein Datendrop als Rollback. Pulse-Rücknahme und irreversible Aktionsgrenzen stehen in PULSE_DELETE_REVIEW.md. Keine Rücknahme ausgeführt.

Vorhandene Security-Advisory-Warnungen betreffen unveränderte RPCs/Auth-Konfiguration; keine neue Warnung durch diesen Block. Nachlesbar: [Funktionsrechte](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable), [Passwortschutz](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection). Keine fremden Sicherheits-/Spielstrukturen geändert.

## Zugehörige Dateien dieses Arbeitsstands

Frontend: `forum/index.html`; `assets/js/forum.js`, `forum-api.js`, `forum-content.js`, `forum-activity.js`, `forum-atmosphere.js`, `forum-changelog.js`; `assets/css/forum-changelog.css`, `forum-roles.css`; `game-development.html`, `game.html`, `assets/js/game-page-common.js`; `assets/js/account.js`, `i18n.js`, `assets/css/account.css`; `admin/community-pulse.html`, `admin/community-pulse.js`, `assets/js/community-pulse-api.js`, `community-pulse.js`, `assets/css/community-pulse-admin.css`; zentrale `assets/js/translations.js`.

Bereits fertige Reaktions-/Klickflächenbasis erhalten: `assets/js/forum-reactions.js`, `forum-links.js`, `assets/css/forum-usability.css` sowie Reaktions-Review/-Migration/-Deaktivierung.

Dokumentation: diese Review, `FORUM_CHECKPOINT.md`, `HOMEPAGE_CHECKPOINT.md`, `FORUM_CHANGELOG_INVENTORY.md/.json`, `forum_changelog_import_prepare.sql`, `forum_changelog_disable.sql`, beide oben genannten neuen Migrationsquelldateien, `PULSE_DELETE_REVIEW.md`, `pulse_delete_regression.sql`. Temporäre UI-/SQL-Testwerkzeuge und Screenshots liegen ausschließlich im externen Nachweisverzeichnis.
