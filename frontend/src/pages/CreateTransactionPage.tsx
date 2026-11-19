import { Link, useParams } from "react-router";
import TransactionForm from "../features/transactions/components/TransactionForm";

type CreateTransactionPageProps = {
  accessToken: string;
};

export default function CreateTransactionPage({
  accessToken,
}: CreateTransactionPageProps) {
  const { accountId } = useParams();

  if (
    !accountId ||
    !/^[1-9]\d*$/.test(accountId) ||
    Number(accountId) > 2147483647
  ) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
        <p role="alert">รหัสบัญชีเทรดไม่ถูกต้อง</p>

        <Link to="/" className="mt-6 inline-block text-emerald-400 underline">
          กลับหน้าหลัก
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
      <h1 className="text-3xl font-bold">ส่งคำขอฝาก-ถอน</h1>

      <p className="mt-4">รหัสบัญชีเทรด: {accountId}</p>
      <TransactionForm
        key={accountId}
        accessToken={accessToken}
        tradingAccountId={Number(accountId)}
      />
      <Link
        to={`/accounts/${accountId}`}
        className="mt-6 inline-block text-emerald-400 underline"
      >
        กลับหน้ารายละเอียดบัญชี
      </Link>
    </main>
  );
}
