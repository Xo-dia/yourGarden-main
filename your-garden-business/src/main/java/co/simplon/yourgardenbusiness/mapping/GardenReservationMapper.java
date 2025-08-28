package co.simplon.yourgardenbusiness.mapping;

import org.springframework.stereotype.Component;

import co.simplon.yourgardenbusiness.dtos.GardenReservationDto;
import co.simplon.yourgardenbusiness.dtos.ReservationStatus;
import co.simplon.yourgardenbusiness.dtos.CreateGardenReservationRequest;
import co.simplon.yourgardenbusiness.entities.GardenReservation;
import co.simplon.yourgardenbusiness.entities.Gardens;
import co.simplon.yourgardenbusiness.entities.Lands;
import co.simplon.yourgardenbusiness.entities.Users;

import java.time.OffsetDateTime;

@Component
public class GardenReservationMapper {

    /**
     * toEntity pour un CREATE (POST):
     * - On ne résout pas ici les relations (gardener/owner/garden) à partir des IDs.
     * - Le service charge les entités User/Lands et appelle ensuite cette surcharge qui prend les entités.
     */
    public GardenReservation toEntity(CreateGardenReservationRequest dto) {
        if (dto == null) return null;

        GardenReservation r = new GardenReservation();
        // Les relations sont injectées dans la surcharge suivante (avec entities)
        r.setRequestDate(OffsetDateTime.now());
        r.setStatus(ReservationStatus.pending);
        return r;
    }

    /**
     * Surcharge de toEntity pour CREATE avec entités déjà résolues.
     * Le service appelle cette méthode après avoir fetch gardener/owner/garden par leurs IDs.
     */
    public GardenReservation toEntity(CreateGardenReservationRequest dto,
    								Users gardener, Users owner, Gardens garden) {
        if (dto == null) return null;

        GardenReservation r = new GardenReservation();
        r.setGardener(gardener);
        r.setOwner(owner);
        r.setGarden(garden);
        r.setRequestDate(OffsetDateTime.now());
        r.setStatus(ReservationStatus.pending);
        return r;
    }

    /**
     * toDto : entity -> DTO pour réponse API
     */
    public GardenReservationDto toDto(GardenReservation entity) {
        if (entity == null) return null;

        Long gardenerId = entity.getGardener() != null ? entity.getGardener().getId() : null;
        String gardenerLastName = entity.getGardener() != null ? entity.getGardener().getLast_name() : null;
        String gardenerFirstName = entity.getGardener() != null ? entity.getGardener().getFirst_name() : null;

        Long ownerId = entity.getOwner() != null ? entity.getOwner().getId() : null;

        Long gardenId = entity.getGarden() != null ? entity.getGarden().getId() : null;
        String gardenName = entity.getGarden() != null ? entity.getGarden().getGarden_name() : null;

        return new GardenReservationDto(
                entity.getId(),
                gardenerId,
                gardenerFirstName + " " + gardenerFirstName,
                ownerId,
                gardenId,
                gardenName,
                entity.getRequestDate(),
                entity.getStatus()
        );
    }

    /**
     * updateEntityFromDto : pour un PUT/PATCH métier
     * - Ici on ne touche qu’aux champs modifiables via DTO (message et/ou status selon tes règles).
     * - Les relations (gardener/owner/garden) ne sont pas modifiées par défaut.
     */
    public void updateEntityFromDto(GardenReservationDto dto, GardenReservation entity) {
        if (dto == null || entity == null) return;

        // Si tu autorises le changement de statut via ce DTO (sinon fais-le via un DTO dédié):
        ReservationStatus newStatus = dto.status();
        if (newStatus != null) {
            entity.setStatus(newStatus);
        }

        // ⚠️ Par cohérence avec ton LandMapper, on ne modifie pas gardener/owner/garden ici.
        // Si besoin, fais-le dans le service après avoir contrôlé les règles métier.
    }

    /**
     * (Optionnel) Méthode utilitaire si tu as un endpoint dédié au changement de statut.
     */
    public void applyStatus(GardenReservation entity, ReservationStatus status) {
        if (entity == null || status == null) return;
        entity.setStatus(status);
    }
}
