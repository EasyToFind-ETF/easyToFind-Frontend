"use client"
import React, { createContext, useContext, useEffect, useState } from "react";

// 쿠키 파싱 유틸
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split(";").map((c) => c.trim());
  const match = cookies.find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
};

interface AuthContextType {
  isLoggedIn: boolean;
  checkLogin: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  checkLogin: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLogin = () => {
    const token = getCookie("authToken");
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    checkLogin();
    window.addEventListener("authChanged", checkLogin);
    return () => {
      window.removeEventListener("authChanged", checkLogin);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, checkLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 