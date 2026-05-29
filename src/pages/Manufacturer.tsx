import { useGameStore } from '../stores/gameStore';
import { Building2, Handshake, X, CheckCircle2, Shield, Percent, DollarSign } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

export default function Manufacturer() {
  const manufacturers = useGameStore((state) => state.manufacturers);
  const team = useGameStore((state) => state.team);
  const signManufacturerContract = useGameStore((state) => state.signManufacturerContract);
  const terminateManufacturerContract = useGameStore((state) => state.terminateManufacturerContract);

  const canSignContract = team.prestige >= 60 && !team.manufacturer;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">制造商</h1>
        <p className="text-gray-400 mt-1 text-sm md:text-base">管理与汽车制造商的关系并成为厂商车队</p>
      </div>

      {team.manufacturer && (
        <div className="bg-carbon-800 border border-fuel-gold/30 rounded-xl p-4 md:p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 md:p-3 bg-fuel-gold/10 rounded-lg">
                <CheckCircle2 size={20} className="md:w-6 md:h-6 text-fuel-gold" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-white">已签约厂商</h2>
                <p className="text-fuel-gold font-medium text-sm md:text-base">{team.manufacturer.make}</p>
              </div>
            </div>
            <button
              onClick={terminateManufacturerContract}
              className="flex items-center gap-2 px-3 py-2 bg-brake/20 text-brake rounded-lg hover:bg-brake/30 transition-colors text-sm"
            >
              <X size={16} />
              终止合同
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-carbon-700/50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-400 mb-1">赞助金额</div>
              <div className="text-lg font-bold text-tire-green">{formatCurrency(team.manufacturer.sponsorship)}</div>
            </div>
            <div className="bg-carbon-700/50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-400 mb-1">合作等级</div>
              <div className="text-lg font-bold text-fuel-gold">Lv.{team.manufacturer.level}</div>
            </div>
            <div className="bg-carbon-700/50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-400 mb-1">配件折扣</div>
              <div className="text-lg font-bold text-racing-blue">
                {(team.manufacturer.support.discountParts * 100).toFixed(0)}%
              </div>
            </div>
            <div className="bg-carbon-700/50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-400 mb-1">忠诚度</div>
              <div className="text-lg font-bold text-white">{team.manufacturer.loyalty}%</div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-carbon-600">
            <div className="text-xs text-gray-400 mb-2">当前支持</div>
            <div className="flex flex-wrap gap-2">
              {team.manufacturer.support.engineerSupport && (
                <span className="px-2 py-1 bg-tire-green/20 text-tire-green text-xs font-semibold rounded-full">
                  工程师支持
                </span>
              )}
              {team.manufacturer.support.discountParts > 0 && (
                <span className="px-2 py-1 bg-racing-blue/20 text-racing-blue text-xs font-semibold rounded-full">
                  配件折扣
                </span>
              )}
              {team.manufacturer.support.driverLoans && (
                <span className="px-2 py-1 bg-fuel-gold/20 text-fuel-gold text-xs font-semibold rounded-full">
                  车手租借
                </span>
              )}
              {team.manufacturer.support.freeCars > 0 && (
                <span className="px-2 py-1 bg-purple/20 text-purple text-xs font-semibold rounded-full">
                  免费赛车 x{team.manufacturer.support.freeCars}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <section>
        <h2 className="text-lg md:text-xl font-semibold text-white flex items-center gap-2 mb-6">
          <Handshake size={20} className="text-fuel-gold" />
          厂商合作
        </h2>

        {!canSignContract && !team.manufacturer && (
          <div className="bg-carbon-800 border border-carbon-600 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-brake/10 rounded-lg">
                <Shield size={20} className="text-brake" />
              </div>
              <div>
                <h3 className="font-medium text-white">签约条件未满足</h3>
                <p className="text-sm text-gray-400">需要声望达到 60 才能与厂商签约</p>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">当前声望</span>
                <span className="text-white">{team.prestige}/60</span>
              </div>
              <div className="h-2 bg-carbon-600 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-fuel-gold transition-all" 
                  style={{ width: `${Math.min(100, (team.prestige / 60) * 100)}%` }} 
                />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {manufacturers.map((manufacturer) => {
            const isSigned = team.manufacturer?.make === manufacturer.name;
            const canSign = canSignContract;

            return (
              <div key={manufacturer.id} className={`bg-carbon-800 border rounded-xl overflow-hidden ${
                isSigned ? 'border-fuel-gold/30' : 'border-carbon-600 hover:border-fuel-gold/30'
              } transition-all`}>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-white">{manufacturer.name}</h3>
                    {isSigned && (
                      <span className="px-2 py-0.5 bg-fuel-gold/20 text-fuel-gold text-xs font-semibold rounded-full">
                        已签约
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400 flex items-center gap-1">
                        <DollarSign size={14} />
                        赞助
                      </span>
                      <span className="font-semibold text-tire-green">{formatCurrency(manufacturer.sponsorship)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400 flex items-center gap-1">
                        <Percent size={14} />
                        折扣
                      </span>
                      <span className="font-semibold text-racing-blue">{(manufacturer.discount * 100).toFixed(0)}%</span>
                    </div>
                  </div>

                  {!isSigned && (
                    <button
                      onClick={() => signManufacturerContract(manufacturer.id)}
                      disabled={!canSign}
                      className={`w-full font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm ${
                        canSign
                          ? 'bg-fuel-gold text-carbon-950 hover:bg-fuel-gold/90'
                          : 'bg-carbon-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {canSign ? '签约' : '声望不足'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-carbon-800 border border-carbon-600 rounded-xl p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-white mb-4">厂商合作优势</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-carbon-700/50 rounded-lg p-4">
            <div className="text-tire-green font-semibold mb-1">财务支持</div>
            <div className="text-sm text-gray-400">获得厂商提供的赛季赞助资金，减轻财务压力</div>
          </div>
          <div className="bg-carbon-700/50 rounded-lg p-4">
            <div className="text-racing-blue font-semibold mb-1">技术支持</div>
            <div className="text-sm text-gray-400">配件折扣、工程师派遣、优先获得升级套件</div>
          </div>
          <div className="bg-carbon-700/50 rounded-lg p-4">
            <div className="text-fuel-gold font-semibold mb-1">声望提升</div>
            <div className="text-sm text-gray-400">签约厂商车队可获得额外声望加成，吸引顶级车手</div>
          </div>
        </div>
      </section>
    </div>
  );
}
