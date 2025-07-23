import React from "react";

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 80,
  strokeWidth = 8,
  color = "#4DB6FF",
  label,
  className = "",
}) => {
  // value를 안전하게 숫자로 변환
  const numericValue = typeof value === "number" ? value : Number(value) || 0;

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(Math.max(numericValue, 0), max);
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / max) * circumference;

  const getColor = (value: number) => {
    if (value >= 70) return "#10B981"; // green-500
    if (value >= 40) return "#F59E0B"; // yellow-500
    return "#EF4444"; // red-500
  };

  const finalColor = color === "#4DB6FF" ? getColor(numericValue) : color;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* 배경 원 */}
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* 진행률 원 */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={finalColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        {/* 중앙 텍스트 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-800">
              {numericValue.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500">%</div>
          </div>
        </div>
      </div>
      {label && (
        <div className="text-xs text-gray-600 mt-2 text-center font-medium">
          {label}
        </div>
      )}
    </div>
  );
};
