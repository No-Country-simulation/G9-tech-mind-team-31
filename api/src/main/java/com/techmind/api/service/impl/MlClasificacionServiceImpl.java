package com.techmind.api.service.impl;

import com.techmind.api.dto.ContenidoRequest;
import com.techmind.api.dto.ContenidoRespuesta;
import com.techmind.api.dto.MlPredictRequest;
import com.techmind.api.dto.MlPredictResponse;
import com.techmind.api.exception.ServicioClasificacionException;
import com.techmind.api.service.ClasificacionService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.Map;

@Service
public class MlClasificacionServiceImpl implements ClasificacionService {

    private final RestClient restClient;
    private final String predictPath;

    public MlClasificacionServiceImpl(
            RestClient restClient,
            @Value("${ml.service.predict-path:/predecir}") String predictPath) {
        this.restClient = restClient;
        this.predictPath = predictPath;
    }

    @Override
    public ContenidoRespuesta clasificar(ContenidoRequest request) {
        MlPredictResponse response;
        try {
            response = restClient.post()
                    .uri(predictPath)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(new MlPredictRequest(request.titulo(), request.texto()))
                    .retrieve()
                    .body(MlPredictResponse.class);
        } catch (RestClientResponseException ex) {
            throw new ServicioClasificacionException(
                    "El servicio de clasificación respondió con " + ex.getStatusCode(), ex);
        } catch (ResourceAccessException ex) {
            throw new ServicioClasificacionException(
                    "No fue posible conectar con el servicio de clasificación", ex);
        }

        if (response == null) {
            throw new ServicioClasificacionException(
                    "El servicio de clasificación devolvió una respuesta vacía");
        }

        return new ContenidoRespuesta(
                response.categoria(),
                response.probabilidad(),
                response.informacionesAdicionales());
    }

    @Override
    public boolean estaDisponible() {
        try {
            Map<?, ?> response = restClient.get()
                    .uri("/health")
                    .retrieve()
                    .body(Map.class);
            return response != null;
        } catch (RuntimeException ex) {
            return false;
        }
    }
}