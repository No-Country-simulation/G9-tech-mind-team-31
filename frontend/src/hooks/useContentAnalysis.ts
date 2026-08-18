import { useState } from "react";
import { analizarContenido, ApiError } from "../api/client";
import type { AnalisisRegistro, AnalisisResultado, ContenidoInput } from "../types";

const HISTORIAL_KEY = "techmind:historial";

interface State {
  resultado: AnalisisResultado | null;
  loading: boolean;
  error: string | null;
  historial: AnalisisRegistro[];
}

function cargarHistorial(): AnalisisRegistro[] {
  try {
    const historialGuardado = localStorage.getItem(HISTORIAL_KEY);
    return historialGuardado ? JSON.parse(historialGuardado) : [];
  } catch {
    return [];
  }
}

export function useContentAnalysis() {
  const [state, setState] = useState<State>(() => {
    const historial = cargarHistorial();
    return {
      resultado: historial.at(-1)?.resultado ?? null,
      loading: false,
      error: null,
      historial,
    };
  });

  async function procesar(input: ContenidoInput) {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const resultado = await analizarContenido(input);
      const registro: AnalisisRegistro = {
        id: crypto.randomUUID(),
        entrada: input,
        resultado,
        procesadoEn: new Date().toISOString(),
      };
      setState((s) => ({
        resultado,
        loading: false,
        error: null,
        historial: guardarHistorial([...s.historial, registro]),
      }));
    } catch (err) {
      const mensaje =
        err instanceof ApiError
          ? err.message
          : "No se pudo procesar el contenido. Intenta nuevamente.";
      setState((s) => ({
        ...s,
        loading: false,
        error: mensaje,
      }));
    }
  }

  function seleccionarRegistro(registro: AnalisisRegistro) {
    setState((s) => ({ ...s, resultado: registro.resultado, error: null }));
  }

  function limpiarHistorial() {
    localStorage.removeItem(HISTORIAL_KEY);
    setState((s) => ({ ...s, resultado: null, historial: [] }));
  }

  return { ...state, procesar, seleccionarRegistro, limpiarHistorial };
}

function guardarHistorial(historial: AnalisisRegistro[]) {
  // Conserva solo los últimos 50 análisis para limitar el almacenamiento del navegador.
  const historialLimitado = historial.slice(-50);
  localStorage.setItem(HISTORIAL_KEY, JSON.stringify(historialLimitado));
  return historialLimitado;
}
