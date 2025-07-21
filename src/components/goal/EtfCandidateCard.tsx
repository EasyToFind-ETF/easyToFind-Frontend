import { EtfCandidate } from "@/types/goal";
import { Progress } from "@/components/ui/progress";

const getHitRateColor = (rate: number) => {
  if (rate >= 70) return "[&>div]:bg-green-500";
  if (rate >= 40) return "[&>div]:bg-yellow-500";
  return "[&>div]:bg-red-500";
};

export const EtfCandidateCard = ({ etf }: { etf: EtfCandidate }) => {
  // 백엔드 응답 구조에 맞게 필드 매핑
  const code = etf.etf_code || (etf as any).code || "";
  const name = etf.etf_name || (etf as any).name || "";
  const hitRate = etf.hit_rate || (etf as any).hitRate || 0;
  const riskMatch = etf.risk_match || (etf as any).riskMatch || 0;
  const goalScore = etf.goal_score || (etf as any).goalScore || 0;
  const assetClass = etf.asset_class || "";
  const theme = etf.theme || "";

  return (
    <div className="rounded-lg border p-4 space-y-3">
      {/* ETF 기본 정보 */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-lg font-bold text-gray-800">{name}</p>
          <p className="text-sm text-gray-500 font-mono">{code}</p>
          {(assetClass || theme) && (
            <div className="flex gap-2 mt-1">
              {assetClass && (
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                  {assetClass}
                </span>
              )}
              {theme && (
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                  {theme}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-blue-600">
            {goalScore.toFixed(1)}
          </span>
          <p className="text-xs text-gray-500">종합 점수</p>
        </div>
      </div>

      {/* 히트율 */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium text-gray-700">
            목표 달성률: {hitRate.toFixed(1)}%
          </label>
          <span className="text-xs text-gray-500">과거 시뮬레이션 기준</span>
        </div>
        <Progress value={hitRate} className={getHitRateColor(hitRate)} />
      </div>

      {/* 위험 성향 궁합도 */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium text-gray-700">
            위험 성향 궁합도: {riskMatch.toFixed(1)}%
          </label>
        </div>
        <Progress
          value={riskMatch}
          className={
            riskMatch > 70 ? "[&>div]:bg-green-500" : "[&>div]:bg-yellow-500"
          }
        />
      </div>

      {/* 추가 정보 (기존 필드가 있는 경우) */}
      {((etf as any).medianEndingValue ||
        (etf as any).medianCagr ||
        (etf as any).medianMdd ||
        (etf as any).expenseRatio) && (
        <div className="text-sm text-gray-600 grid grid-cols-2 gap-2 pt-2 border-t">
          {(etf as any).medianEndingValue && (
            <p>
              예상 중앙값: {((etf as any).medianEndingValue / 10000).toFixed(0)}
              만원
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
      )}
    </div>
  );
};
