package com.techmind.api.service;

import com.techmind.api.dto.ContenidoRequestDto;
import com.techmind.api.dto.ContenidoRespuesta;

/**
 * Contrato para la clasificación de contenido técnico.
 * La implementación actual delega en el microservicio de ML (Python/FastAPI),
 * pero el controller solo conoce esta interfaz.
 */
public interface ClasificacionService {

    ContenidoRespuesta clasificar(ContenidoRequestDto request);
}
