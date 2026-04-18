export type LineageId = 'speed' | 'stamina' | 'guts' | 'balance';
export type GrowthType = 'early' | 'normal' | 'late';
export type Strategy = 'escape' | 'lead' | 'insert' | 'stay'; // 逃げ, 先行, 差し, 追込
export type TrainingFocus = 'speed' | 'stamina' | 'guts' | 'temperament' | 'luck' | 'health' | 'explosiveness';
export type Grade = 'Newcomer' | 'Maiden' | 'Condition' | 'Open' | 'G3' | 'G2' | 'G1' | 'Classic' | 'G0' | 'G-ultra';
export type TrackCondition = 'Good' | 'Yielding' | 'Heavy';

export interface Lineage {
  id: LineageId;
  name: string;
  description: string;
}

export interface Stats {
  speed: number;
  stamina: number;
  guts: number;
  temperament: number;
  health: number; // 丈夫さ
  luck: number; // 運
  explosiveness: number; // 瞬発力
}

export interface Pedigree {
  father: string;
  mother: string;
  grandFathers: string[]; // [Father's Father, Mother's Father]
  grandMothers: string[]; // [Father's Mother, Mother's Mother]
  greatGrandFathers: string[]; // [FF's F, FM's F, MF's F, MM's F]
}

export interface BreedingResult {
  horse: Horse;
  inbreeding: string[];
  inbreedingCount: number; // インブリード本数
  nicks: boolean;
  explosion: boolean;
}

export interface Horse {
  id: string;
  name: string;
  age: number;
  gender: 'colt' | 'filly';
  color: string; // 馬体色
  stats: Stats;
  maxStats: Stats;
  lineageId: LineageId;
  pedigree: Pedigree;
  distanceAptitude: [number, number];
  growthType: GrowthType;
  strategy: Strategy;
  trainingFocus: TrainingFocus;
  isRetired: boolean;
  isGelding: boolean; // セン馬
  hasShadowRoll: boolean; // シャドーロール
  isInjured: boolean; // 故障中
  injuryType?: string;
  winCount: number;
  totalRaces: number;
  currentCondition: number; // 0-100
  fatigue: number; // 0-100
  gradedWins: Grade[]; // Track graded stakes wins
  wonRaceNames?: string[]; // Track specific race names won
  isAutoMode?: boolean; // Auto training mode
  traits?: string[]; // Special abilities
  explosivePower: number; // 爆発力
}

export interface Stallion {
  id: string;
  name: string;
  lineageId: LineageId;
  price: number;
  stats: Stats;
  explosivePower: number; // 爆発力
  distanceAptitude: [number, number];
  growthType: GrowthType;
  strategy: Strategy;
  pedigree: Pedigree;
  traits?: string[];
}

export interface Mare {
  id: string;
  name: string;
  lineageId: LineageId;
  stats: Stats;
  pedigree: Pedigree;
  traits?: string[];
}

export interface Race {
  id: string;
  name: string;
  grade: Grade;
  distance: number;
  prize: number;
  month: number;
  week: number;
  trackCondition: TrackCondition;
  strategy?: Strategy; // Optional target strategy for the race
}

export interface GameState {
  ranchName: string;
  money: number;
  year: number;
  month: number;
  week: number;
  horses: Horse[];
  mares: Mare[];
  stallions: Stallion[];
  marketMares: Mare[];
  marketStallions: Stallion[];
  hallOfFame: Horse[];
  registeredHorses: Horse[]; // 生産馬登録（ブリーダーズカップ用）
  logs: string[];
  weeklyTrainingCount: number;
}

export interface Buff {
  name: string;
  description: string;
  effect: (stats: Stats, context: RaceContext) => Stats;
}

export interface RaceContext {
  distance: number;
  trackCondition: TrackCondition;
  strategy: Strategy;
}
