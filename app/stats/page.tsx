import { getVisits, resetVisits } from "../redis";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import ResetButton from "./ResetButton";

export default async function StatsPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;
  if (key !== process.env.STATS_KEY) notFound();

  const visits = await getVisits();

  async function handleReset() {
    "use server";
    await resetVisits();
    revalidatePath(`/stats`);
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: "#1a0f00", color: "#c8a96e", fontFamily: "monospace" }}
    >
      <p style={{ fontSize: "0.7rem", opacity: 0.4, letterSpacing: "0.25em" }}>FORTUNE / STATS</p>
      <p style={{ fontSize: "5rem", fontWeight: "bold", margin: "1rem 0", lineHeight: 1 }}>
        {visits.toLocaleString()}
      </p>
      <p style={{ fontSize: "0.7rem", opacity: 0.35, letterSpacing: "0.15em" }}>TOTAL NFC TAPS</p>

      <ResetButton onReset={handleReset} />
    </main>
  );
}
