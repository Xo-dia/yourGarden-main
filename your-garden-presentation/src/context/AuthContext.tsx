// context/AuthContext.tsx

import { SigninPayload } from "@/models/signin-payload";
import { SigninResponse } from "@/models/signin-response";
import { signin } from "@/services/authenticationService";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
// import { signin, SigninPayload, SigninResponse } from "../services/authService";

interface AuthContextType {
  user: SigninResponse | null;
  login: (payload: SigninPayload) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SigninResponse | null>(() => {
    const stored = localStorage.getItem("authUser");
       console.log("hello" + stored);
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
  const stored = localStorage.getItem("authUser");
  if (stored) {
    const parsed = JSON.parse(stored);
    console.log("authUser rechargé :", parsed);
    setUser(parsed); // ✅ recharge le user dans le state
  }
}, []);

  const login = async (payload: SigninPayload) => {
    console.log("start login");
    const response = await signin(payload);
    console.log(response);
    setUser(response);
    localStorage.setItem("authUser", JSON.stringify(response));
    localStorage.setItem("token", response.token); // optionnel, si tu veux séparer
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
    localStorage.removeItem("token");
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
