import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

// Edit wiki-entries.json. This script validates that source and rebuilds the browser bundle.
// --check validates without modifying files, including whether the bundle is up to date.
const directory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(directory, "../..");
const source = path.join(directory, "wiki-entries.json");
const target = path.join(root, "assets/js/wiki-data.js");
const checkOnly = process.argv.includes("--check");
const data = JSON.parse(fs.readFileSync(source, "utf8"));
const problems = [];
const expect = (condition, message) => { if (!condition) problems.push(message); };
const slots = ["body", "pants", "boots", "jacket", "vest", "backpack", "headgear", "weapon"];
const statuses = ["OFFEN", "GEPLANT", "KONZEPT", "IM SPIEL"];
const artStatuses = ["FINAL", "ENTWURF", "PLACEHOLDER", "GEPLANT"];
const nonempty = value => typeof value === "string" && Boolean(value.trim());
const identifier = value => typeof value === "string" && /^[a-z0-9][a-z0-9_]*$/.test(value);
function hasImplementationEvidence(entry) {
  const proof = entry.implementation_evidence;
  const grid = entry.grid || {};
  // World artwork has a visual footprint, not a player-build type or new collider.
  const worldArt = proof && entry.module_family === "master_kit_world_v1"
    && proof.kind === "world_art" && proof.world_module === entry.visual_id
    && proof.build_type === undefined && proof.collision_authority === "world_geometry.gd"
    && grid.footprint_role === "visual_only"
    && ((entry.status === "IM SPIEL" && proof.integration === "integrated")
      || (entry.status === "KONZEPT" && proof.integration === "prepared"));
  return (entry.status === "IM SPIEL" || worldArt) && proof && typeof proof === "object"
    && ["project", "definition", "renderer", "asset", "verification"].every(field => nonempty(proof[field]))
    && ((entry.module_family !== "master_kit_world_v1" && Number.isInteger(proof.build_type)) || worldArt)
    && Number.isInteger(proof.grid_cell_size) && proof.grid_cell_size > 0
    && Array.isArray(proof.footprint_cells) && proof.footprint_cells.length === 2
    && proof.footprint_cells.every(value => Number.isInteger(value) && value > 0)
    && grid.cell_size === `${proof.grid_cell_size} Weltpixel`
    && JSON.stringify(grid.footprint_cells) === JSON.stringify(proof.footprint_cells)
    && nonempty(grid.dimensions) && grid.dimensions !== "OFFEN";
}
function list(value, label) {
  if (value === undefined) return [];
  expect(Array.isArray(value), `${label}: must be an array.`);
  return Array.isArray(value) ? value : [];
}
function strings(value, label) {
  const values = list(value, label);
  expect(values.every(nonempty), `${label}: must contain nonempty strings.`);
  return values;
}
function imageFile(value, label) {
  if (!nonempty(value)) { expect(false, `${label}: image path is required.`); return null; }
  const imagePath = path.resolve(root, value);
  const relative = path.relative(root, imagePath);
  const valid = !relative.startsWith("..") && !path.isAbsolute(relative)
    && fs.existsSync(imagePath) && fs.statSync(imagePath).isFile();
  expect(valid, `${label}: image must exist inside this project.`);
  return valid ? imagePath : null;
}

expect(data.meta && Array.isArray(data.entries), "meta and entries are required.");
if (problems.length) throw new Error(problems.join("\n"));
expect(JSON.stringify(data.meta.equipment_slots) === JSON.stringify(slots), "The eight equipment slots must be present in their documented order.");
const direction = data.meta.art_direction;
expect(direction && identifier(direction.id), "A named common art direction is required.");
if (direction) {
  for (const field of ["perspective", "style", "palette", "scale", "lighting", "detail", "readability", "scope", "preservation_note"]) {
    expect(nonempty(direction[field]), `art_direction.${field}: a documented direction is required.`);
  }
  imageFile(direction.reference_image, "art_direction.reference_image");
}
const ids = new Set();
const visualIds = new Set();
for (const entry of data.entries) {
  const key = entry.id || "<missing id>";
  expect(typeof entry.id === "string" && /^[a-z0-9][a-z0-9_]*$/.test(entry.id), `${key}: invalid id.`);
  expect(!ids.has(entry.id), `${key}: duplicate id.`);
  ids.add(entry.id);
  expect(typeof entry.name === "string" && entry.name.trim(), `${key}: name is required.`);
  expect(typeof entry.description === "string" && entry.description.trim(), `${key}: description is required.`);
  expect(Object.hasOwn(data.meta.categories, entry.category), `${key}: unknown category.`);
  expect(Object.hasOwn(data.meta.subcategories, entry.subcategory), `${key}: unknown subcategory.`);
  expect(typeof entry.visual_id === "string" && /^[a-z0-9][a-z0-9_]*$/.test(entry.visual_id), `${key}: invalid visual_id.`);
  expect(!visualIds.has(entry.visual_id), `${key}: duplicate visual_id.`);
  visualIds.add(entry.visual_id);
  expect(entry.slot === null || slots.includes(entry.slot), `${key}: invalid equipment slot.`);
  const openEquipmentSlot = entry.slot === null && entry.status === "GEPLANT"
    && entry.slot_status === "OFFEN" && nonempty(entry.art?.slot_note);
  const wearable = entry.category === "ausruestung" && ["kleidung", "schutz", "ruecksaecke", "tragbares"].includes(entry.subcategory);
  expect(!wearable || slots.includes(entry.slot) || openEquipmentSlot, `${key}: equipment needs a valid slot or an explicitly unresolved planned assignment.`);
  const weaponSlotItem = entry.category === "ausruestung" && ["waffen", "werkzeuge"].includes(entry.subcategory) && !/^(item_|throwable_)/.test(entry.id);
  expect(!weaponSlotItem || entry.slot === "weapon", `${key}: weapons and tools use the weapon slot.`);
  expect(statuses.includes(entry.status), `${key}: invalid implementation status.`);
  expect(entry.status !== "IM SPIEL" || Boolean(entry.implementation_evidence), `${key}: IM SPIEL needs documented implementation evidence.`);
  expect(artStatuses.includes(entry.art_status), `${key}: invalid art status.`);
  expect(artStatuses.includes(entry.image_status), `${key}: invalid image status.`);
  expect(entry.art && entry.art.visual_id === entry.visual_id && entry.art.slot === entry.slot, `${key}: art IDs and slots must match the entry.`);
  expect(entry.art && entry.art.art_status === entry.art_status, `${key}: art status fields must match.`);
  expect(entry.art?.style_reference === direction?.id, `${key}: art must refer to the shared style and perspective direction.`);
  expect(nonempty(entry.art?.image_role) && nonempty(entry.art?.perspective), `${key}: image role and target perspective are required.`);
  expect(entry.art?.perspective_status === "VERBINDLICHE ZIELRICHTUNG", `${key}: document the binding target perspective separately from final asset approval.`);
  if (entry.art_status === "FINAL" || entry.image_status === "FINAL") expect(Boolean(entry.art?.approval_reference), `${key}: FINAL needs an approval reference.`);
  expect(Array.isArray(entry.stats) && entry.stats.every(row => typeof row.label === "string" && typeof row.value === "string"), `${key}: stats need string labels and values.`);
  expect(Array.isArray(entry.tags) && entry.tags.every(tag => typeof tag === "string"), `${key}: tags must be strings.`);
  if (entry.image) {
    imageFile(entry.image, key);
  }
  if (entry.module_type) {
    expect(entry.rotation_step_deg === 90 && entry.grid?.rotation_step_deg === 90 && entry.grid?.snap === true, `${key}: modules must use a snapped 90-degree grid.`);
    expect(Boolean(entry.grid?.dimensions) && Boolean(entry.grid?.cell_size), `${key}: document dimensions and cell size, using OFFEN where unknown.`);
    const dimensionsOpen = entry.grid?.dimensions === "OFFEN" && entry.grid?.cell_size === "OFFEN";
    expect(dimensionsOpen || hasImplementationEvidence(entry), `${key}: concrete grid dimensions need matching implementation evidence.`);
  }
}
const plannedIds = new Set();
function references(value, label) {
  for (const id of strings(value, label)) expect(ids.has(id), `${label}: unknown reference ${id}.`);
}
if (direction) expect(ids.has(direction.reference_entry), "art_direction must reference an existing entry.");
for (const entry of data.entries) {
  if (entry.presentation) {
    expect(["available", "partial", "planned", "open"].includes(entry.presentation.availability), `${entry.id}: invalid display availability.`);
    for (const id of entry.presentation.related_entries || []) expect(ids.has(id) && id !== entry.id, `${entry.id}: invalid related entry ${id}.`);
    if (entry.presentation.variant) expect(Object.hasOwn(data.meta.variants || {}, entry.presentation.variant), `${entry.id}: invalid variant filter.`);
  }
  for (const id of entry.composed_of || []) expect(ids.has(id), `${entry.id}: unknown module reference ${id}.`);
  for (const section of entry.world_sections || []) {
    expect(statuses.includes(section.status), `${entry.id}: world section requires a status.`);
    for (const id of section.module_refs || []) expect(ids.has(id), `${entry.id}: unknown world section module ${id}.`);
  }
  if (entry.reference_plan !== undefined) {
    const plan = entry.reference_plan;
    const label = `${entry.id}: reference_plan`;
    expect(plan && typeof plan === "object" && !Array.isArray(plan), `${label}: must be an object.`);
    if (!plan || typeof plan !== "object" || Array.isArray(plan)) continue;
    for (const field of ["designation", "location", "commitment", "interpretation"]) {
      if (plan[field] !== undefined) expect(nonempty(plan[field]), `${label}.${field}: must be a nonempty string.`);
    }
    references(plan.related_entries, `${label}.related_entries`);
    strings(plan.open_points, `${label}.open_points`);
    const galleryIds = new Set();
    for (const reference of list(plan.gallery, `${label}.gallery`)) {
      expect(reference && typeof reference === "object", `${label}: invalid gallery record.`);
      if (!reference || typeof reference !== "object") continue;
      expect(identifier(reference.id) && !galleryIds.has(reference.id), `${label}: gallery IDs must be valid and unique.`);
      galleryIds.add(reference.id);
      for (const field of ["title", "caption", "alt"]) expect(nonempty(reference[field]), `${label}: gallery ${field} is required.`);
      const imagePath = imageFile(reference.image, `${label}.${reference.id}`);
      if (reference.sha256 !== undefined) {
        expect(typeof reference.sha256 === "string" && /^[a-f0-9]{64}$/.test(reference.sha256), `${label}: invalid SHA256.`);
        if (imagePath) expect(createHash("sha256").update(fs.readFileSync(imagePath)).digest("hex") === reference.sha256, `${label}: reference image bytes have changed.`);
      }
    }
    for (const field of ["entrances", "modules", "rules", "building_types"]) {
      for (const item of list(plan[field], `${label}.${field}`)) {
        expect(item && typeof item === "object", `${label}.${field}: invalid record.`);
        if (!item || typeof item !== "object") continue;
        expect(nonempty(item.name) && nonempty(item.description), `${label}.${field}: name and description are required.`);
        if (field !== "rules") expect(statuses.includes(item.status), `${label}.${field}: invalid status.`);
        references(item.module_refs, `${label}.${field}.${item.name}`);
        if (item.entry_ref !== undefined) expect(ids.has(item.entry_ref), `${label}.${field}: unknown entry_ref.`);
        strings(item.open_points, `${label}.${field}.open_points`);
        if (item.planned_visual_id !== undefined) {
          expect(identifier(item.planned_visual_id) && !visualIds.has(item.planned_visual_id) && !plannedIds.has(item.planned_visual_id), `${label}: planned_visual_id must be valid and distinct from existing asset IDs.`);
          expect(item.status === "GEPLANT", `${label}: a future asset identity must remain GEPLANT.`);
          plannedIds.add(item.planned_visual_id);
        }
      }
    }
  }
}
if (data.meta.world_reference) {
  references([data.meta.world_reference.primary_entry, data.meta.world_reference.city_structure_entry], "world_reference");
  strings(data.meta.world_reference.design_chain, "world_reference.design_chain");
}
for (const [category, filters] of Object.entries(data.meta.filters || {})) {
  expect(category === "all" || Object.hasOwn(data.meta.categories, category), `${category}: unknown filter category.`);
  for (const filter of filters) expect(filter.id === "all" || Object.hasOwn(data.meta.subcategories, filter.id), `${category}: unknown filter ${filter.id}.`);
}
if (problems.length) throw new Error(`Wiki validation failed:\n${problems.join("\n")}`);
const output = "/* Generated from assets/data/wiki-entries.json. Edit that JSON and run assets/data/build-wiki-data.mjs. */\nwindow.WIKI_DATA = " + JSON.stringify(data) + ";\n";
if (checkOnly) {
  if (!fs.existsSync(target) || fs.readFileSync(target, "utf8") !== output) throw new Error("wiki-data.js is outdated. Run this script without --check.");
} else {
  fs.writeFileSync(target, output, "utf8");
}
console.log(`Wiki ${checkOnly ? "checked" : "built"}: ${data.entries.length} entries, ${data.entries.filter(entry => entry.image).length} image references, 0 validation errors.`);
