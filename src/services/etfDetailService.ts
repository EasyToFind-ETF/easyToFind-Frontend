import { ETFDetail, ETFDetailResponse } from "@/types/etf";

// ETF 상세 정보 가져오기
export const fetchETFDetail = async (
  etf_code: string
): Promise<ETFDetail | null> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const url = `${baseUrl}/api/etfs/${etf_code}`;

    console.log("ETFDetailService - Fetching URL:", url);

    const res = await fetch(url);
    console.log("ETFDetailService - Response status:", res.status);

    const json = await res.json();
    console.log("ETFDetailService - Response data:", json);

    return json.data || null;
  } catch (err) {
    console.error("ETF 상세 정보 가져오기 실패:", err);
    return null;
  }
};

// ETF 구성종목 데이터 가져오기 (날짜별)
export const fetchETFHoldings = async (
  etf_code: string,
  date?: string
): Promise<any[] | null> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const url = new URL(`${baseUrl}/api/etfs/${etf_code}`);

    if (date) {
      url.searchParams.set("date", date);
    }

    const res = await fetch(url.toString());
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error("ETF 구성종목 가져오기 실패:", err);
    return [];
  }
};

// ETF 수익률 데이터 가져오기 (기간별)
export const fetchETFReturns = async (
  etf_code: string,
  period?: string
): Promise<any | null> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const url = new URL(`${baseUrl}/api/etfs/${etf_code}/returns`);

    if (period) {
      url.searchParams.set("period", period);
    }

    const res = await fetch(url.toString());
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.error("ETF 수익률 가져오기 실패:", err);
    return null;
  }
};
