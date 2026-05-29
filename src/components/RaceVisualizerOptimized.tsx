import React, { useRef, useEffect, useState } from 'react';
import {
  RaceTrack,
  CarState,
  SimulationEvent,
  getXYFromTrackPosition,
  getAngleAtPosition,
  Vec2
} from '../types/track';

interface RaceVisualizerOptimizedProps {
  track: RaceTrack;
  cars: CarState[];
  events: SimulationEvent[];
  selectedCarId?: string;
  selectedDataLayer?: 'none' | 'tires' | 'performance' | 'fuel';
  isPaused?: boolean;
  speed?: number;
}

export const RaceVisualizerOptimized: React.FC<RaceVisualizerOptimizedProps> = ({
  track,
  cars,
  events,
  selectedCarId,
  selectedDataLayer = 'none',
  isPaused = true,
  speed = 1
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number>();
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const container = canvas.parentElement;
    if (!container) return;
    
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setCanvasSize({ width: Math.floor(width), height: Math.floor(height) });
      }
    });
    
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);
  
  useEffect(() => {
    if (!bgCanvasRef.current) {
      bgCanvasRef.current = document.createElement('canvas');
    }
    
    const bgCanvas = bgCanvasRef.current;
    bgCanvas.width = canvasSize.width;
    bgCanvas.height = canvasSize.height;
    
    const ctx = bgCanvas.getContext('2d');
    if (ctx) {
      renderTrackBackground(ctx, track, canvasSize.width, canvasSize.height);
    }
  }, [track, canvasSize]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx || !bgCanvasRef.current) return;
    
    const render = () => {
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
      
      ctx.drawImage(bgCanvasRef.current, 0, 0);
      
      renderDynamicLayer(ctx, track, cars, canvasSize, selectedCarId);
      
      if (selectedDataLayer !== 'none') {
        renderHeatmap(ctx, track, cars, canvasSize, selectedDataLayer);
      }
      
      if (!isPaused) {
        animationRef.current = requestAnimationFrame(render);
      }
    };
    
    if (!isPaused) {
      animationRef.current = requestAnimationFrame(render);
    } else {
      render();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [track, cars, canvasSize, selectedCarId, selectedDataLayer, isPaused, speed]);
  
  return (
    <div className="relative w-full h-full bg-carbon-900 rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="w-full h-full"
      />
      
      <div className="absolute top-3 left-3 bg-black/80 p-3 rounded-lg">
        <div className="text-white text-sm">
          <div className="font-bold">{track.name}</div>
          <div className="text-gray-400 text-xs">{track.country}</div>
        </div>
      </div>
      
      <div className="absolute top-3 right-3 bg-black/80 p-3 rounded-lg">
        {selectedCarId && (
          <>
            {(() => {
              const car = cars.find(c => c.carId === selectedCarId);
              if (!car) return null;
              return (
                <div className="text-fuel-gold text-sm">
                  <div className="font-bold">P{car.currentPosition}</div>
                  <div className="text-xs">{car.gapToLeader}</div>
                </div>
              );
            })()}
          </>
        )}
      </div>
      
      <div className="absolute bottom-3 left-3 bg-black/80 p-2 rounded-lg flex gap-3">
        <div className="flex items-center gap-1 text-xs">
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <span className="text-gray-300">领先</span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <div className="w-3 h-3 rounded-full bg-blue-400"></div>
          <span className="text-gray-300">你的车队</span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <div className="w-3 h-3 rounded-full bg-gray-500"></div>
          <span className="text-gray-300">其他</span>
        </div>
      </div>
    </div>
  );
};

function renderTrackBackground(
  ctx: CanvasRenderingContext2D,
  track: RaceTrack,
  width: number,
  height: number
) {
  ctx.clearRect(0, 0, width, height);
  
  const bounds = getTrackBounds(track);
  const scale = Math.min(
    (width - 40) / (bounds.maxX - bounds.minX),
    (height - 40) / (bounds.maxY - bounds.minY)
  );
  
  const offsetX = (width - (bounds.maxX - bounds.minX) * scale) / 2 - bounds.minX * scale;
  const offsetY = (height - (bounds.maxY - bounds.minY) * scale) / 2 - bounds.minY * scale;
  
  const scaledCenterline = track.centerline.map(pt => ({
    x: pt.x * scale + offsetX,
    y: pt.y * scale + offsetY
  }));
  
  const halfWidth = (track.width * scale) / 2;
  const leftEdge: Vec2[] = [];
  const rightEdge: Vec2[] = [];
  
  for (let i = 0; i < scaledCenterline.length; i++) {
    const pt = scaledCenterline[i];
    const nextPt = scaledCenterline[(i + 1) % scaledCenterline.length];
    
    const dx = nextPt.x - pt.x;
    const dy = nextPt.y - pt.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    
    if (len === 0) continue;
    
    const nx = -dy / len;
    const ny = dx / len;
    
    leftEdge.push({ x: pt.x + nx * halfWidth, y: pt.y + ny * halfWidth });
    rightEdge.push({ x: pt.x - nx * halfWidth, y: pt.y - ny * halfWidth });
  }
  
  ctx.beginPath();
  ctx.moveTo(leftEdge[0].x, leftEdge[0].y);
  for (let i = 1; i < leftEdge.length; i++) {
    ctx.lineTo(leftEdge[i].x, leftEdge[i].y);
  }
  for (let i = rightEdge.length - 1; i >= 0; i--) {
    ctx.lineTo(rightEdge[i].x, rightEdge[i].y);
  }
  ctx.closePath();
  ctx.fillStyle = '#333';
  ctx.fill();
  
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  const startPt = scaledCenterline[track.startFinishLineIndex];
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(startPt.x - halfWidth, startPt.y - 10);
  ctx.lineTo(startPt.x + halfWidth, startPt.y - 10);
  ctx.stroke();
  
  ctx.fillStyle = '#000';
  ctx.fillRect(startPt.x - 5, startPt.y - halfWidth, 10, halfWidth * 2);
  
  for (const corner of track.corners) {
    const pt = scaledCenterline[corner.index % scaledCenterline.length];
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(corner.cornerNumber.toString(), pt.x, pt.y - 15);
    
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ff0';
    ctx.fill();
  }
  
  for (const boundary of track.sectorBoundaries) {
    if (boundary.index === 0) continue;
    
    const idx = Math.min(boundary.index, scaledCenterline.length - 1);
    const pt = scaledCenterline[idx];
    const nextIdx = Math.min(idx + 1, scaledCenterline.length - 1);
    const nextPt = scaledCenterline[nextIdx];
    
    const dx = nextPt.x - pt.x;
    const dy = nextPt.y - pt.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    
    if (len === 0) continue;
    
    const nx = -dy / len;
    const ny = dx / len;
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(pt.x + nx * halfWidth * 1.2, pt.y + ny * halfWidth * 1.2);
    ctx.lineTo(pt.x - nx * halfWidth * 1.2, pt.y - ny * halfWidth * 1.2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

function renderDynamicLayer(
  ctx: CanvasRenderingContext2D,
  track: RaceTrack,
  cars: CarState[],
  canvasSize: { width: number; height: number },
  selectedCarId?: string
) {
  const bounds = getTrackBounds(track);
  const scale = Math.min(
    (canvasSize.width - 40) / (bounds.maxX - bounds.minX),
    (canvasSize.height - 40) / (bounds.maxY - bounds.minY)
  );
  
  const offsetX = (canvasSize.width - (bounds.maxX - bounds.minX) * scale) / 2 - bounds.minX * scale;
  const offsetY = (canvasSize.height - (bounds.maxY - bounds.minY) * scale) / 2 - bounds.minY * scale;
  
  for (const car of cars) {
    if (car.isRetired) continue;
    
    const pos = getXYFromTrackPosition(track, car.positionOnTrack);
    const angle = getAngleAtPosition(track, car.positionOnTrack);
    
    const screenX = pos.x * scale + offsetX;
    const screenY = pos.y * scale + offsetY;
    
    const isSelected = car.carId === selectedCarId;
    const isPlayer = car.teamName.includes('Your Team');
    
    const carRadius = isSelected ? 8 : 6;
    
    if (isSelected) {
      ctx.strokeStyle = '#ff0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(screenX, screenY, carRadius + 4, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.rotate(angle);
    
    ctx.beginPath();
    ctx.arc(0, 0, carRadius, 0, Math.PI * 2);
    ctx.fillStyle = isPlayer ? '#ffd700' : car.teamColor;
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(carRadius, 0);
    ctx.lineTo(-carRadius / 2, -carRadius / 2);
    ctx.lineTo(-carRadius / 2, carRadius / 2);
    ctx.closePath();
    ctx.fillStyle = '#fff';
    ctx.fill();
    
    ctx.restore();
    
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 9px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(car.currentPosition.toString(), screenX, screenY);
    
    if (isPlayer || isSelected) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(screenX - 25, screenY - 22, 50, 14);
      
      ctx.fillStyle = isPlayer ? '#ffd700' : '#fff';
      ctx.font = '10px Arial';
      ctx.fillText(car.driverName, screenX, screenY - 15);
    }
  }
}

function renderHeatmap(
  ctx: CanvasRenderingContext2D,
  track: RaceTrack,
  cars: CarState[],
  canvasSize: { width: number; height: number },
  layer: 'tires' | 'performance' | 'fuel'
) {
  const playerCar = cars.find(c => c.teamName.includes('Your Team'));
  if (!playerCar) return;
  
  const bounds = getTrackBounds(track);
  const scale = Math.min(
    (canvasSize.width - 40) / (bounds.maxX - bounds.minX),
    (canvasSize.height - 40) / (bounds.maxY - bounds.minY)
  );
  
  const offsetX = (canvasSize.width - (bounds.maxX - bounds.minX) * scale) / 2 - bounds.minX * scale;
  const offsetY = (canvasSize.height - (bounds.maxY - bounds.minY) * scale) / 2 - bounds.minY * scale;
  
  ctx.globalAlpha = 0.3;
  
  if (layer === 'tires') {
    const avgTire = (
      playerCar.tireCondition.frontLeft +
      playerCar.tireCondition.frontRight +
      playerCar.tireCondition.rearLeft +
      playerCar.tireCondition.rearRight
    ) / 4;
    
    const red = Math.floor((1 - avgTire) * 255);
    const green = Math.floor(avgTire * 255);
    
    ctx.strokeStyle = `rgb(${red}, ${green}, 0)`;
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    const startIdx = 0;
    const endIdx = track.centerline.length;
    
    for (let i = startIdx; i < endIdx; i++) {
      const pt = track.centerline[i];
      const x = pt.x * scale + offsetX;
      const y = pt.y * scale + offsetY;
      
      if (i === startIdx) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  } else if (layer === 'performance') {
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    for (let i = 0; i < track.centerline.length; i++) {
      const pt = track.centerline[i];
      const x = pt.x * scale + offsetX;
      const y = pt.y * scale + offsetY;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  } else if (layer === 'fuel') {
    const fuelLevel = playerCar.fuelLoad / 100;
    const red = Math.floor((1 - fuelLevel) * 255);
    const green = Math.floor(fuelLevel * 255);
    
    ctx.strokeStyle = `rgba(${red}, ${green}, 0, 0.4)`;
    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    for (let i = 0; i < track.centerline.length; i++) {
      const pt = track.centerline[i];
      const x = pt.x * scale + offsetX;
      const y = pt.y * scale + offsetY;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  }
  
  ctx.globalAlpha = 1.0;
}

function getTrackBounds(track: RaceTrack) {
  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;
  
  for (const pt of track.centerline) {
    minX = Math.min(minX, pt.x);
    minY = Math.min(minY, pt.y);
    maxX = Math.max(maxX, pt.x);
    maxY = Math.max(maxY, pt.y);
  }
  
  return { minX, minY, maxX, maxY };
}
