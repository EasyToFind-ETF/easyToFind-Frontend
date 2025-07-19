import ETFDetailHeader from "./ETFDetailHeader.client";
import ETFDetailSidebar from "./ETFDetailSidebar.client";
import ETFDetailInfo from "./ETFDetailInfo.client";
import ETFDetailYield from "./ETFDetailYield.client";
import ETFDetailRisk from "./ETFDetailRisk.client";
import ETFDetailStandardPrice from "./ETFDetailStandardPrice.client";
import ETFDetailHoldings from "./ETFDetailHoldings.client";

export default function ETFDetail() {
    return (
        <div>
            <ETFDetailHeader />
            <div className="flex">
                <ETFDetailSidebar />
                <div className="flex-1">
                    <ETFDetailInfo />
                    <ETFDetailYield />
                    <ETFDetailRisk />
                    <ETFDetailStandardPrice />
                    <ETFDetailHoldings />
                </div>
            </div>
        </div>
    );
}