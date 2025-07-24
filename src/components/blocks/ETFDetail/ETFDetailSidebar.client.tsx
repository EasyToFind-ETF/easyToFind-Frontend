"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { ETFDetail } from "@/types/etf";
import { fetchETFDetail } from "@/services/etfDetailService";
import { useQuery } from "@tanstack/react-query";

const sidebarItems = [
  { label: "상품정보", href: "#info" },
  { label: "수익률", href: "#yield" },
  { label: "위험도", href: "#risk" },
  { label: "기준가", href: "#standard-price" },
  { label: "구성종목", href: "#holdings" },
];

function scrollToSectionById(id: string) {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

interface ETFDetailSidebarProps {
  etf_code: string;
}

const ETFDetailSidebar: React.FC<ETFDetailSidebarProps> = ({ etf_code }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const {
    data: etfData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["etf-detail", etf_code],
    queryFn: () => fetchETFDetail(etf_code),
  });

  const useDetailData = useMemo(() => {
    return etfData?.etf_name || "";
  }, [etfData]);

  // 스크롤 감지하여 활성 탭 업데이트
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px", // 섹션이 화면 상단 20% 지점에 있을 때 활성화
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const index = sidebarItems.findIndex(
            (item) => item.href === `#${id}`
          );
          if (index !== -1) {
            setActiveTabIndex(index);
          }
        }
      });
    }, observerOptions);

    // 각 섹션 요소 관찰 시작
    sidebarItems.forEach((item) => {
      const element = document.getElementById(item.href.replace("#", ""));
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();

        if (e.shiftKey) {
          setActiveTabIndex((prev) =>
            prev > 0 ? prev - 1 : sidebarItems.length - 1
          );
        } else {
          setActiveTabIndex((prev) =>
            prev < sidebarItems.length - 1 ? prev + 1 : 0
          );
        }
      }
    };

    if (tabRefs.current[activeTabIndex]) {
      tabRefs.current[activeTabIndex]?.focus();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeTabIndex]);

  // 클릭하면 섹션 이동
  const handleTabClick = (index: number, href: string) => {
    setActiveTabIndex(index);
    const id = href.replace("#", "");
    scrollToSectionById(id);
  };

  const { etf_name } = etfData || {};

  return (
    <aside
      className="sticky top-0 h-screen w-full md:w-[280px] flex-shrink-0 py-10 bg-gray-50 rounded-r-3xl"
      style={{ marginTop: 50, backgroundColor: "bg-gray-50" }}
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
            onClick={(e) => {
              e.preventDefault();
              handleTabClick(index, item.href);
            }}
            className={`px-5 py-3 rounded-xl text-lg font-medium transition-colors cursor-pointer ${
              activeTabIndex === index
                ? "bg-[#0046ff] text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            style={{ borderRadius: "1rem" }}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default ETFDetailSidebar;
