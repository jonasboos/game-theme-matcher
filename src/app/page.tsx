"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  ALL_TOPICS, ALL_RATINGS, ALL_SYSTEMS,
  SINGLE_GENRE_SCORES, MULTI_GENRE_SCORES, TOPICS, SYSTEMS,
  type Rating, type StageScores
} from "@/lib/data";

type Mode = "single" | "dual";

// ---------- helpers ----------

function getComboScore(topic: string, genre: string, system: string, rating: Rating, mode: Mode): number {
  const topicData = TOPICS[topic];
  if (!topicData) return 0;

  let genreScore: number;
  if (mode === "single") {
    genreScore = topicData[genre] ?? 0;
  } else {
    // dual genre: take the average of the two constituent genres
    const parts = genre.split(" - ");
    const a = topicData[parts[0]] ?? 0;
    const b = topicData[parts[1]] ?? 0;
    genreScore = Math.round((a + b) / 2);
  }

  const systemGenreScore = SYSTEMS[system]?.[genre] ?? 0;
  const systemRatingScore = SYSTEMS[system]?.[rating] ?? 0;
  const topicRatingScore = topicData[rating] ?? 0;

  const score = genreScore * 0.40 + systemGenreScore * 0.25 + systemRatingScore * 0.175 + topicRatingScore * 0.175;
  return Math.round(score);
}

function getGenreScore(topic: string, genre: string, mode: Mode): number {
  const topicData = TOPICS[topic];
  if (!topicData) return 0;
  if (mode === "single") return topicData[genre] ?? 0;
  const parts = genre.split(" - ");
  const a = topicData[parts[0]] ?? 0;
  const b = topicData[parts[1]] ?? 0;
  return Math.round((a + b) / 2);
}

function getSystemGenreScore(system: string, genre: string): number {
  return SYSTEMS[system]?.[genre] ?? 0;
}

interface Combo {
  genre: string; system: string; rating: Rating;
  score: number; genreScore: number; systemScore: number; ratingScore: number;
}

const SINGLE_GENRES = Object.keys(SINGLE_GENRE_SCORES);
const DUAL_GENRES  = Object.keys(MULTI_GENRE_SCORES);

function generateCombos(topic: string, mode: Mode): Combo[] {
  const genres = mode === "single" ? SINGLE_GENRES : DUAL_GENRES;
  const combos: Combo[] = [];
  for (const genre of genres) {
    const gs = getGenreScore(topic, genre, mode);
    if (gs === 0) continue;
    for (const system of ALL_SYSTEMS) {
      const sysGs = getSystemGenreScore(system, genre);
      if (sysGs === 0) continue;
      for (const rating of ALL_RATINGS) {
        const score = getComboScore(topic, genre, system, rating, mode);
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

// ---------- stage constants ----------

const STAGE_LABELS: (keyof StageScores)[] = [
  "Stage 1: Engine", "Stage 1: Gameplay", "Stage 1: Story/Quests",
  "Stage 2: Dialogues", "Stage 2: Level Design", "Stage 2: AI",
  "Stage 3: World Design", "Stage 3: Graphics", "Stage 3: Sound",
];

const STAGE_GROUPS = [
  { label: "Stage 1", stages: STAGE_LABELS.slice(0, 3) },
  { label: "Stage 2", stages: STAGE_LABELS.slice(3, 6) },
  { label: "Stage 3", stages: STAGE_LABELS.slice(6, 9) },
];

// ---------- StageDetail ----------

function StageDetail({ combo, onBack, mode }: { combo: Combo; onBack: () => void; mode: Mode }) {
  const scoreMap = mode === "single"
    ? SINGLE_GENRE_SCORES[combo.genre]
    : MULTI_GENRE_SCORES[combo.genre];
  const stages = scoreMap ?? {} as StageScores;

  return (
    <div className="animate-slide-up" style={{ padding: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button
          onClick={onBack}
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
            borderRadius: 12, width: 40, height: 40,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", fontSize: 18, color: "var(--text-primary)", flexShrink: 0,
          }}
        >←</button>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>
            {combo.genre}
          </div>
          <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 500 }}>
            🕹️ {combo.system}
          </div>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: "var(--success)" }}>
            {combo.score}%
          </div>
          <RatingBadge rating={combo.rating} />
        </div>
      </div>

      {STAGE_GROUPS.map((group) => (
        <div key={group.label} style={{ marginBottom: 16 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: 1.5, color: "var(--text-muted)", marginBottom: 8,
          }}>
            {group.label}
          </div>
          <div style={{
            background: "var(--bg-secondary)", borderRadius: 14,
            border: "1px solid var(--border)", overflow: "hidden",
          }}>
            {group.stages.map((stage) => {
              const score = stages[stage] ?? 0;
              const color = score >= 80 ? "#2ed573" : score >= 60 ? "#f9ca24" : score >= 40 ? "#ffa502" : "#e94560";
              const shortName = stage.replace(/^Stage \d: /, "");
              return (
                <div key={stage} style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500 }}>{shortName}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color }}>{score}%</span>
                  </div>
                  <div style={{ height: 8, background: "var(--bg-primary)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{
                      width: `${score}%`, height: "100%",
                      background: `linear-gradient(90deg, ${color}, ${color}88)`,
                      borderRadius: 4, transition: "width 0.6s ease-out",
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: 14, padding: 16, marginTop: 4,
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>
          Topic Fit Summary
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <SummaryRow label="Genre Fit" score={combo.genreScore} />
          <SummaryRow label="System Fit" score={combo.systemScore} />
          <SummaryRow label="Rating Fit" score={combo.ratingScore} />
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, score }: { label: string; score: number }) {
  const color = score >= 80 ? "#2ed573" : "#ffa502";
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 700, color }}>{score}%</span>
    </div>
  );
}

function RatingBadge({ rating }: { rating: Rating }) {
  const colors: Record<Rating, { bg: string; text: string }> = {
    Y: { bg: "#2ed573", text: "#0f0f1a" },
    E: { bg: "#f9ca24", text: "#0f0f1a" },
    M: { bg: "#e94560", text: "#fff" },
  };
  const c = colors[rating];
  return (
    <span style={{
      display: "inline-block", padding: "2px 8px", borderRadius: 4,
      fontSize: 11, fontWeight: 700, background: c.bg,
      color: c.text, letterSpacing: 1,
    }}>
      {rating}
    </span>
  );
}

function ScoreBar({ score }: { score: number }) {
  const pct = Math.min(score, 100);
  const color = score >= 80 ? "#2ed573" : score >= 60 ? "#f9ca24" : score >= 40 ? "#ffa502" : "#e94560";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          width: `${pct}%`, height: "100%", background: color,
          borderRadius: 3, transition: "width 0.5s ease-out",
        }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color, minWidth: 30, textAlign: "right" }}>
        {score}%
      </span>
    </div>
  );
}

function GenreTags({ selected, onSelect, mode }: { selected: string[]; onSelect: (g: string[]) => void; mode: Mode }) {
  const genres = mode === "single" ? SINGLE_GENRES : DUAL_GENRES;
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

function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div style={{
      display: "flex",
      background: "var(--bg-secondary)",
      borderRadius: 24,
      border: "1px solid var(--border)",
      overflow: "hidden",
      flexShrink: 0,
    }}>
      <button
        onClick={() => onChange("single")}
        style={{
          padding: "6px 16px",
          border: "none",
          background: mode === "single" ? "var(--accent)" : "transparent",
          color: mode === "single" ? "#fff" : "var(--text-secondary)",
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        Single
      </button>
      <button
        onClick={() => onChange("dual")}
        style={{
          padding: "6px 16px",
          border: "none",
          background: mode === "dual" ? "var(--accent)" : "transparent",
          color: mode === "dual" ? "#fff" : "var(--text-secondary)",
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        Dual
      </button>
    </div>
  );
}

type SortKey = "score" | "genre" | "system" | "rating";

export default function Home() {
  const [mode, setMode] = useState<Mode>("single");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [minScore, setMinScore] = useState(0);
  const [selectedCombo, setSelectedCombo] = useState<Combo | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredTopics = useMemo(() => {
    const q = search.toLowerCase();
    return ALL_TOPICS.filter((t) => t.toLowerCase().includes(q));
  }, [search]);

  const results = useMemo(() => {
    if (!selectedTopic) return [];
    const combos = generateCombos(selectedTopic, mode);
    let filtered = combos.filter((c) => c.score >= minScore);
    if (selectedGenres.length > 0) {
      filtered = filtered.filter((c) => selectedGenres.includes(c.genre));
    }
    const seen = new Set<string>();
    const deduped: Combo[] = [];
    for (const c of filtered) {
      const key = `${c.genre}|${c.system}|${c.rating}`;
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(c);
      }
    }
    deduped.sort((a, b) => {
      if (sortKey === "score") return b.score - a.score;
      if (sortKey === "genre") return a.genre.localeCompare(b.genre);
      if (sortKey === "system") return a.system.localeCompare(b.system);
      return a.rating.localeCompare(b.rating);
    });
    return deduped.slice(0, 30);
  }, [selectedTopic, selectedGenres, sortKey, minScore, mode]);

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
    setSelectedCombo(null);
  }, []);

  const handleModeChange = useCallback((m: Mode) => {
    setMode(m);
    setSelectedCombo(null);
    setSelectedGenres([]);
  }, []);

  // Detail view
  if (selectedCombo) {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "16px 16px 40px", minHeight: "100dvh" }}>
        <StageDetail combo={selectedCombo} onBack={() => setSelectedCombo(null)} mode={mode} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "16px 16px 40px", minHeight: "100dvh" }}>
      {/* Header row with title + toggle */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, paddingTop: 8 }}>
        <div>
          <div style={{ fontSize: 28, marginBottom: 2 }}>🎮</div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
            Game Theme Matcher
          </h1>
          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "2px 0 0" }}>
            {mode === "single" ? "Single genre combos" : "Dual genre combos"}
          </p>
        </div>
        <ModeToggle mode={mode} onChange={handleModeChange} />
      </div>

      {/* Topic Search */}
      <div ref={dropdownRef} style={{ position: "relative", marginBottom: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>
          Select a Theme / Topic
        </label>
        <input
          type="text"
          placeholder="Search themes... (e.g. Fantasy, Horror, Cyberpunk)"
          value={search}
          onFocus={() => setShowDropdown(true)}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowDropdown(true);
          }}
          style={{
            width: "100%", padding: "12px 14px",
            border: `1px solid ${showDropdown ? "var(--accent)" : "var(--border)"}`,
            borderRadius: 12, background: "var(--bg-secondary)",
            color: "var(--text-primary)", fontSize: 15,
            outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
          }}
        />
        {selectedTopic && (
          <button
            onClick={() => {
              setSelectedTopic(null);
              setSearch("");
              setMinScore(0);
              setSelectedCombo(null);
            }}
            style={{
              position: "absolute", right: 12, top: 38,
              background: "none", border: "none",
              color: "var(--text-muted)", fontSize: 18,
              cursor: "pointer", padding: 4,
            }}
          >✕</button>
        )}
        {showDropdown && filteredTopics.length > 0 && (
          <div style={{
            position: "absolute", top: "100%", left: 0, right: 0,
            maxHeight: 280, overflowY: "auto",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)", borderRadius: 12,
            marginTop: 4, zIndex: 100,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}>
            {filteredTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => handleSelect(topic)}
                style={{
                  display: "block", width: "100%", padding: "10px 14px",
                  textAlign: "left", border: "none",
                  background: topic === selectedTopic ? "var(--bg-card)" : "transparent",
                  color: "var(--text-primary)", fontSize: 14,
                  cursor: "pointer", transition: "background 0.15s",
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
              Filter by Genre {mode === "dual" && <span style={{ color: "var(--accent)", fontSize: 11 }}>(dual combos)</span>}
            </label>
            <GenreTags selected={selectedGenres} onSelect={setSelectedGenres} mode={mode} />
          </div>

          {/* Min score slider */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>
              Min Score: {minScore}%
            </label>
            <input
              type="range" min={0} max={100} step={10} value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--accent)" }}
            />
          </div>

          {/* Sort */}
          <div style={{ display: "flex", gap: 6, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
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
                  fontSize: 12, fontWeight: sortKey === k ? 600 : 400,
                  cursor: "pointer", textTransform: "capitalize",
                }}
              >
                {k}
              </button>
            ))}
          </div>

          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 12px" }}>
            {results.length} best combo{results.length !== 1 ? "s" : ""} found — tap one to see details
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {results.map((combo, i) => (
              <button
                key={`${combo.genre}-${combo.system}-${combo.rating}-${i}`}
                onClick={() => setSelectedCombo(combo)}
                className="animate-fade-in"
                style={{
                  display: "block", width: "100%", textAlign: "left",
                  background: "var(--bg-card)",
                  border: `1px solid ${combo.score >= 80 ? "rgba(46, 213, 115, 0.3)" : "var(--border)"}`,
                  borderRadius: 14, padding: "14px 16px",
                  cursor: "pointer", transition: "all 0.2s",
                  fontFamily: "inherit", fontSize: "inherit",
                }}
              >
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
                <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 500, marginBottom: 10 }}>
                  🕹️ {combo.system}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", minWidth: 48 }}>Genre</span>
                    <div style={{ flex: 1 }}><ScoreBar score={combo.genreScore} /></div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", minWidth: 48 }}>System</span>
                    <div style={{ flex: 1 }}><ScoreBar score={combo.systemScore} /></div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", minWidth: 48 }}>Rating</span>
                    <div style={{ flex: 1 }}><ScoreBar score={combo.ratingScore} /></div>
                  </div>
                </div>
              </button>
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
            Search for a theme above and discover the best game genre, system, and age rating combinations.
          </p>
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: 32, fontSize: 11, color: "var(--text-muted)" }}>
        Game Theme Matcher
      </div>
    </div>
  );
}
