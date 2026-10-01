# Homepage DE / EN

Die lokale Sprachverwaltung gilt für `index.html`, `game.html` und
`bugs/index.html`. Die Seiten behalten ihre gemeinsame bestehende Struktur.
`wiki.html`, die Wiki-Daten und der eingebettete Spielclient nehmen nicht an
der Übersetzung teil.

## Sprachdaten und Einbindung

- `assets/js/translations.js` enthält die deutschen und englischen Texte.
  `copy` verwaltet feste Texte einschließlich Metadaten, Navigation,
  Changelog, Formularbeschriftungen und zugänglicher Bildbeschreibungen.
  `messages` enthält Meldungen mit Platzhaltern, beispielsweise `{count}`.
- `assets/js/i18n.js` stellt `window.ZHLanguage` bereit. Es startet nur auf
  Seiten mit `data-homepage-i18n` am `<html>`-Element. Beide Sprachskripte
  werden im Kopf der Seite in dieser Reihenfolge geladen.
- `assets/css/i18n.css` gestaltet den DE/EN-Schalter und schafft den nötigen
  Platz in der bestehenden Navigation. Die bereits lokal geänderte
  gemeinsame `style.css` bleibt unverändert.
- Die Wahl wird unter `zh_language` im `localStorage` gespeichert. Ohne
  gespeicherte Wahl gilt Deutsch. Bei gesperrtem Browser-Speicher funktioniert
  der Wechsel während der Sitzung weiterhin. Änderungen werden auch an
  andere offene Tabs derselben Herkunft weitergegeben.

## Weitere Texte ergänzen

Für festen Text einen Eintrag mit `de` und `en` in `copy` ergänzen. Der
deutsche Text entspricht dem Text im HTML bzw. dem erzeugten DOM; mehrfacher
Leerraum wird zum Abgleich zusammengefasst. Bei Sätzen mit `<strong>` oder
anderen eingebetteten Elementen sind die einzelnen Textabschnitte erfasst.
Beide Fassungen müssen zusammen einen natürlichen Satz ergeben.

Das Script übersetzt einzelne Textknoten und ausgewählte Attribute. Es
ersetzt keine Abschnitte durch neue HTML-Kopien. Links, Icons, Event-Handler,
Formularwerte, ausgewählte Kategorien und geöffnete Bereiche bleiben erhalten.
Neu angelegte Oberflächentexte werden über einen MutationObserver erfasst.
Spielernamen sowie Texte aus Gästebuch, Galerie und Feedback werden ausgelassen.
Eigene Nutzerinhalte zusätzlich mit `data-i18n-ignore` markieren.

Für Meldungen mit variablen Werten einen Schlüssel in `messages` ergänzen:

```js
ZHLanguage.bind(element, "feedback.author", { name: playerName });
ZHLanguage.bind(button, "feedback.screenshot.open", { title }, "aria-label");
```

`bind` schreibt reinen Text bzw. ein Attribut und aktualisiert die Meldung
beim Sprachwechsel. `ZHLanguage.text(deutscherText)` liefert eine feste
Übersetzung, beispielsweise für einen Dialog. `ZHLanguage.locale` liefert
`de-DE` bzw. `en-GB`. Datum und Zahlen können über `data-i18n-date`,
`data-i18n-datetime` und `data-i18n-number` markiert werden.

Die unveränderten deutschen HTML-Texte dienen zugleich als Fallback, wenn
JavaScript deaktiviert ist. Die Kategorien in Formularen behalten ihre
deutschen Backend-Werte; allein ihre sichtbaren Beschriftungen wechseln.

## Prüfumfang dieser Änderung

Am 30.09.2026 lokal in Chrome geprüft; 15 Prüfgruppen erfolgreich:

- Alle drei Seiten: DE/EN, vollständige Rückkehr der deutschen Texte,
  unveränderte Linkziele und gespeicherte Sprache nach Reload.
- Desktop bei 1440 Pixeln sowie 390, 768 und 1280 Pixel: beide Sprachen,
  sichtbarer Sprachschalter, mobile Navigation und kein horizontaler Überlauf.
  Englische Desktop- und Mobile-Screenshots wurden visuell geprüft.
- Feedback: Beschriftungen, Status, Pflichtfelder, Dateityp-/Größenprüfung,
  Screenshot-Vergrößerung, erfolgreiche Bug-/Ideen-Meldungen und Backend-Fehler.
  Eingegebene Texte und ursprüngliche Kategorienwerte bleiben erhalten.
- Gästebuch, Datumsanzeige, Dialoge, Abstimmung und Funkgerät;
  Nutzerinhalte und bestehende Zustände bleiben beim Sprachwechsel erhalten.
- Spielseite: Zahlen, Punktestand, ältere Versionen und geöffnete Changelogs.
  Direkter Spielaufruf behält Client-URL und Serverparameter; Vollbildmeldung
  übersetzt. Der eingebettete Spielclient wurde für diese Prüfung simuliert.
- Mobile Seitenwechsel, Sprachabgleich zwischen Tabs und Bedienung bei
  gesperrtem Browser-Speicher.
- JavaScript-Parser einschließlich Inline-Script der Spielseite: fehlerfrei.
  Keine JavaScript-Fehler im Browser; `git diff --check` ohne Beanstandungen.

Netzwerkzugriffe auf Community-Daten wurden simuliert. Es wurden keine echten
Einträge oder Stimmen veröffentlicht. Kein Commit, Push oder Webexport.
Wiki, gemeinsame `style.css`, vorhandene Wiki-Werkzeuge und Spieldateien wurden
von dieser Änderung nicht bearbeitet. Parallel hinzugekommene Wiki-Änderungen
wurden ebenfalls erhalten.
