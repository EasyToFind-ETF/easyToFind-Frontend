'use client';

import React from 'react';

const ETFVisualHeader: React.FC = () => {
  return (
      <div
        className="bg-[#4DB6FF] rounded-3xl p-6 sm:p-10 flex flex-col shadow-lg relative mx-auto w-full h-auto md:h-[500px]"
        style={{ marginTop: 130, borderRadius: '4rem' }}
      >
        {/* 반응형 배치 */}
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8 h-full">
          {/* 왼쪽 정보 */}
          <div className="w-full md:w-[500px] max-w-full text-white" style={{ marginLeft: 50, marginTop: -10 }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
                부동산
              </span>
              <span className="inline-flex items-center px-2 py-1 bg-white/20 rounded-full text-xs font-medium">퇴직연금(70%)</span>
              <span className="inline-flex items-center px-2 py-1 bg-white/20 rounded-full text-xs font-medium">개인연금</span>
            </div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
              Kodex 한국부동산리츠인프라
            </h1>
            <div className="text-xl font-semibold tracking-widest mb-2">476800</div>
            <div className="mb-4 text-base opacity-90">배당 투자의 정석, 건물주 되어 매월 배당 받자</div>
          </div>
          {/* 오른쪽 이미지 */}
          <div className="w-full md:w-[400px] max-w-full flex justify-center items-center" style={{ marginRight: 50 }}>
            <img
              src="/house.png"
              alt="부동산 ETF"
              className="object-contain mx-auto drop-shadow-xl"
              style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.10))', width: '100%', height: '100%' }}
            />
          </div>
        </div>
        {/* 하단 주요 정보 카드 */}
        <div className="flex flex-col md:flex-row gap-4 w-full justify-center items-center -mt-24 z-10 relative">
          <div className="bg-[#FFFFFFCC] rounded-3xl shadow-xl p-6 flex flex-col items-center w-[500px]" style={{ borderRadius: '1.5rem' }}>
            <div className="text-xs text-gray-500 mb-1">현재가(원)</div>
            <div className="flex items-end gap-2">
              <span className="text-base text-red-500">▲ 0 (0%)</span>
              <span className="text-2xl font-bold text-gray-900 ml-3">4,760</span>
              <span className="text-base text-gray-500">원</span>
            </div>
          </div>
          <div className="bg-[#FFFFFFCC] rounded-3xl shadow-xl p-6 flex flex-col items-center w-[500px]" style={{ borderRadius: '1.5rem' }}>
            <div className="text-xs text-gray-500 mb-1">거래량(주)</div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-gray-900">1,591,877</span>
              <span className="text-base text-gray-500">주</span>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ETFVisualHeader; 