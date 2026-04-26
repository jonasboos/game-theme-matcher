"use client";

import { type Mode } from "@/lib/comboEngine";
import { SINGLE_GENRES, DUAL_GENRES } from "@/lib/comboEngine";
import { Badge } from "@/components/ui/badge";

interface Props {
  selected: string[];
  onSelect: (g: string[]) => void;
  mode: Mode;
}

export default function GenreTags({ selected, onSelect, mode }: Props) {
  const genres = mode === "single" ? SINGLE_GENRES : DUAL_GENRES;
  return (
    <div className="flex flex-wrap gap-1.5">
      {genres.map((g) => {
        const active = selected.includes(g);
        return (
          <button
            key={g}
            onClick={() =>
              onSelect(active ? selected.filter((x) => x !== g) : [...selected, g])
            }
            className="cursor-pointer"
          >
            <Badge
              variant={active ? "default" : "outline"}
              className="text-[11px] font-medium transition-colors"
            >
              {g}
            </Badge>
          </button>
        );
      })}
    </div>
  );
}
