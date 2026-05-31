
export const LINEAGES = [
  { id: 'speed', name: 'スピード系', description: '爆発的な速さを誇る系統' },
  { id: 'stamina', name: 'スタミナ系', description: '無尽蔵の体力を誇る系統' },
  { id: 'guts', name: '根性系', description: '勝負所での粘り強さが売りの系統' },
  { id: 'balance', name: 'バランス系', description: '欠点のない万能な系統' },
];

export const STALLIONS = [
  {
    id: 's1',
    name: 'シリウスオーブ',
    lineageId: 'speed',
    price: 5000000,
    stats: { speed: 850, stamina: 600, guts: 700, temperament: 650, health: 700, luck: 600, explosiveness: 750 },
    explosivePower: 80,
    distanceAptitude: [1200, 1600],
    growthType: 'early',
    strategy: 'escape',
    pedigree: {
      father: 'サンダーノヴァ',
      mother: 'スターライト',
      grandFathers: ['ボルト', 'ルナ'],
      grandMothers: ['フラッシュ', 'ステラ'],
      greatGrandFathers: ['ライトニング', 'サンダー', 'ムーン', 'サン']
    }
  },
  {
    id: 's2',
    name: 'ベテルギウスキング',
    lineageId: 'stamina',
    price: 8000000,
    stats: { speed: 700, stamina: 900, guts: 800, temperament: 750, health: 600, luck: 700, explosiveness: 450 },
    explosivePower: 50,
    distanceAptitude: [2000, 3200],
    growthType: 'late',
    strategy: 'stay',
    pedigree: {
      father: 'オリオン',
      mother: 'アース',
      grandFathers: ['マーズ', 'ヴィーナス'],
      grandMothers: ['ジュピター', 'サターン'],
      greatGrandFathers: ['ネプチューン', 'プルート', 'ウラヌス', 'マーキュリー']
    }
  },
  {
    id: 's3',
    name: 'リゲルブレイブ',
    lineageId: 'guts',
    price: 3000000,
    stats: { speed: 750, stamina: 750, guts: 900, temperament: 500, health: 800, luck: 500, explosiveness: 650 },
    explosivePower: 60,
    distanceAptitude: [1600, 2400],
    growthType: 'normal',
    strategy: 'insert',
    pedigree: {
      father: 'レオ',
      mother: 'ライラ',
      grandFathers: ['ドラコ', 'シグナス'],
      grandMothers: ['ベガ', 'カペラ'],
      greatGrandFathers: ['アンタレス', 'ポルックス', 'カストル', 'プロキオン']
    }
  },
  {
    id: 's4',
    name: 'アルタイルダッシュ',
    lineageId: 'speed',
    price: 12000000,
    stats: { speed: 950, stamina: 550, guts: 650, temperament: 600, health: 500, luck: 850, explosiveness: 980 },
    explosivePower: 120,
    distanceAptitude: [1000, 1400],
    growthType: 'early',
    strategy: 'escape',
    pedigree: {
      father: 'ライトニング',
      mother: 'ソニック',
      grandFathers: ['ボルト', 'フラッシュ'],
      grandMothers: ['サンダー', 'ストーム'],
      greatGrandFathers: ['ゼウス', 'ヘラ', 'ポセイドン', 'アテナ']
    }
  },
  {
    id: 's5',
    name: 'デネブロード',
    lineageId: 'balance',
    price: 6000000,
    stats: { speed: 800, stamina: 800, guts: 800, temperament: 850, health: 750, luck: 750, explosiveness: 700 },
    explosivePower: 70,
    distanceAptitude: [1600, 2400],
    growthType: 'normal',
    strategy: 'lead',
    pedigree: {
      father: 'コスモス',
      mother: 'ユニバース',
      grandFathers: ['パルサー', 'クエーサー'],
      grandMothers: ['オーロラ', 'コメット'],
      greatGrandFathers: ['ノヴァ', 'スーパーノヴァ', 'ブラックホール', 'ビッグバン']
    }
  },
  {
    id: 's6',
    name: 'アンタレスフレイム',
    lineageId: 'guts',
    price: 15000000,
    stats: { speed: 850, stamina: 850, guts: 980, temperament: 400, health: 650, luck: 900, explosiveness: 800 },
    explosivePower: 150,
    distanceAptitude: [1800, 2600],
    growthType: 'late',
    strategy: 'stay',
    pedigree: {
      father: 'スコーピオン',
      mother: 'マグマ',
      grandFathers: ['マーズ', 'ドラコ'],
      grandMothers: ['ベガ', 'ルナ'],
      greatGrandFathers: ['アンタレス', 'ポルックス', 'カストル', 'プロキオン']
    }
  },
  {
    id: 's7',
    name: 'プロキオンエース',
    lineageId: 'speed',
    price: 4500000,
    stats: { speed: 820, stamina: 650, guts: 720, temperament: 700, health: 850, luck: 550, explosiveness: 720 },
    explosivePower: 65,
    distanceAptitude: [1200, 1800],
    growthType: 'normal',
    strategy: 'lead',
    pedigree: {
      father: 'シリウス',
      mother: 'カペラ',
      grandFathers: ['ボルト', 'シグナス'],
      grandMothers: ['ステラ', 'ベガ'],
      greatGrandFathers: ['ライトニング', 'サンダー', 'ムーン', 'サン']
    }
  },
  {
    id: 's8',
    name: 'カノープススピリット',
    lineageId: 'stamina',
    price: 20000000,
    stats: { speed: 750, stamina: 980, guts: 900, temperament: 900, health: 700, luck: 950, explosiveness: 550 },
    explosivePower: 130,
    distanceAptitude: [2400, 3600],
    growthType: 'late',
    strategy: 'stay',
    pedigree: {
      father: 'ガイア',
      mother: 'テラ',
      grandFathers: ['オリオン', 'ジュピター'],
      grandMothers: ['アース', 'サターン'],
      greatGrandFathers: ['ネプチューン', 'プルート', 'ウラヌス', 'マーキュリー']
    }
  },
  {
    id: 's9',
    name: 'スピカハート',
    lineageId: 'balance',
    price: 2500000,
    stats: { speed: 720, stamina: 720, guts: 720, temperament: 950, health: 900, luck: 800, explosiveness: 620 },
    explosivePower: 40,
    distanceAptitude: [1400, 2200],
    growthType: 'normal',
    strategy: 'insert',
    pedigree: {
      father: 'ヴィーナス',
      mother: 'マーキュリー',
      grandFathers: ['サン', 'ムーン'],
      grandMothers: ['ステラ', 'ルナ'],
      greatGrandFathers: ['ノヴァ', 'スーパーノヴァ', 'ブラックホール', 'ビッグバン']
    }
  },
  {
    id: 's10',
    name: 'レグルスソウル',
    lineageId: 'guts',
    price: 9000000,
    stats: { speed: 780, stamina: 820, guts: 920, temperament: 600, health: 750, luck: 700, explosiveness: 780 },
    explosivePower: 90,
    distanceAptitude: [2000, 3000],
    growthType: 'normal',
    strategy: 'insert',
    pedigree: {
      father: 'レオ',
      mother: 'ライオン',
      grandFathers: ['ドラコ', 'マーズ'],
      grandMothers: ['ベガ', 'サターン'],
      greatGrandFathers: ['アンタレス', 'ポルックス', 'カストル', 'プロキオン']
    }
  },
  {
    id: 's11',
    name: 'カペラライト',
    lineageId: 'speed',
    price: 3500000,
    stats: { speed: 880, stamina: 550, guts: 650, temperament: 700, health: 600, luck: 650, explosiveness: 920 },
    explosivePower: 110,
    distanceAptitude: [1000, 1400],
    growthType: 'early',
    strategy: 'escape',
    pedigree: {
      father: 'ライトニング',
      mother: 'スター',
      grandFathers: ['ボルト', 'ルナ'],
      grandMothers: ['フラッシュ', 'ステラ'],
      greatGrandFathers: ['ゼウス', 'ヘラ', 'ポセイドン', 'アテナ']
    }
  },
  {
    id: 's12',
    name: 'アルデバランレッド',
    lineageId: 'guts',
    price: 7500000,
    stats: { speed: 750, stamina: 850, guts: 950, temperament: 550, health: 700, luck: 600, explosiveness: 850 },
    explosivePower: 85,
    distanceAptitude: [1800, 2400],
    growthType: 'normal',
    strategy: 'lead',
    pedigree: {
      father: 'マーズ',
      mother: 'フレイム',
      grandFathers: ['ドラコ', 'レオ'],
      grandMothers: ['ベガ', 'ライラ'],
      greatGrandFathers: ['アンタレス', 'ポルックス', 'カストル', 'プロキオン']
    }
  },
  {
    id: 's13',
    name: 'ポルックスブルー',
    lineageId: 'balance',
    price: 4000000,
    stats: { speed: 780, stamina: 780, guts: 780, temperament: 800, health: 800, luck: 780, explosiveness: 780 },
    explosivePower: 75,
    distanceAptitude: [1600, 2200],
    growthType: 'normal',
    strategy: 'insert',
    pedigree: {
      father: 'カストル',
      mother: 'ジェミニ',
      grandFathers: ['パルサー', 'クエーサー'],
      grandMothers: ['オーロラ', 'コメット'],
      greatGrandFathers: ['ノヴァ', 'スーパーノヴァ', 'ブラックホール', 'ビッグバン']
    }
  },
  {
    id: 's14',
    name: 'アークトゥルス',
    lineageId: 'stamina',
    price: 15000000,
    stats: { speed: 720, stamina: 950, guts: 850, temperament: 850, health: 650, luck: 800, explosiveness: 520 },
    explosivePower: 140,
    distanceAptitude: [2400, 3200],
    growthType: 'late',
    strategy: 'stay',
    pedigree: {
      father: 'オリオン',
      mother: 'ベガ',
      grandFathers: ['マーズ', 'ヴィーナス'],
      grandMothers: ['ジュピター', 'サターン'],
      greatGrandFathers: ['ネプチューン', 'プルート', 'ウラヌス', 'マーキュリー']
    }
  },
  {
    id: 's15',
    name: 'フォーマルハウト',
    lineageId: 'speed',
    price: 11000000,
    stats: { speed: 920, stamina: 600, guts: 700, temperament: 650, health: 550, luck: 900, explosiveness: 950 },
    explosivePower: 125,
    distanceAptitude: [1200, 1600],
    growthType: 'early',
    strategy: 'escape',
    pedigree: {
      father: 'シリウス',
      mother: 'アクア',
      grandFathers: ['ボルト', 'ネプチューン'],
      grandMothers: ['ステラ', 'マーメイド'],
      greatGrandFathers: ['ライトニング', 'サンダー', 'ムーン', 'サン']
    }
  },
  {
    id: 's16',
    name: '流星王',
    lineageId: 'speed',
    price: 30000000,
    stats: { speed: 980, stamina: 700, guts: 850, temperament: 600, health: 600, luck: 950, explosiveness: 1000 },
    explosivePower: 200,
    distanceAptitude: [1000, 2000],
    growthType: 'early',
    strategy: 'escape',
    traits: ['大逃げ', '流星の速さ'],
    pedigree: {
      father: 'メテオ',
      mother: 'スター',
      grandFathers: ['サンダー', 'ルナ'],
      grandMothers: ['ノヴァ', 'オーロラ'],
      greatGrandFathers: ['シリウス', 'ベガ', 'アルタイル', 'リゲル']
    }
  },
  {
    id: 's17',
    name: '神龍帝',
    lineageId: 'guts',
    price: 50000000,
    stats: { speed: 850, stamina: 950, guts: 1000, temperament: 400, health: 800, luck: 990, explosiveness: 900 },
    explosivePower: 250,
    distanceAptitude: [2000, 3600],
    growthType: 'late',
    strategy: 'stay',
    traits: ['神のオーラ', '不屈'],
    pedigree: {
      father: 'ドラゴン',
      mother: 'エンプレス',
      grandFathers: ['ゴッド', 'キング'],
      grandMothers: ['クイーン', 'プリンセス'],
      greatGrandFathers: ['カイザー', 'レジェンド', 'ミシック', 'アーク']
    }
  },
  {
    id: 's18',
    name: 'ベガスター',
    lineageId: 'speed',
    price: 18000000,
    stats: { speed: 940, stamina: 650, guts: 750, temperament: 700, health: 600, luck: 850, explosiveness: 940 },
    explosivePower: 115,
    distanceAptitude: [1200, 1800],
    growthType: 'early',
    strategy: 'escape',
    pedigree: {
      father: 'リラ',
      mother: 'スターライト',
      grandFathers: ['ボルト', 'ルナ'],
      grandMothers: ['フラッシュ', 'ステラ'],
      greatGrandFathers: ['ライトニング', 'サンダー', 'ムーン', 'サン']
    }
  },
  {
    id: 's19',
    name: 'ポラリスノース',
    lineageId: 'stamina',
    price: 12000000,
    stats: { speed: 700, stamina: 960, guts: 850, temperament: 800, health: 900, luck: 750, explosiveness: 480 },
    explosivePower: 135,
    distanceAptitude: [2400, 3600],
    growthType: 'late',
    strategy: 'stay',
    pedigree: {
      father: 'ベア',
      mother: 'オーロラ',
      grandFathers: ['マーズ', 'ジュピター'],
      grandMothers: ['サターン', 'ネプチューン'],
      greatGrandFathers: ['プルート', 'ウラヌス', 'マーキュリー', 'アース']
    }
  },
  {
    id: 's20',
    name: 'カストルツイン',
    lineageId: 'balance',
    price: 8500000,
    stats: { speed: 820, stamina: 820, guts: 820, temperament: 820, health: 820, luck: 820, explosiveness: 820 },
    explosivePower: 82,
    distanceAptitude: [1600, 2400],
    growthType: 'normal',
    strategy: 'lead',
    pedigree: {
      father: 'ジェミニ',
      mother: 'ポルックス',
      grandFathers: ['パルサー', 'クエーサー'],
      grandMothers: ['オーロラ', 'コメット'],
      greatGrandFathers: ['ノヴァ', 'スーパーノヴァ', 'ブラックホール', 'ビッグバン']
    }
  },
  {
    id: 's21',
    name: 'カノープスロード',
    lineageId: 'stamina',
    price: 10000000,
    stats: { speed: 720, stamina: 950, guts: 800, temperament: 800, health: 750, luck: 700, explosiveness: 500 },
    explosivePower: 95,
    distanceAptitude: [2200, 3600],
    growthType: 'late',
    strategy: 'stay',
    pedigree: {
      father: 'カノープス',
      mother: 'ロード',
      grandFathers: ['スター', 'ムーン'],
      grandMothers: ['サン', 'アース'],
      greatGrandFathers: ['ライトニング', 'サンダー', 'ボルト', 'フラッシュ']
    }
  },
  {
    id: 's22',
    name: 'アケルナルダッシュ',
    lineageId: 'speed',
    price: 6500000,
    stats: { speed: 900, stamina: 600, guts: 650, temperament: 700, health: 600, luck: 750, explosiveness: 900 },
    explosivePower: 105,
    distanceAptitude: [1000, 1600],
    growthType: 'early',
    strategy: 'escape',
    pedigree: {
      father: 'アケルナル',
      mother: 'ダッシュ',
      grandFathers: ['ソニック', 'ライト'],
      grandMothers: ['スピード', 'クイック'],
      greatGrandFathers: ['ファスト', 'ラピッド', 'ハリケーン', 'ストーム']
    }
  },
  {
    id: 's23',
    name: 'ハダルブレイブ',
    lineageId: 'guts',
    price: 5500000,
    stats: { speed: 780, stamina: 780, guts: 920, temperament: 600, health: 850, luck: 600, explosiveness: 720 },
    explosivePower: 88,
    distanceAptitude: [1600, 2400],
    growthType: 'normal',
    strategy: 'insert',
    pedigree: {
      father: 'ハダル',
      mother: 'ブレイブ',
      grandFathers: ['アイアン', 'スチール'],
      grandMothers: ['ロック', 'ストーン'],
      greatGrandFathers: ['マウンテン', 'ヒル', 'バレー', 'リバー']
    }
  },
  {
    id: 's24',
    name: 'アクルックスキング',
    lineageId: 'balance',
    price: 12000000,
    stats: { speed: 850, stamina: 850, guts: 850, temperament: 850, health: 800, luck: 800, explosiveness: 850 },
    explosivePower: 112,
    distanceAptitude: [1800, 2800],
    growthType: 'normal',
    strategy: 'lead',
    pedigree: {
      father: 'アクルックス',
      mother: 'キング',
      grandFathers: ['ロイヤル', 'ノーブル'],
      grandMothers: ['クイーン', 'プリンセス'],
      greatGrandFathers: ['エンペラー', 'カイザー', 'デューク', 'バロン']
    }
  },
  {
    id: 's25',
    name: 'ミモザハート',
    lineageId: 'balance',
    price: 3500000,
    stats: { speed: 750, stamina: 750, guts: 750, temperament: 900, health: 700, luck: 850, explosiveness: 680 },
    explosivePower: 78,
    distanceAptitude: [1400, 2000],
    growthType: 'normal',
    strategy: 'insert',
    pedigree: {
      father: 'ミモザ',
      mother: 'ハート',
      grandFathers: ['ラブ', 'ピース'],
      grandMothers: ['ジョイ', 'ハッピー'],
      greatGrandFathers: ['スマイル', 'ラフ', 'ドリーム', 'ホープ']
    }
  },
  {
    id: 's26',
    name: 'アルデバランボルト',
    lineageId: 'speed',
    price: 9000000,
    stats: { speed: 920, stamina: 600, guts: 650, temperament: 600, health: 600, luck: 800, explosiveness: 920 },
    explosivePower: 118,
    distanceAptitude: [1000, 1600],
    growthType: 'early',
    strategy: 'escape',
    pedigree: {
      father: 'ライトニング',
      mother: 'フラッシュ',
      grandFathers: ['サンダー', 'ボルト'],
      grandMothers: ['ストーム', 'ウィンド'],
      greatGrandFathers: ['ゼウス', 'ポセイドン', 'ハデス', 'アポロン']
    }
  },
  {
    id: 's27',
    name: 'ポルックスインパクト',
    lineageId: 'guts',
    price: 11000000,
    stats: { speed: 800, stamina: 800, guts: 950, temperament: 500, health: 700, luck: 700, explosiveness: 800 },
    explosivePower: 122,
    distanceAptitude: [1600, 2400],
    growthType: 'normal',
    strategy: 'stay',
    pedigree: {
      father: 'カストル',
      mother: 'ジェミニ',
      grandFathers: ['ポルックス', 'ヘラクレス'],
      grandMothers: ['レダ', 'ヘレネ'],
      greatGrandFathers: ['アトラス', 'プロメテウス', 'エピメテウス', 'パンドラ']
    }
  },
  {
    id: 's28',
    name: 'オリオンベルト',
    lineageId: 'stamina',
    price: 13000000,
    stats: { speed: 720, stamina: 940, guts: 880, temperament: 820, health: 750, luck: 700, explosiveness: 550 },
    explosivePower: 100,
    distanceAptitude: [2400, 3200],
    growthType: 'late',
    strategy: 'stay',
    pedigree: {
      father: 'リゲル',
      mother: 'ベテルギウス',
      grandFathers: ['ベラトリックス', 'サイフ'],
      grandMothers: ['アルニラム', 'ミンタカ'],
      greatGrandFathers: ['アルニタク', 'メイサ', 'ハチサ', 'エンシス']
    }
  },
  {
    id: 's29',
    name: 'カシオペアキング',
    lineageId: 'balance',
    price: 9500000,
    stats: { speed: 840, stamina: 840, guts: 840, temperament: 840, health: 840, luck: 840, explosiveness: 840 },
    explosivePower: 90,
    distanceAptitude: [1600, 2400],
    growthType: 'normal',
    strategy: 'lead',
    pedigree: {
      father: 'シェダル',
      mother: 'カフ',
      grandFathers: ['ツィー', 'ルクバー'],
      grandMothers: ['セギン', 'アキルド'],
      greatGrandFathers: ['カシオペア', 'ケフェウス', 'アンドロメダ', 'ペルセウス']
    }
  },
  {
    id: 's30',
    name: 'ペルセウスブレイド',
    lineageId: 'speed',
    price: 16000000,
    stats: { speed: 960, stamina: 620, guts: 720, temperament: 680, health: 580, luck: 880, explosiveness: 960 },
    explosivePower: 145,
    distanceAptitude: [1200, 1800],
    growthType: 'early',
    strategy: 'escape',
    pedigree: {
      father: 'ミルファク',
      mother: 'アルゴル',
      grandFathers: ['アティク', 'メンキブ'],
      grandMothers: ['ミラム', 'ミサマ'],
      greatGrandFathers: ['ゴルゴネア', 'メドゥーサ', 'ペガサス', 'アンドロメダ']
    }
  }
];

export const INITIAL_MARES = [
  {
    id: 'm1',
    name: 'コスモクイーン',
    lineageId: 'balance',
    stats: { speed: 650, stamina: 650, guts: 600, temperament: 800, health: 700, luck: 650, explosiveness: 600 },
    pedigree: {
      father: 'ギャラクシー',
      mother: 'ネビュラ',
      grandFathers: ['パルサー', 'クエーサー'],
      grandMothers: ['オーロラ', 'コメット'],
      greatGrandFathers: ['ノヴァ', 'スーパーノヴァ', 'ブラックホール', 'ビッグバン']
    }
  },
  {
    id: 'm2',
    name: 'ステラミューズ',
    lineageId: 'speed',
    stats: { speed: 750, stamina: 500, guts: 550, temperament: 700, health: 600, luck: 750, explosiveness: 850 },
    pedigree: {
      father: 'ボルト',
      mother: 'フラッシュ',
      grandFathers: ['ライトニング', 'サンダー'],
      grandMothers: ['ムーン', 'サン'],
      greatGrandFathers: ['ゼウス', 'ヘラ', 'ポセイドン', 'アテナ']
    }
  },
  {
    id: 'm3',
    name: 'ルナセレニティ',
    lineageId: 'stamina',
    stats: { speed: 550, stamina: 780, guts: 700, temperament: 850, health: 800, luck: 600, explosiveness: 450 },
    pedigree: {
      father: 'マーズ',
      mother: 'ヴィーナス',
      grandFathers: ['ジュピター', 'サターン'],
      grandMothers: ['ネプチューン', 'プルート'],
      greatGrandFathers: ['ウラヌス', 'マーキュリー', 'アース', 'ガイア']
    }
  },
  {
    id: 'm4',
    name: 'ネビュラミスト',
    lineageId: 'guts',
    stats: { speed: 600, stamina: 600, guts: 820, temperament: 550, health: 750, luck: 500, explosiveness: 700 },
    pedigree: {
      father: 'ドラコ',
      mother: 'シグナス',
      grandFathers: ['ベガ', 'カペラ'],
      grandMothers: ['アンタレス', 'ポルックス'],
      greatGrandFathers: ['カストル', 'プロキオン', 'レオ', 'ライラ']
    }
  },
  {
    id: 'm5',
    name: 'オーロラベール',
    lineageId: 'balance',
    stats: { speed: 680, stamina: 680, guts: 680, temperament: 900, health: 850, luck: 850, explosiveness: 650 },
    pedigree: {
      father: 'パルサー',
      mother: 'オーロラ',
      grandFathers: ['クエーサー', 'コメット'],
      grandMothers: ['ノヴァ', 'スーパーノヴァ'],
      greatGrandFathers: ['ブラックホール', 'ビッグバン', 'コスモス', 'ユニバース']
    }
  },
  {
    id: 'm6',
    name: 'ヴィーナスハート',
    lineageId: 'speed',
    stats: { speed: 800, stamina: 550, guts: 600, temperament: 750, health: 650, luck: 800, explosiveness: 900 },
    pedigree: {
      father: 'サン',
      mother: 'ラブ',
      grandFathers: ['ボルト', 'ステラ'],
      grandMothers: ['フラッシュ', 'ルナ'],
      greatGrandFathers: ['ゼウス', 'ヘラ', 'ポセイドン', 'アテナ']
    }
  },
  {
    id: 'm7',
    name: 'マーキュリーミスト',
    lineageId: 'balance',
    stats: { speed: 720, stamina: 720, guts: 720, temperament: 800, health: 800, luck: 750, explosiveness: 720 },
    pedigree: {
      father: 'コメット',
      mother: 'シルバー',
      grandFathers: ['パルサー', 'クエーサー'],
      grandMothers: ['オーロラ', 'ステラ'],
      greatGrandFathers: ['ノヴァ', 'スーパーノヴァ', 'ブラックホール', 'ビッグバン']
    }
  },
  {
    id: 'm8',
    name: 'ジュピターベル',
    lineageId: 'stamina',
    stats: { speed: 600, stamina: 850, guts: 750, temperament: 850, health: 700, luck: 700, explosiveness: 550 },
    pedigree: {
      father: 'サターン',
      mother: 'リング',
      grandFathers: ['マーズ', 'オリオン'],
      grandMothers: ['ヴィーナス', 'アース'],
      greatGrandFathers: ['ネプチューン', 'プルート', 'ウラヌス', 'マーキュリー']
    }
  },
  {
    id: 'm9',
    name: 'サターンリング',
    lineageId: 'guts',
    stats: { speed: 650, stamina: 700, guts: 880, temperament: 600, health: 750, luck: 650, explosiveness: 780 },
    pedigree: {
      father: 'プルート',
      mother: 'ダーク',
      grandFathers: ['ドラコ', 'レオ'],
      grandMothers: ['ベガ', 'ライラ'],
      greatGrandFathers: ['アンタレス', 'ポルックス', 'カストル', 'プロキオン']
    }
  },
  {
    id: 'm10',
    name: 'ネプチューンパール',
    lineageId: 'stamina',
    stats: { speed: 620, stamina: 920, guts: 800, temperament: 900, health: 650, luck: 850, explosiveness: 500 },
    pedigree: {
      father: 'ウラヌス',
      mother: 'オーシャン',
      grandFathers: ['オリオン', 'ジュピター'],
      grandMothers: ['アース', 'サターン'],
      greatGrandFathers: ['ネプチューン', 'プルート', 'ウラヌス', 'マーキュリー']
    }
  },
  {
    id: 'm11',
    name: '流星姫',
    lineageId: 'speed',
    stats: { speed: 900, stamina: 600, guts: 700, temperament: 800, health: 700, luck: 900, explosiveness: 950 },
    traits: ['流星の速さ'],
    pedigree: {
      father: 'スター',
      mother: 'メテオ',
      grandFathers: ['ルナ', 'サンダー'],
      grandMothers: ['オーロラ', 'ノヴァ'],
      greatGrandFathers: ['ベガ', 'シリウス', 'リゲル', 'アルタイル']
    }
  },
  {
    id: 'm12',
    name: '神龍后',
    lineageId: 'guts',
    stats: { speed: 700, stamina: 850, guts: 950, temperament: 500, health: 750, luck: 850, explosiveness: 800 },
    traits: ['神のオーラ'],
    pedigree: {
      father: 'エンペラー',
      mother: 'ドラゴン',
      grandFathers: ['キング', 'ゴッド'],
      grandMothers: ['プリンセス', 'クイーン'],
      greatGrandFathers: ['レジェンド', 'カイザー', 'アーク', 'ミシック']
    }
  },
  {
    id: 'm13',
    name: 'シリウスミスト',
    lineageId: 'speed',
    stats: { speed: 820, stamina: 600, guts: 650, temperament: 700, health: 700, luck: 800, explosiveness: 820 },
    pedigree: {
      father: 'シリウス',
      mother: 'ミスト',
      grandFathers: ['ボルト', 'ルナ'],
      grandMothers: ['フラッシュ', 'ステラ'],
      greatGrandFathers: ['ライトニング', 'サンダー', 'ムーン', 'サン']
    }
  },
  {
    id: 'm14',
    name: 'カペラローズ',
    lineageId: 'balance',
    stats: { speed: 750, stamina: 750, guts: 750, temperament: 850, health: 800, luck: 700, explosiveness: 750 },
    pedigree: {
      father: 'カペラ',
      mother: 'ローズ',
      grandFathers: ['パルサー', 'クエーサー'],
      grandMothers: ['オーロラ', 'コメット'],
      greatGrandFathers: ['ノヴァ', 'スーパーノヴァ', 'ブラックホール', 'ビッグバン']
    }
  },
  {
    id: 'm15',
    name: 'アルタイルスター',
    lineageId: 'speed',
    stats: { speed: 850, stamina: 550, guts: 600, temperament: 700, health: 650, luck: 850, explosiveness: 880 },
    pedigree: {
      father: 'アルタイル',
      mother: 'スター',
      grandFathers: ['スカイ', 'クラウド'],
      grandMothers: ['レイン', 'スノー'],
      greatGrandFathers: ['サン', 'ムーン', 'アース', 'マーズ']
    }
  },
  {
    id: 'm16',
    name: 'ベガライト',
    lineageId: 'balance',
    stats: { speed: 780, stamina: 780, guts: 780, temperament: 850, health: 800, luck: 750, explosiveness: 780 },
    pedigree: {
      father: 'ベガ',
      mother: 'ライト',
      grandFathers: ['シャイン', 'ブライト'],
      grandMothers: ['グロウ', 'スパークル'],
      greatGrandFathers: ['フラッシュ', 'ボルト', 'サンダー', 'ライトニング']
    }
  },
  {
    id: 'm17',
    name: 'ルナエクリプス',
    lineageId: 'stamina',
    stats: { speed: 600, stamina: 850, guts: 750, temperament: 800, health: 800, luck: 700, explosiveness: 520 },
    pedigree: {
      father: 'ムーン',
      mother: 'シャドウ',
      grandFathers: ['ナイト', 'ダーク'],
      grandMothers: ['ライト', 'ブライト'],
      greatGrandFathers: ['サン', 'スター', 'スカイ', 'アース']
    }
  },
  {
    id: 'm18',
    name: 'ヴィーナスチャーム',
    lineageId: 'balance',
    stats: { speed: 720, stamina: 720, guts: 720, temperament: 950, health: 850, luck: 900, explosiveness: 720 },
    pedigree: {
      father: 'アフロディーテ',
      mother: 'ビューティー',
      grandFathers: ['ラブ', 'ハート'],
      grandMothers: ['ローズ', 'リリー'],
      greatGrandFathers: ['キューピッド', 'エロス', 'アポロン', 'ヘルメス']
    }
  },
  {
    id: 'm19',
    name: 'アテナウィズダム',
    lineageId: 'guts',
    stats: { speed: 700, stamina: 700, guts: 900, temperament: 900, health: 800, luck: 800, explosiveness: 700 },
    pedigree: {
      father: 'ゼウス',
      mother: 'メティス',
      grandFathers: ['クロノス', 'オーケアノス'],
      grandMothers: ['レアー', 'テーテュース'],
      greatGrandFathers: ['ウラヌス', 'ガイア', 'ポントス', 'タラッサ']
    }
  },
  {
    id: 'm20',
    name: 'フローラガーデン',
    lineageId: 'balance',
    stats: { speed: 680, stamina: 680, guts: 680, temperament: 850, health: 950, luck: 850, explosiveness: 700 },
    pedigree: {
      father: 'ゼピュロス',
      mother: 'クロリス',
      grandFathers: ['アストライオス', 'オーケアノス'],
      grandMothers: ['エーオース', 'テーテュース'],
      greatGrandFathers: ['クリオス', 'エウリュビアー', 'ヒュペリーオーン', 'テイアー']
    }
  },
  {
    id: 'm21',
    name: 'アイリスレインボー',
    lineageId: 'speed',
    stats: { speed: 880, stamina: 450, guts: 500, temperament: 650, health: 600, luck: 900, explosiveness: 950 },
    pedigree: {
      father: 'プリズム',
      mother: 'カラー',
      grandFathers: ['ライト', 'ダーク'],
      grandMothers: ['レッド', 'ブルー'],
      greatGrandFathers: ['イエロー', 'グリーン', 'オレンジ', 'パープル']
    }
  },
  {
    id: 'm22',
    name: 'セレーネナイト',
    lineageId: 'stamina',
    stats: { speed: 500, stamina: 950, guts: 800, temperament: 750, health: 850, luck: 650, explosiveness: 400 },
    pedigree: {
      father: 'ムーン',
      mother: 'ナイト',
      grandFathers: ['スター', 'スカイ'],
      grandMothers: ['クラウド', 'レイン'],
      greatGrandFathers: ['サン', 'アース', 'マーズ', 'ジュピター']
    }
  },
  {
    id: 'm23',
    name: 'ダイアナハンター',
    lineageId: 'guts',
    stats: { speed: 720, stamina: 720, guts: 980, temperament: 500, health: 900, luck: 600, explosiveness: 750 },
    pedigree: {
      father: 'アポロン',
      mother: 'アルテミス',
      grandFathers: ['ゼウス', 'レト'],
      grandMothers: ['ヘラ', 'デメテル'],
      greatGrandFathers: ['クロノス', 'レアー', 'オーケアノス', 'テーテュース']
    }
  },
  {
    id: 'm24',
    name: 'ミネルヴァシールド',
    lineageId: 'balance',
    stats: { speed: 780, stamina: 780, guts: 780, temperament: 980, health: 950, luck: 800, explosiveness: 600 },
    pedigree: {
      father: 'ジュピター',
      mother: 'メティス',
      grandFathers: ['サターン', 'オプス'],
      grandMothers: ['ヤヌス', 'ヴェスタ'],
      greatGrandFathers: ['カエルス', 'テラ', 'ピクス', 'ファウヌス']
    }
  },
  {
    id: 'm25',
    name: 'フレイヤビューティー',
    lineageId: 'speed',
    stats: { speed: 820, stamina: 600, guts: 650, temperament: 900, health: 700, luck: 980, explosiveness: 880 },
    pedigree: {
      father: 'ニョルズ',
      mother: 'スカジ',
      grandFathers: ['フレイ', 'ゲルズ'],
      grandMothers: ['オーディン', 'フリッグ'],
      greatGrandFathers: ['トール', 'ロキ', 'バルドル', 'ヘイムダル']
    }
  },
  {
    id: 'm26',
    name: 'イシスミラクル',
    lineageId: 'stamina',
    stats: { speed: 650, stamina: 920, guts: 850, temperament: 950, health: 800, luck: 900, explosiveness: 550 },
    pedigree: {
      father: 'オシリス',
      mother: 'ホルス',
      grandFathers: ['ゲブ', 'ヌト'],
      grandMothers: ['シュー', 'テフヌト'],
      greatGrandFathers: ['アトゥム', 'ラー', 'アメン', 'プタハ']
    }
  },
  {
    id: 'm27',
    name: 'ブリュンヒルデ',
    lineageId: 'guts',
    stats: { speed: 750, stamina: 800, guts: 990, temperament: 400, health: 950, luck: 700, explosiveness: 800 },
    pedigree: {
      father: 'ヴォータン',
      mother: 'エルダ',
      grandFathers: ['ジークフリート', 'ジークリンデ'],
      grandMothers: ['グンター', 'グートルーネ'],
      greatGrandFathers: ['ハーゲン', 'アルベリヒ', 'ファフナー', 'ファーゾルト']
    }
  },
  {
    id: 'm28',
    name: 'アマテラスサン',
    lineageId: 'balance',
    stats: { speed: 850, stamina: 850, guts: 850, temperament: 1000, health: 1000, luck: 1000, explosiveness: 900 },
    pedigree: {
      father: 'イザナギ',
      mother: 'イザナミ',
      grandFathers: ['スサノオ', 'ツクヨミ'],
      grandMothers: ['オオクニヌシ', 'コノハナサクヤ'],
      greatGrandFathers: ['ニニギ', 'ホオリ', 'ウガヤフキアエズ', 'ジム']
    }
  },
  {
    id: 'm29',
    name: 'クレオパトラ',
    lineageId: 'speed',
    stats: { speed: 920, stamina: 500, guts: 600, temperament: 850, health: 650, luck: 950, explosiveness: 980 },
    pedigree: {
      father: 'プトレマイオス',
      mother: 'カエサル',
      grandFathers: ['アントニウス', 'オクタウィアヌス'],
      grandMothers: ['ポンペイウス', 'クラッスス'],
      greatGrandFathers: ['スッラ', 'マリウス', 'グラックス', 'スキピオ']
    }
  },
  {
    id: 'm30',
    name: 'ジャンヌダルク',
    lineageId: 'guts',
    stats: { speed: 700, stamina: 850, guts: 1000, temperament: 1000, health: 900, luck: 800, explosiveness: 850 },
    pedigree: {
      father: 'フランス',
      mother: 'オルレアン',
      grandFathers: ['シャルル', 'フィリップ'],
      grandMothers: ['ルイ', 'アンリ'],
      greatGrandFathers: ['フランソワ', 'ナポレオン', 'ラファイエット', 'ドゴール']
    }
  },
  {
    id: 'm31',
    name: 'メデューサ',
    lineageId: 'guts',
    stats: { speed: 600, stamina: 600, guts: 950, temperament: 400, health: 800, luck: 700, explosiveness: 750 },
    pedigree: { father: 'ポセイドン', mother: 'メデューサ', grandFathers: ['フォルキュス', 'ケト'], grandMothers: ['ガイア', 'ポントス'], greatGrandFathers: ['カオス', 'タルタロス', 'エロス', 'エレボス'] }
  },
  {
    id: 'm32',
    name: 'パンドラ',
    lineageId: 'balance',
    stats: { speed: 700, stamina: 700, guts: 700, temperament: 600, health: 700, luck: 300, explosiveness: 700 },
    pedigree: { father: 'ヘパイストス', mother: 'パンドラ', grandFathers: ['ゼウス', 'ヘラ'], grandMothers: ['プロメテウス', 'エピメテウス'], greatGrandFathers: ['イアペトス', 'クリュメネ', 'オーケアノス', 'テーテュース'] }
  },
  {
    id: 'm33',
    name: 'ヘレネ',
    lineageId: 'speed',
    stats: { speed: 850, stamina: 500, guts: 500, temperament: 800, health: 600, luck: 900, explosiveness: 900 },
    pedigree: { father: 'ゼウス', mother: 'レダ', grandFathers: ['テュンダレオス', 'カストル'], grandMothers: ['ポリュデウケス', 'クリュタイムネストラ'], greatGrandFathers: ['オイバロス', 'バテイア', 'ペリエレス', 'ゴルゴポネ'] }
  },
  {
    id: 'm34',
    name: 'カサンドラ',
    lineageId: 'stamina',
    stats: { speed: 500, stamina: 850, guts: 800, temperament: 300, health: 700, luck: 200, explosiveness: 400 },
    pedigree: { father: 'プリアモス', mother: 'ヘカベ', grandFathers: ['ヘクトール', 'パリス'], grandMothers: ['デイポボス', 'ヘレノス'], greatGrandFathers: ['ラオメドン', 'ストリュモ', 'ディマース', 'エウノエ'] }
  },
  {
    id: 'm35',
    name: 'エレクトラ',
    lineageId: 'guts',
    stats: { speed: 650, stamina: 750, guts: 920, temperament: 500, health: 850, luck: 600, explosiveness: 720 },
    pedigree: { father: 'アガメムノン', mother: 'クリュタイムネストラ', grandFathers: ['アトレウス', 'アエロペ'], grandMothers: ['テュンダレオス', 'レダ'], greatGrandFathers: ['ペロプス', 'ヒッポダメイア', 'カトレウス', 'クレタ'] }
  },
  {
    id: 'm36',
    name: 'アンティゴネ',
    lineageId: 'balance',
    stats: { speed: 720, stamina: 720, guts: 850, temperament: 900, health: 900, luck: 500, explosiveness: 680 },
    pedigree: { father: 'オイディプス', mother: 'イオカステ', grandFathers: ['ライオス', 'メノイケウス'], grandMothers: ['エピカステ', 'クレオン'], greatGrandFathers: ['ラブダコス', 'カドモス', 'ハルモニアー', 'アゲノル'] }
  },
  {
    id: 'm37',
    name: 'メデイア',
    lineageId: 'speed',
    stats: { speed: 800, stamina: 600, guts: 700, temperament: 200, health: 750, luck: 400, explosiveness: 850 },
    pedigree: { father: 'アイエテス', mother: 'イドゥイア', grandFathers: ['ヘリオス', 'ペルセ'], grandMothers: ['オーケアノス', 'テーテュース'], greatGrandFathers: ['ヒュペリーオーン', 'テイアー', 'ガイア', 'ウラヌス'] }
  },
  {
    id: 'm38',
    name: 'キルケ',
    lineageId: 'balance',
    stats: { speed: 750, stamina: 750, guts: 750, temperament: 700, health: 800, luck: 800, explosiveness: 750 },
    pedigree: { father: 'ヘリオス', mother: 'ペルセ', grandFathers: ['オーケアノス', 'テーテュース'], grandMothers: ['ヒュペリーオーン', 'テイアー'], greatGrandFathers: ['ガイア', 'ウラヌス', 'カオス', 'タルタロス'] }
  },
  {
    id: 'm39',
    name: 'カリュプソ',
    lineageId: 'stamina',
    stats: { speed: 550, stamina: 900, guts: 700, temperament: 850, health: 950, luck: 750, explosiveness: 450 },
    pedigree: { father: 'アトラス', mother: 'プレイオネ', grandFathers: ['イアペトス', 'クリュメネ'], grandMothers: ['オーケアノス', 'テーテュース'], greatGrandFathers: ['ウラヌス', 'ガイア', 'カオス', 'タルタロス'] }
  },
  {
    id: 'm40',
    name: 'ナウシカア',
    lineageId: 'balance',
    stats: { speed: 780, stamina: 780, guts: 780, temperament: 950, health: 900, luck: 900, explosiveness: 780 },
    pedigree: { father: 'アルキノオス', mother: 'アレテ', grandFathers: ['ナウシトオス', 'レクセノル'], grandMothers: ['ポセイドン', 'ペリボイア'], greatGrandFathers: ['カオス', 'タルタロス', 'エロス', 'エレボス'] }
  },
  {
    id: 'm41',
    name: 'アンドロメダスター',
    lineageId: 'balance',
    stats: { speed: 700, stamina: 700, guts: 700, temperament: 850, health: 800, luck: 800, explosiveness: 700 },
    pedigree: { father: 'ケフェウス', mother: 'カシオペア', grandFathers: ['ポセイドン', 'ゼウス'], grandMothers: ['アテナ', 'ヘラ'], greatGrandFathers: ['クロノス', 'レアー', 'ウラヌス', 'ガイア'] }
  },
  {
    id: 'm42',
    name: 'カシオペアクイーン',
    lineageId: 'guts',
    stats: { speed: 650, stamina: 650, guts: 920, temperament: 600, health: 750, luck: 700, explosiveness: 800 },
    pedigree: { father: 'エちおぴあ', mother: 'ロイヤル', grandFathers: ['キング', 'プリンス'], grandMothers: ['クイーン', 'プリンセス'], greatGrandFathers: ['エンペラー', 'カイザー', 'デューク', 'バロン'] }
  },
  {
    id: 'm43',
    name: 'ペガサスウィング',
    lineageId: 'speed',
    stats: { speed: 920, stamina: 500, guts: 600, temperament: 700, health: 650, luck: 850, explosiveness: 980 },
    pedigree: { father: 'ポセイドン', mother: 'メドゥーサ', grandFathers: ['フォルキュス', 'ケートー'], grandMothers: ['ガイア', 'ポントス'], greatGrandFathers: ['ウラヌス', 'エーテル', 'ヘーメラー', 'カオス'] }
  },
  {
    id: 'm44',
    name: 'ライラハープ',
    lineageId: 'balance',
    stats: { speed: 750, stamina: 750, guts: 750, temperament: 980, health: 800, luck: 900, explosiveness: 720 },
    pedigree: { father: 'オルフェウス', mother: 'アポロン', grandFathers: ['ヘルメス', 'ゼウス'], grandMothers: ['マイア', 'レト'], greatGrandFathers: ['アトラス', 'プレイオネ', 'コイオス', 'ポイベー'] }
  },
  {
    id: 'm45',
    name: 'シグナススワン',
    lineageId: 'stamina',
    stats: { speed: 600, stamina: 900, guts: 800, temperament: 850, health: 900, luck: 750, explosiveness: 550 },
    pedigree: { father: 'ゼウス', mother: 'レダ', grandFathers: ['テュンダレオース', 'オケアノス'], grandMothers: ['ネメシス', 'テテュス'], greatGrandFathers: ['クロノス', 'レアー', 'ウラヌス', 'ガイア'] }
  },
  {
    id: 'm46',
    name: 'アクィラスカイ',
    lineageId: 'speed',
    stats: { speed: 880, stamina: 600, guts: 700, temperament: 750, health: 700, luck: 800, explosiveness: 920 },
    pedigree: { father: 'ゼウス', mother: 'イーグル', grandFathers: ['スカイ', 'ストーム'], grandMothers: ['クラウド', 'ウィンド'], greatGrandFathers: ['ライトニング', 'サンダー', 'ボルト', 'フラッシュ'] }
  },
  {
    id: 'm47',
    name: 'ドラコフレイム',
    lineageId: 'guts',
    stats: { speed: 720, stamina: 850, guts: 980, temperament: 500, health: 800, luck: 650, explosiveness: 850 },
    pedigree: { father: 'ラドン', mother: 'ヘスペリス', grandFathers: ['アトラス', 'フォルキュス'], grandMothers: ['ヘスペリス', 'ケートー'], greatGrandFathers: ['イアペトス', 'アジア', 'ポントス', 'ガイア'] }
  },
  {
    id: 'm48',
    name: 'アンドロメダパール',
    lineageId: 'balance',
    stats: { speed: 750, stamina: 750, guts: 750, temperament: 850, health: 800, luck: 800, explosiveness: 750 },
    pedigree: { father: 'ケフェウス', mother: 'カシオペア', grandFathers: ['ポセイドン', 'ゼウス'], grandMothers: ['アテナ', 'ヘラ'], greatGrandFathers: ['クロノス', 'レアー', 'ウラヌス', 'ガイア'] }
  },
  {
    id: 'm49',
    name: 'カシオペアローズ',
    lineageId: 'guts',
    stats: { speed: 680, stamina: 680, guts: 900, temperament: 650, health: 750, luck: 750, explosiveness: 820 },
    pedigree: { father: 'エチオピア', mother: 'ロイヤル', grandFathers: ['キング', 'プリンス'], grandMothers: ['クイーン', 'プリンセス'], greatGrandFathers: ['エンペラー', 'カイザー', 'デューク', 'バロン'] }
  },
  {
    id: 'm50',
    name: 'ペガサススター',
    lineageId: 'speed',
    stats: { speed: 900, stamina: 550, guts: 650, temperament: 750, health: 600, luck: 900, explosiveness: 950 },
    pedigree: { father: 'ポセイドン', mother: 'メドゥーサ', grandFathers: ['フォルキュス', 'ケートー'], grandMothers: ['ガイア', 'ポントス'], greatGrandFathers: ['ウラヌス', 'エーテル', 'ヘーメラー', 'カオス'] }
  },
  {
    id: 'm51',
    name: 'セレスティアルブルー',
    lineageId: 'balance',
    stats: { speed: 740, stamina: 740, guts: 740, temperament: 880, health: 850, luck: 820, explosiveness: 740 },
    pedigree: { father: 'スカイ', mother: 'オーシャン', grandFathers: ['アズール', 'サファイア'], grandMothers: ['マリン', 'コーラル'], greatGrandFathers: ['ディープ', 'ブルー', 'シー', 'ウェーブ'] }
  },
  {
    id: 'm52',
    name: 'ルナティックティア',
    lineageId: 'speed',
    stats: { speed: 910, stamina: 520, guts: 630, temperament: 720, health: 680, luck: 880, explosiveness: 960 },
    pedigree: { father: 'ムーン', mother: 'ティア', grandFathers: ['ナイト', 'シャドウ'], grandMothers: ['ライト', 'シルバー'], greatGrandFathers: ['ダーク', 'フル', 'クレセント', 'ニュー'] }
  },
  {
    id: 'm53',
    name: 'ソーラーフレア',
    lineageId: 'guts',
    stats: { speed: 690, stamina: 710, guts: 960, temperament: 580, health: 820, luck: 640, explosiveness: 880 },
    pedigree: { father: 'サン', mother: 'フレア', grandFathers: ['ヒート', 'バーン'], grandMothers: ['プロミネンス', 'コロナ'], greatGrandFathers: ['コア', 'マグマ', 'ファイア', 'ブレイズ'] }
  },
  {
    id: 'm54',
    name: 'スターダストメモリー',
    lineageId: 'stamina',
    stats: { speed: 580, stamina: 920, guts: 840, temperament: 820, health: 930, luck: 780, explosiveness: 520 },
    pedigree: { father: 'ダスト', mother: 'メモリー', grandFathers: ['パスト', 'フューチャー'], grandMothers: ['プレゼント', 'タイム'], greatGrandFathers: ['エターナル', 'インフィニティ', 'ゼロ', 'ワン'] }
  },
  {
    id: 'm55',
    name: 'オーロラヴェール',
    lineageId: 'balance',
    stats: { speed: 760, stamina: 760, guts: 760, temperament: 940, health: 880, luck: 920, explosiveness: 760 },
    pedigree: { father: 'オーロラ', mother: 'ヴェール', grandFathers: ['カーテン', 'ライト'], grandMothers: ['カラー', 'プリズム'], greatGrandFathers: ['レインボー', 'スペクトル', 'ビーム', 'レイ'] }
  },
  {
    id: 'm56',
    name: 'コメットテイル',
    lineageId: 'speed',
    stats: { speed: 930, stamina: 540, guts: 610, temperament: 680, health: 620, luck: 860, explosiveness: 970 },
    pedigree: { father: 'コメット', mother: 'テイル', grandFathers: ['ハレー', 'エンケ'], grandMothers: ['百武', 'ヘール'], greatGrandFathers: ['ボップ', 'シューメーカー', 'レヴィ', 'ウエスト'] }
  },
  {
    id: 'm57',
    name: 'プラネットリング',
    lineageId: 'stamina',
    stats: { speed: 620, stamina: 940, guts: 820, temperament: 860, health: 910, luck: 740, explosiveness: 580 },
    pedigree: { father: 'サターン', mother: 'リング', grandFathers: ['ジュピター', 'ウラヌス'], grandMothers: ['ネプチューン', 'プルート'], greatGrandFathers: ['マーズ', 'ヴィーナス', 'マーキュリー', 'アース'] }
  },
  {
    id: 'm58',
    name: 'ギャラクシーロード',
    lineageId: 'guts',
    stats: { speed: 710, stamina: 690, guts: 980, temperament: 540, health: 840, luck: 680, explosiveness: 910 },
    pedigree: { father: 'ロード', mother: 'ギャラクシー', grandFathers: ['ウェイ', 'パス'], grandMothers: ['ルート', 'トラック'], greatGrandFathers: ['ハイウェイ', 'レーン', 'ストリート', 'アベニュー'] }
  },
  {
    id: 'm59',
    name: 'ミルキーウェイ',
    lineageId: 'balance',
    stats: { speed: 770, stamina: 770, guts: 770, temperament: 920, health: 860, luck: 890, explosiveness: 770 },
    pedigree: { father: 'ミルク', mother: 'ウェイ', grandFathers: ['ホワイト', 'クリーム'], grandMothers: ['シルク', 'スノー'], greatGrandFathers: ['パール', 'アイボリー', 'バニラ', 'リリー'] }
  },
  {
    id: 'm60',
    name: 'ノヴァノヴァ',
    lineageId: 'speed',
    stats: { speed: 950, stamina: 510, guts: 590, temperament: 740, health: 640, luck: 820, explosiveness: 990 },
    pedigree: { father: 'ノヴァ', mother: 'ノヴァ', grandFathers: ['スーパー', 'ハイパー'], grandMothers: ['ウルトラ', 'メガ'], greatGrandFathers: ['ギガ', 'テラ', 'ペタ', 'エクサ'] }
  }
];

export const RACE_NAMES = [
  // G1 / Classic
  'シリウス大賞', 'カノープス記念', 'ベガカップ', 'リゲルステークス', 
  'アルタイル大賞', 'デネブ記念', 'アンタレスステークス', 'スピカカップ',
  'ベテルギウス大賞', 'プロキオンステークス', 'レグルス記念', 'フォーマルハウト杯',
  'アークトゥルス大賞', 'カペラステークス', 'アルデバラン記念', 'ポルックスカップ',
  'アケルナル大賞', 'ハダルステークス', 'アクルックス記念', 'ミモザカップ',
  'シャウラ大賞', 'ベラトリックス記念', 'エルナトカップ', 'アルニラムステークス',
  '銀河グランプリ', 'コスモグランプリ', 'スターダストグランプリ', // Grand Prix
  
  // High Grade
  'アリオト記念', 'ミルファクステークス', 'ウェゼンカップ', 'サルガス記念',
  'ピーコックステークス', 'アルヘナカップ', 'メンカリナン記念', 'カストルステークス',
  'ギエナカップ', 'ハマル記念', 'ディフダステークス', 'ヌンキカップ',
  'カウス・アウストラリス記念', 'ヌンキステークス', 'アスケラカップ', 'テレベッルム記念',
  'アルナイルステークス', 'アル・ダンブカップ', 'アル・スハイル記念', 'アヴィオールステークス',
  'ミアプラキドゥスカップ', 'アクルックス大賞', 'ガクルックス記念', 'ミモザステークス',
  'ポラリスS', 'アルフェラッツC', 'ミラ記念', 'ハマルステークス', 'メンカルカップ',
  'リゲル大賞', 'ベラトリックスS', 'ミンタカ記念', 'アルニタクカップ', 'サイフステークス',
  
  // Special
  '青龍大賞', '朱雀記念', '白虎ステークス', '玄武カップ',
  '北斗七星記念', '南十字星大賞', 'オリオンステークス', 'プレアデス記念',
  'アンドロメダステークス', 'ペルセウスカップ', 'カシオペア記念', 'ケフェウス大賞',
  'ペガサスステークス', 'リラカップ', 'シグナス記念', 'アクエリアス大賞',
  'ゼウス・アルティメット', 'ポセイドン・ディープ', 'ハデス・インフェルノ', // Ultra Events
  
  // Standard
  '未勝利戦', '新馬戦', '条件戦', 'オープン特別', '馬齢限定', 'クラシック',
  'スターライト特別', 'コスモス賞', 'ギャラクシーS', 'プラネットC', 'オーロラ賞',
  '流星特別', '銀河賞', '彗星S', '星雲賞', '月光特別', '太陽賞',
  'エクリプス特別', 'ルナステークス', 'ソーラーカップ', 'ノヴァ記念', 'メテオ賞',
  'コメット特別', 'アストロS', 'コスモカップ', 'ギャラクシー記念', 'スター特別'
];

export const HORSE_NAME_PREFIX = [
  'サンダー', 'ギャラクシー', 'ミルキー', 'スター', 'コスモ', 'ルナ', 'ソーラー',
  'ノヴァ', 'メテオ', 'コメット', 'アストロ', 'プラネット', 'オーロラ', 'スカイ'
];

export const HORSE_NAME_SUFFIX = [
  'ノヴァ', 'ブレイド', 'ロード', 'キング', 'クイーン', 'オーブ', 'ブレイブ',
  'ダッシュ', 'ランナー', 'ハート', 'ソウル', 'スピリット', 'エース', 'ジョーカー'
];
