
import { ObjectId } from "mongodb";

import { getDB } from "../common/db.js";

import { validarActor, crearDocumentoActor } from "./actor.model.js";

const COLLECTION = "actores";
const COLLECTION_PELICULAS = "peliculas";


async function crearActor(req, res) {
  try {
    const db = getDB();

   
    const { nombrePelicula, ...datosActor } = req.body;

    if (!nombrePelicula || typeof nombrePelicula !== "string") {
      return res.status(400).json({
        mensaje:
          "El campo 'nombrePelicula' es requerido para asociar el actor a una película existente",
      });
    }

    const pelicula = await db.collection(COLLECTION_PELICULAS).findOne({
      titulo: { $regex: new RegExp(`^${nombrePelicula.trim()}$`, "i") },
    });

    if (!pelicula) {
      return res.status(400).json({
        mensaje: `La película '${nombrePelicula}' no fue encontrada en la base de datos. Debe crear la película primero.`,
      });
    }

    datosActor.peliculaId = pelicula._id;

    const resultado = validarActor(datosActor);

    if (!resultado.valido) {
      return res.status(400).json({
        mensaje: "Error de validación",
        errores: resultado.errores,
      });
    }

    const documento = crearDocumentoActor(resultado.datos);
    const resultadoInsert = await db
      .collection(COLLECTION)
      .insertOne(documento);

    return res.status(201).json({
      ...documento,
      _id: resultadoInsert.insertedId,
    });
  } catch (error) {
    console.error("Error al crear actor:", error.message);
    return res.status(500).json({
      mensaje: "Error interno del servidor al crear el actor",
      error: error.message,
    });
  }
}

async function listarActores(req, res) {
  try {

    const db = getDB();


    const actores = await db.collection(COLLECTION).find().toArray();

    return res.status(200).json(actores);
  } catch (error) {
    console.error("Error al listar actores:", error.message);
    return res.status(500).json({
      mensaje: "Error interno del servidor al listar los actores",
      error: error.message,
    });
  }
}

async function obtenerActorPorId(req, res) {
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
    const actor = await db.collection(COLLECTION).findOne({ _id: objectId });

    if (!actor) {
      return res.status(404).json({
        mensaje: "Actor no encontrado con el ID proporcionado",
      });
    }

    return res.status(200).json(actor);
  } catch (error) {
    console.error("Error al obtener actor por ID:", error.message);
    return res.status(500).json({
      mensaje: "Error interno del servidor al buscar el actor",
      error: error.message,
    });
  }
}

async function obtenerActoresPorPelicula(req, res) {
  try {
    let peliculaObjectId;
    try {
      peliculaObjectId = new ObjectId(req.params.peliculaId);
    } catch (errorId) {
      return res.status(400).json({
        mensaje:
          "El peliculaId proporcionado no es un ObjectId válido de MongoDB",
      });
    }

    const db = getDB();
    const actores = await db
      .collection(COLLECTION)
      .find({ peliculaId: peliculaObjectId })
      .toArray();

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

export {
  crearActor,
  listarActores,
  obtenerActorPorId,
  obtenerActoresPorPelicula,
};
