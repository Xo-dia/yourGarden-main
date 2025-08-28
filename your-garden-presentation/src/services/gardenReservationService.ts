import { apiFetch } from "./fetchClient";
import { CreateGardenReservation } from "../models/CreateGardenReservation";
import { GardenReservation } from "../models/GardenReservation";
import { UpdateReservationStatusRequest } from "../models/UpdateReservationStatusRequest";

// export async function addGardenReservation(dto: CreateGardenReservation): Promise<CreateGardenReservation> {
//   // POST /lands doit renvoyer l’objet créé (id, …).
//   // Si ton backend renvoie 201 sans body, il faudra l’ajuster.
//   return apiFetch<GardenReservation>("/lands", {
//     method: "POST",
//     json: dto,
//   });
// }

export async function getGardenReservation(): Promise<GardenReservation[]> {
  return apiFetch<GardenReservation[]>(`/garden-reservations`, { method: "GET" });
}

export async function updateGardenReservation(id: number, dto: UpdateReservationStatusRequest): Promise<GardenReservation> {
  return apiFetch<GardenReservation>(`/garden-reservations/${id}/status`, {
    method: "PUT",
    json: dto,
  });
}