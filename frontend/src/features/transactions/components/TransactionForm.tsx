import { useEffect, useRef, useState } from "react";
import {
  createTransaction,
  TransactionRejectedError,
  type CreateTransactionInput,
} from "../api/createTransaction";
import { useNavigate } from "react-router";
import type { SubmitEvent } from "react";

function formatAmount(value: string): string {
  const trimmedValue = value.trim();

  if (!/^(?:0|[1-9]\d{0,15})(?:\.\d{0,2})?$/.test(trimmedValue)) {
    return value;
  }

  const [wholePart, decimalPart = ""] = trimmedValue.split(".");

  return `${wholePart}.${decimalPart.padEnd(2, "0")}`;
}

function isValidAmount(value: string): boolean {
  return /^(?=[0-9.]*[1-9])(?:0|[1-9]\d{0,15})(?:\.\d{1,2})?$/.test(value);
}

type TransactionFormProps = {
  accessToken: string;
  tradingAccountId: number;
};

export default function TransactionForm({
  accessToken,
  tradingAccountId,
}: TransactionFormProps) {
  const [transactionType, setTransactionType] = useState<
    CreateTransactionInput["type"] | ""
  >("");

  const [amount, setAmount] = useState("");
  const [hasBlurredAmount, setHasBlurredAmount] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResultUncertain, setIsResultUncertain] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const requestLockedRef = useRef(false);
  const pageActiveRef = useRef(true);
  const navigate = useNavigate();

  useEffect(() => {
    pageActiveRef.current = true;

    return () => {
      pageActiveRef.current = false;
    };
  }, []);

  const showAmountError =
    hasBlurredAmount &&
    amount.trim() !== "" &&
    !isValidAmount(formatAmount(amount));

  const canSubmit =
    transactionType !== "" &&
    isValidAmount(formatAmount(amount)) &&
    !isSubmitting &&
    !isResultUncertain;

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const submittedAmount = formatAmount(amount);
    setAmount(submittedAmount);
    setHasBlurredAmount(true);

    if (
      transactionType === "" ||
      !isValidAmount(submittedAmount) ||
      requestLockedRef.current ||
      isResultUncertain
    ) {
      return;
    }

    requestLockedRef.current = true;
    setIsSubmitting(true);
    setSubmitError("");

    try {
      await createTransaction(accessToken, {
        tradingAccountId,
        type: transactionType,
        amount: submittedAmount,
      });
    } catch (error: unknown) {
      if (!pageActiveRef.current) {
        return;
      }

      if (error instanceof TransactionRejectedError) {
        requestLockedRef.current = false;
      } else {
        setIsResultUncertain(true);
      }

      setSubmitError(
        error instanceof TransactionRejectedError
          ? error.message
          : "ไม่สามารถยืนยันผลการส่งคำขอได้ กรุณาตรวจสอบประวัติรายการก่อนลองอีกครั้ง",
      );
      setIsSubmitting(false);
      return;
    }

    if (pageActiveRef.current) {
      navigate(`/accounts/${tradingAccountId}`, { replace: true });
    }
  }

  return (
    <form className="mt-6 max-w-sm space-y-4" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="transactionType" className="block">
          ประเภทรายการ
        </label>

        <select
          name="transactionType"
          id="transactionType"
          value={transactionType}
          onChange={(event) => {
            const selectedType = event.target.value;

            if (
              selectedType === "" ||
              selectedType === "DEPOSIT" ||
              selectedType === "WITHDRAW"
            ) {
              setTransactionType(selectedType);
              setSubmitError("");
            }
          }}
          required
          disabled={isSubmitting || isResultUncertain}
          className="mt-1 block w-full rounded border border-slate-700 bg-slate-900 p-2"
        >
          <option value="">เลือกประเภท</option>
          <option value="DEPOSIT">ฝากเงิน</option>
          <option value="WITHDRAW">ถอนเงิน</option>
        </select>
      </div>

      <div>
        <label htmlFor="amount" className="block">
          จำนวนเงิน
        </label>

        <input
          type="text"
          id="amount"
          name="amount"
          inputMode="decimal"
          value={amount}
          onChange={(event) => {
            setAmount(event.target.value);
            setSubmitError("");
          }}
          onBlur={() => {
            setAmount((currentAmount) => formatAmount(currentAmount));
            setHasBlurredAmount(true);
          }}
          maxLength={19}
          required
          disabled={isSubmitting || isResultUncertain}
          aria-invalid={showAmountError}
          aria-describedby={showAmountError ? "amount-error" : "amount-help"}
          className="mt-1 block w-full rounded border border-slate-700 bg-slate-900 p-2"
        />

        {showAmountError ? (
          <p
            id="amount-error"
            role="alert"
            className="mt-1 text-sm text-red-400"
          >
            จำนวนเงินไม่ถูกต้อง กรุณากรอกมากกว่า 0 โดยมีเลขก่อนจุดไม่เกิน 16
            หลัก และทศนิยมไม่เกิน 2 ตำแหน่ง โดยไม่ใส่ 0 นำหน้าจำนวนเต็ม เช่น 01
          </p>
        ) : (
          <p id="amount-help" className="mt-1 text-sm text-slate-300">
            กรอกจำนวนมากกว่า 0 และมีทศนิยมไม่เกิน 2 ตำแหน่ง เช่น 100.50
          </p>
        )}
      </div>

      {submitError && (
        <p role="alert" className="text-sm text-red-400">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="rounded bg-emerald-400 px-4 py-2 text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "กำลังส่งคำขอ..." : "ส่งคำขอ"}
      </button>
    </form>
  );
}
