package com.techmind.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * Respuesta recibida del microservicio Python (FastAPI) en POST /predecir.
 * Debe coincidir exactamente con schemas.ContenidoSalida
 * (categoria, probabilidad, informaciones_adicionales).
 */
public record MlPredictResponse(
        String categoria,
        double probabilidad,

        @JsonProperty("informaciones_adicionales")
        List<String> informacionesAdicionales
) {}
