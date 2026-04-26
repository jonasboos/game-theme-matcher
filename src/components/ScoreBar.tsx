"use client";

export default function ScoreBar({ score }: { score: number }) {
  const pct = Math.min(score, 100);
  const color =
    score >= 80 ? "#2ed573" : score >= 60 ? "#f9ca24" : score >= 40 ? "#ffa502" : "#e94560";
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex-1 rounded-full bg-muted/50 overflow-hidden">
        <div
          className="h-1 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span
        className="text-[10px] font-bold min-w-[24px] text-right tabular-nums"
        style={{ color }}
      >
        {score}%
      </span>
    </div>
  );
}
