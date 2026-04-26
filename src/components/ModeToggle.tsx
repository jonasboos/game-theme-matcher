"use client";

import { type Mode } from "@/lib/comboEngine";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  mode: Mode;
  onChange: (m: Mode) => void;
}

export default function ModeToggle({ mode, onChange }: Props) {
  return (
    <div className="inline-flex items-center rounded-full border border-border bg-muted/30 p-0.5">
      {(["single", "dual"] as Mode[]).map((m) => (
        <Button
          key={m}
          variant={mode === m ? "default" : "ghost"}
          size="sm"
          onClick={() => onChange(m)}
          className={cn(
            "h-6 rounded-full px-3 text-[11px] font-bold tracking-wide transition-all",
            mode === m
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {m}
        </Button>
      ))}
    </div>
  );
}
