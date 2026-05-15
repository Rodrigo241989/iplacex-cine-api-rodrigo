// ============================================================
// server.js - Punto de entrada de la API REST "cine-api"
// ============================================================
// Este archivo configura Express, los middlewares y levanta
// el servidor solo si la conexión a MongoDB es exitosa.
// ============================================================
import 'dotenv/config';
// --- 1. Importaciones ---
// Express: framework web para crear la API
import express from "express";
// CORS: permite que otros orígenes (ej: Postman, frontend) accedan a la API
import cors from "cors";
// Función de conexión a MongoDB (configurada en db.js)
import { connectDB } from "./src/common/db.js";

// Importar las rutas de cada recurso
import peliculaRoutes from "./src/pelicula/pelicula.routes.js";
import actorRoutes from "./src/actor/actor.routes.js";

// --- 2. Crear la aplicación Express ---
const app = express();

// --- 3. Configurar Middlewares ---
// cors() → Habilita peticiones desde cualquier origen (Cross-Origin Resource Sharing)
app.use(cors());
// express.json() → Permite recibir datos en formato JSON en el body de las peticiones
app.use(express.json());
// express.urlencoded() → Permite recibir datos de formularios HTML (key=value)
app.use(express.urlencoded({ extended: true }));

// --- 4. Ruta de prueba (raíz) ---
// Sirve para verificar rápidamente que el servidor está funcionando
app.get("/", (req, res) => {
  res.json({ mensaje: "🎬 API Cine funcionando correctamente" });
});

// --- 5. Registrar las rutas de la API ---
// Cada router se monta en un prefijo específico
// Todas las rutas de películas estarán bajo /api/peliculas
app.use("/api/peliculas", peliculaRoutes);
// Todas las rutas de actores estarán bajo /api/actores
app.use("/api/actores", actorRoutes);

// --- 6. Puerto del servidor ---
// Render asigna automáticamente un puerto mediante la variable PORT
// En local, usamos 3000 como puerto por defecto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));

// --- 7. Conexión a MongoDB y arranque del servidor ---
// Primero conectamos a la base de datos, y SOLO si la conexión
// es exitosa, levantamos el servidor Express.
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n✅ Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📡 API lista para recibir peticiones\n`);
      console.log(`📋 Endpoints disponibles:`);
      console.log(`   ──────────────────────────────────────────────────`);
      console.log(`   GET    http://localhost:${PORT}/                          → Ruta de prueba`);
      console.log(`   ──────────────────────────────────────────────────`);
      console.log(`   🎬 PELÍCULAS:`);
      console.log(`   POST   http://localhost:${PORT}/api/peliculas            → Crear película`);
      console.log(`   GET    http://localhost:${PORT}/api/peliculas            → Listar películas`);
      console.log(`   GET    http://localhost:${PORT}/api/peliculas/:id        → Obtener película por ID`);
      console.log(`   PUT    http://localhost:${PORT}/api/peliculas/:id        → Actualizar película`);
      console.log(`   DELETE http://localhost:${PORT}/api/peliculas/:id        → Eliminar película`);
      console.log(`   ──────────────────────────────────────────────────`);
      console.log(`   🎭 ACTORES:`);
      console.log(`   POST   http://localhost:${PORT}/api/actores              → Crear actor`);
      console.log(`   GET    http://localhost:${PORT}/api/actores              → Listar actores`);
      console.log(`   GET    http://localhost:${PORT}/api/actores/:id          → Obtener actor por ID`);
      console.log(`   GET    http://localhost:${PORT}/api/actores/pelicula/:id → Actores por película`);
      console.log(`   ──────────────────────────────────────────────────\n`);
    });
  })
  .catch((error) => {
    // Si la conexión a MongoDB falla, mostramos el error y NO levantamos el servidor
    console.error("❌ Error al conectar con MongoDB:", error.message);
    process.exit(1); // Terminamos el proceso con código de error
  });
