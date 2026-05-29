import React from 'react';
import { Driver } from '../types/game';

interface DriverCardProps {
  driver: Driver;
  onViewDetails: () => void;
  onSignDriver?: () => void;
  onScout?: () => void;
  showActions: boolean;
}

export const DriverCard: React.FC<DriverCardProps> = ({ 
  driver, 
  onViewDetails, 
  onSignDriver, 
  onScout,
  showActions 
}) => {
  
  const getRatingColor = (rating: string) => {
    switch(rating) {
      case 'platinum': return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 'gold': return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
      case 'silver': return 'bg-gradient-to-r from-gray-300 to-gray-400';
      case 'bronze': return 'bg-gradient-to-r from-orange-700 to-orange-800';
      default: return 'bg-gray-500';
    }
  };

  const getRatingText = (rating: string) => {
    switch(rating) {
      case 'platinum': return '铂金';
      case 'gold': return '金';
      case 'silver': return '银';
      case 'bronze': return '铜';
      default: return rating;
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `€${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `€${(amount / 1000).toFixed(0)}K`;
    }
    return `€${amount}`;
  };

  return (
    <div 
      className="bg-[#1A2028] rounded-xl border border-[#2D3748] hover:border-[#E10600] transition-all cursor-pointer overflow-hidden"
      onClick={onViewDetails}
    >
      {/* Header: Rating & Name */}
      <div className="p-4 border-b border-[#2D3748]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${getRatingColor(driver.rating)} flex items-center justify-center`}>
              <span className="text-white font-bold text-xs">
                {getRatingText(driver.rating)[0]}
              </span>
            </div>
            <div>
              <div className="text-white font-semibold">{driver.name}</div>
              <div className="text-gray-400 text-xs flex items-center gap-2">
                <span>{driver.nationality}</span>
                <span>•</span>
                <span>{driver.age}岁</span>
                {driver.contract.isPayDriver && (
                  <>
                    <span>•</span>
                    <span className="text-green-400">💴 付费车手</span>
                  </>
                )}
              </div>
            </div>
          </div>
          {driver.teamSuitability > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">
                {'★'.repeat(Math.floor(driver.teamSuitability / 20))}
                {'☆'.repeat(5 - Math.floor(driver.teamSuitability / 20))}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Skills Summary */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <div className="text-gray-400 text-xs mb-1">速度</div>
            <div className="h-2 bg-[#2D3748] rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${driver.skills.pace}%` }}
              />
            </div>
            <div className="text-white text-xs text-right mt-1">{driver.skills.pace}</div>
          </div>
          <div>
            <div className="text-gray-400 text-xs mb-1">稳定性</div>
            <div className="h-2 bg-[#2D3748] rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all"
                style={{ width: `${driver.skills.consistency}%` }}
              />
            </div>
            <div className="text-white text-xs text-right mt-1">{driver.skills.consistency}</div>
          </div>
          <div>
            <div className="text-gray-400 text-xs mb-1">耐力</div>
            <div className="h-2 bg-[#2D3748] rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-500 transition-all"
                style={{ width: `${driver.skills.stamina}%` }}
              />
            </div>
            <div className="text-white text-xs text-right mt-1">{driver.skills.stamina}</div>
          </div>
        </div>

        {/* Financial Info */}
        <div className="flex items-center justify-between text-xs">
          <div>
            {driver.contract.isPayDriver ? (
              <div className="text-green-400 font-semibold">
                +{formatCurrency(driver.contract.payDriverSponsorship)}/赛季
              </div>
            ) : (
              <div className="text-orange-400 font-semibold">
                {formatCurrency(driver.contract.salary)}/赛季
              </div>
            )}
            {driver.contract.signingFee > 0 && (
              <div className="text-gray-400">
                签字费: {formatCurrency(driver.contract.signingFee)}
              </div>
            )}
          </div>
          {driver.isScouted && (
            <div className="text-gray-500">
              市场价值: {formatCurrency(driver.marketValue)}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="p-4 pt-0 flex gap-2">
          {!driver.isScouted && onScout && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onScout();
              }}
              className="flex-1 py-2 bg-[#2D3748] hover:bg-[#3D4758] text-white rounded-lg text-sm font-semibold transition-all"
            >
              🔍 球探
            </button>
          )}
          {driver.isScouted && onSignDriver && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onSignDriver();
              }}
              className="flex-1 py-2 bg-[#E10600] hover:bg-[#c00500] text-white rounded-lg text-sm font-semibold transition-all"
            >
              📝 签约
            </button>
          )}
        </div>
      )}
    </div>
  );
};