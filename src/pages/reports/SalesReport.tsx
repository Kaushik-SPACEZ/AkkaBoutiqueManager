import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  FileText,
  FileSpreadsheet,
  Calendar,
  IndianRupee,
  Receipt,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import { INVOICES } from "@/lib/mockData";
import { inr } from "@/lib/format";
import { cn } from "@/lib/utils";
import { exportToPDF, exportToExcel, formatCurrencyForExport } from "@/lib/exportUtils";

type DateFilter = "today" | "week" | "month" | "custom";

export default function SalesReport() {
  const [dateFilter, setDateFilter] = useState<DateFilter>("month");
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter invoices based on date and search
  const filteredInvoices = useMemo(() => {
    const now = new Date();
    const q = query.trim().toLowerCase();

    return INVOICES.filter((inv) => {
      const invDate = new Date(inv.date);

      // Date filter
      if (dateFilter === "today") {
        if (
          invDate.getDate() !== now.getDate() ||
          invDate.getMonth() !== now.getMonth() ||
          invDate.getFullYear() !== now.getFullYear()
        ) {
          return false;
        }
      } else if (dateFilter === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (invDate < weekAgo) return false;
      } else if (dateFilter === "month") {
        if (
          invDate.getMonth() !== now.getMonth() ||
          invDate.getFullYear() !== now.getFullYear()
        ) {
          return false;
        }
      }

      // Search filter
      if (q) {
        return (
          inv.number.toLowerCase().includes(q) ||
          inv.customerName.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [dateFilter, query]);

  // Calculate summary
  const summary = useMemo(() => {
    const totalSales = filteredInvoices.reduce((s, i) => s + i.total, 0);
    const totalInvoices = filteredInvoices.length;
    const avgInvoice = totalInvoices > 0 ? totalSales / totalInvoices : 0;
    return { totalSales, totalInvoices, avgInvoice };
  }, [filteredInvoices]);

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-10">
      <TopBar
        title="Sales Report"
        subtitle="View and export all sales transactions."
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

      {/* Date Filter */}
      <div className="flex flex-wrap items-center gap-2 mt-6">
        {(
          [
            { key: "today", label: "Today" },
            { key: "week", label: "This Week" },
            { key: "month", label: "This Month" },
            { key: "custom", label: "Custom Range" },
          ] as { key: DateFilter; label: string }[]
        ).map((item) => (
          <button
            key={item.key}
            onClick={() => {
              setDateFilter(item.key);
              setCurrentPage(1);
            }}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium border transition",
              dateFilter === item.key
                ? "bg-[hsl(var(--primary))] text-white border-[hsl(var(--primary))]"
                : "bg-white border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary))]/40"
            )}
          >
            <Calendar className="h-4 w-4 inline mr-2" />
            {item.label}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 grid place-items-center">
              <IndianRupee className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider font-medium">
                Total Sales
              </div>
              <div className="text-2xl font-semibold tabular-nums mt-0.5">
                {inr(summary.totalSales)}
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 grid place-items-center">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider font-medium">
                Total Invoices
              </div>
              <div className="text-2xl font-semibold tabular-nums mt-0.5">
                {summary.totalInvoices}
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 grid place-items-center">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider font-medium">
                Avg Invoice Value
              </div>
              <div className="text-2xl font-semibold tabular-nums mt-0.5">
                {inr(summary.avgInvoice)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="mt-6 rounded-2xl border border-[hsl(var(--border))] bg-white">
        <div className="p-4 border-b border-[hsl(var(--border))] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 px-3 h-10 rounded-lg bg-[hsl(var(--secondary))]/60 w-full sm:max-w-xs">
            <Search className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search invoice or customer..."
              className="flex-1 bg-transparent text-sm outline-none"
            />
            {query && (
              <button onClick={() => setQuery("")}>
                <X className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                exportToPDF(
                  "Sales Report",
                  ["Invoice No", "Date", "Customer", "Amount", "GST", "Payment"],
                  filteredInvoices.map((inv) => [
                    inv.number,
                    new Date(inv.date).toLocaleDateString("en-IN"),
                    inv.customerName,
                    formatCurrencyForExport(inv.total),
                    formatCurrencyForExport(inv.gstAmount),
                    inv.paymentMode,
                  ]),
                  [
                    { label: "Total Invoices", value: String(summary.totalInvoices) },
                    { label: "Total Sales", value: formatCurrencyForExport(summary.totalSales) },
                    { label: "Avg Invoice", value: formatCurrencyForExport(summary.avgInvoice) },
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
                  "Sales Report",
                  ["Invoice No", "Date", "Customer", "Amount", "GST", "Payment"],
                  filteredInvoices.map((inv) => [
                    inv.number,
                    new Date(inv.date).toLocaleDateString("en-IN"),
                    inv.customerName,
                    inv.total,
                    inv.gstAmount,
                    inv.paymentMode,
                  ]),
                  [
                    { label: "Total Invoices", value: summary.totalInvoices },
                    { label: "Total Sales", value: summary.totalSales },
                    { label: "Avg Invoice", value: summary.avgInvoice },
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
                <th className="py-3 px-4 font-semibold">Invoice No</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold text-right">Amount</th>
                <th className="py-3 px-4 font-semibold text-right">GST</th>
                <th className="py-3 px-4 font-semibold">Payment</th>
                <th className="py-3 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedInvoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="border-t border-[hsl(var(--border))] hover:bg-[hsl(var(--secondary))]/20"
                >
                  <td className="py-3 px-4 font-mono text-xs font-medium">
                    {inv.number}
                  </td>
                  <td className="py-3 px-4 text-[hsl(var(--muted-foreground))]">
                    {new Date(inv.date).toLocaleDateString("en-IN")}
                  </td>
                  <td className="py-3 px-4 font-medium">{inv.customerName}</td>
                  <td className="py-3 px-4 text-right tabular-nums font-semibold">
                    {inr(inv.total)}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums text-[hsl(var(--muted-foreground))]">
                    {inr(inv.gstAmount)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-md bg-[hsl(var(--secondary))] text-xs font-medium">
                      {inv.paymentMode}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      Paid
                    </span>
                  </td>
                </tr>
              ))}
              {paginatedInvoices.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-[hsl(var(--muted-foreground))]"
                  >
                    No invoices found for the selected period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[hsl(var(--border))] flex items-center justify-between">
            <div className="text-sm text-[hsl(var(--muted-foreground))]">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredInvoices.length)} of{" "}
              {filteredInvoices.length} invoices
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-9 w-9 rounded-lg border border-[hsl(var(--border))] grid place-items-center disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium px-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-9 w-9 rounded-lg border border-[hsl(var(--border))] grid place-items-center disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}