package co.simplon.yourgardenbusiness.services;

import java.util.List;

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

	public List<Lands> get() {
		List<Lands> land = this.repository.findAll();
		
		return land;
	}
	
	public LandDto post(LandDto  landDto) {
		Users user = accountRepository.findById(landDto.user_id())
				.orElseThrow(() -> new EntityNotFoundException("User not found"));
		
		Lands entity = landMapper.toEntity(landDto);
		entity.setUser(user);
		entity = this.repository.save(entity);
		
		return landMapper.toDto(entity);
	}
	
    public Lands updateProduit(Long id, Lands land) {
        // land.setId(id);
        return this.repository.save(land);
    }

    public void deleteProduit(Long id) {
        this.repository.deleteById(id);
    }
}
