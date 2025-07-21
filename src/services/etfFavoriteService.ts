export async function toggleFavorite(etfCode: string, isFavorite: boolean) {
    const method = isFavorite ? "DELETE" : "POST";
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/me/favorites/${etfCode}`;
  
    // console.log("🚀 관심 ETF 토글 요청 시작");
    // console.log("➡️ ETF 코드:", etfCode);
    // console.log("➡️ 요청 방식:", method);
    // console.log("➡️ 요청 URL:", url);
  
    try {
      const res = await fetch(url, {
        method,
        credentials: "include",
      });
  
      // console.log("📡 응답 상태 코드:", res.status);
  
      if (!res.ok) {
        const errorText = await res.text(); // 에러 디테일 받아오기
        console.error("❌ 서버 응답 에러:", errorText);
        throw new Error(`관심 ETF ${isFavorite ? "삭제" : "등록"} 실패`);
      }
  
      const result = await res.json();
      // console.log("✅ 성공 응답 내용:", result);
  
      return result;
    } catch (err) {
      console.error("💥 fetch 실패:", err);
      throw err;
    }
  }

  export async function fetchFavoriteEtfCodes(): Promise<string[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/me/favorites`, {
      credentials: "include",
    });
  
    if (!res.ok) throw new Error("관심 ETF 목록 조회 실패");
  
    const json = await res.json();
    console.log("관심 ETF 목록: ", json.data);
    return json.data;
  }