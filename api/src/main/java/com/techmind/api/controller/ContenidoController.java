package com.techmind.api.controller;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.techmind.api.dto.ContenidoRequestDto; 
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@RestController
@RequestMapping("/contenido")
public class ContenidoController {

    @Value("${microservicio.url:http://localhost:8000/predecir}")
    private String microservicioUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping
    public ResponseEntity<ContenidoRespuesta> clasificarContenido(
           @Valid @RequestBody ContenidoRequestDto request) {

        // Llamamos al microservicio FastAPI de Python y obtenemos el resultado real
        ContenidoRespuesta respuesta = restTemplate.postForObject(
                microservicioUrl, 
                request, 
                ContenidoRespuesta.class
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