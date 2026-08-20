from app.services.storage import OCIStorageClient

cliente = OCIStorageClient()

cliente.subir_archivo("models/model.joblib", "model.joblib")
cliente.subir_archivo("models/vectorizer.joblib", "vectorizer.joblib")

print("Modelo y vectorizador subidos al bucket con éxito.")