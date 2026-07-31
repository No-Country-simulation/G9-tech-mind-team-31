import os
import joblib
from app.schemas import ContenidoEntrada, ContenidoSalida
from app.services.text_cleaner import TextCleaner

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "models")

model = joblib.load(os.path.join(MODELS_DIR, "model.joblib"))
vectorizer = joblib.load(os.path.join(MODELS_DIR, "vectorizer.joblib"))
cleaner = TextCleaner()

def extraer_palabras_clave(texto_vectorizado, top_n=3):
    nombres_terminos = vectorizer.get_feature_names_out()
    scores = texto_vectorizado.toarray()[0]
    indices_top = scores.argsort()[-top_n:][::-1]
    return [nombres_terminos[i] for i in indices_top if scores[i] > 0]

def predecir_categoria(contenido: ContenidoEntrada) -> ContenidoSalida:
    texto_completo = contenido.titulo + " " + contenido.texto
    texto_limpio = cleaner.clean(texto_completo)
    texto_vectorizado = vectorizer.transform([texto_limpio])

    categoria = model.predict(texto_vectorizado)[0]
    probabilidades = model.predict_proba(texto_vectorizado)[0]
    probabilidad_max = max(probabilidades)

    palabras_clave = extraer_palabras_clave(texto_vectorizado)

    return ContenidoSalida(
        categoria=categoria,
        probabilidad=round(float(probabilidad_max), 2),
        informaciones_adicionales=palabras_clave
    )