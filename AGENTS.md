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
