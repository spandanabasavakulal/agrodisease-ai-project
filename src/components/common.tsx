import type { ReactNode } from "react";
import { FlaskConical, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SystemState } from "@/types";
import { SYSTEM_STATUS } from "@/config/project";

export function DemoBadge({ children = "Demo Data", className }: { children?: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border border-warning/40 bg-warning-soft px-2.5 py-0.5 text-xs font-semibold text-warning", className)}>
      <FlaskConical className="h-3.5 w-3.5" />
      {children}
    </span>
  );
}

export function PageHeader({ title, description, badge }: { title: string; description?: string; badge?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {badge}
    </div>
  );
}

export function Panel({ children, className, title, icon, action }: { children: ReactNode; className?: string | undefined; title?: string; icon?: ReactNode; action?: ReactNode }) {
  return (
    <section className={cn("rounded-2xl border bg-card p-5 shadow-soft", className)}>
      {title && (
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 font-sans text-base font-bold text-forest">
            {icon && <span className="text-primary">{icon}</span>}
            {title}
          </h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

const stateStyle: Record<SystemState, string> = {
  connected: "bg-success",
  configured: "bg-success",
  demo: "bg-warning",
  disconnected: "bg-destructive",
};

export function StatusDot({ state }: { state: SystemState }) {
  return <span className={cn("inline-block h-2.5 w-2.5 rounded-full", stateStyle[state])} />;
}

export function SystemStatusCard({ className }: { className?: string | undefined }) {
  return (
    <Panel title="System Status" icon={<CircleDot className="h-4 w-4" />} className={className}>
      <ul className="divide-y">
        {SYSTEM_STATUS.map((s) => (
          <li key={s.label} className="flex items-center justify-between py-2.5 text-sm">
            <span className="text-muted-foreground">{s.label}</span>
            <span className="flex items-center gap-2 font-semibold text-forest">
              <StatusDot state={s.state} />
              {s.value}
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function InfoField({ label, value, icon }: { label: string; value: ReactNode; icon?: ReactNode }) {
  return (
    <div className="rounded-xl bg-leaf-soft p-4">
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-base font-bold text-forest">{value}</div>
    </div>
  );
}

export function SafetyNotice() {
  return (
    <div className="rounded-xl border border-warning/40 bg-warning-soft p-4 text-sm text-foreground">
      <strong className="text-warning">Safety notice: </strong>
      Recommendation based on available agricultural knowledge data. Verify the product label and local agricultural guidance before application. This is not an authoritative prescription and no dosages are provided.
    </div>
  );
}
