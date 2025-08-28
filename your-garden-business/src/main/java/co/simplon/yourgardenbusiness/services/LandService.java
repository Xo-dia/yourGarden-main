package co.simplon.yourgardenbusiness.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import co.simplon.yourgardenbusiness.dtos.LandDto;
import co.simplon.yourgardenbusiness.entities.Lands;
import co.simplon.yourgardenbusiness.entities.Users;
import co.simplon.yourgardenbusiness.mapping.LandMapper;
import co.simplon.yourgardenbusiness.repositories.AccountRepository;
import co.simplon.yourgardenbusiness.repositories.LandRepository;
import jakarta.persistence.EntityNotFoundException;


@Service
public class LandService {

	private final LandRepository repository; 
	private final AccountRepository accountRepository;
	private final LandMapper landMapper;
	
	
	LandService(LandRepository repository, AccountRepository accountRepository, LandMapper landMapper){
		this.repository = repository;
		this.accountRepository = accountRepository;
		this.landMapper = landMapper;
	}

	public List<LandDto> getUserLands(long user_id) {
		List<Lands> land = this.repository.findByUserId(user_id);
		return land.stream()
				.map( x -> landMapper.toDto(x))
				.collect(Collectors.toList());
	}
	
	public LandDto getLandById(long land_id) {
		Lands land = this.repository.findById(land_id)
				.orElseThrow(() -> new EntityNotFoundException("Land not found"));
		
		return landMapper.toDto(land);
	}
	
	public LandDto post(LandDto  landDto) {
		Users user = accountRepository.findById(landDto.user_id())
				.orElseThrow(() -> new EntityNotFoundException("User not found"));
		
		Lands entity = landMapper.toEntity(landDto);
		entity.setUser(user);
		entity = this.repository.save(entity);
		
		return landMapper.toDto(entity);
	}
	
    public LandDto updateProduit(Long id, LandDto landDto) {
    	Lands existing = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Land not found with id " + id));
    	
        landMapper.updateEntityFromDto(landDto, existing);
        Lands saved = repository.save(existing);

        return landMapper.toDto(saved);
    }

    public void deleteProduit(Long id) {
        this.repository.deleteById(id);
    }
}
