import { Server, ShieldCheck, BarChart3, LayoutDashboard, Brain } from "lucide-react";
import type { ComponentType } from "react";

export interface CategoriaInfo {
  nombre: string;
  color: {
    bg: string;
    text: string;
    border: string;
  };
  icono: ComponentType<{ size?: number }>;
}

// Las 5 categorías son FIJAS y CERRADAS. El nombre debe coincidir
// exactamente (byte-perfecto) con lo que devuelve el modelo (dataset.csv):
//   "Data Science" (no "Ciencia de Datos")
//   "Inteligencia artificial" (minúscula, no "Inteligencia Artificial")
export const CATEGORIAS_FIJAS: CategoriaInfo[] = [
  {
    nombre: "Backend",
    color: {
      bg: "bg-(--color-brand-50)",
      text: "text-(--color-brand-600)",
      border: "border-(--color-brand-100)",
    },
    icono: Server,
  },
  {
    nombre: "Ciberseguridad",
    color: {
      bg: "bg-(--color-coral-50)",
      text: "text-(--color-coral-600)",
      border: "border-(--color-coral-50)",
    },
    icono: ShieldCheck,
  },
  {
    nombre: "Data Science",
    color: {
      bg: "bg-(--color-mint-50)",
      text: "text-(--color-mint-600)",
      border: "border-(--color-mint-50)",
    },
    icono: BarChart3,
  },
  {
    nombre: "Frontend",
    color: {
      bg: "bg-sky-50",
      text: "text-sky-600",
      border: "border-sky-100",
    },
    icono: LayoutDashboard,
  },
  {
    nombre: "Inteligencia artificial",
    color: {
      bg: "bg-(--color-amber-50)",
      text: "text-(--color-amber-500)",
      border: "border-(--color-amber-50)",
    },
    icono: Brain,
  },
];

export const NOMBRES_CATEGORIAS = CATEGORIAS_FIJAS.map((c) => c.nombre);
