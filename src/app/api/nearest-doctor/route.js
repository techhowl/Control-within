import { findByLocation } from "@/lib/doctors";

/**
 * POST /api/nearest-doctor
 *
 * Public, stateless endpoint that returns the nearest doctor for a given
 * location string containing city and/or pincode.  Designed to be called from
 * Interakt's "Trigger a Webhook" workflow step — the response is intentionally
 * flat (no nested objects) so each key can be mapped directly to an Interakt
 * workflow variable.
 *
 * Body: { "location": "Delhi 110009" }
 *   - location: a free-text string the user typed, containing city name
 *     and/or 6-digit pincode in any order, comma/space separated.
 *     Examples: "Delhi 110009", "110009 Delhi", "Agra, 282001", "110009"
 *
 * Returns (200): { success, doctor_name, doctor_phone, doctor_city, ... }
 * Returns (400): { success: false, error, message }
 * Returns (404): { success: false, error, message }
 */

// --- CORS helper: lets Interakt (and Postman / any origin) call freely -------
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

/** Preflight handler — browsers and some HTTP clients send OPTIONS first. */
export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      {
        success: false,
        error: "invalid_json",
        message: "Request body must be valid JSON.",
      },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const location = (body?.location ?? "").toString().trim();

  if (!location) {
    return Response.json(
      {
        success: false,
        error: "missing_location",
        message:
          'Provide a "location" field with city name and/or pincode. Example: {"location": "Delhi 110009"}',
      },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const doctor = findByLocation(location);

  if (!doctor) {
    return Response.json(
      {
        success: false,
        error: "no_doctors_found",
        message: `No doctors found near "${location}". Please check the city name or pincode.`,
      },
      { status: 404, headers: CORS_HEADERS }
    );
  }

  // Flat response — every key is a top-level string/number so Interakt can map
  // each one directly to a workflow variable without dot-notation parsing.
  return Response.json(
    {
      success: true,
      doctor_name: doctor.name,
      doctor_phone: doctor.phone ?? "",
      doctor_city: doctor.city,
      doctor_state: doctor.state,
      doctor_address: doctor.address ?? "",
      doctor_pincode: doctor.pincode ?? "",
      distance_km: doctor.distance_km,
    },
    { status: 200, headers: CORS_HEADERS }
  );
}
