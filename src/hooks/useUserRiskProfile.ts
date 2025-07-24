"use client";

import { useState, useEffect } from "react";

interface UserRiskProfile {
  isLoggedIn: boolean;
  riskScore: number | null;
  isLoading: boolean;
}

// 쿠키 가져오기 함수
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

export const useUserRiskProfile = () => {
  const [userProfile, setUserProfile] = useState<UserRiskProfile>({
    isLoggedIn: false,
    riskScore: null,
    isLoading: true,
  });

  useEffect(() => {
    const checkLoginStatus = async () => {
      // 쿠키 기반 인증으로 변경
      const token = getCookie("authToken");
      const isLoggedIn = !!token;

      if (isLoggedIn) {
        try {
          // 로그인된 사용자의 위험 성향 점수를 가져오는 API 호출
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/me/risk-profile`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include", // 쿠키 포함
            }
          );

          if (response.ok) {
            const data = await response.json();
            // 위험성향이 null이면 기본값 50 사용, null이 아니면 사용자의 위험성향 사용
            const finalRiskScore =
              data.riskScore !== null && data.riskScore !== undefined
                ? data.riskScore
                : 50;

            setUserProfile({
              isLoggedIn: true,
              riskScore: finalRiskScore,
              isLoading: false,
            });
          } else {
            // API 호출 실패 시 기본값 50 사용
            setUserProfile({
              isLoggedIn: true,
              riskScore: 50, // 기본값: 표준 위험 성향
              isLoading: false,
            });
          }
        } catch (error) {
          // 에러 발생 시 기본값 50 사용
          setUserProfile({
            isLoggedIn: true,
            riskScore: 50, // 기본값: 표준 위험 성향
            isLoading: false,
          });
        }
      } else {
        // 로그인되지 않은 경우
        setUserProfile({
          isLoggedIn: false,
          riskScore: 50, // 표준 위험 성향
          isLoading: false,
        });
      }
    };

    checkLoginStatus();

    // 로그인 상태 변경 감지
    const handleAuthChange = () => {
      checkLoginStatus();
    };

    window.addEventListener("authChanged", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("authChanged", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  return userProfile;
};
