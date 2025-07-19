"use client";

import Link from "next/link";
import { User, Mail, Lock, Calendar, Eye, EyeOff } from "lucide-react";
import { IconInput } from "../ui/IconInput";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const SignUpForm = () => {
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
      const res = await fetch("http://localhost:3001/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_email: email,
          password,
          birth,
        }),
      });
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

  return (
    <div className="w-full max-w-md space-y-6">
      <div>
        <h2 className="text-3xl font-bold">회원가입</h2>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-medium" htmlFor="name">
            이름
          </label>
          <IconInput
            id="name"
            type="text"
            placeholder="홍길동"
            icon={<User className="h-4 w-4 text-gray-400" />}
            value={name}
            onChange={e => setName(e.target.value)}
            autoComplete="name"
          />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="email">
            이메일 (아이디)
          </label>
          <IconInput
            id="email"
            type="email"
            placeholder="example@email.com"
            icon={<Mail className="h-4 w-4 text-gray-400" />}
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="password">
            비밀번호
          </label>
          <div className="relative">
            <IconInput
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="8자 이상 입력하세요"
              icon={<Lock className="h-4 w-4 text-gray-400" />}
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="birthdate">
            생년월일
          </label>
          <IconInput
            id="birthdate"
            type="date"
            placeholder="YYYY-MM-DD"
            icon={<Calendar className="h-4 w-4 text-gray-400" />}
            value={birth}
            onChange={e => setBirth(e.target.value)}
            autoComplete="bday"
          />
        </div>
        <div className="flex items-center space-x-2 pt-2">
          <input
            type="checkbox"
            id="terms"
            className="h-4 w-4"
            checked={agreed}
            onChange={e => setAgreed(e.target.checked)}
          />
          <label htmlFor="terms" className="text-sm">
            <Link href="/terms" className="text-blue-600 hover:underline">
              이용약관 및 개인정보처리방침
            </Link>
            에 동의합니다.
          </label>
        </div>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          disabled={loading}
        >
          <User className="h-4 w-4" />
          {loading ? "가입 중..." : "회원가입"}
        </button>
      </form>
      <p className="text-center text-sm">
        이미 계정이 있으신가요?{" "}
        <Link
          href="/login"
          className="font-semibold text-blue-600 hover:underline"
        >
          로그인하기
        </Link>
      </p>
    </div>
  );
};
