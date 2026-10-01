(function () {
  "use strict";

  const data = window.WIKI_DATA;
  const els = {
    grid: document.getElementById("wikiGrid"),
    search: document.getElementById("wikiSearchInput"),
    clear: document.getElementById("wikiClearSearch"),
    count: document.getElementById("wikiResultCount"),
    status: document.getElementById("wikiStatusBar"),
    mainTabs: document.getElementById("wikiMainTabs"),
    subTabs: document.getElementById("wikiSubTabs"),
    detail: document.getElementById("wikiDetail"),
    catalog: document.getElementById("rezepte"),
    message: document.getElementById("wikiRouteMessage"),
    artDirection: document.getElementById("wikiArtDirection"),
    variant: document.getElementById("wikiVariantFilter"),
    variantLabel: document.getElementById("wikiVariantLabel"),
    availability: document.getElementById("wikiAvailabilityFilter"),
  };
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  function closeMenu() {
    if (!menuToggle || !navMenu) return;
    navMenu.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
  }
  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", function () {
      const open = navMenu.classList.toggle("active");
      menuToggle.setAttribute("aria-expanded", String(open));
    });
    navMenu.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && navMenu.classList.contains("active")) {
        closeMenu();
        menuToggle.focus();
      }
    });
    document.addEventListener("click", function (event) {
      if (!event.target.closest(".navbar")) closeMenu();
    });
  }
  if (!data || !Array.isArray(data.entries)) {
    if (els.grid) els.grid.innerHTML = '<p class="wiki-no-results">Der Katalog konnte nicht geladen werden. Bitte lade die Seite erneut.</p>';
    if (els.count) els.count.textContent = "Katalog nicht verfügbar";
    return;
  }

  const meta = data.meta || {};
  const entries = data.entries;
  const byId = new Map(entries.map(function (entry) { return [entry.id, entry]; }));
  const aliases = Object.assign({ katalog: { main: "all" }, rezepte: { main: "all" } }, meta.legacy_routes || {});
  const state = { main: "all", sub: "all", variant: "all", availability: "all", query: "", item: "" };
  const availabilityNames = { available: "Vorhanden", partial: "Teilweise vorhanden", planned: "Geplant", open: "Stand offen" };
  const roleNames = { player_build: "Spielerbauteil", player_build_plan: "Geplantes Spielerbauteil", base_storage: "Basislager", world_module: "Weltmodul · kein Spielerbaurezept", world_reference: "Welt- & Gebäudereferenz", system: "Spielsystem", item: "Gegenstand" };
  function label(value) { return window.ZHLanguage ? window.ZHLanguage.text(value) : value; }
  function translated(value) { return escapeHtml(label(value)); }
  function message(key, params) { return window.ZHLanguage ? window.ZHLanguage.t(key, params) : key; }
  function presentation(entry) { return entry.presentation || {}; }
  function availability(entry) { return presentation(entry).availability || "open"; }
  function availabilityName(entry) { return label(availabilityNames[availability(entry)]); }
  function availabilityClass(entry) { return { available: "is-ingame", partial: "is-partial", planned: "is-planned", open: "is-concept" }[availability(entry)]; }
  function publicSummary(entry) { return availability(entry) === "partial" && presentation(entry).note ? presentation(entry).note : entry.description; }
  let returnFocusId = "";

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character];
    });
  }
  function textValue(value) {
    if (Array.isArray(value)) return value.map(textValue).filter(Boolean).join(" · ");
    if (value && typeof value === "object") {
      return Object.entries(value).map(function (pair) { return pair[0] + ": " + textValue(pair[1]); }).join(" · ");
    }
    return value == null ? "" : String(value);
  }
  function categoryLabel(id) { return label((meta.categories || {})[id] || id); }
  function subLabel(id) { return label((meta.subcategories || {})[id] || id); }
  function normalize(value) {
    return textValue(value).toLocaleLowerCase("de").replace(/ß/g, "ss").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  function validMain(main) {
    return main === "all" || Object.prototype.hasOwnProperty.call(meta.categories || {}, main);
  }
  function subFilters(main) {
    const configured = (meta.filters || {})[main] || [{ id: "all", label: "Alle" }];
    return configured.filter(function (filter) {
      return filter.id === "all" || entries.some(function (entry) { return entry.category === main && entry.subcategory === filter.id; });
    });
  }
  function validSub(main, sub) {
    return subFilters(main).some(function (filter) { return filter.id === sub; }) ? sub : "all";
  }
  function statusClass(status) {
    const normalized = normalize(status);
    if (normalized === "geplant") return "is-planned";
    if (normalized === "im spiel" || normalized === "final") return "is-ingame";
    return "is-concept";
  }
  function artStatus(entry) {
    return entry.art_status || (entry.art || {}).art_status || entry.image_status || "PLACEHOLDER";
  }
  function renderArtDirection() {
    const direction = meta.art_direction || {};
    const fields = [["Zielperspektive", direction.perspective], ["Stil", direction.style], ["Farbrichtung", direction.palette],
      ["Größenverhältnisse", direction.scale], ["Licht & Schatten", direction.lighting], ["Detailgrad", direction.detail],
      ["Lesbarkeit im Spiel", direction.readability], ["Übertragung auf andere Assets", direction.scope]];
    return '<dl class="wiki-art-direction-grid">' + fields.filter(function (field) { return field[1]; }).map(function (field) {
      return '<div><dt>' + escapeHtml(field[0]) + '</dt><dd>' + escapeHtml(textValue(field[1])) + '</dd></div>';
    }).join("") + '</dl>' +
      (direction.preservation_note ? '<p class="wiki-art-preservation">' + escapeHtml(direction.preservation_note) + '</p>' : "") +
      '<div class="wiki-composed wiki-art-guide-links">' +
      (direction.reference_entry ? referenceLink(direction.reference_entry) : "") +
      (direction.reference_image ? '<a class="wiki-ref-link" href="' + escapeHtml(direction.reference_image) + '" target="_blank" rel="noopener">Stil- und Perspektiv-Originalbild <span aria-hidden="true">↗</span><span class="wiki-sr-only"> (neuer Tab)</span></a>' : "") + '</div>';
  }
  function listHash() {
    const params = new URLSearchParams();
    if (state.sub !== "all") params.set("sub", state.sub);
    if (state.variant !== "all") params.set("variant", state.variant);
    if (state.availability !== "all") params.set("status", state.availability);
    if (state.query) params.set("q", state.query);
    return "#" + (state.main === "all" ? "katalog" : state.main) + (params.size ? "?" + params : "");
  }
  function itemHash(id) {
    const params = new URLSearchParams();
    params.set("category", state.main);
    if (state.sub !== "all") params.set("sub", state.sub);
    if (state.variant !== "all") params.set("variant", state.variant);
    if (state.availability !== "all") params.set("status", state.availability);
    if (state.query) params.set("q", state.query);
    return "#item/" + encodeURIComponent(id) + "?" + params;
  }
  function imageBlock(entry, large, unavailable) {
    const cls = "wiki-media" + (large ? " wiki-media-lg" : "");
    const badge = '<span class="wiki-img-badge">' + translated(unavailable || !entry.image ? "Bild offen" : "Bildreferenz") + "</span>";
    if (entry.image && !unavailable) {
      return '<div class="' + cls + '">' + badge + '<img src="' + escapeHtml(entry.image) + '" alt="Referenz: ' + escapeHtml(entry.name) + '" loading="' + (large ? "eager" : "lazy") + '" decoding="async"></div>';
    }
    const iconColor = /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(entry.icon_color || "") ? ' style="--wiki-icon-color:' + entry.icon_color + '"' : "";
    return '<div class="' + cls + ' wiki-media-empty">' + badge + '<i class="' + escapeHtml(entry.icon || "fa-solid fa-image") + '"' + iconColor + ' aria-hidden="true"></i><span>' + translated(unavailable ? "Referenzbild nicht verfügbar" : "Referenzbild noch offen") + "</span></div>";
  }
  function renderCard(entry) {
    return '<article class="recipe-card wiki-card" data-id="' + escapeHtml(entry.id) + '">' +
      '<a class="wiki-card-link" href="' + escapeHtml(itemHash(entry.id)) + '">' +
      imageBlock(entry, false) +
      '<div class="recipe-header"><span class="recipe-category">' + escapeHtml(categoryLabel(entry.category)) +
      (entry.subcategory ? " · " + escapeHtml(subLabel(entry.subcategory)) : "") +
      "</span><h3>" + escapeHtml(entry.name) + "</h3></div>" +
      '<p class="recipe-description">' + escapeHtml(publicSummary(entry)) + "</p>" +
      '<p class="wiki-card-role">' + translated(roleNames[presentation(entry).role] || "Gegenstand") + '</p>' +
      '<div class="wiki-card-meta"><span class="wiki-status-pill ' + availabilityClass(entry) + '">' + escapeHtml(availabilityName(entry)) +
      '</span><span class="wiki-card-open">' + translated("Eintrag ansehen") + ' <span aria-hidden="true">↗</span></span></div></a></article>';
  }
  function fieldRow(label, value) {
    const text = textValue(value);
    if (!text) return "";
    return "<li><span>" + escapeHtml(window.ZHLanguage ? window.ZHLanguage.text(label) : label) + "</span><strong>" + escapeHtml(text) + "</strong></li>";
  }
  function referenceLink(id) {
    const ref = byId.get(id);
    return ref ? '<a class="wiki-ref-link" href="' + escapeHtml(itemHash(id)) + '">' + escapeHtml(ref.name) + "</a>" : '<span class="wiki-reference-open">Modulzuordnung OFFEN</span>';
  }
  function renderReferenceGallery(plan, moduleGallery) {
    const gallery = (plan.gallery || []).filter(function (reference) { return reference.image; });
    if (!gallery.length) return "";
    return '<section class="wiki-reference-gallery' + (moduleGallery ? ' wiki-module-gallery' : '') + '" aria-labelledby="wikiReferenceGalleryTitle"><h3 id="wikiReferenceGalleryTitle">' + translated(moduleGallery ? "Modulansichten" : "Layout & visuelle Stilrichtung") + '</h3><div class="wiki-reference-gallery-grid">' +
      gallery.map(function (reference) {
        return '<figure class="wiki-reference-figure" data-reference-role="' + escapeHtml(reference.id) + '"><figcaption><h4>' + escapeHtml(reference.title) + '</h4>' + (moduleGallery ? '<details class="wiki-module-caption"><summary>Bild- &amp; Designhinweis</summary><p>' + escapeHtml(reference.caption) + '</p></details>' : '<p>' + escapeHtml(reference.caption) + '</p>') + '</figcaption>' +
          '<img src="' + escapeHtml(reference.image) + '" alt="' + escapeHtml(reference.alt || reference.title) + '" loading="lazy" decoding="async">' +
          '<a class="wiki-ref-link wiki-reference-original" href="' + escapeHtml(reference.image) + '" target="_blank" rel="noopener">Originalbild ansehen: ' + escapeHtml(reference.title) + ' <span aria-hidden="true">↗</span><span class="wiki-sr-only"> (neuer Tab)</span></a></figure>';
      }).join("") + '</div></section>';
  }
  function renderOpenPoints(points) {
    return (points || []).length ? '<ul class="wiki-planning-points">' + points.map(function (point) { return '<li>' + escapeHtml(point) + '</li>'; }).join("") + '</ul>' : "";
  }
  function renderPlanningSection(title, items) {
    if (!(items || []).length) return "";
    return '<section class="wiki-world-sections"><h3>' + escapeHtml(title) + '</h3><div class="wiki-world-section-grid">' + items.map(function (item) {
      return '<article class="wiki-world-section"><h4>' + escapeHtml(item.name) + '</h4>' +
        (item.status ? '<span class="wiki-status-pill ' + statusClass(item.status) + '">' + escapeHtml(item.status) + '</span>' : "") +
        '<p>' + escapeHtml(item.description) + '</p>' +
        ((item.module_refs || []).length ? '<div class="wiki-composed"><span>Vorgesehene Module</span>' + item.module_refs.map(referenceLink).join("") + '</div>' : "") +
        (item.entry_ref ? '<div class="wiki-composed">' + referenceLink(item.entry_ref) + '</div>' : "") +
        (item.planned_visual_id ? '<details class="wiki-module-identity"><summary>Geplante Asset-Zuordnung</summary><p><code>' + escapeHtml(item.planned_visual_id) + '</code></p></details>' : "") +
        ((item.open_points || []).length ? '<p class="wiki-open-label">Noch festzulegen</p>' + renderOpenPoints(item.open_points) : "") + '</article>';
    }).join("") + '</div></section>';
  }
  function renderReferencePlan(plan) {
    return renderPlanningSection("Gebäudearten & Zusammenbau", plan.building_types) +
      renderPlanningSection("Eingangslogik", plan.entrances) +
      renderPlanningSection("Modulübersicht", plan.modules) +
      renderPlanningSection("90°-Bauweise & Designregeln", plan.rules) +
      ((plan.open_points || []).length ? '<section class="wiki-world-sections wiki-planning-open"><h3>Offene Planungsentscheidungen</h3>' + renderOpenPoints(plan.open_points) + '</section>' : "") +
      ((plan.related_entries || []).length ? '<section class="wiki-world-sections"><h3>Baumodule & verwandte Referenzen</h3><div class="wiki-composed">' + plan.related_entries.map(referenceLink).join("") + '</div><a class="wiki-ref-link" href="#baumenue">Zum Baumenü &amp; Bauleitfaden</a></section>' : "");
  }
  function renderWorldSections(entry) {
    const sections = entry.world_sections || [];
    if (!sections.length) return "";
    const designChain = (entry.reference_plan && meta.world_reference ? meta.world_reference.design_chain : entry.design_chain) || [];
    const chain = designChain.map(function (step) { return "<span>" + escapeHtml(step) + "</span>"; }).join('<span class="wiki-chain-arrow" aria-hidden="true">→</span>');
    const introduction = entry.reference_plan ? '<h3 id="wikiWorldSectionsTitle">Aufbau &amp; Funktionsbereiche</h3><p>Die Bereiche verbinden die Referenz mit vorgesehenen Baumodulen. Konkrete Modulmaße und die spätere Umsetzung werden in den nächsten Planungsschritten festgelegt.</p>' : '<h3 id="wikiWorldSectionsTitle">Geplanter Gebäudeaufbau</h3><p>Die Bereiche beschreiben das Konzept. Ausführung, Maße und Freigaben bleiben offen, bis die jeweiligen Module festgelegt sind.</p>';
    return '<section class="wiki-world-sections" aria-labelledby="wikiWorldSectionsTitle">' + introduction + '<div class="wiki-world-section-grid">' +
      sections.map(function (section) {
        return '<article class="wiki-world-section"><h4>' + escapeHtml(section.name) + '</h4><span class="wiki-status-pill is-planned">' + escapeHtml(section.status || "GEPLANT") + '</span><p>' + escapeHtml(section.note || "Ausführung OFFEN.") + '</p>' +
          ((section.module_refs || []).length ? '<div class="wiki-composed"><span>Vorgesehene Module</span>' + section.module_refs.map(referenceLink).join("") + "</div>" : "") + '</article>';
      }).join("") + '</div>' + (chain ? '<div class="wiki-chain" aria-label="Von der Referenz zum modularen Gebäude">' + chain + '</div>' : "") + '</section>';
  }
  function renderDetail(entry) {
    const art = entry.art || {}, plan = entry.reference_plan || {}, view = presentation(entry), evidence = entry.implementation_evidence || {};
    const worldModule = entry.module_family === "master_kit_world_v1", playerModule = entry.module_family === "master_kit_v1", worldBuilding = entry.category === "welt";
    const gallery = renderReferenceGallery(plan, worldModule || playerModule);
    const stats = (entry.stats || []).map(function (stat) {
      return worldBuilding && byId.has(stat.value) ? '<li><span>' + escapeHtml(stat.label) + '</span><strong>' + referenceLink(stat.value) + '</strong></li>' : fieldRow(stat.label, stat.value);
    }).join("");
    const statsValues = new Set((entry.stats || []).map(function (stat) { return textValue(stat.value); }));
    const extraStats = [["Seltenheit", entry.rarity], ["Gewicht", entry.weight], ["Schaden", entry.damage], ["Schutz", entry.protection], ["Kapazität", entry.capacity], ["Haltbarkeit", entry.durability], ["Munition", entry.ammo]]
      .filter(function (pair) { return pair[1] && !statsValues.has(textValue(pair[1])); }).map(function (pair) { return fieldRow(pair[0], pair[1]); }).join("");
    const historical = fieldRow("Verwendung", entry.usage) + stats + extraStats + fieldRow("Materialien", entry.materials) + fieldRow("Crafting", entry.crafting) + fieldRow(worldBuilding ? "Vorgesehene Lage" : "Fundort", entry.location);
    const current = fieldRow("Haltbarkeit", evidence.max_hp == null ? null : evidence.max_hp + " HP") + fieldRow("Belegte Rasterzellen", evidence.footprint_cells ? evidence.footprint_cells.join(" × ") : null) +
      fieldRow("Aktuelle Baukosten", (evidence.current_costs || []).map(function (cost) { return cost.label + " " + cost.value; }));
    const references = (entry.composed_of || []).map(referenceLink).join(""), grid = entry.grid || {};
    const related = (view.related_entries || []).slice(0, 6).map(referenceLink).join("");
    const note = view.note || (playerModule ? "Als Spielerbauteil vorhanden. Maßstabsabgleich und endgültige Bildfreigabe bleiben offen." : "");
    const artDetails = fieldRow("visual_id", entry.visual_id || art.visual_id) + fieldRow("Equipment-Slot", entry.slot || art.slot) + fieldRow("Slotzuordnung", entry.slot_status) + fieldRow("Slot-Hinweis", art.slot_note) +
      fieldRow("Befestigung", art.attachment_slot) + fieldRow("Objektrolle", art.object_role) + fieldRow("Modultyp", entry.module_type) + fieldRow("Stil", art.style) + fieldRow("Zielperspektive", art.perspective) +
      fieldRow("Perspektivvorgabe", art.perspective_status) + fieldRow("Rolle des Referenzbilds", art.image_role) + fieldRow("Farbrichtung", art.color_direction) + fieldRow("Größenklasse", art.size_class) +
      fieldRow("Art-Status", artStatus(entry)) + fieldRow("Spezifikation", art.specification_status) + fieldRow("Raster", typeof entry.grid === "string" ? entry.grid : grid.type || grid.rule) + fieldRow("Rastergröße", grid.cell_size) + fieldRow("Modulmaße", grid.dimensions);
    return '<a class="wiki-back-btn" id="wikiBackBtn" href="' + escapeHtml(listHash()) + '"><span aria-hidden="true">←</span> ' + translated("Zurück zum Katalog") + '</a>' +
      '<div class="wiki-detail-layout' + (gallery ? ' wiki-detail-layout-reference' : '') + '">' + (gallery ? "" : imageBlock(entry, true)) + '<div class="wiki-detail-copy"><p class="wiki-kicker">' +
      escapeHtml(categoryLabel(entry.category)) + ' / ' + escapeHtml(subLabel(entry.subcategory)) + '</p><h2 id="wikiDetailTitle" tabindex="-1" lang="de">' + escapeHtml(entry.name) +
      '</h2><span class="wiki-status-pill ' + availabilityClass(entry) + '">' + escapeHtml(availabilityName(entry)) + '</span><p class="wiki-card-role">' + translated(roleNames[view.role] || "Gegenstand") + '</p>' +
      '<p class="recipe-description" lang="de">' + escapeHtml(publicSummary(entry)) + '</p>' + (note && note !== publicSummary(entry) ? '<p class="wiki-current-note" lang="de">' + escapeHtml(note) + '</p>' : '') +
      (worldBuilding && !worldModule && plan.location ? '<p>' + translated("Vorgesehene Lage") + ': ' + escapeHtml(plan.location) + '</p>' : '') + '</div></div>' + gallery +
      '<div class="wiki-detail-grid"><section><h3>' + translated(playerModule ? "Aktueller Bau- & Funktionsstand" : worldBuilding && !worldModule ? "Geplante Module & Verwendung" : entry.stats_title || "Werte & Verwendung") + '</h3>' +
      (current ? '<ul class="wiki-kv">' + current + '</ul>' : '') +
      (playerModule ? '<details class="wiki-legacy-values"><summary>' + translated("Bisherige Wiki-Beschreibung & Werte") + '</summary><p>' + translated("Diese früheren Angaben bleiben als Referenz erhalten. Für den bestätigten Funktionsstand gelten die Hinweise und aktuellen Bauwerte oben.") + '</p><p lang="de">' + escapeHtml(entry.description) + '</p><ul class="wiki-kv">' + historical + '</ul></details>' : '<ul class="wiki-kv">' + (historical || fieldRow("Angaben", "OFFEN")) + '</ul>') +
      '</section><details class="wiki-art-reference"><summary>' + translated("Art- & Designreferenz") + ' <span>' + escapeHtml(artStatus(entry)) + '</span></summary><ul class="wiki-kv wiki-kv-art">' + artDetails + '</ul>' +
      (entry.info_note ? '<p class="wiki-art-hint">' + escapeHtml(entry.info_note) + '</p>' : '') + (entry.status_note && entry.status_note !== entry.info_note ? '<p class="wiki-art-hint">' + escapeHtml(entry.status_note) + '</p>' : '') +
      (entry.module_note ? '<p class="wiki-art-hint">' + escapeHtml(entry.module_note) + '</p>' : '') +
      (plan.designation || plan.commitment || plan.interpretation ? '<div class="wiki-reference-brief"><p>' + escapeHtml(plan.designation || '') + '</p><p>' + escapeHtml(plan.commitment || '') + '</p><p>' + escapeHtml(plan.interpretation || '') + '</p></div>' : '') +
      (art.style_reference ? '<p class="wiki-art-hint"><a class="wiki-ref-link" href="#art-referenz">Verbindliche Art- &amp; Perspektivvorgabe</a><span class="wiki-style-reference-id">Referenz: <code>' + escapeHtml(art.style_reference) + '</code></span></p>' : '') +
      (art.approval_note ? '<p class="wiki-art-hint">' + escapeHtml(art.approval_note) + '</p>' : '') + ((entry.tags || []).length ? '<div class="recipe-tools">' + entry.tags.map(function (tag) { return '<span class="tool-badge">' + escapeHtml(tag) + '</span>'; }).join('') + '</div>' : '') +
      (references ? '<div class="wiki-composed"><span>Vorgesehene Module</span>' + references + '</div>' : '') + '</details></div>' +
      (related ? '<section class="wiki-related"><h3>' + translated("Verwandte Einträge") + '</h3><div class="wiki-composed">' + related + '</div></section>' : '') + renderWorldSections(entry) + renderReferencePlan(plan);
  }
  function matches(entry) {
    if (state.main !== "all" && entry.category !== state.main) return false;
    if (state.sub !== "all" && entry.subcategory !== state.sub) return false;
    if (state.variant !== "all" && presentation(entry).variant !== state.variant) return false;
    if (state.availability !== "all" && availability(entry) !== state.availability) return false;
    const terms = normalize(state.query).split(/\s+/).filter(Boolean);
    if (!terms.length) return true;
    const art = entry.art || {};
    const haystack = normalize([entry.name, entry.description, entry.id, entry.visual_id, entry.slot, art.visual_id, art.slot,
      categoryLabel(entry.category), subLabel(entry.subcategory), (meta.categories || {})[entry.category], (meta.subcategories || {})[entry.subcategory],
      availabilityName(entry), availabilityNames[availability(entry)], presentation(entry).note, roleNames[presentation(entry).role], entry.usage, entry.ammo, entry.materials, entry.crafting, entry.location,
      entry.status, artStatus(entry), entry.tags, art.image_role, art.perspective, art.style_reference, entry.slot_status, art.slot_note,
      entry.world_sections, entry.reference_plan, entry.design_chain,
      (entry.stats || []).map(function (stat) { return stat.label + " " + stat.value; })]);
    return terms.every(function (term) { return haystack.includes(term); });
  }
  const staticCatalogText = [], staticCatalogAttributes = [];
  if (els.catalog) {
    els.catalog.querySelectorAll('#katalog, #wikiCatalogTitle, .wiki-catalog-intro, .wiki-filter-hint, .wiki-search-container label, #wikiClearSearch, .wiki-extra-filters label').forEach(function (element) {
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (!node.parentElement.closest('select') && node.data.trim()) staticCatalogText.push({ node: node, source: node.data.trim() });
      }
    });
    ['#wikiSearchInput', '#wikiMainTabs', '#wikiSubTabs'].forEach(function (selector) {
      const element = els.catalog.querySelector(selector);
      if (element) ['placeholder', 'aria-label'].forEach(function (attribute) {
        if (element.hasAttribute(attribute)) staticCatalogAttributes.push({ element: element, attribute: attribute, source: element.getAttribute(attribute) });
      });
    });
  }
  function translateStaticCatalog() {
    staticCatalogText.forEach(function (copy) { copy.node.data = label(copy.source); });
    staticCatalogAttributes.forEach(function (copy) { copy.element.setAttribute(copy.attribute, label(copy.source)); });
    const note = document.getElementById('wikiLanguageNote');
    if (note) note.hidden = !window.ZHLanguage || window.ZHLanguage.language !== 'en';
  }
  function renderTabs() {
    if (els.mainTabs) {
      const main = [{ id: 'all', name: 'Alle', count: entries.length }].concat(Object.entries(meta.categories || {}).map(function (pair) {
        return { id: pair[0], name: pair[1], count: entries.filter(function (entry) { return entry.category === pair[0]; }).length };
      })).filter(function (category) { return category.count; });
      els.mainTabs.innerHTML = main.map(function (category) {
        const active = category.id === state.main;
        return '<button type="button" class="wiki-tab-btn' + (active ? ' active' : '') + '" data-main="' + escapeHtml(category.id) + '" aria-pressed="' + active + '">' + translated(category.name) + ' <span>' + category.count + '</span></button>';
      }).join('');
    }
    if (els.subTabs) els.subTabs.innerHTML = subFilters(state.main).map(function (filter) {
      const active = filter.id === state.sub;
      return '<button type="button" class="wiki-sub-btn' + (active ? ' active' : '') + '" data-sub="' + escapeHtml(filter.id) + '" aria-pressed="' + active + '">' + translated(filter.label) + '</button>';
    }).join('');
    if (els.variantLabel) els.variantLabel.hidden = state.main !== 'all' && state.main !== 'bausystem';
    if (els.variant) {
      els.variant.innerHTML = '<option value="all">' + translated('Alle Varianten') + '</option>' + Object.entries(meta.variants || {}).map(function (pair) { return '<option value="' + pair[0] + '">' + translated(pair[1]) + '</option>'; }).join('');
      els.variant.value = state.variant;
    }
    if (els.availability) {
      els.availability.innerHTML = '<option value="all">' + translated('Alle Entwicklungsstände') + '</option>' + Object.entries(availabilityNames).map(function (pair) { return '<option value="' + pair[0] + '">' + translated(pair[1]) + '</option>'; }).join('');
      els.availability.value = state.availability;
    }
    translateStaticCatalog();
  }
  function renderGrid() {
    const visible = entries.filter(matches);
    if (els.grid) els.grid.innerHTML = visible.length ? visible.map(renderCard).join('') : '<div class="wiki-no-results"><h3>' + translated('Keine passenden Einträge') + '</h3><p>' +
      (state.query ? escapeHtml(message('wiki.noMatches', { query: state.query })) : translated('Für diesen Filter liegen noch keine Einträge vor.')) + '</p><a href="' + escapeHtml('#' + (state.main === 'all' ? 'katalog' : state.main)) + '">' + translated('Filter zurücksetzen') + '</a> · <a href="#katalog">' + translated('Alle Einträge ansehen') + '</a></div>';
    if (els.count) els.count.textContent = message(visible.length === 1 ? 'wiki.entry' : 'wiki.entries', { count: visible.length });
    if (els.status) els.status.textContent = (state.main === 'all' ? label('Alle Kategorien') : categoryLabel(state.main)) + (state.sub === 'all' ? '' : ' › ' + subLabel(state.sub)) +
      (state.variant === 'all' ? '' : ' › ' + label(meta.variants[state.variant])) + (state.availability === 'all' ? '' : ' · ' + label(availabilityNames[state.availability])) + (state.query ? ' · ' + label('Suche') + ': „' + state.query + '“' : '');
    if (els.clear) els.clear.hidden = !state.query;
  }
  function renderView() {
    renderTabs();
    renderGrid();
    const entry = byId.get(state.item);
    if (els.detail) {
      els.detail.hidden = !entry;
      els.detail.innerHTML = entry ? renderDetail(entry) : "";
    }
    if (els.grid) els.grid.hidden = Boolean(entry);
    if (els.catalog) els.catalog.classList.toggle("wiki-has-detail", Boolean(entry));
    if (els.search && els.search.value !== state.query) els.search.value = state.query;
  }
  function syncQuickNav(section) {
    const current = section || (state.item === "world_adminbase_central_01" ? "item/" + state.item : (state.main === "all" ? "katalog" : state.main));
    document.querySelectorAll(".wiki-quick-btn").forEach(function (link) {
      const active = link.getAttribute("href") === "#" + current;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }
  function moveFocus(element, scrollTarget) {
    if (!element) return;
    element.focus({ preventScroll: true });
    (scrollTarget || element).scrollIntoView({ behavior: "auto", block: "start" });
  }
  function parseRoute(options) {
    const opts = options || {};
    const fragment = location.hash.slice(1);
    const separator = fragment.indexOf("?");
    const path = separator < 0 ? fragment : fragment.slice(0, separator);
    const params = new URLSearchParams(separator < 0 ? "" : fragment.slice(separator + 1));
    let message = "";
    let section = "";
    state.item = "";
    const rawCategory = path.startsWith('item/') ? params.get('category') : path;
    const legacy = aliases[rawCategory];
    if (path.startsWith("item/")) {
      let id = "";
      try { id = decodeURIComponent(path.slice(5)); } catch (_) { message = "Der Eintragslink ist ungültig. Der vollständige Katalog bleibt verfügbar."; }
      const entry = byId.get(id);
      if (entry) {
        state.item = id;
        state.main = validMain(params.get("category")) ? params.get("category") : legacy ? legacy.main : entry.category;
      } else {
        state.main = "all";
        message = message || "Dieser Eintrag wurde nicht gefunden. Suche im vollständigen Katalog.";
      }
    } else if (Object.prototype.hasOwnProperty.call(aliases, path) || validMain(path)) {
      state.main = aliases[path] ? aliases[path].main : path;
    } else {
      state.main = "all";
      section = path;
    }
    let sub = params.get('sub') || (legacy && legacy.sub) || 'all';
    let variant = params.get('variant') || 'all';
    if (sub === 'ecken' && state.main === 'bausystem') { sub = 'all'; variant = 'ecken'; }
    else if (sub === 'tuerwaende' && state.main === 'bausystem') variant = 'tuerwaende';
    else if ((sub === 'fensterwaende' || sub === 'fenster') && state.main === 'bausystem') variant = 'fenster';
    if ((rawCategory === 'verbrauch' && ['munition', 'getraenke', 'ressourcen'].includes(sub)) || (rawCategory === 'systeme' && sub === 'waffenmods')) {
      state.main = 'ausruestung'; sub = sub === 'munition' || sub === 'waffenmods' ? sub : 'werkzeuge';
    }
    sub = ((meta.legacy_subcategories || {})[state.main] || {})[sub] || sub;
    if (rawCategory === 'weltgebaeude' && sub === 'safezones') sub = 'all';
    state.sub = validSub(state.main, sub);
    state.variant = (state.main === 'all' || state.main === 'bausystem') && Object.prototype.hasOwnProperty.call(meta.variants || {}, variant) ? variant : 'all';
    state.availability = Object.prototype.hasOwnProperty.call(availabilityNames, params.get('status')) ? params.get('status') : 'all';
    state.query = params.get("q") || "";
    if (message) { state.sub = "all"; state.variant = "all"; state.availability = "all"; state.query = ""; }
    if (els.message) {
      els.message.hidden = !message;
      els.message.textContent = message;
    }
    renderView();
    syncQuickNav(section);
    if (section) {
      const target = document.getElementById(section);
      if (target) {
        const disclosure = target.closest("details");
        if (disclosure) disclosure.open = true;
        if (opts.scroll !== false) target.scrollIntoView({ behavior: "auto", block: "start" });
      }
    } else if (state.item && opts.scroll !== false) {
      moveFocus(document.getElementById("wikiDetailTitle"), els.detail);
    } else if (opts.focusCard && returnFocusId && els.grid) {
      const card = Array.from(els.grid.querySelectorAll("[data-id]")).find(function (element) { return element.getAttribute("data-id") === returnFocusId; });
      if (card) moveFocus(card.querySelector("a"));
      else moveFocus(document.getElementById("wikiCatalogTitle"));
    } else if (fragment && opts.scroll !== false) {
      if (els.catalog) els.catalog.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }
  function navigate(hash, options) {
    const opts = options || {};
    if (location.hash !== hash) history[opts.replace ? "replaceState" : "pushState"](null, "", hash);
    parseRoute(opts);
  }

  if (els.mainTabs) els.mainTabs.addEventListener("click", function (event) {
    const button = event.target.closest("[data-main]");
    if (!button) return;
    const main = button.getAttribute('data-main');
    navigate('#' + (main === 'all' ? 'katalog' : main), { scroll: false });
    const replacement = els.mainTabs.querySelector('[data-main="' + main + '"]');
    if (replacement) replacement.focus({ preventScroll: true });
  });
  if (els.subTabs) els.subTabs.addEventListener("click", function (event) {
    const button = event.target.closest("[data-sub]");
    if (!button) return;
    state.sub = button.getAttribute("data-sub");
    navigate(listHash(), { scroll: false });
    const replacement = Array.from(els.subTabs.querySelectorAll("button")).find(function (item) { return item.getAttribute("data-sub") === state.sub; });
    if (replacement) replacement.focus({ preventScroll: true });
  });
  if (els.variant) els.variant.addEventListener('change', function () {
    state.variant = els.variant.value; navigate(listHash(), { scroll: false }); els.variant.focus({ preventScroll: true });
  });
  if (els.availability) els.availability.addEventListener('change', function () {
    state.availability = els.availability.value; navigate(listHash(), { scroll: false }); els.availability.focus({ preventScroll: true });
  });
  document.addEventListener('zh:languagechange', function () { renderView(); syncQuickNav(); });
  if (els.search) els.search.addEventListener("input", function () {
    const wasDetail = Boolean(state.item);
    state.query = els.search.value;
    navigate(listHash(), { replace: !wasDetail, scroll: false });
  });
  if (els.clear) els.clear.addEventListener("click", function () {
    state.query = "";
    navigate(listHash(), { scroll: false });
    els.search.focus({ preventScroll: true });
  });
  document.addEventListener("click", function (event) {
    const link = event.target.closest("a[href^='#']");
    if (!link || !link.closest(".wiki-page") || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const card = link.closest(".wiki-card");
    if (card) returnFocusId = card.getAttribute("data-id");
    navigate(link.getAttribute("href"), { focusCard: link.id === "wikiBackBtn" });
  });
  document.addEventListener("error", function (event) {
    const image = event.target;
    if (!(image instanceof HTMLImageElement)) return;
    if (image.closest(".wiki-reference-gallery")) {
      if (image.hidden) return;
      image.hidden = true;
      const message = document.createElement("p");
      message.className = "wiki-reference-image-error";
      message.textContent = "Das Referenzbild konnte nicht geladen werden. Beschreibung und Originalbildlink bleiben verfügbar.";
      image.insertAdjacentElement("afterend", message);
      return;
    }
    if (!image.closest(".wiki-media")) return;
    const card = image.closest("[data-id]");
    const entry = byId.get(card ? card.getAttribute("data-id") : state.item);
    if (entry) image.closest(".wiki-media").outerHTML = imageBlock(entry, Boolean(image.closest(".wiki-detail")), true);
  }, true);
  window.addEventListener("hashchange", function () { parseRoute({ focusCard: !location.hash.startsWith("#item/") }); });
  if (els.artDirection) els.artDirection.innerHTML = renderArtDirection();
  parseRoute();
})();
