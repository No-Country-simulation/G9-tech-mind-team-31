import { AlertCircle, Info } from "lucide-react";
import { AnalysisResult } from "../components/AnalysisResult";
import { ContentForm } from "../components/ContentForm";
import { JsonResponseViewer } from "../components/JsonResponseViewer";
import { HistorialProcesos } from "../components/HistorialProcesos";
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

      <HistorialProcesos
        historial={historial}
        onSelectRegistro={onSelectRegistro}
        onClearHistorial={onClearHistorial}
      />

      <div className="flex items-center gap-2 rounded-xl bg-(--color-brand-50) px-4 py-3 text-sm text-(--color-brand-600)">
        <Info size={16} className="shrink-0" />
        <p>El historial se guarda únicamente en este navegador; todavía no existe una base de datos.</p>
      </div>
    </main>
  );
}
