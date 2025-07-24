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
    className="bg-white shadow p-4 md:p-6 lg:px-12 flex flex-col w-full lg:min-w-[800px] cursor-pointer hover:shadow-lg transition-shadow"
    style={{ borderRadius: 40 }}
    onClick={handleClick}
  >
    <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-4">{name}</h2>
  
    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-start gap-8 md:gap-12 lg:gap-20">
      
      {/* 원형 차트 */}
      <div className="text-center flex flex-col items-center px-2 py-6 md:px-4 lg:px-6 flex-shrink-0">
        <div className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] lg:w-[120px] lg:h-[120px]">
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
                    y={centerY - 6}
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{ fontSize: 20, fill: scoreColor, fontWeight: 600 }}
                  >
                    {score}
                  </text>
                  <text
                    x={centerX}
                    y={centerY + 10}
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{ fontSize: 10, fill: scoreColor, fontWeight: 600 }}
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
      <div className="w-full flex-1">
        <div className="text-base md:text-lg px-2 md:px-4 lg:px-6 mb-4 lg:mb-6 py-4"></div>
        <div className="flex flex-wrap gap-6 md:gap-12 lg:gap-36 px-2 md:px-4 lg:px-16">
          {details.map((d) => (
            <div key={d.label} className="flex flex-col items-start lg:items-end">
              <span className="text-sm md:text-base lg:text-lg mb-1">{d.label}</span>
              <div className="flex items-center gap-1 md:gap-2">
                <span
                  className="w-3 h-3 md:w-4 md:h-4 rounded-full"
                  style={{ backgroundColor: d.color }}
                />
                <span className="text-sm md:text-base lg:text-lg font-bold" style={{ color: d.color }}>
                  {d.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
  
    </div>
  </div>
  
  
  );
} 