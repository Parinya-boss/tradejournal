import { useState } from "react";
import { Link } from "react-router";
import type { SubmitEvent } from "react";
import { login } from "../features/auth/api/login";
import {
  getCurrentUser,
  type CurrentUser,
} from "../features/auth/api/getCurrentUser";

type LoginPageProps = {
  isAuthenticated: boolean;
  onLoginSuccess: (accessToken: string, user: CurrentUser) => void;
};

export default function LoginPage({
  isAuthenticated,
  onLoginSuccess,
}: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const hasEnteredCredentials = email.trim() !== "" && password.trim() !== "";

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hasEnteredCredentials || isSubmitting) {
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const accessToken = await login({ email, password });
      const currentUser = await getCurrentUser(accessToken);

      setPassword("");
      onLoginSuccess(accessToken, currentUser);
    } catch (error: unknown) {
      if (error instanceof TypeError) {
        setErrorMessage("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองอีกครั้ง");
      } else if (error instanceof SyntaxError) {
        setErrorMessage("รูปแบบข้อมูลตอบกลับจากระบบไม่ถูกต้อง");
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      }
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
      <h1 className="text-3xl font-bold">เข้าสู่ระบบ</h1>

      <p role="status" className="mt-6 text-emerald-400">
        {isAuthenticated ? "เข้าสู่ระบบสำเร็จ" : ""}
      </p>

      {!isAuthenticated && (
        <form className="mt-6 max-w-sm space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block">
              อีเมล
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isSubmitting}
              required
              className="mt-1 block w-full rounded border border-slate-700 bg-slate-900 p-2"
            />
          </div>

          <div>
            <label htmlFor="password" className="block">
              รหัสผ่าน
            </label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isSubmitting}
              required
              className="mt-1 block w-full rounded border border-slate-700 bg-slate-900 p-2"
            />
          </div>

          <p aria-live="polite" className="text-sm text-slate-300">
            {hasEnteredCredentials
              ? "กรอกอีเมลและรหัสผ่านแล้ว"
              : "กรุณากรอกอีเมลและรหัสผ่าน"}
          </p>

          {errorMessage && (
            <p role="alert" className="text-sm text-red-400">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={!hasEnteredCredentials || isSubmitting}
            className="rounded bg-emerald-400 px-4 py-2 text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>
      )}

      <Link to="/" className="mt-6 inline-block text-emerald-400 underline">
        กลับหน้าหลัก
      </Link>
    </main>
  );
}
