import { EtfCandidate } from "@/types/goal";
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
  const [showMonteCarloDetails, setShowMonteCarloDetails] = useState(false);
  const [showPersonalScoreDetails, setShowPersonalScoreDetails] =
    useState(false);

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
  const personalScoreDetails = etf.personal_score_details;

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
    });
  }

  // 개인화 점수 색상 결정
  const getPersonalScoreColor = (score: number) => {
    if (score >= 70) return "#10B981"; // green-500
    if (score >= 40) return "#F59E0B"; // yellow-500
    return "#EF4444"; // red-500
  };

  // 성공률 색상 결정
  const getSuccessRateColor = (rate: number) => {
    if (rate >= 70) return "#10B981"; // green-500
    if (rate >= 40) return "#F59E0B"; // yellow-500
    return "#EF4444"; // red-500
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
            <p className="text-lg text-gray-600 font-mono mb-3">{code}</p>
            {(assetClass || theme) && (
              <div className="flex gap-3">
                {assetClass && (
                  <span className="px-4 py-2 text-base rounded-full bg-blue-100 text-blue-800 font-medium">
                    {assetClass}
                  </span>
                )}
                {theme && (
                  <span className="px-4 py-2 text-base rounded-full bg-green-100 text-green-800 font-medium">
                    {theme}
                  </span>
                )}
                {/* 신뢰도 배지 추가 */}
                {(etf.confidence_interval || etf.confidence_intervals) && (
                  <Badge
                    className={`text-xs ${getConfidenceBadgeColor(
                      etf.confidence_interval || {
                        low: etf.confidence_intervals?.percentile5 || 0,
                        mid: etf.confidence_intervals?.median || 0,
                        high: etf.confidence_intervals?.percentile95 || 0,
                      }
                    )}`}
                  >
                    신뢰도:{" "}
                    {
                      getConfidenceLevel(
                        etf.confidence_interval || {
                          low: etf.confidence_intervals?.percentile5 || 0,
                          mid: etf.confidence_intervals?.median || 0,
                          high: etf.confidence_intervals?.percentile95 || 0,
                        }
                      ).level
                    }
                  </Badge>
                )}
              </div>
            )}
          </div>
          {/* 분석 방법 표시 */}
          <div className="flex items-center gap-2">
            {hasMonteCarloData ? (
              <div className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                <Zap className="w-4 h-4" />
                Monte Carlo
              </div>
            ) : (
              <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
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
            color="#8B5CF6"
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

      {/* Monte Carlo 상세 정보 */}
      {hasMonteCarloData && (
        <div className="border-t border-gray-200 pt-6 mb-6">
          <button
            onClick={() => setShowMonteCarloDetails(!showMonteCarloDetails)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <Info className="w-4 h-4" />
            <span className="font-medium">Monte Carlo 분석 결과</span>
            {showMonteCarloDetails ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {showMonteCarloDetails && (
            <MonteCarloDetails
              expectedValue={expectedValue}
              volatility={volatility}
              maxDrawdown={maxDrawdown}
              sharpeRatio={sharpeRatio}
              var95={var95}
              cvar95={cvar95}
              confidenceIntervals={confidenceIntervals}
              // ✅ 백엔드 개선으로 새로 추가된 필드들
              riskAdjustedReturn={riskAdjustedReturn}
              marketRegime={marketRegime}
              simulationCount={simulationCount}
              monthlyPaths={monthlyPaths}
              targetYears={targetYears}
            />
          )}
        </div>
      )}

      {/* ✅ 백엔드 개선으로 새로 추가된 필드들 표시 */}
      {hasMonteCarloData &&
        (riskAdjustedReturn > 0 ||
          riskAdjustedScore > 0 ||
          marketRegime !== "neutral") && (
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600" />
              고급 분석 지표
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 정규화된 리스크 점수 */}
              {riskAdjustedScore > 0 && (
                <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">
                      정규화된 리스크 점수
                    </span>
                  </div>
                  <RiskScoreDisplay
                    sharpeRatio={sharpeRatio}
                    riskAdjustedScore={riskAdjustedScore}
                    showDetails={false}
                    size="sm"
                  />
                </div>
              )}

              {/* 기존 리스크 조정 수익률 */}
              {riskAdjustedReturn > 0 && (
                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      리스크 조정 수익률
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900">
                    {riskAdjustedReturn.toFixed(1)}%
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    변동성을 고려한 수익률
                  </p>
                </div>
              )}

              {/* 시장 상황 */}
              {marketRegime !== "neutral" && (
                <div
                  className={`rounded-2xl p-4 border ${
                    marketRegime === "bull"
                      ? "bg-green-50 border-green-200"
                      : marketRegime === "bear"
                      ? "bg-red-50 border-red-200"
                      : marketRegime === "volatile"
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        marketRegime === "bull"
                          ? "bg-green-500"
                          : marketRegime === "bear"
                          ? "bg-red-500"
                          : marketRegime === "volatile"
                          ? "bg-yellow-500"
                          : "bg-gray-500"
                      }`}
                    ></div>
                    <span
                      className={`text-sm font-medium ${
                        marketRegime === "bull"
                          ? "text-green-800"
                          : marketRegime === "bear"
                          ? "text-red-800"
                          : marketRegime === "volatile"
                          ? "text-yellow-800"
                          : "text-gray-800"
                      }`}
                    >
                      시장 상황:{" "}
                      {marketRegime === "bull"
                        ? "상승장"
                        : marketRegime === "bear"
                        ? "하락장"
                        : marketRegime === "volatile"
                        ? "변동장"
                        : "중립"}
                    </span>
                  </div>
                  <p
                    className={`text-xs ${
                      marketRegime === "bull"
                        ? "text-green-600"
                        : marketRegime === "bear"
                        ? "text-red-600"
                        : marketRegime === "volatile"
                        ? "text-yellow-600"
                        : "text-gray-600"
                    } mt-1`}
                  >
                    {marketRegime === "bull"
                      ? "지속적인 상승 추세"
                      : marketRegime === "bear"
                      ? "지속적인 하락 추세"
                      : marketRegime === "volatile"
                      ? "높은 변동성 환경"
                      : "안정적인 시장 환경"}
                  </p>
                </div>
              )}

              {/* 시뮬레이션 경로 수 */}
              {simulationCount > 0 && (
                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      시뮬레이션 경로
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900">
                    {simulationCount.toLocaleString()}개
                  </div>
                  <p className="text-xs text-blue-600 mt-1">분석 정확도 향상</p>
                </div>
              )}
            </div>
          </div>
        )}

      {/* 개인화 점수 상세 정보 */}
      {personalScoreDetails && (
        <div className="border-t border-gray-200 pt-6">
          <button
            onClick={() =>
              setShowPersonalScoreDetails(!showPersonalScoreDetails)
            }
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <Info className="w-4 h-4" />
            <span className="font-medium">개인화 점수 상세 정보</span>
            {showPersonalScoreDetails ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {showPersonalScoreDetails && (
            <PersonalScoreDetails details={personalScoreDetails} />
          )}
        </div>
      )}

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
