import { useState } from "react";
import { HoldingView } from "../../types/HoldingView";

export default function HoldingTable({ holdingsData }: { holdingsData: HoldingView[] }) {
  const [selected, setSelected] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleSelect = (idx: number) => {
    setSelected(selected.includes(idx) ? selected.filter(i => i !== idx) : [...selected, idx]);
  };

  const toggleFavorite = (idx: number) => {
    setFavorites(favorites.includes(idx) ? favorites.filter(i => i !== idx) : [...favorites, idx]);
  };

  return (
    <div className="overflow-x-auto rounded-2xl">
      <table className="min-w-full text-center">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 px-2 font-semibold text-gray-900 w-8"></th>
            <th className="py-3 px-2 font-semibold text-gray-900 min-w-[200px]">ETF명</th>
            <th className="py-3 px-2 font-semibold text-gray-900">종목명</th>
            <th className="py-3 px-2 font-semibold text-gray-900">비중(%)</th>
            <th className="py-3 px-2 font-semibold text-gray-900 w-8"></th>
          </tr>
        </thead>
        <tbody>
          {holdingsData.map((holding, i) => (
            <tr key={i} className="hover:bg-gray-50 border-t">
              {/* 체크박스 */}
              <td className="py-3 px-2">
                <input
                  type="checkbox"
                  checked={selected.includes(i)}
                  onChange={() => toggleSelect(i)}
                  className="accent-blue-500 w-5 h-5"
                />
              </td>
              <td className="py-3 px-2 text-left font-medium">{holding.etfName}</td>
              <td className="py-3 px-2">{holding.holdingName}</td>
              <td className="py-3 px-2">{holding.weight}</td>
              {/* 하트 아이콘 */}
              <td className="py-3 px-2">
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleFavorite(i)}
                  className={favorites.includes(i) ? "text-red-500" : "text-gray-300"}
                  title={favorites.includes(i) ? "관심 해제" : "관심 등록"}
                >
                  &#10084;
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 