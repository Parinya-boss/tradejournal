import {
  getMyTradingAccounts,
  type TradingAccount,
} from "./getMyTradingAccounts";

export async function getMyTradingAccount(
  accessToken: string,
  accountId: string,
  signal?: AbortSignal,
): Promise<TradingAccount | null> {
  const accounts = await getMyTradingAccounts(accessToken, signal);

  return accounts.find((account) => String(account.id) === accountId) ?? null;
}
