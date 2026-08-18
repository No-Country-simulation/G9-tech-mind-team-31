import { useMemo } from "react";
import type { AnalisisRegistro } from "../types";
import { CATEGORIAS_FIJAS, NOMBRES_CATEGORIAS } from "../constants/categorias";

export interface CategoriaConteo {
  nombre: string;
  count: number;
}

export interface CategoriaStats {
  conteos: CategoriaConteo[];
  totalConsultas: number;
  otras: number;
}

/**
 * Hook puro que deriva estadísticas de categoría desde el historial.
 * Recibe el historial ya existente (proveniente de useContentAnalysis en App.tsx)
 * para evitar instancias duplicadas de estado de React.
 *
 * Las 5 categorías fijas siempre aparecen en el resultado (aunque su conteo sea 0).
 * Si el backend devuelve una categoría inesperada, se acumula en `otras`.
 */
export function useCategoriaStats(historial: AnalisisRegistro[]): CategoriaStats {
  return useMemo(() => {
    const inicial: Record<string, number> = {};
    for (const nombre of NOMBRES_CATEGORIAS) {
      inicial[nombre] = 0;
    }
    inicial["__otras__"] = 0;

    let total = 0;

    for (const registro of historial) {
      const categoria = registro.resultado.categoria;
      total++;

      if (categoria in inicial) {
        inicial[categoria]++;
      } else {
        inicial["__otras__"]++;
      }
    }

    const conteos = CATEGORIAS_FIJAS.map((c) => ({
      nombre: c.nombre,
      count: inicial[c.nombre],
    }));

    return {
      conteos,
      totalConsultas: total,
      otras: inicial["__otras__"],
    };
  }, [historial]);
}
