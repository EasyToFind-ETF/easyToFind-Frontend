type Props = {
  filters: string[];
  selected: string;
  onChange: (filter: string) => void;
};

export default function FilterButtons({ filters, selected, onChange }: Props) {
  const firstRowFilters = filters.slice(0, 10);
  const secondRowFilters = filters.slice(10);

  return (
    <div className="flex flex-col gap-3 mb-20 justify-center">
      {/* 첫 번째 줄 - 최대 10개 */}
      <div className="flex flex-wrap gap-3 justify-center">
        {firstRowFilters.map((filter) => (
          <button
            key={filter}
            className={`px-6 py-2 rounded-full border text-sm font-medium transition-colors duration-150 ${
              selected === filter
                ? "bg-[#0046ff] text-white border-blue-500"
                : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-100"
            }`}
            onClick={() => onChange(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* 두 번째 줄 - 11개부터 */}
      {secondRowFilters.length > 0 && (
        <div className="flex flex-wrap gap-3 justify-center">
          {secondRowFilters.map((filter) => (
            <button
              key={filter}
              className={`px-6 py-2 rounded-full border text-sm font-medium transition-colors duration-150 ${
                selected === filter
                  ? "bg-[#0046ff] text-white border-blue-500"
                  : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-100"
              }`}
              onClick={() => onChange(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
