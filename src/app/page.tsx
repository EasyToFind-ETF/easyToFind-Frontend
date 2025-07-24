'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ETFCard from '@/components/ui/ETFCard';

interface ETFData {
  etf_code: string;
  etf_name: string;
  close_price: string;
  trade_date: string;
}

export default function Home() {
  const [viewportHeight, setViewportHeight] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [search, setSearch] = useState('');
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [selectedItem, setSelectedItem] = useState(0);
  const [etfData, setEtfData] = useState<ETFData[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const apiUrls = [
    'http://localhost:3001/api/main/aum',
    'http://localhost:3001/api/main/fluc',
    'http://localhost:3001/api/main/volume'
  ];

  useEffect(() => {
    const updateViewport = () => {
      setViewportHeight(window.innerHeight);
      setViewportWidth(window.innerWidth);
    };

    // 초기 크기 설정
    updateViewport();

    // 리사이즈 이벤트 리스너 추가
    window.addEventListener('resize', updateViewport);

    // 클린업
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  // ETF 데이터 가져오기
  useEffect(() => {
    const fetchETFData = async () => {
      setLoading(true);
      try {
        const response = await fetch(apiUrls[selectedItem]);
        const result = await response.json();
        
        if (result.status === 200) {
          setEtfData(result.data);
        } else {
          console.error('ETF 데이터 가져오기 실패:', result.message);
          setEtfData([]);
        }
      } catch (error) {
        console.error('API 호출 오류:', error);
        setEtfData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchETFData();
  }, [selectedItem]);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.period-dropdown')) {
        setShowPeriodDropdown(false);
      }
    };

    if (showPeriodDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPeriodDropdown]);

  const handleSearch = () => {
    if (search.trim()) {
      router.push(`/find?query=${encodeURIComponent(search)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFocus = () => {
    setShowPlaceholder(false);
  };

  const handleBlur = () => {
    if (!search.trim()) {
      setShowPlaceholder(true);
    }
  };

  return (
    <>
      <main className="mt-20">
        <div 
          className="w-full bg-cover bg-center bg-no-repeat -mt-20 flex flex-col justify-center items-center relative" 
                      style={{ 
              backgroundImage: 'url(/mailWallpaper2.png)',
              height: '100vh'
            }}
        >
          {/* 반투명 흰색 오버레이 */}
          {/* <div className="absolute inset-0 bg-white/60"></div>
           */}
          {/* 하단 블러 그라데이션 */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
          
          <div className="relative z-10 min-h-screen flex flex-col justify-center items-left w-full h-full">
            <h1 className="text-6xl md:text-4xl font-bold text-gray-900 mb-12 leading-tight text-left px-60">
              <div>ETF의 모든 것</div>
              <div className="text-[#0046ff] mt-4">
                <span className="text-[#0046ff]">EasyToFind</span>
                <span className="text-gray-900 pl-2">에서 쉽고 간편하게</span>
              </div>
            </h1>
            {/* Floating Down Arrow */}
            <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2 z-20">
              <button 
                className="w-12 h-12 bg-white/70 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all duration-300 animate-bounce"
                onClick={() => {
                  window.scrollTo({
                    top: document.documentElement.scrollHeight,
                    behavior: 'smooth'
                  });
                }}
              >
                <svg 
                  className="w-6 h-6 text-[#A0B6CF]" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="w-full bg-gray-50 pt-20 relative">
          {/* Top blur effect */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white via-transparent to-gray-50/50  backdrop-blur-md"></div>
          
          <div className="w-full max-w-7xl mx-auto mt-20 relative z-10">
            <div className="relative">
              <input
                type="text"
                className="w-full rounded-full border border-gray-200 bg-[#0046ff] px-6 py-4 text-lg shadow focus:outline-none focus:ring-2 focus:ring-[#4DB6FF] placeholder:text-white text-white"
                style={{ caretColor: 'white' }}
                placeholder={showPlaceholder ? "상품명 혹은 증권코드로 원하는 ETF를 검색해보세요" : ""}
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-[#4DB6FF]"
                onClick={handleSearch}
                aria-label="검색"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ETF Trends Section */}
          {/* ETF Trends Section */}
<div className="max-w-screen-xl mx-auto my-20">
  <div className="bg-white px-16 py-20 shadow" style={{ borderRadius: '4rem' }}>
    <div className="flex gap-10 overflow-hidden">
      
      {/* 왼쪽 탭 영역 */}
      <div className="w-96 flex-shrink-0">
        <div className="mb-6">
          <h3 className="text-4xl font-bold text-gray-800 mb-1">ETF 트렌드</h3>
          <h4 className="text-4xl font-bold text-gray-800 mb-1">한눈에 보기</h4>
          <p className="text-gray-600 text-sm mt-6">지금 가장 핫한 ETF를 만나보세요.</p>
        </div>

        {/* 탭 리스트 */}
        <div className="space-y-2">
          {[
            { icon: 'chart', text: '순자산이 가장 많은 ETF는?' },
            { icon: 'arrow', text: '최근 가장 많은 수익률을 보인 ETF는?' },
            { icon: 'eye', text: '누적 거래량이 가장 많은 ETF는?' }
          ].map((item, index) => (
            <div 
              key={index} 
              className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors ${
                selectedItem === index 
                  ? 'bg-[#0046ff] text-white shadow-md' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedItem(index)}
            >
              <div className="w-8 h-8 flex items-center justify-center">
                {item.icon === 'chart' && (
                  <svg className={`w-5 h-5 ${selectedItem === index ? 'text-white' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )}
                {item.icon === 'arrow' && (
                  <svg className={`w-5 h-5 ${selectedItem === index ? 'text-white' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                )}
                {item.icon === 'eye' && (
                  <svg className={`w-5 h-5 ${selectedItem === index ? 'text-white' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </div>
              <span className={`text-base font-medium ${selectedItem === index ? 'text-white' : 'text-gray-700'}`}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 오른쪽 스크롤 카드 영역 */}
      <div className="flex-1 overflow-hidden">
        <div className="overflow-x-auto scrollbar-hover pb-4">
          <div className="flex gap-4 min-w-max">
            {loading ? (
              <div className="flex items-center justify-center h-64 w-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0046ff]"></div>
              </div>
            ) : (
              etfData.map((etf, index) => (
                <div key={`${etf.etf_code}-${index}`} className="flex-shrink-0">
                  <ETFCard
                    etf_code={etf.etf_code}
                    etf_name={etf.etf_name}
                    close_price={etf.close_price}
                    trade_date={etf.trade_date}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>

    {/* 전체 운용상품 보기 버튼 */}
    <div className="mt-16 text-center">
      <Link 
        href="/find"
        className="inline-block w-3/4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-base py-4 px-8 rounded-2xl transition-colors duration-200"
      >
        전체 운용상품 보러 가기
      </Link>
    </div>
  </div>
</div>


          {/* 두 개의 카드 섹션 */}
          <div className="max-w-screen-xl mx-auto mt-20 mb-24">
            <div className="flex gap-6">
              {/* what's your ETF? 카드 */}
              <Link href="/me/mbti" className="flex-1 block">
              <div className="rounded-3xl p-12 text-white relative overflow-hidden min-h-60 cursor-pointer transition-transform hover:scale-105 h-full"style={{
                    width: "100%",
                    height: "30vh",
                    borderRadius: 40,
                    position: "relative",
                    backgroundColor: "#71c5fe"
                    
                  }}>
                  <div className="relative z-10">
                    <h3 className="text-3xl font-bold mb-4">What's your ETF?</h3>
                    <p className="text-sm mb-1">당신에게 가장 잘 맞는 ETF는?</p>
                    <p className="text-sm">지금 당장 테스트 해보세요!</p>
                  </div>
                  
                  {/* 그래픽 요소 */}
                      <div className="absolute bottom-6 right-6">
                        <div className="flex items-center space-x-3">
                          {/* 차트 아이콘 */}
                          <div className="backdrop-blur-sm rounded-xl p-3">
                            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          {/* 분석 아이콘 */}
                          {/* <div className="backdrop-blur-sm rounded-xl p-3">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                          </div> */}
                        </div>
                      </div>
                </div>
              </Link>

              {/* 전략 시뮬레이션 ETF추천 카드 */}
              <Link href="/goal" className="flex-1 block">
                <div className="rounded-3xl p-12 text-white relative overflow-hidden min-h-60 cursor-pointer transition-transform hover:scale-105 h-full"style={{
                    width: "100%",
                    height: "30vh",
                    borderRadius: 40,
                    position: "relative",
                    backgroundColor: "#4a9ffd"
                    
                  }}>
                  <div className="relative z-10">
                    <h3 className="text-3xl font-bold mb-4">전략 시뮬레이션</h3>
                    <p className="text-sm mb-1">내 목표를 이룰 수 있는</p>
                    <p className="text-sm">최적의 전략을 찾아보세요!</p>
                  </div>
                  
                      {/* 그래픽 요소 - 전략 시뮬레이션 아이콘 */}
                      <div className="absolute bottom-6 right-6">
                        <div className="flex items-center space-x-3">
                          {/* 타겟 아이콘 */}
                          {/* <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div> */}
                          {/* 설정 아이콘 */}
                          <div className="backdrop-blur-sm rounded-xl p-3">
                            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor"  viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                </div>
              </Link>
            </div>
          </div>
   
      </main>
    </>
  );
} 