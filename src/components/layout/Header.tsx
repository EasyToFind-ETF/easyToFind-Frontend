"use client";

import Link from "next/link";
import Image from "next/image";
import logoImg from "@/assets/icons/logo.png";
import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/ui";
import { useAuth } from "@/contexts/AuthContext";
import { UserCircle2 } from "lucide-react";


// ✅ 스크롤 시 헤더 숨김 커스텀 훅
export function useScrollHideHeader() {
  const [hidden, setHidden] = useState(false);
  const lastScroll = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      if (current > lastScroll.current && current > 60) {
        setHidden(true);
      } else {
        setHidden(false);
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
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
  }, []);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        window.dispatchEvent(new Event("authChanged"));
        router.push("/");
      } else {
        alert("로그아웃에 실패했습니다."); // 최소한의 피드백
      }
    } catch (e) {
      alert("로그아웃 요청 중 문제가 발생했습니다.");
    }
  };

  return (
    <header
      className={cn(
        "h-20",
        `fixed top-0 z-50 w-full border-b transition-transform duration-300`,
        isHomePage ? "bg-transparent border-transparent" : "bg-gray-50",
        hidden ? "-translate-y-full" : "translate-y-0"
      )}
    >
      <div className="max-w-screen-xl mx-auto px-4 flex h-full items-center">
        {/* 로고 */}
        <Link href="/" className="mr-6 flex items-center space-x-6">
          <Image src={logoImg} alt="Easy To Find 로고" width={180} height={100} priority/>
        </Link>

        {/* 네비게이션 메뉴 */}
        <nav className="flex flex-1 justify-center items-center gap-4 sm:gap-8 md:gap-12 lg:gap-16 xl:gap-24 text-lg flex-nowrap">
          <Link
            href="/"
            className={cn(
              "transition-colors hover:text-foreground/80"
            )}
          >
            Home
          </Link>
          <Link
            href="/find"
            className={cn(
              "transition-colors hover:text-foreground/80"
            )}
          >
            ETF 탐색
          </Link>
          <Link
            href="/me/mbti"
            className={cn(
              "transition-colors hover:text-foreground/80"
            )}
          >
            맞춤 추천
          </Link>
          <Link
            href="/goal"
            className={cn(
              "transition-colors hover:text-foreground/80"
            )}
          >
            전략 분석
          </Link>
        </nav>

        {/* 로그인/로그아웃 UI */}
        <div className="flex items-center justify-end gap-2 flex-nowrap">
          {isLoggedIn ? (
            <button 
              onClick={handleLogout} 
              className={cn(
                "px-3 py-1 text-sm font-medium hover:bold text-black"
              )}
            >
              로그아웃
            </button>
          ) : (
            <>
              <Link 
                href="/login" 
                className={cn(
                  "px-3 py-1 text-sm font-medium hover:bold text-black"
                )}
              >
                로그인
              </Link>
              <Link 
                href="/signup" 
                className={cn(
                  "px-3 py-1 text-sm font-medium hover:bold text-black"
                )}
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
