export type TradingTransaction = {
  id: number;
  tradingAccountId: number;
  type: "DEPOSIT" | "WITHDRAW";
  amount: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
};

function parseTransaction(value: unknown): TradingTransaction {
  if (
    typeof value !== "object" ||
    value === null ||
    !("id" in value) ||
    !("tradingAccountId" in value) ||
    !("type" in value) ||
    !("amount" in value) ||
    !("status" in value) ||
    !("createdAt" in value) ||
    typeof value.id !== "number" ||
    typeof value.tradingAccountId !== "number" ||
    (value.type !== "DEPOSIT" && value.type !== "WITHDRAW") ||
    typeof value.amount !== "string" ||
    (value.status !== "PENDING" &&
      value.status !== "APPROVED" &&
      value.status !== "REJECTED") ||
    typeof value.createdAt !== "string" ||
    !Number.isSafeInteger(value.id) ||
    !Number.isSafeInteger(value.tradingAccountId) ||
    value.id < 1 ||
    value.tradingAccountId < 1
  ) {
    throw new Error("รูปแบบข้อมูลรายการฝาก-ถอน ไม่ถูกต้อง");
  }

  return {
    id: value.id,
    tradingAccountId: value.tradingAccountId,
    type: value.type,
    amount: value.amount,
    status: value.status,
    createdAt: value.createdAt,
  };
}

export async function getMyTransactions(
  accessToken: string,
  signal?: AbortSignal,
): Promise<TradingTransaction[]> {
  const response = await fetch("/api/transactions/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    signal,
  });

  if (response.status === 401) {
    throw new Error("เซสชันหมดอายุ กรุณาออกจากระบบและเข้าสู่ระบบใหม่");
  }
  if (response.status === 403) {
    throw new Error("คุณไม่มีสิทธิ์ดูรายการฝาก-ถอน");
  }
  if (!response.ok) {
    throw new Error("ไม่สามารถโหลดรายการฝาก-ถอนได้ กรุณาลองอีกครั้ง");
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("รูปแบบข้อมูลรายการฝาก-ถอนไม่ถูกต้อง");
  }

  return data.map(parseTransaction);
}
