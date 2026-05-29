import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';
import { RaceVisualizer } from '../components/RaceVisualizer';
import { TelemetryPanel } from '../components/TelemetryPanel';
import { RaceCommandPanel } from '../components/RaceCommandPanel';
import { SetupTuningPanel } from '../components/SetupTuningPanel';
import { simulateLiveRace, generateRaceCommands, executeRaceCommand, LiveRaceData, RaceEvent, RaceCommand } from '../utils/raceSimulation';

const LiveRace: React.FC = () => {
  const { raceId } = useParams<{ raceId: string }>();
  const navigate = useNavigate();
  const { seasonCalendar, team, runRace, raceResults } = useGameStore();
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [showSetup, setShowSetup] = useState(true);
  const [showTelemetry, setShowTelemetry] = useState(true);
  const [liveData, setLiveData] = useState<LiveRaceData | null>(null);
  const [raceEvents, setRaceEvents] = useState<RaceEvent[]>([]);
  const [commands, setCommands] = useState<RaceCommand[]>(generateRaceCommands());
  const [activeTab, setActiveTab] = useState<'race' | 'setup'>('setup');
  const [selectedDataLayer, setSelectedDataLayer] = useState<'none' | 'tires' | 'performance' | 'fuel'>('none');

  const race = seasonCalendar.find(r => r.id === raceId);
  const car = team.cars[0];
  const drivers = team.drivers.slice(0, 3);

  useEffect(() => {
    if (!race || !car || drivers.length === 0) return;
    
    const initialData = simulateLiveRace(
      drivers,
      car,
      race,
      {
        tireChoice: 'medium',
        fuelLoad: 'medium',
        initialPitStops: race.type === 'endurance' ? 3 : 1,
        aggressiveness: 50
      },
      {
        weather: 'dry',
        trackTemperature: 25,
        isNight: race.type === 'endurance',
        safetyCarChance: 0.15
      },
      team.manufacturer?.loyalty || 0
    );
    setLiveData(initialData);
    setRaceEvents(initialData.events);
  }, [race, car, drivers, team.manufacturer]);

  const handleCommand = (command: RaceCommand) => {
    if (!liveData) return;
    const { newData } = executeRaceCommand(command, liveData);
    setLiveData(newData);
    setRaceEvents([...newData.events]);
  };

  const handleStartRace = () => {
    setShowSetup(false);
    setIsPaused(false);
    setActiveTab('race');
  };

  const handleFinishRace = () => {
    if (race) {
      runRace(race.id);
      navigate('/');
    }
  };

  if (!race || !car || drivers.length === 0) {
    return (
      <div className="p-6 text-white">
        <h2 className="text-xl font-bold mb-4">比赛未准备好</h2>
        <p className="text-gray-400">请确保你有赛车和车手报名这场比赛。</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-fuel-gold text-carbon-950 rounded-lg hover:bg-fuel-gold/80"
        >
          返回
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 h-[calc(100vh-80px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{race.name}</h1>
          <p className="text-gray-400">{race.track.name}, {race.track.country}</p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === 'race' && (
            <>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="px-4 py-2 bg-carbon-700 text-white rounded-lg hover:bg-carbon-600"
              >
                {isPaused ? '▶ 继续' : '⏸ 暂停'}
              </button>
              <select
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="px-3 py-2 bg-carbon-700 text-white rounded-lg border border-carbon-600"
              >
                <option value={1}>1x</option>
                <option value={2}>2x</option>
                <option value={4}>4x</option>
                <option value={8}>8x</option>
              </select>
              <button
                onClick={handleFinishRace}
                className="px-4 py-2 bg-fuel-gold text-carbon-950 rounded-lg hover:bg-fuel-gold/80"
              >
                结束比赛
              </button>
            </>
          )}
          {activeTab === 'setup' && (
            <button
              onClick={handleStartRace}
              className="px-6 py-3 bg-fuel-gold text-carbon-950 rounded-lg hover:bg-fuel-gold/80 font-bold text-lg"
            >
              开始比赛 🏁
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b border-carbon-700">
        <button
          onClick={() => setActiveTab('setup')}
          className={`px-4 py-2 rounded-t-lg ${
            activeTab === 'setup' 
              ? 'bg-carbon-700 text-white border-t border-l border-r border-carbon-600' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          赛前调校
        </button>
        <button
          onClick={() => {
            if (!showSetup) setActiveTab('race');
          }}
          className={`px-4 py-2 rounded-t-lg ${
            activeTab === 'race' 
              ? 'bg-carbon-700 text-white border-t border-l border-r border-carbon-600' 
              : 'text-gray-400 hover:text-white'
          }`}
          disabled={showSetup}
        >
          比赛
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'setup' && <SetupTuningPanel race={race} car={car} />}
        
        {activeTab === 'race' && liveData && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
            {/* Left Panel - Live Timing */}
            <div className="lg:col-span-3 space-y-4">
              <LiveTimingPanel liveData={liveData} />
            </div>

            {/* Center - Race Visualizer */}
            <div className="lg:col-span-6">
              <div className="space-y-3">
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setSelectedDataLayer('none')}
                    className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                      selectedDataLayer === 'none'
                        ? 'bg-carbon-700 text-white'
                        : 'bg-carbon-600 text-gray-300 hover:bg-carbon-500'
                    }`}
                  >
                    无热力图
                  </button>
                  <button
                    onClick={() => setSelectedDataLayer('tires')}
                    className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                      selectedDataLayer === 'tires'
                        ? 'bg-orange-500 text-white'
                        : 'bg-carbon-600 text-gray-300 hover:bg-carbon-500'
                    }`}
                  >
                    🛞 轮胎温度
                  </button>
                  <button
                    onClick={() => setSelectedDataLayer('performance')}
                    className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                      selectedDataLayer === 'performance'
                        ? 'bg-green-500 text-white'
                        : 'bg-carbon-600 text-gray-300 hover:bg-carbon-500'
                    }`}
                  >
                    📊 性能分析
                  </button>
                  <button
                    onClick={() => setSelectedDataLayer('fuel')}
                    className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                      selectedDataLayer === 'fuel'
                        ? 'bg-blue-500 text-white'
                        : 'bg-carbon-600 text-gray-300 hover:bg-carbon-500'
                    }`}
                  >
                    ⛽ 燃油状态
                  </button>
                </div>
                <RaceVisualizer
                  track={race.track}
                  liveData={liveData}
                  raceEvents={raceEvents}
                  isPaused={isPaused}
                  speed={speed}
                  selectedDataLayer={selectedDataLayer}
                />
              </div>
            </div>

            {/* Right Panel - Telemetry & Commands */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setShowTelemetry(true)}
                  className={`flex-1 px-3 py-2 rounded-lg ${
                    showTelemetry 
                      ? 'bg-fuel-gold text-carbon-950' 
                      : 'bg-carbon-700 text-white hover:bg-carbon-600'
                  }`}
                >
                  遥测
                </button>
                <button
                  onClick={() => setShowTelemetry(false)}
                  className={`flex-1 px-3 py-2 rounded-lg ${
                    !showTelemetry 
                      ? 'bg-fuel-gold text-carbon-950' 
                      : 'bg-carbon-700 text-white hover:bg-carbon-600'
                  }`}
                >
                  指令
                </button>
              </div>
              
              {showTelemetry ? (
                <TelemetryPanel liveData={liveData} />
              ) : (
                <RaceCommandPanel
                  commands={commands}
                  onCommand={handleCommand}
                  liveData={liveData}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const LiveTimingPanel: React.FC<{ liveData: LiveRaceData }> = ({ liveData }) => {
  const [standings] = useState([
    { position: 1, number: 1, name: 'J. Evans', team: 'Audi Sport', gap: '0.000', lastLap: '1:45.234', bestLap: '1:44.891', tires: 'S' },
    { position: 2, number: 99, name: liveData.driver.name, team: 'Your Team', gap: liveData.gapToLeader, lastLap: liveData.lastLap, bestLap: liveData.bestLap, tires: liveData.currentTire.charAt(0).toUpperCase() },
    { position: 3, number: 5, name: 'M. Rossi', team: 'Ferrari', gap: '+3.120', lastLap: '1:45.876', bestLap: '1:45.234', tires: 'M' },
    { position: 4, number: 8, name: 'S. Müller', team: 'Mercedes', gap: '+5.890', lastLap: '1:46.123', bestLap: '1:45.567', tires: 'M' },
    { position: 5, number: 12, name: 'K. Tanaka', team: 'Honda', gap: '+8.456', lastLap: '1:46.543', bestLap: '1:45.987', tires: 'H' },
  ]);

  return (
    <div className="bg-carbon-800 rounded-lg p-4">
      <h3 className="text-lg font-bold text-white mb-3">实时排名</h3>
      <div className="space-y-2">
        {standings.map((driver) => (
          <div
            key={driver.position}
            className={`flex items-center justify-between p-2 rounded ${
              driver.name === liveData.driver.name 
                ? 'bg-fuel-gold/20 border border-fuel-gold' 
                : 'bg-carbon-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`w-6 text-center font-bold ${
                driver.position === 1 ? 'text-yellow-400' :
                driver.position === 2 ? 'text-gray-300' :
                driver.position === 3 ? 'text-orange-400' : 'text-white'
              }`}>
                {driver.position}
              </span>
              <div className="w-8 h-8 bg-carbon-600 rounded flex items-center justify-center text-white text-sm font-bold">
                {driver.number}
              </div>
              <div>
                <p className="text-white text-sm font-medium">{driver.name}</p>
                <p className="text-gray-400 text-xs">{driver.team}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white text-sm">{driver.gap}</p>
              <p className="text-gray-400 text-xs">轮胎: {driver.tires}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveRace;
