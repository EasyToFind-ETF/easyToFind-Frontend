export interface GoalPlannerRequest {
  targetAmount: number;
  targetYears: number; // 1~5년으로 제한
  initialAmount: number;
  monthlyContribution: number;
  riskProfile?: number;
  themePreference?: string[]; // 선택적 테마 선호도
}

export interface EtfCandidate {
  etf_code: string; // 백엔드 응답 구조에 맞춤
  etf_name: string; // 백엔드 응답 구조에 맞춤
  asset_class?: string;
  theme?: string;
  hit_rate: number; // 백엔드 응답 구조에 맞춤
  risk_match: number; // 백엔드 응답 구조에 맞춤
  goal_score: number; // 백엔드 응답 구조에 맞춤
  window_count?: number;
  // 기존 필드들 (호환성을 위해 유지)
  code?: string;
  name?: string;
  medianEndingValue?: number;
  medianCagr?: number;
  medianMdd?: number;
  expenseRatio?: number;
}

export interface GoalPlannerResponse {
  inputEcho?: GoalPlannerRequest; // 선택적으로 변경
  neededCAGR?: number; // 선택적으로 변경
  requiredCAGR?: number; // 백엔드 응답 구조에 맞춤
  etfCandidates?: EtfCandidate[]; // 기존 호환성
  recommendations?: EtfCandidate[]; // 백엔드 응답 구조에 맞춤
  nearMiss?: any[];
  meta: {
    calcVersion?: string;
    // 5년 한정 MVP 메타데이터 (선택적 - 기존 백엔드와 호환)
    dataHorizonMonths?: number; // 60개월 고정 (5년 한정)
    windowCount?: number; // 시뮬레이션 창 개수
    reliability?: "high" | "medium" | "low"; // 신뢰도 레벨
    targetAmount?: number; // 백엔드 응답 구조에 맞춤
    targetYears?: number; // 백엔드 응답 구조에 맞춤
  };
}
