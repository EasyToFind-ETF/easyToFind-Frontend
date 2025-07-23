// ETF 상세 정보
export interface ETFDetail {
  etf_code: string;
  etf_name: string;
  ticker: string;
  provider: string;
  asset_class: string;
  theme: string;
  expense_ratio: number;
  is_listed: boolean;
  delisted_at: string | null;
  inception_date: string;
  currency: string;
  created_at: string;
  updated_at: string;
  region: string;
  style: string;
  lev_flag: string;
  is_retire_pension: boolean;
  is_personal_pension: boolean;
  daily_price?: ETFPricesDaily;
}

export interface ETFPricesDaily {
  trade_date: string;
  etf_code: string;
  open_price: number | string;
  high_price: number | string;
  low_price: number | string;
  close_price: number | string;
  volume: number | string;
  nav_price: number | string;
  change_rate: number | string;
  aum: number | string;

  // new_prices_daily 에서 새로 추가
  cmp_prev_dd_price: number | string;
  acc_trd_val: number | string;
  mkt_cap: number | string;
  list_shrs: number | string;
  idx_ind_nm: string;
  obj_stk_prc_idx: number | string;
  cmp_prev_dd_idx: number | string;
  fluc_rt1: number | string;
}

export interface ETFHoldings {
  holdings_id: number;
  etf_code: string;
  weight_pct: number;
  ver: number;
  update_at: string;
}

export interface ETFStock {
  holdings_id: number;
  holding_code: string;
  holding_name: string;
  update_at: string;
}

// etfs + prices_daily 조인 결과
export interface ETFDetailWithPrice extends ETFDetail {
  daily_price: ETFPricesDaily;
}

// etfs + etf_holdings + stock 조인 결과
export interface ETFHoldingsWithStock {
  // etfs 테이블
  etf_code: string;
  etf_name: string;
  
  // etf_holdings 테이블
  holdings_id: number;
  weight_pct: number;
  ver: number;
  update_at: string;
  
  // stock 테이블
  stock_code: string; // stock.holding_code
  stock_name: string; // stock.holding_name
  
  // 계산된 필드들 (백엔드에서 계산)
  shares?: number; // 계산된 수량
  market_value?: number; // 계산된 평가금액
  stock_price?: number; // prices_daily.close_price (추가 조인 시)
  stock_price_date?: string; // prices_daily.trade_date (추가 조인 시)
}

// ETF 수익률 데이터 타입 (etf_return_cache 테이블 구조)
export interface ETFReturnCache {
  etf_code: string;
  etf_name: string;
  asset_class: string;
  theme: string;
  week1: number | string | null;
  month1: number | string | null;
  month3: number | string | null;
  month6: number | string | null;
  year1: number | string | null;
  year3: number | string | null;
  inception: number | string | null;
  latest_price: number | string | null;
}

// ETF 상세 수익률 데이터 타입 (일일 가격 데이터 포함)
export interface ETFDetailYieldData {
  etf_code: string;
  etf_name: string;
  daily_prices: Array<{
    date: string;
    nav: number;
    market_price: number;
    index_value: number;
  }>;
}

// 기간별 수익률 데이터 구조 (프론트엔드용)
export interface PeriodReturns {
  '1주': number | string | null;
  '1개월': number | string | null;
  '3개월': number | string | null;
  '6개월': number | string | null;
  '1년': number | string | null;
  '3년': number | string | null;
  '상장이후': number | string | null;
}

// ETF 추천 점수 데이터 타입 (etf_recommendation_score 테이블 구조)
export interface ETFRecommendationScore {
  base_date: string;
  etf_code: string;
  group_id: string;
  detail: string;
  score: number | string;
  mdd: number | string;
  volatility: number | string;
  return_1y: number | string;
  latest_aum: number | string;
  expense_ratio: number | string;
}

// API 응답 타입
export interface ETFDetailResponse {
  success: boolean;
  data: ETFDetail;
  message?: string;
}

// ETF 일일 가격 API 응답 타입
export interface ETFDailyPriceResponse {
  success: boolean;
  data: ETFPricesDaily;
  message?: string;
}

// ETF 구성종목 API 응답 타입
export interface ETFHoldingsResponse {
  success: boolean;
  data: ETFHoldingsWithStock[];
  message?: string;
}

// ETF 추천 점수 API 응답 타입
export interface ETFRecommendationScoreResponse {
  success: boolean;
  data: ETFRecommendationScore;
  message?: string;
} 