import type { TradingTransaction } from "../api/getMyTransactions";

type TransactionHistoryProps = {
  transactions: TradingTransaction[];
  currency: string;
};

const statusLabels = {
  PENDING: "รออนุมัติ",
  APPROVED: "อนุมัติแล้ว",
  REJECTED: "ปฏิเสธแล้ว",
};

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "ไม่ทราบเวลา";
  }

  return date.toLocaleString("th-TH");
}

export default function TransactionHistory({
  transactions,
  currency,
}: TransactionHistoryProps) {
  return (
    <section className="mt-8" aria-labelledby="transaction-history-heading">
      <h2 id="transaction-history-heading" className="text-xl font-semibold">
        ประวัติฝาก-ถอน
      </h2>

      {transactions.length === 0 ? (
        <p className="mt-3 text-slate-300">ยังไม่มีรายการฝาก-ถอน</p>
      ) : (
        <ul className="mt-3 space-y-4">
          {transactions.map((transaction) => (
            <li
              key={transaction.id}
              className="rounded border border-slate-700 p-4"
            >
              <p>เลขรายการ: {transaction.id}</p>
              <p>ประเภท: {transaction.type === "DEPOSIT" ? "ฝาก" : "ถอน"}</p>
              <p>
                จำนวนเงิน: {transaction.amount} {currency}
              </p>
              <p>สถานะ: {statusLabels[transaction.status]}</p>
              <p>วันที่: {formatDate(transaction.createdAt)}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
