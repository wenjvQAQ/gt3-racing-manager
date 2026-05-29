import {
  RaceTrack,
  Weather,
  CarState,
  SimulationEvent,
  SimulationResult,
  RaceSimulationConfig,
  TICK_SIZE,
  SAFETY_CAR_SPEED,
  getSegmentAtPosition,
  clamp
} from '../types/track';

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
    positionOnTrack: 0,
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
    gapToLeader: '0.000',
    lastLapTime: null,
    bestLapTime: null,
    pitStops: 0
  };
}

export function simulateStep(
  cars: CarState[],
  track: RaceTrack,
  weather: Weather,
  config: RaceSimulationConfig
): CarState[] {
  const updatedCars = cars.map(car => {
    if (car.isRetired || car.isInPit) {
      return car;
    }

    let newCar = { ...car };
    
    const segment = getSegmentAtPosition(track, newCar.positionOnTrack);
    const segmentMultiplier = getSegmentMultiplier(segment?.type || 'straight', weather);
    
    const tireDegradation = calculateTireDegradation(newCar, segment, weather);
    newCar.tireCondition = {
      frontLeft: clamp(newCar.tireCondition.frontLeft - tireDegradation.frontLeft * TICK_SIZE, 0, 1),
      frontRight: clamp(newCar.tireCondition.frontRight - tireDegradation.frontRight * TICK_SIZE, 0, 1),
      rearLeft: clamp(newCar.tireCondition.rearLeft - tireDegradation.rearLeft * TICK_SIZE, 0, 1),
      rearRight: clamp(newCar.tireCondition.rearRight - tireDegradation.rearRight * TICK_SIZE, 0, 1)
    };
    
    const avgTireCondition = (
      newCar.tireCondition.frontLeft +
      newCar.tireCondition.frontRight +
      newCar.tireCondition.rearLeft +
      newCar.tireCondition.rearRight
    ) / 4;
    
    const fuelPenalty = newCar.fuelLoad / 100 * 0.1;
    const tirePenalty = (1 - avgTireCondition) * 0.5;
    const damagePenalty = newCar.damage * 0.3;
    const fatiguePenalty = newCar.driverFatigue * 0.2;
    
    let speedFactor = 1.0 - fuelPenalty - tirePenalty - damagePenalty - fatiguePenalty;
    speedFactor *= segmentMultiplier;
    speedFactor *= weather.type === 'wet' ? 0.85 : 1.0;
    
    if (newCar.isUnderSafetyCar) {
      speedFactor = SAFETY_CAR_SPEED / 200;
    }
    
    newCar.speed = 180 * speedFactor;
    
    const distanceTraveled = (newCar.speed * TICK_SIZE) / (track.totalLength / 1000);
    newCar.positionOnTrack += distanceTraveled / 1000;
    
    if (newCar.positionOnTrack >= 1) {
      newCar.positionOnTrack -= 1;
      newCar.lap += 1;
      
      const lapTime = TICK_SIZE * (track.totalLength / 1000) / (distanceTraveled * 1000) * 60;
      newCar.lastLapTime = lapTime;
      if (!newCar.bestLapTime || lapTime < newCar.bestLapTime) {
        newCar.bestLapTime = lapTime;
      }
    }
    
    newCar.sector = getSector(newCar.positionOnTrack, track);
    
    newCar.fuelLoad = clamp(newCar.fuelLoad - 0.01 * TICK_SIZE, 0, 100);
    
    newCar.driverFatigue = clamp(newCar.driverFatigue + 0.001 * TICK_SIZE, 0, 1);
    
    return newCar;
  });

  return sortCarsByPosition(updatedCars, track);
}

function getSegmentMultiplier(
  segmentType: string, 
  weather: Weather
): number {
  const baseMultiplier = {
    straight: 1.0,
    high_speed_corner: 0.95,
    medium_speed_corner: 0.90,
    low_speed_corner: 0.85,
    hairpin: 0.75
  }[segmentType] || 1.0;

  if (weather.type === 'wet') {
    return baseMultiplier * 0.8;
  }

  return baseMultiplier;
}

function calculateTireDegradation(
  car: CarState,
  segment: any,
  weather: Weather
): { frontLeft: number; frontRight: number; rearLeft: number; rearRight: number } {
  const segmentType = segment?.type || 'straight';
  
  const baseWearRate = {
    straight: 0.001,
    high_speed_corner: 0.003,
    medium_speed_corner: 0.004,
    low_speed_corner: 0.005,
    hairpin: 0.006
  }[segmentType] || 0.001;

  const weatherMultiplier = weather.type === 'wet' ? 1.5 : 1.0;
  const fatigueMultiplier = 1 + car.driverFatigue * 0.5;

  let frontMultiplier = 1.0;
  let rearMultiplier = 1.0;

  if (segmentType.includes('corner') || segmentType === 'hairpin') {
    frontMultiplier = 1.5;
  }

  if (segmentType === 'straight') {
    rearMultiplier = 1.3;
  }

  const wearRate = baseWearRate * weatherMultiplier * fatigueMultiplier;

  return {
    frontLeft: wearRate * frontMultiplier,
    frontRight: wearRate * frontMultiplier,
    rearLeft: wearRate * rearMultiplier,
    rearRight: wearRate * rearMultiplier
  };
}

function getSector(position: number, track: RaceTrack): number {
  const sector1End = 0.33;
  const sector2End = 0.66;

  if (position < sector1End) return 1;
  if (position < sector2End) return 2;
  return 3;
}

export function sortCarsByPosition(cars: CarState[], track: RaceTrack): CarState[] {
  const sorted = [...cars].sort((a, b) => {
    if (a.lap !== b.lap) return b.lap - a.lap;
    return b.positionOnTrack - a.positionOnTrack;
  });

  return sorted.map((car, index) => ({
    ...car,
    currentPosition: index + 1,
    gapToLeader: calculateGap(car, sorted[0])
  }));
}

function calculateGap(car: CarState, leader: CarState): string {
  if (car.carId === leader.carId) {
    return '0.000';
  }

  const lapDiff = leader.lap - car.lap;
  const trackDiff = leader.positionOnTrack - car.positionOnTrack;
  
  const totalDiff = lapDiff + trackDiff;
  const timeDiff = totalDiff * car.targetLapTime;

  return `+${timeDiff.toFixed(3)}`;
}

export function simulateRace(
  cars: CarState[],
  track: RaceTrack,
  weather: Weather,
  config: RaceSimulationConfig,
  totalLaps: number,
  onProgress?: (progress: number) => void
): SimulationResult {
  const simulationCars = cars.map(car => ({
    ...car,
    positionOnTrack: car.gridPosition === 1 ? 0.01 : (car.gridPosition - 1) * (0.99 / cars.length)
  }));

  let currentCars = simulationCars;
  const events: SimulationEvent[] = [];
  let totalTime = 0;
  let tickCount = 0;
  const maxTicks = (totalLaps * track.totalLength / 1000 / 0.15) / TICK_SIZE;

  while (currentCars.some(car => car.lap < totalLaps + 1 && !car.isRetired)) {
    totalTime += TICK_SIZE;
    tickCount++;

    const previousPositions = currentCars.map(c => ({ carId: c.carId, position: c.positionOnTrack }));
    
    currentCars = simulateStep(currentCars, track, weather, config);
    
    const newIncidents = detectIncidents(currentCars, config, totalTime);
    events.push(...newIncidents);
    
    const overtakes = detectOvertakes(previousPositions, currentCars);
    events.push(...overtakes);
    
    const safetyCar = checkSafetyCarCondition(currentCars, events);
    if (safetyCar) {
      currentCars = currentCars.map(car => ({
        ...car,
        isUnderSafetyCar: !car.isRetired
      }));
    }

    if (tickCount % 100 === 0 && onProgress) {
      onProgress(Math.min(tickCount / maxTicks, 1));
    }

    if (tickCount > maxTicks * 1.5) break;
  }

  const finalPositions = sortCarsByPosition(currentCars, track);

  return {
    cars: finalPositions,
    events,
    totalTime,
    finalPositions
  };
}

export function detectIncidents(
  cars: CarState[],
  config: RaceSimulationConfig,
  time: number
): SimulationEvent[] {
  const incidents: SimulationEvent[] = [];

  for (const car of cars) {
    if (car.isRetired) continue;

    const accidentChance = config.incidentBaseChance * (1 + car.driverFatigue * 2);

    if (Math.random() < accidentChance * TICK_SIZE) {
      const severity = Math.random();
      
      if (severity < 0.7) {
        car.damage = clamp(car.damage + 0.1, 0, 1);
        incidents.push({
          id: `incident_${time}_${car.carId}`,
          time,
          lap: car.lap,
          type: 'incident',
          description: `${car.driverName} 遭遇小问题，但继续比赛`,
          carId: car.carId,
          priority: 'low'
        });
      } else if (severity < 0.95) {
        car.damage = clamp(car.damage + 0.4, 0, 1);
        incidents.push({
          id: `incident_${time}_${car.carId}`,
          time,
          lap: car.lap,
          type: 'incident',
          description: `${car.driverName} 赛车受损，需要进站维修`,
          carId: car.carId,
          priority: 'high'
        });
      } else {
        car.isRetired = true;
        incidents.push({
          id: `incident_${time}_${car.carId}`,
          time,
          lap: car.lap,
          type: 'incident',
          description: `${car.driverName} 因严重事故退赛！`,
          carId: car.carId,
          priority: 'critical'
        });
      }
    }
  }

  return incidents;
}

export function detectOvertakes(
  previous: { carId: string; position: number }[],
  current: CarState[]
): SimulationEvent[] {
  const events: SimulationEvent[] = [];

  for (const car of current) {
    const prevPosition = previous.find(p => p.carId === car.carId)?.position || 0;
    
    if (car.positionOnTrack > prevPosition + 0.01) {
      const passedCars = current.filter(
        c => c.carId !== car.carId &&
        c.lap === car.lap &&
        c.positionOnTrack < car.positionOnTrack &&
        c.positionOnTrack >= prevPosition
      );

      for (const passedCar of passedCars) {
        events.push({
          id: `overtake_${car.carId}_${passedCar.carId}`,
          time: 0,
          lap: car.lap,
          type: 'overtake',
          description: `${car.driverName} 超越了 ${passedCar.driverName}`,
          carId: car.carId,
          priority: 'medium'
        });
      }
    }
  }

  return events;
}

function checkSafetyCarCondition(
  cars: CarState[],
  events: SimulationEvent[]
): boolean {
  const recentIncidents = events.filter(
    e => e.type === 'incident' && 
    e.priority === 'critical' &&
    e.time > 0
  );

  return recentIncidents.length > 0;
}

export function generateRaceEvents(
  cars: CarState[],
  totalTime: number,
  track: RaceTrack
): SimulationEvent[] {
  const events: SimulationEvent[] = [];
  
  const fastestCar = cars.reduce((best, car) => 
    !best.bestLapTime || (car.bestLapTime && car.bestLapTime < best.bestLapTime) 
      ? car 
      : best
  );

  if (fastestCar.bestLapTime) {
    events.push({
      id: 'fastest_lap',
      time: totalTime,
      lap: fastestCar.lap,
      type: 'fastest_lap',
      description: `全场最快圈: ${fastestCar.driverName} - ${fastestCar.bestLapTime.toFixed(3)}s`,
      carId: fastestCar.carId,
      priority: 'high'
    });
  }

  return events;
}
