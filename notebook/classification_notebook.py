# %% [markdown]
# # Clasificador de Contenido Técnico - Pipeline de NLP y Machine Learning (Producción)
# Este archivo funciona como un notebook interactivo. Puedes ejecutar cada celda (demarcada por `# %%`) directamente en tu IDE para ver el paso a paso, tal como en Google Colab.

# %% [markdown]
# ## Paso 1: Importar librerías necesarias

# %%
import os
import sys
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix

# Agrego la ruta actual al path para importar el text_cleaner local
sys.path.append(os.getcwd())
from text_cleaner import TextCleaner

# %% [markdown]
# ## Paso 2: Cargar el Dataset y Controlar Nulos
# Cargo mi conjunto de datos con los textos técnicos y sus respectivas categorías, removiendo nulos de forma segura.

# %%
# Defino la ruta de mis datos
dataset_path = os.path.join("data", "dataset.csv")

# Leo el archivo CSV usando Pandas
df = pd.read_csv(dataset_path)
print(f"Registros iniciales cargados: {df.shape[0]}")

# Elimino filas con nulos en las columnas críticas
df = df.dropna(subset=['text', 'label'])
print(f"Registros válidos tras quitar nulos: {df.shape[0]}\n")
print("Distribución de categorías en mi dataset:")
print(df['label'].value_counts())

# %% [markdown]
# ## Paso 3: Limpieza y Preprocesamiento Avanzado de Texto (NLP)
# Utilizo mi clase `TextCleaner` para eliminar HTML, URLs, correos electrónicos, caracteres especiales y stop words.
# Además, filtro cualquier texto que haya quedado vacío tras el proceso de limpieza.

# %%
# Instancio mi limpiador de texto avanzado
cleaner = TextCleaner()

# Aplico la limpieza a toda la columna de textos
df['cleaned_text'] = df['text'].apply(cleaner.clean)

# Elimino registros cuyo texto limpio quede completamente vacío
df = df[df['cleaned_text'].str.strip() != '']
print(f"Registros listos para entrenar tras remoción de textos vacíos: {df.shape[0]}\n")

# Muestro una comparación del primer registro para comprobar
print("--- Comparación de Limpieza Avanzada ---")
print(f"Original:\n{df['text'].iloc[0]}\n")
print(f"Limpio:\n{df['cleaned_text'].iloc[0]}")

# %% [markdown]
# ## Paso 4: División en Entrenamiento y Prueba (Train/Test Split)
# Divido mis datos de manera estratificada para asegurar que todas las categorías estén representadas en ambos conjuntos.

# %%
X = df['cleaned_text']
y = df['label']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

print(f"Tamaño de mi set de entrenamiento: {len(X_train)}")
print(f"Tamaño de mi set de prueba: {len(X_test)}")

# %% [markdown]
# ## Paso 5: Vectorización TF-IDF
# Convierto mis textos limpios a una representación numérica basada en la importancia de las palabras.

# %%
# Inicializo mi vectorizador TF-IDF
vectorizer = TfidfVectorizer(sublinear_tf=True, min_df=1, norm='l2', encoding='utf-8', ngram_range=(1, 1))

# Ajusto con el set de entrenamiento y transformo ambos conjuntos
X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)

print(f"Número de características únicas extraídas (vocabulario): {X_train_tfidf.shape[1]}")

# %% [markdown]
# ## Paso 6: Entrenamiento del Modelo
# Utilizo Regresión Logística con pesos balanceados para entrenar mi clasificador sobre las features vectorizadas.

# %%
# Entreno mi clasificador
model = LogisticRegression(C=10.0, class_weight='balanced', random_state=42)
model.fit(X_train_tfidf, y_train)

print("¡Modelo entrenado exitosamente!")

# %% [markdown]
# ## Paso 7: Evaluación del Modelo (Métricas)
# Genero mi reporte de clasificación y la matriz de confusión sobre el conjunto de test.

# %%
# Realizo las predicciones sobre el set de prueba
y_pred = model.predict(X_test_tfidf)

print("--- Mi Matriz de Confusión ---")
print(confusion_matrix(y_test, y_pred))

print("\n--- Mi Reporte de Clasificación ---")
print(classification_report(y_test, y_pred))

# %% [markdown]
# ## Paso 8: Serialización (Exportación del modelo y vectorizador)
# Guardo el modelo y el vectorizador en la carpeta de microservicio para que el backend pueda consumirlos de inmediato.

# %%
# Defino mi directorio de salida
output_dir = os.path.join("..", "microservicio", "models")
os.makedirs(output_dir, exist_ok=True)

model_path = os.path.join(output_dir, "model.joblib")
vectorizer_path = os.path.join(output_dir, "vectorizer.joblib")

# Serializo mis objetos
joblib.dump(model, model_path)
joblib.dump(vectorizer, vectorizer_path)

print(f"Vectorizador exportado correctamente en: {os.path.abspath(vectorizer_path)}")
print(f"Modelo exportado correctamente en: {os.path.abspath(model_path)}")
