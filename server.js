
import 'dotenv/config';

import express from "express";
import cors from "cors";
import { connectDB } from "./src/common/db.js";

import peliculaRoutes from "./src/pelicula/pelicula.routes.js";
import actorRoutes from "./src/actor/actor.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ mensaje: "API Cine funcionando correctamente" });
});


app.use("/api/peliculas", peliculaRoutes);

app.use("/api/actores", actorRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n Servidor corriendo en http://localhost:${PORT}`);
      console.log(`API lista para recibir peticiones\n`);
      console.log(`Endpoints disponibles:`);
      console.log(`   ──────────────────────────────────────────────────`);
      console.log(`   GET    http://localhost:${PORT}/                          → Ruta de prueba`);
      console.log(`   ──────────────────────────────────────────────────`);
      console.log(`   PELÍCULAS:`);
      console.log(`   POST   http://localhost:${PORT}/api/peliculas            → Crear película`);
      console.log(`   GET    http://localhost:${PORT}/api/peliculas            → Listar películas`);
      console.log(`   GET    http://localhost:${PORT}/api/peliculas/:id        → Obtener película por ID`);
      console.log(`   PUT    http://localhost:${PORT}/api/peliculas/:id        → Actualizar película`);
      console.log(`   DELETE http://localhost:${PORT}/api/peliculas/:id        → Eliminar película`);
      console.log(`   ──────────────────────────────────────────────────`);
      console.log(`   ACTORES:`);
      console.log(`   POST   http://localhost:${PORT}/api/actores              → Crear actor`);
      console.log(`   GET    http://localhost:${PORT}/api/actores              → Listar actores`);
      console.log(`   GET    http://localhost:${PORT}/api/actores/:id          → Obtener actor por ID`);
      console.log(`   GET    http://localhost:${PORT}/api/actores/pelicula/:id → Actores por película`);
      console.log(`   ──────────────────────────────────────────────────\n`);
    });
  })
  .catch((error) => {
    console.error("Error al conectar con MongoDB:", error.message);
    process.exit(1); 
  });
