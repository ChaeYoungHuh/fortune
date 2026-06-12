import { fortunes } from "./fortunes";
import ShareButton from "./ShareButton";
import { trackVisit } from "./redis";

const luckyColors = [
  { ko: "루비 레드",    en: "Ruby Red",      hex: "#9B1C1C" },
  { ko: "산호빛",       en: "Coral",         hex: "#FF6B6B" },
  { ko: "황금빛",       en: "Gold",          hex: "#D4A017" },
  { ko: "에메랄드",     en: "Emerald",       hex: "#046307" },
  { ko: "로열 블루",    en: "Royal Blue",    hex: "#2C52A0" },
  { ko: "라벤더",       en: "Lavender",      hex: "#967BB6" },
  { ko: "버건디",       en: "Burgundy",      hex: "#800020" },
  { ko: "세이지 그린",  en: "Sage Green",    hex: "#7D9B76" },
  { ko: "사파이어",     en: "Sapphire",      hex: "#0F52BA" },
  { ko: "로즈 골드",    en: "Rose Gold",     hex: "#B76E79" },
  { ko: "아이보리",     en: "Ivory",         hex: "#FFFFF0" },
  { ko: "코발트",       en: "Cobalt",        hex: "#0047AB" },
  { ko: "테라코타",     en: "Terracotta",    hex: "#C05A30" },
  { ko: "오팔",         en: "Opal",          hex: "#A8C5BD" },
  { ko: "인디고",       en: "Indigo",        hex: "#4B0082" },
  { ko: "황옥빛",       en: "Topaz",         hex: "#FFC87C" },
  { ko: "새벽빛",       en: "Dawn",          hex: "#F9A26C" },
  { ko: "심해빛",       en: "Deep Sea",      hex: "#1B4F72" },
  { ko: "벚꽃빛",       en: "Cherry Blossom", hex: "#FFB7C5" },
  { ko: "흑요석",       en: "Obsidian",      hex: "#3D3635" },
];

function tokenToIndex(token: string, max: number): number {
  let h = 5381;
  for (let i = 0; i < token.length; i++) {
    h = ((h << 5) + h + token.charCodeAt(i)) >>> 0;
  }
  return h % max;
}

function tokenToColorIndex(token: string): number {
  let h = 1009;
  for (let i = 0; i < token.length; i++) {
    h = ((h * 31) + token.charCodeAt(i)) >>> 0;
  }
  return h % luckyColors.length;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ v?: string }>;
}) {
  const params = await searchParams;
  const token = params.v ?? "";
  const idx = token ? tokenToIndex(token, fortunes.length) : 0;
  const fortune = fortunes[idx];
  const color = luckyColors[token ? tokenToColorIndex(token) : 0];
  if (token) await trackVisit(token);

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ background: "radial-gradient(ellipse at center, #3b1f00 0%, #1a0f00 70%)" }}
    >
      <p
        className="mb-10 tracking-[0.35em] uppercase opacity-90"
        style={{ color: "#c8a96e", fontFamily: "var(--font-playfair), serif" }}
      >
        KAIST Tag Fortune
      </p>

      <div className="animate-unfold w-full max-w-sm">
        <div
          id="fortune-slip"
          className="paper-texture dashed-border rounded-sm px-8 py-8 relative"
          style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.6), inset 0 0 60px rgba(180,140,80,0.08)" }}
        >
          <div
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px opacity-10"
            style={{ background: "repeating-linear-gradient(90deg, #8b6914 0px, #8b6914 6px, transparent 6px, transparent 12px)" }}
          />

          <p className="fortune-ko text-center mb-5" style={{ fontSize: "1.1em" }}>
            {fortune.ko}
          </p>
     

          <div className="flex items-center gap-3 my-4 opacity-30">
            <div className="flex-1 h-px" style={{ background: "#8b6914" }} />
            <span style={{ color: "#8b6914", fontSize: "0.6rem" }}>✦</span>
            <div className="flex-1 h-px" style={{ background: "#8b6914" }} />
          </div>

          <p className="fortune-en text-center">
            {fortune.en}
          </p>

          {/* lucky color */}
          <div className="mt-6 flex flex-col items-center gap-2">
            <div
              className="w-6 h-6 rounded-full border border-black/10"
              style={{ background: color.hex }}
            />
            <div className="text-center">
              <p
                className="text-xs"
                style={{ color: "#8b6914", fontFamily: "var(--font-nanum), serif", opacity: 0.7 }}
              >
                {color.ko}
              </p>
              <p
                className="text-xs opacity-50 mt-0.5"
                style={{ color: "#8b6914", fontFamily: "var(--font-playfair), serif", fontStyle: "italic", letterSpacing: "0.1em" }}
              >
                Lucky Color
              </p>
            </div>
          </div>
        </div>
      </div>

      <ShareButton targetId="fortune-slip" />

      <p
        className="mt-10 text-lg opacity-30"
        style={{ color: "#c8a96e", fontFamily: "var(--font-playfair), serif", fontStyle: "italic", fontSize: "3.5rem" }}
      >
        by <a href="https://cyhuh.com" target="_blank" className="underline">cyhuh.com</a>
      </p>

    </main>
  );
}
