package com.techmind.api.exception;

import java.time.LocalDateTime;

public record ErrorResponseDto(
        int status,
        String error,
        String mensaje,
        LocalDateTime timestamp
) {}