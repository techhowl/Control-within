// Reproduces a real /api/appointment-notify call end-to-end, so an Interakt
// failure can be diagnosed without guessing.
//
//   node scripts/interakt-probe.mjs                      # dry run, sends nothing
//   node scripts/interakt-probe.mjs --send               # real call, real WhatsApp
//   node scripts/interakt-probe.mjs --send --url https://<deployed-host>
//
// It POSTs to the running app rather than re-implementing the payload, so it
// always exercises the real route and can never drift from it. That means the
// app must be running (`npm run dev`) or --url must point at a deployment.
//
// --send delivers an actual WhatsApp message to the resolved doctor's number.
// Point --dr at a doctor you control before using it.

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};

const BASE = flag("url", "http://localhost:3000").replace(/\/$/, "");
const SEND = args.includes("--send");

// Defaults describe a patient booking with the Mumbai test doctor.
const body = {
  name: flag("name", "Ravi Kumar"),
  age: flag("age", "34"),
  city: flag("city", "Mumbai"),
  pincode: flag("pincode", "400703"),
  mobile: flag("mobile", "9876543210"),
  drName: flag("dr", "Chetan Marathe"),
  drAddress: flag("drAddress", "Howl digital, Sahar road "),
};

const endpoint = `${BASE}/api/appointment-notify`;
console.log(`POST ${endpoint}`);
console.log(JSON.stringify(body, null, 2));

if (!SEND) {
  console.log("\nDry run — nothing sent. Re-run with --send to make the real call.");
  process.exit(0);
}

// Interakt's own failure codes, so a 502 reads as an instruction rather than
// an opaque blob. Codes come from the WhatsApp Cloud API that Interakt fronts.
const HINTS = {
  132000:
    "Variable count mismatch. The approved template expects a different number\n" +
    "  of {{n}} values than the route sent. Edit the template's body in the\n" +
    "  Interakt dashboard so its variable count matches `interakt_sent`.",
  132001:
    "Template not found. INTERAKT_DOCTOR_TEMPLATE / INTERAKT_TEMPLATE_LANG do not\n" +
    "  match an approved template. Check the exact name and language code.",
  132005: "Template text was edited but not re-approved, or a value is too long.",
  131026: "The destination number cannot receive WhatsApp messages.",
  470: "Outside the 24-hour window — expected here; this is why we send a template.",
};

let res;
try {
  res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
} catch (err) {
  console.error(`\nCould not reach ${endpoint}: ${err.message}`);
  console.error("Start the app with `npm run dev`, or pass --url <deployed host>.");
  process.exit(1);
}

const data = await res.json().catch(() => ({}));
console.log(`\nHTTP ${res.status}`);
console.log(JSON.stringify(data, null, 2));

if (data?.success) {
  console.log(`\nSent. Appointment ${data.appointment_id} -> ${data.doctor_name} (${data.doctor_phone}).`);
  process.exit(0);
}

// Pull the code out of whichever shape Interakt used.
const errors = data?.interakt_error?.errors ?? [];
for (const e of errors) {
  const hint = HINTS[e.code];
  console.log(`\nInterakt ${e.code}: ${e.title ?? ""}`);
  if (e.details) console.log(`  ${e.details}`);
  if (hint) console.log(`  -> ${hint}`);
}
if (data?.interakt_sent) {
  const s = data.interakt_sent;
  console.log(`\nWe sent template "${s.templateName}" (${s.languageCode}) with ${s.bodyValueCount} variables.`);
}
process.exit(1);
