// Server-only route that returns the latest Instagram posts.
// The access token stays on the server and is never exposed to the browser.
//
// Required env vars (set in .env.local):
//   IG_ACCESS_TOKEN  - long-lived Instagram Graph API token
//   IG_USER_ID       - your Instagram user id (optional; defaults to "me")
//
// If the token is missing or the request fails, this returns an empty list
// and the Socials carousel quietly falls back to its placeholder cards.

export const revalidate = 3600; // cache the response for 1 hour

const FIELDS =
  "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp";

export async function GET() {
  const token = process.env.IG_ACCESS_TOKEN;
  const userId = process.env.IG_USER_ID || "me";

  if (!token) {
    return Response.json({ posts: [], configured: false });
  }

  try {
    const url =
      `https://graph.instagram.com/${userId}/media` +
      `?fields=${FIELDS}&limit=9&access_token=${token}`;

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return Response.json({ posts: [], error: `instagram_${res.status}` });
    }

    const data = await res.json();
    const posts = (data.data || [])
      // Videos have no still image in media_url — use their thumbnail instead.
      .filter((m) => m.media_type !== "VIDEO" || m.thumbnail_url)
      .map((m) => ({
        id: m.id,
        img: m.media_type === "VIDEO" ? m.thumbnail_url : m.media_url,
        href: m.permalink,
        label: (m.caption || "").split("\n")[0].slice(0, 80),
      }));

    return Response.json({ posts, configured: true });
  } catch {
    return Response.json({ posts: [], error: "fetch_failed" });
  }
}
