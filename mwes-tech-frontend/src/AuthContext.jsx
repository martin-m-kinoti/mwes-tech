import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("mwes_user") || "null");
  } catch {
    return null;
  }
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  const login = useCallback((token, userData) => {
    localStorage.setItem("mwes_token", token);
    localStorage.setItem("mwes_user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("mwes_token");
    localStorage.removeItem("mwes_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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