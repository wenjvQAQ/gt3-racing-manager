import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Driver } from '../types/game';
import { DriverCard } from '../components/DriverCard';

const INITIAL_DRIVERS: Driver[] = [
  {
    id: 'drv_1',
    name: 'Max Verstappen',
    nationality: '荷兰',
    age: 27,
    rating: 'platinum',
    skills: {
      pace: 99,
      consistency: 95,
      stamina: 90,
      pressure: 98,
      wetSkill: 92,
      feedback: 85,
      familiarity: {}
    },
    stats: {
      totalRaces: 250,
      wins: 100,
      podiums: 180,
      poles: 85,
      bestResult: 1,
      averagePosition: 3.2,
      totalPoints: 4500
    },
    contract: {
      signed: true,
      remainingRaces: 12,
      remainingSeasons: 2,
      salary: 5000000,
      signingFee: 3000000,
      exclusivity: 'exclusive',
      isPayDriver: false,
      payDriverSponsorship: 0,
      bonusQualifyingTop5: 50000,
      bonusRaceTop3: 100000,
      bonusRaceWin: 300000,
      manufacturerBonus: 50000
    },
    currentTeam: 'Red Bull',
    fatigue: 25,
    maxStamina: 100,
    scoutLevel: 3,
    isScouted: true,
    marketValue: 25000000,
    teamSuitability: 85
  },
  {
    id: 'drv_2',
    name: 'Lewis Hamilton',
    nationality: '英国',
    age: 39,
    rating: 'gold',
    skills: {
      pace: 92,
      consistency: 94,
      stamina: 88,
      pressure: 96,
      wetSkill: 95,
      feedback: 90,
      familiarity: {}
    },
    stats: {
      totalRaces: 350,
      wins: 105,
      podiums: 200,
      poles: 103,
      bestResult: 1,
      averagePosition: 4.5,
      totalPoints: 4800
    },
    contract: {
      signed: true,
      remainingRaces: 8,
      remainingSeasons: 1,
      salary: 3500000,
      signingFee: 2000000,
      exclusivity: 'exclusive',
      isPayDriver: false,
      payDriverSponsorship: 0,
      bonusQualifyingTop5: 40000,
      bonusRaceTop3: 80000,
      bonusRaceWin: 250000,
      manufacturerBonus: 40000
    },
    currentTeam: 'Ferrari',
    fatigue: 30,
    maxStamina: 100,
    scoutLevel: 3,
    isScouted: true,
    marketValue: 18000000,
    teamSuitability: 80
  },
  {
    id: 'drv_3',
    name: 'Lando Norris',
    nationality: '英国',
    age: 24,
    rating: 'silver',
    skills: {
      pace: 85,
      consistency: 82,
      stamina: 88,
      pressure: 78,
      wetSkill: 80,
      feedback: 75,
      familiarity: {}
    },
    stats: {
      totalRaces: 120,
      wins: 5,
      podiums: 30,
      poles: 12,
      bestResult: 1,
      averagePosition: 6.8,
      totalPoints: 1200
    },
    contract: {
      signed: false,
      remainingRaces: 0,
      remainingSeasons: 0,
      salary: 800000,
      signingFee: 400000,
      exclusivity: 'non-exclusive',
      isPayDriver: false,
      payDriverSponsorship: 0,
      bonusQualifyingTop5: 20000,
      bonusRaceTop3: 40000,
      bonusRaceWin: 100000,
      manufacturerBonus: 20000
    },
    currentTeam: null,
    fatigue: 15,
    maxStamina: 100,
    scoutLevel: 2,
    isScouted: true,
    marketValue: 5000000,
    teamSuitability: 78
  },
  {
    id: 'drv_4',
    name: 'George Russell',
    nationality: '英国',
    age: 26,
    rating: 'silver',
    skills: {
      pace: 88,
      consistency: 85,
      stamina: 90,
      pressure: 82,
      wetSkill: 85,
      feedback: 80,
      familiarity: {}
    },
    stats: {
      totalRaces: 150,
      wins: 8,
      podiums: 40,
      poles: 18,
      bestResult: 1,
      averagePosition: 5.5,
      totalPoints: 1800
    },
    contract: {
      signed: true,
      remainingRaces: 10,
      remainingSeasons: 1,
      salary: 1200000,
      signingFee: 600000,
      exclusivity: 'exclusive',
      isPayDriver: false,
      payDriverSponsorship: 0,
      bonusQualifyingTop5: 25000,
      bonusRaceTop3: 50000,
      bonusRaceWin: 150000,
      manufacturerBonus: 25000
    },
    currentTeam: 'Mercedes',
    fatigue: 20,
    maxStamina: 100,
    scoutLevel: 3,
    isScouted: true,
    marketValue: 8000000,
    teamSuitability: 75
  },
  {
    id: 'drv_5',
    name: '业余车手王',
    nationality: '中国',
    age: 45,
    rating: 'bronze',
    skills: {
      pace: 60,
      consistency: 55,
      stamina: 65,
      pressure: 50,
      wetSkill: 45,
      feedback: 60,
      familiarity: {}
    },
    stats: {
      totalRaces: 25,
      wins: 0,
      podiums: 0,
      poles: 0,
      bestResult: 12,
      averagePosition: 18.5,
      totalPoints: 50
    },
    contract: {
      signed: false,
      remainingRaces: 0,
      remainingSeasons: 0,
      salary: 0,
      signingFee: 0,
      exclusivity: 'non-exclusive',
      isPayDriver: true,
      payDriverSponsorship: 800000,
      bonusQualifyingTop5: 0,
      bonusRaceTop3: 0,
      bonusRaceWin: 0,
      manufacturerBonus: 5000
    },
    currentTeam: null,
    fatigue: 10,
    maxStamina: 80,
    scoutLevel: 1,
    isScouted: true,
    marketValue: 100000,
    teamSuitability: 65
  },
  {
    id: 'drv_6',
    name: '本地英雄张',
    nationality: '中国',
    age: 28,
    rating: 'silver',
    skills: {
      pace: 75,
      consistency: 70,
      stamina: 72,
      pressure: 65,
      wetSkill: 60,
      feedback: 70,
      familiarity: {}
    },
    stats: {
      totalRaces: 60,
      wins: 1,
      podiums: 5,
      poles: 2,
      bestResult: 1,
      averagePosition: 12.3,
      totalPoints: 350
    },
    contract: {
      signed: false,
      remainingRaces: 0,
      remainingSeasons: 0,
      salary: 150000,
      signingFee: 50000,
      exclusivity: 'non-exclusive',
      isPayDriver: true,
      payDriverSponsorship: 500000,
      bonusQualifyingTop5: 10000,
      bonusRaceTop3: 20000,
      bonusRaceWin: 50000,
      manufacturerBonus: 15000
    },
    currentTeam: null,
    fatigue: 8,
    maxStamina: 85,
    scoutLevel: 2,
    isScouted: true,
    marketValue: 600000,
    teamSuitability: 88
  },
  {
    id: 'drv_7',
    name: 'Charles Leclerc',
    nationality: '摩纳哥',
    age: 27,
    rating: 'gold',
    skills: {
      pace: 95,
      consistency: 88,
      stamina: 85,
      pressure: 85,
      wetSkill: 90,
      feedback: 82,
      familiarity: {}
    },
    stats: {
      totalRaces: 180,
      wins: 15,
      podiums: 60,
      poles: 35,
      bestResult: 1,
      averagePosition: 4.8,
      totalPoints: 2200
    },
    contract: {
      signed: true,
      remainingRaces: 15,
      remainingSeasons: 2,
      salary: 2800000,
      signingFee: 1500000,
      exclusivity: 'exclusive',
      isPayDriver: false,
      payDriverSponsorship: 0,
      bonusQualifyingTop5: 35000,
      bonusRaceTop3: 70000,
      bonusRaceWin: 200000,
      manufacturerBonus: 35000
    },
    currentTeam: 'Ferrari',
    fatigue: 35,
    maxStamina: 100,
    scoutLevel: 3,
    isScouted: true,
    marketValue: 15000000,
    teamSuitability: 70
  },
  {
    id: 'drv_8',
    name: 'Fernando Alonso',
    nationality: '西班牙',
    age: 44,
    rating: 'gold',
    skills: {
      pace: 90,
      consistency: 92,
      stamina: 85,
      pressure: 97,
      wetSkill: 93,
      feedback: 95,
      familiarity: {}
    },
    stats: {
      totalRaces: 420,
      wins: 32,
      podiums: 105,
      poles: 22,
      bestResult: 1,
      averagePosition: 5.2,
      totalPoints: 3500
    },
    contract: {
      signed: true,
      remainingRaces: 10,
      remainingSeasons: 1,
      salary: 2000000,
      signingFee: 1000000,
      exclusivity: 'exclusive',
      isPayDriver: false,
      payDriverSponsorship: 0,
      bonusQualifyingTop5: 30000,
      bonusRaceTop3: 60000,
      bonusRaceWin: 180000,
      manufacturerBonus: 30000
    },
    currentTeam: 'Aston Martin',
    fatigue: 40,
    maxStamina: 100,
    scoutLevel: 3,
    isScouted: true,
    marketValue: 12000000,
    teamSuitability: 72
  },
  {
    id: 'drv_9',
    name: 'Oscar Piastri',
    nationality: '澳大利亚',
    age: 24,
    rating: 'silver',
    skills: {
      pace: 82,
      consistency: 80,
      stamina: 85,
      pressure: 75,
      wetSkill: 78,
      feedback: 72,
      familiarity: {}
    },
    stats: {
      totalRaces: 50,
      wins: 2,
      podiums: 10,
      poles: 3,
      bestResult: 1,
      averagePosition: 7.8,
      totalPoints: 450
    },
    contract: {
      signed: true,
      remainingRaces: 20,
      remainingSeasons: 3,
      salary: 500000,
      signingFee: 250000,
      exclusivity: 'exclusive',
      isPayDriver: false,
      payDriverSponsorship: 0,
      bonusQualifyingTop5: 15000,
      bonusRaceTop3: 30000,
      bonusRaceWin: 80000,
      manufacturerBonus: 15000
    },
    currentTeam: 'McLaren',
    fatigue: 18,
    maxStamina: 100,
    scoutLevel: 2,
    isScouted: true,
    marketValue: 4000000,
    teamSuitability: 78
  },
  {
    id: 'drv_10',
    name: 'Nico Hülkenberg',
    nationality: '德国',
    age: 37,
    rating: 'silver',
    skills: {
      pace: 78,
      consistency: 85,
      stamina: 82,
      pressure: 80,
      wetSkill: 82,
      feedback: 80,
      familiarity: {}
    },
    stats: {
      totalRaces: 220,
      wins: 0,
      podiums: 5,
      poles: 1,
      bestResult: 2,
      averagePosition: 9.5,
      totalPoints: 800
    },
    contract: {
      signed: false,
      remainingRaces: 0,
      remainingSeasons: 0,
      salary: 350000,
      signingFee: 150000,
      exclusivity: 'non-exclusive',
      isPayDriver: false,
      payDriverSponsorship: 0,
      bonusQualifyingTop5: 12000,
      bonusRaceTop3: 25000,
      bonusRaceWin: 60000,
      manufacturerBonus: 12000
    },
    currentTeam: null,
    fatigue: 22,
    maxStamina: 100,
    scoutLevel: 2,
    isScouted: true,
    marketValue: 2000000,
    teamSuitability: 68
  }
];

const DriverMarket: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'available' | 'scout-pool' | 'my-drivers'>('available');
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [showTransferWindowAlert, setShowTransferWindowAlert] = useState(false);

  const [availableDrivers, setAvailableDrivers] = useState<Driver[]>(
    INITIAL_DRIVERS.filter(d => !d.contract.signed)
  );
  const [myDrivers, setMyDrivers] = useState<Driver[]>(
    INITIAL_DRIVERS.filter(d => d.contract.signed)
  );
  const [scoutPool, setScoutPool] = useState<Driver[]>(
    [
      {
        id: 'scout_1',
        name: '新生代李',
        nationality: '中国',
        age: 20,
        rating: 'bronze',
        skills: {
          pace: 65,
          consistency: 50,
          stamina: 70,
          pressure: 55,
          wetSkill: 50,
          feedback: 60,
          familiarity: {}
        },
        stats: { totalRaces: 0, wins: 0, podiums: 0, poles: 0, bestResult: 0, averagePosition: 0, totalPoints: 0 },
        contract: {
          signed: false, remainingRaces: 0, remainingSeasons: 0,
          salary: 50000, signingFee: 20000, exclusivity: 'non-exclusive',
          isPayDriver: true, payDriverSponsorship: 300000,
          bonusQualifyingTop5: 0, bonusRaceTop3: 0, bonusRaceWin: 0, manufacturerBonus: 0
        },
        currentTeam: null, fatigue: 5, maxStamina: 90, scoutLevel: 0, isScouted: false,
        marketValue: 100000, teamSuitability: 70
      },
      {
        id: 'scout_2',
        name: '潜力股王',
        nationality: '日本',
        age: 22,
        rating: 'bronze',
        skills: {
          pace: 70,
          consistency: 55,
          stamina: 75,
          pressure: 60,
          wetSkill: 55,
          feedback: 65,
          familiarity: {}
        },
        stats: { totalRaces: 5, wins: 0, podiums: 0, poles: 0, bestResult: 15, averagePosition: 19, totalPoints: 10 },
        contract: {
          signed: false, remainingRaces: 0, remainingSeasons: 0,
          salary: 80000, signingFee: 40000, exclusivity: 'non-exclusive',
          isPayDriver: true, payDriverSponsorship: 250000,
          bonusQualifyingTop5: 5000, bonusRaceTop3: 10000, bonusRaceWin: 25000, manufacturerBonus: 5000
        },
        currentTeam: null, fatigue: 8, maxStamina: 95, scoutLevel: 0, isScouted: false,
        marketValue: 200000, teamSuitability: 75
      }
    ]
  );

  const handleViewDetails = (driver: Driver) => {
    console.log('Viewing driver details:', driver.name);
  };

  const handleSignDriver = (driver: Driver) => {
    if (Math.random() < 0.2) {
      setShowTransferWindowAlert(true);
      setTimeout(() => setShowTransferWindowAlert(false), 3000);
      return;
    }
    console.log('Signing driver:', driver.name);
  };

  const handleScoutDriver = (driverId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setScoutPool(prev => 
        prev.map(d => d.id === driverId ? { ...d, isScouted: true, scoutLevel: 2 } : d)
      );
      setIsLoading(false);
    }, 1500);
  };

  const getFilteredDrivers = () => {
    let drivers: Driver[] = [];
    
    switch (activeTab) {
      case 'available':
        drivers = availableDrivers;
        break;
      case 'scout-pool':
        drivers = scoutPool;
        break;
      case 'my-drivers':
        drivers = myDrivers;
        break;
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      drivers = drivers.filter(d => 
        d.name.toLowerCase().includes(term) ||
        d.nationality.toLowerCase().includes(term)
      );
    }

    if (ratingFilter !== 'all') {
      drivers = drivers.filter(d => d.rating === ratingFilter);
    }

    return drivers;
  };

  const filteredDrivers = getFilteredDrivers();

  return (
    <div className="min-h-screen bg-[#0E1217] text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0E1217] border-b border-[#2D3748]">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-[#2D3748] rounded-lg transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold">车手市场</h1>
          </div>
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
            转会窗口开放
          </span>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#2D3748]">
          {[
            { id: 'available', label: '自由市场' },
            { id: 'scout-pool', label: '球探池' },
            { id: 'my-drivers', label: '我的车手' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 text-sm font-semibold transition-all relative ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E10600]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 space-y-3">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="搜索车手..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#1A2028] border border-[#2D3748] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#E10600]"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setRatingFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              ratingFilter === 'all'
                ? 'bg-[#E10600] text-white'
                : 'bg-[#2D3748] text-gray-400 hover:text-gray-300'
            }`}
          >
            全部
          </button>
          {['platinum', 'gold', 'silver', 'bronze'].map(rating => (
            <button
              key={rating}
              onClick={() => setRatingFilter(rating)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                ratingFilter === rating
                  ? 'bg-[#E10600] text-white'
                  : 'bg-[#2D3748] text-gray-400 hover:text-gray-300'
              }`}
            >
              {rating === 'platinum' ? '铂金' : 
               rating === 'gold' ? '金' : 
               rating === 'silver' ? '银' : '铜'}级
            </button>
          ))}
        </div>
      </div>

      {/* Alert */}
      {showTransferWindowAlert && (
        <div className="mx-4 mb-4 p-3 bg-orange-500/20 border border-orange-500/50 rounded-lg">
          <div className="flex items-center gap-2 text-orange-400">
            <span>⚠️</span>
            <span className="text-sm">转会窗口已关闭！请等待赛季结束后继续。</span>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1A2028] p-8 rounded-xl text-center">
            <div className="animate-spin w-12 h-12 border-4 border-[#E10600] border-t-transparent rounded-full mx-auto mb-4" />
            <div className="text-white font-semibold">球探正在调查中...</div>
            <div className="text-gray-400 text-sm">请稍候</div>
          </div>
        </div>
      )}

      {/* Driver Grid */}
      <div className="px-4 pb-4 space-y-4">
        {filteredDrivers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">🏎️</div>
            <div className="text-lg">没有找到匹配的车手</div>
            <div className="text-sm mt-2">试试调整筛选条件</div>
          </div>
        ) : (
          filteredDrivers.map(driver => (
            <DriverCard
              key={driver.id}
              driver={driver}
              onViewDetails={() => handleViewDetails(driver)}
              onSignDriver={() => handleSignDriver(driver)}
              onScout={() => handleScoutDriver(driver.id)}
              showActions={true}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default DriverMarket;