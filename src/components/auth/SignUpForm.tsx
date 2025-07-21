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
    if (!email || !password || !birth) {
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
          credentials: "include", // 쿠키 포함
          body: JSON.stringify({
            user_email: email,
            password,
            birth,
          }),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "회원가입 실패");
      }

      // 회원가입 성공 후 자동 로그인
      alert("회원가입이 완료되었습니다! 자동으로 로그인됩니다.");

      // 쿠키 기반 인증으로 통일
      // 서버에서 Set-Cookie 헤더로 HttpOnly + Secure 쿠키를 설정하므로
      // 클라이언트에서 별도로 쿠키를 설정할 필요가 없습니다.

      // 인증 상태 변경 이벤트 발생
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
