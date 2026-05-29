import { Driver } from '../types/game';

export const INITIAL_DRIVERS: Driver[] = [
  {
    id: 'driver-1',
    name: 'Laurens Vanthoor',
    nationality: 'Belgian',
    age: 34,
    rating: 'platinum',
    skills: {
      technical: 96,
      stamina: 92,
      pressure: 2,
      wetSkill: 4,
      familiarity: 85
    },
    salary: 65000,
    willingness: 60,
    specialties: ['qualifying', 'endurance'],
    contract: {
      signed: false,
      remainingRaces: 0,
      fee: 0
    },
    fatigue: 0
  },
  {
    id: 'driver-2',
    name: 'Kevin Estre',
    nationality: 'French',
    age: 36,
    rating: 'platinum',
    skills: {
      technical: 94,
      stamina: 88,
      pressure: 3,
      wetSkill: 5,
      familiarity: 80
    },
    salary: 60000,
    willingness: 55,
    specialties: ['wet-race', 'qualifying'],
    contract: {
      signed: false,
      remainingRaces: 0,
      fee: 0
    },
    fatigue: 0
  },
  {
    id: 'driver-3',
    name: 'Mirko Bortolotti',
    nationality: 'Italian',
    age: 35,
    rating: 'platinum',
    skills: {
      technical: 95,
      stamina: 90,
      pressure: 2,
      wetSkill: 4,
      familiarity: 82
    },
    salary: 58000,
    willingness: 65,
    specialties: ['endurance', 'race-craft'],
    contract: {
      signed: false,
      remainingRaces: 0,
      fee: 0
    },
    fatigue: 0
  },
  {
    id: 'driver-4',
    name: 'Matt Campbell',
    nationality: 'Australian',
    age: 29,
    rating: 'gold',
    skills: {
      technical: 88,
      stamina: 94,
      pressure: 2,
      wetSkill: 4,
      familiarity: 75
    },
    salary: 35000,
    willingness: 75,
    specialties: ['endurance', 'consistency'],
    contract: {
      signed: false,
      remainingRaces: 0,
      fee: 0
    },
    fatigue: 0
  },
  {
    id: 'driver-5',
    name: 'Mathieu Jaminet',
    nationality: 'French',
    age: 30,
    rating: 'gold',
    skills: {
      technical: 86,
      stamina: 90,
      pressure: 3,
      wetSkill: 3,
      familiarity: 70
    },
    salary: 30000,
    willingness: 80,
    specialties: ['qualifying'],
    contract: {
      signed: false,
      remainingRaces: 0,
      fee: 0
    },
    fatigue: 0
  },
  {
    id: 'driver-6',
    name: 'Thomas Preining',
    nationality: 'Austrian',
    age: 26,
    rating: 'silver',
    skills: {
      technical: 80,
      stamina: 85,
      pressure: 3,
      wetSkill: 3,
      familiarity: 65
    },
    salary: 15000,
    willingness: 85,
    specialties: ['young-talent'],
    contract: {
      signed: false,
      remainingRaces: 0,
      fee: 0
    },
    fatigue: 0
  },
  {
    id: 'driver-7',
    name: 'Ayhancan Güven',
    nationality: 'Turkish',
    age: 26,
    rating: 'silver',
    skills: {
      technical: 78,
      stamina: 82,
      pressure: 4,
      wetSkill: 3,
      familiarity: 60
    },
    salary: 12000,
    willingness: 88,
    specialties: ['young-talent'],
    contract: {
      signed: false,
      remainingRaces: 0,
      fee: 0
    },
    fatigue: 0
  },
  {
    id: 'driver-8',
    name: 'Christian Engelhart',
    nationality: 'German',
    age: 38,
    rating: 'bronze',
    skills: {
      technical: 65,
      stamina: 70,
      pressure: 4,
      wetSkill: 2,
      familiarity: 55
    },
    salary: 0,
    willingness: 90,
    specialties: ['gentleman-driver'],
    contract: {
      signed: false,
      remainingRaces: 0,
      fee: 18000
    },
    fatigue: 0
  },
  {
    id: 'driver-9',
    name: 'Maxime Martin',
    nationality: 'Belgian',
    age: 33,
    rating: 'gold',
    skills: {
      technical: 85,
      stamina: 91,
      pressure: 2,
      wetSkill: 4,
      familiarity: 72
    },
    salary: 32000,
    willingness: 72,
    specialties: ['endurance'],
    contract: {
      signed: false,
      remainingRaces: 0,
      fee: 0
    },
    fatigue: 0
  },
  {
    id: 'driver-10',
    name: 'Klaus Bachler',
    nationality: 'Austrian',
    age: 42,
    rating: 'bronze',
    skills: {
      technical: 62,
      stamina: 65,
      pressure: 5,
      wetSkill: 2,
      familiarity: 50
    },
    salary: 0,
    willingness: 92,
    specialties: ['gentleman-driver'],
    contract: {
      signed: false,
      remainingRaces: 0,
      fee: 22000
    },
    fatigue: 0
  },
  {
    id: 'driver-11',
    name: 'Dennis Olsen',
    nationality: 'Norwegian',
    age: 28,
    rating: 'gold',
    skills: {
      technical: 87,
      stamina: 88,
      pressure: 3,
      wetSkill: 4,
      familiarity: 78
    },
    salary: 38000,
    willingness: 70,
    specialties: ['qualifying', 'wet-race'],
    contract: {
      signed: false,
      remainingRaces: 0,
      fee: 0
    },
    fatigue: 0
  },
  {
    id: 'driver-12',
    name: 'Charlie Eastwood',
    nationality: 'Irish',
    age: 29,
    rating: 'silver',
    skills: {
      technical: 82,
      stamina: 86,
      pressure: 3,
      wetSkill: 3,
      familiarity: 68
    },
    salary: 18000,
    willingness: 82,
    specialties: ['young-talent', 'consistency'],
    contract: {
      signed: false,
      remainingRaces: 0,
      fee: 0
    },
    fatigue: 0
  }
];
