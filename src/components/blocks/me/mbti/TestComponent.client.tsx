"use client";

import React, { use, useEffect, useState } from "react";
import ResultComponent from "./ResultComponent";
import { mbtiQuestions } from "@/constants/question";

export default function TestComponentClient() {
  const [step, setStep] = useState(0); // 현재 몇 번째 문제인지
  const [riskScore, setRiskScore] = useState([0, 0, 0, 0]); // [수익률, 유동성, 추적오차, 규모]
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
  // 점수 → 투자유형 분류
  function getRiskType(scores: number[]): string {
    const maxIdx = scores.indexOf(Math.max(...scores));
    switch (maxIdx) {
      case 0:
        return "수익률형";
      case 1:
        return "유동성형";
      case 2:
        return "추적오차형";
      case 3:
        return "규모형";
      default:
        return "기타";
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
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <div
        style={{
          width: "70rem",
          height: "70vh",
          backgroundColor: "#2196F3",
          borderRadius: 40,
          position: "relative",
        }}
        className="flex flex-col items-start justify-start p-6"
      >
        {/* 질문 */}
        <div className="flex flex-row ">
          <h3
            className="text-white text-3xl font-bold"
            style={{ textShadow: "5px 0px 4px rgba(0, 0, 0, 0.25)" }}
          >
            Q.{step + 1}/
            <span className="text-[#BCBCBC] text-3xl font-bold">6</span>
            <p className="text-[64] font-semibold mt-40">{current.question}</p>
          </h3>
          <img
            src={current.icon}
            alt="Question Icon"
            className="w-48 h-48 absolute top-16 right-20"
          />
        </div>

        {/* 선택지 */}
        <div className="flex flex-col gap-6 w-full max-w-4xl mt-16 self-center">
          <div className="flex flex-wrap justify-center gap-6">
            {current.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(opt)}
                className="w-[45%] h-20 bg-white text-xl text-black py-3 px-5 rounded-lg shadow hover:bg-blue-200 mb-4"
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
