package com.techmind.api.controller;

import com.techmind.api.dto.ContenidoRequest;
import com.techmind.api.dto.ContenidoRespuesta;
import com.techmind.api.service.ClasificacionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/contenido")
public class ContenidoController {

        private final ClasificacionService clasificacionService;

        public ContenidoController(ClasificacionService clasificacionService) {
                this.clasificacionService = clasificacionService;
        }

    @PostMapping
    public ResponseEntity<ContenidoRespuesta> clasificarContenido(
                        @Valid @RequestBody ContenidoRequest contenido) {
                return ResponseEntity.ok(clasificacionService.clasificar(contenido));
    }

        @GetMapping("/health")
        public ResponseEntity<Boolean> health() {
                return ResponseEntity.ok(clasificacionService.estaDisponible());
    }
}