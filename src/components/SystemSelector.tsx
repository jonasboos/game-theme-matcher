"use client";

import { ALL_SYSTEMS } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Props {
  activeSystems: string[];
  onChange: (systems: string[]) => void;
}

export default function SystemSelector({ activeSystems, onChange }: Props) {
  const allCount = ALL_SYSTEMS.length;
  const activeCount = activeSystems.length;

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-semibold text-muted-foreground tracking-wide">
          Systems{" "}
          <span className="font-normal text-muted-foreground/60">
            ({activeCount}/{allCount})
          </span>
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange(activeCount === allCount ? [] : [...ALL_SYSTEMS])}
          className="h-5 px-2 text-[10px] font-semibold text-muted-foreground hover:text-foreground"
        >
          {activeCount === allCount ? "Deselect All" : "Select All"}
        </Button>
      </div>

      <div className="flex flex-wrap gap-1">
        {ALL_SYSTEMS.map((sys) => {
          const active = activeSystems.includes(sys);
          return (
            <button
              key={sys}
              onClick={() =>
                onChange(
                  active
                    ? activeSystems.filter((s) => s !== sys)
                    : [...activeSystems, sys]
                )
              }
              className="cursor-pointer"
            >
              <Badge
                variant={active ? "default" : "outline"}
                className="text-[10px] font-medium transition-colors"
              >
                {sys}
              </Badge>
            </button>
          );
        })}
      </div>
    </div>
  );
}
