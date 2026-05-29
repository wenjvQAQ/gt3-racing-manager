import { Driver, Car, Race, RaceResult, generateId } from '../types/game';

interface RaceStrategy {
  tireChoice: 'soft' | 'medium' | 'hard';
  fuelLoad: 'low' | 'medium' | 'high';
  initialPitStops: number;
  aggressiveness: number;
}

interface RaceConditions {
  weather: 'dry' | 'wet' | 'mixed';
  trackTemperature: number;
  isNight: boolean;
  safetyCarChance: number;
}

const TIRES = {
  soft: { grip: 1.15, degradation: 1.4, name: '软胎' },
  medium: { grip: 1.0, degradation: 1.0, name: '中性胎' },
  hard: { grip: 0.9, degradation: 0.7, name: '硬胎' }
};

const FUEL_LOAD = {
  low: { penalty: 0.95, stops: 3, name: '低载油' },
  medium: { penalty: 1.0, stops: 2, name: '中载油' },
  high: { penalty: 1.05, stops: 1, name: '高载油' }
};

const DRIVER_RATING_MULTIPLIER = {
  platinum: 1.2,
  gold: 1.1,
  silver: 1.0,
  bronze: 0.85
};

export const simulateRace = (
  drivers: Driver[],
  car: Car,
  race: Race,
  strategy: RaceStrategy,
  conditions: RaceConditions,
  numberOfLaps: number
): RaceResult => {
  const baseDriverSkill = drivers.reduce((sum, d) => {
    const ratingBonus = DRIVER_RATING_MULTIPLIER[d.rating];
    const skill = (d.skills.technical + d.skills.stamina) / 2;
    return sum + skill * ratingBonus;
  }, 0) / drivers.length;

  const tireEffect = TIRES[strategy.tireChoice];
  const fuelEffect = FUEL_LOAD[strategy.fuelLoad];
  
  let weatherMultiplier = 1.0;
  if (conditions.weather === 'wet') {
    weatherMultiplier = 0.85;
    drivers.forEach(d => {
      if (d.skills.wetSkill >= 4) {
        weatherMultiplier += 0.05;
      }
    });
  }

  let nightMultiplier = 1.0;
  if (conditions.isNight) {
    nightMultiplier = 0.95;
    drivers.forEach(d => {
      if (d.skills.stamina >= 80) {
        nightMultiplier += 0.02;
      }
    });
  }

  const trackSuitability = race.track.trackType === 'highSpeed' 
    ? car.bopSuitability.highSpeed / 100 
    : car.bopSuitability.technical / 100;

  const carPerformance = car.basePerformance * car.currentCondition / 100;
  const strategyRisk = strategy.aggressiveness / 100;

  const finalPerformance = Math.floor(
    baseDriverSkill * 
    tireEffect.grip * 
    fuelEffect.penalty * 
    weatherMultiplier * 
    nightMultiplier * 
    trackSuitability * 
    carPerformance * 
    (0.9 + strategyRisk * 0.2)
  );

  const incidentRoll = Math.random();
  let incidentCount = 0;
  const baseIncidentChance = 0.15;
  const incidentChance = baseIncidentChance + (strategyRisk - 0.5) * 0.2;
  
  if (incidentRoll < incidentChance) {
    incidentCount = Math.floor(Math.random() * 3) + 1;
  }

  const competitionStrength = Math.floor(Math.random() * 30) + 70;
  const relativePerformance = finalPerformance / competitionStrength;

  let position: number;
  if (relativePerformance > 1.1) {
    position = 1;
  } else if (relativePerformance > 1.0) {
    position = 2;
  } else if (relativePerformance > 0.95) {
    position = 3;
  } else if (relativePerformance > 0.85) {
    position = Math.floor(Math.random() * 5) + 4;
  } else {
    position = Math.floor(Math.random() * 10) + 9;
  }

  const totalCars = Math.floor(Math.random() * 10) + 15;
  const lapsCompleted = Math.floor(numberOfLaps * (1 - incidentCount * 0.1));

  let prizeMoney = 0;
  let reputationChange = 0;

  if (position === 1) {
    prizeMoney = race.prize.overall;
    reputationChange = 15;
  } else if (position <= 3) {
    prizeMoney = Math.floor(race.prize.overall * (0.5 + (3 - position) * 0.2));
    reputationChange = 8 + (3 - position) * 3;
  } else if (position <= 6) {
    prizeMoney = Math.floor(race.prize.proAm);
    reputationChange = 5;
  } else if (position <= 10) {
    prizeMoney = Math.floor(race.prize.am * 0.5);
    reputationChange = 2;
  } else if (lapsCompleted >= numberOfLaps * 0.7) {
    prizeMoney = Math.floor(race.prize.am * 0.2);
    reputationChange = 1;
  }

  if (incidentCount > 1) {
    reputationChange -= incidentCount * 2;
  }

  if (race.isGrandPrix) {
    prizeMoney = Math.floor(prizeMoney * 1.5);
    reputationChange = Math.floor(reputationChange * 1.3);
  }

  return {
    id: generateId('result'),
    raceId: race.id,
    raceName: race.name,
    teamId: 'player',
    position,
    totalCars,
    lapsCompleted,
    fastestLap: Math.floor((100 / finalPerformance) * 60 + Math.random() * 5),
    pitStops: strategy.initialPitStops + incidentCount,
    incidentCount,
    prizeMoney,
    reputationChange,
    driverRatings: drivers.map(d => ({
      id: d.id,
      name: d.name,
      rating: d.rating,
      lapsDriven: Math.floor(lapsCompleted / drivers.length)
    })),
    date: new Date(),
    strategy: {
      tire: tireEffect.name,
      fuel: fuelEffect.name,
      aggressiveness: strategy.aggressiveness
    }
  };
};
