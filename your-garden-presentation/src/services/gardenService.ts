import { apiFetch } from "@/services/fetchClient";
import type { Garden } from "@/models/garden";

export interface CreateGardenDto {
  garden_name: string;
  surface: number;
  price: number;
  description: string;
  imageURL?: string;
  land_id: string | number;
}

export async function createGarden(dto: CreateGardenDto): Promise<Garden> {
  return apiFetch<Garden>("/gardens", {
    method: "POST",
    json: dto,
  });
}

export async function getGardensByLand(landId: string | number): Promise<Garden[]> {
  return apiFetch<Garden[]>(`/lands/${landId}/gardens`, { method: "GET" });
}


