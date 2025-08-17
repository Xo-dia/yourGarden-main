import { apiFetch } from "@/services/fetchClient";
import type { Land } from "@/models/land";

// Si ton backend attend une forme plus simple pour la création,
// crée un DTO dédié. Adapte les clés aux attentes de l’API.
// export interface CreateLandDto {
//   cadastral_reference: string;
//   land_name: string;
//   land_adresse: string;
//   nb_gardens: number;
//   image_url?: string | null;
//   description: string;
//   postalCode?: string;
//   city?: string;
//   imageId?: number;
//   plotSize?: string;
//   price?: string;
//   // NE PAS envoyer id / user_id si le serveur les gère
// }

export async function addLand(dto: Land): Promise<Land> {
  // POST /lands doit renvoyer l’objet créé (id, …).
  // Si ton backend renvoie 201 sans body, il faudra l’ajuster.
  return apiFetch<Land>("/lands", {
    method: "POST",
    json: dto,
  });
}

export async function getLand(id: number): Promise<Land> {
  return apiFetch<Land>(`/lands/${id}`, { method: "GET" });
}

export async function getUserLands(): Promise<Land[]> {
  return apiFetch<Land[]>(`/lands`, {
    method: "GET",
  });
}

export async function deleteLand(id: number): Promise<void> {
  return apiFetch(`/lands/${id}`, { method: "DELETE" });
}

 export async function updateLand(id: number, dto: Partial<Land>): Promise<Land> {
   return apiFetch<Land>(`/lands/${id}`, {
     method: "PUT",
     json: dto,
   });
 }