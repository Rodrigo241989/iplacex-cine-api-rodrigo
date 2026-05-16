
import { ObjectId } from "mongodb";

import { getDB } from "../common/db.js";

import { validarPelicula, crearDocumentoPelicula } from "./pelicula.model.js";


const COLLECTION = "peliculas";


async function crearPelicula(req, res) {
  try {
 
    const resultado = validarPelicula(req.body);

 
    if (!resultado.valido) {
      return res.status(400).json({
        mensaje: "Error de validación",
        errores: resultado.errores,
      });
    }

    const documento = crearDocumentoPelicula(resultado.datos);

    const db = getDB();
    const resultadoInsert = await db.collection(COLLECTION).insertOne(documento);

    return res.status(201).json({
      ...documento,
      _id: resultadoInsert.insertedId,
    });
  } catch (error) {
    console.error("Error al crear película:", error.message);
    return res.status(500).json({
      mensaje: "Error interno del servidor al crear la película",
      error: error.message,
    });
  }
}

async function listarPeliculas(req, res) {
  try {
    const db = getDB();

    const peliculas = await db.collection(COLLECTION).find().toArray();

    return res.status(200).json(peliculas);
  } catch (error) {
    console.error("Error al listar películas:", error.message);
    return res.status(500).json({
      mensaje: "Error interno del servidor al listar las películas",
      error: error.message,
    });
  }
}

async function obtenerPeliculaPorId(req, res) {
  try {
    let objectId;
    try {
      objectId = new ObjectId(req.params.id);
    } catch (errorId) {
      return res.status(400).json({
        mensaje: "El ID proporcionado no es un ObjectId válido de MongoDB",
      });
    }

    const db = getDB();
    const pelicula = await db.collection(COLLECTION).findOne({ _id: objectId });

    if (!pelicula) {
      return res.status(404).json({
        mensaje: "Película no encontrada con el ID proporcionado",
      });
    }

    return res.status(200).json(pelicula);
  } catch (error) {
    console.error("Error al obtener película por ID:", error.message);
    return res.status(500).json({
      mensaje: "Error interno del servidor al buscar la película",
      error: error.message,
    });
  }
}

async function actualizarPelicula(req, res) {
  try {
    let objectId;
    try {
      objectId = new ObjectId(req.params.id);
    } catch (errorId) {
      return res.status(400).json({
        mensaje: "El ID proporcionado no es un ObjectId válido de MongoDB",
      });
    }

    const datosActualizar = req.body;

    if (!datosActualizar || Object.keys(datosActualizar).length === 0) {
      return res.status(400).json({
        mensaje: "Debe enviar al menos un campo para actualizar",
      });
    }

    const db = getDB();
    const resultado = await db
      .collection(COLLECTION)
      .updateOne({ _id: objectId }, { $set: datosActualizar });

    if (resultado.matchedCount === 0) {
      return res.status(404).json({
        mensaje: "Película no encontrada con el ID proporcionado",
      });
    }

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

async function eliminarPelicula(req, res) {
  try {
    let objectId;
    try {
      objectId = new ObjectId(req.params.id);
    } catch (errorId) {
      return res.status(400).json({
        mensaje: "El ID proporcionado no es un ObjectId válido de MongoDB",
      });
    }

    const db = getDB();
    const resultado = await db
      .collection(COLLECTION)
      .deleteOne({ _id: objectId });

    if (resultado.deletedCount === 0) {
      return res.status(404).json({
        mensaje: "Película no encontrada con el ID proporcionado",
      });
    }

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

export {
  crearPelicula,
  listarPeliculas,
  obtenerPeliculaPorId,
  actualizarPelicula,
  eliminarPelicula,
};
