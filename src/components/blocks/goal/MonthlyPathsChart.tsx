"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  LineData,
  LineSeries,
  AreaData,
  AreaSeries,
} from "lightweight-charts";
import { TrendingUp } from "lucide-react";

// 새로운 데이터 구조 타입 정의
interface MonthlyPathsData {
  representative?: {
    p95: number[];
    p50: number[];
    p05: number[];
  };
  random_samples?: number[][];
  fan_bands?: {
    p05: number[];
    p25: number[];
    p50: number[];
    p75: number[];
    p95: number[];
  };
  principal_line?: number[];
  x_axis?: {
    type: "monthIndex";
    length: number;
    labels: string[];
  };
}

interface MonthlyPathsChartProps {
  monthlyPaths: number[][] | MonthlyPathsData;
  className?: string;
  targetYears?: number;
}

// 현재 날짜를 기준으로 시작점 설정
const getCurrentDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(now.getDate()).padStart(2, "0")}`;
};

// 현재 날짜부터 시작하는 날짜 배열 생성
const generateDateArray = (months: number) => {
  const dates = [];
  const startDate = new Date();

  for (let i = 0; i < months; i++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);
    dates.push(
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-01`
    );
  }

  return dates;
};

export const MonthlyPathsChart = ({
  monthlyPaths,
  className = "",
  targetYears = 5,
}: MonthlyPathsChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Line" | "Area">[]>([]);

  // 디버깅을 위한 로그 (개발 환경에서만)
  if (process.env.NODE_ENV === "development") {
    console.log("🔍 MonthlyPathsChart monthlyPaths 디버깅:", {
      monthlyPaths,
      type: typeof monthlyPaths,
      isArray: Array.isArray(monthlyPaths),
      length: Array.isArray(monthlyPaths) ? monthlyPaths.length : 0,
      hasData: !!monthlyPaths,
      structure:
        !Array.isArray(monthlyPaths) && monthlyPaths
          ? Object.keys(monthlyPaths)
          : [],
      fanBands:
        !Array.isArray(monthlyPaths) && monthlyPaths?.fan_bands
          ? Object.keys(monthlyPaths.fan_bands)
          : [],
    });
  }

  useEffect(() => {
    if (
      !chartContainerRef.current ||
      !monthlyPaths ||
      (Array.isArray(monthlyPaths) && monthlyPaths.length === 0) ||
      (!Array.isArray(monthlyPaths) && !monthlyPaths.fan_bands)
    ) {
      return;
    }

    // 기존 차트 정리
    if (chartRef.current) {
      try {
        chartRef.current.remove();
      } catch (error) {
        console.log("Chart already disposed");
      }
      seriesRef.current = [];
    }

    // 차트 생성
    const chart = createChart(chartContainerRef.current, {
      width: 400,
      height: 300,
      layout: {
        background: { color: "#ffffff" },
        textColor: "#6b7280",
      },
      grid: {
        vertLines: { color: "#f3f4f6" },
        horzLines: { color: "#f3f4f6" },
      },
      rightPriceScale: {
        borderColor: "#e5e7eb",
        visible: false,
      },
      leftPriceScale: {
        borderColor: "#e5e7eb",
        visible: true,
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      timeScale: {
        borderColor: "#e5e7eb",
        visible: true,
        timeVisible: true, // 시간 표시 활성화
        secondsVisible: false,
        rightOffset: 0, // 오른쪽 여백 제거
        ticksVisible: true, // 시간 틱 표시 활성화
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: "#4DB6FF",
          width: 1,
          style: 2,
        },
        horzLine: {
          color: "#4DB6FF",
          width: 1,
          style: 2,
        },
      },
      handleScroll: false,
      handleScale: false,
    });

    chartRef.current = chart;

    // 새로운 데이터 구조인지 확인
    const isNewDataStructure =
      !Array.isArray(monthlyPaths) && monthlyPaths.fan_bands;

    // 날짜 배열 생성
    const dateArray = generateDateArray(
      isNewDataStructure
        ? (monthlyPaths as MonthlyPathsData).fan_bands?.p50.length || 60
        : (monthlyPaths as number[][])[0]?.length || targetYears * 12
    );

    // 데이터 길이 계산
    const dataLength = isNewDataStructure
      ? (monthlyPaths as MonthlyPathsData).fan_bands?.p50.length || 37
      : (monthlyPaths as number[][])[0]?.length || 37;

    // 시간 스케일을 강제로 설정하여 전체 데이터가 표시되도록 함
    setTimeout(() => {
      try {
        chart.timeScale().setVisibleLogicalRange({
          from: 0,
          to: dataLength - 1,
        });
      } catch (error) {
        console.log("Time scale setting failed:", error);
      }
    }, 100);

    if (isNewDataStructure) {
      // 새로운 데이터 구조 처리
      const data = monthlyPaths as MonthlyPathsData;

      // 현재 날짜부터 시작하는 날짜 배열 생성
      const dateArray = generateDateArray(
        data.fan_bands?.p95.length || targetYears * 12 + 1
      );

      // Fan Chart 구현
      if (data.fan_bands) {
        // 5%~95% 영역 (연한 파랑)
        const area95Series = chart.addSeries(AreaSeries, {
          topColor: "rgba(135, 206, 250, 0.2)",
          bottomColor: "rgba(135, 206, 250, 0.2)",
          lineColor: "rgba(135, 206, 250, 0.5)",
          lineWidth: 1,
        });

        const area95Data: AreaData[] = data.fan_bands.p95.map(
          (value, index) => ({
            time: dateArray[index],
            value: value,
          })
        );

        area95Series.setData(area95Data);
        seriesRef.current.push(area95Series);

        // 25%~75% 영역 (더 진한 파랑)
        const area75Series = chart.addSeries(AreaSeries, {
          topColor: "rgba(135, 206, 250, 0.4)",
          bottomColor: "rgba(135, 206, 250, 0.4)",
          lineColor: "rgba(135, 206, 250, 0.7)",
          lineWidth: 1,
        });

        const area75Data: AreaData[] = data.fan_bands.p75.map(
          (value, index) => ({
            time: dateArray[index],
            value: value,
          })
        );

        area75Series.setData(area75Data);
        seriesRef.current.push(area75Series);

        // 중앙값 라인 (굵은 선)
        const medianSeries = chart.addSeries(LineSeries, {
          color: "#2E86AB",
          lineWidth: 3,
          crosshairMarkerVisible: false,
          lastValueVisible: false,
          priceLineVisible: false,
        });

        const medianData: LineData[] = data.fan_bands.p50.map(
          (value, index) => ({
            time: dateArray[index],
            value: value,
          })
        );

        medianSeries.setData(medianData);
        seriesRef.current.push(medianSeries);
      }

      // 원금 누적선 (점선)
      if (data.principal_line) {
        const principalSeries = chart.addSeries(LineSeries, {
          color: "#A23B72",
          lineWidth: 2,
          lineType: 1, // 점선
          crosshairMarkerVisible: false,
          lastValueVisible: false,
          priceLineVisible: false,
        });

        const principalData: LineData[] = data.principal_line.map(
          (value, index) => ({
            time: dateArray[index],
            value: value,
          })
        );

        principalSeries.setData(principalData);
        seriesRef.current.push(principalSeries);
      }

      // 대표 경로들
      if (data.representative) {
        // 최고 성과 (상위 5%)
        const bestSeries = chart.addSeries(LineSeries, {
          color: "#F18F01",
          lineWidth: 1,
          crosshairMarkerVisible: false,
          lastValueVisible: false,
          priceLineVisible: false,
        });

        const bestData: LineData[] = data.representative.p95.map(
          (value, index) => ({
            time: dateArray[index],
            value: value,
          })
        );

        bestSeries.setData(bestData);
        seriesRef.current.push(bestSeries);

        // 최악 성과 (하위 5%)
        const worstSeries = chart.addSeries(LineSeries, {
          color: "#C73E1D",
          lineWidth: 1,
          crosshairMarkerVisible: false,
          lastValueVisible: false,
          priceLineVisible: false,
        });

        const worstData: LineData[] = data.representative.p05.map(
          (value, index) => ({
            time: dateArray[index],
            value: value,
          })
        );

        worstSeries.setData(worstData);
        seriesRef.current.push(worstSeries);
      }

      // 랜덤 샘플들
      if (data.random_samples) {
        const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6"];

        data.random_samples.slice(0, 5).forEach((path, index) => {
          const lineSeries = chart.addSeries(LineSeries, {
            color: colors[index],
            lineWidth: 1,
            crosshairMarkerVisible: false,
            lastValueVisible: false,
            priceLineVisible: false,
          });

          const lineData: LineData[] = path.map((value, monthIndex) => ({
            time: dateArray[monthIndex],
            value: value,
          }));

          lineSeries.setData(lineData);
          seriesRef.current.push(lineSeries);
        });
      }
    } else {
      // 기존 데이터 구조 처리 (호환성 유지)
      const paths = monthlyPaths as number[][];
      const colors = [
        "#ef4444", // red-500
        "#f97316", // orange-500
        "#eab308", // yellow-500
        "#22c55e", // green-500
        "#3b82f6", // blue-500
      ];

      const topPaths = paths.slice(0, 5);

      topPaths.forEach((path, index) => {
        const lineSeries = chart.addSeries(LineSeries, {
          color: colors[index],
          lineWidth: 2,
          crosshairMarkerVisible: false,
          lastValueVisible: false,
          priceLineVisible: false,
        });

        const data: LineData[] = [];

        for (let year = 1; year <= targetYears; year++) {
          const yearStartMonth = (year - 1) * 12;
          const yearEndMonth = Math.min(yearStartMonth + 11, path.length - 1);

          if (yearStartMonth < path.length) {
            const yearValues = path.slice(yearStartMonth, yearEndMonth + 1);
            const yearAverage =
              yearValues.reduce((sum, val) => sum + val, 0) / yearValues.length;

            // 오늘 날짜부터 시작하는 날짜 사용
            const dateIndex = yearStartMonth;
            if (dateIndex < dateArray.length) {
              data.push({
                time: dateArray[dateIndex],
                value: yearAverage,
              });
            }
          }
        }

        lineSeries.setData(data);
        seriesRef.current.push(lineSeries);
      });
    }

    // 가로 축 레이블 커스터마이징
    chart.timeScale().applyOptions({
      timeVisible: true, // 시간 표시 활성화
      secondsVisible: false,
    });

    // 차트 크기 조정
    const resizeObserver = new ResizeObserver(() => {
      if (chartContainerRef.current && chartRef.current) {
        try {
          chart.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
        } catch (error) {
          console.log("Chart disposed during resize");
        }
      }
    });

    if (chartContainerRef.current) {
      resizeObserver.observe(chartContainerRef.current);
    }

    // 클린업
    return () => {
      resizeObserver.disconnect();
      if (chartRef.current) {
        try {
          chartRef.current.remove();
        } catch (error) {
          console.log("Chart already disposed during cleanup");
        }
        chartRef.current = null;
      }
      seriesRef.current = [];
    };
  }, [monthlyPaths, targetYears]);

  if (
    !monthlyPaths ||
    (Array.isArray(monthlyPaths) && monthlyPaths.length === 0) ||
    (!Array.isArray(monthlyPaths) && !monthlyPaths.fan_bands)
  ) {
    return null;
  }

  const isNewDataStructure =
    !Array.isArray(monthlyPaths) && monthlyPaths.fan_bands;
  const topPaths = Array.isArray(monthlyPaths) ? monthlyPaths.slice(0, 5) : [];
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-red-500",
  ];

  return (
    <div
      className={`bg-white rounded-2xl p-6 border border-gray-200 ${className}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <h4 className="text-lg font-semibold text-gray-800">
          {isNewDataStructure
            ? "포트폴리오 가치 예측 (Monte Carlo 시뮬레이션)"
            : "월별 가격 경로 (상위 5개)"}
        </h4>
      </div>

      <div className="relative">
        <div
          ref={chartContainerRef}
          className="w-full"
          style={{ paddingBottom: "30px" }}
        />

        {/* 범례 */}
        <div className="flex flex-wrap gap-3 mt-4">
          {isNewDataStructure ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-200"></div>
                <span className="text-xs text-gray-600">
                  예상 범위 (5%~95%)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                <span className="text-xs text-gray-600">
                  예상 범위 (25%~75%)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <span className="text-xs text-gray-600">중앙값 (50%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-xs text-gray-600">납입 원금 누적</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-xs text-gray-600">
                  최고 성과 (상위 5%)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-xs text-gray-600">
                  최악 성과 (하위 5%)
                </span>
              </div>
            </>
          ) : (
            topPaths.map((_, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${colors[index]}`}></div>
                <span className="text-xs text-gray-600">경로 {index + 1}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-3">
        {isNewDataStructure
          ? "Monte Carlo 시뮬레이션을 통한 포트폴리오 가치 예측입니다. 색상 영역은 예상 범위를, 선은 대표 경로를 나타냅니다."
          : "상위 5개 시뮬레이션 경로를 보여줍니다. 각 경로는 다른 시나리오에서의 예상 가격 변동을 나타냅니다."}
      </p>
    </div>
  );
};
