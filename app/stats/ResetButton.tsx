"use client";

import { useState } from "react";

interface Props {
  onReset: () => Promise<void>;
}

export default function ResetButton({ onReset }: Props) {
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    await onReset();
    setLoading(false);
    setConfirm(false);
  }

  return (
    <>
      <button
        onClick={() => setConfirm(true)}
        style={{
          marginTop: "2.5rem",
          padding: "0.4rem 1.2rem",
          background: "transparent",
          border: "1px solid rgba(200,100,100,0.3)",
          color: "rgba(200,100,100,0.5)",
          borderRadius: "999px",
          fontSize: "0.7rem",
          letterSpacing: "0.15em",
          cursor: "pointer",
          fontFamily: "monospace",
        }}
      >
        RESET
      </button>

      {confirm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
          onClick={() => setConfirm(false)}
        >
          <div
            style={{
              background: "#1a0f00",
              border: "1px solid rgba(200,169,110,0.2)",
              borderRadius: "8px",
              padding: "2rem 2.5rem",
              textAlign: "center",
              maxWidth: "280px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p style={{ color: "#c8a96e", fontSize: "0.8rem", marginBottom: "0.5rem", letterSpacing: "0.1em" }}>
              카운트를 0으로 초기화할까요?
            </p>
            <p style={{ color: "rgba(200,169,110,0.4)", fontSize: "0.65rem", marginBottom: "1.5rem" }}>
              되돌릴 수 없습니다
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
              <button
                onClick={() => setConfirm(false)}
                style={{
                  padding: "0.4rem 1rem",
                  background: "transparent",
                  border: "1px solid rgba(200,169,110,0.3)",
                  color: "rgba(200,169,110,0.6)",
                  borderRadius: "999px",
                  fontSize: "0.7rem",
                  cursor: "pointer",
                  fontFamily: "monospace",
                }}
              >
                취소
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                style={{
                  padding: "0.4rem 1rem",
                  background: "rgba(180,60,60,0.15)",
                  border: "1px solid rgba(200,80,80,0.4)",
                  color: "rgba(220,100,100,0.9)",
                  borderRadius: "999px",
                  fontSize: "0.7rem",
                  cursor: "pointer",
                  fontFamily: "monospace",
                  opacity: loading ? 0.5 : 1,
                }}
              >
                {loading ? "..." : "초기화"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
