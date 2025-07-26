"use client";

import { useEffect, useState } from "react";
import ETFCard from "./recommendETFcard";

interface Props {
  theme: string;
  riskScore: number[];
}

// getInvestmentType 함수를 ResultComponent로 이동
function getInvestmentType(scores: number[]): string {
  const [st, li, gr, di] = scores;
  const max = Math.max(...scores);
  const min = Math.min(...scores);
  const gap = max - min;

  // 1. 복합 특성 조합
  if (st >= 15 && di >= 15) return "보수안정형";
  if (li >= 15 && gr >= 15) return "수익지향형";
  if (st >= 15 && li >= 15) return "안정유동형";
  if (st >= 15 && gr >= 15) return "안정성장형";
  if (li >= 15 && di >= 15) return "분산유동형";
  if (gr >= 15 && di >= 15) return "균형형";

  if (st >= 15 && gap <= 7) return "안정추구";

  if (li >= 15 && st <= 8) return "단기투자형";

  if (gr >= 15 && st <= 8) return "공격투자형";

  if (di >= 15 && gap <= 6) return "분산중시형";

  // 2. 전반적인 밸런스
  if (gap <= 5) return "균형형";

  // 3. 주된 요소 기반 fallback
  switch (scores.indexOf(max)) {
    case 0:
      return "안정추구형";
    case 1:
      return "유동선호형";
    case 2:
      return "성장지향형";
    case 3:
      return "분산중시형";
    default:
      return "변동감수형";
  }
}

export default function ResultComponentClient({
  theme,
  riskScore,
}: Props) {
  const [selectedTab, setSelectedTab] = useState<"theme" | "type">("theme");
  console.log("riskScore result", riskScore);
  const riskType = getInvestmentType(riskScore);
  console.log("riskType", riskType);

  const [etfList, setEtfList] = useState<any[]>([]);
  //가중치 곱하는 함수
  function applyWeightByType(type: string, scores: number[]): number[] {
    const [st, li, gr, di] = scores;
  
    switch (type) {
      case "보수안정형":
        return [st * 2, li, gr, di * 2];
      case "수익지향형":
        return [st, li * 2, gr * 2, di];
      case "안정유동형":
        return [st * 2, li * 2, gr, di];
      case "안정성장형":
        return [st * 2, li, gr * 2, di];
      case "분산유동형":
        return [st, li * 2, gr, di * 2];
      case "균형형":
        return [st, li, gr, di]; // 균형형은 가중치 X
      case "안정추구":
      case "안정추구형":
        return [st * 2, li, gr, di];
      case "단기투자형":
        return [st, li * 2, gr, di];
      case "공격투자형":
        return [st, li, gr * 2, di];
      case "분산중시형":
        return [st, li, gr, di * 2];
      case "유동선호형":
        return [st, li * 2, gr, di];
      case "성장지향형":
        return [st, li, gr * 2, di];
      case "변동감수형":
      default:
        return [st, li, gr, di]; // 기본은 가중치 없음
    }
  }
  const weightedScores = applyWeightByType(riskType, riskScore);

  
  //결과 불러오기
  useEffect(() => {
    const fetchData = async () => {
      let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/recommendation`;
      let body: any = {};

      if (Array.isArray(riskScore) && riskScore.length === 4) {
        
        body.stabilityScore = weightedScores[0];
        body.liquidityScore = weightedScores[1];
        body.growthScore = weightedScores[2];
        body.divScore = weightedScores[3];
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

 // 결과 저장
useEffect(() => {
  const fetchData = async () => {
    let body: any = {};

    if (Array.isArray(riskScore) && riskScore.length === 4) {
      body.stabilityScore = weightedScores[0];
      body.liquidityScore = weightedScores[1];
      body.growthScore = weightedScores[2];
      body.divScore = weightedScores[3];
    }

    body.mbtiType = riskType;
    if (selectedTab === "theme") {
      body.theme = theme;
    }


    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/me/mbti`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    console.log("저장 body:", body);
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

  // 최종 점수로 투자 유형 계산
  const finalScores = riskScore.map(Number);
  const finalRiskType = getInvestmentType(finalScores);

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
