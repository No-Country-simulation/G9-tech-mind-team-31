package com.techmind.api.controller;

import com.techmind.api.dto.ContenidoEntrada;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class ContenidoControllerTest {

    @Test
    void shouldReturnBadRequestWhenContentIsBlank() {
        ContenidoController controller = new ContenidoController(new RestTemplate());

        ResponseEntity<ContenidoController.ContenidoRespuesta> response = controller.clasificarContenido(
                new ContenidoEntrada("   ", "   ")
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Error", response.getBody().categoria());
    }

    @Test
    void shouldReturnServiceUnavailableWhenFastApiIsDown() {
        ContenidoController controller = new ContenidoController(new RestTemplate() {
            @Override
            public <T> T postForObject(String url, Object request, Class<T> responseType, Object... uriVariables) {
                throw new ResourceAccessException("Connection refused");
            }
        });

        ResponseEntity<ContenidoController.ContenidoRespuesta> response = controller.clasificarContenido(
                new ContenidoEntrada("titulo", "texto valido")
        );

        assertEquals(HttpStatus.GATEWAY_TIMEOUT, response.getStatusCode());
    }

    @Test
    void shouldReturnGatewayTimeoutWhenFastApiTimesOut() {
        ContenidoController controller = new ContenidoController(new RestTemplate() {
            @Override
            public <T> T postForObject(String url, Object request, Class<T> responseType, Object... uriVariables) {
                throw new ResourceAccessException("Timeout");
            }
        });

        ResponseEntity<ContenidoController.ContenidoRespuesta> response = controller.clasificarContenido(
                new ContenidoEntrada("titulo", "texto valido")
        );

        assertEquals(HttpStatus.GATEWAY_TIMEOUT, response.getStatusCode());
    }
}
