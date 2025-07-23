"use client";

import React, { use, useEffect, useState } from "react";
import ResultComponent from "./ResultComponent";
import { mbtiQuestions } from "@/constants/question";

export default function TestComponentClient() {
  const [step, setStep] = useState(0); // 현재 몇 번째 문제인지
  const [riskScore, setRiskScore] = useState([0, 0, 0, 0]); // [안정성, 유동성, 성장성, 분산도]
  const [riskType, setRiskType] = useState(""); // 투자 유형
  const [themeAnswers, setThemeAnswers] = useState<string[]>([]);

  //선택지 하나 누를때 실행되는 함수
  const handleSelect = (option: any) => {
    if (current.type === "risk") {
      if (option.weights) {
        setRiskScore((prev) => prev.map((v, i) => v + (option.weights[i] || 0)));
      }
    } else if (current.type === "theme") {
      setThemeAnswers((prev) => [...prev, option.value]);
    }
    setStep((prev) => prev + 1); // 다음 문제로
  };
  // 가장 많이 선택된 테마를 찾는 함수
  function getMostFrequentTheme(answers: string[]): string {
    return Object.entries(
      answers.reduce((acc, cur) => {
        acc[cur] = (acc[cur] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).sort((a, b) => b[1] - a[1])[0][0]; // 가장 count 높은 값의 key 반환
  }

  const current = mbtiQuestions[step];
  function getRiskType(scores: number[]): string {
    const maxIdx = scores.indexOf(Math.max(...scores));
    switch (maxIdx) {
      case 0:
        return "안정성 우선형";      
      case 1:
        return "단기매매 중시형";    // 유동성 중심
      case 2:
        return "고수익 추구형";    // 추적오차 중심
      case 3:
        return "규모중심 추구형";      // 규모/안정성 중심
      default:
        return "균형 투자형";
    }
  }
  


  //점수바뀔 때마다 투자유형 변경
  useEffect(() => {
    setRiskType(getRiskType(riskScore)); // 점수에 따라 투자유형 분류
  }, [riskScore]);

  //10문제 끝났을 때
  if (step >= mbtiQuestions.length) {
    const most = getMostFrequentTheme(themeAnswers);
    console.log("최종 점수:", riskScore);
    console.log("테마 답변:", most);
    return <ResultComponent riskType={riskType} theme={most} riskScore={riskScore}/>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-2 sm:p-4">
      <div
        style={{
          width: "100%",
          maxWidth: "70rem",
          height: "70vh",
          backgroundColor: "#2196F3",
          borderRadius: 40,
          position: "relative",
        }}
        className="flex flex-col items-start p-4 sm:p-6"
      >
        {/* 질문 */}
        <div className="flex flex-col sm:flex-row w-full mt-4 sm:mt-8 gap-4">
          <h3
            className="text-white text-xl sm:text-2xl md:text-3xl font-bold flex-1"
            style={{ textShadow: "5px 0px 4px rgba(0, 0, 0, 0.25)" }}
          >
            Q.{step + 1}/
            <span className="text-[#BCBCBC] text-xl sm:text-2xl md:text-3xl font-bold">6</span>
            <p className="text-2xl sm:text-3xl md:text-4xl font-semibold mt-4 sm:mt-6">{current.question}</p>
          </h3>
          <img
            src={current.icon}
            alt="Question Icon"
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 flex-shrink-0 self-center sm:self-start"
          />
        </div>

        {/* 선택지 */}
        <div className="flex flex-col gap-4 w-full mt-auto mb-4 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
            {current.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(opt)}
                className="w-full h-14 sm:h-16 md:h-20 bg-white text-sm sm:text-lg md:text-xl text-black py-2 sm:py-3 px-3 sm:px-4 rounded-lg shadow hover:bg-blue-200 transition-colors"
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

}
