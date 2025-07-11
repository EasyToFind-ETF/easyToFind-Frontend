import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react";
import UserIcon from "@/assets/icons/User Thumb.png";
import logoImg from "@/assets/icons/Easy To Find 로고.png";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full h-20 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-full max-w-screen-2xl items-center">
        {/* 로고 */}
        <Link href="/" className="mr-6 flex items-center space-x-6">
          <Image
            src={logoImg}
            alt="Easy To Find 로고"
            width={180}
            height={100}
          />
        </Link>

        {/* 네비게이션 메뉴 */}
        <nav className="flex flex-1 justify-center items-center gap-20 text-lg">
          <Link
            href="/explore"
            className="text-foreground/60 transition-colors hover:text-foreground/80"
          >
            ETF 탐색
          </Link>
          <Link
            href="/analysis"
            className="text-foreground/60 transition-colors hover:text-foreground/80"
          >
            전략 분석
          </Link>
          <Link
            href="/recommend"
            className="text-foreground/60 transition-colors hover:text-foreground/80"
          >
            맞춤 추천
          </Link>
        </nav>

        {/* 프로필 아이콘 */}
        <div className="flex items-center justify-end">
          <button className="p-2 rounded-full hover:bg-accent">
            <Image
              src={UserIcon}
              alt="User"
              width={32}
              height={32}
              className="h-10 w-10"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
