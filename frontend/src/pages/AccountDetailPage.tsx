import { Link, useParams } from "react-router";
import type { TradingAccount } from "../features/trading-accounts/api/getMyTradingAccounts";
import { useEffect, useState } from "react";
import { getMyTradingAccount } from "../features/trading-accounts/api/getMyTradingAccount";
import TransactionHistorySection from "../features/transactions/components/TransactionHistorySection";

type AccountDetailPageProps = {
  accessToken: string;
  isCustomer: boolean;
};

type AccountDetailState =
  | { status: "loading" }
  | { status: "notFound" }
  | { status: "error"; message: string }
  | { status: "success"; account: TradingAccount };

type AccountDetailContentProps = {
  accessToken: string;
  accountId: string;
  isCustomer: boolean;
};

export default function AccountDetailPage({
  accessToken,
  isCustomer,
}: AccountDetailPageProps) {
  const { accountId } = useParams();

  if (!accountId) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
        <p>ไม่พบรหัสบัญชี</p>
        <Link to="/" className="mt-6 inline-block text-emerald-400 underline">
          กลับหน้าหลัก
        </Link>
      </main>
    );
  }

  return (
    <AccountDetailContent
      key={accountId}
      accessToken={accessToken}
      accountId={accountId}
      isCustomer={isCustomer}
    />
  );
}

function AccountDetailContent({
  accessToken,
  accountId,
  isCustomer,
}: AccountDetailContentProps) {
  const [state, setState] = useState<AccountDetailState>({
    status: "loading",
  });

  useEffect(() => {
    const controller = new AbortController();

    async function loadAccount() {
      try {
        const account = await getMyTradingAccount(
          accessToken,
          accountId,
          controller.signal,
        );

        if (controller.signal.aborted) {
          return;
        }

        if (account === null) {
          setState({ status: "notFound" });
        } else {
          setState({ status: "success", account });
        }
      } catch (error: unknown) {
        if (controller.signal.aborted) {
          return;
        }

        let message = "ไม่สามารถโหลดข้อมูลบัญชีได้ กรุณาลองอีกครั้ง";

        if (error instanceof TypeError) {
          message = "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้";
        } else if (error instanceof SyntaxError) {
          message = "รูปแบบข้อมูลตอบกลับจากระบบไม่ถูกต้อง";
        } else if (error instanceof Error) {
          message = error.message;
        }

        setState({ status: "error", message });
      }
    }

    void loadAccount();

    return () => controller.abort();
  }, [accessToken, accountId]);

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
      <h1 className="text-3xl font-bold">รายละเอียดบัญชีเทรด</h1>

      {state.status === "loading" && (
        <p className="mt-4 text-slate-300">กำลังโหลดข้อมูลบัญชี...</p>
      )}

      {state.status === "notFound" && (
        <p className="mt-4 text-slate-300">ไม่พบบัญชีเทรดนี้</p>
      )}

      {state.status === "error" && (
        <p role="alert" className="mt-4 text-red-400">
          {state.message}
        </p>
      )}

      {state.status === "success" && (
        <div className="mt-4 space-y-2">
          <p>รหัสบัญชี: {state.account.id}</p>
          <p>ชื่อบัญชี: {state.account.name}</p>
          <p>
            ยอดคงเหลือ: {state.account.balance} {state.account.currency}
          </p>

          {isCustomer && (
            <Link
              to={`/accounts/${state.account.id}/transactions/new`}
              className="mt-4 inline-block rounded bg-emerald-400 px-4 py-2 text-slate-950 hover:bg-emerald-300"
            >
              ส่งคำขอฝาก-ถอน
            </Link>
          )}

          {isCustomer && (
            <div>
              <Link
                to={`/accounts/${state.account.id}/trades/new`}
                className="mt-4 inline-block rounded bg-emerald-400 px-4 py-2 text-slate-950 hover:bg-emerald-300"
              >
                บันทึกการเทรด
              </Link>
            </div>
          )}

          {isCustomer && (
            <div>
              <Link
                to={`/accounts/${state.account.id}/trades`}
                className="mt-4 inline-block text-emerald-400 underline"
              >
                ดูประวัติการเทรด
              </Link>
            </div>
          )}

          {isCustomer && (
            <TransactionHistorySection
              key={state.account.id}
              accessToken={accessToken}
              tradingAccountId={state.account.id}
              currency={state.account.currency}
            />
          )}
        </div>
      )}

      <Link to="/" className="mt-6 inline-block text-emerald-400 underline">
        กลับหน้าหลัก
      </Link>
    </main>
  );
}
