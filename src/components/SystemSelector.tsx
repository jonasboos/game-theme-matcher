"use client";

import { ALL_SYSTEMS } from "@/lib/data";

interface Props {
  activeSystems: string[];
  onChange: (systems: string[]) => void;
}

export default function SystemSelector({ activeSystems, onChange }: Props) {
  const allCount = ALL_SYSTEMS.length;
  const activeCount = activeSystems.length;
  const allSelected = activeCount === allCount;

  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 14px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 10,
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>
          🕹️ Systems{" "}
          <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>
            ({activeCount}/{allCount})
          </span>
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => onChange(allSelected ? [] : [...ALL_SYSTEMS])}
            style={{
              padding: "3px 10px",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12,
              background: "transparent",
              color: "var(--text-muted)",
              fontSize: 10,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s",
            }}
          >
            {allSelected ? "None" : "All"}
          </button>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          marginTop: 6,
        }}
      >
        {ALL_SYSTEMS.map((sys) => {
          const active = activeSystems.includes(sys);
          return (
            <button
              key={sys}
              onClick={() =>
                onChange(active
                  ? activeSystems.filter((s) => s !== sys)
                  : [...activeSystems, sys])
              }
              style={{
                padding: "3px 10px",
                border: `1px solid ${active ? "var(--accent)" : "rgba(255,255,255,0.06)"}`,
                borderRadius: 14,
                background: active ? "rgba(233, 69, 96, 0.12)" : "transparent",
                color: active ? "var(--accent)" : "var(--text-muted)",
                fontSize: 11,
                fontWeight: active ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.15s ease",
                fontFamily: "inherit",
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
