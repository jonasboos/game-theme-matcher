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
  const scoreColor =
    combo.score >= 80 ? "var(--success)" : combo.score >= 60 ? "var(--warning)" : "var(--accent)";
  const borderColor = combo.score >= 80
    ? "rgba(46, 213, 115, 0.2)"
    : combo.score >= 60
      ? "rgba(249, 202, 36, 0.12)"
      : "var(--border)";

  return (
    <button
      onClick={onClick}
      className="animate-fade-in"
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        background: isTop ? "var(--gradient-card)" : "var(--bg-card)",
        border: `1px solid ${borderColor}`,
        borderRadius: landscape ? 10 : 12,
        padding: landscape ? "9px 11px" : "11px 13px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        fontFamily: "inherit",
        fontSize: "inherit",
        animationDelay: `${index * 25}ms`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Score glow accent on top cards */}
      {isTop && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${scoreColor}, transparent)`,
            opacity: 0.6,
          }}
        />
      )}

      {/* Row 1: Genre + Rating + Score */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: landscape ? 3 : 5 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: landscape ? 12 : 13, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3 }}>
            {combo.genre}
          </span>
          <RatingBadge rating={combo.rating} />
        </div>
        <span
          style={{
            fontSize: landscape ? 15 : 18,
            fontWeight: 800,
            color: scoreColor,
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1,
          }}
        >
          {combo.score}%
        </span>
      </div>

      {/* Row 2: System */}
      <div style={{ fontSize: landscape ? 10 : 11, color: "var(--accent)", fontWeight: 500, marginBottom: landscape ? 4 : 6 }}>
        🕹️ {combo.system}
      </div>

      {/* Score bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: landscape ? 1 : 2 }}>
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
      <span style={{ fontSize: landscape ? 9 : 10, color: "var(--text-muted)", minWidth: landscape ? 30 : 38, fontWeight: 500 }}>
        {label}
      </span>
      <div style={{ flex: 1 }}>
        <ScoreBar score={score} />
      </div>
    </div>
  );
}
