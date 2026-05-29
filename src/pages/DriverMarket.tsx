import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Driver } from '../types/game';
import { DriverCard } from '../components/DriverCard';

const INITIAL_DRIVERS: Driver[] = [
  {
    id: 'drv_1',
    name: 'Laurens Vanthoor',
    nationality: '比利时',
    age: 32,
    rating: 'platinum',
    skills: {
      pace: 96,
      consistency: 94,
      stamina: 92,
      pressure: 95,
      wetSkill: 88,
      feedback: 90,
      familiarity: {}
    },
    stats: {
      totalRaces: 180,
      wins: 45,
      podiums: 95,
      poles: 55,
      bestResult: 1,
      averagePosition: 4.2,
      totalPoints: 2500
    },
    contract: {
      signed: true,
      remainingRaces: 10,
      remainingSeasons: 2,
      salary: 800000,
      signingFee: 400000,
      exclusivity: 'exclusive',
      isPayDriver: false,
      payDriverSponsorship: 0,
      bonusQualifyingTop5: 25000,
      bonusRaceTop3: 50000,
      bonusRaceWin: 150000,
      manufacturerBonus: 30000
    },
    currentTeam: 'Manthey-Racing',
    fatigue: 20,
    maxStamina: 100,
    scoutLevel: 3,
    isScouted: true,
    marketValue: 5000000,
    teamSuitability: 88
  },
  {
    id: 'drv_2',
    name: 'Matt Campbell',
    nationality: '澳大利亚',
    age: 28,
    rating: 'gold',
    skills: {
      pace: 92,
      consistency: 90,
      stamina: 88,
      pressure: 88,
      wetSkill: 85,
      feedback: 88,
      familiarity: {}
    },
    stats: {
      totalRaces: 120,
      wins: 28,
      podiums: 65,
      poles: 35,
      bestResult: 1,
      averagePosition: 5.5,
      totalPoints: 1800
    },
    contract: {
      signed: true,
      remainingRaces: 12,
      remainingSeasons: 1,
      salary: 600000,
      signingFee: 300000,
      exclusivity: 'exclusive',
      isPayDriver: false,
      payDriverSponsorship: 0,
      bonusQualifyingTop5: 20000,
      bonusRaceTop3: 40000,
      bonusRaceWin: 120000,
      manufacturerBonus: 25000
    },
    currentTeam: 'Pfaff Motorsports',
    fatigue: 25,
    maxStamina: 100,
    scoutLevel: 3,
    isScouted: true,
    marketValue: 3500000,
    teamSuitability: 82
  },
  {
    id: 'drv_3',
    name: 'Mathieu Jaminet',
    nationality: '法国',
    age: 30,
    rating: 'gold',
    skills: {
      pace: 90,
      consistency: 92,
      stamina: 90,
      pressure: 90,
      wetSkill: 86,
      feedback: 85,
      familiarity: {}
    },
    stats: {
      totalRaces: 150,
      wins: 32,
      podiums: 70,
      poles: 40,
      bestResult: 1,
      averagePosition: 4.8,
      totalPoints: 2100
    },
    contract: {
      signed: false,
      remainingRaces: 0,
      remainingSeasons: 0,
      salary: 500000,
      signingFee: 250000,
      exclusivity: 'non-exclusive',
      isPayDriver: false,
      payDriverSponsorship: 0,
      bonusQualifyingTop5: 18000,
      bonusRaceTop3: 35000,
      bonusRaceWin: 100000,
      manufacturerBonus: 20000
    },
    currentTeam: null,
    fatigue: 18,
    maxStamina: 100,
    scoutLevel: 2,
    isScouted: true,
    marketValue: 2800000,
    teamSuitability: 85
  },
  {
    id: 'drv_4',
    name: 'Tom Blomqvist',
    nationality: '英国',
    age: 30,
    rating: 'silver',
    skills: {
      pace: 85,
      consistency: 83,
      stamina: 86,
      pressure: 80,
      wetSkill: 84,
      feedback: 82,
      familiarity: {}
    },
    stats: {
      totalRaces: 100,
      wins: 15,
      podiums: 40,
      poles: 22,
      bestResult: 1,
      averagePosition: 6.5,
      totalPoints: 1200
    },
    contract: {
      signed: true,
      remainingRaces: 8,
      remainingSeasons: 1,
      salary: 380000,
      signingFee: 190000,
      exclusivity: 'exclusive',
      isPayDriver: false,
      payDriverSponsorship: 0,
      bonusQualifyingTop5: 15000,
      bonusRaceTop3: 30000,
      bonusRaceWin: 80000,
      manufacturerBonus: 18000
    },
    currentTeam: 'Meyer Shank Racing',
    fatigue: 22,
    maxStamina: 100,
    scoutLevel: 2,
    isScouted: true,
    marketValue: 2000000,
    teamSuitability: 78
  },
  {
    id: 'drv_5',
    name: 'Ye Yifei',
    nationality: '中国',
    age: 24,
    rating: 'silver',
    skills: {
      pace: 80,
      consistency: 78,
      stamina: 82,
      pressure: 75,
      wetSkill: 75,
      feedback: 80,
      familiarity: {}
    },
    stats: {
      totalRaces: 65,
      wins: 8,
      podiums: 28,
      poles: 15,
      bestResult: 1,
      averagePosition: 7.5,
      totalPoints: 800
    },
    contract: {
      signed: false,
      remainingRaces: 0,
      remainingSeasons: 0,
      salary: 200000,
      signingFee: 100000,
      exclusivity: 'non-exclusive',
      isPayDriver: true,
      payDriverSponsorship: 400000,
      bonusQualifyingTop5: 8000,
      bonusRaceTop3: 16000,
      bonusRaceWin: 40000,
      manufacturerBonus: 12000
    },
    currentTeam: null,
    fatigue: 15,
    maxStamina: 95,
    scoutLevel: 2,
    isScouted: true,
    marketValue: 1200000,
    teamSuitability: 90
  },
  {
    id: 'drv_6',
    name: '张志强',
    nationality: '中国',
    age: 32,
    rating: 'bronze',
    skills: {
      pace: 68,
      consistency: 65,
      stamina: 72,
      pressure: 60,
      wetSkill: 55,
      feedback: 70,
      familiarity: {}
    },
    stats: {
      totalRaces: 45,
      wins: 0,
      podiums: 5,
      poles: 2,
      bestResult: 8,
      averagePosition: 14.5,
      totalPoints: 250
    },
    contract: {
      signed: false,
      remainingRaces: 0,
      remainingSeasons: 0,
      salary: 0,
      signingFee: 0,
      exclusivity: 'non-exclusive',
      isPayDriver: true,
      payDriverSponsorship: 650000,
      bonusQualifyingTop5: 0,
      bonusRaceTop3: 0,
      bonusRaceWin: 0,
      manufacturerBonus: 5000
    },
    currentTeam: null,
    fatigue: 12,
    maxStamina: 85,
    scoutLevel: 1,
    isScouted: true,
    marketValue: 150000,
    teamSuitability: 70
  },
  {
    id: 'drv_7',
    name: 'Kevin Estre',
    nationality: '法国',
    age: 35,
    rating: 'gold',
    skills: {
      pace: 93,
      consistency: 92,
      stamina: 88,
      pressure: 94,
      wetSkill: 90,
      feedback: 88,
      familiarity: {}
    },
    stats: {
      totalRaces: 160,
      wins: 35,
      podiums: 78,
      poles: 45,
      bestResult: 1,
      averagePosition: 4.5,
      totalPoints: 2300
    },
    contract: {
      signed: true,
      remainingRaces: 14,
      remainingSeasons: 2,
      salary: 680000,
      signingFee: 340000,
      exclusivity: 'exclusive',
      isPayDriver: false,
      payDriverSponsorship: 0,
      bonusQualifyingTop5: 22000,
      bonusRaceTop3: 45000,
      bonusRaceWin: 130000,
      manufacturerBonus: 28000
    },
    currentTeam: 'Manthey-Racing',
    fatigue: 28,
    maxStamina: 100,
    scoutLevel: 3,
    isScouted: true,
    marketValue: 4200000,
    teamSuitability: 80
  },
  {
    id: 'drv_8',
    name: 'Patrick Pilet',
    nationality: '法国',
    age: 42,
    rating: 'silver',
    skills: {
      pace: 80,
      consistency: 86,
      stamina: 82,
      pressure: 88,
      wetSkill: 82,
      feedback: 90,
      familiarity: {}
    },
    stats: {
      totalRaces: 220,
      wins: 25,
      podiums: 75,
      poles: 30,
      bestResult: 1,
      averagePosition: 6.2,
      totalPoints: 1900
    },
    contract: {
      signed: false,
      remainingRaces: 0,
      remainingSeasons: 0,
      salary: 280000,
      signingFee: 140000,
      exclusivity: 'non-exclusive',
      isPayDriver: false,
      payDriverSponsorship: 0,
      bonusQualifyingTop5: 12000,
      bonusRaceTop3: 25000,
      bonusRaceWin: 70000,
      manufacturerBonus: 15000
    },
    currentTeam: null,
    fatigue: 30,
    maxStamina: 100,
    scoutLevel: 2,
    isScouted: true,
    marketValue: 1600000,
    teamSuitability: 72
  },
  {
    id: 'drv_9',
    name: '王浩',
    nationality: '中国',
    age: 27,
    rating: 'silver',
    skills: {
      pace: 72,
      consistency: 70,
      stamina: 78,
      pressure: 70,
      wetSkill: 68,
      feedback: 75,
      familiarity: {}
    },
    stats: {
      totalRaces: 40,
      wins: 1,
      podiums: 12,
      poles: 5,
      bestResult: 1,
      averagePosition: 9.8,
      totalPoints: 450
    },
    contract: {
      signed: false,
      remainingRaces: 0,
      remainingSeasons: 0,
      salary: 150000,
      signingFee: 75000,
      exclusivity: 'non-exclusive',
      isPayDriver: true,
      payDriverSponsorship: 350000,
      bonusQualifyingTop5: 6000,
      bonusRaceTop3: 12000,
      bonusRaceWin: 30000,
      manufacturerBonus: 10000
    },
    currentTeam: null,
    fatigue: 14,
    maxStamina: 90,
    scoutLevel: 1,
    isScouted: true,
    marketValue: 800000,
    teamSuitability: 85
  },
  {
    id: 'drv_10',
    name: 'Mirko Bortolotti',
    nationality: '意大利',
    age: 34,
    rating: 'gold',
    skills: {
      pace: 88,
      consistency: 87,
      stamina: 85,
      pressure: 85,
      wetSkill: 84,
      feedback: 85,
      familiarity: {}
    },
    stats: {
      totalRaces: 140,
      wins: 25,
      podiums: 68,
      poles: 38,
      bestResult: 1,
      averagePosition: 5.2,
      totalPoints: 1700
    },
    contract: {
      signed: false,
      remainingRaces: 0,
      remainingSeasons: 0,
      salary: 550000,
      signingFee: 275000,
      exclusivity: 'non-exclusive',
      isPayDriver: false,
      payDriverSponsorship: 0,
      bonusQualifyingTop5: 16000,
      bonusRaceTop3: 32000,
      bonusRaceWin: 90000,
      manufacturerBonus: 20000
    },
    currentTeam: null,
    fatigue: 24,
    maxStamina: 100,
    scoutLevel: 2,
    isScouted: true,
    marketValue: 2500000,
    teamSuitability: 82
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
    name: '陈一鸣',
    nationality: '中国',
    age: 21,
    rating: 'bronze',
    skills: {
      pace: 62,
      consistency: 52,
      stamina: 72,
      pressure: 56,
      wetSkill: 52,
      feedback: 62,
      familiarity: {}
    },
    stats: { totalRaces: 0, wins: 0, podiums: 0, poles: 0, bestResult: 0, averagePosition: 0, totalPoints: 0 },
    contract: {
      signed: false, remainingRaces: 0, remainingSeasons: 0,
      salary: 45000, signingFee: 22000, exclusivity: 'non-exclusive',
      isPayDriver: true, payDriverSponsorship: 320000,
      bonusQualifyingTop5: 0, bonusRaceTop3: 0, bonusRaceWin: 0, manufacturerBonus: 0
    },
    currentTeam: null, fatigue: 6, maxStamina: 90, scoutLevel: 0, isScouted: false,
    marketValue: 110000, teamSuitability: 72
  },
  {
    id: 'scout_2',
    name: 'Liam Lawson',
    nationality: '新西兰',
    age: 22,
    rating: 'silver',
    skills: {
      pace: 78,
      consistency: 68,
      stamina: 76,
      pressure: 70,
      wetSkill: 65,
      feedback: 70,
      familiarity: {}
    },
    stats: { totalRaces: 25, wins: 2, podiums: 8, poles: 4, bestResult: 1, averagePosition: 8.5, totalPoints: 280 },
    contract: {
      signed: false, remainingRaces: 0, remainingSeasons: 0,
      salary: 180000, signingFee: 90000, exclusivity: 'non-exclusive',
      isPayDriver: false, payDriverSponsorship: 0,
      bonusQualifyingTop5: 8000, bonusRaceTop3: 16000, bonusRaceWin: 40000, manufacturerBonus: 10000
    },
    currentTeam: null, fatigue: 10, maxStamina: 98, scoutLevel: 0, isScouted: false,
    marketValue: 900000, teamSuitability: 80
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