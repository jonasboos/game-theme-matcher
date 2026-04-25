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
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
      <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 700, color, fontVariantNumeric: "tabular-nums" }}>
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
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button
          onClick={onBack}
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.03)",
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
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.2 }}>
            {combo.genre}
          </div>
          <div style={{ fontSize: 12, color: "var(--accent)", fontWeight: 500 }}>
            🕹️ {combo.system}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "var(--success)", fontVariantNumeric: "tabular-nums" }}>
            {combo.score}%
          </div>
          <div style={{ marginTop: 2 }}>
            <RatingBadge rating={combo.rating} />
          </div>
        </div>
      </div>

      {/* Stage groups */}
      {STAGE_GROUPS.map((group) => (
        <div key={group.label} style={{ marginBottom: 14 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1.5,
              color: "var(--text-muted)",
              marginBottom: 6,
              paddingLeft: 2,
            }}
          >
            {group.label}
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.06)",
              overflow: "hidden",
            }}
          >
            {group.stages.map((stage, idx) => {
              const score = stages[stage] ?? 0;
              const color =
                score >= 80 ? "#2ed573" : score >= 60 ? "#f9ca24" : score >= 40 ? "#ffa502" : "#e94560";
              const short = stage.replace(/^Stage \d: /, "");
              return (
                <div
                  key={stage}
                  style={{
                    padding: "10px 14px",
                    borderBottom: idx < group.stages.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 500 }}>
                      {short}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color, fontVariantNumeric: "tabular-nums" }}>
                      {score}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: 6,
                      background: "rgba(0,0,0,0.3)",
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
                        transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Fit summary */}
      <div
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 12,
          padding: "0 14px",
          marginTop: 6,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 1.5,
            color: "var(--text-muted)",
            paddingTop: 12,
            marginBottom: 0,
          }}
        >
          Topic Fit
        </div>
        <SummaryRow label="Genre" score={combo.genreScore} />
        <div style={{ height: 1, background: "rgba(255,255,255,0.04)" }} />
        <SummaryRow label="System" score={combo.systemScore} />
        <div style={{ height: 1, background: "rgba(255,255,255,0.04)" }} />
        <SummaryRow label="Rating" score={combo.ratingScore} />
      </div>
    </div>
  );
}
