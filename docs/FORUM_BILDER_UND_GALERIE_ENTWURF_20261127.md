# Bilder im Forum und Galerie „Spiel heute“ (Entwurf 27.11.2026)

Auftrag Sebastian 27.11.2026 20:05. Nichts davon ist an Datenbank oder Speicher ausgeführt.

## 1. Bild anhängen im Forum

- Gebaut ohne Änderung an Datenbank oder Speicher. Das Forum nutzt das Hochladen der Galerie
  (`assets/js/zh-bild-hochladen.js`, von `gallery.js` und vom Forum benutzt): Bucket `gallery`,
  Dateiname `<uuid>.png|jpg|webp`, höchstens 5 MB. Das erlaubt die bestehende Regel
  „Öffentliche Uploads in gallery“ schon heute.
- Im Beitragstext steht pro Bild eine eigene Zeile `[bild:<uuid>.<endung>]`. Nur solche Zeilen werden
  im Beitrag und in der Vorschau zu Bildern (höchstens 4 pro Beitrag), alles andere bleibt Text.
  Fremde Adressen sind nicht möglich, das Bild kommt immer aus dem eigenen Speicher.
- Große Fotos (etwa vom iPhone) werden vor dem Hochladen im Browser auf höchstens 2048 Pixel an der
  langen Seite verkleinert und als WebP (sonst JPEG) gespeichert, bis sie unter 5 MB liegen.
  Die Galerie bleibt beim bisherigen Verhalten (unverändert prüfen, nicht verkleinern).

### SQL-Entwurf (nicht ausgeführt, nur falls Sebastian es will)

```sql
-- A) Optional: Forum-Bilder in einen eigenen Ordner forum/ legen, nur für angemeldete Mitglieder.
--    Danach müssten zh-bild-hochladen.js und forum-bilder.js den Namen forum/<uuid>.<endung> verwenden.
create policy "Forum-Bilder nur fuer Mitglieder"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'gallery'
  and name ~ '^forum/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(png|jpg|webp)$'
  and not coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false)
  and lower(coalesce(metadata ->> 'mimetype', '')) = any (array['image/png', 'image/jpeg', 'image/webp'])
  and coalesce(nullif(metadata ->> 'size', '')::bigint, 5242881) <= 5242880
);

-- B) Optional: die bestehende Galerie-Regel um Dateityp und Größe ergänzen, wie beim Bucket community-feedback.
--    (Bucket-Grenzen 5 MB und Bildtypen gelten schon; das wäre eine zweite Sicherung.)
-- alter policy "Öffentliche Uploads in gallery" on storage.objects
-- with check (
--   bucket_id = 'gallery'
--   and name ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(png|jpg|webp)$'
--   and lower(coalesce(metadata ->> 'mimetype', '')) = any (array['image/png', 'image/jpeg', 'image/webp'])
--   and coalesce(nullif(metadata ->> 'size', '')::bigint, 5242881) <= 5242880
-- );

-- C) Nur lesend: hochgeladene Bilder, die weder in der Galerie noch in einem Forumbeitrag stehen
--    (z. B. angehängt, aber der Beitrag wurde nie abgeschickt). Zum gelegentlichen Aufräumen durch einen Admin.
select o.name, o.created_at
from storage.objects o
where o.bucket_id = 'gallery'
  and o.created_at < now() - interval '1 day'
  and not exists (select 1 from public.gallery g where g.image_url like '%/' || o.name)
  and not exists (select 1 from zh_forum_private.posts p where p.body like '%[bild:' || o.name || ']%')
order by o.created_at;
```

## 2. Galerie „Spiel heute“: heutige Bilder

In `gallery.html`, Abschnitt `data-gallery-group="game"`, 13 Bilder (jeweils `-960.webp` als Vorschau,
`-full.webp` beim Klick, Ordner `assets/images/gameplay/`):

| Nr. | Datei | Seit | Bildtext | Auch verwendet in |
| --- | --- | --- | --- | --- |
| 1 | start-4in1 (Vorschau 640) | 02.11. | Vier Szenen: Portal Basis Ost, Horde vor Tor Nord, Lagerfeuer, Steinbruch Ost | Testseite, Handy-Testseite |
| 2 | market-day | 25.10. | Handelsplatz der Safezone am Tag | Changelog-Band der Startseite |
| 3 | quarry-east | 25.10. | Steinbruch Ost mit Bagger, Radlader und Muldenkipper | Startseite |
| 4 | north-gate-pickup | 25.10. | Tor Nord: Ein Pickup fährt hinaus | nur Galerie |
| 5 | north-gate-eagle | 25.10. | Tor Nord am Abend: Eagle V fährt ein | nur Galerie |
| 6 | base-east-8x8 | 25.10. | Militär-Lkw 8x8 an der Einfahrt der Basis Ost | nur Galerie |
| 7 | eagle-mg-action | 25.10. | Eagle V feuert mit dem Fahrzeug-MG | Changelog-Band der Startseite |
| 8 | north-gate-horde | 02.11. | Horde vor Tor Nord | nur Galerie |
| 9 | campfire-evening | 02.11. | Treffpunkt der Safezone am Abend, Lagerfeuer | zh-pages.css (Hintergrund) |
| 10 | boxing-ring | 02.11. | Boxring in der Safezone | Changelog-Band der Startseite |
| 11 | quarry-east-morning | 02.11. | Steinbruch Ost am Vormittag | Startseite |
| 12 | base-east-checkpoint | 02.11. | Kontrollpunkt Basis Ost | nur Galerie |
| 13 | north-gate-horde-turned | 02.11. | Tor Nord aus schräger Sicht, Zombies drängen | nur Galerie |

## 3. So geht der Austausch, wenn Sebastian die Bilder ausgewählt hat

1. Opus legt die Bilder nach `C:\ZHServer-Dev\zh-survival\validation\galerie-spiel-heute\`
   (am 27.11. um 20:05 gab es den Ordner noch nicht). Sebastian wählt aus und nennt Reihenfolge und Bildtext.
2. Je Bild zwei Dateien unter neuem Namen (nie einen alten Namen wiederverwenden):
   `assets/images/gameplay/<name>-960.webp` (Vorschau, 960 Pixel breit) und `<name>-full.webp` (groß),
   als WebP, Bildtext ohne Gedankenstriche. Prüfsummen der Vorlagen werden festgehalten.
3. In `gallery.html` nur die `<li>`-Zeilen im Abschnitt „Spiel heute“ ersetzen, Alt-Text deutsch und
   englisch in `translations.js`, Versionsmarke von `gallery.html` erhöhen.
4. Alte Bilder, die noch auf Startseite, Changelog-Band, Testseiten oder in `zh-pages.css` stehen
   (Nr. 1, 2, 3, 7, 9, 10, 11), bleiben liegen, bis Sebastian dort auch tauscht. Die übrigen (Nr. 4, 5, 6, 8,
   12, 13) werden nach dem Austausch archiviert und entfernt.
5. Bilder PC und Handy vorher und nachher zeigen, Push nur nach Sebastians „Push frei“.
