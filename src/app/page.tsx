"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  generateCombos, loadActiveSystems, saveActiveSystems,
  type Combo, type Mode,
} from "@/lib/comboEngine";
import ModeToggle from "@/components/ModeToggle";
import SystemSelector from "@/components/SystemSelector";
import TopicSearch from "@/components/TopicSearch";
import GenreTags from "@/components/GenreTags";
import ComboCard from "@/components/ComboCard";
import StageDetail from "@/components/StageDetail";

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
  const maxW = isLandscape ? 640 : 480;

  const [mode, setMode] = useState<Mode>("single");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedCombo, setSelectedCombo] = useState<Combo | null>(null);
  const [activeSystems, setActiveSystems] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setActiveSystems(loadActiveSystems());
    setLoaded(true);
  }, []);

  const handleSystemsChange = useCallback((systems: string[]) => {
    setActiveSystems(systems);
    saveActiveSystems(systems);
  }, []);

  const handleTopicSelect = useCallback((topic: string) => {
    setSelectedTopic(topic);
    setSelectedCombo(null);
    setSelectedGenres([]);
  }, []);

  const handleTopicClear = useCallback(() => {
    setSelectedTopic(null);
    setSelectedCombo(null);
    setSelectedGenres([]);
  }, []);

  const handleModeChange = useCallback((m: Mode) => {
    setMode(m);
    setSelectedCombo(null);
    setSelectedGenres([]);
  }, []);

  const results = useMemo(() => {
    if (!selectedTopic || !loaded) return [];
    const combos = generateCombos(selectedTopic, mode, activeSystems);
    let f = combos;
    if (selectedGenres.length > 0) {
      f = f.filter((c) => selectedGenres.includes(c.genre));
    }
    const seen = new Set<string>();
    const deduped: Combo[] = [];
    for (const c of f) {
      const key = `${c.genre}|${c.system}|${c.rating}`;
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(c);
      }
    }
    return deduped.sort((a, b) => b.score - a.score).slice(0, 30);
  }, [selectedTopic, selectedGenres, mode, activeSystems, loaded]);

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
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: isLandscape ? 10 : 20,
      }}>
        <div>
          <div style={{ fontSize: 24, lineHeight: 1, marginBottom: 2 }}>🎮</div>
          <h1 style={{
            fontSize: 18,
            fontWeight: 700,
            margin: 0,
            background: "linear-gradient(135deg, #eaeaea, #a0a0b0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Game Theme Matcher
          </h1>
        </div>
        <ModeToggle mode={mode} onChange={handleModeChange} />
      </div>

      {/* Systems + Topic */}
      {loaded && (
        <SystemSelector activeSystems={activeSystems} onChange={handleSystemsChange} />
      )}
      <div style={{ marginBottom: 14 }}>
        <TopicSearch
          selectedTopic={selectedTopic}
          onSelect={handleTopicSelect}
          onClear={handleTopicClear}
        />
      </div>

      {/* Content */}
      {selectedTopic && (
        <>
          <div style={{ marginBottom: 14 }}>
            <GenreTags selected={selectedGenres} onSelect={setSelectedGenres} mode={mode} />
          </div>

          <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "0 0 10px", fontWeight: 500 }}>
            {results.length} best combination{results.length !== 1 ? "s" : ""}
          </p>

          <div
            style={{
              display: isLandscape ? "grid" : "flex",
              gridTemplateColumns: "1fr 1fr",
              flexDirection: "column",
              gap: isLandscape ? 8 : 8,
            }}
          >
            {results.map((combo, i) => (
              <ComboCard
                key={`${combo.genre}|${combo.system}|${combo.rating}`}
                combo={combo}
                onClick={() => setSelectedCombo(combo)}
                landscape={isLandscape}
                index={i}
              />
            ))}

            {results.length === 0 && (
              <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
                No combos match. Try enabling more systems or clearing genre filters.
              </div>
            )}
          </div>
        </>
      )}

      {!selectedTopic && loaded && (
        <div style={{ textAlign: "center", padding: "48px 20px", color: "var(--text-muted)" }}>
          <div style={{ fontSize: 44, marginBottom: 14, opacity: 0.6 }}>🔍</div>
          <p style={{ fontSize: 13, lineHeight: 1.7, maxWidth: 300, margin: "0 auto" }}>
            Select your available systems above, then search for a theme to find the best genre + system + rating match for your game idea.
          </p>
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: 28, fontSize: 10, color: "var(--text-muted)", opacity: 0.5 }}>
        Game Theme Matcher
      </div>
    </div>
  );
}
