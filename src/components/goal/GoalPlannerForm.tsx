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
import { Slider } from "@/components/ui/slider";
import { useGoalPlanner } from "@/hooks/useGoalPlanner";
import { Target, Calendar, PiggyBank, TrendingUp, Zap } from "lucide-react";

type GoalPlannerFormProps = {
  planner: ReturnType<typeof useGoalPlanner>;
};

export const GoalPlannerForm = ({ planner }: GoalPlannerFormProps) => {
  const { input, setInput, handleSubmit, isLoading } = planner;

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
    <div className="w-full max-w-4xl mx-auto">
      {/* 메인 파란색 카드 */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-2xl">
        {/* 상단 태그들 */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
            <Target className="inline w-4 h-4 mr-2" />
            목표 달성률 높은 ETF
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
            <Calendar className="inline w-4 h-4 mr-2" />
            5년 한정 데이터
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
            <TrendingUp className="inline w-4 h-4 mr-2" />
            과거 시뮬레이션
          </div>
        </div>

        {/* 메인 제목 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">투자 목표 설계</h1>
          <p className="text-blue-100 text-lg">
            과거 5년 데이터로 목표 달성 확률이 높은 ETF를 찾아보세요
          </p>
        </div>

        {/* 입력 폼 */}
        <form onSubmit={planner.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 목표 금액 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 rounded-full p-2">
                  <Target className="w-5 h-5" />
                </div>
                <Label
                  htmlFor="targetAmount"
                  className="text-white font-medium"
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
                  className="bg-white/20 border-white/30 text-white placeholder:text-blue-200 text-xl font-bold h-14"
                  placeholder="목표 금액을 입력하세요"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-200 font-medium">
                  ₩
                </div>
              </div>
              <p className="text-blue-200 text-sm mt-2">
                현재 입력: {formatCurrency(input.targetAmount)}원
              </p>
            </div>

            {/* 투자 기간 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 rounded-full p-2">
                  <Calendar className="w-5 h-5" />
                </div>
                <Label htmlFor="targetYears" className="text-white font-medium">
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
                  className="bg-white/20 border-white/30 text-white placeholder:text-blue-200 text-xl font-bold h-14 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="1-5년"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-200 font-medium">
                  년
                </div>
              </div>
              {!isYearsValid && (
                <p className="text-red-300 text-sm mt-2">
                  목표 기간은 1~5년 사이여야 합니다.
                </p>
              )}
            </div>

            {/* 초기 투자금 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 rounded-full p-2">
                  <PiggyBank className="w-5 h-5" />
                </div>
                <Label
                  htmlFor="initialAmount"
                  className="text-white font-medium"
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
                  className="bg-white/20 border-white/30 text-white placeholder:text-blue-200 text-xl font-bold h-14"
                  placeholder="초기 투자금을 입력하세요"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-200 font-medium">
                  ₩
                </div>
              </div>
              <p className="text-blue-200 text-sm mt-2">
                현재 입력: {formatCurrency(input.initialAmount)}원
              </p>
            </div>

            {/* 월 적립액 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 rounded-full p-2">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <Label
                  htmlFor="monthlyContribution"
                  className="text-white font-medium"
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
                  className="bg-white/20 border-white/30 text-white placeholder:text-blue-200 text-xl font-bold h-14 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="월 적립액을 입력하세요"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-200 font-medium">
                  ₩
                </div>
              </div>
              <p className="text-blue-200 text-sm mt-2">
                현재 입력: {formatCurrency(input.monthlyContribution)}원
              </p>
            </div>
          </div>

          {/* 위험 성향 슬라이더 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 rounded-full p-2">
                <Zap className="w-5 h-5" />
              </div>
              <Label className="text-white font-medium">
                위험 성향 (안정 ↔ 공격)
              </Label>
            </div>
            <div className="space-y-4">
              <Slider
                min={0}
                max={100}
                step={1}
                value={[input.riskProfile ?? 50]}
                onValueChange={(v) =>
                  setInput((prev) => ({ ...prev, riskProfile: v[0] }))
                }
                className="w-full"
              />
              <div className="flex justify-between text-sm">
                <span className="text-blue-200">안정형 (0)</span>
                <span className="text-white font-bold text-lg">
                  {input.riskProfile ?? 50}
                </span>
                <span className="text-blue-200">공격형 (100)</span>
              </div>
            </div>
          </div>

          {/* 5년 한정 안내 메시지 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-start gap-3">
              <div className="bg-yellow-500/20 rounded-full p-2 mt-0.5">
                <span className="text-yellow-300 text-lg">ℹ️</span>
              </div>
              <div className="text-blue-100">
                <p className="font-medium mb-1">5년 한정 서비스</p>
                <p className="text-sm">
                  현재는 <strong>1~5년</strong> 투자 기간만 지원합니다. 더 긴
                  기간은 추후 데이터 확보 후 지원 예정입니다.
                </p>
              </div>
            </div>
          </div>

          {/* 분석 버튼 */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              disabled={isLoading || !isYearsValid}
              className="bg-white text-blue-600 hover:bg-blue-50 font-bold text-lg px-8 py-4 rounded-xl shadow-lg transform transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  분석 중...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
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
