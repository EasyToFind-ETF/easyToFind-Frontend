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
import { Target } from "lucide-react";

type GoalPlannerFormProps = {
  planner: ReturnType<typeof useGoalPlanner>;
};

export const GoalPlannerForm = ({ planner }: GoalPlannerFormProps) => {
  const { input, setInput, handleSubmit, isLoading, isUserLoading } = planner;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]:
        name === "targetAmount" ||
        name === "initialAmount" ||
        name === "monthlyContribution"
          ? Number(value.replace(/[^0-9]/g, ""))
          : name === "targetYears"
          ? Number(value)
          : value,
    }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ko-KR").format(value);
  };

  // 더 안전한 유효성 검사
  const isYearsValid =
    typeof input.targetYears === "number" &&
    input.targetYears >= 1 &&
    input.targetYears <= 5;

  return (
    <div className="w-full">
      {/* 메인 흰색 카드 - ETFDetail 스타일 */}
      <div
        className="bg-white rounded-3xl w-full px-16 py-16 mb-16 shadow-lg"
        style={{ borderRadius: "4rem" }}
      >
        <div>
          <div className="text-3xl font-semibold mb-4 text-gray-800">
            투자 목표 입력
          </div>
        </div>

        {/* 입력 폼 */}
        <form onSubmit={planner.handleSubmit} className="space-y-8">
          {/* 통합된 하늘색 박스 */}
          <div className="rounded-3xl p-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 목표 금액 */}
              <div>
                <div className="mb-4">
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
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 text-lg font-bold h-20 rounded-3xl px-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    style={{ height: "3rem" }}
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
              <div>
                <div className="mb-4">
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
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 text-lg font-bold h-20 rounded-3xl px-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    style={{ height: "3rem" }}
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
              <div>
                <div className="mb-4">
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
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 text-lg font-bold h-20 rounded-3xl px-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    style={{ height: "3rem" }}
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
              <div>
                <div className="mb-4">
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
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 text-lg font-bold h-20 rounded-3xl px-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    style={{ height: "3rem" }}
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
          </div>

          {/* 분석 버튼 */}
          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              disabled={isLoading || !isYearsValid}
<<<<<<< HEAD
              className="bg-[#0046ff] hover:bg-[#3DA5EE] text-white font-bold text-xl px-28 py-8 rounded-3xl shadow-lg transform transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{ borderRadius: "1rem" }}
=======
              className="bg-[#0046ff] hover:bg-[#3DA5EE] text-white font-bold text-xl px-16 py-6 rounded-3xl shadow-lg transform transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{ borderRadius: "2rem" }}
>>>>>>> 77b81a4 (modify goal ui)
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  {input.useMonteCarlo ? "시뮬레이션 실행 중..." : "분석 중..."}
                </div>
              ) : (
                <div className="flex items-center gap-3 px-4">
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
