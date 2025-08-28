export interface CreateGardenReservation {
    gardenerId: number;   // le jardinier qui fait la demande
    ownerId: number;      // propriétaire du terrain
    gardenId: number;     // jardin concerné
}