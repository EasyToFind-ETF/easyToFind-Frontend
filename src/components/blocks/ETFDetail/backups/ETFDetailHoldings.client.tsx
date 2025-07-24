'use client';

import React, { useState, useEffect } from 'react';
import { ResponsivePie } from '@nivo/pie';
import DatePicker from 'react-datepicker';
import { registerLocale } from 'react-datepicker';
import { ko } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { ETFHoldingsWithStock } from '@/types/etf';

// 한국어로 포맷팅
registerLocale('ko', ko);

interface ETFHoldingsData extends ETFHoldingsWithStock { }

// 캘린더 커스텀
const customDatePickerStyles = `
  .react-datepicker-wrapper {
    display: inline-block;
  }
  .react-datepicker__input-container input {
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    color: #374151;
    background-color: white;
    cursor: pointer;
    min-width: 120px;
  }
  .react-datepicker__input-container input:focus {
    outline: none;
    border-color: #0046ff;
    box-shadow: 0 0 0 3px rgba(0, 70, 255, 0.1);
  }
  .react-datepicker {
    font-family: inherit;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    z-index: 9999 !important;
    overflow: hidden;
  }
  .react-datepicker-popper {
    z-index: 9999 !important;
  }
  .react-datepicker__header {
    background-color: white;
    border-bottom: 1px solid #e5e7eb;
    border-radius: 8px 8px 0 0;
    padding: 16px;
  }
  .react-datepicker__current-month {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
  }
  .react-datepicker__day-name {
    color: #6b7280;
    font-weight: 500;
    width: 36px;
    height: 36px;
    line-height: 36px;
    margin: 2px;
  }
  .react-datepicker__day {
    width: 36px;
    height: 36px;
    line-height: 36px;
    margin: 2px;
    border-radius: 50%;
    color: #374151;
  }
  .react-datepicker__day:hover {
    background-color: #f3f4f6;
  }
  .react-datepicker__day--selected {
    background-color: #0046ff !important;
    color: white !important;
  }
  .react-datepicker__day--keyboard-selected {
    background-color: #0046ff !important;
    color: white !important;
  }
  .react-datepicker__day--outside-month {
    color: #d1d5db;
  }
  .react-datepicker__day--disabled {
    color: #d1d5db !important;
    background-color: #f9fafb !important;
  }
  .react-datepicker__day--disabled:hover {
    background-color: #f9fafb !important;
  }
  .react-datepicker__day--today {
    font-weight: 600 !important;
    color: #0046ff !important;
  }
  .react-datepicker__day--today.react-datepicker__day--selected {
    color: white !important;
  }
  .react-datepicker__navigation {
    top: 16px;
  }
  .react-datepicker__navigation-icon::before {
    border-color: #6b7280;
  }
`;

interface ETFDetailHoldingsProps {
  etf_code: string;
}

const ETFDetailHoldings: React.FC<ETFDetailHoldingsProps> = ({ etf_code }) => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [holdingsData, setHoldingsData] = useState<ETFHoldingsData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    // 날짜를 YYYY-MM-DD 형식으로 변환
    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // ETF 구성종목 데이터 가져오기
    const fetchHoldingsData = async (date: Date) => {
        setLoading(true);
        setError(null);
        
        try {
            const formattedDate = formatDate(date);
            
            const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/etfs/${etf_code}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Response error text:', errorText);
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            const responseData = await response.json();
            
            if (responseData.status === 200 && responseData.data) {
                const etfData = responseData.data;
                
                if (etfData.holdings_data && Array.isArray(etfData.holdings_data)) {
                    setHoldingsData(etfData.holdings_data);
                } else {
                    setHoldingsData([]);
                }
            } else {
                setHoldingsData([]);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '데이터를 가져오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 날짜가 변경될 때마다 데이터 가져오기
    useEffect(() => {
        fetchHoldingsData(selectedDate);
    }, [selectedDate, etf_code]);

    // 파이 차트
    const getPieChartData = () => {
        if (!holdingsData.length) return [];
        
        // 상위 10개 종목만 리스트업, 나머지는 기타 그룹으로 묶어서 표시
        const topHoldings = holdingsData.slice(0, 10);
        const otherHoldings = holdingsData.slice(10);
        
        // stock_code 기반으로 중복된 종목코드 처리
        const stockCodeCount = new Map<string, number>();
        
        const pieData = topHoldings.map((holding, index) => {
            const stockCode = holding.stock_code || `종목${index + 1}`;
            const count = stockCodeCount.get(stockCode) || 0;
            stockCodeCount.set(stockCode, count + 1);
            
            // stock_code를 기반으로 uniqueId 생성
            const uniqueId = count === 0 ? stockCode : `${stockCode}_${count + 1}`;
            
            return {
                id: uniqueId,
                value: holding.weight_pct,
                color: getColorByIndex(index),
                stockCode: stockCode, // 원본 stock_code도 저장
            };
        });

        // 기타 종목이 있으면 추가
        if (otherHoldings.length > 0) {
            const otherWeight = otherHoldings.reduce((sum, holding) => sum + holding.weight_pct, 0);
            pieData.push({
                id: '기타',
                value: otherWeight,
                color: '#A8A8A8',
                stockCode: '기타',
            });
        }

        return pieData;
    };

    // 파이 차트 색상
    const colors = ['#4ECDC4', '#FF6B6B', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FFB6C1', '#98D8C8', '#F7DC6F', '#BB8FCE'];
    const getColorByIndex = (index: number) => colors[index % colors.length];

    const CustomInput = React.forwardRef<HTMLInputElement, any>(({ value, onClick }, ref) => (
        <div className="relative">
            <input
                ref={ref}
                value={value}
                onClick={onClick}
                readOnly
                className="pl-12 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer min-w-[140px] text-center"
                placeholder="날짜를 선택하세요"
            />
            <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
            </svg>
            <button
                onClick={onClick}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
                <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>
        </div>
    ));
    CustomInput.displayName = 'CustomInput';

    const pieChartData = getPieChartData();

    return (
        <>
            <style>{customDatePickerStyles}</style>
            <div id="holdings" className="mx-auto w-full flex-1 min-w-0 pl-10 py-14">
                <div className="bg-white rounded-3xl w-full px-16 py-16 shadow overflow-visible" style={{ borderRadius: '4rem' }}>
                <div>
                    <div className="text-2xl font-semibold mb-4">구성종목</div>
                        <hr className="border-b border-gray-200 mb-10" />
                        
                        {/* 캘린더 */}
                        <div className="flex justify-start mb-6">
                            <div className="flex items-center gap-3">
                                {/* <label className="text-sm font-medium text-gray-700 ml-2 mr-4 whitespace-nowrap">적용일</label>
                                <div className="relative">
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={(date: Date | null) => date && setSelectedDate(date)}
                                        dateFormat="yyyy.MM.dd"
                                        locale="ko"
                                        dateFormatCalendar="yyyy년 M월"
                                        maxDate={new Date()}
                                        customInput={<CustomInput />}
                                        showPopperArrow={false}
                                        popperPlacement="bottom-start"
                                    />
                                </div> */}
                            </div>
                        </div>
                        
                        {/* 파이 차트와 리스트 */}
                        {!loading && !error && pieChartData.length > 0 && (
                            <div className="flex justify-start mb-8 gap-8">
                                <div style={{ width: '500px', height: '400px' }}>
                                    <ResponsivePie
                                        data={pieChartData}
                                        margin={{ top: 20, right: 120, bottom: 20, left: 120 }}
                                        innerRadius={0.5}
                                        padAngle={0.7}
                                        cornerRadius={3}
                                        activeOuterRadiusOffset={8}
                                        colors={(d) => d.data.color}
                                        borderWidth={1}
                                        borderColor={{
                                            from: 'color',
                                            modifiers: [['darker', 0.2]]
                                        }}
                                        arcLinkLabelsSkipAngle={20}
                                        arcLinkLabelsDiagonalLength={8}
                                        arcLinkLabelsStraightLength={12}
                                        arcLinkLabelsTextColor="#333333"
                                        arcLinkLabelsThickness={2}
                                        arcLinkLabelsColor={{ from: 'color' }}
                                        arcLinkLabel={(d) => {
                                            if (d.data.value < 5) return '';
                                            if (d.data.id === '기타') return '기타';
                                            
                                            // stockCode를 사용해서 종목명 찾기
                                            const stockCode = (d.data as any).stockCode || d.data.id.split('_')[0];
                                            const holding = holdingsData.find(h => h.stock_code === stockCode);
                                            return holding?.stock_name || d.data.id;
                                        }}
                                        arcLabelsSkipAngle={0}
                                        arcLabelsTextColor={{
                                            from: 'color',
                                            modifiers: [['darker', 2]]
                                        }}
                                        arcLabel={(d) => {
                                            return d.data.value >= 5 ? `${d.data.value.toFixed(2)}%` : '';
                                        }}
                                        tooltip={({ datum }) => {
                                            if (datum.id === '기타') {
                                                return (
                                                    <div style={{
                                                        background: 'white',
                                                        padding: '5px 10px',
                                                        border: '1px solid #ccc',
                                                        borderRadius: '4px',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                    }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <div 
                                                                style={{ 
                                                                    width: '12px', 
                                                                    height: '12px', 
                                                                    backgroundColor: datum.color,
                                                                    borderRadius: '2px'
                                                                }}
                                                            />
                                                            <span style={{ whiteSpace: 'nowrap' }}><strong>기타</strong>: {datum.value.toFixed(2)}%</span>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            
                                            // stockCode를 사용해서 종목명 찾기
                                            const stockCode = (datum.data as any).stockCode || (typeof datum.id === 'string' ? datum.id.split('_')[0] : datum.id);
                                            const holding = holdingsData.find(h => h.stock_code === stockCode);
                                            const stockName = holding?.stock_name || datum.id;
                                            
                                            return (
                                                <div style={{
                                                    background: 'white',
                                                    padding: '9px 12px',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '4px',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <div 
                                                            style={{ 
                                                                width: '12px', 
                                                                height: '12px', 
                                                                backgroundColor: datum.color,
                                                                borderRadius: '2px'
                                                            }}
                                                        />
                                                        <span style={{ whiteSpace: 'nowrap' }}><strong>{stockName}</strong>: {datum.value.toFixed(2)}%</span>
                                                    </div>
                                                </div>
                                            );
                                        }}
                                    />
                                </div>
                                
                                {/* 항목 리스트 */}
                                <div className="flex-1">
                                    <div className="text-base font-medium text-gray-700 whitespace-nowrap text-left ml-10 mb-8">구성종목 Top 10</div>
                                    <div className="space-y-3 ml-6">
                                        {pieChartData.filter(item => item.id !== '기타').map((item, index) => {
                                            // stockCode를 사용해서 종목명 찾기
                                            const stockCode = (item as any).stockCode || item.id.split('_')[0];
                                            const holding = holdingsData.find(h => h.stock_code === stockCode);
                                            return (
                                                <div key={`${item.id}-${index}`} className="flex items-center gap-3">
                                                    <div 
                                                        className="w-4 h-4 rounded-full" 
                                                        style={{ backgroundColor: item.color }}
                                                    ></div>
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {holding?.stock_name || item.id}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* 구성종목 상세 표 */}
                    {!loading && !error && (
                        <div className="mt-20">
                            <div className="text-2xl font-semibold mb-4">구성종목 상세</div>
                            <hr className="border-b border-gray-200 mb-10" />
                            {holdingsData.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-center border-separate border-spacing-0">
                                        <thead>
                                            <tr className="bg-[#F6F7F9] text-gray-500 text-base">
                                                <th className="py-3 px-4 font-medium border-b border-gray-200">순번</th>
                                                <th className="py-3 px-4 font-medium border-b border-gray-200">종목명</th>
                                                <th className="py-3 px-4 font-medium border-b border-gray-200">종목코드</th>
                                                <th className="py-3 px-4 font-medium border-b border-gray-200">비중(%)</th>
                                                {/* <th className="py-3 px-4 font-medium border-b border-gray-200">수량</th>
                                                <th className="py-3 px-4 font-medium border-b border-gray-200">평가금액(원)</th> */}
                                            </tr>
                                        </thead>
                                        <tbody className="text-base">
                                            {holdingsData.map((holding, index) => (
                                                <tr key={`${holding.holdings_id || holding.stock_code || holding.stock_name}-${index}`}>
                                                    <td className="py-3 px-4 border-b border-gray-100">
                                                        {index + 1}
                                                    </td>
                                                    <td className="py-3 px-4 border-b border-gray-100">
                                                        {holding.stock_name || '-'}
                                                    </td>
                                                    <td className="py-3 px-4 border-b border-gray-100">
                                                        {holding.stock_code || '-'}
                                                    </td>
                                                    <td className="py-3 px-4 border-b border-gray-100">
                                                        {holding.weight_pct ? `${holding.weight_pct.toFixed(2)}` : '-'}
                                                    </td>
                                                    {/* <td className="py-3 px-4 border-b border-gray-100">
                                                        {holding.shares ? formatNumber(holding.shares) : '-'}
                                                    </td>
                                                    <td className="py-3 px-4 border-b border-gray-100">
                                                        {holding.market_value ? formatNumber(holding.market_value) : '-'}
                                                    </td> */}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    선택한 날짜에 해당하는 구성종목 데이터가 없습니다.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ETFDetailHoldings;