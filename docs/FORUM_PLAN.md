# Zombiehölle-Forum: Oberfläche und weitere Planung

Stand: 06.10.2026. Die vorhandene Baustellen-Seite unter `/forum/` wurde zu einer
navigierbaren Oberfläche ausgebaut. Die acht bestehenden Kategorien, der gemeinsame
Header, die Navigation und das zentrale DE/EN-System bleiben die Grundlage.

Die Seite verwendet die bestehenden Homepage-Stile, die zentrale Übersetzungsdatei
und die gemeinsame Menüsteuerung. Auf der Forum-Seite wird weiterhin kein
Supabase-Client initialisiert. Es gibt keine Backend-Anfragen, produktiven Forum-Tabellen,
Besucher-/Forenzähler oder Authentifizierung. Keine Fake-Beiträge, Mitgliederzahlen,
Autoren oder Aktivitätszeiten werden angezeigt.

## Lokal vorhandene Oberfläche

- Kategorieübersicht mit Beschreibungen, eigenen Symbolen und Kategorie-Suche.
- Themenansicht pro Kategorie, Breadcrumbs und aktive Kategorie-Navigation.
- Ansichten für alle, angeheftete und geschlossene Themen mit klaren Leerzuständen.
  Die Statuslegende beschreibt die spätere Bedeutung. Sie führt keine Moderation aus.
- Lokale Entwürfe mit Titel, Beitrag, Zeichenbegrenzung, Prüfung und Beitragsvorschau.
- Beitragslayout mit vorgesehenem Autorenbereich, lokalem Speicherzeitpunkt und
  Antwort-Leerzustand. Profile und öffentliche Antworten sind ausdrücklich nicht angebunden.
- Der Entwurf bleibt eigener Nutzertext. Ein Sprachwechsel übersetzt nur die Oberfläche.

### Navigation und lokale Entwürfe

Die Ansichten verwenden URL-Fragmente: `#overview`, `#category/<slug>`,
`#draft/<slug>` und `#preview/<slug>`. Browser-Zurück/Vorwärts und direkte Aufrufe
funktionieren ohne neue Server-Routen. Unbekannte Fragmente öffnen die Übersicht.

Stabile Slugs: `announcements`, `general`, `bugs`, `ideas`, `guides`, `groups`,
`trading`, `offtopic`. Die bisherigen Kategorie-Titel stammen weiter aus `catalog.copy`;
neue UI-Texte aus `catalog.messages` mit dem Präfix `forum.`.

Eine manuelle Speicherung über **Lokal speichern** legt höchstens einen Entwurf je
Kategorie unter dem Browser-Schlüssel `zhserver_forum_drafts_v1` ab:

```json
{
  "version": 1,
  "drafts": {
    "<category-slug>": { "title": "...", "body": "...", "updatedAt": "<ISO timestamp>" }
  }
}
```

Das ist ausschließlich Browser-Speicher; Entwürfe sind keine öffentlichen Themen und
werden nicht an einen Server übertragen. Titel sind auf 120, Beiträge auf 8.000 Zeichen
begrenzt. Gespeicherte Texte werden beim Laden auf ihre Struktur geprüft und ausschließlich
über `textContent` ausgegeben. Absätze bleiben erhalten; HTML und Anhänge werden nicht
gerendert. Es gibt keine automatische Veröffentlichung oder automatische Speicherung.

Ungespeicherte Änderungen bleiben beim Wechsel zwischen den Forum-Ansichten in dieser
geöffneten Seite erhalten. Vor einem Verlassen/Reload mit ungespeicherten Änderungen wird
die native Browserwarnung angefordert. Mit **Lokal speichern** gesicherte Entwürfe überstehen
einen Reload. Ein Verwerfen braucht eine ausdrückliche Bestätigung innerhalb der Oberfläche
und betrifft ausschließlich den Entwurf der aktuellen Kategorie.

Bei nicht verfügbarem oder beschädigtem Browser-Speicher bleibt die Oberfläche nutzbar.
Sie meldet klar, dass der Text nur in der geöffneten Seite vorhanden ist; beschädigte Daten
werden nicht still überschrieben. Änderungen anderer Kategorien aus einem zweiten Tab
werden vor dem Speichern eingelesen. Änderungen im aktiven, ungespeicherten Entwurf werden
dabei nicht durch einen anderen Tab überschrieben. Kein Anspruch auf eine serverseitige
Synchronisation oder eine vollständige Konfliktauflösung für paralleles Bearbeiten.

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

## Nächste sinnvolle Schritte

1. Die belegte bestehende Supabase-Anmeldung aus `AUTH_AUDIT.md` wiederverwenden.
   Session und Admin-UID erhalten. Vor Profil-/Rollenänderungen die noch offenen
   produktiven Backend-Strukturen prüfen; keine parallelen Konten oder Tabellen.
2. Auf Basis der vorhandenen Kategorie-Slugs Themen und Beiträge mit serverseitigen
   Leserechten, Schreibrechten, Paginierung und Spam-Schutz planen.
3. Erst nach gesondertem Backend-Auftrag echte Daten und Kontenanbindung implementieren;
   lokale Entwürfe dürfen dabei nur nach ausdrücklichem Nutzerklick veröffentlicht werden.

Öffentliche Themen, gespeicherte Server-Beiträge, Antworten, Konten, Reaktionen,
Moderation und Benachrichtigungen sind weiterhin nicht implementiert. Der lokale
Entwurf und seine Vorschau ersetzen keine dieser Backend-Funktionen.

## Auth-Abgleich vom 07.10.2026

Die vorhandene Admin-Anmeldung ist der Ausgangspunkt für die zentrale ZHServer-
Anmeldung. Sie nutzt dasselbe Supabase-Projekt wie die Homepage und speichert die
SDK-Session unter `sb-yawadxzeyyrozmlrokun-auth-token`. Auf derselben Origin ist
sie auch außerhalb von `/admin` verfügbar. Das Forum braucht dafür später einen
gemeinsamen Session-Zugriff, keinen eigenen Passwort-/Account-Dienst.

Die Frontend-Adminprüfungen unterscheiden sich derzeit: Dashboard, Gästebuch und
Galerie prüfen nur eine Session; Bugs/Ideen prüft die feste Admin-ID. Die echten
Profil-/Rollentabellen und RLS-Regeln sind noch nicht vollständig einsehbar.
Deshalb keine produktive Konto-/Profil-/Foren-Anbindung und keine Rollen-Migration
auf Basis einer vermuteten Tabelle starten. Details, Prüfung und weitere Schritte
stehen in `AUTH_AUDIT.md`; `auth_structure_audit.sql` ist ausschließlich vorbereitet.
