"use client";

import WhatsAppButton from "@/components/ui/WhatsAppButton";

// Mobile-only floating WhatsApp launcher. Reuses WhatsAppButton so the same
// confidentiality disclaimer popup + redirect logic is shared. Placed bottom-left
// so it never collides with the bottom-right BackToTop button.
export default function WhatsAppFloat() {
  return (
    <div className="fixed bottom-6 left-6 z-40 md:hidden">
      <WhatsAppButton
        aria-label="Chat with us on WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-hover transition-transform hover:scale-105 active:scale-95"
      >
        <img
          src="/WhatsApp-float.webp"
          alt=""
          aria-hidden="true"
          className="h-7 w-7"
          draggable={false}
        />
      </WhatsAppButton>
    </div>
  );
}
