/**
 * Interakt WhatsApp sender. Server-only.
 *
 * Interakt's public messaging API sends WhatsApp messages on behalf of the
 * business number configured in the Interakt dashboard. Business-INITIATED
 * conversations (which this is — we message a doctor out of the blue) can only
 * use a pre-APPROVED WhatsApp template, so this sends a Template message and
 * passes the appointment details as ordered `bodyValues` that fill the
 * template's {{1}}, {{2}}, … placeholders.
 *
 * Env:
 *   INTERAKT_API_KEY          Basic-auth key from Interakt → Settings → API keys
 *                             (already base64; used verbatim as `Basic <key>`).
 *   INTERAKT_DOCTOR_TEMPLATE  Approved template name (default below).
 *   INTERAKT_TEMPLATE_LANG    Template language code (default "en").
 *
 * Docs: https://www.interakt.shop/resource-center/send-whatsapp-messages-using-api/
 */

const INTERAKT_URL = "https://api.interakt.ai/v1/public/message/";

/**
 * Reduce any Indian phone string to Interakt's expected shape: a bare local
 * number (no +, no country code, no punctuation) plus a "+91" country code.
 * Handles "919876543210", "+91 98765-43210", "09876543210", "9876543210".
 */
export function toIndianNumber(raw) {
  let digits = String(raw ?? "").replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length > 10) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = digits.replace(/^0+/, "");
  return { countryCode: "+91", phoneNumber: digits };
}

/**
 * Send a WhatsApp template message via Interakt.
 *
 * @param {object}   opts
 * @param {string}   opts.phone         destination local number (any format)
 * @param {string[]} opts.bodyValues    ordered values for the template body
 * @param {string}   [opts.templateName]
 * @param {string}   [opts.languageCode]
 * @returns {Promise<object>} Interakt's parsed JSON response
 * @throws  {Error} on missing config or non-2xx response
 */
export async function sendInteraktTemplate({
  phone,
  bodyValues,
  templateName = process.env.INTERAKT_DOCTOR_TEMPLATE || "appointment_notification",
  languageCode = process.env.INTERAKT_TEMPLATE_LANG || "en",
}) {
  const apiKey = process.env.INTERAKT_API_KEY;
  if (!apiKey) throw new Error("interakt_not_configured");

  const { countryCode, phoneNumber } = toIndianNumber(phone);
  if (!phoneNumber || phoneNumber.length < 10) {
    throw new Error("invalid_phone");
  }

  const payload = {
    countryCode,
    phoneNumber,
    type: "Template",
    template: {
      name: templateName,
      languageCode,
      bodyValues,
    },
  };

  const res = await fetch(INTERAKT_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.result === false) {
    throw new Error(
      `interakt_send_failed: ${res.status} ${JSON.stringify(data)}`
    );
  }
  return data;
}
