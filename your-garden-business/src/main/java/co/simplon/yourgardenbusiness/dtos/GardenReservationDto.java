package co.simplon.yourgardenbusiness.dtos;


import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;

import java.time.OffsetDateTime;

public record GardenReservationDto(
        Long id,
        Long gardenerId,   // le demandeur (jardinier)
        String gardenerName,
        Long ownerId,      // propriétaire du terrain
        Long gardenId,     // jardin réservé
        String gardenName,
        OffsetDateTime requestDate,
        ReservationStatus status
) {}