"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ResponsivePie } from "@nivo/pie";
import { ETFRecommendationScore } from "@/types/etf";
import { useQuery } from "@tanstack/react-query";
import { fetchETFDetail } from "@/services/etfDetailService";

interface ETFDetailRiskProps {
  etf_code: string;
}

const ETFDetailRisk: React.FC<ETFDetailRiskProps> = ({ etf_code }) => {
  const {
    data: etfData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["etf", etf_code],
    queryFn: () => fetchETFDetail(etf_code),
    refetchOnWindowFocus: true,
  });

  const riskData = useMemo((): ETFRecommendationScore | null => {
    if (!etfData) return null;

    // 새로운 DB 구조에 맞춰 데이터 추출
    if (etfData.etf_recommendation_score_data?.[0]) {
      return etfData.etf_recommendation_score_data[0];
    } else if (etfData.etf_recommendation_score) {
      return etfData.etf_recommendation_score;
    } else if ((etfData as any).recommendation_data) {
      return (etfData as any).recommendation_data;
    } else {
      return null;
    }
  }, [etfData]);

  // 숫자 변환 유틸리티
  const parseNumber = (value: number | string | null | undefined): number => {
    if (value === null || value === undefined) return 0;
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(numValue) ? 0 : numValue;
  };

  // 위험도 계산
  const calculateRiskValue = (stabilityScore: number): number => {
    if (stabilityScore >= 90) return 5; // 5등급 (가장 안전)
    if (stabilityScore >= 80) return 4; // 4등급 (안전)
    if (stabilityScore >= 60) return 3; // 3등급 (보통)
    if (stabilityScore >= 40) return 2; // 2등급 (위험)
    return 1; // 1등급 (가장 위험)
  };

  // 위험도 라벨 (위험도 수준)
  const getRiskLabel = (riskValue: number): string => {
    const labels = {
      1: "매우 위험",
      2: "위험",
      3: "보통",
      4: "안전",
      5: "매우 안전",
    };
    return labels[riskValue as keyof typeof labels] || "보통";
  };

  // 색상 매핑 (1등급=가장 위험, 5등급=가장 안전)
  const getRiskColor = (riskValue: number): string => {
    const colors = {
      1: "#FF0000", // 빨간색 (1등급, 가장 위험)
      2: "#FF5A3D", // 주황색 (2등급, 위험)
      3: "#FFA500", // 주황색 (3등급, 보통)
      4: "#32CD32", // 초록색 (4등급, 안전)
      5: "#008000", // 진한 초록색 (5등급, 가장 안전)
    };
    return colors[riskValue as keyof typeof colors] || "#FFA500";
  };

  const getMddColor = (mdd: number): string => {
    if (mdd <= 10) return "#008000";
    if (mdd <= 20) return "#32CD32";
    if (mdd <= 30) return "#FFA500";
    return "#FF0000";
  };

  const getVolatilityColor = (volatility: number): string => {
    // volatility는 이미 퍼센트로 변환된 값
    if (volatility <= 10) return "#008000";
    if (volatility <= 20) return "#32CD32";
    if (volatility <= 30) return "#FFA500";
    return "#FF0000";
  };

  // 파이 차트 데이터 생성
  const createPieData = (value: number, maxValue: number, color: string) => [
    { id: "value", value: (value / maxValue) * 100, color },
    { id: "empty", value: 100 - (value / maxValue) * 100, color: "#F5F5F5" },
  ];

  // 데이터 추출 및 변환 (DB에서 직접 가져오기)
  const stabilityScore = riskData ? parseNumber(riskData.stability_score) : 0;
  const mdd = riskData ? parseNumber(riskData.mdd) : 0;
  const volatilityRaw = riskData ? parseNumber(riskData.volatility) : 0;
  const volatility = volatilityRaw * 100; // 퍼센트로 변환

  console.log("Parsed values:", {
    stabilityScore,
    mdd,
    volatilityRaw,
    volatility: `${volatility.toFixed(2)}%`,
  });

  // 위험도 계산 (stability_score 직접 사용)
  const riskValue = calculateRiskValue(stabilityScore);
  const riskLabel = getRiskLabel(riskValue);
  const riskColor = getRiskColor(riskValue);
  const mddColor = getMddColor(mdd);
  const volatilityColor = getVolatilityColor(volatility);

  // 차트 데이터
  const riskPieData = createPieData(riskValue, 5, riskColor); // 위험도가 낮을수록(안전할수록) 차트가 적게 채워짐
  const mddPieData = createPieData(mdd, 50, mddColor);
  const volatilityPieData = createPieData(volatility, 50, volatilityColor); // volatility는 이미 퍼센트

  // 차트 렌더링 컴포넌트
  const RiskChart = ({
    data,
    value,
    label,
    color,
    chartName,
    isInteger = false,
  }: {
    data: any[];
    value: number;
    label: string;
    color: string;
    chartName?: string;
    isInteger?: boolean;
  }) => (
    <div className="flex flex-col items-center">
      <div style={{ width: 200, height: 200, margin: "0 auto" }}>
        <ResponsivePie
          data={data}
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
            "arcs",
            ({ centerX, centerY }) => (
              <>
                <text
                  x={centerX}
                  y={centerY - 16}
                  textAnchor="middle"
                  dominantBaseline="central"
                  style={{ fontSize: 40, fill: color, fontWeight: 600 }}
                >
                  {isInteger ? Math.round(value) : value.toFixed(1)}
                </text>
                <text
                  x={centerX}
                  y={centerY + 24}
                  textAnchor="middle"
                  dominantBaseline="central"
                  style={{ fontSize: 16, fill: color, fontWeight: 600 }}
                >
                  {label}
                </text>
              </>
            ),
          ]}
        />
      </div>
      <div className="mt-4 text-base font-semibold">{chartName || label}</div>
    </div>
  );

  return (
    <div id="risk" className="mx-auto w-full flex-1 min-w-0 pl-10 pt-10">
      <div
        className="bg-white rounded-3xl w-full px-16 py-16 shadow"
        style={{ borderRadius: "4rem" }}
      >
        <div>
          <div className="text-2xl font-semibold mb-4">위험도</div>
          <hr className="border-b border-gray-200 mb-10" />

          {isError && (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="text-red-400 text-lg mb-2">
                  데이터 로딩 실패
                </div>
                <div className="text-gray-300 text-sm">
                  위험도 정보를 불러올 수 없습니다.
                </div>
              </div>
            </div>
          )}

          {!isError && riskData && (
            <div className="flex justify-center gap-16 mt-10">
              <RiskChart
                data={riskPieData}
                value={riskValue}
                label={riskLabel}
                color={riskColor}
                chartName="투자위험"
                isInteger={true}
              />
              <RiskChart
                data={mddPieData}
                value={mdd}
                label="%"
                color={mddColor}
                chartName="최대낙폭"
              />
              <RiskChart
                data={volatilityPieData}
                value={volatility}
                label="%"
                color={volatilityColor}
                chartName="변동성"
              />
            </div>
          )}

          {!isLoading && !isError && !riskData && (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="text-gray-400 text-lg mb-2">
                  위험도 데이터가 없습니다
                </div>
                <div className="text-gray-300 text-sm">
                  해당 ETF의 위험도 정보를 확인할 수 없습니다.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ETFDetailRisk;
