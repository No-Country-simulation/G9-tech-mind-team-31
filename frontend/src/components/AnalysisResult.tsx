import { BarChart3, FolderKanban, Tags, Link2, ChevronRight } from "lucide-react";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import type { AnalisisResultado } from "../types";

interface AnalysisResultProps {
  resultado: AnalisisResultado | null;
}

export function AnalysisResult({ resultado }: AnalysisResultProps) {
  return (
    <div className="rounded-2xl bg-white border border-(--color-border) p-5 shadow-sm shadow-black/[0.02]">
      <div className="flex items-center gap-2 mb-5">
        <div className="grid place-items-center h-8 w-8 rounded-lg bg-(--color-brand-50) text-(--color-brand-600)">
          <BarChart3 size={16} />
        </div>
        <h2 className="font-display font-bold text-base">Resultado del análisis</h2>
      </div>

      {!resultado ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card title="Categoría" icon={<FolderKanban size={18} />}>
            <p className="font-display font-extrabold text-lg mt-1">
              {resultado.categoria}
            </p>
            <span className="mt-2 inline-block rounded-full bg-(--color-brand-50) px-2.5 py-1 text-xs font-medium text-(--color-brand-600)">
              Categoría principal
            </span>
          </Card>

          <Card title="Confianza" icon={null} center>
            <ConfidenceDonut value={resultado.probabilidad} />
          </Card>

          <Card title="Palabras clave" icon={<Tags size={18} />}>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {resultado.informaciones_adicionales.map((kw) => (
                <span
                  key={kw}
                  className="rounded-full bg-(--color-brand-50) px-2.5 py-1 text-xs font-medium text-(--color-brand-600)"
                >
                  {kw}
                </span>
              ))}
            </div>
          </Card>

          {resultado.contenidos_relacionados && resultado.contenidos_relacionados.length > 0 && (
            <div className="sm:col-span-3 rounded-xl border border-(--color-border) p-4">
              <div className="flex items-center gap-2 mb-3 text-(--color-ink-soft)">
                <Link2 size={16} />
                <p className="text-sm font-semibold">Contenidos relacionados</p>
              </div>
              <ul className="space-y-2">
                {resultado.contenidos_relacionados.slice(0, 3).map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-(--color-ink)">{c.titulo}</span>
                    <span className="text-(--color-mint-600) font-medium text-xs">
                      {Math.round(c.similitud * 100)}% similitud
                    </span>
                  </li>
                ))}
              </ul>
              {resultado.contenidos_relacionados.length > 3 && (
                <button className="mt-3 flex items-center gap-1 text-xs font-semibold text-(--color-brand-600) hover:underline">
                  Ver todos ({resultado.contenidos_relacionados.length})
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Card({
  title,
  icon,
  children,
  center = false,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-(--color-border) p-4 ${
        center ? "flex flex-col items-center text-center" : ""
      }`}
    >
      <div className="flex items-center gap-1.5 text-(--color-ink-faint) text-xs font-semibold uppercase tracking-wide">
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}

function ConfidenceDonut({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const data = [{ name: "confianza", value: pct, fill: "var(--color-mint-500)" }];
  const nivel = pct >= 80 ? "Alta confianza" : pct >= 50 ? "Confianza media" : "Confianza baja";

  return (
    <div className="relative flex flex-col items-center mt-1">
      <RadialBarChart
        width={120}
        height={120}
        cx="50%"
        cy="50%"
        innerRadius={42}
        outerRadius={58}
        barSize={10}
        data={data}
        startAngle={90}
        endAngle={-270}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
        <RadialBar background={{ fill: "var(--color-surface-muted)" }} dataKey="value" cornerRadius={10} />
      </RadialBarChart>
      <div className="absolute top-[38px] flex flex-col items-center">
        <span className="font-display font-extrabold text-xl">{pct}%</span>
      </div>
      <span className="text-xs font-medium text-(--color-mint-600) -mt-1">{nivel}</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center text-(--color-ink-faint)">
      <div className="grid place-items-center h-12 w-12 rounded-full bg-(--color-surface-muted) mb-3">
        <BarChart3 size={20} />
      </div>
      <p className="text-sm font-medium text-(--color-ink-soft)">
        Aún no hay nada que analizar
      </p>
      <p className="text-xs mt-1 max-w-xs">
        Completa el formulario y presiona "Procesar contenido" para ver categoría, confianza y palabras clave.
      </p>
    </div>
  );
}
