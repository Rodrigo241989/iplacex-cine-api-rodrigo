import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("ERROR: La variable de entorno MONGODB_URI no está definida.");
  console.error("   Para desarrollo local:");
  console.error("      - Crea un archivo .env con: MONGODB_URI=tu_cadena_de_conexion");
  console.error("      - O ejecuta: export MONGODB_URI=\"tu_cadena_de_conexion\"");
  console.error("   Para Render:");
  console.error("      - Ve a tu servicio Environment Environment Variables");
  console.error("      - Agrega MONGODB_URI con tu cadena de conexión de Atlas");
  process.exit(1);
}

const DB_NAME = "cine-db";

const client = new MongoClient(MONGODB_URI);

let db;

async function connectDB() {
  try {

    await client.connect();

    db = client.db(DB_NAME);

    await db.command({ ping: 1 });

    console.log(`Conectado exitosamente a MongoDB Atlas`);
    console.log(`   Base de datos: ${DB_NAME}`);
  } catch (error) {
    console.error("Error al conectar con MongoDB Atlas:", error.message);
    console.error("   Verifica que:");
    console.error("      - La URI de conexión (MONGODB_URI) sea correcta");
    console.error("      - El usuario y contraseña sean válidos");
    console.error("      - Tu IP está en la lista de acceso de Atlas");
    console.error("      - El cluster está activo");

    throw error;
  }
}

function getDB() {
  if (!db) {
    throw new Error(
      "La base de datos no está conectada. Asegurate de llamar a connectDB() en server.js antes de usar getDB()."
    );
  }
  return db;
}

export { connectDB, getDB };