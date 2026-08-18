import { AlertCircle, Info } from "lucide-react";
import { JsonResponseViewer } from "../components/JsonResponseViewer";
import { ServiceStatus } from "../components/ServiceStatus";
import { CategoriaStatsPanel } from "../components/CategoriaStatsPanel";
import { MetricasPanel } from "../components/MetricasPanel";
import { HistorialProcesos } from "../components/HistorialProcesos";
import { useCategoriaStats } from "../hooks/useCategoriaStats";
import { apiBaseUrl } from "../api/client";
import type { AnalisisRegistro, ServicioInfo } from "../types";

// Ejemplo estático de referencia del formato de respuesta del modelo.
// NO es un resultado real — ilustra la estructura JSON que devuelve
// POST /predecir (categoria, probabilidad, informaciones_adicionales).
const EJEMPLO_RESPUESTA_JSON = {
  categoria: "Backend",
  probabilidad: 0.87,
  informaciones_adicionales: ["spring boot", "spring", "boot"],
};

interface DashboardProps {
  error: string | null;
  backendActivo: boolean | null;
  historial: AnalisisRegistro[];
  limpiarHistorial: () => void;
}

export function Dashboard({ error, backendActivo, historial, limpiarHistorial }: DashboardProps) {
  const stats = useCategoriaStats(historial);

  const servicios: (ServicioInfo & { icono: "cloud" | "api" })[] = [
    {
       nombre: "Servicio ML",
      detalle:
        backendActivo === null
          ? "Verificando conexión..."
          : backendActivo
            ? `Servicio activo (${apiBaseUrl || "proxy /predecir"})`
            : "Servicio sin conexión",
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <CategoriaStatsPanel conteos={stats.conteos} otras={stats.otras} />
        <MetricasPanel stats={stats} historial={historial} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <JsonResponseViewer resultado={EJEMPLO_RESPUESTA_JSON} />
        </div>
        <ServiceStatus servicios={servicios} />
      </div>

      <HistorialProcesos
        historial={historial}
        onClearHistorial={limpiarHistorial}
      />

      <div className="flex items-center gap-2 rounded-xl bg-(--color-brand-50) text-(--color-brand-600) px-4 py-3 text-sm">
        <Info size={16} className="shrink-0" />
        <p>
          Conectado al backend con modelo ML. Los resultados vienen del modelo de machine learning entrenado que analiza el contenido técnico en tiempo real.
        </p>
      </div>
    </div>
  );
}
