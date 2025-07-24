import { ConfidenceInterval } from "@/types/goal";

export function getConfidenceLevel(interval: ConfidenceInterval) {
  const range = interval.high - interval.low;

  if (range <= 5) return { level: "매우 높음", color: "green", score: 5 };
  if (range <= 10) return { level: "높음", color: "blue", score: 4 };
  if (range <= 15) return { level: "보통", color: "yellow", score: 3 };
  if (range <= 20) return { level: "낮음", color: "orange", score: 2 };
  return { level: "매우 낮음", color: "red", score: 1 };
}

export function formatConfidenceInterval(interval: ConfidenceInterval) {
  return `${interval.low.toFixed(1)}% - ${interval.high.toFixed(1)}%`;
}

export function getConfidenceColor(interval: ConfidenceInterval) {
  const range = interval.high - interval.low;
  if (range <= 5) return "text-green-600"; // 매우 안정적
  if (range <= 10) return "text-blue-600"; // 높음
  if (range <= 15) return "text-yellow-600"; // 보통
  if (range <= 20) return "text-orange-600"; // 낮음
  return "text-red-600"; // 매우 낮음
}

export function getConfidenceBadgeColor(interval: ConfidenceInterval) {
  const range = interval.high - interval.low;
  if (range <= 5) return "bg-green-100 text-green-800";
  if (range <= 10) return "bg-blue-100 text-blue-800";
  if (range <= 15) return "bg-yellow-100 text-yellow-800";
  if (range <= 20) return "bg-orange-100 text-orange-800";
  return "bg-red-100 text-red-800";
}
