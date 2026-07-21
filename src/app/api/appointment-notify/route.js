import { randomBytes } from "crypto";
import { findByName } from "@/lib/doctors";
import { sendInteraktTemplate } from "@/lib/interakt";
import { searchZohoRecords, updateZohoRecord } from "@/lib/zoho";

/**
 * Generate a short, human-readable, collision-resistant appointment ID, e.g.
 * "APT-7K3M9Q2X". 8 chars from a 32-symbol alphabet (Crockford-ish: no I/L/O/U
 * to avoid misreads) ≈ 40 bits of entropy — plenty for this volume. Uses the
 * crypto RNG (not Math.random) so two concurrent requests can't collide.
 */
function makeAppointmentId() {
  const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const bytes = randomBytes(8);
  let out = "";
  for (let i = 0; i < 8; i++) out += ALPHABET[bytes[i] % ALPHABET.length];
  return `APT-${out}`;
}

/**
 * POST /api/appointment-notify
 *
 * A user has "booked" an appointment with a doctor. This endpoint:
 *   1. looks up the doctor's phone number from the doctor's name (+ city hint),
 *   2. frames a WhatsApp message carrying the user's details, and
 *   3. sends it to the doctor via the Interakt WhatsApp API (from the business
 *      number configured by INTERAKT_API_KEY in .env).
 *
 * Body:
 *   {
 *     "name":     "Ravi Kumar",        // user's full name        (required)
 *     "age":      34,                  // user's age              (required)
 *     "city":     "Delhi",             // user's city             (required)
 *     "pincode":  "110009",            // user's pincode          (required)
 *     "mobile":   "9876543210",        // user's mobile number    (required)
 *     "gender":   "Male",              // user's gender           (required)
 *     "drName":   "Dr. Madhu Tyagi",   // doctor to notify        (required)
 *     "drAddress":"..."                // doctor address (optional context)
 *   }
 *
 * Returns (200): { success, doctor_name, doctor_phone, message, interakt }
 * Returns (400): { success:false, error, message }  — bad input / doctor no phone
 * Returns (404): { success:false, error, message }  — doctor not found
 * Returns (502): { success:false, error, message }  — Interakt send failed
 */

// CORS — mirrors /api/nearest-doctor so Interakt/Postman/any origin can call.
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

const json = (obj, status = 200) =>
  Response.json(obj, { status, headers: CORS_HEADERS });

/** Trim to string, dropping empties and unresolved Interakt {{n}} placeholders. */
const clean = (v) => {
  const s = (v ?? "").toString().trim();
  return !s || s.includes("{{") ? "" : s;
};

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json(
      { success: false, error: "invalid_json", message: "Body must be valid JSON." },
      400
    );
  }

  // Accept both camelCase and Title-case keys (Interakt workflow variables tend
  // to be Title-case), so the same endpoint works from code and from Interakt.
  const name = clean(body?.name ?? body?.Name);
  const age = clean(body?.age ?? body?.Age);
  const city = clean(body?.city ?? body?.City);
  const pincode = clean(body?.pincode ?? body?.Pincode);
  const mobile = clean(body?.mobile ?? body?.Mobile ?? body?.mobileNumber);
  const gender = clean(body?.gender ?? body?.Gender);
  const drName = clean(body?.drName ?? body?.DrName ?? body?.doctor_name);

  // --- validate required fields --------------------------------------------
  const missing = Object.entries({ name, age, city, pincode, mobile, gender, drName })
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length) {
    return json(
      {
        success: false,
        error: "missing_fields",
        message: `Missing required field(s): ${missing.join(", ")}.`,
      },
      400
    );
  }

  // --- 1. find the doctor's number by name ---------------------------------
  const doctor = findByName(drName, city);
  if (!doctor) {
    return json(
      {
        success: false,
        error: "doctor_not_found",
        message: `No doctor matched "${drName}"${city ? ` in ${city}` : ""}.`,
      },
      404
    );
  }
  if (!doctor.phone) {
    return json(
      {
        success: false,
        error: "doctor_no_phone",
        message: `"${doctor.name}" has no phone number on file, cannot notify.`,
      },
      400
    );
  }

  // --- 2. frame the message ------------------------------------------------
  // Unique appointment ID, generated per request. Leads the message so the
  // doctor (and any reply) can reference it.
  const appointmentId = makeAppointmentId();

  // Human-readable version (returned for logging / non-template fallback). Kept
  // aligned with the approved Interakt template's layout for easy diffing.
  const message =
    `Hello Doctor, you have a new appointment request from a patient via Control Within.\n\n` +
    `Patient details:\n` +
    `Appointment ID: ${appointmentId}\n` +
    `Name: ${name},\n` +
    `Gender: ${gender},\n` +
    `Age: ${age}\n` +
    `Contact: ${mobile}\n` +
    `City & Pincode: ${city} - ${pincode}\n\n` +
    `Please review the details above and confirm the appointment at your earliest convenience. Thank you.`;

  // Template {{1}}..{{6}} — order MUST match the approved "patient_appointment"
  // template exactly. City & Pincode are a single combined variable ({{6}}):
  //   {{1}} Appointment ID, {{2}} Name, {{3}} Gender, {{4}} Age,
  //   {{5}} Contact, {{6}} City - Pincode
  const bodyValues = [
    appointmentId,           // {{1}}
    name,                    // {{2}}
    gender,                  // {{3}}
    age,                     // {{4}}
    mobile,                  // {{5}}
    `${city} - ${pincode}`,  // {{6}}
  ];

  // --- 3. Zoho: find the Lead by mobile, stamp the AppointmentId -----------
  // Runs before the WhatsApp send. Best-effort: a Zoho miss (lead not found,
  // CRM outage, field mismatch) must NOT block notifying the doctor — the
  // outcome is reported back in the response under `zoho`.
  const leadsModule = process.env.ZOHO_LEADS_MODULE || "Leads";
  const apptField = process.env.ZOHO_APPOINTMENT_FIELD || "AppointmentId";
  const zoho = { lead_found: false, updated: false, lead_id: null, error: null };
  try {
    // Match on either the Phone or the Mobile field. Search on the local digits
    // (Zoho stores numbers without country code in most Indian orgs).
    const q = mobile.replace(/\D/g, "");
    const local = q.length > 10 && q.startsWith("91") ? q.slice(2) : q;
    const criteria = `((Phone:equals:${local})or(Mobile:equals:${local}))`;
    const lead = await searchZohoRecords(leadsModule, criteria, `id,${apptField}`);
    if (lead?.id) {
      zoho.lead_found = true;
      zoho.lead_id = lead.id;
      await updateZohoRecord(leadsModule, lead.id, { [apptField]: appointmentId });
      zoho.updated = true;
    }
  } catch (err) {
    zoho.error = err.message;
    console.error("appointment_zoho_update_failed:", err.message);
  }

  // --- 4. send via Interakt ------------------------------------------------
  let interakt;
  try {
    interakt = await sendInteraktTemplate({ phone: doctor.phone, bodyValues });
  } catch (err) {
    const configErr = err.message === "interakt_not_configured";
    return json(
      {
        success: false,
        error: configErr ? "interakt_not_configured" : "send_failed",
        message: configErr
          ? "Set INTERAKT_API_KEY in .env to enable sending."
          : `Failed to send WhatsApp message: ${err.message}`,
        appointment_id: appointmentId,
        doctor_name: doctor.name,
        doctor_phone: doctor.phone,
        framed_message: message,
        zoho,
      },
      configErr ? 500 : 502
    );
  }

  return json({
    success: true,
    appointment_id: appointmentId,
    doctor_name: doctor.name,
    doctor_phone: doctor.phone,
    doctor_city: doctor.city,
    zoho,
    message,
    interakt,
  });
}
