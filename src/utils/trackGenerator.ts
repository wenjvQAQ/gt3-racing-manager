import {
  RaceTrack,
  Vec2,
  TrackSegment,
  SectorBoundary,
  generateId
} from '../types/track';

export function generateTrackCenterline(
  controlPoints: Vec2[],
  numPoints: number = 500
): Vec2[] {
  const centerline: Vec2[] = [];
  
  for (let i = 0; i < controlPoints.length; i++) {
    const p0 = controlPoints[(i - 1 + controlPoints.length) % controlPoints.length];
    const p1 = controlPoints[i];
    const p2 = controlPoints[(i + 1) % controlPoints.length];
    const p3 = controlPoints[(i + 2) % controlPoints.length];
    
    const segmentPoints = Math.floor(numPoints / controlPoints.length);
    const startIdx = i * segmentPoints;
    const endIdx = (i + 1) * segmentPoints;
    
    for (let j = startIdx; j < endIdx && centerline.length < numPoints; j++) {
      const t = (j - startIdx) / segmentPoints;
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
      
      centerline.push({ x, y });
    }
  }
  
  while (centerline.length < numPoints) {
    centerline.push(centerline[centerline.length - 1]);
  }
  
  return centerline.slice(0, numPoints);
}

export function calculateCumulativeDistances(centerline: Vec2[]): number[] {
  const distances: number[] = [0];
  
  for (let i = 1; i < centerline.length; i++) {
    const dx = centerline[i].x - centerline[i - 1].x;
    const dy = centerline[i].y - centerline[i - 1].y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    distances.push(distances[i - 1] + distance);
  }
  
  return distances;
}

export function calculateTotalLength(cumulativeDistances: number[]): number {
  return cumulativeDistances[cumulativeDistances.length - 1];
}

export function createTrackSegments(
  centerline: Vec2[],
  numSegments: number = 10
): TrackSegment[] {
  const segments: TrackSegment[] = [];
  const pointsPerSegment = Math.floor(centerline.length / numSegments);
  
  for (let i = 0; i < numSegments; i++) {
    const startIdx = i * pointsPerSegment;
    const endIdx = Math.min((i + 1) * pointsPerSegment, centerline.length - 1);
    
    const segmentLength = calculateSegmentLength(centerline, startIdx, endIdx);
    const curvature = calculateSegmentCurvature(centerline, startIdx, endIdx);
    
    let type: TrackSegment['type'];
    if (curvature < 0.1) {
      type = 'straight';
    } else if (curvature < 0.3) {
      type = 'high_speed_corner';
    } else if (curvature < 0.6) {
      type = 'medium_speed_corner';
    } else if (curvature < 1.0) {
      type = 'low_speed_corner';
    } else {
      type = 'hairpin';
    }
    
    segments.push({
      id: i,
      type,
      startIndex: startIdx,
      endIndex: endIdx,
      length: segmentLength,
      cornerRadius: curvature
    });
  }
  
  return segments;
}

function calculateSegmentLength(
  centerline: Vec2[],
  startIdx: number,
  endIdx: number
): number {
  let length = 0;
  
  for (let i = startIdx; i < endIdx; i++) {
    const dx = centerline[i + 1].x - centerline[i].x;
    const dy = centerline[i + 1].y - centerline[i].y;
    length += Math.sqrt(dx * dx + dy * dy);
  }
  
  return length;
}

function calculateSegmentCurvature(
  centerline: Vec2[],
  startIdx: number,
  endIdx: number
): number {
  let totalCurvature = 0;
  let count = 0;
  
  for (let i = startIdx + 1; i < endIdx - 1; i++) {
    const p1 = centerline[i - 1];
    const p2 = centerline[i];
    const p3 = centerline[i + 1];
    
    const v1 = { x: p2.x - p1.x, y: p2.y - p1.y };
    const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
    
    const cross = v1.x * v2.y - v1.y * v2.x;
    const dot = v1.x * v2.x + v1.y * v2.y;
    
    const angle = Math.abs(Math.atan2(cross, dot));
    totalCurvature += angle;
    count++;
  }
  
  return count > 0 ? totalCurvature / count : 0;
}

export function createSectorBoundaries(centerline: Vec2[]): SectorBoundary[] {
  const sector1End = Math.floor(centerline.length * 0.33);
  const sector2End = Math.floor(centerline.length * 0.66);
  
  return [
    { index: 0, name: '起点/终点线' },
    { index: sector1End, name: '第一计时点' },
    { index: sector2End, name: '第二计时点' },
    { index: centerline.length - 1, name: '终点' }
  ];
}

export function createSimpleTrack(
  name: string,
  country: string,
  width: number = 20
): RaceTrack {
  const centerX = 400;
  const centerY = 300;
  const radiusX = 300;
  const radiusY = 200;
  
  const numPoints = 400;
  const centerline: Vec2[] = [];
  
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const noise = Math.sin(angle * 3) * 20;
    
    centerline.push({
      x: centerX + Math.cos(angle) * radiusX + noise,
      y: centerY + Math.sin(angle) * radiusY + noise * 0.7
    });
  }
  
  const cumulativeDistances = calculateCumulativeDistances(centerline);
  const totalLength = calculateTotalLength(cumulativeDistances);
  const trackSegments = createTrackSegments(centerline, 12);
  const sectorBoundaries = createSectorBoundaries(centerline);
  
  return {
    id: generateId('track'),
    name,
    country,
    centerline,
    width,
    totalLength,
    cumulativeDistances,
    trackSegments,
    corners: [],
    sectorBoundaries,
    startFinishLineIndex: 0,
    pitEntryIndex: Math.floor(numPoints * 0.9),
    pitExitIndex: Math.floor(numPoints * 0.05),
    pitLanePath: []
  };
}

export function createSPACircuit(): RaceTrack {
  const controlPoints: Vec2[] = [
    { x: 200, y: 500 },
    { x: 150, y: 400 },
    { x: 180, y: 300 },
    { x: 250, y: 200 },
    { x: 350, y: 150 },
    { x: 500, y: 120 },
    { x: 650, y: 100 },
    { x: 750, y: 150 },
    { x: 800, y: 250 },
    { x: 780, y: 350 },
    { x: 700, y: 400 },
    { x: 600, y: 420 },
    { x: 500, y: 450 },
    { x: 400, y: 480 },
    { x: 300, y: 520 },
    { x: 220, y: 550 },
    { x: 200, y: 500 }
  ];
  
  const centerline = generateTrackCenterline(controlPoints, 600);
  const cumulativeDistances = calculateCumulativeDistances(centerline);
  const totalLength = calculateTotalLength(cumulativeDistances);
  
  return {
    id: 'spa',
    name: 'Circuit de Spa-Francorchamps',
    country: '比利时',
    centerline,
    width: 15,
    totalLength,
    cumulativeDistances,
    trackSegments: createTrackSegments(centerline, 20),
    corners: [
      { id: 'la_source', name: 'La Source', index: 50, cornerNumber: 1, type: 'heavy_braking' },
      { id: 'eau_rouge', name: 'Eau Rouge', index: 200, cornerNumber: 3, type: 'sweeping' },
      { id: 'raidillon', name: 'Raidillon', index: 220, cornerNumber: 4, type: 'sweeping' },
      { id: 'les_combes', name: 'Les Combes', index: 350, cornerNumber: 5, type: 'off_camber' },
      { id: 'bruxelles', name: 'Bruxelles', index: 420, cornerNumber: 7, type: 'heavy_braking' },
      { id: 'stavelot', name: 'Stavelot', index: 480, cornerNumber: 9, type: 'off_camber' },
      { id: 'blanchimont', name: 'Blanchimont', index: 530, cornerNumber: 16, type: 'sweeping' }
    ],
    sectorBoundaries: createSectorBoundaries(centerline),
    startFinishLineIndex: 0,
    pitEntryIndex: 550,
    pitExitIndex: 30,
    pitLanePath: []
  };
}

export function createMonzaCircuit(): RaceTrack {
  const controlPoints: Vec2[] = [
    { x: 100, y: 300 },
    { x: 150, y: 250 },
    { x: 200, y: 200 },
    { x: 300, y: 150 },
    { x: 450, y: 120 },
    { x: 600, y: 100 },
    { x: 750, y: 150 },
    { x: 800, y: 250 },
    { x: 820, y: 350 },
    { x: 800, y: 450 },
    { x: 750, y: 520 },
    { x: 650, y: 550 },
    { x: 500, y: 560 },
    { x: 350, y: 550 },
    { x: 200, y: 520 },
    { x: 100, y: 450 },
    { x: 80, y: 350 },
    { x: 100, y: 300 }
  ];
  
  const centerline = generateTrackCenterline(controlPoints, 500);
  const cumulativeDistances = calculateCumulativeDistances(centerline);
  const totalLength = calculateTotalLength(cumulativeDistances);
  
  return {
    id: 'monza',
    name: 'Autodromo Nazionale Monza',
    country: '意大利',
    centerline,
    width: 18,
    totalLength,
    cumulativeDistances,
    trackSegments: createTrackSegments(centerline, 15),
    corners: [
      { id: 'variante_roja', name: 'Variante Rossa', index: 80, cornerNumber: 1, type: 'heavy_braking' },
      { id: 'curvone', name: 'Curvone', index: 200, cornerNumber: 3, type: 'sweeping' },
      { id: 'ascari', name: 'Variante Ascari', index: 350, cornerNumber: 8, type: 'heavy_braking' },
      { id: 'gerbido', name: 'Gerbido', index: 380, cornerNumber: 9, type: 'heavy_braking' }
    ],
    sectorBoundaries: createSectorBoundaries(centerline),
    startFinishLineIndex: 0,
    pitEntryIndex: 460,
    pitExitIndex: 20,
    pitLanePath: []
  };
}
