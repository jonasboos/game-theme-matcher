"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  ALL_TOPICS, ALL_SYSTEMS, ALL_RATINGS,
  SINGLE_GENRE_SCORES, TOPICS, SYSTEMS,
  type Rating
} from "@/lib/data";

// Calculate combined score for a genre + system + rating combo
function getComboScore(topic: string, genre: string, system: string, rating: Rating): number {
  const topicData = TOPICS[topic];
  if (!topicData) return 0;

  const genreScore = topicData[genre] ?? 0;
  const systemGenreScore = SYSTEMS[system]?.[genre] ?? 0;
  const systemRatingScore = SYSTEMS[system]?.[rating] ?? 0;
  const topicRatingScore = topicData[rating] ?? 0;

  // Weighted: genre fit (40%) + system fit (35%) + rating fit (25%)
  const score = genreScore * 0.40 + systemGenreScore * 0.25 + systemRatingScore * 0.175 + topicRatingScore * 0.175;
  return Math.round(score);
}

function getGenreScore(topic: string, genre: string): number {
  return TOPICS[topic]?.[genre] ?? 0;
}

function getSystemGenreScore(system: string, genre: string): number {
  return SYSTEMS[system]?.[genre] ?? 0;
}

function getRatingScore(topic: string, system: string, rating: Rating): number {
  return ((TOPICS[topic]?.[rating] ?? 0) + (SYSTEMS[system]?.[rating] ?? 0)) / 2;
}

// All possible combos
const ALL_GENRES = Object.keys(SINGLE_GENRE_SCORES);

function generateCombos(topic: string): Array<{
  genre: string; system: string; rating: Rating;
  score: number; genreScore: number; systemScore: number; ratingScore: number;
}> {
  const combos: Array<any> = [];
  for (const genre of ALL_GENRES) {
    const gs = getGenreScore(topic, genre);
    if (gs === 0) continue;
    for (const system of ALL_SYSTEMS) {
      const sysGs = getSystemGenreScore(system, genre);
      if (sysGs === 0) continue;
      for (const rating of ALL_RATINGS) {
        const score = getComboScore(topic, genre, system, rating);
        if (score > 0) {
          combos.push({
            genre, system, rating,
            score,
            genreScore: gs,
            systemScore: sysGs,
            ratingScore: Math.round(((TOPICS[topic]?.[rating] ?? 0) + (SYSTEMS[system]?.[rating] ?? 0)) / 2),
          });
        }
      }
    }
  }
  return combos.sort((a, b) => b.score - a.score).slice(0, 50);
}

function RatingBadge({ rating }: { rating: Rating }) {
  const colors: Record<Rating, { bg: string; text: string }> = {
    Y: { bg: "#2ed573", text: "#0f0f1a" },
    E: { bg: "#f9ca24", text: "#0f0f1a" },
    M: { bg: "#e94560", text: "#fff" },
  };
  const c = colors[rating];
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 700,
        background: c.bg,
        color: c.text,
        letterSpacing: 1,
      }}
    >
      {rating}
    </span>
  );
}

function ScoreBar({ score }: { score: number }) {
  const pct = Math.min(score, 100);
  const color = score >= 80 ? "#2ed573" : score >= 60 ? "#f9ca24" : score >= 40 ? "#ffa502" : "#e94560";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          flex: 1,
          height: 6,
          background: "var(--border)",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: color,
            borderRadius: 3,
            transition: "width 0.5s ease-out",
          }}
        />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color: color, minWidth: 30, textAlign: "right" }}>
        {score}%
      </span>
    </div>
  );
}

function GenreTags({ selected, onSelect }: { selected: string[]; onSelect: (g: string[]) => void }) {
  const genres = ALL_GENRES;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {genres.map((g) => {
        const active = selected.includes(g);
        return (
          <button
            key={g}
            onClick={() => {
              if (active) onSelect(selected.filter((x) => x !== g));
              else onSelect([...selected, g]);
            }}
            style={{
              padding: "6px 14px",
              border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
              borderRadius: 20,
              background: active ? "var(--accent)" : "transparent",
              color: active ? "#fff" : "var(--text-secondary)",
              fontSize: 13,
              fontWeight: active ? 600 : 400,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {g}
          </button>
        );
      })}
    </div>
  );
}

type SortKey = "score" | "genre" | "system" | "rating";

export default function Home() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [minScore, setMinScore] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredTopics = useMemo(() => {
    const q = search.toLowerCase();
    return ALL_TOPICS.filter((t) => t.toLowerCase().includes(q));
  }, [search]);

  const results = useMemo(() => {
    if (!selectedTopic) return [];
    const combos = generateCombos(selectedTopic);
    let filtered = combos.filter((c) => c.score >= minScore);
    if (selectedGenres.length > 0) {
      filtered = filtered.filter((c) => selectedGenres.includes(c.genre));
    }
    // Deduplicate: keep best scoring per unique (genre, system, rating)
    const seen = new Set<string>();
    const deduped: typeof filtered = [];
    for (const c of filtered) {
      const key = `${c.genre}|${c.system}|${c.rating}`;
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(c);
      }
    }
    // Sort
    deduped.sort((a, b) => {
      if (sortKey === "score") return b.score - a.score;
      if (sortKey === "genre") return a.genre.localeCompare(b.genre);
      if (sortKey === "system") return a.system.localeCompare(b.system);
      return a.rating.localeCompare(b.rating);
    });
    return deduped.slice(0, 30);
  }, [selectedTopic, selectedGenres, sortKey, minScore]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = useCallback((topic: string) => {
    setSelectedTopic(topic);
    setSearch(topic);
    setShowDropdown(false);
    setMinScore(0);
  }, []);

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "16px 16px 40px", minHeight: "100dvh" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 24, paddingTop: 8 }}>
        <div style={{ fontSize: 28, marginBottom: 4 }}>🎮</div>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
          Game Theme Matcher
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "4px 0 0" }}>
          Find the perfect combo for your game idea
        </p>
      </div>

      {/* Topic Search */}
      <div ref={dropdownRef} style={{ position: "relative", marginBottom: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>
          Select a Theme / Topic
        </label>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search themes... (e.g. Fantasy, Horror, Cyberpunk)"
          value={search}
          onFocus={() => setShowDropdown(true)}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowDropdown(true);
          }}
          style={{
            width: "100%",
            padding: "12px 14px",
            border: `1px solid ${showDropdown ? "var(--accent)" : "var(--border)"}`,
            borderRadius: 12,
            background: "var(--bg-secondary)",
            color: "var(--text-primary)",
            fontSize: 15,
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.2s",
          }}
        />
        {selectedTopic && (
          <button
            onClick={() => {
              setSelectedTopic(null);
              setSearch("");
              setMinScore(0);
            }}
            style={{
              position: "absolute",
              right: 12,
              top: 38,
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              fontSize: 18,
              cursor: "pointer",
              padding: 4,
            }}
          >
            ✕
          </button>
        )}
        {showDropdown && filteredTopics.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              maxHeight: 280,
              overflowY: "auto",
              background: "var(--bg-secondary)",
              border: `1px solid var(--border)`,
              borderRadius: 12,
              marginTop: 4,
              zIndex: 100,
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            {filteredTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => handleSelect(topic)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px 14px",
                  textAlign: "left",
                  border: "none",
                  background: topic === selectedTopic ? "var(--bg-card)" : "transparent",
                  color: "var(--text-primary)",
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-card)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = topic === selectedTopic ? "var(--bg-card)" : "transparent")}
              >
                {topic}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedTopic && (
        <>
          {/* Genre filter */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>
              Filter by Genre (optional)
            </label>
            <GenreTags selected={selectedGenres} onSelect={setSelectedGenres} />
          </div>

          {/* Min score slider */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>
              Min Score: {minScore}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              step={10}
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--accent)" }}
            />
          </div>

          {/* Sort */}
          <div style={{ display: "flex", gap: 6, marginBottom: 16, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600 }}>Sort:</span>
            {(["score", "genre", "system", "rating"] as SortKey[]).map((k) => (
              <button
                key={k}
                onClick={() => setSortKey(k)}
                style={{
                  padding: "4px 12px",
                  border: `1px solid ${sortKey === k ? "var(--accent)" : "var(--border)"}`,
                  borderRadius: 16,
                  background: sortKey === k ? "var(--accent)" : "transparent",
                  color: sortKey === k ? "#fff" : "var(--text-secondary)",
                  fontSize: 12,
                  fontWeight: sortKey === k ? 600 : 400,
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                {k}
              </button>
            ))}
          </div>

          {/* Results count */}
          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 12px" }}>
            {results.length} best combo{results.length !== 1 ? "s" : ""} found
          </p>

          {/* Results List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {results.map((combo, i) => (
              <div
                key={`${combo.genre}-${combo.system}-${combo.rating}-${i}`}
                className="animate-fade-in"
                style={{
                  background: "var(--bg-card)",
                  border: `1px solid ${combo.score >= 80 ? "rgba(46, 213, 115, 0.3)" : "var(--border)"}`,
                  borderRadius: 14,
                  padding: "14px 16px",
                  transition: "all 0.2s",
                }}
              >
                {/* Row 1: Genre + Rating + Score */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>
                      {combo.genre}
                    </span>
                    <RatingBadge rating={combo.rating} />
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: combo.score >= 80 ? "var(--success)" : combo.score >= 60 ? "var(--warning)" : "var(--accent)" }}>
                    {combo.score}%
                  </div>
                </div>

                {/* Row 2: System */}
                <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 500, marginBottom: 10 }}>
                  🕹️ {combo.system}
                </div>

                {/* Score breakdown */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", minWidth: 48 }}>Genre</span>
                    <div style={{ flex: 1 }}>
                      <ScoreBar score={combo.genreScore} />
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", minWidth: 48 }}>System</span>
                    <div style={{ flex: 1 }}>
                      <ScoreBar score={combo.systemScore} />
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", minWidth: 48 }}>Rating</span>
                    <div style={{ flex: 1 }}>
                      <ScoreBar score={combo.ratingScore} />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {results.length === 0 && (
              <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
                No combos match your filters. Try lowering the minimum score or clearing genre filters.
              </div>
            )}
          </div>
        </>
      )}

      {!selectedTopic && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <p style={{ fontSize: 14, lineHeight: 1.6 }}>
            Search for a theme above — like Fantasy, Horror, Racing, or Space — and discover the best game genre, system, and age rating combinations.
          </p>
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: 32, fontSize: 11, color: "var(--text-muted)" }}>
        Game Theme Matcher
      </div>
    </div>
  );
}
