import dayjs from 'dayjs';

// 숫자 포맷팅 (천 단위 콤마, 소수점 자릿수 지정)
export const formatNumber = (value: number, decimals: number = 0): string => {
  if (isNaN(value) || value === null || value === undefined) {
    return '0';
  }
  
  return new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

// 날짜 포맷팅
export const formatDate = (date: string | Date, format: string = 'YYYY-MM-DD'): string => {
  if (!date) return '';
  
  return dayjs(date).format(format);
};

// 퍼센트 포맷팅
export const formatPercent = (value: number, decimals: number = 2): string => {
  if (isNaN(value) || value === null || value === undefined) {
    return '0.00%';
  }
  
  return `${formatNumber(value, decimals)}%`;
};

// 통화 포맷팅
export const formatCurrency = (value: number, currency: string = 'KRW'): string => {
  if (isNaN(value) || value === null || value === undefined) {
    return '₩0';
  }
  
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: currency,
  }).format(value);
}; 