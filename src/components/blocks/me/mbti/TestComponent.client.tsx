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
        setRiskScore((prev) =>
          prev.map((v, i) => v + (option.weights[i] || 0))
        );
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

  //10문제 끝났을 때
  if (step >= mbtiQuestions.length) {
    const most = getMostFrequentTheme(themeAnswers);
    console.log("최종 점수:", riskScore);
    console.log("테마 답변:", most);
    return (
      <ResultComponent theme={most} riskScore={riskScore} />
    );
  }

  return (
    <div className="flex max-w-7xl mx-auto flex-col items-center justify-center w-full min-h-screen p-4 -mt-20">
      <div
        style={{
          width: "100%",
          maxWidth: "max-w-7xl",
          height: "600px",
          background: `#7fc2fe`,
          position: "relative",
          borderRadius: "4rem",
          boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.3)",
        }}
        className="flex flex-col items-start justify-start px-20 py-24"
      >
        {/* 질문 */}
        <div className="flex flex-col sm:flex-row w-full gap-6 mb-8">
          <h3
            className="text-white text-2xl font-bold flex-1"
            style={{ textShadow: "2px 2px 8px rgba(0, 0, 0, 0.3)" }}
          >
            <div className="text-lg mb-4">Q. {step + 1} / 6</div>
            <p className="text-3xl font-semibold leading-relaxed">
              {current.question.split("\n").map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index < current.question.split("\n").length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
          </h3>
          <img
            src={current.icon}
            alt="Question Icon"
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 flex-shrink-0 object-contain"
          />
        </div>

        {/* 선택지 */}
        <div className="flex flex-col gap-4 w-full flex-1 max-w-5xl mx-auto">
          {current.options.length === 5 ? (
            <div className="flex flex-col gap-4 w-full">
              {/* 첫 번째 줄: 2개 버튼 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {current.options.slice(0, 2).map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(opt)}
                    className="w-full h-16 bg-white/90 text-base text-gray-700 py-3 px-4 rounded-3xl shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-100"
                  >
                    {opt.text.split("\n").map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        {index < opt.text.split("\n").length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </button>
                ))}
              </div>
              {/* 두 번째 줄: 2개 버튼 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {current.options.slice(2, 4).map((opt, idx) => (
                  <button
                    key={idx + 2}
                    onClick={() => handleSelect(opt)}
                    className="w-full h-16 bg-white/90 text-base text-gray-700 py-3 px-4 rounded-3xl shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-100"
                  >
                    {opt.text.split("\n").map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        {index < opt.text.split("\n").length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </button>
                ))}
              </div>
              {/* 세 번째 줄: 1개 버튼 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => handleSelect(current.options[4])}
                  className="w-full h-16 bg-white/90 text-base text-gray-700 py-3 px-4 rounded-3xl shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  {current.options[4].text.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index <
                        current.options[4].text.split("\n").length - 1 && (
                        <br />
                      )}
                    </React.Fragment>
                  ))}
                </button>
                <div></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {current.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(opt)}
                  className="w-full h-20 bg-white/90 text-lg text-gray-700 py-4 px-4 rounded-3xl shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  {opt.text.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < opt.text.split("\n").length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
