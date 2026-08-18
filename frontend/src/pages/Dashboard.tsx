import { AlertCircle, Info } from "lucide-react";
import { ContentForm } from "../components/ContentForm";
import { AnalysisResult } from "../components/AnalysisResult";
import { JsonResponseViewer } from "../components/JsonResponseViewer";
import { ServiceStatus } from "../components/ServiceStatus";
import { apiBaseUrl } from "../api/client";
import type { AnalisisResultado, ContenidoInput, ServicioInfo } from "../types";

interface DashboardProps {
  resultado: AnalisisResultado | null;
  loading: boolean;
  error: string | null;
  onSubmit: (input: ContenidoInput) => void;
  backendActivo: boolean | null;
}

export function Dashboard({ resultado, loading, error, onSubmit, backendActivo }: DashboardProps) {
  const servicios: (ServicioInfo & { icono: "cloud" | "api" })[] = [
    {
      nombre: "Backend API",
      detalle:
        backendActivo === null
          ? "Verificando conexión..."
          : backendActivo
            ? `Conectado (${apiBaseUrl || "proxy /contenido"})`
            : "No se pudo contactar el backend",
      estado: backendActivo === null ? "inactivo" : backendActivo ? "conectado" : "error",
      icono: "api",
    },
    {
      nombre: "Almacenamiento",
      detalle: "Por definir",
      estado: "inactivo",
      icono: "cloud",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {error && (
        <div className="flex items-start gap-2 rounded-xl bg-(--color-coral-50) text-(--color-coral-600) px-4 py-3 text-sm">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <ContentForm onSubmit={onSubmit} loading={loading} />
        <AnalysisResult resultado={resultado} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <JsonResponseViewer resultado={resultado} />
        </div>
        <ServiceStatus servicios={servicios} />
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-(--color-brand-50) text-(--color-brand-600) px-4 py-3 text-sm">
        <Info size={16} className="shrink-0" />
        <p>
          Conectado al backend con modelo ML. Los resultados vienen del modelo de machine learning entrenado que analiza el contenido técnico en tiempo real.
        </p>
      </div>
    </div>
  );
}
