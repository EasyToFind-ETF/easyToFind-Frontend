"use client";

import { useState, useEffect } from "react";
import { fetchEtfData } from "@/services/etfFindService"
import { ETFView } from "@/types/ETFView";

import FilterTabs from "@/components/ETFFind/FilterTabs";
import FilterButtons from "@/components/ETFFind/FilterButtons";
import ResultHeader from "@/components/ETFFind/ResultHeader";
import ETFTable from "@/components/ETFFind/ETFTable";

export default function FindPage() {
  const [selectedTab, setSelectedTab] = useState("유형별");
  const [selectedType, setSelectedType] = useState("전체");
  const [selectedTheme, setSelectedTheme] = useState("전체");
  const [selectedInterest, setSelectedInterest] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");

  const [etfData, setEtfData] = useState<ETFView[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState("ETF로 보기");

//   더미
//   const etfData = [
//     {
//       name: "Kodex 2차전지산업(삼성바이오리스)",
//       loss: "945",
//       week1: "14.43",
//       month1: "20.46",
//       month3: "11.07",
//       month6: "-29.92",
//       year1: "-71.25",
//       year3: "-",
//       ytd: "-22.51",
//       inception: "-90.69",
//     },
//     {
//       name: "Kodex 철강",
//       loss: "11,887",
//       week1: "8.55",
//       month1: "24.99",
//       month3: "42.37",
//       month6: "32.81",
//       year1: "43.34",
//       year3: "82.04",
//       ytd: "37.44",
//       inception: "871.8",
//     },
//   ];

  const tabList = ["유형별", "테마별", "관심별"];
  const assetFilters = ["전체", "주식", "채권", "멀티에셋", "부동산", "원자재", "통화", "파킹형"];
  const themeFilters = ["전체", "반도체", "금융", "게임", "기술", "배당", "산업재", "소비재", "에너지", "인공지능", "전기차", "친환경", "헬스케어", "미국", "인도", "일본", "중국", "기타"];
  const interestFilters = ["전체", "관심 "];

  const getFilters = () => {
    if (selectedTab === "유형별") return assetFilters;
    if (selectedTab === "테마별") return themeFilters;
    return interestFilters;
  };

  const selectedFilter =
    selectedTab === "유형별"
      ? selectedType
      : selectedTab === "테마별"
      ? selectedTheme
      : selectedInterest;

  const handleFilterChange = (value: string) => {
    if (selectedTab === "유형별") setSelectedType(value);
    else if (selectedTab === "테마별") setSelectedTheme(value);
    else setSelectedInterest(value);
  };

  // 🔥 API 요청 트리거
  // 🔥 API 요청 트리거
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const params: any = {
        query: searchQuery,
        sort: "etf_code",
      };

      if (selectedType !== "전체") params.assetClass = selectedType;
      if (selectedTheme !== "전체") params.theme = selectedTheme;
      if (selectedInterest === "관심") params.isFavorite = true;

      try {
        const data: any[] = await fetchEtfData(params);

        // 형식 맞춰서 ETFTable에 전해줌.
        const formatted = (data as any[]).map((etf) => ({
            name: etf.etf_name,
            nav: etf.expense_ratio?.toString?.() ?? "-",
            week1: etf.returns?.["1주"] ?? "-",
            month1: etf.returns?.["1개월"] ?? "-",
            month3: etf.returns?.["3개월"] ?? "-",
            month6: etf.returns?.["6개월"] ?? "-",
            year1: etf.returns?.["1년"] ?? "-",
            year3: etf.returns?.["3년"] ?? "-",
            ytd: etf.returns?.["연초이후"] ?? "-",
            inception: etf.returns?.["상장 이후"] ?? "-",
          }));
        setEtfData(formatted); // 🎯 응답 데이터로 상태 갱신
      } catch (err) {
        console.error("ETF 데이터 불러오기 실패:", err);
        setEtfData([]); // 오류 시 빈 배열
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, selectedType, selectedTheme, selectedInterest]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">ETF 찾기</h1>
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ETF 이름/종목코드 또는 구성종목을 검색해보세요"
              className="pl-12 py-4 text-lg rounded-full border-2 border-blue-200 focus:border-blue-400 w-full"
            />
          </div>
        </div>

        {/* Main Card */}
        <div className="w-full bg-white rounded-2xl shadow p-6 mt-6">
          <FilterTabs tabs={tabList} selectedTab={selectedTab} onTabChange={setSelectedTab} />
          <FilterButtons filters={getFilters()} selected={selectedFilter} onChange={handleFilterChange} />
          <ResultHeader viewMode={viewMode} setViewMode={setViewMode} count={etfData.length} />

          {isLoading ? (
            <div className="text-center py-10">
              <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
              <p className="text-sm mt-2 text-gray-500">ETF 데이터를 불러오는 중...</p>
            </div>
          ) : (
            <ETFTable etfData={etfData} />
          )}
        </div>
      </div>
    </div>
  );
}
