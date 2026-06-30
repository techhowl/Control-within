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
  "Long-acting, reversible contraception",
  "Doctor-placed. Private. Reversible.",
  "Free first consultation on WhatsApp",
  "Your body. Your timeline. Your control.",
];

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&f[]=clash-grotesk@400,500,600&f[]=author@400,500,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
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
