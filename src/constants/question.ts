export type QuestionType = "risk" | "theme";

export type ThemeEnum =
  | "게임"
  | "금융"
  | "기술"
  | "배당"
  | "산업재"
  | "소비재"
  | "에너지"
  | "인공지능"
  | "친환경"
  | "헬스케어"
  | "미국"
  | "인도"
  | "일본"
  | "중국"
  | "기타";

export interface Option {
  text: string;
  weights?: [number, number, number, number]; // [안정성, 유동성, 성장도, 분산도]
  value?: ThemeEnum; // theme용
}

export interface Question {
  type: QuestionType;
  question: string;
  options: Option[];
  icon: string;
}

export const mbtiQuestions: Question[] = [
   // ✅ 투자 성향 판단
  {
    type: "risk",
    question: "투자를 시작할 때, 어떤 점을 가장 먼저 고려하시나요?",
    options: [
      { text: "손실 위험이 적은지가 가장 중요해요", weights: [5, 1, 2, 2] },
      { text: "언제든지 자유롭게 팔 수 있어야 해요", weights: [2, 5, 1, 2] },
      { text: "높은 수익 가능성이 가장 끌려요", weights: [1, 2, 5, 2] },
      { text: "여러 자산에 분산되어 있는지 중요하게 생각해요", weights: [2, 2, 1, 5] },
    ],
    icon: "/mbtiTest3.png",
  },
  {
    type: "risk",
    question: "주식시장이 불안정할 때, 어떻게 대응하시나요?",
    options: [
      { text: "손실을 줄이기 위해 현금화부터 해요", weights: [5, 2, 1, 2] },
      { text: "유동성이 높은 종목만 남겨두는 편이에요", weights: [2, 5, 1, 2] },
      { text: "위기일수록 더 과감하게 투자해요", weights: [1, 1, 5, 2] },
      { text: "자산을 분산시켜 리스크를 줄여요", weights: [3, 2, 1, 5] },
    ],
    icon: "/mbtiTest10.png",
  },
  {
    type: "risk",
    question: "ETF에 대해 가장 가까운 생각은 어떤가요?",
    options: [
      { text: "수익을 낼 수 있는 좋은 투자 수단이에요", weights: [1, 2, 5, 2] },
      { text: "주식보다 좀 더 안정적인 투자라고 생각해요", weights: [5, 1, 2, 2] },
      { text: "언제든 사고팔 수 있는 점이 마음에 들어요", weights: [2, 5, 1, 2] },
      { text: "한 번에 여러 자산에 투자할 수 있어 좋아요", weights: [2, 2, 1, 5] },
    ],
    icon: "/mbtiTest6.png",
  },
  {
    type: "risk",
    question: "아래 ETF 중 하나를 선택해야 한다면, 어떤 기준이 더 중요하신가요?",
    options: [
      { text: "거래량은 적어도 수익이 꾸준한 상품", weights: [5, 2, 2, 1] },
      { text: "언제든지 매도할 수 있는 높은 유동성", weights: [2, 5, 1, 2] },
      { text: "리스크는 있지만 단기 고수익이 기대되는 상품", weights: [1, 2, 5, 1] },
      { text: "다양한 종목에 분산 투자된 ETF", weights: [3, 2, 1, 5] },
    ],
    icon: "/mbtiTest6.png",
  },
  {
    type: "risk",
    question: "ETF 추천을 받았는데 수익률은 좋지만 구성 종목이 단 3개뿐이라면, 어떻게 생각하시나요?",
    options: [
      { text: "수익률이 좋다면 구성 종목 수는 상관없어요", weights: [1, 2, 5, 1] },
      { text: "종목이 너무 적으면 조금 불안할 것 같아요", weights: [5, 2, 1, 5] },
      { text: "시장 흐름을 따를 것 같아 괜찮다고 생각해요", weights: [2, 2, 3, 3] },
      { text: "분산이 안 되면 리스크가 커질 것 같아요", weights: [3, 1, 1, 5] },
    ],
    icon: "/mbtiTest5.png",
  },

  // ✅ 테마 판단
  {
    type: "theme",
    question: "가장 관심 있는 산업은 어떤 분야인가요?",
    options: [
      { text: "AI, 로봇, 클라우드 같은 미래 기술 분야", value: "인공지능" },
      { text: "친환경 에너지나 탄소중립 산업", value: "친환경" },
      { text: "반도체, 전기차 같은 제조·산업 기술", value: "산업재" },
      { text: "바이오, 헬스케어, 정밀의료 분야", value: "헬스케어" },
      { text: "글로벌 시장에 폭넓게 투자할 수 있는 분야", value: "미국" },
    ],
    icon: "/mbtiTest7.png",
  },
];
