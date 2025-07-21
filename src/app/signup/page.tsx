"use client";

import Link from "next/link";
import { User, Mail, Lock, Calendar, Eye, EyeOff } from "lucide-react";
import { IconInput } from "@/components/ui/IconInput";
import { useSignUpForm } from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  const {
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
  } = useSignUpForm();

  return (
    <div className="flex">
      {/* 메인 콘텐츠 */}
      <div className="mx-auto w-full flex-1 min-w-0 pt-10 max-w-[850px]">
        <div className="bg-white rounded-3xl w-full px-16 py-16 shadow min-h-[500px] flex items-center" style={{ borderRadius: '4rem' }}>
          <div className="flex flex-col items-center justify-center w-full gap-4">
            {/* 회원가입 폼 */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">회원가입</h2>
              <p className="text-gray-600 mt-2">새로운 계정을 만드세요</p>
            </div>
            
            <form className="w-full max-w-sm" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-6" htmlFor="name">
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
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-6" htmlFor="email">
                  아이디 (이메일)
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
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-6" htmlFor="password">
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
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-6" htmlFor="birthdate">
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
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="h-4 w-4"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  <Link href="/terms" className="text-[#0046ff] hover:underline">
                    이용약관 및 개인정보처리방침
                  </Link>
                  에 동의합니다.
                </label>
              </div>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 mt-10 rounded-xl bg-[#0046ff] py-3 font-semibold text-white hover:bg-[#0046ff] disabled:opacity-60 transition-colors"
                disabled={loading}
              >
                <User className="h-4 w-4" />
                {loading ? "가입 중..." : "회원가입"}
              </button>
            </form>
            
            <div>
              <p className="text-center text-sm text-gray-600">
                이미 계정이 있으신가요?
                <Link
                  href="/login"
                  className="text-sm text-[#0046ff] hover:bold ml-4"
                >
                  로그인하기
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
