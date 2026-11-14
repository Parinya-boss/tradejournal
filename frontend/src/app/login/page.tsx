export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <section className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-8">
        <h1 className="text-2xl font-bold">เข้าสู่ระบบ</h1>

        <p className="mt-2 text-sm text-slate-300">
          ลงชื่อเข้าใช้บัญชี Trade Journal
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              อีเมล
            </label>

            <input
              type="email"
              id="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              รหัสผ่าน
            </label>

            <input
              type="password"
              id="password"
              autoComplete="current-password"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
            />
          </div>

          <button
            type="button"
            disabled
            className="w-full cursor-not-allowed rounded-lg bg-emerald-600 px-4 py-2 font-semibold opacity-50"
          >
            เข้าสู่ระบบ
          </button>
        </div>
      </section>
    </main>
  );
}
