import Link from 'next/link';

interface ETFCardProps {
  etf_code: string;
  etf_name: string;
  close_price: string;
  trade_date: string;
}

export default function ETFCard({ etf_code, etf_name, close_price, trade_date }: ETFCardProps) {
  const formatPrice = (price: string) => {
    return Number(price).toLocaleString('ko-KR');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <Link href={`/etfs/${etf_code}`}>
      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 min-w-[320px] h-[280px] flex-shrink-0 cursor-pointer hover:scale-[1.02]">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500 font-medium">{etf_code}</span>
              
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-4 line-clamp-2 leading-tight">
              {etf_name}
            </h3>
            
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-500">
                {formatPrice(close_price)}원
              </span>
            </div>
            <span className="text-xs text-gray-400 items-end justify-end">{formatDate(trade_date)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
} 