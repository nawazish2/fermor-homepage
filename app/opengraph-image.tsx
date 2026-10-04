import { ImageResponse } from "next/og";
import { sipFutureValue } from "@/lib/finance/sip";
import { formatCompactINR } from "@/lib/finance/format";

export const alt =
  "Fermor: If I put ₹10,000 in every month for 10 years at 12% a year, I'll have ₹23.23 L";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Google Fonts serves TTF to clients without a browser user agent.
async function googleFont(family: string, weight: number, text: string) {
  try {
    const css = await (
      await fetch(
        `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`,
      )
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

export default async function Image() {
  const result = formatCompactINR(sipFutureValue(10000, 10, 12).corpus);
  const text = `FermorIf I put ₹10,000 in every month, for 10 years at 12% a year, I'll have${result}The math behind your money, made visible.`;
  const [display, rupee] = await Promise.all([
    googleFont("Bricolage+Grotesque", 700, text),
    googleFont("Noto+Sans", 700, "₹"),
  ]);
  const fonts = [
    ...(display ? [{ name: "Bricolage", data: display, weight: 700 as const }] : []),
    ...(rupee ? [{ name: "Noto", data: rupee, weight: 700 as const }] : []),
  ];

  const marked = {
    backgroundImage: "linear-gradient(transparent 52%, #FFC93C 52%, #FFC93C 92%, transparent 92%)",
    padding: "0 8px",
    margin: "0 6px",
  };

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#F3F5FA",
          backgroundImage:
            "linear-gradient(#DCE1EE 1px, transparent 1px), linear-gradient(90deg, #DCE1EE 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          color: "#101A3A",
          fontFamily: "Bricolage, Noto",
          fontWeight: 700,
        }}
      >
        <div style={{ display: "flex", fontSize: 40, letterSpacing: "-0.03em" }}>
          <span style={{ ...marked, margin: 0 }}>Fermor</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flexWrap: "wrap", fontSize: 54, lineHeight: 1.25, letterSpacing: "-0.03em", maxWidth: 1000 }}>
            <span>If I put</span>
            <span style={marked}>₹10,000</span>
            <span>in every month, for</span>
            <span style={marked}>10 years</span>
            <span>at</span>
            <span style={marked}>12%</span>
            <span>a year, I&apos;ll have</span>
          </div>
          <div style={{ display: "flex", fontSize: 150, lineHeight: 1, color: "#2438E0", letterSpacing: "-0.04em", marginTop: 12 }}>
            {result}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#4A5272" }}>
          The math behind your money, made visible.
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
