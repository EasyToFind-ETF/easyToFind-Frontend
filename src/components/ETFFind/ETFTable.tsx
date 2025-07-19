import { useState } from "react";
import { ETFView } from "../../types/ETFView";

export default function ETFTable({ etfData }: { etfData: ETFView[] }) {
  const [selected, setSelected] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);

  const renderRate = (value: string) => {
    const number = parseFloat(value);
    if (isNaN(number)) return value;
    return <span className={number >= 0 ? "text-red-600" : "text-blue-600"}>{value}</span>;
  };

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
          {etfData.map((etf, i) => (
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
  