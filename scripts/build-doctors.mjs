// Parses docs/Doctors_Geocoded.md → src/data/doctors.json (committed).
//
// The API route imports the JSON directly; the markdown is never parsed at
// runtime. Re-run this whenever the doctor list changes:
//
//   node scripts/build-doctors.mjs
//
// It reads the "Detailed Doctor Profiles" section (the summary table lacks
// Phone/Address). Each doctor is a `### N. <name>` heading followed by a
// | **Field** | Value | table. Fails loudly if the count isn't 177.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = resolve(ROOT, "docs/Doctors_Geocoded.md");
const OUT = resolve(ROOT, "src/data/doctors.json");
const EXPECTED = 177;

const HEADING = /^###\s+\d+\.\s*(.+?)\s*$/; // "### 1. Dr. Sheetal Jindal"
const ROW = /^\|\s*\*\*(.+?)\*\*\s*\|\s*(.*?)\s*\|\s*$/; // "| **SDPID** | 8220 |"

// A markdown value that means "absent".
const isBlank = (v) => v == null || v === "" || v.toLowerCase() === "none";

function num(value) {
  // Latitude/Longitude are wrapped in backticks, e.g. `30.743665`.
  const n = parseFloat(String(value).replace(/`/g, "").trim());
  return Number.isFinite(n) ? n : null;
}

function finalize(name, fields) {
  return {
    sdpid: isBlank(fields.SDPID) ? null : String(fields.SDPID).trim(),
    name: name.trim(),
    city: isBlank(fields.City) ? null : fields.City,
    state: isBlank(fields.State) ? null : fields.State,
    pincode: isBlank(fields.Pincode) ? null : String(fields.Pincode).trim(),
    // Many phones are the placeholder "0"; keep real numbers as strings so
    // leading zeros (landlines) survive.
    phone: isBlank(fields.Phone) || fields.Phone === "0" ? null : String(fields.Phone).trim(),
    address: isBlank(fields.Address) ? null : fields.Address,
    lat: num(fields.Latitude),
    lng: num(fields.Longitude),
  };
}

const md = await readFile(SRC, "utf8");
const lines = md.split(/\r?\n/);

const doctors = [];
let name = null;
let fields = null;

const flush = () => {
  if (name == null) return;
  const rec = finalize(name, fields);
  if (rec.lat == null || rec.lng == null) {
    console.warn(`Skipping "${rec.name}" — missing/invalid coordinates.`);
  } else {
    doctors.push(rec);
  }
  name = null;
  fields = null;
};

for (const line of lines) {
  const h = line.match(HEADING);
  if (h) {
    flush(); // close the previous block
    name = h[1];
    fields = {};
    continue;
  }
  if (name == null) continue; // still in the summary table / preamble
  if (/^##\s/.test(line)) {
    flush(); // a non-doctor "## ..." heading ends the profiles section
    continue;
  }
  const r = line.match(ROW);
  if (r) fields[r[1].trim()] = r[2].trim();
}
flush(); // last block

if (doctors.length !== EXPECTED) {
  throw new Error(
    `Parsed ${doctors.length} doctors but expected ${EXPECTED}. ` +
      `Check the markdown format in ${SRC}.`
  );
}

await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify(doctors, null, 2) + "\n", "utf8");
console.log(`Wrote ${doctors.length} doctors → ${OUT}`);
