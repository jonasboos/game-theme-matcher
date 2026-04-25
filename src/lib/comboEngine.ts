/** Scoring engine — extracts combo calculation from the page */
import {
  TOPICS, SYSTEMS, ALL_SYSTEMS, ALL_RATINGS,
  SINGLE_GENRE_SCORES, MULTI_GENRE_SCORES,
  type Rating, type StageScores,
} from "./data";

export type Mode = "single" | "dual";

export interface Combo {
  genre: string;
  system: string;
  rating: Rating;
  score: number;
  genreScore: number;
  systemScore: number;
  ratingScore: number;
}

export const SINGLE_GENRES = Object.keys(SINGLE_GENRE_SCORES);
export const DUAL_GENRES = Object.keys(MULTI_GENRE_SCORES);

export const STAGE_LABELS: (keyof StageScores)[] = [
  "Stage 1: Engine", "Stage 1: Gameplay", "Stage 1: Story/Quests",
  "Stage 2: Dialogues", "Stage 2: Level Design", "Stage 2: AI",
  "Stage 3: World Design", "Stage 3: Graphics", "Stage 3: Sound",
];

export const STAGE_GROUPS = [
  { label: "Stage 1", stages: STAGE_LABELS.slice(0, 3) },
  { label: "Stage 2", stages: STAGE_LABELS.slice(3, 6) },
  { label: "Stage 3", stages: STAGE_LABELS.slice(6, 9) },
];

/** Score for a genre w.r.t. the chosen topic */
export function getGenreScore(topic: string, genre: string, mode: Mode): number {
  const t = TOPICS[topic];
  if (!t) return 0;
  if (mode === "single") return t[genre] ?? 0;
  const [a, b] = genre.split(" - ");
  return Math.round(((t[a] ?? 0) + (t[b] ?? 0)) / 2);
}

/** Combined weighted score for one (genre, system, rating) tuple */
export function getComboScore(
  topic: string,
  genre: string,
  system: string,
  rating: Rating,
  mode: Mode,
): number {
  const t = TOPICS[topic];
  if (!t) return 0;
  const gs = mode === "single"
    ? (t[genre] ?? 0)
    : Math.round(((t[genre.split(" - ")[0]] ?? 0) + (t[genre.split(" - ")[1]] ?? 0)) / 2);
  return Math.round(
    gs * 0.40 +
    (SYSTEMS[system]?.[genre] ?? 0) * 0.25 +
    (SYSTEMS[system]?.[rating] ?? 0) * 0.175 +
    (t[rating] ?? 0) * 0.175,
  );
}

/** Generate all valid combos, sorted by score descending, top 50 */
export function generateCombos(topic: string, mode: Mode, activeSystems: string[]): Combo[] {
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
            genre, system, rating, score,
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

/** Get stage scores for a genre */
export function getStageScores(genre: string, mode: Mode): StageScores {
  const map = mode === "single" ? SINGLE_GENRE_SCORES : MULTI_GENRE_SCORES;
  return map[genre] ?? ({} as StageScores);
}

/** Load active systems from localStorage */
export function loadActiveSystems(): string[] {
  if (typeof window === "undefined") return ALL_SYSTEMS;
  try {
    const raw = localStorage.getItem("game-theme-matcher-systems");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* ignore */ }
  return ALL_SYSTEMS;
}

/** Save active systems to localStorage */
export function saveActiveSystems(systems: string[]) {
  try {
    localStorage.setItem("game-theme-matcher-systems", JSON.stringify(systems));
  } catch { /* ignore */ }
}
