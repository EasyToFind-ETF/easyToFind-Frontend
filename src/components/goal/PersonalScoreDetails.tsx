import { PersonalScoreDetails as PersonalScoreDetailsType } from "@/types/goal";
import { BarChart3, TrendingUp, Shield, Zap, Target } from "lucide-react";

interface PersonalScoreDetailsProps {
  details: PersonalScoreDetailsType;
  className?: string;
}

const factorConfig = {
  stability: {
    label: "안정성",
    icon: Shield,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    description: "가격 변동성과 리스크 관리 능력",
  },
  liquidity: {
    label: "유동성",
    icon: Zap,
    color: "text-green-600",
    bgColor: "bg-green-50",
    description: "거래량과 매매 용이성",
  },
  growth: {
    label: "성장성",
    icon: TrendingUp,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    description: "수익률과 성장 잠재력",
  },
  diversification: {
    label: "분산투자",
    icon: Target,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    description: "포트폴리오 분산 효과",
  },
};

export const PersonalScoreDetails = ({
  details,
  className = "",
}: PersonalScoreDetailsProps) => {
  // 값들을 안전하게 숫자로 변환
  const safeDetails = {
    stability:
      typeof details.stability === "number"
        ? details.stability
        : Number(details.stability) || 0,
    liquidity:
      typeof details.liquidity === "number"
        ? details.liquidity
        : Number(details.liquidity) || 0,
    growth:
      typeof details.growth === "number"
        ? details.growth
        : Number(details.growth) || 0,
    diversification:
      typeof details.diversification === "number"
        ? details.diversification
        : Number(details.diversification) || 0,
  };

  const factors = [
    { key: "stability", value: safeDetails.stability },
    { key: "liquidity", value: safeDetails.liquidity },
    { key: "growth", value: safeDetails.growth },
    { key: "diversification", value: safeDetails.diversification },
  ] as const;

  // 디버깅을 위한 로그 (개발 환경에서만)
  if (process.env.NODE_ENV === "development") {
    console.log("🔍 PersonalScoreDetails 값 검증:", {
      original: details,
      processed: safeDetails,
    });
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-gray-600" />
        <h4 className="text-lg font-semibold text-gray-800">
          개인화 점수 상세 분석
        </h4>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {factors.map(({ key, value }) => {
          const config = factorConfig[key];
          const Icon = config.icon;

          return (
            <div
              key={key}
              className={`${config.bgColor} rounded-2xl p-4 border border-gray-200`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${config.color}`} />
                <span className="text-sm font-medium text-gray-700">
                  {config.label}
                </span>
              </div>

              <div className="flex items-end gap-2 mb-2">
                <span className={`text-2xl font-bold ${config.color}`}>
                  {value.toFixed(1)}
                </span>
                <span className="text-sm text-gray-500">%</span>
              </div>

              {/* 진행률 바 */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    value >= 70
                      ? "bg-green-500"
                      : value >= 40
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${value}%` }}
                />
              </div>

              <p className="text-xs text-gray-600 mt-2">{config.description}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
        <h5 className="text-sm font-semibold text-gray-800 mb-2">
          점수 계산 방식
        </h5>
        <p className="text-xs text-gray-600 leading-relaxed">
          개인화 점수는 안정성(25%), 유동성(25%), 성장성(25%), 분산투자(25%) 4개
          팩터의 가중 평균으로 계산됩니다. 각 팩터는 사용자의 투자 성향과 ETF의
          특성을 종합적으로 분석하여 산출됩니다.
        </p>
      </div>
    </div>
  );
};
