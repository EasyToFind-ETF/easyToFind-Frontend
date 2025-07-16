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

type GoalPlannerFormProps = {
  planner: ReturnType<typeof useGoalPlanner>;
};

export const GoalPlannerForm = ({ planner }: GoalPlannerFormProps) => {
  const { input, setInput, handleSubmit, isLoading } = planner;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput((prev) => ({ ...prev, [e.target.name]: +e.target.value }));
  };

  return (
    <Card className="w-full max-w-2xl">
      <form onSubmit={planner.handleSubmit}>
        <CardHeader>
          <CardTitle className="text-lg">투자 목표 입력</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="targetAmount">목표 금액 (₩)</Label>
            <Input
              id="targetAmount"
              name="targetAmount"
              type="number"
              value={input.targetAmount}
              onChange={handleInputChange}
              min={10000}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetYears">목표 기간 (년)</Label>
            <Input
              id="targetYears"
              name="targetYears"
              type="number"
              value={input.targetYears}
              onChange={handleInputChange}
              min={1}
              max={40}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="initialAmount">초기 투자금 (₩)</Label>
            <Input
              id="initialAmount"
              name="initialAmount"
              type="number"
              value={input.initialAmount}
              onChange={handleInputChange}
              min={0}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="monthlyContribution">월 적립액 (₩)</Label>
            <Input
              id="monthlyContribution"
              name="monthlyContribution"
              type="number"
              value={input.monthlyContribution}
              onChange={handleInputChange}
              min={0}
            />
          </div>
          <div className="col-span-full space-y-2">
            <Label>위험 성향 (안정 0 ↔ 100 공격)</Label>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[input.riskProfile ?? 50]}
              onValueChange={(v) =>
                setInput((prev) => ({ ...prev, riskProfile: v[0] }))
              }
            />
            <span className="text-sm text-muted-foreground">
              {input.riskProfile ?? 50}
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto"
          >
            {isLoading ? "분석 중..." : "시뮬레이션"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
