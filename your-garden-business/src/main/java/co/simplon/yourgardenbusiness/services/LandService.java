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

	public List<LandDto> get(long user_id) {
		List<Lands> land = this.repository.findByUserId(user_id);
		return land.stream()
				.map( x -> landMapper.toDto(x))
				.collect(Collectors.toList());
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
        // land.setId(id);
    	Lands land = landMapper.toEntity(landDto);
        land = this.repository.save(land);
        return landMapper.toDto(land);
    }

    public void deleteProduit(Long id) {
        this.repository.deleteById(id);
    }
}
