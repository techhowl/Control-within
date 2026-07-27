// Builds src/data/pincodes.json — the pincode → coordinates table that powers
// the radius fallback in src/lib/doctors.js (findWithinRadius).
//
// Why a table at all: /api/nearest-doctor is called by Interakt and receives a
// City/Pincode *string*, never coordinates. Measuring a real distance needs the
// requester's position, so the pincode has to be resolved to a lat/lng. Doing
// that with a live geocoder would put a third-party HTTP call inside a webhook
// that must answer in about a second, so it is resolved here instead, once.
//
// Only pincodes within PREBUILD_KM of a doctor are kept. All 19,238 Indian
// pincodes would be ~450 KB of which we can never use more than a few percent —
// somewhere in Kerala is not a near miss for a Delhi clinic, it is a 404 either
// way. The ceiling is deliberately much wider than the runtime radius so
// NEAREST_DOCTOR_RADIUS_KM can be retuned in .env without a rebuild.
//
// Usage:
//   curl -O https://download.geonames.org/export/zip/IN.zip
//   unzip IN.zip IN.txt
//   node scripts/build-pincodes.mjs IN.txt
//
// Source: GeoNames postal-code export (CC BY 4.0), tab-separated:
//   country, postcode, place, admin1, admin1code, admin2, admin2code,
//   admin3, admin3code, latitude, longitude, accuracy
//
// Re-run this whenever src/data/doctors.json changes — the kept set is defined
// relative to where the doctors are, so a new city means new pincodes.

import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import doctors from "../src/data/doctors.json" with { type: "json" };

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(ROOT, "src/data/pincodes.json");

// Keep this well above any radius we would plausibly run, so retuning the
// runtime value is an .env change rather than a data rebuild.
const PREBUILD_KM = 75;

const src = process.argv[2];
if (!src) {
  console.error(
    "Usage: node scripts/build-pincodes.mjs <path to GeoNames IN.txt>\n" +
      "  curl -O https://download.geonames.org/export/zip/IN.zip && unzip IN.zip IN.txt"
  );
  process.exit(1);
}

const R_KM = 6371;
const toRad = (deg) => (deg * Math.PI) / 180;
const haversineKm = (lat1, lng1, lat2, lng2) => {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R_KM * 2 * Math.asin(Math.sqrt(a));
};

// A pincode covers many post offices spread over a few km. Average them: the
// centroid is a better stand-in for "somebody in this pincode" than whichever
// branch happened to be listed first.
const groups = new Map();
const text = await readFile(resolve(process.cwd(), src), "utf8");
let rows = 0;

for (const line of text.split("\n")) {
  const f = line.split("\t");
  if (f.length < 11) continue;
  const pin = f[1];
  const lat = Number.parseFloat(f[9]);
  const lng = Number.parseFloat(f[10]);
  if (!/^\d{6}$/.test(pin) || !Number.isFinite(lat) || !Number.isFinite(lng)) continue;
  rows++;
  const g = groups.get(pin);
  if (g) {
    g.lat += lat;
    g.lng += lng;
    g.n++;
  } else {
    groups.set(pin, { lat, lng, n: 1 });
  }
}

if (!groups.size) {
  throw new Error(`No pincodes parsed from ${src}. Is it the GeoNames IN.txt export?`);
}

const geocoded = doctors.filter((d) => Number.isFinite(d.lat) && Number.isFinite(d.lng));
if (!geocoded.length) throw new Error("No doctors carry coordinates — nothing to measure against.");

// 4 decimal places is ~11 m, far finer than a pincode centroid deserves, and
// halves the file next to raw floats.
const round4 = (n) => Math.round(n * 1e4) / 1e4;

const out = {};
let nearest = Infinity;
for (const [pin, g] of groups) {
  const lat = g.lat / g.n;
  const lng = g.lng / g.n;
  let best = Infinity;
  for (const d of geocoded) {
    const km = haversineKm(lat, lng, d.lat, d.lng);
    if (km < best) best = km;
  }
  if (best <= PREBUILD_KM) {
    out[pin] = [round4(lat), round4(lng)];
    if (best < nearest) nearest = best;
  }
}

// Sorted keys so the committed file diffs cleanly between rebuilds.
const sorted = {};
for (const k of Object.keys(out).sort()) sorted[k] = out[k];

await writeFile(OUT, JSON.stringify(sorted) + "\n", "utf8");

console.log(`Read ${rows} post offices → ${groups.size} distinct pincodes`);
console.log(`Kept ${Object.keys(sorted).length} within ${PREBUILD_KM} km of ${geocoded.length} doctors`);
console.log(`Wrote ${OUT}`);
