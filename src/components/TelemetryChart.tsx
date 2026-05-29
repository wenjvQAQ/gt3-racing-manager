import React, { useEffect, useRef } from 'react';

interface TelemetryChartProps {
  data: number[];
  label: string;
  color: string;
  maxValue: number;
  unit: string;
  height?: number;
}

export const TelemetryChart: React.FC<TelemetryChartProps> = ({
  data,
  label,
  color,
  maxValue,
  unit,
  height = 60
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const canvasHeight = canvas.height;
    const padding = 10;

    ctx.clearRect(0, 0, width, canvasHeight);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, width, canvasHeight);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + ((canvasHeight - padding * 2) * i) / 4;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    if (data.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const stepX = (width - padding * 2) / (data.length - 1);

      data.forEach((value, index) => {
        const x = padding + index * stepX;
        const y = padding + (canvasHeight - padding * 2) * (1 - value / maxValue);

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      const gradient = ctx.createLinearGradient(0, padding, 0, canvasHeight - padding);
      gradient.addColorStop(0, `${color}40`);
      gradient.addColorStop(1, `${color}00`);

      ctx.lineTo(padding + (data.length - 1) * stepX, canvasHeight - padding);
      ctx.lineTo(padding, canvasHeight - padding);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`${label}: ${data[data.length - 1]?.toFixed(1) || 0}${unit}`, padding, padding - 2);
  }, [data, label, color, maxValue, unit]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={200}
        height={height}
        className="w-full rounded"
      />
    </div>
  );
};

interface StrategyPreset {
  id: string;
  name: string;
  stints: {
    tire: 'soft' | 'medium' | 'hard';
    laps: number;
    fuel: number;
    pushMode: 'push' | 'normal' | 'conserve';
  }[];
  description?: string;
}

export const STRATEGY_PRESETS: StrategyPreset[] = [
  {
    id: 'two_stop_soft_hard',
    name: '两停 软-硬',
    description: '激进策略，软胎起步换硬胎',
    stints: [
      { tire: 'soft', laps: 15, fuel: 95, pushMode: 'push' },
      { tire: 'medium', laps: 20, fuel: 90, pushMode: 'normal' },
      { tire: 'hard', laps: 15, fuel: 85, pushMode: 'conserve' }
    ]
  },
  {
    id: 'two_stop_medium_soft',
    name: '两停 中-软',
    description: '平衡策略，中胎起步换软胎',
    stints: [
      { tire: 'medium', laps: 18, fuel: 95, pushMode: 'normal' },
      { tire: 'soft', laps: 15, fuel: 90, pushMode: 'push' },
      { tire: 'medium', laps: 17, fuel: 85, pushMode: 'normal' }
    ]
  },
  {
    id: 'one_stop_hard_medium',
    name: '一停 硬-中',
    description: '保守策略，硬胎起步换中胎',
    stints: [
      { tire: 'hard', laps: 25, fuel: 100, pushMode: 'conserve' },
      { tire: 'medium', laps: 25, fuel: 90, pushMode: 'normal' }
    ]
  },
  {
    id: 'three_stop_soft_medium_hard',
    name: '三停 软-中-硬-软',
    description: '极限策略，追求最快圈速',
    stints: [
      { tire: 'soft', laps: 12, fuel: 95, pushMode: 'push' },
      { tire: 'medium', laps: 15, fuel: 90, pushMode: 'normal' },
      { tire: 'hard', laps: 12, fuel: 85, pushMode: 'normal' },
      { tire: 'soft', laps: 11, fuel: 80, pushMode: 'push' }
    ]
  }
];

export function saveStrategyPreset(preset: StrategyPreset): void {
  const existing = JSON.parse(localStorage.getItem('strategy_presets') || '[]');
  const index = existing.findIndex((p: StrategyPreset) => p.id === preset.id);
  if (index >= 0) {
    existing[index] = preset;
  } else {
    existing.push(preset);
  }
  localStorage.setItem('strategy_presets', JSON.stringify(existing));
}

export function loadStrategyPresets(): StrategyPreset[] {
  const saved = JSON.parse(localStorage.getItem('strategy_presets') || '[]');
  return [...STRATEGY_PRESETS, ...saved];
}

export function deleteStrategyPreset(id: string): void {
  const existing = JSON.parse(localStorage.getItem('strategy_presets') || '[]');
  const filtered = existing.filter((p: StrategyPreset) => p.id !== id);
  localStorage.setItem('strategy_presets', JSON.stringify(filtered));
}
