import ETFDetail from "@/components/blocks/ETFDetail/ETFDetail";

interface ETFDetailPageProps {
  params: Promise<{
    etf_code: string;
  }>;
}

export default async function ETFDetailPage({ params }: ETFDetailPageProps) {
  const { etf_code } = await params;
  return <ETFDetail etf_code={etf_code} />;
}