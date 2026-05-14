// ============================================================
// actor.model.js - Modelo de datos para Actores
// ============================================================
// Este archivo define la estructura y validación de los
// documentos de la colección "actores" en MongoDB.
//
// ⚠️ NO usamos Mongoose. Las validaciones se hacen manualmente
// usando funciones helper, ya que trabajamos con el driver
// nativo de MongoDB directamente.
//
// Esquema de un actor en la base de datos:
// {
//   _id: ObjectId (generado automáticamente por MongoDB),
//   nombre: string (requerido) - nombre del actor,
//   apellido: string (requerido) - apellido del actor,
//   edad: number (requerido) - edad del actor,
//   nacionalidad: string (requerido) - país de origen,
//   peliculaId: ObjectId (referencia a la colección "peliculas")
// }
//
// 💡 NOTA SOBRE peliculaId:
// Este campo es una REFERENCIA manual a un documento de la
// colección "peliculas". En MongoDB no existen las foreign keys
// como en bases de datos relacionales, pero podemos almacenar
// el _id de una película para establecer la relación.
// ============================================================

import { ObjectId } from "mongodb";

// --- Nombre de la colección en MongoDB ---
const COLLECTION_NAME = "actores";

// ============================================================
// validarActor() - Valida los datos de un actor
// ============================================================
// Recibe un objeto con los datos del actor y verifica que
// todos los campos requeridos estén presentes y tengan el
// tipo de dato correcto.
//
// Parámetros:
//   datos (Object) - objeto con los campos del actor
//
// Retorna:
//   { valido: true, datos: {...} }  si todo está correcto
//   { valido: false, errores: [...] }  si hay errores
// ============================================================
function validarActor(datos) {
  // Array donde acumularemos los mensajes de error encontrados
  const errores = [];

  // --- Validación del campo "nombre" ---
  // Debe ser un string no vacío
  if (!datos.nombre || typeof datos.nombre !== "string") {
    errores.push("El campo 'nombre' es requerido y debe ser un texto (string).");
  } else if (datos.nombre.trim().length === 0) {
    errores.push("El campo 'nombre' no puede estar vacío.");
  }

  // --- Validación del campo "apellido" ---
  // Debe ser un string no vacío
  if (!datos.apellido || typeof datos.apellido !== "string") {
    errores.push("El campo 'apellido' es requerido y debe ser un texto (string).");
  } else if (datos.apellido.trim().length === 0) {
    errores.push("El campo 'apellido' no puede estar vacío.");
  }

  // --- Validación del campo "edad" ---
  // Debe ser un número entero positivo razonable
  if (datos.edad === undefined || datos.edad === null) {
    errores.push("El campo 'edad' es requerido.");
  } else if (typeof datos.edad !== "number" || !Number.isInteger(datos.edad)) {
    errores.push("El campo 'edad' debe ser un número entero.");
  } else if (datos.edad < 0 || datos.edad > 150) {
    errores.push("El campo 'edad' debe estar entre 0 y 150.");
  }

  // --- Validación del campo "nacionalidad" ---
  // Debe ser un string no vacío (ej: "Chile", "Argentina", "USA")
  if (!datos.nacionalidad || typeof datos.nacionalidad !== "string") {
    errores.push(
      "El campo 'nacionalidad' es requerido y debe ser un texto (string)."
    );
  } else if (datos.nacionalidad.trim().length === 0) {
    errores.push("El campo 'nacionalidad' no puede estar vacío.");
  }

  // --- Validación del campo "peliculaId" ---
  // Debe ser un ObjectId válido de MongoDB (string de 24 caracteres hexadecimales)
  // Este campo referencia a un documento de la colección "peliculas"
  if (!datos.peliculaId) {
    errores.push(
      "El campo 'peliculaId' es requerido (debe ser el ID de una película existente)."
    );
  } else if (typeof datos.peliculaId === "string") {
    // Verificamos que el string sea un ObjectId válido de MongoDB
    // Un ObjectId válido tiene 24 caracteres hexadecimales
    if (!ObjectId.isValid(datos.peliculaId)) {
      errores.push(
        "El campo 'peliculaId' debe ser un ObjectId válido de MongoDB (24 caracteres hexadecimales)."
      );
    }
  } else if (!(datos.peliculaId instanceof ObjectId)) {
    errores.push(
      "El campo 'peliculaId' debe ser un string o un ObjectId válido."
    );
  }

  // --- Resultado de la validación ---
  if (errores.length > 0) {
    return { valido: false, errores };
  }

  // Todo correcto: retornamos los datos limpios
  // Convertimos peliculaId a ObjectId si viene como string
  return {
    valido: true,
    datos: {
      nombre: datos.nombre.trim(),
      apellido: datos.apellido.trim(),
      edad: datos.edad,
      nacionalidad: datos.nacionalidad.trim(),
      peliculaId:
        datos.peliculaId instanceof ObjectId
          ? datos.peliculaId
          : new ObjectId(datos.peliculaId),
    },
  };
}

// ============================================================
// crearDocumentoActor() - Crea un documento listo para MongoDB
// ============================================================
// Toma los datos ya validados y retorna un objeto con la
// estructura exacta que se insertará en la colección.
//
// Parámetros:
//   datos (Object) - datos validados del actor
//
// Retorna:
//   Object - documento listo para insertar en MongoDB
// ============================================================
function crearDocumentoActor(datos) {
  return {
    nombre: datos.nombre,
    apellido: datos.apellido,
    edad: datos.edad,
    nacionalidad: datos.nacionalidad,
    peliculaId: datos.peliculaId,
  };
}

// --- Exportamos las funciones y constantes ---
// COLLECTION_NAME → nombre de la colección para usar en controladores
// validarActor → función de validación de datos
// crearDocumentoActor → función para crear el documento limpio
export { COLLECTION_NAME, validarActor, crearDocumentoActor };
