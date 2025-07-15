"use client";

import React, { useState } from "react";
import ResultComponent from "./ResultComponent";

export default function TestComponentClient() {
  const [step, setStep] = useState(0); // 현재 몇 번째 문제인지
  const questions = [
    { question: "Q1. 투자 스타일은?", options: ["공격", "중립", "안정"] },
    { question: "Q2. 선호 테마는?", options: ["AI", "친환경", "바이오"] },
  ];
  const handleSelect = () => {
    setStep((prev) => prev + 1); // → 다음 문제로 이동
  };

  if (step >= questions.length) {
    return <ResultComponent />;
  }

  // 점수 → 투자유형 분류
  function getRiskType(score: number): string {
    if (score <= 5) return "안정형";
    if (score <= 10) return "안정추구형";
    if (score <= 17) return "위험중립형";
    if (score <= 24) return "적극투자형";
    return "공격형";
  }

  return <div>테스트 화면 </div>;
}
