import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Trophy, 
  Calendar, 
  Coins, 
  Dna, 
  Zap, 
  Activity, 
  ChevronRight, 
  ChevronLeft,
  Play,
  Heart,
  TrendingUp,
  History,
  Star,
  Home,
  Sparkles,
  Flame,
  Wind,
  MessageSquare,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Horse, 
  Stallion, 
  Mare, 
  Race, 
  GameState, 
  Grade, 
  TrackCondition,
  BreedingResult,
  LineageId,
  Strategy,
  TrainingFocus
} from './types';
import { STALLIONS, INITIAL_MARES, RACE_NAMES } from './constants/gameData';
import { checkBreeding } from './logic/breeding';
import { calculateGrowth, getPhysicalState } from './logic/growth';
import { simulateRace, generateEnemyHorses, RaceResult } from './logic/raceSim';
import { getBreedingAdvice } from './services/geminiService';

const INITIAL_MONEY = 10000000;

const getGradeColor = (grade: Grade) => {
  switch (grade) {
    case 'G-ultra': return 'bg-black text-amber-400 border-amber-500 shadow-[0_0_40px_rgba(251,191,36,0.8)] font-black ring-2 ring-amber-500/50';
    case 'G0': return 'bg-red-600 text-white border-red-400 shadow-[0_0_30px_rgba(220,38,38,0.6)] font-black';
    case 'G1': return 'bg-red-700 text-white border-red-400 shadow-[0_0_25px_rgba(185,28,28,0.5)]';
    case 'Classic': return 'bg-amber-500 text-black border-yellow-200 shadow-[0_0_25px_rgba(217,119,6,0.5)]';
    case 'G2': return 'bg-blue-700 text-white border-blue-400';
    case 'G3': return 'bg-emerald-700 text-white border-emerald-400';
    case 'Open': return 'bg-indigo-700 text-white border-indigo-400';
    case 'Condition': return 'bg-purple-700 text-white border-purple-400';
    case 'Maiden': return 'bg-slate-800 text-white border-slate-500';
    case 'Newcomer': return 'bg-slate-900 text-white border-slate-700';
    default: return 'bg-slate-900 text-slate-200 border-slate-700';
  }
};

const TRIPLE_CROWN_RACES = ['シリウス大賞', 'ベテルギウス大賞', 'アークトゥルス大賞'];

const GradeBadge = ({ grade, className = "" }: { grade: Grade, className?: string }) => {
  const isHighGrade = grade === 'G1' || grade === 'Classic' || grade === 'G0' || grade === 'G-ultra';
  
  if (isHighGrade) {
    const isUltra = grade === 'G-ultra';
    const isG0 = grade === 'G0';
    
    return (
      <motion.span 
        animate={{ 
          scale: isUltra ? [1, 1.15, 1] : isG0 ? [1, 1.1, 1] : [1, 1.05, 1], 
          opacity: [0.9, 1, 0.9],
          rotate: isUltra ? [-2, 2, -2] : isG0 ? [-1, 1, -1] : 0
        }}
        transition={{ duration: isUltra ? 1.2 : isG0 ? 1.5 : 2, repeat: Infinity }}
        className={`px-3 py-1 rounded-lg text-[11px] font-black tracking-[0.15em] border-2 uppercase italic flex items-center gap-1.5 ${getGradeColor(grade)} ${className}`}
      >
        <Star className={`w-3 h-3 ${isUltra || isG0 ? 'fill-amber-400 animate-pulse' : 'fill-current'}`} />
        {grade}
        <Star className={`w-3 h-3 ${isUltra || isG0 ? 'fill-amber-400 animate-pulse' : 'fill-current'}`} />
      </motion.span>
    );
  }

  const label = grade === 'Newcomer' ? '新馬' : grade === 'Maiden' ? '未勝利' : grade;
  
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-widest border uppercase italic ${getGradeColor(grade)} ${className}`}>
      {label}
    </span>
  );
};

const CinematicRace = ({ raceResult, raceStep, raceActive, selectedHorseId, currentRace, onSkip }: { 
  raceResult: any[], 
  raceStep: number, 
  raceActive: boolean,
  selectedHorseId: string,
  currentRace: Race,
  onSkip: () => void
}) => {
  const maxSteps = Math.max(...raceResult.map(r => r.progress.length));
  const isStart = raceStep < 10;
  
  const winner = raceResult.find(r => r.position === 1);
  const currentProg = winner?.progress[raceStep] || winner?.progress.at(-1);
  const isGoal = (currentProg?.distance || 0) >= currentRace.distance;

  // Find commentary for this step or previous steps
  const [lastCommentary, setLastCommentary] = useState("");
  const lastCommentaryRef = useRef("");
  const lastCheckedStepRef = useRef(-1);
  
  useEffect(() => {
    // Check steps from last checked to current to ensure we don't skip any commentary
    const startStep = Math.max(0, lastCheckedStepRef.current + 1);
    const endStep = raceStep;
    
    if (startStep <= endStep) {
      for (let s = startStep; s <= endStep; s++) {
        const found = raceResult.find(r => r.progress[s]?.commentary)?.progress[s]?.commentary;
        if (found && found !== lastCommentaryRef.current) {
          lastCommentaryRef.current = found;
          setLastCommentary(found);
        }
      }
      lastCheckedStepRef.current = endStep;
    }
  }, [raceStep, raceResult]);
  
  const isG1 = currentRace.grade === 'G1' || currentRace.grade === 'Classic';
  
  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center p-2 sm:p-4 overflow-y-auto ${isG1 ? 'bg-slate-950' : 'bg-slate-950'}`}>
      {/* G1 Special Background Effect */}
      {isG1 && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent opacity-50" />
          <motion.div 
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.1, 1]
            }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"
          />
        </div>
      )}

      {/* Floating Skip Button */}
      <div className="absolute top-6 right-6 z-[200]">
        <button 
          onClick={onSkip}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl text-xs font-black text-white uppercase tracking-widest transition-all active:scale-95 shadow-2xl"
        >
          SKIP RACE
        </button>
      </div>

      {/* Overlays */}
      <AnimatePresence>
        {isStart && raceActive && (
          <motion.div 
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-[150] pointer-events-none"
          >
            <span className="text-6xl sm:text-9xl font-black italic text-white tracking-tighter uppercase drop-shadow-[0_0_30px_rgba(99,102,241,0.5)]">
              START
            </span>
          </motion.div>
        )}
        {isGoal && (
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed inset-0 flex items-center justify-center z-[150] pointer-events-none"
          >
            <span className="text-6xl sm:text-9xl font-black italic text-indigo-500 tracking-tighter uppercase drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
              GOAL!!
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-5xl space-y-6 my-auto py-8">
        <div className="flex justify-between items-end px-4">
          <div className="text-left space-y-1">
            <div className="flex items-center gap-3">
              <GradeBadge grade={currentRace.grade} />
              <h2 className="text-xl sm:text-2xl font-black italic text-white tracking-tighter uppercase">
                {currentRace.name}
              </h2>
            </div>
            <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
              {currentRace.distance}m / {currentRace.trackCondition} CONDITION
            </div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl">
          <table className="w-full border-collapse">
            <tbody className="divide-y divide-white/5">
              {raceResult.map((res, idx) => {
                const prog = res.progress[raceStep] || res.progress.at(-1) || { distance: 0 };
                const isPlayer = res.horseId === selectedHorseId;
                
                // Absolute progress: 0% to 100%
                const progressPercent = Math.min(100, (prog.distance / currentRace.distance) * 100);

                return (
                  <tr key={res.horseId} className={`h-10 sm:h-14 transition-colors ${isPlayer ? 'bg-indigo-500/20' : ''}`}>
                    <td className="w-8 sm:w-12 text-center border-r border-white/10 bg-black/40">
                      <span className="text-amber-400 font-black text-xs sm:text-base">{res.prediction || ''}</span>
                    </td>
                    <td className="px-3 sm:px-6 w-24 sm:w-40 border-r border-white/10 bg-black/20">
                      <div className="flex flex-col">
                        <span className={`font-black italic text-[8px] sm:text-xs truncate ${isPlayer ? 'text-indigo-400' : 'text-slate-300'}`}>
                          {res.name}
                        </span>
                        <span className="text-[7px] text-slate-500 font-mono uppercase tracking-tighter">
                          {res.strategy} | R:{res.rating}
                        </span>
                      </div>
                    </td>
                    <td className="relative px-4 overflow-hidden bg-gradient-to-r from-transparent via-white/[0.02] to-transparent">
                      {/* Track Line */}
                      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-white/5" />
                      
                      {/* Finish Line Visual - Adjusted */}
                      <div className="absolute right-2 top-0 bottom-0 w-[4px] bg-white shadow-[0_0_15px_rgba(255,255,255,1)] z-20 flex items-center justify-center">
                        <div className="h-full w-[1px] bg-slate-400 opacity-30" />
                      </div>
                      
                      {/* Horse Emoji */}
                      <motion.div 
                        animate={{ left: `${Math.min(98, progressPercent * 0.93 + 2)}%` }}
                        transition={{ duration: 0.08, ease: "linear" }}
                        className="absolute top-1/2 -translate-y-1/2 text-xl sm:text-3xl z-10"
                        style={{ left: '2%' }}
                      >
                        <div className="relative">
                          <span className="block transform -scale-x-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">🐎</span>
                          
                          {/* Strategy Effects */}
                          {raceActive && (
                            <>
                              {/* Escape (逃げ) - Wind Effect at Start */}
                              {res.strategy === 'escape' && progressPercent < 40 && (
                                <motion.div 
                                  animate={{ x: [-10, -30], opacity: [0.8, 0] }}
                                  transition={{ repeat: Infinity, duration: 0.5 }}
                                  className="absolute top-1/2 -left-8 -translate-y-1/2 text-xl pointer-events-none"
                                >
                                  💨
                                </motion.div>
                              )}
                              
                              {/* Closer (追込) - Fire/Lightning Effect at End */}
                              {res.strategy === 'stay' && progressPercent > 80 && (
                                <motion.div 
                                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                                  transition={{ repeat: Infinity, duration: 0.3 }}
                                  className="absolute inset-0 bg-orange-500/40 blur-xl rounded-full -z-10"
                                />
                              )}
                              {res.strategy === 'stay' && progressPercent > 85 && (
                                <motion.div 
                                  animate={{ x: [-5, 5], y: [-5, 5] }}
                                  transition={{ repeat: Infinity, duration: 0.1 }}
                                  className="absolute -top-4 left-1/2 -translate-x-1/2 text-lg"
                                >
                                  ⚡
                                </motion.div>
                              )}
                              
                              {/* Insert (差し) - Sparkles at End */}
                              {res.strategy === 'insert' && progressPercent > 75 && (
                                <motion.div 
                                  animate={{ opacity: [0, 1, 0] }}
                                  transition={{ repeat: Infinity, duration: 0.4 }}
                                  className="absolute -top-2 -right-2 text-sm"
                                >
                                  ✨
                                </motion.div>
                              )}
                            </>
                          )}

                          {isPlayer && (
                            <>
                              <div className="absolute -inset-4 bg-indigo-500/30 blur-xl rounded-full -z-10 animate-pulse" />
                              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-indigo-500 text-[8px] font-black px-1.5 py-0.5 rounded-full text-white tracking-tighter">YOU</div>
                            </>
                          )}
                        </div>
                      </motion.div>
                    </td>
                    <td className="w-12 sm:w-20 text-center border-l border-white/10 bg-black/20">
                      <div className={`text-xl sm:text-3xl transition-all duration-500 ${prog.distance >= currentRace.distance ? 'opacity-100 scale-110' : 'opacity-10 grayscale'}`}>
                        🏁
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Commentary Box - Moved to Bottom as a Broadcast Bar */}
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-indigo-600 border border-indigo-400 rounded-2xl p-4 h-20 flex items-center justify-center text-center shadow-2xl shadow-indigo-500/20">
            <AnimatePresence mode="wait">
              <motion.p 
                key={lastCommentary}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-white text-sm sm:text-xl font-black italic tracking-tight"
              >
                {lastCommentary || "各馬、ゲートに入ります..."}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex justify-between items-center px-4">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Player Horse</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-700" />
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Opponents</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">残り距離</div>
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-2xl sm:text-4xl font-black italic text-white tracking-tighter font-mono">
                {Math.max(0, Math.floor(currentRace.distance - (raceResult.find(r => r.horseId === selectedHorseId)?.progress[raceStep]?.distance || 0)))}
              </span>
              <span className="text-[10px] font-black text-indigo-500 italic uppercase">M</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('star_derby_save');
    const defaultState: GameState = {
      ranchName: '',
      money: INITIAL_MONEY,
      year: 1,
      month: 1,
      week: 1,
      horses: [],
      mares: [INITIAL_MARES[0]],
      stallions: [],
      marketMares: INITIAL_MARES.slice(1, 6),
      marketStallions: STALLIONS.slice(0, 8),
      hallOfFame: [],
      registeredHorses: [],
      logs: ['牧場経営をスタートしました！'],
      weeklyTrainingCount: 0
    };

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        
        // Migration: Ensure all stats and explosivePower exist and are valid numbers
        const ensureStats = (h: any) => {
          if (!h) return h;
          const defaultStats = { speed: 500, stamina: 500, guts: 500, temperament: 500, health: 500, luck: 500, explosiveness: 500 };
          
          // Fix stats
          if (!h.stats) h.stats = { ...defaultStats };
          else {
            Object.keys(defaultStats).forEach(key => {
              const k = key as keyof typeof defaultStats;
              const val = Number(h.stats[k]);
              if (h.stats[k] === undefined || isNaN(val)) h.stats[k] = defaultStats[k];
              else h.stats[k] = val;
            });
          }

          // Fix maxStats for horses (Horse has age, Mare/Stallion don't in this context usually)
          if (h.age !== undefined) {
            if (!h.maxStats) h.maxStats = { ...h.stats };
            else {
              Object.keys(defaultStats).forEach(key => {
                const k = key as keyof typeof defaultStats;
                const val = Number(h.maxStats[k]);
                if (h.maxStats[k] === undefined || isNaN(val)) h.maxStats[k] = h.stats[k] || defaultStats[k];
                else h.maxStats[k] = val;
              });
            }
          }

          // Fix explosivePower
          const ep = Number(h.explosivePower);
          if (h.explosivePower === undefined || isNaN(ep)) {
            h.explosivePower = 100;
          } else {
            h.explosivePower = ep;
          }
          
          return h;
        };

        if (parsed.horses) parsed.horses = parsed.horses.map(ensureStats);
        if (parsed.stallions) parsed.stallions = parsed.stallions.map(ensureStats);
        if (parsed.marketStallions) parsed.marketStallions = parsed.marketStallions.map(ensureStats);
        if (parsed.mares) parsed.mares = parsed.mares.map(ensureStats);
        if (parsed.marketMares) parsed.marketMares = parsed.marketMares.map(ensureStats);

        // Cleanup duplicates from saved state
        const cleanup = (arr: any[]) => {
          if (!Array.isArray(arr)) return arr;
          const seen = new Set();
          return arr.filter(item => {
            if (!item || !item.id) return true;
            if (seen.has(item.id)) return false;
            seen.add(item.id);
            return true;
          });
        };

        if (parsed.mares) parsed.mares = cleanup(parsed.mares);
        if (parsed.stallions) parsed.stallions = cleanup(parsed.stallions);
        if (parsed.marketMares) parsed.marketMares = cleanup(parsed.marketMares);
        if (parsed.marketStallions) parsed.marketStallions = cleanup(parsed.marketStallions);
        if (parsed.horses) parsed.horses = cleanup(parsed.horses);

        // Merge parsed with default to handle missing fields from older versions
        return { ...defaultState, ...parsed };
      } catch (e) {
        console.error("Failed to load save", e);
      }
    }
    return defaultState;
  });

  const [view, setView] = useState<'title' | 'ranch' | 'breeding' | 'training' | 'race' | 'race_selection' | 'pedigree' | 'logs' | 'registration' | 'breedersCup'>(() => {
    const saved = localStorage.getItem('star_derby_save');
    if (!saved) return 'title';
    const parsed = JSON.parse(saved);
    return parsed.ranchName ? 'ranch' : 'registration';
  });
  const [selectedHorseId, setSelectedHorseId] = useState<string | null>(null);
  const [raceResult, setRaceResult] = useState<RaceResult[] | null>(null);
  const [currentRace, setCurrentRace] = useState<Race | null>(null);
  const [raceStep, setRaceStep] = useState(0);
  const [raceActive, setRaceActive] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showRetireConfirm, setShowRetireConfirm] = useState(false);
  const [horseToRetire, setHorseToRetire] = useState<Horse | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [selectedMareId, setSelectedMareId] = useState<string | null>(null);
  const [selectedStallionId, setSelectedStallionId] = useState<string | null>(null);
  const [availableRaces, setAvailableRaces] = useState<Race[]>([]);
  const [hoveredStallionId, setHoveredStallionId] = useState<string | null>(null);
  const [breedingResult, setBreedingResult] = useState<BreedingResult | null>(null);
  
  // Chat Mode State
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const refreshMarket = () => {
    setGameState(prev => {
      const ownedMareIds = new Set(prev.mares.map(m => m.id));
      const ownedStallionIds = new Set(prev.stallions.map(s => s.id));
      
      const availableMares = INITIAL_MARES.filter(m => !ownedMareIds.has(m.id));
      const availableStallions = STALLIONS.filter(s => !ownedStallionIds.has(s.id));
      
      const randomMares = shuffleArray(availableMares).slice(0, 5);
      const randomStallions = shuffleArray(availableStallions).slice(0, 8);
      
      return {
        ...prev,
        marketMares: randomMares,
        marketStallions: randomStallions
      };
    });
  };

  useEffect(() => {
    localStorage.setItem('star_derby_save', JSON.stringify(gameState));
  }, [gameState]);

  const selectedHorse = useMemo(() => 
    gameState.horses.find(h => h.id === selectedHorseId), 
    [gameState.horses, selectedHorseId]
  );

  const addLog = (msg: string) => {
    setGameState(prev => ({
      ...prev,
      logs: [msg, ...prev.logs].slice(0, 50)
    }));
  };

  const nextWeek = () => {
    setGameState(prev => {
      let { week, month, year, horses, money, logs } = prev;
      const newLogs = [...logs];
      week++;
      if (week > 4) {
        week = 1;
        month++;
      }
      if (month > 12) {
        month = 1;
        year++;
        newLogs.unshift(`--- ${year}年のシーズンが始まりました ---`);
      }

      const updatedHorses = horses.map(h => {
        let currentHorse = { ...h };
        
        // Year change: aging and growth
        if (month === 1 && week === 1 && year > prev.year) {
          currentHorse.age += 1;
          // Apply growth logic
          currentHorse.stats = calculateGrowth(currentHorse);
        }
        
        // Default fatigue reduction
        currentHorse.fatigue = Math.max(0, currentHorse.fatigue - 15);

        // Condition fluctuation
        const healthFactor = (currentHorse.stats.health / 1000); // 0 to 1
        const tempFactor = (currentHorse.stats.temperament / 1000); // 0 to 1
        const baseFluctuation = (Math.random() * 10 - 5); // -5 to +5
        const stability = (healthFactor + tempFactor) / 2;
        
        // High stability horses tend to increase or maintain condition
        const conditionChange = baseFluctuation + (stability * 4); 
        currentHorse.currentCondition = Math.max(0, Math.min(100, currentHorse.currentCondition + conditionChange));

        // Random Events (Gelding, Shadow Roll)
        if (!currentHorse.isRetired && currentHorse.age >= 2) {
          const eventRoll = Math.random();
          const luckBonus = currentHorse.stats.luck / 5000;
          
          // Gelding Event (セン馬)
          if (currentHorse.gender === 'colt' && !currentHorse.isGelding && currentHorse.stats.temperament < 300 && eventRoll < (0.05 - luckBonus)) {
            currentHorse.isGelding = true;
            currentHorse.stats.temperament = Math.min(1000, currentHorse.stats.temperament + 300);
            newLogs.unshift(`${currentHorse.name}がセン馬になりました。気性が落ち着きました。`);
          }
          
          // Shadow Roll Event (シャドーロール)
          if (!currentHorse.hasShadowRoll && currentHorse.stats.temperament < 400 && eventRoll < (0.08 - luckBonus)) {
            currentHorse.hasShadowRoll = true;
            newLogs.unshift(`${currentHorse.name}にシャドーロールを装着しました。集中力がアップします。`);
          }

          // Injury Event (Random injury during training/rest)
          if (!currentHorse.isInjured && eventRoll < (0.01 - luckBonus)) {
            currentHorse.isInjured = true;
            currentHorse.injuryType = ['捻挫', '球節炎', 'ソエ'][Math.floor(Math.random() * 3)];
            newLogs.unshift(`${currentHorse.name}が${currentHorse.injuryType}を発症しました...`);
          }
        }

        // Injury Recovery
        if (currentHorse.isInjured) {
          if (Math.random() < 0.2) {
            currentHorse.isInjured = false;
            currentHorse.injuryType = undefined;
            newLogs.unshift(`${currentHorse.name}の怪我が完治しました！`);
          }
        }
        
        if (currentHorse.isAutoMode && !currentHorse.isRetired && !currentHorse.isInjured) {
          if (currentHorse.fatigue > 40) {
            // Auto Rest - Prioritize rest when fatigue is high
            currentHorse.fatigue = Math.max(0, currentHorse.fatigue - 20);
            newLogs.unshift(`${currentHorse.name}が自動休養しました。`);
          } else if (currentHorse.fatigue < 10 && currentHorse.age >= 2 && Math.random() > 0.5) {
            // Auto Race - Only race when fatigue is very low and age is appropriate
            const grades: Grade[] = ['Maiden', 'Condition', 'Open', 'G3', 'G2', 'G1', 'Classic', 'G0'];
            let selectedGrade: Grade = 'Maiden';
            if (currentHorse.totalRaces === 0) {
              selectedGrade = 'Newcomer';
            } else if (currentHorse.winCount === 0) {
              selectedGrade = 'Maiden';
            } else if (currentHorse.winCount < 3) {
              selectedGrade = 'Condition';
            } else if (currentHorse.winCount < 5) {
              selectedGrade = Math.random() > 0.7 ? 'G3' : 'Open';
            } else if (currentHorse.winCount < 8) {
              const midGrades: Grade[] = ['G3', 'G2', 'G1', 'Classic'];
              selectedGrade = midGrades[Math.floor(Math.random() * midGrades.length)];
            } else {
              const highGrades: Grade[] = ['G2', 'G1', 'Classic', 'G0'];
              selectedGrade = highGrades[Math.floor(Math.random() * highGrades.length)];
            }
            
            const race: Race = {
              id: Math.random().toString(),
              name: selectedGrade === 'G0' 
                ? '銀河万博記念 (G0)'
                : (selectedGrade === 'G1' || selectedGrade === 'Classic') 
                ? RACE_NAMES[Math.floor(Math.random() * 24)] // First 24 are G1/Classic names
                : RACE_NAMES[24 + Math.floor(Math.random() * (RACE_NAMES.length - 24))],
              grade: selectedGrade,
              distance: selectedGrade === 'G0' ? 3200 : [1200, 1600, 2000, 2400, 3200][Math.floor(Math.random() * 5)],
              prize: { 
                'Newcomer': 1000000, 'Maiden': 1500000, 'Condition': 3000000, 'Open': 5000000,
                'G3': 10000000, 'G2': 20000000, 'G1': 50000000, 'Classic': 80000000, 'G0': 200000000
              }[selectedGrade] || 3000000,
              month, week,
              trackCondition: Math.random() > 0.8 ? 'Heavy' : 'Good'
            };
            
            const enemyCount = selectedGrade === 'G0' ? 17 :
                               selectedGrade === 'G1' || selectedGrade === 'Classic' ? 15 : 
                               selectedGrade === 'G2' ? 12 : 
                               selectedGrade === 'G3' ? 10 : 8;
            const enemies = generateEnemyHorses(enemyCount, race.grade);
            const results = simulateRace(currentHorse, enemies, race);
            const playerResult = results.find(r => r.horseId === currentHorse.id);
            
            if (playerResult) {
              const isWinner = playerResult.position === 1;
              const prizeMoney = playerResult.position === 1 ? race.prize : 
                                playerResult.position === 2 ? race.prize * 0.4 :
                                playerResult.position === 3 ? race.prize * 0.2 : 0;
              
              money += prizeMoney;
              currentHorse.winCount += (isWinner ? 1 : 0);
              currentHorse.totalRaces += 1;
              currentHorse.fatigue = Math.min(100, currentHorse.fatigue + 40);
              if (isWinner) {
                currentHorse.wonRaceNames = [...(currentHorse.wonRaceNames || []), race.name];
                if (['G1', 'G2', 'G3', 'Classic', 'G0', 'G-ultra'].includes(race.grade)) {
                  currentHorse.gradedWins = [...(currentHorse.gradedWins || []), race.grade as Grade];
                }
                if (race.grade === 'G0') {
                  const newTraits = [...(currentHorse.traits || [])];
                  if (!newTraits.includes('頑張ったで賞')) {
                    newTraits.push('頑張ったで賞');
                  }
                  currentHorse.traits = newTraits;
                }
                if (race.grade === 'G-ultra') {
                  const newTraits = [...(currentHorse.traits || [])];
                  if (!newTraits.includes('宇宙の覇者')) {
                    newTraits.push('宇宙の覇者');
                  }
                  currentHorse.traits = newTraits;
                }
              }
              newLogs.unshift(`${currentHorse.name}が自動で${race.name}(${race.grade})に出走しました。結果は${playerResult.position}着でした。`);
            }
          } else if (currentHorse.fatigue < 30) {
            // Auto Train - Only if fatigue is manageable
            const isTurf = Math.random() > 0.5;
            if (isTurf) {
              // Turf focuses on Speed and Guts
              const speedGain = Math.floor(Math.random() * 50) + 30;
              const gutsGain = Math.floor(Math.random() * 30) + 10;
              currentHorse.stats.speed = Math.min(currentHorse.maxStats.speed, currentHorse.stats.speed + speedGain);
              currentHorse.stats.guts = Math.min(currentHorse.maxStats.guts, currentHorse.stats.guts + gutsGain);
              currentHorse.fatigue = Math.min(100, currentHorse.fatigue + 20);
              newLogs.unshift(`${currentHorse.name}が自動調教(芝)を行いました。`);
            } else {
              // Woodchip is balanced
              const speedGain = Math.floor(Math.random() * 30) + 10;
              const staminaGain = Math.floor(Math.random() * 30) + 10;
              const gutsGain = Math.floor(Math.random() * 30) + 10;
              currentHorse.stats.speed = Math.min(currentHorse.maxStats.speed, currentHorse.stats.speed + speedGain);
              currentHorse.stats.stamina = Math.min(currentHorse.maxStats.stamina, currentHorse.stats.stamina + staminaGain);
              currentHorse.stats.guts = Math.min(currentHorse.maxStats.guts, currentHorse.stats.guts + gutsGain);
              currentHorse.fatigue = Math.min(100, currentHorse.fatigue + 25);
              newLogs.unshift(`${currentHorse.name}が自動調教(ウッド)を行いました。`);
            }
          }
        }
        return currentHorse;
      });

      newLogs.unshift(`${year}年 ${month}月 ${week}週 に進みました。`);
      
      let marketMares = prev.marketMares;
      let marketStallions = prev.marketStallions;

      // Refresh market every 3 months
      if (week === 1 && month % 3 === 1) {
        const ownedMareIds = new Set(prev.mares.map(m => m.id));
        const ownedStallionIds = new Set(prev.stallions.map(s => s.id));
        
        const availableMares = INITIAL_MARES.filter(m => !ownedMareIds.has(m.id));
        const availableStallions = STALLIONS.filter(s => !ownedStallionIds.has(s.id));
        
        marketMares = shuffleArray(availableMares).slice(0, 5);
        marketStallions = shuffleArray(availableStallions).slice(0, 8);
        newLogs.unshift('市場のラインナップが更新されました。');
      }

      return { 
        ...prev, 
        week, 
        month, 
        year, 
        horses: updatedHorses, 
        money, 
        marketMares,
        marketStallions,
        logs: newLogs.slice(0, 50),
        weeklyTrainingCount: 0
      };
    });
  };

  const handleBreed = (stallion: Stallion, mare: Mare) => {
    console.log("Breeding started with:", stallion.name, mare.name);
    if (gameState.money < stallion.price) {
      setAlertMessage('資金が足りません');
      return;
    }
    const result = checkBreeding(stallion, mare);
    const foal = result.horse;
    console.log("Foal produced:", foal);
    
    let breedingLog = `${foal.name}が誕生しました！`;
    if (result.nicks) breedingLog += " (ニックス発生！)";
    if (result.inbreeding.length > 0) breedingLog += ` (インブリード: ${result.inbreeding.join(', ')})`;
    if (result.explosion) breedingLog += " (爆発的当たり配合！)";

    setGameState(prev => ({
      ...prev,
      money: prev.money - stallion.price,
      horses: [...prev.horses, foal],
      logs: [breedingLog, ...prev.logs]
    }));
    setBreedingResult(result);
    setSelectedMareId(null);
    setSelectedStallionId(null);
  };

  const getBreedingPreview = (stallion: Stallion, mare: Mare) => {
    const stallionAncestors = [stallion.name, stallion.pedigree.father, stallion.pedigree.mother, ...stallion.pedigree.grandFathers, ...stallion.pedigree.grandMothers];
    const mareAncestors = [mare.name, mare.pedigree.father, mare.pedigree.mother, ...mare.pedigree.grandFathers, ...mare.pedigree.grandMothers];
    
    const inbreeding: string[] = [];
    stallionAncestors.forEach(a => {
      if (a !== '?' && mareAncestors.includes(a) && !inbreeding.includes(a)) {
        inbreeding.push(a);
      }
    });

    const NICKS_TABLE: Record<LineageId, LineageId[]> = {
      speed: ['stamina', 'balance'],
      stamina: ['guts', 'balance'],
      guts: ['speed', 'balance'],
      balance: ['speed', 'stamina', 'guts'],
    };
    const isNick = NICKS_TABLE[stallion.lineageId].includes(mare.lineageId);

    // 爆発力の期待値
    let potential = 0;
    if (isNick) potential += 30;
    potential += inbreeding.length * 15;
    if (stallion.lineageId !== mare.lineageId) potential += 10;

    let grade: 'S' | 'A' | 'B' | 'C' = 'C';
    if (potential >= 60) grade = 'S';
    else if (potential >= 40) grade = 'A';
    else if (potential >= 20) grade = 'B';

    return { inbreeding, isNick, grade, potential };
  };

  const buyMare = (mare: Mare, price: number) => {
    if (gameState.money < price) {
      setAlertMessage('資金が足りません');
      return;
    }
    setGameState(prev => ({
      ...prev,
      money: prev.money - price,
      mares: [...prev.mares, mare],
      marketMares: prev.marketMares.filter(m => m.id !== mare.id),
      logs: [`繁殖牝馬${mare.name}を購入しました。`, ...prev.logs]
    }));
  };

  const handleTrain = (horseId: string, type: 'speed' | 'stamina' | 'guts' | 'diet') => {
    if (gameState.weeklyTrainingCount >= 2) {
      setAlertMessage('今週の調教回数上限（2回）に達しました。');
      return;
    }

    setGameState(prev => {
      const horses = prev.horses.map(h => {
        if (h.id === horseId) {
          const newStats = { ...h.stats };
          if (type === 'diet') {
            // Diet affects health and temperament
            newStats.health = Math.min(h.maxStats.health, h.stats.health + 20);
            newStats.temperament = Math.min(h.maxStats.temperament, h.stats.temperament + 15);
            return { ...h, stats: newStats, fatigue: Math.max(0, h.fatigue - 10) };
          }
          
          const gain = Math.floor(Math.random() * 40) + 20; // 15-45 -> 20-60
          const focusBonus = 1.8; // 1.5 -> 1.8
          
          if (type === 'speed') {
            const finalGain = h.trainingFocus === 'speed' ? Math.round(gain * focusBonus) : gain;
            // Limit Break: Allow exceeding maxStats slightly (up to +100)
            const limit = h.maxStats.speed + 100;
            newStats.speed = Math.min(limit, h.stats.speed + finalGain);
          }
          if (type === 'stamina') {
            const finalGain = h.trainingFocus === 'stamina' ? Math.round(gain * focusBonus) : gain;
            const limit = h.maxStats.stamina + 100;
            newStats.stamina = Math.min(limit, h.stats.stamina + finalGain);
          }
          if (type === 'guts') {
            const finalGain = h.trainingFocus === 'guts' ? Math.round(gain * focusBonus) : gain;
            const limit = h.maxStats.guts + 100;
            newStats.guts = Math.min(limit, h.stats.guts + finalGain);
          }
          
          return { ...h, stats: newStats, fatigue: Math.min(100, h.fatigue + 25) };
        }
        return h;
      });
      return { ...prev, horses, weeklyTrainingCount: prev.weeklyTrainingCount + 1 };
    });
    addLog(type === 'diet' ? '食事管理を行いました。' : '調教を行いました。');
  };

  const handleSetStrategy = (horseId: string, strategy: Strategy) => {
    setGameState(prev => ({
      ...prev,
      horses: prev.horses.map(h => h.id === horseId ? { ...h, strategy } : h)
    }));
    addLog('作戦を変更しました。');
  };

  const allStallions = useMemo(() => {
    const seen = new Set<string>();
    const unique: Stallion[] = [];
    [...gameState.marketStallions, ...gameState.stallions].forEach(s => {
      if (!seen.has(s.id)) {
        seen.add(s.id);
        unique.push(s);
      }
    });
    return unique;
  }, [gameState.marketStallions, gameState.stallions]);

  const [breedingTab, setBreedingTab] = useState<'selection' | 'advisor'>('selection');

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    const newMessages = [...chatMessages, { role: 'user' as const, text }];
    setChatMessages(newMessages);
    setChatInput('');
    setIsChatLoading(true);

    const mare = gameState.mares.find(m => m.id === selectedMareId);
    const stallion = allStallions.find(s => s.id === selectedStallionId);

    const advice = await getBreedingAdvice(gameState, mare, stallion, text);
    
    setChatMessages([...newMessages, { role: 'ai' as const, text: advice.message }]);
    setIsChatLoading(false);

    if (advice.suggestedMareIds?.length > 0 && !selectedMareId) {
      // Auto-select if suggested and only one
      // setSelectedMareId(advice.suggestedMareIds[0]);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (view === 'breeding' && chatMessages.length === 0) {
      handleSendMessage('こんにちは、ブリーディングのアドバイスをください。');
    }
  }, [view]);

  const calculateRating = (horse: Horse) => {
    const s = horse.stats;
    const base = (Number(s.speed) + Number(s.stamina) + Number(s.guts) + Number(s.explosiveness)) / 4;
    const luckBonus = (Number(s.luck) / 10);
    return Math.floor(base + luckBonus);
  };

  const generateAvailableRaces = (horse: Horse): Race[] => {
    const wins = horse.winCount;
    const total = horse.totalRaces;
    
    let possibleGrades: Grade[];
    if (total === 0) possibleGrades = ['Newcomer'];
    else if (wins === 0) possibleGrades = ['Maiden'];
    else if (wins < 3) possibleGrades = ['Condition', 'Open'];
    else if (wins < 5) possibleGrades = ['Open', 'G3'];
    else if (wins < 8) possibleGrades = ['G3', 'G2', 'G1', 'Classic'];
    else if (wins < 12) possibleGrades = ['G2', 'G1', 'Classic', 'G0'];
    else possibleGrades = ['G1', 'Classic', 'G0', 'G-ultra'];

    const finalGrades = [...possibleGrades];
    // 5% chance for Ultra if horse is experienced
    if (wins >= 5 && Math.random() < 0.05) finalGrades.push('G-ultra');

    const races: Race[] = [];
    const count = 4; 
    
    for (let i = 0; i < count; i++) {
      const grade = finalGrades[Math.floor(Math.random() * finalGrades.length)];
      const isUltra = grade === 'G-ultra';
      
      races.push({
        id: Math.random().toString(36).substr(2, 9),
        name: isUltra
          ? ['ゼウス・アルティメット', 'ポセイドン・ディープ', 'ハデス・インフェルノ'][Math.floor(Math.random() * 3)]
          : grade === 'G0' 
          ? '銀河万博記念 (G0)'
          : (grade === 'G1' || grade === 'Classic') 
          ? RACE_NAMES[Math.floor(Math.random() * 27)]
          : RACE_NAMES[27 + Math.floor(Math.random() * (RACE_NAMES.length - 27))],
        grade,
        distance: isUltra ? 4000 : grade === 'G0' ? 3200 : [1200, 1600, 2000, 2400, 3200][Math.floor(Math.random() * 5)],
        prize: { 
          'Newcomer': 1000000,
          'Maiden': 1500000,
          'Condition': 3000000,
          'Open': 5000000,
          'G3': 10000000,
          'G2': 20000000,
          'G1': 50000000,
          'Classic': 80000000,
          'G0': 200000000,
          'G-ultra': 500000000
        }[grade] || 3000000,
        month: gameState.month,
        week: gameState.week,
        trackCondition: ['Good', 'Yielding', 'Heavy'][Math.floor(Math.random() * 3)] as TrackCondition
      });
    }
    return races;
  };

  const handleRaceClick = (horse: Horse) => {
    if (horse.fatigue > 60) {
      setAlertMessage('馬が疲れています。休養させてください。');
      return;
    }
    if (horse.isInjured) {
      setAlertMessage('馬が故障しています。治療が必要です。');
      return;
    }
    const races = generateAvailableRaces(horse);
    setAvailableRaces(races);
    setView('race_selection');
  };

  const startRace = (horse: Horse, race: Race) => {
    if (horse.fatigue > 60) {
      setAlertMessage('馬が疲れています。休養させてください。');
      return;
    }
    if (horse.isInjured) {
      setAlertMessage('馬が故障しています。治療が必要です。');
      return;
    }
    
    setCurrentRace(race);
    const enemyCount = race.grade === 'G-ultra' ? 21 :
                       race.grade === 'G0' ? 17 :
                       race.grade === 'G1' || race.grade === 'Classic' ? 15 : 
                       race.grade === 'G2' ? 12 : 
                       race.grade === 'G3' ? 10 : 8;
    const enemies = generateEnemyHorses(enemyCount, race.grade);
    const results = simulateRace(horse, enemies, race);
    setRaceResult(results);
    setRaceStep(0); 
    setRaceActive(true);
    setView('race');
  };

  useEffect(() => {
    if (raceActive && raceResult && currentRace) {
      const maxSteps = Math.max(...raceResult.map(r => r.progress.length));
      
      // Check if winner reached goal
      const winner = raceResult.find(r => r.position === 1);
      const winnerProgress = winner?.progress[raceStep]?.distance || 0;
      
      if (winnerProgress >= currentRace.distance) {
        // Winner reached goal, stop race animation
        setRaceActive(false);
        return;
      }

      if (raceStep < maxSteps - 1) {
        // Simulation snapshot interval is 0.1s. 
        // Playing at 50ms per step makes the race "visually fast" (2x simulated speed),
        // but consistent. If we want 1:1 with simulated time, use 100ms.
        // User wants 3x fast, but that's already in the speed calculation.
        // Let's use 60ms for a snappy but watchable playback.
        const timer = setTimeout(() => {
          setRaceStep(s => Math.min(maxSteps - 1, s + 1));
        }, 60); 
        return () => clearTimeout(timer);
      } else {
        setRaceActive(false);
      }
    }
  }, [raceActive, raceStep, raceResult, currentRace]);

  const finishRace = () => {
    if (!raceResult || !currentRace || !selectedHorse) return;
    const playerResult = raceResult.find(r => r.horseId === selectedHorse.id);
    if (!playerResult) return;

    const isWinner = playerResult.position === 1;
    const isInjured = playerResult.time === 999;
    
    const prizeMoney = isWinner ? currentRace.prize : 
                      playerResult.position === 2 ? currentRace.prize * 0.4 :
                      playerResult.position === 3 ? currentRace.prize * 0.2 : 0;

    let reportedInjuryType = '';

    setGameState(prev => {
      const updatedHorses = prev.horses.map(h => {
        if (h.id === selectedHorse.id) {
          const newGradedWins = [...(h.gradedWins || [])];
          const newWonRaceNames = [...(h.wonRaceNames || [])];
          
          if (isWinner) {
            newWonRaceNames.push(currentRace.name);
            if (['G1', 'G2', 'G3', 'Classic', 'G0', 'G-ultra'].includes(currentRace.grade)) {
              newGradedWins.push(currentRace.grade as Grade);
              
              // Limit Break: Increase max stats when winning major races
              const limitGain = currentRace.grade === 'G-ultra' ? 50 : 
                                currentRace.grade === 'G0' ? 30 : 
                                currentRace.grade === 'G1' || currentRace.grade === 'Classic' ? 20 : 10;
              
              h.maxStats.speed += limitGain;
              h.maxStats.stamina += limitGain;
              h.maxStats.guts += limitGain;
              h.maxStats.explosiveness += limitGain;
              h.maxStats.luck += limitGain / 2;
            }
            if (currentRace.grade === 'G0') {
              const newTraits = [...(h.traits || [])];
              if (!newTraits.includes('頑張ったで賞')) {
                newTraits.push('頑張ったで賞');
              }
              h.traits = newTraits;
            }
            if (currentRace.grade === 'G-ultra') {
              const newTraits = [...(h.traits || [])];
              if (!newTraits.includes('宇宙の覇者')) {
                newTraits.push('宇宙の覇者');
              }
              h.traits = newTraits;
              // Luck bonus for Ultra race winners
              h.stats.luck = Math.min(1000, h.stats.luck + 20);
              h.maxStats.luck = Math.max(h.maxStats.luck, h.stats.luck);
            }
          }
          
          let injuryStatus = h.isInjured;
          let injuryType = h.injuryType;
          if (isInjured) {
            injuryStatus = true;
            injuryType = ['骨折', '剥離骨折', '屈腱炎'][Math.floor(Math.random() * 3)];
            reportedInjuryType = injuryType;
          }

          return {
            ...h,
            winCount: h.winCount + (isWinner ? 1 : 0),
            totalRaces: h.totalRaces + 1,
            gradedWins: newGradedWins,
            wonRaceNames: newWonRaceNames,
            isInjured: injuryStatus,
            injuryType: injuryType,
            fatigue: Math.min(100, h.fatigue + 50), // Increase fatigue after race
            currentCondition: Math.min(100, h.currentCondition + 10) // Sharpen condition after race
          };
        }
        return h;
      });

      const raceLog = isInjured 
        ? `${currentRace.name}で${selectedHorse.name}が故障しました(${reportedInjuryType})。`
        : `${currentRace.name}に出走しました。結果は${playerResult.position}着でした。`;

      return {
        ...prev,
        money: prev.money + prizeMoney,
        horses: updatedHorses,
        logs: [raceLog, ...prev.logs]
      };
    });

    setView('ranch');
    setRaceResult(null);
    setCurrentRace(null);
  };

  const handleRetire = (horse: Horse) => {
    setHorseToRetire(horse);
    setShowRetireConfirm(true);
  };

  const handleConfirmRetire = () => {
    if (!horseToRetire) return;
    const horse = horseToRetire;

    setGameState(prev => {
      const isGradedWinner = (horse.gradedWins || []).length > 0;
      const newMares = [...prev.mares];
      const newStallions = [...prev.stallions];

      if (isGradedWinner) {
        if (horse.gender === 'filly') {
          newMares.push({
            id: horse.id,
            name: horse.name,
            lineageId: horse.lineageId,
            stats: horse.stats,
            pedigree: horse.pedigree
          });
        } else {
          newStallions.push({
            id: horse.id,
            name: horse.name,
            lineageId: horse.lineageId,
            price: ((horse.gradedWins || []).includes('G1') || (horse.gradedWins || []).includes('Classic')) ? 5000000 : 2000000,
            stats: horse.stats,
            distanceAptitude: horse.distanceAptitude,
            growthType: horse.growthType,
            strategy: horse.strategy,
            pedigree: horse.pedigree,
            explosivePower: horse.explosivePower || 100
          });
        }
      }

      return {
        ...prev,
        horses: prev.horses.filter(h => h.id !== horse.id),
        mares: newMares,
        stallions: newStallions,
        logs: [`${horse.name}が引退しました。${isGradedWinner ? '種牡馬/繁殖牝馬として登録されました。' : ''}`, ...prev.logs]
      };
    });
    setSelectedHorseId(null);
    setShowRetireConfirm(false);
    setHorseToRetire(null);
    setView('ranch');
  };

  const resetGame = () => {
    setShowResetConfirm(true);
  };

  const registerHorseToBC = (horse: Horse) => {
    setGameState(prev => {
      const exists = prev.registeredHorses.some(h => h.id === horse.id);
      const newRegistered = exists 
        ? prev.registeredHorses.map(h => h.id === horse.id ? horse : h)
        : [...prev.registeredHorses, horse];
      
      return {
        ...prev,
        registeredHorses: newRegistered,
        logs: [`${horse.name}をブリーダーズカップに${exists ? '更新' : '登録'}しました！`, ...prev.logs]
      };
    });
    setAlertMessage('ブリーダーズカップに登録・更新しました！');
  };

  const startBCRace = () => {
    if (gameState.registeredHorses.length < 2) {
      setAlertMessage('登録馬が2頭以上必要です');
      return;
    }
    
    const race: Race = {
      id: 'bc-race',
      name: 'ブリーダーズカップ・ドリームマッチ',
      grade: 'G1',
      distance: 2400,
      prize: 0,
      month: 1,
      week: 1,
      trackCondition: 'Good'
    };
    
    setCurrentRace(race);
    // Use registered horses as the field
    const field = gameState.registeredHorses.slice(0, 18);
    const results = simulateRace(field[0], field.slice(1), race);
    setRaceResult(results);
    setRaceStep(0);
    setRaceActive(true);
    setView('race');
  };

  const handleConfirmReset = () => {
    localStorage.removeItem('star_derby_save');
    setGameState({
      ranchName: '',
      money: INITIAL_MONEY,
      year: 1,
      month: 1,
      week: 1,
      horses: [],
      mares: [INITIAL_MARES[0]],
      stallions: [],
      marketMares: INITIAL_MARES.slice(1, 6),
      marketStallions: STALLIONS.slice(0, 8),
      hallOfFame: [],
      registeredHorses: [],
      logs: ['牧場経営をスタートしました！']
    });
    setShowResetConfirm(false);
    setView('title');
  };

  return (
    <div className="min-h-screen bg-black text-slate-50 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>
      {/* Header */}
      <header className="bg-slate-950/90 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 px-4 py-3">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 cursor-pointer hover:scale-110 transition-transform"
              onClick={() => setView('ranch')}
            >
              <Star className="text-white w-6 h-6 fill-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tighter italic cursor-pointer" onClick={() => setView('ranch')}>STAR DERBY</h1>
                {gameState.ranchName && (
                  <input 
                    type="text"
                    value={gameState.ranchName}
                    onChange={(e) => setGameState(prev => ({ ...prev, ranchName: e.target.value }))}
                    className="bg-white/5 border-none px-2 py-0.5 rounded text-[10px] font-black text-indigo-400 uppercase tracking-widest outline-none focus:bg-white/10 transition-all w-24"
                  />
                )}
              </div>
              <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Bloodline Galaxy</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-6">
            <button 
              onClick={resetGame}
              className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-full border border-red-500/20 text-red-400 text-[10px] sm:text-xs font-bold transition-all hover:scale-105 active:scale-95"
              title="データをリセット"
            >
              <History className="w-3 h-3" />
              <span>RESET</span>
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium">
                {gameState.year}Y {gameState.month}M {gameState.week}W
                <span className="ml-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                  {gameState.month >= 3 && gameState.month <= 5 ? '🌸 Spring' :
                   gameState.month >= 6 && gameState.month <= 8 ? '☀️ Summer' :
                   gameState.month >= 9 && gameState.month <= 11 ? '🍂 Autumn' : '❄️ Winter'}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
              <Coins className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-black text-emerald-400 tracking-tight">{gameState.money.toLocaleString()} <span className="text-[10px] opacity-70">JPY</span></span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 pb-48">
        <AnimatePresence mode="wait">
          {view === 'title' && (
            <motion.div 
              key="title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center p-6 overflow-hidden"
            >
              {/* Background Effects */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-600/20 via-transparent to-transparent" />
              <div className="absolute inset-0 opacity-30">
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      y: [0, -1000],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: Math.random() * 5 + 5,
                      repeat: Infinity,
                      ease: "linear",
                      delay: Math.random() * 5
                    }}
                    className="absolute w-px h-20 bg-gradient-to-b from-transparent via-white to-transparent"
                    style={{ left: Math.random() * 100 + "%", top: "100%" }}
                  />
                ))}
              </div>

              <div className="relative z-10 text-center space-y-12">
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.5)]">
                      <Star className="text-white w-14 h-14 fill-white" />
                    </div>
                  </div>
                  <h1 className="text-7xl md:text-8xl font-black italic tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                    STAR DERBY
                  </h1>
                  <p className="text-xl md:text-2xl text-indigo-400 font-mono tracking-[0.5em] uppercase font-bold">
                    Bloodline Galaxy
                  </p>
                </motion.div>

                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col items-center gap-4">
                    <button 
                      onClick={() => {
                        if (!gameState.ranchName) {
                          setView('registration');
                        } else {
                          setView('ranch');
                        }
                      }}
                      className="group relative px-12 py-5 bg-white text-slate-950 rounded-full font-black text-2xl tracking-widest hover:scale-110 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] active:scale-95"
                    >
                      <span className="relative z-10">START GAME</span>
                      <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity" />
                    </button>
                    
                    {localStorage.getItem('star_derby_save') && (
                      <button 
                        onClick={resetGame}
                        className="text-[10px] font-black tracking-[0.3em] text-red-500/60 hover:text-red-500 uppercase transition-colors"
                      >
                        RESET PROGRESS
                      </button>
                    )}
                  </div>
                  <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">
                    Establish your legacy among the stars
                  </p>
                </motion.div>
              </div>

              <div className="absolute bottom-10 text-[10px] text-slate-700 font-mono tracking-widest uppercase">
                © 2026 GALAXY RACING SIMULATION ENGINE
              </div>
            </motion.div>
          )}

          {view === 'ranch' && (
            <motion.div 
              key="ranch"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Horse List */}
                <div className="md:col-span-2 space-y-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <h2 className="text-2xl font-black italic tracking-tighter flex items-center gap-2">
                        <Activity className="w-6 h-6 text-indigo-500" />
                        {gameState.ranchName.toUpperCase()} STABLE
                      </h2>
                      <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">Manage your champions</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setView('breedersCup')}
                        className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-sm font-black px-6 py-2.5 rounded-full transition-all flex items-center gap-2 shadow-xl shadow-orange-500/20"
                      >
                        <Trophy className="w-4 h-4" />
                        BC
                      </button>
                      <button 
                        onClick={() => setView('breeding')}
                        className="bg-white text-slate-950 hover:bg-indigo-50 text-sm font-black px-6 py-2.5 rounded-full transition-all flex items-center gap-2 shadow-xl shadow-white/10"
                      >
                        <Dna className="w-4 h-4" />
                        BREEDING
                      </button>
                    </div>
                  </div>

                  {gameState.horses.length === 0 ? (
                    <div className="bg-slate-900/40 border-2 border-dashed border-white/5 rounded-3xl p-16 text-center group hover:border-indigo-500/30 transition-colors">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Heart className="text-slate-600 group-hover:text-indigo-400" />
                      </div>
                      <p className="text-slate-500 font-medium">No horses in stable. Start breeding your first star.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {gameState.horses.map(horse => (
                        <motion.div 
                          layoutId={horse.id}
                          key={horse.id}
                          onClick={() => setSelectedHorseId(horse.id)}
                          className={`p-5 rounded-3xl border-2 transition-all cursor-pointer group relative overflow-hidden ${
                            selectedHorseId === horse.id 
                            ? 'bg-indigo-600/10 border-indigo-500 shadow-2xl shadow-indigo-500/20' 
                            : 'bg-slate-900 border-white/5 hover:border-white/10'
                          }`}
                        >
                          <div className="flex justify-between items-center relative z-10">
                            <div className="flex items-center gap-5">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${horse.gender === 'colt' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-pink-500/20 text-pink-400 border-pink-500/30'} border`} style={{ backgroundColor: horse.color + '22' }}>
                                {horse.gender === 'colt' ? '🐎' : '🐎'}
                                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-[10px] font-bold">
                                  {horse.gender === 'colt' ? '♂️' : '♀️'}
                                </div>
                              </div>
                              <div>
                                <h3 className="font-black text-xl italic tracking-tight">{horse.name}</h3>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-[10px] font-bold px-2 py-0.5 bg-white/5 rounded text-slate-400 uppercase tracking-tighter">
                                    {horse.age}yo 
                                    <span className="ml-1 text-slate-600">
                                      ({horse.age === 0 ? 'Foal' : horse.age === 1 ? 'Yearling' : 'Active'})
                                    </span>
                                    <span className="ml-1 text-slate-500">({getPhysicalState(horse)})</span>
                                  </span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-500/10 rounded text-indigo-400 uppercase tracking-tighter">{horse.winCount} WINS</span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 bg-white/5 rounded text-slate-500 uppercase tracking-tighter">
                                    {horse.strategy === 'escape' ? 'Runner' : 
                                     horse.strategy === 'lead' ? 'Pre-front' : 
                                     horse.strategy === 'insert' ? 'Mid-pack' : 'Closer'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <div key={i} className={`w-1.5 h-4 rounded-full ${i < Math.floor(horse.stats.speed / 200) ? 'bg-indigo-500' : 'bg-white/5'}`} />
                                ))}
                              </div>
                              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Speed Potential</span>
                            </div>
                          </div>
                          {selectedHorseId === horse.id && (
                            <motion.div 
                              layoutId="active-glow"
                              className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent pointer-events-none"
                            />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                  {selectedHorse ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-slate-900 border border-white/5 rounded-[2rem] p-6 space-y-8 sticky top-24 shadow-2xl"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl font-black italic text-indigo-400 border border-white/10 shadow-inner">
                          {selectedHorse.age}
                          <span className="text-[10px] ml-0.5 not-italic text-slate-500">y</span>
                        </div>
                        <div className="space-y-1 flex-1">
                          <h3 className="font-black italic text-indigo-400 tracking-tighter text-[10px] uppercase">Horse Profile</h3>
                          <input 
                            type="text"
                            value={selectedHorse.name}
                            onChange={(e) => {
                              const newName = e.target.value;
                              setGameState(prev => ({
                                ...prev,
                                horses: prev.horses.map(h => h.id === selectedHorse.id ? { ...h, name: newName } : h)
                              }));
                            }}
                            className="bg-transparent border-none p-0 font-black italic text-2xl tracking-tight text-white outline-none focus:text-indigo-400 transition-colors w-full"
                          />
                        </div>
                        <button onClick={() => setView('pedigree')} className="p-2 hover:bg-white/5 rounded-full transition-colors shrink-0">
                          <History className="w-5 h-5 text-slate-500" />
                        </button>
                      </div>

                      <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/5">
                          <div className="bg-white/5 p-4 rounded-2xl space-y-1">
                            <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Growth Type</div>
                            <div className="text-xs font-black text-white uppercase italic">{selectedHorse.growthType}</div>
                          </div>
                          <div className="bg-white/5 p-4 rounded-2xl space-y-1">
                            <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Age</div>
                            <div className="text-xs font-black text-white uppercase italic">
                              {selectedHorse.age}yo 
                              <span className="ml-1 text-[8px] text-slate-600">
                                ({selectedHorse.age === 0 ? 'Foal' : selectedHorse.age === 1 ? 'Yearling' : 'Active'})
                              </span>
                              <span className="ml-1 text-[8px] text-slate-500">({getPhysicalState(selectedHorse)})</span>
                            </div>
                          </div>
                          <div className="bg-white/5 p-4 rounded-2xl space-y-1">
                            <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Distance</div>
                            <div className="text-xs font-black text-emerald-400 uppercase italic">{selectedHorse.distanceAptitude[0]}m - {selectedHorse.distanceAptitude[1]}m</div>
                          </div>
                          <div className="bg-white/5 p-4 rounded-2xl space-y-1">
                            <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Condition</div>
                            <div className="text-xs font-black text-amber-400 uppercase italic">{Math.floor(selectedHorse.currentCondition)}%</div>
                          </div>
                        </div>

                        <div className="bg-white/5 p-4 rounded-2xl flex items-center justify-between border border-white/5">
                          <div className="space-y-1">
                            <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Running Style</div>
                            <select 
                              value={selectedHorse.strategy}
                              onChange={(e) => {
                                const newStrategy = e.target.value as Strategy;
                                setGameState(prev => ({
                                  ...prev,
                                  horses: prev.horses.map(h => h.id === selectedHorse.id ? { ...h, strategy: newStrategy } : h)
                                }));
                              }}
                              className="bg-transparent border-none p-0 font-black text-indigo-400 uppercase italic outline-none cursor-pointer"
                            >
                              <option value="escape">Runner (逃げ)</option>
                              <option value="lead">Pre-front (先行)</option>
                              <option value="insert">Mid-pack (差し)</option>
                              <option value="stay">Closer (追込)</option>
                            </select>
                          </div>
                        </div>

                        <div className="bg-white/5 p-4 rounded-2xl flex items-center justify-between border border-white/5">
                          <div className="space-y-1">
                            <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Training Focus</div>
                            <select 
                              value={selectedHorse.trainingFocus}
                              onChange={(e) => {
                                const newFocus = e.target.value as any;
                                setGameState(prev => ({
                                  ...prev,
                                  horses: prev.horses.map(h => h.id === selectedHorse.id ? { ...h, trainingFocus: newFocus } : h)
                                }));
                              }}
                              className="bg-transparent border-none p-0 font-black text-amber-400 uppercase italic outline-none cursor-pointer"
                            >
                              <option value="speed">あ行: Speed</option>
                              <option value="stamina">い行: Stamina</option>
                              <option value="guts">う行: Guts</option>
                              <option value="temperament">え行: Temperament</option>
                              <option value="luck">お行: Luck</option>
                              <option value="health">ー: Health</option>
                              <option value="explosiveness">確率: Explosiveness</option>
                            </select>
                          </div>
                        </div>

                        <div className="bg-white/5 p-4 rounded-2xl flex items-center justify-between border border-white/5">
                          <div className="space-y-1">
                            <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Auto Mode</div>
                            <div className="text-xs font-black text-white uppercase italic">{selectedHorse.isAutoMode ? 'ENABLED' : 'DISABLED'}</div>
                          </div>
                          <button 
                            onClick={() => {
                              setGameState(prev => ({
                                ...prev,
                                horses: prev.horses.map(h => h.id === selectedHorse.id ? { ...h, isAutoMode: !h.isAutoMode } : h)
                              }));
                            }}
                            className={`w-12 h-6 rounded-full transition-colors relative ${selectedHorse.isAutoMode ? 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-slate-700'}`}
                          >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${selectedHorse.isAutoMode ? 'left-7' : 'left-1'}`} />
                          </button>
                        </div>

                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            {(() => {
                              const wonNames = selectedHorse.wonRaceNames || [];
                              const isTripleCrown = TRIPLE_CROWN_RACES.every(name => wonNames.includes(name));
                              return (
                                <>
                                  {isTripleCrown && (
                                    <span className="text-[10px] font-black bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 text-black px-3 py-1 rounded-lg uppercase tracking-[0.2em] border-2 border-yellow-300 shadow-[0_0_20px_rgba(245,158,11,0.6)] animate-bounce flex items-center gap-2">
                                      <Trophy className="w-3 h-3" />
                                      三冠馬 (Triple Crown)
                                      <Trophy className="w-3 h-3" />
                                    </span>
                                  )}
                                  {(selectedHorse.gradedWins || []).map((g, i) => (
                                    <span 
                                      key={i} 
                                      className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest border ${
                                        g === 'G-ultra'
                                          ? 'bg-black text-amber-400 border-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.5)] font-black'
                                          : g === 'G0'
                                          ? 'bg-red-600 text-white border-red-400 shadow-lg font-black'
                                          : g === 'G1' 
                                          ? 'bg-red-600/20 text-red-500 border-red-600/40' 
                                          : g === 'Classic'
                                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                                          : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                                      }`}
                                    >
                                      {g} HOLDER
                                    </span>
                                  ))}
                                </>
                              );
                            })()}
                          </div>
                          {selectedHorse.traits && selectedHorse.traits.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {selectedHorse.traits.map((trait, i) => (
                                <span key={i} className="text-[8px] font-black bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded uppercase tracking-widest border border-amber-500/30 flex items-center gap-1">
                                  <Sparkles className="w-2 h-2" />
                                  {trait}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="pt-2">
                          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Performance Stats</h4>
                          <div className="space-y-4">
                            <StatRow label="SPEED" value={selectedHorse.stats.speed} max={selectedHorse.maxStats.speed} color="bg-indigo-500" />
                            <StatRow label="STAMINA" value={selectedHorse.stats.stamina} max={selectedHorse.maxStats.stamina} color="bg-emerald-500" />
                            <StatRow label="GUTS" value={selectedHorse.stats.guts} max={selectedHorse.maxStats.guts} color="bg-orange-500" />
                            <StatRow label="TEMPER" value={selectedHorse.stats.temperament} max={selectedHorse.maxStats.temperament} color="bg-purple-500" />
                            <StatRow label="HEALTH" value={selectedHorse.stats.health} max={selectedHorse.maxStats.health} color="bg-pink-500" />
                            <StatRow label="LUCK" value={selectedHorse.stats.luck} max={selectedHorse.maxStats.luck} color="bg-yellow-500" />
                            <StatRow label="EXPLOSION" value={selectedHorse.stats.explosiveness} max={selectedHorse.maxStats.explosiveness} color="bg-amber-500" />
                            <div className="pt-2 border-t border-white/5">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Explosive Power (爆発力)</span>
                                <span className="text-sm font-black text-amber-400 italic flex items-center gap-1">
                                  <Zap className="w-3 h-3" />
                                  {selectedHorse.explosivePower}
                                </span>
                              </div>
                              <p className="text-[8px] text-slate-600 mt-1 uppercase tracking-tighter">Influences potential stat variance during breeding</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-4">
                          <div className="flex justify-between text-[10px] font-black tracking-widest text-slate-500 mb-2">
                            <span>FATIGUE</span>
                            <span className={selectedHorse.fatigue > 60 ? 'text-red-400' : 'text-slate-300'}>{selectedHorse.fatigue}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${selectedHorse.fatigue}%` }}
                              className={`h-full transition-colors ${selectedHorse.fatigue > 60 ? 'bg-red-500' : 'bg-indigo-400'}`} 
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 grid grid-cols-3 gap-4">
                        <button 
                          onClick={() => setView('training')}
                          className="bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-2xl text-xs font-black tracking-widest flex flex-col items-center gap-2 transition-all active:scale-95"
                        >
                          <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                          TRAIN
                        </button>
                        <button 
                          onClick={() => handleRaceClick(selectedHorse)}
                          className="bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl text-xs font-black tracking-widest flex flex-col items-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
                        >
                          <Play className="w-5 h-5 text-white fill-white" />
                          RACE
                        </button>
                        <button 
                          onClick={() => handleRetire(selectedHorse)}
                          className="bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 py-4 rounded-2xl text-xs font-black tracking-widest flex flex-col items-center gap-2 transition-all active:scale-95"
                        >
                          <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
                          RETIRE
                        </button>
                        <button 
                          onClick={() => registerHorseToBC(selectedHorse)}
                          className="col-span-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 py-4 rounded-2xl text-xs font-black tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 text-amber-400"
                        >
                          <Trophy className="w-5 h-5" />
                          REGISTER TO BREEDERS' CUP
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="bg-slate-900/20 border border-white/5 rounded-[2rem] p-12 text-center text-slate-600 italic">
                      Select a horse to view details
                    </div>
                  )}

                  <div className="bg-slate-900 border border-white/5 rounded-[2rem] p-6">
                    <h3 className="font-black italic text-slate-400 text-sm mb-4 tracking-tighter">LATEST ACTIVITY</h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                      {gameState.logs.map((log, i) => (
                        <div key={i} className="text-xs text-slate-500 border-l-2 border-indigo-500/30 pl-4 py-1 leading-relaxed">
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'breeding' && (
            <motion.div 
              key="breeding"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-[calc(100vh-200px)] flex flex-col gap-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button onClick={() => setView('ranch')} className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <div>
                    <h2 className="text-3xl font-black italic tracking-tighter uppercase">Breeding Center</h2>
                    <p className="text-xs text-indigo-400 font-mono tracking-widest uppercase">Select the perfect match</p>
                  </div>
                </div>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                  <button 
                    onClick={() => setBreedingTab('selection')}
                    className={`px-6 py-2 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all ${breedingTab === 'selection' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Selection
                  </button>
                  <button 
                    onClick={() => setBreedingTab('advisor')}
                    className={`px-6 py-2 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all ${breedingTab === 'advisor' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Advisor
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-hidden">
                {breedingTab === 'selection' ? (
                  <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6 overflow-y-auto pr-2 scrollbar-hide">
                      <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8">
                        <h3 className="text-sm font-black italic tracking-tighter uppercase text-slate-400 mb-6 flex items-center gap-2">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                          Select Mare
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                          {gameState.mares.map(m => (
                            <button
                              key={m.id}
                              onClick={() => setSelectedMareId(m.id)}
                              className={`p-4 rounded-2xl border text-left transition-all group ${
                                selectedMareId === m.id 
                                ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/10' 
                                : 'bg-white/5 border-white/5 hover:border-white/10'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="font-black italic text-lg tracking-tight">{m.name}</div>
                                  <div className="text-[10px] font-bold text-slate-500 uppercase mt-1">{m.lineageId}系</div>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <ChevronRight className="w-5 h-5 text-indigo-400" />
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6 overflow-y-auto pr-2 scrollbar-hide">
                      <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8">
                        <h3 className="text-sm font-black italic tracking-tighter uppercase text-slate-400 mb-6 flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full" />
                          Select Stallion
                        </h3>
                        {!selectedMareId ? (
                          <div className="flex flex-col items-center justify-center py-20 text-slate-600">
                            <Dna className="w-12 h-12 mb-4 opacity-20" />
                            <p className="text-xs font-bold uppercase tracking-widest">First, select a mare</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-3">
                            {allStallions.map(s => (
                              <button
                                key={s.id}
                                onClick={() => setSelectedStallionId(s.id)}
                                className={`p-4 rounded-2xl border text-left transition-all group ${
                                  selectedStallionId === s.id 
                                  ? 'bg-purple-600/20 border-purple-500 shadow-lg shadow-purple-500/10' 
                                  : 'bg-white/5 border-white/5 hover:border-white/10'
                                }`}
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className="font-black italic text-lg tracking-tight">{s.name}</div>
                                    <div className="flex items-center gap-3 mt-1">
                                      <div className="text-[10px] font-bold text-slate-500 uppercase">{s.lineageId}系</div>
                                      <div className="text-[10px] font-bold text-amber-400 uppercase flex items-center gap-1">
                                        <Zap className="w-2 h-2" />
                                        爆発力: {s.explosivePower}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm font-black text-emerald-400">¥{s.price.toLocaleString()}</div>
                                    <div className="text-[8px] font-bold text-slate-500 uppercase">Stud Fee</div>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedMareId && selectedStallionId && (
                      <div className="lg:col-span-2 flex justify-center pt-6">
                        <button
                          onClick={() => {
                            const stallion = allStallions.find(s => s.id === selectedStallionId);
                            const mare = gameState.mares.find(m => m.id === selectedMareId);
                            if (stallion && mare) handleBreed(stallion, mare);
                          }}
                          className="px-12 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-2xl font-black text-lg tracking-widest shadow-2xl shadow-indigo-500/20 transition-all active:scale-95 flex items-center gap-4"
                        >
                          <Zap className="w-6 h-6" />
                          EXECUTE BREEDING
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col bg-slate-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
                      {chatMessages.map((msg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[80%] p-4 rounded-3xl text-sm leading-relaxed ${
                            msg.role === 'user' 
                            ? 'bg-indigo-600 text-white rounded-tr-none' 
                            : 'bg-white/5 text-slate-200 border border-white/10 rounded-tl-none'
                          }`}>
                            {msg.text}
                          </div>
                        </motion.div>
                      ))}
                      {isChatLoading && (
                        <div className="flex justify-start">
                          <div className="bg-white/5 p-4 rounded-3xl rounded-tl-none border border-white/10">
                            <div className="flex gap-1">
                              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    <div className="p-6 bg-slate-900 border-t border-white/5">
                      <div className="flex gap-4">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(chatInput)}
                          placeholder="アドバイザーに相談する..."
                          className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                        <button
                          onClick={() => handleSendMessage(chatInput)}
                          disabled={isChatLoading || !chatInput.trim()}
                          className="w-14 h-14 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-2xl flex items-center justify-center transition-all active:scale-95"
                        >
                          <Send className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {view === 'breedersCup' && (
            <motion.div 
              key="breedersCup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button onClick={() => setView('ranch')} className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <div>
                    <h2 className="text-3xl font-black italic tracking-tighter uppercase">Breeders' Cup</h2>
                    <p className="text-xs text-indigo-400 font-mono tracking-widest uppercase">The ultimate showdown of champions</p>
                  </div>
                </div>
                <button 
                  onClick={startBCRace}
                  disabled={gameState.registeredHorses.length < 2}
                  className="px-10 py-5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-3xl text-sm font-black tracking-widest transition-all active:scale-95 shadow-2xl shadow-indigo-500/30 flex items-center gap-3"
                >
                  <Trophy className="w-5 h-5 text-white" />
                  START DREAM MATCH
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gameState.registeredHorses.length === 0 ? (
                  <div className="col-span-full py-20 text-center space-y-4 bg-slate-900/50 border border-white/5 rounded-[3rem]">
                    <Trophy className="w-16 h-16 text-slate-700 mx-auto" />
                    <p className="text-slate-500 italic">No horses registered for the Breeders' Cup yet.</p>
                  </div>
                ) : (
                  gameState.registeredHorses.map(h => (
                    <div key={h.id} className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-6 space-y-4 relative overflow-hidden group">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-black text-xl italic tracking-tight text-white group-hover:text-indigo-400 transition-colors">{h.name}</h4>
                          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{h.gender === 'colt' ? 'COLT' : 'FILLY'} / {h.age}yo</div>
                        </div>
                        <GradeBadge grade="G1" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/5 p-3 rounded-2xl text-center">
                          <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Wins</div>
                          <div className="text-sm font-black text-white italic">{h.winCount}</div>
                        </div>
                        <div className="bg-white/5 p-3 rounded-2xl text-center">
                          <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Lineage</div>
                          <div className="text-sm font-black text-indigo-400 italic uppercase">{h.lineageId}</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
          {view === 'training' && selectedHorse && (
            <motion.div 
              key="training"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto space-y-10"
            >
              <div className="text-center space-y-3">
                <h2 className="text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">TRAINING CENTER</h2>
                <p className="text-xs text-slate-500 uppercase tracking-[0.3em] font-mono">Push the limits of evolution</p>
              </div>

              <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-10 space-y-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                  <Activity className="w-12 h-12 text-white/5" />
                </div>
                
                <div className="flex flex-col items-center gap-6 relative z-10">
                  <div className="text-center space-y-1">
                    <h3 className="text-2xl font-black italic text-white tracking-tighter uppercase">{selectedHorse.name}</h3>
                    <div className="flex items-center justify-center gap-4">
                      <div className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em]">
                        Growth: {selectedHorse.growthType} Stage
                      </div>
                      <div className="text-[11px] font-black text-lime-400 drop-shadow-[0_0_8px_rgba(163,230,53,0.6)] animate-pulse">
                        RTG: {calculateRating(selectedHorse)}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center gap-16">
                    <div className="text-center">
                      <div className={`text-4xl font-black italic tracking-tighter ${selectedHorse.fatigue > 70 ? 'text-red-500' : 'text-white'}`}>{Math.floor(selectedHorse.fatigue)}%</div>
                      <div className="text-[8px] text-slate-500 uppercase tracking-widest font-bold mt-1">Fatigue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-black italic tracking-tighter text-indigo-400">{Math.floor(selectedHorse.currentCondition)}%</div>
                      <div className="text-[8px] text-slate-500 uppercase tracking-widest font-bold mt-1">Condition</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 relative z-10">
                  <TrainingButton 
                    label="TURF GALLOP (SPEED FOCUS)" 
                    icon={<Wind className="text-yellow-400" />}
                    onClick={() => handleTrain(selectedHorse.id, 'speed')}
                    disabled={selectedHorse.fatigue > 80}
                  />
                  <TrainingButton 
                    label="WOODCHIP (STAMINA FOCUS)" 
                    icon={<Activity className="text-emerald-400" />}
                    onClick={() => handleTrain(selectedHorse.id, 'stamina')}
                    disabled={selectedHorse.fatigue > 80}
                  />
                  <TrainingButton 
                    label="HILL CLIMB (GUTS FOCUS)" 
                    icon={<Flame className="text-orange-400" />}
                    onClick={() => handleTrain(selectedHorse.id, 'guts')}
                    disabled={selectedHorse.fatigue > 80}
                  />
                  <TrainingButton 
                    label="DIET CONTROL (HEALTH & TEMPER)" 
                    icon={<Heart className="text-pink-400" />}
                    onClick={() => handleTrain(selectedHorse.id, 'diet')}
                    disabled={selectedHorse.fatigue > 80}
                  />
                </div>

                <button 
                  onClick={() => setView('ranch')}
                  className="w-full py-5 rounded-3xl bg-white text-slate-950 font-black tracking-widest hover:bg-indigo-50 transition-all active:scale-95 shadow-xl shadow-white/5"
                >
                  RETURN TO STABLE
                </button>
              </div>
            </motion.div>
          )}

          {view === 'registration' && (
            <motion.div 
              key="registration"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto bg-slate-900 p-10 rounded-[3rem] border border-white/10 shadow-2xl"
            >
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto border border-indigo-500/30">
                  <Trophy className="w-10 h-10 text-indigo-400" />
                </div>
                <h2 className="text-3xl font-black italic tracking-tighter uppercase">Ranch Registration</h2>
                <p className="text-slate-400 text-sm">伝説の牧場主への第一歩。牧場名を決めてください。</p>
                <div className="space-y-4">
                  <input 
                    id="ranch-name-input"
                    type="text" 
                    placeholder="Enter Ranch Name..."
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-center text-xl font-black italic focus:border-indigo-500 outline-none transition-all"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value) {
                        const name = e.currentTarget.value;
                        setGameState(prev => ({ ...prev, ranchName: name }));
                        setView('ranch');
                      }
                    }}
                  />
                  <button 
                    onClick={() => {
                      const input = document.getElementById('ranch-name-input') as HTMLInputElement;
                      if (input && input.value) {
                        setGameState(prev => ({ ...prev, ranchName: input.value }));
                        setView('ranch');
                      }
                    }}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm tracking-widest transition-all active:scale-95 shadow-xl shadow-indigo-500/20"
                  >
                    CONFIRM REGISTRATION
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Enter a name to begin your legacy</p>
              </div>
            </motion.div>
          )}

          {view === 'race' && currentRace && raceResult && (
            <div className="fixed inset-0 z-[200] bg-slate-950">
              <CinematicRace 
                raceResult={raceResult} 
                raceStep={raceStep} 
                raceActive={raceActive}
                selectedHorseId={selectedHorse?.id || ''}
                currentRace={currentRace}
                onSkip={() => {
                  const maxSteps = Math.max(...raceResult.map(r => r.progress.length));
                  setRaceStep(maxSteps - 1);
                  setRaceActive(false);
                }}
              />
              
              {!raceActive && (
                <motion.div 
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  className="absolute inset-x-0 bottom-0 bg-slate-900/95 backdrop-blur-2xl p-10 border-t border-white/10 max-h-[85vh] overflow-y-auto z-[210] rounded-t-[4rem] custom-scrollbar"
                >
                  <div className="max-w-4xl mx-auto space-y-8 pb-12">
                    <div className="flex justify-between items-end">
                      <div>
                        <h3 className="text-4xl font-black italic tracking-tighter uppercase text-white">Race Results</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <GradeBadge grade={currentRace.grade} />
                          <p className="text-indigo-400 font-mono text-xs tracking-widest uppercase">{currentRace.name}</p>
                        </div>
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Official Photo Finish</div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {raceResult.map((res, i) => (
                        <div key={res.horseId} className={`p-6 rounded-[2rem] flex justify-between items-center transition-all ${res.horseId === selectedHorse?.id ? 'bg-indigo-600/30 border border-indigo-500/50 shadow-lg shadow-indigo-500/10' : 'bg-white/5 border border-transparent'}`}>
                          <div className="flex items-center gap-8">
                            <div className="flex flex-col items-center gap-1">
                              <span className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl ${i === 0 ? 'bg-yellow-500 text-black' : i === 1 ? 'bg-slate-300 text-black' : i === 2 ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                                {res.position}
                              </span>
                              <span className="text-amber-400 font-black text-sm">{res.prediction}</span>
                            </div>
                            <div>
                              <div className="font-black italic tracking-tight text-xl text-white">{res.name}</div>
                              <div className="text-[10px] text-slate-500 font-mono mt-1">STRATEGY: {res.strategy.toUpperCase()}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Rating: {res.rating}</div>
                            <div className="font-mono text-slate-300 text-xl">
                              {res.time === 999 ? <span className="text-red-500">DNF (中止)</span> : res.time.toFixed(2) + 's'}
                            </div>
                            {i > 0 && res.time !== 999 && <div className="text-[10px] text-slate-500 font-mono">+{ (res.time - raceResult[0].time).toFixed(2) }s</div>}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={finishRace}
                      className="w-full py-8 rounded-[2.5rem] bg-white text-slate-950 font-black text-3xl tracking-widest hover:bg-indigo-50 transition-all shadow-2xl shadow-white/5 active:scale-95"
                    >
                      CONFIRM RESULTS
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {view === 'race_selection' && selectedHorse && (
            <motion.div 
              key="race_selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button onClick={() => setView('ranch')} className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <div>
                    <h2 className="text-3xl font-black italic tracking-tighter uppercase">Race Selection</h2>
                    <p className="text-xs text-indigo-400 font-mono tracking-widest uppercase">{selectedHorse.name} - {gameState.month}月 {gameState.week}週</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {availableRaces.map((race) => (
                  <motion.button
                    key={race.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => startRace(selectedHorse, race)}
                    className="bg-slate-900 border border-white/10 rounded-[2rem] p-6 flex flex-col md:flex-row justify-between items-center gap-6 hover:border-indigo-500/50 transition-all group"
                  >
                    <div className="flex items-center gap-6 flex-1">
                      <GradeBadge grade={race.grade} />
                      <div className="text-left">
                        <h3 className="text-xl font-black italic tracking-tight text-white group-hover:text-indigo-400 transition-colors">{race.name}</h3>
                        <div className="flex items-center gap-4 mt-1 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                          <span>{race.distance}m</span>
                          <span>•</span>
                          <span>{race.trackCondition}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Prize Money</div>
                        <div className="text-emerald-400 font-black text-xl tracking-tight">¥{race.prize.toLocaleString()}</div>
                      </div>
                      <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-white fill-white" />
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {availableRaces.length === 0 && (
                <div className="bg-slate-900/50 border border-white/5 rounded-[3rem] p-20 text-center">
                  <p className="text-slate-500 italic">No races available this week.</p>
                </div>
              )}
            </motion.div>
          )}

          {view === 'pedigree' && selectedHorse && (
            <motion.div 
              key="pedigree"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              <div className="flex items-center gap-6">
                <button onClick={() => setView('ranch')} className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div>
                  <h2 className="text-3xl font-black italic tracking-tighter uppercase">Pedigree Chart</h2>
                  <p className="text-xs text-indigo-400 font-mono tracking-widest uppercase">{selectedHorse.name}</p>
                </div>
              </div>

              <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-10 overflow-x-auto custom-scrollbar">
                <div className="min-w-[1000px] flex gap-8">
                  {/* Generation 1 */}
                  <div className="flex-1 space-y-6">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 border-b border-white/5 pb-2">Parents</div>
                    <PedigreeNode name={selectedHorse.pedigree.father} type="male" />
                    <div className="h-24 flex items-center justify-center"><div className="w-px h-full bg-white/10" /></div>
                    <PedigreeNode name={selectedHorse.pedigree.mother} type="female" />
                  </div>
                  {/* Generation 2 */}
                  <div className="flex-1 space-y-6">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 border-b border-white/5 pb-2">Grandparents</div>
                    <div className="space-y-4">
                      <PedigreeNode name={selectedHorse.pedigree.grandFathers[0]} type="male" small />
                      <PedigreeNode name={selectedHorse.pedigree.grandMothers[0]} type="female" small />
                    </div>
                    <div className="h-16" />
                    <div className="space-y-4">
                      <PedigreeNode name={selectedHorse.pedigree.grandFathers[1]} type="male" small />
                      <PedigreeNode name={selectedHorse.pedigree.grandMothers[1]} type="female" small />
                    </div>
                  </div>
                  {/* Generation 3 */}
                  <div className="flex-1 space-y-6">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 border-b border-white/5 pb-2">Great Grandparents</div>
                    <div className="grid grid-cols-1 gap-3">
                      {selectedHorse.pedigree.greatGrandFathers.map((name: string, i: number) => (
                        <PedigreeNode key={i} name={name} type={i % 2 === 0 ? 'male' : 'female'} tiny />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'logs' && (
            <motion.div 
              key="logs"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-black italic tracking-tighter uppercase">{gameState.ranchName.toUpperCase()} Activity Logs</h2>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">History of your ranch</p>
                </div>
                <button 
                  onClick={() => setGameState(prev => ({ ...prev, logs: [] }))}
                  className="text-[10px] font-black tracking-widest text-red-500 uppercase hover:text-red-400 transition-colors"
                >
                  Clear History
                </button>
              </div>
              
              <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 space-y-4 shadow-2xl">
                {gameState.logs.length === 0 ? (
                  <p className="text-center text-slate-600 py-20 italic">No logs recorded yet.</p>
                ) : (
                  gameState.logs.map((log, i) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={i} 
                      className="p-5 bg-white/5 rounded-2xl border border-white/5 text-slate-300 text-sm leading-relaxed flex gap-4 items-start"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                      {log}
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-2xl border-t border-white/10 p-6 z-[100] shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-5xl mx-auto flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <button 
                onClick={() => selectedHorse ? handleRaceClick(selectedHorse) : setAlertMessage('馬を選択してください')}
                className={`flex-1 py-3 ${view === 'race_selection' || view === 'race' ? 'bg-indigo-500 shadow-indigo-500/40' : 'bg-indigo-600 hover:bg-indigo-500'} text-white rounded-2xl font-black text-[10px] tracking-widest transition-all active:scale-95 shadow-lg shadow-indigo-500/20 flex flex-col items-center justify-center gap-1`}
              >
                <Zap className="w-5 h-5" />
                RACE
              </button>
              <button 
                onClick={() => setView('training')}
                className={`flex-1 py-3 ${view === 'training' ? 'bg-slate-700 border-indigo-500/50' : 'bg-slate-800 hover:bg-slate-700 border-white/5'} text-white rounded-2xl font-black text-[10px] tracking-widest transition-all active:scale-95 border flex flex-col items-center justify-center gap-1`}
              >
                <Activity className="w-5 h-5" />
                TRAIN
              </button>
            </div>
            <button 
              onClick={nextWeek}
              className="flex-[1.5] py-4 bg-white text-slate-950 rounded-2xl font-black text-sm tracking-widest transition-all hover:bg-indigo-50 active:scale-95 shadow-xl shadow-white/10 flex items-center justify-center gap-2"
            >
              NEXT WEEK
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex justify-around items-center pt-2 border-t border-white/5">
            <NavButton active={view === 'ranch'} onClick={() => setView('ranch')} icon={<Activity />} label="Stable" />
            <NavButton active={view === 'breeding'} onClick={() => setView('breeding')} icon={<Dna />} label="Breeding" />
            <NavButton active={view === 'breedersCup'} onClick={() => setView('breedersCup')} icon={<Trophy />} label="BC" />
            <NavButton active={view === 'logs'} onClick={() => setView('logs')} icon={<History />} label="Logs" />
          </div>
        </div>
      </nav>

      {/* Breeding Result Modal */}
      <AnimatePresence>
        {breedingResult && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              className="relative bg-slate-900 border border-white/10 rounded-[3rem] p-10 max-w-lg w-full shadow-[0_0_100px_rgba(99,102,241,0.2)] space-y-8 text-center overflow-hidden"
            >
              {breedingResult.explosion && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/20 to-transparent animate-pulse" />
                </div>
              )}

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-center gap-3">
                  <div className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${breedingResult.horse.gender === 'colt' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-pink-500/20 border-pink-500/50 text-pink-400'}`}>
                    {breedingResult.horse.gender === 'colt' ? '♂️ COLT' : '♀️ FILLY'}
                  </div>
                  <div className="text-[10px] font-black tracking-[0.5em] text-indigo-400 uppercase">New Generation Born</div>
                </div>
                <div className="space-y-2">
                  <input 
                    type="text"
                    defaultValue={breedingResult.horse.name}
                    onChange={(e) => {
                      const newName = e.target.value;
                      setGameState(prev => ({
                        ...prev,
                        horses: prev.horses.map(h => h.id === breedingResult.horse.id ? { ...h, name: newName } : h)
                      }));
                    }}
                    className="w-full bg-transparent border-b-2 border-white/10 focus:border-indigo-500 text-4xl font-black italic tracking-tighter uppercase text-white text-center outline-none py-2"
                  />
                  <p className="text-[8px] text-slate-500 uppercase tracking-widest">Click to change name</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 relative z-10">
                <div className="bg-white/5 p-6 rounded-3xl space-y-4">
                  <h4 className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Initial Stats</h4>
                  <div className="space-y-3">
                    <StatRow label="SPD" value={breedingResult.horse.maxStats.speed} max={1000} color="bg-indigo-500" />
                    <StatRow label="STM" value={breedingResult.horse.maxStats.stamina} max={1000} color="bg-purple-500" />
                    <StatRow label="GTS" value={breedingResult.horse.maxStats.guts} max={1000} color="bg-emerald-500" />
                    <StatRow label="TMP" value={breedingResult.horse.maxStats.temperament} max={1000} color="bg-pink-500" />
                    <StatRow label="HLT" value={breedingResult.horse.maxStats.health} max={1000} color="bg-cyan-500" />
                    <StatRow label="LCK" value={breedingResult.horse.maxStats.luck} max={1000} color="bg-yellow-500" />
                    <StatRow label="EXP" value={breedingResult.horse.maxStats.explosiveness} max={1000} color="bg-amber-500" />
                  </div>
                </div>
                <div className="bg-white/5 p-6 rounded-3xl flex flex-col justify-center space-y-4">
                  <h4 className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Bloodline Effects</h4>
                  <div className="space-y-2">
                    {breedingResult.nicks && (
                      <div className="flex items-center justify-center gap-2 text-indigo-400 font-black italic text-xs uppercase">
                        <Sparkles className="w-4 h-4" />
                        Nicks Match!
                      </div>
                    )}
                    {breedingResult.inbreedingCount > 0 && (
                      <div className="flex items-center justify-center gap-2 text-purple-400 font-black italic text-xs uppercase">
                        <Dna className="w-4 h-4" />
                        Inbreeding: {breedingResult.inbreedingCount} Chars
                      </div>
                    )}
                    {breedingResult.explosion && (
                      <div className="flex items-center justify-center gap-2 text-yellow-400 font-black italic text-sm uppercase animate-bounce mt-2">
                        <Zap className="w-5 h-5 fill-yellow-400" />
                        Explosion!!
                      </div>
                    )}
                    {!breedingResult.nicks && breedingResult.inbreeding.length === 0 && !breedingResult.explosion && (
                      <div className="text-slate-500 font-black italic text-xs uppercase">Standard Cross</div>
                    )}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  setBreedingResult(null);
                  setView('ranch');
                }}
                className="w-full py-5 bg-white text-slate-950 rounded-2xl font-black text-xl tracking-widest transition-all hover:bg-indigo-50 active:scale-95 shadow-2xl relative z-10"
              >
                TO THE STABLE
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResetConfirm(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl space-y-6 text-center"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                <History className="w-8 h-8 text-red-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black italic tracking-tighter uppercase">Reset Progress?</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  すべての進行状況が失われます。<br />この操作は取り消せません。
                </p>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <button 
                  onClick={handleConfirmReset}
                  className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black text-sm tracking-widest transition-all active:scale-95 shadow-xl shadow-red-500/20"
                >
                  RESET EVERYTHING
                </button>
                <button 
                  onClick={() => setShowResetConfirm(false)}
                  className="w-full py-4 bg-white/5 hover:bg-white/10 text-slate-400 rounded-2xl font-black text-sm tracking-widest transition-all active:scale-95"
                >
                  CANCEL
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Retire Confirmation Modal */}
      <AnimatePresence>
        {showRetireConfirm && horseToRetire && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRetireConfirm(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl space-y-6 text-center"
            >
              <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto">
                <History className="w-8 h-8 text-indigo-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black italic tracking-tighter uppercase">{horseToRetire.name}を引退させますか？</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  重賞勝利馬は種牡馬・繁殖牝馬になれます。<br />この操作は取り消せません。
                </p>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <button 
                  onClick={handleConfirmRetire}
                  className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl font-black text-sm tracking-widest transition-all active:scale-95 shadow-xl shadow-indigo-500/20"
                >
                  RETIRE HORSE
                </button>
                <button 
                  onClick={() => setShowRetireConfirm(false)}
                  className="w-full py-4 bg-white/5 hover:bg-white/10 text-slate-400 rounded-2xl font-black text-sm tracking-widest transition-all active:scale-95"
                >
                  CANCEL
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Alert Modal */}
      <AnimatePresence>
        {alertMessage && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAlertMessage(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl space-y-6 text-center"
            >
              <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto">
                <Activity className="w-8 h-8 text-yellow-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black italic tracking-tighter uppercase">Notice</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {alertMessage}
                </p>
              </div>
              <div className="pt-2">
                <button 
                  onClick={() => setAlertMessage(null)}
                  className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-sm tracking-widest transition-all active:scale-95"
                >
                  OK
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}

function StatRow({ label, value, max, color }: { label: string, value: number, max: number, color: string }) {
  const safeValue = isNaN(value) ? 0 : value;
  const safeMax = isNaN(max) || max === 0 ? 1000 : max;
  const isLimitBreak = safeValue > safeMax;
  const percentage = Math.min(100, Math.max(0, (safeValue / safeMax) * 100));

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-black tracking-widest">
        <span className="text-slate-500">{label}</span>
        <span className={`${isLimitBreak ? 'text-amber-400' : 'text-slate-200'}`}>
          {Math.floor(safeValue)} 
          <span className="text-slate-600"> / {Math.floor(safeMax)}</span>
          {isLimitBreak && <span className="ml-1 text-[8px] animate-pulse">LB</span>}
        </span>
      </div>
      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className={`h-full ${isLimitBreak ? 'bg-gradient-to-r from-amber-400 to-yellow-600' : color} shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
        />
      </div>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 transition-all ${active ? 'text-white scale-110' : 'text-slate-500 hover:text-slate-300'}`}
    >
      {React.cloneElement(icon as React.ReactElement, { className: `w-6 h-6 ${active ? 'fill-white/10' : ''}` })}
      <span className="text-[9px] font-black uppercase tracking-[0.2em]">{label}</span>
    </button>
  );
}

function TrainingButton({ label, icon, onClick, disabled }: { label: string, icon: React.ReactNode, onClick: () => void, disabled?: boolean }) {
  const [mainLabel, subLabel] = label.split(' (');
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-between p-4 rounded-3xl border-2 transition-all w-full group ${
        disabled 
        ? 'bg-slate-900/50 border-white/5 opacity-50 cursor-not-allowed' 
        : 'bg-slate-800 border-white/5 hover:border-indigo-500/50 hover:bg-slate-700 active:scale-[0.98]'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div className="flex flex-col items-start">
          <span className="font-black italic tracking-tight text-sm leading-tight">{mainLabel}</span>
          {subLabel && <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">({subLabel}</span>}
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
    </button>
  );
}

function PedigreeNode({ name, type, small, tiny }: { name: string, type: 'male' | 'female', small?: boolean, tiny?: boolean, key?: any }) {
  return (
    <div className={`p-4 rounded-2xl border-2 transition-all hover:scale-105 ${
      type === 'male' 
      ? 'bg-blue-500/5 border-blue-500/20' 
      : 'bg-pink-500/5 border-pink-500/20'
    } ${small ? 'p-3' : ''} ${tiny ? 'p-2' : ''}`}>
      <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 opacity-60">
        {type === 'male' ? 'Sire' : 'Dam'}
      </div>
      <div className={`font-black italic tracking-tight truncate ${small ? 'text-xs' : tiny ? 'text-[10px]' : 'text-lg'}`}>
        {name}
      </div>
    </div>
  );
}
