import { EtfCandidate } from "@/types/goal";
import { Progress } from "@/components/ui/progress";

const getHitRateColor = (rate: number) => {
  if (rate >= 0.7) return "[&>div]:bg-green-500";
  if (rate >= 0.4) return "[&>div]:bg-yellow-500";
  return "[&>div]:bg-red-500";
};

export const EtfCandidateCard = ({ etf }: { etf: EtfCandidate }) => {
  return (
    <div className="rounded-lg border p-4 space-y-2">
      <div className="flex justify-between items-center">
        <p className="text-lg font-bold">
          {etf.name}{" "}
          <span className="text-sm font-normal text-gray-500">{etf.code}</span>
        </p>
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            etf.riskMatch > 0.7 ? "bg-blue-100 text-blue-800" : "bg-gray-100"
          }`}
        >
          궁합 {Math.round(etf.riskMatch * 100)}점
        </span>
      </div>
      <div>
        <label className="text-sm">
          히트율: {Math.round(etf.hitRate * 100)}%
        </label>
        <Progress
          value={etf.hitRate * 100}
          className={getHitRateColor(etf.hitRate)}
        />
      </div>
      <div className="text-sm text-gray-600 grid grid-cols-2 gap-1">
        <p>예상 중앙값: {(etf.medianEndingValue / 10000).toFixed(0)}만원</p>
        <p>중앙 CAGR: {(etf.medianCagr * 100).toFixed(1)}%</p>
        <p>중앙 MDD: {(etf.medianMdd * 100).toFixed(1)}%</p>
        <p>총 보수: {etf.expenseRatio * 100}%</p>
      </div>
    </div>
  );
};
