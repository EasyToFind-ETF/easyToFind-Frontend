"use client";

import React, { useEffect, useState } from "react";
import TestComponent from "./TestComponent";

const StartComponentClient: React.FC = () => {
  const [isStarted, setIsStarted] = useState(false);
  function startbtn() {
    // 쿠키에서 token 존재 여부 확인
    const hasToken =
      typeof document !== "undefined" &&
      document.cookie.split(";").some((c) => c.trim().startsWith("authToken="));
    if (!hasToken) {
      alert("로그인 후 이용해 주세요.");
      return;
    }
    setIsStarted(true); // 상태 변경
  }
  if (isStarted) {
    return <TestComponent />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen -mt-20">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="text-4xl font-bold mb-4">What's your ETF?</div>
          <div className="text-sm mb-10 text-center text-gray-600">
            간단한 테스트로 자신에게 가장 맞는<br></br> ETF를 추천 받아보세요!
          </div>
        </div>
        <div>
          <img
            src="/etf_test_start.png"
            alt="ETF 테스트"
            style={{ width: "25rem", height: "25rem" }}
            className="object-contain mb-12"
          />
        </div>
        <div>
          <button
            className="w-40 h-16 px-6 bg-[#0046ff] text-white text-xl rounded-3xl hover:bg-blue-600 transition-colors"
            onClick={startbtn}
          >
            시작하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartComponentClient;
