export interface EtfReturns {
    [key: string]: string | number;
  }
  
  export interface Etf {
    etf_code: string;
    etf_name: string;
    provider: string;
    asset_class: string;
    theme: string;
    expense_ratio: number;
    returns: EtfReturns;
  }
  
  export const fetchEtfs = async (
    query = "",
    sort = "etf_code",
    assetClass = "",
    theme = "미국",
    isFavorite = false
  ): Promise<Etf[]> => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = new URL(`${baseUrl}/api/etfs`);
      url.searchParams.set("query", query);
      url.searchParams.set("sort", sort);
      url.searchParams.set("assetClass", assetClass);
      url.searchParams.set("theme", theme);
      url.searchParams.set("isFavorite", isFavorite.toString());
  
      const res = await fetch(url.toString());
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      console.error("❌ ETF 데이터 가져오기 실패:", err);
      return [];
    }
  };
  