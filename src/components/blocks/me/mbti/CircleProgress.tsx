import React from "react";

interface CircleProgressProps {
  percentage: number; // 0~100
  size?: number; // px
  strokeWidth?: number; // px
  color?: string;
  bgColor?: string;
  children?: React.ReactNode;
}

export default function CircleProgress({
  percentage,
  size = 80,
  strokeWidth = 8,
  color = "#22c55e", // Tailwind green-500
  bgColor = "#e5e7eb", // Tailwind gray-200
  children,
}: CircleProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percentage / 100);

  return (
    <svg width={size} height={size} className="block">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={bgColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.5s" }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size * 0.22}
        fontWeight="bold"
        fill={color}
      >
        {children}
      </text>
    </svg>
  );
} 