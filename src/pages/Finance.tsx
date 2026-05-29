import { useGameStore } from '../stores/gameStore';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

export default function Finance() {
  const financeHistory = useGameStore((state) => state.team.financeHistory);
  const currentBalance = useGameStore((state) => state.team.balance);

  const totalIncome = financeHistory
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = financeHistory
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const getCategoryName = (category: string) => {
    const names: { [key: string]: string } = {
      sponsorship: '赞助',
      prize: '奖金',
      salary: '薪资',
      maintenance: '维护',
      purchase: '购买',
      facility: '设施',
      travel: '差旅',
      entry: '报名费',
      'gentleman-fee': '绅士费',
      'manufacturer-support': '厂商支持'
    };
    return names[category] || category;
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">财务</h1>
          <p className="text-gray-400 mt-1 text-sm md:text-base">管理车队财务并追踪支出</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-carbon-800 border border-carbon-600 rounded-xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="p-2 md:p-3 bg-tire-green/10 rounded-lg">
              <DollarSign size={20} className="md:w-6 md:h-6 text-tire-green" />
            </div>
            <span className="text-xs text-gray-500 uppercase tracking-wider hidden md:block">余额</span>
          </div>
          <div className={`text-xl md:text-3xl font-bold ${currentBalance >= 0 ? 'text-tire-green' : 'text-brake'}`}>
            {formatCurrency(currentBalance)}
          </div>
        </div>

        <div className="bg-carbon-800 border border-carbon-600 rounded-xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="p-2 md:p-3 bg-racing-blue/10 rounded-lg">
              <TrendingUp size={20} className="md:w-6 md:h-6 text-racing-blue" />
            </div>
            <span className="text-xs text-gray-500 uppercase tracking-wider hidden md:block">收入</span>
          </div>
          <div className="text-xl md:text-3xl font-bold text-tire-green">
            {formatCurrency(totalIncome)}
          </div>
        </div>

        <div className="bg-carbon-800 border border-carbon-600 rounded-xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="p-2 md:p-3 bg-brake/10 rounded-lg">
              <TrendingDown size={20} className="md:w-6 md:h-6 text-brake" />
            </div>
            <span className="text-xs text-gray-500 uppercase tracking-wider hidden md:block">支出</span>
          </div>
          <div className="text-xl md:text-3xl font-bold text-brake">
            {formatCurrency(totalExpenses)}
          </div>
        </div>
      </div>

      <div className="bg-carbon-800 border border-carbon-600 rounded-xl overflow-hidden">
        <div className="p-4 md:p-6 border-b border-carbon-600">
          <h2 className="text-lg md:text-xl font-semibold text-white">交易历史</h2>
        </div>
        <div className="divide-y divide-carbon-600">
          {financeHistory.length > 0 ? (
            financeHistory.slice().reverse().map((transaction) => (
              <div key={transaction.id} className="p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'income' ? 'bg-tire-green/20' : 'bg-brake/20'
                  }`}>
                    {transaction.type === 'income' ? (
                      <ArrowUpRight size={18} className="md:w-5 md:h-5 text-tire-green" />
                    ) : (
                      <ArrowDownRight size={18} className="md:w-5 md:h-5 text-brake" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-white text-sm md:text-base">{transaction.description}</div>
                    <div className="text-xs md:text-sm text-gray-400">{getCategoryName(transaction.category)}</div>
                  </div>
                </div>
                <div className={`font-bold text-base md:text-lg ${transaction.type === 'income' ? 'text-tire-green' : 'text-brake'}`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 md:p-12 text-center text-gray-400">
              <PiggyBank size={48} className="mx-auto text-gray-500 mb-4" />
              <p className="text-sm md:text-base">暂无交易记录</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
