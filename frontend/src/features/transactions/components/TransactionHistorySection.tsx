import { useEffect, useState } from "react";
import {
  getMyTransactions,
  type TradingTransaction,
} from "../api/getMyTransactions";
import TransactionHistory from "./TransactionHistory";

type TransactionHistorySectionProps = {
  accessToken: string;
  tradingAccountId: number;
  currency: string;
};

type TransactionHistoryState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; transactions: TradingTransaction[] };

export default function TransactionSection({
  accessToken,
  tradingAccountId,
  currency,
}: TransactionHistorySectionProps) {
  const [state, setState] = useState<TransactionHistoryState>({
    status: "loading",
  });
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTransactions() {
      try {
        const transactions = await getMyTransactions(
          accessToken,
          controller.signal,
        );

        if (controller.signal.aborted) {
          return;
        }

        const accountTransactions = transactions.filter(
          (transaction) => transaction.tradingAccountId === tradingAccountId,
        );

        setState({
          status: "success",
          transactions: accountTransactions,
        });
      } catch (error: unknown) {
        if (controller.signal.aborted) {
          return;
        }

        let message = "ไม่สามารถโหลดประวัติฝาก-ถอนได้";

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

    void loadTransactions();

    return () => controller.abort();
  }, [accessToken, tradingAccountId, retryCount]);

  if (state.status === "loading") {
    return <p className="mt-8 text-slate-300">กำลังโหลดประวัติฝาก-ถอน...</p>;
  }

  if (state.status === "error") {
    return (
      <div className="mt-8">
        <p role="alert" className="text-red-400">
          {state.message}
        </p>

        <button
          type="button"
          onClick={() => {
            setState({ status: "loading" });
            setRetryCount((count) => count + 1);
          }}
          className="mt-3 rounded bg-slate-700 px-4 py-2 hover:bg-slate-600"
        >
          ลองอีกครั้ง
        </button>
      </div>
    );
  }

  return (
    <TransactionHistory transactions={state.transactions} currency={currency} />
  );
}
