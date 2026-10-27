# Mit Google anmelden

Stand 27.10.2026. Die Migration ist am 27.10.2026 nach Sebastians Freigabe eingespielt (`homepage_google_oauth_onboarding`, Teil A und Teil B). Die Homepage folgt mit dem Push.

## Ablauf

- `/account/` zeigt „Mit Google anmelden“ (Anmeldung) bzw. „Mit Google registrieren“ (Registrierung). Bei „Passwort vergessen“ ist der Knopf ausgeblendet.
- Supabase legt beim ersten Mal das Konto an. Die Datenbank markiert es als „Zustimmung offen“. Als Name steht vorläufig die Konto-ID, die nirgends als Name gilt oder angezeigt wird.
- Zurück auf `/account/` geht es für offene Konten direkt weiter zu `/profile/willkommen/?next=…`.
  - Das Namensfeld ist leer, der Google-Name wird nicht übernommen.
  - Der Haken für Nutzungsbedingungen und Community-Regeln ist Pflicht.
  - „Abbrechen und abmelden“ meldet ab und führt zur Startseite.
- „Konto fertigstellen“ ruft `complete_zh_account_setup` auf. Zustimmung (Fassungen, Serverzeit) und Name werden in einem Schritt gespeichert, danach geht es zum Ziel.
- Bis dahin:
  - Spielseite, Forum (neuer Beitrag, Antwort) und Gästebuch zeigen „Bitte schließe zuerst deine Anmeldung ab.“ mit dem Link „Anmeldung abschließen“.
  - Das Menü im Kopf führt statt zum Profil zur Willkommensseite, `/profile/` leitet ebenfalls dorthin.
  - Die Datenbank sperrt Forum, Abstimmungen, Namensänderung und das Anlegen einer Spielfigur.
- Ein bestehendes Konto mit derselben bestätigten Adresse wird von Supabase mit Google verbunden. Es entsteht kein zweites Konto und keine Markierung.
- Abbruch bei Google: „Die Anmeldung mit Google wurde abgebrochen …“. Andere Fehler von Google oder der Datenbank: „Die Anmeldung mit Google hat nicht geklappt …“. Nur ein abgelaufener E-Mail-Link (`otp_expired`) zeigt weiter „Link abgelaufen“.

## Datenbank

- Migration: [`google_oauth_onboarding_prepare.sql`](google_oauth_onboarding_prepare.sql)
- Rückweg: [`google_oauth_onboarding_rollback.sql`](google_oauth_onboarding_rollback.sql)
- Lokal mit PGlite geprüft: 60 von 60 Prüfungen, einschließlich des Rückwegs.
- Eingespielt am 27.10.2026 als `homepage_google_oauth_onboarding`, genau diese Datei. Danach lesend geprüft:
  - Tabelle, Funktionen und Rechte wie im Entwurf; `get_zh_account_ready` nur für `service_role`.
  - Mitgliederzahl, neuestes Mitglied, Bestenliste und Spielerzahl unverändert.
  - Bestehende Konten liefern beim eigenen Identitätsabruf „nicht offen“ und denselben Namen wie vorher.
- Teil B ist freigegeben: Konten mit „Zustimmung offen“ zählen nicht als registrierte Mitglieder, erscheinen nicht als neuestes Mitglied und nicht in der Spielerzahl der Spielseite.

## Reihenfolge der Veröffentlichung

1. Sebastian gibt die Migration frei, sie wird angewendet und gelesen geprüft. Erledigt am 27.10.2026.
2. Danach „Push frei“ für die Homepage. Erteilt am 27.10.2026.
3. Ohne Migration schlägt eine Google-Registrierung fehl und die Seite meldet „hat nicht geklappt“. Es wird kein Konto angelegt. Bestehende Konten können sich trotzdem über Google anmelden.

## Für Opus 3 (Spiel) und den Spielserver

- Prüfen, dass der Webbuild keine eigene Anmeldung mit E-Mail und Passwort mehr hat. Google-Spieler haben kein Passwort. Sie kommen nur über die Sitzung der Homepage (`game-auth-bridge.js`) ins Spiel.
- Der Spielserver soll nach der Tokenprüfung `public.get_zh_account_ready(p_user_id uuid)` aufrufen (nur mit Service-Rolle) und Konten mit `false` abweisen. `false` gilt für unbekannte, gelöschte, anonyme und noch offene Konten.
- `initialize_my_player_state` lehnt offene Konten bereits mit `legal.consentPending` ab.

## Hinweis

Google zeigt beim Anmelden „weiter zu yawadxzeyyrozmlrokun.supabase.co“. Das ändert nur eine eigene Domain bei Supabase (kostenpflichtig).
