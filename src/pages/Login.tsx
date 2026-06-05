import { FormEvent, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { login } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [email, setEmail] = useState("admin@boutiqueos.com");
  const [password, setPassword] = useState("demo123");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const u = login(email, password);
      if (!u) {
        setError("Invalid credentials. Try the demo logins on the right.");
        setLoading(false);
        return;
      }
      setUser(u);
      navigate("/dashboard", { replace: true });
    }, 450);
  }

  function fillCreds(e: string) {
    setEmail(e);
    setPassword("demo123");
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[hsl(var(--background))]">
      {/* Left: Form */}
      <div className="flex-1 flex flex-col px-6 sm:px-10 lg:px-16 py-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[hsl(var(--primary))] text-white grid place-items-center font-display font-bold text-lg">
            B
          </div>
          <div className="leading-tight">
            <div className="font-display font-semibold">BoutiqueOS</div>
          </div>
        </div>

        <div className="flex-1 flex items-center">
          <div className="w-full max-w-md mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-white px-3 py-1 text-xs">
              <Sparkles className="h-3 w-3 text-[hsl(var(--accent))]" />
              <span className="font-medium">Demo build</span>
              <span className="text-[hsl(var(--muted-foreground))]">v1.0</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight mt-6">
              Welcome back.
            </h1>
            <p className="text-[hsl(var(--muted-foreground))] mt-3">
              Sign in to manage your boutique — billing, inventory, barcode
              labels and GST, all in one place.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Email
                </label>
                <div className="flex items-center gap-2 px-3 h-12 rounded-xl bg-white border border-[hsl(var(--border))] focus-within:ring-2 focus-within:ring-[hsl(var(--ring))]/20 focus-within:border-[hsl(var(--ring))]">
                  <Mail className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-transparent text-sm outline-none"
                    placeholder="you@boutique.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Password
                </label>
                <div className="flex items-center gap-2 px-3 h-12 rounded-xl bg-white border border-[hsl(var(--border))] focus-within:ring-2 focus-within:ring-[hsl(var(--ring))]/20 focus-within:border-[hsl(var(--ring))]">
                  <Lock className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                  <input
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex-1 bg-transparent text-sm outline-none"
                    placeholder="Your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                  >
                    {showPwd ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error ? (
                <div className="text-sm text-[hsl(var(--destructive))] bg-[hsl(var(--destructive))]/10 border border-[hsl(var(--destructive))]/20 rounded-lg px-3 py-2">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-[hsl(var(--primary))] text-white font-semibold flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] transition disabled:opacity-60"
              >
                {loading ? "Signing in…" : "Sign in to dashboard"}
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))] justify-center">
                <ShieldCheck className="h-3.5 w-3.5" />
                Secure demo session • No real data is stored
              </div>
            </form>
          </div>
        </div>

        <div className="text-xs text-[hsl(var(--muted-foreground))] pt-6">
          © {new Date().getFullYear()} BoutiqueOS. Crafted for India.
        </div>
      </div>

      {/* Right: Demo credentials panel */}
      <div className="lg:w-[480px] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-8 py-12 flex flex-col justify-between relative overflow-hidden">
        <div
          aria-hidden
          className="absolute -top-32 -right-24 h-[420px] w-[420px] rounded-full bg-[hsl(var(--accent))]/15 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute bottom-0 left-0 right-0 h-px bg-white/10"
        />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-white/70">
            <Sparkles className="h-3 w-3 text-[hsl(var(--accent))]" />
            Demo logins
          </div>
          <h2 className="font-display text-3xl font-semibold mt-5 leading-tight">
            Try the full system in two clicks.
          </h2>
          <p className="text-white/70 mt-3 text-sm leading-relaxed">
            Use either of the demo accounts below. Admin gets the full
            experience; staff is locked into billing-friendly views.
          </p>
        </div>

        <div className="relative space-y-3 mt-10">
          {[
            {
              role: "Admin",
              email: "admin@boutiqueos.com",
              hint: "Full access — dashboard, inventory, GST",
            },
            {
              role: "Staff",
              email: "staff@boutiqueos.com",
              hint: "Billing-first view, barcode + stock checks",
            },
          ].map((acc) => (
            <button
              key={acc.email}
              type="button"
              onClick={() => fillCreds(acc.email)}
              className="w-full text-left rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] px-4 py-3 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[hsl(var(--accent))]">
                  {acc.role}
                </span>
                <span className="text-[11px] text-white/60">click to fill</span>
              </div>
              <div className="font-medium mt-1">{acc.email}</div>
              <div className="text-xs text-white/60 mt-0.5">{acc.hint}</div>
            </button>
          ))}
          <div className="rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-sm">
            <span className="text-white/60">Password </span>
            <span className="font-mono font-semibold ml-1">demo123</span>
          </div>
        </div>

        <div className="relative grid grid-cols-3 gap-3 mt-10">
          {[
            { k: "Bills/day", v: "180+" },
            { k: "SKUs", v: "1,240" },
            { k: "GST ready", v: "100%" },
          ].map((s) => (
            <div
              key={s.k}
              className="rounded-xl bg-white/[0.04] border border-white/10 p-3"
            >
              <div className="text-2xl font-semibold tabular-nums">{s.v}</div>
              <div className="text-[11px] uppercase tracking-[0.16em] text-white/60 mt-1">
                {s.k}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
