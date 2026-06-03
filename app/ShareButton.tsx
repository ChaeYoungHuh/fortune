"use client";

import { useState } from "react";
import { toPng } from "html-to-image";

interface Props {
  targetId: string;
}

export default function ShareButton({ targetId }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleShare() {
    const el = document.getElementById(targetId);
    if (!el) return;

    setLoading(true);
    try {
      const dataUrl = await toPng(el, { pixelRatio: 3 });

      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], "fortune.png", { type: "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file] });
      } else {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "fortune.png";
        a.click();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleShare}
      disabled={loading}
      className="mt-8 flex items-center gap-2 px-5 py-2 rounded-full text-xs transition-all duration-200 cursor-pointer disabled:opacity-40"
      style={{
        background: "transparent",
        border: "1px solid rgba(200,169,110,0.35)",
        color: "#c8a96e",
        fontFamily: "var(--font-playfair), serif",
        letterSpacing: "0.18em",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(200,169,110,0.10)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(200,169,110,0.7)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(200,169,110,0.35)";
      }}
    >
      {loading ? (
        <span style={{ opacity: 0.6 }}>capturing...</span>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
          share
        </>
      )}
    </button>
  );
}
