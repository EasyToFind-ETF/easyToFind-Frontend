export type QuestionType = "risk" | "theme";

export type ThemeEnum = "AI" | "GREEN" | "SEMI" | "BIO" | "GLOBAL";

export interface Option {
  text: string;
  score?: number; // risk용
  value?: ThemeEnum; // theme용
}

export interface Question {
  type: QuestionType;
  question: string;
  options: Option[];
}

export const mbtiQuestions: Question[] = [
  // ✅ 투자성향 판단용 (6문항)
  {
    type: "risk",
    question: "수익률 20%, 손실 가능성 10%인 상품이 있다면?",
    options: [
      { text: "무조건 투자", score: 5 },
      { text: "감수할 수 있다", score: 4 },
      { text: "고민된다", score: 3 },
      { text: "손실은 피하고 싶다", score: 2 },
      { text: "절대 투자 안 한다", score: 0 },
    ],
  },
  {
    type: "risk",
    question: "투자기간은?",
    options: [
      { text: "6개월 이내", score: 5 },
      { text: "1~2년", score: 4 },
      { text: "3년", score: 3 },
      { text: "5년", score: 2 },
      { text: "10년 이상", score: 0 },
    ],
  },
  {
    type: "risk",
    question: "급등한 ETF를 본다면?",
    options: [
      { text: "지금이라도 매수", score: 5 },
      { text: "절반만 들어가 본다", score: 4 },
      { text: "지켜본 후 판단", score: 3 },
      { text: "너무 위험해 보여 피한다", score: 2 },
      { text: "투자 대상 아님", score: 0 },
    ],
  },
  {
    type: "risk",
    question: "손실이 10% 발생했을 때의 대처는?",
    options: [
      { text: "추가 매수", score: 5 },
      { text: "일부 리밸런싱", score: 4 },
      { text: "기다려본다", score: 3 },
      { text: "손절하고 정리", score: 2 },
      { text: "바로 매도", score: 0 },
    ],
  },
  {
    type: "risk",
    question: "투자 시 가장 중요한 요소는?",
    options: [
      { text: "수익률 극대화", score: 5 },
      { text: "기대 성장성", score: 4 },
      { text: "위험-수익 균형", score: 3 },
      { text: "원금 보존 우선", score: 2 },
      { text: "안전성 및 장기 보유", score: 0 },
    ],
  },
  {
    type: "risk",
    question: "자산 중 ETF 투자 비중은?",
    options: [
      { text: "90% 이상", score: 5 },
      { text: "절반 이상", score: 4 },
      { text: "30~50%", score: 3 },
      { text: "10~30%", score: 2 },
      { text: "10% 미만", score: 0 },
    ],
  },

  // ✅ 테마 판단용 (4문항)
  {
    type: "theme",
    question: "가장 관심 있는 산업은?",
    options: [
      { text: "AI / 로봇 / 클라우드", value: "AI" },
      { text: "친환경 / 수소차 / 탄소중립", value: "GREEN" },
      { text: "반도체 / 전기차", value: "SEMI" },
      { text: "바이오 / 정밀의료", value: "BIO" },
      { text: "글로벌 분산 투자", value: "GLOBAL" },
    ],
  },
  {
    type: "theme",
    question: "평소 가장 자주 보는 뉴스는?",
    options: [
      { text: "테크 트렌드, 챗GPT 등 IT 이슈", value: "AI" },
      { text: "탄소중립, 기후위기 대응 정책", value: "GREEN" },
      { text: "반도체 수급, 삼성전자 관련 기사", value: "SEMI" },
      { text: "감염병, 고령화, 의료산업 기사", value: "BIO" },
      { text: "미국/중국/글로벌 경제 뉴스", value: "GLOBAL" },
    ],
  },
  {
    type: "theme",
    question: "투자 목표는?",
    options: [
      { text: "기술 혁신 산업 선점", value: "AI" },
      { text: "환경 변화에 따른 미래 산업 대응", value: "GREEN" },
      { text: "대한민국 핵심 제조업 투자", value: "SEMI" },
      { text: "헬스케어/바이오 장기 수익", value: "BIO" },
      { text: "전 세계 자산에 분산 투자", value: "GLOBAL" },
    ],
  },
  {
    type: "theme",
    question: "가장 중요하다고 느끼는 사회 이슈는?",
    options: [
      { text: "디지털 전환 / 자동화", value: "AI" },
      { text: "기후 위기 / ESG", value: "GREEN" },
      { text: "반도체 공급망 / 제조 경쟁", value: "SEMI" },
      { text: "고령화 / 보건복지", value: "BIO" },
      { text: "국가 간 경제 리스크", value: "GLOBAL" },
    ],
  },
];
