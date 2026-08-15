package com.techmind.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record MlPredictRequest(
        String titulo,
        String texto,
        @JsonProperty("top_n_palabras_clave")
        int topNPalabrasClave
) {
}
