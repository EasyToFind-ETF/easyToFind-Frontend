
"use client";

import { useEffect, useState } from "react";
import ETFCard from "./recommendETFcard";

interface Props {
  riskType: string;
  theme: string;
  riskScore: number;
}

export default function ResultComponentClient({ riskType, theme, riskScore }: Props) {
  const [selectedTab, setSelectedTab] = useState<"theme" | "type">("theme");
  console.log("riskScore result",riskScore);
  
  const [etfList, setEtfList] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/recommendation`;
      let body: any = { riskScore };

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
      console.log("body",body)
      setEtfList(Array.isArray(etfData.data) ? etfData.data : []);
    };
    fetchData();
  }, [selectedTab, riskScore, theme]);

  useEffect(() => {
    
    const fetchData = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/me/mbti`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mbtiType: riskType,
          userId: 1,
          riskScore: riskScore,
        }),
      });
      const data = await response.json();
      console.log(data);
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

  // 순자산 총액을 억원 단위로 변환하는 함수
  const formatAum = (aum: string | number) => {
    const num = typeof aum === "string" ? parseFloat(aum) : aum;
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
        {etfList.map((etf) => (
          <ETFCard
            key={etf.etf_code}
            name={etf.etf_name}
            score={etf.final_score}
            details={[
              { label: "1년 수익률", value: etf.return_1y, color: "#22c55e" },
              { label: "총보수", value: etf.expense_ratio, color: "#22c55e" },
              { label: "순자산 총액", value: formatAum(etf.latest_aum), color: "#22c55e" },
            ]}
          />
        ))}
      </div>
    </div>
  );
}