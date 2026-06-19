import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const formatMoney = (amount) => `¥${(amount / 10000).toLocaleString()}万`;

function PerformanceChartComponent({ horse, onClose }) {
  const [activeTab, setActiveTab] = useState('position'); // 'position' | 'stats' | 'efficiency' | 'career'
  const history = horse.raceHistory || [];

  const getExpectedRewards = (h) => {
    let shards = h.earnedShards;
    let prize = h.earnedPrize;

    // Fallback if not recorded in old logs
    if (shards === undefined) {
      const baseShards = h.grade === 'G1' || h.grade === 'Event G1' || h.grade === 'G1 SPECIAL' ? 6 :
                         h.grade === 'G2' || h.grade === 'Event G2' ? 4 :
                         h.grade === 'G3' ? 3 : 1;
      if (h.position === 1) shards = baseShards;
      else if (h.position === 2) shards = Math.max(1, Math.round(baseShards * 0.5));
      else if (h.position === 3) shards = Math.max(1, Math.round(baseShards * 0.25));
      else if (h.position === 4 || h.position === 5) shards = baseShards >= 4 ? 1 : 0;
      else shards = 0;
    }

    if (prize === undefined) {
      const basePrize = h.grade === 'G1' || h.grade === 'Event G1' || h.grade === 'G1 SPECIAL' ? 120000000 :
                        h.grade === 'G2' || h.grade === 'Event G2' ? 60000000 :
                        h.grade === 'G3' ? 30000000 : 15000000;
      if (h.position === 1) prize = basePrize;
      else if (h.position === 2) prize = Math.round(basePrize * 0.4);
      else if (h.position === 3) prize = Math.round(basePrize * 0.15);
      else if (h.position === 4 || h.position === 5) prize = Math.round(basePrize * 0.05);
      else prize = 0;
    }

    return { shards, prize };
  };

  // Dummy data if there are no races yet to prevent empty component state
  const getChartData = () => {
    if (history.length === 0) {
      return [];
    }
    return history.map((h, index) => {
      const rewards = getExpectedRewards(h);
      return {
        index: index + 1,
        raceName: h.raceName,
        grade: h.grade,
        distance: h.distance,
        position: h.position,
        time: parseFloat(h.time.toFixed(2)),
        speed: h.speed,
        stamina: h.stamina,
        guts: h.guts,
        weather: h.weather,
        efficiency: parseFloat((h.distance / h.time).toFixed(1)), // M/S speed
        date: `${h.year}年 ${h.month}月 ${h.week}週`,
        earnedShards: rewards.shards,
        earnedPrize: rewards.prize
      };
    });
  };

  const chartData = getChartData();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700/60 p-4 rounded-2xl shadow-2xl backdrop-blur-md text-xs space-y-1.5 min-w-[200px]">
          <p className="font-extrabold text-indigo-400 text-sm">{data.raceName}</p>
          <div className="h-px bg-white/5 my-1" />
          <p className="text-slate-400 font-bold">開催期: <span className="text-white">{data.date}</span></p>
          <p className="text-slate-400 font-bold">グレード: <span className="text-indigo-300 uppercase">{data.grade}</span></p>
          <p className="text-slate-400 font-bold">距離: <span className="text-white">{data.distance}m</span></p>
          {data.weather && (
            <p className="text-slate-400 font-bold">天候: <span className={
              data.weather === 'Sunny' ? 'text-amber-400 font-extrabold' :
              data.weather === 'Rainy' ? 'text-sky-400 font-extrabold' :
              'text-orange-400 font-extrabold'
            }>
              {data.weather === 'Sunny' ? '☀️ 晴れ (良)' :
               data.weather === 'Rainy' ? '🌧️ 雨 (重)' :
               '🏇💦 豪雨 (泥濘)'}
            </span></p>
          )}
          <p className="text-slate-400 font-bold">着順: <span className="text-amber-400 font-black text-sm">{data.position}着</span></p>
          <p className="text-slate-400 font-bold">タイム: <span className="text-white font-mono">{data.time}s</span></p>
          {data.speed && <p className="text-slate-500">走時能力: <span className="text-slate-300 font-mono">SP:{data.speed} / ST:{data.stamina}</span></p>}
        </div>
      );
    };
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-[2.5rem] max-w-3xl w-full p-6 md:p-8 space-y-6 relative overflow-hidden shadow-[0_0_60px_rgba(99,102,241,0.2)]">
        {/* Decorative ambient blobs */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button 
          className="absolute top-6 right-6 text-slate-400 hover:text-white font-bold cursor-pointer text-xl transition-colors w-10 h-10 rounded-full border border-white/5 bg-slate-800/20 flex items-center justify-center hover:bg-white/5 active:scale-90"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Header information */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-black tracking-widest text-indigo-400 uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span> INDIVIDUAL RUN STATS & PROGRESSION
          </span>
          <h3 className="text-2xl font-black italic tracking-tighter uppercase text-white flex items-center gap-3">
            <span className="text-amber-400 font-black tracking-widest">{horse.name}</span> の戦績データ
          </h3>
          <div className="flex gap-4 text-xs text-slate-400 font-bold">
            <span>世代: {horse.age}歳 {horse.gender === 'colt' ? '牡' : '牝'}</span>
            <span>|</span>
            <span>生涯成績: {horse.winCount || 0}勝 / {horse.totalRaces || 0}戦</span>
          </div>
        </div>

        {/* Chart Container or No-Data Placeholder */}
        {chartData.length === 0 ? (
          <div className="border border-dashed border-white/10 bg-slate-950/40 rounded-3xl p-12 text-center space-y-4">
            <p className="text-slate-400 font-bold text-sm">現在、この馬の出走戦績データがありません。</p>
            <p className="text-slate-500 text-xs">レースに一度以上出走すると、競走馬レベルの成長や着順推移をダイナミックなRechartsグラフで視覚的に追跡できるようになります。</p>
            <button 
              className="px-6 py-2.5 rounded-full font-black text-xs bg-indigo-600 hover:bg-indigo-500 text-white transition-all transform hover:-translate-y-0.5" 
              onClick={onClose}
            >
              牧場に戻ってレースへ挑戦
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Nav Tabs */}
            <div className="flex flex-wrap sm:flex-nowrap border-b border-white/5 p-1 gap-1.5 bg-slate-950 rounded-2xl w-full max-w-lg">
              <button 
                className={`flex-1 text-center py-2 px-3 rounded-xl text-xs font-black tracking-tight transition-all cursor-pointer whitespace-nowrap ${activeTab === 'position' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 font-extrabold shadow-sm' : 'text-slate-400 hover:text-white'}`}
                onClick={() => setActiveTab('position')}
              >
                着順推移
              </button>
              <button 
                className={`flex-1 text-center py-2 px-3 rounded-xl text-xs font-black tracking-tight transition-all cursor-pointer whitespace-nowrap ${activeTab === 'stats' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 font-extrabold shadow-sm' : 'text-slate-400 hover:text-white'}`}
                onClick={() => setActiveTab('stats')}
              >
                能力成長
              </button>
              <button 
                className={`flex-1 text-center py-2 px-3 rounded-xl text-xs font-black tracking-tight transition-all cursor-pointer whitespace-nowrap ${activeTab === 'efficiency' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 font-extrabold shadow-sm' : 'text-slate-400 hover:text-white'}`}
                onClick={() => setActiveTab('efficiency')}
              >
                走破スピード
              </button>
              <button 
                className={`flex-1 text-center py-2 px-3 rounded-xl text-xs font-black tracking-tight transition-all cursor-pointer whitespace-nowrap ${activeTab === 'career' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 font-extrabold shadow-sm' : 'text-slate-400 hover:text-white'}`}
                onClick={() => setActiveTab('career')}
              >
                キャリア履歴 (Career)
              </button>
            </div>

            {activeTab === 'career' ? (
              <div className="space-y-4">
                {/* Career Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="bg-slate-950/70 border border-indigo-500/20 rounded-2xl p-3 space-y-1">
                    <span className="text-[9px] font-black text-slate-500 tracking-wider uppercase block">総獲得星片</span>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <span className="text-sm font-black text-amber-400 font-mono">+{chartData.reduce((sum, d) => sum + d.earnedShards, 0)}個</span>
                    </div>
                  </div>

                  <div className="bg-slate-950/70 border border-emerald-500/20 rounded-2xl p-3 space-y-1">
                    <span className="text-[9px] font-black text-slate-500 tracking-wider uppercase block">総獲得賞金</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-400 px-1 py-0.2 rounded">¥</span>
                      <span className="text-sm font-black text-emerald-400 font-mono">
                        {formatMoney(chartData.reduce((sum, d) => sum + d.earnedPrize, 0))}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 space-y-1">
                    <span className="text-[9px] font-black text-slate-500 tracking-wider uppercase block">生涯成績 / 勝率</span>
                    <div className="text-xs font-black text-white flex items-center justify-between">
                      <span>{chartData.filter(d => d.position === 1).length}勝 / {history.length}戦</span>
                      <span className="text-[10px] text-indigo-400 font-mono bg-indigo-500/10 px-1.5 py-0.2 rounded">
                        {((chartData.filter(d => d.position === 1).length / history.length) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 space-y-1">
                    <span className="text-[9px] font-black text-slate-500 tracking-wider uppercase block">掲示板内 (1-3着率)</span>
                    <div className="text-xs font-black text-white flex items-center justify-between">
                      <span>3着内: {chartData.filter(d => d.position <= 3).length}回</span>
                      <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.2 rounded">
                        {((chartData.filter(d => d.position <= 3).length / history.length) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Career Chronological Timeline Log */}
                <div className="space-y-2">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-1 flex justify-between">
                    <span>キャリア戦績ロードマップ (CAREER PATH TIMELINE)</span>
                    <span>全 {history.length} レースの歴史的記録</span>
                  </div>
                  <div className="space-y-2 h-[260px] overflow-y-auto pr-1">
                    {chartData.slice().reverse().map((d, i) => {
                      const isWin = d.position === 1;
                      const positionBadgeColor = 
                        d.position === 1 ? 'bg-amber-400 text-slate-950 font-black shadow-[0_0_12px_rgba(245,158,11,0.3)] ring-2 ring-amber-400/20' :
                        d.position === 2 ? 'bg-slate-300 text-slate-950 font-black' :
                        d.position === 3 ? 'bg-amber-700 text-white font-black' :
                        'bg-slate-900 border border-slate-800/80 text-slate-400 font-bold';
                      
                      return (
                        <div key={i} className={`flex flex-col md:flex-row justify-between md:items-center bg-slate-950/60 p-3 rounded-2xl border ${isWin ? 'border-amber-500/30 bg-amber-500/[0.01]' : 'border-white/5'} hover:border-slate-800 transition-all gap-2`}>
                          <div className="flex items-center gap-3">
                            <span className={`w-8 h-8 shrink-0 rounded-xl flex items-center justify-center text-xs italic ${positionBadgeColor}`}>
                              {d.position}着
                            </span>

                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5 font-bold flex-wrap">
                                <span className="text-white text-xs font-black max-w-[140px] truncate">{d.raceName}</span>
                                <span className="text-[8px] font-black bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 px-1 py-0.2 rounded uppercase tracking-wider">{d.grade}</span>
                                <span className="text-[9px] text-slate-500 font-mono font-medium">{d.date}</span>
                                {d.weather === 'Sunny' && <span className="text-[8px] text-amber-500 font-extrabold bg-amber-500/5 border border-amber-500/10 px-1 rounded">☀️ 晴良</span>}
                                {d.weather === 'Rainy' && <span className="text-[8px] text-sky-400 font-extrabold bg-sky-500/5 border border-sky-500/10 px-1 rounded">🌧️ 雨重</span>}
                                {d.weather === 'Muddy' && <span className="text-[8px] text-orange-400 font-extrabold bg-orange-500/5 border border-orange-500/10 px-1 rounded">🏇泥不</span>}
                              </div>
                              
                              <div className="flex items-center gap-2 text-[9px] text-slate-400 font-bold">
                                <span>距離: <span className="text-white font-mono">{d.distance}m</span></span>
                                <span className="text-slate-700">•</span>
                                <span>タイム: <span className="text-white font-mono">{d.time}s</span></span>
                                <span className="text-slate-700">•</span>
                                <span>SP:{d.speed} ST:{d.stamina}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 border-t md:border-t-0 border-white/5 pt-1.5 md:pt-0 justify-end">
                            {/* Money format */}
                            {d.earnedPrize > 0 ? (
                              <span className="text-[10px] font-black text-emerald-400 font-mono flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/15">
                                <span className="text-[9px]">¥</span>
                                {formatMoney(d.earnedPrize)}
                              </span>
                            ) : (
                              <span className="text-[9px] text-slate-500 font-bold bg-slate-900/40 border border-slate-800/40 px-1.5 py-0.5 rounded">¥0万</span>
                            )}
                            
                            {/* Star shard format */}
                            {d.earnedShards > 0 ? (
                              <span className="text-[10px] font-black text-amber-400 font-mono flex items-center gap-0.5 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/15">
                                <svg className="w-2.5 h-2.5 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                                +{d.earnedShards}
                              </span>
                            ) : (
                              <span className="text-[9px] text-slate-500 font-bold bg-slate-900/40 border border-slate-800/40 px-1.5 py-0.5 rounded">片0</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Actual Recharts Element */}
                <div className="h-72 w-full bg-slate-950/40 border border-white/5 rounded-3xl p-4 flex items-center justify-center overflow-hidden">
                  <ResponsiveContainer width="100%" height="100%">
                    {activeTab === 'position' ? (
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorPosition" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.4} />
                        <XAxis 
                          dataKey="index" 
                          stroke="#475569" 
                          fontSize={11} 
                          fontWeight="bold"
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `第${value}戦`}
                        />
                        {/* Position YAxis is inverted (1st is highest, 12th is lowest) */}
                        <YAxis 
                          domain={[12, 1]} 
                          tickCount={12} 
                          stroke="#475569" 
                          fontSize={11} 
                          fontWeight="bold"
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value}着`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area 
                          type="monotone" 
                          dataKey="position" 
                          stroke="#f59e0b" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorPosition)" 
                          activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 1 }}
                        />
                      </AreaChart>
                    ) : activeTab === 'stats' ? (
                      <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.4} />
                        <XAxis 
                          dataKey="index" 
                          stroke="#475569" 
                          fontSize={11} 
                          fontWeight="bold"
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `第${value}戦`}
                        />
                        <YAxis 
                          domain={['dataMin - 10', 'dataMax + 10']}
                          stroke="#475569" 
                          fontSize={11} 
                          fontWeight="bold"
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                        <Line 
                          type="monotone" 
                          dataKey="speed" 
                          name="スピード (Speed)"
                          stroke="#6366f1" 
                          strokeWidth={3}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="stamina" 
                          name="スタミナ (Stamina)"
                          stroke="#3b82f6" 
                          strokeWidth={3}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    ) : (
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorSpeedEff" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.4} />
                        <XAxis 
                          dataKey="index" 
                          stroke="#475569" 
                          fontSize={11} 
                          fontWeight="bold"
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `第${value}戦`}
                        />
                        <YAxis 
                          domain={['dataMin - 5', 'dataMax + 5']}
                          stroke="#475569" 
                          fontSize={11} 
                          fontWeight="bold"
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value} m/s`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area 
                          type="monotone" 
                          dataKey="efficiency" 
                          name="走破平均速度 (m/s)"
                          stroke="#10b981" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorSpeedEff)" 
                          activeDot={{ r: 6 }}
                        />
                      </AreaChart>
                    )}
                  </ResponsiveContainer>
                </div>

                {/* List history overview */}
                <div className="space-y-3">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-1 flex justify-between">
                    <span>直近のレース戦績履歴 (RACE HISTORIES)</span>
                    <span>最新5レースを表示</span>
                  </div>
                  <div className="space-y-2 h-36 overflow-y-auto pr-1">
                    {chartData.slice().reverse().slice(0, 5).map((d, i) => (
                      <div key={i} className="flex justify-between items-center bg-slate-950 p-3 rounded-2xl border border-white/5 hover:border-slate-800 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black italic text-sm ${d.position === 1 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-400'}`}>
                            {d.position}
                          </span>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 font-bold">
                              <span className="text-white text-xs select-none max-w-[120px] truncate">{d.raceName}</span>
                              <span className="text-[8px] px-1 py-0.5 bg-slate-800 rounded uppercase font-black tracking-wide text-slate-400">{d.grade}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-bold">{d.date} • {d.distance}m</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-white font-mono text-xs font-bold leading-none">{d.time}秒</span>
                          <p className="text-[9px] text-slate-500 font-black tracking-tight">{d.efficiency} m/s</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Modal footer controls */}
        <div className="pt-4 border-t border-white/5 flex gap-3">
          <button 
            className="flex-1 text-center font-bold text-xs py-3 rounded-2xl border border-slate-700 hover:bg-slate-800/50 text-white cursor-pointer transition-colors active:scale-95"
            onClick={onClose}
          >
            マイ牧場に戻る
          </button>
        </div>
      </div>
    </div>
  );
}

// Global orchestration helpers
let chartRoot = null;

export function mountPerformanceChart(horseId, containerId, onCloseCallback) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const horse = window.state.horses.find(h => h.id === horseId);
  if (!horse) return;

  if (!chartRoot) {
    chartRoot = createRoot(container);
  }

  chartRoot.render(
    <PerformanceChartComponent 
      horse={horse} 
      onClose={() => {
        if (onCloseCallback) onCloseCallback();
        // Unmount React context to keep it clean
        setTimeout(() => {
          if (chartRoot) {
            chartRoot.unmount();
            chartRoot = null;
          }
        }, 10);
      }} 
    />
  );
}
