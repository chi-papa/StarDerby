function getVowelBuff(name) {
  const vowels = {
    a: /[あかさたなはまやらわがざだばぱ]/,
    i: /[いきしちにひみりぎじぢびぴ]/,
    u: /[うくすつぬふむゆるぐずづぶぷ]/,
    e: /[えけせてねへめれげぜでべぺ]/,
    o: /[おこそとのほもよろをごぞどぼぽ]/,
    dash: /[ー]/
  };
  
  const buff = { speed: 0, stamina: 0, guts: 0, temperament: 0, luck: 0, health: 0 };
  
  for (const char of name) {
    if (vowels.a.test(char)) buff.speed = (buff.speed || 0) + 5;
    if (vowels.i.test(char)) buff.stamina = (buff.stamina || 0) + 5;
    if (vowels.u.test(char)) buff.guts = (buff.guts || 0) + 5;
    if (vowels.e.test(char)) buff.temperament = (buff.temperament || 0) + 5;
    if (vowels.o.test(char)) buff.luck = (buff.luck || 0) + 5;
    if (vowels.dash.test(char)) buff.health = (buff.health || 0) + 5;
  }
  
  return buff;
}

export function simulateRace(playerHorse, enemies, race) {
  const allHorses = [playerHorse, ...enemies];
  
  // Calculate Ratings and Predictions
  const ratings = allHorses.map(h => {
    const s = h.stats;
    const base = (Number(s.speed) + Number(s.stamina) + Number(s.guts) + Number(s.explosiveness)) / 4;
    const luckBonus = (Number(s.luck) / 10);
    return Math.floor(base + luckBonus);
  });

  const sortedRatings = [...ratings].sort((a, b) => b - a);
  const predictions = ratings.map(r => {
    if (r === sortedRatings[0]) return '◎';
    if (r === sortedRatings[1]) return '◯';
    if (r === sortedRatings[2]) return '▲';
    if (r === sortedRatings[3]) return '△';
    if (r >= sortedRatings[7]) return '×';
    return '';
  });

  // Assign lanes and initial state
    const horseStates = allHorses.map((horse, index) => {
      let effectiveStats = { 
        speed: Number(horse.stats.speed) || 500,
        stamina: Number(horse.stats.stamina) || 500,
        guts: Number(horse.stats.guts) || 500,
        temperament: Number(horse.stats.temperament) || 500,
        luck: Number(horse.stats.luck) || 500,
        health: Number(horse.stats.health) || 500,
        explosiveness: Number(horse.stats.explosiveness) || 500
      };
      const activeBuffs = [];
    const logs = [];

    // Vowel Buffs
    const vowelBuff = getVowelBuff(horse.name);
    effectiveStats.speed += vowelBuff.speed || 0;
    effectiveStats.stamina += vowelBuff.stamina || 0;
    effectiveStats.guts += vowelBuff.guts || 0;
    effectiveStats.temperament += vowelBuff.temperament || 0;
    effectiveStats.luck += vowelBuff.luck || 0;
    effectiveStats.health += vowelBuff.health || 0;

    // Track Condition Buff
    if (race.trackCondition === 'Heavy' && horse.lineageId === 'stamina') {
      effectiveStats.speed *= 1.1;
      activeBuffs.push('重馬場巧者');
    }
    
    // Distance Aptitude
    const [minDist, maxDist] = horse.distanceAptitude;
    if (race.distance < minDist || race.distance > maxDist) {
      effectiveStats.stamina *= 0.8;
      logs.push(`${horse.name}は距離適性に苦しんでいる...`);
    }

    // Temperament Buff/Debuff
    if (effectiveStats.temperament < 400 && !horse.hasShadowRoll) {
      const penalty = 0.9 + (effectiveStats.temperament / 4000); // 0.9 to 1.0
      effectiveStats.speed *= penalty;
      effectiveStats.stamina *= penalty;
      activeBuffs.push('イレ込み');
      logs.push(`${horse.name}はイレ込んでいる...`);
    } else if (effectiveStats.temperament > 800) {
      effectiveStats.speed *= 1.02;
      activeBuffs.push('落ち着き');
    }

    // Shadow Roll effect
    if (horse.hasShadowRoll) {
      activeBuffs.push('シャドーロール');
      if (effectiveStats.temperament < 600) {
        effectiveStats.temperament += 200; // 集中力アップ
      }
    }

    // Strategy Buff
    if (horse.strategy === race.strategy) {
      effectiveStats.speed *= 1.05;
      effectiveStats.stamina *= 1.05;
      activeBuffs.push('作戦一致');
    }

    return {
      horse,
      effectiveStats,
      activeBuffs,
      logs,
      lane: index,
      currentDistance: 0,
      currentTime: 0,
      currentSpeed: 0,
      isInjuredInRace: false,
      stamina: Math.max(100, (effectiveStats.stamina * 1.5) + (effectiveStats.guts * 0.5)),
      maxStamina: Math.max(100, (effectiveStats.stamina * 1.5) + (effectiveStats.guts * 0.5)),
      progress: [],
      finished: false,
      finishTime: 0,
      debuffBuffer: 1.0, 
    };
  });

  const timeInterval = 0.1; // Snapshot interval
  let globalTime = 0;
  const stepTime = 0.05; // Simulation step
  
  // Injury chance based on health and luck
  const getInjuryChance = (stats, fatigue) => {
    const baseChance = 0.00001; 
    const healthFactor = (1000 - stats.health) / 2000000;
    const fatigueFactor = fatigue / 1000000;
    const luckFactor = stats.luck / 5000000;
    return Math.max(0, baseChance + healthFactor + fatigueFactor - luckFactor);
  };

  let lastCommentaryStep = -1;

  // Strategy parameters
  const getStrategyMult = (strategy, stage, stamina, maxStamina) => {
    const staminaRatio = maxStamina > 0 ? stamina / maxStamina : 0;
    const staminaFactor = staminaRatio > 0 ? 0.92 + (staminaRatio * 0.08) : 0.5;

    switch (strategy) {
      case 'escape': 
        if (stage < 0.4) return 1.15 * staminaFactor; 
        if (stage < 0.8) return 1.00 * staminaFactor;
        return 0.98 * staminaFactor;
      case 'lead': 
        if (stage < 0.3) return 1.05 * staminaFactor;
        if (stage < 0.7) return 1.02 * staminaFactor;
        return 1.05 * staminaFactor;
      case 'insert': 
        if (stage < 0.4) return 0.98 * staminaFactor;
        if (stage < 0.7) return 1.02 * staminaFactor;
        return 1.15 * staminaFactor; 
      case 'stay': 
        if (stage < 0.5) return 0.92 * staminaFactor; 
        if (stage < 0.8) return 1.00 * staminaFactor;
        return 1.35 * staminaFactor;
      default:
        return 1.0 * staminaFactor;
    }
  };

  let safetyCounter = 0;
  const maxSafetySteps = 10000; // Prevent infinite loops

  // Initial snapshot at 0
  horseStates.forEach(h => {
    h.progress.push({
      distance: 0,
      speed: 0,
      staminaLeft: h.maxStamina,
      x: 0,
      y: 100 + (h.lane * 40),
      lane: h.lane
    });
  });

  while (horseStates.some(h => !h.finished) && safetyCounter < maxSafetySteps) {
    safetyCounter++;
    globalTime += stepTime;

    horseStates.forEach(h => {
      h.debuffBuffer = 1.0;
    });

    horseStates.forEach(h => {
      if (h.finished) return;

      // 威圧感の判定 (周囲の馬の能力を下げる)
      if (h.horse.traits?.includes('威圧感')) {
        const effectRadius = 20;
        horseStates.forEach(other => {
          if (other.horse.id !== h.horse.id && !other.finished) {
            const distDiff = Math.abs(other.currentDistance - h.currentDistance);
            if (distDiff < effectRadius) {
              // 威圧感：周囲の馬の速度を2%抑制する
              other.debuffBuffer *= 0.98;
            }
          }
        });
      }

      const stage = Math.min(1, Math.max(0, h.currentDistance / race.distance));
      
      // 横に並んだときに根性を発揮する
      let gutsBonus = 1.0;
      const nearbyHorses = horseStates.filter(other => 
        other.horse.id !== h.horse.id && 
        !other.finished &&
        Math.abs(other.currentDistance - h.currentDistance) < 5
      );
      
      if (nearbyHorses.length > 0) {
        // 競り合い状態: 根性に応じてスピード微増
        gutsBonus = 1.0 + ((h.effectiveStats.guts || 0) / 10000);
        
        // 追い込み馬は競り合いに強い設定
        if (h.horse.strategy === 'stay') {
          gutsBonus += 0.02;
        }
        
        // 特性: 神のオーラ (競り合い時に相手のスタミナを削る or 自分の根性をさらに高める)
        if (h.horse.traits?.includes('神のオーラ')) {
          gutsBonus += 0.02;
        }
      }

      const strategyMult = getStrategyMult(h.horse.strategy, stage, h.stamina, h.maxStamina);
      const randomFactor = 0.98 + (Math.random() * 0.04); // 4% randomness
      
    // 3x speed for faster gameplay as requested
    // 実在の競馬速度 (約17-18m/s) の3倍 (~54m/s) を基準にする
    const baseSpeed = 32 + Math.pow((h.effectiveStats.speed || 500) / 100, 1.3) * 1.4;
    
    // 特性: 大逃げ (序盤に圧倒的なスピード)
    let traitBonus = 1.0;
    if (h.horse.traits?.includes('大逃げ') && stage < 0.7) {
      traitBonus = 1.3;
    }
    
    // 特性: 流星の速さ (終盤に加速)
    if (h.horse.traits?.includes('流星の速さ') && stage > 0.8) {
      traitBonus *= 1.12;
    }
    
    // 特性: 一陣の風 (直線突入時にボーナス)
    if (h.horse.traits?.includes('一陣の風') && stage > 0.75 && stage < 0.85) {
      traitBonus *= 1.15;
    }
    
    // 特性: 奇跡の末脚 (ゴール直前で超加速)
    if (h.horse.traits?.includes('奇跡の末脚') && stage > 0.95) {
      traitBonus *= 1.35;
    }

    const targetSpeed = baseSpeed * strategyMult * randomFactor * gutsBonus * traitBonus * h.debuffBuffer;
    
    // 瞬発力による加速ロジック
    // 瞬発力 (100-1000) が高いほど、目標速度に早く到達する
    // バラツキを大きく持たせる (0.8 - 1.2倍のランダム)
    const explosiveRandom = 0.8 + (Math.random() * 0.4);
    let accelerationBase = (((h.effectiveStats.explosiveness || 500) / 80) + 5) * explosiveRandom; 
    
    // 追い込み馬は終盤の加速力が凄まじいが、ここでもバラツキを持たせる
    if (h.horse.strategy === 'stay' && stage > 0.8) {
      accelerationBase *= (1.8 + Math.random() * 0.4);
    }

    if (h.currentSpeed < targetSpeed) {
      h.currentSpeed = Math.min(targetSpeed, h.currentSpeed + accelerationBase * stepTime);
    } else {
      // 減速は少し緩やか
      h.currentSpeed = Math.max(targetSpeed, h.currentSpeed - (accelerationBase * 0.4) * stepTime);
    }

    const currentSpeed = isNaN(h.currentSpeed) || h.currentSpeed < 0 ? 0 : h.currentSpeed;
    
    // Injury check during race
    if (!h.finished && !h.isInjuredInRace) {
      if (Math.random() < getInjuryChance(h.effectiveStats, h.horse.fatigue)) {
        h.isInjuredInRace = true;
        h.finished = true;
        h.finishTime = 999; // DNF
        h.logs.push(`${h.horse.name}が故障を発生！競争を中止しました。`);
        
        // Add final snapshot for injury
        h.progress.push({
          distance: h.currentDistance,
          speed: 0,
          staminaLeft: Math.max(0, h.stamina),
          x: (h.currentDistance / race.distance) * 1000,
          y: 100 + (h.lane * 40),
          lane: h.lane
        });
      }
    }

    if (!h.isInjuredInRace) {
      h.currentDistance += currentSpeed * stepTime;
      if (isNaN(h.currentDistance)) h.currentDistance = 0;
      h.currentTime = globalTime;
    }
    
    // Stamina drain adjusted for 3x speed
    // スタミナ消費を大幅に強化して、スタミナ値の意味を持たせる
    const drainBase = Math.pow(currentSpeed / 45, 2.8); 
    const strategyDrain = { escape: 1.35, lead: 1.15, insert: 0.9, stay: 0.7 }[h.horse.strategy] || 1.0;
    
    // 特性によるスタミナ軽減
    let traitDrain = 1.0;
    if (h.horse.traits?.includes('大逃げ')) traitDrain *= 1.8;
    if (h.horse.traits?.includes('鋼の心臓')) traitDrain *= 0.65; // スタミナ消費35%カット

    // 1000スケールに合わせて調整 (消費量を増やす)
    h.stamina -= drainBase * strategyDrain * traitDrain * stepTime * 1.2;

    // 威圧感の判定 (周囲の馬の能力を下げる)
    if (h.horse.traits?.includes('威圧感')) {
      const effectRadius = 15;
      horseStates.forEach(other => {
        if (other.horse.id !== h.horse.id && !other.finished) {
          const distDiff = Math.abs(other.currentDistance - h.currentDistance);
          if (distDiff < effectRadius) {
            // 威圧感：根性と瞬発力を一時的に下げる
            other.currentSpeed *= 0.98; // 少し足が鈍る
          }
        }
      });
    }

    if (h.currentDistance >= race.distance || isNaN(h.currentDistance)) {
      // Interpolate exact finish time
      const prevDistance = h.currentDistance - (currentSpeed * stepTime);
      const distanceNeeded = race.distance - prevDistance;
      const fractionOfStep = distanceNeeded / (currentSpeed * stepTime || 1);
      h.finishTime = (globalTime - stepTime) + (fractionOfStep * stepTime);
      
      h.currentDistance = race.distance;
      h.finished = true;
      
      // Final snapshot at goal
      h.progress.push({
        distance: h.currentDistance,
        speed: 0,
        staminaLeft: Math.max(0, h.stamina),
        x: 1000,
        y: 100 + (h.lane * 40),
        lane: h.lane
      });
    }

    // Snapshot
    if (globalTime >= h.progress.length * timeInterval) {
      h.progress.push({
        distance: h.currentDistance,
        speed: currentSpeed,
        staminaLeft: Math.max(0, h.stamina),
        x: (h.currentDistance / race.distance) * 1000,
        y: 100 + (h.lane * 40),
        lane: h.lane
      });
    }
    });
  }

  // Force finish any horses stuck
  horseStates.forEach(h => {
    if (!h.finished) {
      h.finished = true;
      h.finishTime = globalTime;
      h.currentDistance = race.distance;
    }
  });

  const finalResults = horseStates.map((h, idx) => ({
    horseId: h.horse.id,
    name: h.horse.name,
    strategy: h.horse.strategy,
    time: h.finishTime,
    position: 0,
    logs: h.logs,
    buffs: h.activeBuffs,
    progress: h.progress,
    rating: ratings[idx],
    prediction: predictions[idx]
  }));

  finalResults.sort((a, b) => a.time - b.time);
  finalResults.forEach((res, index) => {
    res.position = index + 1;
  });

  // Generate Commentary
  const maxProgressLength = Math.max(...horseStates.map(h => h.progress.length));
  for (let step = 0; step < maxProgressLength; step++) {
    const stage = step / maxProgressLength;
    let commentary = "";

    // Sort horses by distance at this step
    const sortedAtStep = [...horseStates].sort((a, b) => {
      const distA = a.progress[step]?.distance || a.currentDistance;
      const distB = b.progress[step]?.distance || b.currentDistance;
      return distB - distA;
    });

    const leader = sortedAtStep[0];
    const second = sortedAtStep[1];
    const third = sortedAtStep[2];

    if (step === 0) {
      commentary = race.grade === 'G-ultra' ? "全宇宙が注目する伝説のレース、宇宙創世杯が今、幕を開けます！" : "各馬、一斉にスタートしました！きれいなスタートです。";
    } else if (step === Math.floor(maxProgressLength * 0.1)) {
      if (leader.horse.traits?.includes('大逃げ')) {
        commentary = `${leader.horse.name}が猛烈な勢いでハナを切る！大逃げの構えだ！`;
      } else {
        commentary = `${leader.horse.name}がハナを切りました。${second.horse.name}がそれに続きます。`;
      }
    } else if (step === Math.floor(maxProgressLength * 0.25)) {
      if (leader.horse.traits?.includes('大逃げ')) {
        commentary = `${leader.horse.name}が後続を大きく引き離す！これはとんでもない大逃げだ！`;
      } else {
        commentary = "第2コーナーを回って向こう正面。隊列は縦長になってきました。";
      }
    } else if (step === Math.floor(maxProgressLength * 0.4)) {
      commentary = `依然として${leader.horse.name}が先頭。2番手には${second.horse.name}。`;
    } else if (step === Math.floor(maxProgressLength * 0.55)) {
      commentary = "さあ、第3コーナー！後方の各馬も一気に差を詰めてくる！";
    } else if (step === Math.floor(maxProgressLength * 0.7)) {
      commentary = "第4コーナーをカーブして直線！さあ、ここからが勝負だ！";
    } else if (step === Math.floor(maxProgressLength * 0.8)) {
      const stayHorse = sortedAtStep.find(h => h.horse.strategy === 'stay');
      if (stayHorse && sortedAtStep.indexOf(stayHorse) < 5) {
        commentary = `外から一気に${stayHorse.horse.name}が飛んできた！凄まじい追い込みだ！`;
      } else {
        commentary = `残り400m！${leader.horse.name}がまだ粘っている！外から${second.horse.name}！`;
      }
    } else if (step === Math.floor(maxProgressLength * 0.9)) {
      commentary = `残り200m！${leader.horse.name}か！？${second.horse.name}か！？${third ? third.horse.name + 'も突っ込んできた！' : ''}`;
    } else if (step === maxProgressLength - 5) {
      commentary = "最後の叩き合い！栄冠は誰の手に！？";
    }

    if (commentary) {
      // Attach commentary to the leader's progress at this step
      if (leader.progress[step]) {
        leader.progress[step].commentary = commentary;
      }
    }
  }

  return finalResults;
}

export function generateEnemyHorses(count, raceGrade) {
  const enemies = [];
  const gradeFactor = {
    'Newcomer': 250,
    'Maiden': 300,
    'Condition': 400,
    'G3': 500, 
    'G2': 600, 
    'G1': 700,
    'G0': 820,
    'G-ultra': 920 
  }[raceGrade] || 500;

  for (let i = 0; i < count; i++) {
    const isLegendary = raceGrade === 'G-ultra' && i < 5; // Top 5 are legendary
    const bonus = isLegendary ? 100 : 0;
    
    const stats = {
      speed: gradeFactor + bonus + Math.random() * 150,
      stamina: gradeFactor + bonus + Math.random() * 150,
      guts: gradeFactor + bonus + Math.random() * 150,
      temperament: gradeFactor + bonus + Math.random() * 150,
      health: gradeFactor + bonus + Math.random() * 150,
      luck: gradeFactor + bonus + Math.random() * 150,
      explosiveness: gradeFactor + bonus + Math.random() * 150,
    };
    const strategies = ['escape', 'lead', 'insert', 'stay'];
    const strategy = isLegendary ? (i % 4 === 0 ? 'escape' : i % 4 === 1 ? 'stay' : strategies[Math.floor(Math.random() * strategies.length)]) : strategies[Math.floor(Math.random() * strategies.length)];

    const traits = [];
    if (isLegendary) {
      if (strategy === 'escape') traits.push('大逃げ');
      if (strategy === 'stay') traits.push('流星の速さ');
      traits.push('神のオーラ');
    }

    enemies.push({
      id: `enemy-${i}`,
      name: isLegendary ? generateLegendaryName(i) : generateEnemyName(),
      age: 3,
      gender: 'colt',
      color: isLegendary ? '#FFD700' : '#424242', // Gold for legendary
      stats,
      maxStats: stats,
      lineageId: 'balance',
      pedigree: { father: '?', mother: '?', grandFathers: [], grandMothers: [], greatGrandFathers: [] },
      distanceAptitude: [1000, 4000],
      growthType: 'normal',
      strategy,
      trainingFocus: 'speed',
      isRetired: false,
      isGelding: false,
      hasShadowRoll: isLegendary || Math.random() > 0.8,
      isInjured: false,
      winCount: 0,
      totalRaces: 0,
      currentCondition: 100,
      fatigue: 0,
      gradedWins: [],
      explosivePower: isLegendary ? 200 : 100,
      traits
    });
  }
  return enemies;
}

function generateLegendaryName(index) {
  const names = [
    'ジ・アルティメット',
    'ギャラクシー・エンド',
    '創世神',
    'ビッグバン・ゼロ',
    'エターナル・スター'
  ];
  return names[index % names.length];
}

function generateEnemyName() {
  const prefixes = ['サンダー', 'ギャラクシー', 'ミルキー', 'スター', 'コスモ', 'ルナ', 'ソーラー', 'ノヴァ', 'メテオ', 'シリウス', 'ベガ'];
  const suffixes = ['ノヴァ', 'ブレイド', 'ロード', 'キング', 'クイーン', 'オーブ', 'ブレイブ', 'インパクト', 'エース', 'ハート'];
  return prefixes[Math.floor(Math.random() * prefixes.length)] + suffixes[Math.floor(Math.random() * suffixes.length)];
}
