import type { Car, Race, Track } from '../types/game';

export interface DetailedBOP {
  weightPenalty: number;
  powerRestriction: number;
  aeroRestriction: number;
  minWeight: number;
  maxPower: number;
  balanceFactor: number;
}

export function calculateBOPForRace(
  car: Car,
  track: Track,
  manufacturerLoyalty: number = 0
): DetailedBOP {
  const baseWeight = car.customDesign?.lightweight ? 1240 : 1300;
  const basePower = car.customDesign?.powerOutput || 550;
  
  let weightPenalty = 0;
  let powerRestriction = 0;
  let aeroRestriction = 0;
  
  if (track.trackType === 'highSpeed') {
    const highSpeedBonus = car.bopSuitability.highSpeed / 100;
    weightPenalty = Math.floor((1 - highSpeedBonus) * 50);
    powerRestriction = Math.floor((1 - highSpeedBonus) * 20);
  } else if (track.trackType === 'technical') {
    const techBonus = car.bopSuitability.technical / 100;
    weightPenalty = Math.floor((1 - techBonus) * 50);
    powerRestriction = Math.floor((1 - techBonus) * 15);
  } else {
    const endBonus = car.bopSuitability.endurance / 100;
    weightPenalty = Math.floor((1 - endBonus) * 40);
    powerRestriction = Math.floor((1 - endBonus) * 10);
  }
  
  const loyaltyBonus = manufacturerLoyalty * 0.1;
  weightPenalty = Math.max(0, weightPenalty - Math.floor(weightPenalty * loyaltyBonus));
  powerRestriction = Math.max(0, powerRestriction - Math.floor(powerRestriction * loyaltyBonus));
  
  return {
    weightPenalty,
    powerRestriction,
    aeroRestriction,
    minWeight: baseWeight + weightPenalty,
    maxPower: basePower - powerRestriction,
    balanceFactor: 1 - (weightPenalty + powerRestriction) / 200
  };
}

export function getBOPPerformanceImpact(bop: DetailedBOP): number {
  const weightImpact = bop.weightPenalty * 0.002;
  const powerImpact = bop.powerRestriction * 0.003;
  const aeroImpact = bop.aeroRestriction * 0.001;
  
  return 1 - (weightImpact + powerImpact + aeroImpact);
}

export function simulateBOPChange(
  car: Car,
  previousRace: Race | null,
  currentRace: Race
): { changed: boolean; details: string } {
  if (!previousRace) {
    return { changed: false, details: '首场比赛，无BoP历史' };
  }
  
  const prevBOP = calculateBOPForRace(car, previousRace.track);
  const currBOP = calculateBOPForRace(car, currentRace.track);
  
  const weightDiff = currBOP.weightPenalty - prevBOP.weightPenalty;
  const powerDiff = currBOP.powerRestriction - prevBOP.powerRestriction;
  
  if (weightDiff === 0 && powerDiff === 0) {
    return { changed: false, details: 'BoP保持不变' };
  }
  
  let details = '';
  if (weightDiff > 0) {
    details += `车重增加 +${weightDiff}kg`;
  } else if (weightDiff < 0) {
    details += `车重减轻 ${weightDiff}kg`;
  }
  
  if (powerDiff > 0) {
    details += details ? `，功率限制 +${powerDiff}kW` : `功率限制 +${powerDiff}kW`;
  } else if (powerDiff < 0) {
    details += details ? `，功率恢复 ${powerDiff}kW` : `功率恢复 ${powerDiff}kW`;
  }
  
  return { changed: true, details };
}

export function predictOptimalStrategy(
  car: Car,
  track: Track,
  raceType: 'sprint' | 'endurance'
): { tire: 'soft' | 'medium' | 'hard'; fuel: 'light' | 'medium' | 'heavy'; aggression: number } {
  const bop = calculateBOPForRace(car, track);
  const performanceImpact = getBOPPerformanceImpact(bop);
  
  if (raceType === 'sprint') {
    if (performanceImpact > 0.95) {
      return { tire: 'soft', fuel: 'light', aggression: 80 };
    } else if (performanceImpact > 0.85) {
      return { tire: 'medium', fuel: 'medium', aggression: 60 };
    } else {
      return { tire: 'medium', fuel: 'heavy', aggression: 40 };
    }
  } else {
    if (performanceImpact > 0.95) {
      return { tire: 'hard', fuel: 'heavy', aggression: 50 };
    } else if (performanceImpact > 0.85) {
      return { tire: 'hard', fuel: 'medium', aggression: 40 };
    } else {
      return { tire: 'hard', fuel: 'heavy', aggression: 30 };
    }
  }
}
