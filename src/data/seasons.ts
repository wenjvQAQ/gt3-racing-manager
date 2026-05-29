import { Track, Race } from '../types/game';

export const TRACKS: Track[] = [
  {
    id: 'track-1',
    name: 'Circuit de Spa-Francorchamps',
    country: 'Belgium',
    length: 7.004,
    turns: 20,
    trackType: 'highSpeed',
    straightLength: 1.8,
    weatherTendency: 'mixed',
    overtakingDifficulty: 7,
    baseLapTime: 130
  },
  {
    id: 'track-2',
    name: 'Nürburgring',
    country: 'Germany',
    length: 5.148,
    turns: 15,
    trackType: 'technical',
    straightLength: 0.8,
    weatherTendency: 'wet',
    overtakingDifficulty: 6,
    baseLapTime: 95
  },
  {
    id: 'track-3',
    name: 'Monza Circuit',
    country: 'Italy',
    length: 5.793,
    turns: 11,
    trackType: 'highSpeed',
    straightLength: 1.5,
    weatherTendency: 'dry',
    overtakingDifficulty: 8,
    baseLapTime: 90
  },
  {
    id: 'track-4',
    name: 'Silverstone Circuit',
    country: 'United Kingdom',
    length: 5.891,
    turns: 18,
    trackType: 'mixed',
    straightLength: 1.0,
    weatherTendency: 'mixed',
    overtakingDifficulty: 6,
    baseLapTime: 100
  },
  {
    id: 'track-5',
    name: 'Circuit Paul Ricard',
    country: 'France',
    length: 5.842,
    turns: 15,
    trackType: 'mixed',
    straightLength: 1.2,
    weatherTendency: 'dry',
    overtakingDifficulty: 7,
    baseLapTime: 98
  },
  {
    id: 'track-6',
    name: 'Circuit de Barcelona-Catalunya',
    country: 'Spain',
    length: 4.657,
    turns: 16,
    trackType: 'technical',
    straightLength: 0.9,
    weatherTendency: 'dry',
    overtakingDifficulty: 5,
    baseLapTime: 88
  },
  {
    id: 'track-7',
    name: 'Daytona International Speedway',
    country: 'United States',
    length: 5.73,
    turns: 12,
    trackType: 'mixed',
    straightLength: 2.5,
    weatherTendency: 'mixed',
    overtakingDifficulty: 9,
    baseLapTime: 105
  },
  {
    id: 'track-8',
    name: 'Mount Panorama Circuit',
    country: 'Australia',
    length: 6.213,
    turns: 23,
    trackType: 'technical',
    straightLength: 1.1,
    weatherTendency: 'mixed',
    overtakingDifficulty: 6,
    baseLapTime: 108
  }
];

export const INITIAL_SEASON: Race[] = [
  {
    id: 'race-1',
    name: 'Sprint Cup - Monza',
    track: TRACKS[2],
    type: 'sprint',
    duration: 2,
    entryFee: 15000,
    prize: {
      overall: 75000,
      proAm: 35000,
      am: 15000
    },
    bop: {
      weightPenalty: 0,
      powerRestriction: 100,
      aeroRestriction: 100,
      published: true
    },
    date: new Date(2024, 3, 15),
    status: 'upcoming',
    registeredTeams: [],
    isGrandPrix: false
  },
  {
    id: 'race-2',
    name: 'Sprint Cup - Barcelona',
    track: TRACKS[5],
    type: 'sprint',
    duration: 2,
    entryFee: 15000,
    prize: {
      overall: 75000,
      proAm: 35000,
      am: 15000
    },
    bop: {
      weightPenalty: 0,
      powerRestriction: 100,
      aeroRestriction: 100,
      published: false
    },
    date: new Date(2024, 4, 5),
    status: 'upcoming',
    registeredTeams: [],
    isGrandPrix: false
  },
  {
    id: 'race-3',
    name: 'TotalEnergies 24 Hours of Spa',
    track: TRACKS[0],
    type: 'endurance',
    duration: 24,
    entryFee: 35000,
    prize: {
      overall: 250000,
      proAm: 120000,
      am: 60000
    },
    bop: {
      weightPenalty: 0,
      powerRestriction: 100,
      aeroRestriction: 100,
      published: false
    },
    date: new Date(2024, 5, 30),
    status: 'upcoming',
    registeredTeams: [],
    isGrandPrix: true
  },
  {
    id: 'race-4',
    name: 'Sprint Cup - Silverstone',
    track: TRACKS[3],
    type: 'sprint',
    duration: 2,
    entryFee: 15000,
    prize: {
      overall: 75000,
      proAm: 35000,
      am: 15000
    },
    bop: {
      weightPenalty: 0,
      powerRestriction: 100,
      aeroRestriction: 100,
      published: false
    },
    date: new Date(2024, 7, 10),
    status: 'upcoming',
    registeredTeams: [],
    isGrandPrix: false
  },
  {
    id: 'race-5',
    name: 'Bathurst 12 Hour',
    track: TRACKS[7],
    type: 'endurance',
    duration: 12,
    entryFee: 30000,
    prize: {
      overall: 180000,
      proAm: 85000,
      am: 40000
    },
    bop: {
      weightPenalty: 0,
      powerRestriction: 100,
      aeroRestriction: 100,
      published: false
    },
    date: new Date(2024, 8, 20),
    status: 'upcoming',
    registeredTeams: [],
    isGrandPrix: true
  },
  {
    id: 'race-6',
    name: 'Sprint Cup - Nürburgring',
    track: TRACKS[1],
    type: 'sprint',
    duration: 2,
    entryFee: 15000,
    prize: {
      overall: 75000,
      proAm: 35000,
      am: 15000
    },
    bop: {
      weightPenalty: 0,
      powerRestriction: 100,
      aeroRestriction: 100,
      published: false
    },
    date: new Date(2024, 9, 5),
    status: 'upcoming',
    registeredTeams: [],
    isGrandPrix: false
  },
  {
    id: 'race-7',
    name: 'Rolex 24 at Daytona',
    track: TRACKS[6],
    type: 'endurance',
    duration: 24,
    entryFee: 40000,
    prize: {
      overall: 300000,
      proAm: 150000,
      am: 75000
    },
    bop: {
      weightPenalty: 0,
      powerRestriction: 100,
      aeroRestriction: 100,
      published: false
    },
    date: new Date(2025, 0, 25),
    status: 'upcoming',
    registeredTeams: [],
    isGrandPrix: true
  }
];
