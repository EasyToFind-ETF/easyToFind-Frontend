import ETFDetailHeader from "./ETFDetailHeader.client";
import ETFDetailSidebar from "./ETFDetailSidebar.client";
import ETFDetailInfo from "./ETFDetailInfo.client";
import ETFDetailYield from "./ETFDetailYield.client";
import ETFDetailRisk from "./ETFDetailRisk.client";
import ETFDetailStandardPrice from "./ETFDetailStandardPrice.client";
import ETFDetailHoldings from "./ETFDetailHoldings.client";

interface ETFDetailProps {
  etf_code: string;
}

export default function ETFDetail({ etf_code }: ETFDetailProps) {
  return (
    <div>
      <ETFDetailHeader etf_code={etf_code} />
      <div className="flex">
        <ETFDetailSidebar etf_code={etf_code} />
        <div className="flex-1">
          <ETFDetailInfo etf_code={etf_code} />
          <ETFDetailYield etf_code={etf_code} />
          <ETFDetailRisk etf_code={etf_code} />
          <ETFDetailStandardPrice etf_code={etf_code} />
          <ETFDetailHoldings etf_code={etf_code} />
        </div>
      </div>
    </div>
  );
}
