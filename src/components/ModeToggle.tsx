"use client";

import { type Mode } from "@/lib/comboEngine";

interface Props {
  mode: Mode;
  onChange: (m: Mode) => void;
}

export default function ModeToggle({ mode, onChange }: Props) {
  const width = 98;
  const thumbW = 46;
  const offset = mode === "single" ? 2 : width - thumbW - 2;

  return (
    <div
      style={{
        position: "relative",
        width,
        height: 30,
        background: "rgba(255,255,255,0.04)",
        borderRadius: 15,
        border: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0,
      }}
    >
      {/* Sliding thumb */}
      <div
        style={{
          position: "absolute",
          top: 2,
          left: offset,
          width: thumbW,
          height: 24,
          borderRadius: 12,
          background: "var(--gradient-accent)",
          transition: "left 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          zIndex: 1,
          boxShadow: "0 2px 8px rgba(233,69,96,0.3)",
        }}
      />
      {/* Labels */}
      {(["single", "dual"] as Mode[]).map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          style={{
            position: "absolute",
            top: 0,
            left: m === "single" ? 0 : thumbW + 2,
            width: thumbW + 2,
            height: 30,
            border: "none",
            background: "transparent",
            color: mode === m ? "#fff" : "var(--text-muted)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 0.3,
            cursor: "pointer",
            zIndex: 2,
            fontFamily: "inherit",
            transition: "color 0.2s ease",
          }}
        >
          {m}
        </button>
      ))}
    </div>
  );
}
