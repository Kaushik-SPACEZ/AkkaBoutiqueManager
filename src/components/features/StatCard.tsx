import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "flat";
  icon: React.ReactNode;
  hint?: string;
}

export default function StatCard({
  label,
  value,
  delta,
  trend = "up",
  icon,
  hint,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-[hsl(var(--border))] bg-white p-5 shadow-[0_1px_0_rgba(15,14,12,0.04)] hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))] font-medium">
            {label}
          </div>
          <div className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">
            {value}
          </div>
        </div>
        <div className="h-10 w-10 rounded-xl bg-[hsl(var(--secondary))] grid place-items-center text-[hsl(var(--foreground))]">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs">
        {delta ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold",
              trend === "up" &&
                "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]",
              trend === "down" &&
                "bg-[hsl(var(--destructive))]/10 text-[hsl(var(--destructive))]",
              trend === "flat" &&
                "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
            )}
          >
            {trend === "up" ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : trend === "down" ? (
              <ArrowDownRight className="h-3 w-3" />
            ) : null}
            {delta}
          </span>
        ) : null}
        {hint ? (
          <span className="text-[hsl(var(--muted-foreground))]">{hint}</span>
        ) : null}
      </div>
    </div>
  );
}
