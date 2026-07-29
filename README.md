Servicio de Clasificación — Backend Java (Spring Boot)

Documentación de la capa de DTOs y Servicio dentro de techmind-api. Pensada para que el resto del equipo entienda qué hace esta parte, cómo se conecta con el microservicio de Python y qué falta coordinar.

Rol dentro de la arquitectura

TechMind se divide en dos servicios:

Microservicio Python (FastAPI): sirve el modelo entrenado (model.joblib + vectorizer.joblib) a través de POST /predecir.
API Java (este proyecto): fachada pública que recibe el contenido del cliente, lo valida, se lo pasa al microservicio Python y devuelve la respuesta.

Los dos servicios están separados porque los binarios joblib de scikit-learn no son compatibles con la JVM — el modelo solo puede cargarse desde Python.

Microservicio Python (FastAPI)
MlClasificacionServiceImpl
ContenidoController
Cliente
Microservicio Python (FastAPI)
MlClasificacionServiceImpl
ContenidoController
Cliente
POST /contenido (ContenidoRequestDto)
clasificar(request)
POST /predecir (MlPredictRequest)
200 OK (MlPredictResponse)
ContenidoRespuesta
200 OK (JSON)
Qué contiene esta capa

DTOs (com.techmind.api.dto)

Clase	Función
ContenidoRequestDto	Entrada pública de POST /contenido. Valida titulo y texto con las mismas reglas que el microservicio Python.
ContenidoRespuesta	Salida pública: categoría, probabilidad e información adicional.
MlPredictRequest	Payload interno hacia Python (POST /predecir). Espejo de ContenidoEntrada (Pydantic).
MlPredictResponse	Respuesta interna recibida de Python. Espejo de ContenidoSalida (Pydantic).

Servicio (com.techmind.api.service)

Clase	Función
ClasificacionService	Interfaz del contrato de clasificación; el controller solo depende de esto.
MlClasificacionServiceImpl	Llama al microservicio Python vía RestClient, traduce ContenidoRequestDto ⇄ MlPredictRequest/MlPredictResponse ⇄ ContenidoRespuesta.
MlServiceException	Error de dominio cuando el microservicio Python no responde, rechaza la petición o falla.
Ejemplo de uso

Request

POST /contenido
Content-Type: application/json
json
{
  "titulo": "Introducción a Spring Boot",
  "texto": "En este contenido se presentan los conceptos básicos para la creación de APIs REST utilizando Java y Spring Boot."
}

Response — 200 OK

json
{
  "categoria": "Backend",
  "probabilidad": 0.89,
  "informaciones_adicionales": ["spring", "java", "api"]
}

Response — 400 Bad Request (validación, ya implementado en GlobalExceptionHandler)

json
{
  "status": 400,
  "error": "Validación fallida",
  "mensaje": "El texto debe tener entre 15 y 5000 caracteres",
  "timestamp": "2026-07-28T10:15:00"
}

Response — 502 Bad Gateway (microservicio Python caído o con error — handler pendiente, ver abajo)

json
{
  "status": 502,
  "error": "Servicio no disponible",
  "mensaje": "No fue posible conectar con el servicio de clasificación",
  "timestamp": "2026-07-28T10:15:00"
}
Validaciones aplicadas
titulo: no puede estar vacío.
texto: no puede estar vacío, entre 15 y 5000 caracteres (igual que schemas.py del lado Python, para que nunca llegue una petición que Java acepta y Python rechaza).
Cómo ejecutarlo en local

1. Levantar el microservicio Python (requiere haber corrido train.py antes, para generar model.joblib y vectorizer.joblib):

bash
uvicorn main:app --reload --port 8000

2. Configurar la URL del microservicio en application.yml del proyecto Java:

yaml
ml:
  service:
    url: http://localhost:8000
    predict-path: /predecir

3. Levantar la API Java:

bash
mvn spring-boot:run

4. Probar el endpoint:

bash
curl -X POST http://localhost:8080/contenido \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Intro a Spring Boot","texto":"Conceptos básicos de APIs REST con Java y Spring Boot."}'
Dependencias y versiones (de esta capa)
Java 21, Spring Boot 3.3.5
spring-boot-starter-web
spring-boot-starter-validation — ⚠️ falta agregarla al pom.xml principal, si no las anotaciones @NotBlank/@Size no se aplican.
