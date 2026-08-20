package com.techmind.api.exception;

/**
 * Se lanza cuando el microservicio de clasificación (Python) no está disponible,
 * rechaza la petición o responde con un error.
 * GlobalExceptionHandler debería mapear esta excepción a un 502/503 — no está
 * hecho todavía, ver nota aparte.
 */
public class MlServiceException extends RuntimeException {

    public MlServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}
