import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { 
  Calendar as CalendarIcon, 
  Flag, 
  Clock, 
  Trophy,
  MapPin,
  Play,
  Settings,
  FastForward,
  ChevronRight
} from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';

export default function Calendar() {
  const calendar = useGameStore((state) => state.seasonCalendar);
  const team = useGameStore((state) => state.team);
  const registerForRace = useGameStore((state) => state.registerForRace);
  const runRace = useGameStore((state) => state.runRace);
  const fastForwardToRace = useGameStore((state) => state.fastForwardToRace);
  const raceResults = useGameStore((state) => state.raceResults);
  const currentRaceWeek = useGameStore((state) => state.currentRaceWeek);
  const advanceToNextSeason = useGameStore((state) => state.advanceToNextSeason);
  const isSeasonComplete = useGameStore((state) => state.isSeasonComplete);
  const currentSeason = useGameStore((state) => state.currentSeason);
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const navigate = useNavigate();

  const seasonComplete = isSeasonComplete();

  const getRaceResult = (raceId: string) => {
    return raceResults.find(r => r.raceId === raceId);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">赛历</h1>
          <p className="text-gray-400 mt-1 text-sm md:text-base">查看和报名整个赛季的比赛 · 第 {currentSeason} 赛季</p>
        </div>
        {seasonComplete && (
          <button
            onClick={advanceToNextSeason}
            className="bg-fuel-gold text-carbon-950 font-bold py-3 px-6 rounded-lg hover:bg-fuel-gold/90 transition-colors flex items-center gap-2 shadow-lg animate-pulse"
          >
            <ChevronRight size={20} />
            进入第 {currentSeason + 1} 赛季
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-carbon-800 border border-carbon-600 rounded-xl overflow-hidden">
            <div className="p-4 md:p-6 border-b border-carbon-600">
              <h2 className="text-lg md:text-xl font-semibold text-white flex items-center gap-2">
                <CalendarIcon size={20} className="text-fuel-gold" />
                赛季赛程
              </h2>
            </div>

            <div className="divide-y divide-carbon-600">
              {calendar.map((race, index) => {
                const result = getRaceResult(race.id);
                const isPast = index < currentRaceWeek;
                const isCurrent = index === currentRaceWeek;
                return (
                  <div 
                    key={race.id}
                    onClick={() => setSelectedRace(race.id)}
                    className={`p-4 md:p-6 cursor-pointer transition-all hover:bg-carbon-700/50 ${
                      selectedRace === race.id ? 'bg-carbon-700' : ''
                    } ${
                      isPast ? 'opacity-60' : ''
                    } ${
                      isCurrent ? 'border-l-4 border-l-fuel-gold' : ''
                    }`}
                  >
                    <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base ${
                          race.isGrandPrix ? 'bg-fuel-gold/20 text-fuel-gold' : 'bg-carbon-600 text-gray-300'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-bold text-white text-sm md:text-base">{race.name}</h3>
                            {race.isGrandPrix && (
                              <span className="px-2 py-0.5 bg-fuel-gold/20 text-fuel-gold text-xs font-semibold rounded-full">
                                大奖赛
                              </span>
                            )}
                            {isCurrent && !result && (
                              <span className="px-2 py-0.5 bg-racing-blue/20 text-racing-blue text-xs font-semibold rounded-full animate-pulse">
                                当前
                              </span>
                            )}
                            {result && (
                              <span className="px-2 py-0.5 bg-tire-green/20 text-tire-green text-xs font-semibold rounded-full">
                                已完成
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <MapPin size={12} className="md:w-3.5 md:h-3.5" />
                              {race.track.name}, {race.track.country}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} className="md:w-3.5 md:h-3.5" />
                              {race.duration}小时
                            </span>
                            <span className="flex items-center gap-1">
                              <Flag size={12} className="md:w-3.5 md:h-3.5" />
                              {race.type === 'endurance' ? '耐力赛' : '冲刺赛'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className="text-xs md:text-sm text-gray-400 mb-1">奖金池</div>
                        <div className="text-base md:text-lg font-bold text-tire-green">
                          {formatCurrency(race.prize.overall + race.prize.proAm + race.prize.am)}
                        </div>
                        <div className="mt-2 flex gap-2 justify-end">
                          {result ? (
                            <span className="px-2 md:px-3 py-1 bg-tire-green/20 text-tire-green text-xs font-semibold rounded-full">
                              P{result.position}
                            </span>
                          ) : !isPast && !race.registeredTeams.includes(team.id) && index >= currentRaceWeek ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                fastForwardToRace(race.id);
                              }}
                              className="px-2 py-1 bg-carbon-600 text-gray-300 text-xs font-semibold rounded-full hover:bg-carbon-500 transition-colors flex items-center gap-1"
                              title="快进到这个比赛周"
                            >
                              <FastForward size={12} />
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {selectedRace && (() => {
            const race = calendar.find(r => r.id === selectedRace);
            if (!race) return null;

            const isTeamRegistered = race.registeredTeams.includes(team.id);
            const hasRequiredAssets = team.cars.length > 0 && team.drivers.length > 0;
            const canRegister = !isTeamRegistered && hasRequiredAssets && team.balance >= race.entryFee;
            const result = getRaceResult(race.id);
            const raceIndex = calendar.findIndex(r => r.id === race.id);
            const canRunRace = isTeamRegistered && !result && raceIndex === currentRaceWeek;

            return (
              <>
                <div className="bg-carbon-800 border border-carbon-600 rounded-xl p-4 md:p-6">
                  <h2 className="text-lg md:text-xl font-semibold text-white mb-4">{race.name}</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">赛道</div>
                      <div className="text-white font-medium text-sm md:text-base">{race.track.name}</div>
                      <div className="text-gray-400 text-sm">{race.track.country}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-400 mb-1">赛道长度</div>
                        <div className="text-white font-medium">{race.track.length}km</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">弯道数</div>
                        <div className="text-white font-medium">{race.track.turns}</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-400 mb-1">比赛时长</div>
                      <div className="text-white font-medium">{race.duration} 小时</div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-400 mb-1">报名费</div>
                      <div className="text-white font-medium">{formatCurrency(race.entryFee)}</div>
                    </div>
                  </div>

                  <div className="border-t border-carbon-600 pt-4 mb-4">
                    <h3 className="text-xs md:text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">奖金</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">全场冠军</span>
                        <span className="text-tire-green font-medium">{formatCurrency(race.prize.overall)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Pro-Am冠军</span>
                        <span className="text-tire-green font-medium">{formatCurrency(race.prize.proAm)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Am冠军</span>
                        <span className="text-tire-green font-medium">{formatCurrency(race.prize.am)}</span>
                      </div>
                    </div>
                  </div>

                  {result ? (
                    <div className="bg-tire-green/10 border border-tire-green/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Trophy size={20} className="text-tire-green" />
                        <span className="text-tire-green font-semibold">比赛完成!</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">排名</span>
                          <span className="text-fuel-gold font-bold">P{result.position}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">完成圈数</span>
                          <span className="text-white">{result.lapsCompleted}圈</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">最快圈</span>
                          <span className="text-white">{result.fastestLap}秒</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">事故次数</span>
                          <span className="text-brake">{result.incidentCount}次</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">获得奖金</span>
                          <span className="text-tire-green font-bold">{formatCurrency(result.prizeMoney)}</span>
                        </div>
                      </div>
                    </div>
                  ) : isTeamRegistered ? (
                    <div className="space-y-3">
                      <button
                        onClick={() => navigate(`/race-strategy/${race.id}`)}
                        className="w-full bg-racing-blue text-white font-semibold py-3 px-4 rounded-lg hover:bg-racing-blue/90 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                      >
                        <Settings size={18} />
                        设置比赛策略
                      </button>
                      {canRunRace && (
                        <div className="space-y-2">
                          <button
                            onClick={() => navigate(`/live-race/${race.id}`)}
                            className="w-full bg-fuel-gold text-carbon-950 font-semibold py-3 px-4 rounded-lg hover:bg-fuel-gold/90 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                          >
                            <Play size={18} />
                            开始比赛
                          </button>
                          <button
                            onClick={() => navigate(`/live-race-v2/${race.id}`)}
                            className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                          >
                            <Play size={18} />
                            开始比赛 (时间轴版本 V2)
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {!hasRequiredAssets && (
                        <div className="bg-brake/10 border border-brake/30 rounded-lg p-3 text-sm">
                          <p className="text-brake mb-1">缺少要求：</p>
                          <ul className="text-gray-400 space-y-1">
                            {team.cars.length === 0 && <li>· 需要至少1辆赛车</li>}
                            {team.drivers.length === 0 && <li>· 需要至少1名车手</li>}
                          </ul>
                        </div>
                      )}
                      <button
                        onClick={() => registerForRace(race.id)}
                        disabled={!canRegister}
                        className="w-full bg-fuel-gold text-carbon-950 font-semibold py-3 px-4 rounded-lg hover:bg-fuel-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
                      >
                        <Flag size={18} />
                        报名 ({formatCurrency(race.entryFee)})
                      </button>
                    </div>
                  )}
                </div>
              </>
            );
          })()}

          <div className="bg-carbon-800 border border-carbon-600 rounded-xl p-4 md:p-6">
            <h3 className="text-xs md:text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">快速统计</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">总比赛数</span>
                <span className="text-white font-medium">{calendar.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">大奖赛</span>
                <span className="text-white font-medium">{calendar.filter(r => r.isGrandPrix).length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">已报名</span>
                <span className="text-tire-green font-medium">
                  {calendar.filter(r => r.registeredTeams.includes(team.id)).length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">已完成</span>
                <span className="text-fuel-gold font-medium">{raceResults.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
