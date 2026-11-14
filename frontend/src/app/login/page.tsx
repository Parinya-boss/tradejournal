"use client";

import { useState, type SubmitEvent } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isLoading) return;

    setIsLoading(true);
    setError("");
    setSubmitted(false);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data: unknown = await response.json().catch(() => null);

        if (
          data &&
          typeof data === "object" &&
          "message" in data &&
          typeof data.message === "string"
        ) {
          setError(data.message);
        } else {
          setError("เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่");
        }

        return;
      }

      setSubmitted(true);
      setPassword("");
    } catch {
      setError("ไม่สามารถเชื่อมต่อ Next.js ได้");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <section className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-8">
        <h1 className="text-2xl font-bold">เข้าสู่ระบบ</h1>

        <p className="mt-2 text-sm text-slate-300">
          ลงชื่อเข้าใช้บัญชี Trade Journal
        </p>

        <form onSubmit={handleSubmit} method="post" className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              อีเมล
            </label>

            <input
              type="email"
              id="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setSubmitted(false);
                setError("");
              }}
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
              required
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setSubmitted(false);
                setError("");
              }}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !email.trim() || !password}
            className="w-full rounded-lg bg-emerald-600 px-4 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>

          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}

          {submitted && (
            <p role="status" className="text-sm text-emerald-400">
              เข้าสู่ระบบสำเร็จ
            </p>
          )}
        </form>
      </section>
    </main>
  );
}
