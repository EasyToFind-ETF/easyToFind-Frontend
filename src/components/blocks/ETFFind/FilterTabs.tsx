type Props = {
    tabs: string[];
    selectedTab: string;
    onTabChange: (tab: string) => void;
  };
  
  export default function FilterTabs({ tabs, selectedTab, onTabChange }: Props) {
    return (
      <div className="flex border-b mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-3 text-lg font-semibold border-b-2 transition-colors duration-150 ${
              selectedTab === tab ? "border-[#0046ff] text-[#0046ff]" : "border-transparent text-gray-500"
            }`}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    );
  }
  