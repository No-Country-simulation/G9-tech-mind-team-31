import { AlertCircle, Clock3, History, Info, Trash2 } from "lucide-react";
import { AnalysisResult } from "../components/AnalysisResult";
import { ContentForm } from "../components/ContentForm";
import { JsonResponseViewer } from "../components/JsonResponseViewer";
import type { AnalisisRegistro, AnalisisResultado, ContenidoInput } from "../types";

interface ProcesarContenidoProps {
  resultado: AnalisisResultado | null;
  loading: boolean;
  error: string | null;
  onSubmit: (input: ContenidoInput) => void;
  historial: AnalisisRegistro[];
  onSelectRegistro: (registro: AnalisisRegistro) => void;
  onClearHistorial: () => void;
}

export function ProcesarContenido({
  resultado,
  loading,
  error,
  onSubmit,
  historial,
  onSelectRegistro,
  onClearHistorial,
}: ProcesarContenidoProps) {
  return (
    <main className="p-6 space-y-6">
      <header>
        <h2 className="font-display text-xl font-bold">Procesar contenido</h2>
        <p className="mt-1 text-sm text-(--color-ink-faint)">
          Analiza contenido técnico y obtén su categoría, confianza y palabras clave.
        </p>
      </header>

      {error && (
        <div className="flex items-start gap-2 rounded-xl bg-(--color-coral-50) px-4 py-3 text-sm text-(--color-coral-600)">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <ContentForm onSubmit={onSubmit} loading={loading} />
        <AnalysisResult resultado={resultado} />
      </div>

      <JsonResponseViewer resultado={resultado} />

      <section aria-labelledby="historial-title" className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <History size={18} className="text-(--color-brand-600)" />
            <h2 id="historial-title" className="font-display text-base font-bold">
              Historial de procesos
            </h2>
            <span className="text-xs text-(--color-ink-faint)">({historial.length})</span>
          </div>
          <button
            type="button"
            onClick={onClearHistorial}
            disabled={historial.length === 0}
            className="flex items-center gap-1.5 text-xs font-medium text-(--color-coral-600) disabled:opacity-40"
          >
            <Trash2 size={14} />
            Limpiar historial
          </button>
        </div>

        {historial.length === 0 ? (
          <div className="border-y border-(--color-border) py-8 text-center text-sm text-(--color-ink-faint)">
            Los contenidos procesados aparecerán aquí.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {[...historial].reverse().map((registro) => (
              <button
                key={registro.id}
                type="button"
                onClick={() => onSelectRegistro(registro)}
                className="rounded-lg border border-(--color-border) bg-white p-4 text-left transition-colors hover:border-(--color-brand-300) hover:bg-(--color-brand-50)"
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

      <div className="flex items-center gap-2 rounded-xl bg-(--color-brand-50) px-4 py-3 text-sm text-(--color-brand-600)">
        <Info size={16} className="shrink-0" />
        <p>El historial se guarda únicamente en este navegador; todavía no existe una base de datos.</p>
      </div>
    </main>
  );
}
