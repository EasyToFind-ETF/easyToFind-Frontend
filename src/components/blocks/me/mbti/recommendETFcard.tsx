import React from "react";

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
        {/* 원형 차트 대신 점수만 표시 */}
        <div className="text-center mr-6 flex flex-col items-start">
          <div className="text-lg font-semibold">종합점수</div>
          <div className="text-2xl font-bold text-green-600">{score}%</div>
        </div>
        {/* 점수 구성 */}
        <div >
          <div className="font-semibold mb-2">점수구성</div>
          <div className="flex gap-4">
            {details.map((d) => (
              <div key={d.label} className="flex flex-col items-end">
                <span
                  className={`w-6 h-6 rounded-full mb-1`}
                  style={{ background: d.color }}
                ></span>
                <span className="text-sm">{d.label}</span>
                <span className="font-bold">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 