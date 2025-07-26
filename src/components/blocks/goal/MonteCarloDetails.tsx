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
      {/* 통합 지표 섹션 - 이미지처럼 2x3 그리드 */}
      <div className="bg-white rounded-2xl p-6 mt-12 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-8">투자 분석 지표</h3>
        
        <div className="grid grid-cols-2 gap-4">
          {/* 기대값 */}
          <div className="p-4 bg-white rounded-xl border border-gray-200">
            <div className="text-sm font-medium text-gray-600 mb-1">기대값</div>
            <div className="text-lg font-bold text-gray-900">
              {formatCurrency(expectedValue)}원
            </div>
            <Tooltip content="시뮬레이션 결과로 예측되는 평균적인 투자 결과값입니다. 여러 시나리오를 고려한 가장 가능성이 높은 수익률을 보여줍니다." />
          </div>

          {/* 변동성 */}
          <div className="p-4 bg-white rounded-xl border border-gray-200">
            <div className="text-sm font-medium text-gray-600 mb-1">변동성</div>
            <div className="text-lg font-bold text-gray-900">{volatility}%</div>
            <Tooltip content="투자 수익률이 얼마나 크게 변할 수 있는지를 나타내는 지표입니다. 높을수록 수익률이 크게 오르락내리락할 수 있어 위험도가 높습니다." />
          </div>

          {/* 최대낙폭 */}
          <div className="p-4 bg-white rounded-xl border border-gray-200">
            <div className="text-sm font-medium text-gray-600 mb-1">최대낙폭</div>
            <div className="text-lg font-bold text-gray-900">{maxDrawdown}%</div>
            <Tooltip content="투자 기간 동안 발생할 수 있는 가장 큰 손실 폭입니다. 예를 들어 20%라면 투자금의 최대 20%까지 손실될 수 있다는 의미입니다." />
          </div>

          {/* 샤프비율 */}
          <div className="p-4 bg-white rounded-xl border border-gray-200">
            <div className="text-sm font-medium text-gray-600 mb-1">샤프비율</div>
            <div className="text-lg font-bold text-gray-900">
              {sharpeRatio.toFixed(1)}%
            </div>
            <Tooltip content="투자 위험 대비 수익률을 나타내는 지표입니다. 높을수록 위험 대비 좋은 수익을 낼 가능성이 높습니다. 일반적으로 1 이상이면 좋은 투자로 평가됩니다." />
          </div>

          {/* VaR (Value at Risk) */}
          <div className="p-4 bg-white rounded-xl border border-gray-200">
            <div className="text-sm font-medium text-gray-600 mb-1">VaR (95%)</div>
            <div className="text-lg font-bold text-gray-900">
              {formatCurrency(var95)}원
            </div>
            <Tooltip content="Value at Risk의 약자로, 95% 확률로 이 금액 이상의 손실이 발생하지 않음을 의미합니다. 예를 들어 100만원이라면, 95% 확률로 100만원 이상 손실되지 않는다는 뜻입니다." />
          </div>

          {/* CVaR (Conditional Value at Risk) */}
          <div className="p-4 bg-white rounded-xl border border-gray-200">
            <div className="text-sm font-medium text-gray-600 mb-1">CVaR (95%)</div>
            <div className="text-lg font-bold text-gray-900">
              {formatCurrency(cvar95)}원
            </div>
            <Tooltip content="Conditional Value at Risk의 약자로, VaR을 초과하는 경우의 평균 손실 금액입니다. VaR보다 더 극단적인 손실 상황을 고려한 위험 지표로, 실제 최악의 시나리오에서 예상되는 손실을 보여줍니다." />
          </div>
        </div>
      </div>

      {/* 신뢰구간 섹션 */}
      {confidenceIntervals && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">신뢰구간 분석</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-sm font-medium text-gray-600 mb-1">최악의 경우</div>
              <div className="text-lg font-bold text-gray-900">
                {formatCurrency(confidenceIntervals.percentile5)}원
              </div>
              <div className="text-xs text-gray-500">5% 백분위수</div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-sm font-medium text-gray-600 mb-1">보수적 예상</div>
              <div className="text-lg font-bold text-gray-900">
                {formatCurrency(confidenceIntervals.percentile25)}원
              </div>
              <div className="text-xs text-gray-500">25% 백분위수</div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-sm font-medium text-gray-600 mb-1">중앙값</div>
              <div className="text-lg font-bold text-gray-900">
                {formatCurrency(confidenceIntervals.median)}원
              </div>
              <div className="text-xs text-gray-500">50% 백분위수</div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-sm font-medium text-gray-600 mb-1">낙관적 예상</div>
              <div className="text-lg font-bold text-gray-900">
                {formatCurrency(confidenceIntervals.percentile75)}원
              </div>
              <div className="text-xs text-gray-500">75% 백분위수</div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-sm font-medium text-gray-600 mb-1">최고의 경우</div>
              <div className="text-lg font-bold text-gray-900">
                {formatCurrency(confidenceIntervals.percentile95)}원
              </div>
              <div className="text-xs text-gray-500">95% 백분위수</div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-sm font-medium text-gray-600 mb-1">신뢰구간</div>
              <div className="text-lg font-bold text-gray-900">
                Monte Carlo
              </div>
              <div className="text-xs text-gray-500">시뮬레이션 기반</div>
            </div>
          </div>
        </div>
      )}

      {/* 시뮬레이션 정보 섹션 */}
      {/* {simulationCount > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">시뮬레이션 정보</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-sm font-medium text-gray-600 mb-1">총 시뮬레이션 경로</div>
              <div className="text-lg font-bold text-gray-900">
                {simulationCount.toLocaleString()}
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-sm font-medium text-gray-600 mb-1">분석 정확도</div>
              <div className="text-lg font-bold text-gray-900">고정밀</div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-sm font-medium text-gray-600 mb-1">계산 시간</div>
              <div className="text-lg font-bold text-gray-900">6-7초</div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-sm font-medium text-gray-600 mb-1">시뮬레이션 방식</div>
              <div className="text-lg font-bold text-gray-900">Monte Carlo</div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-sm font-medium text-gray-600 mb-1">신뢰도</div>
              <div className="text-lg font-bold text-gray-900">95%</div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-sm font-medium text-gray-600 mb-1">분석 기간</div>
              <div className="text-lg font-bold text-gray-900">{targetYears}년</div>
            </div>
          </div>
        </div>
      )} */}

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
