import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://eva3_express:ubXMgx6hCoXdvoFb@cluster-express.egphtbu.mongodb.net/cine_db?appName=cluster-express";

// Si no hay variable de entorno, usamos la URI directamente (fallback para Render)
console.log("?? Conectando a MongoDB Atlas...");

const DB_NAME = "cine_db";

const client = new MongoClient(MONGODB_URI);

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db(DB_NAME);
    await db.command({ ping: 1 });

    console.log(`? Conectado exitosamente a MongoDB Atlas`);
    console.log(`   ??? Base de datos: ${DB_NAME}`);
  } catch (error) {
    console.error("? Error al conectar con MongoDB Atlas:", error.message);
    throw error;
  }
}

function getDB() {
  if (!db) {
    throw new Error("?? La base de datos no est¨¢ conectada.");
  }
  return db;
}

export { connectDB, getDB };