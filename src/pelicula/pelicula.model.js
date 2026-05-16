
const COLLECTION_NAME = "peliculas";


function validarPelicula(datos) {
  const errores = [];

  if (!datos.titulo || typeof datos.titulo !== "string") {
    errores.push("El campo 'titulo' es requerido y debe ser un texto (string).");
  } else if (datos.titulo.trim().length === 0) {
    errores.push("El campo 'titulo' no puede estar vacío.");
  }

  if (!datos.director || typeof datos.director !== "string") {
    errores.push("El campo 'director' es requerido y debe ser un texto (string).");
  } else if (datos.director.trim().length === 0) {
    errores.push("El campo 'director' no puede estar vacío.");
  }

  if (datos.anio === undefined || datos.anio === null) {
    errores.push("El campo 'anio' es requerido.");
  } else if (typeof datos.anio !== "number" || !Number.isInteger(datos.anio)) {
    errores.push("El campo 'anio' debe ser un número entero.");
  } else if (datos.anio < 1888 || datos.anio > new Date().getFullYear() + 5) {
    errores.push(
      `El campo 'anio' debe estar entre 1888 y ${new Date().getFullYear() + 5}.`
    );
  }

  if (!datos.genero || typeof datos.genero !== "string") {
    errores.push("El campo 'genero' es requerido y debe ser un texto (string).");
  } else if (datos.genero.trim().length === 0) {
    errores.push("El campo 'genero' no puede estar vacío.");
  }

  if (datos.duracion === undefined || datos.duracion === null) {
    errores.push("El campo 'duracion' es requerido.");
  } else if (typeof datos.duracion !== "number") {
    errores.push("El campo 'duracion' debe ser un número (minutos).");
  } else if (datos.duracion <= 0) {
    errores.push("El campo 'duracion' debe ser mayor a 0 minutos.");
  }


  if (errores.length > 0) {

    return { valido: false, errores };
  }


  return {
    valido: true,
    datos: {
      titulo: datos.titulo.trim(),
      director: datos.director.trim(),
      anio: datos.anio,
      genero: datos.genero.trim(),
      duracion: datos.duracion,
    },
  };
}

function crearDocumentoPelicula(datos) {
  return {
    titulo: datos.titulo,
    director: datos.director,
    anio: datos.anio,
    genero: datos.genero,
    duracion: datos.duracion,
  };
}

export { COLLECTION_NAME, validarPelicula, crearDocumentoPelicula };
