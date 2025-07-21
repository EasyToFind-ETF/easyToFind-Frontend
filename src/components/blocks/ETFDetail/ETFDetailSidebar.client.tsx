'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ETFDetail } from '@/types/etf';

const sidebarItems = [
  { label: '상품정보', href: '#info' },
  { label: '수익률', href: '#yield' },
  { label: '위험도', href: '#risk' },
  { label: '기준가', href: '#standard-price' },
  { label: '구성종목', href: '#holdings' }
];

function scrollToSectionById(id: string) {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

interface ETFDetailSidebarProps {
  etf_code: string;
}

const ETFDetailSidebar: React.FC<ETFDetailSidebarProps> = ({ etf_code }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [etfData, setEtfData] = useState<ETFDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // ETF 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const etfResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/etfs/${etf_code}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!etfResponse.ok) {
          throw new Error(`HTTP error! status: ${etfResponse.status}`);
        }

        const etfResult = await etfResponse.json();
        
        if (etfResult.status === 200 && etfResult.data) {
          setEtfData(etfResult.data);
        } else {
          setError('ETF 데이터를 불러올 수 없습니다.');
        }
      } catch (err) {
        setError('데이터 로딩 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [etf_code]);

  // 네비게이션
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

  // 클릭하면 섹션 이동
  const handleTabClick = (index: number, href: string) => {
    setActiveTabIndex(index);
    const id = href.replace('#', '');
    scrollToSectionById(id);
  };

  const { etf_name } = etfData || {};

  return (
    <aside
      className="sticky top-0 h-screen w-full md:w-[280px] flex-shrink-0 py-10 bg-white rounded-r-3xl"
      style={{ marginTop: 50, backgroundColor: '#F1F3F8'}}
    >
      <div className="mb-10 flex flex-col items-start">
        <div className="text-2xl font-bold text-gray-800 text-left leading-tight">
          {etf_name}
        </div>
      </div>
      
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
            className={`px-5 py-3 rounded-xl text-lg font-medium transition-colors cursor-pointer ${
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