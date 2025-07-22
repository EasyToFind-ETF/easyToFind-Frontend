"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export const useSignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birth, setBirth] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert("이용약관에 동의해야 합니다.");
      return;
    }
    if (!name || !email || !password || !birth) {
      alert("이메일, 비밀번호, 생년월일을 모두 입력하세요.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_email: email,
            password,
            birth,
            name,
          }),
        }
      );ashed changes
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "회원가입 실패");
      }
      alert("회원가입이 완료되었습니다! 로그인 해주세요.");
      localStorage.setItem("isLoggedIn", "true");
      window.dispatchEvent(new Event("authChanged"));
      router.push("/");
    } catch (err: any) {
      alert(err.message || "회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return {
    showPassword,
    setShowPassword,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    birth,
    setBirth,
    agreed,
    setAgreed,
    loading,
    handleSubmit,
  };
};
