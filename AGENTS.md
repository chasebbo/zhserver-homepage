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
- Fehlende Werte in der Statistik zeigen „keine“ (EN „none“) aus dem zentralen
  Katalog, nicht „—“. Solange die produktive Presence nicht bestätigt/aktiviert
  ist, dazu den vorhandenen ehrlichen Verfügbarkeitshinweis zeigen. Keine
  simulierten Zahlen.
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
- Das aktuelle Projekt als **3D-Multiplayer-Welt** beschreiben, in der der
  Fortschritt gespeichert bleibt. Das Fachwort „persistent“ in Spielertexten meiden.
  Historische 2D-Versionen dürfen weiterhin korrekt als 2D bezeichnet werden.
- Gute bestehende Texte erhalten. Nur veraltete, falsche oder ausdrücklich
  beauftragte Texte ändern. Keine zusätzlichen Überschriften, Werbesprüche,
  Infoboxen oder unnötig verlängerten Erklärungen.
- DE und EN natürlich formulieren und das zentrale Übersetzungssystem nutzen.
  Englische Texte sinngemäß übersetzen.
- Verbindlicher Landingpage-Titel: **Zombiehölle Survival heute**.
- Verbindlicher deutscher Landingpage-Absatz, wortgetreu (neu gefasst mit Freigabe
  Sebastian 03.11.2026):
  „Zombiehölle Survival ist eine 3D-Multiplayer-Welt, sofort spielbar und ohne Download. Dein Fortschritt bleibt gespeichert. Du suchst Ausrüstung, baust dir eine Basis und überlebst zusammen mit anderen. Die Welt wird laufend größer und besser.“
  (Sebastian 03.11.2026: Das Spiel nicht als „Browser-Spiel“ oder „im Browser“ beschreiben, sondern den
  Vorteil nennen: sofort spielbar, ohne Download. Technische Hinweise zum Browser bleiben erlaubt.)
- In diesen Absatz keine zusätzlichen Erklärungen zu älteren Testversionen,
  Veröffentlichungen oder dem Stand der 3D-Umstellung aufnehmen.
- Bei jeder künftigen Textänderung diese Regeln prüfen. Eine ausdrückliche
  konkrete Formulierung des Nutzers hat Vorrang.

### Prüfregel KI-Stil (Sebastian 03.11.2026, gilt für alle neuen Texte)

Jeder neue oder geänderte sichtbare Text (DE und EN, auch Hinweise, Meldungen,
Alt-Texte und Knöpfe) wird vor der Vorlage hierauf geprüft. Ziel: menschlich,
umgangssprachlich und direkt, aber nicht künstlich lässig.

- Keine Gedankenstriche („–“, „—“, „ - “ zwischen Satzteilen), auch nicht als
  Platzhalter.
- Kein „nicht nur … sondern auch“ und keine gestelzten Gegenüberstellungen
  („nicht einfach X, sondern Y“).
- Keine Dreierlisten aus Prinzip („Erkunde, sammle, baue“). Eine Aufzählung nur,
  wenn wirklich so viele Dinge gemeint sind.
- Keine Werbe- und Abenteuerfloskeln: „Tauche ein“, „erwartet dich“, „Mach dich
  bereit“, „nahtlos“, „spannend“, „ultimativ“, „episch“, „Reise“, „entdecke“,
  „Herzstück“, „frischer Wind“; EN „dive into“, „await“, „journey“, „seamless“,
  „epic“, „ultimate“, „discover“.
- Keine Doppelpunkt-Zuspitzungen („Das Ergebnis: …“, „mit nur einem Ziel: …“).
- Keine rhetorischen Fragen und keine pathetischen Schlusssätze („Doch ihre
  Geschichte bleibt erhalten.“). Eine echte Frage an den Leser ist erlaubt.
- Satzbau abwechseln, keine Reihe gleich gebauter Sätze. Kein Amts- und
  Hauptwortstil („wird durchgeführt“, „zur Verfügung gestellt“, „bzw.“).
- Keine steifen, englisch gedachten Sätze. Englisch ebenso natürlich schreiben,
  nicht Wort für Wort übersetzen.
- Anrede einheitlich „du“ (EN „you“). „Ihr“ nur, wo bewusst alle gemeint sind,
  etwa beim Dank an die Community. Entwicklung in der Ich-Form (Sebastian
  entwickelt allein), Community-Geschichte in der Wir-Form.
- Rechtstexte (Impressum, Datenschutz, Nutzungsbedingungen, Community-Regeln)
  inhaltlich nur nach Sebastians Auftrag ändern; Auffälligkeiten melden.


## Homepage-Umbau November 2026 (Branch `umbau-homepage-20261103`)

- Vorlage: `C:\ZHServer-Temp\homepage-entwurf-20261103\`. Gemeinsame Gestaltung in
  `assets/css/zh-2026.css` (nur unter `body.zh-2026`), Seiten in `assets/css/zh-pages.css`.
- Schriften liegen selbst gehostet in `assets/fonts` (`assets/css/fonts.css`). Keine
  Google-Fonts-Anfragen auf Homepage-Seiten, auch `game.html` lädt keine mehr; nur die Testseiten laden sie noch.
  Font Awesome Free 6.7.2 liegt selbst gehostet in `assets/vendor/fontawesome-6.7.2` (Lizenz dort), kein cdnjs mehr
  auf den umgebauten Seiten.
- Startseite `index.html` neu, die Community-Geschichte liegt in `archiv.html`. Alte
  Anker der Startseite (`#history`, `#timeline`, `#guestbook`, Events) leiten auf das Archiv um.
- Vorbereitete Teile schaltet `assets/js/zh-ui.js` ein (`FEATURES`, `RELEASES`), nicht im HTML.
  Erst einschalten, wenn es echte Daten gibt bzw. die Version live ist: Tore der Safezone
  (v132), Funk-Countdown, Ping und Laufzeit, Video im Startbild, Ladetext und Startseiten-Abschnitt
  TIEFENLICHT (v131). Die Weltlage (`worldStatus`) ist an (Sebastian 03.11.2026): Kachel auf Startseite und `game.html`,
  Seite `weltlage.html` mit den 12 Orten, alles in `assets/js/zh-live.js` aus `get_world_status` (v132). Antwortform nach
  `HOMEPAGE-UEBERGABE-WELTLAGE.md`, anpassen nur in `parseWorld()`. Alle 60 Sekunden neu, höchstens 60 Sekunden
  zwischengespeichert, Aufleuchten nur bei echter Änderung. Bei `online: false`, Fehler oder fehlender Antwort
  „derzeit nicht verfügbar“, nie Beispiel- oder alte Werte, keine Spielerzahl. Die Kachel nutzt eigene Klassen
  (`zh-wl-*`), damit die alten Konzept-Stile in `game-alpha-panels.css` nicht hineinwirken.
  `world-status.js` erzeugt nur Konzeptwerte und gehört nicht in den Umbau.
  Sebastian 03.11.2026: Der Umbau geht erst online, wenn die echte Weltlage drin ist.
  Seite `geschichte.html`: „Geschichte“ im Menü führt dorthin. Inhalt ist Sebastians Fassung vom 04.11.2026, wörtlich aus
  `wasstehtan/GESCHICHTE-SEBASTIAN.md` im Spiel-Projekt (Teil 1 bis 3). Online seit dem Release von v131 (04.11.2026). Nichts
  kürzen, nichts dazuschreiben. Die Community-Geschichte seit 2013 bleibt in `archiv.html#history`,
  erreichbar über den Fußlink „Community-Geschichte“ auf allen umgebauten Seiten.
- Keine Anzeige der Spieler online auf der Homepage (Sebastian 03.11.2026), auch nicht versteckt
  vorbereitet.
- Funkgerät steht in `assets/js/radio.js` (früher in `main.js`) und auf jeder Homepage-Seite.
- Kopf: auf allen 17 umgebauten Seiten gleiches Markup, flache Leiste nach `vorlage-kopf-startbild.png`: links Hand und
  Schriftzug ZOMBIEHÖLLE / SURVIVAL (Barlow Condensed, selbst gehostet), Mitte Menü, rechts Konto und DE/EN; am Handy
  Menüknopf, Konto und Sprache im Menü. Gestaltung nur in `zh-2026.css`, Kopfhöhe in `--zh-head-h` (nicht `--zh-head`, das ist
  die Überschriftenschrift). Änderungen am Kopf immer auf allen Seiten gleich machen, keine Kopfregeln pro Seite.
- Eine Überschriften-Schrift (Sebastian 03.11.2026): Barlow Condensed 700/800, selbst gehostet, in `--zh-head`. Cinzel ist
  entfernt und wird nirgends mehr geladen. Seiten- und Abschnittstitel (h1, h2) in Großbuchstaben, Karten- und lange
  Überschriften (h3, Abschnitte der Rechtstexte) normal; h2 mit `zh-eyebrow` behält den Abstand der kleinen Beschriftung. Fließtext, Knöpfe, Menü und kleine goldene Beschriftungen in Inter.
- Größenordnung: Startbild-Titel > Abschnittstitel (`--zh-size-section`, PC 40 px, Handy 28 px) > Kachelwerte
  (`--zh-size-value`, 70 % davon: „Online“, Name bei „Neu dabei“, „Zombies erledigt“, Weltlage-Prozente) > Text.
- Lagezentrum: alle Kacheln gleich aufgebaut und oben ausgerichtet. Beschriftung, Hauptwort (Großbuchstaben, Zeilenhöhe 1)
  und Zeile darunter (14 px) liegen in jeder Kachel auf derselben Höhe; Leuchten grün, gold und blau gleich stark.
  Unter „Zombies erledigt“ steht nur „auf dem ganzen Server“ (Sebastian 03.11.2026).
- Keine Bilderleiste unter den Kapiteln der Startseite (Sebastian 03.11.2026). Bilder stehen im Slider und in der Galerie.
- Gold wie Vorlage (Sebastian 03.11.2026): überall flach `#d4a84a` mit dunkler Schrift, beim Darüberfahren `#e0b85a`,
  ohne Verlauf und Glanz. Werte in `--zh-gold`, `--zh-gold-strong`, `--zh-gold-hover`; die älteren Variablen `--gold`,
  `--home-gold` und `--game-gold` sind unter `body.zh-2026` auf dasselbe Gold gesetzt. Neue Goldtöne nicht fest eintragen.
- Menüsymbol am Handy: zu „☰“, offen „✕“, `aria-label` Navigation öffnen bzw. schließen. Gesetzt zentral in
  `updateControls()` in `assets/js/i18n.js`; Escape schließt das Menü auf allen Seiten.
- Ohne Gastzugang (Spiel ab v132): kein Gast-Knopf und kein Gastweg in `game-entry.js`, Willkommensfenster ohne
  „Als Gast weitermachen“. Lesen im Forum und das Gästebuch bleiben ohne Account. Der Abschnitt „5. Gastmodus“ der
  Nutzungsbedingungen ist mit dem Release v132-2 gestrichen (Sebastian 03.11. und 07.11.2026), die folgenden
  Abschnitte heißen jetzt 5 und 6. Die Fassung bleibt `2026-10-08`, bis Sebastian über ein neues Datum entschieden hat.
- `game.html` im Umbau nach `spielen.html`: lädt die alten Spielseiten-Stile nicht mehr, nur `game-stage.css`.
  Bedienelemente und `data-src` unverändert (Release-Änderungen von main beim Neuaufsetzen übernehmen).
  Ladehinweis bis v131 für Client v130-2: „Der erste Start kann ein paar Minuten dauern, danach geht es schneller.“
  (`data-zh-until="v131"`), der Satz „etwa eine Minute“ erst mit `RELEASES.v131`.
- Ränge und Zombie-Zähler (Sebastian 03.11.2026) in `assets/js/zh-ranks.js`. `worldZombieTotal` ist an: die Kachel
  „Zombies erledigt“ ersetzt auf der Startseite die Top 5 Zombie-Killer (die Top 5 samt `get_top_zombie_killers` sind im
  Umbau entfernt) und zeigt „derzeit nicht verfügbar“, bis `get_world_zombie_total` antwortet. Antwort nach
  `HOMEPAGE-UEBERGABE-ZOMBIEZAEHLER.md`: nur `{"total": n}`, keine Wochenzahl, etwa 5 Minuten zwischengespeichert. Versteckt bleiben `playerStats` und `playerRanks`. Daten von Opus 3 über `get_world_zombie_total`,
  `get_public_player_stats` und `get_player_ranks`; Antwortformen nach `HOMEPAGE-UEBERGABE-RAENGE.md`
  nur in den `read*`-Funktionen anpassen. Abzeichen erst nach Freigabe über `BADGE_SRC`.
  Namen nur als Text, bei Ausfall „derzeit nicht verfügbar“, nie Beispielwerte.


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
- Hauptversion für `game.html`: v132-3 mit den Paketen `pc` und `handy` (Hotfix, veröffentlicht am 07.11.2026).

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
- Welche Builds bleiben (Sebastian 04.11.2026, gilt ohne Nachfrage): die
  aktuelle Version, ihr direkter Vorgänger als Rückweg und der aktuelle
  Testkandidat. Der Rest wird archiviert und entfernt.
- Dateinamen (Dauerregel Sebastian 02.11.2026): Eine einmal veröffentlichte
  Datei wird nie mit anderem Inhalt unter demselben Namen ausgeliefert. Jede
  Spielversion hat eigene Dateinamen (`survival-v130-2.*`). Vorhandene Dateien
  unter `game/` nie überschreiben. Weicht eine Prüfsumme ab: nicht kopieren,
  melden.
- Nach dem Deployment die Größe des Pages-Artefakts messen und berichten. Ziel
  deutlich unter 1 GB.
- Stand 07.11.2026 (Hotfix v132-3): Hauptversion v132-3 mit den Paketen `pc` und `handy` auf `game.html`
  und `game-test-v130.html` (`gamePackageSource` in `game-entry.js` wählt das Paket). Rückweg v131-11:
  `game.html` zurück auf `game/survival-v131-11-pc.html?build=v131-11-pc-20261104` und
  `data-src-handy` auf `game/survival-v131-11-handy.html?build=v131-11-handy-20261104`, Abschnitt
  Gastmodus der Nutzungsbedingungen wieder einsetzen. Handy-Probepaket `survival-probe3-handy.*` auf
  der Testadresse `game-test-handy.html` (steht in der Rückleitungsliste).
- Archiviert und entfernt: v132-2 (`C:\ZHServer-Archiv\homepage-builds\v132-2\`), v132-1
  (`C:\ZHServer-Archiv\homepage-builds\v132-1\`), v130-2
  (`C:\ZHServer-Archiv\homepage-builds\v130-2\`) und probe1
  (`C:\ZHServer-Archiv\homepage-builds\probe1-handy\`), vorher v131-8, v130-1, v129 mit
  `game-test-v129.html`, v131-3 und v131-4.
