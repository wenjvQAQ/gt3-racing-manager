import React, { useEffect, useRef, useState } from 'react';
import type { Track } from '../types/game';
import { LiveRaceData, RaceEvent } from '../utils/raceSimulation';

interface RaceVisualizerProps {
  track: Track;
  liveData: LiveRaceData;
  raceEvents: RaceEvent[];
  isPaused: boolean;
  speed: number;
  selectedDataLayer: 'none' | 'tires' | 'performance' | 'fuel';
}

interface CarState {
  id: number;
  name: string;
  team: string;
  color: string;
  position: number;
  lap: number;
  progress: number;
  pace: number;
  tireCondition: number;
  gap: string;
  isPlayer: boolean;
}

export const RaceVisualizer: React.FC<RaceVisualizerProps> = ({
  track,
  liveData,
  raceEvents,
  isPaused,
  speed,
  selectedDataLayer = 'none'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [cars, setCars] = useState<CarState[]>([]);
  const [hoveredCar, setHoveredCar] = useState<number | null>(null);

  const trackPath = generateTrackPath(800, 500, track.trackType);

  useEffect(() => {
    const initialCars: CarState[] = [
      { id: 1, name: 'J. Evans', team: 'Audi Sport', color: '#ff0000', position: 1, lap: 1, progress: 0.1, pace: 90, tireCondition: 95, gap: '0.000', isPlayer: false },
      { id: 2, name: liveData.driver.name, team: 'Your Team', color: '#ffd700', position: 2, lap: 1, progress: 0.08, pace: 89, tireCondition: liveData.tireCondition, gap: liveData.gapToLeader, isPlayer: true },
      { id: 3, name: 'M. Rossi', team: 'Ferrari', color: '#dc143c', position: 3, lap: 1, progress: 0.06, pace: 88, tireCondition: 92, gap: '+3.120', isPlayer: false },
      { id: 4, name: 'S. Müller', team: 'Mercedes', color: '#00d4ff', position: 4, lap: 1, progress: 0.05, pace: 87, tireCondition: 90, gap: '+5.890', isPlayer: false },
      { id: 5, name: 'K. Tanaka', team: 'Honda', color: '#0066ff', position: 5, lap: 1, progress: 0.04, pace: 86, tireCondition: 88, gap: '+8.456', isPlayer: false },
      { id: 6, name: 'A. Dubois', team: 'BMW', color: '#0066b3', position: 6, lap: 1, progress: 0.03, pace: 85, tireCondition: 85, gap: '+10.234', isPlayer: false },
      { id: 7, name: 'P. Santos', team: 'Lamborghini', color: '#00ff00', position: 7, lap: 1, progress: 0.02, pace: 84, tireCondition: 87, gap: '+12.567', isPlayer: false },
      { id: 8, name: 'L. Chen', team: 'McLaren', color: '#ff6600', position: 8, lap: 1, progress: 0.01, pace: 83, tireCondition: 82, gap: '+15.890', isPlayer: false },
    ];
    setCars(initialCars);
  }, [liveData.driver.name, liveData.tireCondition, liveData.gapToLeader]);

  useEffect(() => {
    if (isPaused) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const animate = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      drawLayer1_TrackInfrastructure(ctx, trackPath, canvasWidth, canvasHeight, track.trackType);
      
      if (selectedDataLayer !== 'none') {
        drawLayer3_DataHeatmap(ctx, trackPath, cars, selectedDataLayer);
      }
      
      drawLayer2_DynamicRaceInfo(ctx, trackPath, cars, hoveredCar);
      
      drawTrackLabels(ctx, trackPath, track);

      ctx.clearRect(0, 0, canvasWidth, 50);
      drawRaceInfoOverlay(ctx, liveData, canvasWidth);
      
      drawCarLabels(ctx, trackPath, cars, hoveredCar);

      setCars(prevCars => {
        return prevCars.map(car => {
          let newProgress = car.progress + (speed * 0.0003 * (car.pace / 85));
          let newLap = car.lap;
          if (newProgress >= 1) {
            newProgress = 0;
            newLap += 1;
          }
          return { ...car, progress: newProgress, lap: newLap };
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, speed, selectedDataLayer, track.trackType, track.name]);

  return (
    <div className="relative bg-carbon-900 rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        className="w-full h-auto cursor-pointer"
        onMouseMove={(e) => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const rect = canvas.getBoundingClientRect();
          const scaleX = canvas.width / rect.width;
          const scaleY = canvas.height / rect.height;
          const x = (e.clientX - rect.left) * scaleX;
          const y = (e.clientY - rect.top) * scaleY;
          
          let found = false;
          for (const car of cars) {
            const coords = getPositionOnTrack(trackPath, car.progress);
            const distance = Math.sqrt((coords.x - x) ** 2 + (coords.y - y) ** 2);
            if (distance < 20) {
              setHoveredCar(car.id);
              found = true;
              break;
            }
          }
          if (!found) setHoveredCar(null);
        }}
        onMouseLeave={() => setHoveredCar(null)}
      />

      <div className="absolute top-3 left-3 bg-black/90 p-3 rounded-lg text-white text-xs">
        <div className="font-bold mb-1">{track.name}</div>
        <div className="opacity-80">第 {liveData.currentLap} / {liveData.totalLaps} 圈</div>
        <div className="opacity-80">⏱️ {liveData.raceTime.toFixed(1)}s</div>
      </div>

      <div className="absolute top-3 right-3 bg-black/90 p-3 rounded-lg">
        <div className="text-fuel-gold font-bold text-xl">P{liveData.position}</div>
        <div className="text-xs text-gray-300">{liveData.gapToLeader}</div>
      </div>

      <div className="absolute bottom-3 right-3 bg-black/90 p-2 rounded-lg flex gap-2">
        <div className="flex items-center gap-1 text-xs">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-gray-300">P1</span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <div className="w-3 h-3 rounded-full bg-fuel-gold"></div>
          <span className="text-gray-300">你</span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-gray-300">对手</span>
        </div>
      </div>

      {liveData.isSafetyCar && (
        <div className="absolute inset-0 bg-yellow-500/10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold animate-pulse text-sm">
            🚨 安全车出动 🚨
          </div>
        </div>
      )}

      {hoveredCar !== null && (
        <div className="absolute bottom-3 left-3 bg-black/90 p-3 rounded-lg text-white text-xs">
          {(() => {
            const car = cars.find(c => c.id === hoveredCar);
            if (!car) return null;
            return (
              <div>
                <div className="font-bold">{car.name}</div>
                <div className="opacity-80">{car.team}</div>
                <div className="mt-1 space-y-0.5">
                  <div>位置: P{car.position}</div>
                  <div>差距: {car.gap}</div>
                  <div>轮胎: {car.tireCondition.toFixed(0)}%</div>
                  <div>圈数: {car.lap}</div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

function generateTrackPath(
  width: number,
  height: number,
  trackType: string
): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  const centerX = width / 2;
  const centerY = height / 2;
  const radiusX = width * 0.38;
  const radiusY = height * 0.38;

  if (trackType === 'highSpeed') {
    for (let i = 0; i <= 360; i += 5) {
      const angle = (i * Math.PI) / 180;
      const x = centerX + Math.cos(angle) * radiusX;
      const y = centerY + Math.sin(angle) * radiusY;
      points.push({ x, y });
    }
  } else if (trackType === 'technical') {
    const points2 = [
      { x: centerX - radiusX, y: centerY - radiusY * 0.6 },
      { x: centerX - radiusX * 0.6, y: centerY - radiusY },
      { x: centerX + radiusX * 0.2, y: centerY - radiusY * 0.9 },
      { x: centerX + radiusX * 0.8, y: centerY - radiusY * 0.4 },
      { x: centerX + radiusX, y: centerY + radiusY * 0.2 },
      { x: centerX + radiusX * 0.7, y: centerY + radiusY * 0.7 },
      { x: centerX + radiusX * 0.1, y: centerY + radiusY },
      { x: centerX - radiusX * 0.5, y: centerY + radiusY * 0.6 },
      { x: centerX - radiusX, y: centerY - radiusY * 0.6 },
    ];

    for (let i = 0; i < points2.length; i++) {
      const p0 = points2[(i - 1 + points2.length) % points2.length];
      const p1 = points2[i];
      const p2 = points2[(i + 1) % points2.length];
      const p3 = points2[(i + 2) % points2.length];

      for (let t = 0; t < 1; t += 0.05) {
        const t2 = t * t;
        const t3 = t2 * t;
        const x = 0.5 * (
          (2 * p1.x) +
          (-p0.x + p2.x) * t +
          (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
          (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
        );
        const y = 0.5 * (
          (2 * p1.y) +
          (-p0.y + p2.y) * t +
          (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
          (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
        );
        points.push({ x, y });
      }
    }
  } else {
    for (let i = 0; i <= 360; i += 5) {
      const angle = (i * Math.PI) / 180;
      const noise = Math.sin(angle * 3) * 25;
      const x = centerX + (Math.cos(angle) * radiusX + noise);
      const y = centerY + (Math.sin(angle) * radiusY + noise * 0.7);
      points.push({ x, y });
    }
  }

  return points;
}

function drawLayer1_TrackInfrastructure(
  ctx: CanvasRenderingContext2D,
  trackPath: { x: number; y: number }[],
  width: number,
  height: number,
  trackType: string
) {
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 50;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  trackPath.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.closePath();
  ctx.stroke();

  ctx.strokeStyle = '#333';
  ctx.lineWidth = 45;
  ctx.stroke();

  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 38;
  ctx.stroke();

  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1;
  ctx.setLineDash([15, 15]);
  ctx.stroke();
  ctx.setLineDash([]);

  const startPoint = trackPath[0];
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(startPoint.x - 30, startPoint.y - 5, 20, 10);
  
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(startPoint.x - 10, startPoint.y - 5, 20, 10);
  
  ctx.fillStyle = '#0000ff';
  ctx.fillRect(startPoint.x + 10, startPoint.y - 5, 20, 10);
}

function drawLayer2_DynamicRaceInfo(
  ctx: CanvasRenderingContext2D,
  trackPath: { x: number; y: number }[],
  cars: CarState[],
  hoveredCar: number | null
) {
  cars.forEach((car) => {
    const coords = getPositionOnTrack(trackPath, car.progress);
    const size = car.isPlayer ? 14 : 12;
    
    const nextIndex = (Math.floor(car.progress * trackPath.length) + 5) % trackPath.length;
    const nextCoords = trackPath[nextIndex];
    const angle = Math.atan2(nextCoords.y - coords.y, nextCoords.x - coords.x);

    if (car.id === hoveredCar) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(coords.x, coords.y, size + 6, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = car.color;
    ctx.beginPath();
    ctx.arc(coords.x, coords.y, size, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(coords.x, coords.y);
    ctx.rotate(angle);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(size - 2, 0);
    ctx.lineTo(-size + 2, -size / 2);
    ctx.lineTo(-size + 2, size / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    if (car.isPlayer) {
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(coords.x, coords.y, size + 3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${car.position}`, coords.x, coords.y);
  });
}

function drawLayer3_DataHeatmap(
  ctx: CanvasRenderingContext2D,
  trackPath: { x: number; y: number }[],
  cars: CarState[],
  dataLayer: string
) {
  if (dataLayer === 'tires') {
    const playerCar = cars.find(c => c.isPlayer);
    if (!playerCar) return;

    const alpha = Math.max(0, (100 - playerCar.tireCondition) / 100) * 0.5;
    
    ctx.strokeStyle = `rgba(255, 100, 0, ${alpha})`;
    ctx.lineWidth = 45;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = 0.3;
    
    ctx.beginPath();
    trackPath.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.closePath();
    ctx.stroke();
    
    ctx.globalAlpha = 1;
  } else if (dataLayer === 'performance') {
    const playerCar = cars.find(c => c.isPlayer);
    if (!playerCar) return;

    ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
    ctx.lineWidth = 45;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    trackPath.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = '#00ff00';
    ctx.font = '10px Arial';
    ctx.fillText(`P${playerCar.position}: ${playerCar.pace}%`, 60, 70);
  } else if (dataLayer === 'fuel') {
    const playerCar = cars.find(c => c.isPlayer);
    if (!playerCar) return;

    const fuelLevel = playerCar.pace / 100;
    const red = Math.floor((1 - fuelLevel) * 255);
    const green = Math.floor(fuelLevel * 255);
    
    ctx.strokeStyle = `rgba(${red}, ${green}, 0, 0.4)`;
    ctx.lineWidth = 45;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    trackPath.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.closePath();
    ctx.stroke();
  }
}

function drawTrackLabels(
  ctx: CanvasRenderingContext2D,
  trackPath: { x: number; y: number }[],
  track: Track
) {
  const labels = [
    { index: 0, text: '起终点线' },
    { index: Math.floor(trackPath.length * 0.25), text: 'T1' },
    { index: Math.floor(trackPath.length * 0.5), text: 'T2' },
    { index: Math.floor(trackPath.length * 0.75), text: 'T3' },
  ];

  ctx.font = 'bold 10px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  labels.forEach(({ index, text }) => {
    const point = trackPath[index];
    const nextPoint = trackPath[(index + 1) % trackPath.length];
    const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x);
    const perpAngle = angle + Math.PI / 2;
    const offset = 35;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(point.x + Math.cos(perpAngle) * offset - 12, point.y + Math.sin(perpAngle) * offset - 8, 24, 16);
    
    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, point.x + Math.cos(perpAngle) * offset, point.y + Math.sin(perpAngle) * offset);
  });
}

function drawCarLabels(
  ctx: CanvasRenderingContext2D,
  trackPath: { x: number; y: number }[],
  cars: CarState[],
  hoveredCar: number | null
) {
  cars.forEach((car) => {
    const coords = getPositionOnTrack(trackPath, car.progress);
    const offsetY = -25;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(coords.x - 20, coords.y + offsetY - 8, 40, 14);
    
    ctx.font = '9px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = car.isPlayer ? '#ffd700' : '#cccccc';
    ctx.fillText(car.name, coords.x, coords.y + offsetY);
  });
}

function drawRaceInfoOverlay(
  ctx: CanvasRenderingContext2D,
  liveData: LiveRaceData,
  width: number
) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
  ctx.fillRect(0, 0, width, 45);
  
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(`🏁 ${liveData.currentLap}/${liveData.totalLaps}`, 20, 28);
  
  ctx.textAlign = 'center';
  ctx.fillText(`⏱️ ${liveData.raceTime.toFixed(1)}s`, width / 2, 28);
  
  ctx.textAlign = 'right';
  ctx.fillStyle = '#ffd700';
  ctx.fillText(`P${liveData.position} | ${liveData.gapToLeader}`, width - 20, 28);
}

function getPositionOnTrack(
  trackPath: { x: number; y: number }[],
  progress: number
): { x: number; y: number } {
  const index = Math.floor(progress * trackPath.length) % trackPath.length;
  const nextIndex = (index + 1) % trackPath.length;
  const localProgress = (progress * trackPath.length) % 1;
  
  const p1 = trackPath[index];
  const p2 = trackPath[nextIndex];
  
  return {
    x: p1.x + (p2.x - p1.x) * localProgress,
    y: p1.y + (p2.y - p1.y) * localProgress
  };
}
