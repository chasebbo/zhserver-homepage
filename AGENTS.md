# Homepage – Projektregeln

- Ausschließlich am beauftragten Homepage-Bereich arbeiten; den aktuellen lokalen
  Working Tree und fremde lokale Änderungen vollständig erhalten.
- Kein Reset, Restore oder Checkout bestehender Änderungen. Wiki, `game/` und das
  Spielprojekt nur bei einem ausdrücklichen Auftrag bearbeiten.
- Standardmäßig kein Commit, Push oder Webexport.
- Vor einer Fortsetzung den betroffenen Code, Diff und passenden Checkpoint lesen.

## Verbindlicher Footer für neue Unterseiten

Jede neue Homepage-Unterseite übernimmt den **vollständigen globalen Footer aus
der aktuellen `index.html`**. Kein vereinfachter oder neu erfundener Ersatz.

- Aufbau, Footer-Navigation, Impressum-/Datenschutz-Links, DE/EN und responsive
  Styles erhalten; relative Links an die Seitentiefe anpassen.
- `.site-footer.zh-global-footer` mit `.container.footer` und dem bestehenden
  Besucher-Einstieg `.footer-visitor > #total-visitors` übernehmen.
- Gemeinsame Styles `style.css`, `i18n.css` und `homepage-premium.css` verwenden.
- Das bestehende `assets/js/visitor-counter.js` **genau einmal** einbinden und die
  gemeinsame DE/EN-Unterstützung (`translations.js`, `i18n.js`) weiterverwenden.
- Keine zweite Tracking-Logik, neue Besucherzähler-Implementierung oder separaten
  Statistik-Aufrufe ergänzen. `visitor-counter.js` lädt das Statistik-Layout und
  verwendet bereits die bestehende Legacy- und Periodenerfassung.
- Vor Abschluss prüfen: vollständiger Footer, alle fünf Besucherwerte, korrekte
  Links, DE/EN, Desktop/Mobile und fehlerfreies Laden der Besucherstatistik.

### Globale Community-/Online-Statistik im Footer

- Jeder globale Footer enthält zusätzlich zur unabhängigen Besucherstatistik
  die globale Community-Anzeige: Online insgesamt, Mitglieder, Gäste,
  registrierte Mitglieder und neuestes Mitglied. Keine Statistik in normalen
  Community-/Kontakt-Inhaltsblöcken unterbringen.
- Die gemeinsame Darstellung kommt aus `assets/js/global-footer.js` und
  `assets/css/global-footer.css`. Der vorhandene `visitor-counter.js` lädt den
  Renderer automatisch, vor dem gemeinsamen Community-Baustein. Neue Unterseiten
  übernehmen den vollständigen Startseiten-Footer mit Besucher-Einstieg, Rechts-
  links und Copyright sowie dieses Script genau einmal. Kein eigener Footer-/
  Presence-Nachbau und keine zusätzliche Registrierung.
- Community/Presence und persistente Besucherzählung technisch getrennt lassen;
  ihre gemeinsame Platzierung im Footer ändert weder Backend noch Zähllogik.
- DE/EN aus dem bestehenden zentralen Katalog verwenden, auch für Footer-Links.
  Desktop nebeneinander, kleinere Breiten sinnvoll umbrechen/untereinander.
- Solange die produktive Presence nicht bestätigt/aktiviert ist, „—“ und den
  vorhandenen ehrlichen Verfügbarkeitshinweis zeigen. Keine simulierten Zahlen.
- Neue Seiten vor Abschluss auf beide Statistikgruppen, genau eine Einbindung,
  vollständige Links/Copyright, DE/EN, Responsive und Browserfehler prüfen.

Aktueller Homepage-Checkpoint: `docs/HOMEPAGE_CHECKPOINT.md`.

## Bestehende zentrale Anmeldung erhalten

- Der vorhandene Login unter `/admin/` verwendet Supabase Auth im bestehenden
  Projekt. Für Homepage, Forum und Profil dieselben Accounts und Sessions nutzen.
- Kein zweites Auth-System, keine parallele Kontenverwaltung oder neuer
  Session-Speicher. Bestehenden Adminaccount und seine Benutzer-ID erhalten.
- Vor Rollen-/Profiländerungen `docs/AUTH_AUDIT.md` und den aktuellen Admin-Code
  lesen. Geeignete vorhandene Backend-Strukturen zuerst prüfen und wiederverwenden.
- Eine vorhandene Session bzw. die API-Rolle `authenticated` ist kein Adminnachweis.
  Schreib-/Moderationsrechte müssen durch die tatsächlichen Backend-Regeln
  abgesichert werden; editierbare `user_metadata` nicht als Adminrolle verwenden.
- Unbekannte produktive Tabellen/Rollen/RLS-Regeln nicht als nicht vorhanden
  behandeln und keine Migration auf Vermutungen aufbauen.

## Zentraler cHa-Account – 09.10.2026

- Der Nutzer hat den Legacy-cHa-Account ausdrücklich zur endgültigen Löschung
  samt eigener Gameplaydaten freigegeben. Die Bereinigung ist abgeschlossen.
  `cHa` gehört jetzt als Anzeigename zum bestehenden zentralen Adminaccount
  `7ba1fad4-d113-4526-8873-3e3b97e9be7e`. Dessen Auth-UUID/-Rechte erhalten.
- Keine alten Gameplaydaten übertragen, keinen Legacyaccount neu anlegen.
  Technische Identität und Ownership bleiben UUID-basiert. Die produktive
  Löschung ist keine Freigabe anderer Account-/Spielmigrationen.
- Die bereits installierte `set_zh_own_display_name`-RPC bestehen lassen;
  keine Rollback-Migration. Der vorbereitete Homepage-Namenseditor bleibt im
  normalen UI deaktiviert, bis die Spiel-Namensreferenzen kontrolliert geklärt sind.
- UUID ist technische Identität; Anzeigename nur Darstellung oder Suchauswahl.
  Gruppen-/Clan-Namenssuche und temporäre Party-Namensreferenzen unterscheiden.
- Vor einem späteren Auftrag `docs/ACCOUNT_IDENTITY_MIGRATION_AUDIT.md` und den
  aktuellen Checkpoint lesen. Supabase-Produktion, exportierten v116-Build und
  noch nicht ausgerollten lokalen Spielcode nicht gleichsetzen.
- Bestehende Admin-UUID/-Rechte erhalten. Keine Autorisierung nach `cHa`,
  anderen Anzeigenamen oder editierbaren Metadaten. Kein U01-/F01- oder
  Dedicated-Rollout aus einer Homepage-Profilkorrektur ableiten.


## Verbindliche Homepage-Schreibregeln

- Natürlich, direkt und verständlich schreiben. Kurze, vollständige Sätze. Keine
  künstliche Werbung, KI-Floskeln, dramatischen Formulierungen, Wiederholungen
  oder Gedankenstriche als Ersatz für normale Sätze.
- Nur bestätigte Fakten nennen. Keine Spielinhalte, Termine oder fertigen
  Funktionen erfinden. Fehlende notwendige Informationen erfragen. Technische
  Details nur erklären, wenn sie an der jeweiligen Stelle relevant sind.
- Das aktuelle Projekt als persistente **3D-Multiplayer-Welt** beschreiben.
  Historische 2D-Versionen dürfen weiterhin korrekt als 2D bezeichnet werden.
- Gute bestehende Texte erhalten. Nur veraltete, falsche oder ausdrücklich
  beauftragte Texte ändern. Keine zusätzlichen Überschriften, Werbesprüche,
  Infoboxen oder unnötig verlängerten Erklärungen.
- DE und EN natürlich formulieren und das zentrale Übersetzungssystem nutzen.
  Englische Texte sinngemäß übersetzen.
- Verbindlicher Landingpage-Titel: **Zombiehölle Survival heute**.
- Verbindlicher deutscher Landingpage-Absatz, wortgetreu:
  „Erkunde die Welt von Zombiehölle Survival, sammle Ausrüstung, baue deine eigene Basis und überlebe gemeinsam mit anderen Spielern. Die persistente 3D-Multiplayer-Welt wird ständig erweitert und verbessert.“
- In diesen Absatz keine zusätzlichen Erklärungen zu älteren Testversionen,
  Veröffentlichungen oder dem Stand der 3D-Umstellung aufnehmen.
- Bei jeder künftigen Textänderung diese Regeln prüfen. Eine ausdrückliche
  konkrete Formulierung des Nutzers hat Vorrang.


## Web-Alpha-Status ohne Datum

- Entscheidung Sebastian, 21.10.2026: Keine manuell gepflegten Versions- oder
  Datumsangaben zum Web-Alpha-Status mehr. Die frühere Regel „Datierter
  Web-Alpha-Status“ gilt nicht mehr. Auf `game.html` ist die Zeile
  „Web-Alpha · Stand: …“ entfernt.
- Keine neuen Datums- oder Versionsangaben zum Spielstand in HTML oder im
  DE/EN-Katalog ergänzen. Neutral „Web-Alpha jetzt spielbar“ ist erlaubt.
- Auf `index.html` (Freigabe Sebastian, 21.10.2026) steht nur noch
  „Web-Alpha jetzt spielbar“; Katalogeinträge ebenfalls ohne Datum.
- Nicht verlinkte Testseiten dürfen ihre Testversion und ihren Stand nennen.
- Hauptversion für `game.html`: v129 (veröffentlicht am 25.10.2026).

## Spiel-Builds online (Dauerregel, Sebastian 22.10.2026)

- Online liegen höchstens drei Spiel-Builds: die Hauptversion (`game.html`), die
  aktuelle Testversion (eine nicht verlinkte `game-test-vNNN.html`) und die
  vorherige Hauptversion als Rückfall.
- Bei jedem neuen Build-Upload wird im selben Auftrag der älteste nicht mehr
  benötigte Build entfernt. Vorher alle Verweise prüfen (Seiten, Skripte, Wiki,
  Rückleitungsliste in `assets/js/account.js`, `AGENTS.md`), den Build samt
  Testseite nach `C:\ZHServer-Archiv\homepage-builds\<version>\` mit Manifest
  (Pfad, Größe, SHA-256) archivieren und gegen den Commit prüfen. Danach den
  Rückleitungseintrag nur dieser Testseite entfernen.
- Nach dem Deployment die Größe des Pages-Artefakts messen und berichten. Ziel
  deutlich unter 1 GB.
- Stand 25.10.2026 (Stufe B): Hauptversion v129 (`game.html`), Rückfall v127,
  Testseite `game-test-v129.html` besteht vorerst weiter. v128 und v119 sind
  archiviert und entfernt.
