"use client";

import { type Rating } from "@/lib/data";

const COLORS: Record<Rating, { bg: string; text: string }> = {
  Y: { bg: "#2ed573", text: "#0f0f1a" },
  E: { bg: "#f9ca24", text: "#0f0f1a" },
  M: { bg: "#e94560", text: "#fff" },
};

export default function RatingBadge({ rating }: { rating: Rating }) {
  const c = COLORS[rating];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2px 8px",
        borderRadius: 5,
        fontSize: 10,
        fontWeight: 700,
        lineHeight: 1.3,
        background: c.bg,
        color: c.text,
        letterSpacing: 0.8,
      }}
    >
      {rating}
    </span>
  );
}
