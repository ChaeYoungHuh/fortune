"use client";

import { useEffect, useState, useCallback, useRef } from "react";

// June 4 KST — when the counter was reset to 0
const EPOCH_MS = new Date("2026-06-04T00:00:00+09:00").getTime();
const REFRESH_INTERVAL = 30_000; // 30s

type RangeOption = { label: string; hours: number | null };
const RANGE_OPTIONS: RangeOption[] = [
  { label: "3h", hours: 3 },
  { label: "6h", hours: 6 },
  { label: "12h", hours: 12 },
  { label: "24h", hours: 24 },
  { label: "All", hours: null },
];

function getBucketMs(hours: number | null): number {
  if (hours === null || hours > 48) return 4 * 60 * 60 * 1000;
  if (hours <= 4) return 10 * 60 * 1000;
  if (hours <= 12) return 30 * 60 * 1000;
  return 60 * 60 * 1000;
}

function bucketize(timestamps: number[], startMs: number, endMs: number, bucketMs: number) {
  const count = Math.ceil((endMs - startMs) / bucketMs);
  const buckets = new Array<number>(count).fill(0);
  for (const ts of timestamps) {
    const idx = Math.floor((ts - startMs) / bucketMs);
    if (idx >= 0 && idx < count) buckets[idx]++;
  }
  return buckets;
}

function fmtKST(tsMs: number): string {
  return new Date(tsMs).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function fmtLabel(tsMs: number, bucketMs: number): string {
  const d = new Date(tsMs);
  const opts: Intl.DateTimeFormatOptions = { timeZone: "Asia/Seoul", hour12: false };
  if (bucketMs >= 4 * 60 * 60 * 1000) {
    return d.toLocaleString("ko-KR", { ...opts, month: "numeric", day: "numeric", hour: "2-digit" });
  }
  if (bucketMs >= 60 * 60 * 1000) {
    return d.toLocaleString("ko-KR", { ...opts, month: "numeric", day: "numeric", hour: "2-digit" });
  }
  return d.toLocaleString("ko-KR", { ...opts, hour: "2-digit", minute: "2-digit" });
}

function BarChart({
  buckets,
  startMs,
  bucketMs,
}: {
  buckets: number[];
  startMs: number;
  bucketMs: number;
}) {
  const max = Math.max(...buckets, 1);
  const W = 600;
  const H = 120;
  const PAD = { top: 10, right: 8, bottom: 28, left: 24 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const barW = Math.max(1, chartW / buckets.length - 1);

  // pick ~5 label positions
  const labelStep = Math.max(1, Math.round(buckets.length / 5));

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", maxWidth: W, display: "block", overflow: "visible" }}
    >
      {/* y gridlines */}
      {[0, 0.25, 0.5, 0.75, 1].map((f) => {
        const y = PAD.top + chartH * (1 - f);
        const val = Math.round(f * max);
        return (
          <g key={f}>
            <line
              x1={PAD.left}
              x2={PAD.left + chartW}
              y1={y}
              y2={y}
              stroke="#c8a96e"
              strokeOpacity={0.1}
              strokeWidth={0.5}
            />
            {val > 0 && (
              <text x={PAD.left - 4} y={y + 4} textAnchor="end" fontSize={7} fill="#c8a96e" opacity={0.4}>
                {val}
              </text>
            )}
          </g>
        );
      })}

      {/* bars */}
      {buckets.map((v, i) => {
        const barH = (v / max) * chartH;
        const x = PAD.left + i * (chartW / buckets.length);
        const y = PAD.top + chartH - barH;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={barW}
            height={barH}
            fill={v > 0 ? "#c8a96e" : "transparent"}
            opacity={0.75}
            rx={1}
          />
        );
      })}

      {/* x labels */}
      {buckets.map((_, i) => {
        if (i % labelStep !== 0) return null;
        const x = PAD.left + i * (chartW / buckets.length) + barW / 2;
        const label = fmtLabel(startMs + i * bucketMs, bucketMs);
        return (
          <text
            key={i}
            x={x}
            y={H - PAD.bottom + 12}
            textAnchor="middle"
            fontSize={7}
            fill="#c8a96e"
            opacity={0.45}
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}

export default function StatsClient({
  statsKey,
  initialTimestamps,
  initialTotal,
}: {
  statsKey: string;
  initialTimestamps: number[];
  initialTotal: number;
}) {
  const [rangeIdx, setRangeIdx] = useState(0); // default 3h
  const [timestamps, setTimestamps] = useState<number[]>(initialTimestamps);
  const [total, setTotal] = useState(initialTotal);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [backfilling, setBackfilling] = useState(false);
  const [backfillResult, setBackfillResult] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const range = RANGE_OPTIONS[rangeIdx];

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const now = Date.now();
      const startMs = range.hours ? now - range.hours * 60 * 60 * 1000 : EPOCH_MS;
      const url = `/api/visit-times?key=${encodeURIComponent(statsKey)}&start=${startMs}&end=${now}`;
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      setTimestamps(data.timestamps ?? []);
      setTotal(data.total ?? 0);
      setLastRefresh(new Date());
    } finally {
      setLoading(false);
    }
  }, [statsKey, range]);

  // fetch on range change
  useEffect(() => {
    fetch_();
  }, [fetch_]);

  // auto-refresh every 30s
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(fetch_, REFRESH_INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [fetch_]);

  const runBackfill = useCallback(async () => {
    setBackfilling(true);
    setBackfillResult(null);
    try {
      const res = await fetch(`/api/backfill?key=${encodeURIComponent(statsKey)}`, { method: "POST" });
      const data = await res.json();
      setBackfillResult(`backfilled ${data.inserted} tokens`);
      await fetch_();
    } finally {
      setBackfilling(false);
    }
  }, [statsKey, fetch_]);

  const now = Date.now();
  const startMs = range.hours ? now - range.hours * 60 * 60 * 1000 : EPOCH_MS;
  const bucketMs = getBucketMs(range.hours);
  const buckets = bucketize(timestamps, startMs, now, bucketMs);
  const visibleCount = timestamps.length;

  // reverse for table display (newest first)
  const sorted = [...timestamps].sort((a, b) => b - a);

  return (
    <div style={{ width: "100%", maxWidth: 680, padding: "0 1rem" }}>
      {/* total */}
      <p style={{ fontSize: "5rem", fontWeight: "bold", margin: "0.5rem 0 0", lineHeight: 1, textAlign: "center" }}>
        {total.toLocaleString()}
      </p>
      <p style={{ fontSize: "0.65rem", opacity: 0.35, letterSpacing: "0.15em", textAlign: "center", marginBottom: "2.5rem" }}>
        TOTAL NFC TAPS
      </p>

      {/* range selector */}
      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: "1.5rem" }}>
        {RANGE_OPTIONS.map((r, i) => (
          <button
            key={r.label}
            onClick={() => setRangeIdx(i)}
            style={{
              background: "transparent",
              border: `1px solid #c8a96e`,
              borderRadius: 4,
              color: "#c8a96e",
              padding: "3px 12px",
              fontSize: "0.7rem",
              letterSpacing: "0.1em",
              cursor: "pointer",
              opacity: i === rangeIdx ? 1 : 0.35,
              fontFamily: "monospace",
            }}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* chart */}
      <div style={{ marginBottom: "0.5rem" }}>
        <BarChart buckets={buckets} startMs={startMs} bucketMs={bucketMs} />
      </div>

      {/* meta */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <span style={{ fontSize: "0.65rem", opacity: 0.35, letterSpacing: "0.1em" }}>
          {visibleCount} taps in range
        </span>
        <span style={{ fontSize: "0.65rem", opacity: 0.25, letterSpacing: "0.08em" }}>
          {loading ? "refreshing…" : `updated ${lastRefresh.toLocaleTimeString("ko-KR", { timeZone: "Asia/Seoul", hour12: false })}`}
        </span>
      </div>

      {/* backfill */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.5rem" }}>
        <button
          onClick={runBackfill}
          disabled={backfilling}
          style={{
            background: "transparent",
            border: "1px solid rgba(200,169,110,0.4)",
            borderRadius: 4,
            color: "#c8a96e",
            padding: "3px 10px",
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
            cursor: backfilling ? "default" : "pointer",
            opacity: backfilling ? 0.4 : 0.6,
            fontFamily: "monospace",
          }}
        >
          {backfilling ? "backfilling…" : "backfill from tokens"}
        </button>
        {backfillResult && (
          <span style={{ fontSize: "0.65rem", opacity: 0.4, letterSpacing: "0.08em" }}>{backfillResult}</span>
        )}
      </div>

      {/* raw table */}
      <div style={{ borderTop: "1px solid rgba(200,169,110,0.15)", paddingTop: "1rem" }}>
        <p style={{ fontSize: "0.6rem", opacity: 0.3, letterSpacing: "0.2em", marginBottom: "0.75rem" }}>
          RAW LOG — {sorted.length} ENTRIES
        </p>
        <div
          style={{
            maxHeight: 320,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {sorted.length === 0 ? (
            <p style={{ fontSize: "0.7rem", opacity: 0.3, fontStyle: "italic" }}>no visits recorded in this range</p>
          ) : (
            sorted.map((ts, i) => (
              <div
                key={ts}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.72rem",
                  opacity: 0.6,
                  padding: "2px 0",
                  borderBottom: "1px solid rgba(200,169,110,0.06)",
                }}
              >
                <span style={{ opacity: 0.35 }}>#{sorted.length - i}</span>
                <span>{fmtKST(ts)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
