'use client';

import React from 'react';
import { ResponsivePie } from '@nivo/pie';

const ETFDetailHoldings: React.FC = () => {
    // 10개 구성종목 데이터
    const holdingsData = [
        { id: '원화예금', value: 22.9, color: '#3B82F6' },
        { id: '삼성증권', value: 22.79, color: '#F59E0B' },
        { id: '대신증권', value: 18.39, color: '#06B6D4' },
        { id: '유안타증권', value: 12.28, color: '#10B981' },
        { id: '한국금융지주', value: 11.68, color: '#8B5CF6' },
        { id: '키움증권', value: 3.2, color: '#0EA5E9' },
        { id: '한화투자증권', value: 2.89, color: '#2563EB' },
        { id: '유진투자증권', value: 2.63, color: '#F97316' },
        { id: '미래에셋증권', value: 1.29, color: '#84CC16' },
        { id: 'NH투자증권', value: 0.99, color: '#EC4899' },
    ];

    return (
        <div id="holdings" className="mx-auto w-full flex-1 min-w-0 pl-10 pt-14">
            <div className="bg-white rounded-3xl w-full px-16 py-16 shadow" style={{ borderRadius: '4rem' }}>
                <div>
                    <div className="text-2xl font-semibold mb-4">구성종목</div>
                    <hr className="border-b-2 border-gray-200 mb-10" />
                    
                    {/* 파이 차트 */}
                    <div className="flex justify-center mb-8">
                        <div style={{ width: '400px', height: '400px' }}>
                            <ResponsivePie
                                data={holdingsData}
                                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                                innerRadius={0.5}
                                padAngle={0.7}
                                cornerRadius={3}
                                activeOuterRadiusOffset={8}
                                borderWidth={1}
                                borderColor={{
                                    from: 'color',
                                    modifiers: [['darker', 0.2]]
                                }}
                                arcLinkLabelsSkipAngle={10}
                                arcLinkLabelsTextColor="#333333"
                                arcLinkLabelsThickness={2}
                                arcLinkLabelsColor={{ from: 'color' }}
                                arcLabelsSkipAngle={10}
                                arcLabelsTextColor={{
                                    from: 'color',
                                    modifiers: [['darker', 2]]
                                }}
                                legends={[
                                    {
                                        anchor: 'bottom',
                                        direction: 'row',
                                        justify: false,
                                        translateX: 0,
                                        translateY: 56,
                                        itemsSpacing: 0,
                                        itemWidth: 100,
                                        itemHeight: 18,
                                        itemTextColor: '#999',
                                        itemDirection: 'left-to-right',
                                        itemOpacity: 1,
                                        symbolSize: 18,
                                        symbolShape: 'circle',
                                        effects: [
                                            {
                                                on: 'hover',
                                                style: {
                                                    itemTextColor: '#000'
                                                }
                                            }
                                        ]
                                    }
                                ]}
                            />
                        </div>
                    </div>

                    {/* <div className="grid grid-cols-3 gap-8 mt-8"> */}
                        {/* 첫 번째 열 */}
                        {/* <div className="space-y-3">
                            {holdingsData.slice(0, 4).map((item) => (
                                <div key={item.id} className="flex items-center gap-3">
                                    <div 
                                        className="w-4 h-4 rounded-full" 
                                        style={{ backgroundColor: item.color }}
                                    ></div>
                                    <span className="text-sm font-medium text-gray-700">{item.id}</span>
                                </div>
                            ))}
                        </div> */}
                        
                        {/* 두 번째 열 */}
                        {/* <div className="space-y-3">
                            {holdingsData.slice(4, 7).map((item) => (
                                <div key={item.id} className="flex items-center gap-3">
                                    <div 
                                        className="w-4 h-4 rounded-full" 
                                        style={{ backgroundColor: item.color }}
                                    ></div>
                                    <span className="text-sm font-medium text-gray-700">{item.id}</span>
                                </div>
                            ))}
                        </div> */}
                        
                        {/* 세 번째 열 */}
                        {/* <div className="space-y-3">
                            {holdingsData.slice(7, 10).map((item) => (
                                <div key={item.id} className="flex items-center gap-3">
                                    <div 
                                        className="w-4 h-4 rounded-full" 
                                        style={{ backgroundColor: item.color }}
                                    ></div>
                                    <span className="text-sm font-medium text-gray-700">{item.id}</span>
                                </div>
                            ))}
                        </div> */}
                    {/* </div> */}
                </div>
            </div>
        </div>
    );
};

export default ETFDetailHoldings;