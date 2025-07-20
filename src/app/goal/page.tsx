"use client";

import { useGoalPlanner } from "@/hooks/useGoalPlanner";
import { GoalPlannerForm } from "@/components/goal/GoalPlannerForm";
import { GoalPlannerResults } from "@/components/goal/GoalPlannerResults";
import { Loader2, Target, TrendingUp } from "lucide-react";

export default function GoalPlannerpage() {
  const planner = useGoalPlanner();

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 섹션 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6 shadow-lg">
            <Target className="w-6 h-6 text-blue-600" />
            <span className="text-gray-700 font-medium">Goal Planner</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            투자 목표 설계
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            과거 5년 데이터를 기반으로 목표 달성 확률이 높은 ETF를 찾아보세요.
            <br />
            <span className="text-blue-600 font-medium">
              현실적이고 신뢰할 수 있는 투자 전략을 제시합니다.
            </span>
          </p>
        </div>

        {/* 입력 폼 */}
        <GoalPlannerForm planner={planner} />

        {/* 로딩 상태 */}
        {planner.isLoading && (
          <div className="flex flex-col items-center gap-4 mt-12">
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <div className="absolute inset-0 rounded-full border-2 border-blue-200 animate-ping"></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    데이터 분석 중...
                  </h3>
                  <p className="text-gray-600">
                    과거 5년 데이터를 기반으로 최적의 ETF를 찾고 있습니다
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 에러 상태 */}
        {planner.error && (
          <div className="mt-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-2xl mx-auto">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 rounded-full p-2">
                  <span className="text-red-600 text-lg">⚠️</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-800">
                    오류가 발생했습니다
                  </h3>
                  <p className="text-red-600 mt-1">{planner.error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 결과 */}
        {planner.results && (
          <div className="mt-12">
            <GoalPlannerResults results={planner.results} />
          </div>
        )}

        {/* 하단 정보 */}
        <div className="mt-16 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  목표 달성률
                </h3>
                <p className="text-gray-600 text-sm">
                  과거 데이터 기반 목표 달성 확률 계산
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">5년 한정</h3>
                <p className="text-gray-600 text-sm">
                  신뢰할 수 있는 최근 5년 데이터만 사용
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 text-xl">📊</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  실시간 분석
                </h3>
                <p className="text-gray-600 text-sm">
                  최신 시장 데이터로 정확한 분석 제공
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
