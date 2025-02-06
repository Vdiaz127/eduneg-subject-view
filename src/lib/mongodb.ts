import mongoose from 'mongoose';

const MONGO_URL = process.env.NEXT_PUBLIC_MONGO_URL as string;

if (!MONGO_URL) {
  throw new Error("La variable de entorno NEXT_PUBLIC_MONGO_URL no está definida.");
}

export async function connectDB(): Promise<void> {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(MONGO_URL, {
      dbName: 'uneg-feature', // Reemplazar con el nombre real de la base de datos
    });
    console.log("Conectado a MongoDB");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    process.exit(1);
  }
}
