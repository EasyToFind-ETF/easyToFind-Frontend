"use client";

import { useState, useEffect } from "react";
import { fetchEtfData, fetchHoldingsData } from "@/services/etfFindService"
import { ETFView } from "@/types/ETFView";
import { HoldingView } from "@/types/HoldingView";
import { toggleFavorite as toggleFavoriteAPI } from "@/services/etfFavoriteService";
import { fetchFavoriteEtfCodes } from "@/services/etfFavoriteService";

import FilterTabs from "@/components/ETFFind/FilterTabs";
import FilterButtons from "@/components/ETFFind/FilterButtons";
import ResultHeader from "@/components/ETFFind/ResultHeader";
import ETFTable from "@/components/ETFFind/ETFTable";
import HoldingTable from "@/components/ETFFind/HoldingTable";
import CompareModal from "@/components/ETFCompare/ETFComapreModal";



export default function FindPage() {
  const [selectedTab, setSelectedTab] = useState("유형별");
  const [selectedType, setSelectedType] = useState("전체");
  const [selectedTheme, setSelectedTheme] = useState("전체");
  const [selectedInterest, setSelectedInterest] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");

  const [etfData, setEtfData] = useState<ETFView[]>([]);
  const [holdingsData, setHoldingsData] = useState<HoldingView[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState("ETF로 보기");
  const [selected, setSelected] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<any[]>([]);

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

  const handleToggleFavorite = async (etfCode: string, isAlreadyFavorite: boolean, idx: number) => {
    try {
      await toggleFavoriteAPI(etfCode, isAlreadyFavorite); // POST/DELETE 요청
  
      // 로컬 상태 반영
      setFavorites((prev) =>
        isAlreadyFavorite ? prev.filter((i) => i !== idx) : [...prev, idx]
      );
    } catch (err) {
      console.error("❌ 관심 ETF 토글 실패:", err);
      alert("관심 ETF 변경 중 오류가 발생했습니다.");
    }
  };

  // 🔥 API 요청 트리거
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const params: any = {
        query: searchQuery,
        sort: viewMode === "ETF로 보기" ? "etf_code" : "weight_pct",
      };

      if (selectedType !== "전체") params.assetClass = selectedType;
      if (selectedTheme !== "전체") params.theme = selectedTheme;
      if (selectedInterest === "관심") params.isFavorite = true;

      try {
        if (viewMode === "ETF로 보기") {
          const data: any[] = await fetchEtfData(params);
          const formatted = (data as any[]).map((etf) => ({
            name: etf.etf_name,
            etfCode: etf.etf_code,
            nav: etf.latest_price,
            week1: etf.week1 ?? "-",
            month1: etf.month1 ?? "-",
            month3: etf.month3 ?? "-",
            month6: etf.month6 ?? "-",
            year1: etf.year1 ?? "-",
            year3: etf.year3 ?? "-",
            inception: etf.inception ?? "-",
          }));
          setEtfData(formatted);

          // 관심 ETF 세팅
          try {
            const favoriteCodes = await fetchFavoriteEtfCodes(); // 예: ["104520", "123456"]
            const favoriteIndices = formatted
              .map((etf, index) => favoriteCodes.includes(etf.etfCode) ? index : -1)
              .filter((i) => i !== -1);
            setFavorites(favoriteIndices);
          } catch (err) {
            console.warn("💥 관심 ETF 목록 가져오기 실패 (비로그인일 수 있음)");
            setFavorites([]); // 실패 시 초기화
          }
        } else {
          const data: any[] = await fetchHoldingsData(params);
          const formatted = (data as any[]).map((holding) => ({
            etfName: holding.etf_name,
            etfCode: holding.etf_code,
            holdingName: holding.holding_name,
            weight: holding.weight_pct,
          }));
          setHoldingsData(formatted);
        }
      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
        if (viewMode === "ETF로 보기") setEtfData([]);
        else setHoldingsData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, selectedType, selectedTheme, selectedInterest, viewMode]);

  // 비교하기 버튼 클릭 핸들러
  const handleCompareClick = async () => {
    const codes = selected.map((idx) => etfData[idx].etfCode);
    console.log("📦 비교할 ETF 코드 목록:", codes);
  
    try {
      const responses = await Promise.all(
        codes.map((code) => {
          const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/etf/compare/${code}`;
          console.log(`🚀 API 호출: ${url}`);
          return fetch(url).then((res) => res.json());
        })
      );
  
      console.log("✅ 비교 API 응답 결과 (raw):", responses);
  
      const mappedData = responses.map((res) => {
        const d = res.data;
        return {
          id: d.etf_code,
          name: d.etf_name,
          code: d.etf_code,
          price: d.latest_price,
          returns: {
            "1주": parseFloat(d.week1 ?? "0"),
            "1개월": parseFloat(d.month1 ?? "0"),
            "3개월": parseFloat(d.month3 ?? "0"),
            "6개월": parseFloat(d.month6 ?? "0"),
            "1년": parseFloat(d.year1 ?? "0"),
            "3년": parseFloat(d.year3 ?? "0"),
            상장이후: parseFloat(d.inception ?? "0"),
          },
          overallScore: d.total_score ?? 0,
          sharpRatio: parseFloat(d.sharpe_ratio ?? "0"),
          maxDrawdown: parseFloat(d.max_drawdown ?? "0"),
          volatility: parseFloat(d.volatility ?? "0"),
          netAssets: d.latest_aum,
          listingDate: "2024-01-01", // 실제 값 있으면 d.listing_date
          managementCompany: d.provider,
        };
      });
  
      console.log("🧩 매핑된 데이터:", mappedData);
  
      setModalData(mappedData);
      setModalVisible(true);
    } catch (err) {
      console.error("❌ ETF 비교 API 호출 실패", err);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
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
          <ResultHeader viewMode={viewMode} setViewMode={setViewMode} count={viewMode === "ETF로 보기" ? etfData.length : holdingsData.length} />

          {isLoading ? (
            <div className="text-center py-10">
              <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
              <p className="text-sm mt-2 text-gray-500">ETF 데이터를 불러오는 중...</p>
            </div>
          ) : (
            viewMode === "ETF로 보기" ? (
              <ETFTable
                etfData={etfData}
                selected={selected}
                setSelected={setSelected}
                favorites={favorites}
                setFavorites={setFavorites}
                onCompare={handleCompareClick}
                onToggleFavorite={handleToggleFavorite}
              />
            ) : (
              <HoldingTable
                holdingsData={holdingsData}
                selected={selected}
                setSelected={setSelected}
                favorites={favorites}
                setFavorites={setFavorites}
                onCompare={handleCompareClick}
              />
            )
          )}
        </div>
        {modalVisible && (
          <CompareModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          etfs={modalData}
        />
        )}
      </div>
    </div>
  );
}
