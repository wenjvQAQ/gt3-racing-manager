import { useGameStore } from '../stores/gameStore';
import { DollarSign, Calendar, Trophy } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

export const StatusBar = () => {
  const balance = useGameStore((state) => state.team.balance);
  const currentRaceWeek = useGameStore((state) => state.currentRaceWeek);
  const gamePhase = useGameStore((state) => state.gamePhase);
  const prestige = useGameStore((state) => state.team.prestige);

  const getPhaseLabel = () => {
    switch (gamePhase) {
      case 'offseason':
        return '休赛期';
      case 'preseason':
        return '季前';
      case 'season':
        return `第 ${currentRaceWeek} 周`;
      case 'postseason':
        return '季末';
      default:
        return '';
    }
  };

  const isPositiveBalance = balance >= 0;

  return (
    <div className="bg-carbon-800 border-t border-carbon-600 p-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex items-center gap-2">
            <DollarSign size={16} className="md:w-[18px] md:h-[18px] ${isPositiveBalance ? 'text-tire-green' : 'text-brake'}" />
            <span className={`font-mono font-semibold text-sm md:text-base ${isPositiveBalance ? 'text-tire-green' : 'text-brake'}`}>
              {formatCurrency(balance)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar size={16} className="md:w-[18px] md:h-[18px] text-fuel-gold" />
            <span className="font-medium text-gray-300 text-sm md:text-base">{getPhaseLabel()}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex items-center gap-2">
            <Trophy size={16} className="md:w-[18px] md:h-[18px] text-fuel-gold" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 uppercase tracking-wider hidden md:block">声望</span>
              <span className="font-semibold text-white text-sm md:text-base">{prestige}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
