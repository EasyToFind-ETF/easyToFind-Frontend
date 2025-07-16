"use client";

import { useGoalPlanner } from "@/hooks/useGoalPlanner";
import { GoalPlannerForm } from "@/components/goal/GoalPlannerForm";
import { GoalPlannerResults } from "@/components/goal/GoalPlannerResults";
import { Loader2 } from "lucide-react";

export default function GoalPlannerpage() {
  const planner = useGoalPlanner();

  return (
    <main className="flex flex-col items-center gap-8 py-10 px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold">목표 설계</h1>
        <p className="text-gray-500 mt-2">
          과거 데이터 기반으로 목표 달성 확률이 높은 ETF를 찾아보세요.
        </p>
      </div>

      <GoalPlannerForm planner={planner} />

      {planner.isLoading && (
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>데이터를 분석하고 있습니다...</span>
        </div>
      )}

      {planner.error && <p className="text-red-500">{planner.error}</p>}

      {planner.results && <GoalPlannerResults results={planner.results} />}
    </main>
  );
}
