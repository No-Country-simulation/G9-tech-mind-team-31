package com.techmind.api.service;

import com.techmind.api.dto.ContenidoRequest;
import com.techmind.api.dto.ContenidoRespuesta;

public interface ClasificacionService {
    ContenidoRespuesta clasificar(ContenidoRequest request);
    boolean estaDisponible();
}
