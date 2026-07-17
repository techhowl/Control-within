/**
 * Server-only Zoho CRM client (India data center).
 *
 * Mirrors src/lib/supabase.js: lazy, module-cached, and throws a clear error
 * if the OAuth env vars are missing rather than failing cryptically. MUST stay
 * server-side (route handlers only) — it holds the client secret + refresh
 * token and mints access tokens.
 *
 * Env (.env.local):
 *   ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN   (required)
 *   ZOHO_API_DOMAIN        default https://www.zohoapis.in    (record APIs)
 *   ZOHO_ACCOUNTS_DOMAIN   default https://accounts.zoho.in   (OAuth token)
 */

const DEFAULT_API_DOMAIN = "https://www.zohoapis.in";
const DEFAULT_ACCOUNTS_DOMAIN = "https://accounts.zoho.in";

// Access tokens live ~1h; cache and refresh a bit early.


//https://flow.zoho.in/60076591239/flow/webhook/incoming?zapikey=1001.0ef15f8b19827c4271bc636fed1a3669.ef50942f5ece78ec26ce0396acb8355a&isdebug=false

/*{
  "fieldName": "AppointmentStatus",
  "Mobile": "{{1}}"
} */
const TOKEN_TTL_BUFFER_MS = 5 * 60 * 1000;

let tokenCache = null; // { token: string, expiresAt: number }

function apiDomain() {
  return (process.env.ZOHO_API_DOMAIN || DEFAULT_API_DOMAIN).replace(/\/$/, "");
}

function accountsDomain() {
  return (process.env.ZOHO_ACCOUNTS_DOMAIN || DEFAULT_ACCOUNTS_DOMAIN).replace(/\/$/, "");
}

function requireCreds() {
  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "Zoho is not configured. Set ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET and " +
      "ZOHO_REFRESH_TOKEN in .env.local (see .env.example)."
    );
  }
  return { clientId, clientSecret, refreshToken };
}

/**
 * Return a valid access token, refreshing (and caching) when needed.
 * @param {boolean} force  skip the cache and mint a fresh token
 */
export async function getZohoAccessToken(force = false) {
  if (!force && tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  const { clientId, clientSecret, refreshToken } = requireCreds();
  const params = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "refresh_token",
  });

  const res = await fetch(`${accountsDomain()}/oauth/v2/token?${params}`, {
    method: "POST",
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data.access_token) {
    throw new Error(
      `Zoho token refresh failed (${res.status}): ${JSON.stringify(data)}`
    );
  }

  const ttlMs = (Number(data.expires_in) || 3600) * 1000;
  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + Math.max(ttlMs - TOKEN_TTL_BUFFER_MS, 0),
  };
  return tokenCache.token;
}

/**
 * Insert a single record into a Zoho CRM module.
 * @param {string} moduleApiName  e.g. "Doctor_Locators"
 * @param {object} fields         { Field_API_Name: value, ... } (skip null/undefined)
 * @returns {Promise<string>} the created record id
 */
export async function createZohoRecord(moduleApiName, fields) {
  if (!moduleApiName) {
    throw new Error("createZohoRecord: moduleApiName is required (set ZOHO_LOCATOR_MODULE).");
  }

  const clean = Object.fromEntries(
    Object.entries(fields).filter(([, v]) => v !== null && v !== undefined && v !== "")
  );
  const url = `${apiDomain()}/crm/v8/${moduleApiName}`;

  const post = (token) =>
    fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: [clean] }),
    });

  let res = await post(await getZohoAccessToken());
  // A stale token surfaces as 401; refresh once and retry.
  if (res.status === 401) {
    res = await post(await getZohoAccessToken(true));
  }

  const data = await res.json().catch(() => ({}));
  const row = data?.data?.[0];
  if (!res.ok || row?.code !== "SUCCESS") {
    throw new Error(
      `Zoho insert into ${moduleApiName} failed (${res.status}): ${JSON.stringify(data)}`
    );
  }
  return row.details?.id;
}

/**
 * Update a single existing record in a Zoho CRM module.
 * @param {string} moduleApiName  e.g. "Leads"
 * @param {string} recordId       the Zoho record id to patch
 * @param {object} fields         { Field_API_Name: value, ... } (skip null/empty)
 * @returns {Promise<string>} the updated record id
 */
export async function updateZohoRecord(moduleApiName, recordId, fields) {
  if (!moduleApiName) {
    throw new Error("updateZohoRecord: moduleApiName is required.");
  }
  if (!recordId) {
    throw new Error("updateZohoRecord: recordId is required.");
  }

  const clean = Object.fromEntries(
    Object.entries(fields).filter(([, v]) => v !== null && v !== undefined && v !== "")
  );
  const url = `${apiDomain()}/crm/v8/${moduleApiName}/${recordId}`;

  const put = (token) =>
    fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: [clean] }),
    });

  let res = await put(await getZohoAccessToken());
  if (res.status === 401) {
    res = await put(await getZohoAccessToken(true));
  }

  const data = await res.json().catch(() => ({}));
  const row = data?.data?.[0];
  if (!res.ok || row?.code !== "SUCCESS") {
    throw new Error(
      `Zoho update of ${moduleApiName}/${recordId} failed (${res.status}): ${JSON.stringify(data)}`
    );
  }
  return row.details?.id;
}
