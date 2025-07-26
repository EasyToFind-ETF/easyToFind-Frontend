import { GoalPlannerResponse } from "@/types/goal";
import { Target, BarChart3 } from "lucide-react";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useMemo } from "react";

interface OverallSimulationResultsProps {
  results: GoalPlannerResponse;
}

export function OverallSimulationResults({
  results,
}: OverallSimulationResultsProps) {
  const { meta, analysis } = results;

  // 새로운 구조에서 데이터 가져오기
  const simulationCount = useMemo(() => {
    // 새로운 구조 확인
    if (analysis?.simulationDetails?.totalScenarios) {
      return analysis.simulationDetails.totalScenarios;
    }
    // 기존 구조 확인
    if (meta.simulationCount) {
      return meta.simulationCount;
    }
    if (meta.totalScenarios) {
      return meta.totalScenarios;
    }
    return 0;
  }, [analysis, meta]);

  const calculationTime = useMemo(() => {
    // 새로운 구조 확인
    if (analysis?.simulationDetails?.calculationTime) {
      return analysis.simulationDetails.calculationTime;
    }
    // 기존 구조 확인
    if (meta.calculationTime) {
      return meta.calculationTime;
    }
    return "계산 중...";
  }, [analysis, meta]);

  const confidenceLevel = useMemo(() => {
    // 새로운 구조 확인
    if (analysis?.simulationDetails?.confidenceLevel) {
      return analysis.simulationDetails.confidenceLevel;
    }
    // 기존 구조 확인
    if (meta.confidenceLevel) {
      return meta.confidenceLevel;
    }
    return "95";
  }, [analysis, meta]);

  return (
    <div
      className="rounded-3xl p-8 mb-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xl font-semibold text-gray-800">
          시뮬레이션 정보
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">

        {/* 계산 시간 */}
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800 mb-2">
            {calculationTime}초
          </div>
          <div className="text-sm text-gray-600">계산 시간</div>
        </div>

        {/* 신뢰수준 */}
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800 mb-2">
            {confidenceLevel}%
          </div>
          <div className="text-sm text-gray-600">신뢰수준</div>
          <InfoTooltip content="시뮬레이션 결과의 신뢰수준을 나타냅니다." />
        </div>
      </div>

      {/* 신뢰도 정보 */}
      {meta.reliability && (
        <div className="mt-6 p-4 bg-white rounded-2xl border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-800">
              신뢰도 레벨
            </span>
          </div>
          <div className="text-sm text-gray-600">
            {meta.reliability === "high" &&
              "높은 신뢰도 - 충분한 데이터로 정확한 예측"}
            {meta.reliability === "medium" &&
              "보통 신뢰도 - 적절한 데이터로 예측"}
            {meta.reliability === "low" && "참고용 - 제한된 데이터로 예측"}
          </div>
        </div>
      )}
    </div>
  );
}
