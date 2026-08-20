# TechMind

Dashboard para clasificar contenido técnico. El proyecto está compuesto por tres partes:

```text
Frontend React/Vite (5173)
        |
        v
API Spring Boot (8080) ----> Microservicio FastAPI + modelo ML (8000)
```

La API pública es `POST /contenido`. El microservicio de machine learning expone `POST /predecir`.

## Rol de cada componente

TechMind separa la interfaz, la API pública y la inferencia del modelo porque los archivos `joblib` de scikit-learn se ejecutan en Python y no directamente en la JVM.

### Frontend React/Vite

El frontend permite ingresar un título y un texto técnico, enviar el contenido a la API, mostrar la categoría, la confianza y las palabras clave, y conservar un historial local de los análisis.

### API Java Spring Boot

La API funciona como fachada pública del sistema:

1. Recibe `POST /contenido`.
2. Valida que `titulo` y `texto` no estén vacíos.
3. Envía el contenido al microservicio FastAPI mediante `POST /predecir`.
4. Devuelve al frontend la categoría, la probabilidad y la información adicional.
5. Traduce los errores de comunicación con FastAPI a respuestas HTTP.

La implementación vigente se encuentra principalmente en `api/src/main/java/com/techmind/api/controller/ContenidoController.java` y utiliza `RestTemplate` con tiempos de conexión y lectura configurados. La entrada pública es `ContenidoEntrada`; la respuesta contiene `categoria`, `probabilidad` e `informaciones_adicionales`.

La carpeta `servicios/` contiene DTOs y servicios de referencia o trabajo separado. No es el módulo que se ejecuta con `api/.\mvnw.cmd spring-boot:run`.

### Microservicio FastAPI y modelo ML

FastAPI expone `POST /predecir`. El servicio valida el contenido con Pydantic, carga `model.joblib` y `vectorizer.joblib`, transforma el título y el texto en vectores y obtiene la categoría y la probabilidad del modelo.

### OCI Object Storage

OCI Object Storage se utiliza para almacenar y descargar los archivos del modelo cuando no están disponibles localmente. La configuración se realiza mediante las variables `OCI_USER`, `OCI_FINGERPRINT`, `OCI_TENANCY`, `OCI_REGION`, `OCI_NAMESPACE`, `OCI_BUCKET_NAME` y `OCI_KEY_CONTENT` en `microservicio/.env`.

## Flujo de una clasificación

```text
Usuario
  |
  v
Frontend React/Vite :5173
  |
  | POST /contenido
  v
API Spring Boot :8080
  |
  | POST /predecir
  v
FastAPI + modelo ML :8000
  |
  | model.joblib / vectorizer.joblib
  v
OCI Object Storage, cuando se requiere descargar los modelos
```

## Contrato de la API

### Solicitud de clasificación

```http
POST http://127.0.0.1:8080/contenido
Content-Type: application/json
```

```json
{
  "titulo": "Introducción a Spring Boot",
  "texto": "En este contenido se presentan los conceptos básicos para crear APIs REST utilizando Java y Spring Boot."
}
```

### Respuesta exitosa

```json
{
  "categoria": "Backend",
  "probabilidad": 0.89,
  "informaciones_adicionales": ["spring", "java", "api"]
}
```

La probabilidad se expresa como un valor entre `0` y `1`. El frontend la muestra como porcentaje: `0.89` equivale a `89%`.

### Validaciones y errores

- `400 Bad Request`: título o texto vacío.
- `422 Unprocessable Entity`: el microservicio rechaza el contenido, por ejemplo cuando el texto tiene menos de 15 o más de 5000 caracteres.
- `502 Bad Gateway`: respuesta inválida o error HTTP del microservicio.
- `504 Gateway Timeout`: el microservicio tarda demasiado en responder.
- `503 Service Unavailable`: error de comunicación no clasificado como timeout.

El formato de error del controlador actual puede ser:

```json
{
  "categoria": "Error",
  "probabilidad": 0.0,
  "informaciones_adicionales": ["El título no puede estar vacío"]
}
```

## Versiones y dependencias principales

### Backend Java

- Java 21.
- Spring Boot 3.3.5.
- `spring-boot-starter-web` para exponer la API REST.
- `spring-boot-starter-validation` para validar la entrada con Jakarta Validation.
- `spring-boot-starter-test` para las pruebas del backend.

El proyecto incluye Maven Wrapper, por lo que no es necesario instalar Maven por separado para ejecutar el backend:

```powershell
cd api
.\mvnw.cmd test
```

### Microservicio Python

Las versiones de FastAPI, Uvicorn, Pydantic, scikit-learn, joblib, OCI y sus dependencias están fijadas en `microservicio/requirements.txt`.

### Frontend

Las dependencias de React, Vite, TypeScript, Tailwind y los componentes de interfaz están definidas en `frontend/package.json` y `frontend/pnpm-lock.yaml`.

## Checklist de requisitos

Antes de iniciar, comprobar:

- [ ] Sistema operativo con PowerShell en Windows o una terminal compatible.
- [ ] Java 21 instalado y disponible en `PATH`.
- [ ] Python 3.11 o superior instalado y disponible en `PATH`.
- [ ] Node.js 18 o superior instalado, con `npm` disponible en `PATH`.
- [ ] El repositorio fue clonado completo.
- [ ] Los puertos `8000`, `8080` y `5173` están libres.
- [ ] Existe `microservicio/models/model.joblib`.
- [ ] Existe `microservicio/models/vectorizer.joblib`.
- [ ] Hay acceso a OCI y un `microservicio/.env` válido si los modelos deben descargarse desde Object Storage.

Comprobar versiones:

```powershell
java -version
python --version
node --version
npm --version
```

## Orden exacto de inicio

Abrir tres terminales, ubicadas en la raíz del repositorio, y mantenerlas abiertas.

### 1. Microservicio FastAPI

```powershell
cd microservicio
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Comprobar en el navegador: http://127.0.0.1:8000/docs

### 2. API Spring Boot

En una segunda terminal:

```powershell
cd api
.\mvnw.cmd spring-boot:run
```

La API queda en `http://127.0.0.1:8080`.

### 3. Frontend

En una tercera terminal:

```powershell
cd frontend
npm install
npm run dev -- --host 127.0.0.1
```

Abrir http://localhost:5173.

El proxy de Vite envía `/contenido` al backend en 8080 y `/docs` y `/openapi.json` al microservicio en 8000. Por eso no se debe cambiar solamente la URL del navegador: si se cambia un puerto, también hay que actualizar la configuración correspondiente.

## Pasos para una máquina nueva

1. Instalar Java 21, Python 3.11+ y Node.js 18+.
2. Clonar el repositorio:

   ```powershell
   git clone <URL_DEL_REPOSITORIO>
   cd G9-tech-mind-team-31-feature-frontend
   ```

3. Entrar en `microservicio` y crear el entorno virtual.
4. Instalar `microservicio/requirements.txt`.
5. Configurar los modelos, siguiendo la sección [Fallback sin OCI](#fallback-sin-oci).
6. Iniciar FastAPI, después Spring Boot y finalmente Vite, en ese orden.
7. Abrir el frontend y enviar un contenido con un `texto` de entre 15 y 5000 caracteres.

Para una instalación reproducible, no se debe copiar la carpeta `venv` desde otro equipo. Hay que crearla de nuevo con la versión local de Python e instalar las dependencias desde `requirements.txt`. De la misma forma, ejecutar `npm install` usando el `package.json` y el lockfile del frontend.

## Fallback sin OCI

El microservicio puede trabajar con los archivos locales del modelo, pero el código actual intenta inicializar el cliente OCI y descargar los archivos durante la importación de `predictor.py`. Por lo tanto, **en el estado actual del repositorio no alcanza con tener los archivos locales si no hay configuración OCI**: el arranque puede fallar antes de usarlos.

### Opción recomendada: usar OCI

Crear `microservicio/.env` a partir de `.env.example` y completar las credenciales reales:

```text
OCI_USER=...
OCI_FINGERPRINT=...
OCI_TENANCY=...
OCI_REGION=...
OCI_NAMESPACE=...
OCI_BUCKET_NAME=...
OCI_KEY_CONTENT=...
```

No subir `.env` al repositorio ni compartir la clave privada. Al iniciar, el servicio descargará `model.joblib` y `vectorizer.joblib` desde el bucket configurado.

### Opción local de contingencia

Colocar estos dos archivos en `microservicio/models/`:

```text
microservicio/models/model.joblib
microservicio/models/vectorizer.joblib
```

Después, el código debe estar preparado para detectar primero esos archivos y solo consultar OCI cuando falte alguno. Si el equipo necesita usar este modo en una máquina sin OCI, hay que aplicar esa modificación antes de arrancar; no se recomienda eliminar las credenciales del `.env` esperando que el comportamiento actual haga el fallback automáticamente.

Si no existen ni los archivos locales ni una configuración OCI válida, el error esperado es de carga del modelo. Ese problema no se soluciona reiniciando Spring Boot: primero hay que resolver el origen de los modelos.

## Puerto 8080 ocupado

El backend Spring Boot usa el puerto 8080. Si aparece `Port 8080 was already in use`, identificar el proceso en PowerShell:

```powershell
Get-NetTCPConnection -LocalPort 8080 -State Listen | Select-Object LocalAddress,LocalPort,OwningProcess
Get-Process -Id <PID>
```

Si es un proceso anterior de este proyecto, detenerlo:

```powershell
Stop-Process -Id <PID>
```

Volver a iniciar:

```powershell
cd api
.\mvnw.cmd spring-boot:run
```

Como alternativa temporal, iniciar Spring en otro puerto:

```powershell
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.arguments=--server.port=8081"
```

En ese caso también hay que cambiar el destino del proxy `/contenido` en `frontend/vite.config.ts` de `8080` a `8081`, reiniciar Vite y volver a abrir el frontend. El microservicio sigue usando 8000.

## Pruebas rápidas de funcionamiento

### Microservicio

```powershell
Invoke-WebRequest http://127.0.0.1:8000/docs
```

### Clasificación directa contra FastAPI

```powershell
$body = @{
  titulo = "Introduccion a Spring Boot"
  texto = "Conceptos basicos para crear APIs REST con Java y Spring Boot."
} | ConvertTo-Json

Invoke-RestMethod http://127.0.0.1:8000/predecir -Method Post -ContentType "application/json" -Body $body
```

### Flujo completo a través de Spring Boot

```powershell
Invoke-RestMethod http://127.0.0.1:8080/contenido -Method Post -ContentType "application/json" -Body $body
```

Casos que deben comprobarse:

- contenido válido: `200 OK`;
- título o texto vacío: `400 Bad Request`;
- microservicio caído o inaccesible: respuesta de error de la API;
- demora del microservicio: `504 Gateway Timeout` según el controlador actual;
- texto demasiado corto o largo: rechazo de validación.

## Solución de problemas

### PowerShell bloquea la activación del entorno virtual

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\venv\Scripts\Activate.ps1
```

### FastAPI no encuentra `app`

Ejecutar Uvicorn desde la carpeta `microservicio` usando:

```powershell
python -m uvicorn app.main:app --port 8000
```

### El frontend usa otro puerto

Vite puede cambiar de 5173 si está ocupado. Usar la URL exacta que muestra la terminal. Los puertos 8000 y 8080 sí deben revisarse explícitamente porque son los destinos configurados para la comunicación interna.

### El backend compila, pero no inicia

Revisar primero el mensaje final de Maven. Si menciona el puerto, resolverlo con la sección [Puerto 8080 ocupado](#puerto-8080-ocupado). Si menciona el microservicio, iniciar FastAPI antes de probar `POST /contenido`.
