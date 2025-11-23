// server/firebaseAdmin.js
import admin from "firebase-admin";
import fs from "fs";
import path from "path";

let serviceAccount;

if (process.env.FIREBASE_ADMIN_CREDENTIALS) {
  // 🌐 Producción (Railway)
  console.log("🔥 Usando credenciales desde FIREBASE_ADMIN_CREDENTIALS");
  serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS);
} else {
  // 💻 Local
  const localPath = path.resolve("keys/firebase-adminsdk.json");
  console.log("🔥 Usando credenciales locales desde", localPath);
  const raw = fs.readFileSync(localPath, "utf8");
  serviceAccount = JSON.parse(raw);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();
export default admin;
