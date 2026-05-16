

import { Router } from "express";

import {
  crearPelicula,
  listarPeliculas,
  obtenerPeliculaPorId,
  actualizarPelicula,
  eliminarPelicula,
} from "./pelicula.controller.js";


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
