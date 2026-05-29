import { useState } from 'react';
import { 
  Home, 
  Users, 
  Car, 
  Factory, 
  Calendar, 
  DollarSign, 
  Building2,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/drivers', icon: Users, label: '车手' },
  { path: '/garage', icon: Car, label: '车库' },
  { path: '/facilities', icon: Factory, label: '设施' },
  { path: '/calendar', icon: Calendar, label: '赛历' },
  { path: '/finance', icon: DollarSign, label: '财务' },
  { path: '/manufacturer', icon: Building2, label: '厂商' }
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className={`bg-carbon-800 border-r border-carbon-600 transition-all duration-300 flex flex-col ${collapsed ? 'w-20' : 'w-64'} max-h-screen sticky top-0`}>
      <div className="p-4 border-b border-carbon-600 flex items-center justify-between">
        {!collapsed && (
          <h1 className="text-lg md:text-xl font-bold text-fuel-gold">GT3 经理</h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-carbon-700 rounded-lg transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-fuel-gold/20 text-fuel-gold border-l-2 border-fuel-gold'
                  : 'text-gray-400 hover:bg-carbon-700 hover:text-white'
              }`}
            >
              <Icon size={20} />
              {!collapsed && <span className="font-medium text-sm md:text-base">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
