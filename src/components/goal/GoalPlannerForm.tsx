"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useGoalPlanner } from "@/hooks/useGoalPlanner";
import { Target, Calendar, PiggyBank, TrendingUp } from "lucide-react";

type GoalPlannerFormProps = {
  planner: ReturnType<typeof useGoalPlanner>;
};

export const GoalPlannerForm = ({ planner }: GoalPlannerFormProps) => {
  const { input, setInput, handleSubmit, isLoading, isUserLoading } = planner;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;

    // 빈 문자열이면 0으로 설정
    if (value === "") {
      setInput((prev) => ({ ...prev, [name]: 0 }));
      return;
    }

    const numValue = +value;

    // 목표 기간 제한 검증 (1~5년)
    if (name === "targetYears") {
      if (numValue >= 1 && numValue <= 5) {
        setInput((prev) => ({ ...prev, [name]: numValue }));
      }
      return;
    }

    // 다른 숫자 필드들은 음수가 아니면 허용
    if (numValue >= 0) {
      setInput((prev) => ({ ...prev, [name]: numValue }));
    }
  };

  const isYearsValid = input.targetYears >= 1 && input.targetYears <= 5;

  // 목표 금액 포맷팅
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ko-KR").format(value);
  };

  return (
    <div className="w-full">
      {/* 메인 흰색 카드 - ETFDetail 스타일 */}
      <div
        className="bg-white rounded-3xl w-full px-16 py-16 shadow-lg"
        style={{ borderRadius: "4rem" }}
      >
        <div>
          <div className="text-3xl font-semibold mb-4 text-gray-800">
            투자 목표 입력
          </div>
          <hr className="border-b-2 border-gray-200 mb-10" />
        </div>

        {/* 입력 폼 */}
        <form onSubmit={planner.handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 목표 금액 */}
            <div
              className="bg-[#F2F8FC] rounded-3xl p-8"
              style={{ borderRadius: "2rem" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[#4DB6FF] rounded-full p-3">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <Label
                  htmlFor="targetAmount"
                  className="text-xl font-semibold text-gray-800"
                >
                  목표 금액
                </Label>
              </div>
              <div className="relative">
                <Input
                  id="targetAmount"
                  name="targetAmount"
                  type="number"
                  value={input.targetAmount || ""}
                  onChange={handleInputChange}
                  min={10000}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 text-xl font-bold h-16 rounded-2xl"
                  placeholder="목표 금액을 입력하세요"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  ₩
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-3">
                현재 입력: {formatCurrency(input.targetAmount)}원
              </p>
            </div>

            {/* 투자 기간 */}
            <div
              className="bg-[#F2F8FC] rounded-3xl p-8"
              style={{ borderRadius: "2rem" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[#4DB6FF] rounded-full p-3">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <Label
                  htmlFor="targetYears"
                  className="text-xl font-semibold text-gray-800"
                >
                  투자 기간
                </Label>
              </div>
              <div className="relative">
                <Input
                  id="targetYears"
                  name="targetYears"
                  type="number"
                  value={input.targetYears || ""}
                  onChange={handleInputChange}
                  min={1}
                  max={5}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 text-xl font-bold h-16 rounded-2xl [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="1-5년"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  년
                </div>
              </div>
              {!isYearsValid && (
                <p className="text-red-500 text-sm mt-3">
                  목표 기간은 1~5년 사이여야 합니다.
                </p>
              )}
            </div>

            {/* 초기 투자금 */}
            <div
              className="bg-[#F2F8FC] rounded-3xl p-8"
              style={{ borderRadius: "2rem" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[#4DB6FF] rounded-full p-3">
                  <PiggyBank className="w-6 h-6 text-white" />
                </div>
                <Label
                  htmlFor="initialAmount"
                  className="text-xl font-semibold text-gray-800"
                >
                  초기 투자금
                </Label>
              </div>
              <div className="relative">
                <Input
                  id="initialAmount"
                  name="initialAmount"
                  type="number"
                  value={input.initialAmount || ""}
                  onChange={handleInputChange}
                  min={0}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 text-xl font-bold h-16 rounded-2xl"
                  placeholder="초기 투자금을 입력하세요"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  ₩
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-3">
                현재 입력: {formatCurrency(input.initialAmount)}원
              </p>
            </div>

            {/* 월 적립액 */}
            <div
              className="bg-[#F2F8FC] rounded-3xl p-8"
              style={{ borderRadius: "2rem" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[#4DB6FF] rounded-full p-3">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <Label
                  htmlFor="monthlyContribution"
                  className="text-xl font-semibold text-gray-800"
                >
                  월 적립액
                </Label>
              </div>
              <div className="relative">
                <Input
                  id="monthlyContribution"
                  name="monthlyContribution"
                  type="number"
                  value={input.monthlyContribution || ""}
                  onChange={handleInputChange}
                  min={0}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 text-xl font-bold h-16 rounded-2xl [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="월 적립액을 입력하세요"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  ₩
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-3">
                현재 입력: {formatCurrency(input.monthlyContribution)}원
              </p>
            </div>
          </div>

          {/* 분석 버튼 */}
          <div className="flex justify-center pt-8">
            <Button
              type="submit"
              disabled={isLoading || !isYearsValid || isUserLoading}
              className="bg-[#4DB6FF] hover:bg-[#3DA5EE] text-white font-bold text-xl px-12 py-6 rounded-3xl shadow-lg transform transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderRadius: "2rem" }}
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  분석 중...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6" />
                  목표 달성 ETF 찾기
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
