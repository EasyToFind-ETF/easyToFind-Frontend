"use client";

import Link from "next/link";
import Image from "next/image";
// import { User } from "lucide-react";
import UserIcon from "@/assets/icons/account.png";
import logoImg from "@/assets/icons/mainlogo.png";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/ui";

export function useScrollHideHeader() {
  const [hidden, setHidden] = useState(false);
  const lastScroll = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      if (current > lastScroll.current && current > 60) {
        setHidden(true); // 아래로 스크롤 → 헤더 숨김
      } else {
        setHidden(false); // 위로 스크롤 → 헤더 보임
      }
      lastScroll.current = current;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return hidden;
}

export const Header = () => {
  const hidden = useScrollHideHeader();

  return (
    <header
      className={cn(
        "h-20",
        `fixed top-0 z-50 w-full border-b bg-[#F1F3F8] transition-transform duration-300`,
        hidden ? "-translate-y-full" : "translate-y-0"
      )}
    >
      <div className="max-w-screen-xl mx-auto px-4 flex h-full items-center">
        {/* 로고 */}
        <Link href="/" className="mr-6 flex items-center space-x-6">
          <Image
            src={logoImg}
            alt="Easy To Find 로고"
            width={180}
            height={100}
          />
        </Link>

        {/* 네비게이션 메뉴 */}
        <nav className="flex flex-1 justify-center items-center gap-24 text-lg">
          <Link
            href="/"
            className="text-foreground/60 transition-colors hover:text-foreground/80"
          >
            Home
          </Link>

          <Link
            href="/explore"
            className="text-foreground/60 transition-colors hover:text-foreground/80"
          >
            ETF 탐색
          </Link>
          <Link
            href="/analysis"
            className="text-foreground/60 transition-colors hover:text-foreground/80"
          >
            전략 분석
          </Link>
          <Link
            href="/recommend"
            className="text-foreground/60 transition-colors hover:text-foreground/80"
          >
            맞춤 추천
          </Link>
        </nav>

        {/* 프로필 아이콘 */}
        <div className="flex items-center justify-end">
          <button className="p-2 rounded-full hover:bg-accent">
            <Image src={UserIcon} alt="User" className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};
