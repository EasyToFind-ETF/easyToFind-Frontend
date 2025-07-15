"use client";

import { useEffect, useState } from "react";

interface Props {
  riskType: string;
  theme: string;
}

export default function ResultComponentClient({ riskType, theme }: Props) {
  const [selectedTab, setSelectedTab] = useState<"theme" | "type">("theme");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:3000/api/me/mbti', {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mbtiType: riskType,
          userId: 1,
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
    </div>
  );
}
