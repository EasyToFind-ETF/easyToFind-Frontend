import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import {
  toggleFavorite,
  fetchFavoriteEtfCodes,
} from "@/services/etfFavoriteService";
import { useState } from 'react';

interface ETFCardProps {
  etf_code: string;
  etf_name: string;
  close_price: string;
  trade_date: string;
  week1: string;
  is_personal_pension: boolean;
  is_retire_pension: boolean;
  index?: number;
}

export default function ETFCard({ 
  etf_code, 
  etf_name, 
  close_price, 
  trade_date, 
  week1,
  is_personal_pension,
  is_retire_pension,
  index = 1 
}: ETFCardProps) {
  const router = useRouter();
  const formatPrice = (price: string) => {
    return Number(price).toLocaleString('ko-KR');
  };
  const [isFavorite, setIsFavorite] = useState(false);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };
  const handleHeartClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // 카드 클릭 이벤트 방지

    try {
      await toggleFavorite(etf_code, isFavorite);
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("관심 ETF 토글 실패:", err);
      alert("로그인 후 이용해주세요!");
    }
  };

  const handleCardClick = () => {
    router.push(`/etfs/${etf_code}`);
  };

  // week1 값을 수익률로 변환
  const returnRate = parseFloat(week1) || 0;
  const isPositive = returnRate >= 0;

  // 연금 타입 텍스트 생성
  const getPensionTypes = () => {
    const types = [];
    if (is_personal_pension) types.push('개인연금');
    if (is_retire_pension) types.push('퇴직연금');
    return types.join(' | ');
  };

  return (
<div
  onClick={handleCardClick}
  className="w-[25vw] max-w-[300px] min-w-[250px]
             bg-white rounded-3xl p-6 shadow-lg border-2 border-gray-200 
             hover:shadow-xl transition-all duration-300 
             cursor-pointer hover:scale-[1.02]"
>

      <div className="flex flex-col">
        {/* Top Section */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-gray-700">{etf_code}</span>
         {/* 하트 버튼 */}
         <button
          onClick={handleHeartClick}
          className="p-2 mr-2 rounded-full transition-colors"
        >
          <svg
            className={`w-6 h-6 transition-colors ${
              isFavorite
                ? "text-red-500 fill-current"
                : "text-gray-400 hover:text-red-400"
            }`}
            fill={isFavorite ? "currentColor" : "none"}
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
        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight min-h-[3.5rem]">
          <span className="block w-full break-words line-clamp-2">{etf_name}</span>
        </h3>


        
        {/* Product Code */}
        <p className="text-sm text-gray-600 mb-3">{etf_code}</p>
        
        {/* Account Types */}
        <p className={`text-xs text-gray-500 mb-4 ${getPensionTypes() ? 'visible' : 'invisible'}`}>
          {getPensionTypes() || '개인연금 | 퇴직연금'}
        </p>

        {/* Return Rate */}
        <div className="text-end mb-8">
          <span className={`text-3xl font-medium ${isPositive ? 'text-red-600' : 'text-blue-600'}`}>
            {isPositive ? '+' : ''}{returnRate.toFixed(2)}%
          </span>
          <p className="text-xs text-gray-500">*1주 수익률</p>
        </div>

        {/* Current Price Section */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">현재가</p>
            <p className="text-lg font-bold text-gray-900">{formatPrice(close_price)} 원</p>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">기준일</p>
            <p className="text-xs text-gray-600">{formatDate(trade_date)}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 