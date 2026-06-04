import { getVisits } from "../redis";
import { notFound } from "next/navigation";

export default async function StatsPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;
  if (key !== process.env.STATS_KEY) notFound();

  const visits = await getVisits();

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: "#1a0f00", color: "#c8a96e", fontFamily: "monospace" }}
    >
      <p style={{ fontSize: "0.75rem", opacity: 0.5, letterSpacing: "0.2em" }}>FORTUNE / STATS</p>
      <p style={{ fontSize: "4rem", fontWeight: "bold", margin: "1rem 0" }}>{visits.toLocaleString()}</p>
      <p style={{ fontSize: "0.75rem", opacity: 0.4 }}>total NFC taps</p>
    </main>
  );
}
