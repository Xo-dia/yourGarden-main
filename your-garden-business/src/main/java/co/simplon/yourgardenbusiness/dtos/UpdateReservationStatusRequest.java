package co.simplon.yourgardenbusiness.dtos;

import jakarta.validation.constraints.NotNull;

public record UpdateReservationStatusRequest(
        @NotNull ReservationStatus status
) {}