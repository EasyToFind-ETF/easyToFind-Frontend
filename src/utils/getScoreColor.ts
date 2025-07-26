export const getScoreColor = (score: number) => {
  if (score >= 3500) return "text-red-500";
  if (score >= 2500) return "text-blue-500";
  return "text-gray-500";
}; 