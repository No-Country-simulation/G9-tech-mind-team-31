Microservicio de Clasificacion - TechMind

Requisitos: Python 3.11+, pip

Como levantarlo en local:

1. Clonar el repositorio
git clone https://github.com/No-Country-simulation/G9-tech-mind-team-31.git

2. Entrar a la carpeta del microservicio
cd G9-tech-mind-team-31/microservicio

3. Crear entorno virtual
py -m venv venv

4. Activar entorno virtual (Windows)
venv\Scripts\activate

5. Instalar dependencias
pip install -r requirements.txt

6. Levantar el servidor
uvicorn app.main:app --reload

El servicio queda disponible en http://127.0.0.1:8000

Endpoint: POST /predecir

Ejemplo de entrada:
{
  "titulo": "Introduccion a Spring Boot",
  "texto": "Conceptos basicos para la creacion de APIs REST con Java y Spring Boot."
}

Ejemplo con curl:
curl -X POST http://127.0.0.1:8000/predecir -H "Content-Type: application/json" -d "{\"titulo\": \"Introduccion a Spring Boot\", \"texto\": \"Conceptos basicos para la creacion de APIs REST con Java y Spring Boot.\"}"