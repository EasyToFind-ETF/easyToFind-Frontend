"use client";

import Link from "next/link";
import Image from "next/image";
import logoImg from "@/assets/icons/mainlogo.png";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/ui";

// ✅ 쿠키 파싱 유틸 함수
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split(";").map((c) => c.trim());
  const match = cookies.find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
};

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLogin = () => {
      const token = getCookie("authToken"); // ✅ 쿠키 이름 맞게 수정
      setIsLoggedIn(!!token);
    };

    checkLogin(); // 초기 체크
    window.addEventListener("authChanged", checkLogin);
    return () => {
      window.removeEventListener("authChanged", checkLogin);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3001/api/auth/logout", {
        method: "POST",
        credentials: "include", // ✅ 쿠키 전송
      });
    } catch (e) {
      // 실패해도 클라이언트 상태는 초기화
    }
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
          <Image src={logoImg} alt="Easy To Find 로고" width={180} height={100} />
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

        {/* 로그인/로그아웃 UI */}
        <div className="flex items-center justify-end gap-2">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-sm font-medium text-blue-600 hover:underline"
            >
              로그아웃
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-1 text-sm font-medium text-blue-600 hover:underline"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="px-3 py-1 text-sm font-medium text-blue-600 hover:underline"
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
