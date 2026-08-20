#!/usr/bin/env python3
import requests
import json

data = {
    'titulo': 'Introducción a React',
    'texto': 'Frameworks de JavaScript, React, componentes y hooks para desarrollo web'
}

try:
    response = requests.post('http://127.0.0.1:8000/predecir', json=data)
    print("✓ FastAPI respondió correctamente:")
    print(json.dumps(response.json(), indent=2, ensure_ascii=False))
except Exception as e:
    print(f"✗ Error al conectar con FastAPI: {e}")
