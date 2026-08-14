package DTO;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ContenidoRespuesta(

        String categoria,

        double probabilidad,

        @JsonProperty("informacion_adicional")
        List<String> informacionAdicional,

        Map<String, Double> probabilidades
) {
}
