import { GoalPlannerResponse } from "@/types/goal";
import { EtfCandidateCard } from "./EtfCandidateCard";

export const GoalPlannerResults = ({
  results,
}: {
  results: GoalPlannerResponse;
}) => {
  return (
    <div className="w-full max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">분석 결과</h2>
        <p>
          필요 CAGR:{" "}
          <span className="font-bold text-blue-600">
            {(results.neededCAGR * 100).toFixed(2)}%
          </span>
        </p>
      </div>
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Top ETF 추천 리스트</h3>
        {results.etfCandidates.map((etf) => (
          <EtfCandidateCard key={etf.code} etf={etf} />
        ))}
      </div>
    </div>
  );
};
