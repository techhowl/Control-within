import React from "react";

const NAV_LINKS = [
  { href: "#consult", label: "Chat Now" },
  { href: "#about", label: "About" },
  { href: "#about", label: "Terms & Conditions" },
  { href: "#about", label: "Privacy" },
];

const SOCIALS = [
  { 
    href: "https://instagram.com", 
    label: "Instagram",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    )
  },
  { 
    href: "https://facebook.com", 
    label: "Facebook",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3.64l.36-4H14V7a1 1 0 0 1 1-1h3z"></path>
      </svg>
    )
  },
  { 
    href: "https://youtube.com", 
    label: "YouTube",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
      </svg>
    )
  },
];

export default function Footer() {
  return (
    <footer className="bg-dark text-bg">
      <div className="mx-auto max-w-310 px-[5%] py-16">
        <div className="flex flex-col gap-10 border-b border-white/10 pb-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <img src="/cw-logo.png" alt="Control Within" className="h-9 w-auto" />
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
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-bg/70 transition-colors hover:border-accent-light-1 hover:bg-accent hover:text-white"
              >
                {social.icon}
                {/* Keep label for screen readers */}
                <span className="sr-only">{social.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}