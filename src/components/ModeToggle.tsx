"use client";

import { type Mode } from "@/lib/comboEngine";

interface Props {
  mode: Mode;
  onChange: (m: Mode) => void;
}

export default function ModeToggle({ mode, onChange }: Props) {
  return (
    <div
      style={{
        display: "flex",
        background: "rgba(255,255,255,0.04)",
        borderRadius: 22,
        border: "1px solid rgba(255,255,255,0.06)",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {(["single", "dual"] as Mode[]).map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          style={{
            padding: "5px 14px",
            border: "none",
            background: mode === m
              ? "linear-gradient(135deg, var(--accent), #ff6b81)"
              : "transparent",
            color: mode === m ? "#fff" : "var(--text-muted)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 0.5,
            cursor: "pointer",
            transition: "all 0.25s ease",
            fontFamily: "inherit",
            textTransform: "uppercase",
          }}
        >
          {m}
        </button>
      ))}
    </div>
  );
}
