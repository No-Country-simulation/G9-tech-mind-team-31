import { Clock3, History, Trash2 } from "lucide-react";
import type { AnalisisRegistro } from "../types";

interface HistorialProcesosProps {
  historial: AnalisisRegistro[];
  onSelectRegistro?: (registro: AnalisisRegistro) => void;
  onClearHistorial?: () => void;
}

/**
 * Componente compartido del bloque "Historial de procesos".
 * Extraído de ProcesarContenido.tsx para reutilizarlo en Dashboard.
 *
 * - Si onSelectRegistro no se pasa, los items no son clickeables (solo informativos).
 * - Si onClearHistorial no se pasa, el botón de limpiar no se muestra.
 */
export function HistorialProcesos({
  historial,
  onSelectRegistro,
  onClearHistorial,
}: HistorialProcesosProps) {
  const items = [...historial].reverse();

  return (
    <section aria-labelledby="historial-title" className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <History size={18} className="text-(--color-brand-600)" />
          <h2 id="historial-title" className="font-display text-base font-bold">
            Historial de procesos
          </h2>
          <span className="text-xs text-(--color-ink-faint)">({historial.length})</span>
        </div>
        {onClearHistorial && (
          <button
            type="button"
            onClick={onClearHistorial}
            disabled={historial.length === 0}
            className="flex items-center gap-1.5 text-xs font-medium text-(--color-coral-600) disabled:opacity-40"
          >
            <Trash2 size={14} />
            Limpiar historial
          </button>
        )}
      </div>

      {historial.length === 0 ? (
        <div className="border-y border-(--color-border) py-8 text-center text-sm text-(--color-ink-faint)">
          Los contenidos procesados aparecerán aquí.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {items.map((registro) => (
            <button
              key={registro.id}
              type="button"
              onClick={onSelectRegistro ? () => onSelectRegistro(registro) : undefined}
              disabled={!onSelectRegistro}
              className={`rounded-lg border border-(--color-border) bg-white p-4 text-left transition-colors ${
                onSelectRegistro
                  ? "hover:border-(--color-brand-300) hover:bg-(--color-brand-50)"
                  : "cursor-default opacity-70"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-(--color-ink)">
                    {registro.entrada.titulo}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-(--color-ink-faint)">
                    {registro.entrada.texto}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-(--color-brand-50) px-2.5 py-1 text-xs font-medium text-(--color-brand-600)">
                  {registro.resultado.categoria}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-(--color-ink-faint)">
                <span className="flex items-center gap-1">
                  <Clock3 size={13} />
                  {new Date(registro.procesadoEn).toLocaleString("es-CL")}
                </span>
                <span className="font-semibold text-(--color-mint-600)">
                  {Math.round(registro.resultado.probabilidad * 100)}% confianza
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
