import AdminLayout from "@/components/admin/AdminLayout";
import AdminCards from "@/components/admin/AdminCards";

export default function AdminCardsPage() {
  return (
    <AdminLayout>
      <h1 className="text-4xl font-bold">Cards</h1>

      <p className="mt-3 text-zinc-400">
        Manage every NFT card minted on Reven.
      </p>

      <AdminCards />
    </AdminLayout>
  );
}