"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { ALL_TOPICS } from "@/lib/data";

interface Props {
  selectedTopic: string | null;
  onSelect: (topic: string) => void;
  onClear: () => void;
}

export default function TopicSearch({ selectedTopic, onSelect, onClear }: Props) {
  const [search, setSearch] = useState(selectedTopic ?? "");
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return ALL_TOPICS.filter((t) => t.toLowerCase().includes(q));
  }, [search]);

  useEffect(() => {
    if (selectedTopic && search !== selectedTopic) setSearch(selectedTopic);
  }, [selectedTopic]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = useCallback(
    (topic: string) => {
      onSelect(topic);
      setSearch(topic);
      setOpen(false);
    },
    [onSelect],
  );

  const handleClear = useCallback(() => {
    onClear();
    setSearch("");
    setOpen(false);
    setFocused(false);
  }, [onClear]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div
        style={{
          position: "relative",
          border: `1px solid ${open ? "var(--border-active)" : focused ? "rgba(255,255,255,0.15)" : "var(--border)"}`,
          borderRadius: 12,
          background: "var(--bg-glass)",
          transition: "border-color 0.2s ease",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: 11,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 14,
            opacity: 0.4,
            pointerEvents: "none",
            lineHeight: 1,
          }}
        >
          🔍
        </span>
        <input
          type="text"
          placeholder="Search a theme…"
          value={search}
          onFocus={() => { setOpen(true); setFocused(true); }}
          onBlur={() => setFocused(false)}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          style={{
            width: "100%",
            padding: "10px 32px 10px 34px",
            border: "none",
            background: "transparent",
            color: "var(--text-primary)",
            fontSize: 13,
            outline: "none",
            boxSizing: "border-box",
            fontFamily: "inherit",
          }}
        />
        {selectedTopic && (
          <button
            onClick={handleClear}
            style={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              fontSize: 14,
              cursor: "pointer",
              padding: 4,
              lineHeight: 1,
              opacity: 0.6,
            }}
          >
            ✕
          </button>
        )}
      </div>

      {open && filtered.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            maxHeight: 240,
            overflowY: "auto",
            background: "#111128",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10,
            zIndex: 200,
            boxShadow: "var(--shadow-lg)",
          }}
        >
          {filtered.map((topic) => (
            <button
              key={topic}
              onClick={() => handleSelect(topic)}
              style={{
                display: "block",
                width: "100%",
                padding: "8px 14px",
                textAlign: "left",
                border: "none",
                background: topic === selectedTopic ? "rgba(233,69,96,0.08)" : "transparent",
                color: "var(--text-primary)",
                fontSize: 13,
                cursor: "pointer",
                transition: "background 0.1s",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = topic === selectedTopic
                  ? "rgba(233,69,96,0.08)"
                  : "transparent")
              }
            >
              {topic}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
