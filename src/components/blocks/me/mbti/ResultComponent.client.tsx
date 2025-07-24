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
        body.stabilityScore = Number(riskScore[0]);
        body.liquidityScore = Number(riskScore[1]);
        body.growthScore = Number(riskScore[2]);
        body.divScore = Number(riskScore[3]);
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
          {"에"}
          <br />
          관심을 가진 당신을 위한 추천 ETF입니다!
        </>
      );
    } else {
      return (
        <>
          <span className="text-[#0046FF] font-semibold">{riskType}</span>{" "}
          <br />
          성향을 가진 당신을 위한 추천 ETF입니다!
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
    if (score >= 70) return "#22c55e"; // 초록색
    if (score >= 40) return "#f97316"; // 주황색
    if (score >= 15) return "#eab308"; // 노란색
    return "#ef4444"; // 빨간색
  };

  return (
    <div className="w-full">
      {/* 제목 */}
      {/* <div className="bg-white rounded-2xl shadow p-12 mx-4 mt-28"> */}
      <h1 className="text-3xl font-bold text-center mt-28">{getTitle()}</h1>
      {/* </div> */}

      {/* 탭 버튼 */}
      <div className="flex w-full mb-6 mt-28">
        <button
          className={`flex-1 pb-2 text-lg font-semibold border-b-[3px] ${
            selectedTab === "theme"
              ? "border-black text-black"
              : "border-transparent text-gray-400"
          }`}
          onClick={() => setSelectedTab("theme")}
        >
          테마별
        </button>
        <button
          className={`flex-1 pb-2 text-lg font-semibold border-b-[3px] ${
            selectedTab === "type"
              ? "border-black text-black"
              : "border-transparent text-gray-400"
          }`}
          onClick={() => setSelectedTab("type")}
        >
          유형별
        </button>
      </div>

      {/* 카드 목록 */}
      <div className="flex flex-col gap-8 mt-10 w-full">
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
