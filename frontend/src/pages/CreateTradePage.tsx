import { Link, useParams } from "react-router";
import CreateTradeForm from "../features/trades/components/CreateTradeForm";

type CreateTradePageProps = {
  accessToken: string;
};

export default function CreateTradePage({ accessToken }: CreateTradePageProps) {
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
      <h1 className="text-3xl font-bold">บันทึกการเทรด</h1>

      <p className="mt-4">รหัสบัญชีเทรด: {accountId}</p>
      <p className="mt-2 text-slate-300">สินทรัพย์ที่รองรับ: XAUUSD</p>

      <CreateTradeForm
        key={accountId}
        accessToken={accessToken}
        tradingAccountId={Number(accountId)}
      />
      <Link
        to={`/accounts/${accountId}/trades`}
        className="mt-6 inline-block text-emerald-400 underline"
      >
        กลับหน้าประวัติการเทรด
      </Link>
    </main>
  );
}
