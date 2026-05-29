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
    reputation,
    gameMode,
    setGameMode
  } = useGameStore();

  const funds = team?.balance || 0;
  const prestige = team?.prestige || 50;

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
              <span className="font-bold text-lg">{prestige}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">📅</span>
              <span className="text-sm text-gray-400">赛季</span>
              <span className="font-bold text-lg">{currentSeason}/{currentRound || 1}</span>
            </div>
          </div>
        </div>

        {/* 核心行动卡片 */}
        <div className="bg-gradient-to-r from-[#1A2028] to-[#2D3748] rounded-xl p-5 border border-[#E10600] shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🏁</span>
            <div>
              <div className="text-lg font-bold">下一站：斯帕24小时耐力赛</div>
              <div className="text-gray-400 text-sm">斯帕-弗朗科尔尚赛道, 比利时</div>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⏱️</span>
              <span className="text-2xl font-bold text-[#E10600]">10 天</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigate('calendar')}
              className="px-4 py-3 bg-[#E10600] hover:bg-[#c00500] rounded-lg font-bold text-sm transition-all shadow-lg"
            >
              📋 赛事日历
            </button>
            <button
              onClick={() => onNavigate('market')}
              className="px-4 py-3 bg-[#2563eb] hover:bg-[#1d4ed8] rounded-lg font-bold text-sm transition-all shadow-lg"
            >
              👥 车手市场
            </button>
          </div>
        </div>

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