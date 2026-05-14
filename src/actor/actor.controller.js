// ============================================================
// actor.controller.js - Controlador de Actores
// ============================================================
// Este archivo contiene las funciones CRUD para la colección
// "actores" en MongoDB. Incluye una validación especial:
// al crear un actor, se verifica que la película asociada
// exista buscándola por nombre en la colección "peliculas".
//
// Endpoints implementados:
// - POST /api/actores                     → crearActor
// - GET  /api/actores                     → listarActores
// - GET  /api/actores/:id                 → obtenerActorPorId
// - GET  /api/actores/pelicula/:peliculaId → obtenerActoresPorPelicula
// ============================================================

// --- Importaciones ---
// ObjectId: clase de MongoDB para trabajar con identificadores únicos
import { ObjectId } from "mongodb";
// getDB: función que retorna la referencia a la base de datos conectada
import { getDB } from "../common/db.js";
// Funciones de validación y creación de documentos del modelo
import { validarActor, crearDocumentoActor } from "./actor.model.js";

// Nombres de las colecciones en MongoDB
const COLLECTION = "actores";
const COLLECTION_PELICULAS = "peliculas";

// ============================================================
// crearActor - POST /api/actores
// ============================================================
// Crea un nuevo actor en la base de datos.
//
// VALIDACIÓN ESPECIAL:
// Antes de crear el actor, busca la película por nombre
// (req.body.nombrePelicula). Si la película no existe en la
// base de datos, retorna un error 400. Si existe, usa su _id
// como peliculaId para establecer la relación entre ambas
// colecciones.
//
// Retorna 201 con el documento creado (incluyendo _id).
// ============================================================
async function crearActor(req, res) {
  try {
    const db = getDB();

    // --- Paso 1: Validar que se envió el nombre de la película ---
    // El campo "nombrePelicula" se usa para buscar la película
    // y obtener su _id automáticamente
    const { nombrePelicula, ...datosActor } = req.body;

    if (!nombrePelicula || typeof nombrePelicula !== "string") {
      return res.status(400).json({
        mensaje:
          "El campo 'nombrePelicula' es requerido para asociar el actor a una película existente",
      });
    }

    // --- Paso 2: Buscar la película por su título en la colección ---
    // Usamos una búsqueda case-insensitive con regex para mayor flexibilidad
    const pelicula = await db.collection(COLLECTION_PELICULAS).findOne({
      titulo: { $regex: new RegExp(`^${nombrePelicula.trim()}$`, "i") },
    });

    // Si la película no existe, retornamos error 400
    if (!pelicula) {
      return res.status(400).json({
        mensaje: `La película '${nombrePelicula}' no fue encontrada en la base de datos. Debe crear la película primero.`,
      });
    }

    // --- Paso 3: Asignar el _id de la película encontrada como peliculaId ---
    // Esto establece la relación entre el actor y la película
    datosActor.peliculaId = pelicula._id;

    // --- Paso 4: Validar los datos del actor usando el modelo ---
    const resultado = validarActor(datosActor);

    // Si la validación falla, retornamos 400 con los errores
    if (!resultado.valido) {
      return res.status(400).json({
        mensaje: "Error de validación",
        errores: resultado.errores,
      });
    }

    // --- Paso 5: Crear el documento limpio e insertar en MongoDB ---
    const documento = crearDocumentoActor(resultado.datos);
    const resultadoInsert = await db
      .collection(COLLECTION)
      .insertOne(documento);

    // --- Paso 6: Retornar 201 (Created) con el actor creado ---
    return res.status(201).json({
      ...documento,
      _id: resultadoInsert.insertedId,
    });
  } catch (error) {
    // Error inesperado: retornamos 500
    console.error("Error al crear actor:", error.message);
    return res.status(500).json({
      mensaje: "Error interno del servidor al crear el actor",
      error: error.message,
    });
  }
}

// ============================================================
// listarActores - GET /api/actores
// ============================================================
// Obtiene todos los actores almacenados en la colección.
// Retorna 200 con un array de actores.
// ============================================================
async function listarActores(req, res) {
  try {
    // Obtener referencia a la base de datos
    const db = getDB();

    // Buscar todos los documentos de la colección "actores"
    const actores = await db.collection(COLLECTION).find().toArray();

    // Retornar 200 (OK) con el array de actores
    return res.status(200).json(actores);
  } catch (error) {
    console.error("Error al listar actores:", error.message);
    return res.status(500).json({
      mensaje: "Error interno del servidor al listar los actores",
      error: error.message,
    });
  }
}

// ============================================================
// obtenerActorPorId - GET /api/actores/:id
// ============================================================
// Busca un actor específico por su _id en MongoDB.
// Si no existe, retorna 404. Si existe, retorna 200.
// ============================================================
async function obtenerActorPorId(req, res) {
  try {
    // Paso 1: Convertir el parámetro "id" de la URL a ObjectId
    let objectId;
    try {
      objectId = new ObjectId(req.params.id);
    } catch (errorId) {
      // Si el formato del ID no es válido, retornamos 400
      return res.status(400).json({
        mensaje: "El ID proporcionado no es un ObjectId válido de MongoDB",
      });
    }

    // Paso 2: Buscar el actor en la colección por su _id
    const db = getDB();
    const actor = await db.collection(COLLECTION).findOne({ _id: objectId });

    // Paso 3: Verificar si se encontró el actor
    if (!actor) {
      return res.status(404).json({
        mensaje: "Actor no encontrado con el ID proporcionado",
      });
    }

    // Paso 4: Retornar 200 con el documento encontrado
    return res.status(200).json(actor);
  } catch (error) {
    console.error("Error al obtener actor por ID:", error.message);
    return res.status(500).json({
      mensaje: "Error interno del servidor al buscar el actor",
      error: error.message,
    });
  }
}

// ============================================================
// obtenerActoresPorPelicula - GET /api/actores/pelicula/:peliculaId
// ============================================================
// Busca todos los actores asociados a una película específica.
// Filtra por el campo peliculaId en la colección de actores.
// Retorna 200 con un array (puede estar vacío si no hay actores).
// ============================================================
async function obtenerActoresPorPelicula(req, res) {
  try {
    // Paso 1: Convertir el parámetro "peliculaId" a ObjectId
    let peliculaObjectId;
    try {
      peliculaObjectId = new ObjectId(req.params.peliculaId);
    } catch (errorId) {
      return res.status(400).json({
        mensaje:
          "El peliculaId proporcionado no es un ObjectId válido de MongoDB",
      });
    }

    // Paso 2: Buscar todos los actores que tengan ese peliculaId
    const db = getDB();
    const actores = await db
      .collection(COLLECTION)
      .find({ peliculaId: peliculaObjectId })
      .toArray();

    // Paso 3: Retornar 200 con el array de actores encontrados
    // El array puede estar vacío si la película no tiene actores asociados
    return res.status(200).json(actores);
  } catch (error) {
    console.error("Error al obtener actores por película:", error.message);
    return res.status(500).json({
      mensaje:
        "Error interno del servidor al buscar actores por película",
      error: error.message,
    });
  }
}

// --- Exportamos todas las funciones del controlador ---
export {
  crearActor,
  listarActores,
  obtenerActorPorId,
  obtenerActoresPorPelicula,
};
