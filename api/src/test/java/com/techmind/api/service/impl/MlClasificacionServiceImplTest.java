package com.techmind.api.service.impl;

import com.techmind.api.dto.ContenidoRequest;
import com.techmind.api.dto.ContenidoRespuesta;
import com.techmind.api.dto.MlPredictRequest;
import com.techmind.api.dto.MlPredictResponse;
import com.techmind.api.exception.ServicioClasificacionException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MlClasificacionServiceImplTest {

    @Mock
    private RestClient mlServiceRestClient;

    @Mock
    private RestClient.RequestBodyUriSpec requestBodyUriSpec;

    @Mock
    private RestClient.RequestBodySpec requestBodySpec;

    @Mock
    private RestClient.ResponseSpec responseSpec;

    @Mock
    private RestClient.RequestHeadersUriSpec requestHeadersUriSpec;

    @Mock
    private RestClient.RequestHeadersSpec requestHeadersSpec;

    private MlClasificacionServiceImpl service;

    @BeforeEach
    void setUp() {
        service = new MlClasificacionServiceImpl(mlServiceRestClient);
    }

    @Test
    void deberiaClasificarCorrectamenteCuandoServicioRespondeOk() {
        ContenidoRequest request = new ContenidoRequest("Título de prueba", "Texto de prueba para clasificar");
        MlPredictResponse mlResponse = new MlPredictResponse(
                "tecnologia", 0.95, Map.of("tecnologia", 0.95, "ciencia", 0.05),
                List.of("prueba", "clasificar", "tecnologia"), "texto procesado"
        );

        when(mlServiceRestClient.post()).thenReturn(requestBodyUriSpec);
        when(requestBodyUriSpec.uri("/predict")).thenReturn(requestBodySpec);
        when(requestBodySpec.body(any(MlPredictRequest.class))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.body(MlPredictResponse.class)).thenReturn(mlResponse);

        ContenidoRespuesta respuesta = service.clasificar(request);

        assertThat(respuesta).isNotNull();
        assertThat(respuesta.categoria()).isEqualTo("tecnologia");
        assertThat(respuesta.probabilidad()).isEqualTo(0.95);
        assertThat(respuesta.informacionAdicional()).containsExactly("prueba", "clasificar", "tecnologia");
        assertThat(respuesta.probabilidades()).containsEntry("tecnologia", 0.95);

        ArgumentCaptor<MlPredictRequest> captor = ArgumentCaptor.forClass(MlPredictRequest.class);
        verify(requestBodySpec).body(captor.capture());
        MlPredictRequest capturedRequest = captor.getValue();
        assertThat(capturedRequest.titulo()).isEqualTo("Título de prueba");
        assertThat(capturedRequest.texto()).isEqualTo("Texto de prueba para clasificar");
        assertThat(capturedRequest.topNPalabrasClave()).isEqualTo(5);
    }

    @Test
    void deberiaLanzarExcepcionCuandoServicioMlRespondeError4xx() {
        ContenidoRequest request = new ContenidoRequest("Título", "Texto");
        RestClientResponseException ex = mock(RestClientResponseException.class);
        when(ex.getStatusCode()).thenReturn(HttpStatus.BAD_REQUEST);
        when(ex.getResponseBodyAsString()).thenReturn("Error de validación");

        when(mlServiceRestClient.post()).thenReturn(requestBodyUriSpec);
        when(requestBodyUriSpec.uri("/predict")).thenReturn(requestBodySpec);
        when(requestBodySpec.body(any(MlPredictRequest.class))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.body(MlPredictResponse.class)).thenThrow(ex);

        assertThatThrownBy(() -> service.clasificar(request))
                .isInstanceOf(ServicioClasificacionException.class)
                .hasMessageContaining("400")
                .hasMessageContaining("Error de validación");
    }

    @Test
    void deberiaLanzarExcepcionCuandoServicioMlRespondeError5xx() {
        ContenidoRequest request = new ContenidoRequest("Título", "Texto");
        RestClientResponseException ex = mock(RestClientResponseException.class);
        when(ex.getStatusCode()).thenReturn(HttpStatus.INTERNAL_SERVER_ERROR);
        when(ex.getResponseBodyAsString()).thenReturn("Error interno");

        when(mlServiceRestClient.post()).thenReturn(requestBodyUriSpec);
        when(requestBodyUriSpec.uri("/predict")).thenReturn(requestBodySpec);
        when(requestBodySpec.body(any(MlPredictRequest.class))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.body(MlPredictResponse.class)).thenThrow(ex);

        assertThatThrownBy(() -> service.clasificar(request))
                .isInstanceOf(ServicioClasificacionException.class)
                .hasMessageContaining("500");
    }

    @Test
    void deberiaLanzarExcepcionCuandoNoSePuedeContactarServicioMl() {
        ContenidoRequest request = new ContenidoRequest("Título", "Texto");
        ResourceAccessException ex = new ResourceAccessException("Connection refused");

        when(mlServiceRestClient.post()).thenReturn(requestBodyUriSpec);
        when(requestBodyUriSpec.uri("/predict")).thenReturn(requestBodySpec);
        when(requestBodySpec.body(any(MlPredictRequest.class))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.body(MlPredictResponse.class)).thenThrow(ex);

        assertThatThrownBy(() -> service.clasificar(request))
                .isInstanceOf(ServicioClasificacionException.class)
                .hasMessageContaining("No se pudo contactar al servicio de clasificación");
    }

    @Test
    void deberiaLanzarExcepcionCuandoServicioMlDevuelveNull() {
        ContenidoRequest request = new ContenidoRequest("Título", "Texto");

        when(mlServiceRestClient.post()).thenReturn(requestBodyUriSpec);
        when(requestBodyUriSpec.uri("/predict")).thenReturn(requestBodySpec);
        when(requestBodySpec.body(any(MlPredictRequest.class))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.body(MlPredictResponse.class)).thenReturn(null);

        assertThatThrownBy(() -> service.clasificar(request))
                .isInstanceOf(ServicioClasificacionException.class)
                .hasMessageContaining("respuesta vacía");
    }

    @Test
    void deberiaRetornarTrueCuandoHealthCheckIndicaModeloCargado() {
        Map<String, Object> salud = Map.of("modelo_cargado", true);

        when(mlServiceRestClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri("/health")).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.body(Map.class)).thenReturn(salud);

        boolean disponible = service.estaDisponible();

        assertThat(disponible).isTrue();
    }

    @Test
    void deberiaRetornarFalseCuandoHealthCheckIndicaModeloNoCargado() {
        Map<String, Object> salud = Map.of("modelo_cargado", false);

        when(mlServiceRestClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri("/health")).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.body(Map.class)).thenReturn(salud);

        boolean disponible = service.estaDisponible();

        assertThat(disponible).isFalse();
    }

    @Test
    void deberiaRetornarFalseCuandoHealthCheckDevuelveNull() {
        when(mlServiceRestClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri("/health")).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.body(Map.class)).thenReturn(null);

        boolean disponible = service.estaDisponible();

        assertThat(disponible).isFalse();
    }

    @Test
    void deberiaRetornarFalseCuandoHealthCheckLanzaExcepcion() {
        when(mlServiceRestClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri("/health")).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.body(Map.class)).thenThrow(new RuntimeException("Service down"));

        boolean disponible = service.estaDisponible();

        assertThat(disponible).isFalse();
    }
}