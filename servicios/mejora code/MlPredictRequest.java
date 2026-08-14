package com.techmind.api.dto;

/**
 * Payload enviado al microservicio Python (FastAPI) en POST /predecir.
 * Debe coincidir exactamente con schemas.ContenidoEntrada (titulo, texto).
 */
public record MlPredictRequest(
        String titulo,
        String texto
) {}
