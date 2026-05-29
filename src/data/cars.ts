import { Car } from '../types/game';

export const INITIAL_CARS: Car[] = [
  {
    id: 'car-1',
    make: 'Porsche',
    model: '911 GT3 R',
    year: 2023,
    purchasePrice: 550000,
    currentCondition: 100,
    maxCondition: 100,
    bopSuitability: {
      highSpeed: 85,
      technical: 90,
      endurance: 88
    },
    maintenanceCost: 25000,
    basePerformance: 88
  },
  {
    id: 'car-2',
    make: 'Mercedes-AMG',
    model: 'GT3 Evo',
    year: 2023,
    purchasePrice: 520000,
    currentCondition: 100,
    maxCondition: 100,
    bopSuitability: {
      highSpeed: 90,
      technical: 85,
      endurance: 87
    },
    maintenanceCost: 23000,
    basePerformance: 86
  },
  {
    id: 'car-3',
    make: 'Ferrari',
    model: '296 GT3',
    year: 2023,
    purchasePrice: 580000,
    currentCondition: 100,
    maxCondition: 100,
    bopSuitability: {
      highSpeed: 88,
      technical: 88,
      endurance: 85
    },
    maintenanceCost: 28000,
    basePerformance: 89
  },
  {
    id: 'car-4',
    make: 'Lamborghini',
    model: 'Huracan GT3 EVO2',
    year: 2023,
    purchasePrice: 540000,
    currentCondition: 100,
    maxCondition: 100,
    bopSuitability: {
      highSpeed: 87,
      technical: 86,
      endurance: 89
    },
    maintenanceCost: 26000,
    basePerformance: 87
  },
  {
    id: 'car-5',
    make: 'BMW',
    model: 'M4 GT3',
    year: 2023,
    purchasePrice: 510000,
    currentCondition: 100,
    maxCondition: 100,
    bopSuitability: {
      highSpeed: 84,
      technical: 88,
      endurance: 86
    },
    maintenanceCost: 24000,
    basePerformance: 85
  },
  {
    id: 'car-6',
    make: 'McLaren',
    model: '720S GT3 Evo',
    year: 2023,
    purchasePrice: 560000,
    currentCondition: 100,
    maxCondition: 100,
    bopSuitability: {
      highSpeed: 86,
      technical: 92,
      endurance: 84
    },
    maintenanceCost: 27000,
    basePerformance: 88
  },
  {
    id: 'car-7',
    make: 'Audi',
    model: 'R8 LMS GT3 Evo II',
    year: 2022,
    purchasePrice: 480000,
    currentCondition: 100,
    maxCondition: 100,
    bopSuitability: {
      highSpeed: 83,
      technical: 89,
      endurance: 90
    },
    maintenanceCost: 22000,
    basePerformance: 84
  },
  {
    id: 'car-8',
    make: 'Corvette',
    model: 'Z06 GT3.R',
    year: 2024,
    purchasePrice: 590000,
    currentCondition: 100,
    maxCondition: 100,
    bopSuitability: {
      highSpeed: 92,
      technical: 84,
      endurance: 87
    },
    maintenanceCost: 29000,
    basePerformance: 88
  }
];
