import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  GameState, 
  Team, 
  Facilities, 
  Reputation,
  Driver,
  Car,
  FinanceRecord,
  GameEvent,
  RaceResult,
  ManufacturerContract,
  generateId
} from '../types/game';
import { INITIAL_DRIVERS } from '../data/drivers';
import { INITIAL_CARS } from '../data/cars';
import { INITIAL_SEASON } from '../data/seasons';
import { generateId as generateIdHelper } from '../utils/helpers';
import { simulateRace } from '../engine/raceEngine';

const INITIAL_FACILITIES: Facilities = {
  workshop: 1,
  simulator: 0,
  engineeringOffice: 0,
  fitnessCenter: 0,
  logistics: 0
};

const INITIAL_REPUTATION: Reputation = {
  trackReputation: 50,
  financialReputation: 50,
  mediaReputation: 50
};

const FACILITY_COSTS: Record<keyof Facilities, number[]> = {
  workshop: [0, 50000, 100000, 200000, 350000, 500000],
  simulator: [0, 100000, 180000, 300000],
  engineeringOffice: [0, 80000, 150000, 250000],
  fitnessCenter: [0, 60000, 120000, 200000],
  logistics: [0, 40000, 80000, 150000]
};

const MANUFACTURERS = [
  { id: 'porsche', name: 'Porsche', sponsorship: 200000, discount: 0.1 },
  { id: 'mercedes', name: 'Mercedes-AMG', sponsorship: 180000, discount: 0.08 },
  { id: 'ferrari', name: 'Ferrari', sponsorship: 250000, discount: 0.12 },
  { id: 'lamborghini', name: 'Lamborghini', sponsorship: 220000, discount: 0.1 },
  { id: 'bmw', name: 'BMW', sponsorship: 170000, discount: 0.08 },
  { id: 'mclaren', name: 'McLaren', sponsorship: 190000, discount: 0.09 },
  { id: 'audi', name: 'Audi', sponsorship: 160000, discount: 0.07 },
  { id: 'corvette', name: 'Corvette', sponsorship: 150000, discount: 0.06 }
];

const createInitialTeam = (): Team => {
  return {
    id: generateIdHelper('team'),
    name: 'Racing Team',
    prestige: 50,
    financialReputation: 50,
    balance: 750000,
    drivers: [],
    cars: [],
    facilities: INITIAL_FACILITIES,
    manufacturer: null,
    ownManufacturer: null,
    sponsors: [],
    financeHistory: []
  };
};

const createInitialGameState = (): GameState => {
  return {
    currentSeason: 1,
    currentRaceWeek: 0,
    gamePhase: 'preseason',
    team: createInitialTeam(),
    seasonCalendar: INITIAL_SEASON,
    raceResults: [],
    currentRace: null,
    activeEvents: [],
    reputation: INITIAL_REPUTATION,
    negotiation: null,
    raceStrategies: {}
  };
};

interface GameStore extends GameState {
  availableDrivers: Driver[];
  availableCars: Car[];
  availableForPurchase: Car[];
  manufacturers: typeof MANUFACTURERS;
  gameMode: 'fast' | 'full';
  currentRound: number;
  funds: number;
  
  setTeamName: (name: string) => void;
  advanceWeek: () => void;
  fastForwardToRace: (raceId: string) => void;
  signDriver: (driverId: string) => void;
  releaseDriver: (driverId: string) => void;
  purchaseCar: (carId: string) => void;
  sellCar: (carId: string) => void;
  repairCar: (carId: string) => void;
  registerForRace: (raceId: string) => void;
  addFinanceRecord: (record: Omit<FinanceRecord, 'id' | 'date'>) => void;
  updateReputation: (trackChange?: number, financialChange?: number) => void;
  triggerEvent: (event: GameEvent) => void;
  selectChoice: (eventId: string, choiceIndex: number) => void;
  resetGame: () => void;
  loadGame: (state: GameState) => void;
  
  upgradeFacility: (facility: keyof Facilities) => void;
  getFacilityUpgradeCost: (facility: keyof Facilities) => number;
  signManufacturerContract: (manufacturerId: string) => void;
  terminateManufacturerContract: () => void;
  
  setRaceStrategy: (raceId: string, strategy: any) => void;
  runRace: (raceId: string) => void;
  advanceToNextSeason: () => void;
  isSeasonComplete: () => boolean;
  setGameMode: (mode: 'fast' | 'full') => void;
  saveGame: () => void;
  
  exportSave: () => void;
  importSave: (saveData: any) => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...createInitialGameState(),
      availableDrivers: INITIAL_DRIVERS,
      availableCars: INITIAL_CARS,
      availableForPurchase: INITIAL_CARS,
      manufacturers: MANUFACTURERS,
      gameMode: 'fast',
      currentRound: 1,
      funds: 750000,

      setGameMode: (mode: 'fast' | 'full') => set({ gameMode: mode }),

      saveGame: () => {
        const state = get();
        localStorage.setItem('gt3-quick-save', JSON.stringify({
          currentSeason: state.currentSeason,
          currentRaceWeek: state.currentRaceWeek,
          team: state.team,
          funds: state.funds,
          reputation: state.reputation,
          gameMode: state.gameMode,
          seasonCalendar: state.seasonCalendar
        }));
      },

      setTeamName: (name: string) =>
        set((state) => ({
          team: {
            ...state.team,
            name
          }
        })),

      advanceWeek: () =>
        set((state) => {
          const newRaceWeek = state.currentRaceWeek + 1;
          let newPhase = state.gamePhase;
          
          if (newRaceWeek > state.seasonCalendar.length) {
            newPhase = 'postseason';
          }

          return {
            currentRaceWeek: newRaceWeek,
            gamePhase: newPhase
          };
        }),

      signDriver: (driverId: string) =>
        set((state) => {
          const availableDriver = state.availableDrivers.find(d => d.id === driverId);
          if (!availableDriver) return state;

          const updatedDriver: Driver = {
            ...availableDriver,
            contract: {
              signed: true,
              remainingRaces: 10,
              fee: availableDriver.contract.fee
            }
          };

          let balanceChange = -updatedDriver.salary;
          if (updatedDriver.contract.fee > 0) {
            balanceChange = updatedDriver.contract.fee;
          }

          const financeRecord: Omit<FinanceRecord, 'id' | 'date'> = {
            type: balanceChange > 0 ? 'income' : 'expense',
            category: balanceChange > 0 ? 'gentleman-fee' : 'salary',
            amount: Math.abs(balanceChange),
            description: `${updatedDriver.name} ${balanceChange > 0 ? '付费参赛' : '签约薪资'}`
          };

          return {
            team: {
              ...state.team,
              balance: state.team.balance + balanceChange,
              drivers: [...state.team.drivers, updatedDriver],
              financeHistory: [
                ...state.team.financeHistory,
                {
                  ...financeRecord,
                  id: generateIdHelper('finance'),
                  date: new Date()
                }
              ]
            },
            availableDrivers: state.availableDrivers.filter(d => d.id !== driverId)
          };
        }),

      releaseDriver: (driverId: string) =>
        set((state) => {
          const releasedDriver = state.team.drivers.find(d => d.id === driverId);
          if (!releasedDriver) return state;

          const resetDriver: Driver = {
            ...releasedDriver,
            contract: {
              signed: false,
              remainingRaces: 0,
              fee: releasedDriver.contract.fee
            }
          };

          return {
            team: {
              ...state.team,
              drivers: state.team.drivers.filter(d => d.id !== driverId)
            },
            availableDrivers: [...state.availableDrivers, resetDriver]
          };
        }),

      purchaseCar: (carId: string) =>
        set((state) => {
          const availableCar = state.availableForPurchase.find(c => c.id === carId);
          if (!availableCar || state.team.balance < availableCar.purchasePrice) {
            return state;
          }

          let finalPrice = availableCar.purchasePrice;
          if (state.team.manufacturer && state.team.manufacturer.support.discountParts > 0) {
            finalPrice = Math.floor(finalPrice * (1 - state.team.manufacturer.support.discountParts));
          }

          const financeRecord: Omit<FinanceRecord, 'id' | 'date'> = {
            type: 'expense',
            category: 'purchase',
            amount: finalPrice,
            description: `购买 ${availableCar.make} ${availableCar.model}`
          };

          return {
            team: {
              ...state.team,
              balance: state.team.balance - finalPrice,
              cars: [...state.team.cars, availableCar],
              financeHistory: [
                ...state.team.financeHistory,
                {
                  ...financeRecord,
                  id: generateIdHelper('finance'),
                  date: new Date()
                }
              ]
            },
            availableForPurchase: state.availableForPurchase.filter(c => c.id !== carId)
          };
        }),

      sellCar: (carId: string) =>
        set((state) => {
          const carToSell = state.team.cars.find(c => c.id === carId);
          if (!carToSell) return state;

          const sellPrice = Math.floor(carToSell.purchasePrice * 0.7);

          const financeRecord: Omit<FinanceRecord, 'id' | 'date'> = {
            type: 'income',
            category: 'purchase',
            amount: sellPrice,
            description: `出售 ${carToSell.make} ${carToSell.model}`
          };

          return {
            team: {
              ...state.team,
              balance: state.team.balance + sellPrice,
              cars: state.team.cars.filter(c => c.id !== carId),
              financeHistory: [
                ...state.team.financeHistory,
                {
                  ...financeRecord,
                  id: generateIdHelper('finance'),
                  date: new Date()
                }
              ]
            },
            availableForPurchase: [...state.availableForPurchase, carToSell]
          };
        }),

      repairCar: (carId: string) =>
        set((state) => {
          const carToRepair = state.team.cars.find(c => c.id === carId);
          if (!carToRepair) return state;

          let repairCost = Math.floor(carToRepair.maintenanceCost * (1 - carToRepair.currentCondition / 100) * 2);
          
          const workshopLevel = state.team.facilities.workshop;
          repairCost = Math.floor(repairCost * (1 - workshopLevel * 0.1));
          
          if (state.team.balance < repairCost) return state;

          const financeRecord: Omit<FinanceRecord, 'id' | 'date'> = {
            type: 'expense',
            category: 'maintenance',
            amount: repairCost,
            description: `维修 ${carToRepair.make} ${carToRepair.model}`
          };

          return {
            team: {
              ...state.team,
              balance: state.team.balance - repairCost,
              cars: state.team.cars.map(c => 
                c.id === carId ? { ...c, currentCondition: 100 } : c
              ),
              financeHistory: [
                ...state.team.financeHistory,
                {
                  ...financeRecord,
                  id: generateIdHelper('finance'),
                  date: new Date()
                }
              ]
            }
          };
        }),

      registerForRace: (raceId: string) =>
        set((state) => {
          const race = state.seasonCalendar.find(r => r.id === raceId);
          if (!race || state.team.balance < race.entryFee) return state;

          const logisticsLevel = state.team.facilities.logistics;
          const entryFee = Math.floor(race.entryFee * (1 - logisticsLevel * 0.1));

          const financeRecord: Omit<FinanceRecord, 'id' | 'date'> = {
            type: 'expense',
            category: 'entry',
            amount: entryFee,
            description: `报名 ${race.name}`
          };

          return {
            seasonCalendar: state.seasonCalendar.map(r =>
              r.id === raceId ? { ...r, registeredTeams: [...r.registeredTeams, state.team.id] } : r
            ),
            team: {
              ...state.team,
              balance: state.team.balance - entryFee,
              financeHistory: [
                ...state.team.financeHistory,
                {
                  ...financeRecord,
                  id: generateIdHelper('finance'),
                  date: new Date()
                }
              ]
            }
          };
        }),

      addFinanceRecord: (record) =>
        set((state) => ({
          team: {
            ...state.team,
            balance: state.team.balance + (record.type === 'income' ? record.amount : -record.amount),
            financeHistory: [
              ...state.team.financeHistory,
              {
                ...record,
                id: generateIdHelper('finance'),
                date: new Date()
              }
            ]
          }
        })),

      updateReputation: (trackChange = 0, financialChange = 0) =>
        set((state) => ({
          reputation: {
            ...state.reputation,
            trackReputation: Math.max(0, Math.min(100, state.reputation.trackReputation + trackChange)),
            financialReputation: Math.max(0, Math.min(100, state.reputation.financialReputation + financialChange))
          }
        })),

      triggerEvent: (event) =>
        set((state) => ({
          activeEvents: [...state.activeEvents, event]
        })),

      selectChoice: (eventId, choiceIndex) =>
        set((state) => {
          const event = state.activeEvents.find(e => e.id === eventId);
          if (!event || !event.choices) return state;

          const choice = event.choices[choiceIndex];
          let newBalance = state.team.balance;
          let newPrestige = state.team.prestige;
          let newFinancialReputation = state.team.financialReputation;

          if (choice.effects.balance) {
            newBalance += choice.effects.balance;
          }
          if (choice.effects.prestige) {
            newPrestige = Math.max(0, Math.min(100, newPrestige + choice.effects.prestige));
          }
          if (choice.effects.financialReputation) {
            newFinancialReputation = Math.max(0, Math.min(100, newFinancialReputation + choice.effects.financialReputation));
          }

          return {
            activeEvents: state.activeEvents.filter(e => e.id !== eventId),
            team: {
              ...state.team,
              balance: newBalance,
              prestige: newPrestige,
              financialReputation: newFinancialReputation
            }
          };
        }),

      resetGame: () =>
        set(() => ({
          ...createInitialGameState(),
          availableDrivers: INITIAL_DRIVERS,
          availableCars: INITIAL_CARS,
          availableForPurchase: INITIAL_CARS,
          manufacturers: MANUFACTURERS
        })),

      loadGame: (loadedState) =>
        set(() => ({
          ...loadedState,
          manufacturers: MANUFACTURERS
        })),

      getFacilityUpgradeCost: (facility: keyof Facilities) => {
        const state = get();
        const currentLevel = state.team.facilities[facility];
        const costs = FACILITY_COSTS[facility];
        if (currentLevel >= costs.length - 1) return Infinity;
        return costs[currentLevel + 1];
      },

      upgradeFacility: (facility: keyof Facilities) =>
        set((state) => {
          const cost = get().getFacilityUpgradeCost(facility);
          if (state.team.balance < cost) return state;

          const currentLevel = state.team.facilities[facility];
          if (currentLevel >= FACILITY_COSTS[facility].length - 1) return state;

          const financeRecord: Omit<FinanceRecord, 'id' | 'date'> = {
            type: 'expense',
            category: 'facility',
            amount: cost,
            description: `升级 ${facility} 设施`
          };

          return {
            team: {
              ...state.team,
              balance: state.team.balance - cost,
              facilities: {
                ...state.team.facilities,
                [facility]: currentLevel + 1
              },
              financeHistory: [
                ...state.team.financeHistory,
                {
                  ...financeRecord,
                  id: generateIdHelper('finance'),
                  date: new Date()
                }
              ]
            }
          };
        }),

      signManufacturerContract: (manufacturerId: string) =>
        set((state) => {
          const manufacturer = MANUFACTURERS.find(m => m.id === manufacturerId);
          if (!manufacturer) return state;

          if (state.team.prestige < 60) {
            return state;
          }

          if (state.team.manufacturer) {
            return state;
          }

          const contract: ManufacturerContract = {
            make: manufacturer.name,
            level: 1,
            loyalty: 0,
            isWorksTeam: false,
            support: {
              engineerSupport: false,
              discountParts: manufacturer.discount,
              freeCars: 0,
              driverLoans: false
            },
            sponsorship: manufacturer.sponsorship,
            contractEnds: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          };

          const financeRecord: Omit<FinanceRecord, 'id' | 'date'> = {
            type: 'income',
            category: 'manufacturer-support',
            amount: manufacturer.sponsorship,
            description: `${manufacturer.name} 赞助`
          };

          return {
            team: {
              ...state.team,
              balance: state.team.balance + manufacturer.sponsorship,
              manufacturer: contract,
              financeHistory: [
                ...state.team.financeHistory,
                {
                  ...financeRecord,
                  id: generateIdHelper('finance'),
                  date: new Date()
                }
              ]
            }
          };
        }),

      terminateManufacturerContract: () =>
        set((state) => {
          if (!state.team.manufacturer) return state;

          return {
            team: {
              ...state.team,
              manufacturer: null,
              prestige: Math.max(0, state.team.prestige - 10)
            }
          };
        }),

      setRaceStrategy: (raceId: string, strategy: any) =>
        set((state) => ({
          raceStrategies: {
            ...state.raceStrategies,
            [raceId]: strategy
          }
        })),

      runRace: (raceId: string) =>
        set((state) => {
          const race = state.seasonCalendar.find(r => r.id === raceId);
          if (!race) return state;
          if (!state.team.cars.length || !state.team.drivers.length) return state;

          const car = state.team.cars[0];
          const drivers = state.team.drivers.slice(0, 3);

          const savedStrategy = state.raceStrategies?.[raceId];
          const strategy = savedStrategy || {
            tireChoice: 'medium' as const,
            fuelLoad: 'medium' as const,
            initialPitStops: race.type === 'endurance' ? 3 : 1,
            aggressiveness: 50
          };

          const conditions = {
            weather: 'dry' as const,
            trackTemperature: 25,
            isNight: race.type === 'endurance',
            safetyCarChance: 0.15
          };

          const result = simulateRace(
            drivers,
            car,
            race,
            strategy,
            conditions,
            Math.floor(Math.random() * 15) + 1
          );

          const financeRecord: Omit<FinanceRecord, 'id' | 'date'> = {
            type: 'income',
            category: 'prize',
            amount: result.prizeMoney,
            description: `${race.name} 奖金`
          };

          const updatedCars = state.team.cars.map(c => 
            c.id === car.id ? { ...c, currentCondition: Math.max(0, c.currentCondition - Math.floor(Math.random() * 30) - result.incidentCount * 10) } : c
          );

          const raceIndex = state.seasonCalendar.findIndex(r => r.id === raceId);

          return {
            raceResults: [...state.raceResults, result],
            currentRaceWeek: Math.max(state.currentRaceWeek, raceIndex + 1),
            team: {
              ...state.team,
              balance: state.team.balance + result.prizeMoney,
              prestige: Math.max(0, Math.min(100, state.team.prestige + result.reputationChange)),
              cars: updatedCars,
              financeHistory: [
                ...state.team.financeHistory,
                {
                  ...financeRecord,
                  id: generateIdHelper('finance'),
                  date: new Date()
                }
              ]
            },
            seasonCalendar: state.seasonCalendar.map(r =>
              r.id === raceId ? { ...r, status: 'finished' as const } : r
            )
          };
        }),

      advanceToNextSeason: () =>
        set((state) => {
          const updatedDrivers = state.team.drivers.map(driver => ({
            ...driver,
            age: driver.age + 1,
            skills: {
              ...driver.skills,
              stamina: Math.max(50, driver.skills.stamina - 1)
            }
          }));

          const newBalance = state.team.balance + 500000;

          return {
            currentSeason: state.currentSeason + 1,
            currentRaceWeek: 0,
            gamePhase: 'preseason',
            team: {
              ...state.team,
              drivers: updatedDrivers,
              balance: newBalance,
              financeHistory: [
                ...state.team.financeHistory,
                {
                  id: generateIdHelper('finance'),
                  date: new Date(),
                  type: 'income',
                  category: 'sponsorship',
                  amount: 500000,
                  description: `${state.currentSeason + 1}赛季基础赞助`
                }
              ]
            },
            seasonCalendar: INITIAL_SEASON,
            raceResults: [],
            activeEvents: [],
            negotiation: null
          };
        }),

      isSeasonComplete: () => {
        const state = get();
        return state.raceResults.length >= state.seasonCalendar.length;
      },

      fastForwardToRace: (raceId: string) =>
        set((state) => {
          const raceIndex = state.seasonCalendar.findIndex(r => r.id === raceId);
          if (raceIndex === -1) return state;

          return {
            currentRaceWeek: raceIndex,
            gamePhase: 'season'
          };
        }),

      exportSave: () => {
        const state = get();
        const saveData = {
          version: '1.0',
          exportDate: new Date().toISOString(),
          gameState: {
            currentSeason: state.currentSeason,
            currentRaceWeek: state.currentRaceWeek,
            gamePhase: state.gamePhase,
            team: state.team,
            raceResults: state.raceResults,
            reputation: state.reputation,
            raceStrategies: state.raceStrategies
          }
        };
        const dataStr = JSON.stringify(saveData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `gt3-racing-manager-save-${Date.now()}.json`;
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
      },

      importSave: (saveData: any) => {
        if (!saveData || !saveData.gameState) return;
        set((state) => ({
          ...state,
          currentSeason: saveData.gameState.currentSeason ?? state.currentSeason,
          currentRaceWeek: saveData.gameState.currentRaceWeek ?? state.currentRaceWeek,
          gamePhase: saveData.gameState.gamePhase ?? state.gamePhase,
          team: saveData.gameState.team ?? state.team,
          raceResults: saveData.gameState.raceResults ?? state.raceResults,
          reputation: saveData.gameState.reputation ?? state.reputation,
          raceStrategies: saveData.gameState.raceStrategies ?? state.raceStrategies
        }));
      }
    }),
    {
      name: 'gt3-racing-manager-save'
    }
  )
);
