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
  ChevronDown,
} from "lucide-react";
import { useState, useMemo, useEffect, useRef } from "react";
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
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSortDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  // 투자 기간 가져오기
  const targetYears = useMemo(() => {
    return results.meta?.targetYears || results.inputEcho?.targetYears || 5;
  }, [results]);

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
    const sorted = [...etfCandidates].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "goal_score":
          comparison = (a.goal_score || 0) - (b.goal_score || 0);
          break;
        case "success_rate":
          comparison = (a.success_rate || 0) - (b.success_rate || 0);
          break;
        case "confidence":
          // 신뢰구간이 좁을수록 높은 순위 (신뢰도가 높을수록 좋음)
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
    
    // 디버깅: 정렬 결과 출력
    console.log("정렬 기준:", sortBy, "정렬 방향:", sortOrder);
    console.log("정렬된 ETF들:", sorted.map(etf => ({
      name: etf.etf_name,
      goal_score: etf.goal_score,
      success_rate: etf.success_rate,
      riskAdjustedScore: etf.riskAdjustedScore,
      confidence_interval: etf.confidence_interval
    })));
    
    return sorted;
  }, [etfCandidates, sortBy, sortOrder]);

  const handleSort = (newSortBy: typeof sortBy) => {
    console.log("정렬 기준 변경:", newSortBy, "현재 정렬 방향:", sortOrder);
    setSortBy(newSortBy);
  };

  const handleSortOrder = (newSortOrder: "asc" | "desc") => {
    console.log("정렬 방향 변경:", newSortOrder, "현재 정렬 기준:", sortBy);
    setSortOrder(newSortOrder);
    setIsSortDropdownOpen(false);
  };

  return (
    <div className="w-full">
      {/* 메인 흰색 카드 - ETFDetail 스타일 */}
      <div
        className="bg-white rounded-3xl w-full px-12 py-8 shadow-lg"
        style={{ borderRadius: "4rem" }}
      >
        <div>
          <div className="text-2xl font-semibold mb-3 px-4 py-2 text-gray-800">
            분석 결과
          </div>
        </div>

        {/* 상단 태그들 */}
        <div className="flex flex-wrap gap-3 mb-6">
          {/* <div className="bg-[#4DB6FF] text-white rounded-full px-4 py-2 text-sm font-medium">
            <Target className="inline w-4 h-4 mr-2" />
            분석 완료
          </div>
          <div className="bg-[#4DB6FF] text-white rounded-full px-4 py-2 text-sm font-medium">
            <TrendingUp className="inline w-4 h-4 mr-2" />
            {candidateCount}개 ETF 추천
          </div> */}
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


                  {/* 필요수익률 + 전체 시뮬레이션 결과를 나란히 */}
          <div className="flex flex-col md:flex-row gap-6 mb-2 items-start">
            {/* 필요 CAGR 표시 */}
            <div className="rounded-3xl p-6 flex-1" style={{ borderRadius: "2rem" }}>
              <div className="flex flex-col gap-2 mb-4">
                <span className="text-lg font-semibold text-gray-800">필요 수익률</span>
                <div className="flex flex-col items-start py-4">
                  <div className="text-4xl font-bold text-[#0046ff] mb-1">
                    {isNaN(neededCAGR) ? "계산 중..." : neededCAGR.toFixed(2)}
                    <span className="text-xl">%</span>
                  </div>
                  <p className="text-gray-600 text-base">
                    목표 달성을 위해 필요한 연평균 수익률
                  </p>
                </div>
              </div>
            </div>

            {/* 전체 시뮬레이션 결과 */}
            <div className="flex-1">
              <OverallSimulationResults results={results} />
            </div>
          </div>

          {/* 신뢰도 정보 알림 */}
          {reliabilityInfo && (
            <div
              className={`rounded-3xl p-4 border mb-2 ${reliabilityInfo.color}`}
              style={{ borderRadius: "2rem" }}
            >
              <div className="flex items-center gap-2">
                <reliabilityInfo.icon className="w-5 h-5" />
                <div className="text-sm font-medium">
                  {reliabilityInfo.message}
                </div>
              </div>
            </div>
          )}



        {/* 점수 체계 안내 */}
        <ScoreExplanation />
        </div>
        
        
        {/* ETF 추천 리스트 */}
        {candidateCount > 0 ? (
          <div className="mt-16">
            <div className="text-center mb-6">
              <h3 className="text-3xl font-semibold text-gray-800 mb-2">
                추천 ETF 리스트
              </h3>
              <p className="text-gray-600 text-base mb-3">
                목표 달성 확률과 개인 맞춤 점수를 고려한 최적의 ETF들입니다
              </p>

              {/* 정렬 버튼들 */}
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSort("goal_score")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                      sortBy === "goal_score"
                        ? "bg-[#0046ff] text-white border-[#0046ff]"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
                    }`}
                  >
                    종합 점수
                  </button>
                  <button
                    onClick={() => handleSort("success_rate")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                      sortBy === "success_rate"
                        ? "bg-[#0046ff] text-white border-[#0046ff]"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
                    }`}
                  >
                    성공률
                  </button>
                  <button
                    onClick={() => handleSort("confidence")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                      sortBy === "confidence"
                        ? "bg-[#0046ff] text-white border-[#0046ff]"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
                    }`}
                  >
                    신뢰도
                  </button>
                  <button
                    onClick={() => handleSort("risk_score")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                      sortBy === "risk_score"
                        ? "bg-[#0046ff] text-white border-[#0046ff]"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
                    }`}
                  >
                    리스크 점수
                  </button>
                </div>
                
                {/* 정렬 방향 드롭다운 */}
                <div className="relative self-end" ref={dropdownRef}>
                  <button
                    onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-transparent text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    {sortOrder === "desc" ? "내림차순" : "오름차순"}
                    <ChevronDown className={`w-4 h-4 transition-transform ${isSortDropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  
                  {isSortDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                      <button
                        onClick={() => handleSortOrder("desc")}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                          sortOrder === "desc" ? "bg-blue-50 text-blue-600" : "text-gray-700"
                        }`}
                      >
                        내림차순
                      </button>
                      <button
                        onClick={() => handleSortOrder("asc")}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                          sortOrder === "asc" ? "bg-blue-50 text-blue-600" : "text-gray-700"
                        }`}
                      >
                        오름차순
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {sortedEtfCandidates.map((etf, index) => (
                <div key={etf.etf_code || etf.code} className="relative">
               

                  {/* ETF 카드 */}
                  <div className="p-8">
                    <EtfCandidateCard etf={etf} targetYears={targetYears} />
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
  );
};
