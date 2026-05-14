// ============================================================
// pelicula.controller.js - Controlador de Películas
// ============================================================
// Este archivo contiene las funciones CRUD para la colección
// "peliculas" en MongoDB. Cada función maneja un endpoint
// específico de la API REST.
//
// Endpoints implementados:
// - POST   /api/peliculas       → crearPelicula
// - GET    /api/peliculas       → listarPeliculas
// - GET    /api/peliculas/:id   → obtenerPeliculaPorId
// - PUT    /api/peliculas/:id   → actualizarPelicula
// - DELETE /api/peliculas/:id   → eliminarPelicula
// ============================================================

// --- Importaciones ---
// ObjectId: clase de MongoDB para trabajar con identificadores únicos
import { ObjectId } from "mongodb";
// getDB: función que retorna la referencia a la base de datos conectada
import { getDB } from "../common/db.js";
// Funciones de validación y creación de documentos del modelo
import { validarPelicula, crearDocumentoPelicula } from "./pelicula.model.js";

// Nombre de la colección en MongoDB
const COLLECTION = "peliculas";

// ============================================================
// crearPelicula - POST /api/peliculas
// ============================================================
// Crea una nueva película en la base de datos.
// Valida los datos recibidos antes de insertar.
// Retorna 201 con el documento creado (incluyendo _id).
// ============================================================
async function crearPelicula(req, res) {
  try {
    // Paso 1: Validar los datos recibidos en el body de la petición
    const resultado = validarPelicula(req.body);

    // Si la validación falla, retornamos 400 (Bad Request) con los errores
    if (!resultado.valido) {
      return res.status(400).json({
        mensaje: "Error de validación",
        errores: resultado.errores,
      });
    }

    // Paso 2: Crear el documento limpio para insertar en MongoDB
    const documento = crearDocumentoPelicula(resultado.datos);

    // Paso 3: Obtener referencia a la base de datos e insertar
    const db = getDB();
    const resultadoInsert = await db.collection(COLLECTION).insertOne(documento);

    // Paso 4: Retornar 201 (Created) con el documento creado
    // Agregamos el _id generado por MongoDB al documento
    return res.status(201).json({
      ...documento,
      _id: resultadoInsert.insertedId,
    });
  } catch (error) {
    // Si ocurre un error inesperado, retornamos 500 (Internal Server Error)
    console.error("Error al crear película:", error.message);
    return res.status(500).json({
      mensaje: "Error interno del servidor al crear la película",
      error: error.message,
    });
  }
}

// ============================================================
// listarPeliculas - GET /api/peliculas
// ============================================================
// Obtiene todas las películas almacenadas en la colección.
// Retorna 200 con un array de películas.
// ============================================================
async function listarPeliculas(req, res) {
  try {
    // Obtener referencia a la base de datos
    const db = getDB();

    // Buscar todos los documentos de la colección "peliculas"
    // .toArray() convierte el cursor de MongoDB a un array de JavaScript
    const peliculas = await db.collection(COLLECTION).find().toArray();

    // Retornar 200 (OK) con el array de películas
    return res.status(200).json(peliculas);
  } catch (error) {
    console.error("Error al listar películas:", error.message);
    return res.status(500).json({
      mensaje: "Error interno del servidor al listar las películas",
      error: error.message,
    });
  }
}

// ============================================================
// obtenerPeliculaPorId - GET /api/peliculas/:id
// ============================================================
// Busca una película específica por su _id en MongoDB.
// Si no existe, retorna 404. Si existe, retorna 200.
// ============================================================
async function obtenerPeliculaPorId(req, res) {
  try {
    // Paso 1: Convertir el parámetro "id" de la URL a ObjectId de MongoDB
    // Esto puede fallar si el id no tiene el formato correcto (24 caracteres hex)
    let objectId;
    try {
      objectId = new ObjectId(req.params.id);
    } catch (errorId) {
      // Si el formato del ID no es válido, retornamos 400
      return res.status(400).json({
        mensaje: "El ID proporcionado no es un ObjectId válido de MongoDB",
      });
    }

    // Paso 2: Buscar la película en la colección por su _id
    const db = getDB();
    const pelicula = await db.collection(COLLECTION).findOne({ _id: objectId });

    // Paso 3: Verificar si se encontró la película
    if (!pelicula) {
      return res.status(404).json({
        mensaje: "Película no encontrada con el ID proporcionado",
      });
    }

    // Paso 4: Retornar 200 con el documento encontrado
    return res.status(200).json(pelicula);
  } catch (error) {
    console.error("Error al obtener película por ID:", error.message);
    return res.status(500).json({
      mensaje: "Error interno del servidor al buscar la película",
      error: error.message,
    });
  }
}

// ============================================================
// actualizarPelicula - PUT /api/peliculas/:id
// ============================================================
// Actualiza una película existente usando el operador $set.
// Solo modifica los campos enviados en el body.
// Retorna 200 si se actualizó o 404 si no existe.
// ============================================================
async function actualizarPelicula(req, res) {
  try {
    // Paso 1: Convertir el parámetro "id" a ObjectId
    let objectId;
    try {
      objectId = new ObjectId(req.params.id);
    } catch (errorId) {
      return res.status(400).json({
        mensaje: "El ID proporcionado no es un ObjectId válido de MongoDB",
      });
    }

    // Paso 2: Obtener los datos del body para actualizar
    const datosActualizar = req.body;

    // Verificar que se enviaron datos para actualizar
    if (!datosActualizar || Object.keys(datosActualizar).length === 0) {
      return res.status(400).json({
        mensaje: "Debe enviar al menos un campo para actualizar",
      });
    }

    // Paso 3: Usar updateOne con el operador $set para actualizar
    // $set solo modifica los campos especificados, sin alterar los demás
    const db = getDB();
    const resultado = await db
      .collection(COLLECTION)
      .updateOne({ _id: objectId }, { $set: datosActualizar });

    // Paso 4: Verificar que la película existía (matchedCount > 0)
    if (resultado.matchedCount === 0) {
      return res.status(404).json({
        mensaje: "Película no encontrada con el ID proporcionado",
      });
    }

    // Paso 5: Retornar 200 con mensaje de éxito
    return res.status(200).json({
      mensaje: "Película actualizada exitosamente",
      modificados: resultado.modifiedCount,
    });
  } catch (error) {
    console.error("Error al actualizar película:", error.message);
    return res.status(500).json({
      mensaje: "Error interno del servidor al actualizar la película",
      error: error.message,
    });
  }
}

// ============================================================
// eliminarPelicula - DELETE /api/peliculas/:id
// ============================================================
// Elimina una película de la colección por su _id.
// Retorna 200 si se eliminó o 404 si no existe.
// ============================================================
async function eliminarPelicula(req, res) {
  try {
    // Paso 1: Convertir el parámetro "id" a ObjectId
    let objectId;
    try {
      objectId = new ObjectId(req.params.id);
    } catch (errorId) {
      return res.status(400).json({
        mensaje: "El ID proporcionado no es un ObjectId válido de MongoDB",
      });
    }

    // Paso 2: Ejecutar la eliminación con deleteOne
    const db = getDB();
    const resultado = await db
      .collection(COLLECTION)
      .deleteOne({ _id: objectId });

    // Paso 3: Verificar que se eliminó algún documento (deletedCount > 0)
    if (resultado.deletedCount === 0) {
      return res.status(404).json({
        mensaje: "Película no encontrada con el ID proporcionado",
      });
    }

    // Paso 4: Retornar 200 con mensaje de éxito
    return res.status(200).json({
      mensaje: "Película eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar película:", error.message);
    return res.status(500).json({
      mensaje: "Error interno del servidor al eliminar la película",
      error: error.message,
    });
  }
}

// --- Exportamos todas las funciones del controlador ---
export {
  crearPelicula,
  listarPeliculas,
  obtenerPeliculaPorId,
  actualizarPelicula,
  eliminarPelicula,
};
