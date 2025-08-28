export interface GardenReservation {
    id: number
    gardenerId: number,   // le demandeur (jardinier)
    gardenerName: string, // nom du jardinier
    ownerId: number,      // propriétaire du terrain
    gardenId: number,     // jardin réservé
    gardenName: string,   // nom du jardin
    requestDate: Date,
    status: ReservationStatus
}

export enum ReservationStatus {
    PENDING = "pending",
    ACCEPTED = "accepted",
    REJECTED = "rejected"
}