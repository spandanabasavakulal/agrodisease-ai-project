import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, ScanLine, Sprout, History, BarChart3, Database, Info, Bell, Search, Menu, X, Leaf,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/detect", label: "Disease Detection", icon: ScanLine },
  { to: "/recommendations", label: "Recommendations", icon: Sprout },
  { to: "/history", label: "Detection History", icon: History },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/dataset-model", label: "Dataset & Model", icon: Database },
  { to: "/about", label: "About Project", icon: Info },
] as const;

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
        <Leaf className="h-5 w-5" />
      </div>
      <div>
        <div className="font-display text-lg font-semibold leading-tight text-sidebar-accent-foreground">AgroDisease AI</div>
        <div className="text-[11px] text-sidebar-foreground/70">AI-Powered Crop Health Assistant</div>
      </div>
    </div>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: to === "/" }}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
          activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground [&_svg]:text-sidebar-primary" }}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen lg:pl-64">
      <aside className="leaf-pattern fixed inset-y-0 left-0 z-30 hidden w-64 flex-col gap-8 bg-sidebar p-5 lg:flex">
        <Brand />
        <NavList />
        <div className="mt-auto rounded-xl border border-sidebar-border p-3 text-xs text-sidebar-foreground/80">
          Final-year AI/ML project · Frontend running in <strong className="text-sidebar-primary">demo mode</strong>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-forest/50" onClick={() => setOpen(false)} />
          <aside className="leaf-pattern absolute inset-y-0 left-0 flex w-72 flex-col gap-8 bg-sidebar p-5">
            <div className="flex items-center justify-between">
              <Brand />
              <button aria-label="Close menu" onClick={() => setOpen(false)} className="text-sidebar-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavList onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur sm:px-6">
        <button aria-label="Open menu" className="rounded-lg p-2 hover:bg-muted lg:hidden" onClick={() => setOpen(true)}>
          <Menu className="h-5 w-5" />
        </button>
        <form
          className="relative max-w-md flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/history", search: { q } });
          }}
        >
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search crops, diseases, history…"
            className="h-10 w-full rounded-lg border bg-card pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </form>
        <div className="ml-auto flex items-center gap-3">
          <button aria-label="Notifications" className="relative rounded-lg p-2 hover:bg-muted">
            <Bell className="h-5 w-5 text-forest" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-leaf" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary font-bold text-secondary-foreground">F</div>
            <div className="hidden text-sm sm:block">
              <div className="font-semibold text-forest">Farmer</div>
              <div className="text-xs text-muted-foreground">Guest profile</div>
            </div>
          </div>
        </div>
      </header>

      <main className={cn("mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8")}>{children}</main>
    </div>
  );
}
