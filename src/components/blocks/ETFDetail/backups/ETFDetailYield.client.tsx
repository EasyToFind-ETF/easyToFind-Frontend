
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createChart, LineSeries } from 'lightweight-charts';
import dayjs from 'dayjs';
import { ETFReturnCache, ETFPricesDaily } from '@/types/etf';

const periods = [
  '1주', '1개월', '3개월', '6개월', '1년', '3년', '5년'
];

interface ETFDetailYieldProps {
  etf_code: string;
}

const ETFDetailYield: React.FC<ETFDetailYieldProps> = ({ etf_code }) => {
  const [activePeriod, setActivePeriod] = useState('1주');
  const [returnsData, setReturnsData] = useState<ETFReturnCache | null>(null);
  const [dailyPriceData, setDailyPriceData] = useState<ETFPricesDaily[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredValues, setHoveredValues] = useState<{
    nav: { return: number; price: number };
    market: { return: number; price: number };
    index: { return: number; price: number };
  }>({
    nav: { return: -1.76, price: 4634.78 },
    market: { return: -2.63, price: 4625 },
    index: { return: -1.62, price: 1312.62 }
  });
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  // 수익률 데이터 가져오기
  const fetchReturnsData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/etfs/${etf_code}`, {
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
        if (result.data.yield_data) {
          setReturnsData(result.data.yield_data);
        }
        
        // daily_price 데이터 처리
        if (result.data.daily_prices && result.data.daily_prices.length > 0) {
          const sortedData = result.data.daily_prices.sort((a: ETFPricesDaily, b: ETFPricesDaily) => {
            return dayjs(b.trade_date).valueOf() - dayjs(a.trade_date).valueOf();
          });
          setDailyPriceData(sortedData);
        } else if (result.data.new_prices_daily) {
          if (Array.isArray(result.data.new_prices_daily)) {
            const sortedData = result.data.new_prices_daily.sort((a: ETFPricesDaily, b: ETFPricesDaily) => {
              return dayjs(b.trade_date).valueOf() - dayjs(a.trade_date).valueOf();
            });
            setDailyPriceData(sortedData);
          } else {
            setDailyPriceData([result.data.new_prices_daily]);
          }
        }
      } else {
        setError('수익률 데이터를 불러올 수 없습니다.');
      }
    } catch (err) {
      setError('데이터 로딩 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturnsData();
  }, [etf_code]);

  // 차트 초기화
  useEffect(() => {
    if (!chartContainerRef.current || !dailyPriceData.length) return;

    // 기존 차트 안전하게 제거
    if (chartRef.current) {
      try {
        chartRef.current.remove();
      } catch (error) {
        // 차트가 이미 제거된 경우 무시
        console.log('Chart already removed');
      }
      chartRef.current = null;
    }

    // 차트 생성
    const chart = createChart(chartContainerRef.current, {
      layout: {
        textColor: '#D1D5DB',
        background: { type: 'solid' as any, color: '#1F2937' },
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      },
      grid: {
        vertLines: { color: '#374151', style: 1 },
        horzLines: { color: '#374151', style: 1 },
      },
      width: chartContainerRef.current.clientWidth,
      height: 350,
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#6B7280',
          width: 1,
          style: 3,
          labelBackgroundColor: '#1F2937',
        },
        horzLine: {
          color: '#6B7280',
          width: 1,
          style: 3,
          labelBackgroundColor: '#1F2937',
        },
      },
      rightPriceScale: {
        visible: false,
      },
      leftPriceScale: {
        visible: true,
        borderColor: '#374151',
        textColor: '#D1D5DB',
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      timeScale: {
        visible: true,
        borderColor: '#374151',
        timeVisible: false,
        secondsVisible: false,
        tickMarkFormatter: (time: number) => {
          return dayjs.unix(time).format('YYYY.MM.DD');
        },
      },
    });

    chartRef.current = chart;

    // 기간별 데이터 필터링 - 선택된 기간에 따라 정확히 해당 기간만 표시
    const now = dayjs();
    let daysToSubtract = 7; // 기본값 1주
    
    switch (activePeriod) {
      case '1주': daysToSubtract = 7; break;
      case '1개월': daysToSubtract = 30; break;
      case '3개월': daysToSubtract = 90; break;
      case '6개월': daysToSubtract = 180; break;
      case '1년': daysToSubtract = 365; break;
      case '3년': daysToSubtract = 1095; break;
      case '5년': daysToSubtract = 1825; break;
    }

    const startDate = now.subtract(daysToSubtract, 'day');
    
    // 선택된 기간에 해당하는 데이터만 필터링 (실제 거래일 데이터만 사용)
    const filteredData = dailyPriceData.filter(data => {
      const tradeDate = dayjs(data.trade_date);
      // 시작일 이후부터 현재까지의 데이터만 포함 (주말 제외된 실제 거래일)
      return tradeDate.isAfter(startDate.subtract(1, 'day')) && tradeDate.isBefore(now.add(1, 'day'));
    }).sort((a, b) => dayjs(a.trade_date).valueOf() - dayjs(b.trade_date).valueOf()); // 시간순 정렬

    if (filteredData.length === 0) return;

    // 기준가격 (첫 번째 데이터)
    const baseNav = typeof filteredData[0]?.nav_price === 'string' ? 
      parseFloat(filteredData[0].nav_price) : filteredData[0]?.nav_price || 1;
    const baseMarket = typeof filteredData[0]?.close_price === 'string' ? 
      parseFloat(filteredData[0].close_price) : filteredData[0]?.close_price || 1;
    const baseIndex = typeof filteredData[0]?.obj_stk_prc_idx === 'string' ? 
      parseFloat(filteredData[0].obj_stk_prc_idx) : filteredData[0]?.obj_stk_prc_idx || 1;

    // 데이터 포맷 변환 (실제 거래일 데이터만 사용, 실제 날짜 사용)
    const navData = filteredData.map((data, index) => {
      const currentNav = typeof data.nav_price === 'string' ? parseFloat(data.nav_price) : data.nav_price;
      const returnRate = ((currentNav - baseNav) / baseNav) * 100;
      return {
        time: dayjs(data.trade_date).unix() as any,
        value: returnRate
      };
    }).filter(item => !isNaN(item.value));

    const marketData = filteredData.map((data, index) => {
      const currentMarket = typeof data.close_price === 'string' ? parseFloat(data.close_price) : data.close_price;
      const returnRate = ((currentMarket - baseMarket) / baseMarket) * 100;
      return {
        time: dayjs(data.trade_date).unix() as any,
        value: returnRate
      };
    }).filter(item => !isNaN(item.value));

    const indexData = filteredData.map((data, index) => {
      const currentIndex = typeof data.obj_stk_prc_idx === 'string' ? parseFloat(data.obj_stk_prc_idx) : data.obj_stk_prc_idx;
      const returnRate = ((currentIndex - baseIndex) / baseIndex) * 100;
      return {
        time: dayjs(data.trade_date).unix() as any,
        value: returnRate
      };
    }).filter(item => !isNaN(item.value));

    // 고급 보간 함수 - 더 부드러운 곡선을 위한 스플라인 보간
    const advancedInterpolateData = (data: any[]) => {
      if (data.length <= 2) return data;
      
      const interpolated = [...data];
      
      // 1. 기본 보간 (0, -100, null, undefined, NaN 값 처리)
      for (let i = 1; i < interpolated.length - 1; i++) {
        const current = interpolated[i];
        const prev = interpolated[i - 1];
        const next = interpolated[i + 1];
        
        if (current.value === 0 || current.value === -100 || current.value === null || current.value === undefined || isNaN(current.value)) {
          if (prev && next && 
              prev.value !== 0 && prev.value !== -100 && prev.value !== null && prev.value !== undefined && !isNaN(prev.value) &&
              next.value !== 0 && next.value !== -100 && next.value !== null && next.value !== undefined && !isNaN(next.value)) {
            interpolated[i].value = (prev.value + next.value) / 2;
          } else if (prev && prev.value !== 0 && prev.value !== -100 && prev.value !== null && prev.value !== undefined && !isNaN(prev.value)) {
            interpolated[i].value = prev.value;
          } else if (next && next.value !== 0 && next.value !== -100 && next.value !== null && next.value !== undefined && !isNaN(next.value)) {
            interpolated[i].value = next.value;
          }
        }
      }
      
      // 2. 스무딩 (이웃 값들의 가중 평균으로 부드럽게)
      const smoothed = [...interpolated];
      for (let i = 1; i < smoothed.length - 1; i++) {
        const prev = smoothed[i - 1];
        const current = smoothed[i];
        const next = smoothed[i + 1];
        
        if (prev && current && next && 
            !isNaN(prev.value) && !isNaN(current.value) && !isNaN(next.value)) {
          // 가중 평균으로 부드럽게 (현재 값에 더 높은 가중치)
          smoothed[i].value = (prev.value * 0.25 + current.value * 0.5 + next.value * 0.25);
        }
      }
      
      return smoothed;
    };

    // 고급 보간 적용
    const interpolatedNavData = advancedInterpolateData(navData);
    const interpolatedMarketData = advancedInterpolateData(marketData);
    const interpolatedIndexData = advancedInterpolateData(indexData);

    // 그래프 3개 사용
    const navSeries = chart.addSeries(LineSeries, { 
      color: '#EF4444',
      lineWidth: 2,
      title: 'NAV',
      priceLineVisible: true,
      priceLineColor: '#EF4444',
      priceLineWidth: 1,
      priceLineStyle: 3,
      lastValueVisible: true,
      priceFormat: {
        type: 'price',
        precision: 2,
        minMove: 0.01,
      },
    });

    const marketSeries = chart.addSeries(LineSeries, { 
      color: '#3B82F6',
      lineWidth: 2,
      title: '시장가격',
      priceLineVisible: true,
      priceLineColor: '#3B82F6',
      priceLineWidth: 1,
      priceLineStyle: 3,
      lastValueVisible: true,
      priceFormat: {
        type: 'price',
        precision: 2,
        minMove: 0.01,
      },
    });

    const indexSeries = chart.addSeries(LineSeries, { 
      color: '#10B981',
      lineWidth: 2,
      title: '기초지수',
      priceLineVisible: true,
      priceLineColor: '#10B981',
      priceLineWidth: 1,
      priceLineStyle: 3,
      lastValueVisible: true,
      priceFormat: {
        type: 'price',
        precision: 2,
        minMove: 0.01,
      },
    });

    // 데이터 설정
    navSeries.setData(interpolatedNavData);
    marketSeries.setData(interpolatedMarketData);
    indexSeries.setData(interpolatedIndexData);

    // 차트 크기 조정
    chart.timeScale().fitContent();

    // Hover 이벤트 처리
    chart.subscribeCrosshairMove((param) => {
      if (param.time) {
        // 해당 날짜의 실제 데이터 찾기
        const hoverDate = dayjs.unix(param.time as number);
        const actualData = filteredData.find(data => 
          dayjs(data.trade_date).format('YYYY-MM-DD') === hoverDate.format('YYYY-MM-DD')
        );
        
        if (actualData) {
          const navPrice = typeof actualData.nav_price === 'string' ? parseFloat(actualData.nav_price) : actualData.nav_price;
          const marketPrice = typeof actualData.close_price === 'string' ? parseFloat(actualData.close_price) : actualData.close_price;
          const indexPrice = typeof actualData.obj_stk_prc_idx === 'string' ? parseFloat(actualData.obj_stk_prc_idx) : actualData.obj_stk_prc_idx;
          
          // 기준가격 대비 수익률 계산
          const baseNav = typeof filteredData[0]?.nav_price === 'string' ? parseFloat(filteredData[0].nav_price) : filteredData[0]?.nav_price || 1;
          const baseMarket = typeof filteredData[0]?.close_price === 'string' ? parseFloat(filteredData[0].close_price) : filteredData[0]?.close_price || 1;
          const baseIndex = typeof filteredData[0]?.obj_stk_prc_idx === 'string' ? parseFloat(filteredData[0].obj_stk_prc_idx) : filteredData[0]?.obj_stk_prc_idx || 1;
          
          const navReturn = ((navPrice - baseNav) / baseNav) * 100;
          const marketReturn = ((marketPrice - baseMarket) / baseMarket) * 100;
          const indexReturn = ((indexPrice - baseIndex) / baseIndex) * 100;
          
          setHoveredValues({
            nav: { return: navReturn, price: navPrice || 0 },
            market: { return: marketReturn, price: marketPrice || 0 },
            index: { return: indexReturn, price: indexPrice || 0 }
          });
        }
      } else {
        // hover가 해제되면 기본값으로 복원
        setHoveredValues({
          nav: { return: -1.76, price: 4634.78 },
          market: { return: -2.63, price: 4625 },
          index: { return: -1.62, price: 1312.62 }
        });
      }
    });

    // 반응형 처리
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        try {
          chartRef.current.remove();
        } catch (error) {
          // 차트가 이미 제거된 경우 무시
        }
        chartRef.current = null;
      }
    };
  }, [dailyPriceData, activePeriod]);

  // 특정 날짜에 가장 가까운 거래 데이터 찾기
  const findClosestTradeData = (targetDate: dayjs.Dayjs): ETFPricesDaily | null => {
    if (!dailyPriceData || dailyPriceData.length === 0) return null;
    
    const targetDateStr = targetDate.format('YYYY-MM-DD');
    
    for (const data of dailyPriceData) {
      const tradeDate = dayjs(data.trade_date);
      const tradeDateStr = tradeDate.format('YYYY-MM-DD');
      
      if (tradeDateStr <= targetDateStr) {
        return data;
      }
    }
    
    return null;
  };

  // 수익률 계산 함수 (통합)
  const calculateReturn = (period: string, dataType: 'nav' | 'market' | 'index'): number | null => {
    if (!dailyPriceData || dailyPriceData.length === 0) return null;
    
    const now = dayjs();
    let targetDate: dayjs.Dayjs;
    
    switch (period) {
      case '1주': targetDate = now.subtract(1, 'week'); break;
      case '1개월': targetDate = now.subtract(1, 'month'); break;
      case '3개월': targetDate = now.subtract(3, 'month'); break;
      case '6개월': targetDate = now.subtract(6, 'month'); break;
      case '1년': targetDate = now.subtract(1, 'year'); break;
      case '3년': targetDate = now.subtract(3, 'year'); break;
      case '5년': targetDate = now.subtract(5, 'year'); break;
      default: return null;
    }
    
    const targetData = findClosestTradeData(targetDate);
    if (!targetData) return null;
    
    let currentValue: number | string;
    let targetValue: number | string;
    
    switch (dataType) {
      case 'nav':
        if (!targetData.nav_price || !dailyPriceData[0]?.nav_price) return null;
        currentValue = dailyPriceData[0].nav_price;
        targetValue = targetData.nav_price;
        break;
      case 'market':
        if (!targetData.close_price || !dailyPriceData[0]?.close_price) return null;
        currentValue = dailyPriceData[0].close_price;
        targetValue = targetData.close_price;
        break;
      case 'index':
        if (!targetData.obj_stk_prc_idx || !dailyPriceData[0]?.obj_stk_prc_idx) return null;
        currentValue = dailyPriceData[0].obj_stk_prc_idx;
        targetValue = targetData.obj_stk_prc_idx;
        break;
      default:
        return null;
    }
    
    const currentNum = typeof currentValue === 'string' ? parseFloat(currentValue) : currentValue;
    const targetNum = typeof targetValue === 'string' ? parseFloat(targetValue) : targetValue;
    
    if (isNaN(currentNum) || isNaN(targetNum) || targetNum === 0) return null;
    
    return ((currentNum - targetNum) / targetNum) * 100;
  };

  // 수익률 포맷팅
  const formatReturn = (value: number | string | null): string => {
    if (value === null || value === undefined || value === '') return '-';
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '-';
    
    return numValue.toFixed(2);
  };

  // 수익률 색상 결정
  const getReturnColor = (value: number | string | null): string => {
    if (value === null || value === undefined) return 'text-gray-500';
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return 'text-gray-500';
    
    return numValue >= 0 ? 'text-red-500' : 'text-blue-500';
  };

  // 테이블 렌더링
  const renderTableRow = (label: string, dataType: 'nav' | 'market' | 'index') => (
    <tr>
      <td className="py-3 px-4 border-b border-gray-100">{label}</td>
      <td className={`py-3 px-4 border-b border-gray-100 ${getReturnColor(calculateReturn('1개월', dataType))}`}>
        {formatReturn(calculateReturn('1개월', dataType))}
      </td>
      <td className={`py-3 px-4 border-b border-gray-100 ${getReturnColor(calculateReturn('3개월', dataType))}`}>
        {formatReturn(calculateReturn('3개월', dataType))}
      </td>
      <td className={`py-3 px-4 border-b border-gray-100 ${getReturnColor(calculateReturn('6개월', dataType))}`}>
        {formatReturn(calculateReturn('6개월', dataType))}
      </td>
      <td className={`py-3 px-4 border-b border-gray-100 ${getReturnColor(calculateReturn('1년', dataType))}`}>
        {formatReturn(calculateReturn('1년', dataType))}
      </td>
      <td className={`py-3 px-4 border-b border-gray-100 ${getReturnColor(calculateReturn('3년', dataType))}`}>
        {formatReturn(calculateReturn('3년', dataType))}
      </td>
      <td className={`py-3 px-4 border-b border-gray-100 ${getReturnColor(calculateReturn('5년', dataType))}`}>
        {formatReturn(calculateReturn('5년', dataType))}
      </td>
    </tr>
  );

  return (
    <div id="yield" className="mx-auto w-full flex-1 min-w-0 pl-10 pt-10">
      <div className="bg-white rounded-3xl w-full px-16 py-16 shadow" style={{ borderRadius: '4rem' }}>
        {/* 타이틀, 구분선, 기준일 */}
        <div>
          <div className="text-2xl font-semibold mb-4">수익률</div>
          <hr className="border-b border-gray-200 mb-10" />
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4 w-full">
              <span className="text-sm font-medium text-gray-700 ml-2 mr-4 whitespace-nowrap">적용기간</span>
              <div className="flex bg-[#F6F7F9] rounded-2xl p-1 w-full">
                {periods.map((period) => (
                  <button
                    key={period}
                    onClick={() => setActivePeriod(period)}
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

        {/* Lightweight Charts 그래프 */}
        {!loading && !error && dailyPriceData.length > 0 ? (
          <div className="w-full h-[350px] bg-white rounded-2xl mb-8 border border-gray-100 shadow-sm overflow-hidden">
            <div ref={chartContainerRef} className="w-full h-full" />
          </div>
        ) : (
          <div className="w-full h-[350px] bg-[#FAFAFA] rounded-2xl flex items-center justify-center mb-8 border border-dashed border-gray-200">
            <span className="text-gray-400">({activePeriod} 그래프 자리)</span>
          </div>
        )}

        {/* 범례 */}
        <div className="flex gap-20 bg-[#F6F7F9] rounded-2xl px-4 py-4 text-base items-center justify-center">
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-red-400 inline-block"></span>
              <span className="text-gray-500 text-sm font-medium">기준가격(NAV)</span>
            </div>
            <span className="text-base">{`${hoveredValues.nav.return.toFixed(2)}%(${hoveredValues.nav.price.toLocaleString()}원)`}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-cyan-400 inline-block"></span>
              <span className="text-gray-500 text-sm font-medium">시장가격(종가)</span>
            </div>
            <span className="text-base">{`${hoveredValues.market.return.toFixed(2)}%(${hoveredValues.market.price.toLocaleString()}원)`}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-green-300 inline-block"></span>
              <span className="text-gray-500 text-sm font-medium">기초지수</span>
            </div>
            <span className="text-base">{`${hoveredValues.index.return.toFixed(2)}%(${hoveredValues.index.price.toLocaleString()}pt)`}</span>
          </div>
        </div>
        
        {/* 기간별 수익률 제목과 hr을 카드 바깥으로 이동 */}
        <div className="mt-16">
          <div className="text-2xl font-semibold mb-4">기간별 수익률</div>
          <hr className="border-b border-gray-200 mb-10" />
          {/* 카드 시작 */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex w-full justify-end mb-2">
              <span className="text-sm text-gray-400">단위(%)</span>
            </div>
            {/* 데이터 테이블 */}
            {!loading && !error && returnsData && (
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
                    </tr>
                  </thead>
                  <tbody className="text-base">
                    {renderTableRow('NAV', 'nav')}
                    {renderTableRow('시장가격(종가)', 'market')}
                    {renderTableRow('기초지수', 'index')}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ETFDetailYield; 
