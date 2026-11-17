import { Link } from "react-router";
import type { AuthSession } from "../features/auth/types";
import TradingAccountList from "../features/trading-accounts/components/TradingAccountList";

type HomePageProps = {
  session: AuthSession | null;
  onLogout: () => void;
};

export default function HomePage({ session, onLogout }: HomePageProps) {
  return (
    <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
      <h1 className="text-3xl font-bold">Trade Journal</h1>
      <p className="mt-3 text-slate-300">บันทึกการเทรดของคุณ</p>

      {session ? (
        <>
          <div className="mt-6 flex items-center gap-4">
            <div>
              <p>ยินดีต้อนรับ {session.user.display_name}</p>
              <p className="text-sm text-slate-400">{session.user.email}</p>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="rounded bg-slate-700 px-4 py-2 text-slate-100 hover:bg-slate-600"
            >
              ออกจากระบบ
            </button>
          </div>

          <TradingAccountList
            key={session.user.email}
            accessToken={session.accessToken}
          />
        </>
      ) : (
        <Link
          to="/login"
          className="mt-6 inline-block rounded bg-emerald-400 px-4 py-2 text-slate-950"
        >
          เข้าสู่ระบบ
        </Link>
      )}
    </main>
  );
}
