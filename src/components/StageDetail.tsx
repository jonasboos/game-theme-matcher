"use client";

import { type Combo, type Mode, getStageScores, STAGE_GROUPS } from "@/lib/comboEngine";
import RatingBadge from "./RatingBadge";

interface Props {
  combo: Combo;
  mode: Mode;
  onBack: () => void;
}

function SummaryRow({ label, score }: { label: string; score: number }) {
  const color = score >= 80 ? "#2ed573" : "#ffa502";
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0" }}>
      <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color, fontVariantNumeric: "tabular-nums" }}>
        {score}%
      </span>
    </div>
  );
}

export default function StageDetail({ combo, mode, onBack }: Props) {
  const stages = getStageScores(combo.genre, mode);

  return (
    <div className="animate-slide-up">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
        <button
          onClick={onBack}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "var(--bg-glass)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: 16,
            color: "var(--text-primary)",
            flexShrink: 0,
            transition: "all 0.15s",
          }}
        >
          ←
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.2 }}>
            {combo.genre}
          </div>
          <div style={{ fontSize: 11, color: "var(--accent)", fontWeight: 500 }}>
            🕹️ {combo.system}
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: "var(--success)", fontVariantNumeric: "tabular-nums", lineHeight: 1.1 }}>
            {combo.score}%
          </div>
          <div style={{ marginTop: 3 }}>
            <RatingBadge rating={combo.rating} />
          </div>
        </div>
      </div>

      {/* Stage groups */}
      {STAGE_GROUPS.map((group) => (
        <div key={group.label} style={{ marginBottom: 12 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1.2,
              color: "var(--text-muted)",
              marginBottom: 5,
              paddingLeft: 2,
            }}
          >
            {group.label}
          </div>
          <div
            style={{
              background: "var(--bg-glass)",
              borderRadius: 10,
              border: "1px solid var(--border)",
              overflow: "hidden",
            }}
          >
            {group.stages.map((stage, idx) => {
              const score = stages[stage] ?? 0;
              const color =
                score >= 80 ? "#2ed573" : score >= 60 ? "#f9ca24" : score >= 40 ? "#ffa502" : "#e94560";
              const short = stage.replace(/^Stage \d: /, "");
              const isLast = idx === group.stages.length - 1;
              return (
                <div
                  key={stage}
                  style={{
                    padding: "9px 13px",
                    borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 500 }}>
                      {short}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color, fontVariantNumeric: "tabular-nums" }}>
                      {score}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: 5,
                      background: "rgba(0,0,0,0.25)",
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${score}%`,
                        height: "100%",
                        background: `linear-gradient(90deg, ${color}, ${color}88)`,
                        borderRadius: 3,
                        transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Topic Fit summary */}
      <div
        style={{
          background: "var(--bg-glass)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: "0 13px",
          marginTop: 4,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 1.2,
            color: "var(--text-muted)",
            paddingTop: 12,
            marginBottom: 0,
          }}
        >
          Topic Fit
        </div>
        <SummaryRow label="Genre Fit" score={combo.genreScore} />
        <div style={{ height: 1, background: "rgba(255,255,255,0.04)" }} />
        <SummaryRow label="System Fit" score={combo.systemScore} />
        <div style={{ height: 1, background: "rgba(255,255,255,0.04)" }} />
        <SummaryRow label="Rating Fit" score={combo.ratingScore} />
      </div>
    </div>
  );
}
