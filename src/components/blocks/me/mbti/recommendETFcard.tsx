import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CircularProgress } from "@/components/ui/circular-progress";
import {
  toggleFavorite,
  fetchFavoriteEtfCodes,
} from "@/services/etfFavoriteService";

interface ETFCardProps {
  name: string;
  score: number;
  etf_code: string;
  details: {
    label: string;
    value: number;
    color: string;
  }[];
}

export default function ETFCard({
  name,
  score,
  etf_code,
  details,
}: ETFCardProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  // 관심 ETF 목록 가져오기
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const favoriteCodes = await fetchFavoriteEtfCodes();
        setIsFavorite(favoriteCodes.includes(etf_code));
      } catch (err) {
        console.warn("관심 ETF 상태 확인 실패:", err);
      }
    };

    checkFavoriteStatus();
  }, [etf_code]);

  const handleClick = () => {
    router.push(`/etfs/${etf_code}`);
  };

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지

    try {
      await toggleFavorite(etf_code, isFavorite);
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("관심 ETF 토글 실패:", err);
      alert("로그인 후 이용해주세요!");
    }
  };

  // 점수에 따른 등급 반환
  const getScoreGrade = (score: number) => {
    if (score >= 80) return { grade: "A", color: "#3b82f6" }; // blue-500
    if (score >= 60) return { grade: "B", color: "#22c55e" }; // green-500
    if (score >= 40) return { grade: "C", color: "#eab308" }; // yellow-500
    if (score >= 20) return { grade: "D", color: "#f97316" }; // orange-500
    return { grade: "E", color: "#ef4444" }; // red-500
  };

  const scoreGrade = getScoreGrade(score);

  return (
    <div
      className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 hover:shadow-md hover:border-gray-200 transition-all duration-300 cursor-pointer group relative"
      onClick={handleClick}
      style={{ borderRadius: "4rem" }}
    >
      {/* 헤더 */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-2 pl-6 pt-4">
          <h3 className="text-2xl font-semibold text-gray-900 transition-colors">
            {name}
          </h3>
          {/* 하트 버튼 */}
          <button
            onClick={handleHeartClick}
            className="p-2 mr-2 rounded-full transition-colors"
          >
            <svg
              className={`w-6 h-6 transition-colors ${
                isFavorite
                  ? "text-red-500 fill-current"
                  : "text-gray-400 hover:text-red-400"
              }`}
              fill={isFavorite ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>
        <p className="text-lg font-medium text-gray-900 mb-6 pl-6">
          {etf_code}
        </p>
      </div>

      {/* 점수 섹션 */}
      <div className="flex gap-8 mb-6">
        {/* 왼쪽: 점수 뱃지 */}
        <div className="pl-16 flex flex-col items-center justify-center min-w-[140px]">
          <CircularProgress
            value={score}
            size={150}
            strokeWidth={12}
            color={scoreGrade.color}
            label={undefined}
          />
          {/* <span className="text-base font-bold text-gray-700 mt-2">
            {scoreGrade.grade}
          </span> */}
        </div>

        {/* 오른쪽: 점수 바들 */}
        <div className="flex-1 flex items-center ml-16">
          <div className="grid grid-cols-2 gap-4 w-full">
            {details.map((detail) => (
              <div key={detail.label} className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 mb-2">
                  {detail.label}
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-72 bg-gray-200 rounded-3xl h-3">
                    <div
                      className="h-3 rounded-3xl transition-all duration-500"
                      style={{
                        width: `${detail.value}%`,
                        backgroundColor: getScoreGrade(detail.value).color,
                      }}
                    />
                  </div>
                  <span
                    className="text-sm font-semibold min-w-[30px] text-right"
                    style={{ color: getScoreGrade(detail.value).color }}
                  >
                    {detail.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 액션 */}
      <div className="pt-4 border-gray-100">
        <div className="flex items-center justify-end w-full">
          <div className="flex items-center mr-6 mb-2 text-gray-500 text-sm font-medium group-hover:translate-x-1 transition-transform">
            <span>자세히 보기</span>
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
