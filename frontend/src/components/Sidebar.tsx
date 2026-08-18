import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Sparkles,
  Brain,
} from "lucide-react";
import clsx from "clsx";
import type { ResumenStats } from "../types";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/procesar", label: "Procesar contenido", icon: Sparkles },
];

interface SidebarProps {
  resumen: ResumenStats;
}

export function Sidebar({ resumen }: SidebarProps) {
  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col justify-between bg-white border-r border-(--color-border) px-4 py-6">
      <div>
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="grid place-items-center h-9 w-9 rounded-xl bg-(--color-brand-500) text-white">
            <Brain size={18} />
          </div>
          <span className="font-display font-extrabold text-lg tracking-tight">
            TechMind
          </span>
        </div>

        <nav className="space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-(--color-brand-500) text-white shadow-sm shadow-(--color-brand-300)"
                    : "text-(--color-ink-soft) hover:bg-(--color-surface-muted) hover:text-(--color-ink)"
                )
              }
            >
              <Icon size={18} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="rounded-2xl bg-(--color-surface-muted) p-4">
        <p className="text-xs font-semibold text-(--color-ink-faint) uppercase tracking-wide mb-3">
          Resumen rápido
        </p>
        <ul className="space-y-3 text-sm">
          <li className="flex items-center justify-between">
            <span className="text-(--color-ink-soft)">Procesados</span>
            <span className="font-display font-bold">
              {resumen.contenidosProcesados}
            </span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-(--color-ink-soft)">Categorías</span>
            <span className="font-display font-bold">
              {resumen.categoriasDetectadas}
            </span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-(--color-ink-soft)">Precisión</span>
            <span className="font-display font-bold text-(--color-mint-600)">
              {Math.round(resumen.precisionPromedio * 100)}%
            </span>
          </li>
        </ul>
      </div>
    </aside>
  );
}
