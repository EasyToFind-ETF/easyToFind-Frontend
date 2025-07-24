import { GoalPlannerResponse } from "@/types/goal";
import { EtfCandidateCard } from "./EtfCandidateCard";
import { OverallSimulationResults } from "./OverallSimulationResults";
import { ScoreExplanation } from "./ScoreExplanation";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Target,
  Shield,
  Zap,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { useState, useMemo } from "react";
import { getConfidenceLevel } from "@/utils/confidenceUtils";

export const GoalPlannerResults = ({
  results,
}: {
  results: GoalPlannerResponse;
}) => {
  const [sortBy, setSortBy] = useState<
    "goal_score" | "success_rate" | "confidence" | "risk_score"
  >("goal_score");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const getReliabilityInfo = () => {
    // meta가 undefined일 수 있으므로 안전하게 처리
    if (!results.meta) {
      return null;
    }

    const { reliability, windowCount } = results.meta;

    if (!reliability || !windowCount) {
      return null;
    }

    switch (reliability) {
      case "high":
        return {
          color: "bg-green-500/20 text-green-700 border-green-500/30",
          icon: Shield,
          message: `높은 신뢰도 (${windowCount}개 시뮬레이션 창)`,
        };
      case "medium":
        return {
          color: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
          icon: TrendingUp,
          message: `보통 신뢰도 (${windowCount}개 시뮬레이션 창)`,
        };
      case "low":
        return {
          color: "bg-orange-500/20 text-orange-700 border-orange-500/30",
          icon: Zap,
          message: `참고용 (${windowCount}개 시뮬레이션 창) - 제한된 데이터`,
        };
      default:
        return null;
    }
  };

  const reliabilityInfo = getReliabilityInfo();

  // 백엔드 응답 구조에 맞게 recommendations 또는 etfCandidates 사용
  const etfCandidates = results.recommendations || results.etfCandidates || [];
  const candidateCount = etfCandidates.length;

  // 필요 CAGR 값 가져오기 (백엔드 응답 구조에 맞춤)
  const neededCAGR = useMemo(() => {
    // 새로운 구조에서 먼저 확인
    if (results.analysis?.simulationDetails?.requiredReturn) {
      return results.analysis.simulationDetails.requiredReturn;
    }
    // 기존 구조 확인
    if (results.requiredCAGR) {
      return results.requiredCAGR;
    }
    if (results.neededCAGR) {
      return results.neededCAGR;
    }
    return 0;
  }, [results]);

  // 정렬된 ETF 목록
  const sortedEtfCandidates = useMemo(() => {
    return [...etfCandidates].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "goal_score":
          comparison = (a.goal_score || 0) - (b.goal_score || 0);
          break;
        case "success_rate":
          comparison = (a.success_rate || 0) - (b.success_rate || 0);
          break;
        case "confidence":
          // 신뢰구간이 좁을수록 높은 순위
          const aInterval = a.confidence_interval || {
            low: a.confidence_intervals?.percentile5 || 0,
            mid: a.confidence_intervals?.median || 0,
            high: a.confidence_intervals?.percentile95 || 0,
          };
          const bInterval = b.confidence_interval || {
            low: b.confidence_intervals?.percentile5 || 0,
            mid: b.confidence_intervals?.median || 0,
            high: b.confidence_intervals?.percentile95 || 0,
          };
          const aRange = aInterval.high - aInterval.low;
          const bRange = bInterval.high - bInterval.low;
          comparison = aRange - bRange;
          break;
        case "risk_score":
          comparison = (a.riskAdjustedScore || 0) - (b.riskAdjustedScore || 0);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === "desc" ? -comparison : comparison;
    });
  }, [etfCandidates, sortBy, sortOrder]);

  const handleSort = (newSortBy: typeof sortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("desc");
    }
  };

  return (
    <div className="w-full">
      {/* 메인 흰색 카드 - ETFDetail 스타일 */}
      <div
        className="bg-white rounded-3xl w-full px-16 py-16 shadow-lg"
        style={{ borderRadius: "4rem" }}
      >
        <div>
          <div className="text-3xl font-semibold mb-4 text-gray-800">
            분석 결과
          </div>
          <hr className="border-b-2 border-gray-200 mb-10" />
        </div>

        {/* 상단 태그들 */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="bg-[#4DB6FF] text-white rounded-full px-4 py-2 text-sm font-medium">
            <Target className="inline w-4 h-4 mr-2" />
            분석 완료
          </div>
          <div className="bg-[#4DB6FF] text-white rounded-full px-4 py-2 text-sm font-medium">
            <TrendingUp className="inline w-4 h-4 mr-2" />
            {candidateCount}개 ETF 추천
          </div>
          {reliabilityInfo && (
            <div
              className={`rounded-full px-4 py-2 text-sm font-medium border ${reliabilityInfo.color}`}
            >
              <reliabilityInfo.icon className="inline w-4 h-4 mr-2" />
              {results.meta?.reliability === "high"
                ? "높은 신뢰도"
                : results.meta?.reliability === "medium"
                ? "보통 신뢰도"
                : "참고용"}
            </div>
          )}
        </div>

        {/* 필요 CAGR 표시 */}
        <div
          className="bg-[#F2F8FC] rounded-3xl p-8 mb-8"
          style={{ borderRadius: "2rem" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#4DB6FF] rounded-full p-3">
              <Target className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-800">
              필요 수익률
            </span>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-[#4DB6FF] mb-3">
              {isNaN(neededCAGR) ? "계산 중..." : neededCAGR.toFixed(2)}
              <span className="text-2xl">%</span>
            </div>
            <p className="text-gray-600 text-lg">
              목표 달성을 위해 필요한 연평균 수익률
            </p>
          </div>
        </div>

        {/* 신뢰도 정보 알림 */}
        {reliabilityInfo && (
          <div
            className={`rounded-3xl p-6 border mb-8 ${reliabilityInfo.color}`}
            style={{ borderRadius: "2rem" }}
          >
            <div className="flex items-center gap-3">
              <reliabilityInfo.icon className="w-6 h-6" />
              <div className="text-base font-medium">
                {reliabilityInfo.message}
              </div>
            </div>
          </div>
        )}

        {/* 전체 시뮬레이션 결과 */}
        <OverallSimulationResults results={results} />

        {/* 점수 체계 안내 */}
        <ScoreExplanation />

        {/* ETF 추천 리스트 */}
        {candidateCount > 0 ? (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                추천 ETF 리스트
              </h3>
              <p className="text-gray-600 text-lg mb-4">
                목표 달성 확률과 개인 맞춤 점수를 고려한 최적의 ETF들입니다
              </p>

              {/* 정렬 버튼들 */}
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => handleSort("goal_score")}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === "goal_score"
                      ? "bg-[#4DB6FF] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  목표 점수
                  {sortBy === "goal_score" &&
                    (sortOrder === "desc" ? (
                      <SortDesc className="w-4 h-4" />
                    ) : (
                      <SortAsc className="w-4 h-4" />
                    ))}
                </button>
                <button
                  onClick={() => handleSort("success_rate")}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === "success_rate"
                      ? "bg-[#4DB6FF] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  성공률
                  {sortBy === "success_rate" &&
                    (sortOrder === "desc" ? (
                      <SortDesc className="w-4 h-4" />
                    ) : (
                      <SortAsc className="w-4 h-4" />
                    ))}
                </button>
                <button
                  onClick={() => handleSort("confidence")}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === "confidence"
                      ? "bg-[#4DB6FF] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  신뢰도
                  {sortBy === "confidence" &&
                    (sortOrder === "desc" ? (
                      <SortDesc className="w-4 h-4" />
                    ) : (
                      <SortAsc className="w-4 h-4" />
                    ))}
                </button>
                <button
                  onClick={() => handleSort("risk_score")}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === "risk_score"
                      ? "bg-[#4DB6FF] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  리스크 점수
                  {sortBy === "risk_score" &&
                    (sortOrder === "desc" ? (
                      <SortDesc className="w-4 h-4" />
                    ) : (
                      <SortAsc className="w-4 h-4" />
                    ))}
                </button>
              </div>
            </div>

            <div className="grid gap-6">
              {sortedEtfCandidates.map((etf, index) => (
                <div key={etf.etf_code || etf.code} className="relative">
                  {/* 순위 배지 */}
                  <div className="absolute -top-3 -left-3 z-10">
                    <div className="bg-[#4DB6FF] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg">
                      {index + 1}
                    </div>
                  </div>

                  {/* ETF 카드 */}
                  <div
                    className="bg-[#F2F8FC] rounded-3xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
                    style={{ borderRadius: "2rem" }}
                  >
                    <EtfCandidateCard etf={etf} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div
              className="bg-yellow-50 border border-yellow-200 rounded-3xl p-8 max-w-2xl mx-auto"
              style={{ borderRadius: "2rem" }}
            >
              <div className="flex items-center justify-center mb-6">
                <span className="text-yellow-600 text-5xl">⚠️</span>
              </div>
              <h3 className="text-2xl font-semibold text-yellow-800 mb-3">
                추천 ETF를 찾을 수 없습니다
              </h3>
              <p className="text-yellow-700 text-lg">
                입력하신 조건에 맞는 ETF가 없습니다. 다른 조건으로 다시
                시도해보세요.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
