import { TrendingUp, TrendingDown } from "lucide-react";

interface MonthlyPathsChartProps {
  monthlyPaths: number[][];
  className?: string;
}

export const MonthlyPathsChart = ({
  monthlyPaths,
  className = "",
}: MonthlyPathsChartProps) => {
  if (!monthlyPaths || monthlyPaths.length === 0) {
    return null;
  }

  // 상위 5개 경로만 표시
  const topPaths = monthlyPaths.slice(0, 5);
  const months = Array.from(
    { length: topPaths[0]?.length || 0 },
    (_, i) => i + 1
  );

  // 색상 배열
  const colors = [
    "stroke-blue-500",
    "stroke-green-500",
    "stroke-purple-500",
    "stroke-orange-500",
    "stroke-red-500",
  ];

  // 최대값과 최소값 계산
  const allValues = topPaths.flat();
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);
  const range = maxValue - minValue;

  // SVG 크기
  const width = 400;
  const height = 200;
  const padding = 40;

  // 좌표 변환 함수
  const getX = (month: number) =>
    padding + ((month - 1) / (months.length - 1)) * (width - 2 * padding);
  const getY = (value: number) =>
    height - padding - ((value - minValue) / range) * (height - 2 * padding);

  // 경로 생성 함수
  const createPath = (path: number[]) => {
    if (path.length === 0) return "";

    const points = path.map((value, index) => {
      const x = getX(index + 1);
      const y = getY(value);
      return `${x},${y}`;
    });

    return `M ${points.join(" L ")}`;
  };

  return (
    <div
      className={`bg-white rounded-2xl p-6 border border-gray-200 ${className}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        <h4 className="text-lg font-semibold text-gray-800">
          월별 가격 경로 (상위 5개)
        </h4>
      </div>

      <div className="relative">
        <svg width={width} height={height} className="w-full">
          {/* 그리드 라인 */}
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Y축 라벨 */}
          {[0, 25, 50, 75, 100].map((percent) => {
            const value = minValue + (range * percent) / 100;
            const y = getY(value);
            return (
              <g key={percent}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <text
                  x={padding - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-xs text-gray-500"
                >
                  {value.toLocaleString()}
                </text>
              </g>
            );
          })}

          {/* X축 라벨 */}
          {months.map((month) => {
            const x = getX(month);
            return (
              <text
                key={month}
                x={x}
                y={height - padding + 20}
                textAnchor="middle"
                className="text-xs text-gray-500"
              >
                {month}개월
              </text>
            );
          })}

          {/* 경로 라인 */}
          {topPaths.map((path, index) => (
            <path
              key={index}
              d={createPath(path)}
              fill="none"
              strokeWidth="2"
              className={colors[index]}
              opacity="0.8"
            />
          ))}
        </svg>

        {/* 범례 */}
        <div className="flex flex-wrap gap-3 mt-4">
          {topPaths.map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${colors[index].replace(
                  "stroke-",
                  "bg-"
                )}`}
              ></div>
              <span className="text-xs text-gray-600">경로 {index + 1}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-3">
        상위 5개 시뮬레이션 경로를 보여줍니다. 각 경로는 다른 시나리오에서의
        예상 가격 변동을 나타냅니다.
      </p>
    </div>
  );
};
