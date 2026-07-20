import os
import sys
import joblib

# Agrego mi carpeta 'notebook' a la ruta de búsqueda de módulos para importar mi limpiador
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "notebook"))
try:
    from text_cleaner import TextCleaner
except ImportError:
    # Defino una clase de respaldo por si ejecuto el código fuera del entorno del repositorio
    import re
    class TextCleaner:
        def __init__(self):
            self.stop_words = set(['el', 'la', 'los', 'las', 'un', 'una', 'de', 'en', 'con', 'para', 'por', 'que', 'y', 'o', 'a', 'the', 'a', 'an', 'and', 'or', 'is', 'are', 'to', 'from', 'in', 'on', 'with'])
        def clean(self, text):
            if not isinstance(text, str): return ""
            text = text.lower()
            text = re.sub(r'[^a-záéíóúüña-z]', ' ', text)
            return " ".join([t for t in text.split() if t not in self.stop_words])

class Predictor:
    def __init__(self):
        # Defino mis rutas hacia el modelo y el vectorizador guardados
        base_dir = os.path.dirname(__file__)
        model_path = os.path.join(base_dir, "models", "model.joblib")
        vectorizer_path = os.path.join(base_dir, "models", "vectorizer.joblib")
        
        # Lanzo un error si no los encuentro
        if not os.path.exists(model_path) or not os.path.exists(vectorizer_path):
            raise FileNotFoundError(
                "No encontré el archivo del modelo o del vectorizador. "
                "Recuerda que primero debo ejecutar 'notebook/train.py' para entrenarlo."
            )
            
        # Cargo el modelo y el vectorizador serializados
        self.model = joblib.load(model_path)
        self.vectorizer = joblib.load(vectorizer_path)
        self.cleaner = TextCleaner()

    def predict(self, text):
        """
        Esta función me sirve para limpiar, vectorizar y clasificar cualquier texto técnico.
        Me devuelve la categoría ganadora y las probabilidades asociadas.
        """
        # 1. Limpio mi texto
        cleaned = self.cleaner.clean(text)
        
        # 2. Vectorizo mi texto usando el vectorizador cargado
        tfidf_features = self.vectorizer.transform([cleaned])
        
        # 3. Predigo mi categoría
        prediction = self.model.predict(tfidf_features)[0]
        
        # 4. Obtengo mis probabilidades
        probabilities = self.model.predict_proba(tfidf_features)[0]
        class_probabilities = dict(zip(self.model.classes_, probabilities))
        
        return prediction, class_probabilities

if __name__ == "__main__":
    print("--- Probador de mi Clasificador Técnico ---")
    try:
        predictor = Predictor()
        
        # Defino mis textos de prueba para validar el comportamiento
        test_texts = [
            "Quiero crear una API con Express y conectar una base de datos MySQL para gestionar los usuarios.",
            "Cómo usar layouts avanzados en CSS, flexbox y componentes de React para un diseño web premium.",
            "Me gustaría entrenar una red neuronal para predecir precios de acciones usando regresión lineal en Pandas.",
            "Tengo dudas sobre cómo afinar (fine-tuning) un modelo Llama 3 para tareas específicas de procesamiento de lenguaje natural.",
            "Detectamos un ataque de denegación de servicio distribuido y estamos analizando el firewall en busca de inyecciones de código malicioso."
        ]
        
        for text in test_texts:
            pred, probs = predictor.predict(text)
            print(f"\nTexto: '{text}'")
            print(f"-> Categoría Predicha: {pred}")
            print("   Confianzas:")
            for cat, prob in probs.items():
                print(f"     - {cat}: {prob*100:.2f}%")
                
    except FileNotFoundError as e:
        print(f"Error: {e}")
    except Exception as e:
        print(f"Ocurrió un error inesperado: {e}")
