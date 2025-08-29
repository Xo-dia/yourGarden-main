package co.simplon.yourgardenbusiness.services;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.coyote.BadRequestException;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import co.simplon.yourgardenbusiness.dtos.GardenDto;
import co.simplon.yourgardenbusiness.entities.Gardens;
import co.simplon.yourgardenbusiness.entities.Lands;
import co.simplon.yourgardenbusiness.entities.Users;
import co.simplon.yourgardenbusiness.mapping.GardenMapper;
import co.simplon.yourgardenbusiness.repositories.AccountRepository;
import co.simplon.yourgardenbusiness.repositories.GardenRepository;
import co.simplon.yourgardenbusiness.repositories.LandRepository;
import jakarta.persistence.EntityNotFoundException;

@Service
@Transactional
public class GardenService {

	private final GardenRepository repository; 
	private final LandRepository landRepository;
	private final AccountRepository accountRepository;
	private final GardenMapper gardenMapper;
	
	
	GardenService(GardenRepository repository, LandRepository landRepository, AccountRepository accountRepository, GardenMapper gardenMapper){
		this.repository = repository;
		this.landRepository = landRepository;
		this.accountRepository = accountRepository;
		this.gardenMapper = gardenMapper;
	}

	public List<GardenDto> get(long id) {
		List<Gardens> garden = this.repository.findByLandId(id);
		return garden.stream()
				.map( x -> gardenMapper.toDto(x))
				.collect(Collectors.toList());
	}
	
	public GardenDto post(GardenDto  gardenDto) {
		Lands land = landRepository.findById(gardenDto.land_id())
				.orElseThrow(() -> new EntityNotFoundException("Land not found"));
		
		Gardens entity = gardenMapper.toEntity(gardenDto);
		entity.setLand(land);
		entity = this.repository.save(entity);
		
		return gardenMapper.toDto(entity);
	}
	
    public Gardens updateProduit(Long id, Gardens garden) {
        // land.setId(id);
        return this.repository.save(garden);
    }

    public void deleteProduit(Long id) {
        this.repository.deleteById(id);
    }
    
    @Transactional
	public List<GardenDto> bulkUpdate(Long userId, List<GardenDto> dtos) {
    	Users user = accountRepository.findById(userId)
				.orElseThrow(() -> new EntityNotFoundException("User not found"));
    	// Récupère tous les ids à mettre à jour
        List<Long> ids = dtos.stream().map(GardenDto::id).toList();

        // Charge les entités existantes
        List<Gardens> entities = repository.findAllById(ids);
        
        
        // Vérifie que tous les ids existent
        if (entities.size() != ids.size()) {
        	throw new EntityNotFoundException("Un ou plusieurs gardens n'existent pas");
        }
        
        Long landId = dtos.getFirst().land_id();

        // Vérifie l’appartenance au terrain
        for (Gardens e : entities) {
            if (e.getLand().getId() != landId) {
            	throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
            		    "Garden " + e.getId() + " n'appartient pas à land " + landId);
            }
        }

        // Mappe les champs à mettre à jour
        Map<Long, GardenDto> byId = dtos.stream().collect(Collectors.toMap(GardenDto::id, d -> d));
        for (Gardens e : entities) {
            GardenDto d = byId.get(e.getId());
            e.setGarden_name(d.garden_name());
            e.setSurface(d.surface());
            e.setPrice(d.price());
            e.setDescription(d.description());
            // land_id forçable : on pourrait ignorer d.land_id() et imposer landId
        }

        // Sauvegarde en batch
        List<Gardens> saved = repository.saveAll(entities);

        // Retourne les DTO
        return saved.stream().map(x -> gardenMapper.toDto(x)).toList();
	}
	
}
