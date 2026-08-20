package com.techmind.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * DTO de salida del endpoint público POST /contenido.
 * Es el contrato visible para quien consuma la API — no confundir con
 * MlPredictResponse, que es el contrato interno con el microservicio Python.
 */
public record ContenidoRespuesta(
        String categoria,
        double probabilidad,

        @JsonProperty("informaciones_adicionales")
        List<String> informacionesAdicionales
) {}
