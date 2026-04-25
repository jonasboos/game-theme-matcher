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
              padding: "5px 12px",
              border: `1px solid ${active ? "var(--accent)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: 18,
              background: active ? "var(--accent)" : "rgba(255,255,255,0.03)",
              color: active ? "#fff" : "var(--text-secondary)",
              fontSize: 12,
              fontWeight: active ? 600 : 400,
              cursor: "pointer",
              transition: "all 0.2s ease",
              fontFamily: "inherit",
            }}
          >
            {g}
          </button>
        );
      })}
    </div>
  );
}
