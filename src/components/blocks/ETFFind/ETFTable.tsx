import { useState } from "react";
import { ETFView } from "../../../types/ETFView";
import Link from "next/link";
import { Heart } from "lucide-react";

const MAX_SELECT = 5;

interface ETFTableProps {
  etfData: ETFView[];
  selectedEtfCodes: string[];
  setSelectedEtfCodes: React.Dispatch<React.SetStateAction<string[]>>;
  favoriteEtfCodes: string[];
  onToggleFavorite: (etfCode: string, isAlreadyFavorite: boolean) => void;
  onCompare: () => void;
}

export default function ETFTable({
  etfData,
  selectedEtfCodes,
  setSelectedEtfCodes,
  favoriteEtfCodes,
  onToggleFavorite,
  onCompare,
}: ETFTableProps) {
  const [showMaxToast, setShowMaxToast] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const renderRate = (value: string) => {
    const number = parseFloat(value);
    if (isNaN(number)) return value;
    return (
      <span className={number >= 0 ? "text-red-600" : "text-blue-600"}>
        {value}
      </span>
    );
  };

  const toggleSelect = (etfCode: string) => {
    if (selectedEtfCodes.includes(etfCode)) {
      setSelectedEtfCodes(selectedEtfCodes.filter((code) => code !== etfCode));
    } else {
      if (selectedEtfCodes.length >= MAX_SELECT) {
        setShowMaxToast(true);
        setTimeout(() => setShowMaxToast(false), 1500);
        return;
      }
      setSelectedEtfCodes([...selectedEtfCodes, etfCode]);
    }
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(etfData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = etfData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 페이지 변경 시 선택된 항목 초기화 (선택사항)
    // setSelectedEtfCodes([]);
  };

  if (!etfData || etfData.length === 0) {
    return (
      <div className="py-20 text-center text-gray-500">
        해당하는 ETF가 없습니다.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto relative">
      <table className="min-w-full text-center">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 px-2 font-medium text-gray-600 w-20"></th>
            <th className="py-3 px-2 font-normal text-gray-600 w-1/4">
              상품명
            </th>
            <th className="py-3 px-2 font-normal text-gray-600 w-1/12">
              기준가(원)
            </th>
            {["1주", "1개월", "3개월", "6개월", "1년", "3년", "상장이후"].map(
              (period) => (
                <th
                  key={period}
                  className="py-3 px-2 font-normal text-gray-600 whitespace-nowrap w-1/12"
                >
                  {period}
                </th>
              )
            )}
            <th className="py-3 px-2 font-normal text-gray-600 w-20"></th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((etf, i) => {
            const isFavorite = favoriteEtfCodes.includes(etf.etfCode);
            return (
              <tr key={etf.etfCode} className="hover:bg-gray-50 border-t h-16">
                {/* 체크박스 */}
                <td className="pt-4 pb-2 pl-4 pr-2">
                  <input
                    type="checkbox"
                    checked={selectedEtfCodes.includes(etf.etfCode)}
                    onChange={() => toggleSelect(etf.etfCode)}
                    className="accent-blue-500 w-5 h-5"
                    disabled={
                      !selectedEtfCodes.includes(etf.etfCode) &&
                      selectedEtfCodes.length >= MAX_SELECT
                    }
                  />
                </td>
                <td className="py-3 px-2 text-left font-medium text-gray-900 hover:underline cursor-pointer">
                  <Link href={`/etfs/${etf.etfCode}`}>{etf.name}</Link>
                </td>
                <td className="py-3 px-2">
                  {etf.nav ? Number(etf.nav).toLocaleString("ko-KR") : "-"}
                </td>
                <td className="py-3 px-2">{renderRate(etf.week1)}</td>
                <td className="py-3 px-2">{renderRate(etf.month1)}</td>
                <td className="py-3 px-2">{renderRate(etf.month3)}</td>
                <td className="py-3 px-2">{renderRate(etf.month6)}</td>
                <td className="py-3 px-2">{renderRate(etf.year1)}</td>
                <td className="py-3 px-2">{renderRate(etf.year3)}</td>
                <td className="py-3 px-2">{renderRate(etf.inception)}</td>
                {/* 하트 아이콘 */}
                <td className="py-3 pl-2 pr-4">
                  <button
                    onClick={() => onToggleFavorite(etf.etfCode, isFavorite)}
                    className="p-2 rounded-full transition-colors"
                    aria-label={isFavorite ? "관심 해제" : "관심 등록"}
                  >
                    <svg
                      className={`w-4 h-4 transition-colors ${
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-20 mb-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            &lt; 이전
          </button>

          {(() => {
            const pages = [];
            const startPage = Math.max(1, currentPage - 2);
            const endPage = Math.min(totalPages, currentPage + 2);

            // 현재 페이지 주변 5개 페이지 계산
            let displayStart = startPage;
            let displayEnd = endPage;

            // 5개가 되도록 조정
            if (endPage - startPage < 4) {
              if (startPage === 1) {
                displayEnd = Math.min(totalPages, startPage + 4);
              } else if (endPage === totalPages) {
                displayStart = Math.max(1, endPage - 4);
              }
            }

            for (let i = displayStart; i <= displayEnd; i++) {
              pages.push(i);
            }

            return pages.map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  currentPage === page
                    ? "bg-[#0046ff] text-white border border-[#0046ff]"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ));
          })()}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다음 &gt;
          </button>
        </div>
      )}

      {/* 페이지 정보 */}
      <div className="text-center text-sm text-gray-500 mb-4">
        {startIndex + 1}-{Math.min(endIndex, etfData.length)} / {etfData.length}
        개
      </div>

      {/* 하단 토스트바 */}
      {selectedEtfCodes.length > 0 && (
        <div
          style={{
            position: "fixed",
            left: 0,
            bottom: 0,
            width: "100%",
            zIndex: 50,
          }}
          className="flex items-center justify-between bg-white border-t border-[#4DB6FF] shadow-lg px-20 py-4 animate-fade-in"
        >
          <span className="text-[#0046ff] font-semibold">
            {selectedEtfCodes.length} / {MAX_SELECT}개 선택됨
          </span>
          <button
            className="bg-[#0046ff] hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow"
            onClick={() => {
              const hasToken = document.cookie.includes("authToken");
              if (!hasToken) {
                alert("로그인 후 이용해주세요!");
                return;
              }
              onCompare();
            }}
          >
            비교하기
          </button>
        </div>
      )}
      {/* 최대 선택 안내 토스트 */}
      {showMaxToast && (
        <div
          style={{
            position: "fixed",
            left: "50%",
            bottom: 80,
            transform: "translateX(-50%)",
            zIndex: 60,
          }}
          className="bg-red-500 text-white px-4 py-2 rounded shadow animate-fade-in"
        >
          최대 5개까지만 선택할 수 있습니다.
        </div>
      )}
    </div>
  );
}
