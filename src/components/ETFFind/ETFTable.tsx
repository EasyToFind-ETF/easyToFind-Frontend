type Etf = {
    name: string;
    loss: string;
    week1: string;
    month1: string;
    month3: string;
    month6: string;
    year1: string;
    year3: string;
    ytd: string;
    inception: string;
  };
  
  export default function ETFTable({ etfData }: { etfData: Etf[] }) {
    const renderRate = (value: string) => {
      const number = parseFloat(value);
      if (isNaN(number)) return value;
      return <span className={number >= 0 ? "text-red-600" : "text-blue-600"}>{value}</span>;
    };
  
    return (
      <div className="overflow-x-auto rounded-2xl">
        <table className="min-w-full text-center">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-2 font-semibold text-gray-900 min-w-[200px]">상품명</th>
              <th className="py-3 px-2 font-semibold text-gray-900">손자산(억)</th>
              {["1주", "1개월", "3개월", "6개월", "1년", "3년", "연초이후", "상장이후"].map((period) => (
                <th key={period} className="py-3 px-2 font-semibold text-gray-900">
                  {period}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {etfData.map((etf, i) => (
              <tr key={i} className="hover:bg-gray-50 border-t">
                <td className="py-3 px-2 text-left font-medium">{etf.name}</td>
                <td className="py-3 px-2">{etf.loss}</td>
                <td className="py-3 px-2">{renderRate(etf.week1)}</td>
                <td className="py-3 px-2">{renderRate(etf.month1)}</td>
                <td className="py-3 px-2">{renderRate(etf.month3)}</td>
                <td className="py-3 px-2">{renderRate(etf.month6)}</td>
                <td className="py-3 px-2">{renderRate(etf.year1)}</td>
                <td className="py-3 px-2">{renderRate(etf.year3)}</td>
                <td className="py-3 px-2">{renderRate(etf.ytd)}</td>
                <td className="py-3 px-2">{renderRate(etf.inception)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  