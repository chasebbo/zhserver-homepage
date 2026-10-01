# Zombiehölle-Forum: minimale Vorbereitung

Stand: 30.09.2026. Diese Phase enthält ausschließlich die statische Baustellen-Seite
unter `/forum/`, eine Kategorie-Vorschau und die Einbindung in Header, Navigation und
DE/EN. Die Kategoriezeilen sind keine Links und haben keine Beitragsfunktionen.

Die Seite verwendet die bestehenden Homepage-Stile, die zentrale Übersetzungsdatei
und die gemeinsame Menüsteuerung. Auf der statischen Forum-Seite wird kein
Supabase-Client initialisiert. Es gibt keine Backend-Anfragen, Besucher-/Forenzähler,
Authentifizierung, Eingabeformulare oder gespeicherten Forum-Inhalte.

## Mögliche spätere Datenstrukturen

Die folgenden Namen und Felder sind Planungsbeispiele. Es gibt dafür weder eine
ausgeführte Migration noch produktive Tabellen, RLS-Änderungen oder API-Funktionen.

| Struktur | Mögliche Felder und Beziehungen | Zweck |
| --- | --- | --- |
| Kategorien | ID, Slug, DE/EN-Titel und Beschreibung, Reihenfolge, Sichtbarkeit, Sperrstatus | Stabile, übersetzbare Bereiche des Forums |
| Themen | ID, Kategorie, Autorprofil, Titel, Erstellungs-/Änderungsdatum, letzte Aktivität, angeheftet/gesperrt | Diskussionen innerhalb einer Kategorie |
| Beiträge | ID, Thema, Autorprofil, Inhalt, Erstellungs-/Bearbeitungsdatum, Lösch-/Moderationsstatus | Erster Beitrag und spätere Antworten |
| Benutzerprofile | ID, Bezug zur vorhandenen Homepage-Authentifizierung, Anzeigename, optionaler Avatar | Öffentliche Darstellung ohne Offenlegung von E-Mail oder anderen privaten Auth-Daten |
| Moderation | Meldungen, betroffener Beitrag/Thema, Grund, Bearbeitungsstatus, Moderationsaktionen und Rollen | Nachvollziehbare Bearbeitung von Meldungen und Entscheidungen |
| Reaktionen | Beitrag, Profil, Reaktionstyp; eindeutige Zuordnung je Profil/Beitrag/Typ | Einfache Reaktionen ohne Mehrfachzählung |
| Benachrichtigungen | Empfängerprofil, Ereignistyp, Thema/Beitrag, Zeitpunkt, gelesen am | Persönliche Hinweise auf Antworten und Moderationsereignisse |

Ein Thema hat mehrere Beiträge. Kategorien können mehrere Themen enthalten.
Verweise auf Profile, Moderation und Benachrichtigungen müssen vor einer Umsetzung
mit dem tatsächlichen bestehenden Auth-Modell abgestimmt werden. Spielaccounts
werden nicht automatisch übernommen oder mit Forum-Profilen verknüpft.

## Entscheidungen vor einer späteren Umsetzung

- Vorhandene Homepage-Authentifizierung prüfen und wiederverwenden, soweit geeignet;
  keine zweite Kontenverwaltung ohne ausdrücklichen Auftrag aufbauen.
- Öffentliche Leserechte und Schreibrechte für angemeldete Mitglieder festlegen.
  Moderationsrechte getrennt planen und Berechtigungen serverseitig prüfen.
- Erst in einer gesondert beauftragten Backend-Phase gezielte Migrationen, RPCs und
  RLS-Regeln entwickeln und gegen die tatsächliche Datenbank testen.
- Ein begrenztes Inhaltsformat wählen und Beiträge sicher darstellen. Nutzereingaben
  niemals ungeprüft als HTML ausgeben. Bearbeitung und Löschung nachvollziehbar machen.
- Moderation, Meldungen und Schutz gegen Spam vor der Freigabe von Schreibfunktionen
  festlegen. Benachrichtigungen nur an berechtigte Empfänger ausliefern.
- Listen paginieren und echte Daten für Aktivitätsanzeigen verwenden. Keine erfundenen
  Beiträge, Mitgliederzahlen, Reaktionen oder Aktivitätsstatistiken anzeigen.
- Zentrale DE/EN-Oberflächentexte beibehalten. Nutzerbeiträge werden nicht automatisch
  übersetzt; das ursprüngliche Thema und der Originaltext bleiben erhalten.

## Mögliche nächste Schritte

1. Kategorieaufteilung und ein kleines Themen-/Beitragslayout abstimmen.
2. Datenmodell, Berechtigungen und Moderationsablauf konkret planen.
3. Erst nach gesondertem Auftrag echte Daten und Kontenanbindung implementieren.

In dieser ersten Version sind Themen, Beiträge, Antworten, Konten, Reaktionen,
Moderation und Benachrichtigungen ausdrücklich noch nicht implementiert.
