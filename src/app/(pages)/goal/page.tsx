"use client";

import { useGoalPlanner } from "@/hooks/useGoalPlanner";
import { GoalPlannerForm } from "@/components/blocks/goal/GoalPlannerForm";
import { GoalPlannerResults } from "@/components/blocks/goal/GoalPlannerResults";
import { Loader2, Target, TrendingUp } from "lucide-react";

export default function GoalPlannerpage() {
  const planner = useGoalPlanner();

  return (
    <main
      className="min-h-screen bg-gray-50 py-10 px-4"
      style={{ marginTop: 130 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* 헤더 섹션 - ETFDetail 스타일 */}
        <div
          className="bg-[#4DB6FF] rounded-3xl p-6 sm:p-10 flex flex-col shadow-lg relative mx-auto w-full h-auto md:h-[400px] mb-16"
          style={{ borderRadius: "4rem" }}
        >
          {/* 반응형 배치 */}
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8 h-full">
            {/* 왼쪽 정보 */}
            <div
              className="w-full md:w-[600px] max-w-full text-white"
              style={{ marginLeft: 50, marginTop: -10 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                  목표 기반
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                  5년 한정
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                  실시간 분석
                </span>
              </div>
              <h1 className="text-5xl font-bold mb-4 flex items-center gap-3">
                <Target className="w-12 h-12" />
                투자 목표 설계
              </h1>
              <div className="text-xl font-semibold tracking-widest mb-4">
                Goal Planner
              </div>
              <div className="text-lg opacity-90">
                과거 5년 데이터를 기반으로 목표 달성 확률이 높은 ETF를
                찾아보세요
              </div>
            </div>
            {/* 오른쪽 이미지 */}
            <div
              className="w-full md:w-[400px] max-w-full flex justify-center items-center"
              style={{ marginRight: 50 }}
            >
              <div className="bg-white/20 rounded-full p-8 backdrop-blur-sm">
                <TrendingUp className="w-24 h-24 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* 메인 컨텐츠 영역 - 위아래 배치 */}
        <div className="space-y-8">
          {/* 입력 폼 */}
          <div>
            <GoalPlannerForm planner={planner} />
          </div>

          {/* 로딩 상태 */}
          {planner.isLoading && (
            <div>
              <div
                className="bg-white rounded-3xl p-8 shadow-lg"
                style={{ borderRadius: "2rem" }}
              >
                <div className="flex items-center justify-center gap-4">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      ETF 분석 중...
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
            <div>
              <div
                className="bg-red-50 border border-red-200 rounded-3xl p-8 shadow-lg"
                style={{ borderRadius: "2rem" }}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-red-100 rounded-full p-3">
                    <span className="text-red-600 text-xl">⚠️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-red-800">
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
            <div>
              <GoalPlannerResults results={planner.results} />
            </div>
          )}
        </div>

        {/* 푸터 정보 */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="text-gray-700 font-medium">
              과거 데이터 기반 분석 • 투자 성향 자동 반영
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
