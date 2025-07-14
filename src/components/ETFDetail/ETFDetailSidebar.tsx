'use client';

import React, { useState, useRef, useEffect } from 'react';

const sidebarItems = [
  { label: '투자포인트', href: '#point' },
  { label: '상품정보', href: '#info' },
  { label: '수익률', href: '#yield' },
  { label: '기준가', href: '#nav' },
  { label: '투자구성종목(PDF)', href: '#pdf' },
  { label: '관련콘텐츠', href: '#content' },
];

function scrollToSectionById(id: string) {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

const ETFDetailSidebar: React.FC = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // 탭 키로 네비게이션 이동
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        
        if (e.shiftKey) {
          setActiveTabIndex(prev => 
            prev > 0 ? prev - 1 : sidebarItems.length - 1
          );
        } else {
          setActiveTabIndex(prev => 
            prev < sidebarItems.length - 1 ? prev + 1 : 0
          );
        }
      }
    };

    if (tabRefs.current[activeTabIndex]) {
      tabRefs.current[activeTabIndex]?.focus();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeTabIndex]);

  // 마우스 클릭으로 탭 변경 및 섹션 이동
  const handleTabClick = (index: number, href: string) => {
    setActiveTabIndex(index);
    const id = href.replace('#', '');
    scrollToSectionById(id);
  };

  return (
    <aside
      className="sticky top-0 h-screen w-full md:w-[380px] flex-shrink-0 py-10 px-6 bg-white rounded-r-3xl"
      style={{ marginTop: 50, backgroundColor: '#F1F3F8'}}
    >
      {/* 상단 로고/ETF명 */}
      <div className="mb-10 flex flex-col items-start">
        <div className="text-2xl font-bold text-gray-800 text-left leading-tight">Kodex 한국부동산리츠인프라</div>
      </div>
      {/* 탭 메뉴 */}
      <nav className="flex-1 flex flex-col gap-2" role="tablist">
        {sidebarItems.map((item, index) => (
          <a
            key={item.href}
            href={item.href}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            role="tab"
            aria-selected={activeTabIndex === index}
            tabIndex={activeTabIndex === index ? 0 : -1}
            onClick={e => {
              e.preventDefault();
              handleTabClick(index, item.href);
            }}
            className={`px-5 py-3 rounded-xl text-xl font-medium transition-colors cursor-pointer ${
              activeTabIndex === index
                ? 'bg-[#0046ff] text-white'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
            style={{ borderRadius: '1rem' }}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default ETFDetailSidebar; 