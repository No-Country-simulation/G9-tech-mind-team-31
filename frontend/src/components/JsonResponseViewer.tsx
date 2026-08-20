import { useState } from "react";
import { Braces, Copy, Check } from "lucide-react";
import type { AnalisisResultado } from "../types";

interface JsonResponseViewerProps {
  resultado: AnalisisResultado | null;
}

export function JsonResponseViewer({ resultado }: JsonResponseViewerProps) {
  const [copiado, setCopiado] = useState(false);
  const json = resultado ? JSON.stringify(resultado, null, 2) : null;

  async function copiar() {
    if (!json) return;
    await navigator.clipboard.writeText(json);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1500);
  }

  return (
    <div className="rounded-2xl bg-white border border-(--color-border) p-5 shadow-sm shadow-black/[0.02]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="grid place-items-center h-8 w-8 rounded-lg bg-(--color-brand-50) text-(--color-brand-600)">
            <Braces size={16} />
          </div>
          <h2 className="font-display font-bold text-base">Respuesta JSON</h2>
        </div>
        <button
          onClick={copiar}
          disabled={!json}
          className="flex items-center gap-1.5 rounded-lg border border-(--color-border) px-2.5 py-1.5 text-xs font-medium text-(--color-ink-soft) hover:bg-(--color-surface-muted) disabled:opacity-40"
        >
          {copiado ? <Check size={14} /> : <Copy size={14} />}
          {copiado ? "Copiado" : "Copiar"}
        </button>
      </div>

      <pre className="rounded-xl bg-(--color-ink) text-(--color-mint-50) text-xs font-mono p-4 overflow-x-auto leading-relaxed min-h-[120px]">
        {json ?? "// Procesa un contenido para ver la respuesta aquí"}
      </pre>
    </div>
  );
}
