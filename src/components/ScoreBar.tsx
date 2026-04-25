"use client";

export default function ScoreBar({ score }: { score: number }) {
  const pct = Math.min(score, 100);
  const color =
    score >= 80 ? "#2ed573" : score >= 60 ? "#f9ca24" : score >= 40 ? "#ffa502" : "#e94560";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <div
        style={{
          flex: 1,
          height: 4,
          background: "rgba(255,255,255,0.05)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${color}, ${color}aa)`,
            borderRadius: 2,
            transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          color,
          minWidth: 24,
          textAlign: "right",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {score}%
      </span>
    </div>
  );
}
