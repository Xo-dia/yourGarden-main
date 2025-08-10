import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function RedirectIfAuthed({
  children,
  to = "/post-login", // où envoyer un user déjà connecté
}: {
  children: ReactNode;
  to?: string;
}) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // ou un spinner

  if (user) {
    const fallback = (location.state as any)?.from?.pathname ?? to;
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
}
