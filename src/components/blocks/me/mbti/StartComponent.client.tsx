"use client";

import React, { useEffect, useState } from "react";
import TestComponent from "./TestComponent";

const StartComponentClient: React.FC = () => {
  const [isStarted, setIsStarted] = useState(false);
  function startbtn() {
    // 쿠키에서 token 존재 여부 확인
    const hasToken = typeof document !== 'undefined' && document.cookie.split(';').some(c => c.trim().startsWith('authToken='));
    if (!hasToken) {
      alert('로그인 후 이용해 주세요.');
      return;
    }
    setIsStarted(true); // 상태 변경
  }
  if (isStarted) {
    return <TestComponent />;
  }


  return (
    <div className="justify-center flex flex-col items-center">
      <h1 className="text-4xl font-bold ">What's your ETF?</h1>
      <p className="text-sm mt-2 text-center text-gray-600">
        간단한 테스트로 자신에게 가장 맞는<br></br> ETF를 추천 받아보세요!
      </p>
      <div className="w-[30rem] h-90">

        <img
          src="/etf_test_start.png"
          alt="ETF 테스트"
          className="w-full h-full object-contain"
        />
      </div>
      <button

        className="w-40 h-16 mt-4 px-6 py-2 bg-[#0046ff] text-white text-2xl rounded-lg hover:bg-blue-600 transition-colors"

        onClick={startbtn}
      >
        시작하기
      </button>
    </div>
  );
};

export default StartComponentClient;
