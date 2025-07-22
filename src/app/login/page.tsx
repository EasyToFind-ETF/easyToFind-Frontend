"use client";

import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { IconInput } from "@/components/ui/IconInput";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_email: email,
          password,
        }),
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "로그인 실패");
      }
      const data = await res.json();
      if (!data.token) {
        throw new Error("토큰이 응답에 없습니다.");
      }
      // 서버에서 Set-Cookie 헤더로 HttpOnly + Secure 쿠키를 설정하므로
      // 클라이언트에서 별도로 쿠키를 설정할 필요가 없습니다.
      alert("로그인 성공!");
      window.dispatchEvent(new Event("authChanged"));
      router.push("/");
    } catch (err: any) {
      alert(err.message || "로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className="flex min-h-[calc(100vh-5rem)]">
      {/* <aside
        className="sticky top-0 w-full md:w-[280px] flex-shrink-0 py-10 bg-white rounded-r-3xl"
        style={{ marginTop: 50, backgroundColor: '#F1F3F8'}}
      >
        <div className="mb-10 flex flex-col items-start">
          <div className="text-2xl font-bold text-gray-800 text-left leading-tight">
            로그인
          </div>
        </div>
      </aside> */}

      {/* 메인 콘텐츠 */}
      <div className="mx-auto w-full flex-1 min-w-0 pl-10 max-w-[720px] flex items-center">
        <div className="bg-white rounded-3xl w-full px-16 py-16 shadow min-h-[500px] flex items-center" style={{ borderRadius: '4rem' }}>
          <div className="flex flex-col w-full gap-4">
            <div className="mx-auto w-full max-w-sm">
              {/* 로그인 폼 */}
              <div className="mb-16">
                <h2 className="text-3xl text-gray-700">로그인</h2>
                {/* <p className="text-gray-600 mt-2">회원가입을 진행할게요</p> */}
              </div>
              
              <form className="w-full" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <IconInput
                    id="email"
                    type="email"
                    placeholder="아이디 (이메일)"
                    icon={<Mail className="h-4 w-4 text-gray-400" />}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
                <div className="mb-0">
                  <div className="relative">
                    <IconInput
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="비밀번호"
                      icon={<Lock className="h-4 w-4 text-gray-400" />}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      autoComplete="current-password"
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
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 mt-10 rounded-xl bg-[#0046ff] py-3 font-semibold text-white hover:bg-[#0046ff] disabled:opacity-60 transition-colors"
                  disabled={loading}
                >
                  {loading ? "로그인 중..." : "로그인"}
                </button>
              </form>
              <div>
                <p className="text-center text-sm mt-2 text-gray-600">
                    계정이 없으신가요?
                    <Link
                      href="/signup"
                      className="text-sm text-[#0046ff] hover:bold ml-4"
                    >
                      회원가입
                    </Link>
                  </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 