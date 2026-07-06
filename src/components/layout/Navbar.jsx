"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// Import the new button component
import WhatsAppButton from "@/components/ui/WhatsAppButton";

const LINKS = [
  { href: "#methods", label: "Implants" },
  { href: "#methods", label: "hIUS" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav
      className={`w-full transition-all duration-300 ${
        scrolled
          ? "bg-bg/85 shadow-soft backdrop-blur-md"
          : "bg-transparent"
      }`}
      aria-label="Main navigation"
    >
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 py-2 md:px-12 lg:px-16">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="flex items-center"
          aria-label="Control Within home"
        >
          <img
            src="/cw-logo.png"
            alt="Control Within"
            className="h-12 w-auto object-contain md:h-20"
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-3 md:flex">
          <div className="flex items-center gap-1 rounded-full border border-dark/10 bg-surface/60 p-1.5 backdrop-blur">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-full px-5 py-2 text-sm font-medium text-text/80 transition-colors hover:bg-accent-light-2/60 hover:text-accent"
              >
                {link.label}
              </a>
            ))}
          </div>
          
          {/* DESKTOP REPLACEMENT */}
          <WhatsAppButton className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-accent-hover">
            Chat Now
          </WhatsAppButton>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span
            className={`block h-0.5 w-6 rounded-full bg-dark transition-transform duration-300 ${
              menuOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 rounded-full bg-dark transition-opacity duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 rounded-full bg-dark transition-transform duration-300 ${
              menuOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`fixed inset-x-0 top-20 z-40 origin-top px-6 transition-all duration-300 md:hidden ${
          menuOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-1 rounded-3xl border border-dark/10 bg-surface p-4 shadow-hover">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={closeMenu}
              className="rounded-2xl px-4 py-3 text-base font-medium text-text transition-colors hover:bg-accent-light-2/50 hover:text-accent"
            >
              {link.label}
            </a>
          ))}
          
          {/* MOBILE REPLACEMENT */}
          <WhatsAppButton 
            onClick={closeMenu}
            className="mt-1 w-full rounded-2xl bg-accent px-4 py-3 text-center text-base font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            Chat Now
          </WhatsAppButton>
        </div>
      </div>
    </nav>
  );
}