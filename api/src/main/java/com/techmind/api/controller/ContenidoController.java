package com.techmind.api.controller;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.techmind.api.dto.ContenidoEntrada;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@RestController
@RequestMapping("/contenido")
public class ContenidoController {

    private static final String FASTAPI_URL = "http://127.0.0.1:8000/predecir";
    private final RestTemplate restTemplate;

    public ContenidoController() {
        this(new RestTemplate(buildRequestFactory()));
    }

    public ContenidoController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    private static SimpleClientHttpRequestFactory buildRequestFactory() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(3000);
        factory.setReadTimeout(5000);
        return factory;
    }

    @PostMapping
    public ResponseEntity<ContenidoRespuesta> clasificarContenido(@Valid @RequestBody ContenidoEntrada contenido) {
        if (contenido == null || contenido.getTitulo() == null || contenido.getTexto() == null
                || contenido.getTitulo().isBlank() || contenido.getTexto().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new ContenidoRespuesta("Error", 0.0, List.of("El título y el texto no pueden estar vacíos.")));
        }

        try {
            ContenidoRespuesta respuesta = restTemplate.postForObject(
                    FASTAPI_URL,
                    contenido,
                    ContenidoRespuesta.class
            );

            if (respuesta == null) {
                return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                        .body(new ContenidoRespuesta("Error", 0.0, List.of("El microservicio no devolvió una respuesta válida.")));
            }

            return ResponseEntity.ok(respuesta);
        } catch (ResourceAccessException e) {
            return ResponseEntity.status(HttpStatus.GATEWAY_TIMEOUT)
                    .body(new ContenidoRespuesta("Error", 0.0, List.of("El microservicio tardó demasiado en responder.")));
        } catch (HttpStatusCodeException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(new ContenidoRespuesta("Error", 0.0, List.of("La clasificación falló en el microservicio.")));
        } catch (RestClientException e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(new ContenidoRespuesta("Error", 0.0, List.of("El microservicio de clasificación no está disponible.")));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ContenidoRespuesta("Error", 0.0, List.of("Error interno al procesar el contenido.")));
        }
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ContenidoRespuesta> manejarValidacion(MethodArgumentNotValidException exception) {
        String mensaje = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(FieldError::getDefaultMessage)
                .orElse("Datos inválidos");

        return ResponseEntity.badRequest()
                .body(new ContenidoRespuesta("Error", 0.0, List.of(mensaje)));
    }

    public record ContenidoRespuesta(
            String categoria,
            double probabilidad,
            @JsonProperty("informaciones_adicionales")
            List<String> informacionesAdicionales
    ) {
    }
}