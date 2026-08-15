package com.techmind.api.controller;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.techmind.api.dto.ContenidoRequestDto; 
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
//import java.util.Map;

@RestController
@RequestMapping("/contenido")
public class ContenidoController {

    @PostMapping
    public ResponseEntity<ContenidoRespuesta> clasificarContenido(
           @Valid @RequestBody ContenidoRequestDto request) {

        ContenidoRespuesta respuesta = new ContenidoRespuesta(
                "Backend",
                0.89,
                List.of("Java", "Spring Boot", "API REST")
        );

        return ResponseEntity.ok(respuesta);
    }

    public record ContenidoRespuesta(
            String categoria,
            double probabilidad,
            @JsonProperty("informaciones_adicionales")
            List<String> informacionesAdicionales
    ) {
    }
}