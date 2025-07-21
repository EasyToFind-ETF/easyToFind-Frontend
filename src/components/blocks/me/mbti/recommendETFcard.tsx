import React from "react";
import CircleProgress from "./CircleProgress";

interface ETFCardProps {
  name: string;
  score: number;
  details: {
    label: string;
    value: number;
    color: string; // 점수별 색상
  }[];
}

export default function ETFCard({ name, score, details }: ETFCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 flex flex-col min-w-[800px]">
      <h2 className="text-2xl font-bold mb-2">{name}</h2>
      <div className="flex items-center mb-4">
        {/* 원형 차트로 점수 표시 */}
        <div className="text-center mr-6 flex flex-col items-center">
          <div className="text-lg font-semibold mb-2 mt-2">종합점수</div>
          <CircleProgress percentage={score}>
            {score}
          </CircleProgress>
        </div>
        {/* 점수 구성 */}
        <div >
          <div className="font-semibold ml-2 mb-2">점수구성</div>
          <div className="flex ms-24 gap-16">
            {details.map((d) => (
              <div key={d.label} className="flex flex-col items-end">
                <span className="text-sm mb-2">{d.label}</span>
                <span className="font-bold">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 