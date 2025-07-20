'use client';

import React, { useState, useEffect } from 'react';
import { ETFPricesDaily } from '@/types/etf';

interface ETFDetailStandardPriceProps {
  etf_code: string;
}

const ETFDetailStandardPrice: React.FC<ETFDetailStandardPriceProps> = ({ etf_code }) => {
  const [priceData, setPriceData] = useState<ETFPricesDaily[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 최근 7일간 가격 데이터 가져오기
  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/etfs/${etf_code}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.status === 200 && result.data) {
          // daily_prices 배열에서 최근 8일 데이터 가져오기
          if (result.data.daily_prices && result.data.daily_prices.length > 0) {
            const recentData = result.data.daily_prices.slice(0, 8); // 7일 아니고 8일임!!!
            setPriceData(recentData);
          } else if (result.data.new_prices_daily) {
            // new_prices_daily가 배열인 경우
            if (Array.isArray(result.data.new_prices_daily)) {
              const recentData = result.data.new_prices_daily.slice(0, 8);
              setPriceData(recentData);
            } else {
              // 단일 객체인 경우 배열로 변환
              setPriceData([result.data.new_prices_daily]);
            }
          } else {
            setPriceData([]);
          }
        } else {
          setError('가격 데이터를 불러올 수 없습니다.');
        }
      } catch (err) {
        setError('데이터 로딩 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPriceData();
  }, [etf_code]);

  // 등락률 색상 선택
  const getChangeColor = (value: number | string | null): string => {
    if (value === null || value === undefined) return 'text-gray-500';
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(numValue)) return 'text-gray-500';
    
    return numValue >= 0 ? 'text-red-500' : 'text-blue-500';
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string): string => {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        return dateString;
      }
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      const formattedDate = `${year}.${month}.${day}`;
      
      return formattedDate;
    } catch (error) {
      return dateString;
    }
  };

  // 숫자 포맷팅
  const formatNumber = (value: number | string | null): string => {
    if (value === null || value === undefined) return '-';
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(numValue)) return '-';
    
    return numValue.toLocaleString();
  };

  // 등락률 계산(전일 대비)
  const calculateChangeRate = (current: number | string | null, previous: number | string | null): string => {
   if (current === null || previous === null) {
      return '-';
    }
    
    const currentNum = typeof current === 'string' ? parseFloat(current) : current;
    const previousNum = typeof previous === 'string' ? parseFloat(previous) : previous;
    
    if (isNaN(currentNum) || isNaN(previousNum) || previousNum === 0) {
      return '-';
    }
    
    const changeRate = ((currentNum - previousNum) / previousNum) * 100;
    const result = changeRate.toFixed(2);
    
    return result;
  };

  return (
    <div id="standard-price" className="mx-auto w-full flex-1 min-w-0 pl-10 pt-10">
      <div className="bg-white rounded-3xl w-full px-16 py-16 shadow" style={{ borderRadius: '4rem' }}>
        <div>
          <div className="text-2xl font-semibold mb-4">기준가격</div>
          <hr className="border-b border-gray-200 mb-10" />

          {/* 데이터 테이블 */}
          {!loading && !error && priceData.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-center border-separate border-spacing-0">
                <thead>
                  <tr className="bg-[#F6F7F9] text-gray-500 text-base">
                    <th className="py-3 px-4 font-medium border-b border-gray-200" rowSpan={2}>일자</th>
                    <th className="py-3 px-4 font-medium border-b border-gray-200" colSpan={2}>시장가격(원)</th>
                    <th className="py-3 px-4 font-medium border-b border-gray-200" colSpan={2}>기초지수(원)</th>
                  </tr>
                  <tr className="bg-[#F6F7F9] text-gray-500 text-base">
                    <th className="py-3 px-4 font-medium border-b border-gray-200">종가</th>
                    <th className="py-3 px-4 font-medium border-b border-gray-200">등락률(%)</th>
                    <th className="py-3 px-4 font-medium border-b border-gray-200">종가</th>
                    <th className="py-3 px-4 font-medium border-b border-gray-200">등락률(%)</th>
                  </tr>
                </thead>
                <tbody className="text-base">
                  {priceData.slice(0, 7).map((data, index) => {
                    // 데이터 날짜순으로 정렬되어 있음, 이전 날짜 데이터 사용
                    const previousData = index < priceData.length - 1 ? priceData[index + 1] : null;
                    
                    // 시장가격 등락률
                    const marketChangeRate = calculateChangeRate(
                      data.close_price,
                      previousData?.close_price || null
                    );
                    
                    // 기초지수 등락률
                    const indexChangeRate = calculateChangeRate(
                      data.obj_stk_prc_idx,
                      previousData?.obj_stk_prc_idx || null
                    );

                    return (
                      <tr key={data.trade_date || index}>
                        <td className="py-3 px-4 border-b border-gray-100">
                          {data.trade_date ? formatDate(data.trade_date) : '-'}
                        </td>
                        <td className="py-3 px-4 border-b border-gray-100">
                          {formatNumber(data.close_price)}
                        </td>
                        <td className={`py-3 px-4 border-b border-gray-100 ${getChangeColor(marketChangeRate)}`}>
                          {marketChangeRate !== '-' ? marketChangeRate : '-'}
                        </td>
                        <td className="py-3 px-4 border-b border-gray-100">
                          {formatNumber(data.obj_stk_prc_idx)}
                        </td>
                        <td className={`py-3 px-4 border-b border-gray-100 ${getChangeColor(indexChangeRate)}`}>
                          {indexChangeRate !== '-' ? indexChangeRate : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ETFDetailStandardPrice;