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
  score?: number; // risk용
  value?: ThemeEnum; // theme용
}

export interface Question {
  type: QuestionType;
  question: string;
  options: Option[];
  icon: string; // 아이콘 경로
}

export const mbtiQuestions: Question[] = [
  // ✅ 투자성향 판단용 (7문항)
  {
    type: "risk",
    question: "여윳돈 500만원이 생긴다면 어떤걸 하실건가요?",
    options: [
      { text: "단타 매매나 인기 ETF에 몰빵", score: 5 },
      { text: "절반은 투자, 절반은 보관", score: 4 },
      { text: "저위험 ETF에 분산 투자", score: 3 },
      { text: "예적금과 소액 ETF로 나눔", score: 2 },
      { text: "일단 은행에 넣고 고민", score: 0 },
    ],
    icon: "/mbtiTest1.png",
  },
  {
    type: "risk",
    question: "친구가 추천한 ETF가 일주일 새 10% 올랐다면?",
    options: [
      { text: "당장 따라 산다", score: 5 },
      { text: "더 오르기 전에 일부만 산다", score: 4 },
      { text: "뉴스와 차트를 좀 더 본다", score: 3 },
      { text: "일단 보류한다", score: 2 },
      { text: "따라 사는 건 위험하다 생각", score: 0 },
    ],
    icon: "/mbtiTest3.png",
  },
  {
    type: "risk",
    question: "투자로 10% 손실이 발생했다면 어떻게 하시겠어요?",
    options: [
      { text: "같은 종목을 더 산다 (물타기)", score: 5 },
      { text: "다른 ETF로 리밸런싱", score: 4 },
      { text: "일단 기다려본다", score: 3 },
      { text: "손절하고 ETF를 바꾼다", score: 2 },
      { text: "더 이상 투자는 안 한다", score: 0 },
    ],
    icon: "/mbtiTest4.png",
  },
  {
    type: "risk",
    question: "본인의 투자 목적은 무엇인가요?",
    options: [
      { text: "단기 수익 극대화", score: 5 },
      { text: "1~2년 내 차익 실현", score: 4 },
      { text: "중간 위험의 장기 투자", score: 3 },
      { text: "노후 대비 안정적 투자", score: 2 },
      { text: "목돈 보관 및 원금 보전", score: 0 },
    ],
    icon: "/mbtiTest9.png",
  },
  {
    type: "risk",
    question: "ETF에 대한 투자 비중은 얼마나 되나요?",
    options: [
      { text: "80% 이상", score: 5 },
      { text: "절반 이상", score: 4 },
      { text: "30~50%", score: 3 },
      { text: "10~30%", score: 2 },
      { text: "10% 미만 또는 없음", score: 0 },
    ],
    icon: "/mbtiTest6.png",
  },
  {
    type: "risk",
    question: "다음 중 가장 공감되는 문장은?",
    options: [
      { text: "기회는 위기 속에 있다", score: 5 },
      { text: "남들이 두려워할 때 나는 산다", score: 4 },
      { text: "균형 잡힌 투자가 중요하다", score: 3 },
      { text: "수익보다 안정이 중요하다", score: 2 },
      { text: "안전한 게 최고다", score: 0 },
    ],
    icon: "/mbtiTest5.png",
  },
  {
    type: "risk",
    question: "ETF나 투자 뉴스는 언제 주로 확인하시나요?",
    options: [
      { text: "매일 여러 번 확인한다", score: 5 },
      { text: "출퇴근/점심시간에 본다", score: 4 },
      { text: "퇴근 후 한번 본다", score: 3 },
      { text: "주말에 정리해서 본다", score: 2 },
      { text: "거의 안 본다", score: 0 },
    ],
    icon: "/mbtiTest8.png",
  },

  // ✅ 테마 판단용 
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
