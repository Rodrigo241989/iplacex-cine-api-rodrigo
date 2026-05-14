// ============================================================
// pelicula.model.js - Modelo de datos para Películas
// ============================================================
// Este archivo define la estructura y validación de los
// documentos de la colección "peliculas" en MongoDB.
//
// ⚠️ NO usamos Mongoose. Las validaciones se hacen manualmente
// usando funciones helper, ya que trabajamos con el driver
// nativo de MongoDB directamente.
//
// Esquema de una película en la base de datos:
// {
//   _id: ObjectId (generado automáticamente por MongoDB),
//   titulo: string (requerido) - nombre de la película,
//   director: string (requerido) - director de la película,
//   anio: number (requerido) - año de estreno,
//   genero: string (requerido) - género cinematográfico,
//   duracion: number (requerido) - duración en minutos
// }
// ============================================================

// --- Nombre de la colección en MongoDB ---
// Usamos esta constante para evitar errores de tipeo al
// referirnos a la colección en los controladores.
const COLLECTION_NAME = "peliculas";

// ============================================================
// validarPelicula() - Valida los datos de una película
// ============================================================
// Recibe un objeto con los datos de la película y verifica
// que todos los campos requeridos estén presentes y tengan
// el tipo de dato correcto.
//
// Parámetros:
//   datos (Object) - objeto con los campos de la película
//
// Retorna:
//   { valido: true, datos: {...} }  si todo está correcto
//   { valido: false, errores: [...] }  si hay errores
// ============================================================
function validarPelicula(datos) {
  // Array donde acumularemos los mensajes de error encontrados
  const errores = [];

  // --- Validación del campo "titulo" ---
  // Debe ser un string no vacío
  if (!datos.titulo || typeof datos.titulo !== "string") {
    errores.push("El campo 'titulo' es requerido y debe ser un texto (string).");
  } else if (datos.titulo.trim().length === 0) {
    errores.push("El campo 'titulo' no puede estar vacío.");
  }

  // --- Validación del campo "director" ---
  // Debe ser un string no vacío
  if (!datos.director || typeof datos.director !== "string") {
    errores.push("El campo 'director' es requerido y debe ser un texto (string).");
  } else if (datos.director.trim().length === 0) {
    errores.push("El campo 'director' no puede estar vacío.");
  }

  // --- Validación del campo "anio" ---
  // Debe ser un número entero positivo (año válido de cine: desde 1888 aprox.)
  if (datos.anio === undefined || datos.anio === null) {
    errores.push("El campo 'anio' es requerido.");
  } else if (typeof datos.anio !== "number" || !Number.isInteger(datos.anio)) {
    errores.push("El campo 'anio' debe ser un número entero.");
  } else if (datos.anio < 1888 || datos.anio > new Date().getFullYear() + 5) {
    errores.push(
      `El campo 'anio' debe estar entre 1888 y ${new Date().getFullYear() + 5}.`
    );
  }

  // --- Validación del campo "genero" ---
  // Debe ser un string no vacío (ej: "Acción", "Drama", "Comedia")
  if (!datos.genero || typeof datos.genero !== "string") {
    errores.push("El campo 'genero' es requerido y debe ser un texto (string).");
  } else if (datos.genero.trim().length === 0) {
    errores.push("El campo 'genero' no puede estar vacío.");
  }

  // --- Validación del campo "duracion" ---
  // Debe ser un número positivo (minutos)
  if (datos.duracion === undefined || datos.duracion === null) {
    errores.push("El campo 'duracion' es requerido.");
  } else if (typeof datos.duracion !== "number") {
    errores.push("El campo 'duracion' debe ser un número (minutos).");
  } else if (datos.duracion <= 0) {
    errores.push("El campo 'duracion' debe ser mayor a 0 minutos.");
  }

  // --- Resultado de la validación ---
  if (errores.length > 0) {
    // Hay errores: retornamos la lista de problemas encontrados
    return { valido: false, errores };
  }

  // Todo correcto: retornamos los datos limpios (con trim en strings)
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

// ============================================================
// crearDocumentoPelicula() - Crea un documento listo para MongoDB
// ============================================================
// Toma los datos ya validados y retorna un objeto con la
// estructura exacta que se insertará en la colección.
// Esto nos asegura que solo se guarden los campos definidos
// en el esquema (sin campos extras no deseados).
//
// Parámetros:
//   datos (Object) - datos validados de la película
//
// Retorna:
//   Object - documento listo para insertar en MongoDB
// ============================================================
function crearDocumentoPelicula(datos) {
  return {
    titulo: datos.titulo,
    director: datos.director,
    anio: datos.anio,
    genero: datos.genero,
    duracion: datos.duracion,
  };
}

// --- Exportamos las funciones y constantes ---
// COLLECTION_NAME → nombre de la colección para usar en controladores
// validarPelicula → función de validación de datos
// crearDocumentoPelicula → función para crear el documento limpio
export { COLLECTION_NAME, validarPelicula, crearDocumentoPelicula };
