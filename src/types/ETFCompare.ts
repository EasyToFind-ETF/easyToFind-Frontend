export interface ETFCompare {
  id: string;
  name: string;
  code: string;
  price: number;
  returns: {
    "1주": number;
    "1개월": number;
    "3개월": number;
    "6개월": number;
    "1년": number;
    "3년": number;
    상장이후: number;
  };
  overallScore: number;
  sharpRatio: number;
  maxDrawdown: number;
  volatility: number;
  netAssets: string;
  listingDate: string;
  managementCompany: string;
} 