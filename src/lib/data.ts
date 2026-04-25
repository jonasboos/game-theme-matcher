// Game Theme Matcher - Data definitions
// All values are percentages (0-100) representing compatibility

export type Genre = string;
export type System = string;
export type Topic = string;
export type Rating = "Y" | "E" | "M";

export interface StageScores {
  "Stage 1: Engine": number;
  "Stage 1: Gameplay": number;
  "Stage 1: Story/Quests": number;
  "Stage 2: Dialogues": number;
  "Stage 2: Level Design": number;
  "Stage 2: AI": number;
  "Stage 3: World Design": number;
  "Stage 3: Graphics": number;
  "Stage 3: Sound": number;
}

export interface GenreData {
  name: string;
  scores: StageScores;
}

export interface TopicData {
  name: string;
  genreScores: Record<string, number>;
  ratingScores: Record<Rating, number>;
}

export interface SystemData {
  name: string;
  genreScores: Record<string, number>;
  ratingScores: Record<Rating, number>;
}

export interface ResultCombo {
  genre: string;
  system: string;
  rating: Rating;
  score: number;
  genreScore: number;
  systemScore: number;
  ratingScore: number;
}

// === GENRES ===
const GENRE_NAMES = ["Action", "Adventure", "RPG", "Simulation", "Strategy", "Casual"];

const SINGLE_GENRE_SCORES: Record<string, StageScores> = {
  Action:       { "Stage 1: Engine": 100, "Stage 1: Gameplay": 90,  "Stage 1: Story/Quests": 10,  "Stage 2: Dialogues": 0,   "Stage 2: Level Design": 90,  "Stage 2: AI": 100, "Stage 3: World Design": 20, "Stage 3: Graphics": 100, "Stage 3: Sound": 90 },
  Adventure:    { "Stage 1: Engine": 10,  "Stage 1: Gameplay": 20,  "Stage 1: Story/Quests": 100, "Stage 2: Dialogues": 100, "Stage 2: Level Design": 20,  "Stage 2: AI": 10,  "Stage 3: World Design": 100,"Stage 3: Graphics": 90,  "Stage 3: Sound": 20 },
  RPG:          { "Stage 1: Engine": 10,  "Stage 1: Gameplay": 90,  "Stage 1: Story/Quests": 100, "Stage 2: Dialogues": 100, "Stage 2: Level Design": 90,  "Stage 2: AI": 20,  "Stage 3: World Design": 100,"Stage 3: Graphics": 90,  "Stage 3: Sound": 20 },
  Simulation:   { "Stage 1: Engine": 90,  "Stage 1: Gameplay": 100, "Stage 1: Story/Quests": 20,  "Stage 2: Dialogues": 10,  "Stage 2: Level Design": 90,  "Stage 2: AI": 100, "Stage 3: World Design": 20, "Stage 3: Graphics": 100, "Stage 3: Sound": 90 },
  Strategy:     { "Stage 1: Engine": 90,  "Stage 1: Gameplay": 100, "Stage 1: Story/Quests": 20,  "Stage 2: Dialogues": 10,  "Stage 2: Level Design": 100, "Stage 2: AI": 90,  "Stage 3: World Design": 100,"Stage 3: Graphics": 20,  "Stage 3: Sound": 90 },
  Casual:       { "Stage 1: Engine": 100, "Stage 1: Gameplay": 100, "Stage 1: Story/Quests": 10,  "Stage 2: Dialogues": 10,  "Stage 2: Level Design": 100, "Stage 2: AI": 0,   "Stage 3: World Design": 10, "Stage 3: Graphics": 100, "Stage 3: Sound": 90 },
};

const MULTI_GENRE_SCORES: Record<string, StageScores> = {
  "Action - Adventure":    { "Stage 1: Engine": 90,  "Stage 1: Gameplay": 20,  "Stage 1: Story/Quests": 20, "Stage 2: Dialogues": 10,  "Stage 2: Level Design": 20,  "Stage 2: AI": 90, "Stage 3: World Design": 20, "Stage 3: Graphics": 90,  "Stage 3: Sound": 20 },
  "Action - RPG":          { "Stage 1: Engine": 90,  "Stage 1: Gameplay": 90,  "Stage 1: Story/Quests": 20, "Stage 2: Dialogues": 10,  "Stage 2: Level Design": 90,  "Stage 2: AI": 90, "Stage 3: World Design": 20, "Stage 3: Graphics": 90,  "Stage 3: Sound": 20 },
  "Action - Simulation":   { "Stage 1: Engine": 90,  "Stage 1: Gameplay": 90,  "Stage 1: Story/Quests": 10, "Stage 2: Dialogues": 0,   "Stage 2: Level Design": 90,  "Stage 2: AI": 100,"Stage 3: World Design": 20, "Stage 3: Graphics": 100, "Stage 3: Sound": 90 },
  "Action - Strategy":     { "Stage 1: Engine": 90,  "Stage 1: Gameplay": 90,  "Stage 1: Story/Quests": 10, "Stage 2: Dialogues": 0,   "Stage 2: Level Design": 90,  "Stage 2: AI": 90, "Stage 3: World Design": 20, "Stage 3: Graphics": 90,  "Stage 3: Sound": 90 },
  "Action - Casual":       { "Stage 1: Engine": 20,  "Stage 1: Gameplay": 90,  "Stage 1: Story/Quests": 10, "Stage 2: Dialogues": 0,   "Stage 2: Level Design": 90,  "Stage 2: AI": 20, "Stage 3: World Design": 10, "Stage 3: Graphics": 100, "Stage 3: Sound": 90 },
  "Adventure - Action":    { "Stage 1: Engine": 20,  "Stage 1: Gameplay": 20,  "Stage 1: Story/Quests": 90, "Stage 2: Dialogues": 20,  "Stage 2: Level Design": 20,  "Stage 2: AI": 20, "Stage 3: World Design": 90, "Stage 3: Graphics": 90,  "Stage 3: Sound": 20 },
  "Adventure - RPG":       { "Stage 1: Engine": 10,  "Stage 1: Gameplay": 20,  "Stage 1: Story/Quests": 100,"Stage 2: Dialogues": 100, "Stage 2: Level Design": 20,  "Stage 2: AI": 10, "Stage 3: World Design": 100,"Stage 3: Graphics": 90,  "Stage 3: Sound": 20 },
  "Adventure - Simulation":{ "Stage 1: Engine": 10,  "Stage 1: Gameplay": 20,  "Stage 1: Story/Quests": 90, "Stage 2: Dialogues": 90,  "Stage 2: Level Design": 20,  "Stage 2: AI": 20, "Stage 3: World Design": 90, "Stage 3: Graphics": 90,  "Stage 3: Sound": 20 },
  "Adventure - Strategy":  { "Stage 1: Engine": 10,  "Stage 1: Gameplay": 20,  "Stage 1: Story/Quests": 90, "Stage 2: Dialogues": 90,  "Stage 2: Level Design": 20,  "Stage 2: AI": 10, "Stage 3: World Design": 100,"Stage 3: Graphics": 20,  "Stage 3: Sound": 20 },
  "Adventure - Casual":    { "Stage 1: Engine": 0,   "Stage 1: Gameplay": 20,  "Stage 1: Story/Quests": 90, "Stage 2: Dialogues": 90,  "Stage 2: Level Design": 20,  "Stage 2: AI": 0,  "Stage 3: World Design": 90, "Stage 3: Graphics": 90,  "Stage 3: Sound": 20 },
  "RPG - Action":          { "Stage 1: Engine": 20,  "Stage 1: Gameplay": 90,  "Stage 1: Story/Quests": 90, "Stage 2: Dialogues": 20,  "Stage 2: Level Design": 90,  "Stage 2: AI": 20, "Stage 3: World Design": 90, "Stage 3: Graphics": 90,  "Stage 3: Sound": 20 },
  "RPG - Adventure":       { "Stage 1: Engine": 10,  "Stage 1: Gameplay": 20,  "Stage 1: Story/Quests": 100,"Stage 2: Dialogues": 100, "Stage 2: Level Design": 20,  "Stage 2: AI": 10, "Stage 3: World Design": 100,"Stage 3: Graphics": 90,  "Stage 3: Sound": 20 },
  "RPG - Simulation":      { "Stage 1: Engine": 10,  "Stage 1: Gameplay": 90,  "Stage 1: Story/Quests": 90, "Stage 2: Dialogues": 90,  "Stage 2: Level Design": 90,  "Stage 2: AI": 20, "Stage 3: World Design": 90, "Stage 3: Graphics": 90,  "Stage 3: Sound": 20 },
  "RPG - Strategy":        { "Stage 1: Engine": 10,  "Stage 1: Gameplay": 90,  "Stage 1: Story/Quests": 90, "Stage 2: Dialogues": 90,  "Stage 2: Level Design": 90,  "Stage 2: AI": 20, "Stage 3: World Design": 100,"Stage 3: Graphics": 20,  "Stage 3: Sound": 20 },
  "RPG - Casual":          { "Stage 1: Engine": 0,   "Stage 1: Gameplay": 90,  "Stage 1: Story/Quests": 90, "Stage 2: Dialogues": 90,  "Stage 2: Level Design": 90,  "Stage 2: AI": 10, "Stage 3: World Design": 90, "Stage 3: Graphics": 90,  "Stage 3: Sound": 20 },
};

// === TOPICS ===
const TOPICS: Record<string, Record<string, number>> = {
  // Topic: { genre: score, ... ratingY: ..., ratingE: ..., ratingM: ... }
  Abstract:         { Action: 90, Adventure: 100, RPG: 0, Simulation: 0, Strategy: 20, Casual: 0, Y: 20, E: 90, M: 100 },
  Airplane:         { Action: 100, Adventure: 0, RPG: 20, Simulation: 100, Strategy: 100, Casual: 100, Y: 100, E: 100, M: 90 },
  Aliens:           { Action: 100, Adventure: 20, RPG: 100, Simulation: 0, Strategy: 90, Casual: 0, Y: 0, E: 100, M: 100 },
  "Alternate History": { Action: 100, Adventure: 20, RPG: 100, Simulation: 20, Strategy: 90, Casual: 0, Y: 0, E: 100, M: 100 },
  Business:         { Action: 0, Adventure: 20, RPG: 20, Simulation: 100, Strategy: 100, Casual: 0, Y: 90, E: 100, M: 10 },
  City:             { Action: 10, Adventure: 0, RPG: 10, Simulation: 100, Strategy: 100, Casual: 10, Y: 90, E: 100, M: 20 },
  Comedy:           { Action: 0, Adventure: 100, RPG: 20, Simulation: 0, Strategy: 0, Casual: 100, Y: 20, E: 90, M: 100 },
  Construction:     { Action: 10, Adventure: 0, RPG: 0, Simulation: 100, Strategy: 90, Casual: 20, Y: 20, E: 90, M: 90 },
  Cooking:          { Action: 90, Adventure: 10, RPG: 20, Simulation: 100, Strategy: 10, Casual: 100, Y: 20, E: 100, M: 0 },
  Crime:            { Action: 100, Adventure: 10, RPG: 20, Simulation: 90, Strategy: 10, Casual: 0, Y: 0, E: 20, M: 100 },
  Cyberpunk:        { Action: 100, Adventure: 20, RPG: 100, Simulation: 20, Strategy: 10, Casual: 0, Y: 10, E: 90, M: 100 },
  Dance:            { Action: 10, Adventure: 0, RPG: 0, Simulation: 100, Strategy: 0, Casual: 100, Y: 100, E: 90, M: 20 },
  Detective:        { Action: 0, Adventure: 100, RPG: 100, Simulation: 20, Strategy: 0, Casual: 90, Y: 90, E: 100, M: 20 },
  Disasters:        { Action: 90, Adventure: 20, RPG: 10, Simulation: 100, Strategy: 100, Casual: 10, Y: 10, E: 90, M: 100 },
  Dungeon:          { Action: 100, Adventure: 20, RPG: 100, Simulation: 100, Strategy: 100, Casual: 0, Y: 20, E: 100, M: 100 },
  Dystopian:        { Action: 20, Adventure: 90, RPG: 20, Simulation: 100, Strategy: 90, Casual: 0, Y: 0, E: 20, M: 100 },
  Evolution:        { Action: 10, Adventure: 0, RPG: 0, Simulation: 100, Strategy: 100, Casual: 10, Y: 20, E: 100, M: 10 },
  Expedition:       { Action: 10, Adventure: 90, RPG: 0, Simulation: 90, Strategy: 100, Casual: 0, Y: 20, E: 100, M: 90 },
  "Extreme Sports": { Action: 100, Adventure: 0, RPG: 0, Simulation: 100, Strategy: 10, Casual: 90, Y: 100, E: 10, M: 100 },
  Fantasy:          { Action: 100, Adventure: 100, RPG: 100, Simulation: 20, Strategy: 100, Casual: 0, Y: 100, E: 100, M: 100 },
  Farming:          { Action: 0, Adventure: 10, RPG: 0, Simulation: 100, Strategy: 0, Casual: 100, Y: 90, E: 100, M: 20 },
  Fashion:          { Action: 0, Adventure: 20, RPG: 100, Simulation: 100, Strategy: 100, Casual: 100, Y: 100, E: 20, M: 0 },
  "Game Dev":       { Action: 0, Adventure: 10, RPG: 0, Simulation: 100, Strategy: 100, Casual: 10, Y: 0, E: 100, M: 20 },
  Government:       { Action: 0, Adventure: 0, RPG: 0, Simulation: 100, Strategy: 100, Casual: 10, Y: 0, E: 100, M: 20 },
  Hacking:          { Action: 10, Adventure: 20, RPG: 10, Simulation: 100, Strategy: 100, Casual: 0, Y: 10, E: 90, M: 100 },
  History:          { Action: 20, Adventure: 20, RPG: 20, Simulation: 100, Strategy: 100, Casual: 90, Y: 20, E: 100, M: 90 },
  Horror:           { Action: 100, Adventure: 100, RPG: 20, Simulation: 0, Strategy: 10, Casual: 20, Y: 0, E: 90, M: 100 },
  Hospital:         { Action: 0, Adventure: 0, RPG: 20, Simulation: 100, Strategy: 20, Casual: 10, Y: 10, E: 100, M: 20 },
  Hunting:          { Action: 100, Adventure: 90, RPG: 90, Simulation: 100, Strategy: 10, Casual: 90, Y: 100, E: 100, M: 90 },
  Law:              { Action: 0, Adventure: 100, RPG: 90, Simulation: 90, Strategy: 90, Casual: 0, Y: 20, E: 100, M: 10 },
  Life:             { Action: 0, Adventure: 100, RPG: 90, Simulation: 100, Strategy: 0, Casual: 20, Y: 100, E: 100, M: 20 },
  "Mad Science":    { Action: 90, Adventure: 100, RPG: 10, Simulation: 90, Strategy: 0, Casual: 0, Y: 20, E: 90, M: 100 },
  "Martial Arts":   { Action: 100, Adventure: 20, RPG: 100, Simulation: 100, Strategy: 10, Casual: 100, Y: 10, E: 90, M: 100 },
  Medieval:         { Action: 100, Adventure: 100, RPG: 100, Simulation: 20, Strategy: 100, Casual: 10, Y: 100, E: 100, M: 90 },
  Military:         { Action: 100, Adventure: 0, RPG: 20, Simulation: 100, Strategy: 100, Casual: 0, Y: 10, E: 90, M: 100 },
  Movies:           { Action: 20, Adventure: 20, RPG: 0, Simulation: 100, Strategy: 0, Casual: 100, Y: 90, E: 100, M: 90 },
  Music:            { Action: 100, Adventure: 90, RPG: 0, Simulation: 100, Strategy: 0, Casual: 100, Y: 90, E: 100, M: 20 },
  Mystery:          { Action: 0, Adventure: 100, RPG: 100, Simulation: 20, Strategy: 0, Casual: 20, Y: 20, E: 90, M: 100 },
  Mythology:        { Action: 100, Adventure: 20, RPG: 90, Simulation: 90, Strategy: 20, Casual: 10, Y: 10, E: 100, M: 100 },
  Ninja:            { Action: 100, Adventure: 20, RPG: 20, Simulation: 0, Strategy: 20, Casual: 90, Y: 100, E: 90, M: 90 },
  Pirate:           { Action: 20, Adventure: 100, RPG: 90, Simulation: 90, Strategy: 10, Casual: 20, Y: 100, E: 100, M: 20 },
  "Post Apocalyptic": { Action: 100, Adventure: 20, RPG: 100, Simulation: 0, Strategy: 90, Casual: 0, Y: 0, E: 90, M: 100 },
  Prison:           { Action: 100, Adventure: 100, RPG: 20, Simulation: 100, Strategy: 20, Casual: 0, Y: 10, E: 90, M: 100 },
  Racing:           { Action: 90, Adventure: 0, RPG: 20, Simulation: 100, Strategy: 10, Casual: 100, Y: 100, E: 100, M: 90 },
  Rhythm:           { Action: 100, Adventure: 10, RPG: 10, Simulation: 100, Strategy: 0, Casual: 100, Y: 100, E: 90, M: 20 },
  Romance:          { Action: 0, Adventure: 100, RPG: 20, Simulation: 90, Strategy: 0, Casual: 90, Y: 20, E: 100, M: 100 },
  School:           { Action: 20, Adventure: 100, RPG: 100, Simulation: 100, Strategy: 20, Casual: 100, Y: 100, E: 90, M: 10 },
  "Sci-Fi":         { Action: 100, Adventure: 100, RPG: 100, Simulation: 100, Strategy: 20, Casual: 20, Y: 20, E: 100, M: 100 },
  Space:            { Action: 100, Adventure: 20, RPG: 0, Simulation: 100, Strategy: 20, Casual: 100, Y: 100, E: 100, M: 100 },
  Sports:           { Action: 100, Adventure: 0, RPG: 0, Simulation: 100, Strategy: 10, Casual: 100, Y: 100, E: 100, M: 20 },
  Spy:              { Action: 100, Adventure: 100, RPG: 100, Simulation: 20, Strategy: 10, Casual: 20, Y: 20, E: 90, M: 100 },
  Superheroes:      { Action: 100, Adventure: 0, RPG: 90, Simulation: 0, Strategy: 0, Casual: 100, Y: 100, E: 100, M: 90 },
  Surgery:          { Action: 20, Adventure: 10, RPG: 0, Simulation: 100, Strategy: 10, Casual: 0, Y: 10, E: 100, M: 90 },
  Technology:       { Action: 0, Adventure: 10, RPG: 0, Simulation: 100, Strategy: 90, Casual: 0, Y: 20, E: 100, M: 90 },
  Thief:            { Action: 90, Adventure: 20, RPG: 100, Simulation: 100, Strategy: 0, Casual: 90, Y: 10, E: 100, M: 100 },
  "Time Travel":    { Action: 90, Adventure: 100, RPG: 100, Simulation: 10, Strategy: 10, Casual: 20, Y: 20, E: 100, M: 20 },
  Transport:        { Action: 0, Adventure: 0, RPG: 0, Simulation: 100, Strategy: 100, Casual: 0, Y: 100, E: 100, M: 10 },
  UFO:              { Action: 100, Adventure: 20, RPG: 0, Simulation: 20, Strategy: 100, Casual: 20, Y: 20, E: 100, M: 90 },
  Vampire:          { Action: 100, Adventure: 20, RPG: 100, Simulation: 0, Strategy: 0, Casual: 10, Y: 10, E: 100, M: 100 },
  "Virtual Pet":    { Action: 0, Adventure: 20, RPG: 90, Simulation: 100, Strategy: 90, Casual: 100, Y: 100, E: 20, M: 10 },
  Vocabulary:       { Action: 0, Adventure: 0, RPG: 0, Simulation: 100, Strategy: 100, Casual: 100, Y: 90, E: 100, M: 0 },
  Werewolf:         { Action: 100, Adventure: 20, RPG: 100, Simulation: 0, Strategy: 0, Casual: 10, Y: 10, E: 90, M: 100 },
  "Wild West":      { Action: 90, Adventure: 10, RPG: 100, Simulation: 0, Strategy: 90, Casual: 10, Y: 100, E: 90, M: 100 },
  Zombies:          { Action: 100, Adventure: 90, RPG: 0, Simulation: 0, Strategy: 90, Casual: 100, Y: 20, E: 100, M: 100 },
};

// === SYSTEMS ===
const SYSTEMS: Record<string, Record<string, number>> = {
  // System: { genre: score, ... Y: ..., E: ..., M: ... }
  "PC":           { Action: 90,  Adventure: 100, RPG: 90,  Simulation: 100, Strategy: 100, Casual: 0,   Y: 20, E: 90,  M: 100 },
  "G64":          { Action: 90,  Adventure: 100, RPG: 90,  Simulation: 90,  Strategy: 100, Casual: 10,  Y: 20, E: 90,  M: 100 },
  "TES":          { Action: 20,  Adventure: 10,  RPG: 20,  Simulation: 20,  Strategy: 10,  Casual: 100, Y: 100, E: 90,  M: 0 },
  "Master V":     { Action: 90,  Adventure: 10,  RPG: 20,  Simulation: 20,  Strategy: 10,  Casual: 100, Y: 90,  E: 100, M: 10 },
  "Gameling":     { Action: 20,  Adventure: 10,  RPG: 90,  Simulation: 90,  Strategy: 0,   Casual: 100, Y: 100, E: 90,  M: 0 },
  "Vena Gear":    { Action: 90,  Adventure: 20,  RPG: 20,  Simulation: 90,  Strategy: 0,   Casual: 100, Y: 90,  E: 100, M: 20 },
  "Vena Oasis":   { Action: 100, Adventure: 20,  RPG: 20,  Simulation: 90,  Strategy: 0,   Casual: 10,  Y: 20, E: 100, M: 90 },
  "Super TES":    { Action: 90,  Adventure: 90,  RPG: 90,  Simulation: 100, Strategy: 10,  Casual: 90,  Y: 100, E: 90,  M: 10 },
  "Playsystem":   { Action: 100, Adventure: 20,  RPG: 100, Simulation: 90,  Strategy: 10,  Casual: 0,   Y: 20, E: 100, M: 90 },
  "TES 64":       { Action: 90,  Adventure: 20,  RPG: 10,  Simulation: 20,  Strategy: 10,  Casual: 90,  Y: 100, E: 90,  M: 90 },
  "DreamVast":    { Action: 100, Adventure: 10,  RPG: 20,  Simulation: 100, Strategy: 10,  Casual: 10,  Y: 10, E: 100, M: 100 },
  "Playsystem 2": { Action: 100, Adventure: 20,  RPG: 100, Simulation: 90,  Strategy: 10,  Casual: 90,  Y: 90,  E: 100, M: 20 },
  "mBox":         { Action: 100, Adventure: 20,  RPG: 90,  Simulation: 90,  Strategy: 10,  Casual: 10,  Y: 20, E: 100, M: 90 },
  "Game Sphere":  { Action: 20,  Adventure: 20,  RPG: 10,  Simulation: 20,  Strategy: 10,  Casual: 100, Y: 90,  E: 90,  M: 20 },
  "GS":           { Action: 90,  Adventure: 90,  RPG: 100, Simulation: 90,  Strategy: 90,  Casual: 100, Y: 100, E: 90,  M: 20 },
  "PPS":          { Action: 100, Adventure: 10,  RPG: 100, Simulation: 20,  Strategy: 20,  Casual: 20,  Y: 20, E: 90,  M: 100 },
  "mBox 360":     { Action: 100, Adventure: 90,  RPG: 100, Simulation: 90,  Strategy: 10,  Casual: 90,  Y: 20, E: 90,  M: 100 },
  "Nuu":          { Action: 20,  Adventure: 0,   RPG: 10,  Simulation: 100, Strategy: 10,  Casual: 100, Y: 100, E: 100, M: 10 },
  "Playsystem 3": { Action: 100, Adventure: 90,  RPG: 90,  Simulation: 100, Strategy: 10,  Casual: 20,  Y: 20, E: 100, M: 90 },
  "grPhone":      { Action: 20,  Adventure: 10,  RPG: 10,  Simulation: 90,  Strategy: 10,  Casual: 100, Y: 90,  E: 100, M: 0 },
  "grPad":        { Action: 20,  Adventure: 90,  RPG: 10,  Simulation: 90,  Strategy: 90,  Casual: 100, Y: 90,  E: 100, M: 0 },
  "mPad":         { Action: 10,  Adventure: 90,  RPG: 20,  Simulation: 90,  Strategy: 90,  Casual: 90,  Y: 10, E: 90,  M: 20 },
  "Wuu":          { Action: 90,  Adventure: 10,  RPG: 20,  Simulation: 100, Strategy: 10,  Casual: 100, Y: 90,  E: 100, M: 10 },
  "OYA":          { Action: 90,  Adventure: 10,  RPG: 20,  Simulation: 90,  Strategy: 20,  Casual: 100, Y: 20, E: 100, M: 90 },
  "mBox One":     { Action: 100, Adventure: 20,  RPG: 90,  Simulation: 90,  Strategy: 10,  Casual: 90,  Y: 10, E: 100, M: 20 },
  "Playsystem 4": { Action: 100, Adventure: 20,  RPG: 100, Simulation: 90,  Strategy: 10,  Casual: 90,  Y: 20, E: 100, M: 90 },
  "mBox Next":    { Action: 90,  Adventure: 90,  RPG: 90,  Simulation: 20,  Strategy: 10,  Casual: 100, Y: 90,  E: 100, M: 20 },
  "PlaySystem 5": { Action: 100, Adventure: 10,  RPG: 90,  Simulation: 0,   Strategy: 0,   Casual: 90,  Y: 90,  E: 100, M: 20 },
};

// Helper functions
export const ALL_GENRES = GENRE_NAMES;
export const ALL_TOPICS = Object.keys(TOPICS).sort();
export const ALL_SYSTEMS = Object.keys(SYSTEMS).sort();
export const ALL_RATINGS: Rating[] = ["Y", "E", "M"];

export { SINGLE_GENRE_SCORES, MULTI_GENRE_SCORES, TOPICS, SYSTEMS };
