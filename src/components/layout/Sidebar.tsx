import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  Package,
  QrCode,
  FileBarChart,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/billing", label: "Billing", icon: Receipt },
  { to: "/inventory", label: "Inventory", icon: Package },
  { to: "/barcode", label: "Barcode Printing", icon: QrCode },
  { to: "/reports", label: "Reports", icon: FileBarChart },
  { to: "/settings", label: "Settings", icon: Settings },
  // Hidden for now - GST Reports (keeping for future use)
  // { to: "/gst", label: "GST Reports", icon: FileBarChart },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  function handleLogout() {
    logout();
    setUser(null);
    navigate("/login", { replace: true });
  }

  return (
    <aside className="hidden md:flex w-[260px] shrink-0 flex-col bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] border-r border-[hsl(var(--sidebar-border))]">
      <div className="px-6 pt-6 pb-5 border-b border-[hsl(var(--sidebar-border))]">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] grid place-items-center font-display font-bold text-lg">
            B
          </div>
          <div className="leading-tight">
            <div className="font-display text-base font-semibold text-white">
              BoutiqueOS
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-1 scrollbar-thin">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-[hsl(var(--sidebar-accent))] text-white"
                  : "text-[hsl(var(--sidebar-foreground))]/80 hover:bg-[hsl(var(--sidebar-accent))]/60 hover:text-white"
              )
            }
          >
            {({ isActive }) => (
              <>
                <it.icon
                  className={cn(
                    "h-[18px] w-[18px]",
                    isActive
                      ? "text-[hsl(var(--accent))]"
                      : "text-[hsl(var(--sidebar-foreground))]/60"
                  )}
                />
                <span className="font-medium">{it.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-5 pt-4 border-t border-[hsl(var(--sidebar-border))]">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
          <div className="h-9 w-9 rounded-full bg-[hsl(var(--sidebar-accent))] text-white grid place-items-center text-sm font-semibold">
            {user?.name?.[0] ?? "U"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-white truncate">
              {user?.name}
            </div>
            <div className="text-[11px] text-[hsl(var(--sidebar-foreground))]/60 truncate">
              {user?.role === "admin" ? "Administrator" : "Sales Staff"}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="grid place-items-center h-8 w-8 rounded-md text-[hsl(var(--sidebar-foreground))]/60 hover:text-white hover:bg-[hsl(var(--sidebar-accent))] transition-colors"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
