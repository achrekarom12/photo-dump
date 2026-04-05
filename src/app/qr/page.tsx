"use client";

import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";

export default function QRPage() {
  const [url, setUrl] = useState(
    typeof window !== "undefined" ? window.location.origin : ""
  );

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 py-12 bg-cream">
      <div className="bg-white rounded-3xl shadow-lg p-10 max-w-md w-full flex flex-col items-center gap-6 border border-rose/10">
        {/* Header */}
        <div className="text-center">
          <h1
            className="text-4xl font-bold text-dark"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            James <span className="text-rose italic font-normal text-2xl">&</span> Anna
          </h1>
          <p className="text-dark/40 text-sm tracking-[0.3em] uppercase mt-1">
            April 19, 2026
          </p>
        </div>

        {/* Divider */}
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-rose to-transparent" />

        {/* QR Code */}
        <div className="bg-white p-4 rounded-2xl">
          <QRCodeSVG
            value={url}
            size={220}
            level="M"
            fgColor="#3d3232"
            bgColor="#ffffff"
          />
        </div>

        {/* Instructions */}
        <div className="text-center">
          <p
            className="text-lg text-dark/70"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Scan to share your photos
          </p>
          <p className="text-xs text-dark/30 mt-1">
            from our special day
          </p>
        </div>

        {/* URL input for customization */}
        <div className="w-full">
          <label className="text-xs text-dark/40 block mb-1">App URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-rose/20 bg-cream/50 text-sm text-dark focus:outline-none focus:border-rose"
            placeholder="https://your-domain.com"
          />
        </div>

        {/* Print button */}
        <button
          onClick={() => window.print()}
          className="px-6 py-2.5 rounded-xl bg-dark text-cream text-sm font-medium hover:bg-dark/80 transition-colors"
        >
          Print QR Code
        </button>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body { background: white !important; }
          button, input, label { display: none !important; }
          .shadow-lg { box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
}
