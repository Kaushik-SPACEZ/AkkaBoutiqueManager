import { useMemo, useState } from "react";
import {
  Download,
  Printer,
  FileBarChart,
  TrendingUp,
  TrendingDown,
  IndianRupee,
} from "lucide-react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import TopBar from "@/components/layout/TopBar";
import StatCard from "@/components/features/StatCard";
import { GST_MONTHS, INVOICES } from "@/lib/mockData";
import { inr, num } from "@/lib/format";
import { cn } from "@/lib/utils";
import { exportToPDF, exportToExcel, formatCurrencyForExport } from "@/lib/exportUtils";

export default function GSTReports() {
  const [selectedIdx, setSelectedIdx] = useState(GST_MONTHS.length - 1);
  const month = GST_MONTHS[selectedIdx];

  const ytdSales = useMemo(
    () => GST_MONTHS.reduce((s, m) => s + m.sales, 0),
    []
  );
  const ytdPayable = useMemo(
    () => GST_MONTHS.reduce((s, m) => s + m.payable, 0),
    []
  );
  const ytdInput = useMemo(
    () => GST_MONTHS.reduce((s, m) => s + m.inputGst, 0),
    []
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-10">
      <TopBar
        title="GST Reports"
        subtitle="Monthly summary, exportable filings, and payable overview."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-[hsl(var(--border))] bg-white text-sm font-semibold"
            >
              <Printer className="h-4 w-4" /> Print
            </button>
            <button
              onClick={() =>
                exportToExcel(
                  "GST Report",
                  ["Month", "Taxable Sales", "Output GST", "Taxable Purchases", "Input GST", "Net Payable"],
                  GST_MONTHS.map((m) => [
                    m.label,
                    m.sales,
                    m.outputGst,
                    m.purchases,
                    m.inputGst,
                    m.payable,
                  ]),
                  [
                    { label: "YTD Taxable Sales", value: ytdSales },
                    { label: "YTD Input Tax Credit", value: ytdInput },
                    { label: "YTD Net GST Payable", value: ytdPayable },
                  ]
                )
              }
              className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-[hsl(var(--border))] bg-white text-sm font-semibold"
            >
              <Download className="h-4 w-4" /> Export Excel
            </button>
            <button
              onClick={() =>
                exportToPDF(
                  "GST Report",
                  ["Month", "Taxable Sales", "Output GST", "Input GST", "Net Payable"],
                  GST_MONTHS.map((m) => [
                    m.label,
                    formatCurrencyForExport(m.sales),
                    formatCurrencyForExport(m.outputGst),
                    formatCurrencyForExport(m.inputGst),
                    formatCurrencyForExport(m.payable),
                  ]),
                  [
                    { label: "YTD Taxable Sales", value: formatCurrencyForExport(ytdSales) },
                    { label: "YTD Input Tax Credit", value: formatCurrencyForExport(ytdInput) },
                    { label: "YTD Net GST Payable", value: formatCurrencyForExport(ytdPayable) },
                  ]
                )
              }
              className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-[hsl(var(--primary))] text-white text-sm font-semibold"
            >
              <Download className="h-4 w-4" /> Export PDF
            </button>
          </div>
        }
      />

      <section className="grid grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
        <StatCard
          label="YTD Taxable Sales"
          value={inr(ytdSales)}
          icon={<TrendingUp className="h-5 w-5" />}
          delta="+9.4%"
          trend="up"
        />
        <StatCard
          label="Output GST"
          value={inr(GST_MONTHS.reduce((s, m) => s + m.outputGst, 0))}
          icon={<FileBarChart className="h-5 w-5" />}
          delta="6 months"
          trend="flat"
        />
        <StatCard
          label="Input Tax Credit"
          value={inr(ytdInput)}
          icon={<TrendingDown className="h-5 w-5" />}
          delta="−2.1%"
          trend="down"
        />
        <StatCard
          label="Net GST Payable"
          value={inr(ytdPayable)}
          icon={<IndianRupee className="h-5 w-5" />}
          delta="due 20th"
          trend="flat"
        />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] gap-4 mt-6">
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold">
                Purchase vs Sales Tax
              </h2>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                Last 6 months
              </p>
            </div>
            <div className="text-xs text-[hsl(var(--muted-foreground))]">
              ₹ in thousands
            </div>
          </div>
          <div className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={GST_MONTHS}
                margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="#E7E2DA"
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "#6E665B" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#6E665B" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    border: "1px solid #E7E2DA",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => inr(v)}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11, color: "#6E665B" }}
                />
                <Bar
                  dataKey="outputGst"
                  name="Output GST (Sales)"
                  fill="#0F0E0C"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={28}
                />
                <Bar
                  dataKey="inputGst"
                  name="Input GST (Purchases)"
                  fill="#C2873A"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-[hsl(var(--border))] bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold">
                Monthly summary
              </h2>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                Tap a month to filter
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-1">
            {GST_MONTHS.map((m, i) => (
              <button
                key={m.label}
                onClick={() => setSelectedIdx(i)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition border",
                  selectedIdx === i
                    ? "bg-[hsl(var(--primary))] text-white border-[hsl(var(--primary))]"
                    : "bg-white border-transparent hover:border-[hsl(var(--border))]"
                )}
              >
                <span className="font-medium">{m.label}</span>
                <span className="tabular-nums">{inr(m.payable)}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-[hsl(var(--border))] bg-white print-area">
        <div className="px-5 py-4 flex items-center justify-between border-b border-[hsl(var(--border))]">
          <div>
            <div className="text-[11px] uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))] font-semibold">
              GSTR-3B style summary
            </div>
            <h2 className="font-display text-lg font-semibold mt-0.5">
              {month.label} statement
            </h2>
          </div>
          <div className="text-right text-xs text-[hsl(var(--muted-foreground))]">
            GSTIN 33AABCU9603R1ZM
            <br />
            BoutiqueOS, Chennai
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[hsl(var(--border))]">
          <Cell label="Taxable Sales" value={inr(month.sales)} />
          <Cell label="Taxable Purchases" value={inr(month.purchases)} />
          <Cell label="Net Payable" value={inr(month.payable)} accent />
          <Cell label="Output CGST" value={inr(month.outputGst / 2)} />
          <Cell label="Output SGST" value={inr(month.outputGst / 2)} />
          <Cell label="Input Tax Credit" value={inr(month.inputGst)} />
        </div>

        <div className="px-5 py-4 border-t border-[hsl(var(--border))]">
          <h3 className="text-sm font-semibold mb-3">
            Recent invoices in {month.label}
          </h3>
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="text-left bg-[hsl(var(--secondary))]/30">
                <tr className="text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">
                  <th className="py-2 px-4">Invoice</th>
                  <th className="py-2 px-4">Customer</th>
                  <th className="py-2 px-4">Date</th>
                  <th className="py-2 px-4 text-right">Taxable</th>
                  <th className="py-2 px-4 text-right">GST</th>
                  <th className="py-2 px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {INVOICES.slice(0, 8).map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-t border-[hsl(var(--border))]"
                  >
                    <td className="py-2 px-4 font-mono text-xs">
                      {inv.number}
                    </td>
                    <td className="py-2 px-4">{inv.customerName}</td>
                    <td className="py-2 px-4 text-xs text-[hsl(var(--muted-foreground))]">
                      {new Date(inv.date).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-2 px-4 text-right tabular-nums">
                      {inr(inv.subtotal)}
                    </td>
                    <td className="py-2 px-4 text-right tabular-nums">
                      {inr(inv.gstAmount)}
                    </td>
                    <td className="py-2 px-4 text-right tabular-nums font-semibold">
                      {inr(inv.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-[hsl(var(--border))] text-[11px] text-[hsl(var(--muted-foreground))] flex items-center justify-between">
          <span>Filing reference: GSTR-3B • {month.label}</span>
          <span>
            Generated {new Date().toLocaleDateString("en-IN")} • BoutiqueOS
          </span>
        </div>
      </section>
    </div>
  );
}

function Cell({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "p-5 bg-white",
        accent && "bg-[hsl(var(--primary))] text-white"
      )}
    >
      <div
        className={cn(
          "text-[11px] uppercase tracking-[0.16em] font-semibold",
          accent ? "text-white/70" : "text-[hsl(var(--muted-foreground))]"
        )}
      >
        {label}
      </div>
      <div className="text-2xl font-semibold mt-1 tabular-nums">
        {value}
      </div>
    </div>
  );
}
