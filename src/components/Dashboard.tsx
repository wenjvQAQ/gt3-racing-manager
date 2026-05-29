import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const { 
    team, 
    currentSeason, 
    currentRound,
    seasonCalendar,
    funds,
    reputation,
    drivers,
    gameMode,
    setGameMode
  } = useGameStore();

  const [expandedCards, setExpandedCards] = useState<{[key: string]: boolean}>({
    drivers: true,
    car: false,
    news: false
  });

  const nextRace = seasonCalendar.find(r => !r.completed);
  const daysUntilRace = nextRace ? Math.ceil((new Date(nextRace.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;

  const toggleCard = (key: string) => {
    setExpandedCards(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getHealthColor = (value: number) => {
    if (value > 80) return 'text-green-400';
    if (value > 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getHealthBg = (value: number) => {
    if (value > 80) return 'bg-green-500';
    if (value > 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-[#0E1217] text-white pb-24">
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* 顶部资源栏 */}
        <div className="bg-[#1A2028] rounded-xl p-4 border-b-2 border-[#2D3748] shadow-lg">
          <div className="flex flex-wrap gap-6 justify-around">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">💰</span>
              <span className="text-sm text-gray-400">预算</span>
              <span className="font-bold text-lg tracking-wide">€ {(funds / 1000).toFixed(0)}K</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">⭐</span>
              <span className="text-sm text-gray-400">声望</span>
              <span className="font-bold text-lg">{reputation}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">📅</span>
              <span className="text-sm text-gray-400">赛季</span>
              <span className="font-bold text-lg">{currentSeason}/{currentRound}</span>
            </div>
          </div>
        </div>

        {/* 核心行动卡片 */}
        {nextRace && (
          <div className="bg-gradient-to-r from-[#1A2028] to-[#2D3748] rounded-xl p-5 border border-[#E10600] shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🏁</span>
              <div>
                <div className="text-lg font-bold">下一站：{nextRace.name}</div>
                <div className="text-gray-400 text-sm">{nextRace.track.name}, {nextRace.track.country}</div>
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⏱️</span>
                <span className="text-2xl font-bold text-[#E10600]">
                  {daysUntilRace > 0 ? `${daysUntilRace} 天` : '今天'}
                </span>
              </div>
              {daysUntilRace <= 3 && (
                <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold animate-pulse">
                  紧急准备
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onNavigate('calendar')}
                className="px-4 py-3 bg-[#E10600] hover:bg-[#c00500] rounded-lg font-bold text-sm transition-all shadow-lg"
              >
                📋 赛事报名
              </button>
              <button
                onClick={() => navigate(`/live-race-v2/${nextRace.id}`)}
                className="px-4 py-3 bg-[#2563eb] hover:bg-[#1d4ed8] rounded-lg font-bold text-sm transition-all shadow-lg"
              >
                ⚙️ 比赛周
              </button>
            </div>
          </div>
        )}

        {/* 车队健康度仪表 */}
        <div className="bg-[#1A2028] rounded-xl p-4 border border-[#2D3748]">
          <h3 className="text-sm font-semibold text-gray-400 mb-3 tracking-wider">📊 车队健康度</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="#2D3748" strokeWidth="6" fill="none" />
                  <circle 
                    cx="32" cy="32" r="28" 
                    stroke="#10b981" 
                    strokeWidth="6" 
                    fill="none"
                    strokeDasharray={`${88 * 0.85} 176`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-green-400">
                  85%
                </span>
              </div>
              <div className="text-xs text-gray-400">车手士气</div>
            </div>
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="#2D3748" strokeWidth="6" fill="none" />
                  <circle 
                    cx="32" cy="32" r="28" 
                    stroke="#3b82f6" 
                    strokeWidth="6" 
                    fill="none"
                    strokeDasharray={`${88 * 0.95} 176`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-blue-400">
                  95%
                </span>
              </div>
              <div className="text-xs text-gray-400">赛车可靠性</div>
            </div>
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="#2D3748" strokeWidth="6" fill="none" />
                  <circle 
                    cx="32" cy="32" r="28" 
                    stroke="#f59e0b" 
                    strokeWidth="6" 
                    fill="none"
                    strokeDasharray={`${88 * 0.65} 176`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-yellow-400">
                  65%
                </span>
              </div>
              <div className="text-xs text-gray-400">资金充裕</div>
            </div>
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="#2D3748" strokeWidth="6" fill="none" />
                  <circle 
                    cx="32" cy="32" r="28" 
                    stroke="#8b5cf6" 
                    strokeWidth="6" 
                    fill="none"
                    strokeDasharray={`${88 * 0.75} 176`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-purple-400">
                  75%
                </span>
              </div>
              <div className="text-xs text-gray-400">厂商关系</div>
            </div>
          </div>
        </div>

        {/* 车手阵容卡片 */}
        <div className="bg-[#1A2028] rounded-xl border border-[#2D3748] overflow-hidden">
          <button
            onClick={() => toggleCard('drivers')}
            className="w-full p-4 flex items-center justify-between hover:bg-[#2D3748] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">👥</span>
              <span className="font-semibold">车手阵容</span>
              <span className="text-xs text-gray-500">({drivers.length}人)</span>
            </div>
            <span className={`transform transition-transform ${expandedCards.drivers ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          
          {expandedCards.drivers && (
            <div className="px-4 pb-4 space-y-3">
              {drivers.map((driver, index) => (
                <div key={driver.id} className="bg-[#0E1217] rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        driver.type === 'pro' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {driver.type === 'pro' ? '🏅 Pro' : '💰 Amateur'}
                      </span>
                      <span className="font-semibold">{driver.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">技能 {driver.skill}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400 w-12">疲劳度</span>
                    <div className="flex-1 bg-[#2D3748] rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full ${getHealthBg(driver.fatigue)} transition-all`}
                        style={{ width: `${driver.fatigue}%` }}
                      />
                    </div>
                    <span className={`text-xs font-mono w-10 ${getHealthColor(100 - driver.fatigue)}`}>
                      {driver.fatigue}%
                    </span>
                  </div>
                </div>
              ))}
              <button
                onClick={() => onNavigate('drivers')}
                className="w-full py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                查看全部详情 →
              </button>
            </div>
          )}
        </div>

        {/* 赛车状态卡片 */}
        <div className="bg-[#1A2028] rounded-xl border border-[#2D3748] overflow-hidden">
          <button
            onClick={() => toggleCard('car')}
            className="w-full p-4 flex items-center justify-between hover:bg-[#2D3748] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🏎️</span>
              <span className="font-semibold">赛车状态</span>
            </div>
            <span className={`transform transition-transform ${expandedCards.car ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          
          {expandedCards.car && (
            <div className="px-4 pb-4 space-y-3">
              <div className="bg-[#0E1217] rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{team.car}</span>
                  <span className="text-xs text-gray-400">总况良好</span>
                </div>
                <div className="space-y-2">
                  {[
                    { name: '引擎', value: 95 },
                    { name: '底盘', value: 98 },
                    { name: '空气动力学', value: 88 },
                    { name: '可靠性', value: 92 }
                  ].map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 w-24">{item.name}</span>
                      <div className="flex-1 bg-[#2D3748] rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full ${getHealthBg(item.value)} transition-all`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                      <span className={`text-xs font-mono w-10 ${getHealthColor(item.value)}`}>
                        {item.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => onNavigate('facilities')}
                className="w-full py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                维护/升级 →
              </button>
            </div>
          )}
        </div>

        {/* 最近消息卡片 */}
        <div className="bg-[#1A2028] rounded-xl border border-[#2D3748] overflow-hidden">
          <button
            onClick={() => toggleCard('news')}
            className="w-full p-4 flex items-center justify-between hover:bg-[#2D3748] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">📋</span>
              <span className="font-semibold">围场电报</span>
            </div>
            <span className="text-xs text-gray-500">3条新消息</span>
          </button>
          
          {expandedCards.news && (
            <div className="px-4 pb-4 space-y-2">
              <div className="bg-[#0E1217] rounded-lg p-3 border-l-4 border-blue-500">
                <div className="text-xs text-blue-400 mb-1">📊 策略建议</div>
                <div className="text-sm text-gray-300">你的绅士车手已经连续两场疲劳度偏高，建议安排休息。</div>
              </div>
              <div className="bg-[#0E1217] rounded-lg p-3 border-l-4 border-yellow-500">
                <div className="text-xs text-yellow-400 mb-1">⚠️ 维护提醒</div>
                <div className="text-sm text-gray-300">引擎寿命低于30%，建议在下站前更换。</div>
              </div>
              <div className="bg-[#0E1217] rounded-lg p-3 border-l-4 border-green-500">
                <div className="text-xs text-green-400 mb-1">💰 赞助商</div>
                <div className="text-sm text-gray-300">赞助商对车队形象很满意，考虑续约事宜。</div>
              </div>
              <button
                onClick={() => onNavigate('news')}
                className="w-full py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                查看全部消息 →
              </button>
            </div>
          )}
        </div>

        {/* 快速模式切换 */}
        <div className="bg-[#1A2028] rounded-xl p-4 border border-[#2D3748]">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold mb-1">🎮 游戏模式</div>
              <div className="text-xs text-gray-400">
                {gameMode === 'fast' ? '快速模式：自动处理调校和策略' : '完整模式：显示所有细节'}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setGameMode('fast')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  gameMode === 'fast' 
                    ? 'bg-[#E10600] text-white' 
                    : 'bg-[#2D3748] text-gray-400 hover:bg-[#3D4758]'
                }`}
              >
                快速
              </button>
              <button
                onClick={() => setGameMode('full')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  gameMode === 'full' 
                    ? 'bg-[#E10600] text-white' 
                    : 'bg-[#2D3748] text-gray-400 hover:bg-[#3D4758]'
                }`}
              >
                完整
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
