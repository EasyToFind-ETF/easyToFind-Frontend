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
import { Tooltip } from "@/components/ui/tooltip";

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
  monthlyPaths?:
    | number[][]
    | {
        representative?: {
          p95: number[];
          p50: number[];
          p05: number[];
        };
        random_samples?: number[][];
        fan_bands?: {
          p05: number[];
          p25: number[];
          p50: number[];
          p75: number[];
          p95: number[];
        };
        principal_line?: number[];
      };
  targetYears?: number; // 투자 기간 추가
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
  targetYears = 1, // 기본값 설정
  className = "",
}: MonteCarloDetailsProps) => {
  // 디버깅을 위한 로그 (개발 환경에서만)
  if (process.env.NODE_ENV === "development") {
    console.log("🔍 MonteCarloDetails monthlyPaths 디버깅:", {
      monthlyPaths,
      type: typeof monthlyPaths,
      isArray: Array.isArray(monthlyPaths),
      length: Array.isArray(monthlyPaths) ? monthlyPaths.length : 0,
      hasData: !!monthlyPaths,
      structure:
        !Array.isArray(monthlyPaths) && monthlyPaths
          ? Object.keys(monthlyPaths)
          : [],
    });
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 주요 지표 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* 기대값 */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">기대값</span>
            <Tooltip content="시뮬레이션 결과로 예측되는 평균적인 투자 결과값입니다. 여러 시나리오를 고려한 가장 가능성이 높은 수익률을 보여줍니다." />
          </div>
          <div className="text-xl font-bold text-gray-800">
            {formatCurrency(expectedValue)}원
          </div>
        </div>

        {/* 변동성 */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">변동성</span>
            <Tooltip content="투자 수익률이 얼마나 크게 변할 수 있는지를 나타내는 지표입니다. 높을수록 수익률이 크게 오르락내리락할 수 있어 위험도가 높습니다." />
          </div>
          <div className="text-xl font-bold text-gray-800">{volatility}%</div>
        </div>

        {/* 최대낙폭 */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">최대낙폭</span>
            <Tooltip content="투자 기간 동안 발생할 수 있는 가장 큰 손실 폭입니다. 예를 들어 20%라면 투자금의 최대 20%까지 손실될 수 있다는 의미입니다." />
          </div>
          <div className="text-xl font-bold text-gray-800">{maxDrawdown}%</div>
        </div>

        {/* 샤프비율 */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">샤프비율</span>
            <Tooltip content="투자 위험 대비 수익률을 나타내는 지표입니다. 높을수록 위험 대비 좋은 수익을 낼 가능성이 높습니다. 일반적으로 1 이상이면 좋은 투자로 평가됩니다." />
          </div>
          <div className="text-xl font-bold text-gray-800">
            {sharpeRatio.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* ✅ 백엔드 개선으로 새로 추가된 고급 지표들 */}
      {(riskAdjustedReturn > 0 || marketRegime !== "neutral") && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 리스크 조정 수익률 */}
          {riskAdjustedReturn > 0 && (
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  기대 수익률
                </span>
                <Tooltip content="투자 위험을 고려한 연간 수익률입니다. 변동성과 최대낙폭을 종합적으로 고려하여 계산된 수익률로, 실제 투자 성과를 더 정확하게 예측할 수 있습니다." />
              </div>
              <div className="text-xl font-bold text-gray-800">
                {riskAdjustedReturn.toFixed(1)}%
              </div>
              <p className="text-xs text-gray-600 mt-1">
                변동성을 고려한 수익률 지표
              </p>
            </div>
          )}

          {/* 시장 상황 */}
          {marketRegime !== "neutral" && (
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                <span className="text-sm font-medium text-gray-700">
                  시장 상황:{" "}
                  {marketRegime === "bull"
                    ? "상승장"
                    : marketRegime === "bear"
                    ? "하락장"
                    : marketRegime === "volatile"
                    ? "변동장"
                    : "중립"}
                </span>
                <Tooltip content="현재 시장 상황을 분석한 결과입니다. 상승장, 하락장, 변동장, 중립으로 구분되며, 각 상황에 따른 투자 전략을 수립하는 데 도움이 됩니다." />
              </div>
              <p className="text-xs text-gray-600 mt-1">
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
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-gray-600" />
            <span className="text-lg font-semibold text-gray-700">
              VaR (95%)
            </span>
            <Tooltip content="Value at Risk의 약자로, 95% 확률로 이 금액 이상의 손실이 발생하지 않음을 의미합니다. 예를 들어 100만원이라면, 95% 확률로 100만원 이상 손실되지 않는다는 뜻입니다." />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-2">
            {formatCurrency(var95)}원
          </div>
          <p className="text-sm text-gray-600">
            95% 확률로 이 금액 이상의 손실이 발생하지 않음을 의미합니다.
          </p>
        </div>

        {/* CVaR (Conditional Value at Risk) */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-gray-600" />
            <span className="text-lg font-semibold text-gray-700">
              CVaR (95%)
            </span>
            <Tooltip content="Conditional Value at Risk의 약자로, VaR을 초과하는 경우의 평균 손실 금액입니다. VaR보다 더 극단적인 손실 상황을 고려한 위험 지표로, 실제 최악의 시나리오에서 예상되는 손실을 보여줍니다." />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-2">
            {formatCurrency(cvar95)}원
          </div>
          <p className="text-sm text-gray-600">
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
            <Tooltip content="시뮬레이션 결과를 백분위수로 정리한 것입니다. 5%는 최악의 경우, 95%는 최고의 경우를 나타내며, 중앙값(50%)은 가장 가능성이 높은 결과입니다. 이를 통해 투자 결과의 범위를 예측할 수 있습니다." />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                5% 백분위수 (최악의 경우)
              </span>
              <span className="font-bold text-gray-800">
                {formatCurrency(confidenceIntervals.percentile5)}원
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">25% 백분위수</span>
              <span className="font-bold text-gray-800">
                {formatCurrency(confidenceIntervals.percentile25)}원
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-b border-gray-300 py-2">
              <span className="text-sm font-medium text-gray-800">
                중앙값 (50% 백분위수)
              </span>
              <span className="font-bold text-gray-800 text-lg">
                {formatCurrency(confidenceIntervals.median)}원
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">75% 백분위수</span>
              <span className="font-bold text-gray-800">
                {formatCurrency(confidenceIntervals.percentile75)}원
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                95% 백분위수 (최고의 경우)
              </span>
              <span className="font-bold text-gray-800">
                {formatCurrency(confidenceIntervals.percentile95)}원
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ✅ 백엔드 개선으로 새로 추가된 시뮬레이션 정보 */}
      {simulationCount > 0 && (
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <h4 className="text-lg font-semibold text-gray-800">
              시뮬레이션 정보
            </h4>
            <Tooltip content="Monte Carlo 시뮬레이션의 분석 과정과 정확도에 대한 정보입니다. 2000개의 시나리오를 통해 높은 정확도의 분석 결과를 제공하며, 약 6-7초의 계산 시간이 소요됩니다." />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">총 시뮬레이션 경로</span>
              <span className="font-bold text-gray-800">
                {simulationCount.toLocaleString()}개
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">분석 정확도</span>
              <span className="font-bold text-gray-800">고정밀</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">계산 시간</span>
              <span className="font-bold text-gray-800">약 6-7초</span>
            </div>
          </div>
        </div>
      )}

      {/* ✅ 백엔드 개선으로 새로 추가된 월별 가격 경로 차트 */}
      {monthlyPaths &&
        ((Array.isArray(monthlyPaths) && monthlyPaths.length > 0) ||
          (!Array.isArray(monthlyPaths) && monthlyPaths.fan_bands)) && (
          <MonthlyPathsChart
            monthlyPaths={monthlyPaths}
            targetYears={targetYears}
          />
        )}

      {/* 분석 설명 */}
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
        <h5 className="text-sm font-semibold text-gray-800 mb-2">
          Enhanced Monte Carlo 시뮬레이션 분석
        </h5>
        <p className="text-xs text-gray-700 leading-relaxed">
          {simulationCount}개의 시나리오를 통해 계산된 확률적 분석 결과입니다.
          시장 상황 분석, 동적 변동성, 향상된 랜덤 팩터 등을 종합적으로 고려하여
          더욱 정확한 투자 결정에 도움을 드립니다. 신뢰구간은 다양한
          시나리오에서의 예상 결과를 보여줍니다.
        </p>
      </div>
    </div>
  );
};
