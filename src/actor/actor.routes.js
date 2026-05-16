

import { Router } from "express";

import {
  crearActor,
  listarActores,
  obtenerActorPorId,
  obtenerActoresPorPelicula,
} from "./actor.controller.js";


const router = Router();

// --- Definición de rutas ---

// POST / → Crear un nuevo actor
// Ejemplo: POST http://localhost:3000/api/actores
// Body: { "nombre": "...", "apellido": "...", "edad": 30, "nacionalidad": "...", "nombrePelicula": "..." }
router.post("/", crearActor);

// GET / → Listar todos los actores
// Ejemplo: GET http://localhost:3000/api/actores
router.get("/", listarActores);

// GET /pelicula/:peliculaId → Obtener actores por película
// ⚠️ IMPORTANTE: Esta ruta DEBE ir ANTES de /:id
// porque Express evalúa las rutas en orden, y si /:id va primero,
// interpretaría "pelicula" como un id y fallaría.
// Ejemplo: GET http://localhost:3000/api/actores/pelicula/6651abc123def456789
router.get("/pelicula/:peliculaId", obtenerActoresPorPelicula);

// GET /:id → Obtener un actor por su ID
// Ejemplo: GET http://localhost:3000/api/actores/6651abc123def456789
router.get("/:id", obtenerActorPorId);

export default router;
