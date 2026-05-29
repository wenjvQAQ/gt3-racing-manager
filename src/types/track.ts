export interface Vec2 {
  x: number;
  y: number;
}

export type SegmentType = 
  | 'straight' 
  | 'high_speed_corner' 
  | 'medium_speed_corner' 
  | 'low_speed_corner' 
  | 'hairpin';

export interface TrackSegment {
  id: number;
  type: SegmentType;
  startIndex: number;
  endIndex: number;
  length: number;
  cornerRadius?: number;
  avgSpeed?: number;
}

export interface CornerMarker {
  id: string;
  name: string;
  index: number;
  cornerNumber: number;
  type: 'heavy_braking' | 'sweeping' | 'off_camber';
}

export interface SectorBoundary {
  index: number;
  name: string;
}

export interface RaceTrack {
  id: string;
  name: string;
  country: string;
  centerline: Vec2[];
  width: number;
  totalLength: number;
  cumulativeDistances: number[];
  trackSegments: TrackSegment[];
  corners: CornerMarker[];
  sectorBoundaries: SectorBoundary[];
  startFinishLineIndex: number;
  pitEntryIndex: number;
  pitExitIndex: number;
  pitLanePath: Vec2[];
  elevationGradient?: number[];
}

export interface Weather {
  type: 'dry' | 'wet' | 'changing';
  rainIntensity: number;
  trackTemperature: number;
  airTemperature: number;
}

export interface CarState {
  carId: string;
  driverName: string;
  teamName: string;
  teamColor: string;
  positionOnTrack: number;
  sector: number;
  lap: number;
  speed: number;
  targetLapTime: number;
  tireCondition: {
    frontLeft: number;
    frontRight: number;
    rearLeft: number;
    rearRight: number;
  };
  fuelLoad: number;
  damage: number;
  driverFatigue: number;
  isInPit: boolean;
  pitStopPlanned: boolean;
  isUnderSafetyCar: boolean;
  isRetired: boolean;
  gridPosition: number;
  currentPosition: number;
  gapToLeader: string;
  lastLapTime: number | null;
  bestLapTime: number | null;
  pitStops: number;
}

export interface SimulationEvent {
  id: string;
  time: number;
  lap: number;
  type: 'overtake' | 'pit_stop' | 'incident' | 'safety_car' | 'weather_change' | 'fastest_lap' | 'radio_message';
  description: string;
  carId?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface SimulationResult {
  cars: CarState[];
  events: SimulationEvent[];
  totalTime: number;
  finalPositions: CarState[];
}

export interface RaceSimulationConfig {
  weather: Weather;
  safetyCarChance: number;
  incidentBaseChance: number;
  overtakeDifficulty: number;
}

export const TICK_SIZE = 0.5;
export const SAFETY_CAR_SPEED = 80;
export const NORMAL_SPEED_FACTOR = 1.0;

export function getXYFromTrackPosition(
  track: RaceTrack, 
  t: number
): Vec2 {
  const targetDist = t * track.totalLength;
  
  let left = 0;
  let right = track.cumulativeDistances.length - 1;
  
  while (left < right - 1) {
    const mid = Math.floor((left + right) / 2);
    if (track.cumulativeDistances[mid] <= targetDist) {
      left = mid;
    } else {
      right = mid;
    }
  }
  
  const idx = left;
  const nextIdx = Math.min(idx + 1, track.centerline.length - 1);
  const segStartDist = track.cumulativeDistances[idx];
  const segEndDist = track.cumulativeDistances[nextIdx];
  
  if (segEndDist === segStartDist) {
    return track.centerline[idx];
  }
  
  const localT = (targetDist - segStartDist) / (segEndDist - segStartDist);
  
  return {
    x: track.centerline[idx].x + (track.centerline[nextIdx].x - track.centerline[idx].x) * localT,
    y: track.centerline[idx].y + (track.centerline[nextIdx].y - track.centerline[idx].y) * localT
  };
}

export function getAngleAtPosition(
  track: RaceTrack, 
  t: number
): number {
  const current = getXYFromTrackPosition(track, t);
  const lookahead = getXYFromTrackPosition(track, Math.min(t + 0.001, 0.999));
  
  return Math.atan2(lookahead.y - current.y, lookahead.x - current.x);
}

export function getSegmentAtPosition(
  track: RaceTrack, 
  position: number
): TrackSegment | null {
  const index = Math.floor(position * track.centerline.length);
  
  for (const segment of track.trackSegments) {
    if (index >= segment.startIndex && index <= segment.endIndex) {
      return segment;
    }
  }
  
  return null;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function createInitialCarState(
  carId: string,
  driverName: string,
  teamName: string,
  teamColor: string,
  gridPosition: number,
  baseLapTime: number
): CarState {
  return {
    carId,
    driverName,
    teamName,
    teamColor,
    positionOnTrack: (gridPosition - 1) * 0.01,
    sector: 1,
    lap: 1,
    speed: 0,
    targetLapTime: baseLapTime,
    tireCondition: {
      frontLeft: 1.0,
      frontRight: 1.0,
      rearLeft: 1.0,
      rearRight: 1.0
    },
    fuelLoad: 100,
    damage: 0,
    driverFatigue: 0,
    isInPit: false,
    pitStopPlanned: false,
    isUnderSafetyCar: false,
    isRetired: false,
    gridPosition,
    currentPosition: gridPosition,
    gapToLeader: gridPosition === 1 ? '0.000' : `+${(gridPosition * 0.5).toFixed(3)}`,
    lastLapTime: null,
    bestLapTime: null,
    pitStops: 0
  };
}
