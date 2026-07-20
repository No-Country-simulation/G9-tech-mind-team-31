from pydantic import BaseModel

# modelo representación de lo que vamos a recibir de la API
class ContenidoEntrada(BaseModel):
    titulo: str # obligatorio
    texto: str # obligatorio

# modelo representación de los vamos a devolverle a la API
class ContenidoSalida(BaseModel):
    categoria: str
    probabilidad: float
    informaciones_adicionales: list[str]