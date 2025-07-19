'use client';

import React, { useState } from 'react';

const periods = [
  '1주', '1개월', '3개월', '6개월', '1년', '3년', '연초이후', '상장이후'
];


const ETFDetailYield: React.FC = () => {
  const [activePeriod, setActivePeriod] = useState('1주');

  return (
    <div id="yield" className="mx-auto w-full flex-1 min-w-0 pl-10 pt-10">
      <div className="bg-white rounded-3xl w-full px-16 py-16 shadow" style={{ borderRadius: '4rem' }}>
        {/* 타이틀, 구분선, 기준일 */}
        <div>
          <div className="text-2xl font-semibold mb-4">수익률</div>
          <hr className="border-b-2 border-gray-200 mb-10" />
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4 w-full">
              <span className="font-semibold ml-2 mr-4 whitespace-nowrap">적용기간</span>
              <div className="flex bg-[#F6F7F9] rounded-2xl p-1 w-full">
                {periods.map((period) => (
                  <button
                    key={period}
                    onClick={() => setActivePeriod(period)}
                    // className={`flex-1 min-w-0 px-6 py-2 rounded-2xl text-base font-medium transition-colors duration-150 border ${
                      // 광해 className={`flex-1 h-10 px-1 text-[14px] rounded-2xl transition-colors duration-150 border ${
                        className={`flex-1 px-4 py-2 rounded-2xl text-sm font-medium transition-colors duration-150 border ${
                        
                      activePeriod === period
                        ? 'bg-white'
                        : 'border-transparent text-gray-500'
                    }`}
                    style={activePeriod === period ? { borderColor: '#0046ff', color: '#0046ff', fontWeight: 'semibold' } : {}}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* <div className="text-xs text-gray-400 mb-10">기준일 : 25.7.11</div> */}
        {/* 그래프 placeholder */}
        <div className="w-full h-[350px] bg-[#FAFAFA] rounded-2xl flex items-center justify-center mb-8 border border-dashed border-gray-200">
          <span className="text-gray-400">({activePeriod} 그래프 자리)</span>
        </div>
        {/* 범례 */}
        <div className="flex gap-20 bg-[#F6F7F9] rounded-2xl px-4 py-4 text-base items-center justify-center">
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-red-400 inline-block"></span>
              <span className="text-gray-500 text-sm font-medium">기준가격(NAV)</span>
            </div>
            <span className="text-base">-1.76%(4,634.78원)</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-cyan-400 inline-block"></span>
              <span className="text-gray-500 text-sm font-medium">시장가격(종가)</span>
            </div>
            <span className="text-base">-2.63%(4,625원)</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-green-300 inline-block"></span>
              <span className="text-gray-500 text-sm font-medium">기초지수</span>
            </div>
            <span className="text-base">-1.62%(1,312.62pt)</span>
          </div>
        </div>
        
        <hr className="border-0 border-gray-200 mb-32" />

        {/* 기간별 수익률 테이블 (카드 내부, 그래프 아래) */}
        <div className="mt-16">
          <div className="text-2xl font-semibold mb-4">기간별 수익률</div>
          <hr className="border-b-2 border-gray-200 mb-10" />
          <div className="flex w-full justify-end mb-2">
            {/* <span className="text-sm text-gray-400">• 기준일 : 25. 7. 11</span> */}
            <span className="text-sm text-gray-400">단위(%)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-center border-separate border-spacing-0">
              <thead>
                <tr className="bg-[#F6F7F9] text-gray-500 text-base">
                  <th className="py-3 px-4 font-medium border-b border-gray-200">종목명</th>
                  <th className="py-3 px-4 font-medium border-b border-gray-200">1개월</th>
                  <th className="py-3 px-4 font-medium border-b border-gray-200">3개월</th>
                  <th className="py-3 px-4 font-medium border-b border-gray-200">6개월</th>
                  <th className="py-3 px-4 font-medium border-b border-gray-200">1년</th>
                  <th className="py-3 px-4 font-medium border-b border-gray-200">3년</th>
                  <th className="py-3 px-4 font-medium border-b border-gray-200">5년</th>
                  <th className="py-3 px-4 font-medium border-b border-gray-200">연초이후</th>
                  <th className="py-3 px-4 font-medium border-b border-gray-200">상장이후</th>
                </tr>
              </thead>
              <tbody className="text-base">
                <tr>
                  <td className="py-3 px-4 border-b border-gray-100">NAV</td>
                  <td className="py-3 px-4 border-b border-gray-100 text-red-500">0.96</td>
                  <td className="py-3 px-4 border-b border-gray-100 text-red-500">5.51</td>
                  <td className="py-3 px-4 border-b border-gray-100 text-red-500">9.10</td>
                  <td className="py-3 px-4 border-b border-gray-100 text-red-500">0.25</td>
                  <td className="py-3 px-4 border-b border-gray-100">-</td>
                  <td className="py-3 px-4 border-b border-gray-100">-</td>
                  <td className="py-3 px-4 border-b border-gray-100 text-red-500">10.40</td>
                  <td className="py-3 px-4 border-b border-gray-100 text-red-500">3.57</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border-b border-gray-100">기초지수</td>
                  <td className="py-3 px-4 border-b border-gray-100 text-blue-500">-0.31</td>
                  <td className="py-3 px-4 border-b border-gray-100 text-red-500">3.58</td>
                  <td className="py-3 px-4 border-b border-gray-100 text-red-500">6.26</td>
                  <td className="py-3 px-4 border-b border-gray-100 text-blue-500">-6.04</td>
                  <td className="py-3 px-4 border-b border-gray-100">-</td>
                  <td className="py-3 px-4 border-b border-gray-100">-</td>
                  <td className="py-3 px-4 border-b border-gray-100 text-red-500">7.74</td>
                  <td className="py-3 px-4 border-b border-gray-100 text-blue-500">-6.38</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border-b border-gray-100">시장가격(종가)</td>
                  <td className="py-3 px-4 border-b border-gray-100 text-red-500">0.21</td>
                  <td className="py-3 px-4 border-b border-gray-100 text-red-500">2.92</td>
                  <td className="py-3 px-4 border-b border-gray-100 text-red-500">3.59</td>
                  <td className="py-3 px-4 border-b border-gray-100 text-blue-500">-8.46</td>
                  <td className="py-3 px-4 border-b border-gray-100">-</td>
                  <td className="py-3 px-4 border-b border-gray-100">-</td>
                  <td className="py-3 px-4 border-b border-gray-100 text-red-500">4.96</td>
                  <td className="py-3 px-4 border-b border-gray-100 text-blue-500">-7.30</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ETFDetailYield; 