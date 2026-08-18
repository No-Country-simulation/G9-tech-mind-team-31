export interface ContenidoInput {
  titulo: string;
  texto: string;
}

export interface ContenidoRelacionado {
  id: string;
  titulo: string;
  similitud: number; // 0-1
}

export interface AnalisisResultado {
  categoria: string;
  probabilidad: number; // 0-1
  informaciones_adicionales: string[];
  contenidos_relacionados?: ContenidoRelacionado[];
}

export interface BackendResultadoCrudo {
  categoria?: string;
  categoria_clasificada?: string;
  nombre_categoria?: string;
  probabilidad?: number;
  score?: number;
  confianza?: number;
  informaciones_adicionales?: unknown;
  informacionesAdicionales?: unknown;
  informacion_adicional?: unknown;
  palabras_clave?: unknown;
  palabrasClave?: unknown;
  keywords?: unknown;
  contenidos_relacionados?: unknown;
  contenidosRelacionados?: unknown;
}

export interface AnalisisRegistro {
  id: string;
  entrada: ContenidoInput;
  resultado: AnalisisResultado;
  procesadoEn: string;
}

export interface ResumenStats {
  contenidosProcesados: number;
  categoriasDetectadas: number;
  precisionPromedio: number; // 0-1
}

export type EstadoServicio = "conectado" | "activo" | "inactivo" | "error";

export interface ServicioInfo {
  nombre: string;
  detalle: string;
  estado: EstadoServicio;
}
