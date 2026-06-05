import {
  IndianRupee,
  Package,
  ShoppingBag,
  AlertTriangle,
  ArrowUpRight,
  Receipt,
  PackagePlus,
  QrCode,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import TopBar from "@/components/layout/TopBar";
import StatCard from "@/components/features/StatCard";
import {
  CATEGORY_BREAKDOWN,
  INVOICES,
  PRODUCTS,
  RECENT_ACTIVITY,
  SALES_TREND,
} from "@/lib/mockData";
import { inr, num } from "@/lib/format";
import { Link } from "react-router-dom";

const COLORS = [
  "#0F0E0C",
  "#C2873A",
  "#5A4630",
  "#A8895E",
  "#7C5E3B",
  "#D9C0A0",
];

export default function Dashboard() {
  const totalProducts = PRODUCTS.length;
  const stockUnits = PRODUCTS.reduce((s, p) => s + p.quantity, 0);
  const lowStock = PRODUCTS.filter((p) => p.quantity <= p.lowStockThreshold);
  const todaysInvoices = INVOICES.filter((i) => {
    const d = new Date(i.date);
    const t = new Date();
    return (
      d.getDate() === t.getDate() &&
      d.getMonth() === t.getMonth() &&
      d.getFullYear() === t.getFullYear()
    );
  });
  const todaySales = todaysInvoices.reduce((s, i) => s + i.total, 0);
  const monthSales = INVOICES.filter((i) => {
    const d = new Date(i.date);
    const t = new Date();
    return d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
  }).reduce((s, i) => s + i.total, 0);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <TopBar
        title="Good morning, Saranya"
        subtitle="Here is what's happening at your boutique today."
        actions={
          <Link
            to="/billing"
            className="hidden sm:inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-[hsl(var(--primary))] text-white text-sm font-semibold hover:opacity-95"
          >
            <Receipt className="h-4 w-4" />
            New Bill
          </Link>
        }
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6 animate-fade-in-up">
        <StatCard
          label="Today's Sales"
          value={inr(todaySales)}
          delta="+12.4%"
          trend="up"
          hint="vs yesterday"
          icon={<IndianRupee className="h-5 w-5" />}
        />
        <StatCard
          label="Monthly Revenue"
          value={inr(monthSales)}
          delta="+8.2%"
          trend="up"
          hint="vs last month"
          icon={<ShoppingBag className="h-5 w-5" />}
        />
        <StatCard
          label="Products in Stock"
          value={num(stockUnits)}
          delta={`${totalProducts} SKUs`}
          trend="flat"
          icon={<Package className="h-5 w-5" />}
        />
        <StatCard
          label="Low Stock Alerts"
          value={`${lowStock.length}`}
          delta="Action needed"
          trend="down"
          hint="re-order soon"
          icon={<AlertTriangle className="h-5 w-5" />}
        />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-6">
        <div className="xl:col-span-2 rounded-2xl border border-[hsl(var(--border))] bg-white p-5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="font-display text-lg font-semibold">
                Sales Trend
              </h2>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                Last 14 days · all channels
              </p>
            </div>
            <div className="flex gap-2 text-xs text-[hsl(var(--muted-foreground))]">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[hsl(var(--primary))]" />
                Sales
              </span>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={SALES_TREND}
                margin={{ top: 10, right: 8, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0F0E0C" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="#0F0E0C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="#E7E2DA"
                />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: "#6E665B" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#6E665B" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    border: "1px solid #E7E2DA",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => [inr(v), "Sales"]}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#0F0E0C"
                  strokeWidth={2}
                  fill="url(#g1)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-[hsl(var(--border))] bg-white p-5">
          <h2 className="font-display text-lg font-semibold">
            Inventory Mix
          </h2>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            By category (units in stock)
          </p>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_BREAKDOWN}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={48}
                  outerRadius={88}
                  paddingAngle={2}
                  stroke="white"
                  strokeWidth={2}
                >
                  {CATEGORY_BREAKDOWN.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11, color: "#6E665B" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-6 mb-10">
        <div className="xl:col-span-2 rounded-2xl border border-[hsl(var(--border))] bg-white">
          <div className="flex items-center justify-between p-5 border-b border-[hsl(var(--border))]">
            <div>
              <h2 className="font-display text-lg font-semibold">
                Recent Bills
              </h2>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                Latest invoices generated
              </p>
            </div>
            <Link
              to="/billing"
              className="text-xs font-semibold inline-flex items-center gap-1 text-[hsl(var(--foreground))] hover:underline"
            >
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-[hsl(var(--border))]">
            {INVOICES.slice(0, 6).map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-[hsl(var(--secondary))]/30"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-lg bg-[hsl(var(--secondary))] grid place-items-center text-xs font-bold">
                    {inv.customerName
                      .split(" ")
                      .map((s) => s[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">
                      {inv.customerName}
                    </div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))] truncate">
                      {inv.number} · {inv.items.length} item
                      {inv.items.length > 1 ? "s" : ""} · {inv.paymentMode}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{inr(inv.total)}</div>
                  <div className="text-[11px] text-[hsl(var(--muted-foreground))]">
                    {new Date(inv.date).toLocaleString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "short",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[hsl(var(--border))] bg-white p-5">
          <h2 className="font-display text-lg font-semibold">
            Recent Activity
          </h2>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            Today across the boutique
          </p>
          <ul className="mt-4 space-y-3">
            {RECENT_ACTIVITY.map((a) => {
              const Icon =
                a.type === "bill"
                  ? Receipt
                  : a.type === "stock"
                  ? PackagePlus
                  : QrCode;
              return (
                <li key={a.id} className="flex gap-3">
                  <div className="h-9 w-9 rounded-lg bg-[hsl(var(--secondary))] grid place-items-center shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium leading-snug">
                      {a.title}
                    </div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))] truncate">
                      {a.meta}
                    </div>
                  </div>
                  <div className="text-[11px] text-[hsl(var(--muted-foreground))] shrink-0">
                    {a.time}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
