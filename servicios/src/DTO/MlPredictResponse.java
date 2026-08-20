package com.techmind.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public record MlPredictResponse(
        String categoria,
        double probabilidad,
        Map<String, Double> probabilidades,
        @JsonProperty("palabras_clave")
        List<String> palabrasClave,
        @JsonProperty("texto_procesado")
        String textoProcesado
) {
}