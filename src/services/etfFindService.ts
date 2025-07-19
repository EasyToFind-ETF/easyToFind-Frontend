import { ETFView } from "@/types/ETFView";
import { HoldingView } from "@/types/HoldingView";

export const fetchEtfData = async (params: any): Promise<ETFView[]> => {
    const queryParams = new URLSearchParams();
  
    if (params.query) queryParams.append("query", params.query);
    if (params.sort) queryParams.append("sort", params.sort);
    if (params.assetClass) queryParams.append("assetClass", params.assetClass);
    if (params.theme) queryParams.append("theme", params.theme);
    if (params.isFavorite) queryParams.append("isFavorite", "true");
  
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/etfs?${queryParams.toString()}`;
  
    console.log("📡 [ETF API] 요청함!! URL:", url);
  
    const res = await fetch(url);
    if (!res.ok) {
      console.error("❌ [ETF API] 요청 실패!", res.status, res.statusText);
      throw new Error("데이터 불러오기 실패");
    }
    const result = await res.json();
    return result.data;
  };

  export const fetchHoldingsData = async (params: any): Promise<HoldingView[]> => {
    const queryParams = new URLSearchParams();

    if (params.query) queryParams.append("query", params.query);
    if (params.sort) queryParams.append("sort", params.sort);
    if (params.assetClass) queryParams.append("assetClass", params.assetClass);
    if (params.theme) queryParams.append("theme", params.theme);
    if (params.isFavorite) queryParams.append("isFavorite", "true");

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/holdings?${queryParams.toString()}`;

    console.log("📡 [ETF API] 요청함!! URL:", url);

    const res = await fetch(url);
    if (!res.ok) {
      console.error("❌ [ETF API] 요청 실패!", res.status, res.statusText);
      throw new Error("데이터 불러오기 실패");
    }
    const result = await res.json();
    return result.data;
  }