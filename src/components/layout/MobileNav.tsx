import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  Package,
  QrCode,
  FileBarChart,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/billing", label: "Billing", icon: Receipt },
  { to: "/inventory", label: "Stock", icon: Package },
  { to: "/barcode", label: "Barcode", icon: QrCode },
  { to: "/reports", label: "Reports", icon: FileBarChart },
  { to: "/settings", label: "More", icon: Settings },
];

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur border-t border-[hsl(var(--border))]">
      <div className="grid grid-cols-6">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium",
                isActive
                  ? "text-[hsl(var(--foreground))]"
                  : "text-[hsl(var(--muted-foreground))]"
              )
            }
          >
            <it.icon className="h-4 w-4" />
            <span>{it.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
