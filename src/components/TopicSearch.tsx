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
  }, [onClear]);

  const isActive = open;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div style={{ position: "relative" }}>
        <span
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 15,
            opacity: 0.5,
            pointerEvents: "none",
          }}
        >
          🔍
        </span>
        <input
          type="text"
          placeholder="Search a theme…"
          value={search}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          style={{
            width: "100%",
            padding: "11px 34px 11px 36px",
            border: `1px solid ${isActive ? "var(--accent)" : "rgba(255,255,255,0.08)"}`,
            borderRadius: 12,
            background: "rgba(255,255,255,0.03)",
            color: "var(--text-primary)",
            fontSize: 14,
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.2s ease",
            fontFamily: "inherit",
          }}
        />
        {selectedTopic && (
          <button
            onClick={handleClear}
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              fontSize: 16,
              cursor: "pointer",
              padding: 4,
              lineHeight: 1,
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
            top: "100%",
            left: 0,
            right: 0,
            maxHeight: 260,
            overflowY: "auto",
            background: "var(--bg-secondary)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            marginTop: 4,
            zIndex: 200,
            boxShadow: "0 12px 48px rgba(0,0,0,0.5)",
          }}
        >
          {filtered.map((topic) => (
            <button
              key={topic}
              onClick={() => handleSelect(topic)}
              style={{
                display: "block",
                width: "100%",
                padding: "9px 14px",
                textAlign: "left",
                border: "none",
                background: topic === selectedTopic ? "rgba(233,69,96,0.1)" : "transparent",
                color: "var(--text-primary)",
                fontSize: 13,
                cursor: "pointer",
                transition: "background 0.1s",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = topic === selectedTopic
                  ? "rgba(233,69,96,0.1)"
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
