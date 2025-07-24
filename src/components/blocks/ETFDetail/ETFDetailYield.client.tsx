"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { createChart, LineSeries } from "lightweight-charts";
import dayjs from "dayjs";
import { ETFPricesDaily } from "@/types/etf";
import { fetchETFDetail } from "@/services/etfDetailService";
import { useQuery } from "@tanstack/react-query";

const periods = ["1주", "1개월", "3개월", "6개월", "1년", "3년", "5년"];

interface ETFDetailYieldProps {
  etf_code: string;
}

// 기간별 일수 매핑
const periodDaysMap: Record<string, number> = {
  "1주": 7,
  "1개월": 30,
  "3개월": 90,
  "6개월": 180,
  "1년": 365,
  "3년": 1095,
  "5년": 1825,
};

// 차트 시리즈 설정
const chartSeriesConfig = {
  nav: { color: "#EF4444", title: "NAV" },
  market: { color: "#3B82F6", title: "시장가격" },
  index: { color: "#10B981", title: "기초지수" },
};

const ETFDetailYield: React.FC<ETFDetailYieldProps> = ({ etf_code }) => {
  const { data: etfData, isLoading } = useQuery({
    queryKey: ["etf", etf_code],
    queryFn: () => fetchETFDetail(etf_code),
    refetchOnWindowFocus: true,
  });

  const dailyPriceData = useMemo((): ETFPricesDaily[] => {
    return etfData?.daily_prices || [];
  }, [etfData]);

  const [activePeriod, setActivePeriod] = useState("1주");
  const [hoveredValues, setHoveredValues] = useState({
    nav: { return: 0, price: 0 },
    market: { return: 0, price: 0 },
    index: { return: 0, price: 0 },
  });

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  // 정렬된 가격 데이터 (날짜순)
  const sortedPriceData = useMemo(() => {
    return [...dailyPriceData].sort(
      (a, b) => dayjs(a.trade_date).valueOf() - dayjs(b.trade_date).valueOf()
    );
  }, [dailyPriceData]);

  // 기간별 필터링된 데이터
  const filteredData = useMemo(() => {
    if (!sortedPriceData.length) return [];

    const daysToSubtract = periodDaysMap[activePeriod] || 7;
    const startDate = dayjs().subtract(daysToSubtract, "day");

    return sortedPriceData.filter((data) => {
      const tradeDate = dayjs(data.trade_date);
      return (
        tradeDate.isAfter(startDate.subtract(1, "day")) &&
        tradeDate.isBefore(dayjs().add(1, "day"))
      );
    });
  }, [sortedPriceData, activePeriod]);

  // 차트 데이터 생성
  const createChartData = useMemo(() => {
    if (!filteredData.length) return { nav: [], market: [], index: [] };

    const baseData = filteredData[0];
    const baseNav = parseFloat(baseData.nav_price?.toString() || "1");
    const baseMarket = parseFloat(baseData.close_price?.toString() || "1");
    const baseIndex = parseFloat(baseData.obj_stk_prc_idx?.toString() || "1");

    const createSeriesData = (
      priceKey: keyof ETFPricesDaily,
      baseValue: number
    ) => {
      return filteredData
        .map((data) => {
          const currentValue = parseFloat(data[priceKey]?.toString() || "0");
          const returnRate = ((currentValue - baseValue) / baseValue) * 100;
          return {
            time: dayjs(data.trade_date).unix() as any,
            value: returnRate,
          };
        })
        .filter((item) => !isNaN(item.value));
    };

    return {
      nav: createSeriesData("nav_price", baseNav),
      market: createSeriesData("close_price", baseMarket),
      index: createSeriesData("obj_stk_prc_idx", baseIndex),
    };
  }, [filteredData]);

  // 차트 초기화
  useEffect(() => {
    if (!chartContainerRef.current || !filteredData.length) return;

    // 기존 차트 제거
    if (chartRef.current) {
      try {
        chartRef.current.remove();
      } catch (error) {
        console.log("Chart already removed");
      }
      chartRef.current = null;
    }

    // 차트 생성
    const chart = createChart(chartContainerRef.current, {
      layout: {
        textColor: "#D1D5DB",
        background: { type: "solid" as any, color: "#1F2937" },
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      },
      grid: {
        vertLines: { color: "#374151", style: 1 },
        horzLines: { color: "#374151", style: 1 },
      },
      width: chartContainerRef.current.clientWidth,
      height: 350,
      crosshair: {
        mode: 1,
        vertLine: {
          color: "#6B7280",
          width: 1,
          style: 3,
          labelBackgroundColor: "#1F2937",
        },
        horzLine: {
          color: "#6B7280",
          width: 1,
          style: 3,
          labelBackgroundColor: "#1F2937",
        },
      },
      rightPriceScale: { visible: false },
      leftPriceScale: {
        visible: true,
        borderColor: "#374151",
        textColor: "#D1D5DB",
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: {
        visible: true,
        borderColor: "#374151",
        timeVisible: false,
        secondsVisible: false,
        tickMarkFormatter: (time: number) =>
          dayjs.unix(time).format("YYYY.MM.DD"),
      },
    });

    chartRef.current = chart;

    // 시리즈 추가
    Object.entries(chartSeriesConfig).forEach(([key, config]) => {
      const series = chart.addSeries(LineSeries, {
        color: config.color,
        lineWidth: 2,
        title: config.title,
        priceLineVisible: true,
        priceLineColor: config.color,
        priceLineWidth: 1,
        priceLineStyle: 3,
        lastValueVisible: true,
        priceFormat: {
          type: "price",
          precision: 2,
          minMove: 0.01,
        },
      });
      series.setData(createChartData[key as keyof typeof createChartData]);
    });

    // 차트 크기 조정
    chart.timeScale().fitContent();

    // Hover 이벤트 처리
    chart.subscribeCrosshairMove((param) => {
      if (param.time) {
        const hoverDate = dayjs.unix(param.time as number);
        const actualData = filteredData.find(
          (data) =>
            dayjs(data.trade_date).format("YYYY-MM-DD") ===
            hoverDate.format("YYYY-MM-DD")
        );

        if (actualData) {
          const baseData = filteredData[0];
          const baseNav = parseFloat(baseData.nav_price?.toString() || "1");
          const baseMarket = parseFloat(
            baseData.close_price?.toString() || "1"
          );
          const baseIndex = parseFloat(
            baseData.obj_stk_prc_idx?.toString() || "1"
          );

          const navPrice = parseFloat(actualData.nav_price?.toString() || "0");
          const marketPrice = parseFloat(
            actualData.close_price?.toString() || "0"
          );
          const indexPrice = parseFloat(
            actualData.obj_stk_prc_idx?.toString() || "0"
          );

          setHoveredValues({
            nav: {
              return: ((navPrice - baseNav) / baseNav) * 100,
              price: navPrice,
            },
            market: {
              return: ((marketPrice - baseMarket) / baseMarket) * 100,
              price: marketPrice,
            },
            index: {
              return: ((indexPrice - baseIndex) / baseIndex) * 100,
              price: indexPrice,
            },
          });
        }
      }
    });

    // 반응형 처리
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        try {
          chartRef.current.remove();
        } catch (error) {}
        chartRef.current = null;
      }
    };
  }, [filteredData, createChartData]);

  // 특정 날짜에 가장 가까운 거래 데이터 찾기
  const findClosestTradeData = (
    targetDate: dayjs.Dayjs
  ): ETFPricesDaily | null => {
    if (!sortedPriceData.length) return null;

    const targetDateStr = targetDate.format("YYYY-MM-DD");
    const oldestDateStr = dayjs(sortedPriceData[0].trade_date).format(
      "YYYY-MM-DD"
    );

    // 데이터가 충분히 오래되지 않았으면 null 반환
    if (targetDateStr < oldestDateStr) return null;

    // targetDate보다 작거나 같은 가장 가까운 날짜의 데이터 찾기
    for (let i = sortedPriceData.length - 1; i >= 0; i--) {
      const data = sortedPriceData[i];
      const tradeDateStr = dayjs(data.trade_date).format("YYYY-MM-DD");
      if (tradeDateStr <= targetDateStr) return data;
    }

    return null;
  };

  // 수익률 계산 함수
  const calculateReturn = (
    period: string,
    dataType: "nav" | "market" | "index"
  ): number | null => {
    if (!sortedPriceData.length) return null;

    const currentData = sortedPriceData[sortedPriceData.length - 1];
    if (!currentData) return null;

    const periodDays = periodDaysMap[period];
    if (!periodDays) return null;

    const targetDate = dayjs().subtract(periodDays, "day");
    const targetData = findClosestTradeData(targetDate);
    if (!targetData) return null;

    const priceMap = {
      nav: { current: currentData.nav_price, target: targetData.nav_price },
      market: {
        current: currentData.close_price,
        target: targetData.close_price,
      },
      index: {
        current: currentData.obj_stk_prc_idx,
        target: targetData.obj_stk_prc_idx,
      },
    };

    const { current, target } = priceMap[dataType];
    if (!current || !target) return null;

    const currentNum = parseFloat(current.toString());
    const targetNum = parseFloat(target.toString());

    if (isNaN(currentNum) || isNaN(targetNum) || targetNum === 0) return null;

    return ((currentNum - targetNum) / targetNum) * 100;
  };

  // 수익률 포맷팅
  const formatReturn = (value: number | string | null): string => {
    if (value === null || value === undefined || value === "") return "-";
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(numValue) ? "-" : numValue.toFixed(2);
  };

  // 수익률 색상 결정
  const getReturnColor = (value: number | string | null): string => {
    if (value === null || value === undefined) return "text-gray-500";
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(numValue)
      ? "text-gray-500"
      : numValue >= 0
      ? "text-red-500"
      : "text-blue-500";
  };

  // 테이블 행 렌더링
  const renderTableRow = (
    label: string,
    dataType: "nav" | "market" | "index"
  ) => (
    <tr>
      <td className="py-3 px-4 border-b border-gray-100">{label}</td>
      {["1개월", "3개월", "6개월", "1년", "3년", "5년"].map((period) => (
        <td
          key={period}
          className={`py-3 px-4 border-b border-gray-100 ${getReturnColor(
            calculateReturn(period, dataType)
          )}`}
        >
          {formatReturn(calculateReturn(period, dataType))}
        </td>
      ))}
    </tr>
  );

  return (
    <div id="yield" className="mx-auto w-full flex-1 min-w-0 pl-10 pt-10">
      <div
        className="bg-white rounded-3xl w-full px-16 py-16 shadow"
        style={{ borderRadius: "4rem" }}
      >
        {/* 타이틀, 구분선, 기준일 */}
        <div>
          <div className="text-2xl font-semibold mb-4">수익률</div>
          <hr className="border-b border-gray-200 mb-10" />
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4 w-full">
              <span className="text-sm font-medium text-gray-700 ml-2 mr-4 whitespace-nowrap">
                적용기간
              </span>
              <div className="flex bg-[#F6F7F9] rounded-2xl p-1 w-full">
                {periods.map((period) => (
                  <button
                    key={period}
                    onClick={() => setActivePeriod(period)}
                    className={`flex-1 px-4 py-2 rounded-2xl text-sm font-medium transition-colors duration-150 border ${
                      activePeriod === period
                        ? "bg-white"
                        : "border-transparent text-gray-500"
                    }`}
                    style={
                      activePeriod === period
                        ? {
                            borderColor: "#0046ff",
                            color: "#0046ff",
                            fontWeight: "semibold",
                          }
                        : {}
                    }
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Lightweight Charts 그래프 */}
        {!isLoading && filteredData.length > 0 ? (
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
              <span
                className="w-4 h-4 rounded inline-block"
                style={{ backgroundColor: "#EF4444" }}
              ></span>
              <span className="text-gray-500 text-sm font-medium">NAV</span>
            </div>
            <span className="text-base">
              {`${hoveredValues.nav.return.toFixed(
                2
              )}%(${hoveredValues.nav.price.toLocaleString()}원)`}
            </span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded inline-block"
                style={{ backgroundColor: "#3B82F6" }}
              ></span>
              <span className="text-gray-500 text-sm font-medium">
                시장가격
              </span>
            </div>
            <span className="text-base">
              {`${hoveredValues.market.return.toFixed(
                2
              )}%(${hoveredValues.market.price.toLocaleString()}원)`}
            </span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded inline-block"
                style={{ backgroundColor: "#10B981" }}
              ></span>
              <span className="text-gray-500 text-sm font-medium">
                기초지수
              </span>
            </div>
            <span className="text-base">
              {`${hoveredValues.index.return.toFixed(
                2
              )}%(${hoveredValues.index.price.toLocaleString()}원)`}
            </span>
          </div>
        </div>

        {/* 기간별 수익률 테이블 */}
        <div className="mt-16">
          <div className="text-2xl font-semibold mb-4">기간별 수익률</div>
          <hr className="border-b border-gray-200 mb-10" />
          <div className="flex w-full justify-end mb-2">
            <span className="text-sm text-gray-400">단위(%)</span>
          </div>
          {!isLoading && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-center border-separate border-spacing-0">
                <thead>
                  <tr className="bg-[#F6F7F9] text-gray-500 text-base">
                    <th className="py-3 px-4 font-medium border-b border-gray-200">
                      종목명
                    </th>
                    {["1개월", "3개월", "6개월", "1년", "3년", "5년"].map(
                      (period) => (
                        <th
                          key={period}
                          className="py-3 px-4 font-medium border-b border-gray-200"
                        >
                          {period}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="text-base">
                  {renderTableRow("NAV", "nav")}
                  {renderTableRow("시장가격(종가)", "market")}
                  {renderTableRow("기초지수", "index")}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ETFDetailYield;
