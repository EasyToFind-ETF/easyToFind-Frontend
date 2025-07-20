import { GoalPlannerResponse } from "@/types/goal";
import { EtfCandidateCard } from "./EtfCandidateCard";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Shield, Zap } from "lucide-react";

export const GoalPlannerResults = ({
  results,
}: {
  results: GoalPlannerResponse;
}) => {
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
          color: "bg-green-500/20 text-green-300 border-green-500/30",
          icon: Shield,
          message: `높은 신뢰도 (${windowCount}개 시뮬레이션 창)`,
        };
      case "medium":
        return {
          color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
          icon: TrendingUp,
          message: `보통 신뢰도 (${windowCount}개 시뮬레이션 창)`,
        };
      case "low":
        return {
          color: "bg-orange-500/20 text-orange-300 border-orange-500/30",
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
  const neededCAGR = results.requiredCAGR || results.neededCAGR || 0;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* 메인 결과 카드 */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-8 text-white shadow-2xl">
        {/* 상단 태그들 */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
            <Target className="inline w-4 h-4 mr-2" />
            분석 완료
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
            <TrendingUp className="inline w-4 h-4 mr-2" />
            {candidateCount}개 ETF 추천
          </div>
          {reliabilityInfo && (
            <div
              className={`backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium border ${reliabilityInfo.color}`}
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

        {/* 메인 제목 */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">분석 결과</h2>
          <p className="text-green-100 text-lg">
            목표 달성에 유리한 ETF를 찾았습니다
          </p>
        </div>

        {/* 필요 CAGR 표시 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 rounded-full p-2">
              <Target className="w-5 h-5" />
            </div>
            <span className="text-white font-medium text-lg">필요 수익률</span>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">
              {isNaN(neededCAGR) ? "계산 중..." : (neededCAGR * 100).toFixed(2)}
              %
            </div>
            <p className="text-green-200 text-sm">
              목표 달성을 위해 필요한 연평균 수익률
            </p>
          </div>
        </div>

        {/* 신뢰도 정보 알림 */}
        {reliabilityInfo && (
          <div
            className={`rounded-xl p-4 border ${reliabilityInfo.color} backdrop-blur-sm`}
          >
            <div className="flex items-center gap-3">
              <reliabilityInfo.icon className="w-5 h-5" />
              <div className="text-sm font-medium">
                {reliabilityInfo.message}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ETF 추천 리스트 */}
      {candidateCount > 0 ? (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              추천 ETF 리스트
            </h3>
            <p className="text-gray-600">
              목표 달성 확률과 위험 성향을 고려한 최적의 ETF들입니다
            </p>
          </div>

          <div className="grid gap-4">
            {etfCandidates.map((etf, index) => (
              <div key={etf.etf_code || etf.code} className="relative">
                {/* 순위 배지 */}
                <div className="absolute -top-2 -left-2 z-10">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                </div>

                {/* ETF 카드 */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                  <EtfCandidateCard etf={etf} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <span className="text-yellow-600 text-4xl">⚠️</span>
            </div>
            <h3 className="text-xl font-semibold text-yellow-800 mb-2">
              추천 ETF를 찾을 수 없습니다
            </h3>
            <p className="text-yellow-700">
              입력하신 조건에 맞는 ETF가 없습니다. 다른 조건으로 다시
              시도해보세요.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
