// ============================================================
// pelicula.routes.js - Rutas de Películas
// ============================================================
// Define las rutas (endpoints) para el CRUD de películas.
// Cada ruta se conecta con una función del controlador.
//
// Rutas definidas:
// POST   /              → Crear una nueva película
// GET    /              → Listar todas las películas
// GET    /:id           → Obtener una película por su ID
// PUT    /:id           → Actualizar una película por su ID
// DELETE /:id           → Eliminar una película por su ID
//
// Nota: Estas rutas se montan con prefijo "/api/peliculas"
// en server.js, por lo que la ruta completa sería:
// POST /api/peliculas, GET /api/peliculas, etc.
// ============================================================

import { Router } from "express";
// Importamos las funciones del controlador de películas
import {
  crearPelicula,
  listarPeliculas,
  obtenerPeliculaPorId,
  actualizarPelicula,
  eliminarPelicula,
} from "./pelicula.controller.js";

// Creamos un router de Express (similar a @RequestMapping en Spring Boot)
const router = Router();

// --- Definición de rutas ---

// POST / → Crear una nueva película
// Ejemplo: POST http://localhost:3000/api/peliculas
// Body: { "titulo": "...", "director": "...", "anio": 2024, "genero": "...", "duracion": 120 }
router.post("/", crearPelicula);

// GET / → Listar todas las películas
// Ejemplo: GET http://localhost:3000/api/peliculas
router.get("/", listarPeliculas);

// GET /:id → Obtener una película por su ID
// Ejemplo: GET http://localhost:3000/api/peliculas/6651abc123def456789
router.get("/:id", obtenerPeliculaPorId);

// PUT /:id → Actualizar una película por su ID
// Ejemplo: PUT http://localhost:3000/api/peliculas/6651abc123def456789
// Body: { "titulo": "Nuevo título" }
router.put("/:id", actualizarPelicula);

// DELETE /:id → Eliminar una película por su ID
// Ejemplo: DELETE http://localhost:3000/api/peliculas/6651abc123def456789
router.delete("/:id", eliminarPelicula);

export default router;
