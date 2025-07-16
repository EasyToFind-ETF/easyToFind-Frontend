"use client";

import React, { useEffect, useState } from "react";
import TestComponent from "./TestComponent";

const StartComponentClient: React.FC = () => {
  const [isStarted, setIsStarted] = useState(false);
  function startbtn() {

    setIsStarted(true); // 상태 변경
  }
  if (isStarted) {
    return <TestComponent />;
  }


  return (
    <div className="justify-center align-center flex flex-col items-center p-8 mt-60">
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

        className="w-40 h-16 mt-4 px-6 py-2 bg-blue-500 text-white text-2xl rounded-lg hover:bg-blue-600 transition-colors"

        onClick={startbtn}
      >
        시작하기
      </button>
    </div>
  );
};

export default StartComponentClient;
