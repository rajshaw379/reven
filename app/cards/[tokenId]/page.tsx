import CardDetailsClient from "@/components/cards/CardDetailsClient";

export default async function CardDetailsPage({
  params,
}: {
  params: Promise<{ tokenId: string }>;
}) {
  const { tokenId } = await params;

  return <CardDetailsClient tokenId={tokenId} />;
}