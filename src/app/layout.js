import "./globals.css";
import Ticker from "@/components/layout/Ticker";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/ui/BackToTop";

export const metadata = {
  title: "Control Within | Long-Term, Reversible Contraception",
  description:
    "Long-acting, reversible contraceptives — years of protection and control, doctor-guided.",
};

const TOP_TICKER = [
  "Long-term control. Simplified.",
  "Safe. Reversible. Doctor-guided.",
  "No daily pills. No daily stress.",
  "No heavy periods. No painful periods.",
  "Control that stays with you.",
  "One step. Years of protection.",
];

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NTZDRXSL');`,
          }}
        />
        {/* End Google Tag Manager */}
        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1030054239879963');
fbq('track', 'PageView');`,
          }}
        />
        {/* End Meta Pixel Code */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap"
          rel="stylesheet"
        />
        
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NTZDRXSL"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {/* Meta Pixel Code (noscript) */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1030054239879963&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code (noscript) */}
        {/* Fixed chrome overlays page content (takes no vertical space) so the
            Hero can be a true full-screen section, matching the design. */}
        <div className="fixed inset-x-0 top-0 z-50">
          <Ticker items={TOP_TICKER} variant="top" />
          <Navbar />
        </div>
        {children}
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
