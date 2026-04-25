"use client";

import { type Mode } from "@/lib/comboEngine";
import { SINGLE_GENRES, DUAL_GENRES } from "@/lib/comboEngine";

interface Props {
  selected: string[];
  onSelect: (g: string[]) => void;
  mode: Mode;
}

export default function GenreTags({ selected, onSelect, mode }: Props) {
  const genres = mode === "single" ? SINGLE_GENRES : DUAL_GENRES;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
      {genres.map((g) => {
        const active = selected.includes(g);
        return (
          <button
            key={g}
            onClick={() =>
              onSelect(active ? selected.filter((x) => x !== g) : [...selected, g])
            }
            style={{
              padding: "4px 11px",
              border: `1px solid ${active ? "var(--border-active)" : "var(--border)"}`,
              borderRadius: 16,
              background: active ? "var(--accent-subtle)" : "transparent",
              color: active ? "var(--accent)" : "var(--text-muted)",
              fontSize: 11,
              fontWeight: active ? 600 : 400,
              cursor: "pointer",
              transition: "all 0.2s ease",
              fontFamily: "inherit",
              lineHeight: 1.4,
            }}
          >
            {g}
          </button>
        );
      })}
    </div>
  );
}
