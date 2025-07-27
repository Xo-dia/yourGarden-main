import { Land } from "@/models/land";

const API_URL = 'http://localhost:8080';


export const addLand = async (payload: Land, token: string): Promise<Land> => {
    console.log(" hello land" + payload);
          console.log("Payload to add land:", token);

  const response = await fetch(`${API_URL}/lands`, {
    method: 'POST',
    credentials: "include",
    headers: {
      'Content-Type': 'application/json',
       "Authorization": `Bearer ${token}`, // ici on met le token
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message = errorData?.message || 'Erreur lors de la connexion.';
    throw new Error(message);
  }

  // Récupération du JSON (avec token et 'roles')
  const data = (await response.json()) as Land;

  return data;
};
