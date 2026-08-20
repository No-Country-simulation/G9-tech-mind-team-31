package DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Cuerpo de entrada de POST /contenido.
 * Ejemplo:
 * {
 *   "titulo": "Introducción a Spring Boot",
 *   "texto": "En este contenido se presentan los conceptos básicos..."
 * }
 */
public record ContenidoRequest(

        @Size(max = 300, message = "El título no puede superar los 300 caracteres.")
        String titulo,

        @NotBlank(message = "El campo 'texto' es obligatorio y no puede estar vacío.")
        @Size(max = 20000, message = "El texto no puede superar los 20000 caracteres.")
        String texto
) {
}