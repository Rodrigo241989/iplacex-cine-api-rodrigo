

import { ObjectId } from "mongodb";


const COLLECTION_NAME = "actores";


function validarActor(datos) {

  const errores = [];


  if (!datos.nombre || typeof datos.nombre !== "string") {
    errores.push("El campo 'nombre' es requerido y debe ser un texto (string).");
  } else if (datos.nombre.trim().length === 0) {
    errores.push("El campo 'nombre' no puede estar vacío.");
  }


  if (!datos.apellido || typeof datos.apellido !== "string") {
    errores.push("El campo 'apellido' es requerido y debe ser un texto (string).");
  } else if (datos.apellido.trim().length === 0) {
    errores.push("El campo 'apellido' no puede estar vacío.");
  }


  if (datos.edad === undefined || datos.edad === null) {
    errores.push("El campo 'edad' es requerido.");
  } else if (typeof datos.edad !== "number" || !Number.isInteger(datos.edad)) {
    errores.push("El campo 'edad' debe ser un número entero.");
  } else if (datos.edad < 0 || datos.edad > 150) {
    errores.push("El campo 'edad' debe estar entre 0 y 150.");
  }


  if (!datos.nacionalidad || typeof datos.nacionalidad !== "string") {
    errores.push(
      "El campo 'nacionalidad' es requerido y debe ser un texto (string)."
    );
  } else if (datos.nacionalidad.trim().length === 0) {
    errores.push("El campo 'nacionalidad' no puede estar vacío.");
  }

  if (!datos.peliculaId) {
    errores.push(
      "El campo 'peliculaId' es requerido (debe ser el ID de una película existente)."
    );
  } else if (typeof datos.peliculaId === "string") {

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


  if (errores.length > 0) {
    return { valido: false, errores };
  }


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

function crearDocumentoActor(datos) {
  return {
    nombre: datos.nombre,
    apellido: datos.apellido,
    edad: datos.edad,
    nacionalidad: datos.nacionalidad,
    peliculaId: datos.peliculaId,
  };
}


export { COLLECTION_NAME, validarActor, crearDocumentoActor };
