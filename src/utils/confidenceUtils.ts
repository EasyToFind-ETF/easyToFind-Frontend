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
  if (range <= 5) return "text-blue-600"; // blue-500
  if (range <= 10) return "text-green-600"; // green-500
  if (range <= 15) return "text-yellow-600"; // yellow-500
  if (range <= 20) return "text-orange-600"; // orange-500
  return "text-red-600"; // red-500
}

export function getConfidenceBadgeColor(interval: ConfidenceInterval) {
  const range = interval.high - interval.low;
  if (range <= 5) return "bg-[#F2F8FC] text-[#0046ff]";
  if (range <= 10) return "bg-[#F2F8FC] text-[#4DB6FF]";
  if (range <= 15) return "bg-[#F6F7F9] text-gray-700";
  if (range <= 20) return "bg-[#F6F7F9] text-gray-600";
  return "bg-[#F6F7F9] text-gray-500";
}
