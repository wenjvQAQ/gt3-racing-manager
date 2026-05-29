import type { ManufacturerContract } from '../types/game';

export interface Manufacturer {
  id: string;
  name: string;
  country: string;
  logo: string;
  sponsorship: number;
  discount: number;
  support: {
    engineerSupport: boolean;
    discountParts: number;
    freeCars: number;
    driverLoans: boolean;
  };
  requirements: {
    minPrestige: number;
    minChampionships: number;
    exclusiveBrand: boolean;
  };
  negotiationTerms: NegotiationTerm[];
}

export interface NegotiationTerm {
  id: string;
  name: string;
  description: string;
  currentValue: number;
  minValue: number;
  maxValue: number;
  step: number;
  weight: number;
}

export interface NegotiationState {
  manufacturer: Manufacturer | null;
  inProgress: boolean;
  currentRound: number;
  maxRounds: number;
  terms: NegotiationTerm[];
  manufacturerMood: number;
  playerReputation: number;
  manufacturerRequirements: {
    prestige: number;
    championships: number;
    exclusivity: boolean;
  };
  availableOptions: {
    quickDeal: boolean;
    extendedDeal: boolean;
    riskDeal: boolean;
  };
}

export function createManufacturerNegotiationData(): Manufacturer[] {
  return [
    {
      id: 'porsche',
      name: 'Porsche',
      country: '德国',
      logo: '🏎️',
      sponsorship: 200000,
      discount: 0.1,
      support: {
        engineerSupport: true,
        discountParts: 0.1,
        freeCars: 0,
        driverLoans: true
      },
      requirements: {
        minPrestige: 60,
        minChampionships: 0,
        exclusiveBrand: false
      },
      negotiationTerms: [
        {
          id: 'sponsorship',
          name: '赞助金额',
          description: '每赛季的赞助费用',
          currentValue: 200000,
          minValue: 150000,
          maxValue: 300000,
          step: 10000,
          weight: 0.3
        },
        {
          id: 'discount',
          name: '配件折扣',
          description: '零件和维护折扣',
          currentValue: 0.1,
          minValue: 0.05,
          maxValue: 0.2,
          step: 0.01,
          weight: 0.25
        },
        {
          id: 'loyalty',
          name: '品牌忠诚度要求',
          description: '必须使用该品牌赛车参赛',
          currentValue: 3,
          minValue: 1,
          maxValue: 5,
          step: 1,
          weight: 0.2
        },
        {
          id: 'performance',
          name: '成绩要求',
          description: '最低年度排名要求',
          currentValue: 8,
          minValue: 10,
          maxValue: 5,
          step: 1,
          weight: 0.25
        }
      ]
    },
    {
      id: 'ferrari',
      name: 'Ferrari',
      country: '意大利',
      logo: '🐎',
      sponsorship: 250000,
      discount: 0.12,
      support: {
        engineerSupport: true,
        discountParts: 0.12,
        freeCars: 0,
        driverLoans: true
      },
      requirements: {
        minPrestige: 70,
        minChampionships: 1,
        exclusiveBrand: true
      },
      negotiationTerms: [
        {
          id: 'sponsorship',
          name: '赞助金额',
          description: '每赛季的赞助费用',
          currentValue: 250000,
          minValue: 200000,
          maxValue: 400000,
          step: 15000,
          weight: 0.3
        },
        {
          id: 'discount',
          name: '配件折扣',
          description: '零件和维护折扣',
          currentValue: 0.12,
          minValue: 0.08,
          maxValue: 0.25,
          step: 0.01,
          weight: 0.25
        },
        {
          id: 'loyalty',
          name: '品牌忠诚度要求',
          description: '必须使用该品牌赛车参赛',
          currentValue: 5,
          minValue: 3,
          maxValue: 7,
          step: 1,
          weight: 0.25
        },
        {
          id: 'performance',
          name: '成绩要求',
          description: '最低年度排名要求',
          currentValue: 6,
          minValue: 8,
          maxValue: 3,
          step: 1,
          weight: 0.2
        }
      ]
    },
    {
      id: 'mercedes',
      name: 'Mercedes-AMG',
      country: '德国',
      logo: '⭐',
      sponsorship: 180000,
      discount: 0.08,
      support: {
        engineerSupport: true,
        discountParts: 0.08,
        freeCars: 0,
        driverLoans: false
      },
      requirements: {
        minPrestige: 55,
        minChampionships: 0,
        exclusiveBrand: false
      },
      negotiationTerms: [
        {
          id: 'sponsorship',
          name: '赞助金额',
          description: '每赛季的赞助费用',
          currentValue: 180000,
          minValue: 140000,
          maxValue: 280000,
          step: 10000,
          weight: 0.28
        },
        {
          id: 'discount',
          name: '配件折扣',
          description: '零件和维护折扣',
          currentValue: 0.08,
          minValue: 0.05,
          maxValue: 0.18,
          step: 0.01,
          weight: 0.27
        },
        {
          id: 'loyalty',
          name: '品牌忠诚度要求',
          description: '必须使用该品牌赛车参赛',
          currentValue: 2,
          minValue: 1,
          maxValue: 4,
          step: 1,
          weight: 0.2
        },
        {
          id: 'performance',
          name: '成绩要求',
          description: '最低年度排名要求',
          currentValue: 10,
          minValue: 12,
          maxValue: 6,
          step: 1,
          weight: 0.25
        }
      ]
    }
  ];
}

export function calculateManufacturerInterest(
  teamPrestige: number,
  teamChampionships: number,
  manufacturer: Manufacturer
): number {
  let interest = 50;
  
  const prestigeDiff = teamPrestige - manufacturer.requirements.minPrestige;
  if (prestigeDiff > 0) {
    interest += prestigeDiff * 0.5;
  } else {
    interest += prestigeDiff * 0.3;
  }
  
  interest += manufacturer.requirements.minChampionships === 0 ? 10 : 
              teamChampionships >= manufacturer.requirements.minChampionships ? 15 : 0;
  
  interest = Math.max(0, Math.min(100, interest));
  
  return interest;
}

export function evaluateNegotiationOffer(terms: NegotiationTerm[]): {
  score: number;
  quality: 'excellent' | 'good' | 'acceptable' | 'poor';
  feedback: string;
} {
  let totalScore = 0;
  let totalWeight = 0;
  
  terms.forEach(term => {
    const normalizedValue = (term.currentValue - term.minValue) / (term.maxValue - term.minValue);
    totalScore += normalizedValue * term.weight;
    totalWeight += term.weight;
  });
  
  const finalScore = totalScore / totalWeight * 100;
  
  let quality: 'excellent' | 'good' | 'acceptable' | 'poor';
  let feedback: string;
  
  if (finalScore >= 80) {
    quality = 'excellent';
    feedback = '厂商对这个提议非常满意！合同即将达成。';
  } else if (finalScore >= 60) {
    quality = 'good';
    feedback = '厂商对你的提议感兴趣，可以继续谈判。';
  } else if (finalScore >= 40) {
    quality = 'acceptable';
    feedback = '厂商认为需要更多让步才能接受。';
  } else {
    quality = 'poor';
    feedback = '厂商对你的提议不太满意，建议调整条件。';
  }
  
  return { score: finalScore, quality, feedback };
}

export function simulateManufacturerResponse(
  offerQuality: 'excellent' | 'good' | 'acceptable' | 'poor',
  currentRound: number,
  maxRounds: number
): {
  accepted: boolean;
  counterOffer: boolean;
  message: string;
  newMood: number;
} {
  const acceptanceChance = offerQuality === 'excellent' ? 0.95 :
                           offerQuality === 'good' ? 0.7 :
                           offerQuality === 'acceptable' ? 0.4 : 0.15;
  
  if (Math.random() < acceptanceChance) {
    return {
      accepted: true,
      counterOffer: false,
      message: '厂商接受了你的提议！合同达成！',
      newMood: 20
    };
  }
  
  if (currentRound >= maxRounds - 1) {
    const lastChance = Math.random() < 0.3;
    if (lastChance) {
      return {
        accepted: false,
        counterOffer: true,
        message: '厂商提出了最终条件，接受还是放弃？',
        newMood: -10
      };
    } else {
      return {
        accepted: false,
        counterOffer: false,
        message: '谈判未能达成一致，请下次再试。',
        newMood: -20
      };
    }
  }
  
  const counterOfferChance = offerQuality === 'acceptable' ? 0.6 : 0.3;
  if (Math.random() < counterOfferChance) {
    return {
      accepted: false,
      counterOffer: true,
      message: '厂商提出了反提案，你可以接受或继续谈判。',
      newMood: -5
    };
  }
  
  return {
    accepted: false,
    counterOffer: false,
    message: '厂商需要更多时间考虑，请继续谈判或等待下一轮。',
    newMood: 5
  };
}

export function calculateSwitchingPenalty(
  currentContract: ManufacturerContract | null,
  newManufacturer: Manufacturer
): {
  loyaltyLoss: number;
  prestigeLoss: number;
  bonusMonths: number;
  description: string;
} {
  if (!currentContract) {
    return {
      loyaltyLoss: 0,
      prestigeLoss: 0,
      bonusMonths: 0,
      description: '新签约无惩罚'
    };
  }
  
  const loyaltyLoss = currentContract.loyalty * 10;
  const prestigeLoss = currentContract.level * 5;
  const bonusMonths = Math.floor(currentContract.loyalty / 20);
  
  let description = `从 ${currentContract.make} 转投 ${newManufacturer.name}：\n`;
  description += `- 损失 ${loyaltyLoss} 厂商忠诚度\n`;
  description += `- 损失 ${prestigeLoss} 声望\n`;
  description += `- 需等待 ${bonusMonths} 个月才能获得 ${newManufacturer.name} 最高支持`;
  
  return {
    loyaltyLoss,
    prestigeLoss,
    bonusMonths,
    description
  };
}
