# Cómo trabajar en este repo

Guía corta para que todos trabajemos sin pisarnos el código. Por favor leerla antes de empezar.

## 1. Nunca trabajes directo en "main"

"main" es la rama principal del proyecto. Tiene que quedar siempre funcionando bien, por eso nadie sube cambios ahí directamente.

Cada equipo tiene su propia rama:

- feature/data-science (equipo de Ciencia de Datos)
- feature/api (equipo de Backend/API)
- feature/microservicio (equipo de Microservicio/DevOps)

## 2. Para cada tarea, creá tu propia rama

No trabajes directo en la rama de tu equipo tampoco. Antes de empezar una tarea, creá una rama nueva desde la rama de tu equipo.

Ejemplo, si sos del equipo de microservicio:

```
git checkout feature/microservicio
git pull origin feature/microservicio
git checkout -b feature/microservicio-endpoint-mock
```

Ponele un nombre simple que diga qué estás haciendo. Ejemplos:

- feature/data-science-dataset
- feature/api-endpoint-contenido
- feature/microservicio-conexion-oci

## 3. Cuando termines tu tarea

1. Subí tu rama: git push origin nombre-de-tu-rama
2. Pedí que la junten con la rama de tu equipo (esto se llama Pull Request, se hace desde GitHub, no desde la terminal)
3. Avisá en Discord antes de juntarla, por si alguien más está trabajando en algo relacionado

## 4. Cómo escribir los mensajes de commit

Un commit es cada vez que guardás un cambio en Git. Para que se entienda qué hizo cada uno, escribimos los mensajes así:

```
tipo: qué hiciste, corto y en inglés
```

Los tipos más comunes:

- feat: cuando agregás algo nuevo
- fix: cuando arreglás un error
- docs: cuando cambiás solo documentación (como este archivo)

Ejemplos:

```
feat: add endpoint to receive text
fix: handle empty text field
docs: update readme
```

Evitar mensajes como "cambios", "arreglos" o "version final".

## 5. Sobre el archivo .gitignore

Este archivo le dice a Git qué archivos NO subir al repo (como contraseñas o archivos que genera tu compu automáticamente). Ya está configurado y es obligatorio respetarlo.

No lo modifiques por tu cuenta. Si necesitás agregar algo, avisá al grupo antes.

## 6. No toques la carpeta de otro equipo

Cada equipo tiene su carpeta:

- notebook (Ciencia de Datos)
- microservicio (Microservicio/DevOps)
- api (Backend)

Si necesitás que algo cambie en una carpeta que no es la tuya, hablalo primero con ese equipo. No lo edites directamente vos.

## 7. Antes de pedir que revisen tu trabajo

- Probá que tu código funciona
- Fijate que no subiste archivos que no debías (contraseñas, configuraciones personales)
- Escribí 2 o 3 líneas contando qué hiciste