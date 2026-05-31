import './index.css';
import { createIcons, Trophy, Calendar, Coins, Dna, Zap, Activity, ChevronRight, ChevronLeft, Play, Heart, TrendingUp, History, Star, Home, Sparkles, Flame, Wind, MessageSquare, Send } from 'lucide';
import { STALLIONS, INITIAL_MARES } from './constants/gameData.js';
import { checkBreeding } from './logic/breeding.js';
import { calculateGrowth, getPhysicalState } from './logic/growth.js';
import { simulateRace, generateEnemyHorses } from './logic/raceSim.js';
import { getBreedingAdvice } from './services/geminiService.js';

// --- Global State ---
const SAVE_KEY = 'stellar_breeder_save_v1';

window.state = {
  screen: 'title',
  horses: [],
  mares: [...INITIAL_MARES],
  money: 10000000,
  week: 1,
  month: 1,
  year: 1,
  selectedHorseId: null,
  selectedMareId: null,
  selectedStallionId: null,
  breedingResult: null,
  currentRace: null,
  raceResult: null,
  raceStep: 0,
  history: [],
  showSaveModal: false,
};

// --- Save & Load Implementation ---
export function saveGame() {
  try {
    const dataToSave = {
      horses: window.state.horses,
      mares: window.state.mares,
      money: window.state.money,
      week: window.state.week,
      month: window.state.month,
      year: window.state.year,
      history: window.state.history,
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(dataToSave));
  } catch (e) {
    console.error("Failed to auto-save:", e);
  }
}

export function loadGame() {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      window.state.horses = data.horses || [];
      window.state.mares = data.mares || [...INITIAL_MARES];
      window.state.money = typeof data.money === 'number' ? data.money : 10000000;
      window.state.week = data.week || 1;
      window.state.month = data.month || 1;
      window.state.year = data.year || 1;
      window.state.history = data.history || [];
      return true;
    }
  } catch (e) {
    console.error("Failed to load game:", e);
  }
  return false;
}

window.exportSaveData = () => {
  try {
    const dataToSave = {
      horses: window.state.horses,
      mares: window.state.mares,
      money: window.state.money,
      week: window.state.week,
      month: window.state.month,
      year: window.state.year,
      history: window.state.history,
    };
    const jsonString = JSON.stringify(dataToSave, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stellar_breeder_save_y${window.state.year}_m${window.state.month}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (e) {
    alert("エラーが発生しました: " + e.message);
  }
};

window.importSaveData = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (typeof data.money === 'undefined' || !Array.isArray(data.horses)) {
        throw new Error("無効なセーブデータファイル形式です。");
      }
      
      window.setState({
        horses: data.horses || [],
        mares: data.mares || [...INITIAL_MARES],
        money: data.money,
        week: data.week || 1,
        month: data.month || 1,
        year: data.year || 1,
        history: data.history || [],
        screen: 'stable',
        showSaveModal: false
      });
      
      saveGame();
      alert("セーブデータを正常にインポートしました！ゲームを再開します。");
    } catch (err) {
      alert("セーブデータの読込に失敗しました: " + err.message);
    }
  };
  reader.readAsText(file);
};

window.setState = (updates) => {
  window.state = { ...window.state, ...updates };
  if (['stable', 'title', 'breeding_mare', 'breeding_stallion', 'breeding_confirm', 'race_select'].includes(window.state.screen)) {
    saveGame();
  }
  render();
};

window.handleAction = (action, data) => {
  switch (action) {
    case 'START_RACE':
      const horse = window.state.horses.find(h => h.id === window.state.selectedHorseId);
      const enemies = generateEnemyHorses(11, data.grade);
      const results = simulateRace(horse, enemies, data);
      window.setState({ 
        screen: 'race_sim', 
        currentRace: data, 
        raceResult: results, 
        raceStep: 0 
      });
      break;
    case 'CONFIRM_BREEDING':
      const mare = window.state.mares.find(m => m.id === window.state.selectedMareId);
      const stallion = STALLIONS.find(s => s.id === window.state.selectedStallionId);
      if (window.state.money < stallion.fee) {
        alert("資金が足りません");
        return;
      }
      const res = checkBreeding(stallion, mare);
      window.setState({ 
        money: window.state.money - stallion.fee,
        breedingResult: res,
        screen: 'stable',
        horses: [...window.state.horses, res.horse]
      });
      alert(`${res.horse.name}が誕生しました！`);
      break;
    case 'NEXT_WEEK':
      nextWeek();
      break;
    default:
      console.warn("Unknown action", action);
  }
};

function nextWeek() {
  let { week, month, year, horses } = window.state;
  week++;
  if (week > 4) {
    week = 1;
    month++;
  }
  if (month > 12) {
    month = 1;
    year++;
  }

  // Update horses
  const updatedHorses = horses.map(h => {
    if (h.isRetired) return h;
    if (week === 1) return { ...h, stats: calculateGrowth(h) };
    return h;
  });

  window.setState({ week, month, year, horses: updatedHorses });
}

// --- Component Template Helpers ---
function Button({ children, onClick, className = "", variant = "primary" }) {
  const base = "px-4 py-2 rounded-lg font-bold transition-all active:scale-95 cursor-pointer";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-slate-700 text-white hover:bg-slate-600",
    outline: "border border-slate-600 text-white hover:bg-slate-800",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  
  // Directly use string for simple cases, or window methods
  let clickAttr = "";
  if (typeof onClick === "string") clickAttr = `onclick="${onClick}"`;
  else {
    const id = `cb-${Math.random().toString(36).substr(2, 9)}`;
    window[id] = onClick;
    clickAttr = `onclick="window['${id}'](event)"`;
  }

  return `<button ${clickAttr} class="${base} ${variants[variant]} ${className}">${children}</button>`;
}

// --- Scenes ---

// --- Utilities ---
const formatMoney = (amount) => `¥${(amount / 10000).toLocaleString()}万`;

function SceneTitle() {
  const hasSave = localStorage.getItem(SAVE_KEY) !== null;
  return `
    <div class="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
      <div class="text-center space-y-8 max-w-2xl">
        <h1 class="text-7xl font-black italic tracking-tighter uppercase">
          <span class="block text-indigo-500">Stellar</span>
          <span class="block">Breeder</span>
        </h1>
        <p class="text-slate-400 font-medium tracking-widest uppercase text-sm">異次元のスピード、伝説の血統をその手に。</p>
        <div class="pt-8 flex flex-col sm:flex-row justify-center gap-4">
          ${Button({ 
            children: "最初から始める", 
            onClick: () => {
              if (hasSave && !confirm("保存されているデータを上書きして最初から始めますか？")) {
                return;
              }
              window.setState({
                screen: 'stable',
                horses: [],
                mares: [...INITIAL_MARES],
                money: 10000000,
                week: 1,
                month: 1,
                year: 1,
                history: [],
              });
            },
            className: "text-lg px-8 py-4",
            variant: "primary"
          })}
          ${hasSave ? Button({ 
            children: "続きから始める", 
            onClick: () => {
              loadGame();
              window.setState({ screen: 'stable' });
            },
            className: "text-lg px-8 py-4",
            variant: "outline"
          }) : ''}
        </div>
      </div>
    </div>
  `;
}

function SceneStable() {
  const { horses, money, year, month, week } = window.state;
  
  return `
    <div class="min-h-screen bg-slate-950 text-white flex flex-col">
      <!-- Header -->
      <header class="p-6 border-b border-indigo-500/20 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10 flex justify-between items-center">
        <div class="flex items-center gap-6">
          <h2 class="text-2xl font-black italic tracking-tighter uppercase">MY STABLE</h2>
          <div class="flex items-center gap-4 text-xs font-bold tracking-widest text-slate-400">
             <span>YEAR ${year} / MON ${month} / WEEK ${week}</span>
             <span class="text-emerald-400">${formatMoney(money)}</span>
          </div>
        </div>
        <div class="flex gap-2">
          ${Button({ 
            children: "データ管理", 
            onClick: () => window.setState({ showSaveModal: true }),
            variant: "outline",
            className: "px-4"
          })}
          ${Button({ 
            children: "配合", 
            onClick: () => window.setState({ screen: 'breeding_mare' }),
            variant: "secondary",
            className: "px-6"
          })}
          ${Button({ 
            children: "次週へ", 
            onClick: () => window.handleAction('NEXT_WEEK'),
            variant: "primary",
            className: "px-6"
          })}
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 p-6 max-w-7xl mx-auto w-full">
        ${horses.length === 0 ? `
          <div class="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl text-slate-500 gap-4">
            <p class="font-bold">所有馬がいません</p>
            ${Button({ 
              children: "最初の配合を行う", 
              onClick: () => window.setState({ screen: 'breeding_mare' }),
              variant: "outline"
            })}
          </div>
        ` : `
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${horses.map(h => `
              <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-indigo-500/50 transition-all group overflow-hidden relative">
                <div class="relative z-10 h-full flex flex-col">
                   <div class="flex justify-between items-start mb-4">
                      <div class="space-y-1">
                        <h3 class="text-xl font-black italic tracking-tight uppercase">${h.name}</h3>
                        <div class="flex gap-2 text-[10px] font-bold text-slate-500">
                          <span>${h.age}歳 ${h.gender === 'colt' ? '牡' : '牝'}</span>
                          <span>${getPhysicalState(h)}</span>
                        </div>
                      </div>
                      <div class="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-800/50 backdrop-blur-sm border border-white/10 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30 transition-all">
                         <div class="w-2/3 h-2/3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]" style="background-color: ${h.color}"></div>
                      </div>
                   </div>

                   <!-- Stats -->
                   <div class="grid grid-cols-2 gap-4 my-4 flex-1">
                      <div class="space-y-1">
                        <div class="flex justify-between text-[8px] font-bold text-slate-500 uppercase"><span>SPEED</span><span>${h.stats.speed}</span></div>
                        <div class="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <div class="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" style="width: ${(h.stats.speed/1000)*100}%"></div>
                        </div>
                      </div>
                      <div class="space-y-1">
                        <div class="flex justify-between text-[8px] font-bold text-slate-500 uppercase"><span>STAMINA</span><span>${h.stats.stamina}</span></div>
                        <div class="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <div class="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style="width: ${(h.stats.stamina/1000)*100}%"></div>
                        </div>
                      </div>
                   </div>

                   <div class="pt-4 border-t border-white/5 flex gap-2">
                     ${Button({ 
                       children: "レース登録", 
                       onClick: () => window.setState({ screen: 'race_select', selectedHorseId: h.id }),
                       className: "flex-1 text-xs py-2"
                     })}
                   </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </main>
    </div>
  `;
}

function SceneBreedingMare() {
  const { mares } = window.state;
  return `
    <div class="min-h-screen bg-slate-950 text-white flex flex-col p-6">
      <header class="mb-8">
        <h2 class="text-3xl font-black italic uppercase tracking-tighter">SELECT MARE</h2>
        <p class="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">配合相手となる繁殖牝馬を選んでください</p>
      </header>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${mares.map(m => `
          <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-indigo-500/50 transition-all cursor-pointer" onclick="window.setState({ screen: 'breeding_stallion', selectedMareId: '${m.id}' })">
            <h3 class="text-xl font-black italic tracking-tight uppercase mb-4">${m.name}</h3>
            <div class="grid grid-cols-2 gap-4">
               <div>
                 <span class="block text-[8px] font-bold text-slate-500 uppercase mb-1">SPEED</span>
                 <div class="h-1 bg-white/5 rounded-full overflow-hidden"><div class="h-full bg-indigo-500" style="width: ${(m.stats.speed/1000)*100}%"></div></div>
               </div>
               <div>
                 <span class="block text-[8px] font-bold text-slate-500 uppercase mb-1">STAMINA</span>
                 <div class="h-1 bg-white/5 rounded-full overflow-hidden"><div class="h-full bg-blue-500" style="width: ${(m.stats.stamina/1000)*100}%"></div></div>
               </div>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="mt-8">
        ${Button({ children: "戻る", onClick: () => window.setState({ screen: 'stable' }), variant: "outline" })}
      </div>
    </div>
  `;
}

function SceneBreedingStallion() {
  const selectedMare = window.state.mares.find(m => m.id === window.state.selectedMareId);
  return `
    <div class="min-h-screen bg-slate-950 text-white flex flex-col p-6">
      <header class="mb-8">
        <h2 class="text-3xl font-black italic uppercase tracking-tighter">SELECT STALLION</h2>
        <p class="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">
          ${selectedMare.name} に配合する種牡馬を選んでください
        </p>
      </header>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        ${STALLIONS.map(s => `
          <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-indigo-500/50 transition-all cursor-pointer" 
               onclick="window.setState({ screen: 'breeding_confirm', selectedStallionId: '${s.id}' })">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-xl font-black italic tracking-tight uppercase">${s.name}</h3>
              <span class="text-emerald-400 font-bold text-xs">${formatMoney(s.fee)}</span>
            </div>
            <div class="grid grid-cols-2 gap-4">
               <div>
                 <span class="block text-[8px] font-bold text-slate-500 uppercase mb-1">SPEED</span>
                 <div class="h-1 bg-white/5 rounded-full overflow-hidden"><div class="h-full bg-indigo-500" style="width: ${(s.stats.speed/1000)*100}%"></div></div>
               </div>
               <div>
                 <span class="block text-[8px] font-bold text-slate-500 uppercase mb-1">EXPLOSIVE POWER</span>
                 <div class="h-1 bg-white/5 rounded-full overflow-hidden"><div class="h-full bg-amber-500" style="width: ${(s.explosivePower/200)*100}%"></div></div>
               </div>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="fixed bottom-0 left-0 right-0 p-6 bg-slate-950/80 backdrop-blur-md border-t border-white/5 mt-8">
        ${Button({ children: "戻る", onClick: () => window.setState({ screen: 'breeding_mare' }), variant: "outline" })}
      </div>
    </div>
  `;
}

function SceneBreedingConfirm() {
  const mare = window.state.mares.find(m => m.id === window.state.selectedMareId);
  const stallion = STALLIONS.find(s => s.id === window.state.selectedStallionId);

  return `
    <div class="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
      <div class="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-[3rem] p-12 text-center space-y-8">
        <h2 class="text-4xl font-black italic tracking-tighter uppercase">BREEDING CONFIRM</h2>
        <div class="flex items-center justify-center gap-8">
          <div class="text-center">
            <div class="text-[10px] text-slate-500 font-bold uppercase mb-2">MARE</div>
            <div class="text-xl font-black uppercase">${mare.name}</div>
          </div>
          <div class="text-2xl text-indigo-500">×</div>
          <div class="text-center">
            <div class="text-[10px] text-slate-500 font-bold uppercase mb-2">STALLION</div>
            <div class="text-xl font-black uppercase">${stallion.name}</div>
          </div>
        </div>
        <div class="text-2xl font-black text-emerald-400">FEES: ${formatMoney(stallion.fee)}</div>
        <div class="flex gap-4">
          ${Button({ children: "配合を行う", onClick: () => window.handleAction('CONFIRM_BREEDING'), className: "flex-1 py-4 text-lg" })}
          ${Button({ children: "キャンセル", onClick: () => window.setState({ screen: 'breeding_stallion' }), variant: "outline", className: "px-8" })}
        </div>
      </div>
    </div>
  `;
}

function SceneRaceSelect() {
  const horse = window.state.horses.find(h => h.id === window.state.selectedHorseId);
  const races = [
    { id: 'r1', name: 'シリウス新馬戦', distance: 1600, grade: 'Newcomer', fee: 0, prize: 5000000 },
    { id: 'r2', name: 'ベテルギウスS', distance: 2000, grade: 'G3', fee: 100000, prize: 20000000 },
    { id: 'r3', name: '銀河大賞 (G1)', distance: 2400, grade: 'G1', fee: 500000, prize: 100000000 },
  ];

  return `
    <div class="min-h-screen bg-slate-950 text-white flex flex-col p-6">
      <header class="mb-8">
        <h2 class="text-3xl font-black italic uppercase tracking-tighter">RACE SELECTION</h2>
        <p class="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">${horse.name} を出走させるレースを選んでください</p>
      </header>
      <div class="space-y-4 max-w-3xl">
        ${races.map(r => `
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex justify-between items-center hover:border-indigo-500/50 transition-all cursor-pointer"
               onclick="window.handleAction('START_RACE', ${JSON.stringify(r).replace(/"/g, '&quot;')})">
            <div class="flex items-center gap-4">
              <span class="px-2 py-1 bg-slate-800 rounded text-[10px] font-black">${r.grade}</span>
              <h3 class="text-xl font-black uppercase italic">${r.name}</h3>
            </div>
            <div class="text-right">
              <div class="text-xs font-bold text-slate-500 uppercase">PRIZE</div>
              <div class="text-lg font-black text-amber-500">${formatMoney(r.prize)}</div>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="mt-8">
        ${Button({ children: "戻る", onClick: () => window.setState({ screen: 'stable' }), variant: "outline" })}
      </div>
    </div>
  `;
}

function SceneRaceSim() {
  const { raceResult, raceStep, currentRace } = window.state;
  const maxSteps = Math.max(...raceResult.map(r => r.progress.length));
  
  // Animation loop
  if (window.state.screen === 'race_sim' && raceStep < maxSteps - 1) {
    setTimeout(() => {
      window.setState({ raceStep: raceStep + 1 });
    }, 100);
  } else if (raceStep >= maxSteps - 1) {
    setTimeout(() => {
      window.setState({ screen: 'race_result' });
    }, 2000);
  }

  const horsePos = raceResult.map(r => {
    const prog = r.progress[raceStep] || r.progress.at(-1);
    return { ...r, ...prog };
  });

  return `
    <div class="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div class="w-full max-w-5xl space-y-8">
        <div>
          <h2 class="text-4xl font-black italic tracking-tighter uppercase">${currentRace.name}</h2>
          <div class="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-2">${currentRace.distance}M / LIVE SIMULATION</div>
        </div>

        <div class="relative h-[400px] bg-slate-900 rounded-[3rem] border border-white/5 overflow-hidden p-8 flex flex-col justify-between">
           ${horsePos.map(h => `
             <div class="relative h-6 w-full flex items-center">
               <div class="absolute inset-0 border-b border-white/5"></div>
               <div class="absolute transition-all duration-100 ease-linear" style="left: ${(h.distance / currentRace.distance) * 95}%">
                  <div class="w-6 h-6 rounded-full shadow-lg flex items-center justify-center text-[8px] font-bold" 
                       style="background-color: ${h.horseId === window.state.selectedHorseId ? '#6366f1' : '#424242'}">
                    ${h.position || ''}
                  </div>
                  <div class="absolute top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-bold uppercase tracking-tighter ${h.horseId === window.state.selectedHorseId ? 'text-indigo-400' : 'text-slate-500'}">
                    ${h.name}
                  </div>
               </div>
             </div>
           `).join('')}
           <div class="absolute top-0 bottom-0 right-[5%] w-1 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
        </div>

        <div class="h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center px-6">
          <p class="text-sm font-bold italic tracking-tight text-indigo-400">
            ${horsePos.find(h => h.commentary)?.commentary || "各馬、激しい競り合いが続いています！"}
          </p>
        </div>
      </div>
    </div>
  `;
}

function SceneRaceResult() {
  const sortedResults = [...window.state.raceResult].sort((a, b) => a.position - b.position);
  const playerResult = sortedResults.find(r => r.horseId === window.state.selectedHorseId);
  
  return `
    <div class="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
      <div class="max-w-3xl w-full space-y-8">
        <header class="text-center space-y-2">
          <h2 class="text-5xl font-black italic tracking-tighter uppercase">RACE RESULT</h2>
          <p class="text-indigo-400 font-bold text-xl uppercase tracking-widest">${playerResult.position}着 / ${playerResult.name}</p>
        </header>

        <div class="bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden">
          <table class="w-full text-left">
            <thead class="bg-slate-800/50 text-[10px] font-black tracking-widest uppercase text-slate-500">
              <tr>
                <th class="px-8 py-4">POS</th>
                <th class="px-8 py-4">HORSE</th>
                <th class="px-8 py-4">TIME</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              ${sortedResults.slice(0, 5).map(r => `
                <tr class="${r.horseId === window.state.selectedHorseId ? 'bg-indigo-500/10' : ''}">
                  <td class="px-8 py-4 font-black italic text-2xl">${r.position}</td>
                  <td class="px-8 py-4 font-black uppercase tracking-tight">${r.name}</td>
                  <td class="px-8 py-4 font-mono text-sm">${(r.time / 1).toFixed(1)}s</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="flex justify-center">
           ${Button({ 
             children: "牧場に戻る", 
             onClick: () => window.setState({ screen: 'stable', currentRace: null, raceResult: null, raceStep: 0 }),
             className: "px-12 py-4 text-lg"
           })}
        </div>
      </div>
    </div>
  `;
}

function RenderSaveModal() {
  if (!window.state.showSaveModal) return '';
  
  return `
    <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-slate-900 border border-slate-800 rounded-[2.5rem] max-w-lg w-full p-8 space-y-6 relative">
        <button class="absolute top-6 right-6 text-slate-400 hover:text-white font-bold cursor-pointer text-xl" onclick="window.setState({ showSaveModal: false })">✕</button>
        
        <h3 class="text-2xl font-black italic tracking-tighter uppercase text-indigo-400">DATA MANAGEMENT</h3>
        <p class="text-slate-400 text-xs font-semibold">現在プレイ中のゲームデータを、ファイル出力してデバイスへ保存したり、お持ちのセーブデータファイルを読み込むことができます。</p>
        
        <div class="space-y-4 pt-4 border-t border-white/5 text-left text-white">
          <!-- Local Auto Save State -->
          <div class="bg-slate-800/40 rounded-2xl p-4 flex justify-between items-center">
            <div>
              <div class="font-bold text-sm">ブラウザ自動保存</div>
              <div class="text-[10px] text-slate-500 mt-0.5">プレイ状況はブラウザへ自動的に適時セーブされています。</div>
            </div>
            <div class="text-emerald-400 font-bold text-xs flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> オートセーブON
            </div>
          </div>
          
          <!-- File Export -->
          <div class="border border-white/5 bg-slate-950 p-5 rounded-2xl flex flex-col gap-3">
            <div class="space-y-1">
              <div class="font-bold text-sm">💾 セーブデータのファイル保存 (ダウンロード)</div>
              <p class="text-[10px] text-slate-400 leading-relaxed">ゲーム進捗データをJSONファイルとしてデバイスにダウンロードします。スマホ等他の端末への引き継ぎやバックアップとして利用可能です。</p>
            </div>
            ${Button({
              children: "セーブデータをダウンロード",
              onClick: "window.exportSaveData()",
              variant: "primary",
              className: "w-full text-xs py-2.5"
            })}
          </div>

          <!-- File Import -->
          <div class="border border-white/5 bg-slate-950 p-5 rounded-2xl flex flex-col gap-3">
            <div class="space-y-1">
              <div class="font-bold text-sm">📂 セーブデータの読込 (アップロード)</div>
              <p class="text-[10px] text-slate-400 leading-relaxed">過去にエクスポートしたセーブデータを読み込み、プレイを再開します。<br><span class="text-amber-500 font-semibold">※現在プレイ中のデータは上書きしてロードされます。</span></p>
            </div>
            <label class="block w-full">
              <input type="file" accept=".json" onchange="window.importSaveData(event)" class="hidden" id="save-file-input">
              <div class="bg-slate-800 text-center hover:bg-slate-700 text-white font-bold text-xs py-2.5 px-4 rounded-lg cursor-pointer transition-all active:scale-95 border border-white/5">
                セーブデータファイルを選択する
              </div>
            </label>
          </div>
          
          <!-- Danger Zone: Reset -->
          <div class="pt-4 border-t border-white/5 flex gap-3">
            ${Button({
              children: "閉じる",
              onClick: () => window.setState({ showSaveModal: false }),
              variant: "secondary",
              className: "flex-1 text-xs py-2.5"
            })}
            ${Button({
              children: "データを完全初期化",
              onClick: () => {
                if (confirm("本当に保存されているすべてのゲームデータをリセットしますか？この操作は取り消せません。")) {
                  localStorage.removeItem(SAVE_KEY);
                  window.setState({
                    screen: 'title',
                    horses: [],
                    mares: [...INITIAL_MARES],
                    money: 10000000,
                    week: 1,
                    month: 1,
                    year: 1,
                    history: [],
                    showSaveModal: false
                  });
                  alert("すべてのセーブデータを完全に初期化しました。");
                }
              },
              variant: "danger",
              className: "text-xs py-2.5"
            })}
          </div>
        </div>
      </div>
    </div>
  `;
}

// --- Render Logic ---
function render() {
  const app = document.getElementById('app');
  if (!app) return;

  let content = '';
  switch (window.state.screen) {
    case 'title': content = SceneTitle(); break;
    case 'stable': content = SceneStable(); break;
    case 'breeding_mare': content = SceneBreedingMare(); break;
    case 'breeding_stallion': content = SceneBreedingStallion(); break;
    case 'breeding_confirm': content = SceneBreedingConfirm(); break;
    case 'race_select': content = SceneRaceSelect(); break;
    case 'race_sim': content = SceneRaceSim(); break;
    case 'race_result': content = SceneRaceResult(); break;
    default: content = SceneTitle();
  }

  app.innerHTML = content + RenderSaveModal();
  
  createIcons({
    icons: {
      Trophy, Calendar, Coins, Dna, Zap, Activity, ChevronRight, ChevronLeft, Play, Heart, TrendingUp, History, Star, Home, Sparkles, Flame, Wind, MessageSquare, Send
    }
  });
}

// Start
document.addEventListener('DOMContentLoaded', () => {
  loadGame();
  render();
});
