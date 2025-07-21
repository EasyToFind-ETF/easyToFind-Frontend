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
  // ✅ 성향 판단 (4요소 가중치)
  {
    type: "risk",
    question: "ETF를 고를 때 가장 중요한 기준은 무엇인가요?",
    options: [
      { text: "수익률이 가장 중요하다", weights: [5, 2, 1, 2] },
      { text: "언제든 사고팔 수 있어야 한다", weights: [2, 5, 1, 2] },
      { text: "지수와의 오차가 적은 것이 좋다", weights: [1, 2, 5, 2] },
      { text: "운용규모가 크고 안정적인 게 좋다", weights: [1, 2, 1, 5] },
    ],
    icon: "/mbtiTest1.png",
  },
  {
    type: "risk",
    question: "ETF에 투자하려는 이유는 무엇인가요?",
    options: [
      { text: "주식보다 수익률이 더 높아 보여서", weights: [5, 2, 1, 2] },
      { text: "원할 때 사고팔 수 있어서", weights: [2, 5, 1, 2] },
      { text: "시장 지수를 그대로 따르니까", weights: [1, 2, 5, 2] },
      { text: "안정적으로 오래 투자할 수 있어서", weights: [1, 2, 1, 5] },
    ],
    icon: "/mbtiTest2.png",
  },
  {
    type: "risk",
    question: "내가 투자하려는 ETF가 갑자기 거래량이 확 줄었다면?",
    options: [
      { text: "수익률만 괜찮으면 상관없다", weights: [5, 1, 2, 2] },
      { text: "매도 타이밍을 위해 거래량이 중요하다", weights: [2, 5, 1, 2] },
      { text: "지수 추종이 정확한지가 더 중요하다", weights: [1, 2, 5, 2] },
      { text: "운용사 규모를 확인한다", weights: [1, 2, 1, 5] },
    ],
    icon: "/mbtiTest3.png",
  },
  {
    type: "risk",
    question: "ETF를 추천받았는데 수익률이 좋아도 규모가 작다면?",
    options: [
      { text: "수익률이 좋으면 투자한다", weights: [5, 1, 2, 1] },
      { text: "거래량이 많다면 상관 없다", weights: [3, 5, 1, 1] },
      { text: "규모가 작으면 불안하다", weights: [1, 2, 2, 5] },
      { text: "시장 대표 ETF인지 먼저 본다", weights: [2, 2, 5, 3] },
    ],
    icon: "/mbtiTest4.png",
  },
  {
    type: "risk",
    question: "처음 ETF를 접했을 때 어떤 부분이 가장 인상 깊었나요?",
    options: [
      { text: "높은 수익률 가능성", weights: [5, 2, 1, 2] },
      { text: "언제든 거래 가능한 유연함", weights: [2, 5, 1, 2] },
      { text: "지수를 따라가는 구조", weights: [1, 2, 5, 2] },
      { text: "믿을 수 있는 운용사와 안정성", weights: [1, 2, 1, 5] },
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
