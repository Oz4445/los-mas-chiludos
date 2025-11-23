// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ============================
  // 🔁 Escuchar sesión
  // ============================
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const ref = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();

          if (data.active === false) {
            await signOut(auth);
            setUser(null);
            alert("Esta cuenta está suspendida.");
            setLoading(false);
            return;
          }

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: data.role,
            active: data.active,
          });
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  // ==========================================================
  // 🔐 LOGIN con 3 intentos + bloqueo 30 segundos
  // ==========================================================
  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();

    // 1️⃣ Buscar usuario en Firestore por email ANTES del login
    const q = query(
      collection(db, "users"),
      where("email", "==", cleanEmail)
    );
    const snap = await getDocs(q);

    if (snap.empty) {
      throw new Error("Correo o contraseña incorrecta.");
    }

    const userDoc = snap.docs[0];
    const uid = userDoc.id;
    const data = userDoc.data();
    const ref = doc(db, "users", uid);

    // 2️⃣ Revisar si está bloqueado
    const now = Date.now();
    if (data.lockUntil && data.lockUntil.toMillis() > now) {
      const diff = data.lockUntil.toMillis() - now;
      const secs = Math.ceil(diff / 1000);
      throw new Error(`Cuenta bloqueada. Intenta en ${secs} segundos.`);
    }

    // 3️⃣ Intentar login REAL
    try {
      const authUser = await signInWithEmailAndPassword(auth, cleanEmail, password);

      // Login exitoso → reiniciar intentos
      await updateDoc(ref, {
        loginAttempts: 0,
        lockUntil: null,
      });

      return {
        uid,
        email: authUser.user.email,
        role: data.role,
      };
    } catch (err) {
      // 4️⃣ Login fallido → sumar intento
      const newAttempts = (data.loginAttempts ?? 0) + 1;

      // Bloqueo después de 3 fallos → 30 segundos
      if (newAttempts >= 3) {
        const lockTime = new Date(Date.now() + 30 * 1000); // 30 sec
        await updateDoc(ref, {
          loginAttempts: newAttempts,
          lockUntil: lockTime,
        });
        throw new Error("Demasiados intentos. Cuenta bloqueada por 30 segundos.");
      }

      // Guardar intento fallido
      await updateDoc(ref, {
        loginAttempts: newAttempts,
      });

      throw new Error("Correo o contraseña incorrecta.");
    }
  };

  // 🔐 Logout
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // 🧾 Registrar usuario
  const registerUser = async (email, password, role = "cliente") => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", cred.user.uid), {
      email,
      role,
      active: true,
      createdAt: serverTimestamp(),
      loginAttempts: 0,
      lockUntil: null,
    });

    return cred.user;
  };

  // Otros helpers
  const toggleActive = async (uid) => {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    const current = snap.data().active ?? true;
    await updateDoc(ref, { active: !current });
  };

  const updateUser = async (uid, data) =>
    await updateDoc(doc(db, "users", uid), data);

  const removeUser = async (uid) =>
    await deleteDoc(doc(db, "users", uid));

  const resetPassword = async (email) =>
    await sendPasswordResetEmail(auth, email);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        registerUser,
        toggleActive,
        updateUser,
        removeUser,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
