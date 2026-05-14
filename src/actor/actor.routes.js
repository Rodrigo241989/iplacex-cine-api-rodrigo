// ============================================================
// actor.routes.js - Rutas de Actores
// ============================================================
// Define las rutas (endpoints) para el CRUD de actores.
// Cada ruta se conecta con una función del controlador.
//
// Rutas definidas:
// POST /                       → Crear un nuevo actor
// GET  /                       → Listar todos los actores
// GET  /:id                    → Obtener un actor por su ID
// GET  /pelicula/:peliculaId   → Filtrar actores por película
//
// Nota: Estas rutas se montan con prefijo "/api/actores"
// en server.js, por lo que la ruta completa sería:
// POST /api/actores, GET /api/actores, etc.
// ============================================================

import { Router } from "express";
// Importamos las funciones del controlador de actores
import {
  crearActor,
  listarActores,
  obtenerActorPorId,
  obtenerActoresPorPelicula,
} from "./actor.controller.js";

// Creamos un router de Express
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
