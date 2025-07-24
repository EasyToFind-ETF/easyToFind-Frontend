"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, TrendingUp, TrendingDown } from "lucide-react";

interface ETFData {
  etf_code: string;
  etf_name: string;
  provider: string;
  week1: string;
  month1: string;
  month3: string;
  month6: string;
  year1: string;
  year3: string;
  inception: string;
  latest_price: string;
  latest_aum: string;
  max_drawdown: string;
  sharpe_ratio: string;
  volatility: string;
  raw_score: number | null;
  total_score: number | null;
  isLiked: boolean;
}

type PeriodKey =
  | "week1"
  | "month1"
  | "month3"
  | "month6"
  | "year1"
  | "year3"
  | "inception";

interface PeriodOption {
  key: PeriodKey;
  label: string;
  shortLabel: string;
}

const periodOptions: PeriodOption[] = [
  { key: "week1", label: "1주", shortLabel: "1주" },
  { key: "month1", label: "1개월", shortLabel: "1개월" },
  { key: "month3", label: "3개월", shortLabel: "3개월" },
  { key: "month6", label: "6개월", shortLabel: "6개월" },
  { key: "year1", label: "1년", shortLabel: "1년" },
  { key: "year3", label: "3년", shortLabel: "3년" },
  { key: "inception", label: "상장 이후", shortLabel: "상장 이후" },
];

const ETFScoreCircle = ({ score }: { score: number }) => {
  const percentage = Math.min(Math.max(score, 0), 100);
  const radius = 40;
  const strokeDasharray = 2 * Math.PI * radius;
  const strokeDashoffset = strokeDasharray * (1 - percentage / 100);

  const getScoreColor = (score: number) => {
    if (score >= 65) return "#22c55e";
    if (score >= 35) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 90 90">
          <circle
            cx="45"
            cy="45"
            r={radius}
            stroke="#f3f4f6"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx="45"
            cy="45"
            r={radius}
            stroke={getScoreColor(score)}
            strokeWidth="6"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-base font-bold"
            style={{ color: getScoreColor(score) }}
          >
            {score}
          </span>
        </div>
      </div>
      <span className="text-xs font-medium text-gray-600">종합점수</span>
    </div>
  );
};

export default function MyPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey>("month1");
  const [etfCards, setEtfCards] = useState<ETFData[]>([]);

  const [userName, setUserName] = useState<string>("");
  const [mbtiType, setMbtiType] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/me/mypage`,
          {
            credentials: "include",
          }
        );
        const json = await res.json();
        if (!res.ok) throw new Error("마이페이지 정보 조회 실패");

        const { name, mbti_type } = json.data;
        setUserName(name);
        setMbtiType(mbti_type);
      } catch (err) {
        console.log("💥 유저 정보 로딩 실패:", err);
      }
    };

    const fetchFavoriteEtfs = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/me/favorites`,
          {
            credentials: "include",
          }
        );
        const json = await res.json();

        if (!res.ok) {
          throw new Error("좋아요 ETF 불러오기 실패");
        }

        const favoriteCodes: string[] = json.data;

        const etfPromises = favoriteCodes.map((code) =>
          fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/etf/compare/${code}`,
            { credentials: "include" }
          ).then((res) => res.json())
        );

        const responses = await Promise.all(etfPromises);
        const etfData: ETFData[] = responses.map((res) => ({
          ...res.data,
          isLiked: true,
        }));

        const sortedEtfs = [...etfData].sort((a, b) => {
          const aVal = parseFloat(a[selectedPeriod] || "0");
          const bVal = parseFloat(b[selectedPeriod] || "0");
          return bVal - aVal; // 내림차순 정렬
        });

        setEtfCards(sortedEtfs);
      } catch (err) {
        console.log("💥 ETF 불러오기 실패:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserInfo();
    fetchFavoriteEtfs();
  }, []);

  useEffect(() => {
    if (etfCards.length === 0) return;

    const sorted = [...etfCards].sort((a, b) => {
      const aVal = parseFloat(a[selectedPeriod] || "0");
      const bVal = parseFloat(b[selectedPeriod] || "0");
      return bVal - aVal;
    });

    setEtfCards(sorted);
  }, [selectedPeriod]);

  const toggleLike = async (etf_code: string) => {
    const target = etfCards.find((etf) => etf.etf_code === etf_code);
    if (!target) return;

    const isNowLiked = !target.isLiked;
    const method = isNowLiked ? "POST" : "DELETE";

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/me/favorites/${etf_code}`,
        {
          method,
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("관심 ETF 토글 실패!");
      }

      // 성공 시 UI에 반영
      setEtfCards((cards) =>
        cards.map((card) =>
          card.etf_code === etf_code ? { ...card, isLiked: isNowLiked } : card
        )
      );
    } catch (err) {
      console.error("💥 관심 ETF 요청 실패:", err);
      alert("관심 ETF 변경에 실패했어요 😥");
    }
  };

  const formatPrice = (price: string) => {
    return Number.parseInt(price).toLocaleString("ko-KR");
  };

  const formatChange = (change: string) => {
    const changeNum = Number.parseFloat(change);
    return changeNum > 0 ? `+${change}` : change;
  };

  const getCurrentPeriodLabel = () => {
    return (
      periodOptions.find((option) => option.key === selectedPeriod)?.label ||
      "1개월"
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center py-20">
          {mbtiType ? (
            <p className="text-lg text-gray-700">
              <span className="text-2xl font-semibold text-blue-600">
                {userName}
              </span>
              님의 투자 유형은{" "}
              <span className="text-2xl font-bold text-green-600">
                "{mbtiType}"
              </span>
              입니다.
            </p>
          ) : (
            <p className="text-lg text-gray-700 text-center">
              <span className="text-2xl font-semibold text-blue-600">
                {userName}
              </span>
              님의 ETF 추천 테스트 결과가 아직 없습니다.
              <br />
              <span className="inline-block mt-1">
                추천 테스트를 진행하고 각 ETF의 매칭 점수를 확인해보세요!
              </span>
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-bold text-gray-900">관심 ETF</h2>

            <div className="flex flex-wrap gap-2">
              {periodOptions.map((period) => (
                <Button
                  key={period.key}
                  variant={
                    selectedPeriod === period.key ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedPeriod(period.key)}
                  style={{ borderRadius: "1rem" }}
                  className={`text-xs ${
                    selectedPeriod === period.key
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "text-gray-600"
                  }`}
                >
                  {period.shortLabel}
                </Button>
              ))}
            </div>
          </div>

          {!isLoading && etfCards.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-20">
              관심 있는 ETF가 없습니다.
              <br />
              <span className="inline-block mt-2">
                ETF 검색 페이지에서 하트를 눌러 관심 ETF를 등록해보세요!
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-24">
              {etfCards.map((etf) => {
                const currentReturn = etf[selectedPeriod];
                const returnValue = Number.parseFloat(currentReturn);

                return (
                  <Card
                    key={etf.etf_code}
                    className="hover:shadow-md transition-shadow rounded-3xl"
                    style={{
                      height: "300px",
                      border: "1px",
                      borderColor: "#e0e0e0",
                      borderRadius: "1rem",
                    }}
                  >
                    <CardContent className="p-10">
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-base text-gray-900 leading-tight">
                            {etf.etf_name}
                          </h3>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleLike(etf.etf_code)}
                          className="p-2 h-auto"
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              etf.isLiked
                                ? "fill-red-500 text-red-500"
                                : "text-gray-400"
                            }`}
                          />
                        </Button>
                      </div>

                      <div className="space-y-3 pt-2">
                        <div className="text-lg font-bold text-gray-900">
                          {formatPrice(etf.latest_price)}원
                        </div>
                        <div className="text-xs text-gray-500">
                          {etf.provider}
                        </div>

                        {etf.total_score && (
                          <div className="flex justify-center py-3">
                            <ETFScoreCircle score={etf.total_score} />
                          </div>
                        )}

                        <div className="flex items-end justify-between">
                          <div className="flex items-center space-x-1">
                            {isNaN(returnValue) ? (
                              <span className="text-sm font-medium text-gray-400">
                                -
                              </span>
                            ) : (
                              <>
                                {returnValue > 0 ? (
                                  <TrendingUp className="w-4 h-4 text-red-500" />
                                ) : (
                                  <TrendingDown className="w-4 h-4 text-blue-500" />
                                )}
                                <span
                                  className={`text-sm font-medium ${
                                    returnValue > 0
                                      ? "text-red-500"
                                      : "text-blue-500"
                                  }`}
                                >
                                  {formatChange(currentReturn)}%
                                </span>
                              </>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {getCurrentPeriodLabel()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
