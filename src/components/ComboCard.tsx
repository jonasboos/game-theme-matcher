"use client";

import { type Combo } from "@/lib/comboEngine";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RatingBadge from "./RatingBadge";
import ScoreBar from "./ScoreBar";

interface Props {
  combo: Combo;
  onClick: () => void;
  landscape: boolean;
  index: number;
}

export default function ComboCard({ combo, onClick, landscape, index }: Props) {
  const isTop = index < 3;
  const scoreColor =
    combo.score >= 80 ? "text-emerald-400" : combo.score >= 60 ? "text-amber-400" : "text-primary";
  const borderColor = combo.score >= 80
    ? "border-emerald-500/20"
    : combo.score >= 60
      ? "border-amber-500/10"
      : "border-border";

  return (
    <button
      onClick={onClick}
      className="animate-fade-in w-full text-left"
      style={{ animationDelay: `${index * 25}ms` }}
    >
      <Card
        className={`relative overflow-hidden transition-all hover:bg-accent/5 ${landscape ? "py-2 px-2.5" : "py-2.5 px-3"} ${borderColor} ${isTop ? "bg-gradient-to-br from-primary/5 to-primary/[0.02]" : "bg-card/50"}`}
      >
        {isTop && (
          <div
            className="absolute top-0 left-0 right-0 h-0.5 opacity-60"
            style={{
              background: `linear-gradient(90deg, transparent, ${combo.score >= 80 ? "#2ed573" : combo.score >= 60 ? "#f9ca24" : "#e94560"}, transparent)`,
            }}
          />
        )}
        <CardContent className="p-0">
          {/* Row 1: Genre + Rating + Score */}
          <div className={`flex justify-between items-center ${landscape ? "mb-0.5" : "mb-1"}`}>
            <div className="flex items-center gap-1.5">
              <span className={`font-bold text-foreground ${landscape ? "text-xs" : "text-sm"}`}>
                {combo.genre}
              </span>
              <RatingBadge rating={combo.rating} />
            </div>
            <span className={`font-extrabold tabular-nums leading-none ${landscape ? "text-[15px]" : "text-lg"} ${scoreColor}`}>
              {combo.score}%
            </span>
          </div>

          {/* Row 2: System */}
          <div className={`text-primary font-medium ${landscape ? "text-[10px] mb-1" : "text-[11px] mb-1.5"}`}>
            {combo.system}
          </div>

          {/* Score bars */}
          <div className={`flex flex-col ${landscape ? "gap-0" : "gap-0.5"}`}>
            <MiniScore label="Genre" score={combo.genreScore} landscape={landscape} />
            <MiniScore label="System" score={combo.systemScore} landscape={landscape} />
            <MiniScore label="Rating" score={combo.ratingScore} landscape={landscape} />
          </div>
        </CardContent>
      </Card>
    </button>
  );
}

function MiniScore({ label, score, landscape }: { label: string; score: number; landscape: boolean }) {
  return (
    <div className="flex items-center gap-1">
      <span className={`text-muted-foreground font-medium ${landscape ? "text-[9px] min-w-[30px]" : "text-[10px] min-w-[38px]"}`}>
        {label}
      </span>
      <div className="flex-1">
        <ScoreBar score={score} />
      </div>
    </div>
  );
}
