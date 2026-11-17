export type TradingAccount = {
  id: number;
  name: string;
  balance: string;
  currency: string;
};

function parseTradingAccount(value: unknown): TradingAccount {
  if (
    typeof value !== "object" ||
    value === null ||
    !("id" in value) ||
    typeof value.id !== "number" ||
    !Number.isSafeInteger(value.id) ||
    value.id < 1 ||
    !("name" in value) ||
    typeof value.name !== "string" ||
    !("balance" in value) ||
    typeof value.balance !== "string" ||
    !("currency" in value) ||
    typeof value.currency !== "string"
  ) {
    throw new Error("รูปแบบข้อมูลบัญชีเทรดไม่ถูกต้อง");
  }

  return {
    id: value.id,
    name: value.name,
    balance: value.balance,
    currency: value.currency,
  };
}

export async function getMyTradingAccounts(
  accessToken: string,
  signal?: AbortSignal,
): Promise<TradingAccount[]> {
  const response = await fetch("/api/tradingaccounts/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    signal,
  });

  if (response.status === 401) {
    throw new Error("เซสชันหมดอายุหรือไม่ถูกต้อง กรุณาเข้าสู่ระบบอีกครั้ง");
  }

  if (!response.ok) {
    throw new Error("ไม่สามารถโหลดบัญชีเทรดได้ กรุณาลองอีกครั้ง");
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("รูปแบบข้อมูลบัญชีเทรดไม่ถูกต้อง");
  }

  return data.map(parseTradingAccount);
}
