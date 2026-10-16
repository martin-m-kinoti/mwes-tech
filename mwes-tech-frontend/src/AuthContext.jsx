import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      let role = "client";
      try {
        const tokenResult = await fbUser.getIdTokenResult();
        if (tokenResult.claims.role === "admin") role = "admin";
      } catch {
        role = "client";
      }

      const [firstName, ...rest] = (fbUser.displayName || "").split(" ").filter(Boolean);

      setUser({
        uid: fbUser.uid,
        userid: fbUser.uid,
        email: fbUser.email || "",
        firstName: firstName || "",
        lastName: rest.join(" "),
        role,
        photoURL: fbUser.photoURL || "",
      });
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return ctx;
}

export { AuthProvider, useAuth };
