import type { Trade } from "./getMyTrades";

export type CreateTradeInput = {
  tradingAccountId: number;
  symbol: "XAUUSD";
  side: Trade["side"];
  quantity: string;
  entryPrice: string;
  exitPrice: string;
  openedAt: string;
  closedAt: string;
  note?: string | null;
};

export class TradeRejectedError extends Error {}

const uncertainResultMessage =
  "ไม่สามารถยืนยันผลการบันทึกเทรดได้ กรุณาตรวจสอบประวัติเทรดและยอดคงเหลือก่อนลองอีกครั้ง";

export async function createTrade(
  accessToken: string,
  trade: CreateTradeInput,
): Promise<void> {
  let response;

  try {
    response = await fetch("/api/trades", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(trade),
    });
  } catch {
    throw new Error(uncertainResultMessage);
  }

  if (response.status === 400) {
    throw new TradeRejectedError(
      "ไม่สามารถบันทึกเทรดได้ กรุณาตรวจสอบข้อมูล เวลาเปิด-ปิด และยอดคงเหลือ",
    );
  }

  if (response.status === 401) {
    throw new TradeRejectedError(
      "เซสชันหมดอายุ กรุณาออกจากระบบและเข้าสู่ระบบใหม่",
    );
  }

  if (response.status === 403) {
    throw new TradeRejectedError("คุณไม่มีสิทธิ์บันทึกเทรด");
  }

  if (response.status === 404) {
    throw new TradeRejectedError("ไม่พบบัญชีเทรด หรือบัญชีนี้ไม่ได้เป็นของคุณ");
  }

  if (!response.ok) {
    throw new Error(uncertainResultMessage);
  }
}
