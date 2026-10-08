# Homepage – Gesamtstand zur Veröffentlichung am 08.10.2026

Freigegeben ist der gesamte aktuelle Homepage-Working-Tree auf `main`, einschließlich
aller integrierten Homepage-Wiki-Dateien. Ausgangscommit: `0f83ef66a1e40ae31dce0a3b16821ca82b6aa8b5`.
Kein Spielprojekt-, Dedicated- oder Webexport-Auftrag. Keine neue Supabase-Migration.

## Enthaltener Stand

- Gemeinsamer Account-Header, zentraler Login/Logout, Registrierung und lesendes Profil;
  bestehender Supabase-Client/Session und bestätigter öffentlicher Anzeigename.
- Passwort-vergessen- und Recovery-Seite mit `PASSWORD_RECOVERY`, `updateUser`,
  neutraler Antwort und Callback `https://www.zhserver.de/account/reset-password/`.
- Nutzungsbedingungen und Community-Regeln DE/EN, Pflichtcheckbox, getrennte
  Datenschutzhinweise und produktive Consent-Policy mit Versionen `2026-10-08`.
- Forum mit Kategorien, Suche, zentraler Accountdarstellung, lokalen Entwürfen und
  Vorschau. **Keine öffentliche Veröffentlichung oder serverseitigen Themen/Antworten.**
- Kompaktes Gästebuch und Galerie mit zentraler Identität; Gastverhalten erhalten.
- Gemeinsamer Footer mit getrennten Community-/Besucherquellen, Reset-Hinweis und
  vier Rechtslinks; Presence und persistente Besucherstatistik bleiben unverändert.
- Aktuelle Startseite, Arma-Infoseite, Gamepage und vollständiger vorhandener Wiki-Stand.
- Homepage-Game-Bridge nutzt dieselbe Session. Spiel-/Dedicated-End-to-End bleibt
  eine separate Abnahme; kein neues Spiel- oder Gastbackend wird damit behauptet.

## Gezielte Abschlusskorrekturen

- Alte künstliche Galerie-Like-Startwerte entfernt. Vorhandene Merkauswahl im Browser
  bleibt erhalten; Werte 0/1 und Beschriftungen nennen ausdrücklich die lokale Auswahl.
  Kein Upload-/Moderations-/Backendumbau.
- Versionen geänderter CSS-/JS-Referenzen auf `20261008-release1` aktualisiert,
  damit frühere Browser-Caches den neuen gemeinsamen Stand nicht verdecken.

## Prüfungen vor dem Commit

- 13 Browser-Prüfgruppen, 66 DE/EN-Ansichten; Desktop 1440/1280,
  Tablet 768, Mobile 390/360 px. Header/Menu/Footer, Account/Consent/Profil/Logout,
  Passwort-Reset, Forum/Kategorien/Suche/Drafts, Gästebuch/Galerie und Wiki geprüft.
- Bestehende Game-Bridge zusätzlich mit gezielten Session-/Ablauf-/Speicher-/
  Message-Contract-Fixtures geprüft. Nur Homepage-Dateien, kein Godot gestartet.
- JS-/Console-/HTTP-/Request-Fehler 0, horizontale Überläufe 0.
- 436 lokale Links/Ressourcen ohne fehlende Datei oder statisches Fragment.
- Bestehendes Wiki-Prüfwerkzeug: 13.982 Prüfungen, 302 Einträge, Fehler 0;
  generierte Daten und referenzierte Ressourcen konsistent. Keine Neuerzeugung nötig.
- `git diff --check` sauber; geplante Dateien auf Secrets/private Tokens und
  Test-/Tempdateien geprüft. Nur bestehende öffentliche Supabase-Anon-Clientkeys.
- Keine neue Consent-/Presence-/Identitäts-/Besuchermigration und keine produktiven
  Registrierung, Mail, Beiträge, Uploads oder Tracking-Schreibaufrufe beim QA.
  Die bestätigte Migration `20261008101121_homepage_account_legal_consent` bleibt aktiv.
- Custom SMTP ist laut Nutzer manuell produktiv konfiguriert. Echter STRATO-/Supabase-
  Recovery-Mailtest erfolgt separat; keine SMTP-Konfiguration oder Secrets gelesen.

Prüfprotokolle/Screenshots liegen außerhalb des Repositories im Temp-/Visualisierungs-
ordner `zhserver-release-20261008`. Ein zunächst falscher QA-Vorschaupfad wurde auf
`#preview/` korrigiert; bestandene Gruppen wurden wiederverwendet.

## Bewusst lokal erhalten, nicht veröffentlicht

19 vorhandene Dateien unter `tools/validation/wiki-structure-20260930/`:
Snapshots/Backups, Browser-Testskripte, Testberichte und Screenshots. Keine davon
verwerfen oder in diesen Commit aufnehmen. Alle übrigen geprüften fertigen
Homepage-Änderungen werden gemeinsam veröffentlicht.

## Vollständige vorgesehene Commit-Dateiliste (304)

```text
AGENTS.md
account/index.html
account/reset-password/index.html
admin/dashboard.html
admin/dashboard.js
arma/index.html
assets/css/account.css
assets/css/arma-page.css
assets/css/community-stats.css
assets/css/forum.css
assets/css/global-footer.css
assets/css/homepage-bridge.css
assets/css/homepage-premium.css
assets/css/identity.css
assets/css/legal.css
assets/data/wiki-entries.json
assets/images/wiki/master-kit-v1/bunker_bollard_01.png
assets/images/wiki/master-kit-v1/bunker_cable_trough_h_01.png
assets/images/wiki/master-kit-v1/bunker_cable_trough_v_01.png
assets/images/wiki/master-kit-v1/bunker_caged_lamp_01.png
assets/images/wiki/master-kit-v1/bunker_endblock_01.png
assets/images/wiki/master-kit-v1/bunker_floor_grille_h_01.png
assets/images/wiki/master-kit-v1/bunker_floor_grille_v_01.png
assets/images/wiki/master-kit-v1/bunker_mouth_h_01.png
assets/images/wiki/master-kit-v1/bunker_mouth_v_01.png
assets/images/wiki/master-kit-v1/bunker_service_hatch_01.png
assets/images/wiki/master-kit-v1/bunker_wall_h_01.png
assets/images/wiki/master-kit-v1/bunker_wall_v_01.png
assets/images/wiki/master-kit-v1/civic_corner_ne_01.png
assets/images/wiki/master-kit-v1/civic_corner_nw_01.png
assets/images/wiki/master-kit-v1/civic_corner_se_01.png
assets/images/wiki/master-kit-v1/civic_corner_sw_01.png
assets/images/wiki/master-kit-v1/civic_doorframe_h_01.png
assets/images/wiki/master-kit-v1/civic_doorframe_v_01.png
assets/images/wiki/master-kit-v1/civic_floor_tile_01.png
assets/images/wiki/master-kit-v1/civic_parapet_h_01.png
assets/images/wiki/master-kit-v1/civic_parapet_v_01.png
assets/images/wiki/master-kit-v1/civic_police_sign_01.png
assets/images/wiki/master-kit-v1/civic_roof_bitumen_01.png
assets/images/wiki/master-kit-v1/civic_wall_h_01.png
assets/images/wiki/master-kit-v1/civic_wall_v_01.png
assets/images/wiki/master-kit-v1/civic_window_h_01.png
assets/images/wiki/master-kit-v1/civic_window_v_01.png
assets/images/wiki/master-kit-v1/clinic_arrival_canopy_h_02.png
assets/images/wiki/master-kit-v1/clinic_atrium_h_02.png
assets/images/wiki/master-kit-v1/clinic_atrium_v_02.png
assets/images/wiki/master-kit-v1/clinic_canopy_h_01.png
assets/images/wiki/master-kit-v1/clinic_canopy_v_01.png
assets/images/wiki/master-kit-v1/clinic_double_frame_h_01.png
assets/images/wiki/master-kit-v1/clinic_double_frame_v_01.png
assets/images/wiki/master-kit-v1/clinic_facade_bay_h_02.png
assets/images/wiki/master-kit-v1/clinic_facade_bay_v_02.png
assets/images/wiki/master-kit-v1/clinic_fascia_h_02.png
assets/images/wiki/master-kit-v1/clinic_fascia_v_02.png
assets/images/wiki/master-kit-v1/clinic_partition_h_01.png
assets/images/wiki/master-kit-v1/clinic_partition_v_01.png
assets/images/wiki/master-kit-v1/clinic_roof_ahu_h_02.png
assets/images/wiki/master-kit-v1/clinic_roof_ahu_v_02.png
assets/images/wiki/master-kit-v1/clinic_service_penthouse_02.png
assets/images/wiki/master-kit-v1/clinic_treatment_roof_02.png
assets/images/wiki/master-kit-v1/clinic_ward_roof_h_02.png
assets/images/wiki/master-kit-v1/clinic_window_band_h_01.png
assets/images/wiki/master-kit-v1/clinic_window_band_v_01.png
assets/images/wiki/master-kit-v1/garage-building-exterior-v1.png
assets/images/wiki/master-kit-v1/garage-building-interior-v1.png
assets/images/wiki/master-kit-v1/garage-building-night-v1.png
assets/images/wiki/master-kit-v1/garage_bay_front_h_01.png
assets/images/wiki/master-kit-v1/garage_bay_front_v_01.png
assets/images/wiki/master-kit-v1/garage_compressor_h_01.png
assets/images/wiki/master-kit-v1/garage_compressor_v_01.png
assets/images/wiki/master-kit-v1/garage_diagnostic_cart_h_01.png
assets/images/wiki/master-kit-v1/garage_diagnostic_cart_v_01.png
assets/images/wiki/master-kit-v1/garage_engine_stand_h_01.png
assets/images/wiki/master-kit-v1/garage_engine_stand_v_01.png
assets/images/wiki/master-kit-v1/garage_service_roof_h_01.png
assets/images/wiki/master-kit-v1/garage_service_roof_v_01.png
assets/images/wiki/master-kit-v1/gas-station-exterior-v1.png
assets/images/wiki/master-kit-v1/gas-station-interior-v1.png
assets/images/wiki/master-kit-v1/gas-world-build-player-scale-v1.png
assets/images/wiki/master-kit-v1/gas_canopy_h_01.png
assets/images/wiki/master-kit-v1/gas_canopy_v_01.png
assets/images/wiki/master-kit-v1/gas_fascia_wall_h_01.png
assets/images/wiki/master-kit-v1/gas_fascia_wall_v_01.png
assets/images/wiki/master-kit-v1/gas_oil_display_h_01.png
assets/images/wiki/master-kit-v1/gas_oil_display_v_01.png
assets/images/wiki/master-kit-v1/gas_pump_h_01.png
assets/images/wiki/master-kit-v1/gas_pump_island_h_01.png
assets/images/wiki/master-kit-v1/gas_pump_island_v_01.png
assets/images/wiki/master-kit-v1/gas_pump_v_01.png
assets/images/wiki/master-kit-v1/gas_service_cabinet_h_01.png
assets/images/wiki/master-kit-v1/gas_service_cabinet_v_01.png
assets/images/wiki/master-kit-v1/hospital-architecture-quality-interior-v2.png
assets/images/wiki/master-kit-v1/hospital-architecture-quality-reference-v2.png
assets/images/wiki/master-kit-v1/hospital-exterior-art-reference-v3.png
assets/images/wiki/master-kit-v1/hospital-exterior-without-sign-v3.png
assets/images/wiki/master-kit-v1/hospital-modular-building-reference.png
assets/images/wiki/master-kit-v1/hospital-modular-interior.png
assets/images/wiki/master-kit-v1/hospital_instrument_workbench_h_01.png
assets/images/wiki/master-kit-v1/hospital_instrument_workbench_v_01.png
assets/images/wiki/master-kit-v1/hospital_medical_cabinet_h_01.png
assets/images/wiki/master-kit-v1/hospital_medical_cabinet_v_01.png
assets/images/wiki/master-kit-v1/hospital_monitor_cart_h_01.png
assets/images/wiki/master-kit-v1/hospital_monitor_cart_v_01.png
assets/images/wiki/master-kit-v1/hospital_privacy_screen_h_01.png
assets/images/wiki/master-kit-v1/hospital_privacy_screen_v_01.png
assets/images/wiki/master-kit-v1/hospital_sign_01.png
assets/images/wiki/master-kit-v1/hospital_supply_trolley_h_01.png
assets/images/wiki/master-kit-v1/hospital_supply_trolley_v_01.png
assets/images/wiki/master-kit-v1/industrial-architecture-reference-v1.png
assets/images/wiki/master-kit-v1/industrial-build-menu-v1.png
assets/images/wiki/master-kit-v1/industrial-build-world-scale-final.png
assets/images/wiki/master-kit-v1/industrial-player-scale-v1.png
assets/images/wiki/master-kit-v1/industrial-warehouse-exterior-v1.png
assets/images/wiki/master-kit-v1/industrial-warehouse-interior-v1.png
assets/images/wiki/master-kit-v1/industrial-workshop-exterior-v1.png
assets/images/wiki/master-kit-v1/industrial-workshop-interior-v1.png
assets/images/wiki/master-kit-v1/industrial_lathe_h_01.png
assets/images/wiki/master-kit-v1/industrial_loading_portal_h_01.png
assets/images/wiki/master-kit-v1/industrial_press_01.png
assets/images/wiki/master-kit-v1/industrial_roller_conveyor_v_01.png
assets/images/wiki/master-kit-v1/industrial_rooflight_h_01.png
assets/images/wiki/master-kit-v1/industrial_shed_roof_01.png
assets/images/wiki/master-kit-v1/industrial_wall_h_01.png
assets/images/wiki/master-kit-v1/industrial_wall_v_01.png
assets/images/wiki/master-kit-v1/industrial_window_h_01.png
assets/images/wiki/master-kit-v1/industrial_window_v_01.png
assets/images/wiki/master-kit-v1/military_interior_armchair_01.png
assets/images/wiki/master-kit-v1/military_interior_cabinet_01.png
assets/images/wiki/master-kit-v1/military_interior_kitchen_h_01.png
assets/images/wiki/master-kit-v1/military_interior_kitchen_v_01.png
assets/images/wiki/master-kit-v1/military_interior_rug_h_01.png
assets/images/wiki/master-kit-v1/military_interior_shower_01.png
assets/images/wiki/master-kit-v1/military_interior_sofa_h_01.png
assets/images/wiki/master-kit-v1/military_interior_sofa_v_01.png
assets/images/wiki/master-kit-v1/military_interior_table_h_01.png
assets/images/wiki/master-kit-v1/military_interior_table_v_01.png
assets/images/wiki/master-kit-v1/military_interior_toilet_01.png
assets/images/wiki/master-kit-v1/military_interior_washbasin_01.png
assets/images/wiki/master-kit-v1/military_prefab_eave_h_01.png
assets/images/wiki/master-kit-v1/military_prefab_eave_v_01.png
assets/images/wiki/master-kit-v1/military_prefab_entry_h_01.png
assets/images/wiki/master-kit-v1/military_prefab_entry_v_01.png
assets/images/wiki/master-kit-v1/military_prefab_floor_tile_01.png
assets/images/wiki/master-kit-v1/military_prefab_ridge_h_01.png
assets/images/wiki/master-kit-v1/military_prefab_roof_tile_01.png
assets/images/wiki/master-kit-v1/military_prefab_vent_01.png
assets/images/wiki/master-kit-v1/military_prefab_wall_h_01.png
assets/images/wiki/master-kit-v1/military_prefab_wall_v_01.png
assets/images/wiki/master-kit-v1/military_prefab_window_h_01.png
assets/images/wiki/master-kit-v1/military_prefab_window_v_01.png
assets/images/wiki/master-kit-v1/office-building-exterior-v1.png
assets/images/wiki/master-kit-v1/office-building-interior-v1.png
assets/images/wiki/master-kit-v1/office-building-night-v1.png
assets/images/wiki/master-kit-v1/office_clerestory_roof_h_01.png
assets/images/wiki/master-kit-v1/office_clerestory_roof_v_01.png
assets/images/wiki/master-kit-v1/office_conference_h_01.png
assets/images/wiki/master-kit-v1/office_conference_v_01.png
assets/images/wiki/master-kit-v1/office_copier_h_01.png
assets/images/wiki/master-kit-v1/office_copier_v_01.png
assets/images/wiki/master-kit-v1/office_glass_entry_h_01.png
assets/images/wiki/master-kit-v1/office_glass_entry_v_01.png
assets/images/wiki/master-kit-v1/office_workstation_h_01.png
assets/images/wiki/master-kit-v1/office_workstation_v_01.png
assets/images/wiki/master-kit-v1/police-architecture-exterior-v2.png
assets/images/wiki/master-kit-v1/police-architecture-interior-v2.png
assets/images/wiki/master-kit-v1/police-architecture-quality-reference-v2.png
assets/images/wiki/master-kit-v1/police-building-reference.png
assets/images/wiki/master-kit-v1/police-modular-building-reference.png
assets/images/wiki/master-kit-v1/police-modular-interior.png
assets/images/wiki/master-kit-v1/police-player-scale-v2.png
assets/images/wiki/master-kit-v1/police_booking_console_h_02.png
assets/images/wiki/master-kit-v1/police_booking_console_v_02.png
assets/images/wiki/master-kit-v1/police_cellbar_h_01.png
assets/images/wiki/master-kit-v1/police_cellbar_v_01.png
assets/images/wiki/master-kit-v1/police_cellframe_h_01.png
assets/images/wiki/master-kit-v1/police_cellframe_v_01.png
assets/images/wiki/master-kit-v1/police_clerestory_v_02.png
assets/images/wiki/master-kit-v1/police_custody_door_h_02.png
assets/images/wiki/master-kit-v1/police_custody_door_v_02.png
assets/images/wiki/master-kit-v1/police_dispatch_console_h_02.png
assets/images/wiki/master-kit-v1/police_dispatch_console_v_02.png
assets/images/wiki/master-kit-v1/police_duty_locker_h_01.png
assets/images/wiki/master-kit-v1/police_duty_locker_v_01.png
assets/images/wiki/master-kit-v1/police_entry_canopy_h_02.png
assets/images/wiki/master-kit-v1/police_evidence_h_01.png
assets/images/wiki/master-kit-v1/police_evidence_v_01.png
assets/images/wiki/master-kit-v1/police_front_facade_h_02.png
assets/images/wiki/master-kit-v1/police_reception_h_01.png
assets/images/wiki/master-kit-v1/police_reception_v_01.png
assets/images/wiki/master-kit-v1/police_secure_window_h_02.png
assets/images/wiki/master-kit-v1/police_secure_window_v_02.png
assets/images/wiki/master-kit-v1/police_service_roof_h_02.png
assets/images/wiki/master-kit-v1/residential-house-exterior-v2.png
assets/images/wiki/master-kit-v1/residential-house-exterior-v3.png
assets/images/wiki/master-kit-v1/residential-house-interior-v2.png
assets/images/wiki/master-kit-v1/residential-house-interior-v3.png
assets/images/wiki/master-kit-v1/residential-house-reference.png
assets/images/wiki/master-kit-v1/residential-house-scale-v2.png
assets/images/wiki/master-kit-v1/residential-house-scale-v3.png
assets/images/wiki/master-kit-v1/residential_corner_ne_01.png
assets/images/wiki/master-kit-v1/residential_corner_nw_01.png
assets/images/wiki/master-kit-v1/residential_corner_se_01.png
assets/images/wiki/master-kit-v1/residential_corner_sw_01.png
assets/images/wiki/master-kit-v1/residential_desk_dressing_h_02.png
assets/images/wiki/master-kit-v1/residential_doorframe_h_01.png
assets/images/wiki/master-kit-v1/residential_doorframe_v_01.png
assets/images/wiki/master-kit-v1/residential_eave_h_01.png
assets/images/wiki/master-kit-v1/residential_eave_v_01.png
assets/images/wiki/master-kit-v1/residential_floor_ceramic_02.png
assets/images/wiki/master-kit-v1/residential_floor_stone_01.png
assets/images/wiki/master-kit-v1/residential_floor_wood_01.png
assets/images/wiki/master-kit-v1/residential_gable_roof_h_02.png
assets/images/wiki/master-kit-v1/residential_gable_roof_long_h_02.png
assets/images/wiki/master-kit-v1/residential_gable_roof_v_02.png
assets/images/wiki/master-kit-v1/residential_porch_roof_h_02.png
assets/images/wiki/master-kit-v1/residential_roof_slate_01.png
assets/images/wiki/master-kit-v1/residential_tv_console_h_02.png
assets/images/wiki/master-kit-v1/residential_wall_h_01.png
assets/images/wiki/master-kit-v1/residential_wall_v_01.png
assets/images/wiki/master-kit-v1/residential_window_h_01.png
assets/images/wiki/master-kit-v1/residential_window_v_01.png
assets/images/wiki/master-kit-v1/retail-world-build-player-scale-v1.png
assets/images/wiki/master-kit-v1/retail_cart_nest_h_01.png
assets/images/wiki/master-kit-v1/retail_cart_nest_v_01.png
assets/images/wiki/master-kit-v1/retail_checkout_h_01.png
assets/images/wiki/master-kit-v1/retail_checkout_v_01.png
assets/images/wiki/master-kit-v1/retail_freezer_h_01.png
assets/images/wiki/master-kit-v1/retail_freezer_v_01.png
assets/images/wiki/master-kit-v1/retail_glass_front_h_01.png
assets/images/wiki/master-kit-v1/retail_glass_front_v_01.png
assets/images/wiki/master-kit-v1/retail_produce_h_01.png
assets/images/wiki/master-kit-v1/retail_produce_v_01.png
assets/images/wiki/master-kit-v1/retail_shelf_h_01.png
assets/images/wiki/master-kit-v1/retail_shelf_v_01.png
assets/images/wiki/master-kit-v1/retail_storefront_h_02.png
assets/images/wiki/master-kit-v1/retail_wall_cooler_h_01.png
assets/images/wiki/master-kit-v1/retail_wall_cooler_v_01.png
assets/images/wiki/master-kit-v1/supermarket-exterior-v1.png
assets/images/wiki/master-kit-v1/supermarket-interior-v1.png
assets/images/wiki/master-kit-v1/warehouse_pallet_jack_01.png
assets/images/wiki/master-kit-v1/warehouse_pallet_rack_h_01.png
assets/images/wiki/master-kit-v1/warehouse_pallet_rack_v_01.png
assets/images/wiki/master-kit-v1/warehouse_roof_01.png
assets/images/wiki/master-kit-v1/workshop-building-exterior-v1.png
assets/images/wiki/master-kit-v1/workshop-building-interior-v1.png
assets/images/wiki/master-kit-v1/workshop-building-night-v1.png
assets/images/wiki/master-kit-v1/workshop_engine_crane_h_01.png
assets/images/wiki/master-kit-v1/workshop_engine_crane_v_01.png
assets/images/wiki/master-kit-v1/workshop_gable_roof_h_01.png
assets/images/wiki/master-kit-v1/workshop_gable_roof_v_01.png
assets/images/wiki/master-kit-v1/workshop_tool_cabinet_h_01.png
assets/images/wiki/master-kit-v1/workshop_tool_cabinet_v_01.png
assets/images/wiki/master-kit-v1/workshop_tyre_rack_h_01.png
assets/images/wiki/master-kit-v1/workshop_tyre_rack_v_01.png
assets/images/wiki/master-kit-v1/workshop_vehicle_lift_h_01.png
assets/images/wiki/master-kit-v1/workshop_vehicle_lift_v_01.png
assets/js/account.js
assets/js/community-config.js
assets/js/community-stats.js
assets/js/forum.js
assets/js/gallery.js
assets/js/game-auth-bridge.js
assets/js/global-footer.js
assets/js/i18n.js
assets/js/identity.js
assets/js/legal.js
assets/js/main.js
assets/js/password-reset.js
assets/js/translations.js
assets/js/visitor-counter.js
assets/js/wiki-data.js
bugs/index.html
community-regeln/index.html
community-rules/index.html
docs/ACCOUNT_CHECKPOINT.md
docs/AUTH_AUDIT.md
docs/COMMUNITY_STATS_CHECKPOINT.md
docs/FORUM_CHECKPOINT.md
docs/FORUM_PLAN.md
docs/GAME_AUTH_HANDOFF.md
docs/HOMEPAGE_CHECKPOINT.md
docs/HOMEPAGE_RELEASE_2026-10-08.md
docs/LEGAL_REGISTRATION.md
docs/PASSWORD_RESET.md
docs/PUBLIC_IDENTITY.md
docs/auth_structure_audit.sql
docs/community_presence_prepare.sql
docs/community_structure_audit.sql
docs/legal_consent_prepare.sql
docs/public_identity_prepare.sql
docs/ugc_identity_prepare.sql
docs/visitor_stats_week_audit.sql
forum/index.html
gallery.html
game.html
index.html
nutzungsbedingungen/index.html
pages/danke.html
pages/datenschutz.html
pages/impressum.html
profile/index.html
terms/index.html
tools/verify_wiki.py
wiki.html
```

Nach Push Deployment und öffentliche Homepage-Bereiche prüfen. Keine echte
Passwortänderung/Mail und keine produktiven Tracking-Registrierungen erzwingen.
Commit-Hash und Deploymentnachweis stehen im Git-Verlauf bzw. Abschlussbericht.
Danach STOPP.
