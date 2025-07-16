import ResultComponentClient from "./ResultComponent.client";
export default function ResultComponent({
  riskType,
  theme,
}: {
  riskType: string;
  theme: string;
}) {
  return <ResultComponentClient riskType={riskType} theme={theme} />;
}
