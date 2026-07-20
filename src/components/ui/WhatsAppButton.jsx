"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function WhatsAppButton({ children, className, onClick, message, ...rest }) {
  const [showPopup, setShowPopup] = useState(false);
  const [mounted, setMounted] = useState(false); // Used to safely render Portal in Next.js
  
  const timerRef = useRef(null);

  const whatsappNumber = "918452926740";

  // Ensure component is mounted before trying to attach portal to document.body
  useEffect(() => {
    setMounted(true);
  }, []);

  // Read the chatId dropped by /api/lead (client-readable cw_chat cookie) so the
  // prefilled message carries it in [brackets] for CRM/WhatsApp stitching.
  // DISABLED: chatId/lead flow is paused — keep for easy re-enable later.
  // const readChatId = () => {
  //   if (typeof document === "undefined") return null;
  //   const match = document.cookie.match(/(?:^|;\s*)cw_chat=([^;]+)/);
  //   return match ? decodeURIComponent(match[1]) : null;
  // };

  const buildWhatsappUrl = () => {
    // Plain "Hi" message, no chatId ref. To restore stitching, uncomment
    // readChatId above and swap the line below back to the ref: variant.
    // const chatId = readChatId();
    // const text = chatId
    //   ? `Hi, I would like to know more information. ref:[${chatId}]`
    //   : "Hi, I would like to know more information.";
    const text = message || "Hi, I would like to know more information.";
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  const triggerRedirect = () => {
    window.open(buildWhatsappUrl(), "_blank", "noopener,noreferrer");
    setShowPopup(false);
  };

  const handleClose = (e) => {
    if (e) e.stopPropagation();
    
    // Kill the timer instantly
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    triggerRedirect(); 
  };

  useEffect(() => {
    if (showPopup) {
      timerRef.current = setTimeout(() => {
        triggerRedirect();
      }, 7000);
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [showPopup]);

  // The modal UI extracted into a variable
  const modalContent = showPopup ? (
    // Increased z-index to 9999 to guarantee it sits above absolutely everything
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 sm:p-6 backdrop-blur-sm">
      {/* Added max-h-[90vh] and overflow-y-auto for small screens like iPhone SE */}
      <div className="ct-whatsapp relative w-full max-w-md bg-white rounded-xl shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        
        {/* 'X' Button - given a background/padding so it's easier to tap on mobile */}
        <button 
          onClick={handleClose}
          className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors z-10"
          aria-label="Cancel and close"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mt-2 text-center flex flex-col items-center">
          {/* WhatsApp Icon */}
          <div className="flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-green-100 mb-4 shadow-sm">
            <svg className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12c0 1.74.45 3.37 1.22 4.79L2 22l5.43-1.18c1.4.74 3 1.18 4.57 1.18 5.52 0 10-4.48 10-10S17.52 2 12 2zm4.5 13.91c-.24.67-1.39 1.28-1.95 1.35-.5.06-1.14.18-3.23-.68-2.52-1.03-4.14-3.61-4.26-3.78-.13-.17-1.02-1.35-1.02-2.57 0-1.22.63-1.83.86-2.06.23-.24.52-.29.69-.29.17 0 .34 0 .49.01.17.01.4-.06.63.48.24.57.8 1.95.87 2.1.07.14.12.31.02.5-.1.2-.16.32-.51-.15.19-.32.41-.45.55-.15.17-.32.35-.13.68.19.33.85 1.41 1.83 2.28 1.26 1.12 2.3 1.47 2.63 1.63.33.16.53.13.73-.08.2-.21.86-1 1.09-1.34.23-.34.46-.29.77-.17.31.12 1.96.92 2.3 1.09.34.17.57.25.65.4.08.15.08.87-.16 1.54z" clipRule="evenodd" />
            </svg>
          </div>
          
          {/* Added pr-8 (padding-right) so text doesn't overlap the X button */}
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 pr-8 sm:pr-0">
            Connecting to Counselling...
          </h3>
          
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            By tapping Chat on WhatsApp, you'll move to WhatsApp for a private and confidential conversation. By initiating this conversation, you also consent to receiving automated informational text updates from ControlWithin.com.  We value your digital privacy and will never share your personal information with family or employers. Should you choose to book an appointment to know more, your contact details will be shared with a preferred doctor or clinic.
          </p>
          <p className="text-sm font-medium text-gray-800 mb-6">
            Type EXIT anytime to stop.
          </p>

          {/* Manual Click Button */}
          <button 
            onClick={() => {
              if (timerRef.current) clearTimeout(timerRef.current);
              triggerRedirect();
            }}
            className="w-full py-3 sm:py-3.5 px-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 text-base"
          >
            Continue to WhatsApp
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </button>

          {/* Loading Indicator */}
          <div className="mt-5 flex justify-center items-center gap-2 text-xs text-gray-400">
            <svg className="animate-spin h-4 w-4 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-center">Redirecting automatically...<br className="sm:hidden" /> Click above if nothing happens.</span>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          setShowPopup(true);
          if (onClick) onClick(e);
        }}
        className={className}
        {...rest}
      >
        {children || "Chat on WhatsApp"}
      </button>

      {/* Teleport the modal to document.body so the Navbar can't trap it! */}
      {mounted && typeof document !== 'undefined'
        ? createPortal(modalContent, document.body)
        : null}
    </>
  );
}