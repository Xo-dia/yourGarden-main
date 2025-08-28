package co.simplon.yourgardenbusiness.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateGardenReservationRequest(
        @NotNull Long gardenerId,   // le jardinier qui fait la demande
        @NotNull Long ownerId,      // propriétaire du terrain
        @NotNull Long gardenId     // jardin concerné
) {}