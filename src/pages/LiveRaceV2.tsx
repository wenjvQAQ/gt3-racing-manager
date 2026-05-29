import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';
import { TimelineBar } from '../components/TimelineBar';
import { StagePanel } from '../components/StagePanel';
import { TimelineEvent, TimelineEventStatus, TimelineState } from '../types/game';
import { createTimelineEvents, formatTime } from '../utils/timeline';
import { RaceVisualizerOptimized } from '../components/RaceVisualizerOptimized';
import { TelemetryPanel } from '../components/TelemetryPanel';
import { RaceCommandPanel } from '../components/RaceCommandPanel';
import { 
  RaceTrack, 
  CarState, 
  Weather, 
  RaceSimulationConfig,
  createInitialCarState,
} from '../types/track';
import { simulateStep, simulateRace } from '../engine/simulation';
import { createSPACircuit, createMonzaCircuit, createSimpleTrack } from '../utils/trackGenerator';
import { RaceCommandCenter } from '../components/RaceCommandCenter';
import { saveManager } from '../utils/saveManager';

const LIVE_RACE_CONFIG: RaceSimulationConfig = {
  weather: { type: 'dry', rainIntensity: 0, trackTemperature: 25, airTemperature: 20 },
  safetyCarChance: 0.05,
  incidentBaseChance: 0.001,
  overtakeDifficulty: 0.5
};

const LiveRaceV2: React.FC = () => {
  const { raceId } = useParams<{ raceId: string }>();
  const navigate = useNavigate();
  const { seasonCalendar, team, runRace, currentSeason, saveGame } = useGameStore();
  
  const [timelineState, setTimelineState] = useState<TimelineState>({
    currentTime: 0,
    currentEvent: null,
    events: [],
    phase: 'transport',
    isPaused: true,
    pauseReason: null,
    practiceResults: null,
    qualifyingResults: null,
    viewMode: 'dashboard'
  });
  
  const [showRaceView, setShowRaceView] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [showTelemetry, setShowTelemetry] = useState(true);
  const [selectedDataLayer, setSelectedDataLayer] = useState<'none' | 'tires' | 'performance' | 'fuel'>('none');
  const [cars, setCars] = useState<CarState[]>([]);
  const [raceEvents, setRaceEvents] = useState<{time: number; message: string; type?: string}[]>([]);
  const [currentLap, setCurrentLap] = useState(1);
  const [totalLaps, setTotalLaps] = useState(10);
  const [selectedCarId, setSelectedCarId] = useState<string | undefined>();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const race = seasonCalendar.find(r => r.id === raceId);
  const trackRef = useRef<RaceTrack | null>(null);
  const eventTimeRef = useRef(0);
  
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
  }, []);

  useEffect(() => {
    if (race) {
      const events = createTimelineEvents(race.name);
      setTimelineState(prev => ({
        ...prev,
        events,
        currentEvent: events[0],
        currentTime: events[0].startTime
      }));
      
      if (race.track.name.includes('Spa')) {
        trackRef.current = createSPACircuit();
      } else if (race.track.name.includes('Monza')) {
        trackRef.current = createMonzaCircuit();
      } else {
        trackRef.current = createSimpleTrack(race.track.name, race.track.country);
      }
    }
  }, [race]);
  
  useEffect(() => {
    if (showRaceView && trackRef.current && cars.length === 0) {
      const initialCars: CarState[] = [
        createInitialCarState('car_1', 'J. Evans', 'Audi Sport', '#ff0000', 1, 122.5),
        createInitialCarState('car_2', team.drivers[0]?.name || 'Driver', 'Your Team', '#ffd700', 2, 123.0),
        createInitialCarState('car_3', 'M. Rossi', 'Ferrari', '#dc143c', 3, 123.5),
        createInitialCarState('car_4', 'S. Müller', 'Mercedes', '#00d4ff', 4, 124.0),
        createInitialCarState('car_5', 'K. Tanaka', 'Honda', '#0066ff', 5, 124.5),
        createInitialCarState('car_6', 'A. Dubois', 'BMW', '#0066b3', 6, 125.0),
        createInitialCarState('car_7', 'P. Santos', 'Lamborghini', '#00ff00', 7, 125.5),
        createInitialCarState('car_8', 'L. Chen', 'McLaren', '#ff6600', 8, 126.0),
      ];
      setCars(initialCars);
      setSelectedCarId('car_2');
    }
  }, [showRaceView, team.drivers]);
  
  useEffect(() => {
    if (!isPaused && showRaceView && trackRef.current && cars.length > 0) {
      const interval = setInterval(() => {
        const weather: Weather = { type: 'dry', rainIntensity: 0, trackTemperature: 25, airTemperature: 20 };
        
        const updatedCars = simulateStep(cars, trackRef.current!, weather, LIVE_RACE_CONFIG);
        setCars(updatedCars);
        
        const leader = updatedCars.find(c => c.currentPosition === 1);
        if (leader) {
          setCurrentLap(leader.lap);
        }
        
        eventTimeRef.current += 5;
        
        if (Math.random() < 0.15) {
          const events = [
            { message: '车手: 赛车感觉很棒', type: 'radio' },
            { message: '工程师: 轮胎状态良好', type: 'radio' },
            { message: '工程师: 燃油消耗正常', type: 'radio' },
            { message: '工程师: 注意前方慢车', type: 'radio' },
            { message: '车队无线电: 保持当前节奏', type: 'radio' },
          ];
          
          if (Math.random() < 0.1) {
            const overtakeIdx = Math.floor(Math.random() * updatedCars.length);
            const overtakeCar = updatedCars[overtakeIdx];
            events.push({
              message: `${overtakeCar.driverName} 在弯道超越了前车`,
              type: 'overtake'
            });
          }
          
          if (Math.random() < 0.05) {
            const pitstopCar = updatedCars[Math.floor(Math.random() * updatedCars.length)];
            events.push({
              message: `${pitstopCar.driverName} 进入维修站`,
              type: 'pitstop'
            });
          }
          
          if (Math.random() < 0.02) {
            const incidentCar = updatedCars[Math.floor(Math.random() * updatedCars.length)];
            events.push({
              message: `${incidentCar.driverName} 遭遇机械故障！`,
              type: 'incident'
            });
          }
          
          const randomEvent = events[Math.floor(Math.random() * events.length)];
          setRaceEvents(prev => [...prev.slice(-49), { 
            time: eventTimeRef.current, 
            message: randomEvent.message,
            type: randomEvent.type
          }]);
        }
      }, Math.max(100, 500 / speed));
      
      return () => clearInterval(interval);
    }
  }, [isPaused, speed, showRaceView, cars]);
  
  const handleEventClick = useCallback((event: TimelineEvent) => {
    setTimelineState(prev => ({
      ...prev,
      currentEvent: event,
      currentTime: event.startTime
    }));
  }, []);
  
  const handleDecisionChange = useCallback((decisionId: string, optionId: string) => {
    setTimelineState(prev => ({
      ...prev,
      events: prev.events.map(event => ({
        ...event,
        decisions: event.decisions?.map(decision => 
          decision.id === decisionId
            ? { ...decision, selectedOption: optionId }
            : decision
        )
      }))
    }));
  }, []);
  
  const handleFastForwardToEvent = useCallback((targetEvent: TimelineEvent) => {
    setTimelineState(prev => {
      const newEvents = prev.events.map(event => {
        if (event.startTime < targetEvent.startTime) {
          return { ...event, status: 'completed' as TimelineEventStatus };
        } else if (event.id === targetEvent.id) {
          return { ...event, status: 'active' as TimelineEventStatus };
        } else {
          return event;
        }
      });
      
      return {
        ...prev,
        events: newEvents,
        currentEvent: targetEvent,
        currentTime: targetEvent.startTime,
        isPaused: true
      };
    });
  }, []);
  
  const handleFastForwardToNextDecision = useCallback(() => {
    setTimelineState(prev => {
      const nextDecisionEvent = prev.events.find(e => 
        e.decisions && 
        e.decisions.length > 0 && 
        (e.status === 'pending' || e.startTime > prev.currentTime)
      );
      
      if (nextDecisionEvent) {
        const newEvents = prev.events.map(event => {
          if (event.startTime < nextDecisionEvent.startTime) {
            return { ...event, status: 'completed' as TimelineEventStatus };
          } else if (event.id === nextDecisionEvent.id) {
            return { ...event, status: 'active' as TimelineEventStatus };
          } else {
            return event;
          }
        });
        
        return {
          ...prev,
          events: newEvents,
          currentEvent: nextDecisionEvent,
          currentTime: nextDecisionEvent.startTime,
          isPaused: true
        };
      }
      return prev;
    });
  }, []);
  
  const handleCompleteEvent = useCallback(() => {
    setTimelineState(prev => {
      if (!prev.currentEvent) return prev;
      
      const currentIndex = prev.events.findIndex(e => e.id === prev.currentEvent.id);
      const nextEvent = prev.events[currentIndex + 1];
      
      let newPracticeResults = prev.practiceResults;
      let newQualifyingResults = prev.qualifyingResults;
      
      if (prev.currentEvent.stage === 'practice') {
        newPracticeResults = {
          lapTimes: [123.4, 124.1, 122.9],
          tireDegradation: 15,
          fuelConsumption: 25,
          feedback: '赛车在低速弯表现稳定，但高速弯有点转向不足',
          setupRecommendation: '建议增加前翼角度1-2度，或减小悬挂硬度',
          position: Math.floor(Math.random() * 10) + 1
        };
      }
      
      if (prev.currentEvent.stage === 'qualifying') {
        newQualifyingResults = {
          q1Position: Math.floor(Math.random() * 10) + 1,
          q2Position: Math.floor(Math.random() * 8) + 1,
          q3Position: Math.floor(Math.random() * 6) + 1,
          finalGridPosition: Math.floor(Math.random() * 6) + 1,
          fastestLap: 121.5 + Math.random() * 3,
          incidents: Math.random() > 0.7 ? 1 : 0
        };
      }
      
      const newEvents = prev.events.map((event, index) => {
        if (index === currentIndex) {
          return { ...event, status: 'completed' as TimelineEventStatus };
        } else if (nextEvent && index === currentIndex + 1) {
          return { ...event, status: 'active' as TimelineEventStatus };
        }
        return event;
      });
      
      if (nextEvent && nextEvent.stage === 'race') {
        setShowRaceView(true);
        setIsPaused(true);
      }
      
      return {
        ...prev,
        events: newEvents,
        currentEvent: nextEvent || null,
        currentTime: nextEvent ? nextEvent.startTime : prev.currentTime,
        practiceResults: newPracticeResults,
        qualifyingResults: newQualifyingResults
      };
    });
  }, []);
  
  const handleFinishRace = () => {
    if (race) {
      saveGame();
      runRace(race.id);
      navigate('/');
    }
  };

  const handleExportSave = () => {
    saveManager.downloadSave(1);
  };
  
  if (!race) {
    return (
      <div className="p-4 min-h-screen bg-carbon-950">
        <div className="text-white text-center">
          <h2 className="text-xl font-bold mb-4">比赛未找到</h2>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-fuel-gold text-carbon-950 rounded-lg hover:bg-fuel-gold/80"
          >
            返回
          </button>
        </div>
      </div>
    );
  }
  
  const playerCar = cars.find(c => c.teamName.includes('Your Team'));
  
  return (
    <div className="min-h-screen bg-carbon-950">
      <div className="sticky top-0 z-50 bg-carbon-900 border-b border-carbon-700">
        <div className="px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => navigate('/calendar')}
            className="text-white p-2 hover:bg-carbon-800 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="text-center">
            <h1 className="text-white font-bold text-base md:text-lg truncate max-w-[200px]">{race.name}</h1>
            <p className="text-gray-400 text-xs">{race.track.name}, {race.track.country}</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleExportSave}
              className="text-white p-2 hover:bg-carbon-800 rounded-lg transition-colors"
              title="导出存档"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-white p-2 hover:bg-carbon-800 rounded-lg transition-colors md:hidden"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        <TimelineBar
          events={timelineState.events}
          currentTime={timelineState.currentTime}
          currentEvent={timelineState.currentEvent}
          onEventClick={handleEventClick}
          onFastForwardToEvent={handleFastForwardToEvent}
          onFastForwardToNextDecision={handleFastForwardToNextDecision}
        />
      </div>
      
      {showMobileMenu && (
        <div className="md:hidden bg-carbon-900 border-b border-carbon-700 p-4">
          <div className="text-white text-sm">
            <div className="font-bold mb-2">第 {currentSeason} 赛季</div>
          </div>
        </div>
      )}
      
      <div className="p-4 pb-6">
        {timelineState.currentEvent && timelineState.currentEvent.stage !== 'race' && (
          <StagePanel
            event={timelineState.currentEvent}
            practiceResult={timelineState.practiceResults}
            qualifyingResult={timelineState.qualifyingResults}
            onDecisionChange={handleDecisionChange}
            onComplete={handleCompleteEvent}
            onSkip={timelineState.currentEvent.canSkip ? handleCompleteEvent : undefined}
          />
        )}
        
        {timelineState.currentEvent && timelineState.currentEvent.stage === 'race' && trackRef.current && (
          <div className="space-y-4">
            <div className="bg-carbon-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏁</span>
                  <span className="text-white font-semibold">正赛进行中</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">圈 {currentLap}/{totalLaps}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2
                    ${isPaused 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }
                  `}
                >
                  {isPaused ? (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                      继续
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                      </svg>
                      暂停
                    </>
                  )}
                </button>
                
                <select
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="px-3 py-2 bg-carbon-700 text-white rounded-lg border border-carbon-600 text-sm"
                >
                  <option value={1}>1x</option>
                  <option value={2}>2x</option>
                  <option value={4}>4x</option>
                  <option value={8}>8x</option>
                  <option value={16}>16x</option>
                </select>
                
                <button
                  onClick={handleFinishRace}
                  className="px-4 py-2 bg-fuel-gold text-carbon-950 rounded-lg hover:bg-fuel-gold/80 font-semibold text-sm"
                >
                  结束比赛
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-3 order-2 lg:order-1">
                <div className="bg-carbon-800 rounded-lg p-3">
                  <h4 className="text-white font-semibold mb-3 text-sm">🏆 实时排名</h4>
                  <div className="space-y-2">
                    {cars.slice(0, 8).map((car, index) => (
                      <div 
                        key={car.carId}
                        onClick={() => setSelectedCarId(car.carId)}
                        className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors
                          ${selectedCarId === car.carId 
                            ? 'bg-carbon-600 ring-2 ring-fuel-gold' 
                            : 'bg-carbon-700 hover:bg-carbon-600'
                          }
                        `}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-sm w-6 ${car.currentPosition === 1 ? 'text-yellow-400' : 'text-white'}`}>
                            {car.currentPosition}
                          </span>
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: car.teamColor }}
                          ></div>
                          <span className="text-gray-300 text-xs truncate max-w-[80px]">{car.driverName}</span>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs font-mono ${car.gapToLeader === '0.000' ? 'text-yellow-400' : 'text-gray-400'}`}>
                            {car.gapToLeader}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-6 order-1 lg:order-2">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedDataLayer('none')}
                      className={`px-3 py-1.5 rounded text-xs font-semibold transition-all
                        ${selectedDataLayer === 'none'
                          ? 'bg-carbon-700 text-white'
                          : 'bg-carbon-600 text-gray-300 hover:bg-carbon-500'
                        }
                      `}
                    >
                      无热力图
                    </button>
                    <button
                      onClick={() => setSelectedDataLayer('tires')}
                      className={`px-3 py-1.5 rounded text-xs font-semibold transition-all
                        ${selectedDataLayer === 'tires'
                          ? 'bg-orange-500 text-white'
                          : 'bg-carbon-600 text-gray-300 hover:bg-carbon-500'
                        }
                      `}
                    >
                      🛞 轮胎温度
                    </button>
                    <button
                      onClick={() => setSelectedDataLayer('performance')}
                      className={`px-3 py-1.5 rounded text-xs font-semibold transition-all
                        ${selectedDataLayer === 'performance'
                          ? 'bg-green-500 text-white'
                          : 'bg-carbon-600 text-gray-300 hover:bg-carbon-500'
                        }
                      `}
                    >
                      📊 性能分析
                    </button>
                    <button
                      onClick={() => setSelectedDataLayer('fuel')}
                      className={`px-3 py-1.5 rounded text-xs font-semibold transition-all
                        ${selectedDataLayer === 'fuel'
                          ? 'bg-blue-500 text-white'
                          : 'bg-carbon-600 text-gray-300 hover:bg-carbon-500'
                        }
                      `}
                    >
                      ⛽ 燃油状态
                    </button>
                  </div>
                  
                  <div className="bg-carbon-800 rounded-lg p-2 overflow-hidden">
                    <RaceVisualizerOptimized
                      track={trackRef.current}
                      cars={cars}
                      events={[]}
                      selectedCarId={selectedCarId}
                      selectedDataLayer={selectedDataLayer}
                      isPaused={isPaused}
                      speed={speed}
                    />
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-3 order-3">
                <RaceCommandCenter
                  playerCar={playerCar || null}
                  allCars={cars}
                  isPaused={isPaused}
                  onTogglePause={() => setIsPaused(!isPaused)}
                  onSpeedChange={setSpeed}
                  speed={speed}
                  raceEvents={raceEvents}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveRaceV2;
