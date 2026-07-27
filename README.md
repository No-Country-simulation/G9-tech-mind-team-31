# G9 Tech Mind - Clasificador de Contenido Técnico (Data Science Deliverable)

Este proyecto contiene el "cerebro" del MVP para clasificar textos y artículos técnicos en una de nuestras 5 categorías definidas: **Frontend, Backend, Inteligencia Artificial, Data Science y Ciberseguridad**.

El pipeline está modularizado y listo para ser consumido por la API REST de Backend.

---

## Nuevos Resultados del Modelo (Optimizado con Naive Bayes + Bigramas)

Tras nuestra última optimización (donde incrementamos el dataset a 75 muestras, incorporamos N-gramas e implementamos Naive Bayes Multinomial), hemos logrado una **precisión y confianza excepcionales** en las predicciones. 

A continuación se muestran los resultados reales de las pruebas de inferencia (`predict.py`) comparados con el modelo anterior:

| Caso de Prueba | Categoría Real | Categoría Predicha | Confianza Anterior (Regr. Logística) | Nueva Confianza (Naive Bayes) | Estado |
| :--- | :---: | :---: | :---: | :---: | :---: |
| *"Quiero crear una API con Express y conectar una base de datos MySQL..."* | **Backend** | **Backend** | 50.58% | **93.08%** | **Correcto** |
| *"Cómo usar layouts avanzados en CSS, flexbox y componentes de React..."* | **Frontend** | **Frontend** | 72.31% | **98.18%** | **Correcto** |
| *"Me gustaría entrenar una red neuronal para predecir precios..."* | **Data Science** | **Data Science** | 23.42% *(Incorrecto)* | **59.01%** | **Correcto** |
| *"Tengo dudas sobre cómo afinar (fine-tuning) un modelo Llama 3..."* | **Inteligencia artificial** | **Inteligencia artificial** | 66.38% | **91.98%** | **Correcto** |
| *"Detectamos un ataque de denegación de servicio distribuido y firewall..."* | **Ciberseguridad** | **Ciberseguridad** | 18.08% *(Incorrecto)* | **94.57%** | **Correcto** |

---

## Estructura del Proyecto

*   **`notebook/`**: Carpeta destinada al entrenamiento y exploración de datos.
    *   `data/dataset.csv`: Dataset técnico limpio con 75 registros etiquetados.
    *   `text_cleaner.py`: Módulo NLP para limpiar texto (HTML, URLs, Emails, Stop Words).
    *   `train.py`: Script principal de entrenamiento y evaluación.
    *   `classification_pipeline.ipynb`: Jupyter Notebook con explicaciones y los resultados precargados para ver en GitHub.
    *   `classification_notebook.py`: Versión interactiva de ejecución rápida en IDEs.
*   **`microservicio/`**: Backend e integración.
    *   `models/`: Contiene los archivos serializados del modelo (`model.joblib` y `vectorizer.joblib`).
    *   `predict.py`: Módulo de inferencia listo para integrarse a la API REST.

---

## Cómo Ejecutar el Pipeline Localmente

1.  **Instalar dependencias**:
    ```bash
    pip install -r requirements.txt
    ```
2.  **Entrenar y evaluar el modelo**:
    ```bash
    python notebook/train.py
    ```
3.  **Probar inferencia con nuevos textos**:
    ```bash
    python microservicio/predict.py
    ```
