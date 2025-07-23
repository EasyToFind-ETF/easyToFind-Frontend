"use client";
import React, { createContext, useContext, useEffect, useState, useMemo } from "react";

// 쿠키에서 authToken 가져오는 함수
const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split(";").map((c) => c.trim());
  const match = cookies.find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
};

interface AuthContextType {
  isLoggedIn: boolean;
  // 필요 시 checkLogin도 포함
  checkLogin?: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLogin = () => {
    const token = getCookie("authToken");
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    checkLogin(); // 최초 로딩 시 로그인 상태 확인
    window.addEventListener("authChanged", checkLogin);
    return () => {
      window.removeEventListener("authChanged", checkLogin);
    };
  }, []);

  const contextValue = useMemo(() => ({ isLoggedIn, checkLogin }), [isLoggedIn]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
