"use client";

import Link from "next/link";
import { User, Mail, Lock, Calendar, Eye, EyeOff } from "lucide-react";
import { IconInput } from "../ui/IconInput";
import { useState } from "react";

export const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-md space-y-6">
      <div>
        <h2 className="text-3xl font-bold">회원가입</h2>
      </div>
      <form className="space-y-4">
        <div>
          <label className="text-sm font-medium" htmlFor="name">
            이름
          </label>
          <IconInput
            id="name"
            type="text"
            placeholder="홍길동"
            icon={<User className="h-4 w-4 text-gray-400" />}
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
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setShowPassword(!showPassword)}
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
            type="text"
            placeholder="1990.00.00"
            icon={<Calendar className="h-4 w-4 text-gray-400" />}
          />
        </div>
        <div className="flex items-center space-x-2 pt-2">
          <input type="checkbox" id="terms" className="h-4 w-4" />
          <label htmlFor="terms" className="text-sm">
            <Link href="/terms" className="text-blue-600 hover:underline">
              이용약관 및 개인정보처리방침
            </Link>
            에 동의합니다.
          </label>
        </div>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700"
        >
          <User className="h-4 w-4" />
          회원가입
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
