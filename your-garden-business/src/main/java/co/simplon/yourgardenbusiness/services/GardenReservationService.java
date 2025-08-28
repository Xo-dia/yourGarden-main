package co.simplon.yourgardenbusiness.services;


import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import co.simplon.yourgardenbusiness.dtos.CreateGardenReservationRequest;
import co.simplon.yourgardenbusiness.dtos.GardenReservationDto;
import co.simplon.yourgardenbusiness.dtos.ReservationStatus;
import co.simplon.yourgardenbusiness.entities.GardenReservation;
import co.simplon.yourgardenbusiness.entities.Gardens;
import co.simplon.yourgardenbusiness.entities.Lands;
import co.simplon.yourgardenbusiness.entities.Users;
import co.simplon.yourgardenbusiness.mapping.GardenReservationMapper;
import co.simplon.yourgardenbusiness.repositories.AccountRepository;
import co.simplon.yourgardenbusiness.repositories.GardenRepository;
import co.simplon.yourgardenbusiness.repositories.GardenReservationRepository;

import java.time.OffsetDateTime;
import java.util.List;


@Service
@Transactional
public class GardenReservationService {

    private final GardenReservationRepository reservationRepo;
    private final AccountRepository userRepo;
    private final GardenRepository gardensRepo;
    private final GardenReservationMapper mapper;

    public GardenReservationService(GardenReservationRepository reservationRepo,
    									AccountRepository userRepo,
    									GardenRepository gardensRepo,
                                        GardenReservationMapper mapper) {
        this.reservationRepo = reservationRepo;
        this.userRepo = userRepo;
        this.gardensRepo = gardensRepo;
        this.mapper = mapper;
    }

    public GardenReservationDto create(CreateGardenReservationRequest req) {
        // 1) Charger les entités liées
        Users gardener = userRepo.findById(req.gardenerId())
                .orElseThrow(() -> new EntityNotFoundException("Gardener not found: " + req.gardenerId()));

        Users owner = userRepo.findById(req.ownerId())
                .orElseThrow(() -> new EntityNotFoundException("Owner not found: " + req.ownerId()));

        Gardens garden = gardensRepo.findById(req.gardenId())
                .orElseThrow(() -> new EntityNotFoundException("Garden not found: " + req.gardenId()));

        // 2) Éviter les doublons en 'pending' pour le même trio (gardener/owner/garden)
        boolean duplicatePending = reservationRepo
                .existsByGardener_IdAndOwner_IdAndGarden_IdAndStatus(
                        gardener.getId(), owner.getId(), garden.getId(), ReservationStatus.pending);
        if (duplicatePending) {
            throw new IllegalStateException("A pending reservation already exists for this gardener/owner/garden.");
        }

        // 3) Construire et persister
        GardenReservation r = new GardenReservation();
        r.setGardener(gardener);
        r.setOwner(owner);
        r.setGarden(garden);
        r.setRequestDate(OffsetDateTime.now());
        r.setStatus(ReservationStatus.pending);

        return mapper.toDto(reservationRepo.save(r));
    }

    public List<GardenReservationDto> findAll() {
        return reservationRepo.findAll().stream()
                .map(x -> mapper.toDto(x))
                .toList();
    }

    public GardenReservationDto findById(Long id) {
        GardenReservation r = reservationRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Reservation not found: " + id));
        return mapper.toDto(r);
    }
 
    public List<GardenReservationDto> findByGardener(Long gardenerId) {
        return reservationRepo.findByGardener_Id(gardenerId).stream()
        		.map(x -> mapper.toDto(x))
                .toList();
    }

    public List<GardenReservationDto> findByOwner(Long ownerId) {
        return reservationRepo.findByOwner_IdAndStatus(ownerId, ReservationStatus.pending)
        					  .stream()
        					  .map(x -> mapper.toDto(x))
        					  .toList();
    }
 
    public List<GardenReservationDto> findByGarden(Long gardenId) {
        return reservationRepo.findByGarden_Id(gardenId).stream()
        		.map(x -> mapper.toDto(x))
        		.toList();
    }

    public GardenReservationDto updateStatus(Long id, ReservationStatus status) {
        GardenReservation r = reservationRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Reservation not found: " + id));
        r.setStatus(status);
        // (Optionnel) Règles métier : notifier owner/gardener, libérer/occuper une parcelle, etc.
        return mapper.toDto(r);
    }

    public void delete(Long id) {
        if (!reservationRepo.existsById(id)) {
            throw new EntityNotFoundException("Reservation not found: " + id);
        }
        reservationRepo.deleteById(id);
    }
}
