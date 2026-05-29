export type DriverRating = 'platinum' | 'gold' | 'silver' | 'bronze';

export const generateId = (prefix: string): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export interface DriverSkills {
  technical: number;
  stamina: number;
  pressure: number;
  wetSkill: number;
  familiarity: number;
}

export interface DriverContract {
  signed: boolean;
  remainingRaces: number;
  fee: number;
}

export interface Driver {
  id: string;
  name: string;
  nationality: string;
  age: number;
  rating: DriverRating;
  skills: DriverSkills;
  salary: number;
  willingness: number;
  specialties: string[];
  contract: DriverContract;
  fatigue: number;
}

export interface CarManufacturer {
  id: string;
  name: string;
  country: string;
}

export interface CarBOPSuitability {
  highSpeed: number;
  technical: number;
  endurance: number;
}

export interface CarDesign {
  chassisType: 'front-engine' | 'mid-engine' | 'rear-engine' | 'hybrid';
  engineDisplacement: number;
  turboCharged: boolean;
  powerOutput: number;
  reliability: number;
  downforce: number;
  drag: number;
  weightDistribution: number;
  lightweight: boolean;
}

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  purchasePrice: number;
  currentCondition: number;
  maxCondition: number;
  bopSuitability: CarBOPSuitability;
  maintenanceCost: number;
  basePerformance: number;
  customDesign?: CarDesign;
  isPlayerBuilt?: boolean;
}

export type TrackType = 'highSpeed' | 'technical' | 'mixed';

export interface Track {
  id: string;
  name: string;
  country: string;
  length: number;
  turns: number;
  trackType: TrackType;
  straightLength: number;
  weatherTendency: 'dry' | 'wet' | 'mixed';
  overtakingDifficulty: number;
  baseLapTime: number;
}

export interface BOPConfig {
  weightPenalty: number;
  powerRestriction: number;
  aeroRestriction: number;
  published: boolean;
}

export type RaceType = 'sprint' | 'endurance';
export type RaceStatus = 'upcoming' | 'qualifying' | 'racing' | 'finished';

export interface Race {
  id: string;
  name: string;
  track: Track;
  type: RaceType;
  duration: number;
  entryFee: number;
  prize: {
    overall: number;
    proAm: number;
    am: number;
  };
  bop: BOPConfig;
  date: Date;
  status: RaceStatus;
  registeredTeams: string[];
  isGrandPrix: boolean;
}

export interface RaceConditions {
  weather: 'dry' | 'wet' | 'changing';
  trackTemperature: number;
  isNight: boolean;
  safetyCarChance: number;
}

export interface RaceStrategy {
  tireChoice: 'soft' | 'medium' | 'hard';
  fuelLoad: 'light' | 'medium' | 'heavy';
  initialPitStops: number;
  aggressiveness: number;
}

export interface RaceEvent {
  id: string;
  lap: number;
  time: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface RaceResult {
  id: string;
  raceId: string;
  raceName: string;
  teamId: string;
  position: number;
  totalCars: number;
  lapsCompleted: number;
  fastestLap: number;
  pitStops: number;
  incidentCount: number;
  prizeMoney: number;
  reputationChange: number;
  driverRatings: {
    id: string;
    name: string;
    rating: DriverRating;
    lapsDriven: number;
  }[];
  date: Date;
  strategy: {
    tire: string;
    fuel: string;
    aggressiveness: number;
  };
}

export interface Facilities {
  workshop: number;
  simulator: number;
  engineeringOffice: number;
  fitnessCenter: number;
  logistics: number;
}

export interface ManufacturerContract {
  make: string;
  level: number;
  loyalty: number;
  isWorksTeam: boolean;
  support: {
    engineerSupport: boolean;
    discountParts: number;
    freeCars: number;
    driverLoans: boolean;
  };
  sponsorship: number;
  contractEnds: Date;
}

export interface PlayerManufacturer {
  id: string;
  name: string;
  brandStory: string;
  brandPositioning: 'performance' | 'luxury' | 'value' | 'innovative';
  reputation: number;
  founded: Date;
  cars: Car[];
}

export interface NegotiationTerm {
  id: string;
  name: string;
  description: string;
  currentValue: number | boolean;
  minValue: number | boolean;
  maxValue: number | boolean;
  weight: number;
}

export interface NegotiationState {
  inProgress: boolean;
  manufacturer: string;
  terms: NegotiationTerm[];
  manufacturerInterest: number;
  roundsLeft: number;
}

export interface Sponsor {
  id: string;
  name: string;
  amount: number;
  contractLength: number;
  requirements: string[];
}

export interface FinanceRecord {
  id: string;
  date: Date;
  type: 'income' | 'expense';
  category: 'sponsorship' | 'prize' | 'salary' | 'maintenance' | 'purchase' | 'facility' | 'travel' | 'entry' | 'gentleman-fee' | 'manufacturer-support';
  amount: number;
  description: string;
}

export type GamePhase = 'offseason' | 'preseason' | 'season' | 'postseason';

export interface Team {
  id: string;
  name: string;
  prestige: number;
  financialReputation: number;
  balance: number;
  drivers: Driver[];
  cars: Car[];
  facilities: Facilities;
  manufacturer: ManufacturerContract | null;
  ownManufacturer?: PlayerManufacturer | null;
  sponsors: Sponsor[];
  financeHistory: FinanceRecord[];
}

export interface Reputation {
  trackReputation: number;
  financialReputation: number;
  mediaReputation: number;
}

export interface GameEvent {
  id: string;
  type: 'random' | 'milestone' | 'moral' | 'negotiation';
  title: string;
  description: string;
  choices?: {
    label: string;
    effects: {
      balance?: number;
      prestige?: number;
      financialReputation?: number;
      driverMorale?: { driverId: string; change: number }[];
    };
  }[];
  effects?: {
    balance?: number;
    prestige?: number;
    financialReputation?: number;
  };
  occurred: boolean;
  date: Date;
}

export interface GameState {
  currentSeason: number;
  currentRaceWeek: number;
  gamePhase: GamePhase;
  team: Team;
  seasonCalendar: Race[];
  raceResults: RaceResult[];
  currentRace: Race | null;
  activeEvents: GameEvent[];
  reputation: Reputation;
  negotiation: NegotiationState | null;
  raceStrategies: Record<string, any>;
}

export type TimelineStage = 'prep' | 'practice' | 'qualifying' | 'race' | 'post';
export type TimelineEventStatus = 'pending' | 'active' | 'completed' | 'skipped';
export type RacePhase = 'transport' | 'scrutineering' | 'free_practice_1' | 'free_practice_2' | 
                      'free_practice_3' | 'qualifying_q1' | 'qualifying_q2' | 'qualifying_q3' | 'race' | 'cooldown' | 'complete';

export interface DecisionItem {
  id: string;
  label: string;
  type: 'setup' | 'tire' | 'fuel' | 'driver' | 'strategy' | 'other';
  description: string;
  options: DecisionOption[];
  selectedOption: string | null;
}

export interface DecisionOption {
  id: string;
  label: string;
  effects: Record<string, number>;
  description?: string;
}

export interface TimelineEvent {
  id: string;
  name: string;
  stage: TimelineStage;
  phase: RacePhase;
  startTime: number;
  duration: number;
  status: TimelineEventStatus;
  decisions?: DecisionItem[];
  summary?: string;
  canSkip: boolean;
}

export interface TimelinePauseCondition {
  type: 'safety_car' | 'weather_change' | 'car_damage' | 'rival_crash' | 'final_laps' | 'engineer_alert' | 'pit_window' | 'decision_required';
  priority: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  params?: Record<string, any>;
}

export interface PracticeResult {
  lapTimes: number[];
  tireDegradation: number;
  fuelConsumption: number;
  feedback: string;
  setupRecommendation: string;
  position: number;
}

export interface QualifyingResult {
  q1Position: number;
  q2Position: number;
  q3Position: number;
  finalGridPosition: number;
  fastestLap: number;
  incidents: number;
}

export interface TimelineState {
  currentTime: number;
  currentEvent: TimelineEvent | null;
  events: TimelineEvent[];
  phase: RacePhase;
  isPaused: boolean;
  pauseReason: TimelinePauseCondition | null;
  practiceResults: PracticeResult | null;
  qualifyingResults: QualifyingResult | null;
  viewMode: 'dashboard' | 'timeline_only';
}

export interface RaceRadioMessage {
  id: string;
  time: number;
  lap: number;
  speaker: 'driver' | 'engineer';
  message: string;
  priority: 'low' | 'medium' | 'high';
}
