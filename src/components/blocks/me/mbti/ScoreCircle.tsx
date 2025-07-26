import React from "react";

export default function ScoreCircle({ percent }: { percent: number }) {
  const radius = 48;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <svg width={radius * 2} height={radius * 2} className="block">
      <circle
        stroke="#e5e7eb"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="#22c55e"
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        style={{ transition: "stroke-dashoffset 0.5s" }}
      />
      <text
        x="50%"
        y="45%"
        textAnchor="middle"
        fontSize="1.1rem"
        fontWeight="bold"
        fill="#222"
        dominantBaseline="middle"
      >
        종합점수
      </text>
      <text
        x="50%"
        y="65%"
        textAnchor="middle"
        fontSize="1.3rem"
        fontWeight="bold"
        fill="#22c55e"
        dominantBaseline="middle"
      >
        {percent}점
      </text>
    </svg>
  );
} 