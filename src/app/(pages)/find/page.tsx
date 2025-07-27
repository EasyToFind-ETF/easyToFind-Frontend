import { Suspense } from "react";
import FindPageClient from "./findPageClient";

export default function FindPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <FindPageClient />
    </Suspense>
  );
}
