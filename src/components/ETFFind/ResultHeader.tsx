type Props = {
    viewMode: string;
    setViewMode: (mode: string) => void;
    count: number;
  };
  
  export default function ResultHeader({ viewMode, setViewMode, count }: Props) {
    return (
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-blue-600 font-medium">
            전체에 대한 <span className="font-bold">{count}</span>건의 검색결과가 있습니다.
          </span>
          <div className="flex gap-2 ml-2 text-xs">
            {["ETF로 보기", "구성종목으로 보기"].map((mode) => (
              <button
                key={mode}
                className="flex items-center gap-1 text-xs font-semibold text-black"
                onClick={() => setViewMode(mode)}
                style={{ opacity: viewMode === mode ? 1 : 0.6 }}
              >
                <span className={viewMode === mode ? "text-blue-600" : "text-blue-300"}>
                  {viewMode === mode ? "●" : "○"}
                </span>
                {mode === "ETF로 보기" ? "ETF별 보기" : "종목별 보기"}
              </button>
            ))}
          </div>
        </div>
        <div className="text-xs text-gray-500 ml-2 whitespace-nowrap">
          기준가(원), 순자산(억), 수익률: 25.0707
        </div>
      </div>
    );
  }
  