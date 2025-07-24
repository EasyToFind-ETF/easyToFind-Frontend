import { Info } from "lucide-react";

export function ScoreExplanation() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 mb-8">
      <div className="flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-blue-900 mb-3">점수 체계 안내</h4>
          <div className="text-sm text-blue-700 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">성공률:</span>
              <span>목표 달성 확률 (0-100%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">리스크 점수:</span>
              <span>상대적 우수성 (0-100점)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">목표 점수:</span>
              <span>종합 평가 (성공률 50% + 리스크 30% + 개인화 20%)</span>
            </div>
          </div>
          <div className="text-xs text-blue-600 mt-3 p-2 bg-blue-100 rounded-lg">
            <strong>리스크 점수</strong>는 Z-score 기반으로 전체 ETF 대비 상대적
            우수성을 평가합니다. 높을수록 다른 ETF 대비 더 우수한 성과를
            보입니다.
          </div>
        </div>
      </div>
    </div>
  );
}
