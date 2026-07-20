import re

class TextCleaner:
    def __init__(self):
        # Defino mi lista básica de Stop Words combinada en español e inglés
        self.stop_words = set([
            # Stop words en español
            'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 
            'en', 'con', 'para', 'por', 'que', 'y', 'o', 'a', 'en', 'es', 'son', 
            'este', 'esta', 'estos', 'estas', 'un', 'una', 'su', 'sus', 'al', 
            'lo', 'como', 'mas', 'pero', 'se', 'del', 'no', 'si', 'o', 'u', 'e',
            # Stop words en inglés
            'the', 'a', 'an', 'and', 'or', 'but', 'if', 'then', 'else', 'for', 
            'in', 'on', 'at', 'with', 'by', 'about', 'against', 'between', 
            'into', 'through', 'during', 'before', 'after', 'above', 'below', 
            'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 
            'under', 'again', 'further', 'then', 'once', 'here', 'there', 
            'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 
            'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 
            'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 
            's', 't', 'can', 'will', 'just', 'don', 'should', 'now', 'is', 
            'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
            'having', 'do', 'does', 'did', 'doing', 'its', 'their', 'our', 'your'
        ])

    def clean(self, text):
        """
        Esta función realiza la limpieza avanzada de mis textos técnicos:
        1. Control de valores nulos o tipos de datos incorrectos.
        2. Conversión a minúsculas.
        3. Remoción de etiquetas HTML.
        4. Remoción de URLs y correos electrónicos.
        5. Remoción de caracteres especiales, números y emojis.
        6. Tokenización y filtrado de Stop Words.
        """
        if not isinstance(text, str):
            return ""
        
        # 1. Paso mi texto a minúsculas
        text = text.lower()
        
        # 2. Elimino etiquetas HTML (p.ej. <div>, <p>, etc.)
        text = re.sub(r'<[^>]*>', ' ', text)
        
        # 3. Elimino URLs (enlaces web http, https, ftp, etc.)
        text = re.sub(r'https?://\S+|www\.\S+|ftp://\S+', ' ', text)
        
        # 4. Elimino direcciones de correo electrónico
        text = re.sub(r'\S+@\S+', ' ', text)
        
        # 5. Elimino caracteres especiales, números, emojis y signos de puntuación
        text = re.sub(r'[^a-záéíóúüña-z]', ' ', text)
        
        # 6. Tokenizo (separo por espacios) y descarto las Stop Words
        tokens = text.split()
        cleaned_tokens = [token for token in tokens if token not in self.stop_words]
        
        # Junto las palabras limpias de nuevo en un solo string
        return " ".join(cleaned_tokens)

if __name__ == "__main__":
    # Prueba del limpiador avanzado
    cleaner = TextCleaner()
    sample_text = "Desarrollo con React! Visita https://react.dev o escribe a contact@domain.com. <div>React v18</div> 🚨"
    print("Original:", sample_text)
    print("Limpio:", cleaner.clean(sample_text))
