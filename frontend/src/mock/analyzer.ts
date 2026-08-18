import type { AnalisisResultado } from "../types";

interface Regla {
  categoria: string;
  disparadores: string[];
  keywords: string[];
}

const REGLAS: Regla[] = [
  {
    categoria: "Backend",
    disparadores: ["api", "rest", "spring", "node", "django", "servidor", "endpoint", "base de datos", "sql"],
    keywords: ["API REST", "Backend", "Base de datos"],
  },
  {
    categoria: "Frontend",
    disparadores: ["react", "vite", "css", "html", "componente", "interfaz", "ui", "tailwind"],
    keywords: ["React", "UI/UX", "Componentes"],
  },
  {
    categoria: "Ciencia de Datos",
    disparadores: ["modelo", "clasificación", "machine learning", "dataset", "entrenamiento", "pandas", "scikit"],
    keywords: ["Machine Learning", "Python", "Modelado"],
  },
  {
    categoria: "Ciberseguridad",
    disparadores: ["seguridad", "vulnerabilidad", "autenticación", "cifrado", "ataque", "firewall"],
    keywords: ["Seguridad", "Autenticación"],
  },
  {
    categoria: "Inteligencia Artificial",
    disparadores: ["ia", "inteligencia artificial", "llm", "nlp", "transformer", "red neuronal"],
    keywords: ["IA", "NLP"],
  },
];

const CONTENIDOS_DEMO = [
  { id: "1", titulo: "Buenas prácticas de arquitectura backend" },
  { id: "2", titulo: "Guía rápida de componentes reutilizables" },
  { id: "3", titulo: "Introducción a modelos de clasificación" },
];

/**
 * Clasificador heurístico local. Sirve para probar el dashboard mientras
 * no está conectado el backend real (ver src/api/client.ts).
 */
export function analizarContenidoMock(titulo: string, texto: string): Promise<AnalisisResultado> {
  const contenido = `${titulo} ${texto}`.toLowerCase();

  let mejorRegla = REGLAS[0];
  let mejorScore = 0;

  for (const regla of REGLAS) {
    const score = regla.disparadores.filter((d) => contenido.includes(d)).length;
    if (score > mejorScore) {
      mejorScore = score;
      mejorRegla = regla;
    }
  }

  const probabilidad = mejorScore > 0 ? Math.min(0.75 + mejorScore * 0.05, 0.97) : 0.55;

  const resultado: AnalisisResultado = {
    categoria: mejorRegla.categoria,
    probabilidad,
    informaciones_adicionales: mejorRegla.keywords,
    contenidos_relacionados: CONTENIDOS_DEMO.map((c, i) => ({
      ...c,
      similitud: 0.9 - i * 0.06,
    })),
  };

  // simulamos latencia de red
  return new Promise((resolve) => setTimeout(() => resolve(resultado), 700));
}
