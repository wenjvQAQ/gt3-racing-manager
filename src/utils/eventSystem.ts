import type { Driver, GameEvent } from '../types/game';

export function generateGentlemanCrisisEvent(driver: Driver): GameEvent {
  const id = 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  return {
    id: id,
    type: 'random',
    title: '绅士车手状态',
    description: '你的绅士车手 ' + driver.name + ' 在比赛中面临一些挑战。',
    choices: [
      {
        label: '让他继续驾驶',
        effects: { prestige: -2 }
      },
      {
        label: '给予心理支持',
        effects: { prestige: 5, balance: -5000 }
      }
    ],
    occurred: false,
    date: new Date()
  };
}

export function generateTechnicalIssueEvent(): GameEvent {
  const id = 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  return {
    id: id,
    type: 'random',
    title: '技术问题',
    description: '工程师报告赛车出现了一些技术问题需要处理。',
    choices: [
      {
        label: '立即进站维修',
        effects: { balance: -15000 }
      },
      {
        label: '继续比赛',
        effects: { prestige: -5 }
      }
    ],
    occurred: false,
    date: new Date()
  };
}

export function generateNegotiationEvent(): GameEvent {
  const id = 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  return {
    id: id,
    type: 'negotiation',
    title: '厂商提议',
    description: '厂商车队向你提出了一个合作提议。',
    choices: [
      {
        label: '接受提议',
        effects: { prestige: 10, balance: 30000 }
      },
      {
        label: '婉拒提议',
        effects: { prestige: 5 }
      }
    ],
    occurred: false,
    date: new Date()
  };
}

export function generateMoraleEvent(currentPrestige: number): GameEvent {
  const id = 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  return {
    id: id,
    type: 'moral',
    title: '团队动态',
    description: '车队内部出现了一些动态需要处理。',
    choices: [
      {
        label: '召开团队会议',
        effects: { prestige: 15, balance: -3000 }
      },
      {
        label: '保持专注比赛',
        effects: { prestige: 5 }
      }
    ],
    occurred: false,
    date: new Date()
  };
}

export function shouldTriggerEvent(
  drivers: Driver[],
  raceType: 'sprint' | 'endurance',
  currentLap: number,
  totalLaps: number,
  teamPrestige: number
): GameEvent | null {
  if (Math.random() < 0.05) {
    if (Math.random() < 0.3) {
      const bronzeDrivers = drivers.filter(d => d.rating === 'bronze');
      if (bronzeDrivers.length > 0) {
        return generateGentlemanCrisisEvent(bronzeDrivers[0]);
      }
    } else if (Math.random() < 0.3) {
      return generateTechnicalIssueEvent();
    } else if (Math.random() < 0.3) {
      return generateMoraleEvent(teamPrestige);
    } else {
      return generateNegotiationEvent();
    }
  }
  return null;
}
