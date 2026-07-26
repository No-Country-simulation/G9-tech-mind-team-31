package com.techmind.api.service.impl;

import com.techmind.api.dto.ContenidoRequest;
import com.techmind.api.dto.ContenidoRespuesta;
import com.techmind.api.dto.MlPredictRequest;
import com.techmind.api.dto.MlPredictResponse;
import com.techmind.api.exception.ServicioClasificacionException;
import com.techmind.api.service.ClasificacionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.Map;

@Service
public class MlClasificacionServiceImpl implements ClasificacionService {

    private static final Logger log = LoggerFactory.getLogger(MlClasificacionServiceImpl.class);
    private static final int TOP_N_PALABRAS_CLAVE = 5;

    private final RestClient mlServiceRestClient;

    public MlClasificacionServiceImpl(RestClient mlServiceRestClient) {
        this.mlServiceRestClient = mlServiceRestClient;
    }

    @Override
    public ContenidoRespuesta clasificar(ContenidoRequest request) {
        MlPredictRequest mlRequest = new MlPredictRequest(
                request.titulo(), request.texto(), TOP_N_PALABRAS_CLAVE
        );

        MlPredictResponse mlResponse;
        try {
            mlResponse = mlServiceRestClient.post()
                    .uri("/predict")
                    .body(mlRequest)
                    .retrieve()
                    .body(MlPredictResponse.class);
        } catch (RestClientResponseException ex) {
            log.error("El microservicio de ML respondió {} - {}", ex.getStatusCode(), ex.getResponseBodyAsString());
            throw new ServicioClasificacionException(
                    "El servicio de clasificación devolvió un error (" + ex.getStatusCode() + ").", ex);
        } catch (ResourceAccessException ex) {
            log.error("No se pudo contactar al microservicio de ML: {}", ex.getMessage());
            throw new ServicioClasificacionException(
                    "No se pudo contactar al servicio de clasificación. Verifica que esté activo.", ex);
        }

        if (mlResponse == null) {
            throw new ServicioClasificacionException("El servicio de clasificación devolvió una respuesta vacía.");
        }

        return new ContenidoRespuesta(
                mlResponse.categoria(),
                mlResponse.probabilidad(),
                mlResponse.palabrasClave(),
                mlResponse.probabilidades()
        );
    }

    @Override
    @SuppressWarnings("unchecked")
    public boolean estaDisponible() {
        try {
            Map<String, Object> salud = mlServiceRestClient.get()
                    .uri("/health")
                    .retrieve()
                    .body(Map.class);
            return salud != null && Boolean.TRUE.equals(salud.get("modelo_cargado"));
        } catch (Exception ex) {
            log.warn("Chequeo de salud del servicio de ML falló: {}", ex.getMessage());
            return false;
        }
    }
}