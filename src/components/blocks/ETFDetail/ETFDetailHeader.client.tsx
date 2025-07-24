"use client";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchETFDetail } from "@/services/etfDetailService";
import { ETFPricesDaily } from "@/types/etf";

interface ETFDetailHeaderProps {
  etf_code: string;
}

const ETFDetailHeader: React.FC<ETFDetailHeaderProps> = ({ etf_code }) => {
  const {
    data: etfData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["etf", etf_code],
    queryFn: () => fetchETFDetail(etf_code),
    refetchOnWindowFocus: true,
  });

  // const pricesDailyData = useMemo(() => {
  //   return etfData?.daily_prices || [];
  // }, [etfData]);

  // const dailyPriceData = useMemo(() => {
  //   return pricesDailyData[0] || {};
  // }, [pricesDailyData]);

  const dailyPriceData = useMemo((): Partial<ETFPricesDaily> => {
    return etfData?.daily_prices?.[0] || {};
  }, [etfData]);

  const {
    etf_name,
    asset_class,
    theme,
    style,
    is_personal_pension,
    is_retire_pension,
  } = etfData || {};
  const { close_price, volume, change_rate, cmp_prev_dd_price } =
    dailyPriceData || {};
  const isPositive = (Number(change_rate) || 0) >= 0;

  return (
    <div
      className="bg-[#4DB6FF] rounded-3xl p-6 sm:p-10 flex flex-col shadow-lg relative mx-auto w-full h-auto md:h-[500px]"
      style={{ marginTop: 130, borderRadius: "4rem" }}
    >
      <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8 h-full">
        <div
          className="w-full md:w-[500px] max-w-full text-white"
          style={{ marginLeft: 50, marginTop: -10 }}
        >
          <div className="flex items-center gap-2 mb-2">
            {is_personal_pension && (
              <span className="inline-flex items-center px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
                개인연금
              </span>
            )}
            {is_retire_pension && (
              <span className="inline-flex items-center px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
                퇴직연금
              </span>
            )}
            {asset_class && (
              <span className="inline-flex items-center px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
                {asset_class}
              </span>
            )}
            {theme && (
              <span className="inline-flex items-center px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
                {theme}
              </span>
            )}
            {style && (
              <span className="inline-flex items-center px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
                {style}
              </span>
            )}
          </div>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
            {etf_name}
          </h1>
          <div className="text-xl font-semibold tracking-widest mb-2">
            {etf_code}
          </div>
        </div>
        <div
          className="w-full md:w-[400px] max-w-full flex justify-center items-center"
          style={{ marginRight: 50 }}
        >
          <img
            src="/etf_detail_logo.png"
            alt="main logo"
            className="object-contain mx-auto drop-shadow-xl"
            style={{
              filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.10))",
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 w-full justify-center items-center -mt-24 z-10 relative">
        <div
          className="bg-[#FFFFFFCC] rounded-3xl shadow-xl p-6 flex flex-col items-center w-[500px]"
          style={{ borderRadius: "1.5rem" }}
        >
          <div className="text-xs text-gray-500 mb-1">현재가(원)</div>
          <div className="flex items-end gap-2">
            <span
              className={`text-base ${
                isPositive ? "text-red-500" : "text-blue-500"
              }`}
            >
              {isPositive ? "▲" : "▼"}{" "}
              {cmp_prev_dd_price
                ? Number(cmp_prev_dd_price).toLocaleString()
                : 0}{" "}
              ({change_rate ? Number(change_rate).toFixed(2) : 0}%)
            </span>
            <span className="text-2xl font-bold text-gray-900 ml-3">
              {close_price ? Number(close_price).toLocaleString() : "-"}
            </span>
            <span className="text-base text-gray-500">원</span>
          </div>
        </div>
        <div
          className="bg-[#FFFFFFCC] rounded-3xl shadow-xl p-6 flex flex-col items-center w-[500px]"
          style={{ borderRadius: "1.5rem" }}
        >
          <div className="text-xs text-gray-500 mb-1">일 거래량(주)</div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {volume ? Number(volume).toLocaleString() : "-"}
            </span>
            <span className="text-base text-gray-500">주</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ETFDetailHeader;
