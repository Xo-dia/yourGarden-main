package co.simplon.yourgardenbusiness.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import co.simplon.yourgardenbusiness.dtos.ReservationStatus;
import co.simplon.yourgardenbusiness.entities.GardenReservation;

import java.util.List;

public interface GardenReservationRepository extends JpaRepository<GardenReservation, Long> {
    // Récupérer les réservations d’un jardinier (demandeur)
    List<GardenReservation> findByGardener_Id(Long gardenerId);

    // Récupérer les réservations d’un propriétaire
    List<GardenReservation> findByOwner_Id(Long ownerId);

    // Récupérer les réservations liées à un jardin
    List<GardenReservation> findByGarden_Id(Long gardenId);

    // Récupérer par statut
    List<GardenReservation> findByStatus(ReservationStatus status);

    // Vérifier s’il existe déjà une demande pending pour ce trio
    boolean existsByGardener_IdAndOwner_IdAndGarden_IdAndStatus(
            Long gardenerId,
            Long ownerId,
            Long gardenId,
            ReservationStatus status
    );
    
    List<GardenReservation> findByOwner_IdAndStatus(Long ownerId, ReservationStatus status);
}
