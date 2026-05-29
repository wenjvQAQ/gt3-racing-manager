import React from 'react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', icon: '🏠', label: '车队' },
    { id: 'race', icon: '📊', label: '比赛' },
    { id: 'market', icon: '📈', label: '市场' },
    { id: 'settings', icon: '⚙️', label: '设置' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1A2028] border-t border-[#2D3748] z-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-around py-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 transition-all ${
                activeTab === tab.id
                  ? 'text-[#E10600]'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-xs font-semibold">{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 w-12 h-0.5 bg-[#E10600] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
