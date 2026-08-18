import { Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { Dashboard } from "./pages/Dashboard";
import { ProcesarContenido } from "./pages/ProcesarContenido";
import { useContentAnalysis } from "./hooks/useContentAnalysis";
import { useBackendStatus } from "./hooks/useBackendStatus";

function App() {
  const {
    resultado,
    loading,
    error,
    historial,
    procesar,
    seleccionarRegistro,
    limpiarHistorial,
  } = useContentAnalysis();
  const backendActivo = useBackendStatus();

  const categoriasUnicas = new Set(historial.map((r) => r.resultado.categoria));
  const precisionPromedio = historial.length
    ? historial.reduce((acc, r) => acc + r.resultado.probabilidad, 0) / historial.length
    : 0;

  const resumen = {
    contenidosProcesados: historial.length,
    categoriasDetectadas: categoriasUnicas.size,
    precisionPromedio,
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-(--color-bg)">
      <Sidebar resumen={resumen} />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <Header online={backendActivo === true} />
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                error={error}
                backendActivo={backendActivo}
                historial={historial}
                limpiarHistorial={limpiarHistorial}
              />
            }
          />
          <Route
            path="/procesar"
            element={
              <ProcesarContenido
                resultado={resultado}
                loading={loading}
                error={error}
                onSubmit={procesar}
                historial={historial}
                onSelectRegistro={seleccionarRegistro}
                onClearHistorial={limpiarHistorial}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
