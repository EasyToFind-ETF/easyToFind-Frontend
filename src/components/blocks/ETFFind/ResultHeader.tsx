import React from "react";

function getYesterdayLabel() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return `${yesterday.getFullYear()}.${String(
    yesterday.getMonth() + 1
  ).padStart(2, "0")}.${String(yesterday.getDate()).padStart(2, "0")}`;
}

interface ResultHeaderProps {
  viewMode: string;
  setViewMode: (mode: string) => void;
  count: number;
}

const ResultHeader: React.FC<ResultHeaderProps> = ({
  viewMode,
  setViewMode,
  count,
}) => {
  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex items-center justify-between">
        <span className="text-black font-medium">
          전체에 대한 <span className="font-bold text-[#0046ff]">{count}</span>
          건의 검색결과가 있습니다.
        </span>
      </div>
      <div className="flex items-end justify-between">
        <div className="flex gap-4">
          {["ETF로 보기", "구성종목으로 보기"].map((mode) => (
            <button
              key={mode}
              className="flex items-center gap-1 text-black text-sm"
              onClick={() => setViewMode(mode)}
              style={{ opacity: viewMode === mode ? 1 : 0.6 }}
            >
              <input
                type="radio"
                checked={viewMode === mode}
                onChange={() => setViewMode(mode)}
                className="accent-[#0046ff] w-4 h-4"
                name="viewMode"
              />
              {mode === "ETF로 보기" ? "ETF별 보기" : "종목별 보기"}
            </button>
          ))}
        </div>

        <div className="text-xs text-gray-500 whitespace-nowrap">
          수익률 기준일: {getYesterdayLabel()}
        </div>
      </div>
    </div>
  );
};

export default ResultHeader;
