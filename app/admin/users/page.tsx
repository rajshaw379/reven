import AdminLayout from "@/components/admin/AdminLayout";
import AdminUsers from "@/components/admin/AdminUsers";

export default function AdminUsersPage() {
  return (
    <AdminLayout>
      <h1 className="text-4xl font-bold">Users</h1>
      <p className="mt-3 text-zinc-400">
        View registered users, linked Telegram accounts, wallets, and cards.
      </p>

      <AdminUsers />
    </AdminLayout>
  );
}