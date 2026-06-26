import AdminLayout from "@/components/admin/AdminLayout";
import AdminCoupons from "@/components/admin/AdminCoupons";

export default function AdminCouponsPage() {
  return (
    <AdminLayout>
      <h1 className="text-4xl font-bold">Coupons</h1>
      <p className="mt-3 text-zinc-400">
        Create and disable on-chain coupon codes for card purchases.
      </p>

      <AdminCoupons />
    </AdminLayout>
  );
}