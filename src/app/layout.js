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
  "One procedure. Years of protection.",
];

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap"
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
