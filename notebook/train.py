import os
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import classification_report, confusion_matrix
from text_cleaner import TextCleaner

def main():
    print("--- 1. Cargando mi Dataset ---")
    dataset_path = os.path.join("data", "dataset.csv")
    if not os.path.exists(dataset_path):
        dataset_path = os.path.join(os.path.dirname(__file__), "data", "dataset.csv")
        
    df = pd.read_csv(dataset_path)
    print(f"Registros iniciales cargados: {df.shape[0]}")
    
    # Manejo valores nulos de forma segura en las columnas críticas
    df = df.dropna(subset=['text', 'label'])
    print(f"Registros válidos tras quitar nulos: {df.shape[0]}")
    print("Distribución de mis clases:")
    print(df['label'].value_counts())
    
    print("\n--- 2. Limpieza Avanzada de Texto (NLP) ---")
    cleaner = TextCleaner()
    df['cleaned_text'] = df['text'].apply(cleaner.clean)
    
    # Filtro los registros que queden vacíos después de limpiarlos
    df = df[df['cleaned_text'].str.strip() != '']
    print(f"Registros listos para entrenar tras remoción de textos vacíos: {df.shape[0]}")
    
    # Imprimo un ejemplo para ver cómo la limpieza elimina HTML, URLs y correos
    print("Ejemplo de limpieza avanzada:")
    print(f"Original: {df['text'].iloc[0]}")
    print(f"Limpio:   {df['cleaned_text'].iloc[0]}")
    
    print("\n--- 3. Partición de datos (Train/Test Split) ---")
    X = df['cleaned_text']
    y = df['label']
    
    # Divido mis datos estratificadamente (20% para pruebas)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, stratify=y, random_state=42
    )
    
    print(f"Tamaño de mi set de entrenamiento: {len(X_train)}")
    print(f"Tamaño de mi set de prueba: {len(X_test)}")
    
    print("\n--- 4. Vectorización TF-IDF con N-gramas ---")
    # Configuro TF-IDF para incluir unigramas y bigramas (palabras compuestas) y limito el vocabulario a 250 palabras clave
    vectorizer = TfidfVectorizer(
        sublinear_tf=True, 
        min_df=1, 
        norm='l2', 
        encoding='utf-8', 
        ngram_range=(1, 2),
        max_features=250
    )
    
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)
    
    print(f"Número de características de mi vocabulario (unigramas + bigramas): {X_train_tfidf.shape[1]}")
    
    print("\n--- 5. Entrenando mi Modelo (Naive Bayes Multinomial) ---")
    # Uso Naive Bayes Multinomial con suavizado para mejorar la fuerza y nitidez de las probabilidades
    model = MultinomialNB(alpha=0.1)
    model.fit(X_train_tfidf, y_train)
    print("¡Modelo entrenado!")
    
    print("\n--- 6. Evaluación de mi Modelo ---")
    y_pred = model.predict(X_test_tfidf)
    
    print("Mi Matriz de Confusión:")
    print(confusion_matrix(y_test, y_pred))
    
    print("\nMi Reporte de Clasificación:")
    print(classification_report(y_test, y_pred))
    
    print("\n--- 7. Guardando y Serializando ---")
    # Defino mi ruta de salida para la API
    output_dir = os.path.join(os.path.dirname(__file__), "..", "microservicio", "models")
    os.makedirs(output_dir, exist_ok=True)
    
    model_path = os.path.join(output_dir, "model.joblib")
    vectorizer_path = os.path.join(output_dir, "vectorizer.joblib")
    
    # Exporto los binarios
    joblib.dump(model, model_path)
    joblib.dump(vectorizer, vectorizer_path)
    
    print(f"Mi vectorizador guardado en: {vectorizer_path}")
    print(f"Mi modelo guardado en: {model_path}")
    print("\n¡Terminé el entrenamiento y guardé mis archivos con éxito!")

if __name__ == "__main__":
    main()
