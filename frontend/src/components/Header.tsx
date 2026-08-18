interface HeaderProps {
  online: boolean;
}

export function Header({ online }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-(--color-border) bg-white px-6 py-4">
      <div>
        <h1 className="font-display font-extrabold text-xl text-(--color-ink)">
          Organización inteligente de contenido técnico
        </h1>
        <p className="text-sm text-(--color-ink-faint)">
          Clasifica, etiqueta y conecta tu documentación en segundos
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-full border border-(--color-border) bg-(--color-surface-muted) px-3 py-1.5 text-xs font-medium">
        <span
          className={`h-2 w-2 rounded-full ${
            online ? "bg-(--color-mint-500)" : "bg-(--color-coral-500)"
          }`}
        />
        {online ? "Servicio activo" : "Servicio sin conexión"}
      </div>
    </header>
  );
}
