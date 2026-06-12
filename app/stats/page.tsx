import { getVisits, getVisitTimes } from "../redis";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import ResetButton from "./ResetButton";
import StatsClient from "./StatsClient";

export default async function StatsPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;
  if (key !== process.env.STATS_KEY) notFound();

  const now = Date.now();
  const defaultStartMs = now - 3 * 60 * 60 * 1000; // 3h

  const [visits, initialTimestamps] = await Promise.all([
    getVisits(),
    getVisitTimes(defaultStartMs, now),
  ]);

  async function handleReset() {
    "use server";
    await (await import("../redis")).resetVisits();
    revalidatePath(`/stats`);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "3rem",
        paddingBottom: "4rem",
        background: "#1a0f00",
        color: "#c8a96e",
        fontFamily: "monospace",
      }}
    >
      <p style={{ fontSize: "0.7rem", opacity: 0.4, letterSpacing: "0.25em", marginBottom: "0.25rem" }}>
        FORTUNE / STATS
      </p>

      <StatsClient
        statsKey={key!}
        initialTimestamps={initialTimestamps}
        initialTotal={visits}
      />

      <div style={{ marginTop: "3rem" }}>
        <ResetButton onReset={handleReset} />
      </div>
    </main>
  );
}
