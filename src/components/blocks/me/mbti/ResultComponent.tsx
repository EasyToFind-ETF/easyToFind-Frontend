import ResultComponentClient from "./ResultComponent.client";

export default function ResultComponent({
  theme,
  riskScore,
}: {
  theme: string;
  riskScore: number[];
}) {
  return <ResultComponentClient theme={theme} riskScore={riskScore}/>;

}