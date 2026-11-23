import { useEffect, useRef, useState } from "react";
import type { SubmitEvent } from "react";
import {
  createTrade,
  TradeRejectedError,
  type CreateTradeInput,
} from "../api/createTrade";
import { useNavigate } from "react-router";

type CreateTradeFormProps = {
  accessToken: string;
  tradingAccountId: number;
};

function isValidTradeNumber(value: string): boolean {
  return /^(?=[0-9.]*[1-9])(?:0|[1-9]\d{0,15})(?:\.\d{1,2})?$/.test(value);
}

export default function CreateTradeForm({
  accessToken,
  tradingAccountId,
}: CreateTradeFormProps) {
  const [side, setSide] = useState<CreateTradeInput["side"] | "">("");
  const [quantity, setQuantity] = useState("");
  const [entryPrice, setEntryPrice] = useState("");
  const [exitPrice, setExitPrice] = useState("");

  const [openedAt, setOpenedAt] = useState("");
  const [closedAt, setClosedAt] = useState("");
  const [note, setNote] = useState("");

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

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (requestLockedRef.current || isResultUncertain) {
      return;
    }

    const submittedQuantity = quantity.trim();
    const submittedEntryPrice = entryPrice.trim();
    const submittedExitPrice = exitPrice.trim();

    if (side === "") {
      setSubmitError("กรุณาเลือกประเภทการเทรด");
      return;
    }

    if (
      !isValidTradeNumber(submittedQuantity) ||
      !isValidTradeNumber(submittedEntryPrice) ||
      !isValidTradeNumber(submittedExitPrice)
    ) {
      setSubmitError(
        "จำนวนและราคาต้องมากกว่า 0 มีทศนิยมไม่เกิน 2 ตำแหน่ง และเลขก่อนจุดไม่เกิน 16 หลัก โดยไม่ใส่ 0 นำหน้า",
      );
      return;
    }

    if (!openedAt || !closedAt) {
      setSubmitError("กรุณากรอกเวลาเปิดและเวลาปิด");
      return;
    }

    const openedTime = new Date(openedAt);
    const closedTime = new Date(closedAt);

    if (
      Number.isNaN(openedTime.getTime()) ||
      Number.isNaN(closedTime.getTime()) ||
      openedTime.getTime() > closedTime.getTime() ||
      closedTime.getTime() > Date.now()
    ) {
      setSubmitError(
        "กรุณาตรวจสอบเวลาเปิดและเวลาปิด โดยเวลาเปิดต้องไม่หลังเวลาปิด และเวลาปิดต้องไม่เป็นเวลาในอนาคต",
      );
      return;
    }

    const trade: CreateTradeInput = {
      tradingAccountId,
      symbol: "XAUUSD",
      side,
      quantity: submittedQuantity,
      entryPrice: submittedEntryPrice,
      exitPrice: submittedExitPrice,
      openedAt: openedTime.toISOString(),
      closedAt: closedTime.toISOString(),
      note: note.trim() || undefined,
    };

    requestLockedRef.current = true;
    setIsSubmitting(true);
    setSubmitError("");

    try {
      await createTrade(accessToken, trade);
    } catch (error: unknown) {
      if (!pageActiveRef.current) {
        return;
      }

      if (error instanceof TradeRejectedError) {
        requestLockedRef.current = false;
        setSubmitError(error.message);
      } else {
        setIsResultUncertain(true);
        setSubmitError(
          "ไม่สามารถยืนยันผลการบันทึกเทรดได้ กรุณาตรวจสอบประวัติเทรดและยอดคงเหลือก่อนลองอีกครั้ง",
        );
      }

      setIsSubmitting(false);
      return;
    }

    if (pageActiveRef.current) {
      navigate(`/accounts/${tradingAccountId}/trades`, {
        replace: true,
      });
    }
  }

  return (
    <form
      className="mt-6 max-w-sm space-y-4"
      onSubmit={handleSubmit}
      onChange={() => setSubmitError("")}
    >
      <fieldset
        disabled={isSubmitting || isResultUncertain}
        className="space-y-4"
      >
        <div>
          <label htmlFor="side" className="block">
            ประเภทการเทรด
          </label>

          <select
            name="side"
            id="side"
            value={side}
            onChange={(event) => {
              const selectedSide = event.target.value;

              if (
                selectedSide === "" ||
                selectedSide === "LONG" ||
                selectedSide === "SHORT"
              ) {
                setSide(selectedSide);
              }
            }}
            required
            className="mt-1 block w-full rounded border border-slate-700 bg-slate-900 p-2"
          >
            <option value="">เลือกประเภท</option>
            <option value="LONG">Long</option>
            <option value="SHORT">Short</option>
          </select>
        </div>

        <p id="trade-number-help" className="text-sm text-slate-300">
          กรอกจำนวนมากกว่า 0 และมีทศนิยมไม่เกิน 2 ตำแหน่ง เช่น 0.10
        </p>

        <div>
          <label htmlFor="quantity" className="block">
            จำนวน
          </label>

          <input
            type="text"
            id="quantity"
            name="quantity"
            inputMode="decimal"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            maxLength={19}
            required
            aria-describedby="trade-number-help"
            className="mt-1 block w-full rounded border border-slate-700 bg-slate-900 p-2"
          />
        </div>

        <div>
          <label htmlFor="entryPrice" className="block">
            ราคาเปิด
          </label>

          <input
            type="text"
            id="entryPrice"
            name="entryPrice"
            inputMode="decimal"
            value={entryPrice}
            onChange={(event) => setEntryPrice(event.target.value)}
            maxLength={19}
            required
            aria-describedby="trade-number-help"
            className="mt-1 block w-full rounded border border-slate-700 bg-slate-900 p-2"
          />
        </div>

        <div>
          <label htmlFor="exitPrice" className="block">
            ราคาปิด
          </label>

          <input
            type="text"
            id="exitPrice"
            name="exitPrice"
            inputMode="decimal"
            value={exitPrice}
            onChange={(event) => setExitPrice(event.target.value)}
            maxLength={19}
            required
            aria-describedby="trade-number-help"
            className="mt-1 block w-full rounded border border-slate-700 bg-slate-900 p-2"
          />
        </div>

        <p className="text-sm text-slate-300">
          กรุณากรอกวันและเวลาตามเขตเวลาของเครื่องที่ใช้งาน
        </p>

        <div>
          <label htmlFor="openedAt" className="block">
            เวลาเปิดการเทรด
          </label>

          <input
            type="datetime-local"
            id="openedAt"
            name="openedAt"
            value={openedAt}
            onChange={(event) => setOpenedAt(event.target.value)}
            required
            className="mt-1 block w-full rounded border border-slate-700 bg-slate-900 p-2"
          />
        </div>

        <div>
          <label htmlFor="closedAt" className="block">
            เวลาปิดการเทรด
          </label>

          <input
            type="datetime-local"
            id="closedAt"
            name="closedAt"
            value={closedAt}
            onChange={(event) => setClosedAt(event.target.value)}
            required
            className="mt-1 block w-full rounded border border-slate-700 bg-slate-900 p-2"
          />
        </div>

        <div>
          <label htmlFor="note" className="block">
            หมายเหตุ (ไม่บังคับ)
          </label>

          <textarea
            id="note"
            name="note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            maxLength={255}
            rows={3}
            className="mt-1 block w-full rounded border border-slate-700 bg-slate-900 p-2"
          />
        </div>

        {submitError && (
          <p role="alert" className="text-sm text-red-400">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || isResultUncertain}
          className="rounded bg-emerald-400 px-4 py-2 text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "กำลังบันทึก..." : "บันทึกการเทรด"}
        </button>
      </fieldset>
    </form>
  );
}
