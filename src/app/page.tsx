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
    const parts = genre.split(" - ");
    genreScore = Math.round(((topicData[parts[0]] ?? 0) + (topicData[parts[1]] ?? 0)) / 2);
  }
  return Math.round(
    genreScore * 0.40 +
    (SYSTEMS[system]?.[genre] ?? 0) * 0.25 +
    (SYSTEMS[system]?.[rating] ?? 0) * 0.175 +
    (topicData[rating] ?? 0) * 0.175
  );
}

function getGenreScore(topic: string, genre: string, mode: Mode): number {
  const topicData = TOPICS[topic];
  if (!topicData) return 0;
  if (mode === "single") return topicData[genre] ?? 0;
  const parts = genre.split(" - ");
  return Math.round(((topicData[parts[0]] ?? 0) + (topicData[parts[1]] ?? 0)) / 2);
}

interface Combo {
  genre: string; system: string; rating: Rating;
  score: number; genreScore: number; systemScore: number; ratingScore: number;
}

const SINGLE_GENRES = Object.keys(SINGLE_GENRE_SCORES);
const DUAL_GENRES  = Object.keys(MULTI_GENRE_SCORES);

function generateCombos(topic: string, mode: Mode, activeSystems: string[]): Combo[] {
  const genres = mode === "single" ? SINGLE_GENRES : DUAL_GENRES;
  const combos: Combo[] = [];
  for (const genre of genres) {
    const gs = getGenreScore(topic, genre, mode);
    if (gs === 0) continue;
    for (const system of activeSystems) {
      const sysGs = SYSTEMS[system]?.[genre] ?? 0;
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

// ---------- localStorage for systems ----------

const STORAGE_KEY = "game-theme-matcher-systems";

function loadActiveSystems(): string[] {
  if (typeof window === "undefined") return ALL_SYSTEMS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return ALL_SYSTEMS;
}

function saveActiveSystems(systems: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(systems));
  } catch {}
}

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
            background: "var(--bg-secondary)", border: "1px solid var(--border)",
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
      display: "flex", background: "var(--bg-secondary)",
      borderRadius: 24, border: "1px solid var(--border)",
      overflow: "hidden", flexShrink: 0,
    }}>
      <button
        onClick={() => onChange("single")}
        style={{
          padding: "6px 16px", border: "none",
          background: mode === "single" ? "var(--accent)" : "transparent",
          color: mode === "single" ? "#fff" : "var(--text-secondary)",
          fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
        }}
      >Single</button>
      <button
        onClick={() => onChange("dual")}
        style={{
          padding: "6px 16px", border: "none",
          background: mode === "dual" ? "var(--accent)" : "transparent",
          color: mode === "dual" ? "#fff" : "var(--text-secondary)",
          fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
        }}
      >Dual</button>
    </div>
  );
}

// ---------- SystemSelector ----------

function SystemSelector({
  activeSystems,
  onChange,
}: {
  activeSystems: string[];
  onChange: (systems: string[]) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const allCount = ALL_SYSTEMS.length;
  const activeCount = activeSystems.length;

  return (
    <div style={{ marginBottom: 16 }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", padding: "10px 14px",
          background: "var(--bg-secondary)",
          border: `1px solid ${expanded ? "var(--accent)" : "var(--border)"}`,
          borderRadius: 12,
          color: "var(--text-primary)",
          fontSize: 13, fontWeight: 600,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        <span>
          🕹️ Available Systems <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>
            ({activeCount}/{allCount})
          </span>
        </span>
        <span style={{ fontSize: 14, color: "var(--text-muted)", transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}>
          ▼
        </span>
      </button>

      {expanded && (
        <div style={{
          marginTop: 6,
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: 12,
          maxHeight: 300,
          overflowY: "auto",
        }}>
          {/* Select All / Deselect All */}
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <button
              onClick={() => onChange([...ALL_SYSTEMS])}
              style={{
                padding: "4px 12px", border: "1px solid var(--border)",
                borderRadius: 12, background: "transparent",
                color: "var(--text-secondary)", fontSize: 11,
                cursor: "pointer", fontWeight: 600,
              }}
            >
              Select All
            </button>
            <button
              onClick={() => onChange([])}
              style={{
                padding: "4px 12px", border: "1px solid var(--border)",
                borderRadius: 12, background: "transparent",
                color: "var(--text-secondary)", fontSize: 11,
                cursor: "pointer", fontWeight: 600,
              }}
            >
              Deselect All
            </button>
          </div>

          {/* System list */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {ALL_SYSTEMS.map((sys) => {
              const active = activeSystems.includes(sys);
              return (
                <button
                  key={sys}
                  onClick={() => {
                    if (active) {
                      onChange(activeSystems.filter((s) => s !== sys));
                    } else {
                      onChange([...activeSystems, sys]);
                    }
                  }}
                  style={{
                    padding: "5px 12px",
                    border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
                    borderRadius: 16,
                    background: active ? "var(--accent)" : "transparent",
                    color: active ? "#fff" : "var(--text-secondary)",
                    fontSize: 12,
                    fontWeight: active ? 600 : 400,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {sys}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Main Component ----------

function useOrientation() {
  const [landscape, setLandscape] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(orientation: landscape) and (max-height: 500px)");
    setLandscape(mq.matches);
    const handler = (e: MediaQueryListEvent) => setLandscape(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return landscape;
}

export default function Home() {
  const isLandscape = useOrientation();
  const [mode, setMode] = useState<Mode>("single");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedCombo, setSelectedCombo] = useState<Combo | null>(null);
  const [activeSystems, setActiveSystems] = useState<string[]>([]);
  const [systemsLoaded, setSystemsLoaded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    setActiveSystems(loadActiveSystems());
    setSystemsLoaded(true);
  }, []);

  // Save to localStorage when changed
  const handleSystemsChange = useCallback((systems: string[]) => {
    setActiveSystems(systems);
    saveActiveSystems(systems);
  }, []);

  const filteredTopics = useMemo(() => {
    const q = search.toLowerCase();
    return ALL_TOPICS.filter((t) => t.toLowerCase().includes(q));
  }, [search]);

  const results = useMemo(() => {
    if (!selectedTopic || !systemsLoaded) return [];
    const combos = generateCombos(selectedTopic, mode, activeSystems);
    let filtered = combos;
    if (selectedGenres.length > 0) {
      filtered = filtered.filter((c) => selectedGenres.includes(c.genre));
    }
    // Always sort by score desc, deduplicate
    const seen = new Set<string>();
    const deduped: Combo[] = [];
    for (const c of filtered) {
      const key = `${c.genre}|${c.system}|${c.rating}`;
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(c);
      }
    }
    return deduped.sort((a, b) => b.score - a.score).slice(0, 30);
  }, [selectedTopic, selectedGenres, mode, activeSystems, systemsLoaded]);

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
    setSelectedCombo(null);
  }, []);

  const handleModeChange = useCallback((m: Mode) => {
    setMode(m);
    setSelectedCombo(null);
    setSelectedGenres([]);
  }, []);

  const maxW = isLandscape ? 640 : 480;

  // Detail view
  if (selectedCombo) {
    return (
      <div style={{ maxWidth: maxW, margin: "0 auto", padding: isLandscape ? "12px 16px 24px" : "16px 16px 40px", minHeight: "100dvh" }}>
        <StageDetail combo={selectedCombo} onBack={() => setSelectedCombo(null)} mode={mode} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: maxW, margin: "0 auto", padding: isLandscape ? "10px 16px 24px" : "16px 16px 40px", minHeight: "100dvh" }}>
      {/* Header row with title + toggle */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: isLandscape ? 10 : 20, paddingTop: 0 }}>
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

      {/* System Selector — always visible */}
      {systemsLoaded && (
        <SystemSelector activeSystems={activeSystems} onChange={handleSystemsChange} />
      )}

      {/* Topic Search */}
      <div ref={dropdownRef} style={{ position: "relative", marginBottom: isLandscape ? 8 : 16 }}>
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

          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 12px" }}>
            {results.length} best combo{results.length !== 1 ? "s" : ""} — sorted by score
          </p>

          <div style={{ display: isLandscape ? "grid" : "flex", gridTemplateColumns: "1fr 1fr", flexDirection: "column", gap: isLandscape ? 8 : 10 }}>
            {results.map((combo, i) => (
              <button
                key={`${combo.genre}-${combo.system}-${combo.rating}-${i}`}
                onClick={() => setSelectedCombo(combo)}
                className="animate-fade-in"
                style={{
                  display: "block", width: "100%", textAlign: "left",
                  background: "var(--bg-card)",
                  border: `1px solid ${combo.score >= 80 ? "rgba(46, 213, 115, 0.3)" : "var(--border)"}`,
                  borderRadius: isLandscape ? 10 : 14, padding: isLandscape ? "10px 12px" : "14px 16px",
                  cursor: "pointer", transition: "all 0.2s",
                  fontFamily: "inherit", fontSize: "inherit",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: isLandscape ? 4 : 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: isLandscape ? 13 : 15, fontWeight: 700, color: "var(--text-primary)" }}>
                      {combo.genre}
                    </span>
                    <RatingBadge rating={combo.rating} />
                  </div>
                  <div style={{ fontSize: isLandscape ? 16 : 20, fontWeight: 800, color: combo.score >= 80 ? "var(--success)" : combo.score >= 60 ? "var(--warning)" : "var(--accent)" }}>
                    {combo.score}%
                  </div>
                </div>
                <div style={{ fontSize: isLandscape ? 11 : 13, color: "var(--accent)", fontWeight: 500, marginBottom: isLandscape ? 6 : 10 }}>
                  🕹️ {combo.system}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: isLandscape ? 2 : 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: isLandscape ? 10 : 11, color: "var(--text-muted)", minWidth: isLandscape ? 36 : 48 }}>Genre</span>
                    <div style={{ flex: 1 }}><ScoreBar score={combo.genreScore} /></div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: isLandscape ? 10 : 11, color: "var(--text-muted)", minWidth: isLandscape ? 36 : 48 }}>System</span>
                    <div style={{ flex: 1 }}><ScoreBar score={combo.systemScore} /></div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: isLandscape ? 10 : 11, color: "var(--text-muted)", minWidth: isLandscape ? 36 : 48 }}>Rating</span>
                    <div style={{ flex: 1 }}><ScoreBar score={combo.ratingScore} /></div>
                  </div>
                </div>
              </button>
            ))}
            {results.length === 0 && (
              <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
                No combos match your filters. Try enabling more systems or clearing genre filters.
              </div>
            )}
          </div>
        </>
      )}

      {!selectedTopic && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <p style={{ fontSize: 14, lineHeight: 1.6 }}>
            Select which systems are available above, then search for a theme to find the best genre + system + rating combinations.
          </p>
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: 32, fontSize: 11, color: "var(--text-muted)" }}>
        Game Theme Matcher
      </div>
    </div>
  );
}
