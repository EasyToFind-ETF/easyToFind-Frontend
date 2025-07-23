import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { useRouter } from "next/navigation";

interface ETFCardProps {
  name: string;
  score: number;
  etf_code: string;
  details: {
    label: string;
    value: number;
    color: string; // 점수별 색상
  }[];
}

export default function ETFCard({ name, score, etf_code, details }: ETFCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/etfs/${etf_code}`);
  };

  // 점수에 따른 색상 반환 함수
  const getScoreColor = (score: number) => {
    if (score >= 70) return "#22c55e"; // 초록색
    if (score >= 40) return "#f97316"; // 주황색
    if (score >= 15) return "#eab308"; // 노란색
    return "#ef4444"; // 빨간색
  };

  const scoreColor = getScoreColor(score);

  // 원형 차트 데이터 생성
  const pieData = [
    {
      id: 'score',
      value: score,
      color: scoreColor
    },
    {
      id: 'remaining',
      value: 100 - score,
      color: '#E5E7EB' // 회색 배경
    }
  ];

  return (
    <div 
      className="bg-white rounded-2xl shadow p-8 px-12 flex flex-col min-w-[800px] cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
    >
      <h2 className="text-2xl font-bold mb-2">{name}</h2>
      <div className="flex items-center mb-4">
        {/* 원형 차트로 점수 표시 */}
        <div className="text-center mr-6 flex flex-col items-center px-6">
          <div className="text-lg font-semibold mb-2 mt-2">종합점수</div>
          <div style={{ width: 120, height: 120, margin: "0 auto" }}>
            <ResponsivePie
              data={pieData}
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
                'arcs',
                ({ centerX, centerY }) => (
                  <>
                    <text
                      x={centerX}
                      y={centerY - 8}
                      textAnchor="middle"
                      dominantBaseline="central"
                      style={{ fontSize: 24, fill: scoreColor, fontWeight: 600 }}
                    >
                      {score}
                    </text>
                    <text
                      x={centerX}
                      y={centerY + 12}
                      textAnchor="middle"
                      dominantBaseline="central"
                      style={{ fontSize: 12, fill: scoreColor, fontWeight: 600 }}
                    >
                      점
                    </text>
                  </>
                ),
              ]}
            />
          </div>
        </div>
        {/* 점수 구성 */}
        <div >
          <div className="text-lg px-6 mb-2">점수구성</div>
          <div className="flex ms-24 gap-28 px-16">
            {details.map((d) => (
              <div key={d.label} className="flex flex-col items-end">
                <span className="text-lg mb-2">{d.label}</span>
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: d.color }}
                  />
                  <span className="text-lg font-bold" style={{ color: d.color }}>{d.value}</span>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 