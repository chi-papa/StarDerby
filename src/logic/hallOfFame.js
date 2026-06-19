// --- Hall of Fame & Milestones System ---

const formatMoney = (amount) => `¥${(amount / 10000).toLocaleString()}万`;

function Button({ children, onClick, className = "", variant = "primary" }) {
  const base = "px-4 py-2 rounded-lg font-bold transition-all active:scale-95 cursor-pointer text-xs sm:text-sm";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-slate-700 text-white hover:bg-slate-600",
    outline: "border border-slate-600 text-white hover:bg-slate-800",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  const chosenVariant = variants[variant] || variants.primary;
  return `
    <button onclick="${onClick}" class="${base} ${chosenVariant} ${className}">
      ${children}
    </button>
  `;
}

// 1. Check if a milestone is unlocked globally
window.isMilestoneUnlocked = (id) => {
  return !!(window.state && window.state.unlockedMilestones && window.state.unlockedMilestones.includes(id));
};

// 2. Get dynamic Star Blessing Cost
window.getBlessingCost = () => {
  return window.isMilestoneUnlocked('triple_crown') ? 4 : 5;
};

// 3. Get discounted stallion fee
window.getStallionPrice = (s) => {
  const basePrice = s.price || s.fee || 0;
  if (window.isMilestoneUnlocked('emperor')) {
    return Math.round(basePrice * 0.85); // 15% discount
  }
  return basePrice;
};

// 4. Get badges HTML for a horse
window.getHorseBadgesHtml = (h) => {
  let html = '';
  
  if ((h.maxConsecutiveWins || 0) >= 10) {
    html += `
      <span class="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 font-extrabold text-[9px] px-2 py-0.5 border border-amber-500/20 rounded-md shadow-[0_0_8px_rgba(245,158,11,0.1)]" title="10連勝達成">
        🏆 無敗の帝王
      </span>
    `;
  }
  if ((h.stats?.speed || 0) >= 900) {
    html += `
      <span class="inline-flex items-center gap-1 bg-indigo-500/10 text-indigo-400 font-extrabold text-[9px] px-2 py-0.5 border border-indigo-500/20 rounded-md shadow-[0_0_8px_rgba(99,102,241,0.1)]" title="スピード900以上達成">
        ⚡️ 伝説の俊足
      </span>
    `;
  }
  if ((h.stats?.stamina || 0) >= 900) {
    html += `
      <span class="inline-flex items-center gap-1 bg-blue-500/10 text-blue-400 font-extrabold text-[9px] px-2 py-0.5 border border-blue-500/20 rounded-md shadow-[0_0_8px_rgba(59,130,246,0.1)]" title="スタミナ900以上達成">
        🛡️ 鋼鉄の心肺
      </span>
    `;
  }
  if ((h.gradedWins?.length || 0) >= 5) {
    html += `
      <span class="inline-flex items-center gap-1 bg-rose-500/10 text-rose-400 font-extrabold text-[9px] px-2 py-0.5 border border-rose-500/20 rounded-md shadow-[0_0_8px_rgba(244,63,94,0.1)]" title="重賞5勝以上達成">
        👑 至高の三冠王
      </span>
    `;
  }
  if (h.isBlessed) {
    html += `
      <span class="inline-flex items-center gap-1 bg-yellow-500/10 text-yellow-400 font-extrabold text-[9px] px-2 py-0.5 border border-yellow-500/20 rounded-md shadow-[0_0_8px_rgba(234,179,8,0.1)]" title="星片の加護を継承">
        ✨ 黄金の血脈
      </span>
    `;
  }
  if (h.isHallOfFameRegistered) {
    html += `
      <span class="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 font-extrabold text-[9px] px-2 py-0.5 border border-emerald-500/20 rounded-md shadow-[0_0_8px_rgba(16,185,129,0.1)]" title="殿堂馬">
        🏛️ 殿堂馬
      </span>
    `;
  }

  if (!html) return '';
  return `<div class="flex flex-wrap gap-1 mt-2">${html}</div>`;
};

// 5. Core logic to analyze state and unlock achievements
window.checkMilestones = () => {
  if (!window.state) return;
  const unlocked = window.state.unlockedMilestones || [];
  const newlyUnlocked = [];

  const checkSingleMilestone = (id, checkFn) => {
    if (unlocked.includes(id)) return;
    const isMatched = window.state.horses.some(checkFn) || (window.state.hallOfFame || []).some(checkFn);
    if (isMatched) {
      newlyUnlocked.push(id);
    }
  };

  checkSingleMilestone('emperor', h => (h.maxConsecutiveWins || 0) >= 10);
  checkSingleMilestone('legendary_pace', h => (h.stats?.speed || 0) >= 900);
  checkSingleMilestone('iron_lungs', h => (h.stats?.stamina || 0) >= 900);
  checkSingleMilestone('triple_crown', h => (h.gradedWins?.length || 0) >= 5);
  checkSingleMilestone('golden_blood', h => !!h.isBlessed);

  if (newlyUnlocked.length > 0) {
    const updated = [...unlocked, ...newlyUnlocked];
    window.state.unlockedMilestones = updated;
    
    // Set timeout to avoid interrupting render loop animations
    setTimeout(() => {
      newlyUnlocked.forEach(id => {
        const title = {
          emperor: '🏆「無敗の帝王」実績達成！',
          legendary_pace: '⚡️「伝説の俊足」実績達成！',
          iron_lungs: '🛡️「鋼鉄の心肺」実績達成！',
          triple_crown: '👑「至高の三冠王」実績達成！',
          golden_blood: '✨「黄金の血統」実績達成！',
        }[id];
        
        const buff = {
          emperor: '【永続バフ】全ての種牡馬の配合保証費用が 15% 割引になります！',
          legendary_pace: '【永続バフ】週切り替え時のスピード(SPEED)のトレーニング成長率が 15% アップします！',
          iron_lungs: '【永続バフ】週切り替え時のスタミナ(STAMINA)のトレーニング成長率が 15% アップします！',
          triple_crown: '【永続バフ】繁殖の「星片の加護」の星片必要コストが 5個 → 4個 に減少します！',
          golden_blood: '【永続バフ】新馬スカウト(SCOUT)した馬の初期限界能力がすべて +50 されます！',
        }[id];
        
        alert(`🎉【殿堂入りマイルストーン偉業達成】\n\n${title}\n${buff}\n\n殿堂入りメニュー(HALL OF FAME)から発動中の効果を確認できます。`);
      });
      window.setState({}); // Re-render to display changes
    }, 600);
  }
};

// 6. SceneHallOfFame template renderer
window.SceneHallOfFame = () => {
  const { hallOfFame = [], unlockedMilestones = [] } = window.state;

  const milestonesList = [
    {
      id: 'emperor',
      title: '無敗の帝王 (Undefeated Emperor)',
      desc: 'いずれかの所有馬が10連勝（最大連勝10）を達成するか、または殿堂登録する。',
      buff: '全配合費用 15% 割引',
      icon: 'Trophy'
    },
    {
      id: 'legendary_pace',
      title: '伝説の俊足 (Legendary Swiftness)',
      desc: 'いずれかの所有馬のスピード能力が 900 以上に到達、あるいは殿堂登録する。',
      buff: 'スピード成長効率 +15% アップ',
      icon: 'Zap'
    },
    {
      id: 'iron_lungs',
      title: '鋼鉄の心肺 (Iron Lungs)',
      desc: 'いずれかの所有馬のスタミナ能力が 900 以上に到達、あるいは殿堂登録する。',
      buff: 'スタミナ成長効率 +15% アップ',
      icon: 'Activity'
    },
    {
      id: 'triple_crown',
      title: '至高の三冠王 (Triple Crown / G1 Hero)',
      desc: 'いずれかの所有馬が重賞（G1クラス等のレース）で通算 5勝 以上を記録する。',
      buff: '加護の星片消費が 5個 → 4個 に軽減',
      icon: 'Star'
    },
    {
      id: 'golden_blood',
      title: '黄金の血統 / 限界突破 (Golden Lineage)',
      desc: '星片の加護（BLESSED）を受けた限界突破仔馬を最低 1頭 ブリーディングによって誕生させる。',
      buff: '新馬スカウト限界ALL +50',
      icon: 'Sparkles'
    }
  ];

  return `
    <div class="min-h-screen bg-slate-950 text-white flex flex-col">
      <!-- Header -->
      <header class="p-6 border-b border-indigo-500/20 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10 flex justify-between items-center">
        <div class="flex items-center gap-6">
          <h2 class="text-2xl font-black italic tracking-tighter uppercase text-amber-500 flex items-center gap-2">
            <i data-lucide="Trophy" class="w-6 h-6 text-amber-400"></i>
            HALL OF FAME / 殿堂入り
          </h2>
        </div>
        <div>
          ${Button({ 
            children: "← 馬房に戻る (STABLE)", 
            onClick: "window.setState({ screen: 'stable' })", 
            variant: "outline", 
            className: "px-6 font-bold flex items-center gap-1.5"
          })}
        </div>
      </header>

      <!-- Main Content Container -->
      <main class="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Milestones Row/Col -->
        <div class="lg:col-span-2 space-y-6">
          <div class="space-y-1">
            <span class="text-[10px] font-black text-indigo-400 tracking-widest uppercase">BREEDER CHALLENGES (偉業マイルストーン)</span>
            <p class="text-xs text-slate-400 leading-normal">
              あなたの生産牧場の活動全体で、特定の目標を達成すると永久ボーナスバフとバッジが解放されます。
            </p>
          </div>

          <div class="space-y-4">
            ${milestonesList.map(m => {
              const isUnlocked = unlockedMilestones.includes(m.id);
              return `
                <div class="p-5 rounded-3xl border ${isUnlocked ? 'border-amber-500/30 bg-gradient-to-r from-amber-950/20 to-slate-900/30 shadow-[0_4px_25px_rgba(245,158,11,0.04)]' : 'border-slate-900 bg-slate-900/30'} flex flex-col sm:flex-row gap-5 justify-between items-start sm:items-center relative overflow-hidden">
                  ${isUnlocked ? `
                    <div class="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-amber-500/5 to-transparent pointer-events-none"></div>
                  ` : ''}
                  
                  <div class="flex gap-4 items-center">
                    <div class="w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center ${isUnlocked ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' : 'bg-slate-800 border border-slate-700/60 text-slate-500'}">
                      <i data-lucide="${m.icon}" class="w-5 h-5"></i>
                    </div>
                    <div class="space-y-1">
                      <div class="flex items-center gap-2.5 flex-wrap">
                        <h4 class="text-base font-black italic tracking-wide text-white">${m.title}</h4>
                        ${isUnlocked ? `
                          <span class="px-2.5 py-0.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[9px] font-black rounded-full uppercase tracking-wider shadow-[0_0_12px_rgba(245,158,11,0.3)] select-none">
                            発動中 (ACTIVE)
                          </span>
                        ` : `
                          <span class="px-2 py-0.5 bg-slate-800/80 border border-slate-700 text-slate-500 text-[9px] font-bold rounded-full select-none">
                            未達成
                          </span>
                        `}
                      </div>
                      <p class="text-xs text-slate-400 leading-snug font-medium pr-4">${m.desc}</p>
                    </div>
                  </div>

                  <div class="w-full sm:w-auto mt-2 sm:mt-0 px-4 py-2.5 bg-slate-950/50 rounded-2xl border ${isUnlocked ? 'border-amber-500/20 text-amber-300' : 'border-slate-800 text-slate-500'} font-bold flex flex-col items-center justify-center text-center sm:min-w-[190px]">
                    <span class="text-[8px] uppercase tracking-widest text-slate-500 font-extrabold mb-1">永続バフ効果 (BUFF)</span>
                    <span class="text-[11px] leading-tight block">${m.buff}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Hall of Fame Gallery -->
        <div class="space-y-6">
          <div class="space-y-1">
            <span class="text-[10px] font-black text-amber-400 tracking-widest uppercase">LEGENDARY GALLERY (殿堂馬名簿)</span>
            <p class="text-xs text-slate-400">
              各馬のカードからいつでも最高実績時の姿を永久にアーカイブできます（引退・売却後も名簿に残せます）。
            </p>
          </div>

          <div class="space-y-4 max-h-[580px] overflow-y-auto pr-2 bg-slate-900/20 border border-white/5 p-4 rounded-3xl">
            ${hallOfFame.length === 0 ? `
              <div class="py-16 px-4 flex flex-col items-center justify-center text-center text-slate-500 gap-4 border border-dashed border-slate-800 rounded-2xl bg-slate-900/10 hover:bg-slate-900/20 transition-all">
                <div class="w-12 h-12 rounded-full border border-slate-800/80 bg-slate-900/50 flex items-center justify-center">
                  <i data-lucide="Trophy" class="w-6 h-6 text-slate-600 animate-pulse"></i>
                </div>
                <div>
                  <h4 class="font-black text-sm text-slate-400">まだ殿堂馬がいません</h4>
                  <p class="text-[10px] text-slate-500 mt-1 max-w-[220px] mx-auto leading-relaxed">
                    所有馬詳細の「殿堂入り登録」より、あなたのお気に入り競走馬をレジェンドとして登録してください！
                  </p>
                </div>
              </div>
            ` : hallOfFame.map(h => {
              const ageLabel = h.age >= 11 ? '引退' : `${h.age}歳`;
              return `
                <div class="p-4 bg-slate-900/80 border border-amber-500/20 rounded-2xl space-y-3 relative overflow-hidden group hover:border-amber-400/40 transition-all shadow-[inset_0_1px_5px_rgba(245,158,11,0.02)]">
                  <!-- Arch badge in background decoration -->
                  <div class="absolute -bottom-10 -right-10 w-24 h-24 bg-amber-500/[0.015] rounded-full blur-xl group-hover:bg-amber-500/[0.03] transition-colors"></div>
                  
                  <div class="flex items-center gap-3 justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-950 border border-white/10 relative p-[2px]">
                        <div class="w-full h-full rounded-lg" style="background-color: ${h.color || '#3e2723'}"></div>
                      </div>
                      <div>
                        <div class="text-sm font-black text-white italic tracking-tight uppercase">${h.name}</div>
                        <div class="text-[9px] font-bold text-slate-500">
                          ${ageLabel}・${h.gender === 'colt' ? '牡' : '牝'} | ランク ${h.bloodlineRank || 'C'}
                        </div>
                      </div>
                    </div>
                    <div class="w-7 h-7 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.2)]">
                      <i data-lucide="Trophy" class="w-4 h-4 text-amber-400"></i>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-2 text-[10px] font-bold bg-slate-950/70 p-2.5 rounded-xl border border-white/5 font-mono">
                    <div class="space-y-0.5">
                      <span class="text-slate-500 text-[8px] uppercase tracking-wider font-extrabold font-sans">戦績 (CAREER)</span>
                      <span class="text-slate-200">${h.winCount || 0}勝 / ${h.totalRaces || 0}戦</span>
                    </div>
                    <div class="space-y-0.5 border-l border-white/5 pl-2">
                      <span class="text-slate-500 text-[8px] uppercase tracking-wider font-extrabold font-sans">最大連勝 (STREAK)</span>
                      <span class="text-amber-400">${h.consecutiveWins || h.maxConsecutiveWins || 0}連勝</span>
                    </div>
                    <div class="space-y-0.5 border-t border-white/5 pt-1.5">
                      <span class="text-slate-500 text-[8px] uppercase tracking-wider font-extrabold font-sans">SPEED</span>
                      <span class="text-indigo-400">${h.stats.speed}</span>
                    </div>
                    <div class="space-y-0.5 border-t border-l border-white/5 pt-1.5 pl-2">
                      <span class="text-slate-500 text-[8px] uppercase tracking-wider font-extrabold font-sans">STAMINA</span>
                      <span class="text-blue-400">${h.stats.stamina}</span>
                    </div>
                  </div>

                  <!-- Mini badge indicators -->
                  ${window.getHorseBadgesHtml(h)}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </main>
    </div>
  `;
};
