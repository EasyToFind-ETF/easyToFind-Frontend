"use client";

import { useState, useMemo } from "react";
import { GoalPlannerRequest, GoalPlannerResponse } from "@/types/goal";

// 백엔드 API URL 설정
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
const GOAL_PLANNER_URL = `${API_BASE_URL}/api/goal-planner`;

export const useGoalPlanner = () => {
  // 1. 사용자 입력 상태 관리 (5년 한정 MVP)
  const [input, setInput] = useState<GoalPlannerRequest>({
    targetAmount: 100_000_000,
    targetYears: 5, // 기본값을 5년으로 변경
    initialAmount: 0,
    monthlyContribution: 300_000,
    riskProfile: 50,
  });

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

  // 5. API 호출 핸들러
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
      // 백엔드 API 호출
      const response = await fetch(GOAL_PLANNER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "서버에서 오류가 발생했습니다.");
      }

      const data: GoalPlannerResponse = await response.json();
      setResults(data);
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
  };
};
