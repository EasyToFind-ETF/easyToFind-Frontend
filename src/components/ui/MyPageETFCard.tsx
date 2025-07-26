import { Heart, TrendingUp, TrendingDown } from "lucide-react";
import { useRouter } from 'next/navigation';

interface MyPageETFCardProps {
  etf: {
    etf_code: string;
    etf_name: string;
    latest_price: string;
    provider: string;
    total_score?: number | null;
    isLiked: boolean;
    [key: string]: any;
  };
  selectedPeriod: string;
  onToggleLike: (etfCode: string) => void;
  formatPrice: (price: string) => string;
  formatChange: (change: string) => string;
  getCurrentPeriodLabel: () => string;
}

export default function MyPageETFCard({
  etf,
  selectedPeriod,
  onToggleLike,
  formatPrice,
  formatChange,
  getCurrentPeriodLabel,
}: MyPageETFCardProps) {
  const router = useRouter();
  const currentReturn = etf[selectedPeriod];
  const returnValue = Number.parseFloat(currentReturn);
  const isPositive = returnValue >= 0;

  // getScoreColor 함수를 컴포넌트 내부에서 정의 (5개 구간)
  const getScoreColor = (score: number) => {
    if (score >= 80) return "#3b82f6";
    if (score >= 60) return "#22c55e";
    if (score >= 40) return "#eab308";
    if (score >= 20) return "#f97316";
    return "#ef4444";
  };

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      onToggleLike(etf.etf_code);
    } catch (err) {
      console.error("관심 ETF 토글 실패:", err);
    }
  };

  const handleCardClick = () => {
    router.push(`/etfs/${etf.etf_code}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-3xl p-6 shadow-lg border-2 border-gray-200 hover:shadow-xl transition-all duration-300 min-w-[320px] flex-shrink-0 cursor-pointer hover:scale-[1.02]"
    >
      <div className="flex flex-col">
        {/* Top Section */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-gray-700">{etf.etf_code}</span>
          <button
            onClick={handleHeartClick}
            className="p-2 mr-2 rounded-full transition-colors"
          >
            <svg
              className={`w-6 h-6 transition-colors ${
                etf.isLiked
                  ? "text-red-500 fill-current"
                  : "text-gray-400 hover:text-red-400"
              }`}
              fill={etf.isLiked ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>

        {/* Product Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight min-h-[3.5rem] flex items-start">
          <span className="line-clamp-2">{etf.etf_name}</span>
        </h3>
        
        {/* Provider */}
        <p className="text-sm text-gray-600 mb-3">{etf.provider}</p>

        {/* Total Score Circle Chart */}
        {etf.total_score != null && (
          <div className="flex justify-center py-3">
            <div className="flex flex-col items-center space-y-2">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    stroke="#f3f4f6"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    stroke={getScoreColor(etf.total_score)}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 35}`}
                    strokeDashoffset={`${2 * Math.PI * 35 * (1 - etf.total_score / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-base font-bold"
                    style={{ color: getScoreColor(etf.total_score) }}
                  >
                    {etf.total_score}
                  </span>
                </div>
              </div>
              <span className="text-xs font-medium text-gray-600">종합점수</span>
            </div>
          </div>
        )}

        {/* Return Rate */}
        <div className="text-end mb-8">
          {isNaN(returnValue) ? (
            <span className="text-xl font-medium text-gray-400">-</span>
          ) : (
            <div className="flex items-center justify-end gap-2">
              
              <span className={`text-xl font-medium ${isPositive ? 'text-red-500' : 'text-blue-500'}`}>
                {isPositive ? '+' : ''}{formatChange(currentReturn)}%
              </span>
            </div>
          )}
          <p className="text-xs text-gray-500">{getCurrentPeriodLabel()}</p>
        </div>

        {/* Current Price Section */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">현재가</p>
            <p className="text-lg font-bold text-gray-900">{formatPrice(etf.latest_price)} 원</p>
          </div>
        </div>
      </div>
    </div>
  );
} 