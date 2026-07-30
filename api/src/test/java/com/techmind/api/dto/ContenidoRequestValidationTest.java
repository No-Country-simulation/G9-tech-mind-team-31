package com.techmind.api.dto;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class ContenidoRequestValidationTest {

    private static Validator validator;

    @BeforeAll
    static void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void deberiaValidarCorrectamenteConTituloYTextoValidos() {
        ContenidoRequest request = new ContenidoRequest("Título válido", "Texto de contenido válido con suficiente longitud.");
        Set<ConstraintViolation<ContenidoRequest>> violations = validator.validate(request);
        assertTrue(violations.isEmpty(), "No debería haber violaciones para una request válida");
    }

    @Test
    void deberiaRechazarTextoVacio() {
        ContenidoRequest request = new ContenidoRequest("Título", "");
        Set<ConstraintViolation<ContenidoRequest>> violations = validator.validate(request);
        assertEquals(1, violations.size());
        assertTrue(violations.iterator().next().getMessage().contains("obligatorio"));
    }

    @Test
    void deberiaRechazarTextoNull() {
        ContenidoRequest request = new ContenidoRequest("Título", null);
        Set<ConstraintViolation<ContenidoRequest>> violations = validator.validate(request);
        assertEquals(1, violations.size());
        assertTrue(violations.iterator().next().getMessage().contains("obligatorio"));
    }

    @Test
    void deberiaRechazarTextoSoloEspacios() {
        ContenidoRequest request = new ContenidoRequest("Título", "   ");
        Set<ConstraintViolation<ContenidoRequest>> violations = validator.validate(request);
        assertEquals(1, violations.size());
        assertTrue(violations.iterator().next().getMessage().contains("obligatorio"));
    }

    @Test
    void deberiaRechazarTextoMuyLargo() {
        String textoLargo = "a".repeat(20001);
        ContenidoRequest request = new ContenidoRequest("Título", textoLargo);
        Set<ConstraintViolation<ContenidoRequest>> violations = validator.validate(request);
        assertEquals(1, violations.size());
        assertTrue(violations.iterator().next().getMessage().contains("20000"));
    }

    @Test
    void deberiaAceptarTextoExactamente20000Caracteres() {
        String textoExacto = "a".repeat(20000);
        ContenidoRequest request = new ContenidoRequest("Título", textoExacto);
        Set<ConstraintViolation<ContenidoRequest>> violations = validator.validate(request);
        assertTrue(violations.isEmpty());
    }

    @Test
    void deberiaRechazarTituloMuyLargo() {
        String tituloLargo = "a".repeat(301);
        ContenidoRequest request = new ContenidoRequest(tituloLargo, "Texto válido");
        Set<ConstraintViolation<ContenidoRequest>> violations = validator.validate(request);
        assertEquals(1, violations.size());
        assertTrue(violations.iterator().next().getMessage().contains("300"));
    }

    @Test
    void deberiaAceptarTituloExactamente300Caracteres() {
        String tituloExacto = "a".repeat(300);
        ContenidoRequest request = new ContenidoRequest(tituloExacto, "Texto válido");
        Set<ConstraintViolation<ContenidoRequest>> violations = validator.validate(request);
        assertTrue(violations.isEmpty());
    }

    @Test
    void deberiaAceptarTituloNull() {
        ContenidoRequest request = new ContenidoRequest(null, "Texto válido");
        Set<ConstraintViolation<ContenidoRequest>> violations = validator.validate(request);
        assertTrue(violations.isEmpty(), "El título es opcional (null permitido)");
    }

    @Test
    void deberiaRechazarAmbosCamposInvalidos() {
        ContenidoRequest request = new ContenidoRequest("a".repeat(301), "");
        Set<ConstraintViolation<ContenidoRequest>> violations = validator.validate(request);
        assertEquals(2, violations.size());
    }
}