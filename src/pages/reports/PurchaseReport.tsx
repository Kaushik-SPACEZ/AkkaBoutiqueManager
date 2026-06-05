import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  FileText,
  FileSpreadsheet,
  ShoppingCart,
  Users,
  IndianRupee,
  X,
} from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import { inr } from "@/lib/format";
import { exportToPDF, exportToExcel, formatCurrencyForExport } from "@/lib/exportUtils";

// Mock purchase data
const PURCHASES = [
  {
    id: "PO-001",
    number: "PO-2026-001",
    supplier: "Kanchi Silks Pvt Ltd",
    date: "2026-06-01",
    taxable: 125000,
    gst: 6250,
    total: 131250,
  },
  {
    id: "PO-002",
    number: "PO-2026-002",
    supplier: "Chennai Textiles",
    date: "2026-05-28",
    taxable: 85000,
    gst: 4250,
    total: 89250,
  },
  {
    id: "PO-003",
    number: "PO-2026-003",
    supplier: "Mysore Silk House",
    date: "2026-05-25",
    taxable: 150000,
    gst: 7500,
    total: 157500,
  },
  {
    id: "PO-004",
    number: "PO-2026-004",
    supplier: "Banaras Weaves",
    date: "2026-05-20",
    taxable: 200000,
    gst: 10000,
    total: 210000,
  },
];

const SUPPLIERS = [
  "All Suppliers",
  "Kanchi Silks Pvt Ltd",
  "Chennai Textiles",
  "Mysore Silk House",
  "Banaras Weaves",
];

export default function PurchaseReport() {
  const [query, setQuery] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("All Suppliers");

  const filteredPurchases = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PURCHASES.filter((p) => {
      if (selectedSupplier !== "All Suppliers" && p.supplier !== selectedSupplier) {
        return false;
      }
      if (q) {
        return (
          p.number.toLowerCase().includes(q) ||
          p.supplier.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [query, selectedSupplier]);

  const summary = useMemo(() => {
    const totalPurchases = filteredPurchases.reduce((s, p) => s + p.total, 0);
    const totalGst = filteredPurchases.reduce((s, p) => s + p.gst, 0);
    const uniqueSuppliers = new Set(filteredPurchases.map((p) => p.supplier)).size;
    return { totalPurchases, totalGst, uniqueSuppliers };
  }, [filteredPurchases]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-10">
      <TopBar
        title="Purchase Report"
        subtitle="Track all purchases from suppliers with GST details."
        actions={
          <Link
            to="/reports"
            className="inline-flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Reports
          </Link>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 grid place-items-center">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider font-medium">
                Total Purchases
              </div>
              <div className="text-2xl font-semibold tabular-nums mt-0.5">
                {inr(summary.totalPurchases)}
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 grid place-items-center">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider font-medium">
                Total Suppliers
              </div>
              <div className="text-2xl font-semibold tabular-nums mt-0.5">
                {summary.uniqueSuppliers}
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 grid place-items-center">
              <IndianRupee className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider font-medium">
                GST Paid
              </div>
              <div className="text-2xl font-semibold tabular-nums mt-0.5">
                {inr(summary.totalGst)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="mt-6 rounded-2xl border border-[hsl(var(--border))] bg-white">
        <div className="p-4 border-b border-[hsl(var(--border))] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 h-10 rounded-lg bg-[hsl(var(--secondary))]/60 w-full sm:w-64">
              <Search className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search purchase..."
                className="flex-1 bg-transparent text-sm outline-none"
              />
              {query && (
                <button onClick={() => setQuery("")}>
                  <X className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                </button>
              )}
            </div>
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="h-10 px-3 rounded-lg border border-[hsl(var(--border))] bg-white text-sm"
            >
              {SUPPLIERS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                exportToPDF(
                  "Purchase Report",
                  ["Purchase No", "Supplier", "Date", "Taxable", "GST", "Total"],
                  filteredPurchases.map((p) => [
                    p.number,
                    p.supplier,
                    new Date(p.date).toLocaleDateString("en-IN"),
                    formatCurrencyForExport(p.taxable),
                    formatCurrencyForExport(p.gst),
                    formatCurrencyForExport(p.total),
                  ]),
                  [
                    { label: "Total Purchases", value: formatCurrencyForExport(summary.totalPurchases) },
                    { label: "Total GST Paid", value: formatCurrencyForExport(summary.totalGst) },
                    { label: "Suppliers", value: String(summary.uniqueSuppliers) },
                  ]
                )
              }
              className="h-10 px-4 rounded-lg border border-[hsl(var(--border))] bg-white inline-flex items-center gap-2 text-sm font-medium hover:bg-[hsl(var(--secondary))]"
            >
              <FileText className="h-4 w-4" />
              Export PDF
            </button>
            <button
              onClick={() =>
                exportToExcel(
                  "Purchase Report",
                  ["Purchase No", "Supplier", "Date", "Taxable", "GST", "Total"],
                  filteredPurchases.map((p) => [
                    p.number,
                    p.supplier,
                    new Date(p.date).toLocaleDateString("en-IN"),
                    p.taxable,
                    p.gst,
                    p.total,
                  ]),
                  [
                    { label: "Total Purchases", value: summary.totalPurchases },
                    { label: "Total GST Paid", value: summary.totalGst },
                    { label: "Suppliers", value: summary.uniqueSuppliers },
                  ]
                )
              }
              className="h-10 px-4 rounded-lg border border-[hsl(var(--border))] bg-white inline-flex items-center gap-2 text-sm font-medium hover:bg-[hsl(var(--secondary))]"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Export Excel
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[hsl(var(--secondary))]/30">
              <tr className="text-left text-[11px] uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                <th className="py-3 px-4 font-semibold">Purchase No</th>
                <th className="py-3 px-4 font-semibold">Supplier Name</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold text-right">Taxable Amount</th>
                <th className="py-3 px-4 font-semibold text-right">GST Amount</th>
                <th className="py-3 px-4 font-semibold text-right">Grand Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-[hsl(var(--border))] hover:bg-[hsl(var(--secondary))]/20"
                >
                  <td className="py-3 px-4 font-mono text-xs font-medium">
                    {p.number}
                  </td>
                  <td className="py-3 px-4 font-medium">{p.supplier}</td>
                  <td className="py-3 px-4 text-[hsl(var(--muted-foreground))]">
                    {new Date(p.date).toLocaleDateString("en-IN")}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums">
                    {inr(p.taxable)}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums text-[hsl(var(--muted-foreground))]">
                    {inr(p.gst)}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums font-semibold">
                    {inr(p.total)}
                  </td>
                </tr>
              ))}
              {filteredPurchases.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-[hsl(var(--muted-foreground))]"
                  >
                    No purchases found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}