import AdminLayout from "@/components/admin/AdminLayout";
import AdminOrders from "@/components/admin/AdminOrders";

export default function AdminOrdersPage() {
  return (
    <AdminLayout>
      <h1 className="text-4xl font-bold">Physical Orders</h1>
      <p className="mt-3 text-zinc-400">
        Manage physical card shipments, carriers, and tracking numbers.
      </p>

      <AdminOrders />
    </AdminLayout>
  );
}