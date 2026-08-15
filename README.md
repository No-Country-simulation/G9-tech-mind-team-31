# G9 Tech Mind — Clasificador de Contenido Técnico (Backend API REST)

Este repositorio contiene la implementación del servidor Backend desarrollado en **Java 21 con Spring Boot 3.3**, diseñado como parte de la solución del **Hackathon ONE (Alura + Oracle - Grupo G9)**. 

El servicio actúa como la fachada pública del sistema **TechMind**, encargándose de recibir las solicitudes de los usuarios, aplicar validaciones en los datos de entrada, gestionar errores de manera centralizada y canalizar la información procesada.

---

## 🛠️ Clases e Implementaciones Principales

- **`ContenidoRequestDto.java`** (`com.techmind.api.dto`): Define el contrato de entrada del cliente e implementa las anotaciones `@NotBlank` y `@Size` para asegurar la integridad de los datos.
- **`ErrorResponseDto.java`** (`com.techmind.api.dto`): Estructura estándar en formato JSON para la devolución clara y limpia de errores HTTP.
- **`GlobalExceptionHandler.java`** (`com.techmind.api.controller` / `exception`): Anotado con `@RestControllerAdvice`, intercepta la excepción `MethodArgumentNotValidException` para devolver una respuesta **`400 Bad Request`** personalizada.
- **`ContenidoController.java`** (`com.techmind.api.controller`): Expone el endpoint público de la solución.

---

## 🛡️ Reglas de Validación Aplicadas (`ContenidoRequestDto`)

| Campo | Anotaciones | Regla de Negocio | Mensaje de Error en Respuesta |
| :--- | :--- | :--- | :--- |
| `titulo` | `@NotBlank`, `@Size(min = 3)` | Obligatorio (no vacío/espacios), mín. 3 caracteres | *"El título no puede estar vacío"* |
| `texto` | `@NotBlank`, `@Size(min = 10, max = 5000)` | Obligatorio, entre 10 y 5000 caracteres | *"El texto debe contener al menos 10 caracteres"* |

---

## 🧪 Evidencias de Pruebas de Integración (`curl`)

Las siguientes pruebas de integración fueron ejecutadas directamente sobre el servidor en ejecución (`http://localhost:8080/contenido`), garantizando el correcto funcionamiento de las respuestas `200 OK` y `400 Bad Request`:

### 1. Flujo Exitoso (`200 OK`)
> Petición válida con título y texto con suficiente longitud.

**Comando ejecutado:**
```bash
curl -X POST http://localhost:8080/contenido \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Prueba de Integración API",
    "texto": "Este es un texto con suficiente longitud para validar el correcto funcionamiento del endpoint de clasificación."
  }'
```

**Respuesta recibida (`200 OK`):**
```json
{
  "categoria": "Backend",
  "probabilidad": 0.89,
  "informaciones_adicionales": [
    "Java",
    "Spring Boot",
    "API REST"
  ]
}
```

---

### 2. Validación Fallida: Texto Corto (`400 Bad Request`)
> Petición con el campo `texto` menor a 10 caracteres.

**Comando ejecutado:**
```bash
curl -X POST http://localhost:8080/contenido \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Prueba de error",
    "texto": "Corto"
  }'
```

**Respuesta recibida (`400 Bad Request`):**
```json
{
  "status": 400,
  "error": "Validación fallida",
  "mensaje": "El texto debe contener al menos 10 caracteres",
  "timestamp": "2026-08-03T14:41:36.681967"
}
```

---

### 3. Validación Fallida: Título Vacío (`400 Bad Request`)
> Petición con el campo `titulo` vacío.

**Comando ejecutado:**
```bash
curl -X POST http://localhost:8080/contenido \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "",
    "texto": "Este es un texto con suficiente longitud pero el titulo está vacío."
  }'
```

**Respuesta recibida (`400 Bad Request`):**
```json
{
  "status": 400,
  "error": "Validación fallida",
  "mensaje": "El título no puede estar vacío",
  "timestamp": "2026-08-03T14:41:55.79614"
}
```

---

## 🚀 Requisitos y Ejecución

- **Java 21** o superior.
- **Maven 3.8+**.

### Ejecución del Servidor

Desde la raíz del repositorio, navegar a la carpeta del proyecto backend y ejecutar:

```bash
# Navegar al directorio de la API
cd api/

# Compilar y ejecutar el servidor Backend
./mvnw spring-boot:run
```

El servidor estará disponible y escuchando peticiones en `http://localhost:8080/contenido`.
