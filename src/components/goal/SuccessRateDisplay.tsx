import { ConfidenceInterval } from "@/types/goal";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import {
  getConfidenceColor,
  getConfidenceBadgeColor,
} from "@/utils/confidenceUtils";

interface SuccessRateDisplayProps {
  successRate: number;
  confidenceInterval: ConfidenceInterval;
  showConfidence?: boolean;
  size?: "sm" | "md" | "lg";
}

export function SuccessRateDisplay({
  successRate,
  confidenceInterval,
  showConfidence = true,
  size = "md",
}: SuccessRateDisplayProps) {
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return {
          rate: "text-lg font-bold",
          label: "text-xs",
          confidence: "text-xs",
        };
      case "lg":
        return {
          rate: "text-3xl font-bold",
          label: "text-base",
          confidence: "text-sm",
        };
      default:
        return {
          rate: "text-2xl font-bold",
          label: "text-sm",
          confidence: "text-xs",
        };
    }
  };

  const classes = getSizeClasses();

  // 성공률 색상 결정
  const getSuccessRateColor = (rate: number) => {
    if (rate >= 70) return "text-green-600";
    if (rate >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="flex flex-col gap-1">
      {/* 기존 성공률 표시 */}
      <div className="flex items-center gap-2">
        <span className={`${classes.rate} ${getSuccessRateColor(successRate)}`}>
          {successRate.toFixed(1)}%
        </span>
        <span className={`${classes.label} text-muted-foreground`}>성공률</span>
        <InfoTooltip content="목표 달성 확률을 나타냅니다. 높을수록 목표 달성 가능성이 높습니다." />
      </div>

      {/* 신뢰구간 표시 */}
      {showConfidence && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className={classes.confidence}>신뢰구간:</span>
          <span
            className={`${classes.confidence} font-medium ${getConfidenceColor(
              confidenceInterval
            )}`}
          >
            {confidenceInterval.low.toFixed(1)}% -{" "}
            {confidenceInterval.high.toFixed(1)}%
          </span>
          <Badge
            variant="outline"
            className={`${
              classes.confidence
            } px-1 py-0 ${getConfidenceBadgeColor(confidenceInterval)}`}
          >
            95% 신뢰수준
          </Badge>
          <InfoTooltip content="95% 신뢰구간은 시뮬레이션 결과의 불확실성을 나타냅니다. 구간이 좁을수록 더 정확한 예측입니다." />
        </div>
      )}
    </div>
  );
}
