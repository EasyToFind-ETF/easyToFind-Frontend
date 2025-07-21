"use client";

import Link from "next/link";
import Image from "next/image";
// import { User } from "lucide-react";
import UserIcon from "@/assets/icons/account.png";
import logoImg from "@/assets/icons/mainlogo.png";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setIsLoggedIn(typeof window !== "undefined" && localStorage.getItem("isLoggedIn") === "true");
    const handleStorage = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("authChanged", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("authChanged", handleStorage);
    };
  }, []);
  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/logout`, { method: "POST" });
    } catch (e) {
      // 실패해도 클라이언트 상태는 정리
    }
    localStorage.removeItem("isLoggedIn");
    window.dispatchEvent(new Event("authChanged"));
    setIsLoggedIn(false);
    router.push("/");
  };

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
            href="/find"
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
            href="/me/mbti"
            className="text-foreground/60 transition-colors hover:text-foreground/80"
          >
            맞춤 추천
          </Link>
        </nav>

        {/* 프로필 아이콘 */}
        <div className="flex items-center justify-end gap-2">
          {isLoggedIn ? (
            <button onClick={handleLogout} className="px-3 py-1 text-sm font-medium text-blue-600 hover:underline">로그아웃</button>
          ) : (
            <>
              <Link href="/login" className="px-3 py-1 text-sm font-medium text-blue-600 hover:underline">로그인</Link>
              <Link href="/signup" className="px-3 py-1 text-sm font-medium text-blue-600 hover:underline">회원가입</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
