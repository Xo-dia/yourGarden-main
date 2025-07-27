// context/AuthContext.tsx

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SigninPayload } from "@/models/signin-payload";
import { SigninResponse } from "@/models/signin-response";
import { signin } from "@/services/authenticationService";

// Interface du token décodé
interface DecodedToken {
  exp: number;
}

interface AuthContextType {
  user: SigninResponse | null;
  login: (payload: SigninPayload) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SigninResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Initialisation : charge le user depuis localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    } else {
      logout(); // token invalide ou inexistant
    }
  }, []);

  // Sync automatique localStorage <-> state
  useEffect(() => {
    if (user && token) {
      localStorage.setItem("authUser", JSON.stringify(user));
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("authUser");
      localStorage.removeItem("token");
    }
  }, [user, token]);

  const login = async (payload: SigninPayload) => {
    try {
      const response = await signin(payload);
      setUser(response);
      setToken(response.token);
    } catch (error) {
      console.error("Erreur de connexion :", error);
      throw error; // à gérer côté UI (affichage erreur)
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authUser");
    localStorage.removeItem("token");
  };

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
