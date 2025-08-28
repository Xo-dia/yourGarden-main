import { ReservationStatus } from "./GardenReservation";

export interface UpdateReservationStatusRequest {
  status: ReservationStatus;
}