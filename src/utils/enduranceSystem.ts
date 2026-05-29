import type { Driver } from '../types/game';

export interface Stint {
  driverId: string;
  startLap: number;
  endLap: number;
  duration: number;
  targetLaps: number;
  risk: 'low' | 'medium' | 'high';
}

export interface DriverStintAssignment {
  driver: Driver;
  assignedStints: number;
  totalDrivingTime: number;
  fatigueLevel: number;
  isRested: boolean;
}

export interface EnduranceRaceState {
  currentStint: number;
  totalStints: number;
  currentLap: number;
  totalLaps: number;
  raceTime: number;
  driverAssignments: DriverStintAssignment[];
  stints: Stint[];
  nightPhaseStart: number;
  nightPhaseEnd: number;
  safetyCarPhases: number[];
  weatherChanges: { lap: number; weather: 'dry' | 'wet' | 'changing' }[];
}

export function calculateOptimalStintDistribution(
  drivers: Driver[],
  totalLaps: number,
  lapDuration: number,
  isNightRace: boolean
): DriverStintAssignment[] {
  const assignments: DriverStintAssignment[] = [];
  const totalRaceTime = totalLaps * lapDuration;
  const nightStart = totalRaceTime * 0.4;
  const nightEnd = totalRaceTime * 0.7;
  
  const nightHours = (nightEnd - nightStart) / 3600;
  const hasNightPhase = isNightRace && nightHours > 2;
  
  const avgStamina = drivers.reduce((sum, d) => sum + d.skills.stamina, 0) / drivers.length;
  const maxContinuousDrivingTime = 60 + (avgStamina * 0.6);
  
  const stintsPerDriver = Math.ceil(totalLaps / (maxContinuousDrivingTime / lapDuration));
  const equalStints = Math.floor(stintsPerDriver / drivers.length);
  const remainder = stintsPerDriver % drivers.length;
  
  drivers.forEach((driver, index) => {
    const assignedStints = equalStints + (index < remainder ? 1 : 0);
    const driverTime = (assignedStints * maxContinuousDrivingTime) / stintsPerDriver;
    const fatigue = calculateFatigue(driver, driverTime, hasNightPhase);
    
    assignments.push({
      driver,
      assignedStints,
      totalDrivingTime: driverTime,
      fatigueLevel: fatigue,
      isRested: driver.fatigue < 30
    });
  });
  
  return assignments;
}

export function calculateFatigue(
  driver: Driver,
  drivingTime: number,
  includesNight: boolean
): number {
  const baseFatigue = drivingTime / 60;
  const staminaModifier = (100 - driver.skills.stamina) / 50;
  const nightModifier = includesNight ? 1.5 : 1;
  const pressureModifier = (100 - driver.skills.pressure) / 100;
  
  return Math.min(100, baseFatigue * staminaModifier * nightModifier * (1 + pressureModifier));
}

export function getStintRisk(
  driver: Driver,
  stintNumber: number,
  isNight: boolean,
  currentFatigue: number
): 'low' | 'medium' | 'high' {
  const fatigueRisk = currentFatigue > 70 ? 'high' : currentFatigue > 40 ? 'medium' : 'low';
  
  if (isNight && driver.skills.wetSkill < 70) {
    return 'high';
  }
  
  if (stintNumber > 3 && driver.rating === 'bronze') {
    return 'high';
  }
  
  if (driver.skills.pressure < 50 && stintNumber > 2) {
    return 'medium';
  }
  
  return fatigueRisk;
}

export function generateStintPlan(
  drivers: Driver[],
  totalLaps: number,
  lapDuration: number,
  isNightRace: boolean
): Stint[] {
  const assignments = calculateOptimalStintDistribution(drivers, totalLaps, lapDuration, isNightRace);
  const totalRaceTime = totalLaps * lapDuration;
  const nightStart = totalRaceTime * 0.4;
  const nightEnd = totalRaceTime * 0.7;
  const stints: Stint[] = [];
  
  let currentLap = 0;
  let stintIndex = 0;
  
  while (currentLap < totalLaps) {
    const driverIndex = stintIndex % drivers.length;
    const driver = drivers[driverIndex];
    const assignment = assignments[driverIndex];
    
    const targetLaps = Math.floor(assignment.totalDrivingTime / lapDuration / (assignment.assignedStints || 1));
    const actualLaps = Math.min(targetLaps, totalLaps - currentLap);
    
    const raceTime = currentLap * lapDuration;
    const isNight = isNightRace && raceTime >= nightStart && raceTime <= nightEnd;
    
    const risk = getStintRisk(driver, stintIndex + 1, isNight, assignment.fatigueLevel);
    
    stints.push({
      driverId: driver.id,
      startLap: currentLap,
      endLap: currentLap + actualLaps,
      duration: actualLaps * lapDuration,
      targetLaps: actualLaps,
      risk
    });
    
    currentLap += actualLaps;
    stintIndex++;
  }
  
  return stints;
}

export function predictSafetyCarTiming(): number[] {
  const phases: number[] = [];
  const safetyCarCount = Math.random() > 0.3 ? Math.floor(Math.random() * 2) + 1 : 0;
  
  for (let i = 0; i < safetyCarCount; i++) {
    const timing = Math.floor(Math.random() * 20) + 3;
    phases.push(timing);
  }
  
  return phases.sort((a, b) => a - b);
}

export function simulateEnduranceRace(
  drivers: Driver[],
  totalLaps: number,
  lapDuration: number,
  isNightRace: boolean
): {
  driverPerformances: Map<string, { laps: number; incidents: number; bestLap: number }>;
  safetyCarImpact: number;
  weatherImpact: boolean;
  nightDrivingRisk: number;
} {
  const stintPlan = generateStintPlan(drivers, totalLaps, lapDuration, isNightRace);
  const safetyCars = predictSafetyCarTiming();
  const weatherChange = Math.random() > 0.7;
  
  const driverPerformances = new Map<string, { laps: number; incidents: number; bestLap: number }>();
  drivers.forEach(d => {
    driverPerformances.set(d.id, { laps: 0, incidents: 0, bestLap: Infinity });
  });
  
  stintPlan.forEach(stint => {
    const perf = driverPerformances.get(stint.driverId);
    if (!perf) return;
    
    perf.laps += stint.targetLaps;
    
    const incidentChance = stint.risk === 'high' ? 0.3 : stint.risk === 'medium' ? 0.15 : 0.05;
    if (Math.random() < incidentChance) {
      perf.incidents += Math.floor(Math.random() * 3) + 1;
    }
    
    const baseLapTime = 90 + Math.random() * 10;
    const stintModifier = stint.risk === 'high' ? 1.05 : stint.risk === 'medium' ? 1.02 : 1;
    const lapTime = baseLapTime * stintModifier;
    perf.bestLap = Math.min(perf.bestLap, lapTime);
  });
  
  const safetyCarImpact = safetyCars.length * 8;
  const nightDrivingRisk = isNightRace ? 
    drivers.filter(d => d.skills.wetSkill < 70).length / drivers.length : 0;
  
  return {
    driverPerformances,
    safetyCarImpact,
    weatherImpact: weatherChange,
    nightDrivingRisk
  };
}
