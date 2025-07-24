export interface GoalPlannerRequest {
  targetAmount: number;
  targetYears: number; // 1~5년으로 제한
  initialAmount: number;
  monthlyContribution: number;
  riskProfile?: number;
  themePreference?: string[]; // 선택적 테마 선호도
  useMonteCarlo: boolean; // 항상 Monte Carlo 사용
}

// 신뢰구간 정보 (기존)
export interface ConfidenceIntervals {
  percentile5: number;
  percentile25: number;
  median: number;
  percentile75: number;
  percentile95: number;
}

// 새로운 신뢰구간 정보 (백엔드 수정사항 반영)
export interface ConfidenceInterval {
  low: number;
  mid: number;
  high: number;
}

// 분석 정보
export interface AnalysisInfo {
  method: string;
  description: string;
  advantages: string[];
  riskMetrics: {
    totalScenarios: number;
    confidenceLevel: number;
    simulationTime: number;
  };
  // 새로운 필드 추가
  simulationDetails?: {
    totalScenarios: number;
    confidenceLevel: string;
    calculationTime: string;
    requiredReturn: number;
  };
}

// 개인화 점수 상세 정보 타입
export interface PersonalScoreDetails {
  stability: number; // 안정성 점수
  liquidity: number; // 유동성 점수
  growth: number; // 성장성 점수
  diversification: number; // 분산투자 점수
}

export interface EtfCandidate {
  etf_code: string; // 백엔드 응답 구조에 맞춤
  etf_name: string; // 백엔드 응답 구조에 맞춤
  asset_class?: string;
  theme?: string;

  // 기존 필드들 (Five Year Engine)
  hit_rate?: number; // 목표 달성률 (기존 시스템)
  personal_score?: number; // 개인화 점수 (4-팩터)
  goal_score?: number; // 종합 점수 (hitRate 70% + personal 30%)
  personal_score_details?: PersonalScoreDetails; // 개인화 점수 상세 정보

  // 새로운 필드들 (Monte Carlo Engine) - ✅ 백엔드 개선으로 실제 값들이 들어옴
  success_rate?: number; // 성공률 (Monte Carlo) - 이제 실제 퍼센트 값
  expected_value?: number; // 기대값 - 이제 실제 금액
  volatility?: number; // 변동성 - 이제 실제 변동성 값
  max_drawdown?: number; // 최대낙폭 - 이제 실제 Max Drawdown 값
  sharpe_ratio?: number; // 샤프비율 - 이제 실제 Sharpe Ratio 값
  var_95?: number; // Value at Risk (95%) - 이제 실제 VaR 값
  cvar_95?: number; // Conditional Value at Risk (95%) - 이제 실제 CVaR 값
  confidence_intervals?: ConfidenceIntervals; // 기존 신뢰구간 (호환성)
  confidence_interval?: ConfidenceInterval; // 새로운 신뢰구간 (백엔드 수정사항)

  // ✅ 백엔드 개선으로 새로 추가된 필드들
  risk_adjusted_return?: number; // 리스크 조정 수익률 (백분율)
  riskAdjustedScore?: number; // 정규화된 리스크 점수 (0-100)
  market_regime?: "bull" | "bear" | "volatile" | "neutral"; // 시장 상황
  simulation_count?: number; // 시뮬레이션 경로 수 (2000)
  monthly_paths?: number[][]; // 월별 가격 경로 (상위 5개)

  window_count?: number;
  // 기존 필드들 (호환성을 위해 유지)
  code?: string;
  name?: string;
  medianEndingValue?: number;
  medianCagr?: number;
  medianMdd?: number;
  expenseRatio?: number;
  // 이전 버전 호환성을 위한 필드들 (점진적 제거 예정)
  risk_match?: number; // 제거 예정
  quality_score?: number; // 제거 예정
}

export interface GoalPlannerResponse {
  inputEcho?: GoalPlannerRequest; // 선택적으로 변경
  neededCAGR?: number; // 선택적으로 변경
  requiredCAGR?: number; // 백엔드 응답 구조에 맞춤
  etfCandidates?: EtfCandidate[]; // 기존 호환성
  recommendations?: EtfCandidate[]; // 백엔드 응답 구조에 맞춤
  nearMiss?: any[];
  analysis?: AnalysisInfo; // 분석 정보 (Monte Carlo)
  meta: {
    calcVersion?: string;
    // 5년 한정 MVP 메타데이터 (선택적 - 기존 백엔드와 호환)
    dataHorizonMonths?: number; // 60개월 고정 (5년 한정)
    windowCount?: number; // 시뮬레이션 창 개수
    reliability?: "high" | "medium" | "low"; // 신뢰도 레벨
    targetAmount?: number; // 백엔드 응답 구조에 맞춤
    targetYears?: number; // 백엔드 응답 구조에 맞춤
    // Monte Carlo 관련 메타데이터
    simulationMethod?:
      | "monte_carlo"
      | "five_year"
      | "Enhanced Simple Monte Carlo"; // ✅ 백엔드 개선으로 변경됨
    totalScenarios?: number;
    // ✅ 백엔드 개선으로 새로 추가된 필드들
    simulationCount?: number; // 고정값 2000
    calculationTime?: string; // 계산 시간
    targetDays?: number; // 목표 일수
    confidenceLevel?: string; // 신뢰수준 (예: "95%")
    enhancements?: {
      marketRegimeAnalysis: boolean;
      dynamicVolatility: boolean;
      enhancedRandomFactors: boolean;
      riskAdjustedScoring: boolean;
      dataQualityAssessment: boolean;
    };
  };
}
