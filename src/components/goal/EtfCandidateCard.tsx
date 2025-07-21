import { EtfCandidate } from "@/types/goal";
import { CircularProgress } from "@/components/ui/circular-progress";

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
    <div
      className="bg-white rounded-3xl w-full px-16 py-16 shadow"
      style={{ borderRadius: "4rem" }}
    >
      {/* ETF 기본 정보 */}
      <div className="mb-10">
        <div className="text-2xl font-semibold mb-4">{name}</div>
        <hr className="border-b-2 border-gray-200 mb-6" />
        <div className="flex items-center gap-4 mb-4">
          <p className="text-lg text-gray-500 font-mono">{code}</p>
          {(assetClass || theme) && (
            <div className="flex gap-3">
              {assetClass && (
                <span className="px-4 py-2 text-base rounded-full bg-blue-100 text-blue-800 font-semibold">
                  {assetClass}
                </span>
              )}
              {theme && (
                <span className="px-4 py-2 text-base rounded-full bg-green-100 text-green-800 font-semibold">
                  {theme}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 원형 게이지 3개 중앙 정렬 */}
      <div className="flex justify-center gap-12">
        <div className="flex flex-col items-center">
          <div style={{ width: 140, height: 140, margin: "0 auto" }}>
            <CircularProgress
              value={hitRate}
              size={140}
              strokeWidth={12}
              label=""
            />
          </div>
          <div className="mt-4 text-base font-semibold text-gray-800">
            목표 달성률
          </div>
          <div className="text-sm text-gray-500">{hitRate.toFixed(1)}%</div>
        </div>

        <div className="flex flex-col items-center">
          <div style={{ width: 140, height: 140, margin: "0 auto" }}>
            <CircularProgress
              value={riskMatch}
              size={140}
              strokeWidth={12}
              label=""
            />
          </div>
          <div className="mt-4 text-base font-semibold text-gray-800">
            위험 성향 궁합도
          </div>
          <div className="text-sm text-gray-500">{riskMatch.toFixed(1)}%</div>
        </div>

        <div className="flex flex-col items-center">
          <div style={{ width: 140, height: 140, margin: "0 auto" }}>
            <CircularProgress
              value={goalScore}
              size={140}
              strokeWidth={12}
              label=""
            />
          </div>
          <div className="mt-4 text-base font-semibold text-gray-800">
            종합 점수
          </div>
          <div className="text-sm text-gray-500">{goalScore.toFixed(1)}%</div>
        </div>
      </div>

      {/* 추가 정보 (기존 필드가 있는 경우) */}
      {((etf as any).medianEndingValue ||
        (etf as any).medianCagr ||
        (etf as any).medianMdd ||
        (etf as any).expenseRatio) && (
        <div className="mt-10 pt-6 border-t border-gray-200">
          <div className="text-lg font-semibold mb-4">추가 정보</div>
          <div className="text-sm text-gray-600 grid grid-cols-2 gap-4">
            {(etf as any).medianEndingValue && (
              <p>
                예상 중앙값:{" "}
                {((etf as any).medianEndingValue / 10000).toFixed(0)}
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
        </div>
      )}
    </div>
  );
};
