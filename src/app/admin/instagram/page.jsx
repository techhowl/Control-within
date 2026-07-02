export default function AdminInstagramAuth() {
  const authUrl = "https://www.instagram.com/oauth/authorize?force_reauth=true&client_id=966258383056515&redirect_uri=https://controlwithin.com/&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <a 
        href={authUrl} 
        className="rounded-full bg-teal-800 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
      >
        Authenticate Instagram API.
      </a>
    </div>
  );
}