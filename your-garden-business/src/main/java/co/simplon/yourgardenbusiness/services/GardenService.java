package co.simplon.yourgardenbusiness.services;

import java.util.List;
import java.util.stream.Collectors;

import co.simplon.yourgardenbusiness.dtos.GardenDto;
import co.simplon.yourgardenbusiness.entities.Gardens;
import co.simplon.yourgardenbusiness.entities.Lands;
import co.simplon.yourgardenbusiness.mapping.GardenMapper;
import co.simplon.yourgardenbusiness.repositories.GardenRepository;
import co.simplon.yourgardenbusiness.repositories.LandRepository;
import jakarta.persistence.EntityNotFoundException;

public class GardenService {

	private final GardenRepository repository; 
	private final LandRepository landRepository;
	private final GardenMapper gardenMapper;
	
	
	GardenService(GardenRepository repository, LandRepository landRepository, GardenMapper gardenMapper){
		this.repository = repository;
		this.landRepository = landRepository;
		this.gardenMapper = gardenMapper;
	}

	public List<GardenDto> get() {
		List<Gardens> garden = this.repository.findAll();
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
	
}
