"use client";

import { type Combo } from "@/lib/comboEngine";
import RatingBadge from "./RatingBadge";
import ScoreBar from "./ScoreBar";

interface Props {
  combo: Combo;
  onClick: () => void;
  landscape: boolean;
  index: number;
}

export default function ComboCard({ combo, onClick, landscape, index }: Props) {
  const isTop = index < 3;
  const borderColor = combo.score >= 80
    ? "rgba(46, 213, 115, 0.25)"
    : combo.score >= 60
      ? "rgba(249, 202, 36, 0.15)"
      : "rgba(255,255,255,0.06)";

  return (
    <button
      onClick={onClick}
      className="animate-fade-in"
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        background: isTop
          ? "linear-gradient(135deg, rgba(233,69,96,0.08), rgba(255,107,129,0.04))"
          : "rgba(255,255,255,0.02)",
        border: `1px solid ${borderColor}`,
        borderRadius: landscape ? 10 : 12,
        padding: landscape ? "10px 12px" : "12px 14px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        fontFamily: "inherit",
        fontSize: "inherit",
        animationDelay: `${index * 30}ms`,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = isTop
          ? "linear-gradient(135deg, rgba(233,69,96,0.08), rgba(255,107,129,0.04))"
          : "rgba(255,255,255,0.02)")
      }
    >
      {/* Row 1 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: landscape ? 4 : 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: landscape ? 13 : 14, fontWeight: 700, color: "var(--text-primary)" }}>
            {combo.genre}
          </span>
          <RatingBadge rating={combo.rating} />
        </div>
        <span
          style={{
            fontSize: landscape ? 16 : 19,
            fontWeight: 800,
            color: combo.score >= 80 ? "var(--success)" : combo.score >= 60 ? "var(--warning)" : "var(--accent)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {combo.score}%
        </span>
      </div>

      {/* Row 2 */}
      <div style={{ fontSize: landscape ? 11 : 12, color: "var(--accent)", fontWeight: 500, marginBottom: landscape ? 5 : 8 }}>
        🕹️ {combo.system}
      </div>

      {/* Score bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: landscape ? 2 : 3 }}>
        <MiniScore label="Genre" score={combo.genreScore} landscape={landscape} />
        <MiniScore label="System" score={combo.systemScore} landscape={landscape} />
        <MiniScore label="Rating" score={combo.ratingScore} landscape={landscape} />
      </div>
    </button>
  );
}

function MiniScore({ label, score, landscape }: { label: string; score: number; landscape: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <span style={{ fontSize: landscape ? 9 : 10, color: "var(--text-muted)", minWidth: landscape ? 32 : 40, fontWeight: 500 }}>
        {label}
      </span>
      <div style={{ flex: 1 }}>
        <ScoreBar score={score} />
      </div>
    </div>
  );
}
