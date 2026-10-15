# Community Pulse – dauerhafte Löschung

Stand: 15.10.2026. Nach konkreter Nutzerfreigabe produktiv ausgeführt: 20261015123435_homepage_pulse_delete.

Datei: `20261015123154_homepage_pulse_delete.sql`.

## Exakter Umfang

- Neue private Funktion `zh_pulse_private.delete_poll(uuid,timestamptz)` und öffentlicher, begrenzter Wrapper `delete_zh_community_pulse(uuid,timestamptz)`.
- Vor jedem Zugriff: gültiges bestehendes Mitgliedskonto, danach bestehende serverseitige Adminrollenprüfung. Anzeigenamen, E-Mails, Metadaten und Spielränge sind keine Berechtigungsquelle.
- `get_zh_community_pulse(boolean)` bleibt beim bestehenden Reader und ergänzt nur `delete_version: 1` zur sicheren Aktivierung der Oberfläche.
- Keine neuen Tabellen, Spalten, RLS-Policies, Rollen, Accounts oder Spieländerungen. Die Migration selbst löscht keine Daten.

## Spätere bestätigte Löschaktion

Genau ein `DELETE FROM zh_pulse_private.polls WHERE id=p_poll_id` nach Zeilensperre und Prüfung des zuletzt bestätigten `updated_at`. Vorhandene, produktiv geprüfte Fremdschlüssel entfernen ausschließlich die Optionen in `public.community_votes` mit dieser `pulse_poll_id` und die dazugehörigen Einzelstimmen in `zh_pulse_private.votes`. Andere Umfragen und Legacy-Optionen ohne `pulse_poll_id` bleiben erhalten. Alle Schritte sind transaktional.

Die Oberfläche nennt die ausgewählte Frage, warnt vor endgültiger Löschung und bietet Abbrechen sowie Umfrage endgültig löschen. Keine Wiederherstellung über die normale Oberfläche. Eine bereits gelöschte Umfrage kann nur aus einer gesonderten Datenbanksicherung wiederhergestellt werden.

## Tests und Rücknahme

15 isolierte PostgreSQL-Prüfungen bestanden: Gast/Member verweigert, veraltete Bestätigung verweigert, leere und aktive Umfrage mit echter Teststimme vollständig entfernt, andere aktive Umfrage erhalten, keine verwaisten Stimmen, private Daten weiterhin gesperrt. Produktive Testumfragen wurden dafür nicht angelegt.

Rücknahme ohne Datenlöschung: EXECUTE auf den beiden neuen Löschfunktionen für authenticated widerrufen; vorhandenen öffentlichen Reader-Wrapper wieder ohne delete_version bereitstellen; UI-Löschschaltflächen werden dann automatisch verborgen. Bestehende Umfragen/Stimmen bleiben dabei erhalten. Dies stellt bereits endgültig gelöschte Daten nicht wieder her.

Die eigene konkrete Nutzerfreigabe wurde eingeholt und erteilt. Echte installierte RPCs danach transaktional geprüft (pulse_delete_regression.sql), vollständig zurückgerollt. Leere und aktive Testumfrage mit Stimme entfernt; keine vorhandenen Umfragen/Stimmen verändert. Der reale Browserdialog wurde in DE/EN geöffnet und abgebrochen. Der endgültige UI-Ablauf wurde zusätzlich mit isolierten UI-Daten geprüft.
