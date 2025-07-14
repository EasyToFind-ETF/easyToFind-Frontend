import ETFVisualHeader from '@/components/ETFDetail/ETFDetailHeader';
import ETFDetailSidebar from '@/components/ETFDetail/ETFDetailSidebar';
import ETFDetailInfo from '@/components/ETFDetail/ETFDetailInfo';
import ETFYield from '@/components/ETFDetail/ETFYield';

export default function Home() {
  return (
    <div className="max-w-[1600px] mx-auto">
      <ETFVisualHeader />
      <div className="flex">
        <ETFDetailSidebar />
        <div className="flex-1 flex flex-col">
          <ETFDetailInfo />
          <ETFYield />
        </div>
      </div>
    </div>
  );
}
