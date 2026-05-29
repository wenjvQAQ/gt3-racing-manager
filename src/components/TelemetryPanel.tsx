import React from 'react';
import { LiveRaceData } from '../utils/raceSimulation';
import { Fuel, Gauge, Thermometer, Timer, AlertTriangle } from 'lucide-react';

interface TelemetryPanelProps {
  liveData: LiveRaceData;
}

export const TelemetryPanel: React.FC<TelemetryPanelProps> = ({ liveData }) => {
  const tireTempData = [
    { position: '内侧', temp: 85 + Math.random() * 20 },
    { position: '中部', temp: 90 + Math.random() * 20 },
    { position: '外侧', temp: 80 + Math.random() * 20 }
  ];

  const brakeTempData = [
    { position: '前左', temp: 200 + Math.random() * 150 },
    { position: '前右', temp: 200 + Math.random() * 150 },
    { position: '后左', temp: 180 + Math.random() * 120 },
    { position: '后右', temp: 180 + Math.random() * 120 }
  ];

  return (
    <div className="bg-carbon-800 border border-carbon-600 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Gauge className="text-fuel-gold" size={20} />
          实时遥测
        </h3>
        <div className="text-xs text-gray-400">
          {liveData.driver.name} | Stint {liveData.driver.stintNumber}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-carbon-700 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Timer className="text-tire-green" size={16} />
            <span className="text-sm text-gray-300">当前圈速</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {liveData.currentPace}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            最佳: {liveData.bestLap} | 上圈: {liveData.lastLap}
          </div>
        </div>

        <div className="bg-carbon-700 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Fuel className="text-racing-blue" size={16} />
            <span className="text-sm text-gray-300">燃油剩余</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {liveData.currentFuel.toFixed(1)}L
          </div>
          <div className="w-full bg-carbon-600 rounded-full h-2 mt-2">
            <div 
              className={`h-full rounded-full ${
                liveData.currentFuel > 50 ? 'bg-tire-green' :
                liveData.currentFuel > 25 ? 'bg-fuel-gold' : 'bg-red-500'
              }`}
              style={{ width: `${liveData.currentFuel}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-carbon-700 p-3 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Thermometer className="text-red-400" size={16} />
            <span className="text-sm text-gray-300">轮胎温度</span>
          </div>
          <div className="text-sm font-semibold" style={{ color: getTempColor(liveData.tireCondition) }}>
            {liveData.tireCondition.toFixed(0)}%
          </div>
        </div>
        
        <div className="space-y-2">
          {tireTempData.map((tire) => (
            <div key={tire.position} className="flex items-center justify-between">
              <span className="text-xs text-gray-400 w-12">{tire.position}</span>
              <div className="flex-1 mx-2 bg-carbon-600 rounded-full h-3 relative overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, (tire.temp / 130) * 100)}%`,
                    backgroundColor: getTempGradient(tire.temp)
                  }}
                />
              </div>
              <span className="text-xs font-mono text-white w-12 text-right">
                {tire.temp.toFixed(0)}°C
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-carbon-700 p-3 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="text-orange-400" size={16} />
          <span className="text-sm text-gray-300">刹车温度</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {brakeTempData.map((brake) => (
            <div key={brake.position} className="flex items-center justify-between bg-carbon-600 p-2 rounded">
              <span className="text-xs text-gray-400">{brake.position}</span>
              <span 
                className="text-xs font-bold"
                style={{ color: brake.temp > 350 ? '#ef4444' : brake.temp > 280 ? '#f59e0b' : '#22c55e' }}
              >
                {brake.temp.toFixed(0)}°C
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-carbon-700 p-3 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-300">车手疲劳度</span>
          <span className={`text-sm font-bold ${
            liveData.driver.fatigue < 50 ? 'text-tire-green' :
            liveData.driver.fatigue < 75 ? 'text-fuel-gold' : 'text-red-400'
          }`}>
            {liveData.driver.fatigue.toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-carbon-600 rounded-full h-2">
          <div
            className={`h-full rounded-full transition-all ${
              liveData.driver.fatigue < 50 ? 'bg-tire-green' :
              liveData.driver.fatigue < 75 ? 'bg-fuel-gold' : 'bg-red-500'
            }`}
            style={{ width: `${liveData.driver.fatigue}%` }}
          />
        </div>
        {liveData.driver.fatigue > 70 && (
          <div className="mt-2 text-xs text-red-400 flex items-center gap-1">
            <AlertTriangle size={12} />
            建议考虑进站换人
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-carbon-700 p-2 rounded-lg">
          <div className="text-xs text-gray-400">进站次数</div>
          <div className="text-xl font-bold text-white">{liveData.pitStops}</div>
        </div>
        <div className="bg-carbon-700 p-2 rounded-lg">
          <div className="text-xs text-gray-400">事故次数</div>
          <div className="text-xl font-bold text-red-400">{liveData.incidents}</div>
        </div>
        <div className="bg-carbon-700 p-2 rounded-lg">
          <div className="text-xs text-gray-400">天气</div>
          <div className="text-lg font-bold text-racing-blue">
            {liveData.weather === '干燥' ? '☀️' : 
             liveData.weather === '雨天' ? '🌧️' : '⛅'}
          </div>
        </div>
      </div>
    </div>
  );
};

function getTempColor(condition: number): string {
  if (condition > 70) return '#ef4444';
  if (condition > 40) return '#f59e0b';
  return '#22c55e';
}

function getTempGradient(temp: number): string {
  if (temp > 110) return '#ef4444';
  if (temp > 95) return '#f59e0b';
  if (temp > 80) return '#22c55e';
  return '#3b82f6';
}
