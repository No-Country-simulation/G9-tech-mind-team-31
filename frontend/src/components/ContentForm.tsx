import { useState } from "react";
import { FileText, Sparkles, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import type { ContenidoInput } from "../types";

const MAX_CHARS = 5000;
const MIN_CHARS = 15;

interface ContentFormProps {
  onSubmit: (input: ContenidoInput) => void;
  loading: boolean;
}

export function ContentForm({ onSubmit, loading }: ContentFormProps) {
  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");

  const textoValido = texto.trim().length >= MIN_CHARS;
  const tituloValido = titulo.trim().length > 0;
  const puedeEnviar = tituloValido && textoValido && !loading;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!puedeEnviar) return;
    onSubmit({ titulo: titulo.trim(), texto: texto.trim() });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white border border-(--color-border) p-5 shadow-sm shadow-black/[0.02]"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="grid place-items-center h-8 w-8 rounded-lg bg-(--color-brand-50) text-(--color-brand-600)">
          <FileText size={16} />
        </div>
        <h2 className="font-display font-bold text-base">Nuevo contenido</h2>
      </div>

      <label className="block text-sm font-medium text-(--color-ink-soft) mb-1.5">
        Título
      </label>
      <input
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Ej: Guía para crear una API REST con Spring Boot"
        className="w-full rounded-xl border border-(--color-border) px-3.5 py-2.5 text-sm mb-4 outline-none focus:border-(--color-brand-500) focus:ring-2 focus:ring-(--color-brand-100) transition-shadow"
      />

      <label className="block text-sm font-medium text-(--color-ink-soft) mb-1.5">
        Texto técnico
      </label>
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value.slice(0, MAX_CHARS))}
        rows={7}
        placeholder="Pega aquí la documentación, tutorial o material que quieres organizar…"
        className="w-full resize-none rounded-xl border border-(--color-border) px-3.5 py-2.5 text-sm outline-none focus:border-(--color-brand-500) focus:ring-2 focus:ring-(--color-brand-100) transition-shadow"
      />
      <div className="flex items-center justify-between mt-1.5 mb-4">
        <p className="text-xs text-(--color-ink-faint)">
          {texto.length} / {MAX_CHARS} caracteres
        </p>
        <div className="flex items-center gap-1.5">
          {textoValido ? (
            <>
              <CheckCircle size={14} className="text-(--color-success-500)" />
              <span className="text-xs text-(--color-success-600)">Texto válido</span>
            </>
          ) : (
            <>
              <AlertCircle size={14} className="text-(--color-coral-500)" />
              <span className="text-xs text-(--color-coral-600)">Mínimo {MIN_CHARS} caracteres</span>
            </>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={!puedeEnviar}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-(--color-brand-500) py-2.5 text-sm font-semibold text-white transition-colors hover:bg-(--color-brand-600) disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Procesando…
          </>
        ) : (
          <>
            <Sparkles size={16} />
            Procesar contenido
          </>
        )}
      </button>
    </form>
  );
}
