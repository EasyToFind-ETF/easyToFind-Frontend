"use client";

import { useState, useEffect } from "react";
import { fetchEtfData, fetchHoldingsData } from "@/services/etfFindService";
import { ETFView } from "@/types/ETFView";
import { HoldingView } from "@/types/HoldingView";
import {
  toggleFavorite as toggleFavoriteAPI,
  fetchFavoriteEtfCodes,
} from "@/services/etfFavoriteService";
import { useRouter, useSearchParams } from "next/navigation";

import FilterTabs from "@/components/blocks/ETFFind/FilterTabs";
import FilterButtons from "@/components/blocks/ETFFind/FilterButtons";
import ResultHeader from "@/components/blocks/ETFFind/ResultHeader";
import ETFTable from "@/components/blocks/ETFFind/ETFTable";
import HoldingTable from "@/components/blocks/ETFFind/HoldingTable";
import CompareModal from "@/components/blocks/ETFCompare/ETFComapreModal";

export default function FindPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") ?? "";

  const [selectedTab, setSelectedTab] = useState("유형별");
  const [selectedType, setSelectedType] = useState("전체");
  const [selectedTheme, setSelectedTheme] = useState("전체");
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const [etfData, setEtfData] = useState<ETFView[]>([]);
  const [holdingsData, setHoldingsData] = useState<HoldingView[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState("ETF로 보기");
  const [selectedEtfCodes, setSelectedEtfCodes] = useState<string[]>([]);
  const [favoriteEtfCodes, setFavoriteEtfCodes] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<any[]>([]);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);

  const tabList = ["유형별", "테마별", "관심별"];
  const assetFilters = [
    "전체",
    "주식",
    "채권",
    "멀티에셋",
    "부동산",
    "원자재",
    "통화",
    "파킹형",
  ];
  const themeFilters = [
    "전체",
    "반도체",
    "산업재",
    "소비재",
    "기술",
    "전기차",
    "인공지능",
    "게임",
    "에너지",
    "친환경",
    "헬스케어",
    "금융",
    "미국",
    "인도",
    "일본",
    "중국",
    "배당",
    "기타",
  ];
  const interestFilters = ["전체", "관심"];

  const handleTabChange = (tab: string) => {
    if (tab === "관심별") {
      const hasAuthCookie = document.cookie.includes("authToken");

      if (!hasAuthCookie) {
        alert("로그인 후 이용해주세요!");
        return;
      }
    }

    setSelectedTab(tab);
    setSelectedType("전체");
    setSelectedTheme("전체");
    setSelectedTab(tab);
  };

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
      : "";

  const handleFilterChange = (value: string) => {
    if (selectedTab === "유형별") setSelectedType(value);
    else if (selectedTab === "테마별") setSelectedTheme(value);
  };

  const handleToggleFavorite = async (
    etfCode: string,
    isAlreadyFavorite: boolean
  ) => {
    try {
      await toggleFavoriteAPI(etfCode, isAlreadyFavorite);
      setFavoriteEtfCodes((prev) =>
        isAlreadyFavorite
          ? prev.filter((code) => code !== etfCode)
          : [...prev, etfCode]
      );
    } catch (err) {
      console.error("❌ 관심 ETF 토글 실패:", err);
      alert("로그인 후 이용해주세요!");
    }
  };

  // 검색 실행 함수 (URL 파라미터용)
  const executeSearchWithQuery = async (query: string) => {
    setIsLoading(true);

    const params: any = {
      query: query,
      sort: viewMode === "ETF로 보기" ? "etf_code" : "weight_pct",
    };

    if (selectedTab === "관심별") {
      params.isFavorite = true;
    } else {
      if (selectedType !== "전체") params.assetClass = selectedType;
      if (selectedTheme !== "전체") params.theme = selectedTheme;
    }

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
          const favoriteCodes = await fetchFavoriteEtfCodes();
          setFavoriteEtfCodes(favoriteCodes);
        } catch (err: any) {
          console.warn(
            "💥 관심 ETF 목록 가져오기 실패 (비로그인일 수 있음)",
            err
          );
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

  // 검색 실행 함수
  const executeSearch = async () => {
    setIsLoading(true);

    const params: any = {
      query: searchQuery,
      sort: viewMode === "ETF로 보기" ? "etf_code" : "weight_pct",
    };

    if (selectedTab === "관심별") {
      params.isFavorite = true;
    } else {
      if (selectedType !== "전체") params.assetClass = selectedType;
      if (selectedTheme !== "전체") params.theme = selectedTheme;
    }

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
          const favoriteCodes = await fetchFavoriteEtfCodes();
          setFavoriteEtfCodes(favoriteCodes);
        } catch (err: any) {
          console.warn(
            "💥 관심 ETF 목록 가져오기 실패 (비로그인일 수 있음)",
            err
          );
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

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // 현재 페이지에서 검색할 때는 URL을 업데이트하지 않고 바로 검색 실행
      executeSearch();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleFocus = () => {
    setShowPlaceholder(false);
  };

  const handleBlur = () => {
    if (!searchQuery.trim()) {
      setShowPlaceholder(true);
    }
  };

  // URL 파라미터에서 검색어 가져오기 및 초기 검색 실행
  useEffect(() => {
    if (hasInitialized) return; // 이미 초기화된 경우 중복 실행 방지

    const query = searchParams.get("query");
    if (query) {
      setSearchQuery(query);
      setShowPlaceholder(false);

      // URL 파라미터에서 검색어가 있으면 자동으로 검색 실행
      setTimeout(() => {
        executeSearchWithQuery(query);

        const newUrl = window.location.pathname;
        window.history.replaceState({}, "", newUrl);
      }, 100); // 약간의 지연을 주어 searchQuery가 설정된 후 실행
    } else {
      // 검색어가 없으면 모든 ETF 목록을 가져오기
      setTimeout(() => {
        executeSearchWithQuery("");
      }, 100);
    }
    setHasInitialized(true);
  }, [searchParams]);

  // 🔥 API 요청 트리거 (필터 변경 시에만 실행)
  useEffect(() => {
    // 초기 로드 시에는 실행하지 않음 (URL 파라미터 처리에서 실행됨)
    if (hasInitialized) {
      executeSearch();
    }
  }, [selectedType, selectedTheme, viewMode, selectedTab]);

  // 비교하기 버튼 클릭 핸들러
  const handleCompareClick = async () => {
    const codes = selectedEtfCodes;
    // console.log("📦 비교할 ETF 코드 목록:", codes);

    try {
      const responses = await Promise.all(
        codes.map((code) => {
          const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/etf/compare/${code}`;
          console.log(`🚀 API 호출: ${url}`);
          return fetch(url, {
            credentials: "include",
          }).then((res) => res.json());
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
          listingDate: "2024-01-01",
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
        <div className="text-center space-y-6">
          <h1 className="text-4xl mt-20 font-bold text-gray-900">ETF 찾기</h1>
          <div className="w-full bg-gray-50 relative pt-20">
            {/* Search Bar */}
            <div className="w-full max-w-7xl mx-auto relative z-10">
              <div className="relative">
                <input
                  type="text"
                  className="w-full rounded-full border border-gray-200 bg-[#0046ff] px-14 py-4 text-lg shadow focus:outline-none focus:ring-2 focus:ring-[#4DB6FF] placeholder:text-white text-white"
                  style={{ caretColor: "white" }}
                  placeholder={
                    showPlaceholder
                      ? "상품명 혹은 증권코드로 원하는 ETF를 검색해보세요"
                      : ""
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                <button
                  className="absolute right-14 top-1/2 -translate-y-1/2 text-white hover:text-[#4DB6FF]"
                  onClick={handleSearch}
                  aria-label="검색"
                >
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="11"
                      cy="11"
                      r="8"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="bg-white rounded-3xl w-full px-16 py-16 shadow overflow-visible mt-6 mb-10"
          style={{ borderRadius: "4rem" }}
        >
          <FilterTabs
            tabs={tabList}
            selectedTab={selectedTab}
            onTabChange={handleTabChange}
          />
          {selectedTab !== "관심별" && (
            <FilterButtons
              filters={getFilters()}
              selected={selectedFilter}
              onChange={handleFilterChange}
            />
          )}
          <ResultHeader
            viewMode={viewMode}
            setViewMode={setViewMode}
            count={
              viewMode === "ETF로 보기" ? etfData.length : holdingsData.length
            }
            selectedTab={selectedTab}
          />

          {isLoading ? (
            <div className="text-center py-10">
              <div className="animate-spin h-10 w-10 border-4 border-[#0046ff] border-t-transparent rounded-full mx-auto" />
              <p className="text-sm mt-2 text-gray-500">
                ETF 데이터를 불러오는 중...
              </p>
            </div>
          ) : viewMode === "ETF로 보기" ? (
            <ETFTable
              etfData={etfData}
              selectedEtfCodes={selectedEtfCodes}
              setSelectedEtfCodes={setSelectedEtfCodes}
              favoriteEtfCodes={favoriteEtfCodes}
              onToggleFavorite={handleToggleFavorite}
              onCompare={handleCompareClick}
            />
          ) : (
            <HoldingTable
              holdingsData={holdingsData}
              selectedEtfCodes={selectedEtfCodes}
              setSelectedEtfCodes={setSelectedEtfCodes}
              favoriteEtfCodes={favoriteEtfCodes}
              onToggleFavorite={handleToggleFavorite}
              onCompare={handleCompareClick}
            />
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
