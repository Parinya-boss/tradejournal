import { useEffect, useState } from "react";
import {
  getMyTradingAccounts,
  type TradingAccount,
} from "../api/getMyTradingAccounts";
import { Link } from "react-router";

type AccountsState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; accounts: TradingAccount[] };

type TradingAccountListProps = {
  accessToken: string;
};

export default function TradingAccountList({
  accessToken,
}: TradingAccountListProps) {
  const [state, setState] = useState<AccountsState>({ status: "loading" });
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadAcoounts() {
      try {
        const accounts = await getMyTradingAccounts(
          accessToken,
          controller.signal,
        );

        if (!controller.signal.aborted) {
          setState({ status: "success", accounts });
        }
      } catch (error: unknown) {
        if (controller.signal.aborted) {
          return;
        }

        let message = "เกิดข้อผิดพลาด กรุณาลองอีกครั้ง";

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

    void loadAcoounts();

    return () => controller.abort();
  }, [accessToken, retryCount]);

  return (
    <section className="mt-8" aria-labelledby="accounts-heading">
      <h2 id="accounts-heading" className="text-xl font-semibold">
        บัญชีเทรดของคุณ
      </h2>

      {state.status === "loading" && (
        <p className="mt-3 text-slate-300">กำลังโหลดบัญชีเทรด...</p>
      )}

      {state.status === "error" && (
        <div className="mt-3">
          <p role="alert" className="text-red-400">
            {state.message}
          </p>

          <button
            type="button"
            onClick={() => {
              setState({ status: "loading" });
              setRetryCount((count) => count + 1);
            }}
          >
            ลองอีกครั้ง
          </button>
        </div>
      )}

      {state.status === "success" &&
        (state.accounts.length === 0 ? (
          <p className="mt-3 text-slate-300">ยังไม่มีบัญชีเทรด</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {state.accounts.map((account) => (
              <li key={account.id}>
                <Link
                  to={`/accounts/${account.id}`}
                  className="text-emerald-400 underline"
                >
                  {account.name}
                </Link>

                <p className="text-sm text-slate-400">
                  ยอดคงเหลือ: {account.balance} {account.currency}
                </p>
              </li>
            ))}
          </ul>
        ))}
    </section>
  );
}
