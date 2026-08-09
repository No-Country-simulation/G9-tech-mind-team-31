import os
import io
import oci
from dotenv import load_dotenv

load_dotenv()

class OCIStorageClient:
    def __init__(self):
        config = {
            "user": os.getenv("OCI_USER"),
            "fingerprint": os.getenv("OCI_FINGERPRINT"),
            "tenancy": os.getenv("OCI_TENANCY"),
            "region": os.getenv("OCI_REGION"),
            "key_content": os.getenv("OCI_KEY_CONTENT"),
        }
        self.client = oci.object_storage.ObjectStorageClient(config)
        self.namespace = os.getenv("OCI_NAMESPACE")
        self.bucket_name = os.getenv("OCI_BUCKET_NAME")

    def subir_archivo(self, ruta_local, nombre_en_bucket):
        with open(ruta_local, "rb") as f:
            self.client.put_object(self.namespace, self.bucket_name, nombre_en_bucket, f)

    def descargar_archivo(self, nombre_en_bucket, ruta_local):
        response = self.client.get_object(self.namespace, self.bucket_name, nombre_en_bucket)
        with open(ruta_local, "wb") as f:
            for chunk in response.data.raw.stream(1024 * 1024, decode_content=False):
                f.write(chunk)