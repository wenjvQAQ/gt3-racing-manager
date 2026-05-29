import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useParams, useNavigate } from 'react-router-dom';
import { Car as CarIcon, Users, ChevronLeft, Trophy, Circle, Flame, Gauge, Zap, Play } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

export default function RaceStrategy() {
  const { raceId } = useParams<{ raceId: string }>();
  const navigate = useNavigate();
  const calendar = useGameStore((state) => state.seasonCalendar);
  const team = useGameStore((state) => state.team);
  const setRaceStrategy = useGameStore((state) => state.setRaceStrategy);
  const runRace = useGameStore((state) => state.runRace);
  const raceStrategies = useGameStore((state) => state.raceStrategies);

  const race = calendar.find(r => r.id === raceId);
  const savedStrategy = raceStrategies?.[raceId || ''];

  const [strategy, setStrategy] = useState(savedStrategy || {
    tireChoice: 'medium',
    fuelLoad: 'medium',
    aggressiveness: 50,
    pitStopStrategy: race?.type === 'endurance' ? 3 : 1,
    selectedCar: team.cars[0]?.id || null,
    selectedDrivers: team.drivers.slice(0, 3).map(d => d.id)
  });

  if (!race) {
    return (
      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-400">比赛未找到</p>
          <button 
            onClick={() => navigate('/calendar')} 
            className="mt-4 px-4 py-2 bg-fuel-gold text-carbon-950 rounded-lg"
          >
            返回赛历
          </button>
        </div>
      </div>
    );
  }

  const tireOptions = [
    { value: 'soft', label: '软胎', description: '更快的圈速，但磨损更快', icon: Flame, color: 'text-red-400' },
    { value: 'medium', label: '中性胎', description: '性能和磨损的平衡选择', icon: Circle, color: 'text-yellow-400' },
    { value: 'hard', label: '硬胎', description: '更慢但更耐用，适合长距离', icon: Gauge, color: 'text-blue-400' }
  ];

  const fuelOptions = [
    { value: 'low', label: '低载油', description: '更快的圈速，需要更多进站' },
    { value: 'medium', label: '中载油', description: '性能和进站的平衡' },
    { value: 'high', label: '高载油', description: '更重但更少进站' }
  ];

  const handleSaveAndRun = () => {
    setRaceStrategy(race.id, strategy);
    navigate(`/live-race/${race.id}`);
  };

  const handleSave = () => {
    setRaceStrategy(race.id, strategy);
    navigate('/calendar');
  };

  const selectedCar = team.cars.find(c => c.id === strategy.selectedCar);
  const selectedDrivers = team.drivers.filter(d => strategy.selectedDrivers.includes(d.id));

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/calendar')} className="p-2 hover:bg-carbon-700 rounded-lg">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">{race.name}</h1>
          <p className="text-gray-400">{race.track.name}, {race.track.country}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-carbon-800 border border-carbon-600 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Circle size={24} className="text-fuel-gold" />
              <h2 className="text-xl font-semibold">轮胎选择</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tireOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setStrategy({ ...strategy, tireChoice: option.value })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    strategy.tireChoice === option.value
                      ? 'border-fuel-gold bg-fuel-gold/10'
                      : 'border-carbon-600 bg-carbon-700/50 hover:border-carbon-500'
                  }`}
                >
                  <option.icon size={28} className={option.color} />
                  <h3 className="font-semibold mt-2">{option.label}</h3>
                  <p className="text-sm text-gray-400 mt-1">{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-carbon-800 border border-carbon-600 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Zap size={24} className="text-fuel-gold" />
              <h2 className="text-xl font-semibold">比赛策略</h2>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-gray-300 font-medium">燃油载重</label>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {fuelOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setStrategy({ ...strategy, fuelLoad: option.value })}
                      className={`py-3 px-4 rounded-lg border-2 transition-all ${
                        strategy.fuelLoad === option.value
                          ? 'border-fuel-gold bg-fuel-gold/10'
                          : 'border-carbon-600 bg-carbon-700/50 hover:border-carbon-500'
                      }`}
                    >
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-gray-400 mt-1">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-gray-300 font-medium">激进程度</label>
                  <span className="text-fuel-gold font-semibold">{strategy.aggressiveness}%</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 text-sm">保守</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={strategy.aggressiveness}
                    onChange={(e) => setStrategy({ ...strategy, aggressiveness: parseInt(e.target.value) })}
                    className="flex-1 h-2 bg-carbon-600 rounded-lg appearance-none cursor-pointer accent-fuel-gold"
                  />
                  <span className="text-gray-400 text-sm">激进</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  更高的激进程度会带来更快的圈速，但也增加事故风险和轮胎磨损
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-gray-300 font-medium">预期进站次数</label>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() => setStrategy({ ...strategy, pitStopStrategy: num })}
                      className={`flex-1 py-2 px-3 rounded-lg border-2 transition-all ${
                        strategy.pitStopStrategy === num
                          ? 'border-fuel-gold bg-fuel-gold/10'
                          : 'border-carbon-600 bg-carbon-700/50 hover:border-carbon-500'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-carbon-800 border border-carbon-600 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <CarIcon size={24} className="text-fuel-gold" />
              <h2 className="text-lg font-semibold">赛车选择</h2>
            </div>
            {team.cars.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>没有可用的赛车</p>
                <p className="text-sm mt-1">请先购买一辆赛车</p>
              </div>
            ) : (
              <div className="space-y-3">
                {team.cars.map((car) => (
                  <button
                    key={car.id}
                    onClick={() => setStrategy({ ...strategy, selectedCar: car.id })}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      strategy.selectedCar === car.id
                        ? 'border-fuel-gold bg-fuel-gold/10'
                        : 'border-carbon-600 bg-carbon-700/50 hover:border-carbon-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{car.make} {car.model}</div>
                        <div className="text-sm text-gray-400">状态: {car.currentCondition}%</div>
                      </div>
                      {car.currentCondition < 50 && (
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                          需要维修
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-carbon-800 border border-carbon-600 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users size={24} className="text-fuel-gold" />
              <h2 className="text-lg font-semibold">车手选择</h2>
            </div>
            {team.drivers.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>没有签约的车手</p>
                <p className="text-sm mt-1">请先签约一名车手</p>
              </div>
            ) : (
              <div className="space-y-3">
                {team.drivers.slice(0, 3).map((driver) => (
                  <div
                    key={driver.id}
                    className={`p-4 rounded-lg border-2 border-carbon-600 bg-carbon-700/50`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{driver.name}</div>
                        <div className="text-sm text-gray-400">
                          {driver.nationality} · {driver.age}岁
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        driver.rating === 'platinum' ? 'bg-fuel-gold/20 text-fuel-gold' :
                        driver.rating === 'gold' ? 'bg-yellow-400/20 text-yellow-400' :
                        driver.rating === 'silver' ? 'bg-gray-400/20 text-gray-400' :
                        'bg-orange-400/20 text-orange-400'
                      }`}>
                        {driver.rating === 'platinum' ? '铂金' : driver.rating === 'gold' ? '金' : driver.rating === 'silver' ? '银' : '铜'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                      <div>
                        <span className="text-gray-400">技术:</span>
                        <span className="ml-1 text-white">{driver.skills.technical}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">体能:</span>
                        <span className="ml-1 text-white">{driver.skills.stamina}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-carbon-800 border border-carbon-600 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Trophy size={24} className="text-fuel-gold" />
              <h2 className="text-lg font-semibold">奖金</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">全场冠军</span>
                <span className="text-tire-green font-semibold">{formatCurrency(race.prize.overall)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Pro-Am 冠军</span>
                <span className="text-tire-green font-semibold">{formatCurrency(race.prize.proAm)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Am 冠军</span>
                <span className="text-tire-green font-semibold">{formatCurrency(race.prize.am)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleSaveAndRun}
              disabled={!team.cars.length || !team.drivers.length}
              className="w-full bg-tire-green text-white font-bold py-4 px-6 rounded-xl hover:bg-tire-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Play size={20} />
              保存并开始比赛
            </button>
            <button
              onClick={handleSave}
              className="w-full bg-carbon-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-carbon-500 transition-colors"
            >
              仅保存策略
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
