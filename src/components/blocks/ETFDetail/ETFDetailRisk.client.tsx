'use client';

import React, { useState } from 'react';
import { ResponsivePie } from '@nivo/pie';

const riskPeriods = [
  '1개월', '3개월', '6개월', '1년', '3년'
];

const ETFDetailRisk: React.FC = () => {
  const [activeRiskPeriod, setActiveRiskPeriod] = useState('1개월');

  // 위험도
  const riskValue = 2;
  const riskLabel = "높은 위험";
  const riskPercent = ((5 - riskValue + 1) / 5) * 100;

  const riskPieData = [
    { id: 'risk', value: riskPercent, color: '#FF5A3D' },
    { id: 'empty', value: 100 - riskPercent, color: '#F5F5F5' },
  ];

  return (
    <div id="risk" className="mx-auto w-full flex-1 min-w-0 pl-10 pt-10">
      <div className="bg-white rounded-3xl w-full px-16 py-16 shadow" style={{ borderRadius: '4rem' }}>
        <div>
          <div className="text-2xl font-semibold mb-4">위험도</div>
          <hr className="border-b-2 border-gray-200 mb-10" />
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4 w-full">
              <span className="font-semibold ml-2 mr-4 whitespace-nowrap">적용기간</span>
              <div className="flex bg-[#F6F7F9] rounded-2xl p-1 w-full">
                {riskPeriods.map((riskPeriod) => (
                  <button
                    key={riskPeriod}
                    onClick={() => setActiveRiskPeriod(riskPeriod)}
                    className={`flex-1 px-4 py-2 rounded-2xl text-sm font-medium transition-colors duration-150 border ${
                      activeRiskPeriod === riskPeriod
                        ? 'bg-white'
                        : 'border-transparent text-gray-500'
                    }`}
                    style={activeRiskPeriod === riskPeriod ? { borderColor: '#0046ff', color: '#0046ff', fontWeight: 'semibold' } : {}}
                  >
                    {riskPeriod}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-16 mt-10">
            {[0, 1, 2].map((idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div style={{ width: 200, height: 200, margin: "0 auto" }}>
                  <ResponsivePie
                    data={riskPieData}
                    innerRadius={0.8}
                    padAngle={2}
                    cornerRadius={45}
                    enableArcLabels={false}
                    enableArcLinkLabels={false}
                    colors={({ data }) => data.color}
                    borderWidth={0}
                    isInteractive={false}
                    animate={false}
                    margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                    layers={[
                      'arcs',
                      ({ centerX, centerY }) => (
                        <>
                          <text
                            x={centerX}
                            y={centerY - 16}
                            textAnchor="middle"
                            dominantBaseline="central"
                            style={{ fontSize: 40, fill: "#FF5A3D", fontWeight: 600 }}
                          >
                            {riskValue}
                          </text>
                          <text
                            x={centerX}
                            y={centerY + 24}
                            textAnchor="middle"
                            dominantBaseline="central"
                            style={{ fontSize: 16, fill: "#FF5A3D", fontWeight: 600 }}
                          >
                            {riskLabel}
                          </text>
                        </>
                      ),
                    ]}
                  />
                </div>
                <div className="mt-4 text-base font-semibold">투자위험</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ETFDetailRisk;