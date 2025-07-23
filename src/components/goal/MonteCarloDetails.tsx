import { ConfidenceIntervals } from "@/types/goal";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Shield,
  AlertTriangle,
  Target,
  DollarSign,
} from "lucide-react";
import { MonthlyPathsChart } from "./MonthlyPathsChart";

interface MonteCarloDetailsProps {
  expectedValue: number;
  volatility: number;
  maxDrawdown: number;
  sharpeRatio: number;
  var95: number;
  cvar95: number;
  confidenceIntervals?: ConfidenceIntervals;
  // ✅ 백엔드 개선으로 새로 추가된 필드들
  riskAdjustedReturn?: number;
  marketRegime?: "bull" | "bear" | "volatile" | "neutral";
  simulationCount?: number;
  monthlyPaths?: number[][];
  className?: string;
}

// 금액 포맷팅 함수
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("ko-KR").format(value);
};

// 백분율 포맷팅 함수
const formatPercentage = (value: number) => {
  return `${(value * 100).toFixed(1)}%`;
};

export const MonteCarloDetails = ({
  expectedValue,
  volatility,
  maxDrawdown,
  sharpeRatio,
  var95,
  cvar95,
  confidenceIntervals,
  // ✅ 백엔드 개선으로 새로 추가된 필드들
  riskAdjustedReturn = 0,
  marketRegime = "neutral",
  simulationCount = 2000,
  monthlyPaths = [],
  className = "",
}: MonteCarloDetailsProps) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* 주요 지표 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* 기대값 */}
        <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">기대값</span>
          </div>
          <div className="text-xl font-bold text-green-600">
            {formatCurrency(expectedValue)}원
          </div>
        </div>

        {/* 변동성 */}
        <div className="bg-orange-50 rounded-2xl p-4 border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-700">변동성</span>
          </div>
          <div className="text-xl font-bold text-orange-600">
            {formatPercentage(volatility)}
          </div>
        </div>

        {/* 최대낙폭 */}
        <div className="bg-red-50 rounded-2xl p-4 border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-700">최대낙폭</span>
          </div>
          <div className="text-xl font-bold text-red-600">
            {formatPercentage(maxDrawdown)}
          </div>
        </div>

        {/* 샤프비율 */}
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">샤프비율</span>
          </div>
          <div className="text-xl font-bold text-blue-600">
            {sharpeRatio.toFixed(3)}
          </div>
        </div>
      </div>

      {/* ✅ 백엔드 개선으로 새로 추가된 고급 지표들 */}
      {(riskAdjustedReturn > 0 || marketRegime !== "neutral") && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 리스크 조정 수익률 */}
          {riskAdjustedReturn > 0 && (
            <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">
                  리스크 조정 수익률
                </span>
              </div>
              <div className="text-xl font-bold text-purple-600">
                {riskAdjustedReturn.toFixed(2)}%
              </div>
              <p className="text-xs text-purple-600 mt-1">
                변동성을 고려한 수익률 지표
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
                      ? "text-green-700"
                      : marketRegime === "bear"
                      ? "text-red-700"
                      : marketRegime === "volatile"
                      ? "text-yellow-700"
                      : "text-gray-700"
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
        </div>
      )}

      {/* 위험 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* VaR (Value at Risk) */}
        <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <span className="text-lg font-semibold text-yellow-700">
              VaR (95%)
            </span>
          </div>
          <div className="text-2xl font-bold text-yellow-600 mb-2">
            {formatCurrency(var95)}원
          </div>
          <p className="text-sm text-yellow-600">
            95% 확률로 이 금액 이상의 손실이 발생하지 않음을 의미합니다.
          </p>
        </div>

        {/* CVaR (Conditional Value at Risk) */}
        <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-purple-600" />
            <span className="text-lg font-semibold text-purple-700">
              CVaR (95%)
            </span>
          </div>
          <div className="text-2xl font-bold text-purple-600 mb-2">
            {formatCurrency(cvar95)}원
          </div>
          <p className="text-sm text-purple-600">
            VaR 초과 시 예상되는 평균 손실 금액입니다.
          </p>
        </div>
      </div>

      {/* 신뢰구간 */}
      {confidenceIntervals && (
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-gray-600" />
            <h4 className="text-lg font-semibold text-gray-800">신뢰구간</h4>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                5% 백분위수 (최악의 경우)
              </span>
              <span className="font-bold text-red-600">
                {formatCurrency(confidenceIntervals.percentile5)}원
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">25% 백분위수</span>
              <span className="font-bold text-orange-600">
                {formatCurrency(confidenceIntervals.percentile25)}원
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-b border-gray-300 py-2">
              <span className="text-sm font-medium text-gray-800">
                중앙값 (50% 백분위수)
              </span>
              <span className="font-bold text-blue-600 text-lg">
                {formatCurrency(confidenceIntervals.median)}원
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">75% 백분위수</span>
              <span className="font-bold text-green-600">
                {formatCurrency(confidenceIntervals.percentile75)}원
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                95% 백분위수 (최고의 경우)
              </span>
              <span className="font-bold text-green-600">
                {formatCurrency(confidenceIntervals.percentile95)}원
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ✅ 백엔드 개선으로 새로 추가된 시뮬레이션 정보 */}
      {simulationCount > 0 && (
        <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-200">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <h4 className="text-lg font-semibold text-indigo-800">
              시뮬레이션 정보
            </h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-indigo-600">
                총 시뮬레이션 경로
              </span>
              <span className="font-bold text-indigo-800">
                {simulationCount.toLocaleString()}개
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-indigo-600">분석 정확도</span>
              <span className="font-bold text-indigo-800">고정밀</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-indigo-600">계산 시간</span>
              <span className="font-bold text-indigo-800">약 6-7초</span>
            </div>
          </div>
        </div>
      )}

      {/* ✅ 백엔드 개선으로 새로 추가된 월별 가격 경로 차트 */}
      {monthlyPaths && monthlyPaths.length > 0 && (
        <MonthlyPathsChart monthlyPaths={monthlyPaths} />
      )}

      {/* 분석 설명 */}
      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
        <h5 className="text-sm font-semibold text-blue-800 mb-2">
          Enhanced Monte Carlo 시뮬레이션 분석
        </h5>
        <p className="text-xs text-blue-700 leading-relaxed">
          {simulationCount}개의 시나리오를 통해 계산된 확률적 분석 결과입니다.
          시장 상황 분석, 동적 변동성, 향상된 랜덤 팩터 등을 종합적으로 고려하여
          더욱 정확한 투자 결정에 도움을 드립니다. 신뢰구간은 다양한
          시나리오에서의 예상 결과를 보여줍니다.
        </p>
      </div>
    </div>
  );
};
