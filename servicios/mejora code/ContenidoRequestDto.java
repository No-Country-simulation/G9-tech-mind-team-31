package com.techmind.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO de entrada para el endpoint público POST /contenido.
 * Las reglas replican exactamente las de schemas.ContenidoEntrada en el
 * microservicio Python, para rechazar peticiones inválidas en el borde de
 * la API antes de gastar una llamada HTTP al servicio de ML.
 */
public record ContenidoRequestDto(

        @NotBlank(message = "El título no puede estar vacío")
        String titulo,

        @NotBlank(message = "El texto no puede estar vacío")
        @Size(min = 15, max = 5000, message = "El texto debe tener entre 15 y 5000 caracteres")
        String texto
) {}
