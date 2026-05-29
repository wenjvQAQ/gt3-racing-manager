import React, { useState } from 'react';
import { Settings, Zap, Gauge, Wind, Clock, AlertTriangle } from 'lucide-react';
import type { Car, Race } from '../types/game';

export interface CarSetup {
  frontWing: number;
  rearWing: number;
  suspension: number;
  brakeBalance: number;
  differentialLock: number;
  tirePressure: number;
  engineMode: 'high' | 'medium' | 'low';
}

interface SetupTuningPanelProps {
  car: Car;
  race: Race;
  trackType?: 'highSpeed' | 'technical' | 'mixed';
  onSetupChange?: (setup: CarSetup) => void;
}

export const SetupTuningPanel: React.FC<SetupTuningPanelProps> = ({
  car,
  race,
  trackType = race.track.trackType,
  onSetupChange
}) => {
  const [setup, setSetup] = useState<CarSetup>({
    frontWing: 50,
    rearWing: 50,
    suspension: 50,
    brakeBalance: 50,
    differentialLock: 50,
    tirePressure: 100,
    engineMode: 'medium'
  });

  const [recommendedSetup] = useState(() => 
    getRecommendedSetup(car, trackType)
  );

  const handleChange = (key: keyof CarSetup, value: number | 'high' | 'medium' | 'low') => {
    const newSetup = { ...setup, [key]: value };
    setSetup(newSetup);
    if (onSetupChange) {
      onSetupChange(newSetup);
    }
  };

  const applyRecommended = () => {
    setSetup(recommendedSetup);
    if (onSetupChange) {
      onSetupChange(recommendedSetup);
    }
  };

  const calculateImpact = () => {
    const downforce = (setup.frontWing + setup.rearWing) / 2;
    const topSpeed = 100 - downforce * 0.3;
    const cornering = downforce * 0.8 + (100 - setup.suspension) * 0.2;
    const tireWear = setup.tirePressure > 100 ? (setup.tirePressure - 100) * 0.5 : 0;
    const brakeTemp = Math.abs(setup.brakeBalance - 50) * 0.3;

    return {
      downforce: downforce.toFixed(0),
      topSpeed: topSpeed.toFixed(0),
      cornering: cornering.toFixed(0),
      tireWear: tireWear.toFixed(1),
      brakeTemp: brakeTemp.toFixed(1),
      overall: calculateSetupQuality(setup, car, trackType)
    };
  };

  const impact = calculateImpact();

  return (
    <div className="bg-carbon-800 border border-carbon-600 rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="text-fuel-gold" size={24} />
          赛车调校
        </h3>
        <button
          onClick={applyRecommended}
          className="bg-racing-blue/20 text-racing-blue px-4 py-2 rounded-lg hover:bg-racing-blue/30 transition-colors text-sm font-semibold"
        >
          应用推荐调校
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <SetupSlider
            label="前翼角度"
            value={setup.frontWing}
            onChange={(v) => handleChange('frontWing', v)}
            description="增加下压力，提高高速弯稳定性"
            icon={<Wind size={16} />}
            color="text-racing-blue"
            minLabel="极速"
            maxLabel="下压力"
          />

          <SetupSlider
            label="后翼角度"
            value={setup.rearWing}
            onChange={(v) => handleChange('rearWing', v)}
            description="平衡前后压力，影响转向特性"
            icon={<Wind size={16} />}
            color="text-racing-blue"
            minLabel="极速"
            maxLabel="下压力"
          />

          <SetupSlider
            label="悬挂硬度"
            value={setup.suspension}
            onChange={(v) => handleChange('suspension', v)}
            description="软悬挂改善轮胎接触，硬悬挂提高响应"
            icon={<Zap size={16} />}
            color="text-tire-green"
            minLabel="舒适"
            maxLabel="性能"
          />

          <SetupSlider
            label="刹车平衡"
            value={setup.brakeBalance}
            onChange={(v) => handleChange('brakeBalance', v)}
            description="前/后刹车分配，影响入弯稳定性"
            icon={<Gauge size={16} />}
            color="text-red-400"
            minLabel="偏后"
            maxLabel="偏前"
          />

          <SetupSlider
            label="差速器锁止"
            value={setup.differentialLock}
            onChange={(v) => handleChange('differentialLock', v)}
            description="高锁止提高出弯牵引，低锁止改善稳定性"
            icon={<Settings size={16} />}
            color="text-fuel-gold"
            minLabel="自由"
            maxLabel="锁定"
          />

          <SetupSlider
            label="轮胎压力"
            value={setup.tirePressure}
            onChange={(v) => handleChange('tirePressure', v)}
            description="高压力提高响应，低压力改善抓地"
            icon={<Clock size={16} />}
            color="text-purple-400"
            minLabel="低压力"
            maxLabel="高压力"
          />
        </div>

        <div className="space-y-4">
          <div className="bg-carbon-900 p-4 rounded-lg">
            <h4 className="text-sm font-bold text-white mb-3">性能预测</h4>
            <div className="space-y-3">
              <ImpactBar
                label="下压力"
                value={parseInt(impact.downforce)}
                max={100}
                color="bg-racing-blue"
              />
              <ImpactBar
                label="极速"
                value={parseInt(impact.topSpeed)}
                max={100}
                color="bg-tire-green"
              />
              <ImpactBar
                label="弯道性能"
                value={parseInt(impact.cornering)}
                max={100}
                color="bg-fuel-gold"
              />
            </div>
          </div>

          <div className="bg-carbon-900 p-4 rounded-lg">
            <h4 className="text-sm font-bold text-white mb-3">风险因素</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">轮胎磨损</span>
                <span className={parseFloat(impact.tireWear) > 2 ? 'text-red-400' : 'text-gray-300'}>
                  +{impact.tireWear}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">刹车温度</span>
                <span className={parseFloat(impact.brakeTemp) > 10 ? 'text-red-400' : 'text-gray-300'}>
                  +{impact.brakeTemp}%
                </span>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg border-2 ${
            parseInt(impact.overall) > 80 ? 'bg-tire-green/20 border-tire-green' :
            parseInt(impact.overall) > 60 ? 'bg-fuel-gold/20 border-fuel-gold' :
            'bg-red-500/20 border-red-500'
          }`}>
            <div className="text-sm text-gray-300 mb-1">综合调校质量</div>
            <div className={`text-3xl font-bold ${
              parseInt(impact.overall) > 80 ? 'text-tire-green' :
              parseInt(impact.overall) > 60 ? 'text-fuel-gold' :
              'text-red-400'
            }`}>
              {impact.overall}%
            </div>
            <div className="text-xs text-gray-400 mt-2">
              {parseInt(impact.overall) > 80 ? '✨ 完美调校' :
               parseInt(impact.overall) > 60 ? '👍 良好设置' :
               '⚠️ 需要调整'}
            </div>
          </div>

          <div className="bg-carbon-900 p-4 rounded-lg">
            <h4 className="text-sm font-bold text-white mb-2">引擎模式</h4>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleChange('engineMode', mode)}
                  className={`p-2 rounded-lg border text-xs font-semibold transition-all ${
                    setup.engineMode === mode
                      ? mode === 'high'
                        ? 'bg-red-500/20 border-red-500 text-red-400'
                        : mode === 'medium'
                        ? 'bg-fuel-gold/20 border-fuel-gold text-fuel-gold'
                        : 'bg-tire-green/20 border-tire-green text-tire-green'
                      : 'bg-carbon-700 border-carbon-600 text-gray-400 hover:bg-carbon-600'
                  }`}
                >
                  {mode === 'high' ? '高功率' :
                   mode === 'medium' ? '均衡' : '省电'}
                </button>
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {setup.engineMode === 'high' ? '最大功率，油耗高' :
               setup.engineMode === 'medium' ? '平衡性能和油耗' :
               '降低功率，节省燃油'}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-carbon-900 p-4 rounded-lg">
        <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <AlertTriangle className="text-yellow-400" size={16} />
          调校提示
        </h4>
        <div className="text-xs text-gray-400 space-y-1">
          <p>• {trackType === 'highSpeed' ? '高速赛道：增加后翼角度提高极速' :
              trackType === 'technical' ? '技术赛道：提高前翼角度改善低速弯' :
              '混合赛道：平衡前后翼角度'}</p>
          <p>• 悬挂硬度根据路面颠簸程度调整</p>
          <p>• 刹车平衡50为中性，偏向后轮增加甩尾风险</p>
        </div>
      </div>
    </div>
  );
};

interface SetupSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  description: string;
  icon: React.ReactNode;
  color: string;
  minLabel: string;
  maxLabel: string;
}

const SetupSlider: React.FC<SetupSliderProps> = ({
  label,
  value,
  onChange,
  description,
  icon,
  color,
  minLabel,
  maxLabel
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={color}>{icon}</span>
          <span className="text-sm font-semibold text-white">{label}</span>
        </div>
        <span className="text-sm font-mono text-gray-300">{value}</span>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-carbon-600 rounded-lg appearance-none cursor-pointer slider"
        />
        <div
          className="absolute top-0 left-0 h-2 rounded-lg pointer-events-none"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, #3b82f6, #8b5cf6)`
          }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>{minLabel}</span>
        <span>{description}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
};

interface ImpactBarProps {
  label: string;
  value: number;
  max: number;
  color: string;
}

const ImpactBar: React.FC<ImpactBarProps> = ({ label, value, max, color }) => {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-white font-semibold">{value}</span>
      </div>
      <div className="w-full bg-carbon-700 rounded-full h-2">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
    </div>
  );
};

function getRecommendedSetup(car: Car, trackType: string): CarSetup {
  if (trackType === 'highSpeed') {
    return {
      frontWing: 40,
      rearWing: 45,
      suspension: 60,
      brakeBalance: 48,
      differentialLock: 55,
      tirePressure: 95,
      engineMode: 'high'
    };
  } else if (trackType === 'technical') {
    return {
      frontWing: 65,
      rearWing: 60,
      suspension: 70,
      brakeBalance: 52,
      differentialLock: 65,
      tirePressure: 100,
      engineMode: 'medium'
    };
  } else {
    return {
      frontWing: 50,
      rearWing: 50,
      suspension: 55,
      brakeBalance: 50,
      differentialLock: 60,
      tirePressure: 98,
      engineMode: 'medium'
    };
  }
}

function calculateSetupQuality(
  setup: CarSetup,
  car: Car,
  trackType: string
): string {
  let quality = 70;
  
  const recommended = getRecommendedSetup(car, trackType);
  
  quality -= Math.abs(setup.frontWing - recommended.frontWing) * 0.2;
  quality -= Math.abs(setup.rearWing - recommended.rearWing) * 0.2;
  quality -= Math.abs(setup.suspension - recommended.suspension) * 0.1;
  quality -= Math.abs(setup.brakeBalance - recommended.brakeBalance) * 0.1;
  
  if (setup.tirePressure < 90 || setup.tirePressure > 105) {
    quality -= 5;
  }
  
  return Math.max(0, Math.min(100, quality)).toFixed(0);
}
