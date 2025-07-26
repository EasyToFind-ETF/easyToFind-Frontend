"use client";

import { useEffect, useState } from "react";
import ETFCard from "./recommendETFcard";

interface Props {
  riskType: string;
  theme: string;
  riskScore: number[];
}

export default function ResultComponentClient({
  riskType,
  theme,
  riskScore,
}: Props) {
  const [selectedTab, setSelectedTab] = useState<"theme" | "type">("theme");
  console.log("riskScore result", riskScore);

  const [etfList, setEtfList] = useState<any[]>([]);
  //결과 불러오기
  useEffect(() => {
    const fetchData = async () => {
      let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/recommendation`;
      let body: any = {};

      if (Array.isArray(riskScore) && riskScore.length === 4) {
        // 가장 높은 점수 찾기
        const scores = riskScore.map(Number);
        const maxScore = Math.max(...scores);
        const maxIndex = scores.indexOf(maxScore);
        
        // 가장 높은 점수를 1.5배로 증폭
        const amplifiedScores = [...scores];
        amplifiedScores[maxIndex] = maxScore * 1.5;
        
        body.stabilityScore = amplifiedScores[0];
        body.liquidityScore = amplifiedScores[1];
        body.growthScore = amplifiedScores[2];
        body.divScore = amplifiedScores[3];
      }

      if (selectedTab === "theme") {
        url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/recommendation/theme`;
        body.theme = theme;
      }

      const etfResponse = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const etfData = await etfResponse.json();
      console.log("body", body);
      setEtfList(Array.isArray(etfData.data) ? etfData.data : []);
    };
    fetchData();
  }, [selectedTab, riskScore, theme]);

  //결과 저장
  useEffect(() => {
    const fetchData = async () => {
      const [stabilityWeight, liquidityWeight, growthWeight, divWeight] =
        riskScore;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/me/mbti`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            mbtiType: riskType,
            stabilityWeight: Number(riskScore[0]),
            liquidityWeight: Number(riskScore[1]),
            growthWeight: Number(riskScore[2]),
            divWeight: Number(riskScore[3]),
          }),
        }
      );
      const data = await response.json();
      console.log(
        "save",
        stabilityWeight,
        liquidityWeight,
        growthWeight,
        divWeight
      );
    };
    fetchData();
  }, []);

  const getTitle = () => {
    if (selectedTab === "theme") {
      return (
        <>
          <span className="text-[#0046FF] font-semibold ">{theme}테마</span>
          <span className="text-2xl">{" 에"}</span>
          <br />
          <span className="text-2xl">
            관심을 가지고 있는 당신을 위한 추천 ETF입니다
          </span>
        </>
      );
    } else {
      return (
        <>
          <span className="text-[#0046FF] font-semibold">{riskType}</span>{" "}
          <br />
          <span className="text-2xl">
            성향을 가진 당신을 위한 추천 ETF입니다
          </span>
        </>
      );
    }
  };

  // 억원 단위 변환 함수 (string 또는 number 입력)
  const formatToEokwon = (value: string | number) => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return `${(num / 100000000).toLocaleString(undefined, {
      maximumFractionDigits: 1,
    })}억원`;
  };

  // 점수에 따른 색상 반환 함수
  const getScoreColor = (score: number) => {
    if (score >= 80) return "#3b82f6"; // blue-500
    if (score >= 60) return "#22c55e"; // green-500
    if (score >= 40) return "#eab308"; // yellow-500
    if (score >= 20) return "#f97316"; // orange-500
    return "#ef4444"; // red-500
  };

  return (
    <div className="w-full">
      {/* 제목 */}
      {/* <div className="bg-white rounded-2xl shadow p-12 mx-4 mt-28"> */}
      <h1 className="text-3xl font-bold text-center mt-28">{getTitle()}</h1>
      {/* </div> */}

      {/* 탭 버튼 */}
      <div className="flex border-b mb-20 mt-28">
        <button
          className={`flex-1 py-3 text-lg font-medium border-b-2 transition-colors duration-150 ${
            selectedTab === "theme"
              ? "border-[#0046ff] text-[#0046ff]"
              : "border-transparent text-gray-500"
          }`}
          onClick={() => setSelectedTab("theme")}
        >
          테마별
        </button>
        <button
          className={`flex-1 py-3 text-lg font-medium border-b-2 transition-colors duration-150 ${
            selectedTab === "type"
              ? "border-[#0046ff] text-[#0046ff]"
              : "border-transparent text-gray-500"
          }`}
          onClick={() => setSelectedTab("type")}
        >
          유형별
        </button>
      </div>

      {/* 카드 목록 */}
      <div className="flex flex-col gap-8 my-10 w-full">
        {etfList.map((etf, idx) => (
          <ETFCard
            key={etf.etf_code}
            name={etf.etf_name}
            score={etf.total_score}
            etf_code={etf.etf_code}
            details={[
              {
                label: "안정성",
                value: etf.stability_score,
                color: getScoreColor(etf.stability_score),
              },
              {
                label: "유동성",
                value: etf.liquidity_score,
                color: getScoreColor(etf.liquidity_score),
              },
              {
                label: "성장도",
                value: etf.growth_score,
                color: getScoreColor(etf.growth_score),
              },
              {
                label: "분산도",
                value: etf.diversification_score,
                color: getScoreColor(etf.diversification_score),
              },
            ]}
          />
        ))}
      </div>
    </div>
  );
}
