import React, { useState, useEffect, useRef } from 'react';
import { TelemetryChart, STRATEGY_PRESETS, saveStrategyPreset, loadStrategyPresets } from './TelemetryChart';
import { CarState } from '../types/track';

interface RaceCommandCenterProps {
  playerCar: CarState | null;
  allCars: CarState[];
  isPaused: boolean;
  onTogglePause: () => void;
  onSpeedChange: (speed: number) => void;
  speed: number;
  raceEvents: { time: number; message: string; type?: string }[];
}

export const RaceCommandCenter: React.FC<RaceCommandCenterProps> = ({
  playerCar,
  allCars,
  isPaused,
  onTogglePause,
  onSpeedChange,
  speed,
  raceEvents
}) => {
  const [telemetryHistory, setTelemetryHistory] = useState<{
    tireTemp: number[];
    fuel: number[];
    speed: number[];
  }>({
    tireTemp: [],
    fuel: [],
    speed: []
  });
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [showTacticalPause, setShowTacticalPause] = useState(false);
  const eventLogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (playerCar && !isPaused) {
      const avgTire = (
        playerCar.tireCondition.frontLeft +
        playerCar.tireCondition.frontRight +
        playerCar.tireCondition.rearLeft +
        playerCar.tireCondition.rearRight
      ) / 4;

      const tireTemp = 100 - avgTire * 100;

      setTelemetryHistory(prev => ({
        tireTemp: [...prev.tireTemp.slice(-49), tireTemp],
        fuel: [...prev.fuel.slice(-49), playerCar.fuelLoad],
        speed: [...prev.speed.slice(-49), playerCar.speed]
      }));
    }
  }, [playerCar?.fuelLoad, isPaused]);

  useEffect(() => {
    if (eventLogRef.current) {
      eventLogRef.current.scrollTop = eventLogRef.current.scrollHeight;
    }
  }, [raceEvents]);

  const getTireColor = (tireCondition: number) => {
    if (tireCondition > 0.7) return 'bg-green-500';
    if (tireCondition > 0.4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getGapColor = (gap: string) => {
    if (gap === '0.000') return 'text-yellow-400';
    const value = parseFloat(gap.replace('+', ''));
    if (value < 5) return 'text-green-400';
    if (value < 15) return 'text-yellow-400';
    return 'text-red-400';
  };

  const presets = loadStrategyPresets();

  return (
    <div className="space-y-4">
      <div className="bg-carbon-900 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold flex items-center gap-2">
            <span className="text-xl">⚡</span>
            战术指挥中心
          </h3>
          <button
            onClick={() => setShowTacticalPause(!showTacticalPause)}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              showTacticalPause
                ? 'bg-orange-500 text-white'
                : 'bg-carbon-700 text-gray-300 hover:bg-carbon-600'
            }`}
          >
            {showTacticalPause ? '📍 退出战术暂停' : '⏸️ 战术暂停'}
          </button>
        </div>

        {showTacticalPause && (
          <div className="mb-4 p-3 bg-orange-500/20 border border-orange-500/50 rounded-lg">
            <p className="text-orange-300 text-sm mb-3">
              🔍 战术暂停激活 - 时间停止，您可以冷静分析局势并下达指令
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-semibold">
                🔧 进站
              </button>
              <button className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm font-semibold">
                ⚡ 推进模式
              </button>
              <button className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-semibold">
                🛡️ 保胎模式
              </button>
              <button className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-semibold">
                🔥 超车
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={onTogglePause}
            className={`px-4 py-2 rounded font-semibold text-sm transition-all flex items-center gap-2 ${
              isPaused
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isPaused ? '▶️ 继续' : '⏸️ 暂停'}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs">速度:</span>
            <select
              value={speed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              className="px-3 py-2 bg-carbon-700 text-white rounded text-sm border border-carbon-600"
            >
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={4}>4x</option>
              <option value={8}>8x</option>
              <option value={16}>16x</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-gray-300 text-sm mb-2 font-semibold">策略预设</h4>
          <div className="flex flex-wrap gap-2">
            {presets.map(preset => (
              <button
                key={preset.id}
                onClick={() => setSelectedPreset(selectedPreset === preset.id ? null : preset.id)}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                  selectedPreset === preset.id
                    ? 'bg-fuel-gold text-carbon-950'
                    : 'bg-carbon-700 text-gray-300 hover:bg-carbon-600'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>

          {selectedPreset && (
            <div className="mt-2 p-3 bg-carbon-800 rounded-lg text-xs">
              {(() => {
                const preset = presets.find(p => p.id === selectedPreset);
                if (!preset) return null;
                return (
                  <>
                    <div className="text-gray-300 mb-2">{preset.description}</div>
                    <div className="space-y-1">
                      {preset.stints.map((stint, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-gray-400">
                          <span className="font-mono">{idx + 1}.</span>
                          <span className={`px-2 py-0.5 rounded ${
                            stint.tire === 'soft' ? 'bg-red-500/50' :
                            stint.tire === 'medium' ? 'bg-yellow-500/50' : 'bg-white/50'
                          }`}>
                            {stint.tire}
                          </span>
                          <span>{stint.laps}圈</span>
                          <span className="text-gray-500">|</span>
                          <span>{stint.fuel}%油</span>
                          <span className="text-gray-500">|</span>
                          <span className={
                            stint.pushMode === 'push' ? 'text-red-400' :
                            stint.pushMode === 'conserve' ? 'text-green-400' : 'text-gray-400'
                          }>
                            {stint.pushMode === 'push' ? '🔥激进' :
                             stint.pushMode === 'conserve' ? '🛡️保守' : '📊正常'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      {playerCar && (
        <div className="bg-carbon-900 rounded-lg p-4">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <span className="text-xl">📊</span>
            实时遥测
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="bg-carbon-800 rounded p-2">
              <TelemetryChart
                data={telemetryHistory.tireTemp}
                label="轮胎温度"
                color="#ff6b6b"
                maxValue={100}
                unit="°C"
                height={80}
              />
            </div>
            <div className="bg-carbon-800 rounded p-2">
              <TelemetryChart
                data={telemetryHistory.fuel}
                label="燃油量"
                color="#4ecdc4"
                maxValue={100}
                unit="kg"
                height={80}
              />
            </div>
            <div className="bg-carbon-800 rounded p-2">
              <TelemetryChart
                data={telemetryHistory.speed}
                label="速度"
                color="#ffe66d"
                maxValue={300}
                unit="km/h"
                height={80}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-carbon-800 rounded p-3">
              <div className="text-gray-400 text-xs mb-1">轮胎磨损</div>
              <div className="flex gap-1">
                {['frontLeft', 'frontRight', 'rearLeft', 'rearRight'].map((tire) => (
                  <div key={tire} className="flex-1">
                    <div className="text-gray-500 text-xs mb-1 text-center">
                      {tire === 'frontLeft' ? 'FL' :
                       tire === 'frontRight' ? 'FR' :
                       tire === 'rearLeft' ? 'RL' : 'RR'}
                    </div>
                    <div className="h-2 bg-carbon-700 rounded overflow-hidden">
                      <div
                        className={`h-full ${getTireColor(playerCar.tireCondition[tire as keyof typeof playerCar.tireCondition])} transition-all`}
                        style={{
                          width: `${playerCar.tireCondition[tire as keyof typeof playerCar.tireCondition] * 100}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-carbon-800 rounded p-3">
              <div className="text-gray-400 text-xs mb-1">位置</div>
              <div className="text-2xl font-bold text-fuel-gold">
                P{playerCar.currentPosition}
              </div>
            </div>

            <div className="bg-carbon-800 rounded p-3">
              <div className="text-gray-400 text-xs mb-1">差距</div>
              <div className={`text-xl font-mono font-bold ${getGapColor(playerCar.gapToLeader)}`}>
                {playerCar.gapToLeader}
              </div>
            </div>

            <div className="bg-carbon-800 rounded p-3">
              <div className="text-gray-400 text-xs mb-1">最佳圈</div>
              <div className="text-xl font-mono font-bold text-green-400">
                {playerCar.bestLapTime?.toFixed(2) || '--'}s
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-carbon-900 rounded-lg p-4">
        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
          <span className="text-xl">📻</span>
          围场电报
          <span className="text-xs text-gray-500 font-normal ml-2">
            {raceEvents.length} 条消息
          </span>
        </h3>
        <div
          ref={eventLogRef}
          className="space-y-2 max-h-64 overflow-y-auto"
          style={{ scrollBehavior: 'smooth' }}
        >
          {raceEvents.map((event, index) => (
            <div
              key={index}
              className={`text-xs p-2 rounded ${
                event.type === 'incident' ? 'bg-red-500/20 text-red-300' :
                event.type === 'overtake' ? 'bg-blue-500/20 text-blue-300' :
                event.type === 'pitstop' ? 'bg-yellow-500/20 text-yellow-300' :
                event.type === 'fastest' ? 'bg-green-500/20 text-green-300' :
                'bg-carbon-800 text-gray-300'
              }`}
            >
              <span className="text-gray-500 font-mono mr-2">
                {Math.floor(event.time / 60)}:{(event.time % 60).toString().padStart(2, '0')}
              </span>
              {event.message}
            </div>
          ))}
          {raceEvents.length === 0 && (
            <div className="text-gray-500 text-xs text-center py-4">
              等待比赛开始...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
