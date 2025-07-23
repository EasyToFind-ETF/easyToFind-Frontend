"use client";

import { useState, useMemo, useEffect } from "react";
import { GoalPlannerRequest, GoalPlannerResponse } from "@/types/goal";
import { useUserRiskProfile } from "./useUserRiskProfile";

// 백엔드 API URL 설정
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
const GOAL_PLANNER_URL = `${API_BASE_URL}/api/goal-planner`;

export const useGoalPlanner = () => {
  const {
    isLoggedIn,
    riskScore,
    isLoading: isUserLoading,
  } = useUserRiskProfile();

  // 1. 사용자 입력 상태 관리 (5년 한정 MVP)
  const [input, setInput] = useState<GoalPlannerRequest>({
    targetAmount: 100_000_000,
    targetYears: 5, // 기본값을 5년으로 변경
    initialAmount: 0,
    monthlyContribution: 300_000,
    riskProfile: 50, // 기본값, 나중에 사용자 위험 성향으로 업데이트
    useMonteCarlo: true, // 기본값을 Monte Carlo로 설정
  });

  // 사용자 위험 성향이 로드되면 자동으로 설정
  useEffect(() => {
    if (!isUserLoading && riskScore !== null) {
      setInput((prev) => ({ ...prev, riskProfile: riskScore }));
    }
  }, [isUserLoading, riskScore]);

  // 2. API 연동 관련 상태 관리
  const [results, setResults] = useState<GoalPlannerResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 3. 필요 CAGR 프리뷰 계산 (명세 5.1)
  const neededCagr = useMemo(() => {
    // 이전과 동일한 CAGR 계산 로직
    const P = input.initialAmount;
    const A = input.monthlyContribution * 12;
    const FV = input.targetAmount;
    const n = input.targetYears;
    if (FV <= 0 || n <= 0) return 0;
    let r = 0.07;
    for (let i = 0; i < 10; i++) {
      const fvGuess = P * (1 + r) ** n + (A / r) * ((1 + r) ** n - 1);
      const derivative =
        P * n * (1 + r) ** (n - 1) +
        (A / r ** 2) * (n * r * (1 + r) ** (n - 1) - ((1 + r) ** n - 1));
      const nextR = r - (fvGuess - FV) / derivative;
      if (isNaN(nextR) || !isFinite(nextR)) break;
      r = nextR;
    }
    return Math.max(r * 100, 0);
  }, [input]);

  // 4. 입력 검증
  const validation = useMemo(() => {
    const errors: string[] = [];

    if (input.targetYears < 1 || input.targetYears > 5) {
      errors.push("목표 기간은 1~5년 사이여야 합니다.");
    }

    if (input.targetAmount <= 0) {
      errors.push("목표 금액은 0보다 커야 합니다.");
    }

    if (input.monthlyContribution < 0) {
      errors.push("월 적립액은 0 이상이어야 합니다.");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [input]);

  // 5. API 엔드포인트 결정
  const getApiEndpoint = () => {
    if (input.useMonteCarlo) {
      return `${API_BASE_URL}/api/goal-planner/monte-carlo`;
    } else {
      return `${API_BASE_URL}/api/goal-planner/five-year`;
    }
  };

  // 6. API 호출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validation.isValid) {
      setError(validation.errors.join(", "));
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const endpoint = getApiEndpoint();
      console.log(
        `🔍 API 호출: ${endpoint} (Monte Carlo: ${input.useMonteCarlo})`
      );

      // 백엔드 API 호출
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "서버에서 오류가 발생했습니다.");
      }

      const data: GoalPlannerResponse = await response.json();

      // 디버깅을 위한 로그 (개발 환경에서만)
      if (process.env.NODE_ENV === "development") {
        console.log("🔍 백엔드 응답 데이터:", data);
        if (data.recommendations) {
          console.log("🔍 recommendations 데이터:", data.recommendations);
          data.recommendations.forEach((etf, index) => {
            console.log(`🔍 ETF ${index + 1} personal_score:`, {
              value: etf.personal_score,
              type: typeof etf.personal_score,
              isNumber: typeof etf.personal_score === "number",
              isUndefined: etf.personal_score === undefined,
              isNull: etf.personal_score === null,
            });
          });
        }
      }

      // 백엔드 응답 호환성 처리
      if (data.recommendations) {
        // 새로운 4-팩터 시스템 응답 처리
        const processedRecommendations = data.recommendations.map((etf) => ({
          ...etf,
          // ✅ 백엔드 개선으로 실제 값들이 들어오므로 기본값 설정 제거
          hit_rate: typeof etf.hit_rate === "number" ? etf.hit_rate : 0,
          success_rate:
            typeof etf.success_rate === "number" ? etf.success_rate : 0,
          personal_score:
            typeof etf.personal_score === "number" &&
            etf.personal_score !== null &&
            etf.personal_score !== undefined
              ? etf.personal_score
              : (() => {
                  console.warn(
                    `⚠️ personal_score가 유효하지 않음: ${
                      etf.personal_score
                    } (${typeof etf.personal_score})`
                  );
                  return 50;
                })(),
          goal_score: typeof etf.goal_score === "number" ? etf.goal_score : 0,
          expected_value:
            typeof etf.expected_value === "number" ? etf.expected_value : 0,
          volatility: typeof etf.volatility === "number" ? etf.volatility : 0,
          max_drawdown:
            typeof etf.max_drawdown === "number" ? etf.max_drawdown : 0,
          sharpe_ratio:
            typeof etf.sharpe_ratio === "number" ? etf.sharpe_ratio : 0,
          var_95: typeof etf.var_95 === "number" ? etf.var_95 : 0,
          cvar_95: typeof etf.cvar_95 === "number" ? etf.cvar_95 : 0,
          // ✅ 백엔드 개선으로 새로 추가된 필드들
          risk_adjusted_return:
            typeof etf.risk_adjusted_return === "number"
              ? etf.risk_adjusted_return
              : 0,
          market_regime: etf.market_regime || "neutral",
          simulation_count:
            typeof etf.simulation_count === "number"
              ? etf.simulation_count
              : 2000,
          monthly_paths: etf.monthly_paths || [],
          // personal_score_details가 없는 경우 기본값 설정
          personal_score_details: etf.personal_score_details ?? {
            stability: 50,
            liquidity: 50,
            growth: 50,
            diversification: 50,
          },
        }));

        setResults({
          ...data,
          recommendations: processedRecommendations,
        });
      } else if (data.etfCandidates) {
        // 기존 시스템 응답을 새로운 시스템으로 변환
        const convertedRecommendations = data.etfCandidates.map((etf) => ({
          ...etf,
          hit_rate: typeof etf.hit_rate === "number" ? etf.hit_rate : 0,
          personal_score:
            typeof etf.risk_match === "number" ? etf.risk_match : 50,
          goal_score: typeof etf.goal_score === "number" ? etf.goal_score : 0,
          // ✅ 백엔드 개선으로 새로 추가된 필드들에 대한 기본값
          risk_adjusted_return: 0,
          market_regime: "neutral" as const,
          simulation_count: 2000,
          monthly_paths: [],
          personal_score_details: {
            stability: 50,
            liquidity: 50,
            growth: 50,
            diversification: 50,
          },
        }));

        setResults({
          ...data,
          recommendations: convertedRecommendations,
        });
      } else {
        setResults(data);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    input,
    setInput,
    results,
    isLoading,
    error,
    neededCagr,
    validation,
    handleSubmit,
    isLoggedIn,
    riskScore,
    isUserLoading,
  };
};
