import { SigninResponse } from "@/models/signin-response";

// src/services/authService.ts
export interface SigninPayload {
  name: string;
  first_name: string;
  email: string;
  password: string;
}

const API_URL = 'http://localhost:8080';

export const signin = async (payload: SigninPayload): Promise<SigninResponse> => {
  const response = await fetch(`${API_URL}/accounts`, {
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
