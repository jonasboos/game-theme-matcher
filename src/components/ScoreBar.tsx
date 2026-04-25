"use client";

export default function ScoreBar({ score }: { score: number }) {
  const pct = Math.min(score, 100);
  const color =
    score >= 80 ? "#2ed573" : score >= 60 ? "#f9ca24" : score >= 40 ? "#ffa502" : "#e94560";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div
        style={{
          flex: 1,
          height: 5,
          background: "rgba(255,255,255,0.06)",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${color}, ${color}bb)`,
            borderRadius: 4,
            transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color, minWidth: 26, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
        {score}%
      </span>
    </div>
  );
}
