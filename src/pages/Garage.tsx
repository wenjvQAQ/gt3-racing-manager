import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { 
  Car, 
  Plus, 
  X, 
  Wrench,
  Gauge,
  Zap,
  Wind
} from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import { Car as CarType } from '../types/game';

export default function Garage() {
  const cars = useGameStore((state) => state.team.cars);
  const availableCars = useGameStore((state) => state.availableForPurchase);
  const purchaseCar = useGameStore((state) => state.purchaseCar);
  const sellCar = useGameStore((state) => state.sellCar);
  const repairCar = useGameStore((state) => state.repairCar);
  const teamBalance = useGameStore((state) => state.team.balance);
  const [showSellConfirm, setShowSellConfirm] = useState<string | null>(null);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">车库</h1>
          <p className="text-gray-400 mt-1 text-sm md:text-base">管理你的GT3赛车车队</p>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-white flex items-center gap-2">
            <Car size={20} className="text-fuel-gold" />
            你的赛车 ({cars.length})
          </h2>
        </div>

        {cars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {cars.map((car) => (
              <CarCard 
                key={car.id} 
                car={car} 
                onSell={() => setShowSellConfirm(car.id)}
                onRepair={() => repairCar(car.id)}
                teamBalance={teamBalance}
              />
            ))}
          </div>
        ) : (
          <div className="bg-carbon-800 border border-carbon-600 rounded-xl p-8 md:p-12 text-center">
            <Car size={48} className="mx-auto text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">车库空空如也</h3>
            <p className="text-gray-500 mb-4 text-sm md:text-base">在下方购买你的第一辆赛车开始比赛！</p>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg md:text-xl font-semibold text-white flex items-center gap-2 mb-6">
          <Plus size={20} className="text-tire-green" />
          可购买赛车
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {availableCars.map((car) => (
            <div key={car.id} className="bg-carbon-800 border border-carbon-600 rounded-xl overflow-hidden hover:border-fuel-gold/50 transition-all">
              <div className="p-4 md:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-white text-base md:text-lg">{car.make}</h3>
                    <p className="text-fuel-gold font-medium text-sm md:text-base">{car.model}</p>
                    <p className="text-sm text-gray-400">{car.year}款</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Gauge size={16} className="text-gray-400" />
                    <span className="text-gray-400">基础性能</span>
                    <span className="ml-auto text-white font-medium">{car.basePerformance}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Zap size={16} className="text-gray-400" />
                    <span className="text-gray-400">高速赛道</span>
                    <span className="ml-auto text-white font-medium">{car.bopSuitability.highSpeed}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Wind size={16} className="text-gray-400" />
                    <span className="text-gray-400">技术赛道</span>
                    <span className="ml-auto text-white font-medium">{car.bopSuitability.technical}</span>
                  </div>
                </div>

                <div className="border-t border-carbon-600 pt-4">
                  <div className="mb-4">
                    <div className="text-sm text-gray-400">购买价格</div>
                    <div className="text-xl md:text-2xl font-bold text-fuel-gold">{formatCurrency(car.purchasePrice)}</div>
                  </div>

                  <button
                    onClick={() => purchaseCar(car.id)}
                    disabled={teamBalance < car.purchasePrice}
                    className="w-full bg-fuel-gold text-carbon-950 font-semibold py-2.5 px-4 rounded-lg hover:bg-fuel-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    <Plus size={18} />
                    购买
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {showSellConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-carbon-800 border border-carbon-600 rounded-xl max-w-md w-full p-6">
            <div className="flex items-start justify-between mb-6">
              <h3 className="text-xl font-bold text-white">出售赛车？</h3>
              <button
                onClick={() => setShowSellConfirm(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-400 mb-6 text-sm md:text-base">
              确定要出售这辆赛车吗？你将失去所有升级和熟悉度。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSellConfirm(null)}
                className="flex-1 bg-carbon-700 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-carbon-600 transition-colors text-sm md:text-base"
              >
                取消
              </button>
              <button
                onClick={() => {
                  sellCar(showSellConfirm);
                  setShowSellConfirm(null);
                }}
                className="flex-1 bg-brake text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-brake/90 transition-colors text-sm md:text-base"
              >
                出售
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CarCard({ car, onSell, onRepair, teamBalance }: { car: CarType; onSell: () => void; onRepair: () => void; teamBalance: number }) {
  const repairCost = Math.floor(car.maintenanceCost * (1 - car.currentCondition / 100) * 2);
  const conditionColor = car.currentCondition > 80 ? 'text-tire-green' : car.currentCondition > 50 ? 'text-fuel-gold' : 'text-brake';
  const canRepair = car.currentCondition < 100 && teamBalance >= repairCost;

  return (
    <div className="bg-carbon-800 border border-carbon-600 rounded-xl overflow-hidden">
      <div className="p-4 md:p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-white text-base md:text-lg">{car.make}</h3>
            <p className="text-fuel-gold font-medium text-sm md:text-base">{car.model}</p>
            <p className="text-sm text-gray-400">{car.year}款</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">状态</div>
            <div className={`text-xl md:text-2xl font-bold ${conditionColor}`}>
              {car.currentCondition}%
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">车况</span>
              <span className={conditionColor}>{car.currentCondition}%</span>
            </div>
            <div className="h-2 bg-carbon-600 rounded-full overflow-hidden">
              <div 
                className={`h-full ${conditionColor.replace('text-', 'bg-')} transition-all`} 
                style={{ width: `${car.currentCondition}%` }} 
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="bg-carbon-700/50 rounded-lg p-2 md:p-3 text-center">
            <div className="text-xs text-gray-400 uppercase hidden md:block">基础</div>
            <div className="text-sm md:text-base font-bold text-white">{car.basePerformance}</div>
          </div>
          <div className="bg-carbon-700/50 rounded-lg p-2 md:p-3 text-center">
            <div className="text-xs text-gray-400 uppercase hidden md:block">高速</div>
            <div className="text-sm md:text-base font-bold text-white">{car.bopSuitability.highSpeed}</div>
          </div>
          <div className="bg-carbon-700/50 rounded-lg p-2 md:p-3 text-center">
            <div className="text-xs text-gray-400 uppercase hidden md:block">技术</div>
            <div className="text-sm md:text-base font-bold text-white">{car.bopSuitability.technical}</div>
          </div>
        </div>

        <div className="space-y-3">
          {car.currentCondition < 100 && (
            <button
              onClick={onRepair}
              disabled={!canRepair}
              className="w-full bg-racing-blue/20 text-racing-blue font-semibold py-2.5 px-4 rounded-lg border border-racing-blue/30 hover:bg-racing-blue/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <Wrench size={18} />
              维修 ({formatCurrency(repairCost)})
            </button>
          )}
          <button
            onClick={onSell}
            className="w-full border border-brake/50 text-brake font-semibold py-2.5 px-4 rounded-lg hover:bg-brake/10 transition-colors text-sm md:text-base"
          >
            出售赛车
          </button>
        </div>
      </div>
    </div>
  );
}
