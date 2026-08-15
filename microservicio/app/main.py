from fastapi import FastAPI
from app.schemas import ContenidoEntrada, ContenidoSalida
from app.services.predictor import predecir_categoria

app = FastAPI()

@app.post("/predecir", response_model=ContenidoSalida)
def clasificar_contenido(contenido: ContenidoEntrada):
    return predecir_categoria(contenido)