import { STALLIONS } from '../constants/gameData.js';

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

const formatMoney = (amount) => `¥${(amount / 10000).toLocaleString()}万`;

export async function getBreedingAdvice(
  gameState,
  selectedMare,
  selectedStallion,
  userMessage
) {
  let message = '';
  let suggestedMareIds = [];
  let suggestedStallionIds = [];
  let action = 'none';

  const userQuery = (userMessage || '').toLowerCase();

  if (!selectedMare) {
    // Stage 1: Tell user to select a mare first
    suggestedMareIds = gameState.mares.slice(0, 3).map(m => m.id);
    message = `フッ、我が友よ。配合の神秘に挑むなら、まずは主軸となる「繁殖牝馬」を選ぶことだ。
あなたの牧場には、${gameState.mares.slice(0, 3).map(m => m.name).join('や')}といった、輝かしい血を秘めた牝馬たちが在籍している。
まずは彼女たちの中から、ベースとなる一頭を決めてくれ。`;
    action = 'select_mare';
  } else if (selectedMare && !selectedStallion) {
    // Stage 2: Mare selected, advise on Stallion selection
    action = 'select_stallion';
    
    // Pick stallions based on mare characteristics
    const isSpeedLine = selectedMare.lineageId === 'speed';
    const isStaminaLine = selectedMare.lineageId === 'stamina';

    let list = [];
    if (isSpeedLine) {
      list = STALLIONS.filter(s => s.lineageId === 'speed' || s.explosivePower > 100).slice(0, 3);
    } else if (isStaminaLine) {
      list = STALLIONS.filter(s => s.lineageId === 'stamina' || s.lineageId === 'balance').slice(0, 3);
    } else {
      list = STALLIONS.slice(0, 3);
    }
    suggestedStallionIds = list.map(s => s.id);

    const matchNames = list.map(s => `「${s.name}」`).join('や');
    message = `フフ、選んだのは「${selectedMare.name}」か！ 溢れるスピードと気品が同居した素晴らしい牝馬だ。
彼女の系統特徴である「${selectedMare.lineageId === 'speed' ? '異次元のスピード' : selectedMare.lineageId === 'stamina' ? '不屈のスタミナ底力' : '万華鏡のごとき調和'}」を活かすなら、
現在の一押し種牡馬は ${matchNames} だ。配合して、新たな超新星を覚醒させるとしようか。`;
  } else {
    // Stage 3: Both selected
    action = 'confirm_breeding';
    
    const stallionAncestors = [selectedStallion.name, selectedStallion.pedigree.father, selectedStallion.pedigree.mother, ...selectedStallion.pedigree.grandFathers, ...selectedStallion.pedigree.grandMothers];
    const mareAncestors = [selectedMare.name, selectedMare.pedigree.father, selectedMare.pedigree.mother, ...selectedMare.pedigree.grandFathers, ...selectedMare.pedigree.grandMothers];
    
    const stallionChars = new Set(stallionAncestors.join('').split(''));
    const mareChars = new Set(mareAncestors.join('').split(''));
    
    const inbreedingChars = [];
    stallionChars.forEach(char => {
      if (char !== '?' && mareChars.has(char)) {
        inbreedingChars.push(char);
      }
    });

    const stallionNameChars = new Set(selectedStallion.name.split(''));
    const mareNameChars = new Set(selectedMare.name.split(''));
    let diffCount = 0;
    stallionNameChars.forEach(c => { if (!mareNameChars.has(c)) diffCount++; });
    mareNameChars.forEach(c => { if (!stallionNameChars.has(c)) diffCount++; });
    const isNick = diffCount >= 3;

    message = `素晴らしい決断だ！「${selectedMare.name}」と「${selectedStallion.name}」の配合に挑むのだな！
ターフを流星の速さで駆け抜け、歴史に名を刻む素質をひしひしと感じるぞ！\n\n`;

    if (inbreedingChars.length > 0) {
      const matchVowels = inbreedingChars.map(c => {
        const t = getVowelType(c);
        if (t === 'speed') return '爆発的スピード';
        if (t === 'stamina') return '無尽蔵のスタミナ';
        if (t === 'guts') return '不屈の闘志';
        return '未知の才';
      });
      message += `血統を調べたところ、共通の因子「${inbreedingChars.join('、')}」のクロス（インブリード）が確認された。これらが${Array.from(new Set(matchVowels)).join('・')}を大きく底上げ、限界を超えたスピードとなって引き継がれる可能性を秘めている。\n\n`;
    }

    if (isNick) {
      message += `さらに、名前の響きが交差する「極上のニックス」相性が見て取れる。異なる個性が奇跡的に反発・調和し合い、爆発力をさらなる高みへ引き上げるだろう。\n\n`;
    } else {
      message += `同調性が高く、健康で丈夫、かつ安定したステータス継承が望める組み合わせだ。安定したトレーニング成果が約束されたかのような安心感がある。\n\n`;
    }

    if (selectedStallion.explosivePower >= 120) {
      message += `種牡馬が誇る「爆発力：${selectedStallion.explosivePower}」が重なることで、とてつもない伝説級の一頭を引き当てる道が開かれている。さあ、この配合で未来への扉を開け！`;
    } else {
      message += `種付料は${formatMoney(selectedStallion.price || selectedStallion.fee || 0)}だが、将来のG1栄冠への投資としては文句なしだ。さあ、共に伝説を作ろう！`;
    }
  }

  // Support responsive search keywords if the user queries things
  if (userQuery.includes('おすすめ') || userQuery.includes('お勧め') || userQuery.includes('おすずめ')) {
    if (selectedMare) {
      message = `フッフッフ、おすすめ配合を求めているな。
私の見立てでは、繁殖牝馬「${selectedMare.name}」には、
スピードに特化させた「アルタイルダッシュ」や、勝負根性に秀でた「アンタレスフレイム」が相性抜群だ。
インブリードとニックスが引き起こすケミストリーを信じるのだ！`;
    } else {
      message = `まずは繁殖牝馬（お母さん馬）を選んでほしい。そこから極上の相性を持つパートナーを推薦しよう。`;
    }
  }

  return {
    message,
    suggestedMareIds,
    suggestedStallionIds,
    action
  };
}
