import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CATEGORIAS_FIJAS } from "../constants/categorias";
import type { AnalisisRegistro } from "../types";
import type { CategoriaStats } from "../hooks/useCategoriaStats";
import { TrendingUp, CheckCircle, BarChart3 } from "lucide-react";

interface MetricasPanelProps {
  stats: CategoriaStats;
  historial: AnalisisRegistro[];
}

export function MetricasPanel({ stats, historial }: MetricasPanelProps) {
  const precisionPromedio = useMemo(() => {
    if (!historial.length) return 0;
    const suma = historial.reduce(
      (acc, r) => acc + r.resultado.probabilidad,
      0,
    );
    return suma / historial.length;
  }, [historial]);

  const datosGrafico = useMemo(() => {
    return stats.conteos.map((c) => ({
      nombre: c.nombre,
      count: c.count,
      color:
        CATEGORIAS_FIJAS.find((cat) => cat.nombre === c.nombre)?.color.text ??
        "text-(--color-ink)",
    }));
  }, [stats.conteos]);

  return (
    <aside className="rounded-2xl bg-white border border-(--color-border) p-5 shadow-sm shadow-black/[0.02]">
      <div className="flex items-center gap-2 mb-5">
        <div className="grid place-items-center h-8 w-8 rounded-lg bg-(--color-brand-50) text-(--color-brand-600)">
          <BarChart3 size={16} />
        </div>
        <h2 className="font-display font-bold text-base">Métricas</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div className="flex items-center gap-3 rounded-xl border border-(--color-border) bg-(--color-surface-muted) px-4 py-3">
          <div className="grid place-items-center h-9 w-9 rounded-lg bg-(--color-brand-50) text-(--color-brand-600)">
            <BarChart3 size={18} />
          </div>
          <div>
            <p className="text-xs text-(--color-ink-faint) uppercase tracking-wide font-semibold">
              Total de consultas
            </p>
            <p className="font-display font-bold text-2xl text-(--color-ink)">
              {stats.totalConsultas}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-(--color-border) bg-(--color-surface-muted) px-4 py-3">
          <div className="grid place-items-center h-9 w-9 rounded-lg bg-(--color-mint-50) text-(--color-mint-600)">
            <TrendingUp size={18} />
          </div>
          <div>
            <p className="text-xs text-(--color-ink-faint) uppercase tracking-wide font-semibold">
              Confianza promedio
            </p>
            <p className="font-display font-bold text-2xl text-(--color-ink)">
              {Math.round(precisionPromedio * 100)}%
            </p>
          </div>
        </div>
      </div>

      {historial.length > 0 ? (
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={datosGrafico} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="nombre"
                tick={{ fontSize: 10, fill: "var(--color-ink-faint)" }}
                tickLine={false}
                axisLine={false}
                interval={0}
                angle={-30}
                textAnchor="end"
                height={40}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "var(--color-ink-faint)" }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                domain={[0, "dataMax + 1"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "0.5rem",
                }}
                formatter={(value: number | string) => [`${value} docs`, "Consultas"]}
                labelStyle={{ color: "var(--color-ink)" }}
                itemStyle={{ color: "var(--color-ink)" }}
                cursor={{ opacity: 0.1 }}
              />
              <Bar
                dataKey="count"
                radius={[4, 4, 0, 0]}
                fill="var(--color-brand-500)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[180px] flex items-center justify-center text-center text-(--color-ink-faint) text-sm">
          <div className="flex flex-col items-center gap-2">
            <CheckCircle size={24} className="text-(--color-ink-faint)" />
            <p>Aún no hay datos para mostrar. Procesa contenido desde el formulario.</p>
          </div>
        </div>
      )}
    </aside>
  );
}
