import { SigninPayload } from "@/models/signin-payload";
import { SigninResponse } from "@/models/signin-response";
import { User } from "@/models/user";

// src/services/authService.ts


const API_URL = 'http://localhost:8080';

export const signin = async (payload: SigninPayload): Promise<SigninResponse> => {
  const response = await fetch(`${API_URL}/accounts/authenticate`, {
    method: 'POST',
    credentials: "include",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message = errorData?.message || 'Erreur lors de la connexion.';
    throw new Error(message);
  }

  return response.json();
};
