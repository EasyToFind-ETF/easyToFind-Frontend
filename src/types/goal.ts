export interface GoalPlannerRequest {
  targetAmount: number;
  targetYears: number;
  initialAmount: number;
  monthlyContribution: number;
  riskProfile?: number;
}

export interface EtfCandidate {
  code: string;
  name: string;
  hitRate: number;
  riskMatch: number;
  goalScore: number;
  medianEndingValue: number;
  medianCagr: number;
  medianMdd: number;
  expenseRatio: number;
}

export interface GoalPlannerResponse {
  inputEcho: GoalPlannerRequest;
  neededCAGR: number;
  etfCandidates: EtfCandidate[];
  nearMiss: any[];
  meta: {
    calcVersion: string;
  };
}
