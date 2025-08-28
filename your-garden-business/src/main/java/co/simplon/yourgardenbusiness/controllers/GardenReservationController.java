package co.simplon.yourgardenbusiness.controllers;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import co.simplon.yourgardenbusiness.dtos.CreateGardenReservationRequest;
import co.simplon.yourgardenbusiness.dtos.GardenReservationDto;
import co.simplon.yourgardenbusiness.dtos.LandDto;
import co.simplon.yourgardenbusiness.dtos.UpdateReservationStatusRequest;
import co.simplon.yourgardenbusiness.services.GardenReservationService;

import java.net.URI;
import java.time.OffsetDateTime;
import java.util.List;

@RestController
@RequestMapping("/garden-reservations")
public class GardenReservationController {

    private final GardenReservationService service;

    public GardenReservationController(GardenReservationService service) {
        this.service = service;
    }

    // 1) Créer une réservation
    @PostMapping
    public ResponseEntity<GardenReservationDto> create(@Valid @RequestBody CreateGardenReservationRequest req) {
        GardenReservationDto created = service.create(req);
        return ResponseEntity
                .created(URI.create("/api/garden-reservations/" + created.id()))
                .body(created);
    }
    
 // 3) Récupérer une réservation par ID
    @GetMapping("/{id}")
    public ResponseEntity<GardenReservationDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    // 4) Réservations d’un utilisateur (jardinier)
    @GetMapping("")
    public ResponseEntity<List<GardenReservationDto>> findByOwner(@AuthenticationPrincipal(expression = "claims['sub']") String userId) {
		var id = Long.valueOf(userId);
		
    	return ResponseEntity.ok(service.findByOwner(id));
    }
    
    // 6) Mettre à jour le statut d’une réservation (accepted/rejected/pending)
    @PutMapping("/{id}/status")
    public ResponseEntity<GardenReservationDto> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateReservationStatusRequest req) {
        return ResponseEntity.ok(service.updateStatus(id, req.status()));
    }
}
