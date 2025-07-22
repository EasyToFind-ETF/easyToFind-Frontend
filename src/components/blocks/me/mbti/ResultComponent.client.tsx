
"use client";

import { useEffect, useState } from "react";
import ETFCard from "./recommendETFcard";

interface Props {
  riskType: string;
  theme: string;
  riskScore: number[];
}

export default function ResultComponentClient({ riskType, theme, riskScore }: Props) {
  const [selectedTab, setSelectedTab] = useState<"theme" | "type">("theme");
  console.log("riskScore result", riskScore);

  
  const [etfList, setEtfList] = useState<any[]>([]);
  //결과 불러오기
  useEffect(() => {
    const fetchData = async () => {
      let url = "http://localhost:3001/api/recommendation";
      let body: any = { riskScore };

      if (selectedTab === "theme") {
        url = "http://localhost:3001/api/recommendation/theme";
        body.theme = theme;
      }

      const etfResponse = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const etfData = await etfResponse.json();
      console.log("body", body)
      setEtfList(Array.isArray(etfData.data) ? etfData.data : []);
    };
    fetchData();
  }, [selectedTab, riskScore, theme]);


  //결과 저장
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:3001/api/me/mbti', {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
        body: JSON.stringify({
          mbtiType: riskType,
          stabilityWeight,
          liquidityWeight,
          growthWeight,
          divWeight,
        }),
      });
      const data = await response.json();
      console.log("normal",stabilityWeight, liquidityWeight, growthWeight, divWeight);
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
    return `${(num / 100000000).toLocaleString(undefined, { maximumFractionDigits: 1 })}억원`;
  };

  return (
    <div className="flex flex-col items-center mt-10">
      {/* 제목 */}
      <h1 className="text-3xl font-bold text-center mt-10">{getTitle()}</h1>
      {/* 탭 버튼 */}
      <div className="flex w-full max-w-2xl border-b-2 mb-6 mt-16">
        <button
          className={`flex-1 pb-2 text-lg font-semibold ${
            selectedTab === "theme"
              ? "border-b-4 border-black text-black"
              : "text-gray-400"
          }`}
          onClick={() => setSelectedTab("theme")}
        >
          테마별
        </button>
        <button
          className={`flex-1 pb-2 text-lg font-semibold ${
            selectedTab === "type"
              ? "border-b-4 border-black text-black"
              : "text-gray-400"
          }`}
          onClick={() => setSelectedTab("type")}
        >
          유형별
        </button>
      </div>

      
      <div className="flex flex-col gap-8 mt-10 w-full items-center">
        {etfList.map((etf, idx) => (
          <ETFCard
            key={etf.etf_name + idx}
            name={etf.etf_name}
            score={parseFloat(etf.total_score)}
            etf_code={etf.etf_code}
            details={[
              { label: "안정성", value: etf.stability_score, color: "#22c55e" },
              { label: "유동성", value: etf.liquidity_score, color: "#22c55e" },
              { label: "성장성", value: etf.growth_score, color: "#22c55e" },
              { label: "분산투자", value: etf.diversification_score, color: "#22c55e" },
            ]}
          />
        ))}
      </div>
    </div>
  );
}