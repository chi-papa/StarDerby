import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'motion/react';

export function RaceSimulationComponent({ raceResult, currentRace, selectedHorseId, onFinish }) {
  const maxSteps = useMemo(() => {
    return Math.max(...raceResult.map(r => r.progress.length));
  }, [raceResult]);

  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1.5);
  const playbackTimer = useRef(null);

  // Get current state of all horses at the current step
  const horsePositions = useMemo(() => {
    return raceResult.map(r => {
      const prog = r.progress[step] || r.progress.at(-1);
      // Determine real-time position at this step by sorting distance
      return { ...r, ...prog };
    });
  }, [raceResult, step]);

  // Real-time standing calculation
  const standings = useMemo(() => {
    return [...horsePositions].sort((a, b) => b.distance - a.distance);
  }, [horsePositions]);

  // Map to get real standing index (1-based)
  const standingMap = useMemo(() => {
    const map = {};
    standings.forEach((h, index) => {
      map[h.horseId] = index + 1;
    });
    return map;
  }, [standings]);

  // Current live commentary from any horse at this step
  const currentCommentary = useMemo(() => {
    const activeComment = horsePositions.find(h => h.commentary);
    return activeComment ? activeComment.commentary : null;
  }, [horsePositions]);

  // Handle Play/Pause and Step Advance loop
  useEffect(() => {
    if (playbackTimer.current) {
      clearInterval(playbackTimer.current);
    }

    if (isPlaying && step < maxSteps - 1) {
      const intervalDuration = Math.max(12, Math.round(100 / speedMultiplier));
      playbackTimer.current = setInterval(() => {
        setStep(prev => {
          if (prev >= maxSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalDuration);
    }

    return () => {
      if (playbackTimer.current) {
        clearInterval(playbackTimer.current);
      }
    };
  }, [isPlaying, step, maxSteps, speedMultiplier]);

  // Auto-transition to results screen when finished
  useEffect(() => {
    if (step >= maxSteps - 1) {
      const finishTimeout = setTimeout(() => {
        onFinish();
      }, 2500);
      return () => clearTimeout(finishTimeout);
    }
  }, [step, maxSteps, onFinish]);

  const isCompleted = step >= maxSteps - 1;

  // Generate stable rain drops to avoid recreating on each tick
  const rainDrops = useMemo(() => {
    return Array.from({ length: 65 }).map((_, i) => ({
      left: `${(i * 1.57) % 100}%`,
      delay: `${(i * 0.08) % 2.5}s`,
      duration: `${0.65 + ((i * 0.09) % 0.85)}s`,
      opacity: 0.18 + ((i * 13) % 45) / 100,
      height: `${20 + ((i * 19) % 35)}px`
    }));
  }, []);

  const windMists = useMemo(() => {
    return Array.from({ length: 5 }).map((_, i) => ({
      top: `${(i * 22) % 100}%`,
      delay: `${i * 1.3}s`,
      duration: `${3.5 + (i * 0.9)}s`,
      opacity: 0.04 + ((i * 7) % 11) / 100,
    }));
  }, []);

  // Track layout & color configuration based on weather
  const trackTheme = useMemo(() => {
    if (currentRace.weather === 'Rainy') {
      return {
        bg: 'bg-slate-900 border-sky-500/20',
        trackBg: 'bg-gradient-to-r from-teal-950/45 via-slate-900/75 to-cyan-950/35 border border-sky-500/20 shadow-[inset_0_0_40px_rgba(56,189,248,0.15)]',
        fieldBorder: 'border-sky-500/10',
        weatherName: '🌧️ 雨・重馬場',
        weatherColor: 'text-sky-450 border-sky-500/30 bg-sky-500/10',
        splatColor: 'text-sky-400/85',
        badge: 'bg-sky-550'
      };
    }
    if (currentRace.weather === 'Muddy') {
      return {
        bg: 'bg-slate-950 border-orange-500/20',
        trackBg: 'bg-gradient-to-r from-amber-950/65 via-stone-900/85 to-amber-950/50 border border-orange-850/25 shadow-[inset_0_0_50px_rgba(249,115,22,0.15)]',
        fieldBorder: 'border-orange-500/15',
        weatherName: '🌊 豪雨・不良馬場',
        weatherColor: 'text-orange-450 border-orange-500/30 bg-orange-700/10',
        splatColor: 'text-amber-900/90',
        badge: 'bg-orange-650'
      };
    }
    return {
      bg: 'bg-slate-900 border-emerald-500/20',
      trackBg: 'bg-gradient-to-r from-emerald-950/20 via-slate-900/40 to-slate-950/30 border border-emerald-500/25 shadow-[inset_0_0_30px_rgba(16,185,129,0.15)]',
      fieldBorder: 'border-emerald-500/10',
      weatherName: '☀️ 晴・良馬場',
      weatherColor: 'text-amber-400 border-amber-500/20 bg-amber-500/10',
      splatColor: 'text-amber-500/40',
      badge: 'bg-amber-550'
    };
  }, [currentRace]);

  return (
    <div className="w-full max-w-5xl space-y-6 mx-auto bg-slate-950 rounded-[2.5rem] border border-white/5 p-6 shadow-2xl overflow-hidden relative" id="react-race-simulation">
      
      {/* CSS Stylesheet Injector for Dynamic Animations */}
      <style>{`
        @keyframes custom-rain {
          0% { transform: translateY(-40px) translateX(0) scaleY(1); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateY(440px) translateX(-50px) scaleY(0.9); opacity: 0; }
        }
        @keyframes custom-mist {
          0% { transform: translateX(-150px) scale(0.85); opacity: 0; }
          15% { opacity: 0.4; }
          85% { opacity: 0.4; }
          100% { transform: translateX(1100px) scale(1.15); opacity: 0; }
        }
        @keyframes custom-flash {
          0%, 93%, 100% { opacity: 0; }
          94%, 96% { opacity: 0.95; }
          95% { opacity: 0.15; }
          97% { opacity: 0.85; }
        }
        @keyframes custom-sunbeam {
          0%, 100% { opacity: 0.18; transform: skewX(-35deg) scale(0.95); }
          50% { opacity: 0.38; transform: skewX(-32deg) scale(1.05); }
        }
        @keyframes custom-splash {
          0% { transform: translate(0, 3px) scale(0.3); opacity: 0.95; }
          40% { opacity: 0.95; }
          100% { transform: translate(-32px, -15px) scale(1.4); opacity: 0; }
        }
        @keyframes custom-dust {
          0% { transform: translate(0, 2px) scale(0.4); opacity: 0.8; }
          40% { opacity: 0.5; }
          100% { transform: translate(-26px, -5px) scale(1.7); opacity: 0; }
        }
        .rain-drop {
          animation: custom-rain 1s linear infinite;
        }
        .mist-cloud {
          animation: custom-mist 6s ease-in-out infinite;
        }
        .weather-lightning-flash {
          animation: custom-flash 11s infinite;
        }
        .splash-fx-1 { animation: custom-splash 0.32s infinite linear; }
        .splash-fx-2 { animation: custom-splash 0.38s infinite linear 0.08s; }
        .splash-fx-3 { animation: custom-splash 0.44s infinite linear 0.14s; }
        .dust-fx-1 { animation: custom-dust 0.45s infinite linear; }
        .dust-fx-2 { animation: custom-dust 0.52s infinite linear 0.12s; }
      `}</style>

      {/* Lightning Overlay */}
      {(currentRace.weather === 'Rainy' || currentRace.weather === 'Muddy') && isPlaying && (
        <div className="absolute inset-0 bg-white pointer-events-none z-40 select-none opacity-0 mix-blend-screen weather-lightning-flash" />
      )}

      {/* Beautiful sunbeams / light rays for sunny weather */}
      {currentRace.weather === 'Sunny' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 opacity-30 select-none">
          <div className="absolute -top-12 -left-12 w-52 h-52 bg-amber-400/20 rounded-full blur-3xl animate-pulse" />
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <line x1="20%" y1="0" x2="5%" y2="100%" stroke="url(#sunny-gradient)" strokeWidth="80" style={{ animation: 'custom-sunbeam 5.5s infinite ease-in-out' }} />
            <line x1="55%" y1="0" x2="40%" y2="100%" stroke="url(#sunny-gradient)" strokeWidth="110" style={{ animation: 'custom-sunbeam 6.5s infinite ease-in-out' }} />
            <line x1="85%" y1="0" x2="70%" y2="100%" stroke="url(#sunny-gradient)" strokeWidth="90" style={{ animation: 'custom-sunbeam 7.5s infinite ease-in-out' }} />
            <defs>
              <linearGradient id="sunny-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" stopColor="rgba(245,158,11,0.3)" />
                <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.08" stopColor="rgba(251,191,36,0.08)" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}

      {/* Dynamic Rain Sheet overlays */}
      {(currentRace.weather === 'Rainy' || currentRace.weather === 'Muddy') && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 select-none">
          {/* Static Particle Pool */}
          {rainDrops.map((drop, idx) => (
            <div
              key={idx}
              className="absolute bg-sky-450/45 rounded-full rain-drop"
              style={{
                left: drop.left,
                top: '-40px',
                width: '1px',
                height: drop.height,
                animationDelay: drop.delay,
                animationDuration: drop.duration,
                opacity: drop.opacity
              }}
            />
          ))}

          {/* Slower thick storm droplets for muddy downpours */}
          {currentRace.weather === 'Muddy' && (
            <div className="absolute inset-0 opacity-15">
              {rainDrops.slice(0, 20).map((drop, idx) => (
                <div
                  key={`mud-drop-${idx}`}
                  className="absolute bg-orange-200/40 rounded-full rain-drop"
                  style={{
                    left: `${(parseFloat(drop.left) + 12) % 100}%`,
                    top: '-40px',
                    width: '1.5px',
                    height: `${parseFloat(drop.height) * 1.25}px`,
                    animationDelay: `${parseFloat(drop.delay) * 0.8}s`,
                    animationDuration: `${parseFloat(drop.duration) * 1.1}s`,
                    opacity: drop.opacity * 1.1
                  }}
                />
              ))}
            </div>
          )}

          {/* Sideways storm mists for severe weather blowing */}
          {windMists.map((mist, idx) => (
            <div
              key={`mist-${idx}`}
              className="absolute bg-sky-200/5 blur-xl w-[250px] h-[70px] rounded-full mist-cloud pointer-events-none"
              style={{
                top: mist.top,
                animationDelay: mist.delay,
                animationDuration: mist.duration,
                opacity: mist.opacity
              }}
            />
          ))}
        </div>
      )}

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="text-left">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[10px] bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-md font-black tracking-wider uppercase">
              {currentRace.grade}
            </span>
            <span className={`px-2 py-0.5 text-[10px] font-black rounded-md border ${trackTheme.weatherColor}`}>
              {trackTheme.weatherName}
            </span>
            <span className="text-[10px] text-slate-500 font-bold tracking-widest bg-slate-900 border border-white/5 px-2 py-0.5 rounded-md">
              距離: {currentRace.distance}M
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase text-white mt-1.5 flex items-center gap-2 select-none">
            {currentRace.name}
          </h2>
        </div>

        {/* Playback Controls Panel */}
        <div className="flex items-center gap-2 bg-slate-900/85 p-2 rounded-2xl border border-white/5 self-start md:self-auto z-20">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={isCompleted}
            className={`p-2.5 rounded-xl transition-all duration-150 flex items-center justify-center cursor-pointer ${
              isCompleted 
                ? 'text-slate-600 bg-transparent' 
                : 'text-white bg-slate-850 hover:bg-slate-800 border border-white/5 hover:scale-105 active:scale-95'
            }`}
            title={isPlaying ? "一時停止" : "再生"}
            id="simulation-play-pause-btn"
          >
            {isPlaying ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>

          <div className="flex items-center gap-1 border-l border-white/5 pl-2">
            {[1, 1.5, 3, 5].map(mult => (
              <button
                key={mult}
                onClick={() => setSpeedMultiplier(mult)}
                className={`text-[10px] font-black px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  speedMultiplier === mult
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 scale-105 border border-indigo-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-850'
                }`}
                id={`sim-speed-${mult}x`}
              >
                {mult}x
              </button>
            ))}
          </div>

          <button
            onClick={onFinish}
            className="ml-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-black text-[10px] px-3 py-1.5 rounded-xl hover:from-indigo-500 hover:to-indigo-400 border border-indigo-500/20 transition-all flex items-center gap-1 hover:scale-105 active:scale-95 cursor-pointer"
            id="simulation-skip-btn"
          >
            <span>スキップ</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Primary Race Track Arena */}
      <div className={`relative ${trackTheme.trackBg} rounded-3xl border border-white/5 overflow-hidden p-6 shadow-inner relative`} id="race-simulation-track-arena">
        
        {/* Race progress finish line overlay */}
        <div className="absolute top-0 bottom-0 right-[10%] w-[20px] pointer-events-none overflow-hidden z-20 opacity-80 flex flex-col justify-between">
          <div className="w-1.5 h-full bg-slate-50 border-r border-slate-950/40 shadow-xl" />
          <div className="absolute top-0 bottom-0 left-[6px] w-[8px] flex flex-col justify-around select-none">
            {Array.from({ length: 40 }).map((_, i) => (
              <div 
                key={i} 
                className={`w-full h-[6px] ${i % 2 === 0 ? 'bg-black' : 'bg-slate-50'}`} 
              />
            ))}
          </div>
        </div>

        {/* Start Line representation */}
        <div className="absolute top-0 bottom-0 left-[4%] w-0.5 bg-indigo-500/30 border-l border-dashed border-indigo-500/40 z-10 pointer-events-none" />

        {/* Outer Rail decorations */}
        <div className="space-y-3.5 relative">
          {horsePositions.map((h) => {
            const isPlayer = h.horseId === selectedHorseId;
            const currentStanding = standingMap[h.horseId] || 12;
            const percentage = h.distance / currentRace.distance;
            const mappedLeft = 4 + (percentage * 81); // Scaled safe track mapping (4% start, 85% goal max)
            const staminaPct = h.staminaLeft / h.maxStamina;

            return (
              <div 
                key={h.horseId} 
                className="relative h-[25px] w-full flex items-center" 
                id={`track-lane-${h.lane}`}
              >
                {/* Lane line grid */}
                <div className={`absolute inset-x-0 bottom-0 border-b ${trackTheme.fieldBorder} pointer-events-none`} />

                {/* Mud splotches and hoof prints on the lane tracks */}
                {currentRace.weather === 'Muddy' && (
                  <div className="absolute inset-0 pointer-events-none flex justify-around opacity-45 select-none">
                    <div className="w-12 h-1 bg-amber-950/80 rounded-full blur-[1px] -skew-x-12 mt-1" />
                    <div className="w-16 h-1.5 bg-stone-950/90 rounded-full blur-[1px] skew-x-12 mt-2" />
                    <div className="w-10 h-1 bg-amber-950/70 rounded-full blur-[2px] mt-0.5" />
                  </div>
                )}
                {/* Shiny water puddles for Rainy lanes */}
                {currentRace.weather === 'Rainy' && (
                  <div className="absolute inset-0 pointer-events-none flex justify-around opacity-35 select-none">
                    <div className="w-14 h-1.5 bg-sky-950/60 border border-sky-900/25 rounded-full blur-[1.5px] mt-1" />
                    <div className="w-10 h-1 bg-indigo-950/50 border border-indigo-900/20 rounded-full blur-[1px] mt-2" />
                  </div>
                )}

                {/* Animated Horse Wrapper */}
                <motion.div
                  className="absolute z-20 flex items-center"
                  style={{ y: -6 }}
                  animate={{
                    x: `${mappedLeft}%`,
                    y: isPlaying && !h.finished ? [0, -4, 0] : 0
                  }}
                  transition={{
                    x: {
                      type: "spring",
                      stiffness: 85,
                      damping: 18,
                      mass: 0.9
                    },
                    y: {
                      repeat: Infinity,
                      duration: 0.35 * (30 / Math.max(10, h.speed || 30)), // Gallop rate correlates with speed!
                      ease: "easeInOut"
                    }
                  }}
                >
                  {/* Splatter / Splash Generator directly attached to the horse */}
                  {isPlaying && !h.finished && (
                    <div className="absolute right-full mr-2 top-1.5 flex gap-1 pointer-events-none z-10 select-none">
                      {/* Render mud or water splatters based on active weather */}
                      {currentRace.weather === 'Muddy' && (
                        <div className="relative w-8 h-4">
                          <div className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-amber-950 border border-amber-900/30 splash-fx-1" />
                          <div className="absolute bottom-1 right-2 w-1 h-1 rounded-full bg-amber-950 border border-amber-900/30 splash-fx-2" />
                          <div className="absolute bottom-2 right-4 w-1.2 h-1.2 rounded-full bg-stone-950 border border-stone-900/30 splash-fx-3" />
                        </div>
                      )}
                      {currentRace.weather === 'Rainy' && (
                        <div className="relative w-8 h-4">
                          <div className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-sky-400/80 splash-fx-1" />
                          <div className="absolute bottom-1 right-2 w-1 h-1 rounded-full bg-sky-300/80 splash-fx-2" />
                          <div className="absolute bottom-2 right-4 w-1.2 h-1.2 rounded-full bg-cyan-400/80 splash-fx-3" />
                        </div>
                      )}
                      {currentRace.weather === 'Sunny' && (
                        <div className="relative w-8 h-4">
                          <div className="absolute bottom-0 right-1 w-2.5 h-1 bg-amber-500/20 rounded-full blur-xs dust-fx-1" />
                          <div className="absolute bottom-1 right-3.5 w-1.5 h-0.5 bg-amber-600/10 rounded-full blur-xs dust-fx-2" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Horse Capsule Visual Indicator */}
                  <div 
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-full shadow-2xl transition-all duration-150 border uppercase select-none ${
                      isPlayer 
                        ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.55)] scale-110 z-30 font-black' 
                        : 'bg-slate-900/90 text-slate-300 border-white/5'
                    }`}
                  >
                    {/* Position badge */}
                    <span className={`w-4 h-4 text-[9px] font-black rounded-full flex items-center justify-center shadow ${
                      currentStanding === 1 ? 'bg-yellow-500 text-slate-950 font-extrabold animate-pulse' :
                      currentStanding === 2 ? 'bg-slate-300 text-slate-950' :
                      currentStanding === 3 ? 'bg-amber-700 text-white' :
                      'bg-slate-755 text-slate-300'
                    }`}>
                      {currentStanding}
                    </span>

                    {/* Gallop Avatar representation */}
                    <span className="text-sm leading-none filter drop-shadow">
                      {isPlayer ? '🏇' : '🐎'}
                    </span>

                    {/* Stats Dashboard alongside local horse */}
                    <div className="flex flex-col items-start leading-none pr-1.5 border-r border-white/10">
                      <span className="text-[7.5px] font-black tracking-tight leading-none whitespace-nowrap overflow-hidden max-w-[55px] truncate">
                        {h.name}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {/* Speed display */}
                        <span className="text-[7.5px] font-sans font-black opacity-80 whitespace-nowrap text-indigo-300">
                          {h.speed.toFixed(1)}m/s
                        </span>
                      </div>
                    </div>

                    {/* Individual Live Progress Bars (Stamina + Sprint indicators) */}
                    <div className="flex flex-col gap-0.5 justify-center pl-0.5">
                      {/* Speed Indicator dot */}
                      <div className="flex items-center gap-1">
                        <span className="text-[6px] text-slate-400 font-extrabold uppercase">ST</span>
                        {/* Stamina Mini bar */}
                        <div className="w-10 h-1 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className={`h-full rounded-full transition-all duration-150 ${
                              staminaPct > 0.5 ? 'bg-emerald-400' :
                              staminaPct > 0.20 ? 'bg-amber-400 animate-pulse' :
                              'bg-rose-500 animate-[pulse_0.4s_infinite]'
                            }`}
                            style={{ width: `${staminaPct * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Low stamina warning sweat drops */}
                    {staminaPct <= 0.2 && !h.finished && (
                      <span className="text-[9px] text-sky-400 animate-bounce leading-none" title="スタミナ限界！">
                        💦
                      </span>
                    )}

                    {/* Active dynamic buffs on track runner */}
                    {isPlaying && h.buffs && h.buffs.length > 0 && Math.random() < 0.25 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.6 }}
                        animate={{ opacity: [0, 1, 0], y: -30, scale: [0.6, 1.1, 0.7] }}
                        transition={{ duration: 1.2 }}
                        className="absolute text-[8px] bg-indigo-900 border border-indigo-500 text-indigo-300 font-black px-1.5 py-0.5 rounded-md right-0 pointer-events-none whitespace-nowrap"
                      >
                        {h.buffs[0]}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Real-time Commentator Console */}
      <div className="bg-slate-900 border border-white/5 rounded-2xl flex flex-col p-4 shadow-xl relative min-h-[4.5rem] justify-center text-center overflow-hidden" id="live-commentary-widget">
        <div className="absolute top-1 right-2 text-[7px] text-indigo-400 font-black tracking-widest uppercase select-none opacity-60">
          🎙️ LIVE COMMENTARY
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={currentCommentary || 'stature'}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ type: 'spring', stiffness: 120, damping: 14 }}
            className="text-amber-350 font-black text-xs md:text-sm tracking-tight leading-relaxed select-none py-1"
          >
            {currentCommentary || "各馬、ゴールへ向けて渾身の激走を繰り広げています！"}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Live Checkpoint Standings / Leaderboard Overlay */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {standings.slice(0, 3).map((h, i) => {
          const isPlayer = h.horseId === selectedHorseId;
          const percentage = Math.round((h.distance / currentRace.distance) * 100);

          return (
            <div 
              key={h.horseId} 
              className={`bg-slate-900/60 p-3 rounded-2xl border transition-all duration-200 select-none flex items-center justify-between ${
                isPlayer
                  ? 'border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-indigo-950/20 shadow-md'
                  : 'border-white/5 hover:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] ${
                  i === 0 ? 'bg-yellow-500 text-slate-950' :
                  i === 1 ? 'bg-slate-350 text-slate-950' :
                  'bg-amber-700 text-white'
                }`}>
                  {i + 1}
                </span>
                <div className="text-left leading-none">
                  <span className={`text-xs font-black uppercase ${isPlayer ? 'text-amber-400' : 'text-slate-200'}`}>
                    {h.name} {isPlayer && '🏆'}
                  </span>
                  <p className="text-[8px] text-slate-500 font-bold mt-1 uppercase">距離：{percentage}% ({Math.round(h.distance)}m)</p>
                </div>
              </div>
              <div className="text-right leading-none">
                <span className="text-sm font-mono font-bold text-slate-300">
                  {h.speed.toFixed(1)}
                </span>
                <p className="text-[7px] text-slate-500 uppercase font-black tracking-tight mt-0.5">M/S SPEED</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overarching Full Completion Overlay */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col justify-center items-center z-50 text-center space-y-4"
            id="simulation-finish-overlay"
          >
            <motion.div
              initial={{ rotateY: -90 }}
              animate={{ rotateY: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 12 }}
              className="bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-600 text-white font-black italic text-5xl tracking-widest px-10 py-5 rounded-[2rem] border-2 border-white/20 shadow-2xl skew-x-3 select-none"
            >
              🏁 FINISH!
            </motion.div>
            <p className="text-sm text-slate-300 font-bold max-w-sm tracking-tight leading-relaxed">
              全馬、ゴールを駆け抜けました！<br/>ただいま審議・結果集計を行っております。しばらくお待ちください...
            </p>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-white/5 rounded-full text-[10px] text-slate-400 font-black animate-pulse">
              <span>集計結果画面へ進んでいます</span>
              <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Global mount orchestration helper
let raceSimulationRoot = null;

export function mountRaceSimulation(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const { raceResult, currentRace, selectedHorseId } = window.state;
  if (!raceResult || !currentRace) return;

  if (!raceSimulationRoot) {
    raceSimulationRoot = createRoot(container);
  }

  const handleFinish = () => {
    window.setState({ screen: 'race_result', animatedResults: false });
  };

  raceSimulationRoot.render(
    <RaceSimulationComponent
      raceResult={raceResult}
      currentRace={currentRace}
      selectedHorseId={selectedHorseId}
      onFinish={handleFinish}
    />
  );
}
