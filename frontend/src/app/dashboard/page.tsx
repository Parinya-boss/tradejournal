"use client";

import { useEffect, useState } from "react";

type User = {
  display_name: string;
  email: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadUser() {
      try {
        const response = await fetch("/api/users/me", {
          signal: controller.signal,
          cache: "no-store",
        });

        if (controller.signal.aborted) return;

        if (response.status === 401) {
          setNeedsLogin(true);
          return;
        }

        if (!response.ok) {
          throw new Error("โหลดข้อมูลไม่สำเร็จ");
        }

        const data: User = await response.json();

        if (!controller.signal.aborted) {
          setUser(data);
        }
      } catch {
        if (!controller.signal.aborted) {
          setError("ไม่สามารถโหลดข้อมูลผู้ใช้ได้");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadUser();

    return () => controller.abort();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        {isLoading && <p className="mt-6 text-slate-300">กำลังโหลดข้อมูล...</p>}

        {needsLogin && (
          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p>กรุณาเข้าสู่ระบบก่อน</p>

            <a
              href="/login"
              className="mt-3 inline-block text-emerald-400 underline"
            >
              ไปหน้าเข้าสู่ระบบ
            </a>
          </div>
        )}

        {error && (
          <p role="alert" className="mt-6 text-red-400">
            {error}
          </p>
        )}

        {user && (
          <section className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-xl font-semibold">
              สวัสดี {user.display_name}
            </h2>

            <p className="mt-2 text-slate-300">{user.email}</p>
          </section>
        )}
      </div>
    </main>
  );
}
