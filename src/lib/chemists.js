import data from "@/data/chemists_agra.json";
import { haversineKm } from "@/lib/doctors";

/**
 * Nearest-chemist lookup over the Agra retail-chemist list
 * (src/data/chemists_agra.json). Server-only, no dependencies. Mirrors
 * src/lib/doctors.js so the locator flow can attach a chemist to the same
 * record it already attaches a doctor to.
 *
 * DATA CAVEAT: chemist coordinates are the *centroid of the chemist's pincode
 * area* (Mappls gives pincode+eLoc but not rooftop coords; OSM resolved each
 * pincode to a centroid). So "nearest" is pincode-level, not shop-level — every
 * chemist in the same pincode sits at one point. Surface distance as
 * approximate. This dataset covers Agra only, so a visitor far from Agra will
 * still get an Agra chemist back with a large distance_km — callers that only
 * want chemist matches for Agra QR arrivals should gate on distance_km.
 */

// Only chemists that actually carry coordinates can be ranked by distance.
const LOCATABLE = (Array.isArray(data) ? data : data.chemists).filter(
  (c) => Number.isFinite(c.latitude) && Number.isFinite(c.longitude)
);

const round1 = (n) => Math.round(n * 10) / 10;

// Chemists sharing a pincode land on one centroid, so dozens sit at exactly
// 0 km apart. Within ~10 m treat them as the same spot and let completeness
// break the tie (matches the doctors.js convention).
const TIE_KM = 0.01;

// Contactability / completeness score: a fuller record (address + area +
// pincode) beats a barer one. Chemists have no phone in this dataset.
const quality = (c) =>
  (c.address ? 2 : 0) + (c.area ? 1 : 0) + (c.pincode ? 1 : 0);

/**
 * The single closest chemist to (lat, lng), with `distance_km` attached.
 * Returns null only if no chemist in the dataset has coordinates.
 *
 * When several chemists sit at effectively the same distance (the common case
 * — see DATA CAVEAT), the most complete record wins instead of whichever came
 * first in the list.
 */
export function findNearestChemist(lat, lng) {
  let best = null;
  let bestKm = Infinity;
  let bestQuality = -1;
  for (const c of LOCATABLE) {
    const km = haversineKm(lat, lng, c.latitude, c.longitude);
    if (km < bestKm - TIE_KM) {
      bestKm = km;
      bestQuality = quality(c);
      best = c;
    } else if (km <= bestKm + TIE_KM) {
      const q = quality(c);
      if (q > bestQuality) {
        bestQuality = q;
        best = c;
      }
      if (km < bestKm) bestKm = km;
    }
  }
  return best ? { ...best, distance_km: round1(bestKm) } : null;
}
