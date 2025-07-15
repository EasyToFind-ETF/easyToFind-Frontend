import ETFVisualHeader from "@/components/ETFDetail/ETFDetailHeader";
import ETFDetailSidebar from "@/components/ETFDetail/ETFDetailSidebar";
import ETFDetailInfo from "@/components/ETFDetail/ETFDetailInfo";
import ETFYield from "@/components/ETFDetail/ETFYield";
import { Star } from "lucide-react";
import StartComponent from "@/components/me/mbti/StartComponent";
import ETFRisk from "@/components/ETFDetail/ETFRisk";

export default function Home() {
  return (
    <div className="max-w-screen-xl mx-auto">
      <ETFVisualHeader />
      <div className="flex">
        <ETFDetailSidebar />
        <div className="flex-1 flex flex-col">
          <ETFDetailInfo />
          <ETFYield />
          <ETFRisk />
        </div>
      </div>
    </div>
  );
}
