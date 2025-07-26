import { Info } from "lucide-react";

export function ScoreExplanation() {
  return (
    <div className="rounded-3xl p-4 mb-4 py-2 -mt-4">
      <div className="flex items-start gap-3">
        <Info className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-bold text-gray-600 mb-3">점수 체계 안내</h4>
          <div className="text-sm text-gray-600 flex flex-wrap gap-8">
            <span className="flex items-center gap-2">
              <span className="font-semibold">성공률:</span>
              <span>목표 달성 확률 (0-100%)</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="font-semibold">리스크 점수:</span>
              <span>상대적 우수성 (0-100점)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">목표 점수:</span>
              <span>종합 평가 (성공률 50% + 리스크 30% + 개인화 20%)</span>
            </div>
          </div>
          <div className="text-xs text-gray-600 mt-3 p-2 rounded-lg">
            <strong>리스크 점수</strong>는 Z-score 기반으로 전체 ETF 대비 상대적
            우수성을 평가합니다. 높을수록 다른 ETF 대비 더 우수한 성과를
            보입니다.
          </div>
        </div>
      </div>
    </div>
  );
}
