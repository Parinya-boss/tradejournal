import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { createTradingAccount } from "../features/trading-accounts/api/createTradingAccount";
import type { SubmitEvent } from "react";

type CreateTradingAccountPageProps = {
  accessToken: string;
};

export default function CreateTradingAccountPage({
  accessToken,
}: CreateTradingAccountPageProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const submittingRef = useRef(false);
  const pageActiveRef = useRef(true);
  const navigate = useNavigate();

  useEffect(() => {
    pageActiveRef.current = true;

    return () => {
      pageActiveRef.current = false;
    };
  }, []);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const accountName = name.trim();

    if (!accountName || submittingRef.current) {
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await createTradingAccount(accessToken, accountName);
    } catch (error: unknown) {
      submittingRef.current = false;

      if (pageActiveRef.current) {
        setIsSubmitting(false);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "ไม่สามารถยืนยันผลได้ กรุณาตรวจสอบรายการบัญชีก่อนลองอีกครั้ง",
        );
      }

      return;
    }

    if (pageActiveRef.current) {
      navigate("/", { replace: true });
    }
  }
  return (
    <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
      <h1 className="text-3xl font-bold">สร้างบัญชีเทรด</h1>

      <form className="mt-6 max-w-sm space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block">
            ชื่อบัญชีเทรด
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={isSubmitting}
            maxLength={255}
            required
            className="mt-1 block w-full rounded border border-slate-700 bg-slate-900 p-2"
          />
        </div>

        {errorMessage && (
          <p role="alert" className="text-sm text-red-400">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={name.trim() === "" || isSubmitting}
          className="rounded bg-emerald-400 px-4 py-2 text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "กำลังสร้างบัญชี..." : "สร้างบัญชี"}
        </button>
      </form>

      <Link to="/" className="mt-6 inline-block text-emerald-400 underline">
        กลับหน้าหลัก
      </Link>
    </main>
  );
}
