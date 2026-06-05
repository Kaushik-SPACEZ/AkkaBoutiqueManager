import { Link } from "react-router-dom";
import {
  FileText,
  ShoppingCart,
  Package,
  Download,
  FileSpreadsheet,
  Calendar,
} from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import { exportToPDF, exportToExcel, formatCurrencyForExport } from "@/lib/exportUtils";
import { INVOICES, PRODUCTS } from "@/lib/mockData";

const PURCHASES = [
  { number: "PO-2026-001", supplier: "Kanchi Silks Pvt Ltd", date: "2026-06-01", taxable: 125000, gst: 6250, total: 131250 },
  { number: "PO-2026-002", supplier: "Chennai Textiles", date: "2026-05-28", taxable: 85000, gst: 4250, total: 89250 },
  { number: "PO-2026-003", supplier: "Mysore Silk House", date: "2026-05-25", taxable: 150000, gst: 7500, total: 157500 },
  { number: "PO-2026-004", supplier: "Banaras Weaves", date: "2026-05-20", taxable: 200000, gst: 10000, total: 210000 },
];

function exportSalesPDF() {
  const totalSales = INVOICES.reduce((s, i) => s + i.total, 0);
  exportToPDF(
    "Sales Report",
    ["Invoice No", "Date", "Customer", "Amount", "GST", "Payment"],
    INVOICES.map((inv) => [
      inv.number,
      new Date(inv.date).toLocaleDateString("en-IN"),
      inv.customerName,
      formatCurrencyForExport(inv.total),
      formatCurrencyForExport(inv.gstAmount),
      inv.paymentMode,
    ]),
    [
      { label: "Total Invoices", value: String(INVOICES.length) },
      { label: "Total Sales", value: formatCurrencyForExport(totalSales) },
    ]
  );
}

function exportSalesExcel() {
  const totalSales = INVOICES.reduce((s, i) => s + i.total, 0);
  exportToExcel(
    "Sales Report",
    ["Invoice No", "Date", "Customer", "Amount", "GST", "Payment"],
    INVOICES.map((inv) => [
      inv.number,
      new Date(inv.date).toLocaleDateString("en-IN"),
      inv.customerName,
      inv.total,
      inv.gstAmount,
      inv.paymentMode,
    ]),
    [
      { label: "Total Invoices", value: INVOICES.length },
      { label: "Total Sales", value: totalSales },
    ]
  );
}

function exportPurchasePDF() {
  const totalPurchases = PURCHASES.reduce((s, p) => s + p.total, 0);
  exportToPDF(
    "Purchase Report",
    ["Purchase No", "Supplier", "Date", "Taxable", "GST", "Total"],
    PURCHASES.map((p) => [
      p.number,
      p.supplier,
      new Date(p.date).toLocaleDateString("en-IN"),
      formatCurrencyForExport(p.taxable),
      formatCurrencyForExport(p.gst),
      formatCurrencyForExport(p.total),
    ]),
    [{ label: "Total Purchases", value: formatCurrencyForExport(totalPurchases) }]
  );
}

function exportPurchaseExcel() {
  const totalPurchases = PURCHASES.reduce((s, p) => s + p.total, 0);
  exportToExcel(
    "Purchase Report",
    ["Purchase No", "Supplier", "Date", "Taxable", "GST", "Total"],
    PURCHASES.map((p) => [
      p.number,
      p.supplier,
      new Date(p.date).toLocaleDateString("en-IN"),
      p.taxable,
      p.gst,
      p.total,
    ]),
    [{ label: "Total Purchases", value: totalPurchases }]
  );
}

function exportStockPDF() {
  const totalValue = PRODUCTS.reduce((s, p) => s + p.quantity * p.sellingPrice, 0);
  exportToPDF(
    "Stock Report",
    ["Product", "SKU", "Category", "Qty", "Price", "Value"],
    PRODUCTS.map((p) => [
      p.name,
      p.sku,
      p.category,
      p.quantity,
      formatCurrencyForExport(p.sellingPrice),
      formatCurrencyForExport(p.quantity * p.sellingPrice),
    ]),
    [
      { label: "Total Products", value: String(PRODUCTS.length) },
      { label: "Total Stock Value", value: formatCurrencyForExport(totalValue) },
    ]
  );
}

function exportStockExcel() {
  const totalValue = PRODUCTS.reduce((s, p) => s + p.quantity * p.sellingPrice, 0);
  exportToExcel(
    "Stock Report",
    ["Product", "SKU", "Category", "Qty", "Selling Price", "Stock Value"],
    PRODUCTS.map((p) => [
      p.name,
      p.sku,
      p.category,
      p.quantity,
      p.sellingPrice,
      p.quantity * p.sellingPrice,
    ]),
    [
      { label: "Total Products", value: PRODUCTS.length },
      { label: "Total Stock Value", value: totalValue },
    ]
  );
}

type ExportFn = (e: React.MouseEvent) => void;

const reportCards: {
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  lastGenerated: string;
  color: string;
  featured?: boolean;
  onPDF: ExportFn;
  onExcel: ExportFn;
}[] = [
  {
    title: "Sales Report",
    description: "View all sales, invoices, and revenue details. Filter by date and export for your records.",
    icon: FileText,
    path: "/reports/sales",
    lastGenerated: "Today, 10:30 AM",
    color: "bg-emerald-50 text-emerald-600",
    onPDF: (e) => { e.preventDefault(); exportSalesPDF(); },
    onExcel: (e) => { e.preventDefault(); exportSalesExcel(); },
  },
  {
    title: "Purchase Report",
    description: "Track all purchases from suppliers with GST details. Export for bookkeeping.",
    icon: ShoppingCart,
    path: "/reports/purchases",
    lastGenerated: "Yesterday, 4:15 PM",
    color: "bg-blue-50 text-blue-600",
    onPDF: (e) => { e.preventDefault(); exportPurchasePDF(); },
    onExcel: (e) => { e.preventDefault(); exportPurchaseExcel(); },
  },
  {
    title: "Stock Report",
    description: "Current inventory levels, stock movements, and valuation summary.",
    icon: Package,
    path: "/reports/stock",
    lastGenerated: "Today, 9:00 AM",
    color: "bg-amber-50 text-amber-600",
    onPDF: (e) => { e.preventDefault(); exportStockPDF(); },
    onExcel: (e) => { e.preventDefault(); exportStockExcel(); },
  },
  {
    title: "Accountant Export",
    description: "Generate complete month-end package for your CA. Includes all reports in one download.",
    icon: Download,
    path: "/reports/accountant",
    lastGenerated: "May 2026",
    color: "bg-purple-50 text-purple-600",
    featured: true,
    onPDF: (e) => { e.preventDefault(); exportSalesPDF(); },
    onExcel: (e) => { e.preventDefault(); exportSalesExcel(); },
  },
];

export default function Reports() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-10">
      <TopBar
        title="Reports"
        subtitle="Generate and export reports for your business and accountant."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {reportCards.map((card) => (
          <Link
            key={card.title}
            to={card.path}
            className={`group rounded-2xl border bg-white p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all ${
              card.featured
                ? "border-[hsl(var(--primary))] ring-1 ring-[hsl(var(--primary))]/20"
                : "border-[hsl(var(--border))]"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`h-12 w-12 rounded-xl ${card.color} grid place-items-center shrink-0`}
              >
                <card.icon className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-semibold">
                    {card.title}
                  </h3>
                </div>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1 leading-relaxed">
                  {card.description}
                </p>
                <div className="flex items-center gap-1 mt-3 text-xs text-[hsl(var(--muted-foreground))]">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Last generated: {card.lastGenerated}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-5 pt-4 border-t border-[hsl(var(--border))]">
              <button
                onClick={card.onPDF}
                className="flex-1 h-10 rounded-lg border border-[hsl(var(--border))] bg-white inline-flex items-center justify-center gap-2 text-sm font-medium hover:bg-[hsl(var(--secondary))] transition"
              >
                <FileText className="h-4 w-4" />
                Export PDF
              </button>
              <button
                onClick={card.onExcel}
                className="flex-1 h-10 rounded-lg border border-[hsl(var(--border))] bg-white inline-flex items-center justify-center gap-2 text-sm font-medium hover:bg-[hsl(var(--secondary))] transition"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Export Excel
              </button>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Info Section */}
      <div className="mt-8 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--secondary))]/30 p-6">
        <h3 className="font-display text-lg font-semibold mb-2">
          📋 How to use Reports
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-[hsl(var(--muted-foreground))]">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-[hsl(var(--primary))] text-white grid place-items-center text-sm font-bold shrink-0">
              1
            </div>
            <p>Select the report type you need based on your requirement.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-[hsl(var(--primary))] text-white grid place-items-center text-sm font-bold shrink-0">
              2
            </div>
            <p>Choose date range and apply filters if needed.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-[hsl(var(--primary))] text-white grid place-items-center text-sm font-bold shrink-0">
              3
            </div>
            <p>Export as PDF or Excel and share with your accountant.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
