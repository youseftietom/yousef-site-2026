"use client";

import { useState, useEffect } from "react";

export default function WhatsAppButton() {
  // يظهر بعد انتهاء الـ splash (2800ms timer + 800ms fade-out = ~3.7s)
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 3700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{`
        @keyframes wa-pulse {
          0%   { box-shadow: 0 0 0 0   rgba(37,211,102,0.6); }
          70%  { box-shadow: 0 0 0 12px rgba(37,211,102,0);  }
          100% { box-shadow: 0 0 0 0   rgba(37,211,102,0);   }
        }

        @keyframes wa-enter {
          from { opacity: 0; transform: translateY(16px) scale(0.85); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }

        #wa-btn {
          animation: wa-pulse 2s ease-out infinite;
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease, opacity 0.4s ease;
        }

        #wa-btn.wa-visible {
          animation: wa-enter 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards,
                     wa-pulse 2s ease-out 0.5s infinite;
        }

        #wa-btn:hover {
          transform: translateY(-3px) scale(1.04);
          background: #20bf5b !important;
          box-shadow: 0 10px 30px rgba(37,211,102,0.5) !important;
        }

        #wa-btn:active {
          transform: scale(0.97);
        }
      `}</style>

      <a
        id="wa-btn"
        href="https://wa.me/201551599940"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل معنا على واتساب"
        className={visible ? "wa-visible" : ""}
        style={{
          position: "fixed",
          bottom: "28px",
          left: "28px",
          zIndex: 999999,
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          padding: "16px",
          borderRadius: "9999px",
          background: "#25D366",
          color: "#ffffff",
          fontWeight: 700,
          fontSize: "0.95rem",
          fontFamily: "inherit",
          textDecoration: "none",
          boxShadow: "0 4px 18px rgba(37,211,102,0.4)",
          whiteSpace: "nowrap",
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
        }}
      >
        {/* WhatsApp icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="22"
          height="22"
          fill="currentColor"
          aria-hidden="true"
          style={{ display: "block", flexShrink: 0 }}
        >
          <path d="M16.002 2C8.28 2 2 8.28 2 16.002c0 2.478.65 4.907 1.885 7.045L2 30l7.183-1.858A13.94 13.94 0 0 0 16.002 30C23.72 30 30 23.72 30 16.002 30 8.28 23.72 2 16.002 2zm0 25.6a11.54 11.54 0 0 1-5.88-1.607l-.422-.25-4.266 1.103 1.13-4.144-.276-.437A11.555 11.555 0 0 1 4.4 16.002C4.4 9.608 9.608 4.4 16.002 4.4S27.6 9.608 27.6 16.002 22.394 27.6 16.002 27.6zm6.34-8.653c-.347-.174-2.055-1.014-2.375-1.13-.32-.116-.553-.173-.786.174-.232.347-.9 1.13-1.103 1.363-.203.232-.405.26-.752.087-.347-.174-1.465-.54-2.79-1.72-1.032-.92-1.727-2.055-1.93-2.402-.202-.347-.022-.535.152-.708.157-.155.347-.405.52-.608.175-.202.232-.347.348-.578.116-.232.058-.434-.029-.608-.087-.174-.786-1.893-1.076-2.593-.284-.68-.573-.588-.786-.598l-.668-.012c-.232 0-.608.087-.927.434-.318.347-1.218 1.189-1.218 2.9s1.247 3.364 1.42 3.597c.174.232 2.454 3.747 5.946 5.255.831.358 1.48.572 1.986.732.834.265 1.594.228 2.194.138.669-.1 2.055-.84 2.344-1.652.29-.811.29-1.507.203-1.652-.086-.145-.318-.232-.665-.406z" />
        </svg>
      </a>
    </>
  );
}
