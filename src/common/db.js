// ============================================================
// db.js - Módulo de conexión a MongoDB Atlas
// ============================================================
// Este archivo maneja la conexión a la base de datos MongoDB
// usando el driver oficial de MongoDB para Node.js (NO Mongoose).
//
// El driver nativo nos da control total sobre las operaciones
// de base de datos sin capas de abstracción adicionales.
//
// 🔐 SEGURIDAD: La URI de conexión se lee desde la variable
//    de entorno MONGODB_URI para no exponer credenciales en
//    el código fuente. Esto es obligatorio para despliegues
//    en servicios como Render, Heroku, Railway, etc.
// ============================================================

// ============================================================
// 📋 INSTRUCCIONES PARA CREAR EL CLÚSTER EN MONGODB ATLAS
// ============================================================
// Si aún no tienes tu clúster configurado, sigue estos pasos:
//
// 1. Ve a https://cloud.mongodb.com/ e inicia sesión (o crea cuenta gratuita)
//
// 2. CREAR CLÚSTER:
//    - Haz clic en "Build a Database" o "Create"
//    - Selecciona el plan FREE (M0 Sandbox) - es gratuito
//    - Nombre del clúster: eva-u3-express
//    - Región: elige la más cercana a tu ubicación
//    - Haz clic en "Create Deployment"
//
// 3. CREAR USUARIO DE BASE DE DATOS:
//    - En la sección "Database Access" (menú izquierdo)
//    - Haz clic en "Add New Database User"
//    - Método de autenticación: Password
//    - Usuario: cine_user
//    - Contraseña: genera una segura o usa una propia (¡recuérdala!)
//    - Rol: "Read and write to any database"
//    - Haz clic en "Add User"
//
// 4. CONFIGURAR ACCESO DE RED:
//    - En "Network Access" (menú izquierdo)
//    - Haz clic en "Add IP Address"
//    - Selecciona "Allow Access from Anywhere" (0.0.0.0/0)
//      (para desarrollo; en producción restringe IPs)
//    - Haz clic en "Confirm"
//
// 5. OBTENER LA CADENA DE CONEXIÓN:
//    - Ve a "Database" → haz clic en "Connect" en tu clúster
//    - Selecciona "Drivers"
//    - Driver: Node.js, Versión: 6.0 or later
//    - Copia la cadena de conexión (connection string)
//    - Reemplaza <password> con la contraseña del usuario cine_user
//
// 6. CONFIGURAR LA VARIABLE DE ENTORNO:
//    - En LOCAL: Crea un archivo .env con MONGODB_URI=tu_cadena_de_conexión
//    - En RENDER: Configura la variable en Environment → Environment Variables
//
// 7. La base de datos "cine_db" se creará automáticamente
//    cuando insertes el primer documento.
// ============================================================

import { MongoClient } from "mongodb";

// --- URI de conexión a MongoDB Atlas ---
// Se lee desde la variable de entorno MONGODB_URI.
// Esto permite que el mismo código funcione en cualquier entorno
// (local, Render, etc.) sin modificar el código fuente.
//
// Para desarrollo local, puedes:
//   - Crear un archivo .env con: MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/cine_db
//   - O exportar la variable en la terminal: export MONGODB_URI="tu_uri"
//
// Para producción (Render):
//   - Configurar la variable en el panel de Render → Environment Variables
const MONGODB_URI = process.env.MONGODB_URI;

// Validación: si no se encuentra la variable de entorno, mostramos error claro
if (!MONGODB_URI) {
  console.error("❌ ERROR: La variable de entorno MONGODB_URI no está definida.");
  console.error("   💡 Para desarrollo local:");
  console.error("      - Crea un archivo .env con: MONGODB_URI=tu_cadena_de_conexion");
  console.error("      - O ejecuta: export MONGODB_URI=\"tu_cadena_de_conexion\"");
  console.error("   💡 Para Render:");
  console.error("      - Ve a tu servicio → Environment → Environment Variables");
  console.error("      - Agrega MONGODB_URI con tu cadena de conexión de Atlas");
  process.exit(1);
}

// --- Nombre de la base de datos ---
// Esta será la base de datos donde se almacenarán las colecciones:
//  - peliculas: almacena los documentos de películas
//  - actores: almacena los documentos de actores (con referencia a películas)
const DB_NAME = "cine_db";

// --- Cliente de MongoDB ---
// MongoClient es la clase principal del driver de MongoDB para Node.js.
// Creamos UNA sola instancia que se reutilizará en toda la aplicación
// (patrón Singleton). Esto es eficiente porque el driver maneja
// internamente un pool de conexiones.
const client = new MongoClient(MONGODB_URI);

// --- Variable para almacenar la referencia a la base de datos ---
// Esta variable se llena cuando se ejecuta connectDB() y luego
// es accesible desde cualquier parte de la app mediante getDB().
let db;

// ============================================================
// connectDB() - Establece la conexión con MongoDB Atlas
// ============================================================
// Esta función se llama UNA SOLA VEZ al iniciar el servidor
// (desde server.js). Si falla, el servidor no debería arrancar.
//
// Retorna: Promise<void>
// Lanza: Error si no puede conectarse
// ============================================================
async function connectDB() {
  try {
    // Intentamos conectar al clúster de MongoDB Atlas
    // client.connect() establece la conexión TCP con el servidor
    await client.connect();

    // Seleccionamos la base de datos específica dentro del clúster
    // Si "cine_db" no existe, MongoDB la creará al insertar el primer documento
    db = client.db(DB_NAME);

    // Verificamos que la conexión funciona haciendo un "ping" al servidor
    await db.command({ ping: 1 });

    console.log(`✅ Conectado exitosamente a MongoDB Atlas`);
    console.log(`   📦 Base de datos: ${DB_NAME}`);
  } catch (error) {
    // Si la conexión falla, mostramos el error detallado
    console.error("❌ Error al conectar con MongoDB Atlas:", error.message);
    console.error("   💡 Verifica que:");
    console.error("      - La URI de conexión (MONGODB_URI) sea correcta");
    console.error("      - El usuario y contraseña sean válidos");
    console.error("      - Tu IP esté en la lista de acceso de Atlas");
    console.error("      - El clúster esté activo");

    // Re-lanzamos el error para que server.js pueda manejarlo
    // y decida no iniciar el servidor si no hay conexión a la BD
    throw error;
  }
}

// ============================================================
// getDB() - Retorna la instancia de la base de datos
// ============================================================
// Los controladores (pelicula.controller.js, actor.controller.js)
// usan esta función para acceder a la base de datos y realizar
// operaciones CRUD sobre las colecciones.
//
// Uso típico en un controlador:
//   import { getDB } from "../common/db.js";
//   const db = getDB();
//   const peliculas = await db.collection("peliculas").find().toArray();
//
// Retorna: Db (instancia de la base de datos MongoDB)
// Lanza: Error si la base de datos no está conectada
// ============================================================
function getDB() {
  if (!db) {
    throw new Error(
      "⚠️ La base de datos no está conectada. Asegúrate de llamar a connectDB() en server.js antes de usar getDB()."
    );
  }
  return db;
}

// --- Exportamos las funciones ---
// connectDB → se usa en server.js para inicializar la conexión al arrancar
// getDB     → se usa en los controladores para acceder a las colecciones
export { connectDB, getDB };