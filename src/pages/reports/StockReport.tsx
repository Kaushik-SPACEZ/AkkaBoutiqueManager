import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  FileText,
  FileSpreadsheet,
  Package,
  IndianRupee,
  AlertTriangle,
  X,
} from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import { PRODUCTS, CATEGORIES } from "@/lib/mockData";
import { inr, num } from "@/lib/format";
import { exportToPDF, exportToExcel, formatCurrencyForExport } from "@/lib/exportUtils";

export default function StockReport() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      if (selectedCategory !== "All Categories" && p.category !== selectedCategory) {
        return false;
      }
      if (q) {
        return (
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.barcode.includes(q)
        );
      }
      return true;
    });
  }, [query, selectedCategory]);

  const summary = useMemo(() => {
    const totalProducts = filteredProducts.length;
    const totalStockValue = filteredProducts.reduce(
      (s, p) => s + p.quantity * p.sellingPrice,
      0
    );
    const lowStockItems = filteredProducts.filter(
      (p) => p.quantity <= p.lowStockThreshold
    ).length;
    return { totalProducts, totalStockValue, lowStockItems };
  }, [filteredProducts]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-10">
      <TopBar
        title="Stock Report"
        subtitle="Current inventory levels, stock movements, and valuation."
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
              <Package className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider font-medium">
                Total Products
              </div>
              <div className="text-2xl font-semibold tabular-nums mt-0.5">
                {num(summary.totalProducts)}
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 grid place-items-center">
              <IndianRupee className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider font-medium">
                Total Stock Value
              </div>
              <div className="text-2xl font-semibold tabular-nums mt-0.5">
                {inr(summary.totalStockValue)}
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-red-50 text-red-600 grid place-items-center">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider font-medium">
                Low Stock Items
              </div>
              <div className="text-2xl font-semibold tabular-nums mt-0.5">
                {summary.lowStockItems}
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
                placeholder="Search product..."
                className="flex-1 bg-transparent text-sm outline-none"
              />
              {query && (
                <button onClick={() => setQuery("")}>
                  <X className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                </button>
              )}
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-10 px-3 rounded-lg border border-[hsl(var(--border))] bg-white text-sm"
            >
              <option>All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                exportToPDF(
                  "Stock Report",
                  ["Product", "SKU", "Category", "Closing Qty", "Price", "Value"],
                  filteredProducts.map((p) => [
                    p.name,
                    p.sku,
                    p.category,
                    p.quantity,
                    formatCurrencyForExport(p.sellingPrice),
                    formatCurrencyForExport(p.quantity * p.sellingPrice),
                  ]),
                  [
                    { label: "Total Products", value: String(summary.totalProducts) },
                    { label: "Total Stock Value", value: formatCurrencyForExport(summary.totalStockValue) },
                    { label: "Low Stock Items", value: String(summary.lowStockItems) },
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
                  "Stock Report",
                  ["Product", "SKU", "Category", "Closing Qty", "Selling Price", "Stock Value"],
                  filteredProducts.map((p) => [
                    p.name,
                    p.sku,
                    p.category,
                    p.quantity,
                    p.sellingPrice,
                    p.quantity * p.sellingPrice,
                  ]),
                  [
                    { label: "Total Products", value: summary.totalProducts },
                    { label: "Total Stock Value", value: summary.totalStockValue },
                    { label: "Low Stock Items", value: summary.lowStockItems },
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
                <th className="py-3 px-4 font-semibold">Product Name</th>
                <th className="py-3 px-4 font-semibold">SKU</th>
                <th className="py-3 px-4 font-semibold">Barcode</th>
                <th className="py-3 px-4 font-semibold text-right">Opening</th>
                <th className="py-3 px-4 font-semibold text-right">Purchased</th>
                <th className="py-3 px-4 font-semibold text-right">Sold</th>
                <th className="py-3 px-4 font-semibold text-right">Closing</th>
                <th className="py-3 px-4 font-semibold text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => {
                // Mock stock movement data
                const opening = Math.floor(p.quantity * 1.2);
                const purchased = Math.floor(Math.random() * 20) + 5;
                const sold = opening + purchased - p.quantity;
                const closing = p.quantity;
                const value = closing * p.sellingPrice;
                const isLowStock = closing <= p.lowStockThreshold;

                return (
                  <tr
                    key={p.id}
                    className={`border-t border-[hsl(var(--border))] hover:bg-[hsl(var(--secondary))]/20 ${
                      isLowStock ? "bg-red-50/30" : ""
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-8 w-8 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-medium truncate max-w-[200px]">
                            {p.name}
                          </div>
                          <div className="text-xs text-[hsl(var(--muted-foreground))]">
                            {p.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs">{p.sku}</td>
                    <td className="py-3 px-4 font-mono text-xs">{p.barcode}</td>
                    <td className="py-3 px-4 text-right tabular-nums">
                      {opening}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-emerald-600">
                      +{purchased}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-red-500">
                      -{sold}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums font-semibold">
                      {closing}
                      {isLowStock && (
                        <AlertTriangle className="h-3.5 w-3.5 text-red-500 inline ml-1" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums font-semibold">
                      {inr(value)}
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="py-12 text-center text-[hsl(var(--muted-foreground))]"
                  >
                    No products found.
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