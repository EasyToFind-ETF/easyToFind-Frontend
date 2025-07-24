import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";

interface RiskScoreDisplayProps {
  sharpeRatio: number;
  riskAdjustedScore: number;
  showDetails?: boolean;
  size?: "sm" | "md" | "lg";
}

export function RiskScoreDisplay({
  sharpeRatio,
  riskAdjustedScore,
  showDetails = true,
  size = "md",
}: RiskScoreDisplayProps) {
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return {
          score: "text-lg font-bold",
          label: "text-xs",
          details: "text-xs",
        };
      case "lg":
        return {
          score: "text-3xl font-bold",
          label: "text-base",
          details: "text-sm",
        };
      default:
        return {
          score: "text-2xl font-bold",
          label: "text-sm",
          details: "text-xs",
        };
    }
  };

  const classes = getSizeClasses();

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLevel = (score: number) => {
    if (score >= 80) return "매우 우수";
    if (score >= 60) return "우수";
    if (score >= 40) return "보통";
    return "주의";
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-blue-100 text-blue-800";
    if (score >= 40) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="flex flex-col gap-1">
      {/* 정규화된 리스크 점수 */}
      <div className="flex items-center gap-2">
        <span
          className={`${classes.score} ${getScoreColor(riskAdjustedScore)}`}
        >
          {riskAdjustedScore.toFixed(0)}점
        </span>
        <span className={`${classes.label} text-muted-foreground`}>
          리스크 점수
        </span>
        <Badge
          variant="outline"
          className={`${classes.label} px-1 py-0 ${getScoreBadgeColor(
            riskAdjustedScore
          )}`}
        >
          {getScoreLevel(riskAdjustedScore)}
        </Badge>
        <InfoTooltip content="Z-score 기반으로 전체 ETF 대비 상대적 우수성을 평가한 점수입니다." />
      </div>

      {/* 상세 정보 */}
      {showDetails && (
        <div className={`${classes.details} text-muted-foreground`}>
          <div>Sharpe {sharpeRatio.toFixed(2)}</div>
          <div>상대적 평가 (0-100)</div>
        </div>
      )}
    </div>
  );
}
