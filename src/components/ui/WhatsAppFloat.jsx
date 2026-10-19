"use client";

import { useEffect, useState } from "react";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

// Floating WhatsApp launcher. Reuses WhatsAppButton so the same confidentiality
// disclaimer popup + redirect logic is shared.
//   Mobile: bottom-left, so it never collides with the bottom-right BackToTop.
//   Desktop: bottom-right, stacked just above BackToTop and shown together with
//   it (same 600px scroll threshold), so it never covers the hero's strip.
export default function WhatsAppFloat() {
  const [raised, setRaised] = useState(false);

  useEffect(() => {
    const onScroll = () => setRaised(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-6 left-6 z-40 transition-all duration-300 md:bottom-21 md:left-auto md:right-6 ${
        raised ? "" : "md:pointer-events-none md:translate-y-3 md:opacity-0"
      }`}
    >
      <WhatsAppButton
        id="btn_global_whatsapp_float"
        aria-label="Chat with us on WhatsApp"
        className="btn-chat flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-hover transition-transform hover:scale-105 active:scale-95 md:h-12 md:w-12"
      >
        <img
          src="/WhatsApp-float.webp"
          alt=""
          aria-hidden="true"
          className="h-7 w-7 md:h-6 md:w-6"
          draggable={false}
        />
      </WhatsAppButton>
    </div>
  );
}
