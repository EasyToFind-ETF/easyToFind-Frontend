'use client';

import React from 'react';

const ETFDetailInfo: React.FC = () => {
  return (
    <div id="info" className="mx-auto w-full flex-1 min-w-0 pl-10 pt-14">
      <div className="bg-white rounded-3xl w-full px-16 py-16 shadow" style={{ borderRadius: '4rem' }}>
        <div>
            <div className="text-2xl font-semibold mb-4">상품정보</div>
            <hr className="border-b-2 border-gray-200 mb-10" />
            {/* <div className="text-xs text-gray-400 mt-5 mb-10">기준일 : 25.7.11</div> */}
        </div>
        {/* 파란색+표 전체를 감싸는 div에 네 모서리 모두 radius */}
        <div className="border border-gray-200 rounded-3xl overflow-hidden" style={{ borderRadius: '2rem' }}>
          {/* 하늘색 상단 박스 */}
          <div
            className="bg-[#4DB6FF] w-full flex items-center justify-between px-10 py-10 border-b border-gray-200"
          >
            <div>
              <div className="text-white text-2xl font-semibold mb-1">Kodex 한국부동산리츠인프라</div>
              <div className="text-white text-lg font-semibold tracking-widest">476800</div>
            </div>
            {/* <img src="/house.png" alt="ETF 아이콘" className="w-16 h-16" /> */}
          </div>
          {/* 정보 표 */}
          <div className="w-full px-10 py-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-base bg-white">
            <div className="flex justify-between items-center bg-[#F2F8FC] rounded-xl px-6 py-3">
              <span className="text-gray-500">순자산 총액</span>
              <span className="font-semibold">3,641억원</span>
            </div>
            <div className="flex justify-between items-center bg-[#F2F8FC] rounded-xl px-6 py-3">
              <span className="text-gray-500">상장일</span>
              <span className="font-semibold">2024.03.05</span>
            </div>
            <div className="flex justify-between items-center bg-[#F2F8FC] rounded-xl px-6 py-3">
              <span className="text-gray-500">최소거래단위</span>
              <span className="font-semibold">1주</span>
            </div>
            <div className="flex justify-between items-center bg-[#F2F8FC] rounded-xl px-6 py-3">
              <span className="text-gray-500">설정단위</span>
              <span className="font-semibold">50,000좌</span>
            </div>
            <div className="flex justify-between items-center bg-[#F2F8FC] rounded-xl px-6 py-3">
              <span className="text-gray-500">자산운용사</span>
              <span className="font-semibold">신한펀드파트너스</span>
            </div>
            {/* <div className="flex justify-between items-center bg-[#F2F8FC] rounded-xl px-6 py-3">
              <span className="text-gray-500">수탁은행</span>
              <span className="font-semibold">한국씨티은행</span>
            </div> */}
          </div>
        </div>
        {/* 안내문구 */}
        {/* <div className="bg-[#F5FAFF] text-[#3B82F6] text-sm rounded-xl px-6 py-4 mt-4">
          *해당 상품은 부동산분리과세 신청가능한 ETF입니다. 분리과세 신청 관련 문의는 이용 중인 증권사로 문의해 주세요.
        </div> */}
        {/* 분배금지급 영역 (샘플) */}
        {/* <div className="mt-8 bg-white rounded-2xl shadow p-8">
          <div className="text-lg font-bold mb-4">분배금지급</div>
          <div className="h-32 flex items-center justify-center text-gray-400">(분배금 차트/테이블 자리)</div>
        </div> */}
      </div>
    </div>
  );
};

export default ETFDetailInfo; 