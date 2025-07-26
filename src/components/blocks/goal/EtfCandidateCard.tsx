import {
  EtfCandidate,
  PersonalScoreDetails as PersonalScoreDetailsType,
} from "@/types/goal";
import { CircularProgress } from "@/components/ui/circular-progress";
import { PersonalScoreDetails } from "./PersonalScoreDetails";
import { MonteCarloDetails } from "./MonteCarloDetails";
import { SuccessRateDisplay } from "./SuccessRateDisplay";
import { RiskScoreDisplay } from "./RiskScoreDisplay";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  Info,
  ChevronDown,
  ChevronUp,
  Zap,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import {
  getConfidenceLevel,
  getConfidenceBadgeColor,
} from "@/utils/confidenceUtils";

export const EtfCandidateCard = ({
  etf,
  targetYears = 5,
}: {
  etf: EtfCandidate;
  targetYears?: number;
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // 백엔드 응답 구조에 맞게 필드 매핑
  const code = etf.etf_code || (etf as any).code || "";
  const name = etf.etf_name || (etf as any).name || "";
  const hitRate =
    typeof etf.hit_rate === "number" ? etf.hit_rate : Number(etf.hit_rate) || 0;
  const successRate =
    typeof etf.success_rate === "number"
      ? etf.success_rate
      : Number(etf.success_rate) || 0;
  const personalScore =
    typeof etf.personal_score === "number"
      ? etf.personal_score
      : Number(etf.personal_score) || 0;
  const goalScore =
    typeof etf.goal_score === "number"
      ? etf.goal_score
      : Number(etf.goal_score) || 0;
  const assetClass = etf.asset_class || "";
  const theme = etf.theme || "";
  const personalScoreDetails: PersonalScoreDetailsType =
    etf.personal_score_details || {
      stability: 50,
      liquidity: 50,
      growth: 50,
      diversification: 50,
    };

  // Monte Carlo 관련 필드들
  const expectedValue =
    typeof etf.expected_value === "number"
      ? etf.expected_value
      : Number(etf.expected_value) || 0;
  const volatility =
    typeof etf.volatility === "number"
      ? etf.volatility
      : Number(etf.volatility) || 0;
  const maxDrawdown =
    typeof etf.max_drawdown === "number"
      ? etf.max_drawdown
      : Number(etf.max_drawdown) || 0;
  const sharpeRatio =
    typeof etf.sharpe_ratio === "number"
      ? etf.sharpe_ratio
      : Number(etf.sharpe_ratio) || 0;
  const var95 =
    typeof etf.var_95 === "number" ? etf.var_95 : Number(etf.var_95) || 0;
  const cvar95 =
    typeof etf.cvar_95 === "number" ? etf.cvar_95 : Number(etf.cvar_95) || 0;
  const confidenceIntervals = etf.confidence_intervals;

  // ✅ 백엔드 개선으로 새로 추가된 필드들
  const riskAdjustedReturn =
    typeof etf.risk_adjusted_return === "number" ? etf.risk_adjusted_return : 0;
  const riskAdjustedScore =
    typeof etf.riskAdjustedScore === "number" ? etf.riskAdjustedScore : 0;
  const marketRegime = etf.market_regime || "neutral";
  const simulationCount =
    typeof etf.simulation_count === "number" ? etf.simulation_count : 2000;
  const monthlyPaths = etf.monthly_paths || [];

  const hasMonteCarloData = successRate > 0 || expectedValue > 0; // Logic to determine engine type

  // 디버깅을 위한 로그 (개발 환경에서만)
  if (process.env.NODE_ENV === "development") {
    console.log("🔍 EtfCandidateCard 값 검증:", {
      hitRate: {
        value: etf.hit_rate,
        type: typeof etf.hit_rate,
        processed: hitRate,
      },
      successRate: {
        value: etf.success_rate,
        type: typeof etf.success_rate,
        processed: successRate,
      },
      personalScore: {
        value: etf.personal_score,
        type: typeof etf.personal_score,
        processed: personalScore,
      },
      goalScore: {
        value: etf.goal_score,
        type: typeof etf.goal_score,
        processed: goalScore,
      },
      hasMonteCarloData,
      // monthlyPaths 디버깅 추가
      monthlyPaths: {
        value: etf.monthly_paths,
        type: typeof etf.monthly_paths,
        processed: monthlyPaths,
        hasData: !!etf.monthly_paths,
        structure: etf.monthly_paths ? Object.keys(etf.monthly_paths) : [],
      },
    });
  }

  // 개인화 점수 색상 결정 (ETFDetailRisk 스타일)
  const getPersonalScoreColor = (score: number) => {
    if (score >= 80) return "#3b82f6"; // blue-500
    if (score >= 60) return "#22c55e"; // green-500
    if (score >= 40) return "#eab308"; // yellow-500
    if (score >= 20) return "#f97316"; // orange-500
    return "#ef4444"; // red-500
  };

  // 성공률 색상 결정 (ETFDetailRisk 스타일)
  const getSuccessRateColor = (rate: number) => {
    if (rate >= 80) return "#3b82f6"; // blue-500
    if (rate >= 60) return "#22c55e"; // green-500
    if (rate >= 40) return "#eab308"; // yellow-500
    if (rate >= 20) return "#f97316"; // orange-500
    return "#ef4444"; // red-500
  };

  // 종합 점수 색상 결정 (ETFDetailRisk 스타일)
  const getGoalScoreColor = (score: number) => {
    if (score >= 80) return "#3b82f6"; // blue-500
    if (score >= 60) return "#22c55e"; // green-500
    if (score >= 40) return "#eab308"; // yellow-500
    if (score >= 20) return "#f97316"; // orange-500
    return "#ef4444"; // red-500
  };

  return (
    <div
      className="bg-white rounded-3xl w-full px-16 py-16 shadow-lg"
      style={{ borderRadius: "4rem" }}
    >
      {/* ETF 기본 정보 */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{name}</h3>
            <p className="text-lg text-gray-800 mb-3">{code}</p>
            {(assetClass || theme) && (
              <div className="flex gap-3">
                {assetClass && (
                  <span className="px-4 py-2 text-base rounded-full bg-gray-100 text-gray-700 font-medium">
                    {assetClass}
                  </span>
                )}
                {theme && (
                  <span className="px-4 py-2 text-base rounded-full bg-gray-100 text-gray-700 font-medium">
                    {theme}
                  </span>
                )}
               
              </div>
            )}
          </div>
          {/* 분석 방법 표시 */}
          <div className="flex items-center gap-2">
            {hasMonteCarloData ? (
              <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                
                Monte Carlo
              </div>
            ) : (
              <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                Five Year
              </div>
            )}
          </div>
        </div>
        <hr className="border-gray-200 mb-8" />
      </div>

      {/* 3개 원형 게이지 */}
      <div className="flex justify-center gap-12 mb-8">
        {/* 성공률 (Monte Carlo) 또는 목표 달성률 (Five Year) */}
        <div className="flex flex-col items-center gap-4 min-h-[200px] justify-center">
          <CircularProgress
            value={hasMonteCarloData ? successRate : hitRate}
            size={140}
            strokeWidth={12}
            color={
              hasMonteCarloData ? getSuccessRateColor(successRate) : "#10B981"
            }
            label={hasMonteCarloData ? "성공률" : "목표 달성률"}
          />
        </div>

        {/* 개인화 점수 */}
        <div className="flex flex-col items-center gap-4 min-h-[200px] justify-center">
          <CircularProgress
            value={personalScore}
            size={140}
            strokeWidth={12}
            color={getPersonalScoreColor(personalScore)}
            label="개인화 점수"
          />
        </div>

        {/* 종합 점수 */}
        <div className="flex flex-col items-center gap-4 min-h-[200px] justify-center">
          <CircularProgress
            value={goalScore}
            size={140}
            strokeWidth={12}
            color={getGoalScoreColor(goalScore)}
            label="종합 점수"
          />
        </div>
      </div>

      {/* 신뢰구간 정보를 별도로 배치 */}
      {hasMonteCarloData &&
        (etf.confidence_interval || etf.confidence_intervals) && (
          <div className="text-center mb-6">
            <SuccessRateDisplay
              successRate={successRate}
              confidenceInterval={
                etf.confidence_interval || {
                  low: etf.confidence_intervals?.percentile5 || 0,
                  mid: etf.confidence_intervals?.median || 0,
                  high: etf.confidence_intervals?.percentile95 || 0,
                }
              }
              showConfidence={true}
              size="sm"
            />
          </div>
        )}

      {/* 상세 분석 정보 */}
      <div className="border-t border-gray-200 pt-6">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
        >
          <Info className="w-4 h-4" />
          <span className="font-medium">상세 분석 정보</span>
          {showDetails ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {showDetails && (
          <div className="space-y-6">
            {/* Monte Carlo 상세 정보 */}
            {hasMonteCarloData && (
              <MonteCarloDetails
                expectedValue={expectedValue}
                volatility={volatility}
                maxDrawdown={maxDrawdown}
                sharpeRatio={sharpeRatio}
                var95={var95}
                cvar95={cvar95}
                confidenceIntervals={confidenceIntervals}
                riskAdjustedReturn={riskAdjustedReturn}
                marketRegime={marketRegime}
                simulationCount={simulationCount}
                monthlyPaths={monthlyPaths}
                targetYears={targetYears}
              />
            )}

            {/* 개인화 점수 상세 정보 */}
            <PersonalScoreDetails details={personalScoreDetails} />
          </div>
        )}
      </div>

      {/* 추가 정보 (기존 필드가 있는 경우) */}
      {((etf as any).medianEndingValue ||
        (etf as any).medianCagr ||
        (etf as any).medianMdd ||
        (etf as any).expenseRatio) && (
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            추가 정보
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            {(etf as any).medianEndingValue && (
              <p>
                예상 중앙값:{" "}
                {((etf as any).medianEndingValue / 10000).toFixed(0)}만원
              </p>
            )}
            {(etf as any).medianCagr && (
              <p>중앙 CAGR: {((etf as any).medianCagr * 100).toFixed(1)}%</p>
            )}
            {(etf as any).medianMdd && (
              <p>중앙 MDD: {((etf as any).medianMdd * 100).toFixed(1)}%</p>
            )}
            {(etf as any).expenseRatio && (
              <p>총 보수: {((etf as any).expenseRatio * 100).toFixed(2)}%</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
