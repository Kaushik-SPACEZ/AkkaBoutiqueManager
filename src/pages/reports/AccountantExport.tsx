import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  FileSpreadsheet,
  Download,
  Check,
  Building2,
  ChevronDown,
} from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import { inr } from "@/lib/format";
import { exportToPDF, exportToMultiSheetExcel, formatCurrencyForExport } from "@/lib/exportUtils";

const MONTHS = [
  { value: "2026-06", label: "June 2026" },
  { value: "2026-05", label: "May 2026" },
  { value: "2026-04", label: "April 2026" },
  { value: "2026-03", label: "March 2026" },
  { value: "2026-02", label: "February 2026" },
  { value: "2026-01", label: "January 2026" },
];

// Mock monthly data
const getMonthData = () => ({
  sales: {
    total: 485000,
    taxable: 462000,
    gstCollected: 23000,
    invoiceCount: 145,
  },
  purchases: {
    total: 325000,
    taxable: 310000,
    gstPaid: 15500,
  },
  stock: {
    opening: 1250000,
    purchased: 325000,
    sold: 380000,
    closing: 1195000,
  },
});

export default function AccountantExport() {
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[0].value);
  const [generatedFiles, setGeneratedFiles] = useState<string[]>([]);

  const monthData = getMonthData();
  const monthLabel = MONTHS.find((m) => m.value === selectedMonth)?.label || "";

  const handleGeneratePDF = () => {
    exportToPDF(
      `${monthLabel} Accountant Summary`,
      ["Category", "Metric", "Value"],
      [
        ["Sales", "Total Sales", formatCurrencyForExport(monthData.sales.total)],
        ["Sales", "Taxable Sales", formatCurrencyForExport(monthData.sales.taxable)],
        ["Sales", "GST Collected", formatCurrencyForExport(monthData.sales.gstCollected)],
        ["Sales", "Invoice Count", String(monthData.sales.invoiceCount)],
        ["Purchases", "Total Purchases", formatCurrencyForExport(monthData.purchases.total)],
        ["Purchases", "Taxable Purchases", formatCurrencyForExport(monthData.purchases.taxable)],
        ["Purchases", "GST Paid (ITC)", formatCurrencyForExport(monthData.purchases.gstPaid)],
        ["Stock", "Opening Value", formatCurrencyForExport(monthData.stock.opening)],
        ["Stock", "Purchased", formatCurrencyForExport(monthData.stock.purchased)],
        ["Stock", "Sold", formatCurrencyForExport(monthData.stock.sold)],
        ["Stock", "Closing Value", formatCurrencyForExport(monthData.stock.closing)],
      ],
      [
        { label: "Month", value: monthLabel },
        { label: "Net GST Payable", value: formatCurrencyForExport(monthData.sales.gstCollected - monthData.purchases.gstPaid) },
      ]
    );
    setGeneratedFiles(["Accountant_Summary.pdf"]);
  };

  const handleGenerateExcel = () => {
    exportToMultiSheetExcel(
      `${monthLabel.replace(" ", "_")}_Accountant_Package`,
      [
        {
          name: "Sales",
          title: `${monthLabel} - Sales Report`,
          headers: ["Metric", "Value"],
          data: [
            ["Total Sales", monthData.sales.total],
            ["Taxable Sales", monthData.sales.taxable],
            ["GST Collected", monthData.sales.gstCollected],
            ["Invoice Count", monthData.sales.invoiceCount],
          ],
        },
        {
          name: "Purchases",
          title: `${monthLabel} - Purchase Report`,
          headers: ["Metric", "Value"],
          data: [
            ["Total Purchases", monthData.purchases.total],
            ["Taxable Purchases", monthData.purchases.taxable],
            ["GST Paid (ITC)", monthData.purchases.gstPaid],
          ],
        },
        {
          name: "Stock",
          title: `${monthLabel} - Stock Summary`,
          headers: ["Metric", "Value"],
          data: [
            ["Opening Value", monthData.stock.opening],
            ["Purchased", monthData.stock.purchased],
            ["Sold", monthData.stock.sold],
            ["Closing Value", monthData.stock.closing],
          ],
        },
        {
          name: "GST Summary",
          title: `${monthLabel} - GST Summary`,
          headers: ["Description", "Amount"],
          data: [
            ["Output GST (Sales)", monthData.sales.gstCollected],
            ["Input Tax Credit (Purchases)", monthData.purchases.gstPaid],
            ["Net GST Payable", monthData.sales.gstCollected - monthData.purchases.gstPaid],
          ],
        },
      ]
    );
    setGeneratedFiles([
      "Sales_Report.xlsx",
      "Purchase_Report.xlsx",
      "Stock_Report.xlsx",
      "GST_Summary.xlsx",
    ]);
  };

  const handleGenerateZip = () => {
    handleGeneratePDF();
    handleGenerateExcel();
    setGeneratedFiles([`${monthLabel.replace(" ", "_")}_Complete_Package (PDF + Excel)`]);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-10">
      <TopBar
        title="Accountant Export"
        subtitle="Generate complete month-end package for your CA."
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

      {/* Month Selector */}
      <div className="mt-6 rounded-2xl border border-[hsl(var(--primary))] bg-white p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))] font-medium">
              Select Month
            </div>
            <div className="text-2xl font-semibold mt-1">{monthLabel}</div>
          </div>
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setGeneratedFiles([]);
              }}
              className="h-12 pl-4 pr-10 rounded-xl border-2 border-[hsl(var(--primary))] bg-white text-base font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/20"
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Summary Preview */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-white p-5">
          <div className="text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))] font-medium mb-3">
            Sales Summary
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[hsl(var(--muted-foreground))]">Total Sales</span>
              <span className="font-semibold tabular-nums">{inr(monthData.sales.total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[hsl(var(--muted-foreground))]">Taxable Sales</span>
              <span className="tabular-nums">{inr(monthData.sales.taxable)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[hsl(var(--muted-foreground))]">GST Collected</span>
              <span className="tabular-nums text-emerald-600">{inr(monthData.sales.gstCollected)}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[hsl(var(--border))] bg-white p-5">
          <div className="text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))] font-medium mb-3">
            Purchase Summary
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[hsl(var(--muted-foreground))]">Total Purchases</span>
              <span className="font-semibold tabular-nums">{inr(monthData.purchases.total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[hsl(var(--muted-foreground))]">Taxable Purchases</span>
              <span className="tabular-nums">{inr(monthData.purchases.taxable)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[hsl(var(--muted-foreground))]">GST Paid (ITC)</span>
              <span className="tabular-nums text-red-500">{inr(monthData.purchases.gstPaid)}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[hsl(var(--border))] bg-white p-5">
          <div className="text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))] font-medium mb-3">
            Stock Summary
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[hsl(var(--muted-foreground))]">Opening Value</span>
              <span className="tabular-nums">{inr(monthData.stock.opening)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[hsl(var(--muted-foreground))]">Closing Value</span>
              <span className="font-semibold tabular-nums">{inr(monthData.stock.closing)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="mt-6 rounded-2xl border border-[hsl(var(--border))] bg-white p-6">
        <div className="text-lg font-semibold mb-4">Generate Package</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={handleGeneratePDF}
            className="h-16 rounded-xl border-2 border-[hsl(var(--border))] bg-white hover:border-[hsl(var(--primary))]/40 hover:bg-[hsl(var(--secondary))]/30 transition flex items-center justify-center gap-3 text-base font-medium"
          >
            <FileText className="h-6 w-6 text-red-500" />
            Generate PDF Package
          </button>
          <button
            onClick={handleGenerateExcel}
            className="h-16 rounded-xl border-2 border-[hsl(var(--border))] bg-white hover:border-[hsl(var(--primary))]/40 hover:bg-[hsl(var(--secondary))]/30 transition flex items-center justify-center gap-3 text-base font-medium"
          >
            <FileSpreadsheet className="h-6 w-6 text-emerald-600" />
            Generate Excel Package
          </button>
          <button
            onClick={handleGenerateZip}
            className="h-16 rounded-xl border-2 border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-white hover:opacity-95 transition flex items-center justify-center gap-3 text-base font-semibold"
          >
            <Download className="h-6 w-6" />
            Download Complete Package
          </button>
        </div>

        {generatedFiles.length > 0 && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-2 text-emerald-700 font-medium mb-2">
              <Check className="h-5 w-5" />
              Files downloaded successfully!
            </div>
            <div className="space-y-1">
              {generatedFiles.map((file) => (
                <div key={file} className="text-sm text-emerald-600">{file}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Package Contents Info */}
      <div className="mt-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--secondary))]/30 p-6">
        <div className="text-lg font-semibold mb-4">📦 What&apos;s included in the package?</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="font-medium mb-2">PDF Package contains:</div>
            <ul className="space-y-1 text-sm text-[hsl(var(--muted-foreground))]">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                Boutique Information & GSTIN
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                Sales Summary with GST breakup
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                Purchase Summary with ITC details
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                Stock Valuation Summary
              </li>
            </ul>
          </div>
          <div>
            <div className="font-medium mb-2">Excel Package contains:</div>
            <ul className="space-y-1 text-sm text-[hsl(var(--muted-foreground))]">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                Sales Report with all invoices
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                Purchase Report with all bills
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                Stock Movement Report
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                GST Summary Sheet
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Business Info Card */}
      <div className="mt-6 rounded-2xl border border-[hsl(var(--border))] bg-white p-6">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-[hsl(var(--primary))] text-white grid place-items-center">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <div className="font-semibold text-lg">BoutiqueOS</div>
            <div className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
              45, Pondy Bazaar, T. Nagar, Chennai 600017
            </div>
            <div className="text-sm text-[hsl(var(--muted-foreground))]">
              GSTIN: 33AABCU9603R1ZM
            </div>
            <div className="text-xs text-[hsl(var(--muted-foreground))] mt-2">
              This information will appear on all generated reports.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}