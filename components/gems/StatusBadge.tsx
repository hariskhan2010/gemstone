import { STOCK_STATUS, type StockStatus } from '@/lib/products/types';

/** Stock status pill. Colour comes from the semantic tokens (--ok, --warn, --danger, --info); the label always carries the meaning too. */
export default function StatusBadge({ status }: { status: StockStatus }) {
  const s = STOCK_STATUS[status] ?? STOCK_STATUS.in;
  return <span className={`ag-status ag-st-${s.tone}`}>{s.label}</span>;
}
