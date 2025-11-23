import admin from "firebase-admin";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const require = createRequire(import.meta.url);

const serviceAccount = require(
  path.join(__dirname, "./keys/los-mas-chiludos-firebase-adminsdk-fbsvc-82e3bb78ab.json")
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "los-mas-chiludos.appspot.com",
  });
}

export const db = admin.firestore();
export const bucket = admin.storage().bucket();

export async function deleteImageFromStorage(imageUrl) {
  try {
    if (!imageUrl) return;

    const bucketName = bucket.name;
    const base = `https://storage.googleapis.com/${bucketName}/`;

    if (!imageUrl.startsWith(base)) return;

    const filePath = decodeURIComponent(imageUrl.replace(base, ""));
    await bucket.file(filePath).delete();

    console.log("🔥 Imagen eliminada:", filePath);
  } catch (err) {
    console.error("⚠ Error al eliminar imagen:", err);
  }
}
