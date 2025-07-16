"use client";

import { useState, useMemo } from "react";
import { GoalPlannerRequest, GoalPlannerResponse } from "@/types/goal";

export const useGoalPlanner = () => {
  // 1. 사용자 입력 상태 관리 (명세 3.1)
  const [input, setInput] = useState<GoalPlannerRequest>({
    targetAmount: 100_000_000,
    targetYears: 10,
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

  // 4. API 호출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      // 명세 3.1: API 호출
      const response = await fetch("/api/v1/goal-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error("서버에서 오류가 발생했습니다.");
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
    handleSubmit,
  };
};
