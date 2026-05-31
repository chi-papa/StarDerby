export function calculateGrowth(horse) {
  const { age, growthType, stats, maxStats } = horse;
  const newStats = { ...stats };

  // Growth rates based on age and type
  let growthFactor = 0;
  
  // 成長タイプによるピークの定義
  const peakAges = {
    early: [2, 3],
    normal: [3, 4, 5],
    late: [5, 6, 7, 8]
  };

  const isPeak = peakAges[growthType].includes(age);
  
  if (growthType === 'early') {
    if (age <= 3) growthFactor = 0.08; // 爆発的な成長
    else if (age === 4) growthFactor = 0.02; 
    else if (age >= 6) growthFactor = -0.05; // 急激な衰退
  } else if (growthType === 'normal') {
    if (age <= 2) growthFactor = 0.03;
    else if (age <= 5) growthFactor = 0.06; // 安定した成長
    else if (age >= 8) growthFactor = -0.03; 
  } else if (growthType === 'late') {
    if (age <= 4) growthFactor = 0.02; // ゆっくり
    else if (age <= 8) growthFactor = 0.05; // 長い全盛期
    else if (age >= 11) growthFactor = -0.02; 
  }

  // ピーク時はさらにボーナス
  if (isPeak) growthFactor *= 1.2;

  // Apply growth/decline to main stats
  if (growthFactor !== 0) {
    const ms = maxStats || stats;
    newStats.speed = Math.max(50, Math.min(ms.speed || 500, Math.floor((newStats.speed || 300) + (ms.speed || 500) * growthFactor)));
    newStats.stamina = Math.max(50, Math.min(ms.stamina || 500, Math.floor((newStats.stamina || 300) + (ms.stamina || 500) * growthFactor)));
    newStats.guts = Math.max(50, Math.min(ms.guts || 500, Math.floor((newStats.guts || 300) + (ms.guts || 500) * growthFactor)));
  }

  return newStats;
}

/**
 * Returns a description of the horse's current physical state.
 */
export function getPhysicalState(horse) {
  const { age, growthType } = horse;
  
  if (growthType === 'early') {
    if (age <= 1) return '幼駒';
    if (age <= 3) return '成長期 (早熟)';
    if (age === 4) return '全盛期 (早熟)';
    return '衰退期 (早熟)';
  } else if (growthType === 'normal') {
    if (age <= 1) return '幼駒';
    if (age <= 2) return '成長期 (普通)';
    if (age <= 5) return '全盛期 (普通)';
    return '衰退期 (普通)';
  } else {
    if (age <= 1) return '幼駒';
    if (age <= 4) return '成長期 (晩成)';
    if (age <= 8) return '全盛期 (晩成)';
    return '衰退期 (晩成)';
  }
}
