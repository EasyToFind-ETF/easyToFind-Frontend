import { useState } from "react";
import { HoldingView } from "../../../types/HoldingView";
import Link from "next/link";

const MAX_SELECT = 5;

interface HoldingTableProps {
  holdingsData: HoldingView[];
  selectedEtfCodes: string[];
  setSelectedEtfCodes: React.Dispatch<React.SetStateAction<string[]>>;
  favoriteEtfCodes: string[];
  onToggleFavorite: (etfCode: string, isAlreadyFavorite: boolean) => void;
  onCompare: () => void;
}

export default function HoldingTable({
  holdingsData,
  selectedEtfCodes,
  setSelectedEtfCodes,
  favoriteEtfCodes,
  onToggleFavorite,
  onCompare,
}: HoldingTableProps) {
  const [showMaxToast, setShowMaxToast] = useState(false);

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

  if (!holdingsData || holdingsData.length === 0) {
    return (
      <div className="py-20 text-center text-gray-500">
        해당하는 ETF가 없습니다.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl relative">
      <table className="min-w-full text-center">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 px-2 font-semibold text-gray-900 w-8"></th>
            <th className="py-3 px-2 font-semibold text-gray-900 min-w-[200px]">
              ETF명
            </th>
            <th className="py-3 px-2 font-semibold text-gray-900">종목명</th>
            <th className="py-3 px-2 font-semibold text-gray-900">비중(%)</th>
            <th className="py-3 px-2 font-semibold text-gray-900 w-8"></th>
          </tr>
        </thead>
        <tbody>
          {holdingsData.map((holding, i) => {
            const isFavorite = favoriteEtfCodes.includes(holding.etfCode);
            return (
              <tr key={i} className="hover:bg-gray-50 border-t">
                {/* 체크박스 */}
                <td className="py-3 px-2">
                  <input
                    type="checkbox"
                    checked={selectedEtfCodes.includes(holding.etfCode)}
                    onChange={() => toggleSelect(holding.etfCode)}
                    className="accent-[#0046ff] w-5 h-5"
                    disabled={
                      !selectedEtfCodes.includes(holding.etfCode) &&
                      selectedEtfCodes.length >= MAX_SELECT
                    }
                  />
                </td>
                <td className="py-3 px-2 text-left text-gray-900 hover:underline font-medium">
                  <Link href={`/etfs/${holding.etfCode}`}>
                    {holding.etfName}
                  </Link>
                </td>
                <td className="py-3 px-2">{holding.holdingName}</td>
                <td className="py-3 px-2">{holding.weight}</td>
                {/* 하트 아이콘 */}
                <td className="py-3 px-2">
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      onToggleFavorite(holding.etfCode, isFavorite)
                    }
                    className={isFavorite ? "text-red-500" : "text-gray-300"}
                    title={isFavorite ? "관심 해제" : "관심 등록"}
                  >
                    &#10084;
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
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
          className="flex items-center justify-between bg-white border-t border-blue-200 shadow-lg px-6 py-4 animate-fade-in"
        >
          <span className="text-[#0046ff] font-semibold">
            {selectedEtfCodes.length}/{MAX_SELECT}개 선택됨
          </span>
          <button
            className="bg-blue-500 hover:bg-[#0046ff] text-white font-bold py-2 px-6 rounded-full shadow"
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
