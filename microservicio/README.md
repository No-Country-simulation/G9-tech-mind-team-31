# Microservicio de Clasificación - TechMind

Microservicio en Python (FastAPI) que recibe un título y texto técnico, y devuelve la categoría, probabilidad y palabras clave.

## Requisitos

Python 3.11+, pip

## Cómo levantarlo en local

1. Clonar el repositorio
```
git clone https://github.com/No-Country-simulation/G9-tech-mind-team-31.git
```

2. Entrar a la carpeta del microservicio
```
cd G9-tech-mind-team-31/microservicio
```

3. Crear entorno virtual
```
py -m venv venv
```

4. Activar entorno virtual (Windows)
```
venv\Scripts\activate
```

5. Instalar dependencias
```
pip install -r requirements.txt
```

6. Levantar el servidor
```
uvicorn app.main:app --reload
```

El servicio queda disponible en `http://127.0.0.1:8000`

## Endpoint

**POST** `/predecir`

### Validaciones

- `titulo` y `texto` son obligatorios y no pueden estar vacíos
- `texto` debe tener entre 15 y 5000 caracteres

## Ejemplos de uso

### 1. Clasificación Backend

```
curl -X POST http://127.0.0.1:8000/predecir -H "Content-Type: application/json" -d "{\"titulo\": \"Introduccion a Spring Boot\", \"texto\": \"Conceptos basicos para la creacion de APIs REST con Java y Spring Boot.\"}"
```

Respuesta:
```json
{"categoria":"Backend","probabilidad":0.44,"informaciones_adicionales":["boot","spring","rest"]}
```

### 2. Clasificación Frontend

```
curl -X POST http://127.0.0.1:8000/predecir -H "Content-Type: application/json" -d "{\"titulo\": \"Introduccion a UX UI\", \"texto\": \"Conceptos basicos para la creacion de UI y dinamismo en paginas web usando JavaScript.\"}"
```

Respuesta:
```json
{"categoria":"Frontend","probabilidad":0.4,"informaciones_adicionales":["javascript","web","usando"]}
```

### 3. Texto inválido (muy corto)

```
curl -X POST http://127.0.0.1:8000/predecir -H "Content-Type: application/json" -d "{\"titulo\": \"Test\", \"texto\": \"asd\"}"
```

Respuesta (error 422):
```json
{"detail":[{"type":"value_error","loc":["body","texto"],"msg":"Value error, El texto es demasiado corto para clasificar (minimo 15 caracteres)"}]}
```