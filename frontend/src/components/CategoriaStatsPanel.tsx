import { CATEGORIAS_FIJAS } from "../constants/categorias";
import type { CategoriaConteo } from "../hooks/useCategoriaStats";

interface CategoriaStatsPanelProps {
  conteos: CategoriaConteo[];
  otras?: number;
}

export function CategoriaStatsPanel({ conteos, otras = 0 }: CategoriaStatsPanelProps) {
  const conteoPorNombre = new Map(conteos.map((c) => [c.nombre, c.count] as const));

  return (
    <aside className="rounded-2xl bg-white border border-(--color-border) p-5 shadow-sm shadow-black/[0.02]">
      <div className="flex items-center gap-2 mb-4">
        <div className="grid place-items-center h-8 w-8 rounded-lg bg-(--color-brand-50) text-(--color-brand-600)">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5A2 2 0 0 1 2 17.5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v12.5a2 2 0 0 1-2 2Z" />
            <path d="M16 5V5a2 2 0 0 1 2-2h4a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-4" />
          </svg>
        </div>
        <h2 className="font-display font-bold text-base">Categorías reconocidas</h2>
      </div>

      <p className="text-xs text-(--color-ink-faint) mb-4">
        Las 5 categorías son fijas; el contador se actualiza en tiempo real desde el historial.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CATEGORIAS_FIJAS.map((categoria) => {
          const Icon = categoria.icono;
          const count = conteoPorNombre.get(categoria.nombre) ?? 0;

          return (
            <div
              key={categoria.nombre}
              className={`flex items-center justify-between rounded-xl border ${categoria.color.border} ${categoria.color.bg} px-3.5 py-3`}
            >
              <div className="flex items-center gap-2.5">
                <div className="grid place-items-center h-7 w-7 rounded-lg bg-white/50">
                  <Icon size={15} className={categoria.color.text} />
                </div>
                <span className="text-sm font-semibold text-(--color-ink)">
                  {categoria.nombre}
                </span>
              </div>
              <span
                className={`inline-flex items-center justify-center h-6 min-w-[24px] rounded-full ${categoria.color.bg} ${categoria.color.text} text-xs font-bold`}
              >
                {count}
              </span>
            </div>
          );
        })}

        {otras > 0 && (
          <div className="flex items-center justify-between rounded-xl border border-(--color-border) bg-(--color-surface-muted) px-3.5 py-3">
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-semibold text-(--color-ink)">Otras</span>
            </div>
            <span className="inline-flex items-center justify-center h-6 min-w-[24px] rounded-full bg-(--color-ink) text-white text-xs font-bold">
              {otras}
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
