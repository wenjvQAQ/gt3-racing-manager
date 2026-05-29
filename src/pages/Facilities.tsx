import { useGameStore } from '../stores/gameStore';
import { Factory, Wrench, Zap, Users, Truck } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import type { Facilities as FacilitiesType } from '../types/game';

const FACILITY_INFO: Record<keyof FacilitiesType, { name: string; icon: typeof Wrench; description: string; benefits: string[]; maxLevel: number }> = {
  workshop: {
    name: '车间',
    icon: Wrench,
    description: '维修和维护你的赛车',
    benefits: ['维修成本降低10%/等级', '维修速度提升'],
    maxLevel: 5
  },
  simulator: {
    name: '模拟器',
    icon: Zap,
    description: '训练车手并提升他们的技能',
    benefits: ['车手技能提升加速', '熟悉度增长更快'],
    maxLevel: 3
  },
  engineeringOffice: {
    name: '工程办公室',
    icon: Factory,
    description: '研发和开发升级',
    benefits: ['研发速度提升', '解锁新调校选项'],
    maxLevel: 3
  },
  fitnessCenter: {
    name: '体能中心',
    icon: Users,
    description: '提升车手体能并减少疲劳',
    benefits: ['耐力赛车手疲劳降低', '夜间驾驶表现提升'],
    maxLevel: 3
  },
  logistics: {
    name: '物流车队',
    icon: Truck,
    description: '降低差旅成本并提升可靠性',
    benefits: ['物流成本降低10%/等级', '赛车运输更安全'],
    maxLevel: 3
  }
};

export default function Facilities() {
  const facilities = useGameStore((state) => state.team.facilities);
  const balance = useGameStore((state) => state.team.balance);
  const upgradeFacility = useGameStore((state) => state.upgradeFacility);
  const getFacilityUpgradeCost = useGameStore((state) => state.getFacilityUpgradeCost);

  const handleUpgrade = (facility: keyof FacilitiesType) => {
    upgradeFacility(facility);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">设施</h1>
        <p className="text-gray-400 mt-1 text-sm md:text-base">升级车队设施以获得竞争优势</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {(Object.keys(FACILITY_INFO) as (keyof FacilitiesType)[]).map((facilityKey) => {
          const info = FACILITY_INFO[facilityKey];
          const Icon = info.icon;
          const currentLevel = facilities[facilityKey];
          const upgradeCost = getFacilityUpgradeCost(facilityKey);
          const isMaxLevel = currentLevel >= info.maxLevel;
          const canAfford = balance >= upgradeCost;

          return (
            <div key={facilityKey} className="bg-carbon-800 border border-carbon-600 rounded-xl overflow-hidden">
              <div className="p-4 md:p-6">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="p-2 md:p-3 bg-fuel-gold/10 rounded-lg flex-shrink-0">
                    <Icon size={20} className="md:w-6 md:h-6 text-fuel-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <h3 className="text-base md:text-lg font-bold text-white">{info.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="px-2 md:px-3 py-1 bg-carbon-600 text-white text-xs md:text-sm font-semibold rounded-full">
                          等级 {currentLevel}/{info.maxLevel}
                        </span>
                        {isMaxLevel && (
                          <span className="px-2 py-1 bg-tire-green/20 text-tire-green text-xs font-semibold rounded-full">
                            已满级
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs md:text-sm mb-4">{info.description}</p>
                    
                    <div className="mb-4">
                      <div className="text-xs text-gray-400 mb-2">效果：</div>
                      <ul className="space-y-1">
                        {info.benefits.map((benefit, index) => (
                          <li key={index} className="text-xs md:text-sm text-gray-300 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-tire-green rounded-full flex-shrink-0"></span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {!isMaxLevel && (
                      <button
                        onClick={() => handleUpgrade(facilityKey)}
                        disabled={!canAfford}
                        className={`w-full font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm md:text-base ${
                          canAfford 
                            ? 'bg-fuel-gold text-carbon-950 hover:bg-fuel-gold/90' 
                            : 'bg-carbon-600 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        升级 ({formatCurrency(upgradeCost)})
                      </button>
                    )}
                    {isMaxLevel && (
                      <div className="w-full bg-tire-green/10 border border-tire-green/30 rounded-lg py-2.5 px-4 text-center">
                        <span className="text-tire-green font-semibold text-sm">已达到最高等级</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
