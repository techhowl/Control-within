"use client";

import { useState } from "react";

export default function Safety() {
  const [open, setOpen] = useState(false);

  return (
    <section className="bg-bg px-[5%] py-12">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-dark/10 bg-surface shadow-soft">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-base font-semibold text-dark"
        >
          <span>⚠️&nbsp; Important Safety Information</span>
          <span
            aria-hidden="true"
            className={`flex h-7 w-7 flex-none items-center justify-center rounded-full bg-cream text-muted transition-transform duration-300 ${
              open ? "rotate-45" : ""
            }`}
          >
            +
          </span>
        </button>
        <div
          className={`grid transition-all duration-300 ease-out ${
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="px-6 pb-6 text-sm leading-relaxed text-muted">
              These methods do not protect against sexually transmitted
              infections (STIs). Common side effects may include changes in
              bleeding patterns, mild cramping, or temporary spotting after
              insertion. These methods may not be suitable for everyone. Always
              consult a qualified gynaecologist before making any medical
              decision.
              <br />
              <br />
              <a href="#about" className="font-semibold text-accent">
                Read Full Safety Information →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
