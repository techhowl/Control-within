const NAV_LINKS = [
  { href: "#consult", label: "Chat Now" },
  { href: "#about", label: "About" },
  { href: "#about", label: "Terms & Conditions" },
  { href: "#about", label: "Privacy" },
];

const SOCIALS = [
  { href: "https://instagram.com", label: "IG" },
  { href: "https://facebook.com", label: "FB" },
  { href: "https://youtube.com", label: "YT" },
];

export default function Footer() {
  return (
    <footer className="bg-dark text-bg">
      <div className="mx-auto max-w-310 px-[5%] py-16">
        <div className="flex flex-col gap-10 border-b border-white/10 pb-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-1.5 font-clash text-xl font-semibold">
              Control
              <span className="mb-0.5 inline-block h-1.5 w-1.5 rounded-full bg-accent-light-1" />
              Within
            </div>
            <p className="mt-4 text-sm leading-relaxed text-bg/65">
              Long-term, reversible, doctor-placed contraception — working
              quietly in the background.
            </p>
          </div>

          <nav
            className="flex flex-wrap gap-x-8 gap-y-3"
            aria-label="Footer navigation"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-bg/70 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col-reverse items-start gap-6 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-bg/50">
            © 2026 Control Within. All rights reserved.
          </p>
          <div className="flex gap-3">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-xs font-semibold text-bg/70 transition-colors hover:border-accent-light-1 hover:bg-accent hover:text-white"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
