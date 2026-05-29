export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomFloat = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const formatCurrency = (amount: number, currency: string = '€'): string => {
  return `${currency}${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000);
  return `${minutes}:${secs.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
};

export const getRatingColor = (rating: string): string => {
  switch (rating) {
    case 'platinum':
      return 'text-slate-300 bg-slate-700';
    case 'gold':
      return 'text-yellow-800 bg-yellow-400';
    case 'silver':
      return 'text-gray-700 bg-gray-300';
    case 'bronze':
      return 'text-amber-900 bg-amber-600';
    default:
      return 'text-gray-800 bg-gray-200';
  }
};

export const getRatingLabel = (rating: string): string => {
  switch (rating) {
    case 'platinum':
      return 'Platinum';
    case 'gold':
      return 'Gold';
    case 'silver':
      return 'Silver';
    case 'bronze':
      return 'Bronze';
    default:
      return rating;
  }
};
