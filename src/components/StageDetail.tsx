"use client";

import { type Combo, type Mode, getStageScores, STAGE_GROUPS } from "@/lib/comboEngine";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RatingBadge from "./RatingBadge";
import { ArrowLeft } from "lucide-react";

interface Props {
  combo: Combo;
  mode: Mode;
  onBack: () => void;
}

function SummaryRow({ label, score }: { label: string; score: number }) {
  const color = score >= 80 ? "text-emerald-400" : "text-amber-400";
  return (
    <div className="flex justify-between items-center py-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-sm font-bold tabular-nums ${color}`}>
        {score}%
      </span>
    </div>
  );
}

export default function StageDetail({ combo, mode, onBack }: Props) {
  const stages = getStageScores(combo.genre, mode);

  return (
    <div className="animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <Button
          variant="outline"
          size="icon"
          onClick={onBack}
          className="h-9 w-9 shrink-0 rounded-xl"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="text-base font-bold text-foreground leading-tight">
            {combo.genre}
          </div>
          <div className="text-[11px] text-primary font-medium">
            {combo.system}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xl font-extrabold text-emerald-400 tabular-nums leading-none">
            {combo.score}%
          </div>
          <div className="mt-1">
            <RatingBadge rating={combo.rating} />
          </div>
        </div>
      </div>

      {/* Stage groups */}
      {STAGE_GROUPS.map((group) => (
        <div key={group.label} className="mb-3">
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1 pl-0.5">
            {group.label}
          </div>
          <Card className="overflow-hidden border-border bg-muted/20">
            <CardContent className="p-0">
              {group.stages.map((stage, idx) => {
                const score = stages[stage] ?? 0;
                const color =
                  score >= 80 ? "#2ed573" : score >= 60 ? "#f9ca24" : score >= 40 ? "#ffa502" : "#e94560";
                const short = stage.replace(/^Stage \d: /, "");
                const isLast = idx === group.stages.length - 1;
                return (
                  <div
                    key={stage}
                    className={`px-3 py-2 ${!isLast ? "border-b border-border/30" : ""}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-foreground font-medium">{short}</span>
                      <span className="text-xs font-bold tabular-nums"
                        style={{ color }}
                      >
                        {score}%
                      </span>
                    </div>
                    <div className="h-1 rounded-full bg-black/20 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: `${score}%`,
                          background: `linear-gradient(90deg, ${color}, ${color}88)`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      ))}

      {/* Topic Fit summary */}
      <Card className="border-border bg-muted/20 mt-1">
        <CardContent className="px-3 py-0">
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pt-3 mb-0">
            Topic Fit
          </div>
          <SummaryRow label="Genre Fit" score={combo.genreScore} />
          <div className="h-px bg-border/30" />
          <SummaryRow label="System Fit" score={combo.systemScore} />
          <div className="h-px bg-border/30" />
          <SummaryRow label="Rating Fit" score={combo.ratingScore} />
        </CardContent>
      </Card>
    </div>
  );
}
