import { cookies } from "next/headers";
import { JOURNEY_COOKIE, getJourney, logEvent } from "@/lib/journey";
import { findNearest, listCities } from "@/lib/doctors";
import { createZohoRecord } from "@/lib/zoho";

/**
 * GET /api/locate
 * Returns the distinct city list for the manual fallback selector (used when
 * the browser can't/won't share a location).
 * Returns: { cities: [{ city, state, lat, lng }] }
 */
export async function GET() {
  return Response.json({ cities: listCities() });
}

/**
 * POST /api/locate
 * Finds the single nearest doctor to the caller's coordinates, logs a
 * clinic_locator_click journey event, and best-effort writes an anonymous
 * record to the Zoho CRM custom module. Neither the journey log nor the Zoho
 * write is allowed to block the user's result.
 *
 * Body: { lat, lng, src?, city? }
 *   - lat/lng: numeric coordinates (from navigator.geolocation)
 *   - city:    manual fallback when geolocation is unavailable — resolves to
 *              that city's representative coordinate
 *   - src:     QR campaign tag (e.g. "qr_poster1"), stored for attribution
 * Returns: { doctor, crm_saved }
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const { src, city } = body ?? {};
  let lat = Number(body?.lat);
  let lng = Number(body?.lng);

  // Manual fallback: no coordinates but a chosen city → use its centroid.
  if ((!Number.isFinite(lat) || !Number.isFinite(lng)) && typeof city === "string") {
    const match = listCities().find((c) => c.city === city);
    if (match) {
      lat = match.lat;
      lng = match.lng;
    }
  }

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {
    return Response.json({ error: "invalid_coords" }, { status: 400 });
  }

  const doctor = findNearest(lat, lng);
  if (!doctor) {
    return Response.json({ error: "no_doctors" }, { status: 500 });
  }

  // --- Journey event (best-effort; analytics must not break the response) ---
  try {
    const journeyId = (await cookies()).get(JOURNEY_COOKIE)?.value;
    if (journeyId) {
      const journey = await getJourney(journeyId);
      if (journey && !journey.erased_at) {
        await logEvent(journeyId, "clinic_locator_click", {
          lat,
          lng,
          src: src ?? null,
          sdpid: doctor.sdpid,
          distance_km: doctor.distance_km,
        });
      }
    }
  } catch (err) {
    console.error("locate_journey_log_failed:", err.message);
  }

  // --- Zoho write (best-effort; a CRM outage still returns the doctor) ------
  let crmSaved = false;
  const now = new Date();
  // Zoho datetime fields want ISO 8601 without milliseconds (e.g.
  // 2026-07-02T09:00:00+00:00); toISOString()'s ".000Z" is rejected.
  const zohoNow = now.toISOString().replace(/\.\d{3}Z$/, "+00:00");
  // The User_Latitude/User_Longitude fields cap at 2 decimal places; browser
  // geolocation sends full precision, so round for storage (matching already
  // used full precision above).
  const round2 = (n) => Math.round(n * 100) / 100;
  // User_Address coordinate subfields cap at 9 decimal places; browser
  // geolocation can exceed that. 6 dp ≈ 0.1 m — plenty.
  const round6 = (n) => Math.round(n * 1e6) / 1e6;
  // Field API names verified against the Doctor_Locators module metadata.
  // `Name` is the mandatory primary field (its label is "Doctor_Name") and
  // holds the doctor's name. `Doctor_Address` is a read-only composite — the
  // writable part is `Doctor_Address_Street_Address`. SDPID is integer-typed.
  const record = {
    Name: doctor.name,
    Doctor_Phone: doctor.phone,
    Doctor_City: doctor.city,
    Doctor_SDPID: doctor.sdpid != null ? Number(doctor.sdpid) : null,
    User_Latitude: round2(lat),
    User_Longitude: round2(lng),
    Distance_Km: doctor.distance_km,
    Source: src ?? null,
    Captured_At: zohoNow,
    Doctor_Address_Street_Address: doctor.address,
    Doctor_Address_City: doctor.city,
    Doctor_Address_Zip_Postal_Code: doctor.pincode,
    // User_Address is a read-only composite; store the raw location in its
    // writable coordinate subfields (full precision, uncapped). The composite
    // renders these as "lat, lng".
    User_Address_Coordinates_Latitude: round6(lat),
    User_Address_Coordinates_Longitude: round6(lng),
  };
  try {
    await createZohoRecord(process.env.ZOHO_LOCATOR_MODULE, record);
    crmSaved = true;
  } catch (err) {
    // The primary `Name` field ships unique+mandatory. Two visitors matching
    // the same doctor collide. Once the uniqueness toggle is removed in Zoho,
    // this never fires; until then, retry with a timestamp suffix so a lead is
    // never lost (the clean name still leads the string).
    if (String(err.message).includes("DUPLICATE_DATA")) {
      try {
        await createZohoRecord(process.env.ZOHO_LOCATOR_MODULE, {
          ...record,
          Name: `${doctor.name} — ${zohoNow}`,
        });
        crmSaved = true;
      } catch (retryErr) {
        console.error("locate_zoho_write_failed:", retryErr.message);
      }
    } else {
      console.error("locate_zoho_write_failed:", err.message);
    }
  }

  return Response.json({ doctor, crm_saved: crmSaved });
}
