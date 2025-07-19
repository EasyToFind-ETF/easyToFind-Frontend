import ResultComponentClient from "./ResultComponent.client";

export default function ResultComponent({
  riskType,
  theme,
  riskScore,
}: {
  riskType: string;
  theme: string;
  riskScore: number;
}) {
  return <ResultComponentClient riskType={riskType} theme={theme} riskScore={riskScore}/>;

}