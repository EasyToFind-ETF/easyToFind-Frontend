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
  weights?: [number, number, number, number]; // [수익률, 유동성, 추적오차, 규모]
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
    question: "투자를 시작할 때 가장 먼저 고려하는 것은?",
    options: [
      { text: "손실 위험이 적은지", weights: [5, 1, 2, 2] },
      { text: "언제든지 팔 수 있는지", weights: [2, 5, 1, 2] },
      { text: "높은 수익을 낼 가능성", weights: [1, 2, 5, 2] },
      { text: "여러 자산에 분산돼 있는지", weights: [2, 2, 1, 5] },
    ],
    icon: "/mbtiTest3.png",
  },
  {
    type: "risk",
    question: "주식시장이 불안정할 때 나는?",
    options: [
      { text: "손실을 피하기 위해 현금화한다", weights: [5, 2, 1, 2] },
      { text: "거래가 원활한 종목만 남긴다", weights: [2, 5, 1, 2] },
      { text: "이럴 때일수록 더 공격적으로 투자", weights: [1, 1, 5, 2] },
      { text: "분산된 자산으로 리스크를 줄인다", weights: [3, 2, 1, 5] },
    ],
    icon: "/mbtiTest10.png",
  },
  {
    type: "risk",
    question: "나에게 ETF란?",
    options: [
      { text: "수익을 낼 수 있는 도구이다.", weights: [1, 2, 5, 2] },
      { text: "주식보다 안정적인 투자이다.", weights: [5, 1, 2, 2] },
      { text: "언제든 사고팔 수 있는 유동 자산이다.", weights: [2, 5, 1, 2] },
      { text: "다양한 자산에 한번에 투자할 수 있는 수단이다.", weights: [2, 2, 1, 5] },
    ],
    icon: "/mbtiTest6.png",
  },
  {
    type: "risk",
    question: "아래 ETF중 하나를 고른다면?",
    options: [
      { text: "거래량은 적지만 꾸준한 수익률", weights: [5, 2, 2, 1] },
      { text: "거래량이 많고 언제든 매도 가능", weights: [2, 5, 1, 2] },
      { text: "조금 불안하지만 단기 고수익 기대", weights: [1, 2, 5, 1] },
      { text: "다양한 자산에 골고루 담긴 ETF", weights: [3, 2, 1, 5] },
    ],
    icon: "/mbtiTest6.png",
  },
  {
    type: "risk",
    question: "ETF가 수익률은 좋지만 구성종목이 단 3개뿐이라면?",
    options: [
      { text: "수익률이 좋다면 괜찮다", weights: [1, 2, 5, 1] },
      { text: "구성 종목이 너무 적으면 불안하다", weights: [5, 2, 1, 5] },
      { text: "어차피 시장에 따라 움직일 것 같다", weights: [2, 2, 3, 3] },
      { text: "분산이 안되면 리스크가 크다", weights: [3, 1, 1, 5] },
    ],
    icon: "/mbtiTest5.png",
  },

  // ✅ 테마 판단
  {
    type: "theme",
    question: "가장 관심 있는 산업은?",
    options: [
      { text: "AI / 로봇 / 클라우드", value: "인공지능" },
      { text: "친환경 / 수소차 / 탄소중립", value: "친환경" },
      { text: "반도체 / 전기차", value: "산업재" },
      { text: "바이오 / 정밀의료", value: "헬스케어" },
      { text: "글로벌 분산 투자", value: "미국" },
    ],
    icon: "/mbtiTest7.png",
  },
];
