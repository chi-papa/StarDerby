/**
 * Race Commentary Generator logic
 * Generates dynamic, dramatized text commentary based on Speed, Stamina and race situation.
 */

// Helper to get a random item from an array
const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function generateFinishLineCommentary(playerHorse, winnerHorse) {
  if (!playerHorse) return [];

  const pSpeed = playerHorse.stats?.speed || 500;
  const pStamina = playerHorse.stats?.stamina || 500;
  const pName = playerHorse.name;
  const wName = winnerHorse ? winnerHorse.name : "ハナの争い";
  const pos = playerHorse.position;

  // --- Phase 0: Start / Initial Acceleration (0s - 0.8s) ---
  let phase0 = "";
  if (pSpeed >= 750) {
    phase0 = randomChoice([
      `驚異の瞬発力！【${pName}】が一瞬でトップスピードに乗り、異次元の加速を見せる！`,
      `超スピードの奔流！【${pName}】の推進力はすさまじく、ライバルたちを威圧する！`,
      `電光石火のスタートダッシュ！【${pName}】が火の出るような加速で先頭集団を強襲！`
    ]);
  } else if (pSpeed < 500) {
    phase0 = randomChoice([
      `【${pName}】、ジワジワと脚を伸ばす。自慢の持続ペースでじっくりと前を追う展開！`,
      `力強いピッチ走法！【${pName}】は無理のない立ち上がりで後半の決戦に備えます。`,
      `静かなる序盤。【${pName}】はマイペースを守り、牙を研ぐように機を伺っている！`
    ]);
  } else {
    phase0 = randomChoice([
      `鋭い出足！【${pName}】がスムーズにスピードに乗って、絶好のポジショニング！`,
      `各馬一斉にスパート体制！【${pName}】も前を射程圏内に入れ、流れるような走りを見せます。`,
      `スピード十分！【${pName}】の脚さばきは非常に軽快、隊列の中で存在感を発揮しています！`
    ]);
  }

  // --- Phase 1: Mid-race positioning (0.8s - 1.6s) ---
  let phase1 = randomChoice([
    `さあ、勝負どころの第4コーナー！各馬一塊になって火花を散らす大混戦！`,
    `内からいくか、外に膨らむか！意地と執念がぶつかり合う、極限の駆け引き段階！`,
    `前を走る各馬、一歩も譲らない！【${pName}】の鞍上からも激しいアクションが伝わる！`,
    `大歓声の鳴り響く直線入り口！ここから各馬の真の実力が試される！`
  ]);

  if (playerHorse.traits && playerHorse.traits.length > 0) {
    const specialTrait = playerHorse.traits[0];
    phase1 = `ここで【${pName}】の秘められたポテンシャル、特性『${specialTrait}』が牙をむく！場内が大きくどよめく！`;
  }

  // --- Phase 2: Stamina Collapse or Surge (1.6s - 2.4s) ---
  let phase2 = "";
  if (pStamina >= 750) {
    phase2 = randomChoice([
      `ここで豊かなるスタミナが爆発！【${pName}】、限界を超えてなお加速する無限の持続力！`,
      `スタミナの怪物！後続の脚が鈍る中、【${pName}】は衰えを知らぬピッチで力強く坂を駆け上がる！`,
      `心肺機能に翳りなし！【${pName}】の重厚な粘り腰が、ライバルたちの追従を許さない！`
    ]);
  } else if (pStamina < 500) {
    phase2 = randomChoice([
      `残り100m！スタミナが底を突きかけて、限界の苦悶！【${pName}】の脚が重く、足元がもつれ始めるか！？`,
      `過酷なラストスパート！極限まで削られたスタミナ、あとは気力と闘志だけで突き進む！`,
      `スタミナ切れの死闘！【${pName}】、消耗した体に鞭を打ち、執念の走りで応えている！`
    ]);
  } else {
    phase2 = randomChoice([
      `最後の試練！【${pName}】、磨いた根性で一歩、また一歩とゴールへ足を伸ばす！`,
      `スタミナとスピードの完璧な調和！【${pName}】、バランスの良い走りでライバルと競走！`,
      `激しいせめぎ合い！スタミナの減る極限状態で、お互いの闘魂がぶつかり合う！`
    ]);
  }

  // --- Phase 3: The Climax Finish (2.4s+) ---
  let phase3 = "";
  if (pos === 1) {
    phase3 = `【${pName}】が先頭で突き抜けた！栄光のゴールイン！見事たる勝利、伝説の血統がここに証明された！`;
  } else if (pos === 2) {
    phase3 = `あと一歩届かない！【${pName}】、執念で追い詰めるも惜しくも2着！しかし価値ある銀の星！`;
  } else if (pos <= 5) {
    phase3 = `意地の走りを見せた！【${pName}】が${pos}着で滑り込む！次戦に繋がる見事な激走です！`;
  } else {
    phase3 = `ゴールイン！【${pName}】は無念の${pos}着！スタミナとスピードを見直し、更なる強化をして再挑戦だ！`;
  }

  return [phase0, phase1, phase2, phase3];
}
