"use client";

import { Badge } from "@/components/ui/badge";
import { type Rating } from "@/lib/data";

const VARIANTS: Record<Rating, "default" | "secondary" | "destructive"> = {
  Y: "default",
  E: "secondary",
  M: "destructive",
};

export default function RatingBadge({ rating }: { rating: Rating }) {
  return (
    <Badge variant={VARIANTS[rating]} className="h-4 px-1.5 text-[10px] font-bold tracking-wider">
      {rating}
    </Badge>
  );
}
