// ============================================================
// db.js - M贸dulo de conexi贸n a MongoDB Atlas
// ============================================================
// Este archivo maneja la conexi贸n a la base de datos MongoDB
// usando el driver oficial de MongoDB para Node.js (NO Mongoose).
//
// El driver nativo nos da control total sobre las operaciones
// de base de datos sin capas de abstracci贸n adicionales.
//
// 馃攼 SEGURIDAD: La URI de conexi贸n se lee desde la variable
//    de entorno MONGODB_URI para no exponer credenciales en
//    el c贸digo fuente. Esto es obligatorio para despliegues
//    en servicios como Render, Heroku, Railway, etc.
// ============================================================

// ============================================================
// 馃搵 INSTRUCCIONES PARA CREAR EL CL脷STER EN MONGODB ATLAS
// ============================================================
// Si a煤n no tienes tu cl煤ster configurado, sigue estos pasos:
//
// 1. Ve a https://cloud.mongodb.com/ e inicia sesi贸n (o crea cuenta gratuita)
//
// 2. CREAR CL脷STER:
//    - Haz clic en "Build a Database" o "Create"
//    - Selecciona el plan FREE (M0 Sandbox) - es gratuito
//    - Nombre del cl煤ster: eva-u3-express
//    - Regi贸n: elige la m谩s cercana a tu ubicaci贸n
//    - Haz clic en "Create Deployment"
//
// 3. CREAR USUARIO DE BASE DE DATOS:
//    - En la secci贸n "Database Access" (men煤 izquierdo)
//    - Haz clic en "Add New Database User"
//    - M茅todo de autenticaci贸n: Password
//    - Usuario: cine_user
//    - Contrase帽a: genera una segura o usa una propia (隆recu茅rdala!)
//    - Rol: "Read and write to any database"
//    - Haz clic en "Add User"
//
// 4. CONFIGURAR ACCESO DE RED:
//    - En "Network Access" (men煤 izquierdo)
//    - Haz clic en "Add IP Address"
//    - Selecciona "Allow Access from Anywhere" (0.0.0.0/0)
//      (para desarrollo; en producci贸n restringe IPs)
//    - Haz clic en "Confirm"
//
// 5. OBTENER LA CADENA DE CONEXI脫N:
//    - Ve a "Database" 鈫?haz clic en "Connect" en tu cl煤ster
//    - Selecciona "Drivers"
//    - Driver: Node.js, Versi贸n: 6.0 or later
//    - Copia la cadena de conexi贸n (connection string)
//    - Reemplaza <password> con la contrase帽a del usuario cine_user
//
// 6. CONFIGURAR LA VARIABLE DE ENTORNO:
//    - En LOCAL: Crea un archivo .env con MONGODB_URI=tu_cadena_de_conexi贸n
//    - En RENDER: Configura la variable en Environment 鈫?Environment Variables
//
// 7. La base de datos "cine_db" se crear谩 autom谩ticamente
//    cuando insertes el primer documento.
// ============================================================

import { MongoClient } from "mongodb";

// --- URI de conexi贸n a MongoDB Atlas ---
// Se lee desde la variable de entorno MONGODB_URI.
// Esto permite que el mismo c贸digo funcione en cualquier entorno
// (local, Render, etc.) sin modificar el c贸digo fuente.
//
// Para desarrollo local, puedes:
//   - Crear un archivo .env con: MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/cine_db
//   - O exportar la variable en la terminal: export MONGODB_URI="tu_uri"
//
// Para producci贸n (Render):
//   - Configurar la variable en el panel de Render 鈫?Environment Variables
const MONGODB_URI = process.env.MONGODB_URI;

// Validaci贸n: si no se encuentra la variable de entorno, mostramos error claro
if (!MONGODB_URI) {
  console.error("鉂?ERROR: La variable de entorno MONGODB_URI no est谩 definida.");
  console.error("   馃挕 Para desarrollo local:");
  console.error("      - Crea un archivo .env con: MONGODB_URI=tu_cadena_de_conexion");
  console.error("      - O ejecuta: export MONGODB_URI=\"tu_cadena_de_conexion\"");
  console.error("   馃挕 Para Render:");
  console.error("      - Ve a tu servicio 鈫?Environment 鈫?Environment Variables");
  console.error("      - Agrega MONGODB_URI con tu cadena de conexi贸n de Atlas");
  process.exit(1);
}

// --- Nombre de la base de datos ---
// Esta ser谩 la base de datos donde se almacenar谩n las colecciones:
//  - peliculas: almacena los documentos de pel铆culas
//  - actores: almacena los documentos de actores (con referencia a pel铆culas)
const DB_NAME = "cine-db";

// --- Cliente de MongoDB ---
// MongoClient es la clase principal del driver de MongoDB para Node.js.
// Creamos UNA sola instancia que se reutilizar谩 en toda la aplicaci贸n
// (patr贸n Singleton). Esto es eficiente porque el driver maneja
// internamente un pool de conexiones.
const client = new MongoClient(MONGODB_URI);

// --- Variable para almacenar la referencia a la base de datos ---
// Esta variable se llena cuando se ejecuta connectDB() y luego
// es accesible desde cualquier parte de la app mediante getDB().
let db;

// ============================================================
// connectDB() - Establece la conexi贸n con MongoDB Atlas
// ============================================================
// Esta funci贸n se llama UNA SOLA VEZ al iniciar el servidor
// (desde server.js). Si falla, el servidor no deber铆a arrancar.
//
// Retorna: Promise<void>
// Lanza: Error si no puede conectarse
// ============================================================
async function connectDB() {
  try {
    // Intentamos conectar al cl煤ster de MongoDB Atlas
    // client.connect() establece la conexi贸n TCP con el servidor
    await client.connect();

    // Seleccionamos la base de datos espec铆fica dentro del cl煤ster
    // Si "cine_db" no existe, MongoDB la crear谩 al insertar el primer documento
    db = client.db(DB_NAME);

    // Verificamos que la conexi贸n funciona haciendo un "ping" al servidor
    await db.command({ ping: 1 });

    console.log(`鉁?Conectado exitosamente a MongoDB Atlas`);
    console.log(`   馃摝 Base de datos: ${DB_NAME}`);
  } catch (error) {
    // Si la conexi贸n falla, mostramos el error detallado
    console.error("鉂?Error al conectar con MongoDB Atlas:", error.message);
    console.error("   馃挕 Verifica que:");
    console.error("      - La URI de conexi贸n (MONGODB_URI) sea correcta");
    console.error("      - El usuario y contrase帽a sean v谩lidos");
    console.error("      - Tu IP est茅 en la lista de acceso de Atlas");
    console.error("      - El cl煤ster est茅 activo");

    // Re-lanzamos el error para que server.js pueda manejarlo
    // y decida no iniciar el servidor si no hay conexi贸n a la BD
    throw error;
  }
}

// ============================================================
// getDB() - Retorna la instancia de la base de datos
// ============================================================
// Los controladores (pelicula.controller.js, actor.controller.js)
// usan esta funci贸n para acceder a la base de datos y realizar
// operaciones CRUD sobre las colecciones.
//
// Uso t铆pico en un controlador:
//   import { getDB } from "../common/db.js";
//   const db = getDB();
//   const peliculas = await db.collection("peliculas").find().toArray();
//
// Retorna: Db (instancia de la base de datos MongoDB)
// Lanza: Error si la base de datos no est谩 conectada
// ============================================================
function getDB() {
  if (!db) {
    throw new Error(
      "鈿狅笍 La base de datos no est谩 conectada. Aseg煤rate de llamar a connectDB() en server.js antes de usar getDB()."
    );
  }
  return db;
}

// --- Exportamos las funciones ---
// connectDB 鈫?se usa en server.js para inicializar la conexi贸n al arrancar
// getDB     鈫?se usa en los controladores para acceder a las colecciones
export { connectDB, getDB };