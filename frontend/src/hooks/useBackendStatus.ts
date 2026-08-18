import { useEffect, useState } from "react";
import { chequearSalud } from "../api/client";

export function useBackendStatus(intervaloMs = 15000) {
  const [activo, setActivo] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelado = false;

    async function verificar() {
      const resultado = await chequearSalud();
      if (!cancelado) setActivo(resultado);
    }

    verificar();
    const intervalo = setInterval(verificar, intervaloMs);
    return () => {
      cancelado = true;
      clearInterval(intervalo);
    };
  }, [intervaloMs]);

  return activo;
}
