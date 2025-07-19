"use client";

import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { IconInput } from "@/components/ui/IconInput";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("이메일과 비밀번호를 모두 입력하세요.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_email: email,
          password,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "로그인 실패");
      }
      alert("로그인 성공!");
      localStorage.setItem("isLoggedIn", "true");
      window.dispatchEvent(new Event("authChanged"));
      router.push("/");
    } catch (err: any) {
      alert(err.message || "로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 mt-10">
      <div>
        <h2 className="text-3xl font-bold">로그인</h2>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
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
          <IconInput
            id="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            icon={<Lock className="h-4 w-4 text-gray-400" />}
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>
      <p className="text-center text-sm">
        계정이 없으신가요?{" "}
        <Link
          href="/signup"
          className="font-semibold text-blue-600 hover:underline"
        >
          회원가입
        </Link>
      </p>
    </div>
  );
} 