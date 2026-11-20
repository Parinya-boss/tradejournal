import type { Trade } from "../api/getMyTrades";

type TradeHistoryProps = {
  trades: Trade[];
};

function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "ไม่ทราบเวลา";
  }

  return date.toLocaleString("th-TH");
}

export default function TradeHistory({ trades }: TradeHistoryProps) {
  return (
    <ul className="mt-4 space-y-4">
      {trades.map((trade) => (
        <li
          key={trade.id}
          className="space-y-1 rounded border border-slate-700 p-4"
        >
          <p>เลขรายการ: {trade.id}</p>
          <p>สินทรัพย์: {trade.symbol}</p>
          <p>ประเภท: {trade.side === "LONG" ? "LONG" : "SHORT"}</p>
          <p>จำนวน: {trade.quantity}</p>
          <p>ราคาเปิด: {trade.entryPrice}</p>
          <p>ราคาปิด: {trade.exitPrice}</p>
          <p>กำไร/ขาดทุน: {trade.netPnl}</p>
          <p>เวลาเปิด: {formatDateTime(trade.openedAt)}</p>
          <p>เวลาปิด: {formatDateTime(trade.closedAt)}</p>

          {trade.note && <p>หมายเหตุ: {trade.note}</p>}
        </li>
      ))}
    </ul>
  );
}
