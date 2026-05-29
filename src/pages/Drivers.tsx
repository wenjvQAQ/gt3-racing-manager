import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { 
  User, 
  Plus, 
  X, 
  CheckCircle2
} from 'lucide-react';
import { formatCurrency, getRatingColor, getRatingLabel } from '../utils/helpers';
import { Driver } from '../types/game';

export default function Drivers() {
  const drivers = useGameStore((state) => state.team.drivers);
  const availableDrivers = useGameStore((state) => state.availableDrivers);
  const signDriver = useGameStore((state) => state.signDriver);
  const releaseDriver = useGameStore((state) => state.releaseDriver);
  const teamBalance = useGameStore((state) => state.team.balance);
  const [showReleaseConfirm, setShowReleaseConfirm] = useState<string | null>(null);

  const canSignDriver = (driver: Driver) => {
    if (driver.contract.signed) return false;
    if (driver.salary > 0 && teamBalance < driver.salary) return false;
    return true;
  };

  const getDriverNetCost = (driver: Driver) => {
    if (driver.contract.fee > 0) {
      return -driver.contract.fee;
    }
    return driver.salary;
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">车手管理</h1>
          <p className="text-gray-400 mt-1 text-sm md:text-base">签约、管理和发展你的车手阵容</p>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-white flex items-center gap-2">
            <User size={20} className="text-fuel-gold" />
            当前阵容 ({drivers.length})
          </h2>
        </div>

        {drivers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {drivers.map((driver) => (
              <DriverCard 
                key={driver.id} 
                driver={driver} 
                onRelease={() => setShowReleaseConfirm(driver.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-carbon-800 border border-carbon-600 rounded-xl p-8 md:p-12 text-center">
            <User size={48} className="mx-auto text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">暂无签约车手</h3>
            <p className="text-gray-500 mb-4 text-sm md:text-base">在下方签约你的第一位车手开始比赛！</p>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg md:text-xl font-semibold text-white flex items-center gap-2 mb-6">
          <Plus size={20} className="text-tire-green" />
          可签约车手
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {availableDrivers.map((driver) => (
            <div key={driver.id} className="bg-carbon-800 border border-carbon-600 rounded-xl overflow-hidden hover:border-fuel-gold/50 transition-all">
              <div className="p-4 md:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-white text-base md:text-lg">{driver.name}</h3>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getRatingColor(driver.rating)}`}>
                        {getRatingLabel(driver.rating)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{driver.nationality} · {driver.age}岁</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <SkillBar label="技术" value={driver.skills.technical} color="text-fuel-gold" />
                  <SkillBar label="体能" value={driver.skills.stamina} color="text-tire-green" />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">压力系数</span>
                    <span className="text-white">{driver.skills.pressure}/5</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">雨战能力</span>
                    <span className="text-white">{driver.skills.wetSkill}/5</span>
                  </div>
                </div>

                <div className="border-t border-carbon-600 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-gray-400">费用</div>
                      <div className={`font-bold text-lg ${getDriverNetCost(driver) >= 0 ? 'text-brake' : 'text-tire-green'}`}>
                        {getDriverNetCost(driver) >= 0 ? formatCurrency(getDriverNetCost(driver)) : `+${formatCurrency(-getDriverNetCost(driver))}`}
                      </div>
                      <div className="text-xs text-gray-500">
                        {driver.contract.fee > 0 ? '付费绅士' : '每场比赛'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">兴趣度</div>
                      <div className="font-medium text-white">{driver.willingness}%</div>
                    </div>
                  </div>

                  <button
                    onClick={() => signDriver(driver.id)}
                    disabled={!canSignDriver(driver)}
                    className="w-full bg-tire-green text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-tire-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    <Plus size={18} />
                    签约
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {showReleaseConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-carbon-800 border border-carbon-600 rounded-xl max-w-md w-full p-6">
            <div className="flex items-start justify-between mb-6">
              <h3 className="text-xl font-bold text-white">释放车手？</h3>
              <button
                onClick={() => setShowReleaseConfirm(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-400 mb-6 text-sm md:text-base">
              确定要释放这个车手吗？你需要找到替代者。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowReleaseConfirm(null)}
                className="flex-1 bg-carbon-700 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-carbon-600 transition-colors text-sm md:text-base"
              >
                取消
              </button>
              <button
                onClick={() => {
                  releaseDriver(showReleaseConfirm);
                  setShowReleaseConfirm(null);
                }}
                className="flex-1 bg-brake text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-brake/90 transition-colors text-sm md:text-base"
              >
                释放
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DriverCard({ driver, onRelease }: { driver: Driver; onRelease: () => void }) {
  return (
    <div className="bg-carbon-800 border border-carbon-600 rounded-xl overflow-hidden">
      <div className="p-4 md:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-carbon-700 rounded-full flex items-center justify-center">
              <User size={24} className="text-gray-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-white text-sm md:text-base">{driver.name}</h3>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getRatingColor(driver.rating)}`}>
                  {getRatingLabel(driver.rating)}
                </span>
              </div>
              <p className="text-sm text-gray-400">{driver.nationality} · {driver.age}岁</p>
            </div>
          </div>
          <CheckCircle2 size={24} className="text-tire-green" />
        </div>

        <div className="space-y-2 mb-6">
          <SkillBar label="技术" value={driver.skills.technical} color="text-fuel-gold" />
          <SkillBar label="体能" value={driver.skills.stamina} color="text-tire-green" />
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6">
          <div className="bg-carbon-700/50 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400 uppercase">压力</div>
            <div className="text-base md:text-lg font-bold text-white">{driver.skills.pressure}/5</div>
          </div>
          <div className="bg-carbon-700/50 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400 uppercase">雨战</div>
            <div className="text-base md:text-lg font-bold text-white">{driver.skills.wetSkill}/5</div>
          </div>
        </div>

        <button
          onClick={onRelease}
          className="w-full border border-brake/50 text-brake font-semibold py-2.5 px-4 rounded-lg hover:bg-brake/10 transition-colors text-sm md:text-base"
        >
          释放车手
        </button>
      </div>
    </div>
  );
}

function SkillBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-400">{label}</span>
        <span className={color}>{value}</span>
      </div>
      <div className="h-2 bg-carbon-600 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color.replace('text-', 'bg-')} transition-all`} 
          style={{ width: `${value}%` }} 
        />
      </div>
    </div>
  );
}
