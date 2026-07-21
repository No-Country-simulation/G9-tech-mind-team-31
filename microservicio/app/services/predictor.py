from app.schemas import ContenidoEntrada, ContenidoSalida

def predecir_categoria(contenido: ContenidoEntrada) -> ContenidoSalida:
    return ContenidoSalida(
        categoria="Backend",
        probabilidad=0.89,
        informaciones_adicionales=["Java", "Spring Boot", "API REST"]
    )