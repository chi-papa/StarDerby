export function generateHorseName() {
  const prefixes = [
    'サンダー', 'ギャラクシー', 'ミルキー', 'スター', 'コスモ', 'ルナ', 'ソーラー',
    'ノヴァ', 'メテオ', 'コメット', 'アストロ', 'プラネット', 'オーロラ', 'スカイ',
    'シリウス', 'ベガ', 'アルタイル', 'リゲル', 'カノープス', 'スピカ', 'アンタレス'
  ];
  const suffixes = [
    'ノヴァ', 'ブレイド', 'ロード', 'キング', 'クイーン', 'オーブ', 'ブレイブ',
    'ダッシュ', 'ランナー', 'ハート', 'ソウル', 'スピリット', 'エース', 'ジョーカー',
    'インパクト', 'オーロラ', 'ギャラクシー', 'スター', 'コスモス', 'ヘヴン'
  ];
  return prefixes[Math.floor(Math.random() * prefixes.length)] + suffixes[Math.floor(Math.random() * suffixes.length)];
}

function getVowelType(char) {
  const vowels = {
    a: /[あかさたなはまやらわがざだばぱ]/,
    i: /[いきしちにひみりぎじぢびぴ]/,
    u: /[うくすつぬふむゆるぐずづぶぷ]/,
    e: /[えけせてねへめれげぜでべぺ]/,
    o: /[おこそとのほもよろをごぞどぼぽ]/,
    dash: /[ー]/
  };
  if (vowels.a.test(char)) return 'speed';
  if (vowels.i.test(char)) return 'stamina';
  if (vowels.u.test(char)) return 'guts';
  if (vowels.e.test(char)) return 'temperament';
  if (vowels.o.test(char)) return 'luck';
  if (vowels.dash.test(char)) return 'health';
  return null;
}

export function checkBreeding(stallion, mare, applyBlessing = false) {
  const id = Math.random().toString(36).substr(2, 9);
  const name = generateHorseName();
  
  // 突然変異（Mutation）判定
  const sireRank = stallion.bloodlineRank || 'C';
  const damRank = mare.bloodlineRank || 'C';
  
  // ランク数値化 S:5, A:4, B:3, C:2, D:1
  const rankScores = { 'S': 5, 'A': 4, 'B': 3, 'C': 2, 'D': 1 };
  const sireScore = rankScores[sireRank] || 2;
  const damScore = rankScores[damRank] || 2;
  
  // 突然変異確率算出 (両親のランクが高いほど飛躍的にアップ)
  let mutationChance = 0.03;
  const maxScore = Math.max(sireScore, damScore);
  const avgScore = (sireScore + damScore) / 2;
  
  if (sireRank === 'S' && damRank === 'S') mutationChance = 0.35;
  else if (maxScore === 5 && avgScore >= 4.5) mutationChance = 0.28; // S + A
  else if (maxScore === 5) mutationChance = 0.20; // S + B/C/D
  else if (sireRank === 'A' && damRank === 'A') mutationChance = 0.22;
  else if (maxScore === 4 && avgScore >= 3.5) mutationChance = 0.16; // A + B
  else if (maxScore === 4) mutationChance = 0.12;
  else if (sireRank === 'B' && damRank === 'B') mutationChance = 0.10;
  else if (maxScore === 3) mutationChance = 0.06;
  else mutationChance = 0.03;
  
  // 星片の加護は突然変異確率を底上げし、さらなる可能性を引き出す (+15%)
  if (applyBlessing) {
    mutationChance += 0.15;
  }
  
  const isMutation = Math.random() < mutationChance;
  let mutationBonus = { speed: 0, stamina: 0, guts: 0, temperament: 0, health: 0, luck: 0, explosiveness: 0 };
  let mutationType = null;
  
  if (isMutation) {
    const types = ['speed', 'stamina', 'guts', 'explosiveness', 'all'];
    mutationType = types[Math.floor(Math.random() * types.length)];
    const bonusScale = maxScore * 25; // 親の最大ランクに応じてボーナス増幅
    
    if (mutationType === 'speed') {
      mutationBonus.speed = 80 + bonusScale;
    } else if (mutationType === 'stamina') {
      mutationBonus.stamina = 80 + bonusScale;
    } else if (mutationType === 'guts') {
      mutationBonus.guts = 80 + bonusScale;
    } else if (mutationType === 'explosiveness') {
      mutationBonus.explosiveness = 85 + bonusScale;
    } else {
      // 'all' mutation
      const allBonus = 30 + (maxScore * 6);
      mutationBonus.speed = allBonus;
      mutationBonus.stamina = allBonus;
      mutationBonus.guts = allBonus;
      mutationBonus.temperament = allBonus;
      mutationBonus.health = allBonus;
      mutationBonus.luck = allBonus;
      mutationBonus.explosiveness = allBonus;
    }
  }

  // インブリードのチェック (3代前まで)
  const stallionAncestors = [stallion.name, stallion.pedigree.father, stallion.pedigree.mother, ...stallion.pedigree.grandFathers, ...stallion.pedigree.grandMothers];
  const mareAncestors = [mare.name, mare.pedigree.father, mare.pedigree.mother, ...mare.pedigree.grandFathers, ...mare.pedigree.grandMothers];
  
  // 文字ベースのインブリード
  const stallionChars = new Set(stallionAncestors.join('').split(''));
  const mareChars = new Set(mareAncestors.join('').split(''));
  
  const inbreedingChars = [];
  const inbreedingEffects = [];
  
  stallionChars.forEach(char => {
    if (char !== '?' && mareChars.has(char)) {
      inbreedingChars.push(char);
      const effect = getVowelType(char);
      if (effect) inbreedingEffects.push(effect);
    }
  });

  // ニックスのチェック (違う文字が3文字以上あるとき)
  const stallionNameChars = new Set(stallion.name.split(''));
  const mareNameChars = new Set(mare.name.split(''));
  
  let diffCount = 0;
  stallionNameChars.forEach(c => { if (!mareNameChars.has(c)) diffCount++; });
  mareNameChars.forEach(c => { if (!stallionNameChars.has(c)) diffCount++; });
  
  const isNick = diffCount >= 3 || applyBlessing;

  // 爆発力の計算
  let explosionChance = 0.05;
  if (isNick) explosionChance += 0.15;
  if (inbreedingChars.length > 0) explosionChance += inbreedingChars.length * 0.03;
  if (applyBlessing) explosionChance = 1.0;
  
  const explosion = Math.random() < explosionChance;
  const explosionBonus = (explosion ? 25 : 0) + (applyBlessing ? 40 : 0);
  const traits = [];
  const growthType = stallion.growthType;

  // 特殊文字による特性継承
  const specialChars = [
    { char: '流', trait: '流星の速さ' },
    { char: '星', trait: '流星の速さ' },
    { char: '龍', trait: '神のオーラ' },
    { char: '神', trait: '神のオーラ' },
    { char: '王', trait: '大逃げ' },
    { char: '帝', trait: '大逃げ' },
    { char: '威', trait: '威圧感' },
    { char: '圧', trait: '威圧感' },
    { char: '風', trait: '一陣の風' },
    { char: '嵐', trait: '一陣の風' },
    { char: '鋼', trait: '鋼の心臓' },
    { char: '鉄', trait: '鋼の心臓' },
    { char: '奇', trait: '奇跡の末脚' },
    { char: '跡', trait: '奇跡の末脚' }
  ];

  inbreedingChars.forEach(char => {
    const special = specialChars.find(s => s.char === char);
    if (special && Math.random() < 0.3) {
      if (!traits.includes(special.trait)) traits.push(special.trait);
    }
  });

  // 親からの特性継承
  const parentTraits = [...(stallion.traits || []), ...(mare.traits || [])];
  parentTraits.forEach(trait => {
    if (Math.random() < 0.2) {
      if (!traits.includes(trait)) traits.push(trait);
    }
  });

  if (applyBlessing) {
    const goldTraits = ['流星の速さ', '神のオーラ', '一陣の風', '奇跡の末脚', '鋼の心臓', '威圧感'];
    const t1 = goldTraits[Math.floor(Math.random() * goldTraits.length)];
    const t2 = goldTraits.filter(x => x !== t1)[Math.floor(Math.random() * (goldTraits.length - 1))];
    if (!traits.includes(t1)) traits.push(t1);
    if (!traits.includes(t2)) traits.push(t2);
  }

  // 突然変異による付加特性 (確定で金特性が追加)
  if (isMutation) {
    const goldTraits = ['流星の速さ', '神のオーラ', '一陣の風', '奇跡の末脚', '鋼の心臓', '威圧感'];
    const selectedTrait = goldTraits[Math.floor(Math.random() * goldTraits.length)];
    if (!traits.includes(selectedTrait)) {
      traits.push(selectedTrait);
    }
  }

  // 能力継承ロジック
  const inheritStat = (s1, s2, bonus, statName, explosivePower) => {
    const ep = explosivePower || 100;
    // 異次元設定: 親の能力の引き継ぎ率を上げ、ランダムベースも底上げ
    const inheritedBase = (s1 * 0.15 + s2 * 0.25); 
    const randomBase = 100 + Math.random() * 600;
    
    let base = inheritedBase + randomBase;
    
    if (growthType === 'early') base -= 50;
    if (growthType === 'late') base += 50;

    let varianceRange = 150 + ep * 1.5; 
    const inbreedingCount = inbreedingEffects.filter(e => e === statName).length;
    
    if (inbreedingCount > 0) {
      varianceRange += inbreedingCount * 120;
    }

    let variance = (Math.random() - 0.5) * varianceRange;
    let result = base + variance + (bonus || 0);
    
    if (inbreedingCount > 0) {
      result += inbreedingCount * 40;
    }

    if (isNick) {
      result += 60;
    }

    if (result > 950) {
      const limitBypassChance = 0.03 + (ep / 800); 
      if (Math.random() > limitBypassChance) {
        result = 950 + (result - 950) * 0.05;
      }
    }

    const hardLimit = 1050 + (ep > 120 ? (ep - 120) * 8 : -0); 
    return Math.max(50, Math.min(hardLimit, Math.round(result)));
  };

  const maxStats = {
    speed: inheritStat(stallion.stats.speed || 500, mare.stats.speed || 500, explosionBonus * 4 + mutationBonus.speed, 'speed', stallion.explosivePower),
    stamina: inheritStat(stallion.stats.stamina || 500, mare.stats.stamina || 500, explosionBonus * 4 + mutationBonus.stamina, 'stamina', stallion.explosivePower),
    guts: inheritStat(stallion.stats.guts || 500, mare.stats.guts || 500, explosionBonus * 4 + mutationBonus.guts, 'guts', stallion.explosivePower),
    temperament: inheritStat(stallion.stats.temperament || 500, mare.stats.temperament || 500, inbreedingEffects.filter(e => e === 'temperament').length * 30 + mutationBonus.temperament, 'temperament', stallion.explosivePower),
    health: inheritStat(stallion.stats.health || 700, mare.stats.health || 700, explosionBonus * 2 + mutationBonus.health, 'health', stallion.explosivePower),
    luck: inheritStat(stallion.stats.luck || 700, mare.stats.luck || 700, explosionBonus * 2 + mutationBonus.luck, 'luck', stallion.explosivePower),
    explosiveness: inheritStat(stallion.stats.explosiveness || 500, mare.stats.explosiveness || 500, explosionBonus * 5 + mutationBonus.explosiveness, 'explosiveness', (stallion.explosivePower || 100) * 1.5),
  };

  if (inbreedingChars.length > 2) {
    maxStats.temperament = Math.max(50, maxStats.temperament - (inbreedingChars.length * 60));
  }

  const lineageId = Math.random() > 0.5 ? stallion.lineageId : mare.lineageId;
  const strategy = traits.includes('大逃げ') ? 'escape' : stallion.strategy;

  const pedigree = {
    father: stallion.name,
    mother: mare.name,
    grandFathers: [stallion.pedigree.father, mare.pedigree.father],
    grandMothers: [stallion.pedigree.mother, mare.pedigree.mother],
    greatGrandFathers: [
      stallion.pedigree.grandFathers[0],
      stallion.pedigree.grandFathers[1],
      mare.pedigree.grandFathers[0],
      mare.pedigree.grandFathers[1]
    ]
  };

  const calculateBloodlineRank = (stats) => {
    const avg = (stats.speed + stats.stamina) / 2;
    if (avg >= 850) return 'S';
    if (avg >= 730) return 'A';
    if (avg >= 600) return 'B';
    if (avg >= 450) return 'C';
    return 'D';
  };

  let bloodlineRank = calculateBloodlineRank(maxStats);
  if (applyBlessing && bloodlineRank !== 'S') {
    bloodlineRank = 'A';
  }
  
  // 突然変異による血統ランク強化 (B=>A, A=>S などのアップグレードチャンス)
  if (isMutation) {
    const rankLevels = ['D', 'C', 'B', 'A', 'S'];
    const currentIdx = rankLevels.indexOf(bloodlineRank);
    if (currentIdx !== -1 && currentIdx < rankLevels.length - 1) {
      bloodlineRank = rankLevels[currentIdx + 1];
    }
  }

  const horse = {
    id,
    name,
    age: 0,
    gender: Math.random() > 0.5 ? 'colt' : 'filly',
    color: ['#3e2723', '#5d4037', '#795548', '#a1887f', '#212121', '#424242', '#9e9e9e', '#eeeeee', '#ffccbc'][Math.floor(Math.random() * 9)],
    stats: { 
      speed: Math.max(20, Math.round(maxStats.speed * 0.3)), 
      stamina: Math.max(20, Math.round(maxStats.stamina * 0.3)), 
      guts: Math.max(20, Math.round(maxStats.guts * 0.3)), 
      temperament: Math.max(20, Math.round(maxStats.temperament * 0.3)),
      health: Math.max(20, Math.round(maxStats.health * 0.3)),
      luck: Math.max(20, Math.round(maxStats.luck * 0.3)),
      explosiveness: Math.max(20, Math.round(maxStats.explosiveness * 0.3))
    },
    maxStats,
    bloodlineRank,
    lineageId,
    pedigree,
    distanceAptitude: stallion.distanceAptitude || [1600, 2400],
    growthType,
    strategy,
    trainingFocus: 'speed',
    isRetired: false,
    isGelding: false,
    hasShadowRoll: false,
    isInjured: false,
    winCount: 0,
    totalRaces: 0,
    currentCondition: 80,
    fatigue: 0,
    gradedWins: [],
    isAutoMode: false,
    isBlessed: applyBlessing,
    traits,
    explosivePower: Math.max(50, (stallion.explosivePower || 100) + Math.floor((Math.random() - 0.5) * 40)),
    isMutation,
    mutationType
  };

  return { horse, inbreeding: inbreedingChars, inbreedingCount: inbreedingChars.length, nicks: isNick, explosion, isMutation, mutationType };
}

export function generateRandomHorse() {
  const id = Math.random().toString(36).substr(2, 9);
  const name = generateHorseName();
  
  // ランク確率: S:5%, A:15%, B:40%, C:30%, D:10%
  const rand = Math.random();
  let bloodlineRank = 'C';
  let statRange = { min: 450, max: 600 };
  
  if (rand < 0.05) {
    bloodlineRank = 'S';
    statRange = { min: 850, max: 1000 };
  } else if (rand < 0.20) {
    bloodlineRank = 'A';
    statRange = { min: 730, max: 850 };
  } else if (rand < 0.60) {
    bloodlineRank = 'B';
    statRange = { min: 600, max: 730 };
  } else if (rand < 0.90) {
    bloodlineRank = 'C';
    statRange = { min: 450, max: 600 };
  } else {
    bloodlineRank = 'D';
    statRange = { min: 250, max: 450 };
  }

  const getRandomStat = (range) => {
    return Math.floor(range.min + Math.random() * (range.max - range.min));
  };

  let bonusOffset = 0;
  if (typeof window !== 'undefined' && window.isMilestoneUnlocked && window.isMilestoneUnlocked('golden_blood')) {
    bonusOffset = 50;
  }

  const speed = getRandomStat(statRange) + bonusOffset;
  const stamina = getRandomStat(statRange) + bonusOffset;

  const secondaryRange = { min: 400, max: 850 };
  const guts = getRandomStat(secondaryRange);
  const temperament = getRandomStat(secondaryRange);
  const health = getRandomStat(secondaryRange);
  const luck = getRandomStat(secondaryRange);
  const explosiveness = getRandomStat(secondaryRange);

  const maxStats = { speed, stamina, guts, temperament, health, luck, explosiveness };
  
  const growthType = ['early', 'normal', 'late'][Math.floor(Math.random() * 3)];
  const strategy = ['escape', 'pace', 'last', 'stay'][Math.floor(Math.random() * 4)];
  const lineageId = ['speed', 'stamina', 'guts', 'balance'][Math.floor(Math.random() * 4)];

  const colors = ['#3e2723', '#5d4037', '#795548', '#a1887f', '#212121', '#424242', '#9e9e9e', '#eeeeee', '#ffccbc'];
  const color = colors[Math.floor(Math.random() * colors.length)];

  const pedigree = {
    father: 'スカウト種牡馬',
    mother: 'スカウト繁殖牝馬',
    grandFathers: ['海外レジェンド', '国内レジェンド'],
    grandMothers: ['野生の風', '静かなる月'],
    greatGrandFathers: ['始祖A', '始祖B', '始祖C', '始祖D']
  };

  return {
    id,
    name,
    age: 2, // スカウト馬はすぐに育成可能な2歳馬に設定
    gender: Math.random() > 0.5 ? 'colt' : 'filly',
    color,
    stats: { 
      speed: Math.max(50, Math.round(speed * 0.45)), 
      stamina: Math.max(50, Math.round(stamina * 0.45)), 
      guts: Math.max(50, Math.round(guts * 0.45)), 
      temperament: Math.max(50, Math.round(temperament * 0.45)),
      health: Math.max(50, Math.round(health * 0.45)),
      luck: Math.max(50, Math.round(luck * 0.45)),
      explosiveness: Math.max(50, Math.round(explosiveness * 0.45))
    },
    maxStats,
    bloodlineRank,
    lineageId,
    pedigree,
    distanceAptitude: speed > stamina ? [1000, 1600] : [2000, 3000],
    growthType,
    strategy,
    trainingFocus: 'speed',
    isRetired: false,
    isGelding: false,
    hasShadowRoll: false,
    isInjured: false,
    winCount: 0,
    totalRaces: 0,
    currentCondition: 80,
    fatigue: 0,
    gradedWins: [],
    isAutoMode: false,
    traits: [],
    explosivePower: 50 + Math.floor(Math.random() * 100)
  };
}
