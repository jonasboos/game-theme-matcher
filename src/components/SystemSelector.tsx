"use client";

import { ALL_SYSTEMS } from "@/lib/data";

interface Props {
  activeSystems: string[];
  onChange: (systems: string[]) => void;
}

export default function SystemSelector({ activeSystems, onChange }: Props) {
  const allCount = ALL_SYSTEMS.length;
  const activeCount = activeSystems.length;

  return (
    <div style={{ marginBottom: 12 }}>
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)", letterSpacing: 0.3 }}>
          🕹️ Systems{" "}
          <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>
            ({activeCount}/{allCount})
          </span>
        </span>
        <button
          onClick={() => onChange(activeCount === allCount ? [] : [...ALL_SYSTEMS])}
          style={{
            padding: "2px 10px",
            border: "1px solid var(--border)",
            borderRadius: 10,
            background: "transparent",
            color: "var(--text-muted)",
            fontSize: 10,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.15s",
          }}
        >
          {activeCount === allCount ? "Deselect All" : "Select All"}
        </button>
      </div>

      {/* Chips */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
        }}
      >
        {ALL_SYSTEMS.map((sys) => {
          const active = activeSystems.includes(sys);
          return (
            <button
              key={sys}
              onClick={() =>
                onChange(
                  active
                    ? activeSystems.filter((s) => s !== sys)
                    : [...activeSystems, sys],
                )
              }
              style={{
                padding: "3px 9px",
                border: `1px solid ${active ? "rgba(233, 69, 96, 0.3)" : "var(--border)"}`,
                borderRadius: 12,
                background: active
                  ? "linear-gradient(135deg, rgba(233,69,96,0.12), rgba(255,107,129,0.06))"
                  : "transparent",
                color: active ? "var(--accent)" : "var(--text-muted)",
                fontSize: 10,
                fontWeight: active ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.15s ease",
                fontFamily: "inherit",
                lineHeight: 1.4,
              }}
            >
              {sys}
            </button>
          );
        })}
      </div>
    </div>
  );
}
