import type { TradingTransaction } from "./getMyTransactions";

export type CreateTransactionInput = {
  tradingAccountId: number;
  type: TradingTransaction["type"];
  amount: string;
};

export class TransactionRejectedError extends Error {}

const uncertainResultMessage =
  "ไม่สามารถยืนยันผลการส่งคำขอได้ กรุณาตรวจสอบประวัติรายการก่อนลองอีกครั้ง";

export async function createTransaction(
  accessToken: string,
  transaction: CreateTransactionInput,
): Promise<void> {
  let response: Response;

  try {
    response = await fetch("/api/transactions/createtransactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(transaction),
    });
  } catch {
    throw new Error(uncertainResultMessage);
  }

  if (response.status === 400) {
    throw new TransactionRejectedError(
      "ข้อมูลรายการไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง",
    );
  }

  if (response.status === 401) {
    throw new TransactionRejectedError(
      "เซสชันหมดอายุ กรุณาออกจากระบบและเข้าสู่ระบบใหม่",
    );
  }

  if (response.status === 403) {
    throw new TransactionRejectedError("คุณไม่มีสิทธิ์ส่งคำขอฝาก-ถอน");
  }

  if (response.status === 404) {
    throw new TransactionRejectedError(
      "ไม่พบบัญชีเทรด หรือบัญชีเทรดนี้ไม่ได้เป็นของคุณ",
    );
  }

  if (!response.ok) {
    throw new Error(uncertainResultMessage);
  }
}
