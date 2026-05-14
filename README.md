# 🎬 API REST - Gestión de Cine (Películas y Actores)

[![Licencia Apache 2.0](https://img.shields.io/badge/Licencia-Apache%202.0-blue.svg)](LICENSE)

API REST desarrollada con **Node.js**, **Express** y **MongoDB Atlas** para gestionar una base de datos de películas y actores. Proyecto del Examen Final de Programación Web Services - IPLACEX.

## 📋 Descripción

Esta API permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre:
- **Películas**: título, director, año, género, duración
- **Actores**: nombre, apellido, edad, nacionalidad, película asociada

Los actores están relacionados con películas mediante referencia por `peliculaId`.

## 🛠️ Tecnologías Usadas

| Tecnología | Versión | Descripción |
|-----------|---------|-------------|
| Node.js | 18+ | Entorno de ejecución JavaScript |
| Express | 5.x | Framework web para Node.js |
| MongoDB Atlas | - | Base de datos NoSQL en la nube |
| Driver MongoDB | 7.x | Driver nativo de MongoDB para Node.js |
| CORS | 2.x | Middleware para peticiones cross-origin |

## 📁 Estructura del Proyecto

```
cine-api/
├── server.js                    # Punto de entrada del servidor
├── package.json                 # Dependencias y scripts
├── .env.example                 # Ejemplo de variables de entorno
├── .gitignore                   # Archivos excluidos de Git
├── LICENSE                      # Licencia Apache 2.0
├── README.md                    # Este archivo
├── DEPLOYMENT.md                # Guía de despliegue en Render
└── src/
    ├── common/
    │   └── db.js                # Conexión a MongoDB Atlas
    ├── pelicula/
    │   ├── pelicula.model.js    # Modelo y validación de películas
    │   ├── pelicula.controller.js # Controlador CRUD de películas
    │   └── pelicula.routes.js   # Rutas de películas
    └── actor/
        ├── actor.model.js       # Modelo y validación de actores
        ├── actor.controller.js  # Controlador CRUD de actores
        └── actor.routes.js      # Rutas de actores
```

## 🚀 Instalación Local

### Prerrequisitos
- [Node.js](https://nodejs.org/) versión 18 o superior
- Cuenta en [MongoDB Atlas](https://cloud.mongodb.com/) con un clúster configurado

### Pasos

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/TU_USUARIO/iplacex-cine-api-rodrigo.git
   cd iplacex-cine-api-rodrigo
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   ```bash
   # Copiar el archivo de ejemplo
   cp .env.example .env
   
   # Editar .env con tu URI de MongoDB Atlas
   # MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/cine_db
   ```

4. **Iniciar el servidor:**
   ```bash
   # Modo producción
   npm start
   
   # Modo desarrollo (con auto-recarga)
   npm run dev
   ```

5. **Verificar funcionamiento:**
   - Abrir en el navegador: `http://localhost:3000`
   - Respuesta esperada: `{"mensaje": "🎬 API Cine funcionando correctamente"}`

## 📡 Endpoints de la API

### 🎬 Películas (`/api/peliculas`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/peliculas` | Crear una película |
| `GET` | `/api/peliculas` | Listar todas las películas |
| `GET` | `/api/peliculas/:id` | Obtener película por ID |
| `PUT` | `/api/peliculas/:id` | Actualizar película |
| `DELETE` | `/api/peliculas/:id` | Eliminar película |

**Ejemplo de body para crear película:**
```json
{
  "titulo": "El Padrino",
  "director": "Francis Ford Coppola",
  "anio": 1972,
  "genero": "Drama",
  "duracion": 175
}
```

### 🎭 Actores (`/api/actores`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/actores` | Crear un actor |
| `GET` | `/api/actores` | Listar todos los actores |
| `GET` | `/api/actores/:id` | Obtener actor por ID |
| `GET` | `/api/actores/pelicula/:peliculaId` | Obtener actores por película |

**Ejemplo de body para crear actor:**
```json
{
  "nombre": "Marlon",
  "apellido": "Brando",
  "edad": 80,
  "nacionalidad": "Estadounidense",
  "nombrePelicula": "El Padrino"
}
```

## ⚙️ Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `MONGODB_URI` | URI de conexión a MongoDB Atlas | `mongodb+srv://user:pass@cluster.mongodb.net/cine_db` |
| `PORT` | Puerto del servidor (opcional, default: 3000) | `3000` |

## 🌐 Despliegue en Render

Para instrucciones detalladas de despliegue, consulta [DEPLOYMENT.md](DEPLOYMENT.md).

**Resumen rápido:**
1. Subir código a GitHub
2. Crear Web Service en Render (región Frankfurt)
3. Configurar variable `MONGODB_URI` en Render
4. Build Command: `npm install`
5. Start Command: `node server.js`

## 🔗 Enlaces

- **Repositorio GitHub:** [https://github.com/TU_USUARIO/iplacex-cine-api-rodrigo](https://github.com/TU_USUARIO/iplacex-cine-api-rodrigo)
- **API en Render:** [https://iplacex-cine-api-rodrigo.onrender.com](https://iplacex-cine-api-rodrigo.onrender.com)

## 👤 Autor

**Rodrigo Gómez Moyano**  
Programación Web Services - IPLACEX 2026

## 📄 Licencia

Este proyecto está bajo la Licencia Apache 2.0 - ver el archivo [LICENSE](LICENSE) para más detalles.
