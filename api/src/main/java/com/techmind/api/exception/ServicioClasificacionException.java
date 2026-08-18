package com.techmind.api.exception;

public class ServicioClasificacionException extends RuntimeException {
    public ServicioClasificacionException(String message) {
        super(message);
    }

    public ServicioClasificacionException(String message, Throwable cause) {
        super(message, cause);
    }
}