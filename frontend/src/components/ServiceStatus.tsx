import { ShieldCheck, Cloud, Globe } from "lucide-react";
import type { ServicioInfo } from "../types";

const ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  cloud: Cloud,
  api: Globe,
};

interface ServiceStatusProps {
  servicios: (ServicioInfo & { icono: "cloud" | "api" })[];
}

const ESTADO_STYLES: Record<string, string> = {
  conectado: "bg-(--color-mint-50) text-(--color-mint-600)",
  activo: "bg-(--color-mint-50) text-(--color-mint-600)",
  inactivo: "bg-(--color-surface-muted) text-(--color-ink-faint)",
  error: "bg-(--color-coral-50) text-(--color-coral-600)",
};

export function ServiceStatus({ servicios }: ServiceStatusProps) {
  return (
    <div className="rounded-2xl bg-white border border-(--color-border) p-5 shadow-sm shadow-black/[0.02]">
      <div className="flex items-center gap-2 mb-4">
        <div className="grid place-items-center h-8 w-8 rounded-lg bg-(--color-mint-50) text-(--color-mint-600)">
          <ShieldCheck size={16} />
        </div>
        <h2 className="font-display font-bold text-base">Estado de servicios</h2>
      </div>

      <ul className="space-y-3">
        {servicios.map((s) => {
          const Icon = ICONS[s.icono];
          return (
            <li
              key={s.nombre}
              className="flex items-center justify-between rounded-xl border border-(--color-border) px-3.5 py-2.5"
            >
              <div className="flex items-center gap-3">
                <div className="grid place-items-center h-8 w-8 rounded-lg bg-(--color-surface-muted) text-(--color-ink-soft)">
                  <Icon size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{s.nombre}</p>
                  <p className="text-xs text-(--color-ink-faint)">{s.detalle}</p>
                </div>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${ESTADO_STYLES[s.estado]}`}
              >
                {s.estado}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
