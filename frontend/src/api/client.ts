import type {
  AnalisisResultado,
  BackendResultadoCrudo,
  ContenidoInput,
  ContenidoRelacionado,
} from "../types";

// Vacío por defecto: las peticiones quedan relativas al origen del dashboard
// y las resuelve el proxy de Vite (ver vite.config.ts), evitando problemas
// de CORS durante el desarrollo local.
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function normalizarListaStrings(value: unknown): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : String(item).trim()))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizarRelacionados(value: unknown): ContenidoRelacionado[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;

      const entry = item as Record<string, unknown>;
      const id = typeof entry.id === "string" ? entry.id : String(entry.id ?? crypto.randomUUID());
      const titulo = typeof entry.titulo === "string" ? entry.titulo : String(entry.titulo ?? "Contenido relacionado");
      const similitudRaw = Number(entry.similitud ?? entry.score ?? entry.confianza ?? 0);
      const similitud = Number.isFinite(similitudRaw) ? Math.min(Math.max(similitudRaw, 0), 1) : 0;

      return { id, titulo, similitud };
    })
    .filter((item): item is ContenidoRelacionado => item !== null);
}

function normalizarResultadoCrudo(payload: BackendResultadoCrudo): AnalisisResultado {
  const categoria =
    [payload.categoria, payload.categoria_clasificada, payload.nombre_categoria].find(
      (valor): valor is string => typeof valor === "string" && valor.trim().length > 0,
    ) ?? "Sin categoría";

  const probabilidadRaw = Number(
    payload.probabilidad ?? payload.score ?? payload.confianza ?? 0,
  );
  const probabilidad = Number.isFinite(probabilidadRaw)
    ? Math.min(Math.max(probabilidadRaw, 0), 1)
    : 0;

  const palabrasClave = normalizarListaStrings(
    payload.informaciones_adicionales ??
      payload.informacionesAdicionales ??
      payload.informacion_adicional ??
      payload.palabras_clave ??
      payload.palabrasClave ??
      payload.keywords,
  );

  const contenidosRelacionados = normalizarRelacionados(
    payload.contenidos_relacionados ?? payload.contenidosRelacionados,
  );

  return {
    categoria,
    probabilidad,
    informaciones_adicionales: palabrasClave,
    ...(contenidosRelacionados.length > 0 ? { contenidos_relacionados: contenidosRelacionados } : {}),
  };
}

/**
 * Envía un contenido técnico al microservicio FastAPI para su clasificación.
 * Acepta distintos nombres de campo para mantener compatibilidad con respuestas
 * que pueden devolver `informaciones_adicionales` o `palabras_clave`.
 */
export async function analizarContenido(
  input: ContenidoInput,
  signal?: AbortSignal
): Promise<AnalisisResultado> {
  const response = await fetch(`${BASE_URL}/contenido`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    signal,
  });

  if (!response.ok) {
    let detail = response.statusText || "No se pudo procesar el contenido.";
    try {
      const body = await response.json();
      detail =
        body?.detail ??
        body?.message ??
        body?.error ??
        body?.mensaje ??
        body?.errorMessage ??
        detail;
    } catch {
      // el cuerpo no era JSON, seguimos con el statusText
    }
    throw new ApiError(detail, response.status);
  }

  const payload = (await response.json()) as BackendResultadoCrudo & { resultado?: BackendResultadoCrudo };
  const resultadoFinal = payload?.resultado ?? payload;
  return normalizarResultadoCrudo(resultadoFinal);
}

/**
 * Comprueba si el backend configurado está disponible.
 * Spring expone `/contenido` solo para POST, por lo que un 405 confirma
 * que el servidor está accesible aunque el método de salud sea GET.
 */
export async function chequearSalud(path = "/docs"): Promise<boolean> {
  const rutas = Array.from(new Set([path, "/contenido", "/docs", "/openapi.json"]));

  for (const ruta of rutas) {
    try {
      const response = await fetch(`${BASE_URL}${ruta}`, { method: "GET" });
      if (response.ok || response.status === 405) return true;
    } catch {
      // continúa probando rutas alternativas
    }
  }

  return false;
}

export const apiBaseUrl = BASE_URL;
