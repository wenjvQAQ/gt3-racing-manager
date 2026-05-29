import { Link } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';
import { 
  Trophy, 
  Users, 
  Car, 
  Calendar, 
  DollarSign,
  Flag,
  ChevronRight,
  Factory,
  Clock
} from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import { SaveManager } from '../components/SaveManager';

export default function Dashboard() {
  const team = useGameStore((state) => state.team);
  const calendar = useGameStore((state) => state.seasonCalendar);
  const currentRaceWeek = useGameStore((state) => state.currentRaceWeek);
  const results = useGameStore((state) => state.raceResults);

  const upcomingRace = calendar.find((_, index) => index >= currentRaceWeek);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-white">{team.name}</h1>
        <p className="text-gray-400 text-sm md:text-base">GT3 赛车经理</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <div className="bg-carbon-800 border border-carbon-600 rounded-xl p-4 md:p-6 hover:border-fuel-gold/50 transition-all">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="p-2 md:p-3 bg-tire-green/10 rounded-lg">
              <Trophy size={20} className="md:w-6 md:h-6 text-tire-green" />
            </div>
            <span className="text-xs text-gray-500 uppercase tracking-wider hidden md:block">比赛</span>
          </div>
          <div className="text-xl md:text-2xl font-bold text-white">{results.length}</div>
          <p className="text-xs md:text-sm text-gray-400 mt-1">已完成</p>
        </div>

        <div className="bg-carbon-800 border border-carbon-600 rounded-xl p-4 md:p-6 hover:border-fuel-gold/50 transition-all">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="p-2 md:p-3 bg-racing-blue/10 rounded-lg">
              <Users size={20} className="md:w-6 md:h-6 text-racing-blue" />
            </div>
            <span className="text-xs text-gray-500 uppercase tracking-wider hidden md:block">车手</span>
          </div>
          <div className="text-xl md:text-2xl font-bold text-white">{team.drivers.length}</div>
          <p className="text-xs md:text-sm text-gray-400 mt-1">阵容</p>
        </div>

        <div className="bg-carbon-800 border border-carbon-600 rounded-xl p-4 md:p-6 hover:border-fuel-gold/50 transition-all">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="p-2 md:p-3 bg-fuel-gold/10 rounded-lg">
              <Car size={20} className="md:w-6 md:h-6 text-fuel-gold" />
            </div>
            <span className="text-xs text-gray-500 uppercase tracking-wider hidden md:block">赛车</span>
          </div>
          <div className="text-xl md:text-2xl font-bold text-white">{team.cars.length}</div>
          <p className="text-xs md:text-sm text-gray-400 mt-1">车库</p>
        </div>

        <div className="bg-carbon-800 border border-carbon-600 rounded-xl p-4 md:p-6 hover:border-fuel-gold/50 transition-all">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="p-2 md:p-3 bg-tire-green/10 rounded-lg">
              <DollarSign size={20} className="md:w-6 md:h-6 text-tire-green" />
            </div>
            <span className="text-xs text-gray-500 uppercase tracking-wider hidden md:block">资金</span>
          </div>
          <div className={`text-lg md:text-2xl font-bold ${team.balance >= 0 ? 'text-tire-green' : 'text-brake'}`}>
            {formatCurrency(team.balance)}
          </div>
          <p className="text-xs md:text-sm text-gray-400 mt-1">余额</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {upcomingRace && (
            <div className="bg-carbon-800 border border-carbon-600 rounded-xl overflow-hidden">
              <div className="p-4 md:p-6 border-b border-carbon-600 flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-lg md:text-xl font-semibold text-white flex items-center gap-2">
                  <Calendar size={20} className="text-fuel-gold" />
                  下一场比赛
                </h2>
                <span className="px-3 py-1 bg-fuel-gold/20 text-fuel-gold text-xs font-semibold rounded-full">
                  即将开始
                </span>
              </div>

              <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-xl md:text-2xl font-bold text-white">{upcomingRace.name}</h3>
                    <p className="text-gray-400 text-sm">{upcomingRace.track.name}, {upcomingRace.track.country}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {upcomingRace.duration}小时
                      </span>
                      <span className="flex items-center gap-1">
                        <Flag size={14} />
                        {upcomingRace.isGrandPrix ? '大奖赛' : '比赛周末'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-gray-400 mb-1">奖金池</div>
                    <div className="text-xl font-bold text-tire-green">
                      {formatCurrency(upcomingRace.prize.overall + upcomingRace.prize.proAm + upcomingRace.prize.am)}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/calendar"
                    className="flex-1 bg-fuel-gold text-carbon-950 font-semibold py-3 px-4 rounded-lg hover:bg-fuel-gold/90 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    查看详情
                    <ChevronRight size={16} />
                  </Link>
                  {upcomingRace.registeredTeams.includes(team.id) ? (
                    <button className="bg-racing-blue/20 text-racing-blue font-semibold py-3 px-6 rounded-lg border border-racing-blue/30 text-sm md:text-base">
                      已报名
                    </button>
                  ) : (
                    <button
                      onClick={() => useGameStore.getState().registerForRace(upcomingRace.id)}
                      disabled={team.balance < upcomingRace.entryFee}
                      className="bg-tire-green/20 text-tire-green font-semibold py-3 px-6 rounded-lg border border-tire-green/30 hover:bg-tire-green/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                    >
                      报名 ({formatCurrency(upcomingRace.entryFee)})
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="bg-carbon-800 border border-carbon-600 rounded-xl p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-white mb-4">近期成绩</h2>
            {results.length > 0 ? (
              <div className="space-y-3">
                {results.slice(-5).reverse().map((result, index) => (
                  <div key={result.id} className="flex items-center justify-between p-3 md:p-4 bg-carbon-700/50 rounded-lg">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center font-bold text-lg md:text-xl ${
                        result.position <= 3 ? 'bg-fuel-gold/20 text-fuel-gold' : 'bg-carbon-600 text-gray-300'
                      }`}>
                        P{result.position}
                      </div>
                      <div>
                        <div className="font-medium text-white text-sm md:text-base">第 {index + 1} 场</div>
                        <div className="text-xs md:text-sm text-gray-400">完成 {result.lapsCompleted} 圈</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-tire-green text-sm md:text-base">{formatCurrency(result.prizeMoney)}</div>
                      <div className="text-xs md:text-sm text-gray-400">{result.incidentCount} 次事故</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400 text-sm">
                暂无比赛成绩，快去参加比赛吧！
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-carbon-800 border border-carbon-600 rounded-xl p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-white mb-4">快捷操作</h2>
            <div className="space-y-3">
              <Link
                to="/drivers"
                className="flex items-center gap-3 p-3 md:p-4 bg-carbon-700/50 rounded-lg hover:bg-carbon-700 transition-colors"
              >
                <Users size={20} className="text-racing-blue" />
                <span className="font-medium text-white text-sm md:text-base">签约车手</span>
                <ChevronRight size={16} className="ml-auto text-gray-400" />
              </Link>
              <Link
                to="/garage"
                className="flex items-center gap-3 p-3 md:p-4 bg-carbon-700/50 rounded-lg hover:bg-carbon-700 transition-colors"
              >
                <Car size={20} className="text-fuel-gold" />
                <span className="font-medium text-white text-sm md:text-base">管理赛车</span>
                <ChevronRight size={16} className="ml-auto text-gray-400" />
              </Link>
              <Link
                to="/facilities"
                className="flex items-center gap-3 p-3 md:p-4 bg-carbon-700/50 rounded-lg hover:bg-carbon-700 transition-colors"
              >
                <Factory size={20} className="text-tire-green" />
                <span className="font-medium text-white text-sm md:text-base">升级设施</span>
                <ChevronRight size={16} className="ml-auto text-gray-400" />
              </Link>
            </div>
          </div>

          <SaveManager />

          <div className="bg-carbon-800 border border-carbon-600 rounded-xl p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-white mb-4">车队数据</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">声望</span>
                  <span className="text-white font-medium">{team.prestige}</span>
                </div>
                <div className="h-2 bg-carbon-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-fuel-gold transition-all" 
                    style={{ width: `${team.prestige}%` }} 
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">财务信誉</span>
                  <span className="text-white font-medium">{team.financialReputation}</span>
                </div>
                <div className="h-2 bg-carbon-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-tire-green transition-all" 
                    style={{ width: `${team.financialReputation}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
