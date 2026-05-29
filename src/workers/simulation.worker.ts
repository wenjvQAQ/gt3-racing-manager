/// <reference lib="webworker" />

import {
  RaceTrack,
  Weather,
  CarState,
  SimulationEvent,
  RaceSimulationConfig,
  TICK_SIZE
} from '../types/track';
import { simulateStep, sortCarsByPosition, detectIncidents, detectOvertakes } from '../engine/simulation';

interface SimulationMessage {
  type: 'start' | 'tick' | 'stop' | 'fast_forward';
  cars?: CarState[];
  track?: RaceTrack;
  weather?: Weather;
  config?: RaceSimulationConfig;
  duration?: number;
}

interface SimulationResponse {
  type: 'update' | 'complete' | 'event';
  cars?: CarState[];
  events?: SimulationEvent[];
  progress?: number;
  message?: string;
}

let simulationCars: CarState[] = [];
let currentTrack: RaceTrack | null = null;
let currentWeather: Weather | null = null;
let currentConfig: RaceSimulationConfig | null = null;
let isRunning = false;

function handleMessage(event: MessageEvent<SimulationMessage>) {
  const data = event.data;
  
  switch (data.type) {
    case 'start':
      if (data.cars && data.track && data.weather && data.config) {
        simulationCars = JSON.parse(JSON.stringify(data.cars));
        currentTrack = data.track;
        currentWeather = data.weather;
        currentConfig = data.config;
        isRunning = true;
        runSimulation();
      }
      break;
      
    case 'tick':
      if (currentTrack && currentWeather && currentConfig) {
        const events: SimulationEvent[] = [];
        
        const previousPositions = simulationCars.map(c => ({ carId: c.carId, position: c.positionOnTrack }));
        
        simulationCars = simulateStep(simulationCars, currentTrack, currentWeather, currentConfig);
        
        const newIncidents = detectIncidents(simulationCars, currentConfig, 0);
        events.push(...newIncidents);
        
        const overtakes = detectOvertakes(previousPositions, simulationCars);
        events.push(...overtakes);
        
        const response: SimulationResponse = {
          type: 'update',
          cars: simulationCars,
          events
        };
        
        postMessage(response);
      }
      break;
      
    case 'fast_forward':
      if (currentTrack && currentWeather && currentConfig && data.duration) {
        const events: SimulationEvent[] = [];
        const totalTicks = Math.floor(data.duration / TICK_SIZE);
        
        for (let i = 0; i < totalTicks; i++) {
          const previousPositions = simulationCars.map(c => ({ carId: c.carId, position: c.positionOnTrack }));
          
          simulationCars = simulateStep(simulationCars, currentTrack, currentWeather, currentConfig);
          
          const newIncidents = detectIncidents(simulationCars, currentConfig, i * TICK_SIZE);
          events.push(...newIncidents);
          
          const overtakes = detectOvertakes(previousPositions, simulationCars);
          events.push(...overtakes);
          
          if (i % 50 === 0) {
            const response: SimulationResponse = {
              type: 'update',
              cars: [...simulationCars],
              events: events.slice(-10),
              progress: i / totalTicks
            };
            postMessage(response);
          }
        }
        
        const response: SimulationResponse = {
          type: 'complete',
          cars: simulationCars,
          events
        };
        postMessage(response);
      }
      break;
      
    case 'stop':
      isRunning = false;
      break;
  }
}

function runSimulation() {
  if (!isRunning) return;
  
  if (currentTrack && currentWeather && currentConfig) {
    const events: SimulationEvent[] = [];
    
    const previousPositions = simulationCars.map(c => ({ carId: c.carId, position: c.positionOnTrack }));
    
    simulationCars = simulateStep(simulationCars, currentTrack, currentWeather, currentConfig);
    
    const newIncidents = detectIncidents(simulationCars, currentConfig, 0);
    events.push(...newIncidents);
    
    const overtakes = detectOvertakes(previousPositions, simulationCars);
    events.push(...overtakes);
    
    const response: SimulationResponse = {
      type: 'update',
      cars: simulationCars,
      events
    };
    
    postMessage(response);
  }
  
  setTimeout(runSimulation, 50);
}

addEventListener('message', handleMessage);
