# Forum – konkrete Backend-Freigabe

Stand: 12.10.2026. Bestehendes Projekt: `yawadxzeyyrozmlrokun` (`zhserver`).
Die geprüfte Datei ist `docs/forum_persistence_prepare.sql`. Der erste
Anwendungsversuch wurde von der automatischen Freigabeprüfung abgelehnt.
Nach ausdrücklicher Nutzerfreigabe wurde die Migration erfolgreich angewendet;
ebenso die separat freigegebene Avatar-Korrektur. Keine indirekte Ausführung.

## Bestätigter Bestand

Die vorhandene Forum-Oberfläche verwendet acht Kategorien und den unveränderten
Browser-Key `zhserver_forum_drafts_v1`. Themen/Vorschau waren ausschließlich lokal.
Der vollständig gelistete Datenbankbestand enthält keine Forumtabellen. Profile
haben neun bestehende Spalten, ausschließlich eigene SELECT-RLS und keine
Avatar-/Bio-Felder. Die zentrale Auth-/Profil-ID und Own-Identity-RPC funktionieren.
Zehn bestehende Accounts; der Admin bleibt UUID `7ba1fad4-d113-4526-8873-3e3b97e9be7e`.
Vorhandener Storage: `gallery` und `community-feedback`; kein Avatarbucket.

## Exakte Ergänzung

- Neues, nicht durch PostgREST exponiertes Schema `zh_forum_private`.
- Drei neue Tabellen: `topics`, `posts`, `profile_extras`. Letztere enthält nur
  UUID, Avatarpfad, optionalen Kurztext und Änderungszeit; keinen zweiten Namen,
  keine E-Mail, Rolle, Anmeldung oder Gameplayfelder.
- Auf allen drei Tabellen RLS aktiv, keine direkten Tabellenrechte für Gäste
  oder Benutzer. Zugriff ausschließlich über begrenzte RPCs.
- Sieben öffentliche SECURITY-INVOKER-Wrapper:
  `get_zh_forum`, `get_zh_forum_profile`, `create_zh_forum_topic`,
  `reply_zh_forum_topic`, `edit_zh_forum_post`, `moderate_zh_forum_topic`,
  `save_zh_forum_profile`.
- Nur die zwei Lese-RPCs sind für Gäste freigegeben. Die fünf Schreib-RPCs
  verlangen authentifizierte Accounts. Privilegierter Code ist im privaten
  Schema, mit leerem Search-Path, expliziten EXECUTE-Rechten und Auth-Prüfungen.
- Autoren/Besitzer werden aus `auth.uid()` bestimmt. Es gibt keinen frei
  übergebenen Autoren-Parameter. Bearbeitung prüft eigene UUID oder bestehende
  Admin-UUID. Anzeigename/Metadaten haben keinen Einfluss auf Berechtigungen.
- Ankündigungen und Moderation bleiben Admin-only. Moderation blendet Inhalte
  aus bzw. schließt/heftet Themen an; sie löscht keine Zeilen.
- Serverzeitstempel, begrenzte Seiten (20 Themen / 30 Beiträge), Idempotenz über
  Request-UUID, Schreibabstände und Erkennung gleichzeitiger Bearbeitung.
- Neuer öffentlicher Bucket `zh-avatars`, maximal 256 KiB je gespeichertem Bild,
  ausschließlich JPG/PNG/WebP. Drei neue Storage-Policies ausschließlich für
  eigene UUID-Verzeichnisse: INSERT, SELECT, DELETE. Keine UPDATE-/Upsert-Policy.
  Bilder sind absichtlich öffentlich, Rohprofile bleiben privat.
- Der Browser prüft Format/Magic Bytes, maximal 2 MiB und 4096 × 4096 Pixel,
  und erzeugt vor Upload ein 256 × 256-Bild. Backend prüft Größe/MIME/UUID-Pfad
  und Existenz im Bucket nochmals bei der Account-Zuordnung.

## Bestehende Daten und Rechte

Keine Änderung an `auth.users`, `public.profiles`, bestehenden Adminregeln,
Visitor-/Presence-Daten, Gästebuch, Galerie, Votes, Spiel-, Gruppen-/Clan-,
Inventar-/Storage-/Fahrzeug-/Base-Tabellen oder ihren RPCs/Policies.
Keine bestehenden Zeilen gelöscht/verschoben/überschrieben. Keine DROP-,
TRUNCATE-, DELETE-FROM-Statements oder UPDATEs ohne WHERE. DELETE kommt nur als
neue Storage-Berechtigung und als FK-Regel für eine spätere ausdrücklich
beauftragte Accountlöschung vor. Die Migration löscht keinen Account.

## Rücknahme

Bei einer nötigen Rücknahme zunächst die lokale Forum-/Avataranbindung
deaktivieren und nur die sieben neuen öffentlichen Forum-RPCs sperren.
Forumdaten und Avatarbilder erhalten; keine automatische DROP-/DELETE-Rücknahme.
Die bestehenden Auth-/Identitäts-/Spiel-/Adminfunktionen bleiben davon unberührt.
Eine produktive Rücknahme wird nur mit eigenem Auftrag ausgeführt.

## Freigabe und Abnahme

Die einmaligen ausdrücklichen Freigaben beider konkreten SQL-Dateien liegen vor.
Migrationen über den bestehenden Connector, Rechteprüfung mit vorhandenen
UUIDs in zurückgerollten Testtransaktionen, echter cHa-Posting-/Reply-/Edit-/
Avatar-Test über Port 5500 und öffentlicher Abruf in einer getrennten Ansicht bestanden.
Keine Homepage-Veröffentlichung, kein Commit, Push oder Webexport in dieser Phase.
Ohne erfolgreiche reale Abnahme keine Meldung „Forum fertig“.

## Ausführung und Avatar-Nachkorrektur

Die ursprüngliche Migration wurde nach ausdrücklicher Nutzerfreigabe erfolgreich
angewendet. Reale Themen-/Antwort-/Bearbeitungs- und Reloadtests sind bestanden.
Der erste echte Avatarupload wurde mit Storage `AccessDenied` / HTTP 400 /
`new row violates row-level security policy` abgewiesen. UUID-Pfad und Anmeldung
stimmten. Die ursprüngliche INSERT-Policy verlangte bereits vollständige MIME-/
Größenmetadaten während der Storage-Objektreservierung.

`docs/forum_avatar_upload_policy_fix.sql` korrigiert ausschließlich diese neue
INSERT-Policy. Sie beschränkt die Operation weiterhin auf authentifizierte,
nicht-anonyme Benutzer und ihr eigenes UUID-Verzeichnis mit festem Bilddateipfad.
Die MIME-Whitelist und 256-KiB-Grenze bleiben unverändert im Avatarbucket und werden
bei der Profilzuordnung nochmals geprüft. DELETE/SELECT, alle anderen Buckets,
Policies, RPCs und Profildaten bleiben unverändert.

Die automatische Freigabeprüfung hat auch diese separate Policy-Korrektur zunächst
abgelehnt. Nach ausdrücklicher Nutzerfreigabe wurde sie erfolgreich als
`homepage_forum_avatar_upload_reservation_fix` angewendet. Anschließender echter
Upload des vorhandenen Homepage-Handlogos bestanden: WebP 256 × 256, 23.946 Byte,
HTTP 200; korrekte eigene UUID-Zuordnung und sichtbarer Avatar im Forum/Profil.
Originalmigration: `homepage_persistent_forum_and_public_avatar`.
Beide SQL-Dateien bleiben als exakte Ausführungsnachweise erhalten.
