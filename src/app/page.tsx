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
import { Gamepad2 } from "lucide-react";

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
  const maxW = isLandscape ? "max-w-[640px]" : "max-w-[480px]";

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
      <div className={`${maxW} mx-auto min-h-dvh ${isLandscape ? "px-4 py-3 pb-6" : "px-4 py-4 pb-10"}`}>
        <StageDetail combo={selectedCombo} onBack={() => setSelectedCombo(null)} mode={mode} />
      </div>
    );
  }

  return (
    <div className={`${maxW} mx-auto min-h-dvh ${isLandscape ? "px-4 py-2.5 pb-6" : "px-4 py-4 pb-10"}`}>
      {/* Header */}
      <div className={`flex justify-between items-start ${isLandscape ? "mb-2.5" : "mb-5"}`}>
        <div className="flex items-center gap-2">
          <div className="text-2xl">
            <Gamepad2 className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
            Game Theme Matcher
          </h1>
        </div>
        <ModeToggle mode={mode} onChange={handleModeChange} />
      </div>

      {/* Systems + Topic */}
      {loaded && (
        <SystemSelector activeSystems={activeSystems} onChange={handleSystemsChange} />
      )}
      <div className="mb-3.5">
        <TopicSearch
          selectedTopic={selectedTopic}
          onSelect={handleTopicSelect}
          onClear={handleTopicClear}
        />
      </div>

      {/* Content */}
      {selectedTopic && (
        <>
          <div className="mb-3.5">
            <GenreTags selected={selectedGenres} onSelect={setSelectedGenres} mode={mode} />
          </div>

          <p className="text-[11px] text-muted-foreground mb-2.5 font-medium">
            {results.length} best combination{results.length !== 1 ? "s" : ""}
          </p>

          <div
            className={`${isLandscape ? "grid grid-cols-2" : "flex flex-col"} gap-2`}
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
              <div className="text-center py-10 text-muted-foreground col-span-2">
                No combos match. Try enabling more systems or clearing genre filters.
              </div>
            )}
          </div>
        </>
      )}

      {!selectedTopic && loaded && (
        <div className="text-center py-12 px-5 text-muted-foreground">
          <div className="text-4xl mb-3.5 opacity-60">🔍</div>
          <p className="text-[13px] leading-relaxed max-w-[300px] mx-auto">
            Select your available systems above, then search for a theme to find the best genre + system + rating match for your game idea.
          </p>
        </div>
      )}

      <div className="text-center mt-7 text-[10px] text-muted-foreground/50">
        Game Theme Matcher
      </div>
    </div>
  );
}
