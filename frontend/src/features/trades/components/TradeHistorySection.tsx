import { useEffect, useState } from "react";
import { getMyTrades, type Trade } from "../api/getMyTrades";
import TradeHistory from "./TradeHistory";

type TradeHistorySectionProps = {
  accessToken: string;
  tradingAccountId: number;
};

type TradeHistoryState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; trades: Trade[] };

export default function TradeHistorySection({
  accessToken,
  tradingAccountId,
}: TradeHistorySectionProps) {
  const [state, setState] = useState<TradeHistoryState>({
    status: "loading",
  });
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTrades() {
      try {
        const trades = await getMyTrades(
          accessToken,
          tradingAccountId,
          controller.signal,
        );

        if (controller.signal.aborted) {
          return;
        }

        setState({ status: "success", trades });
      } catch (error: unknown) {
        if (controller.signal.aborted) {
          return;
        }

        let message = "ไม่สามารถโหลดรายการเทรดได้";

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

    void loadTrades();

    return () => controller.abort();
  }, [accessToken, tradingAccountId, retryCount]);

  if (state.status === "loading") {
    return (
      <p role="status" className="mt-4 text-slate-300">
        กำลังโหลดรายการเทรด...
      </p>
    );
  }

  if (state.status === "error") {
    return (
      <div className="mt-4">
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

  if (state.trades.length === 0) {
    return (
      <p className="mt-4 text-slate-300">ยังไม่มีรายการเทรดสำหรับบัญชีนี้</p>
    );
  }

  return (
    <>
      <p className="mt-4 text-slate-300">
        พบรายการเทรด {state.trades.length} รายการ
      </p>

      <TradeHistory trades={state.trades} />
    </>
  );
}
