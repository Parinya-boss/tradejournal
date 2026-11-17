import { Link, useParams } from "react-router";

export default function AccountDetailPage() {
  const { accountId } = useParams();

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
      <h1 className="text-3xl font-bold">รายละเอียดบัญชีเทรด</h1>

      <p className="mt-3 text-slate-300">รหัสบัญชี: {accountId}</p>

      <Link to="/" className="mt-6 inline-block text-emerald-400 underline">
        กลับหน้าหลัก
      </Link>
    </main>
  );
}
