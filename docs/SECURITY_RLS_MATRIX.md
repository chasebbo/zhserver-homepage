# RLS-Matrix – produktiver Lesesnapshot 15.10.2026

32 Tabellen, 35 Policies. Stand vor der vorbereiteten Gästebuch-Korrektur. Keine produktive Änderung.

**Nachtrag 16.10.2026:** H01 ist produktiv behoben; Migration `20261016050805_homepage_guestbook_read_security` entfernt ausschließlich `Enable read access for all users`. Die folgende Tabelle bleibt als historischer Vorher-Snapshot erhalten. Aktuell gelten für Gästebuch-SELECT nur `approved=true` und die bestehende Adminrollen-Policy; alle sechs anderen Gästebuch-Policies sind unverändert. Verifikation und Datenintegrität: [SECURITY_AUDIT.md, H01](SECURITY_AUDIT.md#h01--behoben-gästebuchfreigabe-schützt-den-api-lesezugriff).

RLS und GRANT gelten gemeinsam. „Nein“ bedeutet keine direkt wirksame Tabellenfreigabe für diese Rolle; RPCs können bewusst begrenzte Zugriffe vermitteln. Private Schemas sind laut echter REST-Probe nicht exponiert (PGRST106). Public-Bucket-Downloads werden durch die Storage-API gesondert bedient. Eigentümer und service_role umgehen RLS; die Homepage enthält keinen solchen Schlüssel.

| Tabelle | RLS | Public SELECT | Auth SELECT | INSERT | UPDATE | DELETE | Admin | Befund |
|---|---|---|---|---|---|---|---|---|
| zh_forum_private.post_reactions | JA | Nein (GRANT) | Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | RPC / keine Sonderpolicy | RPC-only / eigene Einwilligung |
| zh_pulse_private.votes | JA | Nein (GRANT) | Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | RPC / keine Sonderpolicy | RPC-only / eigene Einwilligung |
| zh_forum_private.view_totals | JA | Nein (GRANT) | Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | RPC / keine Sonderpolicy | RPC-only / eigene Einwilligung |
| zh_forum_private.view_windows | JA | Nein (GRANT) | Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | RPC / keine Sonderpolicy | RPC-only / eigene Einwilligung |
| storage.objects | JA | Nein (keine Policy) | eigene UUID / Pfad; Adminrolle; Adminrolle | anon: Öffentliche Uploads in gallery; Public can upload feedback screenshots; auth: Öffentliche Uploads in gallery; Public can upload feedback screenshots; eigene UUID / Pfad | anon: Nein (keine Policy); auth: Adminrolle | anon: Nein (keine Policy); auth: Adminrolle; eigene UUID / Pfad; Adminrolle | Rollenpolicy | Bucket-/Pfadgrenzen separat unten |
| storage.buckets | JA | Nein (keine Policy) | Nein (keine Policy) | anon: Nein (keine Policy); auth: Nein (keine Policy) | anon: Nein (keine Policy); auth: Nein (keine Policy) | anon: Nein (keine Policy); auth: Nein (keine Policy) | RPC / keine Sonderpolicy | keine allgemeine Fremd-Schreibpolicy |
| public.guestbook | JA | approved-Bedingung; ALLE (true) | approved-Bedingung; ALLE (true); Adminrolle | anon: ALLE (true); auth: approved-Bedingung | anon: Nein (keine Policy); auth: Adminrolle | anon: Nein (keine Policy); auth: Adminrolle | Rollenpolicy | H01: zusätzliche öffentliche true-Policy |
| public.visitor_stats | JA | Nein (keine Policy) | Nein (keine Policy) | anon: Nein (keine Policy); auth: Nein (keine Policy) | anon: Nein (keine Policy); auth: Nein (keine Policy) | anon: Nein (keine Policy); auth: Nein (keine Policy) | RPC / keine Sonderpolicy | keine allgemeine Fremd-Schreibpolicy |
| public.gallery | JA | approved-Bedingung | approved-Bedingung; Adminrolle | anon: approved-Bedingung; auth: approved-Bedingung | anon: Nein (keine Policy); auth: Adminrolle | anon: Nein (keine Policy); auth: Adminrolle | Rollenpolicy | keine allgemeine Fremd-Schreibpolicy |
| public.profiles | JA | eigene UUID / Pfad | eigene UUID / Pfad | anon: Nein (keine Policy); auth: Nein (keine Policy) | anon: Nein (keine Policy); auth: Nein (keine Policy) | anon: Nein (keine Policy); auth: Nein (keine Policy) | RPC / keine Sonderpolicy | Eigene Daten; öffentliche Identität nur über RPC |
| public.player_inventory | JA | eigene UUID / Pfad | eigene UUID / Pfad | anon: Nein (keine Policy); auth: Nein (keine Policy) | anon: Nein (keine Policy); auth: Nein (keine Policy) | anon: Nein (keine Policy); auth: Nein (keine Policy) | RPC / keine Sonderpolicy | keine allgemeine Fremd-Schreibpolicy |
| public.player_bases | JA | eigene UUID / Pfad | eigene UUID / Pfad | anon: Nein (keine Policy); auth: Nein (keine Policy) | anon: Nein (keine Policy); auth: Nein (keine Policy) | anon: Nein (keine Policy); auth: Nein (keine Policy) | RPC / keine Sonderpolicy | keine allgemeine Fremd-Schreibpolicy |
| public.death_drops | JA | Nein (keine Policy) | Nein (keine Policy) | anon: Nein (keine Policy); auth: Nein (keine Policy) | anon: Nein (keine Policy); auth: Nein (keine Policy) | anon: Nein (keine Policy); auth: Nein (keine Policy) | RPC / keine Sonderpolicy | keine allgemeine Fremd-Schreibpolicy |
| public.player_groups | JA | eigene UUID / Pfad | eigene UUID / Pfad | anon: Nein (keine Policy); auth: Nein (keine Policy) | anon: Nein (keine Policy); auth: Nein (keine Policy) | anon: Nein (keine Policy); auth: Nein (keine Policy) | RPC / keine Sonderpolicy | keine allgemeine Fremd-Schreibpolicy |
| public.group_members | JA | eigene UUID / Pfad | eigene UUID / Pfad | anon: Nein (keine Policy); auth: Nein (keine Policy) | anon: Nein (keine Policy); auth: Nein (keine Policy) | anon: Nein (keine Policy); auth: Nein (keine Policy) | RPC / keine Sonderpolicy | keine allgemeine Fremd-Schreibpolicy |
| public.clans | JA | eigene UUID / Pfad | eigene UUID / Pfad | anon: Nein (keine Policy); auth: Nein (keine Policy) | anon: Nein (keine Policy); auth: Nein (keine Policy) | anon: Nein (keine Policy); auth: Nein (keine Policy) | RPC / keine Sonderpolicy | keine allgemeine Fremd-Schreibpolicy |
| public.clan_members | JA | eigene UUID / Pfad | eigene UUID / Pfad | anon: Nein (keine Policy); auth: Nein (keine Policy) | anon: Nein (keine Policy); auth: Nein (keine Policy) | anon: Nein (keine Policy); auth: Nein (keine Policy) | RPC / keine Sonderpolicy | keine allgemeine Fremd-Schreibpolicy |
| public.player_presence | JA | Nein (keine Policy) | Nein (keine Policy) | anon: Nein (keine Policy); auth: Nein (keine Policy) | anon: Nein (keine Policy); auth: Nein (keine Policy) | anon: Nein (keine Policy); auth: Nein (keine Policy) | RPC / keine Sonderpolicy | keine allgemeine Fremd-Schreibpolicy |
| public.world_vehicles | JA | Nein (keine Policy) | Nein (keine Policy) | anon: Nein (keine Policy); auth: Nein (keine Policy) | anon: Nein (keine Policy); auth: Nein (keine Policy) | anon: Nein (keine Policy); auth: Nein (keine Policy) | RPC / keine Sonderpolicy | keine allgemeine Fremd-Schreibpolicy |
| public.community_feedback | JA | ALLE (true) | ALLE (true) | anon: Nein (keine Policy); auth: Nein (keine Policy) | anon: Nein (keine Policy); auth: Adminrolle | anon: Nein (keine Policy); auth: Adminrolle | Rollenpolicy | keine allgemeine Fremd-Schreibpolicy |
| public.community_votes | JA | Oeffentlicher Lesezugriff auf Votes | Oeffentlicher Lesezugriff auf Votes | anon: Nein (GRANT); auth: Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | RPC / keine Sonderpolicy | keine allgemeine Fremd-Schreibpolicy |
| public.player_state | JA | eigene UUID / Pfad | eigene UUID / Pfad | anon: Nein (GRANT); auth: Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | RPC / keine Sonderpolicy | keine allgemeine Fremd-Schreibpolicy |
| zh_forum_private.topics | JA | Nein (GRANT) | Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | RPC / keine Sonderpolicy | RPC-only / eigene Einwilligung |
| public.zh_community_presence | JA | Nein (GRANT) | Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | RPC / keine Sonderpolicy | RPC-only / eigene Einwilligung |
| zh_forum_private.posts | JA | Nein (GRANT) | Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | RPC / keine Sonderpolicy | RPC-only / eigene Einwilligung |
| zh_forum_private.profile_extras | JA | Nein (GRANT) | Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | RPC / keine Sonderpolicy | RPC-only / eigene Einwilligung |
| public.homepage_visitor_tracking | JA | Nein (GRANT) | Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | RPC / keine Sonderpolicy | RPC-only / eigene Einwilligung |
| public.homepage_visitor_days | JA | Nein (GRANT) | Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | RPC / keine Sonderpolicy | RPC-only / eigene Einwilligung |
| zh_identity_private.content_authors | JA | Nein (GRANT) | Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | RPC / keine Sonderpolicy | RPC-only / eigene Einwilligung |
| zh_legal_private.account_consents | JA | Nein (GRANT) | Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | RPC / keine Sonderpolicy | RPC-only / eigene Einwilligung |
| zh_identity_private.account_roles | JA | Nein (GRANT) | Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | RPC / keine Sonderpolicy | RPC-only / eigene Einwilligung |
| zh_pulse_private.polls | JA | Nein (GRANT) | Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | anon: Nein (GRANT); auth: Nein (GRANT) | RPC / keine Sonderpolicy | RPC-only / eigene Einwilligung |

## Tatsächliche Bedingungen aller Policies

| Objekt / Policy | Kommando | Rollen | USING | WITH CHECK |
|---|---|---|---|---|
| public.guestbook / Allow guestbook inserts | INSERT | anon | — | true |
| public.profiles / read own profile | SELECT | public | (auth.uid() = id) | — |
| public.player_inventory / read own inventory | SELECT | public | (auth.uid() = player_id) | — |
| storage.objects / Admin can delete gallery 1vs8c42_0 | DELETE | authenticated | ((bucket_id = 'gallery'::text) AND ( SELECT is_zh_admin() AS is_zh_admin)) | — |
| storage.objects / Admin can update gallery 1vs8c42_0 | UPDATE | authenticated | ((bucket_id = 'gallery'::text) AND ( SELECT is_zh_admin() AS is_zh_admin)) | ((bucket_id = 'gallery'::text) AND ( SELECT is_zh_admin() AS is_zh_admin)) |
| public.player_bases / read own bases | SELECT | public | (auth.uid() = owner_id) | — |
| public.group_members / read own group memberships | SELECT | public | (auth.uid() = player_id) | — |
| public.player_groups / read groups from own membership | SELECT | public | (EXISTS ( SELECT 1    FROM group_members gm   WHERE ((gm.group_id = player_groups.id) AND (gm.player_id = auth.uid())))) | — |
| public.clan_members / read own clan memberships | SELECT | public | (auth.uid() = player_id) | — |
| public.clans / read clans from own membership | SELECT | public | (EXISTS ( SELECT 1    FROM clan_members cm   WHERE ((cm.clan_id = clans.id) AND (cm.player_id = auth.uid())))) | — |
| public.player_state / read own player state | SELECT | public | (auth.uid() = player_id) | — |
| public.gallery / Public can read approved gallery | SELECT | anon, authenticated | (approved = true) | — |
| storage.objects / Öffentliche Uploads in gallery | INSERT | anon, authenticated | — | ((bucket_id = 'gallery'::text) AND (name ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(png\|jpg\|webp)$'::text)) |
| public.guestbook / Allow public read approved entries | SELECT | anon, authenticated | (approved = true) | — |
| public.community_feedback / Public can read community feedback | SELECT | anon, authenticated | true | — |
| storage.objects / Public can upload feedback screenshots | INSERT | anon, authenticated | — | ((bucket_id = 'community-feedback'::text) AND (name ~ '^bugs/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(png\|jpe?g\|webp)$'::text) AND (lower(COALESCE((metadata ->> 'mimetype'::text), ''::text)) = ANY (ARRAY['image/png'::text, 'image/jpeg'::text, 'image/webp'::text])) AND (COALESCE((NULLIF((metadata ->> 'size'::text), ''::text))::bigint, (5242881)::bigint) <= 5242880)) |
| public.guestbook / Enable read access for all users | SELECT | public | true | — |
| public.guestbook / ZH members can submit moderated guestbook entries | INSERT | authenticated | — | (approved = false) |
| zh_legal_private.account_consents / own_consent_read | SELECT | authenticated | (( SELECT auth.uid() AS uid) = user_id) | — |
| storage.objects / ZH avatar own read | SELECT | authenticated | ((bucket_id = 'zh-avatars'::text) AND ((storage.foldername(name))[1] = (( SELECT auth.uid() AS uid))::text)) | — |
| storage.objects / ZH avatar own cleanup | DELETE | authenticated | ((bucket_id = 'zh-avatars'::text) AND ((storage.foldername(name))[1] = (( SELECT auth.uid() AS uid))::text)) | — |
| public.community_votes / Oeffentlicher Lesezugriff auf Votes | SELECT | anon, authenticated | ((pulse_poll_id IS NULL) OR zh_pulse_private.option_visible(pulse_poll_id)) | — |
| storage.objects / ZH avatar own upload | INSERT | authenticated | — | ((bucket_id = 'zh-avatars'::text) AND ((storage.foldername(name))[1] = (( SELECT auth.uid() AS uid))::text) AND (name ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}\.(webp\|png\|jpg)$'::text) AND (NOT COALESCE(( SELECT ((auth.jwt() ->> 'is_anonymous'::text))::boolean AS bool), false))) |
| public.gallery / Admin can read gallery | SELECT | authenticated | ( SELECT is_zh_admin() AS is_zh_admin) | — |
| public.gallery / Admin can update gallery | UPDATE | authenticated | ( SELECT is_zh_admin() AS is_zh_admin) | ( SELECT is_zh_admin() AS is_zh_admin) |
| public.gallery / Admin can delete gallery | DELETE | authenticated | ( SELECT is_zh_admin() AS is_zh_admin) | — |
| public.guestbook / Admin can read all guestbook entries | SELECT | authenticated | ( SELECT is_zh_admin() AS is_zh_admin) | — |
| public.guestbook / Admin can update guestbook | UPDATE | authenticated | ( SELECT is_zh_admin() AS is_zh_admin) | ( SELECT is_zh_admin() AS is_zh_admin) |
| public.guestbook / Admin can delete guestbook | DELETE | authenticated | ( SELECT is_zh_admin() AS is_zh_admin) | — |
| public.community_feedback / Admin can update community feedback | UPDATE | authenticated | ( SELECT is_zh_admin() AS is_zh_admin) | ( SELECT is_zh_admin() AS is_zh_admin) |
| public.community_feedback / Admin can delete community feedback | DELETE | authenticated | ( SELECT is_zh_admin() AS is_zh_admin) | — |
| storage.objects / Admin can delete feedback screenshots | DELETE | authenticated | ((bucket_id = 'community-feedback'::text) AND ( SELECT is_zh_admin() AS is_zh_admin)) | — |
| storage.objects / Admin can delete gallery 1vs8c42_1 | SELECT | authenticated | ((bucket_id = 'gallery'::text) AND ( SELECT is_zh_admin() AS is_zh_admin)) | — |
| storage.objects / Admin can update gallery 1vs8c42_1 | SELECT | authenticated | ((bucket_id = 'gallery'::text) AND ( SELECT is_zh_admin() AS is_zh_admin)) | — |
| public.gallery / Öffentliche Galerie-Uploads erlauben | INSERT | anon, authenticated | — | ((approved = false) AND (image_url ~ '^https://yawadxzeyyrozmlrokun\.supabase\.co/storage/v1/object/public/gallery/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(png\|jpg\|webp)$'::text)) |

## Überbreite Grants

Zusätzlich rein katalogseitig geprüft: `auth.users`, `auth.sessions`, `auth.refresh_tokens` und `auth.identities` haben jeweils RLS aktiviert; weder anon noch authenticated besitzen dort SELECT-/INSERT-/UPDATE-/DELETE-Tabellenrechte. Es wurden daraus keine privaten Zeilen kopiert. Diese vier verwalteten Auth-Systemtabellen sind zusätzlich zu den 32 Anwendungs-/Storage-Tabellen oben geprüft. Berechtigte Auth-API-Aktionen sind davon getrennt; die Homepage nutzt keinen direkten Tabellenzugriff darauf.

TRUNCATE ist bei den folgenden Tabellen an anon oder authenticated vergeben. RLS schützt TRUNCATE nicht. PostgREST bietet aber keinen allgemeinen TRUNCATE-Endpunkt; im geprüften Bestand wurde kein anonymer RPC gefunden, der diese Rechte dafür nutzbar macht. Deshalb Hygiene-/Folgerisiko, kein behaupteter aktueller Lösch-Exploit. Vor einem späteren REVOKE sind insbesondere Spiel-/Serverabhängigkeiten gesondert zu prüfen.

- public.guestbook: anon=true, authenticated=true
- public.visitor_stats: anon=true, authenticated=true
- public.gallery: anon=true, authenticated=true
- public.profiles: anon=true, authenticated=true
- public.player_inventory: anon=true, authenticated=true
- public.player_bases: anon=true, authenticated=true
- public.death_drops: anon=true, authenticated=true
- public.player_groups: anon=true, authenticated=true
- public.group_members: anon=true, authenticated=true
- public.clans: anon=true, authenticated=true
- public.clan_members: anon=true, authenticated=true
- public.player_presence: anon=true, authenticated=true
- public.world_vehicles: anon=true, authenticated=true
- public.community_feedback: anon=true, authenticated=true

## Storage

| Bucket | Öffentliches Objektlesen | Limit | MIME | Schreibschutz |
|---|---|---|---|---|
| community-feedback | true | 5242880 Bytes | image/png, image/jpeg, image/webp | Strikter Rasterdateipfad; Galerie-Gastupload ausdrücklich vorgesehen; Admin-DELETE |
| zh-avatars | true | 262144 Bytes | image/png, image/jpeg, image/webp | Anmeldung, eigener UUID-Ordner, Rasterdateiname; kein UPDATE; Profilzuordnung prüft Objektmetadaten |
| gallery | true | 5242880 Bytes | image/png, image/jpeg, image/webp | Strikter Rasterdateipfad; Galerie-Gastupload ausdrücklich vorgesehen; Admin-DELETE |

Ein public Bucket macht die bekannte Objekt-URL auch vor einer Galerie-Freigabe abrufbar. Freigabe schützt die öffentliche Liste, nicht die Vertraulichkeit einer bereits hochgeladenen Datei. Größen-/MIME-Einstellungen sind kein garantierter Dateiinhaltscanner.
