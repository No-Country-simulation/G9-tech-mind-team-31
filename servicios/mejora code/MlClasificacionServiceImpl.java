package com.techmind.api.service.impl;

import com.techmind.api.dto.ContenidoRequestDto;
import com.techmind.api.dto.ContenidoRespuesta;
import com.techmind.api.dto.MlPredictRequest;
import com.techmind.api.dto.MlPredictResponse;
import com.techmind.api.exception.MlServiceException;
import com.techmind.api.service.ClasificacionService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

/**
 * Implementación que delega la clasificación en el microservicio Python
 * (FastAPI, POST /predecir — ver main.py y schemas.py del equipo de ML).
 *
 * El bean RestClient se inyecta desde afuera: debe existir un RestClientConfig
 * (a cargo del equipo) que configure la base URL del microservicio, p.ej.:
 *
 *   @Bean
 *   RestClient mlRestClient(RestClient.Builder builder,
 *                            @Value("${ml.service.url}") String baseUrl) {
 *       return builder.baseUrl(baseUrl).build();
 *   }
 */
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
    public ContenidoRespuesta clasificar(ContenidoRequestDto request) {
        MlPredictRequest mlRequest = new MlPredictRequest(request.titulo(), request.texto());
        MlPredictResponse mlResponse = llamarServicioMl(mlRequest);

        return new ContenidoRespuesta(
                mlResponse.categoria(),
                mlResponse.probabilidad(),
                mlResponse.informacionesAdicionales()
        );
    }

    private MlPredictResponse llamarServicioMl(MlPredictRequest mlRequest) {
        try {
            MlPredictResponse response = restClient.post()
                    .uri(predictPath)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(mlRequest)
                    .retrieve()
                    .body(MlPredictResponse.class);

            if (response == null) {
                throw new MlServiceException(
                        "El servicio de clasificación no devolvió contenido", null);
            }
            return response;

        } catch (HttpClientErrorException ex) {
            // p.ej. 422 si Pydantic (schemas.ContenidoEntrada) rechaza la petición
            throw new MlServiceException(
                    "El servicio de clasificación rechazó la petición: " + ex.getStatusCode(), ex);
        } catch (HttpServerErrorException ex) {
            throw new MlServiceException(
                    "El servicio de clasificación falló internamente: " + ex.getStatusCode(), ex);
        } catch (RestClientException ex) {
            // p.ej. conexión rechazada porque el microservicio Python no está levantado
            throw new MlServiceException(
                    "No fue posible conectar con el servicio de clasificación", ex);
        }
    }
}
