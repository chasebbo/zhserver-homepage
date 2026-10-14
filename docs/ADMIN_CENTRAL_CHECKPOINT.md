# Zentraler Adminbereich – lokaler Stand 14.10.2026

## Separater Release freigegeben – 14.10.2026

Der Nutzer hat den bereits vorhandenen Admin-/Account-/Profilstand ausdrücklich
zur Veröffentlichung freigegeben. Kein Neubau und keine Funktionsduplikation.
Release-Basis `adb97818d1074e262cda0dac557ed6b8cc0180da`; genau die neun unten
genannten Laufzeitdateien plus dieser Checkpoint und der Homepage-Zusatz.
Wiki-/Validierungsdateien sowie GAME, Dedicated und Supabase-Struktur bleiben
unangetastet. Die bisherigen lokalen Prüfungen unten sind historische Nachweise;
neue Release-/Live-Nachweise unter `admin-release-20261014` außerhalb Git.

Die erneute Prüfung des bestehenden Codes besteht aus 23 isolierten UI-Assertions
und vier fehlerfreien JS-Parserprüfungen. Rein lesend im produktiven Backend:
cHa weiterhin Admin, alle neun Member Nicht-Admins; zentrale Rollenfunktion
unverändert und auf `system_role(auth.uid())` gestützt. Kein separater echter
Member-Browserlogin vorhanden, keine Accounts oder Passwörter für Tests verändert.

**Offener bestehender Storage-Befund:** Die neun bereits bekannten Admin-Policies
für Galerie-/Gästebuch-/Feedbackeinträge und Feedback-Screenshots verwenden
`is_zh_admin()`. Vier weitere alte Policies auf `storage.objects` für Bucket
`gallery` begrenzen dagegen nur `bucket_id='gallery'` unter `authenticated`:
`Admin can delete gallery 1vs8c42_0` (DELETE),
`Admin can delete gallery 1vs8c42_1` (SELECT),
`Admin can update gallery 1vs8c42_0` (UPDATE),
`Admin can update gallery 1vs8c42_1` (SELECT).
Damit sind diese Bildobjekt-Operationen nicht auf die zentrale Adminrolle begrenzt.
Diese produktiven Policies werden in diesem reinen Frontend-Release nicht geändert;
der Befund benötigt einen gesonderten freigegebenen Backend-Auftrag. Profil-/Menü-
Adminlink und Adminübersicht bleiben an den echten Rollencheck gebunden.

## Umsetzung

- `/admin/` ist die gemeinsame Übersicht, keine zweite Loginoberfläche.
  Zentrale Anmeldung über `/account/`, Rückkehrziel `/admin/` ausdrücklich in
  der bestehenden sicheren Same-Origin-Allowlist. Andere Rückkehrregeln erhalten.
- Im eigenen Profil und im gemeinsamen Accountmenü erscheint „Adminbereich“
  ausschließlich nach positiver Prüfung durch den bestehenden `ZHAdminAccess`.
  Keine Prüfung nach Name, E-Mail, UUID-Literal oder editierbaren Metadaten.
  Logout/Sessionwechsel und verspätete Antworten blenden den Link sicher aus.
- Fünf Ziele: Forum/Moderation, Community Pulse/Umfragen, Gästebuch,
  Galerie/Screenshots und bestehende Bugs-/Ideen-/Feedbackverwaltung.
  Forum-Moderation bleibt im jeweiligen Thread, keine zweite Moderationsoberfläche.
- Vorhandene Verwaltungsseiten bleiben unverändert erreichbar. Die bisherige
  `admin/dashboard.html` führt auf `/admin/`, sodass ihre bestehenden Rücklinks
  weiterhin funktionieren. Die Übersicht enthält keine kopierten Aktionen/RPCs.
- Gemeinsamer Header, DE/EN, vollständiger globaler Footer einschließlich
  Community und Besucher. Keine neue Zählung/Presence. Dashboard ohne Deko-Icons.
- Bestehender Supabase-Client und SDK-Session wiederverwendet. Kein neuer
  Session-Speicher, keine Account-/Passwort-/Rollenänderung, keine Migration.
  Der vorbereitete Anzeigename-Editor bleibt deaktiviert.

## Berechtigungsnachweis

Lesender Abgleich im vorhandenen Supabase-Projekt `zhserver`:
`current_is_admin()` verwendet `system_role(auth.uid())` aus der privaten
zentralen Rollentabelle; 1 Admin und 9 Member, alle Member-IDs bleiben Nicht-Admins.
Forum-Moderation und Pulse-Verwaltung nutzen denselben serverseitigen Rollencheck.
Die neun bestehenden Admin-Policies für Gästebuch, Galerie, Feedback und dessen
Screenshots verwenden weiterhin `is_zh_admin()`; keine Rechte verändert.

Die statischen HTML-Dateien werden wie bisher über die Homepage ausgeliefert.
Die Seitenprüfung ersetzt keine Autorisierung: Verwaltungsaktionen bleiben
unabhängig davon in den bestehenden RPCs/RLS serverseitig geschützt. Auch die
unveränderten Einzelansichten behalten ihren eigenen `ZHAdminAccess`-Guard.

## Prüfung

- Echte vorhandene lokale cHa-Sitzung: Profilbutton, Accountmenü, Dashboard,
  alle fünf Ziele, zentrale Account-Rückkehr und Reload bestanden. Keine erneute
  Passworteingabe, kein Logout des Nutzers für diese Prüfung erforderlich.
- Gast/Member, manipulierter Anzeigename/`user_metadata`, fehlende/ungültige
  Rollenantwort, anonyme Auth und verspätete Adminantwort nach Logout in gezielten
  isolierten UI-Fixtures geprüft. Kein zusätzlicher produktiver Account angelegt.
  Kein echter separater Nicht-Admin-Browserlogin; ergänzend echte serverseitige
  Member-/Rollenprüfung wie oben.
- DE/EN; Desktop 1440, Tablet 768, Mobile 390, kein horizontaler Überlauf.
  Eigene private E-Mail bleibt im eigenen Profil; nicht im Dashboard/Accountmenü.
- 14 lokale HTML-/JS-/CSS-Ressourcen HTTP 200/passende MIME; JS/CSS identisch
  zum Working Tree. Relevante Browser-JS-/Consolefehler und Warnungen: 0.
- JS-Parserprüfung und `git diff --check` sauber. Alle bisherigen fremden
  Wiki-/Prüfdateien und vorangegangenen Pulse-/Views-Arbeiten erhalten; die alte
  Dashboard-Einbindung von Pulse befindet sich jetzt in der zentralen Übersicht.
- Unveränderte Guards, Auth-/Identity-Kern, Einzelverwaltungen, Forumfunktionen,
  Footer, Besucher-/Presence-Code anhand SHA-256 mit Ausgangsstand abgeglichen.

Nachweise/Screenshots außerhalb Git:
`C:/Users/sebbo/.codex/visualizations/2026/09/30/01a0f137-f3f5-7bc0-b080-7b451ea65ff0/admin-central-20261014`.
`working-tree-before.json`, `local-validation.json`, `backend-read-validation.json`,
`browser-validation.json`, `http-validation.json`, `admin-*.png`.

## Betroffene Dateien

`admin/index.html`, `admin/dashboard.html`, `admin/dashboard.js`,
`admin/dashboard.css`, `assets/js/account.js`, `assets/js/i18n.js`,
`assets/js/translations.js`, `account/index.html`, `profile/index.html`,
dieser Checkpoint sowie der kurze Zusatz in `HOMEPAGE_CHECKPOINT.md`.

## Grenze

Nur lokal. Kein Commit, Push, Deployment oder Webexport.
Keine GAME-, Wiki-, Dedicated-, Spielprojekt- oder Backend-Strukturänderung.
Dedicated-Neustart: NEIN. Release-HEAD bleibt
`49b51da2411ce85059894e808c269b47411dbe26`.
