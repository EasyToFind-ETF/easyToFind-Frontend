"use client";

import { useState, useEffect } from "react";

interface UserRiskProfile {
  isLoggedIn: boolean;
  riskScore: number | null;
  isLoading: boolean;
}

export const useUserRiskProfile = () => {
  const [userProfile, setUserProfile] = useState<UserRiskProfile>({
    isLoggedIn: false,
    riskScore: null,
    isLoading: true,
  });

  useEffect(() => {
    const checkLoginStatus = async () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

      if (isLoggedIn) {
        try {
          // 로그인된 사용자의 위험 성향 점수를 가져오는 API 호출
          const response = await fetch(
            "http://localhost:3001/api/me/risk-profile",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              // 실제로는 쿠키나 토큰을 사용해야 함
            }
          );

          if (response.ok) {
            const data = await response.json();
            setUserProfile({
              isLoggedIn: true,
              riskScore: data.riskScore || 50,
              isLoading: false,
            });
          } else {
            // API 호출 실패 시 목업 데이터 사용 (실제 개발 시에는 실제 API 사용)
            // 임시로 로그인된 사용자는 65점의 공격형 성향을 가진다고 가정
            setUserProfile({
              isLoggedIn: true,
              riskScore: 65, // 목업 데이터: 공격형 성향
              isLoading: false,
            });
          }
        } catch (error) {
          // 에러 발생 시 목업 데이터 사용
          setUserProfile({
            isLoggedIn: true,
            riskScore: 65, // 목업 데이터: 공격형 성향
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
