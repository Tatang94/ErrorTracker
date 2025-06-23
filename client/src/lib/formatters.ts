export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('id-ID').format(num);
};

export const formatPercentage = (percent: number): string => {
  const sign = percent >= 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
};

export const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  }).format(date);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(date);
};

export const formatDateRelative = (date: Date): string => {
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 24) {
    if (diffInHours < 1) return 'Baru saja';
    if (diffInHours < 24) return `${Math.floor(diffInHours)} jam lalu`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 0) return 'Hari ini';
  if (diffInDays === 1) return 'Kemarin';
  if (diffInDays < 7) return `${diffInDays} hari lalu`;
  
  return formatDate(date);
};

export const getKaratInfo = (karat: number) => {
  const karatData = {
    24: { name: 'Emas 24 Karat', purity: '99.9% Murni', class: 'gradient-24k' },
    22: { name: 'Emas 22 Karat', purity: '91.6% Murni', class: 'gradient-22k' },
    18: { name: 'Emas 18 Karat', purity: '75% Murni', class: 'gradient-18k' },
  };
  
  return karatData[karat as keyof typeof karatData] || {
    name: `Emas ${karat} Karat`,
    purity: `${karat}K`,
    class: 'gradient-gold'
  };
};
