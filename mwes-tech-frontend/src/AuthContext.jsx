import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { identify, setRole, track } from "./analytics";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        identify(null);
        setUser(null);
        setLoading(false);
        return;
      }

      identify(fbUser.uid);

      let role = "client";
      try {
        const tokenResult = await fbUser.getIdTokenResult();
        if (tokenResult.claims.role === "admin") role = "admin";
      } catch {
        role = "client";
      }

      setRole(role);

      if (!sessionStorage.getItem("login_tracked")) {
        track("login", { method: fbUser.providerData[0]?.providerId || "unknown" });
        sessionStorage.setItem("login_tracked", "1");
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
    track("logout");
    sessionStorage.removeItem("login_tracked");
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
