package com.techmind.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record MlPredictResponse(
        String categoria,
        double probabilidad,
        @JsonProperty("informaciones_adicionales")
        List<String> informacionesAdicionales
) {
}