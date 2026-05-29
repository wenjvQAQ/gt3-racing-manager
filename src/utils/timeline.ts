import { 
  TimelineEvent, 
  TimelineStage, 
  TimelineEventStatus, 
  RacePhase, 
  DecisionItem, 
  DecisionOption, 
  generateId 
} from '../types/game';

export const createTimelineEvents = (raceName: string): TimelineEvent[] => {
  return [
    {
      id: generateId('timeline'),
      name: '运输与准备',
      stage: 'prep',
      phase: 'transport',
      startTime: 0,
      duration: 180,
      status: 'pending',
      canSkip: true,
      summary: '设备和赛车已抵达赛道'
    },
    {
      id: generateId('timeline'),
      name: '车检与行政',
      stage: 'prep',
      phase: 'scrutineering',
      startTime: 180,
      duration: 60,
      status: 'pending',
      canSkip: false,
      decisions: [
        createSparePartsDecision(),
        createRegistrationDecision()
      ]
    },
    {
      id: generateId('timeline'),
      name: '自由练习1',
      stage: 'practice',
      phase: 'free_practice_1',
      startTime: 240,
      duration: 90,
      status: 'pending',
      canSkip: false,
      decisions: [
        createPracticeProgramDecision(),
        createTireTestDecision()
      ]
    },
    {
      id: generateId('timeline'),
      name: '自由练习2',
      stage: 'practice',
      phase: 'free_practice_2',
      startTime: 330,
      duration: 90,
      status: 'pending',
      canSkip: false,
      decisions: [
        createPracticeProgramDecision(),
        createFuelTestDecision()
      ]
    },
    {
      id: generateId('timeline'),
      name: '自由练习3',
      stage: 'practice',
      phase: 'free_practice_3',
      startTime: 420,
      duration: 60,
      status: 'pending',
      canSkip: false,
      decisions: [
        createQualiSimulationDecision()
      ]
    },
    {
      id: generateId('timeline'),
      name: '排位赛Q1',
      stage: 'qualifying',
      phase: 'qualifying_q1',
      startTime: 480,
      duration: 30,
      status: 'pending',
      canSkip: false,
      decisions: [
        createTireChoiceDecision('soft'),
        createEngineModeDecision('qualifying')
      ]
    },
    {
      id: generateId('timeline'),
      name: '排位赛Q2',
      stage: 'qualifying',
      phase: 'qualifying_q2',
      startTime: 510,
      duration: 25,
      status: 'pending',
      canSkip: false,
      decisions: [
        createTireChoiceDecision('soft'),
        createEngineModeDecision('qualifying')
      ]
    },
    {
      id: generateId('timeline'),
      name: '排位赛Q3',
      stage: 'qualifying',
      phase: 'qualifying_q3',
      startTime: 535,
      duration: 20,
      status: 'pending',
      canSkip: false,
      decisions: [
        createTireChoiceDecision('soft'),
        createEngineModeDecision('qualifying')
      ]
    },
    {
      id: generateId('timeline'),
      name: '正赛（24小时耐力赛）',
      stage: 'race',
      phase: 'race',
      startTime: 555,
      duration: 1440,
      status: 'pending',
      canSkip: false,
      decisions: [
        createStartTireChoiceDecision(),
        createDriverRotationDecision(),
        createPitStrategyDecision()
      ]
    },
    {
      id: generateId('timeline'),
      name: '比赛结束',
      stage: 'post',
      phase: 'cooldown',
      startTime: 735,
      duration: 30,
      status: 'pending',
      canSkip: true,
      summary: '比赛已完成'
    }
  ];
};

function createSparePartsDecision(): DecisionItem {
  return {
    id: generateId('decision'),
    label: '备用零件配置',
    type: 'strategy',
    description: '选择备用零件配置，影响维修速度',
    options: [
      {
        id: 'spares_minimal',
        label: '最小配置',
        effects: { cost: -10000, repairSpeed: -10 },
        description: '只带基本零件'
      },
      {
        id: 'spares_standard',
        label: '标准配置',
        effects: { cost: 0, repairSpeed: 0 },
        description: '标准备用零件'
      },
      {
        id: 'spares_complete',
        label: '完整配置',
        effects: { cost: 25000, repairSpeed: 20 },
        description: '带足所有备用零件'
      }
    ],
    selectedOption: 'spares_standard'
  };
}

function createRegistrationDecision(): DecisionItem {
  return {
    id: generateId('decision'),
    label: '赛事报名确认',
    type: 'other',
    description: '确认参赛报名信息',
    options: [
      {
        id: 'confirm_registration',
        label: '确认报名',
        effects: {}
      }
    ],
    selectedOption: null
  };
}

function createPracticeProgramDecision(): DecisionItem {
  return {
    id: generateId('decision'),
    label: '练习项目',
    type: 'setup',
    description: '选择练习赛的重点项目',
    options: [
      {
        id: 'program_setup',
        label: '调校测试',
        effects: { setupConfidence: 15, tireWear: 0 },
        description: '测试不同的赛车调校方案'
      },
      {
        id: 'program_long_run',
        label: '长距离模拟',
        effects: { setupConfidence: 5, tireData: 20, fuelData: 20 },
        description: '模拟正赛轮胎衰减和燃油消耗'
      },
      {
        id: 'program_qualifying',
        label: '排位模拟',
        effects: { setupConfidence: 10, qualifyingPrep: 15 },
        description: '练习最快圈'
      }
    ],
    selectedOption: 'program_setup'
  };
}

function createTireTestDecision(): DecisionItem {
  return {
    id: generateId('decision'),
    label: '轮胎测试',
    type: 'tire',
    description: '测试轮胎性能',
    options: [
      {
        id: 'test_soft',
        label: '软胎测试',
        effects: { softTireData: 20, tireWear: 5 }
      },
      {
        id: 'test_medium',
        label: '中性胎测试',
        effects: { mediumTireData: 20, tireWear: 3 }
      },
      {
        id: 'test_hard',
        label: '硬胎测试',
        effects: { hardTireData: 20, tireWear: 1 }
      }
    ],
    selectedOption: 'test_medium'
  };
}

function createFuelTestDecision(): DecisionItem {
  return {
    id: generateId('decision'),
    label: '燃油测试',
    type: 'fuel',
    description: '测试燃油策略',
    options: [
      {
        id: 'fuel_low',
        label: '低油量测试',
        effects: { fuelData: 15, performanceData: 10 }
      },
      {
        id: 'fuel_high',
        label: '高油量测试',
        effects: { fuelData: 20, tireWear: 5 }
      }
    ],
    selectedOption: 'fuel_low'
  };
}

function createQualiSimulationDecision(): DecisionItem {
  return {
    id: generateId('decision'),
    label: '排位模拟',
    type: 'setup',
    description: '最后一次排位赛冲刺准备',
    options: [
      {
        id: 'quali_simulation',
        label: '全力冲刺',
        effects: { qualifyingPrep: 20, engineWear: 10 }
      },
      {
        id: 'save_for_quali',
        label: '保守练习',
        effects: { qualifyingPrep: 5, engineWear: 0 }
      }
    ],
    selectedOption: 'quali_simulation'
  };
}

function createTireChoiceDecision(defaultTire: string): DecisionItem {
  return {
    id: generateId('decision'),
    label: '轮胎选择',
    type: 'tire',
    description: '选择该阶段使用的轮胎',
    options: [
      {
        id: 'tire_soft',
        label: '软胎',
        effects: { pace: 3, tireWear: 15 }
      },
      {
        id: 'tire_medium',
        label: '中性胎',
        effects: { pace: 1, tireWear: 8 }
      },
      {
        id: 'tire_hard',
        label: '硬胎',
        effects: { pace: -1, tireWear: 3 }
      }
    ],
    selectedOption: `tire_${defaultTire}`
  };
}

function createEngineModeDecision(defaultMode: string): DecisionItem {
  return {
    id: generateId('decision'),
    label: '引擎模式',
    type: 'setup',
    description: '选择引擎工作模式',
    options: [
      {
        id: 'engine_save',
        label: '保护模式',
        effects: { pace: -2, reliability: 10 }
      },
      {
        id: 'engine_standard',
        label: '标准模式',
        effects: { pace: 0, reliability: 0 }
      },
      {
        id: 'engine_qualifying',
        label: '排位模式',
        effects: { pace: 3, reliability: -15 }
      }
    ],
    selectedOption: `engine_${defaultMode}`
  };
}

function createStartTireChoiceDecision(): DecisionItem {
  return {
    id: generateId('decision'),
    label: '正赛起始轮胎',
    type: 'tire',
    description: '选择正赛发车时的轮胎',
    options: [
      {
        id: 'start_soft',
        label: '软胎起步',
        effects: { startPace: 2, tireWearEarly: 15 }
      },
      {
        id: 'start_medium',
        label: '中性胎起步',
        effects: { startPace: 0, tireWearEarly: 8 }
      },
      {
        id: 'start_hard',
        label: '硬胎起步',
        effects: { startPace: -2, tireWearEarly: 2 }
      }
    ],
    selectedOption: 'start_medium'
  };
}

function createDriverRotationDecision(): DecisionItem {
  return {
    id: generateId('decision'),
    label: '车手轮换策略',
    type: 'strategy',
    description: '选择车手的轮换时间和顺序',
    options: [
      {
        id: 'rotation_fast',
        label: '快速轮换（每2小时）',
        effects: { driverFatigue: -20, pitTime: 5, driverChangeCount: 12 }
      },
      {
        id: 'rotation_standard',
        label: '标准轮换（每3-4小时）',
        effects: { driverFatigue: -10, pitTime: 0, driverChangeCount: 6 }
      },
      {
        id: 'rotation_steady',
        label: '保守轮换（每6小时）',
        effects: { driverFatigue: 10, pitTime: -3, driverChangeCount: 4 }
      }
    ],
    selectedOption: 'rotation_standard'
  };
}

function createPitStrategyDecision(): DecisionItem {
  return {
    id: generateId('decision'),
    label: '进站策略',
    type: 'strategy',
    description: '预设进站次数和轮胎选择（24小时耐力赛）',
    options: [
      {
        id: 'strategy_5_stops',
        label: '5停策略',
        effects: { pitStops: 5, totalTime: -8, tireWear: 30 }
      },
      {
        id: 'strategy_7_stops',
        label: '7停策略',
        effects: { pitStops: 7, totalTime: 0, tireWear: 15 }
      },
      {
        id: 'strategy_9_stops',
        label: '9停策略',
        effects: { pitStops: 9, totalTime: 5, tireWear: 8 }
      }
    ],
    selectedOption: 'strategy_7_stops'
  };
}

export const formatTime = (minutes: number): string => {
  const days = Math.floor(minutes / 1440);
  const hour = Math.floor((minutes % 1440) / 60);
  const mins = minutes % 60;
  
  let dayName = '';
  if (days === 0) dayName = '周一';
  else if (days === 1) dayName = '周二';
  else if (days === 2) dayName = '周三';
  else if (days === 3) dayName = '周四';
  else if (days === 4) dayName = '周五';
  else if (days === 5) dayName = '周六';
  else if (days === 6) dayName = '周日';
  
  return `${dayName} ${hour.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};
