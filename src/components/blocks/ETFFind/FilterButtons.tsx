type Props = {
    filters: string[];
    selected: string;
    onChange: (filter: string) => void;
  };
  
  export default function FilterButtons({ filters, selected, onChange }: Props) {
    return (
      <div className="flex flex-wrap gap-3 mb-6 mt-8 justify-center">
        {filters.map((filter) => (
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
    );
  }
  