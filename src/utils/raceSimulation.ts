import type { Driver, Car, Race, RaceStrategy, RaceConditions, DriverRating } from '../types/game';
import { calculateBOPForRace, getBOPPerformanceImpact } from './bopSystem';
import { simulateEnduranceRace } from './enduranceSystem';

export interface LiveRaceData {
  currentLap: number;
  totalLaps: number;
  raceTime: number;
  position: number;
  gapToLeader: string;
  gapToNext: string;
  currentTire: string;
  currentFuel: number;
  tireCondition: number;
  driver: {
    name: string;
    fatigue: number;
    stintNumber: number;
  };
  currentPace: string;
  bestLap: string;
  lastLap: string;
  pitStops: number;
  incidents: number;
  isSafetyCar: boolean;
  weather: string;
  events: RaceEvent[];
}

export interface RaceEvent {
  time: string;
  lap: number;
  type: ' overtake ' | 'pit' | 'incident' | 'safety-car' | 'weather' | 'tire-change';
  description: string;
}

export interface RaceCommand {
  type: 'push' | 'save' | 'box' | ' overtake ' | 'defend' | 'stay-out' | 'early-pit';
  description: string;
  impact: {
    pace?: number;
    fuel?: number;
    tire?: number;
    risk?: number;
  };
}

export function generateRaceCommands(): RaceCommand[] {
  return [
    {
      type: 'push',
      description: '全力推进！Push to pass！',
      impact: { pace: 2, fuel: -1, tire: -2, risk: 0.15 }
    },
    {
      type: 'save',
      description: '节省燃油和轮胎',
      impact: { pace: -1.5, fuel: 1, tire: 1, risk: 0 }
    },
    {
      type: 'box',
      description: '进站',
      impact: {}
    },
    {
      type: ' overtake ',
      description: '发起超车',
      impact: { pace: 1, risk: 0.25 }
    },
    {
      type: 'defend',
      description: '防守位置',
      impact: { pace: 0.5, risk: 0.1 }
    },
    {
      type: 'stay-out',
      description: '留在赛道上',
      impact: { tire: -1.5, fuel: -1 }
    },
    {
      type: 'early-pit',
      description: '提前进站',
      impact: { pace: 0.5 }
    }
  ];
}

export function simulateLiveRace(
  drivers: Driver[],
  car: Car,
  race: Race,
  strategy: RaceStrategy,
  conditions: RaceConditions,
  manufacturerLoyalty: number = 0
): LiveRaceData {
  const bop = calculateBOPForRace(car, race.track, manufacturerLoyalty);
  const performanceImpact = getBOPPerformanceImpact(bop);
  
  const totalLaps = race.type === 'endurance' ? race.duration : Math.floor(race.duration / 2);
  const lapDuration = 90;
  const isNightRace = race.type === 'endurance' && conditions.isNight;
  
  const avgSkill = drivers.reduce((sum, d) => {
    const skillSum = d.skills.technical + d.skills.stamina + d.skills.pressure;
    return sum + skillSum;
  }, 0) / (drivers.length * 3);
  
  let currentPace = avgSkill * performanceImpact * (strategy.aggressiveness / 50);
  
  const liveData: LiveRaceData = {
    currentLap: 0,
    totalLaps,
    raceTime: 0,
    position: 8,
    gapToLeader: '+15.2s',
    gapToNext: '+2.3s',
    currentTire: strategy.tireChoice,
    currentFuel: strategy.fuelLoad === 'light' ? 60 : strategy.fuelLoad === 'medium' ? 80 : 100,
    tireCondition: 100,
    driver: {
      name: drivers[0].name,
      fatigue: drivers[0].fatigue,
      stintNumber: 1
    },
    currentPace: `${currentPace.toFixed(2)}s`,
    bestLap: '0:00.000',
    lastLap: '0:00.000',
    pitStops: 0,
    incidents: 0,
    isSafetyCar: false,
    weather: conditions.weather === 'dry' ? '干燥' : conditions.weather === 'wet' ? '雨天' : '变化',
    events: []
  };
  
  const tireWear = strategy.tireChoice === 'soft' ? 3 : strategy.tireChoice === 'medium' ? 2 : 1.5;
  const fuelBurn = strategy.fuelLoad === 'light' ? 2.5 : strategy.fuelLoad === 'medium' ? 2 : 1.5;
  
  for (let lap = 1; lap <= Math.min(totalLaps, 24); lap++) {
    const lapTime = lapDuration + currentPace + (100 - liveData.tireCondition) * 0.05;
    
    if (lap === 1) {
      liveData.bestLap = formatLapTime(lapTime);
    }
    liveData.lastLap = formatLapTime(lapTime);
    liveData.currentLap = lap;
    liveData.raceTime = lap * lapDuration;
    liveData.tireCondition = Math.max(0, liveData.tireCondition - tireWear);
    liveData.currentFuel = Math.max(0, liveData.currentFuel - fuelBurn);
    
    if (liveData.currentFuel < 30 && strategy.fuelLoad !== 'heavy') {
      liveData.events.push({
        time: formatTime(liveData.raceTime),
        lap,
        type: 'pit',
        description: `燃油不足！建议进站`
      });
    }
    
    if (liveData.tireCondition < 30) {
      liveData.events.push({
        time: formatTime(liveData.raceTime),
        lap,
        type: 'tire-change',
        description: `轮胎磨损严重 (${liveData.tireCondition.toFixed(0)}%)`
      });
    }
    
    if (Math.random() < conditions.safetyCarChance && !liveData.isSafetyCar) {
      liveData.isSafetyCar = true;
      liveData.events.push({
        time: formatTime(liveData.raceTime),
        lap,
        type: 'safety-car',
        description: '安全车出动！'
      });
    } else if (liveData.isSafetyCar && Math.random() > 0.7) {
      liveData.isSafetyCar = false;
      liveData.events.push({
        time: formatTime(liveData.raceTime),
        lap,
        type: 'safety-car',
        description: '安全车返回，恢复比赛'
      });
    }
    
    if (conditions.weather === 'changing' && Math.random() > 0.9) {
      const wetChance = 0.3;
      if (Math.random() < wetChance) {
        liveData.events.push({
          time: formatTime(liveData.raceTime),
          lap,
          type: 'weather',
          description: '天气变化！赛道变得潮湿'
        });
      }
    }
    
    if (liveData.position <= 10 && Math.random() > 0.85) {
      const overtakeChance = liveData.position <= 5 ? 0.6 : 0.4;
      if (Math.random() < overtakeChance) {
        liveData.position = Math.max(1, liveData.position - 1);
        liveData.gapToNext = `+${(Math.random() * 3 + 1).toFixed(1)}s`;
        liveData.events.push({
          time: formatTime(liveData.raceTime),
          lap,
          type: ' overtake ',
          description: `超过前方赛车升至 P${liveData.position}`
        });
      }
    }
    
    if (strategy.aggressiveness > 70 && Math.random() < 0.1) {
      liveData.incidents += 1;
      liveData.events.push({
        time: formatTime(liveData.raceTime),
        lap,
        type: 'incident',
        description: '轻微失误，损失一些时间'
      });
      currentPace += 0.5;
    }
    
    liveData.driver.fatigue = Math.min(100, liveData.driver.fatigue + (race.type === 'endurance' ? 2 : 1));
    
    if (liveData.driver.fatigue > 70 && race.type === 'endurance') {
      liveData.events.push({
        time: formatTime(liveData.raceTime),
        lap,
        type: 'incident',
        description: `车手 ${liveData.driver.name} 感到疲劳`
      });
    }
  }
  
  return liveData;
}

function formatLapTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(3);
  return `${mins}:${secs.padStart(6, '0')}`;
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function executeRaceCommand(
  command: RaceCommand,
  currentData: LiveRaceData
): { newData: LiveRaceData; commandExecuted: boolean } {
  const newData = { ...currentData };
  
  if (command.type === 'push') {
    newData.currentPace = `${(parseFloat(currentData.currentPace) - (command.impact.pace || 0)).toFixed(2)}s`;
    newData.tireCondition = Math.max(0, currentData.tireCondition + (command.impact.tire || 0));
    newData.currentFuel = Math.max(0, currentData.currentFuel + (command.impact.fuel || 0));
    
    newData.events.push({
      time: formatTime(currentData.raceTime),
      lap: currentData.currentLap,
      type: ' overtake ',
      description: '车手全力推进！'
    });
  } else if (command.type === 'save') {
    newData.currentPace = `${(parseFloat(currentData.currentPace) + Math.abs(command.impact.pace || 0)).toFixed(2)}s`;
    newData.tireCondition = Math.min(100, currentData.tireCondition - (command.impact.tire || 0));
    newData.currentFuel = Math.min(100, currentData.currentFuel - (command.impact.fuel || 0));
    
    newData.events.push({
      time: formatTime(currentData.raceTime),
      lap: currentData.currentLap,
      type: 'pit',
      description: '车手节省燃油和轮胎'
    });
  } else if (command.type === 'box') {
    newData.pitStops += 1;
    newData.currentTire = 'fresh';
    newData.tireCondition = 100;
    newData.currentFuel = command.impact.fuel ? 100 : currentData.currentFuel;
    
    newData.events.push({
      time: formatTime(currentData.raceTime),
      lap: currentData.currentLap,
      type: 'pit',
      description: '进站换胎加油'
    });
  }
  
  if (command.impact.risk && Math.random() < command.impact.risk) {
    newData.incidents += 1;
    newData.events.push({
      time: formatTime(currentData.raceTime),
      lap: currentData.currentLap,
      type: 'incident',
      description: '执行指令时发生失误！'
    });
  }
  
  return { newData, commandExecuted: true };
}
