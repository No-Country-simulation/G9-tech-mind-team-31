package com.techmind.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContenidoRequest(
        @NotBlank(message = "El título no puede estar vacío")
        String titulo,

        @NotBlank(message = "El texto no puede estar vacío")
        @Size(min = 15, max = 5000,
                message = "El texto debe tener entre 15 y 5000 caracteres")
        String texto
) {
}