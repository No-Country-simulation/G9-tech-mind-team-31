from pydantic import BaseModel, field_validator

class ContenidoEntrada(BaseModel):
    titulo: str
    texto: str

    @field_validator("titulo", "texto")
    @classmethod
    def no_vacio(cls, valor: str) -> str:
        if not valor.strip():
            raise ValueError("ERROR. El campo no puede estar vacio")
        return valor

    @field_validator("texto")
    @classmethod
    def longitud_valida(cls, valor: str) -> str:
        if len(valor.strip()) < 15:
            raise ValueError("El texto es demasiado corto para clasificar (minimo 15 caracteres)")
        if len(valor) > 5000:
            raise ValueError("El texto es demasiado largo (máximo 5000 caracteres)")
        return valor

class ContenidoSalida(BaseModel):
    categoria: str
    probabilidad: float
    informaciones_adicionales: list[str]