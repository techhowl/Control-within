/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dev-only: let a tunnel host (cloudflared/ngrok/localtunnel) load the dev
  // server's client assets. Without this, Next blocks cross-origin dev requests,
  // so the page renders but client JS never hydrates and the locator modal
  // won't open.
  allowedDevOrigins: ["*.trycloudflare.com", "*.ngrok-free.app", "*.loca.lt"],
};

export default nextConfig;
