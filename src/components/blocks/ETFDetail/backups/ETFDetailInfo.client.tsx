"use client";

import React, { useState, useEffect } from "react";
// import { fetchETFDetail } from '@/services/etfDetailService';
import { ETFDetail, ETFPricesDaily } from "@/types/etf";

interface ETFDetailInfoProps {
  etf_code: string;
}

const ETFDetailInfo: React.FC<ETFDetailInfoProps> = ({ etf_code }) => {
  const [etfData, setEtfData] = useState<ETFDetail | null>(null);
  const [dailyPriceData, setDailyPriceData] = useState<ETFPricesDaily | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ETF 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const etfResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/etfs/${etf_code}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!etfResponse.ok) {
          throw new Error(`HTTP error! status: ${etfResponse.status}`);
        }

        const etfResult = await etfResponse.json();

        if (etfResult.status === 200 && etfResult.data) {
          setEtfData(etfResult.data);

          // daily_price 데이터 처리 (당일 데이터 우선적으로 가져오고 없으면 전일 데이터 가져오기)
          if (etfResult.data.daily_price) {
            setDailyPriceData(etfResult.data.daily_price);
          } else if (etfResult.data.prices_daily) {
            setDailyPriceData(etfResult.data.prices_daily);
          } else if (
            etfResult.data.daily_prices &&
            etfResult.data.daily_prices.length > 0
          ) {
            // 배열인 경우 최신 데이터 사용 (당일 또는 전일)
            const latestPrice = etfResult.data.daily_prices[0];
            setDailyPriceData(latestPrice);
          } else if (etfResult.data.new_prices_daily) {
            // new_prices_daily 테이블 데이터 사용
            setDailyPriceData(etfResult.data.new_prices_daily);
          }
        } else {
          setError("ETF 데이터를 불러올 수 없습니다.");
          return;
        }
      } catch (err) {
        setError("데이터 로딩 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [etf_code]);

  const { etf_name, inception_date, provider, expense_ratio } = etfData || {};
  const { aum, mkt_cap, list_shrs, acc_trd_val, idx_ind_nm } =
    dailyPriceData || {};

  return (
    <div id="info" className="mx-auto w-full flex-1 min-w-0 pl-10 pt-14">
      <div
        className="bg-white rounded-3xl w-full px-16 py-16 shadow"
        style={{ borderRadius: "4rem" }}
      >
        <div>
          <div className="text-2xl font-semibold mb-4">상품정보</div>
          <hr className="border-b border-gray-200 mb-10" />
        </div>
        <div
          className="border border-gray-200 rounded-3xl overflow-hidden"
          style={{ borderRadius: "2rem" }}
        >
          {/* 하늘색 상단 박스 */}
          <div className="bg-[#4DB6FF] w-full flex items-center justify-between px-10 py-10 border-b border-gray-200">
            <div>
              <div className="text-white text-2xl font-semibold mb-1">
                {etf_name}
              </div>
              <div className="text-white text-lg font-semibold tracking-widest">
                {etf_code}
              </div>
            </div>
          </div>
          {/* 정보 표 */}
          <div className="w-full px-10 py-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-base bg-white">
            <div className="flex justify-between items-center bg-[#F2F8FC] rounded-xl px-6 py-3 min-h-[60px]">
              <span className="text-gray-500 text-sm whitespace-nowrap">
                순자산 총액
              </span>
              <span className="font-semibold text-right ml-4">
                {aum
                  ? `${Math.round(
                      Number(aum) / 100000000
                    ).toLocaleString()}억원`
                  : "-"}
              </span>
            </div>
            <div className="flex justify-between items-center bg-[#F2F8FC] rounded-xl px-6 py-3 min-h-[60px]">
              <span className="text-gray-500 text-sm whitespace-nowrap">
                상장일
              </span>
              <span className="font-semibold text-right ml-4">
                {inception_date
                  ? new Date(inception_date).toLocaleDateString("ko-KR")
                  : "-"}
              </span>
            </div>
            <div className="flex justify-between items-center bg-[#F2F8FC] rounded-xl px-6 py-3 min-h-[60px]">
              <span className="text-gray-500 text-sm whitespace-nowrap">
                당일 거래대금
              </span>
              <span className="font-semibold text-right ml-4">
                {acc_trd_val
                  ? `${Math.round(
                      Number(acc_trd_val) / 100000000
                    ).toLocaleString()}억원`
                  : "-"}
              </span>
            </div>
            <div className="flex justify-between items-center bg-[#F2F8FC] rounded-xl px-6 py-3 min-h-[60px]">
              <span className="text-gray-500 text-sm whitespace-nowrap">
                운용 보수
              </span>
              <span className="font-semibold text-right ml-4">
                {expense_ratio || "-"}%
              </span>
            </div>
            <div className="flex justify-between items-center bg-[#F2F8FC] rounded-xl px-6 py-3 min-h-[60px]">
              <span className="text-gray-500 text-sm whitespace-nowrap">
                시가총액
              </span>
              <span className="font-semibold text-right ml-4">
                {mkt_cap
                  ? `${Math.round(
                      Number(mkt_cap) / 100000000
                    ).toLocaleString()}억원`
                  : "-"}
              </span>
            </div>
            <div className="flex justify-between items-center bg-[#F2F8FC] rounded-xl px-6 py-3 min-h-[60px]">
              <span className="text-gray-500 text-sm whitespace-nowrap">
                상장주식수
              </span>
              <span className="font-semibold text-right ml-4">
                {list_shrs
                  ? `${Math.round(
                      Number(list_shrs) / 10000
                    ).toLocaleString()}만주`
                  : "-"}
              </span>
            </div>
            <div className="flex justify-between items-center bg-[#F2F8FC] rounded-xl px-6 py-3 min-h-[60px]">
              <span className="text-gray-500 text-sm whitespace-nowrap">
                자산운용사
              </span>
              <span className="font-semibold text-right ml-4">
                {provider || "-"}
              </span>
            </div>
            <div className="flex justify-between items-center bg-[#F2F8FC] rounded-xl px-6 py-3 min-h-[60px]">
              <span className="text-gray-500 text-sm whitespace-nowrap">
                지수산업명
              </span>
              <span className="font-semibold text-right ml-4">
                {idx_ind_nm || "-"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ETFDetailInfo;
