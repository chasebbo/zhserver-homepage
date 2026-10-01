#!/usr/bin/env python3
"""Read-only, offline regression checks for the recovered ZHServer wiki.

Run from any directory: python tools/verify_wiki.py
Use --ref <git-ref> to compare with another historical wiki, or --report <path>
to also write the complete JSON result. No checkout, server or browser is used.
This verifies source content and contracts; it does not replace browser QA.
"""

import argparse
from collections import Counter
from html import unescape
from html.parser import HTMLParser
import hashlib
import json
from pathlib import Path
import re
import subprocess
import sys
from urllib.parse import unquote, urlsplit


DEFAULT_REF = "75f65d17860a1d28c2d12b4afc005ac84690c511"
SLOTS = {"body", "pants", "boots", "jacket", "vest", "backpack", "headgear", "weapon"}
EXPECTED_ADDITIONS = {
    "jacket_civilian_01", "build_wood_wall_corner_01",
    "build_stone_wall_corner_01", "build_metal_wall_corner_01",
    "ammo_9x19_01", "ammo_12gauge_01", "ammo_762_rifle_01", "ammo_556_01",
    "ammo_357_01", "ammo_wood_arrow_01", "ammo_crossbow_bolt_01",
    "world_supermarket_01",
}
NEW_WORLD_REFERENCE_IDS = {
    "world_residential_01", "world_gas_station_01", "world_police_01",
    "world_hospital_01", "world_workshop_01", "world_industrial_01",
    "world_garage_01", "world_office_01",
}
WORLD_REFERENCE_IDS = NEW_WORLD_REFERENCE_IDS | {
    "world_adminbase_central_01", "world_city_structure_01", "world_supermarket_01",
}
OPEN_SLOT_REFERENCE_IDS = {"gloves_plan_01", "wearable_other_plan_01"}
DOOR_WALL_REFERENCE_IDS = {
    "build_wood_wall_door_01", "build_stone_wall_door_01", "build_metal_wall_door_01",
}
ART_REFERENCE_ADDITIONS = (
    NEW_WORLD_REFERENCE_IDS | OPEN_SLOT_REFERENCE_IDS | DOOR_WALL_REFERENCE_IDS
)
WORLD_DESIGN_CHAIN = [
    "WIKI-REFERENZ", "ART-/DESIGN-VORGABE", "SPIELASSET", "BAUMENÜ",
    "SPIELERBASIS", "MODULARES WELTGEBÄUDE", "MODULARE STADTSTRUKTUR",
]
ART_DIRECTION_ID = "survival_gameplay_01"
# Only these documented image references are replaced by the shared game kit.
# Original names, descriptions and values still use the full comparison.
MASTER_KIT_IMAGE_UPDATES = {
    "build_metal_fence_01": "assets/images/wiki/master-kit-v1/metal_fence_01.png",
    "build_metal_gate_01": "assets/images/wiki/master-kit-v1/metal_gate_01.png",
    "build_metal_garage_door_01": "assets/images/wiki/master-kit-v1/garage_gate_01.png",
    "build_wood_floor_01": "assets/images/wiki/master-kit-v1/wood_floor_01.png",
    "build_wood_wall_01": "assets/images/wiki/master-kit-v1/wood_wall_01.png",
    "build_wood_roof_01": "assets/images/wiki/master-kit-v1/wood_roof_01.png",
    "build_wood_wall_window_01": "assets/images/wiki/master-kit-v1/wood_window_wall_01.png",
    "build_workbench_01": "assets/images/wiki/master-kit-v1/workbench_01.png",
    "build_crate_wood_01": "assets/images/wiki/master-kit-v1/wood_crate_01.png",
    "build_metal_floor_01": "assets/images/wiki/master-kit-v1/metal_floor_01.png",
    "build_metal_wall_01": "assets/images/wiki/master-kit-v1/metal_wall_01.png",
    "build_stone_wall_01": "assets/images/wiki/master-kit-v1/stone_wall_01.png",
    "build_wood_door_01": "assets/images/wiki/master-kit-v1/wood_door_01.png",
    "build_metal_door_01": "assets/images/wiki/master-kit-v1/steel_door_01.png",
    "build_wood_fence_01": "assets/images/wiki/master-kit-v1/wood_fence_01.png",
    "build_wood_pillar_01": "assets/images/wiki/master-kit-v1/wood_pillar_01.png",
    "build_stone_wall_window_01": "assets/images/wiki/master-kit-v1/stone_window_wall_01.png",
    "build_stone_pillar_01": "assets/images/wiki/master-kit-v1/stone_pillar_01.png",
    "build_metal_gate_reinforced_01": "assets/images/wiki/master-kit-v1/reinforced_gate_01.png",
    "build_gun_cabinet_01": "assets/images/wiki/master-kit-v1/weapon_locker_01.png",
    "build_generator_01": "assets/images/wiki/master-kit-v1/generator_01.png",
    "build_crate_metal_01": "assets/images/wiki/master-kit-v1/metal_crate_01.png",
    "build_wood_watchtower_01": "assets/images/wiki/master-kit-v1/watchtower_01.png",
    "build_claim_flag_01": "assets/images/wiki/master-kit-v1/base_flag_01.png",
    "build_floodlight_01": "assets/images/wiki/master-kit-v1/base_lamp_01.png",
    "build_water_tank_01": "assets/images/wiki/master-kit-v1/water_tank_01.png",
    "build_rain_barrel_01": "assets/images/wiki/master-kit-v1/rain_barrel_01.png",
    "build_fridge_01": "assets/images/wiki/master-kit-v1/fridge_01.png",
    "build_water_pump_01": "assets/images/wiki/master-kit-v1/water_pump_01.png",
    "build_stone_floor_01": "assets/images/wiki/master-kit-v1/stone_floor_01.png",
    "build_wood_foundation_01": "assets/images/wiki/master-kit-v1/wood_foundation_01.png",
    "build_stone_foundation_01": "assets/images/wiki/master-kit-v1/stone_foundation_01.png",
    "build_stone_roof_01": "assets/images/wiki/master-kit-v1/stone_roof_01.png",
    "build_stone_fence_01": "assets/images/wiki/master-kit-v1/stone_fence_01.png",
    "build_wood_ladder_01": "assets/images/wiki/master-kit-v1/ladder_01.png",
    "build_safe_01": "assets/images/wiki/master-kit-v1/safe_01.png",
    "build_bed_spawn_01": "assets/images/wiki/master-kit-v1/bed_01.png",
    "build_hospital_bed_01": "assets/images/wiki/master-kit-v1/medical_bed_01.png",
    "build_greenhouse_01": "assets/images/wiki/master-kit-v1/greenhouse_01.png",
    "build_campfire_01": "assets/images/wiki/master-kit-v1/campfire_01.png",
    "trap_spike_01": "assets/images/wiki/master-kit-v1/spike_trap_01.png",
    "trap_wire_01": "assets/images/wiki/master-kit-v1/wire_trap_01.png",
    "build_ammo_press_01": "assets/images/wiki/master-kit-v1/ammo_press_01.png",
}
MASTER_KIT_SERIES_TAG_UPDATES = {
    "build_metal_garage_door_01",
    "build_wood_floor_01", "build_wood_wall_01",
    "build_wood_roof_01",
    "build_wood_wall_window_01",
    "build_workbench_01", "build_crate_wood_01",
    "build_metal_floor_01", "build_metal_wall_01",
    "build_stone_wall_01",
    "build_wood_door_01",
    "build_metal_door_01",
    "build_wood_fence_01",
    "build_wood_pillar_01",
    "build_stone_wall_window_01",
    "build_stone_pillar_01",
    "build_metal_gate_reinforced_01",
    "build_gun_cabinet_01",
    "build_generator_01",
    "build_crate_metal_01",
    "build_wood_watchtower_01",
    "build_claim_flag_01",
    "build_floodlight_01",
    "build_water_tank_01",
    "build_rain_barrel_01",
    "build_fridge_01",
    "build_water_pump_01",
    "build_stone_floor_01",
    "build_wood_foundation_01",
    "build_stone_foundation_01",
    "build_stone_roof_01",
    "build_stone_fence_01",
    "build_wood_ladder_01",
    "build_safe_01",
    "build_bed_spawn_01",
    "build_hospital_bed_01",
    "build_greenhouse_01",
    "build_campfire_01",
    "trap_spike_01",
    "trap_wire_01",
    "build_ammo_press_01",
}
# Pin the supplied original files independently of editable gallery metadata.
ADMINBASE_REFERENCE_IMAGES = {
    "assets/images/wiki/references/adminbase-layout.png":
        "e712da1408f53074c11cbd18ce1f28640acf45cc84c44000a9bc034e6cf6eb1e",
    "assets/images/wiki/references/adminbase-atmosphere.png":
        "53dbd2c5d853f7b0fe605bdfc7f10da4cb09c258cd86c81cc4f38d0ba92b56cd",
}
VOID_TAGS = {
    "area", "base", "br", "col", "embed", "hr", "img", "input", "link",
    "meta", "param", "source", "track", "wbr",
}


def normalize(value):
    """Ignore presentation whitespace/entities, but retain words and numbers."""
    if isinstance(value, str):
        return re.sub(r"\s+", " ", unescape(value)).strip()
    if isinstance(value, list):
        return [normalize(item) for item in value]
    if isinstance(value, dict):
        return {key: normalize(item) for key, item in value.items()}
    return value


def has_implementation_evidence(entry):
    """Concrete grid data must identify the matching game definition and asset."""
    def is_json_integer(value):
        # Match Number.isInteger: JSON 1.0 is integral, bool/NaN/Infinity are not.
        return type(value) is int or (type(value) is float and value.is_integer())

    evidence = entry.get("implementation_evidence")
    if not isinstance(evidence, dict):
        return False
    grid = entry.get("grid", {})
    # Visual-only world art is registered independently of player build types.
    world_art = (
        entry.get("module_family") == "master_kit_world_v1"
        and evidence.get("kind") == "world_art"
        and evidence.get("world_module") == entry.get("visual_id")
        and "build_type" not in evidence
        and evidence.get("collision_authority") == "world_geometry.gd"
        and grid.get("footprint_role") == "visual_only"
        and ((entry.get("status") == "IM SPIEL" and evidence.get("integration") == "integrated")
             or (entry.get("status") == "KONZEPT" and evidence.get("integration") == "prepared"))
    )
    if entry.get("status") != "IM SPIEL" and not world_art:
        return False
    footprint = evidence.get("footprint_cells")
    return (
        all(isinstance(evidence.get(field), str) and bool(evidence[field].strip())
            for field in ("project", "definition", "renderer", "asset", "verification"))
        and ((entry.get("module_family") != "master_kit_world_v1" and is_json_integer(evidence.get("build_type"))) or world_art)
        and is_json_integer(evidence.get("grid_cell_size"))
        and evidence["grid_cell_size"] > 0
        and isinstance(footprint, list) and len(footprint) == 2
        and all(is_json_integer(value) and value > 0 for value in footprint)
        and grid.get("cell_size") == f"{int(evidence['grid_cell_size'])} Weltpixel"
        and grid.get("footprint_cells") == footprint
        and all(is_json_integer(value) for value in grid["footprint_cells"])
        and isinstance(grid.get("dimensions"), str)
        and bool(grid["dimensions"].strip()) and grid["dimensions"] != "OFFEN"
    )


class Node:
    def __init__(self, tag="", attrs=(), parent=None):
        self.tag = tag
        self.attrs = dict(attrs)
        self.parent = parent
        self.children = []

    def text(self):
        return "".join(c if isinstance(c, str) else c.text() for c in self.children)

    def walk(self):
        for child in self.children:
            if isinstance(child, Node):
                yield child
                yield from child.walk()

    def find(self, tag=None, cls=None, node_id=None):
        return [n for n in self.walk()
                if (tag is None or n.tag == tag)
                and (cls is None or cls in n.attrs.get("class", "").split())
                and (node_id is None or n.attrs.get("id") == node_id)]


class Document(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.root = Node()
        self.current = self.root
        self.feed(source)
        self.close()

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs, self.current)
        self.current.children.append(node)
        if tag not in VOID_TAGS:
            self.current = node

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID_TAGS:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        node = self.current
        while node.parent is not None:
            if node.tag == tag:
                self.current = node.parent
                return
            node = node.parent

    def handle_data(self, value):
        self.current.children.append(value)


def first_text(node, **criteria):
    found = node.find(**criteria)
    return normalize(found[0].text()) if found else ""


def original_cards(document):
    """Extract labels without discarding text surrounding a value span."""
    cards = []
    for node in document.find(tag="article", cls="recipe-card"):
        materials = node.find(cls="recipe-materials")
        stats = []
        for row in materials[0].find(tag="li") if materials else []:
            spans = [c for c in row.children if isinstance(c, Node) and c.tag == "span"]
            value = spans[-1] if spans else None
            label = "".join(c if isinstance(c, str) else c.text()
                            for c in row.children if c is not value)
            stats.append({"label": normalize(label),
                          "value": normalize(value.text()) if value else ""})
        images = node.find(tag="img")
        cards.append({
            "name": first_text(node, tag="h3"),
            "description": first_text(node, cls="recipe-description"),
            "stats_title": first_text(node, cls="recipe-section-title"),
            "stats": stats,
            "tags": [normalize(n.text()) for n in node.find(cls="tool-badge")],
            "image": images[0].attrs.get("src", "") if images else "",
        })
    return cards


class Checks:
    def __init__(self):
        self.count = 0
        self.errors = []

    def check(self, condition, message, **details):
        self.count += 1
        if not condition:
            self.errors.append({"message": message, **details})


def read_text(path):
    return path.read_text(encoding="utf-8-sig")


def check_generated_data(project, data, checks):
    source = read_text(project / "assets/js/wiki-data.js")
    assignment = re.search(r"\bwindow\.WIKI_DATA\s*=\s*", source)
    checks.check(assignment is not None, "Generated script has no window.WIKI_DATA assignment")
    if assignment is None:
        return
    payload = source[assignment.end():]
    try:
        generated, end = json.JSONDecoder().raw_decode(payload)
    except json.JSONDecodeError as error:
        checks.check(False, "Generated script contains invalid JSON", error=str(error))
        return
    checks.check(payload[end:].strip() in {"", ";"},
                 "Unexpected executable text after generated JSON")
    checks.check(generated == data, "wiki-data.js is stale or differs from wiki-entries.json")


def check_paths(project, document, entries, checks):
    """Check local resources without contacting external sites or services."""
    resources = {(entry.get("image"), "wiki.html") for entry in entries if entry.get("image")}
    resources.update((picture["image"], "wiki.html")
                     for entry in entries
                     for picture in entry.get("reference_plan", {}).get("gallery", [])
                     if picture.get("image"))
    for node in document.walk():
        for attr in ("src", "href", "poster"):
            if node.attrs.get(attr):
                resources.add((node.attrs[attr], "wiki.html"))
    # CSS image/font resources used by this page must survive the recovery too.
    for node in document.find(tag="link"):
        raw = node.attrs.get("href", "")
        parsed = urlsplit(raw)
        if parsed.scheme or parsed.netloc or not parsed.path.endswith(".css"):
            continue
        css_path = project / unquote(parsed.path).lstrip("/")
        if css_path.is_file():
            for match in re.finditer(r"url\(\s*(['\"]?)(.*?)\1\s*\)", read_text(css_path)):
                resources.add((match.group(2), str(css_path.relative_to(project))))
    count = 0
    for raw, origin in sorted(resources):
        parsed = urlsplit(unescape(raw))
        if parsed.scheme or parsed.netloc or not parsed.path:
            continue
        path = unquote(parsed.path)
        target = (project / path.lstrip("/") if path.startswith("/")
                  else project / Path(origin).parent / path).resolve()
        count += 1
        checks.check(target.is_relative_to(project), "Local URL escapes the project", url=raw)
        checks.check(target.is_file() or (target.is_dir() and (target / "index.html").is_file()),
                     "Missing local link or resource", url=raw, source=origin)
    return count


def check_art_direction(meta, entries, checks):
    """Keep a shared target view distinct from the approval of individual art."""
    direction = meta.get("art_direction", {})
    checks.check(isinstance(direction, dict), "Shared art direction must be an object")
    if not isinstance(direction, dict):
        return
    checks.check(direction.get("id") == ART_DIRECTION_ID,
                 "The common art direction needs a stable reference ID")
    checks.check(direction.get("reference_entry") == "world_adminbase_central_01",
                 "Adminbasis must remain the shared style and perspective reference")
    checks.check(direction.get("reference_image") ==
                 "assets/images/wiki/references/adminbase-atmosphere.png",
                 "Art direction must use the supplied detailed Adminbasis reference")
    for field in ("perspective", "style", "palette", "scale", "lighting", "detail",
                  "readability", "scope", "preservation_note"):
        checks.check(isinstance(direction.get(field), str) and bool(direction[field].strip()),
                     "Shared art direction is incomplete", field=field)
    reference = meta.get("world_reference", {})
    checks.check(reference.get("design_chain") == WORLD_DESIGN_CHAIN,
                 "Shared modular design chain is incomplete or reordered")
    by_id = {entry["id"]: entry for entry in entries}
    checks.check(ART_REFERENCE_ADDITIONS.issubset(by_id),
                 "Required planned equipment, door walls or world building pages are missing",
                 missing=sorted(ART_REFERENCE_ADDITIONS - by_id.keys()))
    for entry in entries:
        entry_id = entry["id"]
        art = entry.get("art", {})
        checks.check(art.get("style_reference") == ART_DIRECTION_ID,
                     "Entry is disconnected from the shared art direction", id=entry_id)
        checks.check(art.get("perspective_status") == "VERBINDLICHE ZIELRICHTUNG",
                     "Entry must distinguish the binding target view from draft assets", id=entry_id)
        for field in ("style", "perspective", "color_direction", "size_class", "image_role"):
            checks.check(isinstance(art.get(field), str) and bool(art[field].strip()),
                         "Art reference field is missing", id=entry_id, field=field)
        checks.check(entry.get("art_status") in meta.get("art_statuses", [])
                     and art.get("art_status") == entry.get("art_status"),
                     "Art approval status is invalid or inconsistent", id=entry_id)
        if entry_id in ART_REFERENCE_ADDITIONS:
            checks.check(entry.get("status") == "GEPLANT",
                         "New design reference must remain explicitly planned", id=entry_id)
            # These are planning pages, not a source of invented gameplay stats.
            for field in ("weight", "damage", "protection", "capacity", "durability"):
                value = entry.get(field)
                checks.check(not value or normalize(value) == "OFFEN",
                             "Planned reference contains an unverified gameplay value",
                             id=entry_id, field=field, value=value)
        if entry_id in OPEN_SLOT_REFERENCE_IDS:
            checks.check(entry.get("category") == "ausruestung",
                         "Wearable planning page belongs in equipment", id=entry_id)
            checks.check(entry.get("slot") is None and art.get("slot") is None
                         and entry.get("slot_status") == "OFFEN",
                         "Unassigned wearables must not invent a ninth equipment slot", id=entry_id)
            checks.check(isinstance(art.get("slot_note"), str) and bool(art["slot_note"].strip()),
                         "Unassigned wearable needs a visible slot explanation", id=entry_id)
        if entry_id in DOOR_WALL_REFERENCE_IDS:
            checks.check(entry.get("category") == "bausystem" and bool(entry.get("module_type")),
                         "Door wall needs a separate building module reference", id=entry_id)


def check_world_references(project, entries, checks):
    """Validate planning links and byte-identical references without game claims."""
    by_id = {entry["id"]: entry for entry in entries}
    checks.check(WORLD_REFERENCE_IDS.issubset(by_id),
                 "Required world reference pages are missing",
                 missing=sorted(WORLD_REFERENCE_IDS - by_id.keys()))
    counts = {"reference_plans": 0, "reference_images": 0,
              "planned_entrances": 0, "module_groups": 0, "building_types": 0}

    def reference(source_id, target_id, field):
        checks.check(target_id in by_id and target_id != source_id,
                     "Invalid world planning entry reference", id=source_id,
                     reference=target_id, field=field)

    for entry in entries:
        entry_id = entry["id"]
        for section in entry.get("world_sections", []):
            for field in ("name", "status", "note"):
                checks.check(isinstance(section.get(field), str) and bool(section[field].strip()),
                             "World functional area is incomplete", id=entry_id, field=field)
            for target in section.get("module_refs", []):
                reference(entry_id, target, "world_sections.module_refs")
        plan = entry.get("reference_plan")
        if plan is None:
            checks.check(entry_id not in WORLD_REFERENCE_IDS,
                         "Required world page has no reference plan", id=entry_id)
            continue
        counts["reference_plans"] += 1
        checks.check(isinstance(plan, dict), "Reference plan must be an object", id=entry_id)
        if not isinstance(plan, dict):
            continue
        for field in ("designation", "location", "commitment", "interpretation"):
            checks.check(isinstance(plan.get(field), str) and bool(plan[field].strip()),
                         "World reference context is missing", id=entry_id, field=field)
        for target in plan.get("related_entries", []):
            reference(entry_id, target, "reference_plan.related_entries")
        for field, count_key in (("entrances", "planned_entrances"),
                                 ("modules", "module_groups")):
            rows = plan.get(field, [])
            counts[count_key] += len(rows)
            for row in rows:
                for row_field in ("name", "status", "description"):
                    checks.check(isinstance(row.get(row_field), str) and bool(row[row_field].strip()),
                                 "World planning row is incomplete", id=entry_id,
                                 section=field, field=row_field)
                for target in row.get("module_refs", []):
                    reference(entry_id, target, f"reference_plan.{field}.module_refs")
                planned_id = row.get("planned_visual_id")
                if planned_id:
                    checks.check(planned_id not in by_id,
                                 "Planned-only visual ID already names a catalog entry",
                                 id=entry_id, reference=planned_id)
        for row in plan.get("building_types", []):
            counts["building_types"] += 1
            if row.get("entry_ref"):
                reference(entry_id, row["entry_ref"], "reference_plan.building_types.entry_ref")
        gallery = plan.get("gallery", [])
        gallery_ids = [picture.get("id") for picture in gallery]
        checks.check(len(set(gallery_ids)) == len(gallery_ids),
                     "Duplicate reference gallery IDs", id=entry_id)
        for picture in gallery:
            counts["reference_images"] += 1
            for field in ("id", "image", "title", "caption", "alt"):
                checks.check(isinstance(picture.get(field), str) and bool(picture[field].strip()),
                             "Reference gallery field is missing", id=entry_id, field=field)
            raw = picture.get("image", "")
            parsed = urlsplit(raw)
            local = bool(parsed.path) and not (parsed.scheme or parsed.netloc)
            checks.check(local, "Reference image must be a local project file", id=entry_id, image=raw)
            if not local:
                continue
            target = (project / unquote(parsed.path).lstrip("/")).resolve()
            safe = target.is_relative_to(project) and target.is_file()
            checks.check(safe, "Reference image is missing or outside the project", id=entry_id, image=raw)
            declared_hash = picture.get("sha256", "")
            checks.check(bool(re.fullmatch(r"[0-9a-f]{64}", declared_hash)),
                         "Reference image SHA256 is missing or malformed", id=entry_id, image=raw)
            if safe:
                digest = hashlib.sha256(target.read_bytes()).hexdigest()
                checks.check(digest == declared_hash,
                             "Reference image differs from its recorded SHA256", id=entry_id, image=raw)
                if raw in ADMINBASE_REFERENCE_IMAGES:
                    checks.check(digest == ADMINBASE_REFERENCE_IMAGES[raw],
                                 "Supplied Adminbasis original was altered", image=raw)
        if entry_id in WORLD_REFERENCE_IDS:
            checks.check(entry.get("category") == "welt",
                         "World planning page belongs in world buildings", id=entry_id)
            checks.check(bool(entry.get("composed_of")),
                         "Modular world page must reference its reusable component family", id=entry_id)
            for field in ("entrances", "modules", "rules", "open_points", "related_entries"):
                checks.check(bool(plan.get(field)), "World documentation section is empty",
                             id=entry_id, field=field)
            checks.check(bool(entry.get("world_sections")),
                         "World reference has no documented functional areas", id=entry_id)
            checks.check(entry.get("status") == "GEPLANT",
                         "Future world structure must stay explicitly planned", id=entry_id)
            checks.check(entry.get("design_chain") == WORLD_DESIGN_CHAIN,
                         "Modular world design chain is incomplete or reordered", id=entry_id)
        if entry_id == "world_adminbase_central_01":
            checks.check(plan.get("designation") == "VERBINDLICHE LEITREFERENZ",
                         "Adminbasis must remain the binding lead reference")
            checks.check(entry.get("art_status") == "ENTWURF",
                         "Reference approval does not make a final game asset")
            checks.check(set(ADMINBASE_REFERENCE_IMAGES).issubset({p.get("image") for p in gallery}),
                         "Both original Adminbasis references must remain in the gallery")
            checks.check(any("spawn" in section.get("name", "").lower()
                             and "safezone" in section.get("name", "").lower()
                             for section in entry.get("world_sections", [])),
                         "Adminbasis needs a documented Spawn-/Safezone functional area")
        if entry_id == "world_city_structure_01":
            checks.check(bool(plan.get("building_types")),
                         "Modular city plan has no building type overview")
            type_refs = {row.get("entry_ref") for row in plan.get("building_types", [])}
            expected_types = WORLD_REFERENCE_IDS - {"world_city_structure_01"}
            checks.check(expected_types.issubset(type_refs),
                         "City planning overview must link all prepared building types",
                         missing=sorted(expected_types - type_refs))
    return counts


def validate(project, ref):
    checks = Checks()
    historical = subprocess.run(["git", "show", f"{ref}:wiki.html"], cwd=project,
                                check=True, capture_output=True).stdout.decode("utf-8-sig")
    old = Document(historical).root
    current = Document(read_text(project / "wiki.html")).root
    data = json.loads(read_text(project / "assets/data/wiki-entries.json"))
    entries, meta = data["entries"], data["meta"]
    originals = original_cards(old)
    checks.check(len(originals) == 112, "Historical source must contain 112 original cards",
                 actual=len(originals), ref=ref)
    checks.check(len(entries) >= 124, "Preserve 112 original cards and 12 existing additions",
                 actual=len(entries))
    for field in ("id", "visual_id", "name"):
        counts = Counter(entry.get(field) for entry in entries)
        checks.check(all(isinstance(value, str) and value.strip() for value in counts),
                     "Missing identifier or name", field=field)
        checks.check(all(count == 1 for count in counts.values()),
                     "Duplicate identifier or name", field=field,
                     duplicates=[value for value, count in counts.items() if count > 1])
    names = {entry["name"]: entry for entry in entries}
    original_names = {entry["name"] for entry in originals}
    for original in originals:
        entry = names.get(original["name"])
        checks.check(entry is not None, "Original card is missing", name=original["name"])
        if entry is not None:
            for field in ("name", "description", "stats_title", "stats", "tags", "image"):
                if field == "image" and entry["id"] in MASTER_KIT_IMAGE_UPDATES and entry.get("image"):
                    checks.check(entry.get("previous_image") == original[field]
                                 and entry["image"] == MASTER_KIT_IMAGE_UPDATES[entry["id"]],
                                 "Only the documented kit image replacement is allowed",
                                 id=entry["id"])
                    if original[field]:
                        checks.check((project / original[field]).is_file(),
                                     "Original image file must remain after kit replacement",
                                     id=entry["id"], image=original[field])
                    continue
                if field == "tags" and entry["id"] in MASTER_KIT_SERIES_TAG_UPDATES:
                    checks.check(normalize(entry.get(field)) == normalize(original[field] + ["Master Kit V1"]),
                                 "Kit series tag must extend the unchanged original tags",
                                 id=entry["id"])
                    continue
                checks.check(normalize(entry.get(field)) == normalize(original[field]),
                             "Original card content changed", name=original["name"], field=field,
                             expected=original[field], actual=entry.get(field))
    additions = [entry for entry in entries if entry["name"] not in original_names]
    checks.check(EXPECTED_ADDITIONS.issubset({entry["id"] for entry in additions}),
                 "The 12 useful local additions must remain", actual=[e["id"] for e in additions])
    checks.check(set(meta.get("equipment_slots", [])) == SLOTS,
                 "Metadata must document the eight character equipment slots")
    visual_ids = {entry["visual_id"] for entry in entries}
    categories, subcategories = meta["categories"], meta["subcategories"]
    grid_count = 0
    for entry in entries:
        name = entry["id"]
        art = entry.get("art", {})
        checks.check("slot" in entry and (entry["slot"] is None or entry["slot"] in SLOTS),
                     "Invalid character slot; item roles are not equipment slots", id=name,
                     slot=entry.get("slot"))
        checks.check("slot" in art and art["slot"] == entry.get("slot"),
                     "Art slot differs from character slot", id=name)
        checks.check(art.get("visual_id") == entry["visual_id"], "Art visual_id differs", id=name)
        checks.check(entry["category"] in categories, "Unknown category", id=name)
        checks.check(entry["subcategory"] in subcategories, "Unknown subcategory", id=name)
        checks.check(entry.get("status") in meta.get("item_statuses", []),
                     "Undocumented item status", id=name, status=entry.get("status"))
        checks.check(entry.get("image_status") in meta.get("image_statuses", []),
                     "Undocumented image status", id=name, status=entry.get("image_status"))
        if entry in additions:
            checks.check(str(entry.get("status", "")).upper() in {"GEPLANT", "KONZEPT"}
                         or (entry.get("status") == "IM SPIEL" and has_implementation_evidence(entry)),
                         "An implemented addition needs evidence; otherwise it remains planned", id=name)
        for reference in entry.get("composed_of", []):
            checks.check(reference in visual_ids and reference != entry["visual_id"],
                         "Invalid composed_of visual reference", id=name, reference=reference)
        grid = entry.get("grid")
        if entry.get("module_type") or entry["category"] in {"bausystem"}:
            checks.check(isinstance(grid, dict), "Build object has no grid specification", id=name)
        if grid is not None:
            grid_count += 1
            checks.check(isinstance(grid, dict), "Grid must be an object", id=name)
            if isinstance(grid, dict):
                checks.check(entry.get("rotation_step_deg") == 90 and grid.get("rotation_step_deg") == 90,
                             "Build objects must rotate in 90-degree steps", id=name)
                checks.check(grid.get("snap") is True, "Build grid snapping missing", id=name)
                # A complete world building is assembled FROM reusable modules;
                # it is not itself a player-base module.
                uses = {"weltgebaeude"} if entry["category"] == "welt" else {"spielerbasis", "weltgebaeude"}
                checks.check(set(grid.get("usable_for", [])) == uses,
                             "Grid use must match a reusable module or complete world building", id=name)
                dimensions_open = (normalize(grid.get("dimensions")) == "OFFEN"
                                   and normalize(grid.get("cell_size")) == "OFFEN")
                checks.check(dimensions_open or has_implementation_evidence(entry),
                             "Build dimensions require implementation evidence or explicit OFFEN", id=name)
        # Ausdauer is stamina, and cannot establish an item's durability.
        labels = {normalize(row["label"]) for row in entry.get("stats", [])}
        if "Ausdauer" in labels and "Haltbarkeit" not in labels:
            checks.check(not entry.get("durability"), "Stamina was copied into durability", id=name)
    filter_count = 0
    for category in categories:
        checks.check(any(entry["category"] == category for entry in entries),
                     "Empty main category", category=category)
        checks.check(category in meta["filters"], "Main category has no filter definition", category=category)
    for category, filters in meta["filters"].items():
        counts = Counter(item["id"] for item in filters)
        checks.check(all(n == 1 for n in counts.values()), "Duplicate subcategory filters", category=category)
        for item in filters:
            filter_count += 1
            matches = [entry for entry in entries
                       if (category == "all" or entry["category"] == category)
                       and (item["id"] == "all" or entry["subcategory"] == item["id"])]
            checks.check(bool(matches), "Empty visible filter", category=category, filter=item["id"])
    for entry in entries:
        checks.check(any(item["id"] == entry["subcategory"]
                         for item in meta["filters"].get(entry["category"], [])),
                     "Entry subcategory has no selectable filter", id=entry["id"])
    guides = old.find(node_id="baumenue")
    local_guides = current.find(node_id="baumenue")
    checks.check(len(guides) == 1 and len(local_guides) == 1, "Build guide is missing or duplicated")
    guide_count = 0
    if guides and local_guides:
        visible_text = normalize(local_guides[0].text())
        for node in guides[0].walk():
            if (node.tag in {"h2", "h3", "h4", "h5", "h6", "p", "li", "th", "td"}
                    or "baumenue-subheading" in node.attrs.get("class", "").split()):
                text = normalize(node.text())
                if text:
                    guide_count += 1
                    checks.check(text in visible_text, "Original build-guide text is missing",
                                 tag=node.tag, text=text)
    check_generated_data(project, data, checks)
    check_art_direction(meta, entries, checks)
    world_references = check_world_references(project, entries, checks)
    resources = check_paths(project, current, entries, checks)
    return {
        "passed": not checks.errors, "reference": ref, "checks": checks.count,
        "original_cards": len(originals), "entries": len(entries), "additions": len(additions),
        "original_images": sum(bool(item["image"]) for item in originals),
        "original_stat_rows": sum(len(item["stats"]) for item in originals),
        "original_tags": sum(len(item["tags"]) for item in originals),
        "guide_fragments": guide_count, "filters": filter_count, "build_grids": grid_count,
        "shared_art_references": sum(entry.get("art", {}).get("style_reference") == ART_DIRECTION_ID
                                     for entry in entries),
        "world_building_pages": sum(entry["category"] == "welt" for entry in entries),
        "local_resources": resources, **world_references, "errors": checks.errors,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--ref", default=DEFAULT_REF, help="Historical git reference (no checkout)")
    parser.add_argument("--project", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--report", type=Path, help="Optional JSON result outside source files")
    args = parser.parse_args()
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    try:
        report = validate(args.project.resolve(), args.ref)
    except (OSError, ValueError, KeyError, TypeError, subprocess.CalledProcessError) as error:
        report = {"passed": False, "errors": [{"message": "Validator could not finish", "error": str(error)}]}
    result = json.dumps(report, ensure_ascii=False, indent=2)
    print(result)
    if args.report:
        args.report.write_text(result + "\n", encoding="utf-8")
    return 0 if report["passed"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
