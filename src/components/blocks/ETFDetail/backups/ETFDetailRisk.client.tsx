"use client";

import React, { useState, useEffect } from "react";
import { ResponsivePie } from "@nivo/pie";
import { ETFRecommendationScore } from "@/types/etf";

const riskPeriods = ["1개월", "3개월", "6개월", "1년", "3년"];

interface ETFDetailRiskProps {
  etf_code: string;
}

const ETFDetailRisk: React.FC<ETFDetailRiskProps> = ({ etf_code }) => {
  const [activeRiskPeriod, setActiveRiskPeriod] = useState("1개월");
  const [riskData, setRiskData] = useState<ETFRecommendationScore | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ETF 위험도 데이터 가져오기
  const fetchRiskData = async () => {
    setLoading(true);
    setError(null);

    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/etfs/${etf_code}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }

      const responseData = await response.json();

      if (responseData.status === 200 && responseData.data) {
        const etfData = responseData.data;

        if (etfData.recommendation_score_data) {
          setRiskData(etfData.recommendation_score_data);
        } else if (etfData.risk_data) {
          setRiskData(etfData.risk_data);
        } else if (etfData.score_data) {
          setRiskData(etfData.score_data);
        } else if (etfData.recommendation_data) {
          setRiskData(etfData.recommendation_data);
        } else {
          setRiskData(null);
        }
      } else {
        setRiskData(null);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "데이터를 가져오는 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiskData();
  }, [etf_code]);

  // 숫자 변환
  const parseNumber = (value: number | string | null): number => {
    if (value === null || value === undefined) return 0;
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(numValue) ? 0 : numValue;
  };

  // 위험도 계산
  const calculateRiskValue = (score: number): number => {
    // score 범위에 따른 위험도 계산 (1단계가 가장 안전, 5단계가 가장 위험)
    if (score <= 0) return 1; // 가장 안전
    if (score <= 10) return 2; // 안전
    if (score <= 20) return 3; // 보통
    if (score <= 30) return 4; // 위험
    return 5; // 가장 위험 (40 이상)
  };

  // 위험도 라벨 함수
  const getRiskLabel = (riskValue: number): string => {
    switch (riskValue) {
      case 1:
        return "가장 위험";
      case 2:
        return "위험";
      case 3:
        return "보통";
      case 4:
        return "안전";
      case 5:
        return "가장 안전";
      default:
        return "보통";
    }
  };

  // 위험도 색상 함수
  const getRiskColor = (riskValue: number): string => {
    switch (riskValue) {
      case 1:
        return "#FF0000"; // 빨간색 (가장 위험)
      case 2:
        return "#FF5A3D"; // 주황색 (위험)
      case 3:
        return "#FFA500"; // 오렌지색 (보통)
      case 4:
        return "#32CD32"; // 초록색 (안전)
      case 5:
        return "#008000"; // 진한 초록색 (가장 안전)
      default:
        return "#FFA500";
    }
  };

  // MDD 색상 함수
  const getMddColor = (mdd: number): string => {
    if (mdd <= 10) return "#008000"; // 초록색
    if (mdd <= 20) return "#32CD32"; // 연한 초록색
    if (mdd <= 30) return "#FFA500"; // 주황색
    return "#FF0000"; // 빨간색
  };

  // Volatility 색상 함수
  const getVolatilityColor = (volatility: number): string => {
    if (volatility * 100 <= 10) return "#008000"; // 초록색
    if (volatility * 100 <= 20) return "#32CD32"; // 연한 초록색
    if (volatility * 100 <= 30) return "#FFA500"; // 주황색
    return "#FF0000"; // 빨간색
  };

  // 파이 차트 데이터 생성 함수
  const createPieData = (value: number, maxValue: number, color: string) => {
    const percent = (value / maxValue) * 100;
    return [
      { id: "value", value: percent, color: color },
      { id: "empty", value: 100 - percent, color: "#F5F5F5" },
    ];
  };

  // 실제 데이터 사용 (기본값 제거)
  const score = riskData ? parseNumber(riskData.etf_score) : 0;
  const mdd = riskData ? parseNumber(riskData.mdd) : 0;
  const volatility = riskData ? parseNumber(riskData.volatility) : 0;

  const riskValue = calculateRiskValue(score);
  const riskLabel = getRiskLabel(riskValue);
  const riskColor = getRiskColor(riskValue);
  const mddColor = getMddColor(mdd);
  const volatilityColor = getVolatilityColor(volatility);

  const riskPieData = createPieData(6 - riskValue, 5, riskColor);
  const mddPieData = createPieData(mdd, 50, mddColor); // MDD 최대값 50%로 가정
  const volatilityPieData = createPieData(
    volatility * 100,
    50,
    volatilityColor
  ); // Volatility 최대값 50%로 가정

  return (
    <div id="risk" className="mx-auto w-full flex-1 min-w-0 pl-10 pt-10">
      <div
        className="bg-white rounded-3xl w-full px-16 py-16 shadow"
        style={{ borderRadius: "4rem" }}
      >
        <div>
          <div className="text-2xl font-semibold mb-4">위험도</div>
          <hr className="border-b border-gray-200 mb-10" />
          <div className="flex justify-between items-center mb-8">
            {/* <div className="flex items-center gap-4 w-full">
              <span className="text-sm font-medium text-gray-700 ml-2 mr-4 whitespace-nowrap">적용기간</span>
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
            </div> */}
          </div>

          {/* 데이터가 있을 때만 그래프 표시 */}
          {!loading && !error && riskData && (
            <div className="flex justify-center gap-16 mt-10">
              {/* 투자위험 그래프 */}
              <div className="flex flex-col items-center">
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
                      "arcs",
                      ({ centerX, centerY }) => (
                        <>
                          <text
                            x={centerX}
                            y={centerY - 16}
                            textAnchor="middle"
                            dominantBaseline="central"
                            style={{
                              fontSize: 40,
                              fill: riskColor,
                              fontWeight: 600,
                            }}
                          >
                            {riskValue}
                          </text>
                          <text
                            x={centerX}
                            y={centerY + 24}
                            textAnchor="middle"
                            dominantBaseline="central"
                            style={{
                              fontSize: 16,
                              fill: riskColor,
                              fontWeight: 600,
                            }}
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

              {/* MDD 그래프 */}
              <div className="flex flex-col items-center">
                <div style={{ width: 200, height: 200, margin: "0 auto" }}>
                  <ResponsivePie
                    data={mddPieData}
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
                            style={{
                              fontSize: 40,
                              fill: mddColor,
                              fontWeight: 600,
                            }}
                          >
                            {mdd.toFixed(1)}
                          </text>
                          <text
                            x={centerX}
                            y={centerY + 24}
                            textAnchor="middle"
                            dominantBaseline="central"
                            style={{
                              fontSize: 16,
                              fill: mddColor,
                              fontWeight: 600,
                            }}
                          >
                            MDD(%)
                          </text>
                        </>
                      ),
                    ]}
                  />
                </div>
                <div className="mt-4 text-base font-semibold">최대낙폭</div>
              </div>

              {/* Volatility 그래프 */}
              <div className="flex flex-col items-center">
                <div style={{ width: 200, height: 200, margin: "0 auto" }}>
                  <ResponsivePie
                    data={volatilityPieData}
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
                            style={{
                              fontSize: 40,
                              fill: volatilityColor,
                              fontWeight: 600,
                            }}
                          >
                            {(volatility * 100).toFixed(1)}
                          </text>
                          <text
                            x={centerX}
                            y={centerY + 24}
                            textAnchor="middle"
                            dominantBaseline="central"
                            style={{
                              fontSize: 16,
                              fill: volatilityColor,
                              fontWeight: 600,
                            }}
                          >
                            변동성(%)
                          </text>
                        </>
                      ),
                    ]}
                  />
                </div>
                <div className="mt-4 text-base font-semibold">변동성</div>
              </div>
            </div>
          )}

          {/* 데이터가 없을 때 메시지 */}
          {!loading && !error && !riskData && (
            <div className="flex justify-center items-center h-64">
              <span className="text-gray-500">위험도 데이터가 없습니다.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ETFDetailRisk;
