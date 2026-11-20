export type Trade = {
  id: number;
  tradingAccountId: number;
  symbol: string;
  side: "LONG" | "SHORT";
  quantity: string;
  entryPrice: string;
  exitPrice: string;
  netPnl: string;
  openedAt: string;
  closedAt: string;
  note: string | null;
};

function isTrade(value: unknown): value is Trade {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const trade = value as Record<string, unknown>;

  return (
    typeof trade.id === "number" &&
    Number.isSafeInteger(trade.id) &&
    trade.id > 0 &&
    typeof trade.tradingAccountId === "number" &&
    Number.isSafeInteger(trade.tradingAccountId) &&
    trade.tradingAccountId > 0 &&
    typeof trade.symbol === "string" &&
    (trade.side === "LONG" || trade.side === "SHORT") &&
    typeof trade.quantity === "string" &&
    typeof trade.entryPrice === "string" &&
    typeof trade.exitPrice === "string" &&
    typeof trade.netPnl === "string" &&
    typeof trade.openedAt === "string" &&
    typeof trade.closedAt === "string" &&
    (trade.note === null || typeof trade.note === "string")
  );
}

export async function getMyTrades(
  accessToken: string,
  tradingAccountId: number,
  signal?: AbortSignal,
): Promise<Trade[]> {
  const response = await fetch(`/api/trades/me/${tradingAccountId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    signal,
  });

  if (response.status === 401) {
    throw new Error("เซสชันหมดอายุ กรุณาออกจากระบบและเข้าสู่ระบบใหม่");
  }

  if (response.status === 403) {
    throw new Error("คุณไม่มีสิทธิ์ดูรายการเทรด");
  }

  if (response.status === 404) {
    throw new Error("ไม่พบบัญชีเทรด หรือบัญชีนี้ไม่ได้เป็นของคุณ");
  }

  if (!response.ok) {
    throw new Error("ไม่สามารถโหลดรายการเทรดได้ กรุณาลองอีกครั้ง");
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data) || !data.every(isTrade)) {
    throw new Error("รูปแบบข้อมูลรายการเทรดไม่ถูกต้อง");
  }

  if (data.some((trade) => trade.tradingAccountId !== tradingAccountId)) {
    throw new Error("ข้อมูลรายการเทรดไม่ตรงกับบัญชีที่เลือก");
  }

  return data;
}
