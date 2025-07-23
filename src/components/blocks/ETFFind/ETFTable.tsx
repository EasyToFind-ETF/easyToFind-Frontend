import { useState } from "react";
import { ETFView } from "../../../types/ETFView";

const MAX_SELECT = 5;

interface ETFTableProps {
  etfData: ETFView[];
  selected: number[];
  setSelected: React.Dispatch<React.SetStateAction<number[]>>;
  favoriteEtfCodes: string[];
  onToggleFavorite: (etfCode: string, isAlreadyFavorite: boolean) => void;
  onCompare: () => void;
}

export default function ETFTable({
  etfData,
  selected,
  setSelected,
  favoriteEtfCodes,
  onToggleFavorite,
  onCompare,
}: ETFTableProps) {
  const [showMaxToast, setShowMaxToast] = useState(false);

  const renderRate = (value: string) => {
    const number = parseFloat(value);
    if (isNaN(number)) return value;
    return <span className={number >= 0 ? "text-red-600" : "text-blue-600"}>{value}</span>;
  };

  const toggleSelect = (idx: number) => {
    if (selected.includes(idx)) {
      setSelected(selected.filter((i) => i !== idx));
    } else {
      if (selected.length >= MAX_SELECT) {
        setShowMaxToast(true);
        setTimeout(() => setShowMaxToast(false), 1500);
        return;
      }
      setSelected([...selected, idx]);
    }
  };

  if (!etfData || etfData.length === 0) {
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
            <th className="py-3 px-2 font-semibold text-gray-900 min-w-[200px]">상품명</th>
            <th className="py-3 px-2 font-semibold text-gray-900">기준가(원)</th>
            {["1주", "1개월", "3개월", "6개월", "1년", "3년", "상장이후"].map((period) => (
              <th key={period} className="py-3 px-2 font-semibold text-gray-900">
                {period}
              </th>
            ))}
            <th className="py-3 px-2 font-semibold text-gray-900 w-8"></th>
          </tr>
        </thead>
        <tbody>
          {etfData.map((etf, i) => {
            const isFavorite = favoriteEtfCodes.includes(etf.etfCode);
            return (
              <tr key={i} className="hover:bg-gray-50 border-t">
                {/* 체크박스 */}
                <td className="py-3 px-2">
                  <input
                    type="checkbox"
                    checked={selected.includes(i)}
                    onChange={() => toggleSelect(i)}
                    className="accent-blue-500 w-5 h-5"
                    disabled={!selected.includes(i) && selected.length >= MAX_SELECT}
                  />
                </td>
                <td className="py-3 px-2 text-left font-medium">{etf.name}</td>
                <td className="py-3 px-2">{etf.nav}</td>
                <td className="py-3 px-2">{renderRate(etf.week1)}</td>
                <td className="py-3 px-2">{renderRate(etf.month1)}</td>
                <td className="py-3 px-2">{renderRate(etf.month3)}</td>
                <td className="py-3 px-2">{renderRate(etf.month6)}</td>
                <td className="py-3 px-2">{renderRate(etf.year1)}</td>
                <td className="py-3 px-2">{renderRate(etf.year3)}</td>
                <td className="py-3 px-2">{renderRate(etf.inception)}</td>
                {/* 하트 아이콘 */}
                <td className="py-3 px-2">
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => onToggleFavorite(etf.etfCode, isFavorite)}
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
      {selected.length > 0 && (
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
          <span className="text-blue-700 font-semibold">{selected.length}/{MAX_SELECT}개 선택됨</span>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow"
            onClick={onCompare} // alert 대신 onCompare 호출
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
  